package com.company.module.kleanaps.repository;

import com.company.module.kleanaps.entity.ApsCombinationLine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ApsCombinationLineRepository extends JpaRepository<ApsCombinationLine, Long> {

    List<ApsCombinationLine> findBySimulation_SimulationIdOrderByLineSeq(Long simulationId);

    @Modifying
    @Query("DELETE FROM ApsCombinationLine l WHERE l.simulation.simulationId = :simulationId")
    void deleteBySimulationId(@Param("simulationId") Long simulationId);

    /** 특정 판매오더가 포함된 라인 조회 */
    @Query("SELECT l FROM ApsCombinationLine l WHERE l.salesOrder.orderId = :orderId")
    List<ApsCombinationLine> findByOrderId(@Param("orderId") Long orderId);
}
