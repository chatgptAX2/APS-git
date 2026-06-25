package com.company.module.kleanaps.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * SAP 생산오더 전달 이력 Entity
 * 확정된 시뮬레이션을 기반으로 SAP에 생산오더를 전달한 이력을 관리한다.
 */
@Entity
@Table(name = "aps_production_order")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ApsProductionOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PROD_ORDER_ID")
    private Long prodOrderId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "SIMULATION_ID", nullable = false)
    private ApsCombinationSimulation simulation;

    @Column(name = "SAP_PROD_ORDER", length = 20)
    private String sapProdOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MACHINE_ID", nullable = false)
    private ApsMachine machine;

    @Column(name = "MACHINE_NO", nullable = false, length = 1)
    private String machineNo;

    /** 평량 (g/m2) */
    @Column(name = "BASIS_WEIGHT", nullable = false, precision = 6, scale = 2)
    private BigDecimal basisWeight;

    /** 합계지폭 (mm) */
    @Column(name = "TOTAL_WIDTH", nullable = false)
    private Integer totalWidth;

    /** 폭수 */
    @Column(name = "PLY_COUNT", nullable = false)
    private Integer plyCount;

    /** 계획수량 (TON) */
    @Column(name = "PLANNED_QTY_TON", nullable = false, precision = 14, scale = 3)
    private BigDecimal plannedQtyTon;

    /**
     * 전송상태: PENDING / SUCCESS / FAILED
     */
    @Column(name = "SEND_STATUS", nullable = false, length = 20)
    private String sendStatus;

    /** SAP 전송 요청 데이터 (JSON) */
    @Lob
    @Column(name = "SEND_REQUEST")
    private String sendRequest;

    /** SAP 전송 응답 데이터 (JSON) */
    @Lob
    @Column(name = "SEND_RESPONSE")
    private String sendResponse;

    @Column(name = "SENT_AT")
    private LocalDateTime sentAt;

    @Column(name = "SENT_BY", length = 50)
    private String sentBy;

    @Column(name = "ERROR_MSG", columnDefinition = "TEXT")
    private String errorMsg;

    @Column(name = "CREATED_AT", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "UPDATED_AT", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt  = LocalDateTime.now();
        this.updatedAt  = LocalDateTime.now();
        if (this.sendStatus == null) this.sendStatus = "PENDING";
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    @Builder
    public ApsProductionOrder(ApsCombinationSimulation simulation, ApsMachine machine,
                              String machineNo, BigDecimal basisWeight,
                              Integer totalWidth, Integer plyCount,
                              BigDecimal plannedQtyTon, String sentBy) {
        this.simulation     = simulation;
        this.machine        = machine;
        this.machineNo      = machineNo;
        this.basisWeight    = basisWeight;
        this.totalWidth     = totalWidth;
        this.plyCount       = plyCount;
        this.plannedQtyTon  = plannedQtyTon;
        this.sendStatus     = "PENDING";
        this.sentBy         = sentBy;
    }

    /** SAP 전송 성공 처리 */
    public void markSuccess(String sapProdOrder, String sendRequest, String sendResponse) {
        this.sapProdOrder  = sapProdOrder;
        this.sendStatus    = "SUCCESS";
        this.sendRequest   = sendRequest;
        this.sendResponse  = sendResponse;
        this.sentAt        = LocalDateTime.now();
    }

    /** SAP 전송 실패 처리 */
    public void markFailed(String sendRequest, String errorMsg) {
        this.sendStatus   = "FAILED";
        this.sendRequest  = sendRequest;
        this.errorMsg     = errorMsg;
        this.sentAt       = LocalDateTime.now();
    }
}
