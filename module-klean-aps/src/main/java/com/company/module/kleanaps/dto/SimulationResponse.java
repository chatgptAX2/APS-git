package com.company.module.kleanaps.dto;

import com.company.module.kleanaps.entity.ApsCombinationSimulation;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
public class SimulationResponse {

    private Long       simulationId;
    private String     simulationNo;
    private String     machineNo;
    private String     machineName;
    private BigDecimal basisWeight;
    private String     paperType;
    private String     paperTypeLabel;
    private Integer    totalWidth;
    private Integer    plyCount;
    private Integer    jumboRollCount;
    private BigDecimal totalWeightTon;
    private Integer    lossMm;
    private BigDecimal lossPercent;
    private String     status;
    private String     statusLabel;
    private String     aiAnalysis;
    private String     aiPrompt;
    private LocalDateTime confirmedAt;
    private String     confirmedBy;
    private String     remark;
    private String     createdBy;
    private LocalDateTime createdAt;
    private List<SimulationLineDto> lines;

    public static SimulationResponse from(ApsCombinationSimulation s) {
        SimulationResponse dto = new SimulationResponse();
        dto.simulationId   = s.getSimulationId();
        dto.simulationNo   = s.getSimulationNo();
        dto.machineNo      = s.getMachine().getMachineNo();
        dto.machineName    = s.getMachine().getMachineName();
        dto.basisWeight    = s.getBasisWeight();
        dto.paperType      = s.getPaperType();
        dto.paperTypeLabel = "ROLL".equals(s.getPaperType()) ? "원지(Roll)" : "시트(Sheet)";
        dto.totalWidth     = s.getTotalWidth();
        dto.plyCount       = s.getPlyCount();
        dto.jumboRollCount = s.getJumboRollCount();
        dto.totalWeightTon = s.getTotalWeightTon();
        dto.lossMm         = s.getLossMm();
        dto.lossPercent    = s.getLossPercent();
        dto.status         = s.getStatus();
        dto.statusLabel    = resolveStatusLabel(s.getStatus());
        dto.aiAnalysis     = s.getAiAnalysis();
        dto.aiPrompt       = s.getAiPrompt();
        dto.confirmedAt    = s.getConfirmedAt();
        dto.confirmedBy    = s.getConfirmedBy();
        dto.remark         = s.getRemark();
        dto.createdBy      = s.getCreatedBy();
        dto.createdAt      = s.getCreatedAt();
        dto.lines = s.getLines() != null
            ? s.getLines().stream().map(SimulationLineDto::from).collect(Collectors.toList())
            : List.of();
        return dto;
    }

    private static String resolveStatusLabel(String status) {
        if (status == null) return "";
        return switch (status) {
            case "DRAFT"     -> "초안";
            case "CONFIRMED" -> "확정";
            case "CANCELLED" -> "취소";
            default          -> status;
        };
    }
}
