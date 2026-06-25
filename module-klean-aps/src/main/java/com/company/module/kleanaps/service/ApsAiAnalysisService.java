package com.company.module.kleanaps.service;

import com.company.core.common.exception.BusinessException;
import com.company.core.common.exception.EntityNotFoundException;
import com.company.core.common.exception.ErrorCode;
import com.company.module.kleanaps.dto.AiAnalysisRequest;
import com.company.module.kleanaps.dto.AiAnalysisResponse;
import com.company.module.kleanaps.entity.ApsAiAnalysisLog;
import com.company.module.kleanaps.entity.ApsCombinationSimulation;
import com.company.module.kleanaps.repository.ApsAiAnalysisLogRepository;
import com.company.module.kleanaps.repository.ApsCombinationSimulationRepository;
import com.company.module.kleanaps.repository.ApsConstraintConfigRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.List;
import java.util.Map;

/**
 * AI 분석 서비스
 * <p>
 * 지폭조합 시뮬레이션 결과에 대해 OpenAI API를 통한 분석 및 제언을 제공한다.
 * API KEY는 환경변수 또는 application.properties로 주입.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ApsAiAnalysisService {

    private final ApsCombinationSimulationRepository simulationRepository;
    private final ApsAiAnalysisLogRepository         aiLogRepository;
    private final ApsConstraintConfigRepository      constraintRepository;

    @Value("${klean.aps.ai.api-key:}")
    private String aiApiKey;

    @Value("${klean.aps.ai.api-url:https://api.openai.com/v1/chat/completions}")
    private String aiApiUrl;

    @Value("${klean.aps.ai.model:gpt-4o}")
    private String aiModel;

    /**
     * 시뮬레이션 AI 분석 요청
     */
    @Transactional
    public AiAnalysisResponse analyze(Long simulationId, AiAnalysisRequest req, String userId) {
        ApsCombinationSimulation sim = simulationRepository.findByIdWithLines(simulationId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.ENTITY_NOT_FOUND));

        if (aiApiKey == null || aiApiKey.isBlank()) {
            throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR,
                    "AI API KEY가 설정되지 않았습니다. (klean.aps.ai.api-key)");
        }

        // 시뮬레이션 컨텍스트 구성
        String systemPrompt = buildSystemPrompt();
        String userMessage  = buildUserMessage(sim, req.getPrompt());

        long startMs = System.currentTimeMillis();
        String analysisResult;
        int tokenUsed = 0;

        try {
            Map<String, Object> response = callOpenAiApi(systemPrompt, userMessage);
            analysisResult = extractContent(response);
            tokenUsed      = extractTokenUsed(response);
        } catch (Exception e) {
            log.error("[Klean-APS] AI 분석 실패: {}", e.getMessage(), e);
            throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR,
                    "AI 분석 중 오류가 발생했습니다: " + e.getMessage());
        }

        int elapsedMs = (int) (System.currentTimeMillis() - startMs);

        // 분석 결과 시뮬레이션에 저장
        sim.saveAiAnalysis(req.getPrompt(), analysisResult);

        // 이력 저장
        ApsAiAnalysisLog logEntity = ApsAiAnalysisLog.builder()
                .simulation(sim)
                .prompt(req.getPrompt())
                .analysisResult(analysisResult)
                .modelUsed(aiModel)
                .tokenUsed(tokenUsed)
                .elapsedMs(elapsedMs)
                .requestedBy(userId)
                .build();
        aiLogRepository.save(logEntity);

        log.info("[Klean-APS] AI 분석 완료: simId={}, tokens={}, elapsed={}ms",
                simulationId, tokenUsed, elapsedMs);

        return AiAnalysisResponse.from(logEntity);
    }

    /**
     * 시뮬레이션별 AI 분석 이력 조회
     */
    @Transactional(readOnly = true)
    public List<AiAnalysisResponse> getHistory(Long simulationId) {
        return aiLogRepository.findBySimulation_SimulationIdOrderByCreatedAtDesc(simulationId)
                .stream().map(AiAnalysisResponse::from).toList();
    }

    // ============================================================
    // 내부 유틸
    // ============================================================

    private String buildSystemPrompt() {
        return """
                당신은 제지회사의 지폭조합(Paper Width Combination) 전문 AI 어시스턴트입니다.
                
                [전문 지식]
                - 지폭조합: 여러 판매오더를 기계별 허용 지폭 범위 안에서 점보롤이 Loss 없이 생산되도록 조합하는 업무
                - 2호기: 최대 2,520mm / 최소 2,400mm / 최대 4폭 / 4폭 시 1폭은 반드시 630mm 이상
                - 3호기: 최대 3,420mm / 최소 3,300mm / 최대 4폭 (300/500/550g는 3,410mm)
                - 배폭 생산 시 미미 30mm 필수
                - MOQ: 규격당 3톤
                - 545mm 이하: 단폭 생산 불가(배폭 필수)
                - 889mm 초과: 2폭 생산 불가
                
                [답변 원칙]
                1. 지폭조합 결과의 적합성을 평가하고 개선 방향을 제시하세요.
                2. Loss 최소화 방안을 구체적으로 제안하세요.
                3. 기계 규정 위반 사항이 있으면 명확히 지적하세요.
                4. 재고 우선 활용 가능성을 검토하세요.
                5. 한국어로 답변하세요.
                """;
    }

    private String buildUserMessage(ApsCombinationSimulation sim, String userPrompt) {
        StringBuilder sb = new StringBuilder();
        sb.append("## 시뮬레이션 정보\n");
        sb.append(String.format("- 번호: %s\n", sim.getSimulationNo()));
        sb.append(String.format("- 호기: %s호기\n", sim.getMachine().getMachineNo()));
        sb.append(String.format("- 평량: %sg/m²\n", sim.getBasisWeight()));
        sb.append(String.format("- 종이유형: %s\n", "ROLL".equals(sim.getPaperType()) ? "원지(Roll)" : "시트(Sheet)"));
        sb.append(String.format("- 합계지폭: %smm\n", sim.getTotalWidth()));
        sb.append(String.format("- 폭수: %s\n", sim.getPlyCount()));
        sb.append(String.format("- 점보롤 수량: %s\n", sim.getJumboRollCount()));
        sb.append(String.format("- Loss: %smm (%.2f%%)\n", sim.getLossMm(), sim.getLossPercent()));
        sb.append(String.format("- 총 생산중량: %sTON\n", sim.getTotalWeightTon()));
        sb.append("\n## 조합 라인\n");
        sim.getLines().forEach(line ->
            sb.append(String.format("  - 라인%d: %smm / %.3fTON / %s%s\n",
                    line.getLineSeq(), line.getPaperWidth(), line.getAssignedQty(),
                    line.getLineType(),
                    Boolean.TRUE.equals(line.getIsDoublePly()) ? " [배폭]" : ""))
        );
        sb.append("\n## 사용자 질문\n");
        sb.append(userPrompt);
        return sb.toString();
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> callOpenAiApi(String systemPrompt, String userMessage) {
        return WebClient.builder()
                .baseUrl(aiApiUrl)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + aiApiKey)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build()
                .post()
                .bodyValue(Map.of(
                        "model", aiModel,
                        "messages", List.of(
                                Map.of("role", "system", "content", systemPrompt),
                                Map.of("role", "user",   "content", userMessage)
                        ),
                        "temperature", 0.3,
                        "max_tokens", 2000
                ))
                .retrieve()
                .bodyToMono(Map.class)
                .timeout(Duration.ofSeconds(60))
                .block();
    }

    @SuppressWarnings("unchecked")
    private String extractContent(Map<String, Object> response) {
        try {
            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
            Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
            return (String) message.get("content");
        } catch (Exception e) {
            return "AI 응답 파싱 실패";
        }
    }

    @SuppressWarnings("unchecked")
    private int extractTokenUsed(Map<String, Object> response) {
        try {
            Map<String, Object> usage = (Map<String, Object>) response.get("usage");
            return ((Number) usage.get("total_tokens")).intValue();
        } catch (Exception e) {
            return 0;
        }
    }
}
