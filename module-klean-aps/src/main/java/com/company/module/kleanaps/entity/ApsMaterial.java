package com.company.module.kleanaps.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * SAP 자재 마스터 Entity
 * 자재코드 파싱 규칙:
 *  - LEFT(1)      = 품목유형 (F=제품, H=반제품)
 *  - MID(2,1)     = 생산호기 (1/2/3)
 *  - RIGHT(1)     = 포장방법 (A=Sheet속포장, B=Sheet벌크포장, NULL=Roll)
 *  - MID(6,3)     = 평량
 *  - MID(10,4)    = 지폭
 *  - MID(14,4)    = 지장
 */
@Entity
@Table(name = "aps_material")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ApsMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MATERIAL_ID")
    private Long materialId;

    @Column(name = "MATERIAL_CODE", nullable = false, length = 40)
    private String materialCode;

    @Column(name = "MATERIAL_NAME", nullable = false, length = 200)
    private String materialName;

    /**
     * 품목유형: F=제품, H=반제품
     */
    @Column(name = "ITEM_TYPE", nullable = false, length = 1)
    private String itemType;

    /**
     * 생산호기: 1/2/3
     */
    @Column(name = "MACHINE_NO", nullable = false, length = 1)
    private String machineNo;

    /**
     * 포장방법: A=Sheet속포장, B=Sheet벌크포장, null=Roll
     */
    @Column(name = "PACKING_TYPE", length = 1)
    private String packingType;

    /**
     * 평량 (g/m2)
     */
    @Column(name = "BASIS_WEIGHT", nullable = false, precision = 6, scale = 2)
    private java.math.BigDecimal basisWeight;

    /**
     * 지폭 (mm)
     */
    @Column(name = "PAPER_WIDTH", nullable = false)
    private Integer paperWidth;

    /**
     * 지장 (mm)
     */
    @Column(name = "PAPER_LENGTH")
    private Integer paperLength;

    @Column(name = "IS_ACTIVE", nullable = false)
    private Boolean isActive;

    @Column(name = "CREATED_AT", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "UPDATED_AT", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "SYNCED_AT")
    private LocalDateTime syncedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.isActive == null) this.isActive = true;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    @Builder
    public ApsMaterial(String materialCode, String materialName, String itemType,
                       String machineNo, String packingType, java.math.BigDecimal basisWeight,
                       Integer paperWidth, Integer paperLength) {
        this.materialCode = materialCode;
        this.materialName = materialName;
        this.itemType     = itemType;
        this.machineNo    = machineNo;
        this.packingType  = packingType;
        this.basisWeight  = basisWeight;
        this.paperWidth   = paperWidth;
        this.paperLength  = paperLength;
        this.isActive     = true;
    }

    /** SAP 동기화 업데이트 */
    public void syncFromSap(String materialName, String itemType, String machineNo,
                            String packingType, java.math.BigDecimal basisWeight,
                            Integer paperWidth, Integer paperLength) {
        this.materialName = materialName;
        this.itemType     = itemType;
        this.machineNo    = machineNo;
        this.packingType  = packingType;
        this.basisWeight  = basisWeight;
        this.paperWidth   = paperWidth;
        this.paperLength  = paperLength;
        this.syncedAt     = LocalDateTime.now();
    }

    public void deactivate() { this.isActive = false; }
    public void activate()   { this.isActive = true;  }

    /** 롤(원지) 여부 */
    public boolean isRoll() { return this.packingType == null || this.packingType.isBlank(); }
    /** 시트 여부 */
    public boolean isSheet() { return !isRoll(); }
}
