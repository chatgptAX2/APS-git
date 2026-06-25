package com.company.module.kleanaps.controller;

import com.company.core.common.response.ApiResponse;
import com.company.module.kleanaps.dto.MachineResponse;
import com.company.module.kleanaps.service.ApsMachineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 기계 마스터 API
 * Base URL: /klean-aps-api/machines
 */
@RestController
@RequestMapping("/klean-aps-api/machines")
@RequiredArgsConstructor
public class ApsMachineController {

    private final ApsMachineService machineService;

    /**
     * 기계 목록 조회 (예외조건 포함)
     * GET /klean-aps-api/machines
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<MachineResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(machineService.getAll()));
    }

    /**
     * 기계 단건 조회
     * GET /klean-aps-api/machines/{machineId}
     */
    @GetMapping("/{machineId}")
    public ResponseEntity<ApiResponse<MachineResponse>> getById(@PathVariable Long machineId) {
        return ResponseEntity.ok(ApiResponse.success(machineService.getById(machineId)));
    }

    /**
     * 호기 번호로 조회
     * GET /klean-aps-api/machines/no/{machineNo}
     */
    @GetMapping("/no/{machineNo}")
    public ResponseEntity<ApiResponse<MachineResponse>> getByMachineNo(@PathVariable String machineNo) {
        return ResponseEntity.ok(ApiResponse.success(machineService.getByMachineNo(machineNo)));
    }
}
