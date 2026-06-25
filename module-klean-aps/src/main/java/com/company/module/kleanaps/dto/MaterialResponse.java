package com.company.module.kleanaps.dto;

import com.company.module.kleanaps.entity.ApsMaterial;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class MaterialResponse {

    private Long   materialId;
    private String materialCode;
    private String materialName;
    private String itemType;
    private String itemTypeLabel;
    private String machineNo;
    private String packingType;
    private String packingTypeLabel;
    private BigDecimal basisWeight;
    private Integer    paperWidth;
    private Integer    paperLength;
    private Boolean    isActive;
    private LocalDateTime syncedAt;

    public static MaterialResponse from(ApsMaterial m) {
        MaterialResponse dto = new MaterialResponse();
        dto.materialId      = m.getMaterialId();
        dto.materialCode    = m.getMaterialCode();
        dto.materialName    = m.getMaterialName();
        dto.itemType        = m.getItemType();
        dto.itemTypeLabel   = "F".equals(m.getItemType()) ? "제품" : "반제품";
        dto.machineNo       = m.getMachineNo();
        dto.packingType     = m.getPackingType();
        dto.packingTypeLabel = resolvePackingLabel(m.getPackingType());
        dto.basisWeight     = m.getBasisWeight();
        dto.paperWidth      = m.getPaperWidth();
        dto.paperLength     = m.getPaperLength();
        dto.isActive        = m.getIsActive();
        dto.syncedAt        = m.getSyncedAt();
        return dto;
    }

    private static String resolvePackingLabel(String code) {
        if (code == null || code.isBlank()) return "Roll";
        return switch (code) {
            case "A" -> "Sheet 속포장";
            case "B" -> "Sheet 벌크포장";
            default  -> code;
        };
    }
}
