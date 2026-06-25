package com.company.module.kleanaps.service;

import com.company.core.common.exception.EntityNotFoundException;
import com.company.core.common.exception.ErrorCode;
import com.company.module.kleanaps.dto.SalesOrderExcludeRequest;
import com.company.module.kleanaps.dto.SalesOrderResponse;
import com.company.module.kleanaps.dto.SalesOrderSyncRequest;
import com.company.module.kleanaps.entity.ApsMaterial;
import com.company.module.kleanaps.entity.ApsSalesOrder;
import com.company.module.kleanaps.repository.ApsMaterialRepository;
import com.company.module.kleanaps.repository.ApsSalesOrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ApsSalesOrderService {

    private final ApsSalesOrderRepository  salesOrderRepository;
    private final ApsMaterialRepository    materialRepository;

    /**
     * 판매오더 목록 조회 (검색 + 페이징)
     */
    @Transactional(readOnly = true)
    public Page<SalesOrderResponse> getList(String q, String status, int page, int size) {
        Page<ApsSalesOrder> entityPage = salesOrderRepository.searchOrders(
                q, status, PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "orderDate")));
        return entityPage.map(SalesOrderResponse::from);
    }

    /**
     * 판매오더 단건 조회
     */
    @Transactional(readOnly = true)
    public SalesOrderResponse getById(Long orderId) {
        ApsSalesOrder o = salesOrderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.ENTITY_NOT_FOUND));
        return SalesOrderResponse.from(o);
    }

    /**
     * 평량별 오더 집계 (지폭조합 시작 전 현황 파악)
     */
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getOrderSummaryByBasisWeight() {
        return salesOrderRepository.aggregateOpenOrdersByBasisWeight().stream()
                .map(row -> Map.of(
                        "basisWeight", row[0],
                        "orderCount",  row[1],
                        "totalTon",    row[2]
                ))
                .collect(Collectors.toList());
    }

    /**
     * SAP 판매오더 동기화 (Upsert)
     */
    @Transactional
    public int syncOrders(SalesOrderSyncRequest request) {
        int upsertCount = 0;
        for (SalesOrderSyncRequest.SalesOrderSyncItem item : request.getOrders()) {
            Optional<ApsSalesOrder> existing = salesOrderRepository.findBySapOrderNo(item.getSapOrderNo());

            if (existing.isPresent()) {
                // 기존 오더 업데이트
                ApsSalesOrder order = existing.get();
                order.update(item.getDueDate(), item.getOrderQty(),
                             resolveQtyTon(item), item.getRemark());
                order.markSynced();
            } else {
                // 자재 연결 시도
                ApsMaterial material = materialRepository
                        .findByMaterialCode(item.getMaterialCode()).orElse(null);

                ApsSalesOrder newOrder = ApsSalesOrder.builder()
                        .sapOrderNo(item.getSapOrderNo())
                        .orderType(item.getOrderType())
                        .customerCode(item.getCustomerCode())
                        .customerName(item.getCustomerName())
                        .orderDate(item.getOrderDate())
                        .dueDate(item.getDueDate())
                        .materialCode(item.getMaterialCode())
                        .material(material)
                        .basisWeight(item.getBasisWeight())
                        .paperWidth(item.getPaperWidth())
                        .paperLength(item.getPaperLength())
                        .orderQty(item.getOrderQty())
                        .orderUnit(item.getOrderUnit())
                        .orderQtyTon(resolveQtyTon(item))
                        .remark(item.getRemark())
                        .build();
                newOrder.markSynced();
                salesOrderRepository.save(newOrder);
            }
            upsertCount++;
        }
        log.info("[Klean-APS] 판매오더 동기화 완료: {}건", upsertCount);
        return upsertCount;
    }

    /**
     * 오더 예외 처리 (지폭조합 제외)
     */
    @Transactional
    public SalesOrderResponse excludeOrder(Long orderId, SalesOrderExcludeRequest req) {
        ApsSalesOrder o = salesOrderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.ENTITY_NOT_FOUND));
        o.exclude(req.getReason());
        return SalesOrderResponse.from(o);
    }

    /**
     * 오더 예외 해제
     */
    @Transactional
    public SalesOrderResponse includeOrder(Long orderId) {
        ApsSalesOrder o = salesOrderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.ENTITY_NOT_FOUND));
        o.includeBack();
        return SalesOrderResponse.from(o);
    }

    private java.math.BigDecimal resolveQtyTon(SalesOrderSyncRequest.SalesOrderSyncItem item) {
        if (item.getOrderQtyTon() != null) return item.getOrderQtyTon();
        return item.getOrderQty(); // 단위가 TON인 경우 그대로 사용
    }
}
