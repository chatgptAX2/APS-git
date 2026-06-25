package com.company.module.kleanaps.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * SAP 판매오더 동기화 요청 DTO
 */
@Getter
@Setter
public class SalesOrderSyncRequest {

    @NotNull
    private List<SalesOrderSyncItem> orders;

    @Getter
    @Setter
    public static class SalesOrderSyncItem {

        @NotBlank(message = "SAP 오더번호는 필수입니다.")
        private String sapOrderNo;

        @NotBlank(message = "오더유형은 필수입니다.")
        private String orderType;

        private String customerCode;
        private String customerName;

        @NotNull(message = "오더일자는 필수입니다.")
        private LocalDate orderDate;

        private LocalDate dueDate;

        @NotBlank(message = "자재코드는 필수입니다.")
        private String materialCode;

        @NotNull(message = "평량은 필수입니다.")
        private BigDecimal basisWeight;

        @NotNull(message = "지폭은 필수입니다.")
        private Integer paperWidth;

        private Integer paperLength;

        @NotNull(message = "오더수량은 필수입니다.")
        private BigDecimal orderQty;

        private String orderUnit = "TON";

        /** TON 환산수량 (SAP에서 계산된 값, 없으면 orderQty 그대로 사용) */
        private BigDecimal orderQtyTon;

        private String remark;
    }
}
