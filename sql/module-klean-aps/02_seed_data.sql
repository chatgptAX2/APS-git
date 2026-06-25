-- ============================================================
-- Klean-APS 모듈: 초기 데이터 (Seed Data)
-- 실행 순서: 01_schema.sql 실행 후 이 파일 실행
-- ============================================================

-- ============================================================
-- 1. 기계 마스터 초기 데이터
-- ============================================================
INSERT INTO aps_machine (MACHINE_NO, MACHINE_NAME, MAX_WIDTH, MIN_WIDTH, MAX_PLY_COUNT, MIMI_WIDTH, IS_ACTIVE)
VALUES
    ('2', '2호기', 2520, 2400, 4, 30, 1),
    ('3', '3호기', 3420, 3300, 4, 30, 1)
ON DUPLICATE KEY UPDATE
    MACHINE_NAME  = VALUES(MACHINE_NAME),
    MAX_WIDTH     = VALUES(MAX_WIDTH),
    MIN_WIDTH     = VALUES(MIN_WIDTH),
    MAX_PLY_COUNT = VALUES(MAX_PLY_COUNT),
    MIMI_WIDTH    = VALUES(MIMI_WIDTH);

-- ============================================================
-- 2. 기계별 평량 예외 조건 초기 데이터
-- (3호기: 300/500/550 g/m2 → 최대 3,410mm)
-- ============================================================
INSERT INTO aps_machine_exception (MACHINE_ID, BASIS_WEIGHT, MAX_WIDTH, REMARK)
SELECT m.MACHINE_ID, 300.00, 3410, '3호기 300g/m2 예외: 최대 3,410mm 적용'
  FROM aps_machine m WHERE m.MACHINE_NO = '3'
ON DUPLICATE KEY UPDATE MAX_WIDTH = 3410;

INSERT INTO aps_machine_exception (MACHINE_ID, BASIS_WEIGHT, MAX_WIDTH, REMARK)
SELECT m.MACHINE_ID, 500.00, 3410, '3호기 500g/m2 예외: 최대 3,410mm 적용'
  FROM aps_machine m WHERE m.MACHINE_NO = '3'
ON DUPLICATE KEY UPDATE MAX_WIDTH = 3410;

INSERT INTO aps_machine_exception (MACHINE_ID, BASIS_WEIGHT, MAX_WIDTH, REMARK)
SELECT m.MACHINE_ID, 550.00, 3410, '3호기 550g/m2 예외: 최대 3,410mm 적용'
  FROM aps_machine m WHERE m.MACHINE_NO = '3'
ON DUPLICATE KEY UPDATE MAX_WIDTH = 3410;

-- ============================================================
-- 3. 제약조건 설정 초기 데이터
-- ============================================================
INSERT INTO aps_constraint_config (CONFIG_KEY, CONFIG_VALUE, CONFIG_GROUP, MACHINE_NO, DATA_TYPE, DESCRIPTION)
VALUES
    -- 공통 제약조건
    ('MOQ_TON',                 '3',    'GENERAL', NULL, 'DECIMAL', 'MOQ 최소주문수량 (규격당, TON)'),
    ('MOQ_SAME_SPEC_TON',       '1.5',  'GENERAL', NULL, 'DECIMAL', 'MOQ: 동일 규격, 포장만 다를 때 (TON)'),
    ('MIN_PRODUCTION_WIDTH',    '625',  'GENERAL', NULL, 'INTEGER', '생산 가능 최소 밀롤 지폭 (mm) - 이하 시 생산 불가'),
    ('SHEET_MIN_PLY_WIDTH',     '545',  'GENERAL', NULL, 'INTEGER', '1폭 생산 불가 최소 시트 지폭 (mm) - 배폭 필수'),
    ('SHEET_MAX_DOUBLE_WIDTH',  '889',  'GENERAL', NULL, 'INTEGER', '2폭 생산 불가 시트 지폭 초과 기준 (mm)'),
    ('SHEET_DOUBLE_MAX_TON',    '5',    'GENERAL', NULL, 'DECIMAL', '889폭 2폭 배폭 허용 최대 중량 (TON)'),
    ('ROLL_MIN_RATIO',          '60',   'GENERAL', NULL, 'DECIMAL', '원지(Roll) 최소 비중 (%) - 미만 시 원지 조합 불가'),
    ('DOUBLE_PLY_MIN_RATIO',    '30',   'GENERAL', NULL, 'DECIMAL', '배폭 최소 비중 (%) - 이상 시 배폭 조합 진행'),
    -- 2호기 제약조건
    ('4PLY_MIN_WIDTH',          '630',  'MACHINE', '2',  'INTEGER', '2호기 4폭 시 1폭 최소 지폭 (mm)'),
    -- AI 분석 설정
    ('AI_MODEL',                'gpt-4o', 'GENERAL', NULL, 'STRING', 'AI 분석에 사용할 모델명'),
    ('AI_MAX_TOKEN',            '2000', 'GENERAL', NULL, 'INTEGER', 'AI 분석 최대 토큰 수')
ON DUPLICATE KEY UPDATE
    CONFIG_VALUE = VALUES(CONFIG_VALUE),
    DESCRIPTION  = VALUES(DESCRIPTION);

-- ============================================================
-- 4. 테스트용 자재 마스터 샘플 데이터
-- 자재코드 구성: [품목유형1][호기1][재질2][평량3][지폭4][지장4]
-- 예: F2A220 0787 0000 → F(제품), 2(2호기), A(Sheet속포장), 220(평량), 0787(지폭), 0000(지장)
-- ============================================================
INSERT INTO aps_material (MATERIAL_CODE, MATERIAL_NAME, ITEM_TYPE, MACHINE_NO, PACKING_TYPE, BASIS_WEIGHT, PAPER_WIDTH, PAPER_LENGTH, IS_ACTIVE)
VALUES
    ('F22A2200787', '백상지 2호기 220g 787mm Sheet속포장',  'F', '2', 'A', 220.00, 787,  0, 1),
    ('F22B2200787', '백상지 2호기 220g 787mm Sheet벌크포장','F', '2', 'B', 220.00, 787,  0, 1),
    ('F22 2200787', '백상지 2호기 220g 787mm Roll',         'F', '2', NULL,220.00, 787,  0, 1),
    ('F23A2200900', '백상지 3호기 220g 900mm Sheet속포장',  'F', '3', 'A', 220.00, 900,  0, 1),
    ('F23 2200900', '백상지 3호기 220g 900mm Roll',         'F', '3', NULL,220.00, 900,  0, 1),
    ('H22 1570840', '반제품 2호기 157g 840mm Roll',         'H', '2', NULL,157.00, 840,  0, 1),
    ('H23 3001000', '반제품 3호기 300g 1000mm Roll',        'H', '3', NULL,300.00, 1000, 0, 1)
ON DUPLICATE KEY UPDATE
    MATERIAL_NAME = VALUES(MATERIAL_NAME),
    IS_ACTIVE     = VALUES(IS_ACTIVE);

-- ============================================================
-- 5. 테스트용 판매오더 샘플 데이터
-- ============================================================
INSERT INTO aps_sales_order
    (SAP_ORDER_NO, ORDER_TYPE, CUSTOMER_CODE, CUSTOMER_NAME, ORDER_DATE, DUE_DATE,
     MATERIAL_CODE, BASIS_WEIGHT, PAPER_WIDTH, PAPER_LENGTH, ORDER_QTY, ORDER_UNIT, ORDER_QTY_TON, STATUS)
VALUES
    ('1000000001', '내수', 'CUST001', '(주)한국제지', '2026-06-25', '2026-07-10',
     'F22A2200787', 220.00, 787, 0, 10.000, 'TON', 10.000, 'OPEN'),
    ('1000000002', '내수', 'CUST001', '(주)한국제지', '2026-06-25', '2026-07-10',
     'F22B2200787', 220.00, 787, 0, 8.500,  'TON', 8.500,  'OPEN'),
    ('1000000003', '내수', 'CUST002', '대한인쇄(주)', '2026-06-25', '2026-07-15',
     'F22A2200787', 220.00, 787, 0, 5.000,  'TON', 5.000,  'OPEN'),
    ('1000000004', '수출', 'CUST003', 'ABC Export Co.','2026-06-25', '2026-07-20',
     'F23A2200900', 220.00, 900, 0, 20.000, 'TON', 20.000, 'OPEN'),
    ('1000000005', '내수', 'CUST004', '서울포장(주)', '2026-06-25', '2026-07-12',
     'F23 2200900', 220.00, 900, 0, 15.000, 'TON', 15.000, 'OPEN')
ON DUPLICATE KEY UPDATE
    STATUS = VALUES(STATUS);
