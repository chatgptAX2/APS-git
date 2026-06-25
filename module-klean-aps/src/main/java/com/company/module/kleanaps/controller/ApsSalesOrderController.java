package com.company.module.kleanaps.controller;

import com.company.core.common.response.ApiResponse;
import com.company.module.kleanaps.dto.SalesOrderExcludeRequest;
import com.company.module.kleanaps.dto.SalesOrderResponse;
import com.company.module.kleanaps.dto.SalesOrderSyncRequest;
import com.company.module.kleanaps.service.ApsSalesOrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * SAP 판매오더 API
 * Base URL: /klean-aps-api/sales-orders
 */
@RestController
@RequestMapping("/klean-aps-api/sales-orders")
@RequiredArgsConstructor
public class ApsSalesOrderController {

    private final ApsSalesOrderService salesOrderService;

    /**
     * 판매오더 목록 조회 (검색 + 페이징)
     * GET /klean-aps-api/sales-orders?q=&status=OPEN&page=0&size=50
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<SalesOrderResponse>>> getList(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        return ResponseEntity.ok(ApiResponse.success(
                salesOrderService.getList(q, status, page, size)));
    }

    /**
     * 판매오더 단건 조회
     * GET /klean-aps-api/sales-orders/{orderId}
     */
    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<SalesOrderResponse>> getById(@PathVariable Long orderId) {
        return ResponseEntity.ok(ApiResponse.success(salesOrderService.getById(orderId)));
    }

    /**
     * 평량별 오더 집계 현황
     * GET /klean-aps-api/sales-orders/summary/basis-weight
     */
    @GetMapping("/summary/basis-weight")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getSummaryByBasisWeight() {
        return ResponseEntity.ok(ApiResponse.success(
                salesOrderService.getOrderSummaryByBasisWeight()));
    }

    /**
     * SAP 판매오더 동기화
     * POST /klean-aps-api/sales-orders/sync
     */
    @PostMapping("/sync")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> syncOrders(
            @Valid @RequestBody SalesOrderSyncRequest request) {
        int count = salesOrderService.syncOrders(request);
        return ResponseEntity.ok(ApiResponse.success(
                Map.of("syncCount", count, "message", "판매오더 동기화 완료")));
    }

    /**
     * 오더 예외 처리 (지폭조합 제외)
     * PATCH /klean-aps-api/sales-orders/{orderId}/exclude
     */
    @PatchMapping("/{orderId}/exclude")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<SalesOrderResponse>> excludeOrder(
            @PathVariable Long orderId,
            @Valid @RequestBody SalesOrderExcludeRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                salesOrderService.excludeOrder(orderId, request)));
    }

    /**
     * 오더 예외 해제 (지폭조합 재포함)
     * PATCH /klean-aps-api/sales-orders/{orderId}/include
     */
    @PatchMapping("/{orderId}/include")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<SalesOrderResponse>> includeOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(ApiResponse.success(salesOrderService.includeOrder(orderId)));
    }
}
