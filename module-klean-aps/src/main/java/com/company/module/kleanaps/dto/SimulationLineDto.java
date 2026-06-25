package com.company.module.kleanaps.dto;

import com.company.module.kleanaps.entity.ApsCombinationLine;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
public class SimulationLineDto {

    private Long       lineId;
    private Integer    lineSeq;
    private Long       orderId;
    private String     sapOrderNo;
    private String     materialCode;
    private Integer    paperWidth;
    private BigDecimal assignedQty;
    private Boolean    isDoublePly;
    private Boolean    isMinOrderQty;
    private String     lineType;
    private String     lineTypeLabel;
    private String     remark;

    public static SimulationLineDto from(ApsCombinationLine l) {
        SimulationLineDto dto = new SimulationLineDto();
        dto.lineId        = l.getLineId();
        dto.lineSeq       = l.getLineSeq();
        dto.orderId       = l.getSalesOrder() != null ? l.getSalesOrder().getOrderId() : null;
        dto.sapOrderNo    = l.getSapOrderNo();
        dto.materialCode  = l.getMaterialCode();
        dto.paperWidth    = l.getPaperWidth();
        dto.assignedQty   = l.getAssignedQty();
        dto.isDoublePly   = l.getIsDoublePly();
        dto.isMinOrderQty = l.getIsMinOrderQty();
        dto.lineType      = l.getLineType();
        dto.lineTypeLabel = resolveLineTypeLabel(l.getLineType());
        dto.remark        = l.getRemark();
        return dto;
    }

    private static String resolveLineTypeLabel(String type) {
        if (type == null) return "";
        return switch (type) {
            case "ORDER" -> "일반오더";
            case "STOCK" -> "재고대체";
            case "LOSS"  -> "손실";
            default      -> type;
        };
    }
}
