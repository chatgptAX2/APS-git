package com.company.module.kleanaps.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 지폭조합 시뮬레이션 라인 Entity
 * 각 폭(조합 항목)에 대한 상세 정보를 저장한다.
 */
@Entity
@Table(name = "aps_combination_line")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ApsCombinationLine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "LINE_ID")
    private Long lineId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "SIMULATION_ID", nullable = false)
    private ApsCombinationSimulation simulation;

    /** 라인 순번 (1부터 시작) */
    @Column(name = "LINE_SEQ", nullable = false)
    private Integer lineSeq;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ORDER_ID")
    private ApsSalesOrder salesOrder;

    @Column(name = "SAP_ORDER_NO", length = 20)
    private String sapOrderNo;

    @Column(name = "MATERIAL_CODE", length = 40)
    private String materialCode;

    /** 지폭 (mm) */
    @Column(name = "PAPER_WIDTH", nullable = false)
    private Integer paperWidth;

    /** 배정수량 (TON) */
    @Column(name = "ASSIGNED_QTY", nullable = false, precision = 14, scale = 3)
    private BigDecimal assignedQty;

    /** 배폭 여부 */
    @Column(name = "IS_DOUBLE_PLY", nullable = false)
    private Boolean isDoublePly;

    /** MOQ 이하 여부 */
    @Column(name = "IS_MIN_ORDER_QTY", nullable = false)
    private Boolean isMinOrderQty;

    /**
     * 라인 유형: ORDER=일반오더 / STOCK=재고대체 / LOSS=손실
     */
    @Column(name = "LINE_TYPE", nullable = false, length = 20)
    private String lineType;

    @Column(name = "REMARK", length = 300)
    private String remark;

    @Column(name = "CREATED_AT", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt      = LocalDateTime.now();
        if (this.isDoublePly   == null) this.isDoublePly   = false;
        if (this.isMinOrderQty == null) this.isMinOrderQty = false;
        if (this.lineType      == null) this.lineType      = "ORDER";
    }

    @Builder
    public ApsCombinationLine(ApsCombinationSimulation simulation, Integer lineSeq,
                               ApsSalesOrder salesOrder, String sapOrderNo,
                               String materialCode, Integer paperWidth,
                               BigDecimal assignedQty, Boolean isDoublePly,
                               Boolean isMinOrderQty, String lineType, String remark) {
        this.simulation    = simulation;
        this.lineSeq       = lineSeq;
        this.salesOrder    = salesOrder;
        this.sapOrderNo    = sapOrderNo;
        this.materialCode  = materialCode;
        this.paperWidth    = paperWidth;
        this.assignedQty   = assignedQty;
        this.isDoublePly   = isDoublePly   != null ? isDoublePly   : false;
        this.isMinOrderQty = isMinOrderQty != null ? isMinOrderQty : false;
        this.lineType      = lineType      != null ? lineType      : "ORDER";
        this.remark        = remark;
    }
}
