package com.company.module.kleanaps.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * AI 분석 요청/응답 이력 Entity
 */
@Entity
@Table(name = "aps_ai_analysis_log")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ApsAiAnalysisLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "LOG_ID")
    private Long logId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "SIMULATION_ID", nullable = false)
    private ApsCombinationSimulation simulation;

    @Column(name = "PROMPT", nullable = false, columnDefinition = "TEXT")
    private String prompt;

    @Lob
    @Column(name = "ANALYSIS_RESULT", nullable = false)
    private String analysisResult;

    @Column(name = "MODEL_USED", length = 100)
    private String modelUsed;

    @Column(name = "TOKEN_USED")
    private Integer tokenUsed;

    @Column(name = "ELAPSED_MS")
    private Integer elapsedMs;

    @Column(name = "REQUESTED_BY", length = 50)
    private String requestedBy;

    @Column(name = "CREATED_AT", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    @Builder
    public ApsAiAnalysisLog(ApsCombinationSimulation simulation, String prompt,
                            String analysisResult, String modelUsed,
                            Integer tokenUsed, Integer elapsedMs, String requestedBy) {
        this.simulation     = simulation;
        this.prompt         = prompt;
        this.analysisResult = analysisResult;
        this.modelUsed      = modelUsed;
        this.tokenUsed      = tokenUsed;
        this.elapsedMs      = elapsedMs;
        this.requestedBy    = requestedBy;
    }
}
