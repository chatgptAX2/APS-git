package com.company.module.kleanaps.service;

import com.company.core.common.exception.EntityNotFoundException;
import com.company.core.common.exception.ErrorCode;
import com.company.module.kleanaps.dto.ConstraintConfigResponse;
import com.company.module.kleanaps.dto.ConstraintConfigUpdateRequest;
import com.company.module.kleanaps.entity.ApsConstraintConfig;
import com.company.module.kleanaps.repository.ApsConstraintConfigRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApsConstraintService {

    private final ApsConstraintConfigRepository constraintRepository;

    /**
     * 전체 제약조건 목록 조회
     */
    @Transactional(readOnly = true)
    public List<ConstraintConfigResponse> getAll() {
        return constraintRepository.findByIsActiveTrueOrderByConfigGroup()
                .stream().map(ConstraintConfigResponse::from).collect(Collectors.toList());
    }

    /**
     * 그룹별 제약조건 조회
     */
    @Transactional(readOnly = true)
    public List<ConstraintConfigResponse> getByGroup(String group) {
        return constraintRepository
                .findByConfigGroupAndIsActiveTrueOrderByConfigKey(group.toUpperCase())
                .stream().map(ConstraintConfigResponse::from).collect(Collectors.toList());
    }

    /**
     * 제약조건 수정
     */
    @Transactional
    public ConstraintConfigResponse update(Long configId, ConstraintConfigUpdateRequest req) {
        ApsConstraintConfig config = constraintRepository.findById(configId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.ENTITY_NOT_FOUND));
        config.update(req.getConfigValue(), req.getDescription(), req.getIsActive());
        return ConstraintConfigResponse.from(config);
    }

    // ============================================================
    // 내부 사용 유틸리티 메서드 (Service 내에서 설정값 조회)
    // ============================================================

    /** 정수 설정값 조회 (호기 우선, 없으면 공통) */
    public int getIntValue(String key, String machineNo) {
        return constraintRepository.findByConfigKeyAndMachineNo(key, machineNo)
                .map(ApsConstraintConfig::asInteger)
                .orElseGet(() -> constraintRepository
                        .findByConfigKeyAndMachineNoIsNull(key)
                        .map(ApsConstraintConfig::asInteger)
                        .orElseThrow(() -> new IllegalStateException("제약조건 미설정: " + key)));
    }

    /** BigDecimal 설정값 조회 */
    public BigDecimal getDecimalValue(String key) {
        return constraintRepository.findByConfigKeyAndMachineNoIsNull(key)
                .map(ApsConstraintConfig::asDecimal)
                .orElseThrow(() -> new IllegalStateException("제약조건 미설정: " + key));
    }

    /** MOQ (규격당 최소주문수량) */
    public BigDecimal getMoqTon() {
        return getDecimalValue("MOQ_TON");
    }

    /** 생산 가능 최소 밀롤 지폭 */
    public int getMinProductionWidth() {
        return constraintRepository.findByConfigKeyAndMachineNoIsNull("MIN_PRODUCTION_WIDTH")
                .map(ApsConstraintConfig::asInteger).orElse(625);
    }

    /** 원지 최소 비중 (%) */
    public BigDecimal getRollMinRatio() {
        return getDecimalValue("ROLL_MIN_RATIO");
    }

    /** 2호기 4폭 최소 1폭 지폭 */
    public int getFourPlyMinWidth(String machineNo) {
        return getIntValue("4PLY_MIN_WIDTH", machineNo);
    }
}
