package com.company.module.kleanaps.controller;

import com.company.core.common.response.ApiResponse;
import com.company.module.kleanaps.dto.ConstraintConfigResponse;
import com.company.module.kleanaps.dto.ConstraintConfigUpdateRequest;
import com.company.module.kleanaps.service.ApsConstraintService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 제약조건 설정 API
 * Base URL: /klean-aps-api/constraints
 */
@RestController
@RequestMapping("/klean-aps-api/constraints")
@RequiredArgsConstructor
public class ApsConstraintController {

    private final ApsConstraintService constraintService;

    /**
     * 전체 제약조건 목록 조회
     * GET /klean-aps-api/constraints
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<ConstraintConfigResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(constraintService.getAll()));
    }

    /**
     * 그룹별 제약조건 조회
     * GET /klean-aps-api/constraints/group/{group}
     * group: GENERAL, MACHINE, EXCEPTION
     */
    @GetMapping("/group/{group}")
    public ResponseEntity<ApiResponse<List<ConstraintConfigResponse>>> getByGroup(
            @PathVariable String group) {
        return ResponseEntity.ok(ApiResponse.success(constraintService.getByGroup(group)));
    }

    /**
     * 제약조건 수정
     * PUT /klean-aps-api/constraints/{configId}
     */
    @PutMapping("/{configId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ConstraintConfigResponse>> update(
            @PathVariable Long configId,
            @Valid @RequestBody ConstraintConfigUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.success(constraintService.update(configId, request)));
    }
}
