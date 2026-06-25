package com.company.module.kleanaps.repository;

import com.company.module.kleanaps.entity.ApsProductionOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ApsProductionOrderRepository extends JpaRepository<ApsProductionOrder, Long> {

    List<ApsProductionOrder> findBySimulation_SimulationId(Long simulationId);

    List<ApsProductionOrder> findBySendStatus(String sendStatus);

    @Query("SELECT p FROM ApsProductionOrder p WHERE p.simulation.simulationId = :simId ORDER BY p.createdAt DESC")
    List<ApsProductionOrder> findBySimulationIdOrderByCreatedAtDesc(@Param("simId") Long simId);

    boolean existsBySimulation_SimulationIdAndSendStatus(Long simulationId, String sendStatus);
}
