package com.company.module.kleanaps.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

/**
 * 판매오더 예외 처리 요청 DTO
 */
@Getter
@Setter
public class SalesOrderExcludeRequest {

    @NotBlank(message = "제외 사유는 필수입니다.")
    private String reason;
}
