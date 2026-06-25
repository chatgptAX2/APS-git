package com.company.module.kleanaps.controller;

import com.company.core.common.response.ApiResponse;
import com.company.module.kleanaps.dto.MaterialResponse;
import com.company.module.kleanaps.dto.MaterialSyncRequest;
import com.company.module.kleanaps.service.ApsMaterialService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * SAP 자재마스터 API
 * Base URL: /klean-aps-api/materials
 */
@RestController
@RequestMapping("/klean-aps-api/materials")
@RequiredArgsConstructor
public class ApsMaterialController {

    private final ApsMaterialService materialService;

    /**
     * 자재 목록 조회
     * GET /klean-aps-api/materials?q=&page=0&size=50
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<MaterialResponse>>> getList(
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        return ResponseEntity.ok(ApiResponse.success(materialService.getList(q, page, size)));
    }

    /**
     * 자재 단건 조회
     * GET /klean-aps-api/materials/{materialId}
     */
    @GetMapping("/{materialId}")
    public ResponseEntity<ApiResponse<MaterialResponse>> getById(@PathVariable Long materialId) {
        return ResponseEntity.ok(ApiResponse.success(materialService.getById(materialId)));
    }

    /**
     * 자재코드로 조회
     * GET /klean-aps-api/materials/code/{materialCode}
     */
    @GetMapping("/code/{materialCode}")
    public ResponseEntity<ApiResponse<MaterialResponse>> getByCode(@PathVariable String materialCode) {
        return ResponseEntity.ok(ApiResponse.success(materialService.getByCode(materialCode)));
    }

    /**
     * 호기 + 평량으로 자재 조회 (지폭조합 시 사용)
     * GET /klean-aps-api/materials/by-machine?machineNo=2&basisWeight=220
     */
    @GetMapping("/by-machine")
    public ResponseEntity<ApiResponse<List<MaterialResponse>>> getByMachineAndBasisWeight(
            @RequestParam String machineNo,
            @RequestParam BigDecimal basisWeight) {
        return ResponseEntity.ok(ApiResponse.success(
                materialService.getByMachineAndBasisWeight(machineNo, basisWeight)));
    }

    /**
     * SAP 자재마스터 동기화 (Upsert)
     * POST /klean-aps-api/materials/sync
     */
    @PostMapping("/sync")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> syncMaterials(
            @Valid @RequestBody MaterialSyncRequest request) {
        int count = materialService.syncMaterials(request);
        return ResponseEntity.ok(ApiResponse.success(
                Map.of("syncCount", count, "message", "자재마스터 동기화 완료")));
    }

    /**
     * 자재 비활성화
     * PATCH /klean-aps-api/materials/{materialId}/deactivate
     */
    @PatchMapping("/{materialId}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deactivate(@PathVariable Long materialId) {
        materialService.deactivate(materialId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
