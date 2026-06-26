import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()
app.use('*', cors())

// ============================================================
// Mock 데이터
// ============================================================
const machines = [
  { machineId: 1, machineNo: '2', machineName: '2호기' },
  { machineId: 2, machineNo: '3', machineName: '3호기' },
]

const salesOrders = [
  { orderId:1,  sapOrderNo:'4500001001', sapItemNo:'000010', orderType:'내수',    customerCode:'C001', customerName:'한솔제지㈜',       machineNo:'2', basisWeight:220, paperWidth:800,  orderQtyTon:8.500, orderQtyR:null, orderQtySok:null, unit:'TON', dueDate:'2026-07-05', orderDate:'2026-06-20', createdBy:'홍길동', status:'OPEN',     isExcluded:false },
  { orderId:2,  sapOrderNo:'4500001002', sapItemNo:'000010', orderType:'내수',    customerCode:'C002', customerName:'무림페이퍼㈜',      machineNo:'2', basisWeight:220, paperWidth:620,  orderQtyTon:5.200, orderQtyR:null, orderQtySok:null, unit:'TON', dueDate:'2026-07-06', orderDate:'2026-06-20', createdBy:'홍길동', status:'OPEN',     isExcluded:false },
  { orderId:3,  sapOrderNo:'4500001003', sapItemNo:'000010', orderType:'수출',    customerCode:'C003', customerName:'신호제지㈜',        machineNo:'2', basisWeight:220, paperWidth:700,  orderQtyTon:12.000,orderQtyR:null, orderQtySok:null, unit:'TON', dueDate:'2026-07-08', orderDate:'2026-06-21', createdBy:'이순신', status:'OPEN',     isExcluded:false },
  { orderId:4,  sapOrderNo:'4500001004', sapItemNo:'000010', orderType:'수출',    customerCode:'C004', customerName:'JK페이퍼',          machineNo:'2', basisWeight:220, paperWidth:350,  orderQtyTon:3.000, orderQtyR:null, orderQtySok:null, unit:'TON', dueDate:'2026-07-10', orderDate:'2026-06-21', createdBy:'이순신', status:'OPEN',     isExcluded:false },
  { orderId:5,  sapOrderNo:'4500001005', sapItemNo:'000010', orderType:'일본수출', customerCode:'C005', customerName:'인디아페이퍼',      machineNo:'2', basisWeight:220, paperWidth:640,  orderQtyTon:4.800, orderQtyR:null, orderQtySok:null, unit:'TON', dueDate:'2026-07-12', orderDate:'2026-06-22', createdBy:'강감찬', status:'OPEN',     isExcluded:false },
  { orderId:6,  sapOrderNo:'4500001006', sapItemNo:'000010', orderType:'내수',    customerCode:'C006', customerName:'동화지업㈜',        machineNo:'3', basisWeight:300, paperWidth:900,  orderQtyTon:9.600, orderQtyR:null, orderQtySok:null, unit:'TON', dueDate:'2026-07-07', orderDate:'2026-06-20', createdBy:'홍길동', status:'OPEN',     isExcluded:false },
  { orderId:7,  sapOrderNo:'4500001007', sapItemNo:'000010', orderType:'특수지',  customerCode:'C007', customerName:'삼원특수지㈜',      machineNo:'3', basisWeight:300, paperWidth:780,  orderQtyTon:null,  orderQtyR:1200, orderQtySok:null, unit:'R',   dueDate:'2026-07-09', orderDate:'2026-06-21', createdBy:'이순신', status:'OPEN',     isExcluded:false },
  { orderId:8,  sapOrderNo:'4500001008', sapItemNo:'000010', orderType:'내수',    customerCode:'C008', customerName:'대한제지㈜',        machineNo:'3', basisWeight:300, paperWidth:1050, orderQtyTon:15.200,orderQtyR:null, orderQtySok:null, unit:'TON', dueDate:'2026-07-11', orderDate:'2026-06-22', createdBy:'강감찬', status:'ASSIGNED', isExcluded:false },
  { orderId:9,  sapOrderNo:'4500001009', sapItemNo:'000010', orderType:'내수',    customerCode:'C009', customerName:'태림포장㈜',        machineNo:'3', basisWeight:500, paperWidth:820,  orderQtyTon:7.500, orderQtyR:null, orderQtySok:null, unit:'TON', dueDate:'2026-07-08', orderDate:'2026-06-20', createdBy:'홍길동', status:'OPEN',     isExcluded:false },
  { orderId:10, sapOrderNo:'4500001010', sapItemNo:'000010', orderType:'수출',    customerCode:'C010', customerName:'아세아제지㈜',      machineNo:'3', basisWeight:500, paperWidth:1100, orderQtyTon:null,  orderQtyR:null, orderQtySok:3500, unit:'SOK', dueDate:'2026-07-13', orderDate:'2026-06-21', createdBy:'이순신', status:'OPEN',     isExcluded:false },
  { orderId:11, sapOrderNo:'4500001011', sapItemNo:'000010', orderType:'일본수출', customerCode:'C011', customerName:'오지제지㈜',        machineNo:'2', basisWeight:220, paperWidth:760,  orderQtyTon:6.300, orderQtyR:null, orderQtySok:null, unit:'TON', dueDate:'2026-07-15', orderDate:'2026-06-23', createdBy:'강감찬', status:'OPEN',     isExcluded:false },
  { orderId:12, sapOrderNo:'4500001012', sapItemNo:'000010', orderType:'특수지',  customerCode:'C012', customerName:'화인텍㈜',          machineNo:'3', basisWeight:550, paperWidth:680,  orderQtyTon:4.200, orderQtyR:null, orderQtySok:null, unit:'TON', dueDate:'2026-07-14', orderDate:'2026-06-23', createdBy:'홍길동', status:'OPEN',     isExcluded:false },
  { orderId:13, sapOrderNo:'4500001013', sapItemNo:'000020', orderType:'내수',    customerCode:'C001', customerName:'한솔제지㈜',        machineNo:'2', basisWeight:220, paperWidth:920,  orderQtyTon:10.000,orderQtyR:null, orderQtySok:null, unit:'TON', dueDate:'2026-07-16', orderDate:'2026-06-23', createdBy:'이순신', status:'OPEN',     isExcluded:false },
  { orderId:14, sapOrderNo:'4500001014', sapItemNo:'000010', orderType:'수출',    customerCode:'C013', customerName:'해외바이어A',        machineNo:'3', basisWeight:300, paperWidth:1200, orderQtyTon:18.000,orderQtyR:null, orderQtySok:null, unit:'TON', dueDate:'2026-07-18', orderDate:'2026-06-24', createdBy:'강감찬', status:'OPEN',     isExcluded:true  },
  { orderId:15, sapOrderNo:'4500001015', sapItemNo:'000010', orderType:'내수',    customerCode:'C014', customerName:'패키징코리아㈜',    machineNo:'2', basisWeight:220, paperWidth:530,  orderQtyTon:null,  orderQtyR:800,  orderQtySok:null, unit:'R',   dueDate:'2026-07-20', orderDate:'2026-06-24', createdBy:'홍길동', status:'OPEN',     isExcluded:false },
]

// ============================================================
// API
// ============================================================
app.get('/klean-aps-api/machines', (c) => c.json({ success:true, data:machines }))

app.get('/klean-aps-api/sales-orders', (c) => {
  const q           = c.req.query('q') || ''
  const orderType   = c.req.query('orderType') || ''
  const machineNo   = c.req.query('machineNo') || ''
  const basisWeight = c.req.query('basisWeight') || ''
  const status      = c.req.query('status') || ''
  const dateFrom    = c.req.query('dateFrom') || ''
  const dateTo      = c.req.query('dateTo') || ''
  const dueFrom     = c.req.query('dueFrom') || ''
  const dueTo       = c.req.query('dueTo') || ''
  const createdBy   = c.req.query('createdBy') || ''
  const customerName    = c.req.query('customerName') || ''
  const sapOrderNo      = c.req.query('sapOrderNo') || ''
  const excludedFilter  = c.req.query('excluded') || ''

  let list = salesOrders.filter(o => {
    if (sapOrderNo   && !o.sapOrderNo.includes(sapOrderNo)) return false
    if (orderType    && o.orderType !== orderType) return false
    if (machineNo    && o.machineNo !== machineNo) return false
    if (basisWeight  && o.basisWeight !== Number(basisWeight)) return false
    if (status       && o.status !== status) return false
    if (createdBy    && !o.createdBy.includes(createdBy)) return false
    if (customerName && !o.customerName.includes(customerName)) return false
    if (dateFrom     && o.orderDate < dateFrom) return false
    if (dateTo       && o.orderDate > dateTo) return false
    if (dueFrom      && o.dueDate < dueFrom) return false
    if (dueTo        && o.dueDate > dueTo) return false
    if (q && !o.sapOrderNo.includes(q) && !o.customerName.includes(q)) return false
    if (excludedFilter === 'true'  && !o.isExcluded) return false
    if (excludedFilter === 'false' &&  o.isExcluded) return false
    return true
  })
  return c.json({ success:true, data:list, total:list.length })
})

app.patch('/klean-aps-api/sales-orders/:id/exclude', async (c) => {
  const id   = Number(c.req.param('id'))
  const body = await c.req.json()
  const o    = salesOrders.find(x => x.orderId === id)
  if (!o) return c.json({ success:false, message:'오더 없음' }, 404)
  o.isExcluded = true;(o as any).excludeReason = body.reason
  return c.json({ success:true, data:o })
})
app.patch('/klean-aps-api/sales-orders/:id/include', (c) => {
  const id = Number(c.req.param('id'))
  const o  = salesOrders.find(x => x.orderId === id)
  if (!o) return c.json({ success:false, message:'오더 없음' }, 404)
  o.isExcluded = false;(o as any).excludeReason = null
  return c.json({ success:true, data:o })
})

app.post('/klean-aps-api/sales-orders/rfc-sync', async (c) => {
  const body = await c.req.json()
  await new Promise(r => setTimeout(r, 800))
  const synced = salesOrders.filter(o => {
    if (body.orderType   && o.orderType !== body.orderType) return false
    if (body.machineNo   && o.machineNo !== body.machineNo) return false
    if (body.basisWeight && o.basisWeight !== Number(body.basisWeight)) return false
    return true
  })
  // Mock: 전체 중 20%는 이미 DB에 존재, 실패 없음
  const total      = synced.length
  const alreadyN   = Math.floor(total * 0.2)
  const failN      = 0
  const successN   = total - alreadyN - failN
  return c.json({
    success: true,
    data: synced,
    total,
    successCount : successN,
    failCount    : failN,
    alreadyCount : alreadyN,
    openCount    : synced.filter(o => o.status === 'OPEN').length,
    message      : `판매오더 불러오기 성공`
  })
})

// ============================================================
// UI
// ============================================================
app.get('*', (c) => c.html(mainHtml))

const mainHtml = `<!DOCTYPE html>
<html lang="ko" data-theme="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Klean-APS · 판매오더 관리</title>
<script src="https://cdn.tailwindcss.com"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
<style>
/* ═══════════════════════════════════════════════
   CSS 변수 — 다크 테마 (기본)
═══════════════════════════════════════════════ */
:root,
[data-theme="dark"] {
  --bg-base      : #0a0f1e;
  --bg-surface   : #0f172a;
  --bg-raised    : #050a14;
  --bg-hover     : #0f1e38;
  --bg-input     : #0a0f1e;
  --bg-select-opt: #0f172a;

  --border       : #1e293b;
  --border-focus : #3b82f6;
  --border-strong: #334155;

  --text-primary : #f1f5f9;
  --text-secondary: #e2e8f0;
  --text-muted   : #64748b;
  --text-subtle  : #475569;
  --text-faint   : #374151;
  --text-label   : #475569;

  --nav-text     : #64748b;
  --nav-hover-bg : #1e293b;
  --nav-hover-txt: #e2e8f0;
  --nav-active-bg: #1e3a5f;
  --nav-active-txt:#93c5fd;
  --nav-active-bdr:#3b82f6;
  --nav-group-txt: #374151;

  --tab-text     : #475569;
  --tab-hover    : #94a3b8;
  --tab-active   : #60a5fa;
  --tab-active-bdr:#3b82f6;

  --th-bg        : #050a14;
  --th-text      : #475569;
  --td-border    : #0d1526;
  --tr-hover     : #0f1e38;

  --stat-bg      : #050a14;

  /* 배지 */
  --badge-open-bg   : #0c2340; --badge-open-txt   : #60a5fa;
  --badge-assign-bg : #14532d; --badge-assign-txt : #4ade80;
  --badge-done-bg   : #1c1917; --badge-done-txt   : #78716c;
  --badge-cancel-bg : #3b0f0f; --badge-cancel-txt : #f87171;
  --badge-dom-bg    : #0c2340; --badge-dom-txt    : #93c5fd;
  --badge-exp-bg    : #14532d; --badge-exp-txt    : #6ee7b7;
  --badge-jpn-bg    : #3b1515; --badge-jpn-txt    : #fca5a5;
  --badge-spc-bg    : #2d1a3d; --badge-spc-txt    : #d8b4fe;
  --badge-excl-bg   : #431407; --badge-excl-txt   : #fdba74;
  --badge-ton-bg    : #172554; --badge-ton-txt    : #93c5fd;
  --badge-r-bg      : #14532d; --badge-r-txt      : #6ee7b7;
  --badge-sok-bg    : #3b0764; --badge-sok-txt    : #d8b4fe;

  /* RFC 로딩 */
  --rfc-bg       : #0c2340;
  --rfc-border   : #1e3a5f;
  --rfc-txt      : #60a5fa;

  /* 모달 */
  --modal-bg     : #0f172a;
  --modal-border : #334155;
  --modal-overlay: rgba(0,0,0,.75);

  /* 토스트 */
  --toast-ok     : #16a34a;
  --toast-err    : #dc2626;
  --toast-info   : #2563eb;

  /* 로고 */
  --logo-bg      : #2563eb;
  --logo-txt     : #ffffff;

  /* 버튼 ghost */
  --btn-ghost-bg    : transparent;
  --btn-ghost-border: #334155;
  --btn-ghost-txt   : #94a3b8;
  --btn-ghost-hover : #1e293b;
  --btn-ghost-htxt  : #e2e8f0;

  /* 스크롤바 */
  --scroll-track : #050a14;
  --scroll-thumb : #1e293b;
  --scroll-hover : #334155;

  /* 하단 버전 텍스트 */
  --ver-txt       : #1e293b;
  --ver-online    : #16a34a;

  /* 테마 토글 버튼 */
  --toggle-bg    : #1e293b;
  --toggle-border: #334155;
  --toggle-txt   : #94a3b8;
  --toggle-hover : #334155;
  --toggle-icon  : "☀️";

  /* 탑바 */
  --topbar-bg    : #0f172a;
  --topbar-border: #1e293b;

  /* 기계 배지 */
  --machine-bg   : #0c2340;
  --machine-txt  : #93c5fd;
}

/* ═══════════════════════════════════════════════
   CSS 변수 — 라이트 테마
═══════════════════════════════════════════════ */
[data-theme="light"] {
  --bg-base      : #f1f5f9;
  --bg-surface   : #ffffff;
  --bg-raised    : #f8fafc;
  --bg-hover     : #eff6ff;
  --bg-input     : #ffffff;
  --bg-select-opt: #ffffff;

  --border       : #e2e8f0;
  --border-focus : #3b82f6;
  --border-strong: #cbd5e1;

  --text-primary : #0f172a;
  --text-secondary: #1e293b;
  --text-muted   : #64748b;
  --text-subtle  : #475569;
  --text-faint   : #94a3b8;
  --text-label   : #475569;

  --nav-text     : #64748b;
  --nav-hover-bg : #f1f5f9;
  --nav-hover-txt: #1e293b;
  --nav-active-bg: #dbeafe;
  --nav-active-txt:#1d4ed8;
  --nav-active-bdr:#2563eb;
  --nav-group-txt: #94a3b8;

  --tab-text     : #64748b;
  --tab-hover    : #374151;
  --tab-active   : #1d4ed8;
  --tab-active-bdr:#2563eb;

  --th-bg        : #f8fafc;
  --th-text      : #64748b;
  --td-border    : #f1f5f9;
  --tr-hover     : #eff6ff;

  --stat-bg      : #f8fafc;

  /* 배지 */
  --badge-open-bg   : #dbeafe; --badge-open-txt   : #1d4ed8;
  --badge-assign-bg : #dcfce7; --badge-assign-txt : #15803d;
  --badge-done-bg   : #f1f5f9; --badge-done-txt   : #64748b;
  --badge-cancel-bg : #fee2e2; --badge-cancel-txt : #dc2626;
  --badge-dom-bg    : #dbeafe; --badge-dom-txt    : #1d4ed8;
  --badge-exp-bg    : #dcfce7; --badge-exp-txt    : #15803d;
  --badge-jpn-bg    : #fee2e2; --badge-jpn-txt    : #dc2626;
  --badge-spc-bg    : #f3e8ff; --badge-spc-txt    : #7c3aed;
  --badge-excl-bg   : #ffedd5; --badge-excl-txt   : #c2410c;
  --badge-ton-bg    : #dbeafe; --badge-ton-txt    : #1e40af;
  --badge-r-bg      : #dcfce7; --badge-r-txt      : #166534;
  --badge-sok-bg    : #f3e8ff; --badge-sok-txt    : #6d28d9;

  /* RFC 로딩 */
  --rfc-bg       : #dbeafe;
  --rfc-border   : #bfdbfe;
  --rfc-txt      : #1d4ed8;

  /* 모달 */
  --modal-bg     : #ffffff;
  --modal-border : #e2e8f0;
  --modal-overlay: rgba(0,0,0,.5);

  /* 토스트 */
  --toast-ok     : #16a34a;
  --toast-err    : #dc2626;
  --toast-info   : #2563eb;

  /* 로고 */
  --logo-bg      : #2563eb;
  --logo-txt     : #ffffff;

  /* 버튼 ghost */
  --btn-ghost-bg    : transparent;
  --btn-ghost-border: #cbd5e1;
  --btn-ghost-txt   : #475569;
  --btn-ghost-hover : #f1f5f9;
  --btn-ghost-htxt  : #1e293b;

  /* 스크롤바 */
  --scroll-track : #f1f5f9;
  --scroll-thumb : #cbd5e1;
  --scroll-hover : #94a3b8;

  /* 하단 버전 텍스트 */
  --ver-txt       : #cbd5e1;
  --ver-online    : #16a34a;

  /* 테마 토글 버튼 */
  --toggle-bg    : #f1f5f9;
  --toggle-border: #e2e8f0;
  --toggle-txt   : #475569;
  --toggle-hover : #e2e8f0;

  /* 탑바 */
  --topbar-bg    : #ffffff;
  --topbar-border: #e2e8f0;

  /* 기계 배지 */
  --machine-bg   : #dbeafe;
  --machine-txt  : #1d4ed8;
}

/* ═══════════════════════════════════════════════
   기본 리셋
═══════════════════════════════════════════════ */
*{box-sizing:border-box;margin:0;padding:0;}
body{
  font-family:'Malgun Gothic','Apple SD Gothic Neo',sans-serif;
  background:var(--bg-base);
  color:var(--text-secondary);
  overflow:hidden;
  transition: background .25s, color .25s;
}

/* ── 사이드바 ── */
#sidebar{
  width:224px;height:100vh;
  background:var(--bg-surface);
  border-right:1px solid var(--border);
  display:flex;flex-direction:column;flex-shrink:0;
  transition:background .25s, border-color .25s;
}
.nav-group-title{
  font-size:10px;font-weight:700;
  color:var(--nav-group-txt);
  letter-spacing:.1em;padding:14px 16px 5px;
}
.nav-item{
  display:flex;align-items:center;gap:9px;
  padding:9px 14px;cursor:pointer;font-size:13px;
  color:var(--nav-text);
  transition:all .12s;
  border-left:3px solid transparent;margin:1px 0;
}
.nav-item:hover{background:var(--nav-hover-bg);color:var(--nav-hover-txt);}
.nav-item.active{
  background:var(--nav-active-bg);
  color:var(--nav-active-txt);
  border-left-color:var(--nav-active-bdr);
  font-weight:600;
}
.nav-item i{width:16px;text-align:center;font-size:13px;}

/* ── 탑바 ── */
#topbar{
  height:46px;
  background:var(--topbar-bg);
  border-bottom:1px solid var(--topbar-border);
  display:flex;align-items:center;justify-content:flex-end;
  padding:0 24px;flex-shrink:0;
  transition:background .25s, border-color .25s;
}

/* ── 테마 토글 버튼 ── */
#theme-toggle{
  display:flex;align-items:center;gap:7px;
  padding:6px 14px;border-radius:20px;
  background:var(--toggle-bg);
  border:1px solid var(--toggle-border);
  color:var(--toggle-txt);
  font-size:12px;font-weight:600;
  cursor:pointer;
  transition:all .18s;
  user-select:none;
}
#theme-toggle:hover{
  background:var(--toggle-hover);
  color:var(--text-secondary);
}
#theme-toggle .toggle-track{
  width:34px;height:18px;
  border-radius:9px;
  background:var(--border-strong);
  position:relative;
  transition:background .25s;
  flex-shrink:0;
}
[data-theme="light"] #theme-toggle .toggle-track{
  background:#3b82f6;
}
#theme-toggle .toggle-thumb{
  position:absolute;
  top:2px;left:2px;
  width:14px;height:14px;
  border-radius:50%;
  background:#fff;
  transition:transform .25s, background .25s;
  box-shadow:0 1px 3px rgba(0,0,0,.3);
}
[data-theme="light"] #theme-toggle .toggle-thumb{
  transform:translateX(16px);
}

/* ── 메인 ── */
#main-area{flex:1;height:100vh;overflow:hidden;display:flex;flex-direction:column;}
#page-content-wrap{flex:1;overflow:hidden;position:relative;}
.page-scroll{height:100%;overflow-y:auto;padding:16px 28px 24px;}

/* ── 카드 ── */
.section-card{
  background:var(--bg-surface);
  border:1px solid var(--border);
  border-radius:12px;margin-bottom:14px;
  transition:background .25s, border-color .25s;
}

/* ── 폼 필드 ── */
.field-label{font-size:11px;font-weight:600;color:var(--text-label);margin-bottom:5px;display:block;}
.inp{
  background:var(--bg-input);
  border:1px solid var(--border);
  border-radius:7px;padding:7px 11px;
  color:var(--text-secondary);
  font-size:13px;outline:none;width:100%;
  transition:border-color .12s, background .25s, color .25s;
}
.inp:focus{border-color:var(--border-focus);box-shadow:0 0 0 2px rgba(59,130,246,.15);}
select.inp option{background:var(--bg-select-opt);}

/* ── 버튼 ── */
.btn{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;border:none;transition:all .12s;white-space:nowrap;}
.btn-primary{background:#2563eb;color:#fff;} .btn-primary:hover{background:#1d4ed8;}
.btn-success{background:#16a34a;color:#fff;} .btn-success:hover{background:#15803d;}
.btn-danger {background:#dc2626;color:#fff;} .btn-danger:hover{background:#b91c1c;}
.btn-warning{background:#d97706;color:#fff;} .btn-warning:hover{background:#b45309;}
.btn-ghost{
  background:var(--btn-ghost-bg);
  border:1px solid var(--btn-ghost-border);
  color:var(--btn-ghost-txt);
}
.btn-ghost:hover{background:var(--btn-ghost-hover);color:var(--btn-ghost-htxt);}
.btn-sm{padding:5px 11px;font-size:12px;}
.btn-xs{padding:3px 8px;font-size:11px;}
.btn:disabled{opacity:.4;cursor:not-allowed;}

/* ── 테이블 ── */
.data-table{width:100%;border-collapse:collapse;font-size:12px;}
.data-table th{
  background:var(--th-bg);
  color:var(--th-text);
  font-weight:600;padding:9px 10px;text-align:left;
  border-bottom:1px solid var(--border);
  white-space:nowrap;position:sticky;top:0;z-index:5;
  transition:background .25s, color .25s;
}
.data-table td{
  padding:8px 10px;
  border-bottom:1px solid var(--td-border);
  white-space:nowrap;
  color:var(--text-secondary);
  transition:color .25s;
}
.data-table tbody tr:hover td{background:var(--tr-hover);}
.data-table .num{text-align:right;font-family:'Courier New',monospace;}
.data-table .center{text-align:center;}

/* ── 배지 ── */
.badge{display:inline-flex;align-items:center;padding:2px 8px;border-radius:9999px;font-size:11px;font-weight:700;}
.b-open    {background:var(--badge-open-bg);   color:var(--badge-open-txt);}
.b-assigned{background:var(--badge-assign-bg); color:var(--badge-assign-txt);}
.b-complete{background:var(--badge-done-bg);   color:var(--badge-done-txt);}
.b-cancel  {background:var(--badge-cancel-bg); color:var(--badge-cancel-txt);}
.b-domestic{background:var(--badge-dom-bg);    color:var(--badge-dom-txt);}
.b-export  {background:var(--badge-exp-bg);    color:var(--badge-exp-txt);}
.b-japan   {background:var(--badge-jpn-bg);    color:var(--badge-jpn-txt);}
.b-special {background:var(--badge-spc-bg);    color:var(--badge-spc-txt);}
.b-excl    {background:var(--badge-excl-bg);   color:var(--badge-excl-txt);}
.b-ton     {background:var(--badge-ton-bg);    color:var(--badge-ton-txt);}
.b-r       {background:var(--badge-r-bg);      color:var(--badge-r-txt);}
.b-sok     {background:var(--badge-sok-bg);    color:var(--badge-sok-txt);}

/* ── 요약 스탯 ── */
.stat-mini{
  background:var(--stat-bg);
  border:1px solid var(--border);
  border-radius:8px;padding:10px 14px;
  display:flex;flex-direction:column;gap:2px;
  transition:background .25s, border-color .25s;
}
.stat-mini .sv{font-size:18px;font-weight:800;}
.stat-mini .sl{font-size:10px;color:var(--text-subtle);}

/* ── 페이지 제목 ── */
.page-header{padding:18px 28px 0;flex-shrink:0;}
.page-title{font-size:18px;font-weight:800;color:var(--text-primary);display:flex;align-items:center;gap:10px;}
.page-sub{font-size:12px;color:var(--text-subtle);margin-top:3px;}

/* ── RFC 로딩 ── */
.rfc-loading{
  display:none;align-items:center;gap:10px;
  padding:12px 16px;
  background:var(--rfc-bg);
  border:1px solid var(--rfc-border);
  border-radius:8px;font-size:13px;
  color:var(--rfc-txt);
}
.rfc-loading.show{display:flex;}
.spin{animation:spin .8s linear infinite;display:inline-block;}
@keyframes spin{to{transform:rotate(360deg);}}

/* ── 토스트 ── */
#toast{
  position:fixed;bottom:24px;right:24px;
  padding:11px 20px;border-radius:10px;
  font-size:13px;font-weight:600;
  z-index:9999;opacity:0;
  transition:opacity .25s;pointer-events:none;
}
#toast.show{opacity:1;}
#toast.ok  {background:var(--toast-ok); color:#fff;}
#toast.err {background:var(--toast-err);color:#fff;}
#toast.info{background:var(--toast-info);color:#fff;}

/* ── 모달 ── */
.modal-bg{
  display:none;position:fixed;inset:0;
  background:var(--modal-overlay);
  z-index:100;align-items:center;justify-content:center;
}
.modal-bg.show{display:flex;}
.modal{
  background:var(--modal-bg);
  border:1px solid var(--modal-border);
  border-radius:14px;padding:26px;width:460px;
  transition:background .25s, border-color .25s;
}
.modal-title{font-size:15px;font-weight:700;color:var(--text-primary);margin-bottom:16px;}

/* ── 스크롤바 ── */
::-webkit-scrollbar{width:5px;height:5px;}
::-webkit-scrollbar-track{background:var(--scroll-track);}
::-webkit-scrollbar-thumb{background:var(--scroll-thumb);border-radius:3px;}
::-webkit-scrollbar-thumb:hover{background:var(--scroll-hover);}

/* ── 체크박스 ── */
input[type=checkbox]{accent-color:#3b82f6;width:14px;height:14px;cursor:pointer;}

/* ── 필터 그리드 ── */
.filter-grid{display:grid;gap:10px;}
.fg-8{grid-template-columns:repeat(4,1fr);}
@media(max-width:1400px){.fg-8{grid-template-columns:repeat(3,1fr);}}
@media(max-width:1100px){.fg-8{grid-template-columns:repeat(2,1fr);}}

/* ── 기계 배지 (인라인) ── */
.machine-badge{
  background:var(--machine-bg);
  color:var(--machine-txt);
  padding:2px 8px;border-radius:5px;
  font-size:11px;font-weight:700;
}

/* ── RFC 통신결과 탭 버튼 ── */
.rfc-tab-btn{
  display:flex;align-items:center;gap:7px;
  padding:12px 20px;
  font-size:13px;font-weight:600;cursor:pointer;
  color:var(--tab-text);
  border-bottom:2px solid transparent;
  margin-bottom:-1px;
  transition:all .12s;
}
.rfc-tab-btn:hover{color:var(--tab-hover);}
.rfc-tab-btn.active{
  color:var(--tab-active);
  border-bottom-color:var(--tab-active-bdr);
}

/* ── 사이드바 하단 정보 ── */
.sidebar-footer{
  padding:10px 14px;
  border-top:1px solid var(--border);
  font-size:10px;
  color:var(--ver-txt);
  transition:border-color .25s;
}

/* ── 섹션 카드 헤더 ── */
.card-header{
  padding:12px 16px;
  border-bottom:1px solid var(--border);
  display:flex;align-items:center;justify-content:space-between;
  transition:border-color .25s;
}
.card-label{
  font-size:13px;font-weight:700;
  color:var(--text-muted);
  display:flex;align-items:center;gap:8px;
}
.count-badge{
  font-size:11px;
  background:var(--bg-raised);
  color:var(--text-subtle);
  padding:1px 8px;border-radius:9999px;
  border:1px solid var(--border);
}

/* ── 빈 상태 ── */
.empty-state{
  text-align:center;
  color:var(--text-faint);
  padding:48px;
  font-size:13px;
}
.empty-icon{
  font-size:28px;display:block;
  margin-bottom:12px;
  color:var(--border);
}

/* ── 로고 영역 ── */
.logo-wrap{
  padding:18px 16px 14px;
  border-bottom:1px solid var(--border);
  transition:border-color .25s;
}
.logo-icon{
  width:34px;height:34px;
  background:var(--logo-bg);
  border-radius:9px;
  display:flex;align-items:center;justify-content:center;
  font-weight:900;font-size:15px;
  color:var(--logo-txt);
  flex-shrink:0;
}
.logo-name{font-weight:800;font-size:14px;color:var(--text-primary);}
.logo-desc{font-size:10px;color:var(--text-faint);}

/* ── 조회 검색바 ── */
.search-grid{
  display:grid;
  grid-template-columns:repeat(5,1fr);
  gap:10px;margin-bottom:10px;
}
@media(max-width:1200px){.search-grid{grid-template-columns:repeat(3,1fr);}}
@media(max-width:900px) {.search-grid{grid-template-columns:repeat(2,1fr);}}

/* ── 대시보드 그리드 ── */
.dash-grid{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:14px;margin-bottom:20px;
}
@media(max-width:1100px){.dash-grid{grid-template-columns:repeat(2,1fr);}}

/* ── 오더유형 납기일 색상 (다크/라이트 공통) ── */
.due-overdue{color:#ef4444;}
.due-urgent {color:#f59e0b;}
.due-near   {color:#fb923c;}
.due-normal {color:var(--text-muted);}
</style>
</head>
<body>
<div style="display:flex;height:100vh;">

<!-- ══════════ 사이드바 ══════════ -->
<aside id="sidebar">
  <div class="logo-wrap">
    <div style="display:flex;align-items:center;gap:10px;">
      <div class="logo-icon">K</div>
      <div>
        <div class="logo-name">Klean-APS</div>
        <div class="logo-desc">생산계획 스케줄링</div>
      </div>
    </div>
  </div>

  <nav style="padding:10px 0;flex:1;overflow-y:auto;">
    <div class="nav-group-title">MAIN</div>
    <div class="nav-item" id="nav-dashboard"    onclick="goPage('dashboard')">   <i class="fas fa-th-large"></i>대시보드</div>

    <div class="nav-group-title">판매오더 관리</div>
    <div class="nav-item" id="nav-order-import" onclick="goPage('order-import')"><i class="fas fa-cloud-download-alt"></i>판매오더 불러오기</div>
    <div class="nav-item" id="nav-order-list"   onclick="goPage('order-list')">  <i class="fas fa-search"></i>판매오더 조회</div>

    <div class="nav-group-title">시뮬레이션</div>
    <div class="nav-item" id="nav-simulation"   onclick="goPage('simulation')">  <i class="fas fa-layer-group"></i>지폭조합 시뮬레이션</div>

    <div class="nav-group-title">관리자메뉴</div>
    <div class="nav-item" id="nav-rfc-log"      onclick="goPage('rfc-log')">     <i class="fas fa-exchange-alt"></i>RFC 통신결과</div>
    <div class="nav-item" id="nav-constraint"   onclick="goPage('constraint')">  <i class="fas fa-sliders-h"></i>제약조건 설정</div>
    <div class="nav-item" id="nav-machine"      onclick="goPage('machine')">     <i class="fas fa-cog"></i>기계 마스터</div>
  </nav>

  <div class="sidebar-footer">
    Spring Boot 3.2.5 · Java 17<br>
    <span style="color:var(--ver-online);">● </span>Mock Mode
  </div>
</aside>

<!-- ══════════ 메인 영역 ══════════ -->
<div id="main-area">

  <!-- ── 탑바 (테마 토글) ── -->
  <div id="topbar">
    <div style="display:flex;align-items:center;gap:12px;">
      <span style="font-size:12px;color:var(--text-muted);" id="topbar-page-name"></span>
      <button id="theme-toggle" onclick="toggleTheme()" title="라이트/다크 모드 전환">
        <span id="theme-icon-sun"  style="font-size:14px;">☀️</span>
        <span id="theme-label" style="font-size:12px;">라이트 모드</span>
        <span class="toggle-track"><span class="toggle-thumb"></span></span>
        <span id="theme-icon-moon" style="font-size:14px;">🌙</span>
      </button>
    </div>
  </div>

  <!-- 페이지 컨텐츠 -->
  <div id="page-content-wrap">

<!-- ════════════════════════════
     판매오더 불러오기
════════════════════════════ -->
<div id="page-order-import" style="display:none;height:100%;flex-direction:column;">
  <div class="page-header">
    <div class="page-title"><i class="fas fa-cloud-download-alt" style="color:#3b82f6;"></i>판매오더 불러오기</div>
    <div class="page-sub">SAP RFC (Z_GET_SALES_ORDER) 호출 → APS DB 동기화</div>
  </div>

  <div class="page-scroll">
    <!-- RFC 조회 조건 카드 -->
    <div class="section-card" style="padding:18px 20px;">
      <div class="card-label" style="margin-bottom:14px;">
        <i class="fas fa-filter" style="color:#3b82f6;"></i> 조회 조건
      </div>

      <div class="filter-grid fg-8" id="import-filter-grid">
        <div><label class="field-label">오더유형</label>
          <select class="inp" id="fi-orderType">
            <option value="">전체</option>
            <option value="내수">내수</option>
            <option value="수출">수출</option>
            <option value="일본수출">일본수출</option>
            <option value="특수지">특수지</option>
          </select>
        </div>
        <div><label class="field-label">판매문서번호 (SAP)</label>
          <input class="inp" id="fi-sapOrderNo" placeholder="예: 4500001001">
        </div>
        <div><label class="field-label">호기</label>
          <select class="inp" id="fi-machineNo">
            <option value="">전체</option>
            <option value="2">2호기</option>
            <option value="3">3호기</option>
          </select>
        </div>
        <div><label class="field-label">평량 (g/m²)</label>
          <select class="inp" id="fi-basisWeight">
            <option value="">전체</option>
            <option value="220">220</option>
            <option value="300">300</option>
            <option value="500">500</option>
            <option value="550">550</option>
          </select>
        </div>
        <div><label class="field-label">생성일 From</label>
          <input class="inp" id="fi-dateFrom" type="date">
        </div>
        <div><label class="field-label">생성일 To</label>
          <input class="inp" id="fi-dateTo" type="date">
        </div>
        <div><label class="field-label">생성자</label>
          <input class="inp" id="fi-createdBy" placeholder="예: 홍길동">
        </div>
        <div><label class="field-label">납품요청일 From</label>
          <input class="inp" id="fi-dueFrom" type="date">
        </div>
        <div><label class="field-label">납품요청일 To</label>
          <input class="inp" id="fi-dueTo" type="date">
        </div>
        <div><label class="field-label">상태</label>
          <select class="inp" id="fi-status">
            <option value="">전체</option>
            <option value="OPEN">OPEN (미배정)</option>
            <option value="ASSIGNED">ASSIGNED (배정완료)</option>
            <option value="COMPLETED">COMPLETED (생산완료)</option>
          </select>
        </div>
        <div><label class="field-label">납품처</label>
          <input class="inp" id="fi-customerName" placeholder="거래처명 검색">
        </div>
      </div>

      <div style="display:flex;align-items:center;gap:10px;margin-top:16px;">
        <button class="btn btn-primary" onclick="runRfcSync()" id="btn-rfc">
          <i class="fas fa-cloud-download-alt"></i> 판매오더 불러오기
        </button>
        <button class="btn btn-ghost btn-sm" onclick="resetImportFilter()">
          <i class="fas fa-undo"></i> 초기화
        </button>
        <div class="rfc-loading" id="rfc-loading">
          <span class="spin"><i class="fas fa-sync"></i></span>
          SAP RFC 호출중… (Z_GET_SALES_ORDER)
        </div>
      </div>
    </div>

    <!-- RFC 결과 요약 -->
    <div id="rfc-summary" style="display:none;margin-bottom:14px;">
      <!-- 결과 메시지 배너 -->
      <div id="rs-banner" style="display:flex;align-items:center;gap:10px;padding:10px 16px;border-radius:9px;margin-bottom:10px;font-size:13px;font-weight:700;background:transparent;border:none;">
        <i id="rs-banner-icon" class="fas fa-info-circle" style="font-size:16px;"></i>
        <span id="rs-msg"></span>
        <span id="rs-detail" style="font-weight:400;font-size:12px;margin-left:4px;"></span>
      </div>
      <!-- 스탯 카드 -->
      <div style="display:flex;gap:10px;flex-wrap:wrap;">
        <div class="stat-mini">
          <div class="sv" style="color:#60a5fa;" id="rs-total">0</div>
          <div class="sl">총 조회건수</div>
        </div>
        <div class="stat-mini" id="rs-success-card">
          <div class="sv" style="color:#4ade80;" id="rs-success">0</div>
          <div class="sl">✅ 저장 성공</div>
        </div>
        <div class="stat-mini" id="rs-already-card">
          <div class="sv" style="color:#f59e0b;" id="rs-already">0</div>
          <div class="sl">🔁 이미 저장됨</div>
        </div>
        <div class="stat-mini" id="rs-fail-card">
          <div class="sv" style="color:#f87171;" id="rs-fail">0</div>
          <div class="sl">❌ 실패</div>
        </div>
        <div class="stat-mini">
          <div class="sv" style="color:#f59e0b;" id="rs-open">0</div>
          <div class="sl">OPEN 건수</div>
        </div>
      </div>
    </div>

    <!-- 결과 그리드 -->
    <div class="section-card" style="overflow:hidden;">
      <div class="card-header">
        <div class="card-label">
          <i class="fas fa-table" style="color:#3b82f6;"></i>
          RFC 조회 결과
          <span class="count-badge" id="import-count">0 건</span>
        </div>
        <div style="display:flex;gap:8px;align-items:center;">
          <label style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--text-subtle);cursor:pointer;">
            <input type="checkbox" id="chk-all-import" onchange="toggleAllImport(this.checked)"> 전체선택
          </label>
          <button class="btn btn-success btn-sm" onclick="saveSelected()" id="btn-save" disabled>
            <i class="fas fa-save"></i> 선택항목 DB저장
          </button>
        </div>
      </div>
      <div style="overflow-x:auto;max-height:420px;overflow-y:auto;">
        <table class="data-table" id="import-table">
          <thead>
            <tr>
              <th class="center" style="width:36px;"><input type="checkbox" id="chk-head-import" onchange="toggleAllImport(this.checked)"></th>
              <th>판매문서번호</th><th>항목</th><th>오더유형</th><th>납품처</th><th>호기</th>
              <th class="num">평량(g)</th><th class="num">지폭(mm)</th>
              <th class="num">수량(TON)</th><th class="num">수량(R)</th><th class="num">수량(SOK)</th>
              <th>단위</th><th>생성일</th><th>생성자</th><th>납품요청일</th><th>상태</th><th>비고</th>
            </tr>
          </thead>
          <tbody id="import-tbody">
            <tr><td colspan="17" class="empty-state">
              <i class="fas fa-satellite-dish empty-icon"></i>
              조회 조건을 입력하고 <b style="color:#60a5fa;">판매오더 불러오기</b> 버튼을 클릭하세요.
            </td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div><!-- /page-scroll -->
</div><!-- /page-order-import -->


<!-- ════════════════════════════
     판매오더 조회
════════════════════════════ -->
<div id="page-order-list" style="display:none;height:100%;flex-direction:column;">
  <div class="page-header">
    <div class="page-title"><i class="fas fa-search" style="color:#22c55e;"></i>판매오더 조회</div>
    <div class="page-sub">APS DB에 등록된 판매오더 조회 및 예외처리</div>
  </div>

  <div class="page-scroll" style="padding-top:14px;">
    <!-- 검색 조건 -->
    <div class="section-card" style="padding:14px 18px;">
      <div class="search-grid">
        <div><label class="field-label">오더번호</label>
          <input class="inp" id="lq-sapOrderNo" placeholder="판매문서번호" oninput="filterOrderList()">
        </div>
        <div><label class="field-label">오더유형</label>
          <select class="inp" id="lq-orderType" onchange="filterOrderList()">
            <option value="">전체</option>
            <option value="내수">내수</option>
            <option value="수출">수출</option>
            <option value="일본수출">일본수출</option>
            <option value="특수지">특수지</option>
          </select>
        </div>
        <div><label class="field-label">납품처</label>
          <input class="inp" id="lq-customerName" placeholder="거래처명" oninput="filterOrderList()">
        </div>
        <div><label class="field-label">호기</label>
          <select class="inp" id="lq-machineNo" onchange="filterOrderList()">
            <option value="">전체</option>
            <option value="2">2호기</option>
            <option value="3">3호기</option>
          </select>
        </div>
        <div><label class="field-label">평량 (g/m²)</label>
          <select class="inp" id="lq-basisWeight" onchange="filterOrderList()">
            <option value="">전체</option>
            <option value="220">220</option>
            <option value="300">300</option>
            <option value="500">500</option>
            <option value="550">550</option>
          </select>
        </div>
        <div><label class="field-label">상태</label>
          <select class="inp" id="lq-status" onchange="filterOrderList()">
            <option value="">전체</option>
            <option value="OPEN">OPEN</option>
            <option value="ASSIGNED">ASSIGNED</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>
        </div>
        <div><label class="field-label">예외처리</label>
          <select class="inp" id="lq-excluded" onchange="filterOrderList()">
            <option value="">전체</option>
            <option value="false">정상 오더</option>
            <option value="true">예외처리됨</option>
          </select>
        </div>
        <div style="display:flex;align-items:flex-end;gap:8px;">
          <button class="btn btn-primary btn-sm" onclick="filterOrderList()"><i class="fas fa-search"></i> 조회</button>
          <button class="btn btn-ghost btn-sm" onclick="resetListFilter()"><i class="fas fa-undo"></i></button>
        </div>
      </div>
    </div>

    <!-- 요약 스탯 -->
    <div style="display:flex;gap:10px;margin-bottom:12px;flex-wrap:wrap;">
      <div class="stat-mini"><div class="sv" style="color:#60a5fa;" id="ls-total">-</div><div class="sl">전체</div></div>
      <div class="stat-mini"><div class="sv" style="color:#f59e0b;" id="ls-open">-</div><div class="sl">OPEN</div></div>
      <div class="stat-mini"><div class="sv" style="color:#4ade80;" id="ls-assigned">-</div><div class="sl">ASSIGNED</div></div>
      <div class="stat-mini"><div class="sv" style="color:#fb923c;" id="ls-excl">-</div><div class="sl">예외처리</div></div>
      <div class="stat-mini"><div class="sv" style="color:#93c5fd;" id="ls-ton">-</div><div class="sl">합계 TON</div></div>
      <div class="stat-mini"><div class="sv" style="color:#6ee7b7;" id="ls-r">-</div><div class="sl">합계 R</div></div>
      <div class="stat-mini"><div class="sv" style="color:#d8b4fe;" id="ls-sok">-</div><div class="sl">합계 SOK</div></div>
    </div>

    <!-- 결과 테이블 -->
    <div class="section-card" style="overflow:hidden;">
      <div class="card-header">
        <div class="card-label">
          <i class="fas fa-list-alt" style="color:#22c55e;"></i>
          조회 결과 <span class="count-badge" id="list-count">0 건</span>
        </div>
        <button class="btn btn-ghost btn-sm" onclick="exportCsv()"><i class="fas fa-file-csv"></i> CSV</button>
      </div>
      <div style="overflow-x:auto;max-height:calc(100vh - 380px);overflow-y:auto;">
        <table class="data-table" id="list-table">
          <thead>
            <tr>
              <th class="center" style="width:36px;">#</th>
              <th>오더번호</th><th>항목</th><th>오더유형</th><th>납품처</th><th>호기</th>
              <th class="num">평량(g)</th><th class="num">지폭(mm)</th>
              <th class="num">수량(TON)</th><th class="num">수량(R)</th><th class="num">수량(SOK)</th>
              <th>납기일</th><th>상태</th><th>예외</th><th class="center">액션</th>
            </tr>
          </thead>
          <tbody id="list-tbody">
            <tr><td colspan="15" class="empty-state">조회 중...</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div><!-- /page-order-list -->


<!-- ════════════════════════════
     대시보드
════════════════════════════ -->
<div id="page-dashboard" style="display:none;height:100%;flex-direction:column;">
  <div class="page-header">
    <div class="page-title"><i class="fas fa-th-large" style="color:#3b82f6;"></i>대시보드</div>
    <div class="page-sub">Klean-APS 현황 요약</div>
  </div>
  <div class="page-scroll">
    <div class="dash-grid">
      <div class="stat-mini" style="padding:18px 20px;"><div class="sv" style="color:#60a5fa;" id="db-open">-</div><div class="sl">OPEN 오더</div></div>
      <div class="stat-mini" style="padding:18px 20px;"><div class="sv" style="color:#4ade80;" id="db-ton">-</div><div class="sl">총 TON (OPEN)</div></div>
      <div class="stat-mini" style="padding:18px 20px;"><div class="sv" style="color:#d8b4fe;" id="db-excl">-</div><div class="sl">예외처리 오더</div></div>
      <div class="stat-mini" style="padding:18px 20px;"><div class="sv" style="color:#fb923c;" id="db-machine">2 / 3</div><div class="sl">운영 호기</div></div>
    </div>
    <div class="section-card" style="padding:18px 20px;">
      <div class="card-label" style="margin-bottom:12px;">빠른 이동</div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;">
        <button class="btn btn-primary" onclick="goPage('order-import')"><i class="fas fa-cloud-download-alt"></i> 판매오더 불러오기</button>
        <button class="btn btn-success" onclick="goPage('order-list')"><i class="fas fa-search"></i> 판매오더 조회</button>
        <button class="btn btn-ghost"   onclick="goPage('simulation')"><i class="fas fa-layer-group"></i> 지폭조합 시뮬레이션</button>
      </div>
    </div>
  </div>
</div>

<!-- ════════════════════════════
     RFC 통신결과
════════════════════════════ -->
<div id="page-rfc-log" style="display:none;height:100%;flex-direction:column;">
  <div class="page-header">
    <div class="page-title"><i class="fas fa-exchange-alt" style="color:#38bdf8;"></i>RFC 통신결과</div>
    <div class="page-sub">SAP RFC 호출 이력 및 통신 결과 조회</div>
  </div>

  <!-- 탭 바 -->
  <div style="display:flex;border-bottom:1px solid var(--border);background:var(--bg-surface);padding:0 28px;flex-shrink:0;">
    <div class="rfc-tab-btn active" id="rfc-tab-import" onclick="switchRfcTab('import')">
      <i class="fas fa-cloud-download-alt"></i> 판매오더 불러오기 결과
    </div>
    <div class="rfc-tab-btn" id="rfc-tab-send" onclick="switchRfcTab('send')">
      <i class="fas fa-paper-plane"></i> 생산오더 전송 결과
    </div>
  </div>

  <!-- 탭 컨텐츠 -->
  <div class="page-scroll" style="padding-top:16px;">

    <!-- 판매오더 불러오기 결과 -->
    <div id="rfc-panel-import">
      <!-- 요약 스탯 -->
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:14px;">
        <div class="stat-mini"><div class="sv" style="color:#38bdf8;">24</div><div class="sl">총 호출 횟수</div></div>
        <div class="stat-mini"><div class="sv" style="color:#4ade80;">22</div><div class="sl">성공</div></div>
        <div class="stat-mini"><div class="sv" style="color:#f87171;">2</div><div class="sl">실패</div></div>
        <div class="stat-mini"><div class="sv" style="color:#60a5fa;">348</div><div class="sl">총 수신 건수</div></div>
      </div>
      <!-- 이력 테이블 -->
      <div class="section-card" style="overflow:hidden;">
        <div class="card-header">
          <div class="card-label"><i class="fas fa-history" style="color:#38bdf8;"></i>호출 이력</div>
          <span class="count-badge">24 건</span>
        </div>
        <div style="overflow-x:auto;max-height:calc(100vh - 340px);overflow-y:auto;">
          <table class="data-table">
            <thead>
              <tr>
                <th class="center" style="width:40px;">#</th>
                <th>호출일시</th>
                <th>RFC 함수명</th>
                <th>조회조건</th>
                <th class="num">수신건수</th>
                <th class="num">성공건수</th>
                <th class="num">실패건수</th>
                <th class="num">이미저장</th>
                <th>결과</th>
                <th>처리시간</th>
                <th>실행자</th>
              </tr>
            </thead>
            <tbody>
              <tr><td class="center" style="color:var(--text-faint);font-size:11px;">1</td><td style="font-size:12px;">2026-06-26 09:15:32</td><td style="font-family:monospace;font-size:11px;color:#38bdf8;">Z_GET_SALES_ORDER</td><td style="font-size:11px;color:var(--text-muted);">오더유형: 내수</td><td class="num">15</td><td class="num" style="color:#4ade80;">12</td><td class="num" style="color:#f87171;">0</td><td class="num" style="color:#f59e0b;">3</td><td><span class="badge b-assigned" style="font-size:10px;">성공</span></td><td style="font-size:11px;color:var(--text-muted);">823ms</td><td style="font-size:12px;">홍길동</td></tr>
              <tr><td class="center" style="color:var(--text-faint);font-size:11px;">2</td><td style="font-size:12px;">2026-06-26 10:22:14</td><td style="font-family:monospace;font-size:11px;color:#38bdf8;">Z_GET_SALES_ORDER</td><td style="font-size:11px;color:var(--text-muted);">호기: 2호기</td><td class="num">8</td><td class="num" style="color:#4ade80;">7</td><td class="num" style="color:#f87171;">0</td><td class="num" style="color:#f59e0b;">1</td><td><span class="badge b-assigned" style="font-size:10px;">성공</span></td><td style="font-size:11px;color:var(--text-muted);">791ms</td><td style="font-size:12px;">이순신</td></tr>
              <tr><td class="center" style="color:var(--text-faint);font-size:11px;">3</td><td style="font-size:12px;">2026-06-26 11:45:08</td><td style="font-family:monospace;font-size:11px;color:#38bdf8;">Z_GET_SALES_ORDER</td><td style="font-size:11px;color:var(--text-muted);">전체 조회</td><td class="num">15</td><td class="num" style="color:#4ade80;">0</td><td class="num" style="color:#f87171;">1</td><td class="num" style="color:#f59e0b;">0</td><td><span class="badge b-cancel" style="font-size:10px;">실패</span></td><td style="font-size:11px;color:var(--text-muted);">3,201ms</td><td style="font-size:12px;">홍길동</td></tr>
              <tr><td class="center" style="color:var(--text-faint);font-size:11px;">4</td><td style="font-size:12px;">2026-06-26 14:03:55</td><td style="font-family:monospace;font-size:11px;color:#38bdf8;">Z_GET_SALES_ORDER</td><td style="font-size:11px;color:var(--text-muted);">평량: 220</td><td class="num">6</td><td class="num" style="color:#4ade80;">6</td><td class="num" style="color:#f87171;">0</td><td class="num" style="color:#f59e0b;">0</td><td><span class="badge b-assigned" style="font-size:10px;">성공</span></td><td style="font-size:11px;color:var(--text-muted);">812ms</td><td style="font-size:12px;">강감찬</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 생산오더 전송 결과 -->
    <div id="rfc-panel-send" style="display:none;">
      <!-- 요약 스탯 -->
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:14px;">
        <div class="stat-mini"><div class="sv" style="color:#38bdf8;">18</div><div class="sl">총 전송 횟수</div></div>
        <div class="stat-mini"><div class="sv" style="color:#4ade80;">17</div><div class="sl">성공</div></div>
        <div class="stat-mini"><div class="sv" style="color:#f87171;">1</div><div class="sl">실패</div></div>
        <div class="stat-mini"><div class="sv" style="color:#60a5fa;">142</div><div class="sl">총 전송 건수</div></div>
      </div>
      <!-- 이력 테이블 -->
      <div class="section-card" style="overflow:hidden;">
        <div class="card-header">
          <div class="card-label"><i class="fas fa-paper-plane" style="color:#a78bfa;"></i>전송 이력</div>
          <span class="count-badge">18 건</span>
        </div>
        <div style="overflow-x:auto;max-height:calc(100vh - 340px);overflow-y:auto;">
          <table class="data-table">
            <thead>
              <tr>
                <th class="center" style="width:40px;">#</th>
                <th>전송일시</th>
                <th>RFC 함수명</th>
                <th>시뮬레이션 ID</th>
                <th class="num">전송건수</th>
                <th class="num">성공건수</th>
                <th class="num">실패건수</th>
                <th>결과</th>
                <th>처리시간</th>
                <th>실행자</th>
                <th>비고</th>
              </tr>
            </thead>
            <tbody>
              <tr><td class="center" style="color:var(--text-faint);font-size:11px;">1</td><td style="font-size:12px;">2026-06-26 09:30:00</td><td style="font-family:monospace;font-size:11px;color:#a78bfa;">Z_CREATE_PROD_ORDER</td><td style="font-family:monospace;font-size:11px;color:#38bdf8;">SIM-2026-001</td><td class="num">12</td><td class="num" style="color:#4ade80;">12</td><td class="num" style="color:#f87171;">0</td><td><span class="badge b-assigned" style="font-size:10px;">성공</span></td><td style="font-size:11px;color:var(--text-muted);">1,245ms</td><td style="font-size:12px;">홍길동</td><td style="font-size:11px;color:var(--text-muted);">-</td></tr>
              <tr><td class="center" style="color:var(--text-faint);font-size:11px;">2</td><td style="font-size:12px;">2026-06-26 11:15:22</td><td style="font-family:monospace;font-size:11px;color:#a78bfa;">Z_CREATE_PROD_ORDER</td><td style="font-family:monospace;font-size:11px;color:#38bdf8;">SIM-2026-002</td><td class="num">8</td><td class="num" style="color:#4ade80;">7</td><td class="num" style="color:#f87171;">1</td><td><span class="badge b-cancel" style="font-size:10px;">일부실패</span></td><td style="font-size:11px;color:var(--text-muted);">2,108ms</td><td style="font-size:12px;">이순신</td><td style="font-size:11px;color:#f87171;">자재 부족</td></tr>
              <tr><td class="center" style="color:var(--text-faint);font-size:11px;">3</td><td style="font-size:12px;">2026-06-26 14:50:11</td><td style="font-family:monospace;font-size:11px;color:#a78bfa;">Z_CREATE_PROD_ORDER</td><td style="font-family:monospace;font-size:11px;color:#38bdf8;">SIM-2026-003</td><td class="num">15</td><td class="num" style="color:#4ade80;">15</td><td class="num" style="color:#f87171;">0</td><td><span class="badge b-assigned" style="font-size:10px;">성공</span></td><td style="font-size:11px;color:var(--text-muted);">1,532ms</td><td style="font-size:12px;">강감찬</td><td style="font-size:11px;color:var(--text-muted);">-</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

  </div><!-- /page-scroll -->
</div><!-- /page-rfc-log -->

<!-- 시뮬레이션/설정/기계 (플레이스홀더) -->
<div id="page-simulation" style="display:none;height:100%;flex-direction:column;">
  <div class="page-header"><div class="page-title"><i class="fas fa-layer-group" style="color:#a78bfa;"></i>지폭조합 시뮬레이션</div></div>
  <div class="page-scroll"><div class="section-card" style="padding:48px;text-align:center;color:var(--text-faint);"><i class="fas fa-tools" style="font-size:32px;display:block;margin-bottom:12px;"></i>준비 중입니다.</div></div>
</div>
<div id="page-constraint" style="display:none;height:100%;flex-direction:column;">
  <div class="page-header"><div class="page-title"><i class="fas fa-sliders-h" style="color:#f59e0b;"></i>제약조건 설정</div></div>
  <div class="page-scroll"><div class="section-card" style="padding:48px;text-align:center;color:var(--text-faint);">준비 중</div></div>
</div>
<div id="page-machine" style="display:none;height:100%;flex-direction:column;">
  <div class="page-header"><div class="page-title"><i class="fas fa-cog" style="color:#34d399;"></i>기계 마스터</div></div>
  <div class="page-scroll"><div class="section-card" style="padding:48px;text-align:center;color:var(--text-faint);">준비 중</div></div>
</div>

  </div><!-- /page-content-wrap -->
</div><!-- /main-area -->
</div><!-- /flex -->

<!-- 예외처리 모달 -->
<div class="modal-bg" id="excludeModal">
  <div class="modal">
    <div class="modal-title"><i class="fas fa-ban" style="color:#ef4444;margin-right:8px;"></i>오더 예외처리</div>
    <input type="hidden" id="excl-id">
    <div style="margin-bottom:16px;">
      <label class="field-label">제외 사유 *</label>
      <input class="inp" id="excl-reason" placeholder="예외처리 사유 입력">
    </div>
    <div style="display:flex;gap:8px;justify-content:flex-end;">
      <button class="btn btn-ghost" onclick="closeModal()">취소</button>
      <button class="btn btn-danger" onclick="doExclude()"><i class="fas fa-ban"></i> 예외처리</button>
    </div>
  </div>
</div>

<div id="toast"></div>

<script>
const API = ''
let allOrders = []
let importResult = []
let selectedImport = new Set()

/* ══════════════════════════════════════
   테마 관리
══════════════════════════════════════ */
const PAGE_NAMES = {
  'dashboard'   : '대시보드',
  'order-import': '판매오더 불러오기',
  'order-list'  : '판매오더 조회',
  'simulation'  : '지폭조합 시뮬레이션',
  'rfc-log'     : 'RFC 통신결과',
  'constraint'  : '제약조건 설정',
  'machine'     : '기계 마스터',
}

/* ══════════════════════════════════════
   RFC 통신결과 탭 전환
══════════════════════════════════════ */
function switchRfcTab(tab) {
  const panels = ['import','send']
  panels.forEach(t => {
    document.getElementById('rfc-panel-'+t).style.display = (t === tab) ? '' : 'none'
    document.getElementById('rfc-tab-'+t).classList.toggle('active', t === tab)
  })
}

function initTheme() {
  const saved = localStorage.getItem('klean-aps-theme') || 'dark'
  applyTheme(saved, false)
}

function applyTheme(theme, animate) {
  const html = document.documentElement
  if (animate) {
    html.style.transition = 'none'
    // 짧은 fade를 body에 적용
    document.body.style.opacity = '0.7'
    setTimeout(() => { document.body.style.opacity = '1' }, 200)
  }
  html.setAttribute('data-theme', theme)
  localStorage.setItem('klean-aps-theme', theme)
  updateToggleUI(theme)
}

function updateToggleUI(theme) {
  const label = document.getElementById('theme-label')
  const sunIcon  = document.getElementById('theme-icon-sun')
  const moonIcon = document.getElementById('theme-icon-moon')
  if (!label) return
  if (theme === 'light') {
    label.textContent = '다크 모드'
    sunIcon.style.opacity  = '0.35'
    moonIcon.style.opacity = '1'
  } else {
    label.textContent = '라이트 모드'
    sunIcon.style.opacity  = '1'
    moonIcon.style.opacity = '0.35'
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark'
  const next = current === 'dark' ? 'light' : 'dark'
  applyTheme(next, true)
}

/* ══════════════════════════════════════
   페이지 전환
══════════════════════════════════════ */
const PAGES = ['dashboard','order-import','order-list','simulation','rfc-log','constraint','machine']

function goPage(p) {
  PAGES.forEach(id => {
    const el  = document.getElementById('page-'+id)
    const nav = document.getElementById('nav-'+id)
    if (el)  el.style.display  = (id === p) ? 'flex' : 'none'
    if (nav) nav.classList.toggle('active', id === p)
  })
  // 탑바 페이지명 업데이트
  const nameEl = document.getElementById('topbar-page-name')
  if (nameEl) nameEl.textContent = PAGE_NAMES[p] || ''

  if (p === 'dashboard')  loadDashboard()
  if (p === 'order-list') loadOrderList()
}

/* ══════════════════════════════════════
   토스트
══════════════════════════════════════ */
function toast(msg, type='ok') {
  const t = document.getElementById('toast')
  t.textContent = msg; t.className = 'show '+type
  setTimeout(()=>t.className='', 2500)
}

/* ══════════════════════════════════════
   대시보드
══════════════════════════════════════ */
async function loadDashboard() {
  const r = await fetch(API+'/klean-aps-api/sales-orders')
  const d = await r.json()
  allOrders = d.data || []
  const open = allOrders.filter(o => o.status === 'OPEN' && !o.isExcluded)
  document.getElementById('db-open').textContent = open.length
  document.getElementById('db-ton').textContent  = open.reduce((s,o) => s+(o.orderQtyTon||0), 0).toFixed(1)
  document.getElementById('db-excl').textContent = allOrders.filter(o => o.isExcluded).length
}

/* ══════════════════════════════════════
   판매오더 불러오기 — RFC 조회
══════════════════════════════════════ */
function resetImportFilter() {
  ['fi-orderType','fi-sapOrderNo','fi-machineNo','fi-basisWeight',
   'fi-dateFrom','fi-dateTo','fi-createdBy','fi-dueFrom','fi-dueTo',
   'fi-status','fi-customerName'].forEach(id => {
    const el = document.getElementById(id)
    if (el) el.value = ''
  })
}

async function runRfcSync() {
  const params = {
    orderType   : document.getElementById('fi-orderType').value,
    sapOrderNo  : document.getElementById('fi-sapOrderNo').value,
    machineNo   : document.getElementById('fi-machineNo').value,
    basisWeight : document.getElementById('fi-basisWeight').value,
    dateFrom    : document.getElementById('fi-dateFrom').value,
    dateTo      : document.getElementById('fi-dateTo').value,
    createdBy   : document.getElementById('fi-createdBy').value,
    dueFrom     : document.getElementById('fi-dueFrom').value,
    dueTo       : document.getElementById('fi-dueTo').value,
    status      : document.getElementById('fi-status').value,
    customerName: document.getElementById('fi-customerName').value,
  }
  const btn     = document.getElementById('btn-rfc')
  const loading = document.getElementById('rfc-loading')
  btn.disabled  = true
  loading.classList.add('show')
  try {
    const r = await fetch(API+'/klean-aps-api/sales-orders/rfc-sync', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify(params)
    })
    const d = await r.json()
    importResult = d.data || []

    const successN = d.successCount ?? 0
    const failN    = d.failCount    ?? 0
    const alreadyN = d.alreadyCount ?? 0

    // 배너 스타일 — 배경 투명, 텍스트 색상만 변경
    const banner     = document.getElementById('rs-banner')
    const bannerIcon = document.getElementById('rs-banner-icon')
    const detailEl   = document.getElementById('rs-detail')
    // 성공/실패 여부와 무관하게 메시지 색은 항상 초록
    banner.style.color   = failN > 0 ? '#f87171' : '#16a34a'
    bannerIcon.className = failN > 0 ? 'fas fa-exclamation-circle' : 'fas fa-check-circle'
    detailEl.textContent = '(성공 '+successN+'건 / 실패 '+failN+'건)'
    detailEl.style.color = '#94a3b8'

    document.getElementById('rfc-summary').style.display = ''
    document.getElementById('rs-msg').textContent     = d.message || '판매오더 불러오기 성공'
    document.getElementById('rs-total').textContent   = importResult.length
    document.getElementById('rs-success').textContent = successN
    document.getElementById('rs-already').textContent = alreadyN
    document.getElementById('rs-fail').textContent    = failN
    document.getElementById('rs-open').textContent    = importResult.filter(o => o.status === 'OPEN').length

    // 실패 카드 강조
    const failCard = document.getElementById('rs-fail-card')
    failCard.style.borderColor = failN > 0 ? '#f87171' : 'var(--border)'
    failCard.style.background  = failN > 0 ? 'var(--badge-cancel-bg)' : 'var(--stat-bg)'

    // 이미저장 카드 강조
    const alreadyCard = document.getElementById('rs-already-card')
    alreadyCard.style.borderColor = alreadyN > 0 ? '#f59e0b' : 'var(--border)'

    renderImportTable(importResult)
    document.getElementById('btn-save').disabled = false
    selectedImport.clear()
    toast('\ud310\ub9e4\uc624\ub354 \ubd88\ub7ec\uc624\uae30 \uc131\uacf5 — \uc131\uacf5 '+successN+'\uac74 / \uc2e4\ud328 '+failN+'\uac74', 'ok')
  } catch(e) {
    toast('RFC 호출 실패: '+e.message, 'err')
  } finally {
    btn.disabled = false
    loading.classList.remove('show')
  }
}

function renderImportTable(list) {
  const tbody = document.getElementById('import-tbody')
  document.getElementById('import-count').textContent = list.length+' 건'
  if (!list.length) {
    tbody.innerHTML = '<tr><td colspan="17" class="empty-state">조회된 데이터가 없습니다.</td></tr>'
    return
  }
  tbody.innerHTML = list.map(o => \`
    <tr data-id="\${o.orderId}">
      <td class="center"><input type="checkbox" class="chk-import" value="\${o.orderId}" onchange="toggleSelectImport(\${o.orderId},this.checked)"></td>
      <td style="color:#60a5fa;font-weight:600;font-family:monospace;">\${o.sapOrderNo}</td>
      <td style="color:var(--text-muted);">\${o.sapItemNo}</td>
      <td>\${renderOrderTypeBadge(o.orderType)}</td>
      <td style="max-width:140px;overflow:hidden;text-overflow:ellipsis;">\${o.customerName}</td>
      <td class="center"><span class="machine-badge">\${o.machineNo}호기</span></td>
      <td class="num" style="font-weight:700;">\${o.basisWeight}</td>
      <td class="num" style="font-weight:700;">\${o.paperWidth.toLocaleString()}</td>
      <td class="num">\${o.orderQtyTon!=null ? '<span class="badge b-ton">'+o.orderQtyTon.toFixed(3)+'</span>' : '<span style="color:var(--border);">-</span>'}</td>
      <td class="num">\${o.orderQtyR!=null   ? '<span class="badge b-r">'+o.orderQtyR.toLocaleString()+'</span>'   : '<span style="color:var(--border);">-</span>'}</td>
      <td class="num">\${o.orderQtySok!=null ? '<span class="badge b-sok">'+o.orderQtySok.toLocaleString()+'</span>' : '<span style="color:var(--border);">-</span>'}</td>
      <td><span class="badge b-\${o.unit==='TON'?'ton':o.unit==='R'?'r':'sok'}">\${o.unit}</span></td>
      <td style="color:var(--text-muted);font-size:11px;">\${o.orderDate}</td>
      <td style="color:var(--text-muted);font-size:11px;">\${o.createdBy}</td>
      <td class="\${dueDateClass(o.dueDate)}" style="font-size:11px;font-weight:600;">\${o.dueDate}</td>
      <td>\${renderStatusBadge(o.status)}</td>
      <td class="center">\${o.isExcluded?'<span class="badge b-excl"><i class="fas fa-exclamation-triangle"></i> 예외</span>':''}</td>
    </tr>\`).join('')
}

function toggleSelectImport(id, checked) {
  checked ? selectedImport.add(id) : selectedImport.delete(id)
  updateSaveBtn()
}
function toggleAllImport(checked) {
  document.querySelectorAll('.chk-import').forEach(c => {
    c.checked = checked
    const id = Number(c.value)
    checked ? selectedImport.add(id) : selectedImport.delete(id)
  })
  document.getElementById('chk-head-import').checked = checked
  document.getElementById('chk-all-import').checked  = checked
  updateSaveBtn()
}
function updateSaveBtn() {
  const btn = document.getElementById('btn-save')
  btn.disabled = selectedImport.size === 0
  btn.innerHTML = selectedImport.size > 0
    ? \`<i class="fas fa-save"></i> 선택항목 DB저장 (\${selectedImport.size}건)\`
    : '<i class="fas fa-save"></i> 선택항목 DB저장'
}
async function saveSelected() {
  if (selectedImport.size === 0) return
  toast(\`\${selectedImport.size}건 DB 저장 완료 (Mock)\`, 'ok')
  selectedImport.clear()
  updateSaveBtn()
  toggleAllImport(false)
}

/* ══════════════════════════════════════
   판매오더 조회
══════════════════════════════════════ */
async function loadOrderList() {
  const r = await fetch(API+'/klean-aps-api/sales-orders')
  const d = await r.json()
  allOrders = d.data || []
  filterOrderList()
}

function resetListFilter() {
  ['lq-sapOrderNo','lq-orderType','lq-customerName','lq-machineNo',
   'lq-basisWeight','lq-status','lq-excluded'].forEach(id => {
    const el = document.getElementById(id); if(el) el.value = ''
  })
  filterOrderList()
}

function filterOrderList() {
  const sapOrderNo   = document.getElementById('lq-sapOrderNo').value.trim()
  const orderType    = document.getElementById('lq-orderType').value
  const customerName = document.getElementById('lq-customerName').value.trim()
  const machineNo    = document.getElementById('lq-machineNo').value
  const basisWeight  = document.getElementById('lq-basisWeight').value
  const status       = document.getElementById('lq-status').value
  const excluded     = document.getElementById('lq-excluded').value

  const filtered = allOrders.filter(o => {
    if (sapOrderNo   && !o.sapOrderNo.includes(sapOrderNo)) return false
    if (orderType    && o.orderType !== orderType) return false
    if (customerName && !o.customerName.includes(customerName)) return false
    if (machineNo    && o.machineNo !== machineNo) return false
    if (basisWeight  && o.basisWeight !== Number(basisWeight)) return false
    if (status       && o.status !== status) return false
    if (excluded === 'true'  && !o.isExcluded) return false
    if (excluded === 'false' &&  o.isExcluded) return false
    return true
  })
  renderListTable(filtered)
  updateListStats(filtered)
}

function updateListStats(list) {
  document.getElementById('ls-total').textContent    = list.length
  document.getElementById('ls-open').textContent     = list.filter(o => o.status === 'OPEN').length
  document.getElementById('ls-assigned').textContent = list.filter(o => o.status === 'ASSIGNED').length
  document.getElementById('ls-excl').textContent     = list.filter(o => o.isExcluded).length
  document.getElementById('ls-ton').textContent      = list.reduce((s,o) => s+(o.orderQtyTon||0), 0).toFixed(1)
  document.getElementById('ls-r').textContent        = list.reduce((s,o) => s+(o.orderQtyR||0),   0).toLocaleString()
  document.getElementById('ls-sok').textContent      = list.reduce((s,o) => s+(o.orderQtySok||0), 0).toLocaleString()
}

function renderListTable(list) {
  const tbody = document.getElementById('list-tbody')
  document.getElementById('list-count').textContent = list.length+' 건'
  if (!list.length) {
    tbody.innerHTML = '<tr><td colspan="15" class="empty-state">조회된 오더가 없습니다.</td></tr>'
    return
  }
  tbody.innerHTML = list.map((o,i) => \`
    <tr style="\${o.isExcluded?'opacity:.5;':''}">
      <td class="center" style="color:var(--text-faint);font-size:11px;">\${i+1}</td>
      <td style="color:#60a5fa;font-weight:700;font-family:monospace;">\${o.sapOrderNo}</td>
      <td style="color:var(--text-muted);font-size:11px;">\${o.sapItemNo}</td>
      <td>\${renderOrderTypeBadge(o.orderType)}</td>
      <td style="max-width:150px;overflow:hidden;text-overflow:ellipsis;font-size:12px;">\${o.customerName}</td>
      <td class="center"><span class="machine-badge">\${o.machineNo}호기</span></td>
      <td class="num" style="font-weight:700;">\${o.basisWeight}</td>
      <td class="num" style="font-weight:700;">\${o.paperWidth.toLocaleString()}</td>
      <td class="num">\${o.orderQtyTon!=null ? '<span class="badge b-ton">'+o.orderQtyTon.toFixed(3)+'</span>' : '<span style="color:var(--border);">-</span>'}</td>
      <td class="num">\${o.orderQtyR!=null   ? '<span class="badge b-r">'+o.orderQtyR.toLocaleString()+'</span>'   : '<span style="color:var(--border);">-</span>'}</td>
      <td class="num">\${o.orderQtySok!=null ? '<span class="badge b-sok">'+o.orderQtySok.toLocaleString()+'</span>' : '<span style="color:var(--border);">-</span>'}</td>
      <td class="\${dueDateClass(o.dueDate)}" style="font-size:11px;font-weight:600;">\${o.dueDate}</td>
      <td>\${renderStatusBadge(o.status)}</td>
      <td class="center">\${o.isExcluded?'<span class="badge b-excl" style="font-size:10px;"><i class="fas fa-ban"></i> 예외</span>':''}</td>
      <td class="center">
        \${o.isExcluded
          ? \`<button class="btn btn-ghost btn-xs" onclick="doInclude(\${o.orderId})"><i class="fas fa-check"></i> 해제</button>\`
          : \`<button class="btn btn-danger btn-xs" onclick="openExclude(\${o.orderId})"><i class="fas fa-ban"></i></button>\`
        }
      </td>
    </tr>\`).join('')
}

/* ══════════════════════════════════════
   예외처리
══════════════════════════════════════ */
function openExclude(id) {
  document.getElementById('excl-id').value    = id
  document.getElementById('excl-reason').value = ''
  document.getElementById('excludeModal').classList.add('show')
}
function closeModal() { document.getElementById('excludeModal').classList.remove('show') }
async function doExclude() {
  const id     = document.getElementById('excl-id').value
  const reason = document.getElementById('excl-reason').value.trim()
  if (!reason) { toast('제외 사유를 입력하세요.','err'); return }
  const r = await fetch(API+\`/klean-aps-api/sales-orders/\${id}/exclude\`, {
    method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({reason})
  })
  const d = await r.json()
  if (d.success) { toast('예외처리 완료'); closeModal(); loadOrderList() }
  else toast(d.message||'오류', 'err')
}
async function doInclude(id) {
  const r = await fetch(API+\`/klean-aps-api/sales-orders/\${id}/include\`, {method:'PATCH'})
  const d = await r.json()
  if (d.success) { toast('예외 해제 완료'); loadOrderList() }
  else toast(d.message||'오류', 'err')
}

/* ══════════════════════════════════════
   CSV 내보내기
══════════════════════════════════════ */
function exportCsv() {
  const rows = [['오더번호','항목','오더유형','납품처','호기','평량','지폭','수량TON','수량R','수량SOK','납기일','상태']]
  allOrders.forEach(o => rows.push([
    o.sapOrderNo, o.sapItemNo, o.orderType, o.customerName, o.machineNo+'호기',
    o.basisWeight, o.paperWidth, o.orderQtyTon||'', o.orderQtyR||'', o.orderQtySok||'',
    o.dueDate, o.status
  ]))
  const csv = rows.map(r => r.join(',')).join('\\n')
  const a   = document.createElement('a')
  a.href     = 'data:text/csv;charset=utf-8,\\uFEFF'+encodeURIComponent(csv)
  a.download = 'sales_orders_'+new Date().toISOString().slice(0,10)+'.csv'
  a.click()
  toast('CSV 다운로드 완료','ok')
}

/* ══════════════════════════════════════
   헬퍼
══════════════════════════════════════ */
function renderOrderTypeBadge(t) {
  const m = {내수:'b-domestic',수출:'b-export',일본수출:'b-japan',특수지:'b-special'}
  return \`<span class="badge \${m[t]||'b-domestic'}">\${t}</span>\`
}
function renderStatusBadge(s) {
  const m = {OPEN:'b-open',ASSIGNED:'b-assigned',COMPLETED:'b-complete',CANCELLED:'b-cancel'}
  const l = {OPEN:'OPEN',ASSIGNED:'배정완료',COMPLETED:'생산완료',CANCELLED:'취소'}
  return \`<span class="badge \${m[s]||'b-open'}" style="font-size:10px;">\${l[s]||s}</span>\`
}
function dueDateClass(d) {
  if (!d) return 'due-normal'
  const diff = (new Date(d) - new Date()) / 86400000
  if (diff < 0)  return 'due-overdue'
  if (diff < 3)  return 'due-urgent'
  if (diff < 7)  return 'due-near'
  return 'due-normal'
}

/* ══════════════════════════════════════
   초기화
══════════════════════════════════════ */
initTheme()
goPage('order-import')
</script>
</body>
</html>`

export default app