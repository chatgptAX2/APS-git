package com.company.module.kleanaps.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

/**
 * SAP 자재마스터 동기화 요청 DTO
 */
@Getter
@Setter
public class MaterialSyncRequest {

    @NotNull
    private List<MaterialSyncItem> materials;

    @Getter
    @Setter
    public static class MaterialSyncItem {

        @NotBlank(message = "자재코드는 필수입니다.")
        private String materialCode;

        @NotBlank(message = "자재명은 필수입니다.")
        private String materialName;

        /** 품목유형: F / H */
        @NotBlank(message = "품목유형은 필수입니다.")
        private String itemType;

        /** 생산호기: 1/2/3 */
        @NotBlank(message = "생산호기는 필수입니다.")
        private String machineNo;

        /** 포장방법: A/B/null */
        private String packingType;

        @NotNull(message = "평량은 필수입니다.")
        private BigDecimal basisWeight;

        @NotNull(message = "지폭은 필수입니다.")
        private Integer paperWidth;

        private Integer paperLength;
    }
}
