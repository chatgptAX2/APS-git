import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()
app.use('*', cors())

// ============================================================
// Mock 데이터
// ============================================================
let machineSeq = 3
const machines: any[] = [
  {
    machineId: 1, machineNo: '2', machineName: '2호기',
    maxWidth: 2520, minWidth: 2400, maxPok: 4,
    fourPokMinWidth: 630, mimi: 30, noProdLimit: 625,
    bwExceptionList: '', bwExceptionMaxWidth: null,
    description: '크라프트 / 골판지 원지',
    note: '620×4폭 불가 / 620×3 + 640×1 가능',
  },
  {
    machineId: 2, machineNo: '3', machineName: '3호기',
    maxWidth: 3420, minWidth: 3300, maxPok: 4,
    fourPokMinWidth: null, mimi: 30, noProdLimit: 625,
    bwExceptionList: '300,500,550', bwExceptionMaxWidth: 3410,
    description: '크라프트 / 중량지 / 특수지',
    note: '300/500/550g/m² 평량은 최대지폭 3,410mm 적용',
  },
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
// Mock 생산오더 데이터
// ============================================================
const prodOrders: any[] = [
  { prodId:1,  prodOrderNo:'1000000101', sapOrderNo:'4500001001', sapItemNo:'000010', machineNo:'2', basisWeight:220, paperWidth:800,  orderQtyTon:8.500, orderQtyR:null, orderQtySok:null, unit:'TON', customerName:'한솔제지㈜',    planStartDate:'2026-07-01', planEndDate:'2026-07-02', status:'CONFIRMED', cancelStatus:null, createdAt:'2026-06-25 09:10:00', createdBy:'홍길동' },
  { prodId:2,  prodOrderNo:'1000000102', sapOrderNo:'4500001002', sapItemNo:'000010', machineNo:'2', basisWeight:220, paperWidth:620,  orderQtyTon:5.200, orderQtyR:null, orderQtySok:null, unit:'TON', customerName:'무림페이퍼㈜',   planStartDate:'2026-07-02', planEndDate:'2026-07-02', status:'CONFIRMED', cancelStatus:null, createdAt:'2026-06-25 09:15:00', createdBy:'홍길동' },
  { prodId:3,  prodOrderNo:'1000000103', sapOrderNo:'4500001003', sapItemNo:'000010', machineNo:'2', basisWeight:220, paperWidth:700,  orderQtyTon:12.000,orderQtyR:null, orderQtySok:null, unit:'TON', customerName:'신호제지㈜',    planStartDate:'2026-07-03', planEndDate:'2026-07-04', status:'CONFIRMED', cancelStatus:null, createdAt:'2026-06-25 10:00:00', createdBy:'이순신' },
  { prodId:4,  prodOrderNo:'1000000104', sapOrderNo:'4500001006', sapItemNo:'000010', machineNo:'3', basisWeight:300, paperWidth:900,  orderQtyTon:9.600, orderQtyR:null, orderQtySok:null, unit:'TON', customerName:'동화지업㈜',    planStartDate:'2026-07-01', planEndDate:'2026-07-02', status:'CONFIRMED', cancelStatus:null, createdAt:'2026-06-25 10:30:00', createdBy:'홍길동' },
  { prodId:5,  prodOrderNo:'1000000105', sapOrderNo:'4500001007', sapItemNo:'000010', machineNo:'3', basisWeight:300, paperWidth:780,  orderQtyTon:null,  orderQtyR:1200, orderQtySok:null, unit:'R',   customerName:'삼원특수지㈜',  planStartDate:'2026-07-02', planEndDate:'2026-07-03', status:'CONFIRMED', cancelStatus:null, createdAt:'2026-06-25 11:00:00', createdBy:'이순신' },
  { prodId:6,  prodOrderNo:'1000000106', sapOrderNo:'4500001008', sapItemNo:'000010', machineNo:'3', basisWeight:300, paperWidth:1050, orderQtyTon:15.200,orderQtyR:null, orderQtySok:null, unit:'TON', customerName:'대한제지㈜',    planStartDate:'2026-07-04', planEndDate:'2026-07-05', status:'IN_PROGRESS',cancelStatus:null, createdAt:'2026-06-25 11:30:00', createdBy:'강감찬' },
  { prodId:7,  prodOrderNo:'1000000107', sapOrderNo:'4500001011', sapItemNo:'000010', machineNo:'2', basisWeight:220, paperWidth:760,  orderQtyTon:6.300, orderQtyR:null, orderQtySok:null, unit:'TON', customerName:'오지제지㈜',    planStartDate:'2026-07-05', planEndDate:'2026-07-05', status:'CONFIRMED', cancelStatus:null, createdAt:'2026-06-25 13:00:00', createdBy:'강감찬' },
  { prodId:8,  prodOrderNo:'1000000108', sapOrderNo:'4500001013', sapItemNo:'000020', machineNo:'2', basisWeight:220, paperWidth:920,  orderQtyTon:10.000,orderQtyR:null, orderQtySok:null, unit:'TON', customerName:'한솔제지㈜',    planStartDate:'2026-07-06', planEndDate:'2026-07-07', status:'CONFIRMED', cancelStatus:null, createdAt:'2026-06-25 14:00:00', createdBy:'이순신' },
  { prodId:9,  prodOrderNo:'1000000109', sapOrderNo:'4500001009', sapItemNo:'000010', machineNo:'3', basisWeight:500, paperWidth:820,  orderQtyTon:7.500, orderQtyR:null, orderQtySok:null, unit:'TON', customerName:'태림포장㈜',    planStartDate:'2026-07-03', planEndDate:'2026-07-04', status:'COMPLETED',  cancelStatus:null, createdAt:'2026-06-24 09:00:00', createdBy:'홍길동' },
  { prodId:10, prodOrderNo:'1000000110', sapOrderNo:'4500001004', sapItemNo:'000010', machineNo:'2', basisWeight:220, paperWidth:350,  orderQtyTon:3.000, orderQtyR:null, orderQtySok:null, unit:'TON', customerName:'JK페이퍼',      planStartDate:'2026-06-28', planEndDate:'2026-06-28', status:'CANCELLED',  cancelStatus:'RFC_SENT', createdAt:'2026-06-23 10:00:00', createdBy:'홍길동' },
]

// ============================================================
// 점보롤 생산오더 (지폭조합 결과로 생성)
// ============================================================
let jumboSeq = 1
const jumboOrders: any[] = []

// ============================================================
// API
// ============================================================
app.get('/klean-aps-api/machines', (c) => c.json({ success:true, data:machines }))

// 점보롤 오더 목록
app.get('/klean-aps-api/jumbo-orders', (c) => c.json({ success:true, data:jumboOrders }))

// 점보롤 오더 생성 (시뮬레이션 확정 후 오더생성 시 호출)
app.post('/klean-aps-api/jumbo-orders', async (c) => {
  const body = await c.req.json()
  // body.jumboOrders: 생성할 점보롤 오더 배열
  const created: any[] = []
  for (const item of (body.jumboOrders || [])) {
    const now = new Date().toISOString().replace('T',' ').slice(0,19)
    const jOrder = {
      jumboId: jumboSeq++,
      jumboOrderNo: 'J' + String(9000000000 + jumboSeq).slice(-10),
      machineNo: item.machineNo,
      basisWeight: item.basisWeight,
      jumboWidth: item.jumboWidth,          // 점보롤 전체 지폭 (폭들의 합 + 미미)
      totalTon: item.totalTon,
      pokCount: item.pokCount,
      widths: item.widths,                   // 포함된 개별 지폭 배열 e.g. [800, 620]
      sourceComboId: item.sourceComboId,
      sourceOrderNos: item.sourceOrderNos,   // 연결된 판매오더번호 배열
      planStartDate: item.planStartDate || '',
      planEndDate: item.planEndDate || '',
      status: 'PLANNED',
      createdAt: now,
      createdBy: '시스템',
    }
    jumboOrders.push(jOrder)
    created.push(jOrder)
  }
  return c.json({ success:true, data:created, count:created.length })
})

// 점보롤 오더 취소
app.delete('/klean-aps-api/jumbo-orders/:id', (c) => {
  const id = Number(c.req.param('id'))
  const idx = jumboOrders.findIndex(j => j.jumboId === id)
  if (idx === -1) return c.json({ success:false, message:'오더를 찾을 수 없습니다.' }, 404)
  jumboOrders.splice(idx, 1)
  return c.json({ success:true })
})

// 기계 추가
app.post('/klean-aps-api/machines', async (c) => {
  const body = await c.req.json()
  if (!body.machineNo || !body.machineName) return c.json({ success:false, message:'machineNo, machineName 필수' }, 400)
  if (machines.find(m => m.machineNo === body.machineNo)) return c.json({ success:false, message:'이미 존재하는 호기 번호입니다.' }, 409)
  const newMachine = {
    machineId: machineSeq++,
    machineNo: String(body.machineNo),
    machineName: String(body.machineName),
    maxWidth: Number(body.maxWidth) || 0,
    minWidth: Number(body.minWidth) || 0,
    maxPok: Number(body.maxPok) || 4,
    fourPokMinWidth: body.fourPokMinWidth ? Number(body.fourPokMinWidth) : null,
    mimi: Number(body.mimi) || 30,
    noProdLimit: Number(body.noProdLimit) || 625,
    bwExceptionList: body.bwExceptionList || '',
    bwExceptionMaxWidth: body.bwExceptionMaxWidth ? Number(body.bwExceptionMaxWidth) : null,
    description: body.description || '',
    note: body.note || '',
  }
  machines.push(newMachine)
  return c.json({ success:true, data:newMachine })
})

// 기계 수정
app.put('/klean-aps-api/machines/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const idx = machines.findIndex(m => m.machineId === id)
  if (idx === -1) return c.json({ success:false, message:'기계를 찾을 수 없습니다.' }, 404)
  const body = await c.req.json()
  // machineNo 중복 체크 (자신 제외)
  if (body.machineNo && machines.find(m => m.machineNo === body.machineNo && m.machineId !== id)) {
    return c.json({ success:false, message:'이미 존재하는 호기 번호입니다.' }, 409)
  }
  const updated = {
    ...machines[idx],
    machineNo:          body.machineNo          !== undefined ? String(body.machineNo)            : machines[idx].machineNo,
    machineName:        body.machineName        !== undefined ? String(body.machineName)          : machines[idx].machineName,
    maxWidth:           body.maxWidth           !== undefined ? Number(body.maxWidth)              : machines[idx].maxWidth,
    minWidth:           body.minWidth           !== undefined ? Number(body.minWidth)              : machines[idx].minWidth,
    maxPok:             body.maxPok             !== undefined ? Number(body.maxPok)                : machines[idx].maxPok,
    fourPokMinWidth:    body.fourPokMinWidth     !== undefined ? (body.fourPokMinWidth ? Number(body.fourPokMinWidth) : null) : machines[idx].fourPokMinWidth,
    mimi:               body.mimi               !== undefined ? Number(body.mimi)                  : machines[idx].mimi,
    noProdLimit:        body.noProdLimit        !== undefined ? Number(body.noProdLimit)            : machines[idx].noProdLimit,
    bwExceptionList:    body.bwExceptionList    !== undefined ? String(body.bwExceptionList)       : machines[idx].bwExceptionList,
    bwExceptionMaxWidth:body.bwExceptionMaxWidth !== undefined ? (body.bwExceptionMaxWidth ? Number(body.bwExceptionMaxWidth) : null) : machines[idx].bwExceptionMaxWidth,
    description:        body.description        !== undefined ? String(body.description)           : machines[idx].description,
    note:               body.note               !== undefined ? String(body.note)                  : machines[idx].note,
  }
  machines[idx] = updated
  return c.json({ success:true, data:updated })
})

// 기계 삭제
app.delete('/klean-aps-api/machines/:id', (c) => {
  const id = Number(c.req.param('id'))
  const idx = machines.findIndex(m => m.machineId === id)
  if (idx === -1) return c.json({ success:false, message:'기계를 찾을 수 없습니다.' }, 404)
  machines.splice(idx, 1)
  return c.json({ success:true })
})

// 생산오더 목록
app.get('/klean-aps-api/prod-orders', (c) => {
  const prodOrderNo  = c.req.query('prodOrderNo')  || ''
  const sapOrderNo   = c.req.query('sapOrderNo')   || ''
  const machineNo    = c.req.query('machineNo')    || ''
  const basisWeight  = c.req.query('basisWeight')  || ''
  const status       = c.req.query('status')       || ''
  const customerName = c.req.query('customerName') || ''
  const planFrom     = c.req.query('planFrom')     || ''
  const planTo       = c.req.query('planTo')       || ''

  const list = prodOrders.filter(o => {
    if (prodOrderNo  && !o.prodOrderNo.includes(prodOrderNo)) return false
    if (sapOrderNo   && !o.sapOrderNo.includes(sapOrderNo))  return false
    if (machineNo    && o.machineNo !== machineNo)            return false
    if (basisWeight  && o.basisWeight !== Number(basisWeight))return false
    if (status       && o.status !== status)                  return false
    if (customerName && !o.customerName.includes(customerName)) return false
    if (planFrom     && o.planStartDate < planFrom)           return false
    if (planTo       && o.planStartDate > planTo)             return false
    return true
  })
  return c.json({ success:true, data:list, total:list.length })
})

// 생산오더 단건 조회
app.get('/klean-aps-api/prod-orders/:id', (c) => {
  const id = Number(c.req.param('id'))
  const o  = prodOrders.find(x => x.prodId === id)
  if (!o) return c.json({ success:false, message:'생산오더 없음' }, 404)
  return c.json({ success:true, data:o })
})

// 생산오더 취소 (RFC 전송 시뮬레이션)
app.post('/klean-aps-api/prod-orders/:id/cancel', async (c) => {
  const id   = Number(c.req.param('id'))
  const body = await c.req.json()
  const o    = prodOrders.find(x => x.prodId === id)
  if (!o) return c.json({ success:false, message:'생산오더 없음' }, 404)
  if (o.status === 'CANCELLED') return c.json({ success:false, message:'이미 취소된 오더입니다.' }, 400)
  if (o.status === 'COMPLETED') return c.json({ success:false, message:'완료된 오더는 취소할 수 없습니다.' }, 400)
  // RFC 전송 시뮬레이션 (600ms)
  await new Promise(r => setTimeout(r, 600))
  o.status       = 'CANCELLED'
  o.cancelStatus = 'RFC_SENT'
  ;(o as any).cancelReason   = body.reason
  ;(o as any).cancelledAt    = new Date().toISOString().replace('T',' ').slice(0,19)
  ;(o as any).cancelledBy    = body.cancelledBy || '시스템'
  return c.json({
    success: true, data: o,
    rfcResult: { funcName:'Z_CANCEL_PROD_ORDER', sentAt: new Date().toISOString(), elapsed:'612ms', sapDoc: o.prodOrderNo },
    message: `생산오더 ${o.prodOrderNo} 취소 완료 — SAP RFC 전송 성공`
  })
})

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
   커스텀 폰트
═══════════════════════════════════════════════ */
@font-face {
  font-family: 'Jalnan';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_four@1.2/JalnanOTF00.woff') format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'SBAggroL';
  src: url('https://cdn.jsdelivr.net/npm/@noonnu/sbaggrol/SBAggroL.woff') format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'SBAggroM';
  src: url('https://cdn.jsdelivr.net/npm/@noonnu/sbaggrom/SBAggroM.woff') format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'SBAggroB';
  src: url('https://cdn.jsdelivr.net/npm/@noonnu/sb-aggro-b@0.1.0/fonts/sbaggrob-normal.woff') format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
/* ═══════════════════════════════════════════════
   CSS 변수 — 다크 테마 (기본)
═══════════════════════════════════════════════ */
:root,
[data-theme="dark"] {
  --bg-base      : #0a0f1e;
  --bg-surface   : #0f172a;
  --bg-raised    : #050a14;
  --bg-hover     : #0f1e38;
  --bg-input     : #0d1526;
  --bg-select-opt: #0f172a;

  --border       : #2d3f55;
  --border-focus : #3b82f6;
  --border-strong: #3d5470;

  --text-primary : #f1f5f9;
  --text-secondary: #e2e8f0;
  --text-muted   : #94a3b8;
  --text-subtle  : #94a3b8;
  --text-faint   : #64748b;
  --text-label   : #94a3b8;

  --nav-text     : #94a3b8;
  --nav-hover-bg : #1e293b;
  --nav-hover-txt: #e2e8f0;
  --nav-active-bg: #1e3a5f;
  --nav-active-txt:#93c5fd;
  --nav-active-bdr:#3b82f6;
  --nav-group-txt: #64748b;

  --tab-text     : #64748b;
  --tab-hover    : #94a3b8;
  --tab-active   : #60a5fa;
  --tab-active-bdr:#3b82f6;

  --th-bg        : #050a14;
  --th-text      : #94a3b8;
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
  --ver-txt       : #4a6080;
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
  font-family:'SBAggroL','Malgun Gothic','Apple SD Gothic Neo',sans-serif;
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
  font-family:'SBAggroL','Malgun Gothic',sans-serif;
}
.nav-item{
  display:flex;align-items:center;gap:9px;
  padding:9px 14px;cursor:pointer;font-size:13px;
  color:var(--nav-text);
  transition:all .12s;
  border-left:3px solid transparent;margin:1px 0;
  font-family:'Jalnan','Malgun Gothic',sans-serif;
  font-size:12px;
  letter-spacing:0.03em;
  -webkit-text-stroke: 0px;
  text-shadow: none;
  opacity: 0.92;
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
.inp::placeholder{color:var(--text-faint);}
select.inp option{background:var(--bg-select-opt);}

/* ── 버튼 ── */
.btn{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;border:none;transition:all .12s;white-space:nowrap;font-family:'SBAggroM','Malgun Gothic',sans-serif;}
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
  font-family:'SBAggroM','Malgun Gothic',sans-serif;
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
.badge{display:inline-flex;align-items:center;padding:2px 8px;border-radius:9999px;font-size:11px;font-weight:600;font-family:'SBAggroM','Malgun Gothic',sans-serif;}
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
.stat-mini .sv{font-size:18px;font-weight:700;font-family:'SBAggroM','Malgun Gothic',sans-serif;}
.stat-mini .sl{font-size:10px;color:var(--text-subtle);}

/* ── 페이지 제목 ── */
.page-header{padding:18px 28px 0;flex-shrink:0;}
.page-title{font-size:18px;font-weight:700;color:var(--text-primary);display:flex;align-items:center;gap:10px;font-family:'SBAggroM','Malgun Gothic',sans-serif;}
.page-sub{font-size:12px;color:var(--text-subtle);margin-top:3px;font-family:'SBAggroL','Malgun Gothic',sans-serif;}

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
  font-size:13px;font-weight:600;
  color:var(--text-muted);
  display:flex;align-items:center;gap:8px;
  font-family:'SBAggroM','Malgun Gothic',sans-serif;
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
.logo-name{font-weight:700;font-size:14px;color:var(--text-primary);font-family:'Jalnan','Malgun Gothic',sans-serif;}
.logo-desc{font-size:10px;color:var(--text-muted);font-family:'SBAggroL','Malgun Gothic',sans-serif;}

/* ── 조회 검색바 ── */
.search-grid{
  display:grid;
  grid-template-columns:repeat(5,1fr);
  gap:10px;margin-bottom:10px;
}
@media(max-width:1200px){.search-grid{grid-template-columns:repeat(3,1fr);}}
@media(max-width:900px) {.search-grid{grid-template-columns:repeat(2,1fr);}}

/* ════════════════════════════════
   Toss 스타일 폼 컴포넌트
════════════════════════════════ */

/* 섹션 카드 패딩 표준화 */
.section-card { padding: 0; overflow: hidden; }

/* 섹션 타이틀 */
.section-title {
  display: flex; align-items: center; gap: 8px;
  font-size: 13px; font-weight: 700;
  color: var(--text-muted);
  padding: 16px 20px 12px;
  border-bottom: 1px solid var(--border);
  letter-spacing: -0.01em;
}
.section-title i { font-size: 12px; opacity: .8; }

/* 섹션 바디 */
.section-body { padding: 16px 20px 18px; }

/* 폼 레이블 */
.form-label {
  display: block;
  font-size: 11px; font-weight: 600;
  color: var(--text-subtle);
  margin-bottom: 5px;
  letter-spacing: -0.01em;
}

/* 폼 인풋 */
.form-input {
  width: 100%;
  background: var(--bg-input);
  border: 1.5px solid var(--border);
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 13px; font-weight: 500;
  color: var(--text-secondary);
  outline: none;
  transition: border-color .12s, box-shadow .12s, background .25s;
  font-family: inherit;
}
.form-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59,130,246,.12);
}
.form-input[type=number] { font-family: 'Courier New', monospace; }

/* 폼 셀렉트 */
.form-select {
  width: 100%;
  background: var(--bg-input);
  border: 1.5px solid var(--border);
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 13px; font-weight: 500;
  color: var(--text-secondary);
  outline: none;
  cursor: pointer;
  transition: border-color .12s, box-shadow .12s, background .25s;
  font-family: inherit;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  padding-right: 28px;
}
.form-select:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59,130,246,.12);
}
.form-select option { background: var(--bg-select-opt); }

/* 폼 그룹 (레이블 + 인풋 묶음) */
.form-group { display: flex; flex-direction: column; }

/* 폼 힌트 텍스트 */
.form-hint {
  font-size: 11px;
  color: var(--text-faint);
  margin-top: 4px;
  line-height: 1.4;
}

/* 보조 버튼 */
.btn-secondary {
  background: var(--bg-input);
  border: 1.5px solid var(--border);
  color: var(--text-muted);
}
.btn-secondary:hover {
  background: var(--bg-raised);
  border-color: var(--border-strong);
  color: var(--text-secondary);
}

/* ── 제약조건 설정 전용 스타일 ── */
.constraint-machine-block {
  background: var(--bg-input);
  border: 1.5px solid var(--border);
  border-radius: 10px;
  padding: 16px;
}
.constraint-machine-block:hover { border-color: var(--border-strong); }
.constraint-machine-header {
  display: flex; align-items: center; gap: 8px;
  margin-bottom: 14px; padding-bottom: 10px;
  border-bottom: 1px solid var(--border);
}
.constraint-machine-header .machine-badge { font-size: 12px; padding: 3px 10px; }
.constraint-machine-title { font-size: 13px; font-weight: 700; color: var(--text-main); }
.constraint-field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.constraint-field-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }

/* ── 시뮬레이션 전용 스타일 ── */
.sim-btn-group {
  display: flex; gap: 6px; align-items: center;
}
.sim-action-btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 7px 16px; border-radius: 8px;
  font-size: 12px; font-weight: 700;
  cursor: pointer; border: none;
  transition: all .15s;
  white-space: nowrap;
}
.sim-action-btn:disabled { opacity: .35; cursor: not-allowed; }
.sab-generate  { background: #7c3aed; color: #fff; }
.sab-generate:hover:not(:disabled)  { background: #6d28d9; }
.sab-confirm   { background: #059669; color: #fff; }
.sab-confirm:hover:not(:disabled)   { background: #047857; }
.sab-unconfirm { background: #d97706; color: #fff; }
.sab-unconfirm:hover:not(:disabled) { background: #b45309; }
.sab-order     { background: #2563eb; color: #fff; }
.sab-order:hover:not(:disabled)     { background: #1d4ed8; }

/* 조합 카드 */
.combo-card {
  border: 1.5px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 10px;
  transition: border-color .12s;
}
.combo-card:hover { border-color: var(--border-strong); }
.combo-card-header {
  display: flex; align-items: center; gap: 10px;
  padding: 12px 16px;
  background: var(--bg-input);
  border-bottom: 1px solid var(--border);
}
.combo-card-body { padding: 12px 16px 0; }
.combo-width-bar {
  display: flex; flex-wrap: wrap; gap: 4px;
  margin-bottom: 10px; align-items: center;
}
.combo-width-chip {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 4px 10px;
  background: var(--bg-raised);
  border: 1.5px solid var(--border);
  border-radius: 6px;
  font-size: 12px; font-weight: 700;
  color: var(--text-secondary);
  font-family: 'Courier New', monospace;
}
.combo-sep {
  font-size: 10px; color: var(--border-strong);
  font-weight: 400;
}

/* 기계 마스터 스펙 테이블 */
.spec-table { width: 100%; border-collapse: collapse; }
.spec-table tr { border-bottom: 1px solid var(--td-border); }
.spec-table tr:last-child { border-bottom: none; }
.spec-table td { padding: 9px 0; font-size: 13px; vertical-align: middle; }
.spec-table td:first-child {
  color: var(--text-subtle); font-size: 12px; width: 48%;
}
.spec-table td:last-child { font-weight: 600; color: var(--text-main); }

/* 재고 우선순위 행 */
.stock-row {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 14px;
  background: var(--bg-input);
  border-radius: 8px;
  border: 1.5px solid transparent;
  transition: border-color .12s;
}
.stock-row:hover { border-color: var(--border); }
.stock-num {
  width: 24px; height: 24px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 800; flex-shrink: 0;
  color: #000;
}
.stock-label { font-size: 13px; font-weight: 500; color: var(--text-secondary); flex: 1; }

/* 예외오더 분리 체크박스 행 */
.excl-row {
  display: flex; align-items: center; gap: 8px;
  padding: 9px 12px;
  background: var(--bg-input);
  border-radius: 7px;
  border: 1.5px solid transparent;
  cursor: pointer;
  font-size: 13px; font-weight: 500;
  color: var(--text-secondary);
  transition: border-color .12s, background .12s;
  user-select: none;
}
.excl-row:hover { border-color: var(--border); }

/* ── 기계 마스터 카드 행 ── */
.machine-row-card {
  background: var(--bg-card);
  transition: background .15s;
}
.machine-row-card:hover {
  background: var(--bg-hover);
}

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
    <div class="nav-item" id="nav-jumbo-list"   onclick="goPage('jumbo-list')">  <i class="fas fa-scroll"></i>점보롤 생산오더</div>

    <div class="nav-group-title">생산오더 관리</div>
    <div class="nav-item" id="nav-prod-list"   onclick="goPage('prod-list')">  <i class="fas fa-clipboard-list"></i>생산오더 조회</div>
    <div class="nav-item" id="nav-prod-cancel" onclick="goPage('prod-cancel')"><i class="fas fa-times-circle"></i>생산오더 취소</div>

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

<!-- ════════════════════════════
     생산오더 조회
════════════════════════════ -->
<div id="page-prod-list" style="display:none;height:100%;flex-direction:column;">
  <div class="page-header">
    <div class="page-title"><i class="fas fa-clipboard-list" style="color:#34d399;"></i>생산오더 조회</div>
    <div class="page-sub">APS에서 생성된 생산오더 현황 조회</div>
  </div>
  <div class="page-scroll" style="padding-top:14px;">

    <!-- 검색 조건 -->
    <div class="section-card" style="padding:14px 18px;">
      <div class="search-grid">
        <div><label class="field-label">생산오더번호</label>
          <input class="inp" id="pl-prodOrderNo" placeholder="1000000101" oninput="filterProdList()">
        </div>
        <div><label class="field-label">판매오더번호</label>
          <input class="inp" id="pl-sapOrderNo" placeholder="4500001001" oninput="filterProdList()">
        </div>
        <div><label class="field-label">납품처</label>
          <input class="inp" id="pl-customerName" placeholder="거래처명" oninput="filterProdList()">
        </div>
        <div><label class="field-label">호기</label>
          <select class="inp" id="pl-machineNo" onchange="filterProdList()">
            <option value="">전체</option>
            <option value="2">2호기</option>
            <option value="3">3호기</option>
          </select>
        </div>
        <div><label class="field-label">평량 (g/m²)</label>
          <select class="inp" id="pl-basisWeight" onchange="filterProdList()">
            <option value="">전체</option>
            <option value="220">220</option>
            <option value="300">300</option>
            <option value="500">500</option>
            <option value="550">550</option>
          </select>
        </div>
        <div><label class="field-label">상태</label>
          <select class="inp" id="pl-status" onchange="filterProdList()">
            <option value="">전체</option>
            <option value="CONFIRMED">CONFIRMED (확정)</option>
            <option value="IN_PROGRESS">IN_PROGRESS (진행중)</option>
            <option value="COMPLETED">COMPLETED (완료)</option>
            <option value="CANCELLED">CANCELLED (취소)</option>
          </select>
        </div>
        <div><label class="field-label">계획시작일 From</label>
          <input class="inp" id="pl-planFrom" type="date" onchange="filterProdList()">
        </div>
        <div><label class="field-label">계획시작일 To</label>
          <input class="inp" id="pl-planTo" type="date" onchange="filterProdList()">
        </div>
        <div style="display:flex;align-items:flex-end;gap:8px;">
          <button class="btn btn-primary btn-sm" onclick="filterProdList()"><i class="fas fa-search"></i> 조회</button>
          <button class="btn btn-ghost btn-sm" onclick="resetProdListFilter()"><i class="fas fa-undo"></i></button>
        </div>
      </div>
    </div>

    <!-- 요약 스탯 -->
    <div style="display:flex;gap:10px;margin-bottom:12px;flex-wrap:wrap;">
      <div class="stat-mini"><div class="sv" style="color:#60a5fa;" id="pls-total">-</div><div class="sl">전체</div></div>
      <div class="stat-mini"><div class="sv" style="color:#34d399;" id="pls-confirmed">-</div><div class="sl">CONFIRMED</div></div>
      <div class="stat-mini"><div class="sv" style="color:#f59e0b;" id="pls-inprogress">-</div><div class="sl">진행중</div></div>
      <div class="stat-mini"><div class="sv" style="color:#94a3b8;" id="pls-completed">-</div><div class="sl">완료</div></div>
      <div class="stat-mini"><div class="sv" style="color:#f87171;" id="pls-cancelled">-</div><div class="sl">취소</div></div>
      <div class="stat-mini"><div class="sv" style="color:#93c5fd;" id="pls-ton">-</div><div class="sl">합계 TON</div></div>
    </div>

    <!-- 결과 테이블 -->
    <div class="section-card" style="overflow:hidden;">
      <div class="card-header">
        <div class="card-label">
          <i class="fas fa-list-alt" style="color:#34d399;"></i>
          조회 결과 <span class="count-badge" id="pl-count">0 건</span>
        </div>
        <div style="display:flex;gap:8px;">
          <button class="btn btn-ghost btn-sm" onclick="goPage('prod-cancel')"><i class="fas fa-times-circle"></i> 생산오더 취소</button>
          <button class="btn btn-ghost btn-sm" onclick="exportProdCsv()"><i class="fas fa-file-csv"></i> CSV</button>
        </div>
      </div>
      <div style="overflow-x:auto;max-height:calc(100vh - 400px);overflow-y:auto;">
        <table class="data-table" id="prod-list-table">
          <thead>
            <tr>
              <th class="center" style="width:36px;">#</th>
              <th>생산오더번호</th>
              <th>판매오더번호</th>
              <th>납품처</th>
              <th>호기</th>
              <th class="num">평량(g)</th>
              <th class="num">지폭(mm)</th>
              <th class="num">수량(TON)</th>
              <th class="num">수량(R)</th>
              <th class="num">수량(SOK)</th>
              <th>계획시작일</th>
              <th>계획종료일</th>
              <th>상태</th>
              <th>취소상태</th>
              <th>생성자</th>
            </tr>
          </thead>
          <tbody id="prod-list-tbody">
            <tr><td colspan="15" class="empty-state">조회 중...</td></tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</div><!-- /page-prod-list -->


<!-- ════════════════════════════
     생산오더 취소
════════════════════════════ -->
<div id="page-prod-cancel" style="display:none;height:100%;flex-direction:column;">
  <div class="page-header">
    <div class="page-title"><i class="fas fa-times-circle" style="color:#f87171;"></i>생산오더 취소</div>
    <div class="page-sub">취소할 생산오더를 선택 후 SAP RFC (Z_CANCEL_PROD_ORDER) 전송</div>
  </div>
  <div class="page-scroll" style="padding-top:14px;">

    <!-- 안내 배너 -->
    <div style="display:flex;align-items:flex-start;gap:10px;padding:12px 16px;background:var(--badge-excl-bg);border:1px solid var(--badge-excl-txt);border-radius:9px;margin-bottom:14px;font-size:12px;color:var(--badge-excl-txt);">
      <i class="fas fa-exclamation-triangle" style="margin-top:1px;flex-shrink:0;"></i>
      <div>
        <b>취소 처리 안내</b><br>
        생산오더 취소 시 SAP RFC <span style="font-family:monospace;">Z_CANCEL_PROD_ORDER</span>를 통해 SAP 생산오더가 <b>취소(CANCELLED)</b> 상태로 변경됩니다.<br>
        <span style="color:var(--text-muted);">※ COMPLETED(완료) 상태의 오더는 취소가 불가합니다. ※ 취소 후 되돌리기 불가합니다.</span>
      </div>
    </div>

    <!-- 검색 조건 -->
    <div class="section-card" style="padding:14px 18px;">
      <div class="search-grid">
        <div><label class="field-label">생산오더번호</label>
          <input class="inp" id="pc-prodOrderNo" placeholder="1000000101" oninput="filterCancelList()">
        </div>
        <div><label class="field-label">판매오더번호</label>
          <input class="inp" id="pc-sapOrderNo" placeholder="4500001001" oninput="filterCancelList()">
        </div>
        <div><label class="field-label">납품처</label>
          <input class="inp" id="pc-customerName" placeholder="거래처명" oninput="filterCancelList()">
        </div>
        <div><label class="field-label">호기</label>
          <select class="inp" id="pc-machineNo" onchange="filterCancelList()">
            <option value="">전체</option>
            <option value="2">2호기</option>
            <option value="3">3호기</option>
          </select>
        </div>
        <div><label class="field-label">상태</label>
          <select class="inp" id="pc-status" onchange="filterCancelList()">
            <option value="">전체 (취소가능)</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
          </select>
        </div>
        <div style="display:flex;align-items:flex-end;gap:8px;">
          <button class="btn btn-primary btn-sm" onclick="filterCancelList()"><i class="fas fa-search"></i> 조회</button>
          <button class="btn btn-ghost btn-sm" onclick="resetCancelFilter()"><i class="fas fa-undo"></i></button>
        </div>
      </div>
    </div>

    <!-- RFC 전송 결과 배너 (초기 숨김) -->
    <div id="cancel-rfc-result" style="display:none;margin-bottom:14px;">
      <div id="cancel-rfc-banner" style="display:flex;align-items:center;gap:10px;padding:12px 16px;border-radius:9px;font-size:13px;font-weight:700;">
        <i id="cancel-rfc-icon" class="fas fa-check-circle"></i>
        <span id="cancel-rfc-msg"></span>
        <span id="cancel-rfc-detail" style="font-weight:400;font-size:12px;color:var(--text-muted);margin-left:4px;"></span>
      </div>
    </div>

    <!-- 결과 테이블 -->
    <div class="section-card" style="overflow:hidden;">
      <div class="card-header">
        <div class="card-label">
          <i class="fas fa-times-circle" style="color:#f87171;"></i>
          취소 가능 생산오더 <span class="count-badge" id="pc-count">0 건</span>
        </div>
        <div style="display:flex;gap:8px;align-items:center;">
          <label style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--text-subtle);cursor:pointer;">
            <input type="checkbox" id="chk-all-cancel" onchange="toggleAllCancel(this.checked)"> 전체선택
          </label>
          <button class="btn btn-danger btn-sm" id="btn-do-cancel" onclick="openCancelModal()" disabled>
            <i class="fas fa-times-circle"></i> 취소처리
          </button>
        </div>
      </div>
      <div style="overflow-x:auto;max-height:calc(100vh - 440px);overflow-y:auto;">
        <table class="data-table" id="cancel-list-table">
          <thead>
            <tr>
              <th class="center" style="width:36px;"><input type="checkbox" id="chk-head-cancel" onchange="toggleAllCancel(this.checked)"></th>
              <th>생산오더번호</th>
              <th>판매오더번호</th>
              <th>납품처</th>
              <th>호기</th>
              <th class="num">평량(g)</th>
              <th class="num">지폭(mm)</th>
              <th class="num">수량(TON)</th>
              <th>계획시작일</th>
              <th>계획종료일</th>
              <th>상태</th>
              <th>생성자</th>
            </tr>
          </thead>
          <tbody id="cancel-list-tbody">
            <tr><td colspan="12" class="empty-state">조회 조건을 입력하고 <b style="color:#60a5fa;">조회</b> 버튼을 클릭하세요.</td></tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</div><!-- /page-prod-cancel -->

<!-- 취소 확인 모달 -->
<div class="modal-bg" id="cancelModal">
  <div class="modal">
    <div class="modal-title"><i class="fas fa-times-circle" style="color:#ef4444;margin-right:8px;"></i>생산오더 취소 확인</div>
    <div style="font-size:13px;color:var(--text-muted);margin-bottom:14px;">
      선택한 <b id="cancel-modal-count" style="color:#f87171;">0</b>건의 생산오더를 취소합니다.<br>
      SAP RFC <span style="font-family:monospace;color:#38bdf8;">Z_CANCEL_PROD_ORDER</span>를 통해 SAP에 전송됩니다.
    </div>
    <div style="margin-bottom:16px;">
      <label class="field-label">취소 사유 *</label>
      <input class="inp" id="cancel-reason-input" placeholder="취소 사유를 입력하세요">
    </div>
    <div style="margin-bottom:16px;">
      <label class="field-label">처리자</label>
      <input class="inp" id="cancel-by-input" placeholder="예: 홍길동" value="홍길동">
    </div>
    <!-- RFC 전송 중 표시 -->
    <div class="rfc-loading" id="cancel-rfc-loading">
      <span class="spin"><i class="fas fa-sync"></i></span>
      SAP RFC 전송 중… (Z_CANCEL_PROD_ORDER)
    </div>
    <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:16px;">
      <button class="btn btn-ghost" id="btn-cancel-close" onclick="closeCancelModal()">닫기</button>
      <button class="btn btn-danger" id="btn-cancel-confirm" onclick="doCancel()">
        <i class="fas fa-paper-plane"></i> RFC 전송 · 취소 확정
      </button>
    </div>
  </div>
</div>

<!-- 취소 완료 결과 모달 -->
<div class="modal-bg" id="cancelResultModal">
  <div class="modal" style="width:520px;">
    <div class="modal-title"><i class="fas fa-check-circle" style="color:#4ade80;margin-right:8px;"></i>취소 처리 완료</div>
    <div id="cancel-result-body" style="font-size:13px;"></div>
    <div style="display:flex;justify-content:flex-end;margin-top:20px;">
      <button class="btn btn-ghost" onclick="closeCancelResultModal()">확인</button>
    </div>
  </div>
</div>

<!-- ══════════════════════════════════════════
     기계 마스터
══════════════════════════════════════════ -->
<div id="page-machine" style="display:none;height:100%;flex-direction:column;">
  <div class="page-header" style="display:flex;align-items:center;justify-content:space-between;padding-bottom:16px;border-bottom:1px solid var(--border);">
    <div>
      <div class="page-title"><i class="fas fa-cog" style="color:#34d399;"></i>기계 마스터</div>
      <div class="page-sub">생산 호기별 지폭 규정 및 운영 기준 — 추가·수정·삭제 가능</div>
    </div>
    <div style="display:flex;gap:8px;">
      <button class="btn btn-sm btn-secondary" onclick="loadMachine()"><i class="fas fa-sync-alt"></i> 새로고침</button>
      <button class="btn btn-sm btn-primary" onclick="openMachineModal(null)" style="background:#7c3aed;border-color:#7c3aed;">
        <i class="fas fa-plus"></i> 기계 추가
      </button>
    </div>
  </div>
  <div class="page-scroll">

    <!-- 기계 목록 카드 (동적 렌더링) -->
    <div class="section-card" style="margin-bottom:14px;">
      <div class="section-title">
        <i class="fas fa-server" style="color:#34d399;"></i>
        <span>호기 목록</span>
        <span id="machine-count-badge" style="margin-left:auto;font-size:11px;font-weight:600;color:var(--text-faint);"></span>
      </div>
      <div class="section-body" style="padding:0;">
        <div id="machine-table-wrap">
          <!-- renderMachineTable()로 채워짐 -->
        </div>
      </div>
    </div>

    <!-- 공통 규정 + 자재코드 2열 (고정) -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">

      <!-- 공통 규정 -->
      <div class="section-card">
        <div class="section-title"><i class="fas fa-book-open" style="color:#f59e0b;"></i>공통 규정</div>
        <div class="section-body" style="padding-bottom:0;">
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px;">
            <div style="text-align:center;padding:14px 10px;background:var(--bg-base);border-radius:8px;border:1px solid var(--border);">
              <div style="font-size:20px;font-weight:800;color:#34d399;line-height:1;">3 TON</div>
              <div style="font-size:11px;color:var(--text-faint);margin-top:5px;">규격당 MOQ</div>
            </div>
            <div style="text-align:center;padding:14px 10px;background:var(--bg-base);border-radius:8px;border:1px solid var(--border);">
              <div style="font-size:20px;font-weight:800;color:#a78bfa;line-height:1;">1.5 TON</div>
              <div style="font-size:11px;color:var(--text-faint);margin-top:5px;">동일규격 포장 다를 시</div>
            </div>
            <div style="text-align:center;padding:14px 10px;background:var(--bg-base);border-radius:8px;border:1px solid var(--border);">
              <div style="font-size:20px;font-weight:800;color:#60a5fa;line-height:1;">30 mm</div>
              <div style="font-size:11px;color:var(--text-faint);margin-top:5px;">배폭 생산 시 미미</div>
            </div>
          </div>
          <table class="data-table" style="font-size:12px;margin-bottom:2px;">
            <thead><tr><th>항목</th><th>기준</th><th>비고</th></tr></thead>
            <tbody>
              <tr><td>545mm 미만</td><td><span class="badge b-cancel" style="font-size:10px;">1폭 불가</span></td><td style="color:var(--text-faint);">배폭 필수</td></tr>
              <tr><td>889mm 초과</td><td><span class="badge b-cancel" style="font-size:10px;">2폭 불가</span></td><td style="color:var(--text-faint);">-</td></tr>
              <tr><td>889mm 2폭</td><td style="color:var(--text-muted);">5톤 이하만 배폭</td><td style="color:var(--text-faint);">-</td></tr>
              <tr><td>원지 비중</td><td><span class="badge b-open" style="font-size:10px;">60% 이상</span></td><td style="color:var(--text-faint);">미만 시 외주 컷팅</td></tr>
              <tr><td>두폭 비중</td><td><span class="badge b-assigned" style="font-size:10px;">30% 이상</span></td><td style="color:var(--text-faint);">조합 진행 가능</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 자재코드 해독 -->
      <div class="section-card">
        <div class="section-title"><i class="fas fa-barcode" style="color:#60a5fa;"></i>자재코드 해독 규칙</div>
        <div class="section-body">
          <table class="data-table" style="font-size:12px;margin-bottom:14px;">
            <thead><tr><th>위치</th><th>의미</th><th>값</th></tr></thead>
            <tbody>
              <tr><td style="font-family:monospace;color:#a78bfa;">LEFT(1)</td><td>품목유형</td><td><span style="color:#34d399;">F</span>=제품 / <span style="color:#f59e0b;">H</span>=반제품</td></tr>
              <tr><td style="font-family:monospace;color:#a78bfa;">MID(2,1)</td><td>생산호기</td><td>1=1호기 / 2=2호기 / 3=3호기</td></tr>
              <tr><td style="font-family:monospace;color:#a78bfa;">RIGHT(1)</td><td>포장방법</td><td>A=속포장 / B=벌크 / Null=Roll</td></tr>
              <tr><td style="font-family:monospace;color:#a78bfa;">MID(6,3)</td><td>평량</td><td>g/m²</td></tr>
              <tr><td style="font-family:monospace;color:#a78bfa;">MID(10,4)</td><td>지폭</td><td>mm</td></tr>
              <tr><td style="font-family:monospace;color:#a78bfa;">MID(14,4)</td><td>지장</td><td>mm</td></tr>
            </tbody>
          </table>
          <div style="padding:14px;background:var(--bg-base);border-radius:8px;border:1px solid var(--border);">
            <div style="font-size:11px;font-weight:700;color:var(--text-muted);margin-bottom:8px;text-transform:uppercase;letter-spacing:.05em;">예시</div>
            <div style="font-family:monospace;font-size:14px;color:#60a5fa;letter-spacing:2px;margin-bottom:10px;">F2____220_0800____B</div>
            <div style="display:flex;flex-direction:column;gap:4px;">
              <div style="display:flex;gap:8px;font-size:12px;"><span style="color:#34d399;font-family:monospace;min-width:28px;">F</span><span style="color:var(--text-muted);">제품</span></div>
              <div style="display:flex;gap:8px;font-size:12px;"><span style="color:#60a5fa;font-family:monospace;min-width:28px;">2</span><span style="color:var(--text-muted);">2호기</span></div>
              <div style="display:flex;gap:8px;font-size:12px;"><span style="color:#a78bfa;font-family:monospace;min-width:28px;">220</span><span style="color:var(--text-muted);">평량 220g/m²</span></div>
              <div style="display:flex;gap:8px;font-size:12px;"><span style="color:#f59e0b;font-family:monospace;min-width:28px;">0800</span><span style="color:var(--text-muted);">지폭 800mm</span></div>
              <div style="display:flex;gap:8px;font-size:12px;"><span style="color:#f87171;font-family:monospace;min-width:28px;">B</span><span style="color:var(--text-muted);">Sheet 벌크포장</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div><!-- /page-machine -->

<!-- ══════════════════════════════════════════
     기계 추가/수정 모달
══════════════════════════════════════════ -->
<div id="modal-machine" style="display:none;position:fixed;inset:0;z-index:1100;background:rgba(0,0,0,.55);align-items:center;justify-content:center;">
  <div style="background:var(--bg-card);border-radius:14px;width:560px;max-width:95vw;max-height:92vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.35);overflow:hidden;">

    <!-- 모달 헤더 -->
    <div style="display:flex;align-items:center;justify-content:space-between;padding:18px 22px;border-bottom:1px solid var(--border);">
      <div style="font-size:15px;font-weight:700;color:var(--text-main);" id="machine-modal-title">기계 추가</div>
      <button onclick="closeMachineModal()" style="background:none;border:none;cursor:pointer;color:var(--text-faint);font-size:18px;padding:2px 6px;border-radius:6px;">✕</button>
    </div>

    <!-- 모달 바디 (스크롤 가능) -->
    <div style="overflow-y:auto;padding:20px 22px;flex:1;">
      <input type="hidden" id="mf-id">

      <!-- 기본 정보 -->
      <div style="font-size:11px;font-weight:700;color:var(--text-subtle);text-transform:uppercase;letter-spacing:.07em;margin-bottom:12px;">기본 정보</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:18px;">
        <div>
          <label class="form-label">호기 번호 <span style="color:#f87171;">*</span></label>
          <input id="mf-machineNo" class="form-input" type="text" placeholder="예: 4" maxlength="10">
        </div>
        <div>
          <label class="form-label">호기 이름 <span style="color:#f87171;">*</span></label>
          <input id="mf-machineName" class="form-input" type="text" placeholder="예: 4호기" maxlength="30">
        </div>
        <div style="grid-column:1/-1;">
          <label class="form-label">설명 / 생산 품종</label>
          <input id="mf-description" class="form-input" type="text" placeholder="예: 크라프트 / 골판지 원지" maxlength="60">
        </div>
      </div>

      <!-- 지폭 규정 -->
      <div style="font-size:11px;font-weight:700;color:var(--text-subtle);text-transform:uppercase;letter-spacing:.07em;margin-bottom:12px;">지폭 규정 (mm)</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:18px;">
        <div>
          <label class="form-label">최대 지폭</label>
          <input id="mf-maxWidth" class="form-input" type="number" placeholder="예: 2520" min="0">
        </div>
        <div>
          <label class="form-label">최소 지폭</label>
          <input id="mf-minWidth" class="form-input" type="number" placeholder="예: 2400" min="0">
        </div>
        <div>
          <label class="form-label">최대 폭수 (폭)</label>
          <input id="mf-maxPok" class="form-input" type="number" placeholder="예: 4" min="1" max="10">
        </div>
        <div>
          <label class="form-label">4폭 최소조건 (mm)</label>
          <input id="mf-fourPokMinWidth" class="form-input" type="number" placeholder="비어있으면 조건 없음" min="0">
        </div>
        <div>
          <label class="form-label">배폭 미미 (mm)</label>
          <input id="mf-mimi" class="form-input" type="number" placeholder="예: 30" min="0">
        </div>
        <div>
          <label class="form-label">생산 불가 밀롤 한계 (mm)</label>
          <input id="mf-noProdLimit" class="form-input" type="number" placeholder="예: 625" min="0">
        </div>
      </div>

      <!-- 평량 예외 규정 -->
      <div style="font-size:11px;font-weight:700;color:var(--text-subtle);text-transform:uppercase;letter-spacing:.07em;margin-bottom:12px;">평량 예외 규정</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:18px;">
        <div>
          <label class="form-label">예외 평량 목록 (쉼표 구분)</label>
          <input id="mf-bwExceptionList" class="form-input" type="text" placeholder="예: 300,500,550 (없으면 빈칸)">
        </div>
        <div>
          <label class="form-label">예외 평량 최대 지폭 (mm)</label>
          <input id="mf-bwExceptionMaxWidth" class="form-input" type="number" placeholder="예: 3410 (없으면 빈칸)" min="0">
        </div>
      </div>

      <!-- 메모 -->
      <div style="font-size:11px;font-weight:700;color:var(--text-subtle);text-transform:uppercase;letter-spacing:.07em;margin-bottom:12px;">메모</div>
      <div style="margin-bottom:4px;">
        <label class="form-label">비고 / 특이사항</label>
        <textarea id="mf-note" class="form-input" rows="2" placeholder="예: 620×4폭 불가 / 620×3 + 640×1 가능" style="resize:vertical;min-height:52px;"></textarea>
      </div>
    </div>

    <!-- 모달 푸터 -->
    <div style="display:flex;align-items:center;justify-content:flex-end;gap:8px;padding:14px 22px;border-top:1px solid var(--border);">
      <button class="btn btn-sm btn-secondary" onclick="closeMachineModal()">취소</button>
      <button class="btn btn-sm btn-primary" id="machine-save-btn" onclick="saveMachine()" style="background:#7c3aed;border-color:#7c3aed;">
        <i class="fas fa-save"></i> 저장
      </button>
    </div>
  </div>
</div><!-- /modal-machine -->

<!-- 기계 삭제 확인 모달 -->
<div id="modal-machine-del" style="display:none;position:fixed;inset:0;z-index:1200;background:rgba(0,0,0,.55);align-items:center;justify-content:center;">
  <div style="background:var(--bg-card);border-radius:14px;width:360px;max-width:92vw;box-shadow:0 16px 48px rgba(0,0,0,.35);overflow:hidden;">
    <div style="padding:22px 22px 0;">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
        <div style="width:36px;height:36px;border-radius:50%;background:#fef2f2;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <i class="fas fa-trash" style="color:#ef4444;font-size:15px;"></i>
        </div>
        <div style="font-size:15px;font-weight:700;color:var(--text-main);">기계 삭제</div>
      </div>
      <div id="machine-del-msg" style="font-size:13px;color:var(--text-muted);line-height:1.6;padding-bottom:18px;"></div>
    </div>
    <div style="display:flex;gap:8px;padding:14px 22px;border-top:1px solid var(--border);justify-content:flex-end;">
      <button class="btn btn-sm btn-secondary" onclick="closeMachineDelModal()">취소</button>
      <button class="btn btn-sm" id="machine-del-confirm-btn" onclick="confirmDeleteMachine()"
        style="background:#ef4444;color:#fff;border:none;border-radius:8px;padding:6px 16px;font-size:12px;font-weight:700;cursor:pointer;">
        <i class="fas fa-trash"></i> 삭제
      </button>
    </div>
  </div>
</div><!-- /modal-machine-del -->

<!-- ══════════════════════════════════════════
     제약조건 설정
══════════════════════════════════════════ -->
<div id="page-constraint" style="display:none;height:100%;flex-direction:column;">
  <div class="page-header" style="display:flex;align-items:center;justify-content:space-between;padding-bottom:16px;border-bottom:1px solid var(--border);">
    <div>
      <div class="page-title"><i class="fas fa-sliders-h" style="color:#f59e0b;"></i>제약조건 설정</div>
      <div class="page-sub">지폭조합 시뮬레이션에 적용되는 기준값을 설정합니다</div>
    </div>
    <div style="display:flex;gap:8px;">
      <button class="btn btn-sm btn-secondary" onclick="resetConstraints()"><i class="fas fa-undo"></i> 기본값 복원</button>
      <button class="btn btn-sm btn-primary" onclick="saveConstraints()"><i class="fas fa-save"></i> 저장</button>
    </div>
  </div>
  <div class="page-scroll">

    <div id="constraint-save-banner" style="display:none;margin-bottom:12px;padding:10px 16px;border-radius:8px;border:1px solid #34d399;color:#16a34a;font-size:13px;align-items:center;gap:8px;">
      <i class="fas fa-check-circle"></i> 제약조건이 저장되었습니다.
    </div>

    <!-- 기계별 지폭 규정 -->
    <div class="section-card">
      <div class="section-title"><i class="fas fa-ruler-horizontal" style="color:#60a5fa;"></i>기계별 지폭 규정</div>
      <div class="section-body">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div class="constraint-machine-block">
            <div class="constraint-machine-header">
              <span class="machine-badge constraint-machine-badge">2호기</span>
              <span class="constraint-machine-title">지폭 규정</span>
            </div>
            <div class="constraint-field-grid">
              <div class="form-group">
                <label class="form-label">최대 지폭 (mm)</label>
                <input type="number" class="form-input" id="c-m2-max" value="2520" min="0" max="9999">
              </div>
              <div class="form-group">
                <label class="form-label">최소 지폭 (mm)</label>
                <input type="number" class="form-input" id="c-m2-min" value="2400" min="0" max="9999">
              </div>
              <div class="form-group">
                <label class="form-label">최대 폭수</label>
                <input type="number" class="form-input" id="c-m2-maxpok" value="4" min="1" max="8">
              </div>
              <div class="form-group">
                <label class="form-label">4폭 시 최소 1폭 크기 (mm)</label>
                <input type="number" class="form-input" id="c-m2-4pok-min" value="630" min="0" max="9999">
              </div>
            </div>
          </div>
          <div class="constraint-machine-block">
            <div class="constraint-machine-header">
              <span class="machine-badge constraint-machine-badge">3호기</span>
              <span class="constraint-machine-title">지폭 규정</span>
            </div>
            <div class="constraint-field-grid">
              <div class="form-group">
                <label class="form-label">최대 지폭 (mm)</label>
                <input type="number" class="form-input" id="c-m3-max" value="3420" min="0" max="9999">
              </div>
              <div class="form-group">
                <label class="form-label">최소 지폭 (mm)</label>
                <input type="number" class="form-input" id="c-m3-min" value="3300" min="0" max="9999">
              </div>
              <div class="form-group">
                <label class="form-label">최대 폭수</label>
                <input type="number" class="form-input" id="c-m3-maxpok" value="4" min="1" max="8">
              </div>
              <div class="form-group">
                <label class="form-label">평량 예외 최대지폭 (mm)</label>
                <input type="number" class="form-input" id="c-m3-exc-max" value="3410" min="0" max="9999">
              </div>
            </div>
            <div class="form-group" style="margin-top:12px;">
              <label class="form-label">예외 적용 평량 (쉼표 구분, g/m²)</label>
              <input type="text" class="form-input" id="c-m3-exc-bw" value="300,500,550" placeholder="예: 300,500,550">
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 배폭·폭수 규정 + MOQ 나란히 -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">

      <div class="section-card">
        <div class="section-title"><i class="fas fa-expand-arrows-alt" style="color:#a78bfa;"></i>배폭 · 폭수 규정</div>
        <div class="section-body">
          <div class="constraint-field-grid" style="margin-bottom:12px;">
            <div class="form-group">
              <label class="form-label">배폭 미미 (mm)</label>
              <input type="number" class="form-input" id="c-mimi" value="30" min="0" max="100">
            </div>
            <div class="form-group">
              <label class="form-label">생산 불가 기준 (mm 이하)</label>
              <input type="number" class="form-input" id="c-noprod-limit" value="625" min="0" max="9999">
              <span class="form-hint">밀롤 크기가 이 값 이하만 있으면 생산 불가</span>
            </div>
            <div class="form-group">
              <label class="form-label">545mm 미만 처리</label>
              <select class="form-select" id="c-545-rule">
                <option value="double">배폭 필수</option>
                <option value="reject">생산 불가</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">889mm 초과 처리</label>
              <select class="form-select" id="c-889-rule">
                <option value="single">1폭만 가능</option>
                <option value="reject">생산 불가</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">889mm 2폭 배폭 허용 기준 (TON 이하)</label>
            <input type="number" class="form-input" id="c-889-double-limit" value="5" min="0" max="999" style="max-width:160px;">
          </div>
        </div>
      </div>

      <div class="section-card">
        <div class="section-title"><i class="fas fa-boxes" style="color:#34d399;"></i>MOQ · 오더취합 규정</div>
        <div class="section-body">
          <div class="constraint-field-grid" style="margin-bottom:12px;">
            <div class="form-group">
              <label class="form-label">규격당 MOQ (TON)</label>
              <input type="number" class="form-input" id="c-moq" value="3" min="0" step="0.5">
            </div>
            <div class="form-group">
              <label class="form-label">동일규격 포장 다를 시 (TON)</label>
              <input type="number" class="form-input" id="c-moq-same" value="1.5" min="0" step="0.5">
            </div>
            <div class="form-group">
              <label class="form-label">원지 비중 최소 (%)</label>
              <input type="number" class="form-input" id="c-wj-ratio" value="60" min="0" max="100">
              <span class="form-hint">미만 시 밀롤 생산 후 외주 컷팅</span>
            </div>
            <div class="form-group">
              <label class="form-label">두폭 비중 최소 (%)</label>
              <input type="number" class="form-input" id="c-dpok-ratio" value="30" min="0" max="100">
              <span class="form-hint">이상 시 지폭조합 진행 가능</span>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">원지 구분</label>
            <select class="form-select" id="c-wj-separate" style="max-width:240px;">
              <option value="yes">원지 / 시트 분리 조합</option>
              <option value="no">혼합 허용</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- 예외 오더 + 재고 우선순위 나란히 -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">

      <div class="section-card">
        <div class="section-title"><i class="fas fa-exclamation-triangle" style="color:#f87171;"></i>예외 오더 분리 규정</div>
        <div class="section-body">
          <div style="font-size:12px;color:var(--text-faint);margin-bottom:12px;">시뮬레이션 시 아래 유형은 일반 오더와 자동 분리됩니다.</div>
          <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:14px;">
            <label class="excl-row"><input type="checkbox" id="c-exc-japan" checked> 일본 수출</label>
            <label class="excl-row"><input type="checkbox" id="c-exc-special" checked> 특수지</label>
            <label class="excl-row"><input type="checkbox" id="c-exc-flagged" checked> 예외처리 플래그 오더</label>
            <label class="excl-row"><input type="checkbox" id="c-exc-phil"> 필리핀 450G</label>
          </div>
          <div class="form-group">
            <label class="form-label">추가 예외 거래처 코드 (쉼표 구분)</label>
            <input type="text" class="form-input" id="c-exc-customers" placeholder="예: C005,C011">
          </div>
        </div>
      </div>

      <div class="section-card">
        <div class="section-title"><i class="fas fa-warehouse" style="color:#60a5fa;"></i>재고 우선순위</div>
        <div class="section-body">
          <div style="font-size:12px;color:var(--text-faint);margin-bottom:12px;">신규 생산 전 재고를 먼저 검토하는 순서입니다.</div>
          <div style="display:flex;flex-direction:column;gap:8px;">
            <div class="stock-row">
              <span class="stock-num" style="background:#34d399;">1</span>
              <span class="stock-label">밀롤창고 재고 활용</span>
              <input type="checkbox" id="c-stock-millroll" checked>
            </div>
            <div class="stock-row">
              <span class="stock-num" style="background:#60a5fa;">2</span>
              <span class="stock-label">공장 시트 장기재고 재단</span>
              <input type="checkbox" id="c-stock-sheet" checked>
            </div>
            <div class="stock-row">
              <span class="stock-num" style="background:#a78bfa;">3</span>
              <span class="stock-label">신규 생산</span>
              <input type="checkbox" id="c-stock-new" checked>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</div><!-- /page-constraint -->

<!-- ══════════════════════════════════════════
     지폭조합 시뮬레이션
══════════════════════════════════════════ -->
<div id="page-simulation" style="display:none;height:100%;flex-direction:column;">
  <!-- 헤더: 타이틀 + 4버튼 -->
  <div class="page-header" style="padding-bottom:14px;border-bottom:1px solid var(--border);">
    <div style="display:flex;align-items:center;justify-content:space-between;">
      <div>
        <div class="page-title"><i class="fas fa-layer-group" style="color:#a78bfa;"></i>지폭조합 시뮬레이션</div>
        <div class="page-sub">오더를 선택하여 지폭조합을 생성하고 SAP 생산오더로 전달합니다</div>
      </div>
      <div style="display:flex;align-items:center;gap:6px;">
        <button class="sim-action-btn sab-generate" id="btn-sim-generate" onclick="simGenerate()">
          <i class="fas fa-magic"></i> 생성
        </button>
        <div style="width:1px;height:24px;background:var(--border);margin:0 2px;"></div>
        <button class="sim-action-btn sab-confirm"   id="btn-sim-confirm"   onclick="simConfirm()"   disabled>
          <i class="fas fa-check-double"></i> 확정
        </button>
        <button class="sim-action-btn sab-unconfirm" id="btn-sim-unconfirm" onclick="simUnconfirm()" disabled>
          <i class="fas fa-undo-alt"></i> 확정취소
        </button>
        <div style="width:1px;height:24px;background:var(--border);margin:0 2px;"></div>
        <button class="sim-action-btn sab-order"     id="btn-sim-order"     onclick="simSendOrder()" disabled>
          <i class="fas fa-paper-plane"></i> 오더생성
        </button>
      </div>
    </div>
    <!-- 상태 표시줄 -->
    <div id="sim-status-banner" style="margin-top:10px;padding:8px 14px;border-radius:7px;background:var(--bg-input);border:1px solid var(--border);font-size:12px;display:flex;align-items:center;gap:8px;">
      <i class="fas fa-info-circle" style="color:#60a5fa;flex-shrink:0;"></i>
      <span id="sim-status-text" style="color:var(--text-muted);">조회 조건을 설정하고 <b>생성</b> 버튼을 눌러 시뮬레이션을 시작하세요.</span>
      <span id="sim-state-badge" style="margin-left:auto;flex-shrink:0;"></span>
    </div>
  </div>

  <div class="page-scroll">
    <div style="display:grid;grid-template-columns:260px 1fr;gap:14px;align-items:start;">

      <!-- 좌: 조회 조건 패널 -->
      <div style="display:flex;flex-direction:column;gap:12px;">
        <div class="section-card">
          <div class="section-title"><i class="fas fa-search" style="color:#60a5fa;"></i>조회 조건</div>
          <div class="section-body" style="display:flex;flex-direction:column;gap:10px;">
            <div class="form-group">
              <label class="form-label">호기</label>
              <select class="form-select" id="sim-machineNo">
                <option value="">전체</option>
                <option value="2">2호기</option>
                <option value="3">3호기</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">평량 (g/m²)</label>
              <select class="form-select" id="sim-basisWeight">
                <option value="">전체</option>
                <option value="220">220</option>
                <option value="300">300</option>
                <option value="500">500</option>
                <option value="550">550</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">납기일 From</label>
              <input type="date" class="form-input" id="sim-dueFrom">
            </div>
            <div class="form-group">
              <label class="form-label">납기일 To</label>
              <input type="date" class="form-input" id="sim-dueTo">
            </div>
            <div class="form-group">
              <label class="form-label">오더 상태</label>
              <select class="form-select" id="sim-orderStatus">
                <option value="OPEN">OPEN</option>
                <option value="">전체</option>
              </select>
            </div>
            <div style="padding-top:10px;border-top:1px solid var(--border);">
              <div style="font-size:11px;font-weight:700;color:var(--text-subtle);margin-bottom:8px;text-transform:uppercase;letter-spacing:.04em;">예외 분리</div>
              <div style="display:flex;flex-direction:column;gap:5px;">
                <label class="excl-row" style="padding:7px 10px;"><input type="checkbox" id="sim-exc-japan" checked> 일본수출 분리</label>
                <label class="excl-row" style="padding:7px 10px;"><input type="checkbox" id="sim-exc-special" checked> 특수지 분리</label>
                <label class="excl-row" style="padding:7px 10px;"><input type="checkbox" id="sim-exc-flagged" checked> 예외 플래그 분리</label>
              </div>
            </div>
          </div>
        </div>

        <!-- 적용 제약조건 요약 -->
        <div class="section-card">
          <div class="section-title" style="font-size:12px;"><i class="fas fa-lock" style="color:#f59e0b;"></i>적용 제약조건</div>
          <div class="section-body" style="padding-top:10px;">
            <div id="sim-constraint-summary" style="font-size:12px;color:var(--text-muted);line-height:2;display:flex;flex-direction:column;gap:1px;">
              <div>2호기: 2,400 ~ 2,520mm / 최대4폭</div>
              <div>3호기: 3,300 ~ 3,420mm / 최대4폭</div>
              <div>배폭 미미: 30mm</div>
              <div>MOQ: 3T / 동일규격: 1.5T</div>
              <div>원지비중: 60% 이상</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 우: 메인 콘텐츠 -->
      <div style="display:flex;flex-direction:column;gap:12px;">

        <!-- 대상 오더 목록 -->
        <div class="section-card" id="sim-order-panel">
          <div class="section-title">
            <i class="fas fa-list-ul" style="color:#60a5fa;"></i>대상 오더 목록
            <span id="sim-order-count" class="count-badge" style="margin-left:8px;">-</span>
            <label style="margin-left:auto;display:flex;align-items:center;gap:5px;font-size:12px;font-weight:500;cursor:pointer;">
              <input type="checkbox" id="sim-chk-all" onchange="simToggleAll(this.checked)"> 전체선택
            </label>
          </div>
          <div style="overflow-x:auto;">
            <table class="data-table" style="font-size:12px;">
              <thead>
                <tr>
                  <th style="width:32px;"></th>
                  <th>오더번호</th><th>납품처</th><th>호기</th><th>평량</th><th>지폭</th><th>수량</th><th>납기일</th><th>유형</th><th>예외</th>
                </tr>
              </thead>
              <tbody id="sim-order-tbody">
                <tr><td colspan="10" class="empty-state">조회 조건을 설정하고 생성 버튼을 눌러주세요.</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 조합 결과 -->
        <div class="section-card" id="sim-result-panel" style="display:none;">
          <div class="section-title">
            <i class="fas fa-th" style="color:#a78bfa;"></i>지폭조합 결과
            <span id="sim-result-count" class="count-badge" style="margin-left:8px;"></span>
          </div>
          <div class="section-body" style="padding-bottom:6px;">
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:16px;">
              <div class="stat-mini"><div class="sv" id="sr-total"  style="color:#a78bfa;">-</div><div class="sl">조합 수</div></div>
              <div class="stat-mini"><div class="sv" id="sr-orders" style="color:#60a5fa;">-</div><div class="sl">포함 오더</div></div>
              <div class="stat-mini"><div class="sv" id="sr-ton"    style="color:#34d399;">-</div><div class="sl">합계 TON</div></div>
              <div class="stat-mini"><div class="sv" id="sr-loss"   style="color:#f87171;">-</div><div class="sl">평균 Loss</div></div>
            </div>
            <div id="sim-combo-list"></div>
          </div>
        </div>

        <!-- 분리된 예외 오더 -->
        <div class="section-card" id="sim-excl-panel" style="display:none;">
          <div class="section-title" style="color:#f87171;">
            <i class="fas fa-exclamation-triangle" style="color:#f87171;"></i>분리된 예외 오더
          </div>
          <div style="overflow-x:auto;">
            <table class="data-table" style="font-size:12px;">
              <thead>
                <tr><th>오더번호</th><th>납품처</th><th>호기</th><th>평량</th><th>지폭</th><th>수량</th><th>유형</th><th>분리사유</th></tr>
              </thead>
              <tbody id="sim-excl-tbody"></tbody>
            </table>
          </div>
        </div>

        <!-- ══ 점보롤 생산오더 결과 패널 (오더생성 후 표시) ══ -->
        <div class="section-card" id="sim-jumbo-panel" style="display:none;">
          <div class="section-title">
            <i class="fas fa-scroll" style="color:#34d399;"></i>
            점보롤 생산오더
            <span id="sim-jumbo-count" class="count-badge" style="margin-left:8px;"></span>
            <span style="margin-left:auto;font-size:11px;font-weight:600;color:#34d399;" id="sim-jumbo-status-badge"></span>
          </div>

          <!-- 요약 스탯 -->
          <div class="section-body" style="padding-bottom:0;">
            <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-bottom:16px;">
              <div class="stat-mini"><div class="sv" id="sj-count"   style="color:#34d399;">-</div><div class="sl">점보롤 수</div></div>
              <div class="stat-mini"><div class="sv" id="sj-m2"      style="color:#60a5fa;">-</div><div class="sl">2호기</div></div>
              <div class="stat-mini"><div class="sv" id="sj-m3"      style="color:#a78bfa;">-</div><div class="sl">3호기</div></div>
              <div class="stat-mini"><div class="sv" id="sj-ton"     style="color:#34d399;">-</div><div class="sl">총 생산량(TON)</div></div>
              <div class="stat-mini"><div class="sv" id="sj-avgloss" style="color:#f87171;">-</div><div class="sl">평균 Loss</div></div>
            </div>

            <!-- 점보롤 오더 테이블 -->
            <div style="overflow-x:auto;margin-bottom:4px;">
              <table class="data-table" style="font-size:12px;">
                <thead>
                  <tr>
                    <th style="width:32px;">#</th>
                    <th>점보롤 오더번호</th>
                    <th>호기</th>
                    <th>평량</th>
                    <th>전체 지폭</th>
                    <th>폭 구성</th>
                    <th>폭수</th>
                    <th>생산량(TON)</th>
                    <th>Loss</th>
                    <th>연결 판매오더</th>
                    <th>상태</th>
                  </tr>
                </thead>
                <tbody id="sim-jumbo-tbody">
                  <tr><td colspan="11" class="empty-state">오더생성 버튼을 눌러 점보롤 생산오더를 생성하세요.</td></tr>
                </tbody>
              </table>
            </div>

            <!-- SAP 전송 결과 로그 -->
            <div id="sim-jumbo-rfc-log" style="display:none;margin-top:12px;padding:12px 14px;background:var(--bg-base);border-radius:8px;border:1px solid var(--border);font-size:11px;font-family:monospace;color:var(--text-muted);line-height:1.8;max-height:160px;overflow-y:auto;"></div>
          </div>
        </div>

      </div>
    </div>
  </div>
</div><!-- /page-simulation -->

<!-- ============================================================
     점보롤 생산오더 페이지
     ============================================================ -->
<div id="page-jumbo-list" style="display:none;height:100%;flex-direction:column;">
  <div class="page-header">
    <div class="page-title"><i class="fas fa-scroll" style="color:#a78bfa;"></i>점보롤 생산오더</div>
    <div class="page-sub">지폭조합 시뮬레이션에서 생성된 점보롤 생산오더 목록</div>
  </div>

  <div class="page-scroll" style="padding-top:14px;">
    <!-- 필터 -->
    <div class="section-card" style="padding:14px 18px;">
      <div class="search-grid">
        <div><label class="field-label">호기</label>
          <select id="jl-filter-machine" class="inp" onchange="applyJumboFilter()">
            <option value="">전체</option>
            <option value="2">2호기</option>
            <option value="3">3호기</option>
          </select>
        </div>
        <div><label class="field-label">평량</label>
          <select id="jl-filter-bw" class="inp" onchange="applyJumboFilter()">
            <option value="">전체</option>
          </select>
        </div>
        <div><label class="field-label">상태</label>
          <select id="jl-filter-status" class="inp" onchange="applyJumboFilter()">
            <option value="">전체</option>
            <option value="PENDING">대기</option>
            <option value="SENT">SAP전송완료</option>
            <option value="CANCELLED">취소됨</option>
          </select>
        </div>
        <div><label class="field-label">오더번호</label>
          <input id="jl-filter-no" class="inp" type="text" placeholder="J-000 검색" oninput="applyJumboFilter()">
        </div>
        <div style="display:flex;align-items:flex-end;gap:8px;">
          <button class="btn btn-primary btn-sm" onclick="applyJumboFilter()"><i class="fas fa-search"></i> 조회</button>
          <button class="btn btn-ghost btn-sm" onclick="resetJumboFilter()"><i class="fas fa-undo"></i></button>
          <button class="btn btn-ghost btn-sm" onclick="loadJumboList()"><i class="fas fa-sync-alt"></i></button>
        </div>
      </div>
    </div>

    <!-- 요약 통계 -->
    <div style="display:flex;gap:10px;margin-bottom:12px;flex-wrap:wrap;">
      <div class="stat-mini"><div class="sv" style="color:#60a5fa;" id="jl-count">0</div><div class="sl">전체 오더</div></div>
      <div class="stat-mini"><div class="sv" style="color:#34d399;" id="jl-m2">0</div><div class="sl">2호기</div></div>
      <div class="stat-mini"><div class="sv" style="color:#a78bfa;" id="jl-m3">0</div><div class="sl">3호기</div></div>
      <div class="stat-mini"><div class="sv" style="color:#93c5fd;" id="jl-ton">0</div><div class="sl">총 생산량(TON)</div></div>
      <div class="stat-mini"><div class="sv" style="color:#f59e0b;" id="jl-pending">0</div><div class="sl">대기중</div></div>
      <div class="stat-mini"><div class="sv" style="color:#4ade80;" id="jl-sent">0</div><div class="sl">SAP전송완료</div></div>
    </div>

    <!-- 결과 테이블 -->
    <div class="section-card" style="overflow:hidden;">
      <div class="card-header">
        <div class="card-label">
          <i class="fas fa-list-alt" style="color:#a78bfa;"></i>
          조회 결과 <span class="count-badge" id="jl-count-badge">0 건</span>
        </div>
      </div>
      <div style="overflow-x:auto;max-height:calc(100vh - 390px);overflow-y:auto;">
        <table class="data-table" id="jl-table">
          <thead>
            <tr>
              <th class="center">오더번호</th>
              <th class="center">호기</th>
              <th class="num">평량(g)</th>
              <th class="num">전체지폭(mm)</th>
              <th>폭 구성</th>
              <th class="center">폭수</th>
              <th class="num">생산량(TON)</th>
              <th class="num">손실율</th>
              <th class="center">납기일</th>
              <th>연결 판매오더</th>
              <th class="center">상태</th>
              <th class="center">생성일</th>
              <th class="center">작업</th>
            </tr>
          </thead>
          <tbody id="jl-tbody">
            <tr><td colspan="13" class="empty-state">로딩 중...</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div><!-- /page-jumbo-list -->

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
  'prod-list'   : '생산오더 조회',
  'prod-cancel' : '생산오더 취소',
  'simulation'  : '지폭조합 시뮬레이션',
  'rfc-log'     : 'RFC 통신결과',
  'constraint'  : '제약조건 설정',
  'machine'     : '기계 마스터',
  'jumbo-list'  : '점보롤 생산오더',
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
const PAGES = ['dashboard','order-import','order-list','prod-list','prod-cancel','simulation','rfc-log','constraint','machine','jumbo-list']

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

  if (p === 'dashboard')   loadDashboard()
  if (p === 'order-list')  loadOrderList()
  if (p === 'prod-list')   loadProdList()
  if (p === 'prod-cancel') loadCancelList()
  if (p === 'simulation')  loadSimulation()
  if (p === 'constraint')  loadConstraintValues()
  if (p === 'machine')     loadMachine()
  if (p === 'jumbo-list')  loadJumboList()
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
  tbody.innerHTML = list.map(o =>
    '<tr data-id="'+o.orderId+'">' +
    '<td class="center"><input type="checkbox" class="chk-import" value="'+o.orderId+'" onchange="toggleSelectImport('+o.orderId+',this.checked)"></td>' +
    '<td style="color:#60a5fa;font-weight:600;font-family:monospace;">'+o.sapOrderNo+'</td>' +
    '<td style="color:var(--text-muted);">'+o.sapItemNo+'</td>' +
    '<td>'+renderOrderTypeBadge(o.orderType)+'</td>' +
    '<td style="max-width:140px;overflow:hidden;text-overflow:ellipsis;">'+o.customerName+'</td>' +
    '<td class="center"><span class="machine-badge">'+o.machineNo+'호기</span></td>' +
    '<td class="num" style="font-weight:700;">'+o.basisWeight+'</td>' +
    '<td class="num" style="font-weight:700;">'+o.paperWidth.toLocaleString()+'</td>' +
    '<td class="num">'+(o.orderQtyTon!=null ? '<span class="badge b-ton">'+o.orderQtyTon.toFixed(3)+'</span>' : '<span style="color:var(--border);">-</span>')+'</td>' +
    '<td class="num">'+(o.orderQtyR!=null   ? '<span class="badge b-r">'+o.orderQtyR.toLocaleString()+'</span>'   : '<span style="color:var(--border);">-</span>')+'</td>' +
    '<td class="num">'+(o.orderQtySok!=null ? '<span class="badge b-sok">'+o.orderQtySok.toLocaleString()+'</span>' : '<span style="color:var(--border);">-</span>')+'</td>' +
    '<td><span class="badge b-'+(o.unit==='TON'?'ton':o.unit==='R'?'r':'sok')+'">'+o.unit+'</span></td>' +
    '<td style="color:var(--text-muted);font-size:11px;">'+o.orderDate+'</td>' +
    '<td style="color:var(--text-muted);font-size:11px;">'+o.createdBy+'</td>' +
    '<td class="'+dueDateClass(o.dueDate)+'" style="font-size:11px;font-weight:600;">'+o.dueDate+'</td>' +
    '<td>'+renderStatusBadge(o.status)+'</td>' +
    '<td class="center">'+(o.isExcluded?'<span class="badge b-excl"><i class="fas fa-exclamation-triangle"></i> 예외</span>':'')+'</td>' +
    '</tr>'
  ).join('')
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
    ? '<i class="fas fa-save"></i> 선택항목 DB저장 ('+selectedImport.size+'건)'
    : '<i class="fas fa-save"></i> 선택항목 DB저장'
}
async function saveSelected() {
  if (selectedImport.size === 0) return
  toast(selectedImport.size+'건 DB 저장 완료 (Mock)', 'ok')
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
  tbody.innerHTML = list.map((o,i) =>
    '<tr style="'+(o.isExcluded?'opacity:.5;':'')+'">'+
    '<td class="center" style="color:var(--text-faint);font-size:11px;">'+(i+1)+'</td>'+
    '<td style="color:#60a5fa;font-weight:700;font-family:monospace;">'+o.sapOrderNo+'</td>'+
    '<td style="color:var(--text-muted);font-size:11px;">'+o.sapItemNo+'</td>'+
    '<td>'+renderOrderTypeBadge(o.orderType)+'</td>'+
    '<td style="max-width:150px;overflow:hidden;text-overflow:ellipsis;font-size:12px;">'+o.customerName+'</td>'+
    '<td class="center"><span class="machine-badge">'+o.machineNo+'호기</span></td>'+
    '<td class="num" style="font-weight:700;">'+o.basisWeight+'</td>'+
    '<td class="num" style="font-weight:700;">'+o.paperWidth.toLocaleString()+'</td>'+
    '<td class="num">'+(o.orderQtyTon!=null ? '<span class="badge b-ton">'+o.orderQtyTon.toFixed(3)+'</span>' : '<span style="color:var(--border);">-</span>')+'</td>'+
    '<td class="num">'+(o.orderQtyR!=null   ? '<span class="badge b-r">'+o.orderQtyR.toLocaleString()+'</span>'   : '<span style="color:var(--border);">-</span>')+'</td>'+
    '<td class="num">'+(o.orderQtySok!=null ? '<span class="badge b-sok">'+o.orderQtySok.toLocaleString()+'</span>' : '<span style="color:var(--border);">-</span>')+'</td>'+
    '<td class="'+dueDateClass(o.dueDate)+'" style="font-size:11px;font-weight:600;">'+o.dueDate+'</td>'+
    '<td>'+renderStatusBadge(o.status)+'</td>'+
    '<td class="center">'+(o.isExcluded?'<span class="badge b-excl" style="font-size:10px;"><i class="fas fa-ban"></i> 예외</span>':'')+'</td>'+
    '<td class="center">'+(o.isExcluded
      ? '<button class="btn btn-ghost btn-xs" onclick="doInclude('+o.orderId+')"><i class="fas fa-check"></i> 해제</button>'
      : '<button class="btn btn-danger btn-xs" onclick="openExclude('+o.orderId+')"><i class="fas fa-ban"></i></button>'
    )+'</td>'+
    '</tr>'
  ).join('')
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
  const r = await fetch(API+'/klean-aps-api/sales-orders/'+id+'/exclude', {
    method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({reason})
  })
  const d = await r.json()
  if (d.success) { toast('예외처리 완료'); closeModal(); loadOrderList() }
  else toast(d.message||'오류', 'err')
}
async function doInclude(id) {
  const r = await fetch(API+'/klean-aps-api/sales-orders/'+id+'/include', {method:'PATCH'})
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
   생산오더 조회
══════════════════════════════════════ */
let allProdOrders = []

async function loadProdList() {
  const tbody = document.getElementById('prod-list-tbody')
  if (tbody) tbody.innerHTML = '<tr><td colspan="15" class="empty-state"><i class="fas fa-spinner fa-spin"></i> 불러오는 중...</td></tr>'
  try {
    const r = await fetch(API+'/klean-aps-api/prod-orders')
    const d = await r.json()
    allProdOrders = d.data || []
    filterProdList()
  } catch(e) {
    toast('생산오더 조회 오류: '+e.message, 'err')
    if (tbody) tbody.innerHTML = '<tr><td colspan="15" class="empty-state">오류가 발생했습니다.</td></tr>'
  }
}

function resetProdListFilter() {
  ;['pl-prodOrderNo','pl-sapOrderNo','pl-customerName','pl-machineNo',
    'pl-basisWeight','pl-status','pl-planFrom','pl-planTo'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = ''
  })
  filterProdList()
}

function filterProdList() {
  const prodOrderNo  = (document.getElementById('pl-prodOrderNo')||{}).value||''
  const sapOrderNo   = (document.getElementById('pl-sapOrderNo')||{}).value||''
  const customerName = (document.getElementById('pl-customerName')||{}).value||''
  const machineNo    = (document.getElementById('pl-machineNo')||{}).value||''
  const basisWeight  = (document.getElementById('pl-basisWeight')||{}).value||''
  const status       = (document.getElementById('pl-status')||{}).value||''
  const planFrom     = (document.getElementById('pl-planFrom')||{}).value||''
  const planTo       = (document.getElementById('pl-planTo')||{}).value||''
  const filtered = allProdOrders.filter(o => {
    if (prodOrderNo.trim()  && !o.prodOrderNo.includes(prodOrderNo.trim()))   return false
    if (sapOrderNo.trim()   && !o.sapOrderNo.includes(sapOrderNo.trim()))     return false
    if (customerName.trim() && !o.customerName.includes(customerName.trim())) return false
    if (machineNo           && o.machineNo !== machineNo)                     return false
    if (basisWeight         && o.basisWeight !== Number(basisWeight))          return false
    if (status              && o.status !== status)                           return false
    if (planFrom            && o.planStartDate < planFrom)                    return false
    if (planTo              && o.planStartDate > planTo)                      return false
    return true
  })
  renderProdListTable(filtered)
  updateProdStats(filtered)
}

function updateProdStats(list) {
  const el = id => document.getElementById(id)
  if (el('pls-total'))      el('pls-total').textContent      = list.length
  if (el('pls-confirmed'))  el('pls-confirmed').textContent  = list.filter(o=>o.status==='CONFIRMED').length
  if (el('pls-inprogress')) el('pls-inprogress').textContent = list.filter(o=>o.status==='IN_PROGRESS').length
  if (el('pls-completed'))  el('pls-completed').textContent  = list.filter(o=>o.status==='COMPLETED').length
  if (el('pls-cancelled'))  el('pls-cancelled').textContent  = list.filter(o=>o.status==='CANCELLED').length
  if (el('pls-ton'))        el('pls-ton').textContent        = list.reduce((s,o)=>s+(o.orderQtyTon||0),0).toFixed(1)
}

function renderProdListTable(list) {
  const tbody = document.getElementById('prod-list-tbody')
  const cnt   = document.getElementById('pl-count')
  if (cnt) cnt.textContent = list.length + ' 건'
  if (!tbody) return
  if (!list.length) {
    tbody.innerHTML = '<tr><td colspan="15" class="empty-state">조회된 생산오더가 없습니다.</td></tr>'
    return
  }
  tbody.innerHTML = list.map((o,i) => '<tr>' +
    '<td class="center" style="color:var(--text-faint);font-size:11px;">' + (i+1) + '</td>' +
    '<td style="color:#34d399;font-weight:700;font-family:monospace;">' + o.prodOrderNo + '</td>' +
    '<td style="color:#60a5fa;font-family:monospace;font-size:11px;">' + o.sapOrderNo + '</td>' +
    '<td style="font-size:12px;">' + o.customerName + '</td>' +
    '<td class="center"><span class="machine-badge">' + o.machineNo + '호기</span></td>' +
    '<td class="num" style="font-weight:700;">' + o.basisWeight + '</td>' +
    '<td class="num" style="font-weight:700;">' + o.paperWidth.toLocaleString() + '</td>' +
    '<td class="num">' + (o.orderQtyTon != null ? '<span class="badge b-ton">' + o.orderQtyTon.toFixed(3) + '</span>' : '<span style="color:var(--border);">-</span>') + '</td>' +
    '<td class="num">' + (o.orderQtyR != null ? '<span class="badge b-r">' + o.orderQtyR.toLocaleString() + '</span>' : '<span style="color:var(--border);">-</span>') + '</td>' +
    '<td class="num">' + (o.orderQtySok != null ? '<span class="badge b-sok">' + o.orderQtySok.toLocaleString() + '</span>' : '<span style="color:var(--border);">-</span>') + '</td>' +
    '<td style="font-size:11px;color:var(--text-muted);">' + o.planStartDate + '</td>' +
    '<td style="font-size:11px;color:var(--text-muted);">' + o.planEndDate + '</td>' +
    '<td>' + renderProdStatusBadge(o.status) + '</td>' +
    '<td class="center">' + (o.cancelStatus === 'RFC_SENT' ? '<span class="badge b-excl" style="font-size:10px;"><i class="fas fa-paper-plane"></i> RFC전송</span>' : '') + '</td>' +
    '<td style="font-size:12px;">' + o.createdBy + '</td>' +
    '</tr>'
  ).join('')
}

function renderProdStatusBadge(s) {
  const m = {CONFIRMED:'b-open', IN_PROGRESS:'b-assigned', COMPLETED:'b-complete', CANCELLED:'b-cancel'}
  const l = {CONFIRMED:'확정', IN_PROGRESS:'진행중', COMPLETED:'완료', CANCELLED:'취소'}
  return '<span class="badge ' + (m[s]||'b-open') + '" style="font-size:10px;">' + (l[s]||s) + '</span>'
}

function exportProdCsv() {
  const rows = [['생산오더번호','판매오더번호','납품처','호기','평량','지폭','수량TON','계획시작일','계획종료일','상태']]
  allProdOrders.forEach(o => rows.push([
    o.prodOrderNo, o.sapOrderNo, o.customerName, o.machineNo+'호기',
    o.basisWeight, o.paperWidth, o.orderQtyTon||'', o.planStartDate, o.planEndDate, o.status
  ]))
  const csv = rows.map(r => r.join(',')).join('\\n')
  const a = document.createElement('a')
  a.href     = 'data:text/csv;charset=utf-8,\\uFEFF'+encodeURIComponent(csv)
  a.download = 'prod_orders_'+new Date().toISOString().slice(0,10)+'.csv'
  a.click()
  toast('CSV 다운로드 완료','ok')
}

/* ══════════════════════════════════════
   생산오더 취소
══════════════════════════════════════ */
let cancelOrders   = []
let selectedCancel = new Set()

async function loadCancelList() {
  const tbody = document.getElementById('cancel-list-tbody')
  if (tbody) tbody.innerHTML = '<tr><td colspan="12" class="empty-state"><i class="fas fa-spinner fa-spin"></i> 불러오는 중...</td></tr>'
  try {
    const r = await fetch(API+'/klean-aps-api/prod-orders')
    const d = await r.json()
    cancelOrders = (d.data||[]).filter(o => o.status !== 'COMPLETED' && o.status !== 'CANCELLED')
    filterCancelList()
  } catch(e) {
    toast('생산오더 조회 오류: '+e.message, 'err')
    if (tbody) tbody.innerHTML = '<tr><td colspan="12" class="empty-state">오류가 발생했습니다.</td></tr>'
  }
}

function resetCancelFilter() {
  ;['pc-prodOrderNo','pc-sapOrderNo','pc-customerName','pc-machineNo','pc-status'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = ''
  })
  filterCancelList()
}

function filterCancelList() {
  const prodOrderNo  = (document.getElementById('pc-prodOrderNo')||{}).value||''
  const sapOrderNo   = (document.getElementById('pc-sapOrderNo')||{}).value||''
  const customerName = (document.getElementById('pc-customerName')||{}).value||''
  const machineNo    = (document.getElementById('pc-machineNo')||{}).value||''
  const status       = (document.getElementById('pc-status')||{}).value||''
  const base = cancelOrders.filter(o => o.status !== 'COMPLETED' && o.status !== 'CANCELLED')
  const filtered = base.filter(o => {
    if (prodOrderNo.trim()  && !o.prodOrderNo.includes(prodOrderNo.trim()))   return false
    if (sapOrderNo.trim()   && !o.sapOrderNo.includes(sapOrderNo.trim()))     return false
    if (customerName.trim() && !o.customerName.includes(customerName.trim())) return false
    if (machineNo           && o.machineNo !== machineNo)                     return false
    if (status              && o.status !== status)                           return false
    return true
  })
  renderCancelTable(filtered)
}

function renderCancelTable(list) {
  const tbody = document.getElementById('cancel-list-tbody')
  const cnt   = document.getElementById('pc-count')
  if (cnt) cnt.textContent = list.length + ' 건'
  selectedCancel.clear()
  updateCancelBtn()
  if (!tbody) return
  if (!list.length) {
    tbody.innerHTML = '<tr><td colspan="12" class="empty-state">취소 가능한 생산오더가 없습니다.</td></tr>'
    return
  }
  tbody.innerHTML = list.map(o =>
    '<tr data-id="' + o.prodId + '">' +
    '<td class="center"><input type="checkbox" class="chk-cancel" value="' + o.prodId + '" onchange="toggleSelectCancel(' + o.prodId + ',this.checked)"></td>' +
    '<td style="color:#34d399;font-weight:700;font-family:monospace;">' + o.prodOrderNo + '</td>' +
    '<td style="color:#60a5fa;font-family:monospace;font-size:11px;">' + o.sapOrderNo + '</td>' +
    '<td style="font-size:12px;">' + o.customerName + '</td>' +
    '<td class="center"><span class="machine-badge">' + o.machineNo + '호기</span></td>' +
    '<td class="num" style="font-weight:700;">' + o.basisWeight + '</td>' +
    '<td class="num">' + o.paperWidth.toLocaleString() + '</td>' +
    '<td class="num">' + (o.orderQtyTon != null ? '<span class="badge b-ton">' + o.orderQtyTon.toFixed(3) + '</span>' : '-') + '</td>' +
    '<td style="font-size:11px;color:var(--text-muted);">' + o.planStartDate + '</td>' +
    '<td style="font-size:11px;color:var(--text-muted);">' + o.planEndDate + '</td>' +
    '<td>' + renderProdStatusBadge(o.status) + '</td>' +
    '<td style="font-size:12px;">' + o.createdBy + '</td>' +
    '</tr>'
  ).join('')
}

function toggleSelectCancel(id, checked) {
  checked ? selectedCancel.add(id) : selectedCancel.delete(id)
  const headChk = document.getElementById('chk-head-cancel')
  const allChk  = document.getElementById('chk-all-cancel')
  const allChks = document.querySelectorAll('.chk-cancel')
  const allChecked = allChks.length > 0 && [...allChks].every(c => c.checked)
  if (headChk) headChk.checked = allChecked
  if (allChk)  allChk.checked  = allChecked
  updateCancelBtn()
}

function toggleAllCancel(checked) {
  document.querySelectorAll('.chk-cancel').forEach(c => {
    c.checked = checked
    const id = Number(c.value)
    checked ? selectedCancel.add(id) : selectedCancel.delete(id)
  })
  const headChk = document.getElementById('chk-head-cancel')
  const allChk  = document.getElementById('chk-all-cancel')
  if (headChk) headChk.checked = checked
  if (allChk)  allChk.checked  = checked
  updateCancelBtn()
}

function updateCancelBtn() {
  const btn = document.getElementById('btn-do-cancel')
  if (!btn) return
  btn.disabled = selectedCancel.size === 0
  btn.innerHTML = selectedCancel.size > 0
    ? '<i class="fas fa-times-circle"></i> 취소처리 (' + selectedCancel.size + '건)'
    : '<i class="fas fa-times-circle"></i> 취소처리'
}

function openCancelModal() {
  if (selectedCancel.size === 0) { toast('취소할 항목을 선택하세요.','info'); return }
  const cnt = document.getElementById('cancel-modal-count')
  if (cnt) cnt.textContent = selectedCancel.size
  const reason = document.getElementById('cancel-reason-input')
  if (reason) reason.value = ''
  const by = document.getElementById('cancel-by-input')
  if (by) by.value = '홍길동'
  const loading = document.getElementById('cancel-rfc-loading')
  if (loading) loading.classList.remove('show')
  document.getElementById('cancelModal').classList.add('show')
}

function closeCancelModal() {
  document.getElementById('cancelModal').classList.remove('show')
  const loading = document.getElementById('cancel-rfc-loading')
  if (loading) loading.classList.remove('show')
}

async function doCancel() {
  const reasonEl = document.getElementById('cancel-reason-input')
  const reason   = (reasonEl ? reasonEl.value : '').trim()
  if (!reason) { toast('취소 사유를 입력하세요.','err'); return }
  const byEl       = document.getElementById('cancel-by-input')
  const cancelledBy = (byEl ? byEl.value : '').trim() || '시스템'
  const ids    = [...selectedCancel]
  const btn    = document.getElementById('btn-cancel-confirm')
  const closeBtn = document.getElementById('btn-cancel-close')
  const loading  = document.getElementById('cancel-rfc-loading')
  if (btn)     btn.disabled     = true
  if (closeBtn) closeBtn.disabled = true
  if (loading)  loading.classList.add('show')
  const results = []
  try {
    for (const id of ids) {
      const r = await fetch(API+'/klean-aps-api/prod-orders/'+id+'/cancel', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ reason, cancelledBy })
      })
      const d = await r.json()
      results.push({ id, success: d.success, data: d.data, rfcResult: d.rfcResult, message: d.message })
    }
    closeCancelModal()
    // 결과 모달 구성
    const successN = results.filter(r => r.success).length
    const failN    = results.filter(r => !r.success).length
    const bodyHtml =
      '<div style="display:flex;gap:10px;margin-bottom:14px;">' +
        '<div class="stat-mini"><div class="sv" style="color:#34d399;">' + successN + '</div><div class="sl">취소 성공</div></div>' +
        '<div class="stat-mini"><div class="sv" style="color:#f87171;">' + failN    + '</div><div class="sl">실패</div></div>' +
      '</div>' +
      '<div class="section-card" style="overflow:hidden;">' +
        '<table class="data-table" style="font-size:11px;">' +
          '<thead><tr><th>생산오더번호</th><th>RFC 함수</th><th>처리시간</th><th>결과</th><th>메시지</th></tr></thead>' +
          '<tbody>' + results.map(r =>
            '<tr>' +
            '<td style="font-family:monospace;color:#34d399;">' + (r.data && r.data.prodOrderNo ? r.data.prodOrderNo : '-') + '</td>' +
            '<td style="font-family:monospace;color:#a78bfa;font-size:10px;">' + (r.rfcResult && r.rfcResult.funcName ? r.rfcResult.funcName : '-') + '</td>' +
            '<td class="num">' + (r.rfcResult && r.rfcResult.elapsed ? r.rfcResult.elapsed : '-') + '</td>' +
            '<td>' + (r.success ? '<span class="badge b-assigned" style="font-size:10px;">성공</span>' : '<span class="badge b-cancel" style="font-size:10px;">실패</span>') + '</td>' +
            '<td style="font-size:11px;color:var(--text-muted);">' + (r.message||'') + '</td>' +
            '</tr>'
          ).join('') +
          '</tbody>' +
        '</table>' +
      '</div>'
    const resultBody = document.getElementById('cancel-result-body')
    if (resultBody) resultBody.innerHTML = bodyHtml
    document.getElementById('cancelResultModal').classList.add('show')
    selectedCancel.clear()
    updateCancelBtn()
    toggleAllCancel(false)
    loadCancelList()
    // 생산오더 조회 페이지도 갱신
    if (allProdOrders.length) loadProdList()
    toast(failN > 0 ? '취소 처리 완료 (실패 '+failN+'건 포함)' : '취소 처리 완료 — '+successN+'건 RFC 전송 성공', failN > 0 ? 'info' : 'ok')
  } catch(e) {
    toast('취소 처리 중 오류: '+e.message, 'err')
  } finally {
    if (btn)      btn.disabled      = false
    if (closeBtn) closeBtn.disabled = false
    if (loading)  loading.classList.remove('show')
  }
}

function closeCancelResultModal() {
  const m = document.getElementById('cancelResultModal')
  if (m) m.classList.remove('show')
}

/* ══════════════════════════════════════
   점보롤 생산오더 목록
══════════════════════════════════════ */
let jumboAllData = []

async function loadJumboList() {
  try {
    const res = await fetch('/klean-aps-api/jumbo-orders')
    const json = await res.json()
    if (!json.success) throw new Error(json.message || 'API 오류')
    jumboAllData = json.data || []
    // 평량 필터 옵션 갱신
    const bwSel = document.getElementById('jl-filter-bw')
    if (bwSel) {
      const bws = [...new Set(jumboAllData.map(o => o.basisWeight))].filter(Boolean).sort((a,b)=>a-b)
      bwSel.innerHTML = '<option value="">전체</option>' + bws.map(b => '<option value="'+b+'">'+b+'g</option>').join('')
    }
    applyJumboFilter()
  } catch(e) {
    toast('점보롤 오더 로드 실패: ' + e.message, 'error')
  }
}

function resetJumboFilter() {
  const ids = ['jl-filter-machine','jl-filter-bw','jl-filter-status','jl-filter-no']
  ids.forEach(id => {
    const el = document.getElementById(id)
    if (el) el.value = ''
  })
  applyJumboFilter()
}

function applyJumboFilter() {
  const machine = (document.getElementById('jl-filter-machine') || {}).value || ''
  const bw      = (document.getElementById('jl-filter-bw')      || {}).value || ''
  const status  = (document.getElementById('jl-filter-status')  || {}).value || ''
  const no      = ((document.getElementById('jl-filter-no')     || {}).value || '').trim().toLowerCase()

  const filtered = jumboAllData.filter(o => {
    if (machine && String(o.machineNo) !== machine) return false
    if (bw      && String(o.basisWeight) !== bw)    return false
    if (status  && o.status !== status)             return false
    if (no      && !(o.jumboOrderNo || '').toLowerCase().includes(no)) return false
    return true
  })

  renderJumboListTable(filtered)
  renderJumboListStats(filtered)
}

function renderJumboListStats(list) {
  const el = id => document.getElementById(id)
  const safe = (id, val) => { if (el(id)) el(id).textContent = val }

  safe('jl-count',      list.length)
  safe('jl-count-badge', list.length + ' 건')
  safe('jl-m2',    list.filter(o => String(o.machineNo) === '2').length)
  safe('jl-m3',    list.filter(o => String(o.machineNo) === '3').length)
  safe('jl-ton',   list.reduce((s,o) => s+(o.totalTon||0), 0).toFixed(2))
  safe('jl-pending', list.filter(o => o.status === 'PENDING').length)
  safe('jl-sent',    list.filter(o => o.status === 'SENT').length)
}

function renderJumboListTable(list) {
  const tbody = document.getElementById('jl-tbody')
  if (!tbody) return

  if (!list.length) {
    tbody.innerHTML = '<tr><td colspan="13" class="empty-state">조회된 점보롤 생산오더가 없습니다.</td></tr>'
    return
  }

  tbody.innerHTML = list.map(function(o) {
    var widthTags = (o.widths || []).map(function(w) {
      return '<span style="display:inline-block;background:var(--accent-blue);color:#fff;border-radius:4px;padding:2px 7px;font-size:0.75rem;margin:1px;">' + w + 'mm</span>'
    }).join(' ')

    var sourceStr = (o.sourceOrderNos || []).slice(0, 3).join(', ')
      + (o.sourceOrderNos && o.sourceOrderNos.length > 3 ? ' 외 '+(o.sourceOrderNos.length-3)+'건' : '')

    var statusBadge = ''
    if (o.status === 'SENT')      statusBadge = '<span class="badge b-complete">SAP전송</span>'
    else if (o.status === 'CANCELLED') statusBadge = '<span class="badge b-cancel">취소됨</span>'
    else                                statusBadge = '<span class="badge b-pending">대기</span>'

    var lossStr = (o.lossRate != null) ? o.lossRate.toFixed(1) + '%' : '-'
    var tonStr  = (o.totalTon  != null) ? o.totalTon.toFixed(3) + ' T' : '-'
    var dueStr  = o.planEndDate ? o.planEndDate.slice(0,10) : '-'
    var createdStr = o.createdAt ? o.createdAt.slice(0,10) : '-'

    var cancelBtn = (o.status === 'PENDING')
      ? '<button class="btn-ghost" style="font-size:0.75rem;padding:4px 8px;color:var(--text-danger);" onclick="cancelJumboOrder(' + o.jumboId + ')">'
        + '<i class="fas fa-ban" style="margin-right:3px;"></i>취소</button>'
      : '<span style="color:var(--text-muted);font-size:0.75rem;">-</span>'

    return '<tr>'
      + '<td style="font-weight:700;color:var(--accent-blue);">' + (o.jumboOrderNo || '-') + '</td>'
      + '<td style="text-align:center;">' + o.machineNo + '호기</td>'
      + '<td style="text-align:center;">' + (o.basisWeight || '-') + 'g</td>'
      + '<td style="text-align:center;font-weight:600;">' + (o.jumboWidth || '-') + 'mm</td>'
      + '<td>' + widthTags + '</td>'
      + '<td style="text-align:center;">' + (o.pokCount || '-') + '폭</td>'
      + '<td style="text-align:center;">' + tonStr + '</td>'
      + '<td style="text-align:center;">'
        + (o.lossRate != null
          ? '<span style="color:' + (o.lossRate > 5 ? 'var(--text-warning)' : 'var(--text-success)') + ';font-weight:600;">' + lossStr + '</span>'
          : '-')
        + '</td>'
      + '<td style="text-align:center;">' + dueStr + '</td>'
      + '<td style="font-size:0.78rem;color:var(--text-secondary);">' + (sourceStr || '-') + '</td>'
      + '<td style="text-align:center;">' + statusBadge + '</td>'
      + '<td style="text-align:center;font-size:0.75rem;color:var(--text-muted);">' + createdStr + '</td>'
      + '<td style="text-align:center;">' + cancelBtn + '</td>'
      + '</tr>'
  }).join('')
}

async function cancelJumboOrder(id) {
  if (!confirm('점보롤 오더를 취소하시겠습니까? 취소된 오더는 복구할 수 없습니다.')) return
  try {
    const res = await fetch('/klean-aps-api/jumbo-orders/' + id, { method: 'DELETE' })
    const json = await res.json()
    if (!json.success) throw new Error(json.message || '삭제 실패')
    toast('점보롤 오더가 취소되었습니다.', 'ok')
    loadJumboList()
  } catch(e) {
    toast('취소 실패: ' + e.message, 'error')
  }
}

/* ══════════════════════════════════════
   기계 마스터
══════════════════════════════════════ */
async function loadMachine() {
  try {
    const res = await fetch('/klean-aps-api/machines')
    const json = await res.json()
    if (!json.success) throw new Error(json.message || 'API 오류')
    renderMachineTable(json.data)
    toast('기계 마스터 정보를 불러왔습니다.', 'ok')
  } catch(e) {
    toast('기계 데이터 로드 실패: ' + e.message, 'err')
  }
}

function renderMachineTable(data) {
  const wrap = document.getElementById('machine-table-wrap')
  const badge = document.getElementById('machine-count-badge')
  if (!wrap) return
  if (badge) badge.textContent = '총 ' + data.length + '대'

  if (data.length === 0) {
    wrap.innerHTML = '<div style="padding:40px;text-align:center;color:var(--text-faint);font-size:13px;"><i class="fas fa-cog" style="font-size:28px;margin-bottom:12px;display:block;opacity:.3;"></i>등록된 기계가 없습니다.<br><span style="font-size:11px;">상단 [기계 추가] 버튼으로 호기를 추가하세요.</span></div>'
    return
  }

  const rows = data.map((m) => {
    const fourPok = m.fourPokMinWidth ? m.fourPokMinWidth.toLocaleString() + ' mm 이상' : '<span style="color:var(--text-faint);">조건 없음</span>'
    const bwExc   = m.bwExceptionList
      ? m.bwExceptionList + 'g/m² → 최대 ' + (m.bwExceptionMaxWidth ? m.bwExceptionMaxWidth.toLocaleString() + ' mm' : '-')
      : '<span style="color:var(--text-faint);">없음</span>'
    const noteHtml = m.note
      ? '<div style="display:flex;align-items:flex-start;gap:6px;margin-top:8px;padding:8px 10px;background:var(--bg-base);border-radius:6px;border:1px solid var(--border);font-size:11px;color:var(--text-muted);line-height:1.6;"><i class="fas fa-lightbulb" style="color:#f59e0b;flex-shrink:0;margin-top:1px;"></i>'+m.note+'</div>'
      : ''

    return (
    '<div class="machine-row-card" data-id="'+m.machineId+'">' +
    '<div style="display:flex;align-items:center;gap:10px;padding:14px 18px 10px;border-bottom:1px solid var(--border);">' +
      '<span class="machine-badge" style="padding:3px 10px;font-size:12px;">'+m.machineName+'</span>' +
      '<span style="font-size:13px;font-weight:600;color:var(--text-main);">Paper Machine #'+m.machineNo+'</span>' +
      (m.description ? '<span style="font-size:11px;color:var(--text-faint);margin-left:4px;">'+m.description+'</span>' : '') +
      '<div style="margin-left:auto;display:flex;gap:6px;">' +
        '<button class="btn btn-sm btn-secondary" style="padding:4px 10px;font-size:11px;" onclick="openMachineModal('+m.machineId+')">' +
          '<i class="fas fa-pencil-alt"></i> 수정' +
        '</button>' +
        '<button class="btn btn-sm" style="padding:4px 10px;font-size:11px;background:#fef2f2;color:#ef4444;border:1px solid #fecaca;border-radius:7px;cursor:pointer;" onclick="openMachineDelModal('+m.machineId+')">' +
          '<i class="fas fa-trash"></i> 삭제' +
        '</button>' +
      '</div>' +
    '</div>' +
    '<div style="padding:12px 18px 14px;">' +
      '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:4px;">' +
        '<div style="background:var(--bg-base);border-radius:8px;border:1px solid var(--border);padding:10px 12px;">' +
          '<div style="font-size:10px;font-weight:600;color:var(--text-faint);margin-bottom:4px;">최대 지폭</div>' +
          '<div style="font-size:14px;font-weight:700;color:#34d399;">'+m.maxWidth.toLocaleString()+' mm</div>' +
        '</div>' +
        '<div style="background:var(--bg-base);border-radius:8px;border:1px solid var(--border);padding:10px 12px;">' +
          '<div style="font-size:10px;font-weight:600;color:var(--text-faint);margin-bottom:4px;">최소 지폭</div>' +
          '<div style="font-size:14px;font-weight:700;color:#f87171;">'+m.minWidth.toLocaleString()+' mm</div>' +
        '</div>' +
        '<div style="background:var(--bg-base);border-radius:8px;border:1px solid var(--border);padding:10px 12px;">' +
          '<div style="font-size:10px;font-weight:600;color:var(--text-faint);margin-bottom:4px;">최대 폭수</div>' +
          '<div style="font-size:14px;font-weight:700;color:var(--text-main);">'+m.maxPok+'폭</div>' +
        '</div>' +
        '<div style="background:var(--bg-base);border-radius:8px;border:1px solid var(--border);padding:10px 12px;">' +
          '<div style="font-size:10px;font-weight:600;color:var(--text-faint);margin-bottom:4px;">배폭 미미</div>' +
          '<div style="font-size:14px;font-weight:700;color:#a78bfa;">'+m.mimi+' mm</div>' +
        '</div>' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">' +
        '<div style="background:var(--bg-base);border-radius:8px;border:1px solid var(--border);padding:9px 12px;">' +
          '<div style="font-size:10px;font-weight:600;color:var(--text-faint);margin-bottom:3px;">4폭 최소조건</div>' +
          '<div style="font-size:12px;font-weight:600;color:var(--text-muted);">'+fourPok+'</div>' +
        '</div>' +
        '<div style="background:var(--bg-base);border-radius:8px;border:1px solid var(--border);padding:9px 12px;">' +
          '<div style="font-size:10px;font-weight:600;color:var(--text-faint);margin-bottom:3px;">생산불가 한계</div>' +
          '<div style="font-size:12px;font-weight:600;color:#f87171;">'+m.noProdLimit+' mm 이하</div>' +
        '</div>' +
        '<div style="background:var(--bg-base);border-radius:8px;border:1px solid var(--border);padding:9px 12px;">' +
          '<div style="font-size:10px;font-weight:600;color:var(--text-faint);margin-bottom:3px;">평량 예외</div>' +
          '<div style="font-size:12px;font-weight:600;color:var(--text-muted);">'+bwExc+'</div>' +
        '</div>' +
      '</div>' +
      noteHtml +
    '</div>' +
    '</div>'
    )
  }).join('<div style="height:1px;background:var(--border);"></div>')

  wrap.innerHTML = rows
}

// ── 추가/수정 모달 ──
let _machineEditId = null

async function openMachineModal(id) {
  _machineEditId = id
  const title  = document.getElementById('machine-modal-title')
  const saveBtn = document.getElementById('machine-save-btn')
  const modal  = document.getElementById('modal-machine')

  const fields = ['id','machineNo','machineName','description','maxWidth','minWidth',
                  'maxPok','fourPokMinWidth','mimi','noProdLimit','bwExceptionList','bwExceptionMaxWidth','note']
  const clear = () => fields.forEach(f => {
    const el = document.getElementById('mf-' + f)
    if (el) el.value = ''
  })

  if (id === null) {
    // 추가 모드
    title.textContent  = '기계 추가'
    saveBtn.textContent = '저장'
    clear()
  } else {
    // 수정 모드 — 기존 데이터 채우기
    title.textContent  = '기계 수정'
    saveBtn.innerHTML  = '<i class="fas fa-save"></i> 저장'
    clear()
    try {
      const res  = await fetch('/klean-aps-api/machines')
      const json = await res.json()
      const m    = json.data.find((x) => x.machineId === id)
      if (!m) return toast('기계 정보를 찾을 수 없습니다.', 'err')
      document.getElementById('mf-id').value                = String(m.machineId)
      document.getElementById('mf-machineNo').value         = m.machineNo          || ''
      document.getElementById('mf-machineName').value       = m.machineName        || ''
      document.getElementById('mf-description').value       = m.description        || ''
      document.getElementById('mf-maxWidth').value          = m.maxWidth != null   ? String(m.maxWidth) : ''
      document.getElementById('mf-minWidth').value          = m.minWidth != null   ? String(m.minWidth) : ''
      document.getElementById('mf-maxPok').value            = m.maxPok   != null   ? String(m.maxPok) : ''
      document.getElementById('mf-fourPokMinWidth').value   = m.fourPokMinWidth != null ? String(m.fourPokMinWidth) : ''
      document.getElementById('mf-mimi').value              = m.mimi      != null   ? String(m.mimi) : ''
      document.getElementById('mf-noProdLimit').value       = m.noProdLimit != null ? String(m.noProdLimit) : ''
      document.getElementById('mf-bwExceptionList').value   = m.bwExceptionList    || ''
      document.getElementById('mf-bwExceptionMaxWidth').value = m.bwExceptionMaxWidth != null ? String(m.bwExceptionMaxWidth) : ''
      document.getElementById('mf-note').value              = m.note               || ''
    } catch(e) {
      return toast('기계 정보 로드 실패: ' + e.message, 'err')
    }
  }

  modal.style.display = 'flex'
}

function closeMachineModal() {
  document.getElementById('modal-machine').style.display = 'none'
}

async function saveMachine() {
  const g = (id) => document.getElementById('mf-' + id).value.trim()

  const machineNo   = g('machineNo')
  const machineName = g('machineName')
  if (!machineNo || !machineName) {
    toast('호기 번호와 이름은 필수입니다.', 'err')
    return
  }

  const payload = {
    machineNo,
    machineName,
    description:         g('description'),
    maxWidth:            g('maxWidth')            ? Number(g('maxWidth'))            : 0,
    minWidth:            g('minWidth')            ? Number(g('minWidth'))            : 0,
    maxPok:              g('maxPok')              ? Number(g('maxPok'))              : 4,
    fourPokMinWidth:     g('fourPokMinWidth')     ? Number(g('fourPokMinWidth'))     : null,
    mimi:                g('mimi')                ? Number(g('mimi'))                : 30,
    noProdLimit:         g('noProdLimit')         ? Number(g('noProdLimit'))         : 625,
    bwExceptionList:     g('bwExceptionList'),
    bwExceptionMaxWidth: g('bwExceptionMaxWidth') ? Number(g('bwExceptionMaxWidth')): null,
    note:                document.getElementById('mf-note').value.trim(),
  }

  const saveBtn = document.getElementById('machine-save-btn')
  saveBtn.disabled = true

  try {
    let res
    if (_machineEditId === null) {
      res = await fetch('/klean-aps-api/machines', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) })
    } else {
      res = await fetch('/klean-aps-api/machines/' + _machineEditId, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) })
    }
    const json = await res.json()
    if (!json.success) throw new Error(json.message || 'API 오류')
    closeMachineModal()
    await loadMachine()
    toast(_machineEditId === null ? '기계가 추가되었습니다.' : '기계 정보가 수정되었습니다.', 'ok')
  } catch(e) {
    toast('저장 실패: ' + e.message, 'err')
  } finally {
    saveBtn.disabled = false
  }
}

// ── 삭제 확인 모달 ──
let _machineDelId = null

async function openMachineDelModal(id) {
  _machineDelId = id
  try {
    const res  = await fetch('/klean-aps-api/machines')
    const json = await res.json()
    const m    = json.data.find((x) => x.machineId === id)
    const msg  = document.getElementById('machine-del-msg')
    if (m) msg.innerHTML = '<b>'+m.machineName+'('+m.machineNo+'호기)</b> 를 삭제하시겠습니까?<br><span style="color:#f87171;font-size:11px;">삭제된 기계 정보는 복구할 수 없습니다.</span>'
    else msg.textContent = '이 기계를 삭제하시겠습니까?'
  } catch(e) { /* ignore */ }
  document.getElementById('modal-machine-del').style.display = 'flex'
}

function closeMachineDelModal() {
  document.getElementById('modal-machine-del').style.display = 'none'
  _machineDelId = null
}

async function confirmDeleteMachine() {
  if (_machineDelId === null) return
  const btn = document.getElementById('machine-del-confirm-btn')
  btn.disabled = true
  try {
    const res  = await fetch('/klean-aps-api/machines/' + _machineDelId, { method:'DELETE' })
    const json = await res.json()
    if (!json.success) throw new Error(json.message || 'API 오류')
    closeMachineDelModal()
    await loadMachine()
    toast('기계가 삭제되었습니다.', 'ok')
  } catch(e) {
    toast('삭제 실패: ' + e.message, 'err')
  } finally {
    btn.disabled = false
  }
}

/* ══════════════════════════════════════
   제약조건 설정
══════════════════════════════════════ */
// 기본값 정의
const CONSTRAINT_DEFAULTS = {
  'm2-max':2520,'m2-min':2400,'m2-maxpok':4,'m2-4pok-min':630,
  'm3-max':3420,'m3-min':3300,'m3-maxpok':4,'m3-exc-max':3410,'m3-exc-bw':'300,500,550',
  'mimi':30,'noprod-limit':625,'545-rule':'double','889-rule':'single','889-double-limit':5,
  'moq':3,'moq-same':1.5,'wj-ratio':60,'dpok-ratio':30,'wj-separate':'yes',
  'exc-japan':true,'exc-special':true,'exc-flagged':true,'exc-phil':false,'exc-customers':'',
  'stock-millroll':true,'stock-sheet':true,'stock-new':true
}

function loadConstraintValues() {
  const saved = JSON.parse(localStorage.getItem('klean-aps-constraints')||'{}')
  Object.entries(CONSTRAINT_DEFAULTS).forEach(([k,def]) => {
    const el = document.getElementById('c-'+k)
    if (!el) return
    const val = saved[k] !== undefined ? saved[k] : def
    if (el.type === 'checkbox') el.checked = val
    else el.value = val
  })
}

function saveConstraints() {
  const data = {}
  Object.keys(CONSTRAINT_DEFAULTS).forEach(k => {
    const el = document.getElementById('c-'+k)
    if (!el) return
    data[k] = el.type === 'checkbox' ? el.checked
              : el.type === 'number'   ? Number(el.value)
              : el.value
  })
  localStorage.setItem('klean-aps-constraints', JSON.stringify(data))
  const banner = document.getElementById('constraint-save-banner')
  if (banner) { banner.style.display='flex'; setTimeout(()=>banner.style.display='none',2500) }
  toast('제약조건이 저장되었습니다.','ok')
  updateSimConstraintSummary()
}

function resetConstraints() {
  localStorage.removeItem('klean-aps-constraints')
  loadConstraintValues()
  toast('기본값으로 복원되었습니다.','ok')
}

function getConstraints() {
  const saved = JSON.parse(localStorage.getItem('klean-aps-constraints')||'{}')
  const g = k => saved[k] !== undefined ? saved[k] : CONSTRAINT_DEFAULTS[k]
  return {
    m2Max:Number(g('m2-max')), m2Min:Number(g('m2-min')),
    m2MaxPok:Number(g('m2-maxpok')), m2FourPokMin:Number(g('m2-4pok-min')),
    m3Max:Number(g('m3-max')), m3Min:Number(g('m3-min')),
    m3MaxPok:Number(g('m3-maxpok')), m3ExcMax:Number(g('m3-exc-max')),
    m3ExcBw:(g('m3-exc-bw')+'').split(',').map(v=>Number(v.trim())),
    mimi:Number(g('mimi')), noprodLimit:Number(g('noprod-limit')),
    rule545:g('545-rule'), rule889:g('889-rule'),
    limit889Double:Number(g('889-double-limit')),
    moq:Number(g('moq')), moqSame:Number(g('moq-same')),
    wjRatio:Number(g('wj-ratio')), dpokRatio:Number(g('dpok-ratio')),
    excJapan:g('exc-japan'), excSpecial:g('exc-special'),
    excFlagged:g('exc-flagged'), excPhil:g('exc-phil'),
    excCustomers:(g('exc-customers')+'').split(',').map(s=>s.trim()).filter(Boolean)
  }
}

function updateSimConstraintSummary() {
  const c = getConstraints()
  const el = document.getElementById('sim-constraint-summary')
  if (!el) return
  el.innerHTML =
    '<div>2호기: '+c.m2Min.toLocaleString()+' ~ '+c.m2Max.toLocaleString()+'mm / 최대'+c.m2MaxPok+'폭</div>'+
    '<div>3호기: '+c.m3Min.toLocaleString()+' ~ '+c.m3Max.toLocaleString()+'mm / 최대'+c.m3MaxPok+'폭</div>'+
    '<div>배폭 미미: '+c.mimi+'mm</div>'+
    '<div>MOQ: '+c.moq+'TON / 동일규격: '+c.moqSame+'TON</div>'+
    '<div>원지비중: '+c.wjRatio+'% 이상</div>'
}

/* ══════════════════════════════════════
   지폭조합 시뮬레이션
══════════════════════════════════════ */
// 시뮬레이션 상태: 'idle' | 'generated' | 'confirmed'
let simState = 'idle'
let simOrders = []      // 현재 시뮬레이션 대상 오더
let simCombos = []      // 생성된 조합 결과
let simExcluded = []    // 분리된 예외 오더

function loadSimulation() {
  updateSimConstraintSummary()
  setSimState('idle')
}

function setSimState(state) {
  simState = state
  const genBtn     = document.getElementById('btn-sim-generate')
  const confBtn    = document.getElementById('btn-sim-confirm')
  const unconfBtn  = document.getElementById('btn-sim-unconfirm')
  const orderBtn   = document.getElementById('btn-sim-order')
  const badge      = document.getElementById('sim-state-badge')
  const statusText = document.getElementById('sim-status-text')

  const setBtn = (btn, enabled) => { if(btn) btn.disabled = !enabled }

  if (state === 'idle') {
    setBtn(genBtn,    true)
    setBtn(confBtn,   false)
    setBtn(unconfBtn, false)
    setBtn(orderBtn,  false)
    if(badge) badge.innerHTML=''
    if(statusText) statusText.innerHTML='조회 조건을 설정하고 <b>생성</b> 버튼을 눌러 시뮬레이션을 시작하세요.'
  } else if (state === 'generated') {
    setBtn(genBtn,    true)
    setBtn(confBtn,   true)
    setBtn(unconfBtn, false)
    setBtn(orderBtn,  false)
    if(badge) badge.innerHTML='<span class="badge b-open" style="font-size:11px;"><i class="fas fa-edit"></i> 생성됨</span>'
    if(statusText) statusText.innerHTML='조합 결과를 검토 후 <b>확정</b> 버튼을 눌러주세요.'
  } else if (state === 'confirmed') {
    setBtn(genBtn,    false)
    setBtn(confBtn,   false)
    setBtn(unconfBtn, true)
    setBtn(orderBtn,  true)
    if(badge) badge.innerHTML='<span class="badge b-assigned" style="font-size:11px;"><i class="fas fa-lock"></i> 확정됨</span>'
    if(statusText) statusText.innerHTML='시뮬레이션이 <b>확정</b>되었습니다. <b>오더생성</b>으로 점보롤 생산오더를 SAP에 전달하세요.'
  } else if (state === 'ordered') {
    setBtn(genBtn,    false)
    setBtn(confBtn,   false)
    setBtn(unconfBtn, false)
    setBtn(orderBtn,  false)
    if(badge) badge.innerHTML='<span class="badge b-complete" style="font-size:11px;"><i class="fas fa-check-circle"></i> 오더생성 완료</span>'
    if(statusText) statusText.innerHTML='점보롤 생산오더가 SAP으로 전송되었습니다. 새 시뮬레이션을 시작하려면 <b>생성</b> 버튼을 누르세요.'
    if(genBtn) genBtn.disabled = false   // 생성은 다시 가능
  }
}

// 예외 오더 판별
function isExcludedOrder(o) {
  const excJapan   = (document.getElementById('sim-exc-japan')||{}).checked !== false
  const excSpecial = (document.getElementById('sim-exc-special')||{}).checked !== false
  const excFlagged = (document.getElementById('sim-exc-flagged')||{}).checked !== false
  if (excJapan   && o.orderType === '일본수출') return '일본수출 분리'
  if (excSpecial && o.orderType === '특수지')   return '특수지 분리'
  if (excFlagged && o.isExcluded)               return '예외 플래그'
  return null
}

// 지폭조합 로직 (Mock 시뮬레이션)
function runCombinationAlgorithm(orders) {
  const c = getConstraints()
  const grouped = {}
  orders.forEach(o => {
    const key = o.machineNo + '_' + o.basisWeight
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(o)
  })
  const combos = []
  let comboIdx = 1

  Object.entries(grouped).forEach(([key, grpOrders]) => {
    const [machineNo, bwStr] = key.split('_')
    const bw = Number(bwStr)
    const maxW = machineNo === '2'
      ? c.m2Max
      : (c.m3ExcBw.includes(bw) ? c.m3ExcMax : c.m3Max)
    const minW = machineNo === '2' ? c.m2Min : c.m3Min
    const maxPok = machineNo === '2' ? c.m2MaxPok : c.m3MaxPok

    // 지폭 합산이 범위 안에 들어오도록 그리디 조합
    let bucket = []
    let bucketWidth = 0

    const flushBucket = () => {
      if (!bucket.length) return
      const totalW = bucketWidth + (bucket.length > 1 ? c.mimi * (bucket.length - 1) : 0)
      const loss   = Math.max(0, maxW - totalW)
      const lossRate = maxW > 0 ? (loss / maxW * 100) : 0
      const totalTon = bucket.reduce((s,o) => s + (o.orderQtyTon || 0), 0)
      combos.push({
        comboId: comboIdx++,
        machineNo, basisWeight: bw,
        orders: [...bucket],
        widthSum: totalW,
        maxWidth: maxW,
        loss, lossRate: lossRate.toFixed(1),
        totalTon: totalTon.toFixed(3),
        pokCount: bucket.length
      })
      bucket = []; bucketWidth = 0
    }

    grpOrders.forEach(o => {
      const w = o.paperWidth
      const tentativeW = bucketWidth + w + (bucket.length > 0 ? c.mimi : 0)
      if (bucket.length >= maxPok || tentativeW > maxW) {
        flushBucket()
      }
      bucket.push(o)
      bucketWidth += w
    })
    flushBucket()
  })
  return combos
}

async function simGenerate() {
  if (simState === 'confirmed') {
    toast('확정된 시뮬레이션입니다. 확정취소 후 재생성하세요.','info'); return
  }
  const machineNo   = (document.getElementById('sim-machineNo')||{}).value||''
  const basisWeight = (document.getElementById('sim-basisWeight')||{}).value||''
  const dueFrom     = (document.getElementById('sim-dueFrom')||{}).value||''
  const dueTo       = (document.getElementById('sim-dueTo')||{}).value||''
  const orderStatus = (document.getElementById('sim-orderStatus')||{}).value||''

  const tbody = document.getElementById('sim-order-tbody')
  if (tbody) tbody.innerHTML = '<tr><td colspan="10" class="empty-state"><i class="fas fa-spinner fa-spin"></i> 오더 불러오는 중...</td></tr>'

  let filtered = [...orders]
  if (machineNo)   filtered = filtered.filter(o => o.machineNo   === machineNo)
  if (basisWeight) filtered = filtered.filter(o => o.basisWeight === Number(basisWeight))
  if (dueFrom)     filtered = filtered.filter(o => o.dueDate >= dueFrom)
  if (dueTo)       filtered = filtered.filter(o => o.dueDate <= dueTo)
  if (orderStatus) filtered = filtered.filter(o => o.status    === orderStatus)

  // 예외 분리
  simExcluded = []
  simOrders   = filtered.filter(o => {
    const reason = isExcludedOrder(o)
    if (reason) { simExcluded.push({...o, _excludeReason: reason}); return false }
    return true
  })

  // 오더 목록 렌더링
  renderSimOrderTable(simOrders)

  // 조합 실행
  await new Promise(r => setTimeout(r, 400)) // UX 딜레이
  simCombos = runCombinationAlgorithm(simOrders)
  renderSimResult(simCombos)
  renderSimExcluded(simExcluded)

  document.getElementById('sim-result-panel').style.display = 'flex'
  document.getElementById('sim-result-panel').style.flexDirection = 'column'
  if (simExcluded.length) {
    document.getElementById('sim-excl-panel').style.display = 'block'
  } else {
    document.getElementById('sim-excl-panel').style.display = 'none'
  }
  setSimState('generated')
  toast('지폭조합 시뮬레이션이 생성되었습니다.','ok')
}

function renderSimOrderTable(list) {
  const tbody = document.getElementById('sim-order-tbody')
  const cnt   = document.getElementById('sim-order-count')
  if (cnt) cnt.textContent = list.length + '건'
  if (!tbody) return
  if (!list.length) {
    tbody.innerHTML = '<tr><td colspan="10" class="empty-state">조건에 맞는 오더가 없습니다.</td></tr>'; return
  }
  tbody.innerHTML = list.map(o => {
    const qtyStr = o.orderQtyTon ? o.orderQtyTon.toFixed(3)+'T'
                 : o.orderQtyR   ? o.orderQtyR.toLocaleString()+'R'
                 : o.orderQtySok ? o.orderQtySok.toLocaleString()+'SOK' : '-'
    return '<tr>' +
      '<td class="center"><input type="checkbox" class="sim-chk" value="'+o.orderId+'" checked></td>' +
      '<td style="font-family:monospace;color:#60a5fa;font-size:11px;">'+o.sapOrderNo+'</td>' +
      '<td style="font-size:12px;">'+o.customerName+'</td>' +
      '<td class="center"><span class="machine-badge">'+o.machineNo+'호기</span></td>' +
      '<td class="num" style="font-weight:700;">'+o.basisWeight+'</td>' +
      '<td class="num" style="font-weight:700;">'+o.paperWidth.toLocaleString()+'</td>' +
      '<td class="num">'+qtyStr+'</td>' +
      '<td style="font-size:11px;color:var(--text-muted);">'+o.dueDate+'</td>' +
      '<td>'+renderOrderTypeBadge(o.orderType)+'</td>' +
      '<td class="center">'+(o.isExcluded ? '<i class="fas fa-flag" style="color:#f87171;"></i>' : '')+'</td>' +
      '</tr>'
  }).join('')
}

function simToggleAll(checked) {
  document.querySelectorAll('.sim-chk').forEach(c => c.checked = checked)
}

function renderSimResult(combos) {
  const totalTon  = combos.reduce((s,c) => s + Number(c.totalTon), 0)
  const totalOrds = combos.reduce((s,c) => s + c.orders.length, 0)
  const avgLoss   = combos.length ? (combos.reduce((s,c) => s + Number(c.lossRate), 0) / combos.length).toFixed(1) : '0.0'

  const elTotal  = document.getElementById('sr-total')
  const elOrders = document.getElementById('sr-orders')
  const elTon    = document.getElementById('sr-ton')
  const elLoss   = document.getElementById('sr-loss')
  if (elTotal)  elTotal.textContent  = combos.length
  if (elOrders) elOrders.textContent = totalOrds
  if (elTon)    elTon.textContent    = totalTon.toFixed(3)
  if (elLoss)   elLoss.textContent   = avgLoss + '%'

  const cnt = document.getElementById('sim-result-count')
  if (cnt) cnt.textContent = combos.length + '개 조합'

  const list = document.getElementById('sim-combo-list')
  if (!list) return
  if (!combos.length) {
    list.innerHTML = '<div style="text-align:center;padding:24px;color:var(--text-faint);">조합 결과가 없습니다.</div>'; return
  }
  list.innerHTML = combos.map(combo => {
    const lossColor = Number(combo.lossRate) === 0 ? '#34d399'
                    : Number(combo.lossRate) < 2   ? '#f59e0b' : '#f87171'
    const widthBars = combo.orders.map(o =>
      '<span style="display:inline-block;padding:3px 8px;margin:2px;background:var(--bg-input);border:1px solid var(--border);border-radius:4px;font-size:11px;font-weight:700;color:var(--text-main);">'+
      o.paperWidth+'mm</span>'
    ).join('<span style="color:var(--border);font-size:12px;"> + 미미30 + </span>')

    return '<div style="border:1px solid var(--border);border-radius:8px;padding:14px;margin-bottom:10px;background:var(--bg-input);">'+
      '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">'+
        '<span style="font-weight:800;font-size:14px;color:#a78bfa;">#'+combo.comboId+'</span>'+
        '<span class="machine-badge">'+combo.machineNo+'호기</span>'+
        '<span style="font-size:12px;color:var(--text-muted);">평량 '+combo.basisWeight+'g/m²</span>'+
        '<span style="font-size:12px;">'+combo.pokCount+'폭</span>'+
        '<div style="margin-left:auto;display:flex;gap:8px;align-items:center;">'+
          '<span style="font-size:12px;color:var(--text-muted);">합계 지폭: <b style="color:var(--text-main);">'+combo.widthSum.toLocaleString()+'mm</b> / '+combo.maxWidth.toLocaleString()+'mm</span>'+
          '<span style="font-size:12px;color:'+lossColor+';font-weight:700;">Loss '+combo.lossRate+'%</span>'+
          '<span style="font-size:12px;color:#34d399;font-weight:700;">'+combo.totalTon+'T</span>'+
        '</div>'+
      '</div>'+
      '<div style="margin-bottom:8px;">'+widthBars+'</div>'+
      '<table style="width:100%;border-collapse:collapse;font-size:11px;">'+
        '<thead style="background:var(--bg-card);">'+
          '<tr><th style="padding:4px 6px;text-align:left;color:var(--text-muted);">오더번호</th>'+
          '<th style="padding:4px 6px;text-align:left;color:var(--text-muted);">납품처</th>'+
          '<th style="padding:4px 6px;text-align:right;color:var(--text-muted);">지폭</th>'+
          '<th style="padding:4px 6px;text-align:right;color:var(--text-muted);">수량</th>'+
          '<th style="padding:4px 6px;text-align:left;color:var(--text-muted);">납기일</th></tr>'+
        '</thead>'+
        '<tbody>'+
          combo.orders.map(o => {
            const q = o.orderQtyTon ? o.orderQtyTon.toFixed(3)+'T' : o.orderQtyR ? o.orderQtyR+'R' : '-'
            return '<tr>'+
              '<td style="padding:4px 6px;font-family:monospace;color:#60a5fa;">'+o.sapOrderNo+'</td>'+
              '<td style="padding:4px 6px;">'+o.customerName+'</td>'+
              '<td style="padding:4px 6px;text-align:right;font-weight:700;">'+o.paperWidth.toLocaleString()+'mm</td>'+
              '<td style="padding:4px 6px;text-align:right;color:#34d399;">'+q+'</td>'+
              '<td style="padding:4px 6px;color:var(--text-muted);">'+o.dueDate+'</td>'+
              '</tr>'
          }).join('')+
        '</tbody>'+
      '</table>'+
    '</div>'
  }).join('')
}

function renderSimExcluded(list) {
  const tbody = document.getElementById('sim-excl-tbody')
  if (!tbody) return
  tbody.innerHTML = list.map(o => {
    const q = o.orderQtyTon ? o.orderQtyTon.toFixed(3)+'T' : o.orderQtyR ? o.orderQtyR+'R' : '-'
    return '<tr>'+
      '<td style="font-family:monospace;color:#60a5fa;font-size:11px;">'+o.sapOrderNo+'</td>'+
      '<td style="font-size:12px;">'+o.customerName+'</td>'+
      '<td class="center"><span class="machine-badge">'+o.machineNo+'호기</span></td>'+
      '<td class="num">'+o.basisWeight+'</td>'+
      '<td class="num">'+o.paperWidth.toLocaleString()+'</td>'+
      '<td class="num">'+q+'</td>'+
      '<td>'+renderOrderTypeBadge(o.orderType)+'</td>'+
      '<td><span class="badge b-cancel" style="font-size:10px;">'+o._excludeReason+'</span></td>'+
      '</tr>'
  }).join('')
}

function simConfirm() {
  if (simState !== 'generated') return
  if (!simCombos.length) { toast('조합 결과가 없습니다.','info'); return }
  setSimState('confirmed')
  toast('시뮬레이션이 확정되었습니다. 오더생성 버튼으로 SAP에 전달하세요.','ok')
}

function simUnconfirm() {
  if (simState !== 'confirmed') return
  setSimState('generated')
  toast('확정이 취소되었습니다. 시뮬레이션을 재생성하거나 수정할 수 있습니다.','ok')
}

// ── 점보롤 오더 번호 시퀀스 (프론트 로컬)
let _jumboLocalSeq = 1

// 점보롤 생산오더 생성 → API 저장 → 화면 렌더링 → SAP RFC 로그
async function simSendOrder() {
  if (simState !== 'confirmed') return
  if (!simCombos.length) { toast('전송할 조합이 없습니다.','info'); return }

  const btn = document.getElementById('btn-sim-order')
  if (btn) btn.disabled = true
  toast('점보롤 생산오더 생성 중...','ok')

  // ── 1. 조합 결과 → 점보롤 오더 페이로드 빌드
  const c = getConstraints()
  const today = new Date()
  const pad = n => String(n).padStart(2,'0')
  const todayStr = today.getFullYear()+'-'+pad(today.getMonth()+1)+'-'+pad(today.getDate())

  const jumboPayload = simCombos.map(combo => {
    const mimi = c.mimi || 30
    // 개별 지폭 배열
    const widths = combo.orders.map(o => o.paperWidth)
    // 전체 지폭 = 폭합산 + 미미 × (폭수-1)
    const jumboWidth = widths.reduce((s,w) => s+w, 0) + (widths.length > 1 ? mimi*(widths.length-1) : 0)
    // 연결 판매오더번호
    const sourceOrderNos = combo.orders.map(o => o.sapOrderNo)
    // 납기일 중 가장 이른 것으로 planEndDate 설정
    const dueDates = combo.orders.map(o => o.dueDate).filter(Boolean).sort()
    const planEndDate = dueDates[0] || todayStr

    return {
      machineNo:      combo.machineNo,
      basisWeight:    combo.basisWeight,
      jumboWidth,
      totalTon:       Number(combo.totalTon),
      pokCount:       combo.pokCount,
      widths,
      sourceComboId:  combo.comboId,
      sourceOrderNos,
      planStartDate:  todayStr,
      planEndDate,
      lossRate:       combo.lossRate,
    }
  })

  try {
    // ── 2. API 저장
    const res  = await fetch('/klean-aps-api/jumbo-orders', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ jumboOrders: jumboPayload })
    })
    const json = await res.json()
    if (!json.success) throw new Error(json.message || 'API 오류')

    const created = json.data

    // ── 3. Mock SAP RFC 딜레이
    await new Promise(r => setTimeout(r, 700))

    // ── 4. 화면 렌더링
    renderJumboOrders(created)

    // ── 5. 상태 전환 (오더생성 완료 = 새 상태 'ordered')
    setSimState('ordered')
    toast('점보롤 생산오더 '+created.length+'건이 생성되었습니다. (SAP RFC Z_CREATE_PROD_ORDER 전송 완료)','ok')

  } catch(e) {
    toast('오더생성 실패: '+e.message,'err')
    if (btn) btn.disabled = false
  }
}

// ── 점보롤 오더 목록 렌더링
function renderJumboOrders(list) {
  // 패널 표시
  const panel = document.getElementById('sim-jumbo-panel')
  if (panel) panel.style.display = 'flex', panel.style.flexDirection = 'column'

  // 요약 통계
  const m2 = list.filter(j => j.machineNo === '2').length
  const m3 = list.filter(j => j.machineNo === '3').length
  const totalTon = list.reduce((s,j) => s+Number(j.totalTon), 0)
  const avgLoss  = list.length
    ? (list.reduce((s,j) => s+Number(j.lossRate||0), 0) / list.length).toFixed(1)
    : '0.0'

  const set = (id,v) => { const el=document.getElementById(id); if(el) el.textContent=v }
  set('sj-count',   list.length+'건')
  set('sj-m2',      m2+'건')
  set('sj-m3',      m3+'건')
  set('sj-ton',     totalTon.toFixed(3)+'T')
  set('sj-avgloss', avgLoss+'%')
  const cntBadge = document.getElementById('sim-jumbo-count')
  if (cntBadge) cntBadge.textContent = list.length+'건'
  const stBadge = document.getElementById('sim-jumbo-status-badge')
  if (stBadge) stBadge.innerHTML = '<i class="fas fa-check-circle"></i> SAP 전송 완료'

  // 테이블
  const tbody = document.getElementById('sim-jumbo-tbody')
  if (!tbody) return
  if (!list.length) {
    tbody.innerHTML = '<tr><td colspan="11" class="empty-state">생성된 점보롤 오더가 없습니다.</td></tr>'
    return
  }

  tbody.innerHTML = list.map((j, idx) => {
    const lossColor = Number(j.lossRate) === 0 ? '#34d399'
                    : Number(j.lossRate) < 2   ? '#f59e0b' : '#f87171'
    const widthCells = (j.widths||[]).map(w =>
      '<span style="display:inline-block;padding:2px 6px;margin:1px;background:var(--bg-input);border:1px solid var(--border);border-radius:4px;font-size:10px;font-weight:700;">'+w+'mm</span>'
    ).join('<span style="color:var(--text-faint);font-size:10px;"> + </span>')

    const orderNos = (j.sourceOrderNos||[]).map(no =>
      '<span style="font-family:monospace;font-size:10px;color:#60a5fa;margin-right:4px;">'+no+'</span>'
    ).join('')

    return '<tr>'+
      '<td class="center" style="color:var(--text-faint);font-size:11px;">'+(idx+1)+'</td>'+
      '<td style="font-family:monospace;font-weight:700;color:#34d399;font-size:11px;">'+j.jumboOrderNo+'</td>'+
      '<td class="center"><span class="machine-badge">'+j.machineNo+'호기</span></td>'+
      '<td class="num" style="font-weight:700;">'+j.basisWeight+'</td>'+
      '<td class="num" style="font-weight:800;color:var(--text-main);">'+j.jumboWidth.toLocaleString()+'mm</td>'+
      '<td style="white-space:nowrap;">'+widthCells+'</td>'+
      '<td class="center" style="font-weight:700;">'+j.pokCount+'폭</td>'+
      '<td class="num" style="font-weight:700;color:#34d399;">'+Number(j.totalTon).toFixed(3)+'T</td>'+
      '<td class="num" style="font-weight:700;color:'+lossColor+';">'+j.lossRate+'%</td>'+
      '<td style="max-width:180px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">'+orderNos+'</td>'+
      '<td class="center"><span class="badge b-assigned" style="font-size:10px;"><i class="fas fa-paper-plane"></i> SAP전송</span></td>'+
      '</tr>'
  }).join('')

  // RFC 로그 출력
  const rfcLog = document.getElementById('sim-jumbo-rfc-log')
  if (rfcLog) {
    rfcLog.style.display = 'block'
    const now = new Date()
    const ts = now.getHours()+':'+String(now.getMinutes()).padStart(2,'0')+':'+String(now.getSeconds()).padStart(2,'0')
    const logLines = ['['+ts+'] RFC Z_CREATE_PROD_ORDER 호출 시작 — 점보롤 '+list.length+'건']
    list.forEach((j,i) => {
      logLines.push(
        '['+ts+'] #'+(i+1)+' '+j.jumboOrderNo+
        ' | '+j.machineNo+'호기 | '+j.basisWeight+'g | '+j.jumboWidth+'mm '+j.pokCount+'폭'+
        ' | '+Number(j.totalTon).toFixed(3)+'T → RETURN: S (성공)'
      )
    })
    logLines.push('['+ts+'] RFC 완료 — 전체 '+list.length+'건 성공, 실패 0건')
    rfcLog.innerHTML = logLines.join('<br>')
    rfcLog.scrollTop = rfcLog.scrollHeight
  }
}

/* ══════════════════════════════════════
   헬퍼
══════════════════════════════════════ */
function renderOrderTypeBadge(t) {
  const m = {내수:'b-domestic',수출:'b-export',일본수출:'b-japan',특수지:'b-special'}
  return '<span class="badge '+(m[t]||'b-domestic')+'">'+t+'</span>'
}
function renderStatusBadge(s) {
  const m = {OPEN:'b-open',ASSIGNED:'b-assigned',COMPLETED:'b-complete',CANCELLED:'b-cancel'}
  const l = {OPEN:'OPEN',ASSIGNED:'배정완료',COMPLETED:'생산완료',CANCELLED:'취소'}
  return '<span class="badge '+(m[s]||'b-open')+'" style="font-size:10px;">'+(l[s]||s)+'</span>'
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