package com.company.module.kleanaps.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * SAP 판매오더 Entity
 * SAP로부터 동기화되거나 수동 등록된 판매오더를 관리한다.
 */
@Entity
@Table(name = "aps_sales_order")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ApsSalesOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ORDER_ID")
    private Long orderId;

    @Column(name = "SAP_ORDER_NO", nullable = false, length = 20)
    private String sapOrderNo;

    /**
     * 오더유형: 내수, 수출, 일본수출, 필리핀, 특수지 등
     */
    @Column(name = "ORDER_TYPE", nullable = false, length = 20)
    private String orderType;

    @Column(name = "CUSTOMER_CODE", length = 20)
    private String customerCode;

    @Column(name = "CUSTOMER_NAME", length = 200)
    private String customerName;

    @Column(name = "ORDER_DATE", nullable = false)
    private LocalDate orderDate;

    @Column(name = "DUE_DATE")
    private LocalDate dueDate;

    @Column(name = "MATERIAL_CODE", nullable = false, length = 40)
    private String materialCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MATERIAL_ID")
    private ApsMaterial material;

    /** 평량 (g/m2) */
    @Column(name = "BASIS_WEIGHT", nullable = false, precision = 6, scale = 2)
    private BigDecimal basisWeight;

    /** 지폭 (mm) */
    @Column(name = "PAPER_WIDTH", nullable = false)
    private Integer paperWidth;

    /** 지장 (mm) */
    @Column(name = "PAPER_LENGTH")
    private Integer paperLength;

    /** 오더수량 */
    @Column(name = "ORDER_QTY", nullable = false, precision = 14, scale = 3)
    private BigDecimal orderQty;

    /** 수량단위 (TON/R) */
    @Column(name = "ORDER_UNIT", nullable = false, length = 5)
    private String orderUnit;

    /** TON 환산수량 */
    @Column(name = "ORDER_QTY_TON", precision = 14, scale = 3)
    private BigDecimal orderQtyTon;

    /**
     * 오더상태: OPEN / ASSIGNED / COMPLETED
     */
    @Column(name = "STATUS", nullable = false, length = 20)
    private String status;

    /** 조합 제외 여부 (예외 오더) */
    @Column(name = "IS_EXCLUDED", nullable = false)
    private Boolean isExcluded;

    @Column(name = "EXCLUDE_REASON", length = 300)
    private String excludeReason;

    @Column(name = "REMARK", length = 500)
    private String remark;

    @Column(name = "SYNCED_AT")
    private LocalDateTime syncedAt;

    @Column(name = "CREATED_AT", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "UPDATED_AT", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt  = LocalDateTime.now();
        this.updatedAt  = LocalDateTime.now();
        if (this.status     == null) this.status     = "OPEN";
        if (this.isExcluded == null) this.isExcluded = false;
        if (this.orderUnit  == null) this.orderUnit  = "TON";
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    @Builder
    public ApsSalesOrder(String sapOrderNo, String orderType, String customerCode,
                         String customerName, LocalDate orderDate, LocalDate dueDate,
                         String materialCode, ApsMaterial material,
                         BigDecimal basisWeight, Integer paperWidth, Integer paperLength,
                         BigDecimal orderQty, String orderUnit, BigDecimal orderQtyTon,
                         String remark) {
        this.sapOrderNo   = sapOrderNo;
        this.orderType    = orderType;
        this.customerCode = customerCode;
        this.customerName = customerName;
        this.orderDate    = orderDate;
        this.dueDate      = dueDate;
        this.materialCode = materialCode;
        this.material     = material;
        this.basisWeight  = basisWeight;
        this.paperWidth   = paperWidth;
        this.paperLength  = paperLength;
        this.orderQty     = orderQty;
        this.orderUnit    = orderUnit;
        this.orderQtyTon  = orderQtyTon;
        this.remark       = remark;
        this.status       = "OPEN";
        this.isExcluded   = false;
    }

    /** 오더 정보 수정 */
    public void update(LocalDate dueDate, BigDecimal orderQty,
                       BigDecimal orderQtyTon, String remark) {
        this.dueDate      = dueDate;
        this.orderQty     = orderQty;
        this.orderQtyTon  = orderQtyTon;
        this.remark       = remark;
    }

    /** 예외 오더로 분리 */
    public void exclude(String reason) {
        this.isExcluded    = true;
        this.excludeReason = reason;
    }

    /** 예외 오더 해제 */
    public void includeBack() {
        this.isExcluded    = false;
        this.excludeReason = null;
    }

    /** 오더 상태 변경 */
    public void changeStatus(String status) {
        this.status = status;
    }

    /** SAP 동기화일시 갱신 */
    public void markSynced() {
        this.syncedAt = LocalDateTime.now();
    }

    /** 자재 연결 */
    public void linkMaterial(ApsMaterial material) {
        this.material = material;
    }
}
