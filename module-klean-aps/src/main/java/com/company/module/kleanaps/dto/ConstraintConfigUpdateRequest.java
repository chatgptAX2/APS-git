package com.company.module.kleanaps.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

/**
 * 제약조건 설정 수정 요청 DTO
 */
@Getter
@Setter
public class ConstraintConfigUpdateRequest {

    @NotBlank(message = "설정값은 필수입니다.")
    private String configValue;

    private String description;

    @NotNull
    private Boolean isActive;
}
