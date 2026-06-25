package com.company.module.kleanaps.repository;

import com.company.module.kleanaps.entity.ApsCombinationSimulation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface ApsCombinationSimulationRepository extends JpaRepository<ApsCombinationSimulation, Long> {

    Optional<ApsCombinationSimulation> findBySimulationNo(String simulationNo);

    /** 라인 포함 조회 */
    @Query("SELECT s FROM ApsCombinationSimulation s LEFT JOIN FETCH s.lines WHERE s.simulationId = :id")
    Optional<ApsCombinationSimulation> findByIdWithLines(@Param("id") Long id);

    /** 상태별 조회 */
    List<ApsCombinationSimulation> findByStatus(String status);

    /** 평량 + 상태 조회 */
    @Query(value = """
        SELECT * FROM aps_combination_simulation
        WHERE (:status IS NULL OR :status = '' OR STATUS = :status)
          AND (:basisWeight IS NULL OR BASIS_WEIGHT = :basisWeight)
          AND (:machineNo IS NULL OR :machineNo = '' OR MACHINE_ID IN
               (SELECT MACHINE_ID FROM aps_machine WHERE MACHINE_NO = :machineNo))
        ORDER BY CREATED_AT DESC
        """,
        countQuery = """
        SELECT COUNT(*) FROM aps_combination_simulation
        WHERE (:status IS NULL OR :status = '' OR STATUS = :status)
          AND (:basisWeight IS NULL OR BASIS_WEIGHT = :basisWeight)
          AND (:machineNo IS NULL OR :machineNo = '' OR MACHINE_ID IN
               (SELECT MACHINE_ID FROM aps_machine WHERE MACHINE_NO = :machineNo))
        """,
        nativeQuery = true)
    Page<ApsCombinationSimulation> searchSimulations(@Param("status") String status,
                                                     @Param("basisWeight") BigDecimal basisWeight,
                                                     @Param("machineNo") String machineNo,
                                                     Pageable pageable);

    /** 시뮬레이션 번호 최대값 조회 (번호 채번용) */
    @Query(value = "SELECT MAX(SIMULATION_NO) FROM aps_combination_simulation", nativeQuery = true)
    String findMaxSimulationNo();
}
