-- ============================================================
-- Klean-APS 모듈: 지폭조합 및 생산계획 스케줄링
-- 실행 순서: 01_schema.sql → 02_seed_data.sql
-- DB: MariaDB 10.11+, utf8mb4
-- ============================================================

-- ============================================================
-- 1. 자재 마스터 (SAP 자재코드 기반)
-- ============================================================
CREATE TABLE IF NOT EXISTS aps_material (
    MATERIAL_ID     BIGINT          NOT NULL AUTO_INCREMENT COMMENT '자재 ID (PK)',
    MATERIAL_CODE   VARCHAR(40)     NOT NULL                COMMENT 'SAP 자재코드',
    MATERIAL_NAME   VARCHAR(200)    NOT NULL                COMMENT '자재명',
    ITEM_TYPE       CHAR(1)         NOT NULL                COMMENT '품목유형 (F=제품, H=반제품)',
    MACHINE_NO      CHAR(1)         NOT NULL                COMMENT '생산호기 (1/2/3)',
    PACKING_TYPE    CHAR(1)                                 COMMENT '포장방법 (A=Sheet속포장, B=Sheet벌크포장, NULL=Roll)',
    BASIS_WEIGHT    DECIMAL(6,2)    NOT NULL                COMMENT '평량 (g/m2)',
    PAPER_WIDTH     INT             NOT NULL                COMMENT '지폭 (mm)',
    PAPER_LENGTH    INT                                     COMMENT '지장 (mm)',
    IS_ACTIVE       TINYINT(1)      NOT NULL DEFAULT 1      COMMENT '활성 여부',
    CREATED_AT      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
    UPDATED_AT      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',
    SYNCED_AT       DATETIME                                COMMENT 'SAP 마지막 동기화일시',

    PRIMARY KEY (MATERIAL_ID),
    CONSTRAINT UK_APS_MATERIAL_CODE UNIQUE (MATERIAL_CODE),
    INDEX IDX_APS_MATERIAL_BWEIGHT (BASIS_WEIGHT),
    INDEX IDX_APS_MATERIAL_WIDTH   (PAPER_WIDTH),
    INDEX IDX_APS_MATERIAL_MACHINE (MACHINE_NO)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
  COMMENT='APS 자재 마스터 (SAP 연동)';


-- ============================================================
-- 2. 기계 마스터
-- ============================================================
CREATE TABLE IF NOT EXISTS aps_machine (
    MACHINE_ID      BIGINT          NOT NULL AUTO_INCREMENT COMMENT '기계 ID (PK)',
    MACHINE_NO      CHAR(1)         NOT NULL                COMMENT '호기 번호 (2/3)',
    MACHINE_NAME    VARCHAR(100)    NOT NULL                COMMENT '기계명',
    MAX_WIDTH       INT             NOT NULL                COMMENT '최대지폭 (mm)',
    MIN_WIDTH       INT             NOT NULL                COMMENT '최소지폭 (mm)',
    MAX_PLY_COUNT   INT             NOT NULL DEFAULT 4      COMMENT '최대 폭수',
    MIMI_WIDTH      INT             NOT NULL DEFAULT 30     COMMENT '배폭 생산 시 미미 (mm)',
    IS_ACTIVE       TINYINT(1)      NOT NULL DEFAULT 1      COMMENT '활성 여부',
    CREATED_AT      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
    UPDATED_AT      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',

    PRIMARY KEY (MACHINE_ID),
    CONSTRAINT UK_APS_MACHINE_NO UNIQUE (MACHINE_NO)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
  COMMENT='APS 기계 마스터 (호기 정보)';


-- ============================================================
-- 3. 기계별 평량 예외 조건
-- ============================================================
CREATE TABLE IF NOT EXISTS aps_machine_exception (
    EXCEPTION_ID    BIGINT          NOT NULL AUTO_INCREMENT COMMENT '예외 ID (PK)',
    MACHINE_ID      BIGINT          NOT NULL                COMMENT '기계 ID (FK)',
    BASIS_WEIGHT    DECIMAL(6,2)    NOT NULL                COMMENT '예외 적용 평량 (g/m2)',
    MAX_WIDTH       INT             NOT NULL                COMMENT '예외 최대지폭 (mm)',
    REMARK          VARCHAR(300)                            COMMENT '비고',
    CREATED_AT      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',

    PRIMARY KEY (EXCEPTION_ID),
    CONSTRAINT FK_APS_MACH_EX_MACHINE FOREIGN KEY (MACHINE_ID) REFERENCES aps_machine (MACHINE_ID),
    INDEX IDX_APS_MACH_EX_MACHINE (MACHINE_ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
  COMMENT='APS 기계별 평량 예외 조건 (예: 3호기 300/500/550g → 3,410mm)';


-- ============================================================
-- 4. SAP 판매오더 헤더
-- ============================================================
CREATE TABLE IF NOT EXISTS aps_sales_order (
    ORDER_ID        BIGINT          NOT NULL AUTO_INCREMENT COMMENT '판매오더 ID (PK)',
    SAP_ORDER_NO    VARCHAR(20)     NOT NULL                COMMENT 'SAP 판매오더번호',
    ORDER_TYPE      VARCHAR(20)     NOT NULL                COMMENT '오더유형 (내수/수출/일본수출/특수지 등)',
    CUSTOMER_CODE   VARCHAR(20)                             COMMENT '고객코드',
    CUSTOMER_NAME   VARCHAR(200)                            COMMENT '고객명',
    ORDER_DATE      DATE            NOT NULL                COMMENT '오더일자',
    DUE_DATE        DATE                                    COMMENT '납기일자',
    MATERIAL_CODE   VARCHAR(40)     NOT NULL                COMMENT 'SAP 자재코드',
    MATERIAL_ID     BIGINT                                  COMMENT '자재 ID (FK, 동기화 후 설정)',
    BASIS_WEIGHT    DECIMAL(6,2)    NOT NULL                COMMENT '평량 (g/m2)',
    PAPER_WIDTH     INT             NOT NULL                COMMENT '지폭 (mm)',
    PAPER_LENGTH    INT                                     COMMENT '지장 (mm)',
    ORDER_QTY       DECIMAL(14,3)   NOT NULL                COMMENT '오더수량',
    ORDER_UNIT      VARCHAR(5)      NOT NULL DEFAULT 'TON'  COMMENT '수량단위 (TON/R)',
    ORDER_QTY_TON   DECIMAL(14,3)                           COMMENT '환산수량 (TON)',
    STATUS          VARCHAR(20)     NOT NULL DEFAULT 'OPEN' COMMENT '오더상태 (OPEN/ASSIGNED/COMPLETED)',
    IS_EXCLUDED     TINYINT(1)      NOT NULL DEFAULT 0      COMMENT '조합 제외 여부 (예외오더)',
    EXCLUDE_REASON  VARCHAR(300)                            COMMENT '제외 사유',
    REMARK          VARCHAR(500)                            COMMENT '비고',
    SYNCED_AT       DATETIME                                COMMENT 'SAP 동기화일시',
    CREATED_AT      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
    UPDATED_AT      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',

    PRIMARY KEY (ORDER_ID),
    CONSTRAINT UK_APS_SALES_ORDER_SAP UNIQUE (SAP_ORDER_NO),
    CONSTRAINT FK_APS_SO_MATERIAL FOREIGN KEY (MATERIAL_ID) REFERENCES aps_material (MATERIAL_ID),
    INDEX IDX_APS_SO_STATUS      (STATUS),
    INDEX IDX_APS_SO_MATERIAL    (MATERIAL_CODE),
    INDEX IDX_APS_SO_DUE_DATE    (DUE_DATE),
    INDEX IDX_APS_SO_BWEIGHT     (BASIS_WEIGHT)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
  COMMENT='APS SAP 판매오더 헤더';


-- ============================================================
-- 5. 지폭조합 시뮬레이션 헤더
-- ============================================================
CREATE TABLE IF NOT EXISTS aps_combination_simulation (
    SIMULATION_ID   BIGINT          NOT NULL AUTO_INCREMENT COMMENT '시뮬레이션 ID (PK)',
    SIMULATION_NO   VARCHAR(30)     NOT NULL                COMMENT '시뮬레이션 번호 (자동생성)',
    MACHINE_ID      BIGINT          NOT NULL                COMMENT '기계 ID (FK)',
    BASIS_WEIGHT    DECIMAL(6,2)    NOT NULL                COMMENT '평량 (g/m2)',
    PAPER_TYPE      VARCHAR(10)     NOT NULL                COMMENT '종이유형 (ROLL=원지, SHEET=시트)',
    TOTAL_WIDTH     INT             NOT NULL                COMMENT '합계지폭 (mm)',
    PLY_COUNT       INT             NOT NULL                COMMENT '폭수',
    JUMBO_ROLL_COUNT INT            NOT NULL DEFAULT 1      COMMENT '점보롤 수량',
    TOTAL_WEIGHT_TON DECIMAL(14,3)                          COMMENT '총 생산중량 (TON)',
    LOSS_MM         INT             NOT NULL DEFAULT 0      COMMENT 'Loss 지폭 (mm)',
    LOSS_PERCENT    DECIMAL(5,2)    NOT NULL DEFAULT 0.00   COMMENT 'Loss 비율 (%)',
    STATUS          VARCHAR(20)     NOT NULL DEFAULT 'DRAFT' COMMENT '상태 (DRAFT=초안/CONFIRMED=확정/CANCELLED=취소)',
    AI_ANALYSIS     LONGTEXT                                COMMENT 'AI 분석 결과 (JSON 또는 텍스트)',
    AI_PROMPT       TEXT                                    COMMENT 'AI 분석 요청 프롬프트',
    CONFIRMED_AT    DATETIME                                COMMENT '확정일시',
    CONFIRMED_BY    VARCHAR(50)                             COMMENT '확정자 ID',
    CANCELLED_AT    DATETIME                                COMMENT '취소일시',
    REMARK          VARCHAR(500)                            COMMENT '비고',
    CREATED_BY      VARCHAR(50)                             COMMENT '생성자 ID',
    CREATED_AT      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
    UPDATED_AT      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',

    PRIMARY KEY (SIMULATION_ID),
    CONSTRAINT UK_APS_SIM_NO UNIQUE (SIMULATION_NO),
    CONSTRAINT FK_APS_SIM_MACHINE FOREIGN KEY (MACHINE_ID) REFERENCES aps_machine (MACHINE_ID),
    INDEX IDX_APS_SIM_STATUS    (STATUS),
    INDEX IDX_APS_SIM_BWEIGHT   (BASIS_WEIGHT),
    INDEX IDX_APS_SIM_MACHINE   (MACHINE_ID),
    INDEX IDX_APS_SIM_CREATED   (CREATED_AT)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
  COMMENT='APS 지폭조합 시뮬레이션 헤더';


-- ============================================================
-- 6. 지폭조합 시뮬레이션 라인 (폭별 상세)
-- ============================================================
CREATE TABLE IF NOT EXISTS aps_combination_line (
    LINE_ID         BIGINT          NOT NULL AUTO_INCREMENT COMMENT '라인 ID (PK)',
    SIMULATION_ID   BIGINT          NOT NULL                COMMENT '시뮬레이션 ID (FK)',
    LINE_SEQ        INT             NOT NULL                COMMENT '라인 순번',
    ORDER_ID        BIGINT                                  COMMENT '판매오더 ID (FK)',
    SAP_ORDER_NO    VARCHAR(20)                             COMMENT 'SAP 판매오더번호',
    MATERIAL_CODE   VARCHAR(40)                             COMMENT 'SAP 자재코드',
    PAPER_WIDTH     INT             NOT NULL                COMMENT '지폭 (mm)',
    ASSIGNED_QTY    DECIMAL(14,3)   NOT NULL                COMMENT '배정수량 (TON)',
    IS_DOUBLE_PLY   TINYINT(1)      NOT NULL DEFAULT 0      COMMENT '배폭 여부',
    IS_MIN_ORDER_QTY TINYINT(1)     NOT NULL DEFAULT 0      COMMENT 'MOQ 이하 여부',
    LINE_TYPE       VARCHAR(20)     NOT NULL DEFAULT 'ORDER' COMMENT '라인 유형 (ORDER=일반오더/STOCK=재고대체/LOSS=손실)',
    REMARK          VARCHAR(300)                            COMMENT '비고',
    CREATED_AT      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',

    PRIMARY KEY (LINE_ID),
    CONSTRAINT FK_APS_LINE_SIM     FOREIGN KEY (SIMULATION_ID) REFERENCES aps_combination_simulation (SIMULATION_ID),
    CONSTRAINT FK_APS_LINE_ORDER   FOREIGN KEY (ORDER_ID)      REFERENCES aps_sales_order (ORDER_ID),
    INDEX IDX_APS_LINE_SIM   (SIMULATION_ID),
    INDEX IDX_APS_LINE_ORDER (ORDER_ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
  COMMENT='APS 지폭조합 시뮬레이션 라인 (폭별 상세)';


-- ============================================================
-- 7. 지폭조합 제약조건 설정
-- ============================================================
CREATE TABLE IF NOT EXISTS aps_constraint_config (
    CONFIG_ID       BIGINT          NOT NULL AUTO_INCREMENT COMMENT '설정 ID (PK)',
    CONFIG_KEY      VARCHAR(100)    NOT NULL                COMMENT '설정 키',
    CONFIG_VALUE    VARCHAR(500)    NOT NULL                COMMENT '설정 값',
    CONFIG_GROUP    VARCHAR(50)     NOT NULL DEFAULT 'GENERAL' COMMENT '설정 그룹 (GENERAL/MACHINE/EXCEPTION)',
    MACHINE_NO      CHAR(1)                                 COMMENT '적용 호기 (NULL=전체)',
    DATA_TYPE       VARCHAR(20)     NOT NULL DEFAULT 'STRING' COMMENT '데이터 타입 (STRING/INTEGER/DECIMAL/BOOLEAN)',
    DESCRIPTION     VARCHAR(300)                            COMMENT '설정 설명',
    IS_ACTIVE       TINYINT(1)      NOT NULL DEFAULT 1      COMMENT '활성 여부',
    CREATED_AT      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
    UPDATED_AT      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',

    PRIMARY KEY (CONFIG_ID),
    CONSTRAINT UK_APS_CONSTRAINT_KEY_MACHINE UNIQUE (CONFIG_KEY, MACHINE_NO),
    INDEX IDX_APS_CONSTRAINT_GROUP  (CONFIG_GROUP),
    INDEX IDX_APS_CONSTRAINT_ACTIVE (IS_ACTIVE)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
  COMMENT='APS 지폭조합 제약조건 설정';


-- ============================================================
-- 8. SAP 생산오더 전달 이력
-- ============================================================
CREATE TABLE IF NOT EXISTS aps_production_order (
    PROD_ORDER_ID   BIGINT          NOT NULL AUTO_INCREMENT COMMENT '생산오더 ID (PK)',
    SIMULATION_ID   BIGINT          NOT NULL                COMMENT '시뮬레이션 ID (FK)',
    SAP_PROD_ORDER  VARCHAR(20)                             COMMENT 'SAP 생산오더번호 (SAP 반환값)',
    MACHINE_ID      BIGINT          NOT NULL                COMMENT '기계 ID (FK)',
    MACHINE_NO      CHAR(1)         NOT NULL                COMMENT '호기 번호',
    BASIS_WEIGHT    DECIMAL(6,2)    NOT NULL                COMMENT '평량 (g/m2)',
    TOTAL_WIDTH     INT             NOT NULL                COMMENT '합계지폭 (mm)',
    PLY_COUNT       INT             NOT NULL                COMMENT '폭수',
    PLANNED_QTY_TON DECIMAL(14,3)   NOT NULL                COMMENT '계획수량 (TON)',
    SEND_STATUS     VARCHAR(20)     NOT NULL DEFAULT 'PENDING' COMMENT '전송상태 (PENDING/SUCCESS/FAILED)',
    SEND_REQUEST    LONGTEXT                                COMMENT 'SAP 전송 요청 데이터 (JSON)',
    SEND_RESPONSE   LONGTEXT                                COMMENT 'SAP 전송 응답 데이터 (JSON)',
    SENT_AT         DATETIME                                COMMENT 'SAP 전송일시',
    SENT_BY         VARCHAR(50)                             COMMENT '전송자 ID',
    ERROR_MSG       TEXT                                    COMMENT '오류 메시지',
    CREATED_AT      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
    UPDATED_AT      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',

    PRIMARY KEY (PROD_ORDER_ID),
    CONSTRAINT FK_APS_PO_SIM     FOREIGN KEY (SIMULATION_ID) REFERENCES aps_combination_simulation (SIMULATION_ID),
    CONSTRAINT FK_APS_PO_MACHINE FOREIGN KEY (MACHINE_ID)    REFERENCES aps_machine (MACHINE_ID),
    INDEX IDX_APS_PO_SIM     (SIMULATION_ID),
    INDEX IDX_APS_PO_STATUS  (SEND_STATUS),
    INDEX IDX_APS_PO_SENT_AT (SENT_AT)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
  COMMENT='APS SAP 생산오더 전달 이력';


-- ============================================================
-- 9. AI 분석 이력
-- ============================================================
CREATE TABLE IF NOT EXISTS aps_ai_analysis_log (
    LOG_ID          BIGINT          NOT NULL AUTO_INCREMENT COMMENT '로그 ID (PK)',
    SIMULATION_ID   BIGINT          NOT NULL                COMMENT '시뮬레이션 ID (FK)',
    PROMPT          TEXT            NOT NULL                COMMENT '사용자 입력 프롬프트',
    ANALYSIS_RESULT LONGTEXT        NOT NULL                COMMENT 'AI 분석 결과',
    MODEL_USED      VARCHAR(100)                            COMMENT '사용된 AI 모델명',
    TOKEN_USED      INT                                     COMMENT '사용된 토큰 수',
    ELAPSED_MS      INT                                     COMMENT '응답 시간 (ms)',
    REQUESTED_BY    VARCHAR(50)                             COMMENT '요청자 ID',
    CREATED_AT      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',

    PRIMARY KEY (LOG_ID),
    CONSTRAINT FK_APS_AI_SIM FOREIGN KEY (SIMULATION_ID) REFERENCES aps_combination_simulation (SIMULATION_ID),
    INDEX IDX_APS_AI_SIM     (SIMULATION_ID),
    INDEX IDX_APS_AI_CREATED (CREATED_AT)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
  COMMENT='APS AI 분석 요청/응답 이력';
