package com.company.module.kleanaps.repository;

import com.company.module.kleanaps.entity.ApsMachine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ApsMachineRepository extends JpaRepository<ApsMachine, Long> {

    Optional<ApsMachine> findByMachineNo(String machineNo);

    List<ApsMachine> findByIsActiveTrue();

    /** 예외조건 포함하여 조회 */
    @Query("SELECT m FROM ApsMachine m LEFT JOIN FETCH m.exceptions WHERE m.isActive = true")
    List<ApsMachine> findAllWithExceptions();

    @Query("SELECT m FROM ApsMachine m LEFT JOIN FETCH m.exceptions WHERE m.machineNo = :machineNo")
    Optional<ApsMachine> findByMachineNoWithExceptions(String machineNo);
}
