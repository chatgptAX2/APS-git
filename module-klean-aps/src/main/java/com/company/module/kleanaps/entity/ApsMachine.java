package com.company.module.kleanaps.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 기계 마스터 Entity (2호기 / 3호기)
 * - 2호기: 최대 2,520mm / 최소 2,400mm
 * - 3호기: 최대 3,420mm / 최소 3,300mm (평량 예외 있음)
 */
@Entity
@Table(name = "aps_machine")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ApsMachine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MACHINE_ID")
    private Long machineId;

    @Column(name = "MACHINE_NO", nullable = false, length = 1)
    private String machineNo;

    @Column(name = "MACHINE_NAME", nullable = false, length = 100)
    private String machineName;

    /** 최대지폭 (mm) */
    @Column(name = "MAX_WIDTH", nullable = false)
    private Integer maxWidth;

    /** 최소지폭 (mm) */
    @Column(name = "MIN_WIDTH", nullable = false)
    private Integer minWidth;

    /** 최대 폭수 */
    @Column(name = "MAX_PLY_COUNT", nullable = false)
    private Integer maxPlyCount;

    /** 배폭 생산 시 미미 (mm), 기본 30mm */
    @Column(name = "MIMI_WIDTH", nullable = false)
    private Integer mimiWidth;

    @Column(name = "IS_ACTIVE", nullable = false)
    private Boolean isActive;

    @Column(name = "CREATED_AT", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "UPDATED_AT", nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "machine", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ApsMachineException> exceptions = new ArrayList<>();

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
    public ApsMachine(String machineNo, String machineName, Integer maxWidth,
                      Integer minWidth, Integer maxPlyCount, Integer mimiWidth) {
        this.machineNo    = machineNo;
        this.machineName  = machineName;
        this.maxWidth     = maxWidth;
        this.minWidth     = minWidth;
        this.maxPlyCount  = maxPlyCount;
        this.mimiWidth    = mimiWidth;
        this.isActive     = true;
    }

    public void update(String machineName, Integer maxWidth, Integer minWidth,
                       Integer maxPlyCount, Integer mimiWidth) {
        this.machineName  = machineName;
        this.maxWidth     = maxWidth;
        this.minWidth     = minWidth;
        this.maxPlyCount  = maxPlyCount;
        this.mimiWidth    = mimiWidth;
    }

    /**
     * 평량 예외 조건을 반영한 실제 최대지폭 반환
     */
    public int getEffectiveMaxWidth(java.math.BigDecimal basisWeight) {
        return exceptions.stream()
                .filter(e -> e.getBasisWeight().compareTo(basisWeight) == 0)
                .mapToInt(ApsMachineException::getMaxWidth)
                .findFirst()
                .orElse(this.maxWidth);
    }
}
