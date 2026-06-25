package com.company.module.kleanaps.repository;

import com.company.module.kleanaps.entity.ApsMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface ApsMaterialRepository extends JpaRepository<ApsMaterial, Long> {

    Optional<ApsMaterial> findByMaterialCode(String materialCode);

    boolean existsByMaterialCode(String materialCode);

    List<ApsMaterial> findByIsActiveTrue();

    /** 호기별 활성 자재 조회 */
    List<ApsMaterial> findByMachineNoAndIsActiveTrue(String machineNo);

    /** 평량으로 자재 조회 */
    List<ApsMaterial> findByBasisWeightAndIsActiveTrue(BigDecimal basisWeight);

    /** 자재명 또는 코드 검색 */
    @Query(value = """
        SELECT * FROM aps_material
        WHERE IS_ACTIVE = 1
          AND (MATERIAL_CODE LIKE CONCAT('%', :q, '%')
               OR MATERIAL_NAME LIKE CONCAT('%', :q, '%'))
        ORDER BY MATERIAL_CODE
        """, nativeQuery = true)
    List<ApsMaterial> searchByKeyword(@Param("q") String q);

    /** 호기 + 평량으로 조회 */
    @Query(value = """
        SELECT * FROM aps_material
        WHERE MACHINE_NO = :machineNo
          AND BASIS_WEIGHT = :basisWeight
          AND IS_ACTIVE = 1
        ORDER BY PAPER_WIDTH
        """, nativeQuery = true)
    List<ApsMaterial> findByMachineNoAndBasisWeight(@Param("machineNo") String machineNo,
                                                    @Param("basisWeight") BigDecimal basisWeight);
}
