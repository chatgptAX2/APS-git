package com.company.module.kleanaps.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 지폭조합 시뮬레이션 헤더 Entity
 * <p>
 * 상태 전이:
 *   DRAFT(초안) → [생성 버튼]
 *   CONFIRMED(확정) → [확정 버튼]
 *   DRAFT(재편집) → [확정취소 버튼]
 *   SAP 오더생성 → [오더생성 버튼] (CONFIRMED 상태에서만 가능)
 */
@Entity
@Table(name = "aps_combination_simulation")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ApsCombinationSimulation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SIMULATION_ID")
    private Long simulationId;

    @Column(name = "SIMULATION_NO", nullable = false, length = 30)
    private String simulationNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MACHINE_ID", nullable = false)
    private ApsMachine machine;

    /** 평량 (g/m2) */
    @Column(name = "BASIS_WEIGHT", nullable = false, precision = 6, scale = 2)
    private BigDecimal basisWeight;

    /** 종이유형: ROLL=원지, SHEET=시트 */
    @Column(name = "PAPER_TYPE", nullable = false, length = 10)
    private String paperType;

    /** 합계지폭 (mm) - 미미 포함 */
    @Column(name = "TOTAL_WIDTH", nullable = false)
    private Integer totalWidth;

    /** 폭수 */
    @Column(name = "PLY_COUNT", nullable = false)
    private Integer plyCount;

    /** 점보롤 수량 */
    @Column(name = "JUMBO_ROLL_COUNT", nullable = false)
    private Integer jumboRollCount;

    /** 총 생산중량 (TON) */
    @Column(name = "TOTAL_WEIGHT_TON", precision = 14, scale = 3)
    private BigDecimal totalWeightTon;

    /** Loss 지폭 (mm) */
    @Column(name = "LOSS_MM", nullable = false)
    private Integer lossMm;

    /** Loss 비율 (%) */
    @Column(name = "LOSS_PERCENT", nullable = false, precision = 5, scale = 2)
    private BigDecimal lossPercent;

    /**
     * 상태: DRAFT=초안 / CONFIRMED=확정 / CANCELLED=취소
     */
    @Column(name = "STATUS", nullable = false, length = 20)
    private String status;

    /** AI 분석 결과 */
    @Lob
    @Column(name = "AI_ANALYSIS")
    private String aiAnalysis;

    /** AI 분석 요청 프롬프트 */
    @Column(name = "AI_PROMPT", columnDefinition = "TEXT")
    private String aiPrompt;

    @Column(name = "CONFIRMED_AT")
    private LocalDateTime confirmedAt;

    @Column(name = "CONFIRMED_BY", length = 50)
    private String confirmedBy;

    @Column(name = "CANCELLED_AT")
    private LocalDateTime cancelledAt;

    @Column(name = "REMARK", length = 500)
    private String remark;

    @Column(name = "CREATED_BY", length = 50)
    private String createdBy;

    @Column(name = "CREATED_AT", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "UPDATED_AT", nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "simulation", cascade = CascadeType.ALL,
               orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ApsCombinationLine> lines = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        this.createdAt      = LocalDateTime.now();
        this.updatedAt      = LocalDateTime.now();
        if (this.status          == null) this.status          = "DRAFT";
        if (this.lossMm          == null) this.lossMm          = 0;
        if (this.lossPercent     == null) this.lossPercent     = BigDecimal.ZERO;
        if (this.jumboRollCount  == null) this.jumboRollCount  = 1;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    @Builder
    public ApsCombinationSimulation(String simulationNo, ApsMachine machine,
                                    BigDecimal basisWeight, String paperType,
                                    Integer totalWidth, Integer plyCount,
                                    Integer jumboRollCount, BigDecimal totalWeightTon,
                                    Integer lossMm, BigDecimal lossPercent,
                                    String createdBy, String remark) {
        this.simulationNo    = simulationNo;
        this.machine         = machine;
        this.basisWeight     = basisWeight;
        this.paperType       = paperType;
        this.totalWidth      = totalWidth;
        this.plyCount        = plyCount;
        this.jumboRollCount  = jumboRollCount;
        this.totalWeightTon  = totalWeightTon;
        this.lossMm          = lossMm != null ? lossMm : 0;
        this.lossPercent     = lossPercent != null ? lossPercent : BigDecimal.ZERO;
        this.status          = "DRAFT";
        this.createdBy       = createdBy;
        this.remark          = remark;
    }

    /** [확정 버튼] 시뮬레이션 확정 */
    public void confirm(String userId) {
        if (!"DRAFT".equals(this.status)) {
            throw new IllegalStateException("초안(DRAFT) 상태에서만 확정 가능합니다.");
        }
        this.status      = "CONFIRMED";
        this.confirmedAt = LocalDateTime.now();
        this.confirmedBy = userId;
    }

    /** [확정취소 버튼] 확정 취소 → DRAFT 복원 */
    public void cancelConfirm() {
        if (!"CONFIRMED".equals(this.status)) {
            throw new IllegalStateException("확정(CONFIRMED) 상태에서만 확정취소 가능합니다.");
        }
        this.status      = "DRAFT";
        this.confirmedAt = null;
        this.confirmedBy = null;
    }

    /** 시뮬레이션 취소 */
    public void cancel(String userId) {
        this.status      = "CANCELLED";
        this.cancelledAt = LocalDateTime.now();
        this.confirmedBy = userId;
    }

    /** AI 분석 결과 저장 */
    public void saveAiAnalysis(String prompt, String analysis) {
        this.aiPrompt   = prompt;
        this.aiAnalysis = analysis;
    }

    /** 라인 추가 */
    public void addLine(ApsCombinationLine line) {
        this.lines.add(line);
    }

    /** 라인 전체 교체 */
    public void replaceLines(List<ApsCombinationLine> newLines) {
        this.lines.clear();
        this.lines.addAll(newLines);
    }

    public boolean isDraft()     { return "DRAFT".equals(this.status);     }
    public boolean isConfirmed() { return "CONFIRMED".equals(this.status); }
    public boolean isCancelled() { return "CANCELLED".equals(this.status); }
}
