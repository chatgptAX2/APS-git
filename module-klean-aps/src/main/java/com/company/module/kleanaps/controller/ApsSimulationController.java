package com.company.module.kleanaps.controller;

import com.company.core.common.response.ApiResponse;
import com.company.module.kleanaps.dto.*;
import com.company.module.kleanaps.service.ApsAiAnalysisService;
import com.company.module.kleanaps.service.ApsProductionOrderService;
import com.company.module.kleanaps.service.ApsSimulationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * 지폭조합 시뮬레이션 API
 * Base URL: /klean-aps-api/simulations
 *
 * 버튼 매핑:
 *  - [생성]     POST /klean-aps-api/simulations
 *  - [확정]     PATCH /klean-aps-api/simulations/{id}/confirm
 *  - [확정취소] PATCH /klean-aps-api/simulations/{id}/cancel-confirm
 *  - [오더생성] POST /klean-aps-api/simulations/{id}/send-to-sap
 */
@RestController
@RequestMapping("/klean-aps-api/simulations")
@RequiredArgsConstructor
public class ApsSimulationController {

    private final ApsSimulationService      simulationService;
    private final ApsAiAnalysisService      aiAnalysisService;
    private final ApsProductionOrderService productionOrderService;

    /**
     * 시뮬레이션 목록 조회
     * GET /klean-aps-api/simulations?status=DRAFT&basisWeight=220&machineNo=2&page=0&size=20
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<SimulationResponse>>> getList(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) BigDecimal basisWeight,
            @RequestParam(required = false) String machineNo,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success(
                simulationService.getList(status, basisWeight, machineNo, page, size)));
    }

    /**
     * 시뮬레이션 단건 조회 (라인 포함)
     * GET /klean-aps-api/simulations/{simulationId}
     */
    @GetMapping("/{simulationId}")
    public ResponseEntity<ApiResponse<SimulationResponse>> getById(@PathVariable Long simulationId) {
        return ResponseEntity.ok(ApiResponse.success(simulationService.getById(simulationId)));
    }

    /**
     * [생성 버튼] 지폭조합 시뮬레이션 생성
     * POST /klean-aps-api/simulations
     */
    @PostMapping
    public ResponseEntity<ApiResponse<SimulationResponse>> createSimulation(
            @Valid @RequestBody SimulationCreateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails != null ? userDetails.getUsername() : "SYSTEM";
        return ResponseEntity.ok(ApiResponse.created(
                simulationService.createSimulation(request, userId)));
    }

    /**
     * [확정 버튼] 시뮬레이션 확정 (DRAFT → CONFIRMED)
     * PATCH /klean-aps-api/simulations/{simulationId}/confirm
     */
    @PatchMapping("/{simulationId}/confirm")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<SimulationResponse>> confirm(
            @PathVariable Long simulationId,
            @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails != null ? userDetails.getUsername() : "SYSTEM";
        return ResponseEntity.ok(ApiResponse.success(
                simulationService.confirmSimulation(simulationId, userId)));
    }

    /**
     * [확정취소 버튼] 확정 취소 (CONFIRMED → DRAFT)
     * PATCH /klean-aps-api/simulations/{simulationId}/cancel-confirm
     */
    @PatchMapping("/{simulationId}/cancel-confirm")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<SimulationResponse>> cancelConfirm(
            @PathVariable Long simulationId) {
        return ResponseEntity.ok(ApiResponse.success(
                simulationService.cancelConfirmSimulation(simulationId)));
    }

    /**
     * [AI 분석] 시뮬레이션 AI 분석 요청 (프롬프트 입력)
     * POST /klean-aps-api/simulations/{simulationId}/ai-analysis
     */
    @PostMapping("/{simulationId}/ai-analysis")
    public ResponseEntity<ApiResponse<AiAnalysisResponse>> requestAiAnalysis(
            @PathVariable Long simulationId,
            @Valid @RequestBody AiAnalysisRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails != null ? userDetails.getUsername() : "SYSTEM";
        return ResponseEntity.ok(ApiResponse.success(
                aiAnalysisService.analyze(simulationId, request, userId)));
    }

    /**
     * AI 분석 이력 조회
     * GET /klean-aps-api/simulations/{simulationId}/ai-analysis
     */
    @GetMapping("/{simulationId}/ai-analysis")
    public ResponseEntity<ApiResponse<List<AiAnalysisResponse>>> getAiHistory(
            @PathVariable Long simulationId) {
        return ResponseEntity.ok(ApiResponse.success(aiAnalysisService.getHistory(simulationId)));
    }

    /**
     * [오더생성 버튼] 확정된 시뮬레이션을 SAP 생산오더로 전달
     * POST /klean-aps-api/simulations/{simulationId}/send-to-sap
     */
    @PostMapping("/{simulationId}/send-to-sap")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProductionOrderResponse>> sendToSap(
            @PathVariable Long simulationId,
            @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails != null ? userDetails.getUsername() : "SYSTEM";
        return ResponseEntity.ok(ApiResponse.success(
                productionOrderService.sendToSap(simulationId, userId)));
    }

    /**
     * SAP 생산오더 전달 이력 조회
     * GET /klean-aps-api/simulations/{simulationId}/production-orders
     */
    @GetMapping("/{simulationId}/production-orders")
    public ResponseEntity<ApiResponse<List<ProductionOrderResponse>>> getProductionOrders(
            @PathVariable Long simulationId) {
        return ResponseEntity.ok(ApiResponse.success(
                productionOrderService.getBySimulation(simulationId)));
    }
}
