package com.company.module.kleanaps.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 기계별 평량 예외 조건 Entity
 * 예: 3호기에서 300/500/550 g/m2 생산 시 최대 3,410mm 적용
 */
@Entity
@Table(name = "aps_machine_exception")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ApsMachineException {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "EXCEPTION_ID")
    private Long exceptionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MACHINE_ID", nullable = false)
    private ApsMachine machine;

    /** 예외 적용 평량 (g/m2) */
    @Column(name = "BASIS_WEIGHT", nullable = false, precision = 6, scale = 2)
    private BigDecimal basisWeight;

    /** 예외 최대지폭 (mm) */
    @Column(name = "MAX_WIDTH", nullable = false)
    private Integer maxWidth;

    @Column(name = "REMARK", length = 300)
    private String remark;

    @Column(name = "CREATED_AT", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    @Builder
    public ApsMachineException(ApsMachine machine, BigDecimal basisWeight,
                               Integer maxWidth, String remark) {
        this.machine      = machine;
        this.basisWeight  = basisWeight;
        this.maxWidth     = maxWidth;
        this.remark       = remark;
    }
}
