package com.company.module.kleanaps.service;

import com.company.core.common.exception.BusinessException;
import com.company.core.common.exception.EntityNotFoundException;
import com.company.core.common.exception.ErrorCode;
import com.company.module.kleanaps.dto.SimulationCreateRequest;
import com.company.module.kleanaps.dto.SimulationResponse;
import com.company.module.kleanaps.entity.*;
import com.company.module.kleanaps.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 지폭조합 시뮬레이션 핵심 서비스
 * <p>
 * 핵심 비즈니스 로직:
 * 1. 오더 집계 및 필터링
 * 2. 지폭조합 알고리즘 (기계별 규정 적용)
 * 3. Loss 계산
 * 4. 상태 관리 (생성/확정/확정취소)
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ApsSimulationService {

    private final ApsCombinationSimulationRepository simulationRepository;
    private final ApsCombinationLineRepository       lineRepository;
    private final ApsSalesOrderRepository            salesOrderRepository;
    private final ApsMachineRepository               machineRepository;
    private final ApsConstraintService               constraintService;

    // ============================================================
    // 조회
    // ============================================================

    @Transactional(readOnly = true)
    public Page<SimulationResponse> getList(String status, BigDecimal basisWeight,
                                            String machineNo, int page, int size) {
        Page<ApsCombinationSimulation> entityPage = simulationRepository.searchSimulations(
                status, basisWeight, machineNo,
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "CREATED_AT")));
        return entityPage.map(SimulationResponse::from);
    }

    @Transactional(readOnly = true)
    public SimulationResponse getById(Long simulationId) {
        ApsCombinationSimulation sim = simulationRepository.findByIdWithLines(simulationId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.ENTITY_NOT_FOUND));
        return SimulationResponse.from(sim);
    }

    // ============================================================
    // [생성 버튼] 시뮬레이션 생성
    // ============================================================

    @Transactional
    public SimulationResponse createSimulation(SimulationCreateRequest req, String userId) {
        // 1. 기계 정보 조회 (예외조건 포함)
        ApsMachine machine = machineRepository.findByMachineNoWithExceptions(req.getMachineNo())
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_INPUT_VALUE,
                        "호기를 찾을 수 없습니다: " + req.getMachineNo()));

        // 2. 유효 최대지폭 계산 (평량 예외 반영)
        int effectiveMaxWidth = machine.getEffectiveMaxWidth(req.getBasisWeight());
        int minWidth          = machine.getMinWidth();

        // 3. 생산 가능 최소 밀롤 지폭 검증
        int minProdWidth = constraintService.getMinProductionWidth();

        // 4. 대상 오더 수집
        List<ApsSalesOrder> targetOrders = collectTargetOrders(req);

        if (targetOrders.isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT_VALUE,
                    "조합 가능한 오더가 없습니다. 평량과 납기일을 확인해주세요.");
        }

        // 5. 오더 비중 검사 (원지 60% 이상)
        validateRollRatio(targetOrders, req.getPaperType());

        // 6. 지폭 조합 알고리즘 실행
        CombinationResult result = computeCombination(
                targetOrders, machine, effectiveMaxWidth, minWidth,
                req.getPaperType(), req.getJumboRollCount());

        // 7. 시뮬레이션 번호 채번
        String simulationNo = generateSimulationNo();

        // 8. 시뮬레이션 헤더 저장
        ApsCombinationSimulation simulation = ApsCombinationSimulation.builder()
                .simulationNo(simulationNo)
                .machine(machine)
                .basisWeight(req.getBasisWeight())
                .paperType(req.getPaperType())
                .totalWidth(result.totalWidth)
                .plyCount(result.lines.size())
                .jumboRollCount(req.getJumboRollCount())
                .totalWeightTon(result.totalWeightTon)
                .lossMm(result.lossMm)
                .lossPercent(result.lossPercent)
                .createdBy(userId)
                .remark(req.getRemark())
                .build();
        simulationRepository.save(simulation);

        // 9. 시뮬레이션 라인 저장
        int seq = 1;
        for (CombinationLineData ld : result.lines) {
            ApsCombinationLine line = ApsCombinationLine.builder()
                    .simulation(simulation)
                    .lineSeq(seq++)
                    .salesOrder(ld.order)
                    .sapOrderNo(ld.order != null ? ld.order.getSapOrderNo() : null)
                    .materialCode(ld.order != null ? ld.order.getMaterialCode() : null)
                    .paperWidth(ld.paperWidth)
                    .assignedQty(ld.assignedQty)
                    .isDoublePly(ld.isDoublePly)
                    .isMinOrderQty(ld.isMinOrderQty)
                    .lineType(ld.lineType)
                    .remark(ld.remark)
                    .build();
            lineRepository.save(line);
        }

        // 10. 다시 조회하여 반환 (라인 포함)
        return SimulationResponse.from(simulationRepository.findByIdWithLines(simulation.getSimulationId())
                .orElseThrow());
    }

    // ============================================================
    // [확정 버튼]
    // ============================================================

    @Transactional
    public SimulationResponse confirmSimulation(Long simulationId, String userId) {
        ApsCombinationSimulation sim = simulationRepository.findByIdWithLines(simulationId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.ENTITY_NOT_FOUND));
        sim.confirm(userId);
        log.info("[Klean-APS] 시뮬레이션 확정: {} by {}", sim.getSimulationNo(), userId);
        return SimulationResponse.from(sim);
    }

    // ============================================================
    // [확정취소 버튼]
    // ============================================================

    @Transactional
    public SimulationResponse cancelConfirmSimulation(Long simulationId) {
        ApsCombinationSimulation sim = simulationRepository.findByIdWithLines(simulationId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.ENTITY_NOT_FOUND));
        sim.cancelConfirm();
        log.info("[Klean-APS] 시뮬레이션 확정취소: {}", sim.getSimulationNo());
        return SimulationResponse.from(sim);
    }

    // ============================================================
    // 지폭조합 알고리즘
    // ============================================================

    /**
     * 지폭조합 핵심 알고리즘
     * <p>
     * 원칙:
     * 1. 최대지폭 내에서 폭 합산이 최대에 가깝도록 조합
     * 2. 최대 4폭
     * 3. 2호기 4폭 시 1폭은 반드시 630mm 이상
     * 4. 배폭 시 미미 30mm 포함
     * 5. 545mm 이하 단폭 생산 불가 → 배폭 필수
     * 6. Loss = 최대지폭 - 합산지폭
     */
    private CombinationResult computeCombination(List<ApsSalesOrder> orders,
                                                  ApsMachine machine,
                                                  int effectiveMaxWidth, int minWidth,
                                                  String paperType, int jumboRollCount) {
        List<CombinationLineData> lines = new ArrayList<>();
        int mimiWidth = machine.getMimiWidth();
        boolean is2hogi = "2".equals(machine.getMachineNo());

        // 오더를 지폭 내림차순으로 정렬하여 큰 폭부터 배치
        List<ApsSalesOrder> sortedOrders = orders.stream()
                .sorted((a, b) -> Integer.compare(b.getPaperWidth(), a.getPaperWidth()))
                .collect(Collectors.toList());

        int assignedWidth = 0;
        int plyCount      = 0;
        BigDecimal totalWeight = BigDecimal.ZERO;
        BigDecimal moq = constraintService.getMoqTon();

        for (ApsSalesOrder order : sortedOrders) {
            if (plyCount >= machine.getMaxPlyCount()) break;

            int width = order.getPaperWidth();

            // 545mm 이하는 배폭 필수 (단폭 불가)
            boolean needDoublePly = width <= 545;
            int widthToAdd = needDoublePly ? (width * 2 + mimiWidth) : width;

            // 배폭 포함 최대지폭 초과 시 건너뜀
            if (assignedWidth + widthToAdd > effectiveMaxWidth) continue;

            // 2호기 4폭 조건: 1폭은 반드시 630mm 이상 (plyCount==3 && width<630 → 불가)
            if (is2hogi && plyCount == 3 && width < 630) {
                log.debug("[2호기 4폭 조건] 4번째 폭 {}mm < 630mm → 건너뜀", width);
                continue;
            }

            // 889mm 초과 시 2폭 생산 불가 조건
            if (width > 889 && plyCount >= 2) continue;

            BigDecimal qty = order.getOrderQtyTon() != null ? order.getOrderQtyTon() : order.getOrderQty();
            boolean isMinOQ = qty != null && qty.compareTo(moq) < 0;

            lines.add(new CombinationLineData(order, width, qty, needDoublePly, isMinOQ, "ORDER", null));
            assignedWidth += widthToAdd;
            plyCount++;
            if (qty != null) totalWeight = totalWeight.add(qty);
        }

        // Loss 계산
        int lossMm = effectiveMaxWidth - assignedWidth;
        BigDecimal lossPercent = assignedWidth > 0
            ? BigDecimal.valueOf(lossMm)
                        .divide(BigDecimal.valueOf(effectiveMaxWidth), 4, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(100))
                        .setScale(2, RoundingMode.HALF_UP)
            : BigDecimal.ZERO;

        // Loss 라인 추가 (0 초과인 경우)
        if (lossMm > 0) {
            lines.add(new CombinationLineData(null, lossMm, BigDecimal.ZERO, false, false, "LOSS",
                    String.format("Loss %dmm (%.2f%%)", lossMm, lossPercent)));
        }

        BigDecimal totalWeightTon = totalWeight.multiply(BigDecimal.valueOf(jumboRollCount));

        return new CombinationResult(assignedWidth + lossMm, lines,
                totalWeightTon, lossMm, lossPercent);
    }

    /**
     * 대상 오더 수집 로직
     */
    private List<ApsSalesOrder> collectTargetOrders(SimulationCreateRequest req) {
        if (req.getOrderIds() != null && !req.getOrderIds().isEmpty()) {
            // 명시적으로 선택한 오더
            return salesOrderRepository.findAllById(req.getOrderIds()).stream()
                    .filter(o -> !o.getIsExcluded() && "OPEN".equals(o.getStatus()))
                    .collect(Collectors.toList());
        }
        // 자동 수집: 평량 기준 OPEN 오더
        return salesOrderRepository.findOpenOrdersByBasisWeight(req.getBasisWeight());
    }

    /**
     * 원지(Roll) 비중 검사
     * 원지 60% 이상이어야 지폭조합 가능
     */
    private void validateRollRatio(List<ApsSalesOrder> orders, String paperType) {
        if (!"ROLL".equals(paperType)) return;
        long rollCount  = orders.stream().filter(o -> o.getMaterial() != null && o.getMaterial().isRoll()).count();
        long totalCount = orders.size();
        if (totalCount > 0) {
            double rollRatio = (double) rollCount / totalCount * 100;
            BigDecimal minRatio = constraintService.getRollMinRatio();
            if (rollRatio < minRatio.doubleValue()) {
                log.warn("[Klean-APS] 원지 비중 {}% < {}% → 외주공정 검토 필요", rollRatio, minRatio);
                // 경고만 출력 (비즈니스 판단에 따라 Exception으로 변경 가능)
            }
        }
    }

    /**
     * 시뮬레이션 번호 채번: SIM-YYYYMMDD-NNN
     */
    private String generateSimulationNo() {
        String today = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String maxNo = simulationRepository.findMaxSimulationNo();
        int seq = 1;
        if (maxNo != null && maxNo.startsWith("SIM-" + today)) {
            try {
                seq = Integer.parseInt(maxNo.substring(maxNo.lastIndexOf('-') + 1)) + 1;
            } catch (NumberFormatException ignored) {}
        }
        return String.format("SIM-%s-%03d", today, seq);
    }

    // ============================================================
    // 내부 데이터 클래스
    // ============================================================

    private record CombinationResult(
            int totalWidth,
            List<CombinationLineData> lines,
            BigDecimal totalWeightTon,
            int lossMm,
            BigDecimal lossPercent
    ) {}

    private static class CombinationLineData {
        final ApsSalesOrder order;
        final int           paperWidth;
        final BigDecimal    assignedQty;
        final boolean       isDoublePly;
        final boolean       isMinOrderQty;
        final String        lineType;
        final String        remark;

        CombinationLineData(ApsSalesOrder order, int paperWidth, BigDecimal assignedQty,
                            boolean isDoublePly, boolean isMinOrderQty,
                            String lineType, String remark) {
            this.order        = order;
            this.paperWidth   = paperWidth;
            this.assignedQty  = assignedQty;
            this.isDoublePly  = isDoublePly;
            this.isMinOrderQty = isMinOrderQty;
            this.lineType     = lineType;
            this.remark       = remark;
        }
    }
}
