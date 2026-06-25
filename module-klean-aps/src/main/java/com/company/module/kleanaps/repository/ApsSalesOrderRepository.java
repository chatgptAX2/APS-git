package com.company.module.kleanaps.repository;

import com.company.module.kleanaps.entity.ApsSalesOrder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ApsSalesOrderRepository extends JpaRepository<ApsSalesOrder, Long> {

    Optional<ApsSalesOrder> findBySapOrderNo(String sapOrderNo);

    boolean existsBySapOrderNo(String sapOrderNo);

    /** 상태별 오더 조회 */
    List<ApsSalesOrder> findByStatusAndIsExcludedFalse(String status);

    /** 지폭조합 대상 오더 조회 (OPEN, 제외 제외) */
    @Query(value = """
        SELECT * FROM aps_sales_order
        WHERE STATUS = 'OPEN'
          AND IS_EXCLUDED = 0
          AND BASIS_WEIGHT = :basisWeight
        ORDER BY DUE_DATE, ORDER_ID
        """, nativeQuery = true)
    List<ApsSalesOrder> findOpenOrdersByBasisWeight(@Param("basisWeight") BigDecimal basisWeight);

    /** 납기일 범위 + 평량으로 오더 조회 */
    @Query(value = """
        SELECT * FROM aps_sales_order
        WHERE STATUS = 'OPEN'
          AND IS_EXCLUDED = 0
          AND (:basisWeight IS NULL OR BASIS_WEIGHT = :basisWeight)
          AND (:dueDateFrom IS NULL OR DUE_DATE >= :dueDateFrom)
          AND (:dueDateTo   IS NULL OR DUE_DATE <= :dueDateTo)
        ORDER BY DUE_DATE, BASIS_WEIGHT, PAPER_WIDTH
        """, nativeQuery = true)
    List<ApsSalesOrder> findOpenOrdersByFilter(@Param("basisWeight") BigDecimal basisWeight,
                                              @Param("dueDateFrom") LocalDate dueDateFrom,
                                              @Param("dueDateTo")   LocalDate dueDateTo);

    /** 검색 (SAP오더번호/고객명/자재코드) + 페이징 */
    @Query(value = """
        SELECT * FROM aps_sales_order
        WHERE (:q IS NULL OR :q = ''
               OR SAP_ORDER_NO LIKE CONCAT('%', :q, '%')
               OR CUSTOMER_NAME LIKE CONCAT('%', :q, '%')
               OR MATERIAL_CODE LIKE CONCAT('%', :q, '%'))
          AND (:status IS NULL OR :status = '' OR STATUS = :status)
        ORDER BY ORDER_DATE DESC, ORDER_ID DESC
        """,
        countQuery = """
        SELECT COUNT(*) FROM aps_sales_order
        WHERE (:q IS NULL OR :q = ''
               OR SAP_ORDER_NO LIKE CONCAT('%', :q, '%')
               OR CUSTOMER_NAME LIKE CONCAT('%', :q, '%')
               OR MATERIAL_CODE LIKE CONCAT('%', :q, '%'))
          AND (:status IS NULL OR :status = '' OR STATUS = :status)
        """,
        nativeQuery = true)
    Page<ApsSalesOrder> searchOrders(@Param("q") String q,
                                     @Param("status") String status,
                                     Pageable pageable);

    /** 오더유형 목록 (중복 제거) */
    @Query(value = "SELECT DISTINCT ORDER_TYPE FROM aps_sales_order ORDER BY ORDER_TYPE", nativeQuery = true)
    List<String> findDistinctOrderTypes();

    /** 평량별 오더 건수 집계 */
    @Query(value = """
        SELECT BASIS_WEIGHT, COUNT(*) AS CNT, SUM(ORDER_QTY_TON) AS TOTAL_TON
        FROM aps_sales_order
        WHERE STATUS = 'OPEN' AND IS_EXCLUDED = 0
        GROUP BY BASIS_WEIGHT
        ORDER BY BASIS_WEIGHT
        """, nativeQuery = true)
    List<Object[]> aggregateOpenOrdersByBasisWeight();
}
