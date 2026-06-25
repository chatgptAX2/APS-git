package com.company.module.kleanaps.repository;

import com.company.module.kleanaps.entity.ApsConstraintConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ApsConstraintConfigRepository extends JpaRepository<ApsConstraintConfig, Long> {

    /** 키 + 호기로 설정 조회 (호기 null = 전체 공통) */
    @Query(value = """
        SELECT * FROM aps_constraint_config
        WHERE CONFIG_KEY = :configKey
          AND IS_ACTIVE = 1
          AND (MACHINE_NO = :machineNo OR MACHINE_NO IS NULL)
        ORDER BY MACHINE_NO DESC
        LIMIT 1
        """, nativeQuery = true)
    Optional<ApsConstraintConfig> findByConfigKeyAndMachineNo(@Param("configKey") String configKey,
                                                              @Param("machineNo") String machineNo);

    /** 전체 공통 설정 조회 */
    Optional<ApsConstraintConfig> findByConfigKeyAndMachineNoIsNull(String configKey);

    /** 그룹별 설정 조회 */
    List<ApsConstraintConfig> findByConfigGroupAndIsActiveTrueOrderByConfigKey(String configGroup);

    List<ApsConstraintConfig> findByIsActiveTrueOrderByConfigGroup();
}
