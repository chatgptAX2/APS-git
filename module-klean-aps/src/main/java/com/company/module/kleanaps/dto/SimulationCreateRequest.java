package com.company.module.kleanaps.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

/**
 * 지폭조합 시뮬레이션 생성 요청 DTO
 * [생성 버튼] 클릭 시 사용
 */
@Getter
@Setter
public class SimulationCreateRequest {

    @NotBlank(message = "호기는 필수입니다.")
    private String machineNo;

    @NotNull(message = "평량은 필수입니다.")
    private BigDecimal basisWeight;

    /**
     * 종이유형: ROLL (원지) / SHEET (시트)
     */
    @NotBlank(message = "종이유형은 필수입니다.")
    private String paperType;

    /**
     * 조합할 판매오더 ID 목록 (선택사항: 비어있으면 자동 선택)
     */
    private List<Long> orderIds;

    /**
     * 점보롤 수량
     */
    private Integer jumboRollCount = 1;

    private String remark;
}
