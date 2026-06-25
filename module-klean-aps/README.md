# module-klean-aps

## 개요

**Klean-APS** — 제지회사 지폭조합(Paper Width Combination) 및 생산계획 스케줄링 모듈

> 현재 버전 (v1.0): **지폭조합** 기능 우선 구현  
> 추후 고도화: 생산계획, 스케줄링 기능

---

## 플랫폼 통합 (3줄 수정)

```
① settings.gradle    → include 'module-klean-aps'
② app/build.gradle   → implementation project(':module-klean-aps')
③ DB 스크립트 실행   → sql/module-klean-aps/01_schema.sql → 02_seed_data.sql
```

---

## 모듈 구조

```
module-klean-aps/
├── build.gradle
└── src/main/java/com/company/module/kleanaps/
    ├── controller/
    │   ├── ApsMachineController.java          # 기계 마스터 API
    │   ├── ApsMaterialController.java         # SAP 자재마스터 API
    │   ├── ApsSalesOrderController.java       # SAP 판매오더 API
    │   ├── ApsSimulationController.java       # 지폭조합 시뮬레이션 API (핵심)
    │   └── ApsConstraintController.java       # 제약조건 설정 API
    ├── dto/
    │   ├── MaterialResponse / MaterialSyncRequest
    │   ├── SalesOrderResponse / SalesOrderSyncRequest / SalesOrderExcludeRequest
    │   ├── SimulationResponse / SimulationCreateRequest / SimulationLineDto
    │   ├── AiAnalysisRequest / AiAnalysisResponse
    │   ├── ProductionOrderResponse
    │   ├── ConstraintConfigResponse / ConstraintConfigUpdateRequest
    │   └── MachineResponse
    ├── entity/
    │   ├── ApsMachine / ApsMachineException    # 기계 마스터
    │   ├── ApsMaterial                         # SAP 자재마스터
    │   ├── ApsSalesOrder                       # SAP 판매오더
    │   ├── ApsCombinationSimulation            # 지폭조합 시뮬레이션 헤더
    │   ├── ApsCombinationLine                  # 지폭조합 시뮬레이션 라인
    │   ├── ApsConstraintConfig                 # 제약조건 설정
    │   ├── ApsProductionOrder                  # SAP 생산오더 전달 이력
    │   └── ApsAiAnalysisLog                    # AI 분석 이력
    ├── repository/
    └── service/
        ├── ApsMachineService
        ├── ApsMaterialService
        ├── ApsSalesOrderService
        ├── ApsSimulationService                # 지폭조합 알고리즘 핵심
        ├── ApsConstraintService
        ├── ApsAiAnalysisService                # OpenAI 연동
        └── ApsProductionOrderService           # SAP 생산오더 전달
```

---

## DB 테이블 목록

| 테이블명 | 설명 |
|---|---|
| `aps_machine` | 기계 마스터 (2호기/3호기) |
| `aps_machine_exception` | 기계별 평량 예외 조건 |
| `aps_material` | SAP 자재마스터 |
| `aps_sales_order` | SAP 판매오더 |
| `aps_combination_simulation` | 지폭조합 시뮬레이션 헤더 |
| `aps_combination_line` | 지폭조합 시뮬레이션 라인 |
| `aps_constraint_config` | 제약조건 설정 |
| `aps_production_order` | SAP 생산오더 전달 이력 |
| `aps_ai_analysis_log` | AI 분석 요청/응답 이력 |

---

## API 엔드포인트

모든 API는 JWT 인증 필요. ADMIN 권한 필요 항목은 별도 표기.

### 기계 마스터
| Method | URL | 설명 |
|---|---|---|
| GET | `/klean-aps-api/machines` | 기계 목록 (예외조건 포함) |
| GET | `/klean-aps-api/machines/{machineId}` | 기계 단건 |
| GET | `/klean-aps-api/machines/no/{machineNo}` | 호기 번호로 조회 |

### SAP 자재마스터
| Method | URL | 설명 | 권한 |
|---|---|---|---|
| GET | `/klean-aps-api/materials` | 자재 목록 (검색) | - |
| GET | `/klean-aps-api/materials/{materialId}` | 자재 단건 | - |
| GET | `/klean-aps-api/materials/code/{code}` | 자재코드로 조회 | - |
| GET | `/klean-aps-api/materials/by-machine` | 호기+평량으로 조회 | - |
| POST | `/klean-aps-api/materials/sync` | SAP 동기화 (Upsert) | ADMIN |
| PATCH | `/klean-aps-api/materials/{id}/deactivate` | 비활성화 | ADMIN |

### SAP 판매오더
| Method | URL | 설명 | 권한 |
|---|---|---|---|
| GET | `/klean-aps-api/sales-orders` | 판매오더 목록 | - |
| GET | `/klean-aps-api/sales-orders/{orderId}` | 오더 단건 | - |
| GET | `/klean-aps-api/sales-orders/summary/basis-weight` | 평량별 집계 | - |
| POST | `/klean-aps-api/sales-orders/sync` | SAP 동기화 | ADMIN |
| PATCH | `/klean-aps-api/sales-orders/{id}/exclude` | 예외 처리 | ADMIN |
| PATCH | `/klean-aps-api/sales-orders/{id}/include` | 예외 해제 | ADMIN |

### 지폭조합 시뮬레이션
| Method | URL | 설명 | 버튼 | 권한 |
|---|---|---|---|---|
| GET | `/klean-aps-api/simulations` | 시뮬레이션 목록 | - | - |
| GET | `/klean-aps-api/simulations/{id}` | 시뮬레이션 단건 | - | - |
| POST | `/klean-aps-api/simulations` | **시뮬레이션 생성** | **[생성]** | - |
| PATCH | `/klean-aps-api/simulations/{id}/confirm` | **확정** | **[확정]** | ADMIN |
| PATCH | `/klean-aps-api/simulations/{id}/cancel-confirm` | **확정취소** | **[확정취소]** | ADMIN |
| POST | `/klean-aps-api/simulations/{id}/ai-analysis` | AI 분석 요청 | - | - |
| GET | `/klean-aps-api/simulations/{id}/ai-analysis` | AI 분석 이력 | - | - |
| POST | `/klean-aps-api/simulations/{id}/send-to-sap` | **SAP 생산오더 전달** | **[오더생성]** | ADMIN |
| GET | `/klean-aps-api/simulations/{id}/production-orders` | 생산오더 이력 | - | - |

### 제약조건 설정
| Method | URL | 설명 | 권한 |
|---|---|---|---|
| GET | `/klean-aps-api/constraints` | 전체 목록 | - |
| GET | `/klean-aps-api/constraints/group/{group}` | 그룹별 조회 | - |
| PUT | `/klean-aps-api/constraints/{configId}` | 수정 | ADMIN |

---

## 지폭조합 시뮬레이션 상태 전이

```
[생성 버튼]         [확정 버튼]
  ────────→  DRAFT  ────────→  CONFIRMED
                 ↑                 │
                 └─────────────────┘
               [확정취소 버튼]      │
                                   ↓
                           [오더생성 버튼]
                           SAP 생산오더 전달
```

---

## 기계 규정 요약

| 구분 | 2호기 | 3호기 |
|---|---|---|
| 최대지폭 | 2,520mm | 3,420mm |
| 최소지폭 | 2,400mm | 3,300mm |
| 예외 최대지폭 | - | 300/500/550g → 3,410mm |
| 최대 폭수 | 4폭 | 4폭 |
| 4폭 조건 | 1폭 ≥ 630mm | 없음 |
| 미미 | 30mm (배폭 시) | 30mm (배폭 시) |

---

## 환경변수 설정 (application.properties)

```properties
# AI 분석 설정
klean.aps.ai.api-key=YOUR_OPENAI_API_KEY
klean.aps.ai.api-url=https://api.openai.com/v1/chat/completions
klean.aps.ai.model=gpt-4o

# SAP 연동 설정
klean.aps.sap.api-url=https://your-sap-server/api/production-orders
klean.aps.sap.api-key=YOUR_SAP_API_KEY
klean.aps.sap.mock-mode=true   # 개발 시 true, 운영 시 false
```

---

## 자재코드 파싱 규칙

```
자재코드: F  2  2  A  220  0787  0000
          │  │  │  │   │    │     └─ 지장 (MID 14,4)
          │  │  │  │   │    └─────── 지폭 (MID 10,4)
          │  │  │  │   └──────────── 평량 (MID 6,3)
          │  │  │  └──────────────── 포장방법 (RIGHT 1): A=속포장, B=벌크, null=Roll
          │  │  └─────────────────── 재질코드 (예시)
          │  └────────────────────── 호기 (MID 2,1): 1/2/3
          └───────────────────────── 품목유형 (LEFT 1): F=제품, H=반제품
```

---

## 주요 제약조건 (DB 설정값, 변경 가능)

| 키 | 기본값 | 설명 |
|---|---|---|
| `MOQ_TON` | 3 TON | 규격당 최소주문수량 |
| `MOQ_SAME_SPEC_TON` | 1.5 TON | 동일규격 다른포장 MOQ |
| `MIN_PRODUCTION_WIDTH` | 625 mm | 생산가능 최소 밀롤 지폭 |
| `ROLL_MIN_RATIO` | 60 % | 원지 최소 비중 |
| `DOUBLE_PLY_MIN_RATIO` | 30 % | 배폭 진행 최소 비중 |
| `SHEET_MIN_PLY_WIDTH` | 545 mm | 단폭 불가, 배폭 필수 기준 |
| `SHEET_MAX_DOUBLE_WIDTH` | 889 mm | 2폭 불가 초과 기준 |
| `4PLY_MIN_WIDTH` (2호기) | 630 mm | 4폭 시 1폭 최소 지폭 |
