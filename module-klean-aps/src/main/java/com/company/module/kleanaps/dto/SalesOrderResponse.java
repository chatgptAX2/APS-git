package com.company.module.kleanaps.dto;

import com.company.module.kleanaps.entity.ApsSalesOrder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class SalesOrderResponse {

    private Long      orderId;
    private String    sapOrderNo;
    private String    orderType;
    private String    customerCode;
    private String    customerName;
    private LocalDate orderDate;
    private LocalDate dueDate;
    private String    materialCode;
    private String    materialName;
    private BigDecimal basisWeight;
    private Integer    paperWidth;
    private Integer    paperLength;
    private BigDecimal orderQty;
    private String     orderUnit;
    private BigDecimal orderQtyTon;
    private String     status;
    private String     statusLabel;
    private Boolean    isExcluded;
    private String     excludeReason;
    private String     remark;
    private LocalDateTime syncedAt;

    public static SalesOrderResponse from(ApsSalesOrder o) {
        SalesOrderResponse dto = new SalesOrderResponse();
        dto.orderId       = o.getOrderId();
        dto.sapOrderNo    = o.getSapOrderNo();
        dto.orderType     = o.getOrderType();
        dto.customerCode  = o.getCustomerCode();
        dto.customerName  = o.getCustomerName();
        dto.orderDate     = o.getOrderDate();
        dto.dueDate       = o.getDueDate();
        dto.materialCode  = o.getMaterialCode();
        dto.materialName  = o.getMaterial() != null ? o.getMaterial().getMaterialName() : null;
        dto.basisWeight   = o.getBasisWeight();
        dto.paperWidth    = o.getPaperWidth();
        dto.paperLength   = o.getPaperLength();
        dto.orderQty      = o.getOrderQty();
        dto.orderUnit     = o.getOrderUnit();
        dto.orderQtyTon   = o.getOrderQtyTon();
        dto.status        = o.getStatus();
        dto.statusLabel   = resolveStatusLabel(o.getStatus());
        dto.isExcluded    = o.getIsExcluded();
        dto.excludeReason = o.getExcludeReason();
        dto.remark        = o.getRemark();
        dto.syncedAt      = o.getSyncedAt();
        return dto;
    }

    private static String resolveStatusLabel(String status) {
        if (status == null) return "";
        return switch (status) {
            case "OPEN"      -> "미배정";
            case "ASSIGNED"  -> "배정완료";
            case "COMPLETED" -> "생산완료";
            default          -> status;
        };
    }
}
