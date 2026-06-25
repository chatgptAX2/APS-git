# Klean-APS SQL 스크립트 실행 가이드

## 실행 순서

```sql
1. 01_schema.sql   -- DDL: 테이블 생성
2. 02_seed_data.sql -- DML: 초기 데이터 (기계 마스터, 제약조건, 샘플 오더)
```

## 테이블 목록

| 테이블명 | 설명 |
|---|---|
| `aps_material` | SAP 자재 마스터 |
| `aps_machine` | 기계 마스터 (2호기/3호기) |
| `aps_machine_exception` | 기계별 평량 예외 조건 |
| `aps_sales_order` | SAP 판매오더 |
| `aps_combination_simulation` | 지폭조합 시뮬레이션 헤더 |
| `aps_combination_line` | 지폭조합 시뮬레이션 라인 |
| `aps_constraint_config` | 제약조건 설정 |
| `aps_production_order` | SAP 생산오더 전달 이력 |
| `aps_ai_analysis_log` | AI 분석 요청/응답 이력 |

## 주요 제약조건 (초기값)

| 설정 키 | 값 | 설명 |
|---|---|---|
| MOQ_TON | 3 TON | 규격당 최소주문수량 |
| MIN_PRODUCTION_WIDTH | 625 mm | 생산 가능 최소 밀롤 지폭 |
| ROLL_MIN_RATIO | 60% | 원지 최소 비중 |
| 4PLY_MIN_WIDTH | 630 mm | 2호기 4폭 시 1폭 최소 지폭 |

## 플랫폼 통합 (3줄 수정)

```
① settings.gradle → include 'module-klean-aps' 추가
② app/build.gradle → implementation project(':module-klean-aps') 추가
③ DB에 01_schema.sql → 02_seed_data.sql 순서로 실행
```

## API URL Prefix

```
/klean-aps-api/...
```
