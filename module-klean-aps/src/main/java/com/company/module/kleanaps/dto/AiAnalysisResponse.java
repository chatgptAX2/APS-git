package com.company.module.kleanaps.dto;

import com.company.module.kleanaps.entity.ApsAiAnalysisLog;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class AiAnalysisResponse {

    private Long          logId;
    private Long          simulationId;
    private String        prompt;
    private String        analysisResult;
    private String        modelUsed;
    private Integer       tokenUsed;
    private Integer       elapsedMs;
    private String        requestedBy;
    private LocalDateTime createdAt;

    public static AiAnalysisResponse from(ApsAiAnalysisLog log) {
        AiAnalysisResponse dto = new AiAnalysisResponse();
        dto.logId          = log.getLogId();
        dto.simulationId   = log.getSimulation().getSimulationId();
        dto.prompt         = log.getPrompt();
        dto.analysisResult = log.getAnalysisResult();
        dto.modelUsed      = log.getModelUsed();
        dto.tokenUsed      = log.getTokenUsed();
        dto.elapsedMs      = log.getElapsedMs();
        dto.requestedBy    = log.getRequestedBy();
        dto.createdAt      = log.getCreatedAt();
        return dto;
    }
}
