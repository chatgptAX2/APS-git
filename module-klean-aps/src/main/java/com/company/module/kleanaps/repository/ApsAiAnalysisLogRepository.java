package com.company.module.kleanaps.repository;

import com.company.module.kleanaps.entity.ApsAiAnalysisLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApsAiAnalysisLogRepository extends JpaRepository<ApsAiAnalysisLog, Long> {

    List<ApsAiAnalysisLog> findBySimulation_SimulationIdOrderByCreatedAtDesc(Long simulationId);
}
