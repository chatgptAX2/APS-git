package com.company.module.kleanaps.service;

import com.company.core.common.exception.BusinessException;
import com.company.core.common.exception.EntityNotFoundException;
import com.company.core.common.exception.ErrorCode;
import com.company.module.kleanaps.dto.ProductionOrderResponse;
import com.company.module.kleanaps.entity.ApsCombinationSimulation;
import com.company.module.kleanaps.entity.ApsProductionOrder;
import com.company.module.kleanaps.repository.ApsCombinationSimulationRepository;
import com.company.module.kleanaps.repository.ApsProductionOrderRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * SAP 생산오더 전달 서비스
 * <p>
 * 확정된 시뮬레이션을 기반으로 SAP RFC/REST API를 통해 생산오더를 생성한다.
 * SAP 연동 방식은 환경변수 설정으로 제어.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ApsProductionOrderService {

    private final ApsCombinationSimulationRepository simulationRepository;
    private final ApsProductionOrderRepository       productionOrderRepository;
    private final ObjectMapper                       objectMapper;

    @Value("${klean.aps.sap.api-url:}")
    private String sapApiUrl;

    @Value("${klean.aps.sap.api-key:}")
    private String sapApiKey;

    @Value("${klean.aps.sap.mock-mode:true}")
    private boolean mockMode;

    /**
     * 생산오더 조회 (시뮬레이션별)
     */
    @Transactional(readOnly = true)
    public List<ProductionOrderResponse> getBySimulation(Long simulationId) {
        return productionOrderRepository.findBySimulationIdOrderByCreatedAtDesc(simulationId)
                .stream().map(ProductionOrderResponse::from).collect(Collectors.toList());
    }

    /**
     * [오더생성 버튼] 확정된 시뮬레이션을 SAP 생산오더로 전달
     */
    @Transactional
    public ProductionOrderResponse sendToSap(Long simulationId, String userId) {
        ApsCombinationSimulation sim = simulationRepository.findByIdWithLines(simulationId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.ENTITY_NOT_FOUND));

        // 확정 상태 검증
        if (!sim.isConfirmed()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT_VALUE,
                    "확정(CONFIRMED) 상태의 시뮬레이션만 SAP 생산오더를 생성할 수 있습니다.");
        }

        // 이미 전송 성공한 경우 방지
        if (productionOrderRepository.existsBySimulation_SimulationIdAndSendStatus(simulationId, "SUCCESS")) {
            throw new BusinessException(ErrorCode.INVALID_INPUT_VALUE,
                    "이미 SAP에 생산오더가 전송된 시뮬레이션입니다.");
        }

        // 생산오더 엔티티 생성
        ApsProductionOrder prodOrder = ApsProductionOrder.builder()
                .simulation(sim)
                .machine(sim.getMachine())
                .machineNo(sim.getMachine().getMachineNo())
                .basisWeight(sim.getBasisWeight())
                .totalWidth(sim.getTotalWidth())
                .plyCount(sim.getPlyCount())
                .plannedQtyTon(sim.getTotalWeightTon())
                .sentBy(userId)
                .build();
        productionOrderRepository.save(prodOrder);

        // SAP 전송
        try {
            Map<String, Object> requestPayload = buildSapRequest(sim);
            String requestJson = objectMapper.writeValueAsString(requestPayload);

            String sapOrderNo;
            String responseJson;

            if (mockMode) {
                // Mock 모드: 실제 SAP 호출 없이 더미 응답
                sapOrderNo   = "MOCK-" + sim.getSimulationNo();
                responseJson = objectMapper.writeValueAsString(
                        Map.of("sapProdOrder", sapOrderNo, "status", "SUCCESS", "message", "Mock 전송 완료"));
                log.info("[Klean-APS][MOCK] SAP 생산오더 전송: {}", sapOrderNo);
            } else {
                // 실제 SAP API 호출
                Map<String, Object> sapResponse = callSapApi(requestPayload);
                sapOrderNo   = (String) sapResponse.getOrDefault("sapProdOrder", "");
                responseJson = objectMapper.writeValueAsString(sapResponse);
                log.info("[Klean-APS] SAP 생산오더 전송 성공: {}", sapOrderNo);
            }

            prodOrder.markSuccess(sapOrderNo, requestJson, responseJson);

        } catch (Exception e) {
            log.error("[Klean-APS] SAP 생산오더 전송 실패: {}", e.getMessage(), e);
            try {
                String requestJson = objectMapper.writeValueAsString(buildSapRequest(sim));
                prodOrder.markFailed(requestJson, e.getMessage());
            } catch (Exception ex) {
                prodOrder.markFailed("직렬화 실패", e.getMessage());
            }
            throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR,
                    "SAP 생산오더 전송에 실패했습니다: " + e.getMessage());
        }

        return ProductionOrderResponse.from(prodOrder);
    }

    // ============================================================
    // 내부 유틸
    // ============================================================

    private Map<String, Object> buildSapRequest(ApsCombinationSimulation sim) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("simulationNo",   sim.getSimulationNo());
        payload.put("machineNo",       sim.getMachine().getMachineNo());
        payload.put("basisWeight",     sim.getBasisWeight());
        payload.put("totalWidth",      sim.getTotalWidth());
        payload.put("plyCount",        sim.getPlyCount());
        payload.put("jumboRollCount",  sim.getJumboRollCount());
        payload.put("plannedQtyTon",   sim.getTotalWeightTon());

        List<Map<String, Object>> lineItems = sim.getLines().stream()
                .filter(l -> !"LOSS".equals(l.getLineType()))
                .map(l -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("lineSeq",    l.getLineSeq());
                    item.put("sapOrderNo", l.getSapOrderNo());
                    item.put("paperWidth", l.getPaperWidth());
                    item.put("assignedQty", l.getAssignedQty());
                    return item;
                })
                .collect(Collectors.toList());
        payload.put("lines", lineItems);
        return payload;
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> callSapApi(Map<String, Object> payload) {
        return WebClient.builder()
                .baseUrl(sapApiUrl)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + sapApiKey)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build()
                .post()
                .bodyValue(payload)
                .retrieve()
                .bodyToMono(Map.class)
                .timeout(Duration.ofSeconds(30))
                .block();
    }
}
