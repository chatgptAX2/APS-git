package com.company.module.kleanaps.dto;

import com.company.module.kleanaps.entity.ApsProductionOrder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class ProductionOrderResponse {

    private Long       prodOrderId;
    private Long       simulationId;
    private String     simulationNo;
    private String     sapProdOrder;
    private String     machineNo;
    private BigDecimal basisWeight;
    private Integer    totalWidth;
    private Integer    plyCount;
    private BigDecimal plannedQtyTon;
    private String     sendStatus;
    private String     sendStatusLabel;
    private LocalDateTime sentAt;
    private String     sentBy;
    private String     errorMsg;
    private LocalDateTime createdAt;

    public static ProductionOrderResponse from(ApsProductionOrder p) {
        ProductionOrderResponse dto = new ProductionOrderResponse();
        dto.prodOrderId     = p.getProdOrderId();
        dto.simulationId    = p.getSimulation().getSimulationId();
        dto.simulationNo    = p.getSimulation().getSimulationNo();
        dto.sapProdOrder    = p.getSapProdOrder();
        dto.machineNo       = p.getMachineNo();
        dto.basisWeight     = p.getBasisWeight();
        dto.totalWidth      = p.getTotalWidth();
        dto.plyCount        = p.getPlyCount();
        dto.plannedQtyTon   = p.getPlannedQtyTon();
        dto.sendStatus      = p.getSendStatus();
        dto.sendStatusLabel = resolveStatusLabel(p.getSendStatus());
        dto.sentAt          = p.getSentAt();
        dto.sentBy          = p.getSentBy();
        dto.errorMsg        = p.getErrorMsg();
        dto.createdAt       = p.getCreatedAt();
        return dto;
    }

    private static String resolveStatusLabel(String status) {
        if (status == null) return "";
        return switch (status) {
            case "PENDING" -> "전송대기";
            case "SUCCESS" -> "전송성공";
            case "FAILED"  -> "전송실패";
            default        -> status;
        };
    }
}
