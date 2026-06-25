package com.company.module.kleanaps.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

/**
 * AI 분석 요청 DTO
 * [AI 분석] 버튼 + 프롬프트 입력 시 사용
 */
@Getter
@Setter
public class AiAnalysisRequest {

    @NotBlank(message = "분석 요청 내용을 입력해주세요.")
    private String prompt;
}
