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

const EXCEL_SALES_ORDERS_DATA = [
  { orderId:1, sapOrderNo:'50137471', sapItemNo:'000010', orderType:'내수', customerCode:'101152', customerName:'양지페이퍼(주)', machineNo:'', basisWeight:350, paperWidth:940, orderQtyKg:1316.0, orderQtyTon:1.316, orderQtyR:null, orderQtySok:null, unit:'KG', dueDate:'2026-06-10', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'H3S11350-09400000', desc:'SC Manila 350GSM 0940*0000 Roll (3)', prodType:'Roll', unitPrice:775.0, currency:'KRW', plant:'P100' },
  { orderId:2, sapOrderNo:'50137470', sapItemNo:'000010', orderType:'내수', customerCode:'101152', customerName:'양지페이퍼(주)', machineNo:'', basisWeight:350, paperWidth:788, orderQtyKg:1103.0, orderQtyTon:1.103, orderQtyR:null, orderQtySok:null, unit:'KG', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'H3S11350-07880000', desc:'SC Manila 350GSM 0788*0000 Roll (3)', prodType:'Roll', unitPrice:775.0, currency:'KRW', plant:'P100' },
  { orderId:3, sapOrderNo:'50137469', sapItemNo:'000010', orderType:'내수', customerCode:'101152', customerName:'양지페이퍼(주)', machineNo:'', basisWeight:240, paperWidth:788, orderQtyKg:1078.0, orderQtyTon:1.078, orderQtyR:null, orderQtySok:null, unit:'KG', dueDate:'2026-06-10', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:true, excludeReason:'거부사유:07', matCode:'H2S11240-07880000', desc:'SC Manila 240GSM 0788*0000 Roll (2)', prodType:'Roll', unitPrice:828.0, currency:'KRW', plant:'P100' },
  { orderId:4, sapOrderNo:'50137469', sapItemNo:'000020', orderType:'내수', customerCode:'101152', customerName:'양지페이퍼(주)', machineNo:'', basisWeight:240, paperWidth:950, orderQtyKg:1300.0, orderQtyTon:1.3, orderQtyR:null, orderQtySok:null, unit:'KG', dueDate:'2026-06-10', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:true, excludeReason:'거부사유:07', matCode:'H2S11240-09500000', desc:'SC Manila 240GSM 0950*0000 Roll (2)', prodType:'Roll', unitPrice:828.0, currency:'KRW', plant:'P100' },
  { orderId:5, sapOrderNo:'50137467', sapItemNo:'000010', orderType:'내수', customerCode:'101152', customerName:'양지페이퍼(주)', machineNo:'', basisWeight:400, paperWidth:889, orderQtyKg:0.0, orderQtyTon:0.0, orderQtyR:null, orderQtySok:null, unit:'KG', dueDate:'2026-06-10', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:true, excludeReason:'거부사유:07', matCode:'H3S11400-08890000', desc:'SC Manila 400GSM 0889*0000 Roll (3)', prodType:'Roll', unitPrice:764.0, currency:'KRW', plant:'P100' },
  { orderId:6, sapOrderNo:'50137466', sapItemNo:'000010', orderType:'내수', customerCode:'101190', customerName:'주식회사 에스페랑스', machineNo:'', basisWeight:400, paperWidth:740, orderQtyKg:165.2, orderQtyTon:165.2, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-20', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3ST1400-07400495B', desc:'FT PACK 400GSM 0740*0495 BULK (3)', prodType:'Bulk', unitPrice:898.0, currency:'KRW', plant:'P100' },
  { orderId:7, sapOrderNo:'50137464', sapItemNo:'000010', orderType:'내수', customerCode:'101190', customerName:'주식회사 에스페랑스', machineNo:'', basisWeight:400, paperWidth:720, orderQtyKg:164.6, orderQtyTon:164.6, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3ST1400-07200465B', desc:'FT PACK 400GSM 0720*0465 Bulk (3)', prodType:'Bulk', unitPrice:811.0, currency:'KRW', plant:'P100' },
  { orderId:8, sapOrderNo:'50137464', sapItemNo:'000010', orderType:'내수', customerCode:'101190', customerName:'주식회사 에스페랑스', machineNo:'', basisWeight:400, paperWidth:720, orderQtyKg:0.0, orderQtyTon:0.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-10', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3ST1400-07200465B', desc:'FT PACK 400GSM 0720*0465 Bulk (3)', prodType:'Bulk', unitPrice:811.0, currency:'KRW', plant:'P100' },
  { orderId:9, sapOrderNo:'50137463', sapItemNo:'000010', orderType:'내수', customerCode:'101190', customerName:'주식회사 에스페랑스', machineNo:'', basisWeight:400, paperWidth:720, orderQtyKg:208.8, orderQtyTon:208.8, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-20', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3ST1400-07200465B', desc:'FT PACK 400GSM 0720*0465 Bulk (3)', prodType:'Bulk', unitPrice:898.0, currency:'KRW', plant:'P100' },
  { orderId:10, sapOrderNo:'50137462', sapItemNo:'000010', orderType:'내수', customerCode:'101190', customerName:'주식회사 에스페랑스', machineNo:'', basisWeight:350, paperWidth:720, orderQtyKg:264.0, orderQtyTon:264.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-29', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3ST1350-07200465B', desc:'FT PACK 350GSM 0720*0465 Bulk (3)', prodType:'Bulk', unitPrice:911.0, currency:'KRW', plant:'P100' },
  { orderId:11, sapOrderNo:'50137462', sapItemNo:'000010', orderType:'내수', customerCode:'101190', customerName:'주식회사 에스페랑스', machineNo:'', basisWeight:350, paperWidth:720, orderQtyKg:0.0, orderQtyTon:0.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-20', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3ST1350-07200465B', desc:'FT PACK 350GSM 0720*0465 Bulk (3)', prodType:'Bulk', unitPrice:911.0, currency:'KRW', plant:'P100' },
  { orderId:12, sapOrderNo:'50137461', sapItemNo:'000010', orderType:'내수', customerCode:'101190', customerName:'주식회사 에스페랑스', machineNo:'', basisWeight:350, paperWidth:745, orderQtyKg:24.0, orderQtyTon:24.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-10', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3ST1350-07450485B', desc:'FT PACK 350GSM 0745*0485 Bulk (3)', prodType:'Bulk', unitPrice:823.0, currency:'KRW', plant:'P100' },
  { orderId:13, sapOrderNo:'50137460', sapItemNo:'000010', orderType:'내수', customerCode:'101190', customerName:'주식회사 에스페랑스', machineNo:'', basisWeight:350, paperWidth:745, orderQtyKg:87.2, orderQtyTon:87.2, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-23', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:true, excludeReason:'거부사유:06', matCode:'F3ST1350-07450485B', desc:'FT PACK 350GSM 0745*0485 Bulk (3)', prodType:'Bulk', unitPrice:823.0, currency:'KRW', plant:'P100' },
  { orderId:14, sapOrderNo:'50137460', sapItemNo:'000010', orderType:'내수', customerCode:'101190', customerName:'주식회사 에스페랑스', machineNo:'', basisWeight:350, paperWidth:745, orderQtyKg:0.0, orderQtyTon:0.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-20', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:true, excludeReason:'거부사유:06', matCode:'F3ST1350-07450485B', desc:'FT PACK 350GSM 0745*0485 Bulk (3)', prodType:'Bulk', unitPrice:823.0, currency:'KRW', plant:'P100' },
  { orderId:15, sapOrderNo:'50137455', sapItemNo:'000010', orderType:'내수', customerCode:'101190', customerName:'주식회사 에스페랑스', machineNo:'', basisWeight:400, paperWidth:1020, orderQtyKg:5712.0, orderQtyTon:5.712, orderQtyR:null, orderQtySok:null, unit:'KG', dueDate:'2026-06-18', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'H3S11400-10200000', desc:'SC Manila 400GSM 1020*0000 Roll (3)', prodType:'Roll', unitPrice:737.0, currency:'KRW', plant:'P100' },
  { orderId:16, sapOrderNo:'50137455', sapItemNo:'000020', orderType:'내수', customerCode:'101190', customerName:'주식회사 에스페랑스', machineNo:'', basisWeight:400, paperWidth:1091, orderQtyKg:1527.0, orderQtyTon:1.527, orderQtyR:null, orderQtySok:null, unit:'KG', dueDate:'2026-06-18', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'H3S11400-10910000', desc:'SC Manila 400GSM 1091*0000 Roll (3)', prodType:'Roll', unitPrice:737.0, currency:'KRW', plant:'P100' },
  { orderId:17, sapOrderNo:'50137453', sapItemNo:'000010', orderType:'내수', customerCode:'101190', customerName:'주식회사 에스페랑스', machineNo:'', basisWeight:400, paperWidth:940, orderQtyKg:1316.0, orderQtyTon:1.316, orderQtyR:null, orderQtySok:null, unit:'KG', dueDate:'2026-06-20', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:true, excludeReason:'거부사유:07', matCode:'H3S11400-09400000', desc:'SC Manila 400GSM 0940*0000 Roll (3)', prodType:'Roll', unitPrice:737.0, currency:'KRW', plant:'P100' },
  { orderId:18, sapOrderNo:'50137451', sapItemNo:'000010', orderType:'내수', customerCode:'101190', customerName:'주식회사 에스페랑스', machineNo:'', basisWeight:400, paperWidth:1020, orderQtyKg:1428.0, orderQtyTon:1.428, orderQtyR:null, orderQtySok:null, unit:'KG', dueDate:'2026-06-20', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:true, excludeReason:'거부사유:07', matCode:'H3S11400-10200000', desc:'SC Manila 400GSM 1020*0000 Roll (3)', prodType:'Roll', unitPrice:737.0, currency:'KRW', plant:'P100' },
  { orderId:19, sapOrderNo:'50137450', sapItemNo:'000010', orderType:'내수', customerCode:'101152', customerName:'양지페이퍼(주)', machineNo:'', basisWeight:300, paperWidth:889, orderQtyKg:1067.0, orderQtyTon:1.067, orderQtyR:null, orderQtySok:null, unit:'KG', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'H2S11300-08890000', desc:'SC Manila 300GSM 0889*0000 Roll (2)', prodType:'Roll', unitPrice:741.0, currency:'KRW', plant:'P100' },
  { orderId:20, sapOrderNo:'50137450', sapItemNo:'000011', orderType:'내수', customerCode:'101152', customerName:'양지페이퍼(주)', machineNo:'', basisWeight:300, paperWidth:840, orderQtyKg:0.0, orderQtyTon:0.0, orderQtyR:null, orderQtySok:null, unit:'KG', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:true, excludeReason:'거부사유:99', matCode:'H2S11300-08400000', desc:'SC Manila 300GSM 0840*0000 Roll (2)', prodType:'Roll', unitPrice:780.0, currency:'KRW', plant:'P100' },
  { orderId:21, sapOrderNo:'50137449', sapItemNo:'000010', orderType:'내수', customerCode:'101152', customerName:'양지페이퍼(주)', machineNo:'', basisWeight:400, paperWidth:700, orderQtyKg:10.0, orderQtyTon:10.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3S11400-07000570B', desc:'SC Manila 400GSM 0700*0570 Bulk (3)', prodType:'Bulk', unitPrice:925.0, currency:'KRW', plant:'P100' },
  { orderId:22, sapOrderNo:'50137448', sapItemNo:'000010', orderType:'내수', customerCode:'101202', customerName:'주식회사 디와이페이퍼', machineNo:'', basisWeight:500, paperWidth:788, orderQtyKg:4.0, orderQtyTon:4.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3S11500-07881091B', desc:'SC Manila 500GSM 0788*1091 Bulk (3)', prodType:'Bulk', unitPrice:900.0, currency:'KRW', plant:'P100' },
  { orderId:23, sapOrderNo:'50137447', sapItemNo:'000010', orderType:'내수', customerCode:'101190', customerName:'주식회사 에스페랑스', machineNo:'', basisWeight:400, paperWidth:1194, orderQtyKg:0.6, orderQtyTon:0.6, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-12', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3S11400-11940889A', desc:'SC Manila 400GSM 1194*0889 Ream (3)', prodType:'Ream', unitPrice:899.0, currency:'KRW', plant:'P400' },
  { orderId:24, sapOrderNo:'50137447', sapItemNo:'000020', orderType:'내수', customerCode:'101190', customerName:'주식회사 에스페랑스', machineNo:'', basisWeight:450, paperWidth:1055, orderQtyKg:4.4, orderQtyTon:4.4, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-12', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3S11450-10550785B', desc:'SC Manila 450GSM 1055*0785 Bulk (3)', prodType:'Bulk', unitPrice:885.0, currency:'KRW', plant:'P400' },
  { orderId:25, sapOrderNo:'50137446', sapItemNo:'000010', orderType:'내수', customerCode:'101152', customerName:'양지페이퍼(주)', machineNo:'', basisWeight:350, paperWidth:889, orderQtyKg:3.8, orderQtyTon:3.8, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3I11350-08891194A', desc:'IVory 350GSM 0889*1194 Ream (3)', prodType:'Ream', unitPrice:1210.0, currency:'KRW', plant:'P100' },
  { orderId:26, sapOrderNo:'50137445', sapItemNo:'000010', orderType:'내수', customerCode:'101202', customerName:'주식회사 디와이페이퍼', machineNo:'', basisWeight:450, paperWidth:788, orderQtyKg:4.4, orderQtyTon:4.4, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3I11450-07881091A', desc:'IVory 450GSM 0788*1091 Ream (3)', prodType:'Ream', unitPrice:1119.0, currency:'KRW', plant:'P100' },
  { orderId:27, sapOrderNo:'50137444', sapItemNo:'000010', orderType:'내수', customerCode:'101202', customerName:'주식회사 디와이페이퍼', machineNo:'', basisWeight:400, paperWidth:788, orderQtyKg:5.0, orderQtyTon:5.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3S11400-07881091A', desc:'SC Manila 400GSM 0788*1091 Ream (3)', prodType:'Ream', unitPrice:871.0, currency:'KRW', plant:'P100' },
  { orderId:28, sapOrderNo:'50137443', sapItemNo:'000010', orderType:'내수', customerCode:'101202', customerName:'주식회사 디와이페이퍼', machineNo:'', basisWeight:240, paperWidth:530, orderQtyKg:0.0, orderQtyTon:0.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-20', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:true, excludeReason:'거부사유:07', matCode:'F2K11240-05300935A', desc:'Kraft(무,단) 240GSM 0530*0935 Ream (2)', prodType:'Ream', unitPrice:991.0, currency:'KRW', plant:'P100' },
  { orderId:29, sapOrderNo:'50137443', sapItemNo:'000010', orderType:'내수', customerCode:'101202', customerName:'주식회사 디와이페이퍼', machineNo:'', basisWeight:240, paperWidth:530, orderQtyKg:34.0, orderQtyTon:34.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-23', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:true, excludeReason:'거부사유:07', matCode:'F2K11240-05300935A', desc:'Kraft(무,단) 240GSM 0530*0935 Ream (2)', prodType:'Ream', unitPrice:991.0, currency:'KRW', plant:'P100' },
  { orderId:30, sapOrderNo:'50137442', sapItemNo:'000010', orderType:'내수', customerCode:'101152', customerName:'양지페이퍼(주)', machineNo:'', basisWeight:350, paperWidth:1194, orderQtyKg:4.0, orderQtyTon:4.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3I11350-11940889A', desc:'IVory 350GSM 1194*0889 Ream (3)', prodType:'Ream', unitPrice:1210.0, currency:'KRW', plant:'P100' },
  { orderId:31, sapOrderNo:'50137441', sapItemNo:'000010', orderType:'내수', customerCode:'101202', customerName:'주식회사 디와이페이퍼', machineNo:'', basisWeight:240, paperWidth:530, orderQtyKg:1.25, orderQtyTon:1.25, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F2K11240-05300935A', desc:'Kraft(무,단) 240GSM 0530*0935 Ream (2)', prodType:'Ream', unitPrice:987.0, currency:'KRW', plant:'P100' },
  { orderId:32, sapOrderNo:'50137440', sapItemNo:'000010', orderType:'내수', customerCode:'101190', customerName:'주식회사 에스페랑스', machineNo:'', basisWeight:450, paperWidth:889, orderQtyKg:30.2, orderQtyTon:30.2, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-20', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:true, excludeReason:'거부사유:07', matCode:'F3I11450-08891194A', desc:'IVory 450GSM 0889*1194 Ream (3)', prodType:'Ream', unitPrice:1154.0, currency:'KRW', plant:'P100' },
  { orderId:33, sapOrderNo:'50137439', sapItemNo:'000010', orderType:'내수', customerCode:'100142', customerName:'(주)흥아지업', machineNo:'', basisWeight:240, paperWidth:700, orderQtyKg:9.0, orderQtyTon:9.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-10', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F2S11240-07000850B', desc:'SC Manila 240GSM 0700*0850 Bulk (2)', prodType:'Bulk', unitPrice:1002.0, currency:'KRW', plant:'P100' },
  { orderId:34, sapOrderNo:'50137438', sapItemNo:'000010', orderType:'내수', customerCode:'101202', customerName:'주식회사 디와이페이퍼', machineNo:'', basisWeight:240, paperWidth:720, orderQtyKg:2.75, orderQtyTon:2.75, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-10', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F2K11240-07200995A', desc:'Kraft(무,단) 240GSM 0720*0995 Ream (2)', prodType:'Ream', unitPrice:989.0, currency:'KRW', plant:'P100' },
  { orderId:35, sapOrderNo:'50137437', sapItemNo:'000010', orderType:'내수', customerCode:'101202', customerName:'주식회사 디와이페이퍼', machineNo:'', basisWeight:300, paperWidth:640, orderQtyKg:14.0, orderQtyTon:14.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-20', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F2S11300-06400940A', desc:'SC Manila 300GSM 0640*0940 Ream (2)', prodType:'Ream', unitPrice:945.0, currency:'KRW', plant:'P100' },
  { orderId:36, sapOrderNo:'50137435', sapItemNo:'000010', orderType:'내수', customerCode:'101201', customerName:'주식회사 페이퍼칸', machineNo:'', basisWeight:400, paperWidth:965, orderQtyKg:5.0, orderQtyTon:5.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3S11400-09650665B', desc:'SC Manila 400GSM 0965*0665 Bulk (3)', prodType:'Bulk', unitPrice:827.0, currency:'KRW', plant:'P100' },
  { orderId:37, sapOrderNo:'50137435', sapItemNo:'000020', orderType:'내수', customerCode:'101201', customerName:'주식회사 페이퍼칸', machineNo:'', basisWeight:400, paperWidth:480, orderQtyKg:5.0, orderQtyTon:5.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3S11400-04800680A', desc:'SC Manila 400GSM 0480*0680 Ream (3)', prodType:'Ream', unitPrice:925.0, currency:'KRW', plant:'P100' },
  { orderId:38, sapOrderNo:'50137435', sapItemNo:'000021', orderType:'내수', customerCode:'101201', customerName:'주식회사 페이퍼칸', machineNo:'', basisWeight:400, paperWidth:960, orderQtyKg:0.0, orderQtyTon:0.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:true, excludeReason:'거부사유:99', matCode:'F3S11400-09600610B', desc:'SC Manila 400GSM 0960*0610 Bulk (3)', prodType:'Bulk', unitPrice:871.0, currency:'KRW', plant:'P100' },
  { orderId:39, sapOrderNo:'50137347', sapItemNo:'000010', orderType:'내수', customerCode:'101202', customerName:'주식회사 디와이페이퍼', machineNo:'', basisWeight:400, paperWidth:640, orderQtyKg:2.2, orderQtyTon:2.2, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3I11400-06400940A', desc:'IVory 400GSM 0640*0940 Ream (3)', prodType:'Ream', unitPrice:1128.0, currency:'KRW', plant:'P100' },
  { orderId:40, sapOrderNo:'50137346', sapItemNo:'000010', orderType:'내수', customerCode:'101202', customerName:'주식회사 디와이페이퍼', machineNo:'', basisWeight:300, paperWidth:640, orderQtyKg:7.0, orderQtyTon:7.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F2S11300-06400940A', desc:'SC Manila 300GSM 0640*0940 Ream (2)', prodType:'Ream', unitPrice:945.0, currency:'KRW', plant:'P100' },
  { orderId:41, sapOrderNo:'50137344', sapItemNo:'000010', orderType:'내수', customerCode:'100142', customerName:'(주)흥아지업', machineNo:'', basisWeight:400, paperWidth:750, orderQtyKg:45.0, orderQtyTon:45.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-17', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3S11400-07500450B', desc:'SC Manila 400GSM 0750*0450 Bulk (3)', prodType:'Bulk', unitPrice:925.0, currency:'KRW', plant:'P100' },
  { orderId:42, sapOrderNo:'50137343', sapItemNo:'000010', orderType:'내수', customerCode:'100729', customerName:'나이스페이퍼(유)', machineNo:'', basisWeight:400, paperWidth:785, orderQtyKg:25.0, orderQtyTon:25.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-17', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:true, excludeReason:'거부사유:07', matCode:'F3S11400-07850555B', desc:'SC Manila 400GSM 0785*0555 Bulk (3)', prodType:'Bulk', unitPrice:925.0, currency:'KRW', plant:'P100' },
  { orderId:43, sapOrderNo:'50137342', sapItemNo:'000010', orderType:'내수', customerCode:'101152', customerName:'양지페이퍼(주)', machineNo:'', basisWeight:240, paperWidth:730, orderQtyKg:6.75, orderQtyTon:6.75, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F2S11240-07300720A', desc:'SC Manila 240GSM 0730*0720 Ream (2)', prodType:'Ream', unitPrice:944.0, currency:'KRW', plant:'P100' },
  { orderId:44, sapOrderNo:'50137341', sapItemNo:'000010', orderType:'내수', customerCode:'100729', customerName:'나이스페이퍼(유)', machineNo:'', basisWeight:400, paperWidth:785, orderQtyKg:5.0, orderQtyTon:5.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3S11400-07850555B', desc:'SC Manila 400GSM 0785*0555 Bulk (3)', prodType:'Bulk', unitPrice:791.0, currency:'KRW', plant:'P100' },
  { orderId:45, sapOrderNo:'50137339', sapItemNo:'000010', orderType:'내수', customerCode:'101190', customerName:'주식회사 에스페랑스', machineNo:'', basisWeight:295, paperWidth:889, orderQtyKg:10.0, orderQtyTon:10.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:true, excludeReason:'거부사유:Z1', matCode:'S0RP1295-08891194A', desc:'RIV(상) F1 295GSM 0889*1194 Ream', prodType:'Ream', unitPrice:1350.0, currency:'KRW', plant:'P100' },
  { orderId:46, sapOrderNo:'50137337', sapItemNo:'000010', orderType:'내수', customerCode:'101152', customerName:'양지페이퍼(주)', machineNo:'', basisWeight:450, paperWidth:788, orderQtyKg:1.2, orderQtyTon:1.2, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3I11450-07881091A', desc:'IVory 450GSM 0788*1091 Ream (3)', prodType:'Ream', unitPrice:1188.0, currency:'KRW', plant:'P100' },
  { orderId:47, sapOrderNo:'50137336', sapItemNo:'000010', orderType:'내수', customerCode:'100729', customerName:'나이스페이퍼(유)', machineNo:'', basisWeight:240, paperWidth:940, orderQtyKg:3.0, orderQtyTon:3.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-20', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:true, excludeReason:'거부사유:06', matCode:'F2S11240-09400640A', desc:'SC Manila 240GSM 0940*0640 Ream (2)', prodType:'Ream', unitPrice:1002.0, currency:'KRW', plant:'P100' },
  { orderId:48, sapOrderNo:'50137335', sapItemNo:'000010', orderType:'내수', customerCode:'101152', customerName:'양지페이퍼(주)', machineNo:'', basisWeight:350, paperWidth:520, orderQtyKg:8.2, orderQtyTon:8.2, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3I11350-05200670A', desc:'IVory 350GSM 0520*0670 Ream (3)', prodType:'Ream', unitPrice:1211.0, currency:'KRW', plant:'P100' },
  { orderId:49, sapOrderNo:'50137334', sapItemNo:'000010', orderType:'내수', customerCode:'101190', customerName:'주식회사 에스페랑스', machineNo:'', basisWeight:325, paperWidth:787, orderQtyKg:3.2, orderQtyTon:3.2, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'S0RP1325-07871092A', desc:'RIV(상) F1 325GSM 0787*1092 Ream', prodType:'Ream', unitPrice:1350.0, currency:'KRW', plant:'P100' },
  { orderId:50, sapOrderNo:'50137334', sapItemNo:'000020', orderType:'내수', customerCode:'101190', customerName:'주식회사 에스페랑스', machineNo:'', basisWeight:325, paperWidth:1092, orderQtyKg:5.0, orderQtyTon:5.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'S0RP1325-10920787A', desc:'RIV(상) F1 325GSM 1092*0787 Ream', prodType:'Ream', unitPrice:1350.0, currency:'KRW', plant:'P100' },
  { orderId:51, sapOrderNo:'50137333', sapItemNo:'000010', orderType:'내수', customerCode:'101190', customerName:'주식회사 에스페랑스', machineNo:'', basisWeight:240, paperWidth:980, orderQtyKg:0.25, orderQtyTon:0.25, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-12', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F2S11240-09800760A', desc:'SC Manila 240GSM 0980*0760 Ream (2)', prodType:'Ream', unitPrice:984.0, currency:'KRW', plant:'P100' },
  { orderId:52, sapOrderNo:'50137332', sapItemNo:'000010', orderType:'내수', customerCode:'101152', customerName:'양지페이퍼(주)', machineNo:'', basisWeight:400, paperWidth:545, orderQtyKg:21.2, orderQtyTon:21.2, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3I11400-05450788A', desc:'IVory 400GSM 0545*0788 Ream (3)', prodType:'Ream', unitPrice:1198.0, currency:'KRW', plant:'P100' },
  { orderId:53, sapOrderNo:'50137331', sapItemNo:'000010', orderType:'내수', customerCode:'101190', customerName:'주식회사 에스페랑스', machineNo:'', basisWeight:400, paperWidth:1194, orderQtyKg:1672.0, orderQtyTon:1.672, orderQtyR:null, orderQtySok:null, unit:'KG', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'H3S11400-11940000', desc:'SC Manila 400GSM 1194*0000 Roll (3)', prodType:'Roll', unitPrice:737.0, currency:'KRW', plant:'P100' },
  { orderId:54, sapOrderNo:'50137329', sapItemNo:'000010', orderType:'내수', customerCode:'101190', customerName:'주식회사 에스페랑스', machineNo:'', basisWeight:400, paperWidth:1100, orderQtyKg:1540.0, orderQtyTon:1.54, orderQtyR:null, orderQtySok:null, unit:'KG', dueDate:'2026-06-10', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'H3S11400-11000000', desc:'SC Manila 400GSM 1100*0000 Roll (3)', prodType:'Roll', unitPrice:737.0, currency:'KRW', plant:'P100' },
  { orderId:55, sapOrderNo:'50137327', sapItemNo:'000010', orderType:'내수', customerCode:'101190', customerName:'주식회사 에스페랑스', machineNo:'', basisWeight:400, paperWidth:900, orderQtyKg:6300.0, orderQtyTon:6.3, orderQtyR:null, orderQtySok:null, unit:'KG', dueDate:'2026-06-20', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:true, excludeReason:'거부사유:07', matCode:'H3S11400-09000000', desc:'SC Manila 400GSM 0900*0000 Roll (3)', prodType:'Roll', unitPrice:737.0, currency:'KRW', plant:'P100' },
  { orderId:56, sapOrderNo:'50137326', sapItemNo:'000010', orderType:'내수', customerCode:'101190', customerName:'주식회사 에스페랑스', machineNo:'', basisWeight:400, paperWidth:900, orderQtyKg:7560.0, orderQtyTon:7.56, orderQtyR:null, orderQtySok:null, unit:'KG', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'H3S11400-09000000', desc:'SC Manila 400GSM 0900*0000 Roll (3)', prodType:'Roll', unitPrice:737.0, currency:'KRW', plant:'P100' },
  { orderId:57, sapOrderNo:'50137323', sapItemNo:'000010', orderType:'내수', customerCode:'101190', customerName:'주식회사 에스페랑스', machineNo:'', basisWeight:240, paperWidth:640, orderQtyKg:2.5, orderQtyTon:2.5, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-12', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F2S11240-06400940A', desc:'SC Manila 240GSM 0640*0940 Ream (2)', prodType:'Ream', unitPrice:973.0, currency:'KRW', plant:'P100' },
  { orderId:58, sapOrderNo:'50137323', sapItemNo:'000020', orderType:'내수', customerCode:'101190', customerName:'주식회사 에스페랑스', machineNo:'', basisWeight:240, paperWidth:985, orderQtyKg:4.25, orderQtyTon:4.25, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-12', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3S11240-09850720A', desc:'SC Manila 240GSM 0985*0720 Ream (3)', prodType:'Ream', unitPrice:974.0, currency:'KRW', plant:'P100' },
  { orderId:59, sapOrderNo:'50137323', sapItemNo:'000030', orderType:'내수', customerCode:'101190', customerName:'주식회사 에스페랑스', machineNo:'', basisWeight:240, paperWidth:645, orderQtyKg:0.75, orderQtyTon:0.75, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-12', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F2S11240-06450840A', desc:'SC Manila 240GSM 0645*0840 Ream (2)', prodType:'Ream', unitPrice:968.0, currency:'KRW', plant:'P100' },
  { orderId:60, sapOrderNo:'50137319', sapItemNo:'000010', orderType:'내수', customerCode:'101190', customerName:'주식회사 에스페랑스', machineNo:'', basisWeight:350, paperWidth:1091, orderQtyKg:1.6, orderQtyTon:1.6, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3S11350-10910788A', desc:'SC Manila 350GSM 1091*0788 Ream (3)', prodType:'Ream', unitPrice:910.0, currency:'KRW', plant:'P100' },
  { orderId:61, sapOrderNo:'50137318', sapItemNo:'000010', orderType:'내수', customerCode:'101152', customerName:'양지페이퍼(주)', machineNo:'', basisWeight:400, paperWidth:889, orderQtyKg:1245.0, orderQtyTon:1.245, orderQtyR:null, orderQtySok:null, unit:'KG', dueDate:'2026-06-10', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'H3S11400-08890000', desc:'SC Manila 400GSM 0889*0000 Roll (3)', prodType:'Roll', unitPrice:726.0, currency:'KRW', plant:'P100' },
  { orderId:62, sapOrderNo:'50137318', sapItemNo:'000011', orderType:'내수', customerCode:'101152', customerName:'양지페이퍼(주)', machineNo:'', basisWeight:400, paperWidth:840, orderQtyKg:0.0, orderQtyTon:0.0, orderQtyR:null, orderQtySok:null, unit:'KG', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:true, excludeReason:'거부사유:99', matCode:'H3S11400-08400000', desc:'SC Manila 400GSM 0840*0000 Roll (3)', prodType:'Roll', unitPrice:764.0, currency:'KRW', plant:'P100' },
  { orderId:63, sapOrderNo:'50137316', sapItemNo:'000010', orderType:'내수', customerCode:'101152', customerName:'양지페이퍼(주)', machineNo:'', basisWeight:400, paperWidth:889, orderQtyKg:0.0, orderQtyTon:0.0, orderQtyR:null, orderQtySok:null, unit:'KG', dueDate:'2026-06-10', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:true, excludeReason:'거부사유:07', matCode:'H3S11400-08890000', desc:'SC Manila 400GSM 0889*0000 Roll (3)', prodType:'Roll', unitPrice:764.0, currency:'KRW', plant:'P100' },
  { orderId:64, sapOrderNo:'50137313', sapItemNo:'000010', orderType:'내수', customerCode:'101152', customerName:'양지페이퍼(주)', machineNo:'', basisWeight:400, paperWidth:889, orderQtyKg:1245.0, orderQtyTon:1.245, orderQtyR:null, orderQtySok:null, unit:'KG', dueDate:'2026-06-10', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:true, excludeReason:'거부사유:07', matCode:'H3S11400-08890000', desc:'SC Manila 400GSM 0889*0000 Roll (3)', prodType:'Roll', unitPrice:764.0, currency:'KRW', plant:'P100' },
  { orderId:65, sapOrderNo:'50137311', sapItemNo:'000010', orderType:'내수', customerCode:'101190', customerName:'주식회사 에스페랑스', machineNo:'', basisWeight:300, paperWidth:889, orderQtyKg:2.5, orderQtyTon:2.5, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3S11300-08891194A', desc:'SC Manila 300GSM 0889*1194 Ream (3)', prodType:'Ream', unitPrice:916.0, currency:'KRW', plant:'P100' },
  { orderId:66, sapOrderNo:'50137309', sapItemNo:'000010', orderType:'내수', customerCode:'101202', customerName:'주식회사 디와이페이퍼', machineNo:'', basisWeight:350, paperWidth:545, orderQtyKg:763.0, orderQtyTon:0.763, orderQtyR:null, orderQtySok:null, unit:'KG', dueDate:'2026-06-10', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'H3S11350-05450000', desc:'SC Manila 350GSM 0545*0000 Roll (3)', prodType:'Roll', unitPrice:775.0, currency:'KRW', plant:'P100' },
  { orderId:67, sapOrderNo:'50137308', sapItemNo:'000010', orderType:'내수', customerCode:'101202', customerName:'주식회사 디와이페이퍼', machineNo:'', basisWeight:400, paperWidth:710, orderQtyKg:5.0, orderQtyTon:5.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F2KS1400-07100845B', desc:'S-Kraft (FSC) 400GSM 0710*0845 Bulk (2)', prodType:'Bulk', unitPrice:913.0, currency:'KRW', plant:'P100' },
  { orderId:68, sapOrderNo:'50137249', sapItemNo:'000010', orderType:'내수', customerCode:'101190', customerName:'주식회사 에스페랑스', machineNo:'', basisWeight:300, paperWidth:470, orderQtyKg:3.75, orderQtyTon:3.75, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F2S11300-04700600A', desc:'SC Manila 300GSM 0470*0600 Ream (2)', prodType:'Ream', unitPrice:914.0, currency:'KRW', plant:'P100' },
  { orderId:69, sapOrderNo:'50137248', sapItemNo:'000010', orderType:'내수', customerCode:'101152', customerName:'양지페이퍼(주)', machineNo:'', basisWeight:350, paperWidth:640, orderQtyKg:4.4, orderQtyTon:4.4, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:true, excludeReason:'거부사유:07', matCode:'F3S11350-06400940A', desc:'SC Manila 350GSM 0640*0940 Ream (3)', prodType:'Ream', unitPrice:938.0, currency:'KRW', plant:'P100' },
  { orderId:70, sapOrderNo:'50137245', sapItemNo:'000010', orderType:'내수', customerCode:'101202', customerName:'주식회사 디와이페이퍼', machineNo:'', basisWeight:400, paperWidth:890, orderQtyKg:5.6, orderQtyTon:5.6, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3I11400-08900640A', desc:'IVory 400GSM 0890*0640 Ream (3)', prodType:'Ream', unitPrice:1199.0, currency:'KRW', plant:'P100' },
  { orderId:71, sapOrderNo:'50137242', sapItemNo:'000010', orderType:'내수', customerCode:'101190', customerName:'주식회사 에스페랑스', machineNo:'', basisWeight:280, paperWidth:788, orderQtyKg:1.75, orderQtyTon:1.75, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-12', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3SM1280-07881091A', desc:'KSC (FSC) 280GSM 0788*1091 Ream (3)', prodType:'Ream', unitPrice:930.0, currency:'KRW', plant:'P400' },
  { orderId:72, sapOrderNo:'50137241', sapItemNo:'000010', orderType:'내수', customerCode:'101201', customerName:'주식회사 페이퍼칸', machineNo:'', basisWeight:350, paperWidth:940, orderQtyKg:8.6, orderQtyTon:8.6, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3I11350-09400640A', desc:'IVory 350GSM 0940*0640 Ream (3)', prodType:'Ream', unitPrice:1140.0, currency:'KRW', plant:'P100' },
  { orderId:73, sapOrderNo:'50137240', sapItemNo:'000010', orderType:'내수', customerCode:'101190', customerName:'주식회사 에스페랑스', machineNo:'', basisWeight:240, paperWidth:645, orderQtyKg:1.5, orderQtyTon:1.5, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-12', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F2S11240-06450840A', desc:'SC Manila 240GSM 0645*0840 Ream (2)', prodType:'Ream', unitPrice:968.0, currency:'KRW', plant:'P100' },
  { orderId:74, sapOrderNo:'50137231', sapItemNo:'000010', orderType:'내수', customerCode:'101202', customerName:'주식회사 디와이페이퍼', machineNo:'', basisWeight:270, paperWidth:940, orderQtyKg:0.4, orderQtyTon:0.4, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-20', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:true, excludeReason:'거부사유:07', matCode:'S0RP1270-09400640A', desc:'RIV(상) F1 270GSM 0940*0640 Ream', prodType:'Ream', unitPrice:1367.0, currency:'KRW', plant:'P100' },
  { orderId:75, sapOrderNo:'50137230', sapItemNo:'000010', orderType:'내수', customerCode:'101202', customerName:'주식회사 디와이페이퍼', machineNo:'', basisWeight:400, paperWidth:788, orderQtyKg:5.0, orderQtyTon:5.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3I11400-07881091A', desc:'IVory 400GSM 0788*1091 Ream (3)', prodType:'Ream', unitPrice:1198.0, currency:'KRW', plant:'P100' },
  { orderId:76, sapOrderNo:'50137229', sapItemNo:'000010', orderType:'내수', customerCode:'101202', customerName:'주식회사 디와이페이퍼', machineNo:'', basisWeight:300, paperWidth:940, orderQtyKg:7.0, orderQtyTon:7.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3I11300-09400640A', desc:'IVory 300GSM 0940*0640 Ream (3)', prodType:'Ream', unitPrice:1222.0, currency:'KRW', plant:'P100' },
  { orderId:77, sapOrderNo:'50137228', sapItemNo:'000010', orderType:'내수', customerCode:'101202', customerName:'주식회사 디와이페이퍼', machineNo:'', basisWeight:295, paperWidth:889, orderQtyKg:0.6, orderQtyTon:0.6, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-20', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'S0RP1295-08891194A', desc:'RIV(상) F1 295GSM 0889*1194 Ream', prodType:'Ream', unitPrice:1353.0, currency:'KRW', plant:'P100' },
  { orderId:78, sapOrderNo:'50137225', sapItemNo:'000010', orderType:'내수', customerCode:'100729', customerName:'나이스페이퍼(유)', machineNo:'', basisWeight:400, paperWidth:810, orderQtyKg:15.0, orderQtyTon:15.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-10', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3S11400-08100640B', desc:'SC Manila 400GSM 0810*0640 Bulk (3)', prodType:'Bulk', unitPrice:764.0, currency:'KRW', plant:'P100' },
  { orderId:79, sapOrderNo:'50137224', sapItemNo:'000010', orderType:'내수', customerCode:'100729', customerName:'나이스페이퍼(유)', machineNo:'', basisWeight:400, paperWidth:810, orderQtyKg:25.0, orderQtyTon:25.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3S11400-08100640B', desc:'SC Manila 400GSM 0810*0640 Bulk (3)', prodType:'Bulk', unitPrice:925.0, currency:'KRW', plant:'P100' },
  { orderId:80, sapOrderNo:'50137223', sapItemNo:'000010', orderType:'내수', customerCode:'101152', customerName:'양지페이퍼(주)', machineNo:'', basisWeight:295, paperWidth:1092, orderQtyKg:0.2, orderQtyTon:0.2, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'S0RP1295-10920787A', desc:'RIV(상) F1 295GSM 1092*0787 Ream', prodType:'Ream', unitPrice:1270.0, currency:'KRW', plant:'P100' },
  { orderId:81, sapOrderNo:'50137220', sapItemNo:'000010', orderType:'내수', customerCode:'101190', customerName:'주식회사 에스페랑스', machineNo:'', basisWeight:300, paperWidth:620, orderQtyKg:2.25, orderQtyTon:2.25, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F2S11300-06200800A', desc:'SC Manila 300GSM 0620*0800 Ream (2)', prodType:'Ream', unitPrice:914.0, currency:'KRW', plant:'P100' },
  { orderId:82, sapOrderNo:'50137219', sapItemNo:'000010', orderType:'내수', customerCode:'100729', customerName:'나이스페이퍼(유)', machineNo:'', basisWeight:350, paperWidth:535, orderQtyKg:6.0, orderQtyTon:6.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-10', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3S11350-05350730B', desc:'SC Manila 350GSM 0535*0730 Bulk (3)', prodType:'Bulk', unitPrice:775.0, currency:'KRW', plant:'P100' },
  { orderId:83, sapOrderNo:'50137219', sapItemNo:'000020', orderType:'내수', customerCode:'100729', customerName:'나이스페이퍼(유)', machineNo:'', basisWeight:350, paperWidth:570, orderQtyKg:6.0, orderQtyTon:6.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-10', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3S11350-05700795B', desc:'SC Manila 350GSM 0570*0795 Bulk (3)', prodType:'Bulk', unitPrice:938.0, currency:'KRW', plant:'P100' },
  { orderId:84, sapOrderNo:'50137175', sapItemNo:'000010', orderType:'내수', customerCode:'103054', customerName:'덕수산업(주)', machineNo:'', basisWeight:450, paperWidth:895, orderQtyKg:0.0, orderQtyTon:0.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-12', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:true, excludeReason:'거부사유:06', matCode:'F3S11450-08950610B', desc:'SC Manila 450GSM 0895*0610 Bulk (3)', prodType:'Bulk', unitPrice:882.0, currency:'KRW', plant:'P400' },
  { orderId:85, sapOrderNo:'50137174', sapItemNo:'000010', orderType:'내수', customerCode:'100729', customerName:'나이스페이퍼(유)', machineNo:'', basisWeight:240, paperWidth:640, orderQtyKg:18.0, orderQtyTon:18.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F2S11240-06400940A', desc:'SC Manila 240GSM 0640*0940 Ream (2)', prodType:'Ream', unitPrice:1002.0, currency:'KRW', plant:'P100' },
  { orderId:86, sapOrderNo:'50137173', sapItemNo:'000010', orderType:'내수', customerCode:'101202', customerName:'주식회사 디와이페이퍼', machineNo:'', basisWeight:400, paperWidth:885, orderQtyKg:5.0, orderQtyTon:5.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-13', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3S11400-08850615B', desc:'SC Manila 400GSM 0885*0615 Bulk (3)', prodType:'Bulk', unitPrice:925.0, currency:'KRW', plant:'P100' },
  { orderId:87, sapOrderNo:'50137172', sapItemNo:'000010', orderType:'내수', customerCode:'101202', customerName:'주식회사 디와이페이퍼', machineNo:'', basisWeight:400, paperWidth:865, orderQtyKg:0.8, orderQtyTon:0.8, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-13', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3S11400-08650610A', desc:'SC Manila 400GSM 0865*0610 Ream (3)', prodType:'Ream', unitPrice:922.0, currency:'KRW', plant:'P100' },
  { orderId:88, sapOrderNo:'50137170', sapItemNo:'000010', orderType:'내수', customerCode:'100729', customerName:'나이스페이퍼(유)', machineNo:'', basisWeight:350, paperWidth:500, orderQtyKg:3.4, orderQtyTon:3.4, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-10', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3S11350-05000660A', desc:'SC Manila 350GSM 0500*0660 Ream (3)', prodType:'Ream', unitPrice:803.0, currency:'KRW', plant:'P100' },
  { orderId:89, sapOrderNo:'50137169', sapItemNo:'000010', orderType:'내수', customerCode:'101202', customerName:'주식회사 디와이페이퍼', machineNo:'', basisWeight:400, paperWidth:845, orderQtyKg:2.4, orderQtyTon:2.4, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3S11400-08450640A', desc:'SC Manila 400GSM 0845*0640 Ream (3)', prodType:'Ream', unitPrice:925.0, currency:'KRW', plant:'P100' },
  { orderId:90, sapOrderNo:'50137168', sapItemNo:'000010', orderType:'내수', customerCode:'100729', customerName:'나이스페이퍼(유)', machineNo:'', basisWeight:350, paperWidth:980, orderQtyKg:45.6, orderQtyTon:45.6, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-17', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:true, excludeReason:'거부사유:07', matCode:'F3S71350-09800545B', desc:'FSC SC 350GSM 0980*0545 Bulk (3)', prodType:'Bulk', unitPrice:938.0, currency:'KRW', plant:'P100' },
  { orderId:91, sapOrderNo:'50137167', sapItemNo:'000010', orderType:'내수', customerCode:'100729', customerName:'나이스페이퍼(유)', machineNo:'', basisWeight:350, paperWidth:595, orderQtyKg:6.0, orderQtyTon:6.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3S11350-05950965B', desc:'SC Manila 350GSM 0595*0965 Bulk (3)', prodType:'Bulk', unitPrice:802.0, currency:'KRW', plant:'P100' },
  { orderId:92, sapOrderNo:'50137167', sapItemNo:'000020', orderType:'내수', customerCode:'100729', customerName:'나이스페이퍼(유)', machineNo:'', basisWeight:350, paperWidth:980, orderQtyKg:12.0, orderQtyTon:12.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3S71350-09800545B', desc:'FSC SC 350GSM 0980*0545 Bulk (3)', prodType:'Bulk', unitPrice:938.0, currency:'KRW', plant:'P100' },
  { orderId:93, sapOrderNo:'50137166', sapItemNo:'000010', orderType:'내수', customerCode:'101152', customerName:'양지페이퍼(주)', machineNo:'', basisWeight:400, paperWidth:900, orderQtyKg:1260.0, orderQtyTon:1.26, orderQtyR:null, orderQtySok:null, unit:'KG', dueDate:'2026-06-20', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'H3S11400-09000000', desc:'SC Manila 400GSM 0900*0000 Roll (3)', prodType:'Roll', unitPrice:764.0, currency:'KRW', plant:'P100' },
  { orderId:94, sapOrderNo:'50137164', sapItemNo:'000010', orderType:'내수', customerCode:'101190', customerName:'주식회사 에스페랑스', machineNo:'', basisWeight:300, paperWidth:545, orderQtyKg:654.0, orderQtyTon:0.654, orderQtyR:null, orderQtySok:null, unit:'KG', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'H2S11300-05450000', desc:'SC Manila 300GSM 0545*0000 Roll (2)', prodType:'Roll', unitPrice:753.0, currency:'KRW', plant:'P100' },
  { orderId:95, sapOrderNo:'50137160', sapItemNo:'000010', orderType:'내수', customerCode:'101201', customerName:'주식회사 페이퍼칸', machineNo:'', basisWeight:350, paperWidth:940, orderQtyKg:18.0, orderQtyTon:18.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3S11350-09400640A', desc:'SC Manila 350GSM 0940*0640 Ream (3)', prodType:'Ream', unitPrice:938.0, currency:'KRW', plant:'P100' },
  { orderId:96, sapOrderNo:'50137159', sapItemNo:'000010', orderType:'내수', customerCode:'101201', customerName:'주식회사 페이퍼칸', machineNo:'', basisWeight:350, paperWidth:640, orderQtyKg:12.0, orderQtyTon:12.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-16', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3S11350-06400940A', desc:'SC Manila 350GSM 0640*0940 Ream (3)', prodType:'Ream', unitPrice:938.0, currency:'KRW', plant:'P100' },
  { orderId:97, sapOrderNo:'50137157', sapItemNo:'000010', orderType:'내수', customerCode:'101186', customerName:'롯데웰푸드(주)', machineNo:'', basisWeight:280, paperWidth:650, orderQtyKg:110.75, orderQtyTon:110.75, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-15', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3SM1280-06500950B', desc:'KSC (FSC) 280GSM 0650*0950 Bulk (3)', prodType:'Bulk', unitPrice:835.0, currency:'KRW', plant:'P400' },
  { orderId:98, sapOrderNo:'50137157', sapItemNo:'000010', orderType:'내수', customerCode:'101186', customerName:'롯데웰푸드(주)', machineNo:'', basisWeight:280, paperWidth:650, orderQtyKg:0.0, orderQtyTon:0.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-10', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3SM1280-06500950B', desc:'KSC (FSC) 280GSM 0650*0950 Bulk (3)', prodType:'Bulk', unitPrice:835.0, currency:'KRW', plant:'P400' },
  { orderId:99, sapOrderNo:'50137157', sapItemNo:'000020', orderType:'내수', customerCode:'101186', customerName:'롯데웰푸드(주)', machineNo:'', basisWeight:280, paperWidth:650, orderQtyKg:8.25, orderQtyTon:8.25, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-15', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3SM1280-06500950B', desc:'KSC (FSC) 280GSM 0650*0950 Bulk (3)', prodType:'Bulk', unitPrice:834.0, currency:'KRW', plant:'P400' },
  { orderId:100, sapOrderNo:'50137157', sapItemNo:'000030', orderType:'내수', customerCode:'101186', customerName:'롯데웰푸드(주)', machineNo:'', basisWeight:280, paperWidth:860, orderQtyKg:7.0, orderQtyTon:7.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-15', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3SM1280-08600725B', desc:'KSC (FSC) 280GSM 0860*0725 Bulk (3)', prodType:'Bulk', unitPrice:835.0, currency:'KRW', plant:'P400' },
  { orderId:101, sapOrderNo:'50137156', sapItemNo:'000010', orderType:'내수', customerCode:'101190', customerName:'주식회사 에스페랑스', machineNo:'', basisWeight:450, paperWidth:1190, orderQtyKg:1553.0, orderQtyTon:1.553, orderQtyR:null, orderQtySok:null, unit:'KG', dueDate:'2026-06-10', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'H3I11450-11900000', desc:'IVory 450GSM 1190*0000 Roll (3)', prodType:'Roll', unitPrice:948.0, currency:'KRW', plant:'P100' },
  { orderId:102, sapOrderNo:'50137153', sapItemNo:'000010', orderType:'내수', customerCode:'101202', customerName:'주식회사 디와이페이퍼', machineNo:'', basisWeight:400, paperWidth:865, orderQtyKg:15.0, orderQtyTon:15.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3S11400-08650610B', desc:'SC Manila 400GSM 0865*0610 Bulk (3)', prodType:'Bulk', unitPrice:925.0, currency:'KRW', plant:'P100' },
  { orderId:103, sapOrderNo:'50137153', sapItemNo:'000020', orderType:'내수', customerCode:'101202', customerName:'주식회사 디와이페이퍼', machineNo:'', basisWeight:400, paperWidth:865, orderQtyKg:1.0, orderQtyTon:1.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3S11400-08650610A', desc:'SC Manila 400GSM 0865*0610 Ream (3)', prodType:'Ream', unitPrice:925.0, currency:'KRW', plant:'P100' },
  { orderId:104, sapOrderNo:'50137147', sapItemNo:'000010', orderType:'내수', customerCode:'101190', customerName:'주식회사 에스페랑스', machineNo:'', basisWeight:220, paperWidth:1900, orderQtyKg:16173.0, orderQtyTon:16.173, orderQtyR:null, orderQtySok:null, unit:'KG', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'H3AL1220-19000000', desc:'KSC (3인치)(FSC Recycled) 220GSM 1900*0000', prodType:'Other', unitPrice:768.0, currency:'KRW', plant:'P100' },
  { orderId:105, sapOrderNo:'50137147', sapItemNo:'000020', orderType:'내수', customerCode:'101190', customerName:'주식회사 에스페랑스', machineNo:'', basisWeight:220, paperWidth:2000, orderQtyKg:3784.0, orderQtyTon:3.784, orderQtyR:null, orderQtySok:null, unit:'KG', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'H3AL1220-20000000', desc:'KSC (3인치)(FSC Recycled) 220GSM 2000*0000', prodType:'Other', unitPrice:768.0, currency:'KRW', plant:'P100' },
  { orderId:106, sapOrderNo:'50137145', sapItemNo:'000010', orderType:'내수', customerCode:'100142', customerName:'(주)흥아지업', machineNo:'', basisWeight:300, paperWidth:750, orderQtyKg:20.75, orderQtyTon:20.75, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3I11300-07500570A', desc:'IVory 300GSM 0750*0570 Ream (3)', prodType:'Ream', unitPrice:1222.0, currency:'KRW', plant:'P100' },
  { orderId:107, sapOrderNo:'50137093', sapItemNo:'000010', orderType:'내수', customerCode:'100142', customerName:'(주)흥아지업', machineNo:'', basisWeight:450, paperWidth:788, orderQtyKg:1.8, orderQtyTon:1.8, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3S11450-07880545A', desc:'SC Manila 450GSM 0788*0545 Ream (3)', prodType:'Ream', unitPrice:909.0, currency:'KRW', plant:'P100' },
  { orderId:108, sapOrderNo:'50137092', sapItemNo:'000010', orderType:'내수', customerCode:'100231', customerName:'현진제업(주)', machineNo:'', basisWeight:300, paperWidth:595, orderQtyKg:74.5, orderQtyTon:74.5, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-10', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3SN1300-05950760B', desc:'SC 라면외지 300GSM 0595*0760 Bulk (3)', prodType:'Bulk', unitPrice:894.0, currency:'KRW', plant:'P100' },
  { orderId:109, sapOrderNo:'50137091', sapItemNo:'000010', orderType:'내수', customerCode:'101201', customerName:'주식회사 페이퍼칸', machineNo:'', basisWeight:240, paperWidth:540, orderQtyKg:5.75, orderQtyTon:5.75, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F2S11240-05400900A', desc:'SC Manila 240GSM 0540*0900 Ream (2)', prodType:'Ream', unitPrice:1000.0, currency:'KRW', plant:'P100' },
  { orderId:110, sapOrderNo:'50137089', sapItemNo:'000010', orderType:'내수', customerCode:'100142', customerName:'(주)흥아지업', machineNo:'', basisWeight:300, paperWidth:788, orderQtyKg:2.25, orderQtyTon:2.25, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3I11300-07881091A', desc:'IVory 300GSM 0788*1091 Ream (3)', prodType:'Ream', unitPrice:1170.0, currency:'KRW', plant:'P100' },
  { orderId:111, sapOrderNo:'50137066', sapItemNo:'000010', orderType:'내수', customerCode:'100142', customerName:'(주)흥아지업', machineNo:'', basisWeight:400, paperWidth:889, orderQtyKg:5.8, orderQtyTon:5.8, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3I11400-08891194A', desc:'IVory 400GSM 0889*1194 Ream (3)', prodType:'Ream', unitPrice:1197.0, currency:'KRW', plant:'P100' },
  { orderId:112, sapOrderNo:'50137065', sapItemNo:'000010', orderType:'내수', customerCode:'100729', customerName:'나이스페이퍼(유)', machineNo:'', basisWeight:400, paperWidth:595, orderQtyKg:4.6, orderQtyTon:4.6, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-17', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:true, excludeReason:'거부사유:06', matCode:'F3I11400-05950790B', desc:'IVory 400GSM 0595*0790 Bulk (3)', prodType:'Bulk', unitPrice:1199.0, currency:'KRW', plant:'P100' },
  { orderId:113, sapOrderNo:'50137065', sapItemNo:'000020', orderType:'내수', customerCode:'100729', customerName:'나이스페이퍼(유)', machineNo:'', basisWeight:350, paperWidth:890, orderQtyKg:64.6, orderQtyTon:64.6, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-17', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:true, excludeReason:'거부사유:07', matCode:'F3S11350-08900680B', desc:'SC Manila 350GSM 0890*0680 Bulk (3)', prodType:'Bulk', unitPrice:938.0, currency:'KRW', plant:'P100' },
  { orderId:114, sapOrderNo:'50137065', sapItemNo:'000030', orderType:'내수', customerCode:'100729', customerName:'나이스페이퍼(유)', machineNo:'', basisWeight:350, paperWidth:890, orderQtyKg:0.6, orderQtyTon:0.6, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-17', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:true, excludeReason:'거부사유:07', matCode:'F3S11350-08900680A', desc:'SC Manila 350GSM 0890*0680 Ream (3)', prodType:'Ream', unitPrice:933.0, currency:'KRW', plant:'P100' },
  { orderId:115, sapOrderNo:'50137065', sapItemNo:'000040', orderType:'내수', customerCode:'100729', customerName:'나이스페이퍼(유)', machineNo:'', basisWeight:400, paperWidth:650, orderQtyKg:20.0, orderQtyTon:20.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-17', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:true, excludeReason:'거부사유:07', matCode:'F3S11400-06500900B', desc:'SC Manila 400GSM 0650*0900 Bulk (3)', prodType:'Bulk', unitPrice:925.0, currency:'KRW', plant:'P100' },
  { orderId:116, sapOrderNo:'50137064', sapItemNo:'000010', orderType:'내수', customerCode:'100142', customerName:'(주)흥아지업', machineNo:'', basisWeight:300, paperWidth:889, orderQtyKg:2.0, orderQtyTon:2.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3I11300-08891194A', desc:'IVory 300GSM 0889*1194 Ream (3)', prodType:'Ream', unitPrice:1222.0, currency:'KRW', plant:'P100' },
  { orderId:117, sapOrderNo:'50137062', sapItemNo:'000010', orderType:'내수', customerCode:'101081', customerName:'주식회사 우리페이퍼', machineNo:'', basisWeight:295, paperWidth:460, orderQtyKg:7.0, orderQtyTon:7.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'S0RP1295-04600770A', desc:'RIV(상) F1 295GSM 0460*0770 Ream', prodType:'Ream', unitPrice:1350.0, currency:'KRW', plant:'P100' },
  { orderId:118, sapOrderNo:'50137059', sapItemNo:'000010', orderType:'내수', customerCode:'100729', customerName:'나이스페이퍼(유)', machineNo:'', basisWeight:400, paperWidth:595, orderQtyKg:10.0, orderQtyTon:10.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-10', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3I11400-05950790B', desc:'IVory 400GSM 0595*0790 Bulk (3)', prodType:'Bulk', unitPrice:1198.0, currency:'KRW', plant:'P100' },
  { orderId:119, sapOrderNo:'50137059', sapItemNo:'000020', orderType:'내수', customerCode:'100729', customerName:'나이스페이퍼(유)', machineNo:'', basisWeight:400, paperWidth:595, orderQtyKg:0.2, orderQtyTon:0.2, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-10', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3I11400-05950790A', desc:'IVory 400GSM 0595*0790 Ream (3)', prodType:'Ream', unitPrice:1185.0, currency:'KRW', plant:'P100' },
  { orderId:120, sapOrderNo:'50137058', sapItemNo:'000010', orderType:'내수', customerCode:'100729', customerName:'나이스페이퍼(유)', machineNo:'', basisWeight:350, paperWidth:890, orderQtyKg:50.0, orderQtyTon:50.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3S11350-08900680B', desc:'SC Manila 350GSM 0890*0680 Bulk (3)', prodType:'Bulk', unitPrice:802.0, currency:'KRW', plant:'P100' },
  { orderId:121, sapOrderNo:'50137058', sapItemNo:'000020', orderType:'내수', customerCode:'100729', customerName:'나이스페이퍼(유)', machineNo:'', basisWeight:350, paperWidth:890, orderQtyKg:0.4, orderQtyTon:0.4, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3S11350-08900680A', desc:'SC Manila 350GSM 0890*0680 Ream (3)', prodType:'Ream', unitPrice:947.0, currency:'KRW', plant:'P100' },
  { orderId:122, sapOrderNo:'50137058', sapItemNo:'000030', orderType:'내수', customerCode:'100729', customerName:'나이스페이퍼(유)', machineNo:'', basisWeight:400, paperWidth:650, orderQtyKg:5.0, orderQtyTon:5.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3S11400-06500900B', desc:'SC Manila 400GSM 0650*0900 Bulk (3)', prodType:'Bulk', unitPrice:791.0, currency:'KRW', plant:'P100' },
  { orderId:123, sapOrderNo:'50137058', sapItemNo:'000040', orderType:'내수', customerCode:'100729', customerName:'나이스페이퍼(유)', machineNo:'', basisWeight:400, paperWidth:595, orderQtyKg:15.0, orderQtyTon:15.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3I11400-05950790B', desc:'IVory 400GSM 0595*0790 Bulk (3)', prodType:'Bulk', unitPrice:1024.0, currency:'KRW', plant:'P100' },
  { orderId:124, sapOrderNo:'50137058', sapItemNo:'000050', orderType:'내수', customerCode:'100729', customerName:'나이스페이퍼(유)', machineNo:'', basisWeight:400, paperWidth:595, orderQtyKg:0.2, orderQtyTon:0.2, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3I11400-05950790A', desc:'IVory 400GSM 0595*0790 Ream (3)', prodType:'Ream', unitPrice:1185.0, currency:'KRW', plant:'P100' },
  { orderId:125, sapOrderNo:'50137054', sapItemNo:'000010', orderType:'내수', customerCode:'101152', customerName:'양지페이퍼(주)', machineNo:'', basisWeight:400, paperWidth:640, orderQtyKg:0.2, orderQtyTon:0.2, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3I11400-06400940A', desc:'IVory 400GSM 0640*0940 Ream (3)', prodType:'Ream', unitPrice:1198.0, currency:'KRW', plant:'P100' },
  { orderId:126, sapOrderNo:'50137053', sapItemNo:'000010', orderType:'내수', customerCode:'100784', customerName:'(주)골든피앤피', machineNo:'', basisWeight:400, paperWidth:480, orderQtyKg:432.0, orderQtyTon:0.432, orderQtyR:null, orderQtySok:null, unit:'KG', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'H3IR1400-04800000', desc:'GS IVory 400GSM 0480*0000 Roll (3)', prodType:'Roll', unitPrice:990.0, currency:'KRW', plant:'P100' },
  { orderId:127, sapOrderNo:'50137050', sapItemNo:'000010', orderType:'내수', customerCode:'101152', customerName:'양지페이퍼(주)', machineNo:'', basisWeight:240, paperWidth:850, orderQtyKg:1163.0, orderQtyTon:1.163, orderQtyR:null, orderQtySok:null, unit:'KG', dueDate:'2026-06-10', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'H2S11240-08500000', desc:'SC Manila 240GSM 0850*0000 Roll (2)', prodType:'Roll', unitPrice:787.0, currency:'KRW', plant:'P100' },
  { orderId:128, sapOrderNo:'50137050', sapItemNo:'000011', orderType:'내수', customerCode:'101152', customerName:'양지페이퍼(주)', machineNo:'', basisWeight:240, paperWidth:800, orderQtyKg:0.0, orderQtyTon:0.0, orderQtyR:null, orderQtySok:null, unit:'KG', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:true, excludeReason:'거부사유:99', matCode:'H2S11240-08000000', desc:'SC Manila 240GSM 0800*0000 Roll (2)', prodType:'Roll', unitPrice:828.0, currency:'KRW', plant:'P100' },
  { orderId:129, sapOrderNo:'50137049', sapItemNo:'000010', orderType:'내수', customerCode:'100142', customerName:'(주)흥아지업', machineNo:'', basisWeight:240, paperWidth:520, orderQtyKg:2.5, orderQtyTon:2.5, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F2S11240-05201020A', desc:'SC Manila 240GSM 0520*1020 Ream (2)', prodType:'Ream', unitPrice:1002.0, currency:'KRW', plant:'P100' },
  { orderId:130, sapOrderNo:'50137047', sapItemNo:'000010', orderType:'내수', customerCode:'101190', customerName:'주식회사 에스페랑스', machineNo:'', basisWeight:450, paperWidth:585, orderQtyKg:763.0, orderQtyTon:0.763, orderQtyR:null, orderQtySok:null, unit:'KG', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'H3S11450-05850000', desc:'SC Manila 450GSM 0585*0000 Roll (3)', prodType:'Roll', unitPrice:726.0, currency:'KRW', plant:'P100' },
  { orderId:131, sapOrderNo:'50137045', sapItemNo:'000010', orderType:'내수', customerCode:'100142', customerName:'(주)흥아지업', machineNo:'', basisWeight:400, paperWidth:790, orderQtyKg:14.0, orderQtyTon:14.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-22', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:true, excludeReason:'거부사유:07', matCode:'F3I11400-07900615A', desc:'IVory 400GSM 0790*0615 Ream (3)', prodType:'Ream', unitPrice:1198.0, currency:'KRW', plant:'P100' },
  { orderId:132, sapOrderNo:'50137045', sapItemNo:'000010', orderType:'내수', customerCode:'100142', customerName:'(주)흥아지업', machineNo:'', basisWeight:400, paperWidth:790, orderQtyKg:0.0, orderQtyTon:0.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-18', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:true, excludeReason:'거부사유:07', matCode:'F3I11400-07900615A', desc:'IVory 400GSM 0790*0615 Ream (3)', prodType:'Ream', unitPrice:1198.0, currency:'KRW', plant:'P100' },
  { orderId:133, sapOrderNo:'50137044', sapItemNo:'000010', orderType:'내수', customerCode:'100142', customerName:'(주)흥아지업', machineNo:'', basisWeight:400, paperWidth:790, orderQtyKg:8.4, orderQtyTon:8.4, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3I11400-07900615A', desc:'IVory 400GSM 0790*0615 Ream (3)', prodType:'Ream', unitPrice:1198.0, currency:'KRW', plant:'P100' },
  { orderId:134, sapOrderNo:'50137043', sapItemNo:'000010', orderType:'내수', customerCode:'100142', customerName:'(주)흥아지업', machineNo:'', basisWeight:350, paperWidth:670, orderQtyKg:4.2, orderQtyTon:4.2, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3I11350-06700545A', desc:'IVory 350GSM 0670*0545 Ream (3)', prodType:'Ream', unitPrice:1209.0, currency:'KRW', plant:'P100' },
  { orderId:135, sapOrderNo:'50137025', sapItemNo:'000010', orderType:'내수', customerCode:'100729', customerName:'나이스페이퍼(유)', machineNo:'', basisWeight:400, paperWidth:785, orderQtyKg:30.0, orderQtyTon:30.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-17', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:true, excludeReason:'거부사유:07', matCode:'F3S11400-07850555B', desc:'SC Manila 400GSM 0785*0555 Bulk (3)', prodType:'Bulk', unitPrice:925.0, currency:'KRW', plant:'P100' },
  { orderId:136, sapOrderNo:'50137024', sapItemNo:'000010', orderType:'내수', customerCode:'101190', customerName:'주식회사 에스페랑스', machineNo:'', basisWeight:240, paperWidth:545, orderQtyKg:746.0, orderQtyTon:0.746, orderQtyR:null, orderQtySok:null, unit:'KG', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:true, excludeReason:'거부사유:07', matCode:'H2K11240-05450000', desc:'Kraft(무,단) 240GSM 0545*0000 Roll (2)', prodType:'Roll', unitPrice:879.0, currency:'KRW', plant:'P100' },
  { orderId:137, sapOrderNo:'50137023', sapItemNo:'000010', orderType:'내수', customerCode:'101190', customerName:'주식회사 에스페랑스', machineNo:'', basisWeight:300, paperWidth:1091, orderQtyKg:1473.0, orderQtyTon:1.473, orderQtyR:null, orderQtySok:null, unit:'KG', dueDate:'2026-06-12', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:true, excludeReason:'거부사유:07', matCode:'H3I11300-10910000', desc:'IVory 300GSM 1091*0000 Roll (3)', prodType:'Roll', unitPrice:974.0, currency:'KRW', plant:'P100' },
  { orderId:138, sapOrderNo:'50137022', sapItemNo:'000010', orderType:'내수', customerCode:'100729', customerName:'나이스페이퍼(유)', machineNo:'', basisWeight:400, paperWidth:785, orderQtyKg:10.0, orderQtyTon:10.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3S11400-07850555B', desc:'SC Manila 400GSM 0785*0555 Bulk (3)', prodType:'Bulk', unitPrice:791.0, currency:'KRW', plant:'P100' },
  { orderId:139, sapOrderNo:'50137021', sapItemNo:'000010', orderType:'내수', customerCode:'101190', customerName:'주식회사 에스페랑스', machineNo:'', basisWeight:300, paperWidth:485, orderQtyKg:47.5, orderQtyTon:47.5, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-12', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:true, excludeReason:'거부사유:07', matCode:'F3I11300-04850780A', desc:'IVory 300GSM 0485*0780 Ream (3)', prodType:'Ream', unitPrice:1186.0, currency:'KRW', plant:'P100' },
  { orderId:140, sapOrderNo:'50137017', sapItemNo:'000010', orderType:'내수', customerCode:'101027', customerName:'(주)신승아이엔씨', machineNo:'', basisWeight:400, paperWidth:1091, orderQtyKg:10.0, orderQtyTon:10.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3I11400-10910788A', desc:'IVory 400GSM 1091*0788 Ream (3)', prodType:'Ream', unitPrice:1233.0, currency:'KRW', plant:'P100' },
  { orderId:141, sapOrderNo:'50136925', sapItemNo:'000010', orderType:'내수', customerCode:'100231', customerName:'현진제업(주)', machineNo:'', basisWeight:280, paperWidth:650, orderQtyKg:35.0, orderQtyTon:35.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3SN1280-06500810B', desc:'SC 라면외지 280GSM 0650*0810 Bulk (3)', prodType:'Bulk', unitPrice:930.0, currency:'KRW', plant:'P100' },
  { orderId:142, sapOrderNo:'50136920', sapItemNo:'000010', orderType:'내수', customerCode:'101152', customerName:'양지페이퍼(주)', machineNo:'', basisWeight:350, paperWidth:788, orderQtyKg:2.2, orderQtyTon:2.2, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3I11350-07881091A', desc:'IVory 350GSM 0788*1091 Ream (3)', prodType:'Ream', unitPrice:1211.0, currency:'KRW', plant:'P100' },
  { orderId:143, sapOrderNo:'50136920', sapItemNo:'000020', orderType:'내수', customerCode:'101152', customerName:'양지페이퍼(주)', machineNo:'', basisWeight:400, paperWidth:640, orderQtyKg:2.0, orderQtyTon:2.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3I11400-06400940A', desc:'IVory 400GSM 0640*0940 Ream (3)', prodType:'Ream', unitPrice:1198.0, currency:'KRW', plant:'P100' },
  { orderId:144, sapOrderNo:'50136919', sapItemNo:'000010', orderType:'내수', customerCode:'101202', customerName:'주식회사 디와이페이퍼', machineNo:'', basisWeight:220, paperWidth:600, orderQtyKg:8.0, orderQtyTon:8.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-10', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F2A11220-06001105B', desc:'ACB 220GSM 0600*1105 Bulk (2)', prodType:'Bulk', unitPrice:920.0, currency:'KRW', plant:'P100' },
  { orderId:145, sapOrderNo:'50136918', sapItemNo:'000010', orderType:'내수', customerCode:'101202', customerName:'주식회사 디와이페이퍼', machineNo:'', basisWeight:0, paperWidth:900, orderQtyKg:5.0, orderQtyTon:5.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3S11350-09000630B', desc:'SC Manila 350 GSM 0900 * 0630 Bulk ( 3 )', prodType:'Bulk', unitPrice:938.0, currency:'KRW', plant:'P100' },
  { orderId:146, sapOrderNo:'50136915', sapItemNo:'000010', orderType:'내수', customerCode:'101201', customerName:'주식회사 페이퍼칸', machineNo:'', basisWeight:400, paperWidth:685, orderQtyKg:1.6, orderQtyTon:1.6, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F2KS1400-06850585A', desc:'S-Kraft (FSC) 400GSM 0685*0585 Ream (2)', prodType:'Ream', unitPrice:913.0, currency:'KRW', plant:'P100' },
  { orderId:147, sapOrderNo:'50136912', sapItemNo:'000010', orderType:'내수', customerCode:'101152', customerName:'양지페이퍼(주)', machineNo:'', basisWeight:240, paperWidth:889, orderQtyKg:1216.0, orderQtyTon:1.216, orderQtyR:null, orderQtySok:null, unit:'KG', dueDate:'2026-06-10', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'H2S11240-08890000', desc:'SC Manila 240GSM 0889*0000 Roll (2)', prodType:'Roll', unitPrice:787.0, currency:'KRW', plant:'P100' },
  { orderId:148, sapOrderNo:'50136912', sapItemNo:'000011', orderType:'내수', customerCode:'101152', customerName:'양지페이퍼(주)', machineNo:'', basisWeight:240, paperWidth:840, orderQtyKg:0.0, orderQtyTon:0.0, orderQtyR:null, orderQtySok:null, unit:'KG', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:true, excludeReason:'거부사유:99', matCode:'H2S11240-08400000', desc:'SC Manila 240GSM 0840*0000 Roll (2)', prodType:'Roll', unitPrice:828.0, currency:'KRW', plant:'P100' },
  { orderId:149, sapOrderNo:'50136910', sapItemNo:'000010', orderType:'내수', customerCode:'101190', customerName:'주식회사 에스페랑스', machineNo:'', basisWeight:270, paperWidth:889, orderQtyKg:1.2, orderQtyTon:1.2, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-12', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'S0RP1270-08891194A', desc:'RIV(상) F1 270GSM 0889*1194 Ream', prodType:'Ream', unitPrice:1347.0, currency:'KRW', plant:'P400' },
  { orderId:150, sapOrderNo:'50136910', sapItemNo:'000010', orderType:'내수', customerCode:'101190', customerName:'주식회사 에스페랑스', machineNo:'', basisWeight:270, paperWidth:889, orderQtyKg:0.0, orderQtyTon:0.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'S0RP1270-08891194A', desc:'RIV(상) F1 270GSM 0889*1194 Ream', prodType:'Ream', unitPrice:1347.0, currency:'KRW', plant:'P400' },
  { orderId:151, sapOrderNo:'50136908', sapItemNo:'000010', orderType:'내수', customerCode:'101201', customerName:'주식회사 페이퍼칸', machineNo:'', basisWeight:240, paperWidth:945, orderQtyKg:5.25, orderQtyTon:5.25, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F2S11240-09450950A', desc:'SC Manila 240GSM 0945*0950 Ream (2)', prodType:'Ream', unitPrice:973.0, currency:'KRW', plant:'P100' },
  { orderId:152, sapOrderNo:'50136905', sapItemNo:'000010', orderType:'내수', customerCode:'101152', customerName:'양지페이퍼(주)', machineNo:'', basisWeight:400, paperWidth:788, orderQtyKg:0.8, orderQtyTon:0.8, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-29', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3I11400-07881091A', desc:'IVory 400GSM 0788*1091 Ream (3)', prodType:'Ream', unitPrice:1194.0, currency:'KRW', plant:'P100' },
  { orderId:153, sapOrderNo:'50136905', sapItemNo:'000010', orderType:'내수', customerCode:'101152', customerName:'양지페이퍼(주)', machineNo:'', basisWeight:400, paperWidth:788, orderQtyKg:0.0, orderQtyTon:0.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-20', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3I11400-07881091A', desc:'IVory 400GSM 0788*1091 Ream (3)', prodType:'Ream', unitPrice:1194.0, currency:'KRW', plant:'P100' },
  { orderId:154, sapOrderNo:'50136905', sapItemNo:'000020', orderType:'내수', customerCode:'101152', customerName:'양지페이퍼(주)', machineNo:'', basisWeight:400, paperWidth:889, orderQtyKg:8.4, orderQtyTon:8.4, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-25', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3I11400-08891194A', desc:'IVory 400GSM 0889*1194 Ream (3)', prodType:'Ream', unitPrice:1198.0, currency:'KRW', plant:'P100' },
  { orderId:155, sapOrderNo:'50136905', sapItemNo:'000020', orderType:'내수', customerCode:'101152', customerName:'양지페이퍼(주)', machineNo:'', basisWeight:400, paperWidth:889, orderQtyKg:0.0, orderQtyTon:0.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-20', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3I11400-08891194A', desc:'IVory 400GSM 0889*1194 Ream (3)', prodType:'Ream', unitPrice:1198.0, currency:'KRW', plant:'P100' },
  { orderId:156, sapOrderNo:'50136818', sapItemNo:'000010', orderType:'내수', customerCode:'101152', customerName:'양지페이퍼(주)', machineNo:'', basisWeight:400, paperWidth:1091, orderQtyKg:5.0, orderQtyTon:5.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3I11400-10910788A', desc:'IVory 400GSM 1091*0788 Ream (3)', prodType:'Ream', unitPrice:1198.0, currency:'KRW', plant:'P100' },
  { orderId:157, sapOrderNo:'50136766', sapItemNo:'000010', orderType:'내수', customerCode:'100142', customerName:'(주)흥아지업', machineNo:'', basisWeight:295, paperWidth:787, orderQtyKg:10.6, orderQtyTon:10.6, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'S0RP1295-07871092A', desc:'RIV(상) F1 295GSM 0787*1092 Ream', prodType:'Ream', unitPrice:1200.0, currency:'KRW', plant:'P100' },
  { orderId:158, sapOrderNo:'50136765', sapItemNo:'000010', orderType:'내수', customerCode:'101152', customerName:'양지페이퍼(주)', machineNo:'', basisWeight:350, paperWidth:788, orderQtyKg:6.0, orderQtyTon:6.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3I11350-07881091A', desc:'IVory 350GSM 0788*1091 Ream (3)', prodType:'Ream', unitPrice:1210.0, currency:'KRW', plant:'P100' },
  { orderId:159, sapOrderNo:'50136762', sapItemNo:'000000', orderType:'내수', customerCode:'101152', customerName:'미상', machineNo:'', basisWeight:0, paperWidth:0, orderQtyKg:0.0, orderQtyTon:0.0, orderQtyR:null, orderQtySok:null, unit:'KG', dueDate:'', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'', desc:'', prodType:'Other', unitPrice:0, currency:'KRW', plant:'' },
  { orderId:160, sapOrderNo:'50136761', sapItemNo:'000010', orderType:'내수', customerCode:'101190', customerName:'주식회사 에스페랑스', machineNo:'', basisWeight:240, paperWidth:545, orderQtyKg:3.5, orderQtyTon:3.5, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-12', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3SM1240-05450788A', desc:'KSC (FSC) 240GSM 0545*0788 Ream (3)', prodType:'Ream', unitPrice:973.0, currency:'KRW', plant:'P100' },
  { orderId:161, sapOrderNo:'50136757', sapItemNo:'000010', orderType:'내수', customerCode:'101190', customerName:'주식회사 에스페랑스', machineNo:'', basisWeight:240, paperWidth:510, orderQtyKg:1.75, orderQtyTon:1.75, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-12', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3SM1240-05100740A', desc:'KSC (FSC) 240GSM 0510*0740 Ream (3)', prodType:'Ream', unitPrice:970.0, currency:'KRW', plant:'P100' },
  { orderId:162, sapOrderNo:'50136757', sapItemNo:'000020', orderType:'내수', customerCode:'101190', customerName:'주식회사 에스페랑스', machineNo:'', basisWeight:250, paperWidth:1092, orderQtyKg:1.8, orderQtyTon:1.8, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-12', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'S0RP1250-10920787A', desc:'RIV(상) F1 250GSM 1092*0787 Ream', prodType:'Ream', unitPrice:1347.0, currency:'KRW', plant:'P100' },
  { orderId:163, sapOrderNo:'50136738', sapItemNo:'000010', orderType:'내수', customerCode:'101201', customerName:'주식회사 페이퍼칸', machineNo:'', basisWeight:240, paperWidth:680, orderQtyKg:10.5, orderQtyTon:10.5, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F2S11240-06800790A', desc:'SC Manila 240GSM 0680*0790 Ream (2)', prodType:'Ream', unitPrice:973.0, currency:'KRW', plant:'P100' },
  { orderId:164, sapOrderNo:'50136738', sapItemNo:'000020', orderType:'내수', customerCode:'101201', customerName:'주식회사 페이퍼칸', machineNo:'', basisWeight:240, paperWidth:730, orderQtyKg:2.5, orderQtyTon:2.5, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F2S11240-07300680A', desc:'SC Manila 240GSM 0730*0680 Ream (2)', prodType:'Ream', unitPrice:1002.0, currency:'KRW', plant:'P100' },
  { orderId:165, sapOrderNo:'50136702', sapItemNo:'000010', orderType:'내수', customerCode:'101201', customerName:'주식회사 페이퍼칸', machineNo:'', basisWeight:400, paperWidth:965, orderQtyKg:4.4, orderQtyTon:4.4, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3S11400-09650665B', desc:'SC Manila 400GSM 0965*0665 Bulk (3)', prodType:'Bulk', unitPrice:925.0, currency:'KRW', plant:'P100' },
  { orderId:166, sapOrderNo:'50136698', sapItemNo:'000010', orderType:'내수', customerCode:'101027', customerName:'(주)신승아이엔씨', machineNo:'', basisWeight:400, paperWidth:890, orderQtyKg:5.6, orderQtyTon:5.6, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3I11400-08900865A', desc:'IVory 400GSM 0890*0865 Ream (3)', prodType:'Ream', unitPrice:1233.0, currency:'KRW', plant:'P100' },
  { orderId:167, sapOrderNo:'50136698', sapItemNo:'000020', orderType:'내수', customerCode:'101027', customerName:'(주)신승아이엔씨', machineNo:'', basisWeight:240, paperWidth:745, orderQtyKg:1.25, orderQtyTon:1.25, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F2S11240-07450850A', desc:'SC Manila 240GSM 0745*0850 Ream (2)', prodType:'Ream', unitPrice:1031.0, currency:'KRW', plant:'P100' },
  { orderId:168, sapOrderNo:'50136698', sapItemNo:'000030', orderType:'내수', customerCode:'101027', customerName:'(주)신승아이엔씨', machineNo:'', basisWeight:240, paperWidth:775, orderQtyKg:4.5, orderQtyTon:4.5, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F2S11240-07750940A', desc:'SC Manila 240GSM 0775*0940 Ream (2)', prodType:'Ream', unitPrice:1030.0, currency:'KRW', plant:'P100' },
  { orderId:169, sapOrderNo:'50136697', sapItemNo:'000010', orderType:'내수', customerCode:'101202', customerName:'주식회사 디와이페이퍼', machineNo:'', basisWeight:240, paperWidth:640, orderQtyKg:4.25, orderQtyTon:4.25, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F2K11240-06400940A', desc:'Kraft(무,단) 240GSM 0640*0940 Ream (2)', prodType:'Ream', unitPrice:991.0, currency:'KRW', plant:'P100' },
  { orderId:170, sapOrderNo:'50136694', sapItemNo:'000010', orderType:'내수', customerCode:'101190', customerName:'주식회사 에스페랑스', machineNo:'', basisWeight:300, paperWidth:640, orderQtyKg:768.0, orderQtyTon:0.768, orderQtyR:null, orderQtySok:null, unit:'KG', dueDate:'2026-06-20', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:true, excludeReason:'거부사유:07', matCode:'H2S11300-06400000', desc:'SC Manila 300GSM 0640*0000 Roll (2)', prodType:'Roll', unitPrice:753.0, currency:'KRW', plant:'P100' },
  { orderId:171, sapOrderNo:'50136693', sapItemNo:'000010', orderType:'내수', customerCode:'100142', customerName:'(주)흥아지업', machineNo:'', basisWeight:270, paperWidth:889, orderQtyKg:2.4, orderQtyTon:2.4, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'S0RP1270-08891194A', desc:'RIV(상) F1 270GSM 0889*1194 Ream', prodType:'Ream', unitPrice:1201.0, currency:'KRW', plant:'P100' },
  { orderId:172, sapOrderNo:'50136522', sapItemNo:'000010', orderType:'내수', customerCode:'101190', customerName:'주식회사 에스페랑스', machineNo:'', basisWeight:280, paperWidth:820, orderQtyKg:1102.0, orderQtyTon:1.102, orderQtyR:null, orderQtySok:null, unit:'KG', dueDate:'2026-06-10', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'H2S11280-08200000', desc:'SC Manila 280GSM 0820*0000 Roll (2)', prodType:'Roll', unitPrice:763.0, currency:'KRW', plant:'P100' },
  { orderId:173, sapOrderNo:'50136517', sapItemNo:'000010', orderType:'내수', customerCode:'100142', customerName:'(주)흥아지업', machineNo:'', basisWeight:400, paperWidth:790, orderQtyKg:5.0, orderQtyTon:5.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F2KS1400-07900590B', desc:'S-Kraft (FSC) 400GSM 0790*0590 Bulk (2)', prodType:'Bulk', unitPrice:996.0, currency:'KRW', plant:'P100' },
  { orderId:174, sapOrderNo:'50136504', sapItemNo:'000010', orderType:'내수', customerCode:'101202', customerName:'주식회사 디와이페이퍼', machineNo:'', basisWeight:450, paperWidth:675, orderQtyKg:13.2, orderQtyTon:13.2, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-10', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3S11450-06750670B', desc:'SC Manila 450GSM 0675*0670 Bulk (3)', prodType:'Bulk', unitPrice:911.0, currency:'KRW', plant:'P100' },
  { orderId:175, sapOrderNo:'50136503', sapItemNo:'000010', orderType:'내수', customerCode:'101202', customerName:'주식회사 디와이페이퍼', machineNo:'', basisWeight:450, paperWidth:675, orderQtyKg:8.8, orderQtyTon:8.8, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3S11450-06750670B', desc:'SC Manila 450GSM 0675*0670 Bulk (3)', prodType:'Bulk', unitPrice:910.0, currency:'KRW', plant:'P100' },
  { orderId:176, sapOrderNo:'50136491', sapItemNo:'000010', orderType:'내수', customerCode:'100729', customerName:'나이스페이퍼(유)', machineNo:'', basisWeight:350, paperWidth:1000, orderQtyKg:0.2, orderQtyTon:0.2, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-17', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:true, excludeReason:'거부사유:06', matCode:'F3S11350-10000560A', desc:'SC Manila 350GSM 1000*0560 Ream (3)', prodType:'Ream', unitPrice:920.0, currency:'KRW', plant:'P100' },
  { orderId:177, sapOrderNo:'50136491', sapItemNo:'000020', orderType:'내수', customerCode:'100729', customerName:'나이스페이퍼(유)', machineNo:'', basisWeight:350, paperWidth:788, orderQtyKg:0.4, orderQtyTon:0.4, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-17', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:true, excludeReason:'거부사유:06', matCode:'F3S11350-07881091A', desc:'SC Manila 350GSM 0788*1091 Ream (3)', prodType:'Ream', unitPrice:945.0, currency:'KRW', plant:'P100' },
  { orderId:178, sapOrderNo:'50136429', sapItemNo:'000010', orderType:'내수', customerCode:'101190', customerName:'주식회사 에스페랑스', machineNo:'', basisWeight:325, paperWidth:490, orderQtyKg:2.4, orderQtyTon:2.4, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'S0RP1325-04900595A', desc:'Blanq-Cream 325GSM 0490*0595 Ream', prodType:'Ream', unitPrice:1348.0, currency:'KRW', plant:'P400' },
  { orderId:179, sapOrderNo:'50136367', sapItemNo:'000010', orderType:'내수', customerCode:'101190', customerName:'주식회사 에스페랑스', machineNo:'', basisWeight:350, paperWidth:570, orderQtyKg:798.0, orderQtyTon:0.798, orderQtyR:null, orderQtySok:null, unit:'KG', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'H3S11350-05700000', desc:'SC Manila 350GSM 0570*0000 Roll (3)', prodType:'Roll', unitPrice:748.0, currency:'KRW', plant:'P100' },
  { orderId:180, sapOrderNo:'50136358', sapItemNo:'000010', orderType:'내수', customerCode:'101190', customerName:'주식회사 에스페랑스', machineNo:'', basisWeight:350, paperWidth:745, orderQtyKg:1043.0, orderQtyTon:1.043, orderQtyR:null, orderQtySok:null, unit:'KG', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'H3S11350-07450000', desc:'SC Manila 350GSM 0745*0000 Roll (3)', prodType:'Roll', unitPrice:748.0, currency:'KRW', plant:'P100' },
  { orderId:181, sapOrderNo:'50136358', sapItemNo:'000020', orderType:'내수', customerCode:'101190', customerName:'주식회사 에스페랑스', machineNo:'', basisWeight:350, paperWidth:740, orderQtyKg:1036.0, orderQtyTon:1.036, orderQtyR:null, orderQtySok:null, unit:'KG', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'H3S11350-07400000', desc:'SC Manila 350GSM 0740*0000 Roll (3)', prodType:'Roll', unitPrice:748.0, currency:'KRW', plant:'P100' },
  { orderId:182, sapOrderNo:'50136355', sapItemNo:'000010', orderType:'내수', customerCode:'101190', customerName:'주식회사 에스페랑스', machineNo:'', basisWeight:400, paperWidth:640, orderQtyKg:3.2, orderQtyTon:3.2, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3I11400-06400420B', desc:'IVory 400GSM 0640*0420 Bulk (3)', prodType:'Bulk', unitPrice:1058.0, currency:'KRW', plant:'P400' },
  { orderId:183, sapOrderNo:'50136355', sapItemNo:'000020', orderType:'내수', customerCode:'101190', customerName:'주식회사 에스페랑스', machineNo:'', basisWeight:400, paperWidth:788, orderQtyKg:1.2, orderQtyTon:1.2, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3I11400-07880545A', desc:'IVory 400GSM 0788*0545 Ream (3)', prodType:'Ream', unitPrice:1061.0, currency:'KRW', plant:'P400' },
  { orderId:184, sapOrderNo:'50136352', sapItemNo:'000010', orderType:'내수', customerCode:'101190', customerName:'주식회사 에스페랑스', machineNo:'', basisWeight:300, paperWidth:1194, orderQtyKg:1.0, orderQtyTon:1.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'S0RW1300-11940889A', desc:'Blanq-Bright(FSC Mix) 300GSM 1194*0889 R', prodType:'Other', unitPrice:1550.0, currency:'KRW', plant:'P100' },
  { orderId:185, sapOrderNo:'50136350', sapItemNo:'000010', orderType:'내수', customerCode:'101081', customerName:'주식회사 우리페이퍼', machineNo:'', basisWeight:325, paperWidth:615, orderQtyKg:9.6, orderQtyTon:9.6, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-19', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:true, excludeReason:'거부사유:07', matCode:'S0RP1325-06150760B', desc:'Blanq-Cream 325GSM 0615*0760 Bulk', prodType:'Bulk', unitPrice:1319.0, currency:'KRW', plant:'P100' },
  { orderId:186, sapOrderNo:'50136349', sapItemNo:'000010', orderType:'내수', customerCode:'101190', customerName:'주식회사 에스페랑스', machineNo:'', basisWeight:240, paperWidth:530, orderQtyKg:1.0, orderQtyTon:1.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F2S11240-05300850A', desc:'SC Manila 240GSM 0530*0850 Ream (2)', prodType:'Ream', unitPrice:973.0, currency:'KRW', plant:'P100' },
  { orderId:187, sapOrderNo:'50136348', sapItemNo:'000010', orderType:'내수', customerCode:'101081', customerName:'주식회사 우리페이퍼', machineNo:'', basisWeight:270, paperWidth:780, orderQtyKg:8.0, orderQtyTon:8.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-19', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'S0RP1270-07800675B', desc:'Blanq-Cream 270GSM 0780*0675 Bulk', prodType:'Bulk', unitPrice:1350.0, currency:'KRW', plant:'P100' },
  { orderId:188, sapOrderNo:'50136347', sapItemNo:'000010', orderType:'내수', customerCode:'101190', customerName:'주식회사 에스페랑스', machineNo:'', basisWeight:240, paperWidth:545, orderQtyKg:4.5, orderQtyTon:4.5, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-12', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3SM1240-05450788A', desc:'KSC (FSC) 240GSM 0545*0788 Ream (3)', prodType:'Ream', unitPrice:973.0, currency:'KRW', plant:'P100' },
  { orderId:189, sapOrderNo:'50136346', sapItemNo:'000010', orderType:'내수', customerCode:'101201', customerName:'주식회사 페이퍼칸', machineNo:'', basisWeight:400, paperWidth:725, orderQtyKg:52.0, orderQtyTon:52.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3I11400-07250470B', desc:'IVory 400GSM 0725*0470 Bulk (3)', prodType:'Bulk', unitPrice:1163.0, currency:'KRW', plant:'P100' },
  { orderId:190, sapOrderNo:'50136311', sapItemNo:'000010', orderType:'내수', customerCode:'100142', customerName:'(주)흥아지업', machineNo:'', basisWeight:240, paperWidth:1194, orderQtyKg:4.0, orderQtyTon:4.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F2S11240-11940889A', desc:'SC Manila 240GSM 1194*0889 Ream (2)', prodType:'Ream', unitPrice:944.0, currency:'KRW', plant:'P100' },
  { orderId:191, sapOrderNo:'50136309', sapItemNo:'000010', orderType:'내수', customerCode:'101190', customerName:'주식회사 에스페랑스', machineNo:'', basisWeight:400, paperWidth:640, orderQtyKg:10.0, orderQtyTon:10.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-12', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F2KS1400-06401090B', desc:'S-Kraft (FSC) 400GSM 0640*1090 Bulk (2)', prodType:'Bulk', unitPrice:913.0, currency:'KRW', plant:'P100' },
  { orderId:192, sapOrderNo:'50136309', sapItemNo:'000010', orderType:'내수', customerCode:'101190', customerName:'주식회사 에스페랑스', machineNo:'', basisWeight:400, paperWidth:640, orderQtyKg:0.0, orderQtyTon:0.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-10', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F2KS1400-06401090B', desc:'S-Kraft (FSC) 400GSM 0640*1090 Bulk (2)', prodType:'Bulk', unitPrice:913.0, currency:'KRW', plant:'P100' },
  { orderId:193, sapOrderNo:'50136308', sapItemNo:'000010', orderType:'내수', customerCode:'101152', customerName:'양지페이퍼(주)', machineNo:'', basisWeight:300, paperWidth:1091, orderQtyKg:2.25, orderQtyTon:2.25, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-17', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3I11300-10910788A', desc:'IVory 300GSM 1091*0788 Ream (3)', prodType:'Ream', unitPrice:1152.0, currency:'KRW', plant:'P100' },
  { orderId:194, sapOrderNo:'50136308', sapItemNo:'000010', orderType:'내수', customerCode:'101152', customerName:'양지페이퍼(주)', machineNo:'', basisWeight:300, paperWidth:1091, orderQtyKg:0.0, orderQtyTon:0.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-13', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3I11300-10910788A', desc:'IVory 300GSM 1091*0788 Ream (3)', prodType:'Ream', unitPrice:1152.0, currency:'KRW', plant:'P100' },
  { orderId:195, sapOrderNo:'50136306', sapItemNo:'000010', orderType:'내수', customerCode:'101202', customerName:'주식회사 디와이페이퍼', machineNo:'', basisWeight:350, paperWidth:788, orderQtyKg:6.0, orderQtyTon:6.0, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3I11350-07880545A', desc:'IVory 350GSM 0788*0545 Ream (3)', prodType:'Ream', unitPrice:1210.0, currency:'KRW', plant:'P100' },
  { orderId:196, sapOrderNo:'50136305', sapItemNo:'000010', orderType:'내수', customerCode:'101152', customerName:'양지페이퍼(주)', machineNo:'', basisWeight:400, paperWidth:480, orderQtyKg:1.6, orderQtyTon:1.6, orderQtyR:null, orderQtySok:null, unit:'R', dueDate:'2026-06-11', orderDate:'2026-06-10', createdBy:'SAP', status:'OPEN', isExcluded:false, excludeReason:null, matCode:'F3S11400-04800680A', desc:'SC Manila 400GSM 0480*0680 Ream (3)', prodType:'Ream', unitPrice:925.0, currency:'KRW', plant:'P100' }
]
// ============================================================
// 런타임 데이터 구조
//   salesOrders : rfc-sync 임시 버퍼 (불러오기 조회 결과 표시용)
//   savedOrders : "선택항목 DB저장" 후 실제 저장된 항목 (시뮬레이션 대상)
// ============================================================
let salesOrders: any[] = []       // 임시 버퍼 (rfc-sync 결과)
let savedOrders: any[] = []       // DB 저장 확정 항목 (시뮬레이션 소스)
let salesOrdersLoaded = false

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
// RFC 통신 이력 (판매오더 불러오기 + 생산오더 전송)
// ============================================================
let rfcLogSeq = 1
const rfcImportLogs: any[] = []  // 판매오더 불러오기 이력
const rfcSendLogs:   any[] = []  // 생산오더 전송 이력

// ============================================================
// 시뮬레이션 세션 (헤더 + 디테일)
//
// ┌─ simHeaders (1 row per session) ───────────────────────────
// │  simCode      : "S-YYYY-MM-DD-0001" 고유코드
// │  simId        : 자동 증가 PK
// │  status       : 'DRAFT' | 'CONFIRMED' | 'SENT'
// │  machineNo    : 호기 필터 ('' = 전체)
// │  basisWeight  : 평량 필터 (0 = 전체)
// │  targetOrders : 대상 오더 수
// │  combosTotal  : 총 조합 수
// │  confirmedCombos : 확정 조합 수
// │  sentCombos   : 전송(오더생성) 조합 수
// │  createdAt    : 생성 일시
// │  confirmedAt  : 확정 일시
// │  sentAt       : 전송 일시
// │  operator     : 실행자
// └─────────────────────────────────────────────────────────────
//
// ┌─ simDetails (N rows per session) ──────────────────────────
// │  detailId     : 자동 증가 PK
// │  simCode      : FK → simHeaders.simCode
// │  comboId      : 조합 번호 (1-based within session)
// │  machineNo    : 호기
// │  basisWeight  : 평량
// │  pokCount     : 폭 수
// │  jumboWidth   : 점보롤 전체 지폭 (mm)
// │  widths       : 개별 지폭 배열 JSON
// │  totalTon     : 총 중량 (T)
// │  lossRate     : 로스율 (%)
// │  orderCount   : 포함 오더 수
// │  orderNos     : 포함 SAP 오더번호 배열 JSON
// │  status       : 'GENERATED' | 'CONFIRMED' | 'SENT'
// │  jumboOrderNo : 생성된 점보롤 오더번호 (SENT 후)
// └─────────────────────────────────────────────────────────────
// ============================================================
let simSessionSeq  = 1
let simDetailSeq   = 1
const simHeaders:  any[] = []
const simDetails:  any[] = []

// 날짜별 시뮬레이션 코드 카운터  { 'YYYY-MM-DD': number }
const _simCodeCounter: Record<string, number> = {}

function generateSimCode(): string {
  const today = new Date()
  const pad   = (n: number) => String(n).padStart(2, '0')
  const dateKey = today.getFullYear() + '-' + pad(today.getMonth() + 1) + '-' + pad(today.getDate())
  _simCodeCounter[dateKey] = (_simCodeCounter[dateKey] || 0) + 1
  const seq = String(_simCodeCounter[dateKey]).padStart(4, '0')
  return 'S-' + dateKey + '-' + seq   // e.g. S-2026-06-30-0001
}

// ============================================================
// API
// ============================================================
app.get('/klean-aps-api/machines', (c) => c.json({ success:true, data:machines }))

// 점보롤 오더 목록
app.get('/klean-aps-api/jumbo-orders', (c) => c.json({ success:true, data:jumboOrders }))

// 점보롤 오더 생성 (시뮬레이션 확정 후 오더생성 시 호출)
app.post('/klean-aps-api/jumbo-orders', async (c) => {
  const startAt = Date.now()
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
  const elapsed = Date.now() - startAt
  const sentCount = created.length
  const failCount = 0

  // ── RFC 전송 이력 기록
  const pad2 = (n: number) => String(n).padStart(2,'0')
  const ts = new Date()
  const calledAt = ts.getFullYear()+'-'+pad2(ts.getMonth()+1)+'-'+pad2(ts.getDate())+' '+
                   pad2(ts.getHours())+':'+pad2(ts.getMinutes())+':'+pad2(ts.getSeconds())
  const simId = created[0]?.sourceComboId
    ? 'SIM-' + String(created[0].sourceComboId).padStart(4,'0')
    : 'SIM-????'
  rfcSendLogs.unshift({
    logId       : rfcLogSeq++,
    calledAt,
    funcName    : 'Z_CREATE_PROD_ORDER',
    simId,
    sentCount,
    successCount: sentCount - failCount,
    failCount,
    result      : failCount > 0 ? '일부실패' : '성공',
    elapsed     : elapsed + 'ms',
    operator    : '사용자',
    remark      : failCount > 0 ? '일부 오더 생성 실패' : '-',
  })

  return c.json({ success:true, data:created, count:created.length, elapsed })
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
    message: '생산오더 ' + o.prodOrderNo + ' 취소 완료 — SAP RFC 전송 성공'
  })
})

// ── GET /sales-orders : DB 저장 확정 항목(savedOrders) 반환 — 시뮬레이션 소스
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

  let list = savedOrders.filter(o => {
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

// ── POST /sales-orders/save : 선택 항목을 savedOrders에 저장 (DB 저장 확정)
app.post('/klean-aps-api/sales-orders/save', async (c) => {
  const body = await c.req.json()
  const ids: number[] = body.orderIds || []
  if (!ids.length) return c.json({ success:false, message:'저장할 항목이 없습니다.' }, 400)

  const toSave = salesOrders.filter(o => ids.includes(o.orderId))
  if (!toSave.length) return c.json({ success:false, message:'해당 오더를 찾을 수 없습니다.' }, 404)

  let addedCount = 0
  let skippedCount = 0
  for (const o of toSave) {
    // machineNo가 비어있으면 자재코드에서 추출
    const rec: any = { ...o }
    if (!rec.machineNo && rec.matCode) {
      rec.machineNo = parseMachineNoFromMatCode(rec.matCode)
    }
    const already = savedOrders.find(s => s.orderId === rec.orderId)
    if (already) {
      // 이미 저장된 경우 최신 내용으로 덮어쓰기
      Object.assign(already, rec)
      skippedCount++
    } else {
      savedOrders.push({ ...rec, savedAt: new Date().toISOString().replace('T',' ').slice(0,19) })
      addedCount++
    }
  }
  return c.json({
    success: true,
    addedCount,
    skippedCount,
    totalSaved: savedOrders.length,
    message: addedCount + '건 DB 저장 완료 (중복 ' + skippedCount + '건 갱신)'
  })
})

app.patch('/klean-aps-api/sales-orders/:id/exclude', async (c) => {
  const id   = Number(c.req.param('id'))
  const body = await c.req.json()
  // savedOrders 우선, 없으면 salesOrders(임시)에서 찾음
  const o = savedOrders.find(x => x.orderId === id) || salesOrders.find(x => x.orderId === id)
  if (!o) return c.json({ success:false, message:'오더 없음' }, 404)
  o.isExcluded = true;(o as any).excludeReason = body.reason
  return c.json({ success:true, data:o })
})
app.patch('/klean-aps-api/sales-orders/:id/include', (c) => {
  const id = Number(c.req.param('id'))
  const o  = savedOrders.find(x => x.orderId === id) || salesOrders.find(x => x.orderId === id)
  if (!o) return c.json({ success:false, message:'오더 없음' }, 404)
  o.isExcluded = false;(o as any).excludeReason = null
  return c.json({ success:true, data:o })
})

// ── 자재코드 MID(2,1) → 생산호기 파싱
// 자재코드 규칙: LEFT(1)=품목유형, MID(2,1)=생산호기(1/2/3), ...
// 예: H3S11350-09400000 → index[1] = '3' → '3'호기
function parseMachineNoFromMatCode(matCode: string): string {
  if (!matCode || matCode.length < 2) return ''
  const ch = matCode.charAt(1)  // MID(2,1) = 0-based index 1
  return (ch === '1' || ch === '2' || ch === '3') ? ch : ''
}

app.post('/klean-aps-api/sales-orders/rfc-sync', async (c) => {
  const startAt = Date.now()
  await new Promise(r => setTimeout(r, 800))
  // 이미 불러온 경우 중복 방지 (재불러오기는 덮어쓰기)
  salesOrders.length = 0
  // 엑셀 데이터를 딥카피해서 런타임 배열에 로드
  // machineNo가 비어있으면 자재코드 MID(2,1)에서 자동 추출
  for (const o of EXCEL_SALES_ORDERS_DATA) {
    const rec: any = { ...o }
    if (!rec.machineNo && rec.matCode) {
      rec.machineNo = parseMachineNoFromMatCode(rec.matCode)
    }
    salesOrders.push(rec)
  }
  salesOrdersLoaded = true
  const total     = salesOrders.length
  const alreadyN  = 0
  const failN     = 0
  const successN  = total
  const elapsed   = Date.now() - startAt

  // ── RFC 이력 기록
  const body: any = await c.req.json().catch(() => ({}))
  // 서버사이드 필터 적용
  if (body.plant) {
    salesOrders.splice(0, salesOrders.length,
      ...salesOrders.filter((o: any) => o.plant === body.plant)
    )
  }
  if (body.basisWeight) {
    const bw = Number(body.basisWeight)
    salesOrders.splice(0, salesOrders.length,
      ...salesOrders.filter((o: any) => o.basisWeight === bw)
    )
  }
  const condParts: string[] = []
  if (body.plant)        condParts.push('플랜트: ' + body.plant)
  if (body.basisWeight)  condParts.push('평량: ' + body.basisWeight + 'g/m²')
  if (body.orderType)    condParts.push('오더유형: ' + body.orderType)
  if (body.machineNo)    condParts.push('호기: ' + body.machineNo + '호기')
  if (body.sapOrderNo)   condParts.push('SAP오더: ' + body.sapOrderNo)
  if (body.dateFrom || body.dateTo) condParts.push('기간: ' + (body.dateFrom||'') + '~' + (body.dateTo||''))
  const condition = condParts.length ? condParts.join(', ') : '전체 조회'
  const now = new Date()
  const pad2 = (n: number) => String(n).padStart(2,'0')
  const calledAt = now.getFullYear()+'-'+pad2(now.getMonth()+1)+'-'+pad2(now.getDate())+' '+
                   pad2(now.getHours())+':'+pad2(now.getMinutes())+':'+pad2(now.getSeconds())
  rfcImportLogs.unshift({
    logId        : rfcLogSeq++,
    calledAt,
    funcName     : 'Z_GET_SALES_ORDER',
    condition,
    receivedCount: total,
    successCount : successN,
    failCount    : failN,
    alreadyCount : alreadyN,
    result       : failN > 0 ? '실패' : '성공',
    elapsed      : elapsed + 'ms',
    operator     : '사용자',
  })

  return c.json({
    success: true,
    data: salesOrders,
    total,
    successCount : successN,
    failCount    : failN,
    alreadyCount : alreadyN,
    elapsed,
    openCount    : salesOrders.filter(o => !o.isExcluded && o.status === 'OPEN').length,
    message      : '판매오더 ' + total + '건 불러오기 성공 (엑셀 데이터)'
  })
})

// ============================================================
// RFC 이력 API
// ============================================================
app.get('/klean-aps-api/rfc-logs', (c) => {
  return c.json({
    success: true,
    import: rfcImportLogs,
    send:   rfcSendLogs,
    importStats: {
      total  : rfcImportLogs.length,
      success: rfcImportLogs.filter(l => l.result === '성공').length,
      fail   : rfcImportLogs.filter(l => l.result === '실패').length,
      totalCount: rfcImportLogs.reduce((s,l) => s + (l.receivedCount||0), 0)
    },
    sendStats: {
      total  : rfcSendLogs.length,
      success: rfcSendLogs.filter(l => l.result === '성공').length,
      fail   : rfcSendLogs.filter(l => l.result !== '성공').length,
      totalCount: rfcSendLogs.reduce((s,l) => s + (l.sentCount||0), 0)
    }
  })
})

// ============================================================
// 시뮬레이션 세션 API
// ============================================================

// 전체 세션 목록 (헤더만, 최신순)
app.get('/klean-aps-api/sim-sessions', (c) => {
  return c.json({
    success: true,
    data   : [...simHeaders].reverse(),
    total  : simHeaders.length,
  })
})

// 특정 세션 상세 (헤더 + 디테일)
app.get('/klean-aps-api/sim-sessions/:code', (c) => {
  const code   = c.req.param('code')
  const header = simHeaders.find(h => h.simCode === code)
  if (!header) return c.json({ success: false, message: '세션 없음' }, 404)
  const details = simDetails.filter(d => d.simCode === code)
  return c.json({ success: true, header, details })
})

// 세션 삭제 (DRAFT 상태만 허용)
app.delete('/klean-aps-api/sim-sessions/:code', (c) => {
  const code = c.req.param('code')
  const idx  = simHeaders.findIndex(h => h.simCode === code)
  if (idx === -1) return c.json({ success: false, message: '세션 없음' }, 404)
  if (simHeaders[idx].status === 'SENT')
    return c.json({ success: false, message: 'SAP 전송 완료된 세션은 삭제할 수 없습니다.' }, 400)
  simHeaders.splice(idx, 1)
  const before = simDetails.length
  for (let i = simDetails.length - 1; i >= 0; i--) {
    if (simDetails[i].simCode === code) simDetails.splice(i, 1)
  }
  return c.json({ success: true, message: '세션 삭제 완료', deletedDetails: before - simDetails.length })
})

// 세션 생성 (simGenerate 호출 시 — DRAFT)
// 세션 생성 — 확정 시점에만 호출되므로 status는 바로 CONFIRMED
// combos: 확정된 조합만 전달받음
app.post('/klean-aps-api/sim-sessions', async (c) => {
  const body    = await c.req.json()
  const simCode = generateSimCode()
  const pad2    = (n: number) => String(n).padStart(2, '0')
  const now     = new Date()
  const ts = now.getFullYear()+'-'+pad2(now.getMonth()+1)+'-'+pad2(now.getDate())+' '+
             pad2(now.getHours())+':'+pad2(now.getMinutes())+':'+pad2(now.getSeconds())

  const confirmedCount = (body.combos || []).length

  const header: any = {
    simId           : simSessionSeq++,
    simCode,
    status          : 'CONFIRMED',            // 확정 시점 생성이므로 즉시 CONFIRMED
    plant           : body.plant        || '',
    machineNo       : body.machineNo    || '',
    basisWeight     : body.basisWeight  || 0,
    dueFrom         : body.dueFrom      || '',
    dueTo           : body.dueTo        || '',
    targetOrders    : body.targetOrders || 0,
    excludedOrders  : body.excludedOrders || 0,
    combosTotal     : body.combosTotal  || confirmedCount,  // 전체 생성 조합 수
    confirmedCombos : confirmedCount,          // 확정된 조합 수
    sentCombos      : 0,
    createdAt       : ts,
    confirmedAt     : ts,                      // 생성=확정 동시이므로 동일 시각
    sentAt          : null,
    operator        : '사용자',
  }
  simHeaders.push(header)

  // 디테일 rows — 확정된 조합만 저장, 모두 CONFIRMED 상태
  const detailRows: any[] = (body.combos || []).map((combo: any, idx: number) => {
    const c_: any = {
      detailId    : simDetailSeq++,
      simCode,
      comboId     : combo.comboId,
      seqNo       : idx + 1,
      machineNo   : combo.machineNo,
      basisWeight : combo.basisWeight,
      pokCount    : combo.pokCount,
      jumboWidth  : combo.jumboWidth
                    || combo.orders?.reduce((s: number, o: any) => s + o.paperWidth, 0)
                    || 0,
      widths      : JSON.stringify(combo.orders?.map((o: any) => o.paperWidth) || []),
      totalTon    : combo.totalTon,
      lossRate    : combo.lossRate,
      orderCount  : combo.orders?.length || 0,
      orderNos    : JSON.stringify(combo.orders?.map((o: any) => o.sapOrderNo) || []),
      status      : 'CONFIRMED',
      jumboOrderNo: null,
      confirmedAt : ts,
    }
    simDetails.push(c_)
    return c_
  })

  return c.json({ success: true, simCode, header, details: detailRows })
})

// 세션 확정 (simConfirm 호출 시 — CONFIRMED)
app.patch('/klean-aps-api/sim-sessions/:code/confirm', async (c) => {
  const code   = c.req.param('code')
  const header = simHeaders.find(h => h.simCode === code)
  if (!header) return c.json({ success: false, message: '세션 없음' }, 404)
  const body   = await c.req.json()                       // { confirmedComboIds: number[] }
  const ids: number[] = body.confirmedComboIds || []

  const pad2 = (n: number) => String(n).padStart(2, '0')
  const now  = new Date()
  header.confirmedAt     = now.getFullYear()+'-'+pad2(now.getMonth()+1)+'-'+pad2(now.getDate())+' '+
                           pad2(now.getHours())+':'+pad2(now.getMinutes())+':'+pad2(now.getSeconds())
  header.status          = 'CONFIRMED'
  header.confirmedCombos = ids.length

  // 디테일 상태 갱신
  simDetails.filter(d => d.simCode === code).forEach(d => {
    d.status = ids.includes(d.comboId) ? 'CONFIRMED' : 'GENERATED'
  })

  return c.json({ success: true, simCode: code, confirmedCombos: ids.length })
})

// 세션 전송완료 (simSendOrder 호출 시 — SENT)
app.patch('/klean-aps-api/sim-sessions/:code/send', async (c) => {
  const code   = c.req.param('code')
  const header = simHeaders.find(h => h.simCode === code)
  if (!header) return c.json({ success: false, message: '세션 없음' }, 404)
  const body   = await c.req.json()    // { sentItems: [{ comboId, jumboOrderNo }] }
  const items: { comboId: number; jumboOrderNo: string }[] = body.sentItems || []

  const pad2 = (n: number) => String(n).padStart(2, '0')
  const now  = new Date()
  header.sentAt     = now.getFullYear()+'-'+pad2(now.getMonth()+1)+'-'+pad2(now.getDate())+' '+
                      pad2(now.getHours())+':'+pad2(now.getMinutes())+':'+pad2(now.getSeconds())
  header.status     = 'SENT'
  header.sentCombos = items.length

  // 디테일에 점보롤 오더번호 연결
  items.forEach(item => {
    const d = simDetails.find(d => d.simCode === code && d.comboId === item.comboId)
    if (d) { d.status = 'SENT'; d.jumboOrderNo = item.jumboOrderNo }
  })

  return c.json({ success: true, simCode: code, sentCombos: items.length })
})

// ============================================================
// 전체 데이터 초기화 (임시 데이터 삭제)
// 판매오더 + 점보롤오더 + 생산오더 일괄 삭제
// ============================================================
app.delete('/klean-aps-api/reset-all-data', (c) => {
  const soCount    = salesOrders.length
  const svCount    = savedOrders.length
  const jumboCount = jumboOrders.length
  const prodCount  = prodOrders.length
  salesOrders.length = 0
  savedOrders.length = 0
  jumboOrders.length = 0
  prodOrders.length  = 0
  salesOrdersLoaded  = false
  jumboSeq = 1
  return c.json({
    success: true,
    message: '전체 데이터 초기화 완료',
    deleted: { salesOrders: soCount, savedOrders: svCount, jumboOrders: jumboCount, prodOrders: prodCount }
  })
})

// ============================================================
// AI Chat API — claude-opus-4-8 (SSE 스트리밍)
// ============================================================
app.post('/klean-aps-api/ai-chat', async (c) => {
  const body       = await c.req.json()
  const messages   = body.messages  || []
  const simContext = body.simContext || null   // 시뮬레이션 결과 컨텍스트

  const API_KEY  = (c.env as any)?.GSK_TOKEN  || ''
  const BASE_URL = 'https://www.genspark.ai/api/llm_proxy/v1'

  if (!API_KEY) {
    return c.json({ success: false, message: 'AI API 키가 설정되지 않았습니다.' }, 500)
  }

  // 시스템 프롬프트: 시뮬레이션 컨텍스트 포함 (백틱/\n 금지 — mainHtml 템플릿 충돌 방지)
  // String.fromCharCode(10)을 직접 쓰면 Vite가 백틱 템플릿으로 최적화함 → 간접 우회
  const _nlChar: any = String
  const NL: string = _nlChar.fromCharCode(10)
  const lines0 = [
    '\ub2f9\uc2e0\uc740 \uc81c\uc9c0 \uc0dd\uc0b0 \uacc4\ud68d \uc804\ubb38 AI \uc5b4\uc2dc\uc2a4\ud134\ud2b8\uc785\ub2c8\ub2e4.',
    '\uc9c0\ud3ed\uc870\ud569 \uc2dc\ubbac\ub808\uc774\uc158 \uacb0\uacfc\ub97c \ubd84\uc11d\ud558\uace0, Loss \ucd5c\uc18c\ud654 \ubc29\uc548, \uc624\ub354 \uc870\ud569 \ucd5c\uc801\ud654, \uc0dd\uc0b0 \ud6a8\uc728 \uac1c\uc120\uc5d0 \ub300\ud55c \uc804\ubb38\uc801\uc778 \uc870\uc5b8\uc744 \uc81c\uacf5\ud569\ub2c8\ub2e4.',
    '\ub2f5\ubcc0\uc740 \ud55c\uad6d\uc5b4\ub85c, \uba85\ud655\ud558\uace0 \uc2e4\uc6a9\uc801\uc73c\ub85c \uc791\uc131\ud558\uc138\uc694.'
  ]
  let systemContent = lines0.join(NL)

  if (simContext) {
    const combosText = simContext.combos.map((cb: any) =>
      '[\uc870\ud569#' + cb.comboId + '] ' + cb.machineNo + '\ud638\uae30 / \ud3c9\ub7c9' + cb.basisWeight + 'g/m\u00b2 / ' +
      '\uc9c0\ud3ed\ud569\uacc4' + cb.widthSum + 'mm(\ucd5c\ub300' + cb.maxWidth + 'mm) / ' +
      cb.pokCount + '\ud3ed / Loss' + cb.lossRate + '% / ' + cb.totalTon + 'TON' +
      ' / \uc624\ub354: ' + cb.orders.map((o: any) => o.sapOrderNo + '(' + o.paperWidth + 'mm)').join(', ')
    ).join(NL)

    const ctxLines = [
      '', '', '=== \ud604\uc7ac \uc2dc\ubbac\ub808\uc774\uc158 \uacb0\uacfc ===',
      '\ucd1d \uc870\ud569 \uc218: ' + simContext.totalCombos + '\uac1c',
      '\ud3ec\ud568 \uc624\ub354: ' + simContext.totalOrders + '\uac74',
      '\ud569\uacc4 \uc0dd\uc0b0\ub7c9: ' + simContext.totalTon + 'TON',
      '\ud3c9\uade0 Loss\uc728: ' + simContext.avgLoss + '%',
      '', '\uc870\ud569 \uc0c1\uc138:', combosText, '',
      '\ubd84\ub9ac\ub41c \uc608\uc678 \uc624\ub354: ' + simContext.excludedCount + '\uac74'
    ]
    systemContent += ctxLines.join(NL)
  }

  // Fetch API로 SSE 스트리밍 (백틱 금지 — mainHtml 충돌 방지)
  const upstream = await fetch(BASE_URL + '/chat/completions', {
    method : 'POST',
    headers: {
      'Authorization': 'Bearer ' + API_KEY,
      'Content-Type' : 'application/json',
    },
    body: JSON.stringify({
      model      : 'claude-opus-4-8',
      stream     : true,
      max_tokens : 2000,
      messages   : [
        { role: 'system', content: systemContent },
        ...messages
      ]
    })
  })

  if (!upstream.ok) {
    const err = await upstream.text()
    return c.json({ success: false, message: 'AI API \uc624\ub958: '+err }, 502)
  }

  // ── SSE 스트림을 직접 읽어서 클라이언트에 재전송 ──────────────
  // (upstream.body 직접 relay는 Cloudflare Workers에서 중간 끊김 발생)
  const upReader = upstream.body!.getReader()
  const NL_CHAR  = String.fromCharCode(10)

  const stream = new ReadableStream({
    async start(controller) {
      const enc = new TextEncoder()
      let buf   = ''
      let done  = false

      try {
        while (!done) {
          const { done: rdDone, value } = await upReader.read()
          if (rdDone) { done = true; break }

          buf += new TextDecoder().decode(value, { stream: true })

          const lastNL = buf.lastIndexOf(NL_CHAR)
          if (lastNL === -1) continue

          const chunk = buf.slice(0, lastNL + 1)
          buf = buf.slice(lastNL + 1)

          for (const line of chunk.split(NL_CHAR)) {
            const trimmed = line.trim()
            if (!trimmed) continue
            // 그대로 전달 (data: ... 형식 유지)
            controller.enqueue(enc.encode(trimmed + NL_CHAR + NL_CHAR))
            if (trimmed === 'data: [DONE]') { done = true; break }
          }
        }
      } catch(_) {}

      // 명시적 [DONE] 보장 (upstream이 비정상 종료된 경우에도 클라이언트가 멈추지 않도록)
      try {
        controller.enqueue(enc.encode('data: [DONE]' + NL_CHAR + NL_CHAR))
      } catch(_) {}
      controller.close()
    },
    cancel() {
      upReader.cancel().catch(() => {})
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type'                : 'text/event-stream',
      'Cache-Control'               : 'no-cache',
      'X-Content-Type-Options'      : 'nosniff',
      'Access-Control-Allow-Origin' : '*',
    }
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
@font-face {
  font-family: 'Netmarble';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_four@1.1/netmarbleM.woff') format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Netmarble';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_four@1.1/netmarbleB.woff') format('woff');
  font-weight: bold;
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
  --bg-card      : #0f172a;
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
  --bg-card      : #ffffff;
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
  width:230px;height:100vh;
  background:var(--bg-surface);
  border-right:1px solid var(--border);
  display:flex;flex-direction:column;flex-shrink:0;
  transition:background .25s, border-color .25s;
}
.nav-group-title{
  font-size:11px;font-weight:700;
  color:var(--nav-group-txt);
  letter-spacing:.12em;padding:16px 20px 6px;
  font-family:'SBAggroL','Malgun Gothic',sans-serif;
}
.nav-item{
  display:flex;align-items:center;gap:12px;
  padding:13px 20px;cursor:pointer;
  color:var(--nav-text);
  transition:all .12s;
  border-left:3px solid transparent;margin:1px 0;
  font-family:'Jalnan','Malgun Gothic',sans-serif;
  font-size:14px;
  letter-spacing:0.12em;
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
.nav-item i{width:24px;text-align:center;font-size:20px;flex-shrink:0;}

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
.btn{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;border:none;transition:all .12s;white-space:nowrap;font-family:'Netmarble','Malgun Gothic',sans-serif;}
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
  font-family:'Netmarble','Malgun Gothic',sans-serif;
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
.badge{display:inline-flex;align-items:center;padding:2px 8px;border-radius:9999px;font-size:11px;font-weight:600;font-family:'Netmarble','Malgun Gothic',sans-serif;}
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
.stat-mini .sv{font-size:18px;font-weight:700;font-family:'Netmarble','Malgun Gothic',sans-serif;}
.stat-mini .sl{font-size:10px;color:var(--text-subtle);}

/* ── 페이지 제목 ── */
.page-header{padding:18px 28px 0;flex-shrink:0;}
.page-title{font-size:18px;font-weight:700;color:var(--text-primary);display:flex;align-items:center;gap:10px;font-family:'Netmarble','Malgun Gothic',sans-serif;}
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
  padding:20px 20px 16px;
  border-bottom:1px solid var(--border);
  transition:border-color .25s;
}
.logo-icon{
  width:40px;height:40px;
  background:var(--logo-bg);
  border-radius:10px;
  display:flex;align-items:center;justify-content:center;
  font-weight:900;font-size:18px;
  color:var(--logo-txt);
  flex-shrink:0;
}
.logo-name{font-weight:700;font-size:16px;color:var(--text-primary);font-family:'Jalnan','Malgun Gothic',sans-serif;letter-spacing:0.06em;}
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

/* ── 제약조건 읽기 전용 모드 ── */
#page-constraint.constraint-readonly .form-input,
#page-constraint.constraint-readonly .form-select {
  background: var(--bg-input);
  color: var(--text-secondary);
  cursor: default;
  pointer-events: none;
  border-color: transparent;
  box-shadow: none;
}
#page-constraint.constraint-readonly .excl-row {
  cursor: default;
  pointer-events: none;
}
#page-constraint.constraint-readonly .stock-row input[type="checkbox"] {
  pointer-events: none;
  cursor: default;
}
#page-constraint.constraint-readonly .excl-row input[type="checkbox"] {
  pointer-events: none;
  cursor: default;
}

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

/* ── AI 채팅 패널 (하단 고정 슬라이드업) ── */
/* 배경색: 테마 변수 우선, 폴백으로 다크/라이트 명시 */
#sim-ai-panel {
  background: var(--bg-card, #0f172a) !important;
}
[data-theme="light"] #sim-ai-panel {
  background: #ffffff !important;
}
.ai-msg { display:flex; gap:10px; animation:fadeInUp .2s ease; }
.ai-msg.user  { flex-direction:row-reverse; }
.ai-msg .ai-bubble {
  max-width:75%; padding:10px 14px; border-radius:12px;
  font-size:13px; line-height:1.65; white-space:pre-wrap; word-break:break-word;
}
.ai-msg.user  .ai-bubble { background:linear-gradient(135deg,#4f46e5,#7c3aed); color:#fff; border-bottom-right-radius:3px; }
.ai-msg.ai    .ai-bubble { background:var(--bg-input); color:var(--text); border:1px solid var(--border); border-bottom-left-radius:3px; }
.ai-msg .ai-avatar {
  width:28px; height:28px; border-radius:50%; flex-shrink:0;
  display:flex; align-items:center; justify-content:center; font-size:12px;
}
.ai-msg.user .ai-avatar  { background:#4f46e5; color:#fff; }
.ai-msg.ai   .ai-avatar  { background:linear-gradient(135deg,#6366f1,#a78bfa); color:#fff; }
.ai-quick-btn {
  padding:5px 11px; border-radius:20px; border:1px solid #a78bfa55;
  background:#a78bfa11; color:#a78bfa; font-size:11px; font-weight:600;
  cursor:pointer; white-space:nowrap; transition:all .15s;
}
.ai-quick-btn:hover { background:#a78bfa22; border-color:#a78bfa; }
.ai-typing-cursor { display:inline-block; width:2px; height:14px; background:#a78bfa; margin-left:2px; animation:blink .7s step-end infinite; vertical-align:text-bottom; }
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
@keyframes fadeInUp { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
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
    <div class="nav-item" id="nav-sim-history"  onclick="goPage('sim-history')"> <i class="fas fa-history"></i>지폭조합 조회</div>
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
        <div><label class="field-label">플랜트</label>
          <select class="inp" id="fi-plant">
            <option value="">전체</option>
            <option value="P100">P100</option>
            <option value="P200">P200</option>
            <option value="P300">P300</option>
            <option value="P400">P400</option>
          </select>
        </div>
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
        <div><label class="field-label">평량 (g/m²)</label>
          <input class="inp" type="number" id="fi-basisWeight" placeholder="예: 350" min="1"
            list="bw-list-import-cond" style="width:100%;">
          <datalist id="bw-list-import-cond">
            <option value="240"></option>
            <option value="300"></option>
            <option value="350"></option>
            <option value="400"></option>
            <option value="450"></option>
            <option value="500"></option>
          </datalist>
        </div>
      </div>

      <div style="display:flex;align-items:center;gap:10px;margin-top:16px;flex-wrap:wrap;">
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
        <div style="margin-left:auto;">
          <button class="btn btn-danger btn-sm" onclick="confirmResetAllData()" title="판매오더·점보롤·생산오더 전체 삭제">
            <i class="fas fa-trash-alt"></i> 전체 데이터 삭제
          </button>
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
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
          <!-- DB 저장 현황 배지 -->
          <div id="saved-count-banner" style="display:none;padding:3px 10px;border-radius:5px;background:#34d39920;border:1px solid #34d39966;font-size:12px;font-weight:700;color:#34d399;white-space:nowrap;">
            <i class="fas fa-database"></i> DB저장: <span id="saved-count-num">0</span>건
          </div>
          <label style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--text-subtle);cursor:pointer;">
            <input type="checkbox" id="chk-all-import" onchange="toggleAllImport(this.checked)"> 전체선택
          </label>
          <button class="btn btn-success btn-sm" onclick="saveSelected()" id="btn-save" disabled>
            <i class="fas fa-save"></i> 선택항목 DB저장
          </button>
        </div>
      </div>
      <!-- RFC 결과 필터 바 -->
      <div id="import-filter-bar" style="display:none;padding:10px 16px 10px;border-bottom:1px solid var(--border);background:var(--bg-input);">
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:flex-end;">
          <div style="display:flex;flex-direction:column;gap:3px;">
            <label style="font-size:10px;color:var(--text-faint);letter-spacing:.05em;">플랜트</label>
            <select class="inp" id="rf-plant" onchange="applyImportFilter()"
              style="width:80px;height:28px;padding:3px 8px;font-size:12px;">
              <option value="">전체</option>
              <option value="P100">P100</option>
              <option value="P200">P200</option>
              <option value="P300">P300</option>
              <option value="P400">P400</option>
            </select>
          </div>
          <div style="display:flex;flex-direction:column;gap:3px;">
            <label style="font-size:10px;color:var(--text-faint);letter-spacing:.05em;">판매문서번호</label>
            <input class="inp" id="rf-sapOrderNo" placeholder="50137471" oninput="applyImportFilter()"
              style="width:110px;height:28px;padding:3px 8px;font-size:12px;">
          </div>
          <div style="display:flex;flex-direction:column;gap:3px;">
            <label style="font-size:10px;color:var(--text-faint);letter-spacing:.05em;">오더유형</label>
            <select class="inp" id="rf-orderType" onchange="applyImportFilter()"
              style="width:90px;height:28px;padding:3px 8px;font-size:12px;">
              <option value="">전체</option>
              <option>내수</option><option>수출</option><option>일본수출</option><option>특수지</option>
            </select>
          </div>
          <div style="display:flex;flex-direction:column;gap:3px;">
            <label style="font-size:10px;color:var(--text-faint);letter-spacing:.05em;">납품승입처</label>
            <input class="inp" id="rf-customerName" placeholder="거래체명" oninput="applyImportFilter()"
              style="width:130px;height:28px;padding:3px 8px;font-size:12px;">
          </div>
          <div style="display:flex;flex-direction:column;gap:3px;">
            <label style="font-size:10px;color:var(--text-faint);letter-spacing:.05em;">호기</label>
            <select class="inp" id="rf-machineNo" onchange="applyImportFilter()"
              style="width:80px;height:28px;padding:3px 8px;font-size:12px;">
              <option value="">전체</option>
              <option value="2">2호기</option><option value="3">3호기</option>
            </select>
          </div>
          <div style="display:flex;flex-direction:column;gap:3px;">
            <label style="font-size:10px;color:var(--text-faint);letter-spacing:.05em;">평량(g/m²)</label>
            <input type="number" class="inp" id="rf-basisWeight" placeholder="전체" min="1"
              list="bw-list-import" oninput="applyImportFilter()"
              style="width:80px;height:28px;padding:3px 8px;font-size:12px;">
            <datalist id="bw-list-import"></datalist>
          </div>
          <div style="display:flex;flex-direction:column;gap:3px;">
            <label style="font-size:10px;color:var(--text-faint);letter-spacing:.05em;">생성일 From</label>
            <input type="date" class="inp" id="rf-dateFrom" onchange="applyImportFilter()"
              style="width:130px;height:28px;padding:3px 8px;font-size:12px;">
          </div>
          <div style="display:flex;flex-direction:column;gap:3px;">
            <label style="font-size:10px;color:var(--text-faint);letter-spacing:.05em;">생성일 To</label>
            <input type="date" class="inp" id="rf-dateTo" onchange="applyImportFilter()"
              style="width:130px;height:28px;padding:3px 8px;font-size:12px;">
          </div>
          <div style="display:flex;flex-direction:column;gap:3px;">
            <label style="font-size:10px;color:var(--text-faint);letter-spacing:.05em;">납품요청일 From</label>
            <input type="date" class="inp" id="rf-dueFrom" onchange="applyImportFilter()"
              style="width:130px;height:28px;padding:3px 8px;font-size:12px;">
          </div>
          <div style="display:flex;flex-direction:column;gap:3px;">
            <label style="font-size:10px;color:var(--text-faint);letter-spacing:.05em;">납품요청일 To</label>
            <input type="date" class="inp" id="rf-dueTo" onchange="applyImportFilter()"
              style="width:130px;height:28px;padding:3px 8px;font-size:12px;">
          </div>
          <div style="display:flex;flex-direction:column;gap:3px;">
            <label style="font-size:10px;color:var(--text-faint);letter-spacing:.05em;">생성자</label>
            <input class="inp" id="rf-createdBy" placeholder="SAP" oninput="applyImportFilter()"
              style="width:80px;height:28px;padding:3px 8px;font-size:12px;">
          </div>
          <div style="display:flex;flex-direction:column;gap:3px;">
            <label style="font-size:10px;color:var(--text-faint);letter-spacing:.05em;">비고</label>
            <select class="inp" id="rf-excluded" onchange="applyImportFilter()"
              style="width:100px;height:28px;padding:3px 8px;font-size:12px;">
              <option value="">전체</option>
              <option value="0">정상</option>
              <option value="1">예외(거부)</option>
            </select>
          </div>
          <button class="btn btn-ghost btn-sm" onclick="resetImportResultFilter()" style="height:28px;padding:3px 10px;font-size:12px;margin-bottom:1px;">
            <i class="fas fa-undo"></i> 초기화
          </button>
        </div>
      </div>
      <div style="overflow-x:auto;max-height:420px;overflow-y:auto;">
        <table class="data-table" id="import-table">
          <thead>
            <tr>
              <th class="center" style="width:36px;"><input type="checkbox" id="chk-head-import" onchange="toggleAllImport(this.checked)"></th>
              <th class="center">플랜트</th><th>판매문서번호</th><th>항목</th><th>오더유형</th><th>납품처</th><th>호기</th>
              <th class="num">평량(g)</th><th class="num">지폭(mm)</th>
              <th class="num">수량(TON)</th><th class="num">수량(R)</th><th class="num">수량(SOK)</th>
              <th>단위</th><th>자재코드</th><th>생성일</th><th>생성자</th><th>납품요청일</th><th>상태</th><th>비고</th>
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
          <input class="inp" id="lq-basisWeight" type="number" placeholder="예) 350" min="1" list="bw-list-order" oninput="filterOrderList()" style="width:100%;">
          <datalist id="bw-list-order"></datalist>
        </div>
        <div><label class="field-label">상태</label>
          <select class="inp" id="lq-status" onchange="filterOrderList()">
            <option value="">전체</option>
            <option value="OPEN">OPEN</option>
            <option value="ASSIGNED">ASSIGNED</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>
        </div>
        <div><label class="field-label">플랜트</label>
          <select class="inp" id="lq-plant" onchange="filterOrderList()">
            <option value="">전체</option>
            <option value="P100">P100</option>
            <option value="P200">P200</option>
            <option value="P300">P300</option>
            <option value="P400">P400</option>
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
              <th>오더번호</th><th>항목</th><th>오더유형</th><th>납품처</th><th class="center">플랜트</th><th>호기</th>
              <th class="num">평량(g)</th><th class="num">지폭(mm)</th>
              <th class="num">수량(TON)</th><th class="num">수량(R)</th><th class="num">수량(SOK)</th>
              <th>자재코드</th><th>납기일</th><th>상태</th><th>예외</th><th class="center">액션</th>
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
      <!-- 요약 스탯 (동적 렌더링) -->
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:14px;">
        <div class="stat-mini"><div class="sv" id="rfc-import-stat-total"  style="color:#38bdf8;">0</div><div class="sl">총 호출 횟수</div></div>
        <div class="stat-mini"><div class="sv" id="rfc-import-stat-ok"     style="color:#4ade80;">0</div><div class="sl">성공</div></div>
        <div class="stat-mini"><div class="sv" id="rfc-import-stat-fail"   style="color:#f87171;">0</div><div class="sl">실패</div></div>
        <div class="stat-mini"><div class="sv" id="rfc-import-stat-count"  style="color:#60a5fa;">0</div><div class="sl">총 수신 건수</div></div>
      </div>
      <!-- 이력 테이블 -->
      <div class="section-card" style="overflow:hidden;">
        <div class="card-header">
          <div class="card-label"><i class="fas fa-history" style="color:#38bdf8;"></i>호출 이력</div>
          <span class="count-badge" id="rfc-import-count-badge">0 건</span>
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
            <tbody id="rfc-import-tbody">
              <tr><td colspan="11" class="empty-state">판매오더 불러오기 이력이 없습니다.</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 생산오더 전송 결과 -->
    <div id="rfc-panel-send" style="display:none;">
      <!-- 요약 스탯 (동적 렌더링) -->
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:14px;">
        <div class="stat-mini"><div class="sv" id="rfc-send-stat-total"  style="color:#38bdf8;">0</div><div class="sl">총 전송 횟수</div></div>
        <div class="stat-mini"><div class="sv" id="rfc-send-stat-ok"     style="color:#4ade80;">0</div><div class="sl">성공</div></div>
        <div class="stat-mini"><div class="sv" id="rfc-send-stat-fail"   style="color:#f87171;">0</div><div class="sl">실패</div></div>
        <div class="stat-mini"><div class="sv" id="rfc-send-stat-count"  style="color:#60a5fa;">0</div><div class="sl">총 전송 건수</div></div>
      </div>
      <!-- 이력 테이블 -->
      <div class="section-card" style="overflow:hidden;">
        <div class="card-header">
          <div class="card-label"><i class="fas fa-paper-plane" style="color:#a78bfa;"></i>전송 이력</div>
          <span class="count-badge" id="rfc-send-count-badge">0 건</span>
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
            <tbody id="rfc-send-tbody">
              <tr><td colspan="11" class="empty-state">생산오더 전송 이력이 없습니다.</td></tr>
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
          <input class="inp" id="pl-basisWeight" type="number" placeholder="예) 350" min="1" list="bw-list-prod" oninput="filterProdList()" style="width:100%;">
          <datalist id="bw-list-prod"></datalist>
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
              <tr><td style="font-family:monospace;color:#a78bfa;">MID(3,3)</td><td>지종코드</td><td>원지 종류 식별 코드 (3자리)</td></tr>
              <tr><td style="font-family:monospace;color:#a78bfa;">RIGHT(1)</td><td>포장방법</td><td>A=속포장 / B=벌크 / 0=Roll</td></tr>
              <tr><td style="font-family:monospace;color:#a78bfa;">MID(6,3)</td><td>평량</td><td>g/m²</td></tr>
              <tr><td style="font-family:monospace;color:#a78bfa;">MID(10,4)</td><td>지폭</td><td>mm</td></tr>
              <tr><td style="font-family:monospace;color:#a78bfa;">MID(14,4)</td><td>지장</td><td>mm</td></tr>
            </tbody>
          </table>
          <div style="padding:14px;background:var(--bg-base);border-radius:8px;border:1px solid var(--border);">
            <div style="font-size:11px;font-weight:700;color:var(--text-muted);margin-bottom:8px;text-transform:uppercase;letter-spacing:.05em;">예시</div>
            <div style="font-family:monospace;font-size:14px;color:#60a5fa;letter-spacing:2px;margin-bottom:10px;">F2<span style="color:#22d3ee;">KRF</span>220_0800____B</div>
            <div style="display:flex;flex-direction:column;gap:4px;">
              <div style="display:flex;gap:8px;font-size:12px;"><span style="color:#34d399;font-family:monospace;min-width:28px;">F</span><span style="color:var(--text-muted);">제품</span></div>
              <div style="display:flex;gap:8px;font-size:12px;"><span style="color:#60a5fa;font-family:monospace;min-width:28px;">2</span><span style="color:var(--text-muted);">2호기</span></div>
              <div style="display:flex;gap:8px;font-size:12px;"><span style="color:#22d3ee;font-family:monospace;min-width:28px;">KRF</span><span style="color:var(--text-muted);">지종코드</span></div>
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
    <div style="display:flex;gap:8px;align-items:center;">
      <!-- 조회 모드 버튼 (기본 표시) -->
      <div id="constraint-view-btns" style="display:flex;gap:8px;">
        <span id="constraint-view-badge" style="display:flex;align-items:center;gap:5px;padding:4px 10px;border-radius:6px;background:var(--bg-input);border:1px solid var(--border);font-size:12px;color:var(--text-muted);">
          <i class="fas fa-eye"></i> 조회 모드
        </span>
        <button class="btn btn-sm btn-primary" onclick="constraintStartEdit()"><i class="fas fa-pencil-alt"></i> 수정</button>
      </div>
      <!-- 편집 모드 버튼 (수정 클릭 후 표시) -->
      <div id="constraint-edit-btns" style="display:none;gap:8px;">
        <button class="btn btn-sm btn-secondary" onclick="resetConstraints()"><i class="fas fa-undo"></i> 기본값 복원</button>
        <button class="btn btn-sm btn-secondary" onclick="constraintCancelEdit()"><i class="fas fa-times"></i> 취소</button>
        <button class="btn btn-sm btn-primary" onclick="saveConstraints()"><i class="fas fa-save"></i> 저장</button>
      </div>
    </div>
  </div>
  <div class="page-scroll">

    <div id="constraint-save-banner" style="display:none;margin-bottom:12px;padding:10px 16px;border-radius:8px;border:1px solid #34d399;color:#16a34a;font-size:13px;align-items:center;gap:8px;">
      <i class="fas fa-check-circle"></i> 제약조건이 저장되었습니다.
    </div>
    <div id="constraint-edit-banner" style="display:none;margin-bottom:12px;padding:10px 16px;border-radius:8px;border:1px solid #f59e0b;background:rgba(245,158,11,0.07);color:#b45309;font-size:13px;align-items:center;gap:8px;">
      <i class="fas fa-pencil-alt"></i> 수정 모드 — 변경 후 <b>저장</b> 버튼을 눌러 적용하세요. 취소하면 변경 내용이 되돌아갑니다.
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
    <!-- DB 저장 상태 배너 -->
    <div id="sim-db-banner" style="margin-top:10px;padding:9px 14px;border-radius:7px;border:1px solid var(--border);font-size:12px;display:flex;align-items:center;gap:10px;">
      <i id="sim-db-icon" class="fas fa-database" style="flex-shrink:0;font-size:14px;"></i>
      <div style="flex:1;min-width:0;">
        <span id="sim-db-text" style="font-weight:600;">DB 상태 확인 중...</span>
        <span id="sim-db-sub" style="margin-left:8px;font-size:11px;color:var(--text-muted);"></span>
      </div>
      <button id="sim-db-go-btn" onclick="goPage('order-import')" style="display:none;padding:4px 12px;font-size:11px;font-weight:700;border-radius:5px;border:none;cursor:pointer;background:#3b82f6;color:#fff;white-space:nowrap;">
        <i class="fas fa-download"></i> 판매오더 불러오기
      </button>
      <button id="sim-db-refresh-btn" onclick="loadSimulation()" style="display:none;padding:4px 10px;font-size:11px;font-weight:600;border-radius:5px;border:1px solid var(--border);cursor:pointer;background:var(--bg-input);color:var(--text-muted);white-space:nowrap;">
        <i class="fas fa-sync-alt"></i> 새로고침
      </button>
    </div>
    <!-- 상태 표시줄 -->
    <div id="sim-status-banner" style="margin-top:6px;padding:8px 14px;border-radius:7px;background:var(--bg-input);border:1px solid var(--border);font-size:12px;display:flex;align-items:center;gap:8px;">
      <i class="fas fa-info-circle" style="color:#60a5fa;flex-shrink:0;"></i>
      <span id="sim-status-text" style="color:var(--text-muted);">조회 조건을 설정하고 <b>생성</b> 버튼을 눌러 시뮬레이션을 시작하세요.</span>
      <!-- 세션 코드 뱃지 -->
      <span id="sim-session-code" style="display:none;margin-left:10px;padding:2px 10px;border-radius:5px;background:var(--bg-card);border:1px solid #a78bfa55;font-family:monospace;font-size:11px;font-weight:700;color:#a78bfa;letter-spacing:.5px;"></span>
      <span id="sim-state-badge" style="margin-left:auto;flex-shrink:0;"></span>
    </div>
    <!-- 진행률 오버레이 -->
    <div id="sim-progress-overlay" style="display:none;margin-top:6px;padding:12px 16px;border-radius:8px;background:var(--bg-input);border:1px solid #a78bfa44;">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
        <i class="fas fa-cog fa-spin" style="color:#a78bfa;font-size:14px;"></i>
        <span id="sim-progress-msg" style="font-size:12px;font-weight:600;color:var(--text);">시뮬레이션 준비 중...</span>
        <span id="sim-progress-pct" style="margin-left:auto;font-size:13px;font-weight:800;color:#a78bfa;">0%</span>
      </div>
      <div style="height:6px;border-radius:4px;background:var(--border);overflow:hidden;">
        <div id="sim-progress-bar" style="height:100%;width:0%;border-radius:4px;background:linear-gradient(90deg,#7c3aed,#a78bfa);transition:width .3s ease;"></div>
      </div>
    </div>
  </div>

  <div class="page-scroll" style="padding-bottom:72px;">
    <div style="display:grid;grid-template-columns:260px 1fr;gap:14px;align-items:start;">

      <!-- 좌: 조회 조건 패널 -->
      <div style="display:flex;flex-direction:column;gap:12px;">
        <div class="section-card">
          <div class="section-title"><i class="fas fa-search" style="color:#60a5fa;"></i>조회 조건</div>
          <div class="section-body" style="display:flex;flex-direction:column;gap:10px;">
            <div class="form-group">
              <label class="form-label">플랜트</label>
              <select class="form-select" id="sim-plant">
                <option value="">전체</option>
                <option value="P100">P100</option>
                <option value="P200">P200</option>
                <option value="P300">P300</option>
                <option value="P400">P400</option>
              </select>
            </div>
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
              <input type="number" class="form-input" id="sim-basisWeight"
                placeholder="전체" min="1" list="bw-list-sim"
                style="width:100%;">
              <datalist id="bw-list-sim"></datalist>
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
                  <th>오더번호</th><th>납품처</th><th class="center">호기</th><th class="center">평량</th><th class="center">지폭</th><th class="center">수량</th><th>자재코드</th><th>납기일</th><th>유형</th><th>예외</th>
                </tr>
              </thead>
              <tbody id="sim-order-tbody">
                <tr><td colspan="11" class="empty-state">조회 조건을 설정하고 생성 버튼을 눌러주세요.</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 조합 결과 -->
        <div class="section-card" id="sim-result-panel" style="display:none;">
          <div class="section-title">
            <i class="fas fa-th" style="color:#a78bfa;"></i>지폭조합 결과
            <span id="sim-result-count" class="count-badge" style="margin-left:8px;"></span>
            <!-- 알고리즘 배지 -->
            <span style="margin-left:8px;padding:2px 8px;border-radius:4px;
                         background:#1e1b4b;border:1px solid #7c3aed55;
                         font-size:10px;font-weight:700;color:#a78bfa;letter-spacing:.4px;
                         font-family:monospace;">
              FFD+납기가중치
            </span>
            <!-- 세션 코드 뱃지 — 확정 후 표시 -->
            <span id="sim-result-simcode"
              style="display:none;margin-left:10px;padding:2px 10px;border-radius:5px;
                     background:var(--bg-base);border:1px solid #a78bfa88;
                     font-family:monospace;font-size:11px;font-weight:800;
                     color:#a78bfa;letter-spacing:.5px;">
            </span>
            <label style="margin-left:auto;display:flex;align-items:center;gap:6px;font-size:12px;font-weight:500;cursor:pointer;user-select:none;">
              <input type="checkbox" id="combo-chk-all" checked onchange="comboSelectAll(this.checked)"
                style="width:15px;height:15px;cursor:pointer;accent-color:#7c3aed;">
              전체선택
            </label>
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
                <tr><th>오더번호</th><th>납품처</th><th>호기</th><th>평량</th><th>지폭</th><th>수량</th><th>자재코드</th><th>유형</th><th>분리사유</th></tr>
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

<!-- ══ AI 분석 어시스턴트 슬라이드업 패널 (전체 앱 고정 우하단) ══ -->
<div id="sim-ai-panel" style="position:fixed;bottom:0;left:260px;right:0;z-index:200;display:none;flex-direction:column;background:var(--bg-card,#0f172a);border-top:2px solid #7c3aed;box-shadow:0 -6px 32px rgba(0,0,0,.45),0 -2px 8px rgba(124,58,237,.3);height:52px;overflow:hidden;transition:height .3s cubic-bezier(.4,0,.2,1);">

  <!-- 탭 핸들 (항상 표시) -->
  <div onclick="toggleAiPanel()" style="display:flex;align-items:center;gap:10px;padding:0 20px;height:52px;cursor:pointer;flex-shrink:0;background:linear-gradient(90deg,rgba(99,102,241,.15) 0%,transparent 60%);user-select:none;">
    <div style="width:26px;height:26px;border-radius:7px;background:linear-gradient(135deg,#6366f1,#a78bfa);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
      <i class="fas fa-robot" style="color:#fff;font-size:12px;"></i>
    </div>
    <div style="flex:1;min-width:0;">
      <span style="font-size:13px;font-weight:700;color:var(--text);">AI 분석 어시스턴트</span>
      <span style="font-size:12px;font-weight:400;color:#0f172a;background:#fbbf24;padding:2px 9px;border-radius:20px;margin-left:10px;letter-spacing:.2px;">클릭하여 ⏫⏬</span>
    </div>
    <div style="display:flex;align-items:center;gap:5px;font-size:11px;color:var(--text-muted);margin-right:8px;">
      <span id="ai-status-indicator" style="width:7px;height:7px;border-radius:50%;background:#6b7280;display:inline-block;"></span>
      <span id="ai-status-label">대기 중</span>
    </div>
    <button onclick="event.stopPropagation();clearAiChat()" title="대화 초기화" style="padding:3px 9px;font-size:11px;border-radius:5px;border:1px solid var(--border);background:transparent;color:var(--text-muted);cursor:pointer;flex-shrink:0;">
      <i class="fas fa-trash-alt"></i>
    </button>
    <i id="ai-panel-chevron" class="fas fa-chevron-up" style="margin-left:4px;font-size:11px;color:#a78bfa;transition:transform .3s;flex-shrink:0;"></i>
  </div>

  <!-- 본문 (펼쳐졌을 때) -->
  <div style="flex:1;display:flex;flex-direction:column;overflow:hidden;padding:0 20px 12px;min-height:0;">

    <!-- 대화 히스토리 -->
    <div id="ai-chat-history" style="flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:10px;padding:10px 0 6px;min-height:0;">
      <div id="ai-chat-empty" style="text-align:center;padding:28px 0 16px;color:var(--text-muted);font-size:12px;">
        <i class="fas fa-lightbulb" style="color:#a78bfa;font-size:24px;margin-bottom:10px;display:block;"></i>
        시뮬레이션 결과 또는 제지 생산 계획에 대해 자유롭게 질문하세요.<br>
        <span style="color:var(--text-subtle);font-size:11px;">Loss 분석 · 조합 최적화 · 납기 우선순위 · 호기 부하 등 무엇이든 질문 가능</span>
      </div>
    </div>

    <!-- 빠른 질문 버튼 -->
    <div id="ai-quick-btns" style="display:flex;gap:6px;flex-wrap:wrap;padding:8px 0 6px;border-top:1px solid var(--border);">
      <button class="ai-quick-btn" onclick="sendAiQuick('현재 시뮬레이션 결과의 Loss율이 높은 조합은 무엇이며, 개선 방안을 제안해주세요.')">
        <i class="fas fa-chart-line"></i> Loss 분석
      </button>
      <button class="ai-quick-btn" onclick="sendAiQuick('Loss가 발생한 부분을 재단하여 활용할 수 있는 방법을 제안해주세요.')">
        <i class="fas fa-cut"></i> Loss 활용방안
      </button>
      <button class="ai-quick-btn" onclick="sendAiQuick('현재 조합에서 오더를 재배치하여 더 효율적인 조합을 만들 수 있는지 분석해주세요.')">
        <i class="fas fa-random"></i> 조합 최적화
      </button>
      <button class="ai-quick-btn" onclick="sendAiQuick('납기일 기준으로 우선순위가 높은 오더를 분석하고, 생산 순서를 추천해주세요.')">
        <i class="fas fa-calendar-check"></i> 납기 우선순위
      </button>
      <button class="ai-quick-btn" onclick="sendAiQuick('2호기와 3호기의 부하 분산이 적절한지 분석하고 개선안을 제시해주세요.')">
        <i class="fas fa-balance-scale"></i> 호기 부하분산
      </button>
    </div>

    <!-- 입력창 -->
    <div style="display:flex;gap:8px;align-items:flex-end;">
      <textarea id="ai-input" placeholder="제지 생산 계획에 대해 자유롭게 질문하세요... (Shift+Enter: 줄바꿈 / Enter: 전송)"
        style="flex:1;resize:none;height:44px;max-height:160px;padding:10px 14px;border-radius:8px;border:1px solid var(--border);background:var(--bg-input);color:var(--text);font-size:13px;font-family:inherit;line-height:1.5;outline:none;overflow-y:hidden;"
        onkeydown="aiInputKeydown(event)" oninput="aiInputResize(this)"></textarea>
      <button id="ai-send-btn" onclick="sendAiMessage()" style="height:44px;padding:0 20px;border-radius:8px;border:none;background:linear-gradient(135deg,#6366f1,#a78bfa);color:#fff;font-size:13px;font-weight:700;cursor:pointer;white-space:nowrap;flex-shrink:0;transition:opacity .2s;">
        <i class="fas fa-paper-plane"></i> 전송
      </button>
    </div>
  </div>
</div><!-- /sim-ai-panel -->

<!-- ============================================================
     지폭조합 조회 페이지
     ============================================================ -->
<div id="page-sim-history" style="display:none;height:100%;flex-direction:column;">
  <div class="page-header">
    <div style="display:flex;align-items:center;justify-content:space-between;width:100%;">
      <div>
        <div class="page-title"><i class="fas fa-history" style="color:#a78bfa;"></i>지폭조합 조회</div>
        <div class="page-sub">확정된 지폭조합 시뮬레이션 세션 이력 조회</div>
      </div>
      <div style="display:flex;align-items:center;gap:6px;">
        <button class="sim-action-btn sab-unconfirm" id="sh-btn-unconfirm" onclick="shUnconfirm()" disabled title="선택된 세션의 확정을 취소합니다">
          <i class="fas fa-undo-alt"></i> 확정취소
        </button>
        <div style="width:1px;height:24px;background:var(--border);margin:0 2px;"></div>
        <button class="sim-action-btn sab-order" id="sh-btn-order" onclick="shSendOrder()" disabled title="선택된 세션의 조합으로 점보롤 생산오더를 생성합니다">
          <i class="fas fa-paper-plane"></i> 오더생성
        </button>
        <div style="width:1px;height:24px;background:var(--border);margin:0 2px;"></div>
        <button class="btn btn-ghost btn-sm" onclick="loadSimHistory()">
          <i class="fas fa-sync-alt"></i> 새로고침
        </button>
      </div>
    </div>
  </div>

  <div class="page-scroll" style="padding-top:14px;">

    <!-- 요약 통계 -->
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:14px;">
      <div class="stat-mini"><div class="sv" id="sh-stat-total"   style="color:#a78bfa;">0</div><div class="sl">총 세션</div></div>
      <div class="stat-mini"><div class="sv" id="sh-stat-confirm" style="color:#38bdf8;">0</div><div class="sl">확정</div></div>
      <div class="stat-mini"><div class="sv" id="sh-stat-sent"    style="color:#4ade80;">0</div><div class="sl">SAP전송</div></div>
      <div class="stat-mini"><div class="sv" id="sh-stat-combos"  style="color:#f59e0b;">0</div><div class="sl">총 확정조합</div></div>
    </div>

    <!-- 필터 바 -->
    <div class="section-card" style="padding:12px 18px;margin-bottom:12px;">
      <div class="search-grid">
        <div>
          <label class="field-label">상태</label>
          <select id="sh-filter-status" class="inp" onchange="applySimHistoryFilter()">
            <option value="">전체</option>
            <option value="CONFIRMED">확정</option>
            <option value="SENT">SAP전송</option>
          </select>
        </div>
        <div>
          <label class="field-label">호기</label>
          <select id="sh-filter-machine" class="inp" onchange="applySimHistoryFilter()">
            <option value="">전체</option>
            <option value="2">2호기</option>
            <option value="3">3호기</option>
          </select>
        </div>
        <div>
          <label class="field-label">세션코드</label>
          <input id="sh-filter-code" class="inp" type="text" placeholder="S-2026-..." oninput="applySimHistoryFilter()">
        </div>
        <div>
          <label class="field-label">기간</label>
          <input id="sh-filter-date" class="inp" type="date" onchange="applySimHistoryFilter()">
        </div>
        <div style="display:flex;align-items:flex-end;gap:8px;">
          <button class="btn btn-ghost btn-sm" onclick="resetSimHistoryFilter()"><i class="fas fa-undo"></i> 초기화</button>
        </div>
      </div>
    </div>

    <!-- 세션 목록 -->
    <div class="section-card" style="overflow:hidden;">
      <div class="card-header">
        <div class="card-label"><i class="fas fa-list" style="color:#a78bfa;"></i>세션 목록</div>
        <span class="count-badge" id="sh-count-badge">0 건</span>
      </div>
      <div style="overflow-x:auto;">
        <table class="data-table">
          <thead>
            <tr>
              <th class="center" style="width:36px;"></th>
              <th>세션코드</th>
              <th class="center">상태</th>
              <th class="center">호기</th>
              <th class="center">평량</th>
              <th class="num">대상오더</th>
              <th class="num">전체조합</th>
              <th class="num">확정조합</th>
              <th class="num">전송조합</th>
              <th>확정일시</th>
              <th>전송일시</th>
              <th class="center">작업</th>
            </tr>
          </thead>
          <tbody id="sh-session-tbody">
            <tr><td colspan="12" class="empty-state">확정된 시뮬레이션 세션이 없습니다.</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 디테일 패널 (행 클릭 시 펼침) -->
    <div id="sh-detail-panel" style="display:none;margin-top:12px;">
      <div class="section-card" style="overflow:hidden;">
        <div class="card-header">
          <div class="card-label">
            <i class="fas fa-sitemap" style="color:#38bdf8;"></i>
            조합 디테일
            <span id="sh-detail-simcode" style="margin-left:8px;font-family:monospace;font-size:11px;font-weight:800;color:#a78bfa;"></span>
          </div>
          <span class="count-badge" id="sh-detail-count-badge">0 건</span>
          <button onclick="closeSimHistoryDetail()" style="margin-left:10px;padding:2px 8px;font-size:11px;border-radius:5px;border:1px solid var(--border);background:transparent;color:var(--text-muted);cursor:pointer;">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div style="overflow-x:auto;max-height:400px;overflow-y:auto;">
          <table class="data-table">
            <thead>
              <tr>
                <th class="center">#</th>
                <th class="center">호기</th>
                <th class="num">평량(g)</th>
                <th class="num">전체지폭(mm)</th>
                <th>폭 구성</th>
                <th class="center">폭수</th>
                <th class="num">총량(T)</th>
                <th class="num">Loss(%)</th>
                <th class="num">오더수</th>
                <th>포함 오더번호</th>
                <th class="center">상태</th>
                <th>점보롤 오더</th>
              </tr>
            </thead>
            <tbody id="sh-detail-tbody">
              <tr><td colspan="12" class="empty-state">세션을 선택하면 디테일을 조회합니다.</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

  </div><!-- /page-scroll -->
</div><!-- /page-sim-history -->

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
  'sim-history' : '지폭조합 조회',
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

/* ══════════════════════════════════════
   RFC 통신결과 로드
══════════════════════════════════════ */
async function loadRfcLog() {
  try {
    const res  = await fetch(API + '/klean-aps-api/rfc-logs')
    const data = await res.json()
    if (!data.success) return

    const is  = data.importStats || {}
    const ss  = data.sendStats   || {}
    const importList = data.import || []
    const sendList   = data.send   || []

    // ── 판매오더 불러오기 통계
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v }
    set('rfc-import-stat-total',  is.total      || 0)
    set('rfc-import-stat-ok',     is.success    || 0)
    set('rfc-import-stat-fail',   is.fail       || 0)
    set('rfc-import-stat-count',  is.totalCount || 0)
    set('rfc-import-count-badge', (is.total || 0) + ' 건')

    // ── 판매오더 이력 테이블
    const importTbody = document.getElementById('rfc-import-tbody')
    if (importTbody) {
      if (!importList.length) {
        importTbody.innerHTML = '<tr><td colspan="11" class="empty-state">판매오더 불러오기 이력이 없습니다.</td></tr>'
      } else {
        importTbody.innerHTML = importList.map((l, idx) => {
          const resultBadge = l.result === '성공'
            ? '<span class="badge b-assigned" style="font-size:10px;">성공</span>'
            : '<span class="badge b-cancel"   style="font-size:10px;">실패</span>'
          return '<tr>' +
            '<td class="center" style="color:var(--text-faint);font-size:11px;">' + (idx+1) + '</td>' +
            '<td style="font-size:12px;">'                               + l.calledAt    + '</td>' +
            '<td style="font-family:monospace;font-size:11px;color:#38bdf8;">' + l.funcName + '</td>' +
            '<td style="font-size:11px;color:var(--text-muted);">'        + l.condition   + '</td>' +
            '<td class="num">'                                            + l.receivedCount + '</td>' +
            '<td class="num" style="color:#4ade80;">'                    + l.successCount  + '</td>' +
            '<td class="num" style="color:' + (l.failCount > 0 ? '#f87171' : 'var(--text-muted)') + ';">' + l.failCount + '</td>' +
            '<td class="num" style="color:#f59e0b;">'                    + l.alreadyCount  + '</td>' +
            '<td>' + resultBadge + '</td>' +
            '<td style="font-size:11px;color:var(--text-muted);">'        + l.elapsed      + '</td>' +
            '<td style="font-size:12px;">'                                + l.operator     + '</td>' +
            '</tr>'
        }).join('')
      }
    }

    // ── 생산오더 전송 통계
    set('rfc-send-stat-total',  ss.total      || 0)
    set('rfc-send-stat-ok',     ss.success    || 0)
    set('rfc-send-stat-fail',   ss.fail       || 0)
    set('rfc-send-stat-count',  ss.totalCount || 0)
    set('rfc-send-count-badge', (ss.total || 0) + ' 건')

    // ── 생산오더 이력 테이블
    const sendTbody = document.getElementById('rfc-send-tbody')
    if (sendTbody) {
      if (!sendList.length) {
        sendTbody.innerHTML = '<tr><td colspan="11" class="empty-state">생산오더 전송 이력이 없습니다.</td></tr>'
      } else {
        sendTbody.innerHTML = sendList.map((l, idx) => {
          const resultBadge = l.result === '성공'
            ? '<span class="badge b-assigned" style="font-size:10px;">성공</span>'
            : '<span class="badge b-cancel"   style="font-size:10px;">' + l.result + '</span>'
          const failColor = l.failCount > 0 ? '#f87171' : 'var(--text-muted)'
          return '<tr>' +
            '<td class="center" style="color:var(--text-faint);font-size:11px;">' + (idx+1) + '</td>' +
            '<td style="font-size:12px;">'                                         + l.calledAt     + '</td>' +
            '<td style="font-family:monospace;font-size:11px;color:#a78bfa;">'     + l.funcName     + '</td>' +
            '<td style="font-family:monospace;font-size:11px;color:#38bdf8;">'     + l.simId        + '</td>' +
            '<td class="num">'                                                     + l.sentCount    + '</td>' +
            '<td class="num" style="color:#4ade80;">'                             + l.successCount + '</td>' +
            '<td class="num" style="color:' + failColor + ';">'                   + l.failCount    + '</td>' +
            '<td>' + resultBadge + '</td>' +
            '<td style="font-size:11px;color:var(--text-muted);">'                 + l.elapsed      + '</td>' +
            '<td style="font-size:12px;">'                                         + l.operator     + '</td>' +
            '<td style="font-size:11px;color:' + (l.failCount > 0 ? '#f87171' : 'var(--text-muted)') + ';">' + (l.remark||'-') + '</td>' +
            '</tr>'
        }).join('')
      }
    }
  } catch(e) {
    console.error('loadRfcLog error:', e)
  }
}

/* ══════════════════════════════════════
   지폭조합 조회 (sim-history)
══════════════════════════════════════ */
let _shAllSessions  = []    // 전체 세션 캐시 (필터용)
let _shCurrentCode  = ''    // 현재 디테일에서 선택된 세션코드
let _shCurrentSess  = null  // 현재 선택된 세션 헤더 객체

async function loadSimHistory() {
  try {
    const res  = await fetch(API + '/klean-aps-api/sim-sessions')
    const data = await res.json()
    if (!data.success) return

    _shAllSessions = data.data || []

    // 요약 통계
    const total   = _shAllSessions.length
    const confirm = _shAllSessions.filter(s => s.status === 'CONFIRMED').length
    const sent    = _shAllSessions.filter(s => s.status === 'SENT').length
    const combos  = _shAllSessions.reduce((s, h) => s + (h.confirmedCombos || 0), 0)
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v }
    set('sh-stat-total',   total)
    set('sh-stat-confirm', confirm)
    set('sh-stat-sent',    sent)
    set('sh-stat-combos',  combos)

    // 테이블 렌더
    renderSimHistoryTable(_shAllSessions)

    // 디테일 패널 닫기
    closeSimHistoryDetail()
  } catch(e) {
    console.error('loadSimHistory error:', e)
    toast('시뮬레이션 이력 로딩 실패', 'err')
  }
}

function renderSimHistoryTable(list) {
  const tbody = document.getElementById('sh-session-tbody')
  const badge = document.getElementById('sh-count-badge')
  if (badge) badge.textContent = list.length + ' 건'
  if (!tbody) return

  if (!list.length) {
    tbody.innerHTML = '<tr><td colspan="12" class="empty-state">확정된 시뮬레이션 세션이 없습니다.<br><small style="color:var(--text-faint);">지폭조합 시뮬레이션에서 조합을 확정하면 여기에 표시됩니다.</small></td></tr>'
    return
  }

  tbody.innerHTML = list.map((h, idx) => {
    // 상태 뱃지
    const statusBadge = h.status === 'SENT'
      ? '<span class="badge b-assigned" style="font-size:10px;"><i class="fas fa-paper-plane"></i> SAP전송</span>'
      : '<span class="badge" style="font-size:10px;background:var(--badge-info-bg,#1e3a5f);color:#38bdf8;border:1px solid #38bdf855;"><i class="fas fa-check-double"></i> 확정</span>'

    // 호기/평량 표시
    const machine = h.machineNo ? h.machineNo + '호기' : '전체'
    const bw      = h.basisWeight ? h.basisWeight + 'g' : '전체'

    // 전송 조합 수 색상
    const sentColor = h.sentCombos > 0 ? '#4ade80' : 'var(--text-faint)'

    return '<tr style="cursor:pointer;" data-simcode="'+h.simCode+'" onclick="loadSimHistoryDetail(this.dataset.simcode)" title="클릭하여 디테일 조회">'  +
      '<td class="center" style="color:var(--text-faint);font-size:11px;">' + (idx+1) + '</td>' +
      '<td><span style="font-family:monospace;font-weight:800;font-size:12px;color:#a78bfa;letter-spacing:.3px;">' + h.simCode + '</span></td>' +
      '<td class="center">' + statusBadge + '</td>' +
      '<td class="center"><span class="machine-badge" style="font-size:11px;">' + machine + '</span></td>' +
      '<td class="center" style="font-weight:700;">' + bw + '</td>' +
      '<td class="num">' + (h.targetOrders || 0) + '</td>' +
      '<td class="num">' + (h.combosTotal  || 0) + '</td>' +
      '<td class="num" style="font-weight:700;color:#38bdf8;">' + (h.confirmedCombos || 0) + '</td>' +
      '<td class="num" style="font-weight:700;color:' + sentColor + ';">' + (h.sentCombos || 0) + '</td>' +
      '<td style="font-size:11px;color:var(--text-muted);">' + (h.confirmedAt || '-') + '</td>' +
      '<td style="font-size:11px;color:var(--text-muted);">' + (h.sentAt || '-') + '</td>' +
      '<td class="center">' +
        '<button onclick="event.stopPropagation();loadSimHistoryDetail(this.parentElement.parentElement.dataset.simcode)" ' +
          'style="padding:2px 8px;font-size:11px;border-radius:4px;border:1px solid var(--border);background:transparent;color:var(--text-muted);cursor:pointer;">' +
          '<i class="fas fa-search"></i>' +
        '</button>' +
      '</td>' +
    '</tr>'
  }).join('')
}

async function loadSimHistoryDetail(simCode) {
  // 선택된 행 하이라이트
  const allRows = document.querySelectorAll('#sh-session-tbody tr')
  allRows.forEach(r => r.style.background = '')
  const clickedRows = document.querySelectorAll('#sh-session-tbody tr')
  clickedRows.forEach(r => {
    if (r.textContent.includes(simCode)) r.style.background = 'var(--bg-input)'
  })

  try {
    const res  = await fetch(API + '/klean-aps-api/sim-sessions/' + simCode)
    const data = await res.json()
    if (!data.success) { toast('세션 디테일 조회 실패', 'err'); return }

    const details  = data.details || []
    const header   = data.header  || {}
    const panel    = document.getElementById('sh-detail-panel')
    const codeEl   = document.getElementById('sh-detail-simcode')
    const badge    = document.getElementById('sh-detail-count-badge')
    const tbody    = document.getElementById('sh-detail-tbody')
    if (!panel || !tbody) return

    // 현재 선택 세션 저장 (shUnconfirm / shSendOrder 에서 사용)
    _shCurrentCode = simCode
    _shCurrentSess = header

    // 버튼 활성화 — CONFIRMED: 확정취소 O / 오더생성 O  |  SENT: 둘 다 X
    const unconfBtn = document.getElementById('sh-btn-unconfirm')
    const orderBtn  = document.getElementById('sh-btn-order')
    const isConfirmed = header.status === 'CONFIRMED'
    const isSent      = header.status === 'SENT'
    if (unconfBtn) unconfBtn.disabled = !isConfirmed
    if (orderBtn)  orderBtn.disabled  = !isConfirmed

    if (codeEl) codeEl.textContent = simCode
    if (badge)  badge.textContent  = details.length + ' 건'
    panel.style.display = 'block'

    // 디테일 패널로 스크롤
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' })

    if (!details.length) {
      tbody.innerHTML = '<tr><td colspan="12" class="empty-state">확정된 조합 디테일이 없습니다.</td></tr>'
      return
    }

    tbody.innerHTML = details.map((d, idx) => {
      // 지폭 배열 파싱
      let widthsArr = []
      try { widthsArr = JSON.parse(d.widths || '[]') } catch(_) {}
      const widthTags = widthsArr.map(w =>
        '<span style="display:inline-block;padding:1px 6px;margin:1px;background:var(--bg-input);border:1px solid var(--border);border-radius:3px;font-size:10px;font-weight:700;">' + w + 'mm</span>'
      ).join('<span style="font-size:9px;color:var(--text-faint);"> + </span>')

      // 포함 오더번호 파싱
      let orderNosArr = []
      try { orderNosArr = JSON.parse(d.orderNos || '[]') } catch(_) {}
      const orderTags = orderNosArr.map(no =>
        '<span style="font-family:monospace;font-size:10px;color:#60a5fa;margin-right:4px;">' + no + '</span>'
      ).join('')

      // 상태 뱃지
      const statusBadge = d.status === 'SENT'
        ? '<span class="badge b-assigned" style="font-size:10px;"><i class="fas fa-paper-plane"></i> SAP전송</span>'
        : '<span class="badge" style="font-size:10px;background:var(--badge-info-bg,#1e3a5f);color:#38bdf8;border:1px solid #38bdf855;"><i class="fas fa-check-double"></i> 확정</span>'

      // Loss 색상
      const lossColor = Number(d.lossRate) === 0 ? '#34d399'
                      : Number(d.lossRate) < 2   ? '#f59e0b' : '#f87171'

      // 점보롤 오더번호
      const jumboCell = d.jumboOrderNo
        ? '<span style="font-family:monospace;font-size:11px;font-weight:700;color:#34d399;">' + d.jumboOrderNo + '</span>'
        : '<span style="color:var(--text-faint);font-size:11px;">-</span>'

      return '<tr>' +
        '<td class="center" style="color:var(--text-faint);font-size:11px;">' + (idx+1) + '</td>' +
        '<td class="center"><span class="machine-badge" style="font-size:11px;">' + d.machineNo + '호기</span></td>' +
        '<td class="num" style="font-weight:700;">' + d.basisWeight + '</td>' +
        '<td class="num" style="font-weight:800;color:var(--text-main);">' + (d.jumboWidth || 0).toLocaleString() + '</td>' +
        '<td style="white-space:nowrap;">' + widthTags + '</td>' +
        '<td class="center" style="font-weight:700;">' + d.pokCount + '폭</td>' +
        '<td class="num" style="font-weight:700;color:#34d399;">' + Number(d.totalTon).toFixed(3) + '</td>' +
        '<td class="num" style="font-weight:700;color:' + lossColor + ';">' + d.lossRate + '%</td>' +
        '<td class="num">' + d.orderCount + '</td>' +
        '<td style="max-width:220px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + orderTags + '</td>' +
        '<td class="center">' + statusBadge + '</td>' +
        '<td class="center">' + jumboCell + '</td>' +
      '</tr>'
    }).join('')

  } catch(e) {
    console.error('loadSimHistoryDetail error:', e)
    toast('디테일 조회 실패', 'err')
  }
}

function closeSimHistoryDetail() {
  const panel = document.getElementById('sh-detail-panel')
  if (panel) panel.style.display = 'none'
  const allRows = document.querySelectorAll('#sh-session-tbody tr')
  allRows.forEach(r => r.style.background = '')
  // 버튼 비활성화 + 선택 세션 초기화
  _shCurrentCode = ''
  _shCurrentSess = null
  const unconfBtn = document.getElementById('sh-btn-unconfirm')
  const orderBtn  = document.getElementById('sh-btn-order')
  if (unconfBtn) unconfBtn.disabled = true
  if (orderBtn)  orderBtn.disabled  = true
}

function applySimHistoryFilter() {
  const status  = (document.getElementById('sh-filter-status')||{}).value  || ''
  const machine = (document.getElementById('sh-filter-machine')||{}).value || ''
  const code    = ((document.getElementById('sh-filter-code')||{}).value  || '').toLowerCase()
  const date    = (document.getElementById('sh-filter-date')||{}).value    || ''

  let filtered = _shAllSessions
  if (status)  filtered = filtered.filter(s => s.status === status)
  if (machine) filtered = filtered.filter(s => s.machineNo === machine)
  if (code)    filtered = filtered.filter(s => s.simCode.toLowerCase().includes(code))
  if (date)    filtered = filtered.filter(s => (s.confirmedAt || '').startsWith(date))
  renderSimHistoryTable(filtered)
  closeSimHistoryDetail()
}

function resetSimHistoryFilter() {
  const ids = ['sh-filter-status','sh-filter-machine','sh-filter-code','sh-filter-date']
  ids.forEach(id => { const el = document.getElementById(id); if (el) el.value = '' })
  renderSimHistoryTable(_shAllSessions)
  closeSimHistoryDetail()
}

/* ── 지폭조합 조회 화면 — 확정취소 ─────────────────────── */
async function shUnconfirm() {
  if (!_shCurrentCode) { toast('세션을 선택하세요.', 'info'); return }
  if (!_shCurrentSess || _shCurrentSess.status !== 'CONFIRMED') {
    toast('CONFIRMED 상태인 세션만 확정취소 할 수 있습니다.', 'info'); return
  }
  if (!confirm('[' + _shCurrentCode + '] 세션의 확정을 취소하시겠습니까? 취소 후에는 해당 세션이 삭제됩니다.')) return

  try {
    // 세션 삭제 API (CONFIRMED → 삭제 허용)
    const res  = await fetch(API + '/klean-aps-api/sim-sessions/' + _shCurrentCode, { method: 'DELETE' })
    const json = await res.json()
    if (!json.success) throw new Error(json.message || 'API 오류')

    toast('[' + _shCurrentCode + '] 확정취소 완료. 세션이 삭제되었습니다.', 'ok')
    closeSimHistoryDetail()
    await loadSimHistory()   // 목록 새로고침
  } catch(e) {
    toast('확정취소 실패: ' + e.message, 'err')
  }
}

/* ── 지폭조합 조회 화면 — 오더생성 ─────────────────────── */
async function shSendOrder() {
  if (!_shCurrentCode) { toast('세션을 선택하세요.', 'info'); return }
  if (!_shCurrentSess || _shCurrentSess.status !== 'CONFIRMED') {
    toast('CONFIRMED 상태인 세션만 오더생성 할 수 있습니다.', 'info'); return
  }

  const btn = document.getElementById('sh-btn-order')
  if (btn) btn.disabled = true
  toast('[' + _shCurrentCode + '] 점보롤 생산오더 생성 중...', 'ok')

  try {
    // 세션 디테일 조회로 확정 조합 목록 획득
    const detRes  = await fetch(API + '/klean-aps-api/sim-sessions/' + _shCurrentCode)
    const detData = await detRes.json()
    if (!detData.success) throw new Error(detData.message || '세션 조회 실패')

    const details = detData.details || []
    if (!details.length) throw new Error('확정된 조합이 없습니다.')

    const c      = getConstraints()
    const today  = new Date()
    const pad    = n => String(n).padStart(2, '0')
    const todayStr = today.getFullYear() + '-' + pad(today.getMonth()+1) + '-' + pad(today.getDate())

    // 디테일 → jumboOrders 페이로드 변환
    const jumboPayload = details.map(d => {
      let widthsArr = []
      try { widthsArr = JSON.parse(d.widths || '[]') } catch(_) {}
      let orderNosArr = []
      try { orderNosArr = JSON.parse(d.orderNos || '[]') } catch(_) {}
      return {
        machineNo:     d.machineNo,
        basisWeight:   d.basisWeight,
        jumboWidth:    d.jumboWidth,
        totalTon:      Number(d.totalTon),
        pokCount:      d.pokCount,
        widths:        widthsArr,
        sourceComboId: d.comboId,
        sourceOrderNos: orderNosArr,
        planStartDate: todayStr,
        planEndDate:   todayStr,
        lossRate:      d.lossRate,
      }
    })

    // 점보롤 오더 생성 API
    const res  = await fetch('/klean-aps-api/jumbo-orders', {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({ jumboOrders: jumboPayload })
    })
    const json = await res.json()
    if (!json.success) throw new Error(json.message || 'API 오류')

    const created = json.data

    // 세션 SENT 상태 갱신
    const sentItems = created.map(j => ({ comboId: j.sourceComboId, jumboOrderNo: j.jumboOrderNo }))
    await fetch(API + '/klean-aps-api/sim-sessions/' + _shCurrentCode + '/send', {
      method : 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({ sentItems })
    }).catch(() => {})

    toast('[' + _shCurrentCode + '] 점보롤 생산오더 ' + created.length + '건 생성 완료. (SAP RFC 전송)', 'ok')

    // 버튼 비활성화 (SENT 상태로 전환)
    const unconfBtn = document.getElementById('sh-btn-unconfirm')
    if (unconfBtn) unconfBtn.disabled = true
    if (btn) btn.disabled = true

    // 목록 새로고침 후 해당 세션 다시 선택
    await loadSimHistory()
    await loadSimHistoryDetail(_shCurrentCode)

  } catch(e) {
    toast('오더생성 실패: ' + e.message, 'err')
    if (btn) btn.disabled = false
  }
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
const PAGES = ['dashboard','order-import','order-list','prod-list','prod-cancel','simulation','sim-history','rfc-log','constraint','machine','jumbo-list']

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
  if (p === 'sim-history') loadSimHistory()
  if (p === 'constraint')  loadConstraintValues()
  if (p === 'machine')     loadMachine()
  if (p === 'jumbo-list')  loadJumboList()
  if (p === 'rfc-log')     loadRfcLog()
  // AI 패널: 시뮬레이션 페이지에서만 표시
  syncAiPanel(p)
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
  ['fi-plant','fi-orderType','fi-sapOrderNo','fi-machineNo',
   'fi-dateFrom','fi-dateTo','fi-createdBy','fi-dueFrom','fi-dueTo',
   'fi-status','fi-customerName','fi-basisWeight'].forEach(id => {
    const el = document.getElementById(id)
    if (el) el.value = ''
  })
}

// RFC 조회 결과 테이블 필터
function applyImportFilter() {
  const sapOrderNo   = (document.getElementById('rf-sapOrderNo')?.value   || '').trim()
  const orderType    = (document.getElementById('rf-orderType')?.value    || '')
  const customerName = (document.getElementById('rf-customerName')?.value || '').trim()
  const plant        = (document.getElementById('rf-plant')?.value        || '')
  const machineNo    = (document.getElementById('rf-machineNo')?.value    || '')
  const bw           = Number(document.getElementById('rf-basisWeight')?.value) || 0
  const dateFrom     = (document.getElementById('rf-dateFrom')?.value     || '')
  const dateTo       = (document.getElementById('rf-dateTo')?.value       || '')
  const dueFrom      = (document.getElementById('rf-dueFrom')?.value      || '')
  const dueTo        = (document.getElementById('rf-dueTo')?.value        || '')
  const createdBy    = (document.getElementById('rf-createdBy')?.value    || '').trim()
  const excluded     = (document.getElementById('rf-excluded')?.value     || '')

  const filtered = importResult.filter(o => {
    if (sapOrderNo   && !o.sapOrderNo.includes(sapOrderNo))     return false
    if (orderType    && o.orderType !== orderType)              return false
    if (customerName && !o.customerName.includes(customerName)) return false
    if (plant        && o.plant !== plant)                      return false
    if (machineNo    && o.machineNo !== machineNo)              return false
    if (bw           && o.basisWeight !== bw)                  return false
    if (dateFrom     && o.orderDate < dateFrom)                return false
    if (dateTo       && o.orderDate > dateTo)                  return false
    if (dueFrom      && o.dueDate < dueFrom)                   return false
    if (dueTo        && o.dueDate > dueTo)                     return false
    if (createdBy    && !o.createdBy.includes(createdBy))      return false
    if (excluded === '1' && !o.isExcluded)                     return false
    if (excluded === '0' &&  o.isExcluded)                     return false
    return true
  })
  renderImportTable(filtered)
}

function resetImportResultFilter() {
  ['rf-sapOrderNo','rf-orderType','rf-customerName','rf-plant','rf-machineNo',
   'rf-basisWeight','rf-dateFrom','rf-dateTo','rf-dueFrom','rf-dueTo',
   'rf-createdBy','rf-excluded'].forEach(id => {
    const el = document.getElementById(id); if(el) el.value = ''
  })
  renderImportTable(importResult)
}

async function confirmResetAllData() {
  if (!confirm('판매오더 · 점보롤 생산오더 · 생산오더 전체를 삭제합니다.\\n\\n이 작업은 되돌릴 수 없습니다. 계속하시겠습니까?')) return
  try {
    const r = await fetch(API+'/klean-aps-api/reset-all-data', { method:'DELETE' })
    const d = await r.json()
    if (d.success) {
      toast('전체 데이터 삭제 완료 — ' +
        '판매오더 '+d.deleted.salesOrders+'건 / ' +
        '점보롤 '+d.deleted.jumboOrders+'건 / ' +
        '생산오더 '+d.deleted.prodOrders+'건 삭제됨', 'success')
      // 결과 초기화
      document.getElementById('rfc-summary').style.display = 'none'
      document.getElementById('import-table-wrap').innerHTML = ''
    } else {
      toast('삭제 실패: '+(d.message||'알 수 없는 오류'), 'error')
    }
  } catch(e) {
    toast('삭제 오류: '+e, 'error')
  }
}

async function runRfcSync() {
  const params = {
    plant       : document.getElementById('fi-plant').value,
    orderType   : document.getElementById('fi-orderType').value,
    sapOrderNo  : document.getElementById('fi-sapOrderNo').value,
    machineNo   : document.getElementById('fi-machineNo').value,
    dateFrom    : document.getElementById('fi-dateFrom').value,
    dateTo      : document.getElementById('fi-dateTo').value,
    createdBy   : document.getElementById('fi-createdBy').value,
    dueFrom     : document.getElementById('fi-dueFrom').value,
    dueTo       : document.getElementById('fi-dueTo').value,
    status      : document.getElementById('fi-status').value,
    customerName: document.getElementById('fi-customerName').value,
    basisWeight : Number(document.getElementById('fi-basisWeight')?.value) || 0,
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
    updateBwDatalist(importResult)  // datalist 실제 데이터로 갱신

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

    // 결과 필터 바 표시 + 필터 초기화 후 전체 렌더
    document.getElementById('import-filter-bar').style.display = ''
    resetImportResultFilter()
    document.getElementById('btn-save').disabled = false
    selectedImport.clear()

    // 기존 DB 저장 건수 배너 갱신
    try {
      const sr = await fetch(API+'/klean-aps-api/sales-orders')
      const sd = await sr.json()
      const savedTotal = (sd.data || []).length
      const savedBannerEl = document.getElementById('saved-count-banner')
      const savedNumEl = document.getElementById('saved-count-num')
      if (savedBannerEl) savedBannerEl.style.display = savedTotal > 0 ? '' : 'none'
      if (savedNumEl) savedNumEl.textContent = savedTotal
    } catch(_) {}

    toast('판매오더 조회 완료 ('+successN+'건) — 저장할 항목 선택 후 [DB저장] 클릭', 'ok')
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
    tbody.innerHTML = '<tr><td colspan="18" class="empty-state">조회된 데이터가 없습니다.</td></tr>'
    return
  }
  tbody.innerHTML = list.map(o =>
    '<tr data-id="'+o.orderId+'">' +
    '<td class="center"><input type="checkbox" class="chk-import" value="'+o.orderId+'" onchange="toggleSelectImport('+o.orderId+',this.checked)"></td>' +
    '<td class="center"><span style="font-family:monospace;font-size:11px;font-weight:700;padding:1px 6px;border-radius:4px;background:var(--bg-input);border:1px solid var(--border);color:#a78bfa;">'+(o.plant||'-')+'</span></td>' +
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
    '<td style="font-family:monospace;font-size:10px;color:var(--text-muted);white-space:nowrap;">'+(o.matCode||'-')+'</td>' +
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
  const btn = document.getElementById('btn-save')
  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 저장 중...' }

  try {
    const r = await fetch(API+'/klean-aps-api/sales-orders/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderIds: [...selectedImport] })
    })
    const d = await r.json()
    if (!d.success) throw new Error(d.message || '저장 실패')

    // 저장 결과 배너에 반영
    const savedBannerEl = document.getElementById('saved-count-banner')
    if (savedBannerEl) {
      savedBannerEl.style.display = ''
      document.getElementById('saved-count-num').textContent = d.totalSaved
    }

    toast(d.message + ' (총 DB저장: '+d.totalSaved+'건)', 'ok')
    selectedImport.clear()
    updateSaveBtn()
    toggleAllImport(false)
  } catch(e) {
    toast('DB 저장 실패: '+e.message, 'err')
    if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-save"></i> 선택항목 DB저장 ('+selectedImport.size+'건)' }
  }
}

/* ══════════════════════════════════════
   판매오더 조회
══════════════════════════════════════ */
// 평량 datalist 동적 업데이트 (실제 데이터에서 추출)
function updateBwDatalist(orders) {
  const bws = [...new Set(orders.map(o => o.basisWeight).filter(Boolean))].sort((a,b)=>a-b)
  const ids = ['bw-list-import','bw-list-import-cond','bw-list-order','bw-list-prod','bw-list-sim']
  ids.forEach(id => {
    const dl = document.getElementById(id)
    if (!dl) return
    dl.innerHTML = bws.map(bw => '<option value="'+bw+'">'+bw+' g/m²</option>').join('')
  })
}

async function loadOrderList() {
  const r = await fetch(API+'/klean-aps-api/sales-orders')
  const d = await r.json()
  allOrders = d.data || []
  updateBwDatalist(allOrders)
  filterOrderList()
}

function resetListFilter() {
  ['lq-sapOrderNo','lq-orderType','lq-customerName','lq-plant','lq-machineNo',
   'lq-basisWeight','lq-status','lq-excluded'].forEach(id => {
    const el = document.getElementById(id); if(el) el.value = ''
  })
  filterOrderList()
}

function filterOrderList() {
  const sapOrderNo   = document.getElementById('lq-sapOrderNo').value.trim()
  const orderType    = document.getElementById('lq-orderType').value
  const customerName = document.getElementById('lq-customerName').value.trim()
  const plant        = (document.getElementById('lq-plant')||{}).value || ''
  const machineNo    = document.getElementById('lq-machineNo').value
  const basisWeight  = document.getElementById('lq-basisWeight').value
  const status       = document.getElementById('lq-status').value
  const excluded     = document.getElementById('lq-excluded').value

  const filtered = allOrders.filter(o => {
    if (sapOrderNo   && !o.sapOrderNo.includes(sapOrderNo)) return false
    if (orderType    && o.orderType !== orderType) return false
    if (customerName && !o.customerName.includes(customerName)) return false
    if (plant        && o.plant !== plant) return false
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
    tbody.innerHTML = '<tr><td colspan="16" class="empty-state">조회된 오더가 없습니다.</td></tr>'
    return
  }
  tbody.innerHTML = list.map((o,i) =>
    '<tr style="'+(o.isExcluded?'opacity:.5;':'')+'">'+
    '<td class="center" style="color:var(--text-faint);font-size:11px;">'+(i+1)+'</td>'+
    '<td style="color:#60a5fa;font-weight:700;font-family:monospace;">'+o.sapOrderNo+'</td>'+
    '<td style="color:var(--text-muted);font-size:11px;">'+o.sapItemNo+'</td>'+
    '<td>'+renderOrderTypeBadge(o.orderType)+'</td>'+
    '<td style="max-width:150px;overflow:hidden;text-overflow:ellipsis;font-size:12px;">'+o.customerName+'</td>'+
    '<td class="center"><span style="font-family:monospace;font-size:11px;font-weight:700;padding:1px 6px;border-radius:4px;background:var(--bg-input);border:1px solid var(--border);color:#a78bfa;">'+(o.plant||'-')+'</span></td>'+
    '<td class="center"><span class="machine-badge">'+o.machineNo+'호기</span></td>'+
    '<td class="num" style="font-weight:700;">'+o.basisWeight+'</td>'+
    '<td class="num" style="font-weight:700;">'+o.paperWidth.toLocaleString()+'</td>'+
    '<td class="num">'+(o.orderQtyTon!=null ? '<span class="badge b-ton">'+o.orderQtyTon.toFixed(3)+'</span>' : '<span style="color:var(--border);">-</span>')+'</td>'+
    '<td class="num">'+(o.orderQtyR!=null   ? '<span class="badge b-r">'+o.orderQtyR.toLocaleString()+'</span>'   : '<span style="color:var(--border);">-</span>')+'</td>'+
    '<td class="num">'+(o.orderQtySok!=null ? '<span class="badge b-sok">'+o.orderQtySok.toLocaleString()+'</span>' : '<span style="color:var(--border);">-</span>')+'</td>'+
    '<td style="font-family:monospace;font-size:10px;color:var(--text-muted);white-space:nowrap;">'+(o.matCode||'-')+'</td>'+
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
  // 페이지 진입 시 읽기 전용 모드로 초기화
  constraintSetReadonly(true)
}

// 읽기 전용 ↔ 편집 모드 전환
function constraintSetReadonly(readonly) {
  const page      = document.getElementById('page-constraint')
  const viewBtns  = document.getElementById('constraint-view-btns')
  const editBtns  = document.getElementById('constraint-edit-btns')
  const editBanner = document.getElementById('constraint-edit-banner')
  if (!page) return
  if (readonly) {
    page.classList.add('constraint-readonly')
    if (viewBtns)   { viewBtns.style.display  = 'flex' }
    if (editBtns)   { editBtns.style.display  = 'none' }
    if (editBanner) { editBanner.style.display = 'none' }
  } else {
    page.classList.remove('constraint-readonly')
    if (viewBtns)   { viewBtns.style.display  = 'none' }
    if (editBtns)   { editBtns.style.display  = 'flex' }
    if (editBanner) { editBanner.style.display = 'flex' }
  }
}

// 수정 버튼 클릭 → 편집 모드 진입 (현재 저장값 스냅샷 보관)
let _constraintSnapshot = null
function constraintStartEdit() {
  // 현재 화면값 스냅샷 (취소 시 복원용)
  _constraintSnapshot = {}
  Object.keys(CONSTRAINT_DEFAULTS).forEach(k => {
    const el = document.getElementById('c-'+k)
    if (!el) return
    _constraintSnapshot[k] = el.type === 'checkbox' ? el.checked : el.value
  })
  constraintSetReadonly(false)
  toast('수정 모드로 전환되었습니다. 변경 후 저장 버튼을 눌러주세요.', 'info')
}

// 취소 버튼 → 스냅샷 복원 후 읽기 전용
function constraintCancelEdit() {
  if (_constraintSnapshot) {
    Object.entries(_constraintSnapshot).forEach(([k, val]) => {
      const el = document.getElementById('c-'+k)
      if (!el) return
      if (el.type === 'checkbox') el.checked = val
      else el.value = val
    })
    _constraintSnapshot = null
  }
  constraintSetReadonly(true)
  toast('변경이 취소되었습니다.', 'warn')
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
  _constraintSnapshot = null
  constraintSetReadonly(true)
  const banner = document.getElementById('constraint-save-banner')
  if (banner) { banner.style.display='flex'; setTimeout(()=>banner.style.display='none',2500) }
  toast('제약조건이 저장되었습니다.','ok')
  updateSimConstraintSummary()
}

function resetConstraints() {
  localStorage.removeItem('klean-aps-constraints')
  loadConstraintValues()
  // 기본값 복원은 편집 모드에서만 호출되므로 편집 모드 유지
  constraintSetReadonly(false)
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
   AI 채팅 어시스턴트
══════════════════════════════════════ */
let aiChatHistory = []   // { role:'user'|'assistant', content:'' }
let aiStreaming   = false

function buildSimContext() {
  // 현재 시뮬레이션 결과를 AI 컨텍스트로 변환
  if (!simCombos || simCombos.length === 0) return null
  const totalOrders = simCombos.reduce((s,c) => s + c.orders.length, 0)
  const totalTon    = simCombos.reduce((s,c) => s + parseFloat(c.totalTon||0), 0).toFixed(3)
  const avgLoss     = simCombos.length > 0
    ? (simCombos.reduce((s,c)=>s+parseFloat(c.lossRate||0),0)/simCombos.length).toFixed(1)
    : '0.0'
  return {
    totalCombos   : simCombos.length,
    totalOrders,
    totalTon,
    avgLoss,
    excludedCount : simExcluded.length,
    combos        : simCombos
  }
}

function setAiStatus(state) {
  // state: 'idle' | 'thinking' | 'streaming'
  const dot   = document.getElementById('ai-status-indicator')
  const label = document.getElementById('ai-status-label')
  const btn   = document.getElementById('ai-send-btn')
  if (state === 'idle') {
    if(dot)   { dot.style.background='#6b7280'; dot.style.animation='' }
    if(label) label.textContent='대기 중'
    if(btn)   { btn.disabled=false; btn.style.opacity='1' }
  } else if (state === 'thinking') {
    if(dot)   { dot.style.background='#f59e0b'; dot.style.animation='blink 1s step-end infinite' }
    if(label) label.textContent='생각 중...'
    if(btn)   { btn.disabled=true; btn.style.opacity='.5' }
  } else if (state === 'streaming') {
    if(dot)   { dot.style.background='#34d399'; dot.style.animation='blink .5s step-end infinite' }
    if(label) label.textContent='응답 중...'
    if(btn)   { btn.disabled=true; btn.style.opacity='.5' }
  }
}

function appendAiMsg(role, content, streaming) {
  const hist  = document.getElementById('ai-chat-history')
  const empty = document.getElementById('ai-chat-empty')
  if (empty) empty.style.display = 'none'

  const id  = 'ai-msg-' + Date.now() + '-' + Math.random().toString(36).slice(2,6)
  const div = document.createElement('div')
  div.className = 'ai-msg ' + role
  div.id = id

  const avatar = role === 'user'
    ? '<div class="ai-avatar"><i class="fas fa-user"></i></div>'
    : '<div class="ai-avatar"><i class="fas fa-robot"></i></div>'

  const cursor = streaming ? '<span class="ai-typing-cursor"></span>' : ''
  div.innerHTML =
    avatar +
    '<div class="ai-bubble" id="bubble-'+id+'">' +
      escapeHtml(content) + cursor +
    '</div>'

  hist.appendChild(div)
  hist.scrollTop = hist.scrollHeight
  return id
}

function updateAiBubble(msgId, content, done) {
  const bubble = document.getElementById('bubble-'+msgId)
  if (!bubble) return
  const cursor = done ? '' : '<span class="ai-typing-cursor"></span>'
  bubble.innerHTML = markdownToHtml(content) + cursor
  const hist = document.getElementById('ai-chat-history')
  if (hist) hist.scrollTop = hist.scrollHeight
}

function escapeHtml(s) {
  var t = String(s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
  var dq = String.fromCharCode(34)
  return t.split(dq).join('&quot;')
}

function markdownToHtml(text) {
  // HTML 이스케이프
  var dq2 = String.fromCharCode(34)
  var s = text
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
  s = s.split(dq2).join('&quot;')
  // bold / italic / code
  s = s.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
  s = s.replace(/\*(.+?)\*/g,'<em>$1</em>')
  var BT = String.fromCharCode(96)
  var sq = String.fromCharCode(39)
  var codeOpen = '<code style=' + sq + 'background:#1e1e2e;padding:1px 5px;border-radius:3px;font-family:monospace;font-size:12px;' + sq + '>'
  var codeParts = s.split(BT)
  var rebuilt = ''
  for (var pi = 0; pi < codeParts.length; pi++) {
    if (pi % 2 === 0) { rebuilt += codeParts[pi] }
    else { rebuilt += codeOpen + codeParts[pi] + '</code>' }
  }
  s = rebuilt
  // 줄 단위 처리 (정규식 대신 split으로 안전하게)
  var NL = String.fromCharCode(10)
  var sq2 = String.fromCharCode(39)
  var lines = s.split(NL)
  var out = lines.map(function(line) {
    if (line.startsWith('### ')) return '<div style=' + sq2 + 'font-weight:700;font-size:13px;margin:8px 0 3px;' + sq2 + '>' + line.slice(4) + '</div>'
    if (line.startsWith('## '))  return '<div style=' + sq2 + 'font-weight:700;font-size:14px;margin:10px 0 4px;' + sq2 + '>' + line.slice(3) + '</div>'
    if (line.startsWith('# '))   return '<div style=' + sq2 + 'font-weight:800;font-size:15px;margin:10px 0 5px;' + sq2 + '>' + line.slice(2) + '</div>'
    if (line.startsWith('- '))   return '<div style=' + sq2 + 'padding-left:12px;' + sq2 + '>• ' + line.slice(2) + '</div>'
    if (/^\d+\. /.test(line))    return '<div style=' + sq2 + 'padding-left:12px;' + sq2 + '>' + line + '</div>'
    if (line === '')              return '<br>'
    return line
  })
  return out.join('<br>')
}

async function sendAiMessage() {
  if (aiStreaming) return
  const input = document.getElementById('ai-input')
  const text  = (input ? input.value : '').trim()
  if (!text) return

  if (input) { input.value = ''; aiInputResize(input) }

  // 사용자 메시지 추가
  aiChatHistory.push({ role:'user', content: text })
  appendAiMsg('user', text, false)

  // AI 응답 스트리밍 시작
  aiStreaming = true
  setAiStatus('thinking')
  const assistantMsgId = appendAiMsg('ai', '', true)
  let fullContent = ''
  let reader = null

  try {
    setAiStatus('streaming')
    const r = await fetch(API+'/klean-aps-api/ai-chat', {
      method : 'POST',
      headers: { 'Content-Type':'application/json' },
      body   : JSON.stringify({
        messages   : aiChatHistory.slice(-10),
        simContext : buildSimContext()
      })
    })

    if (!r.ok) {
      let errMsg = 'HTTP ' + r.status
      try { const e = await r.json(); errMsg = e.message || errMsg } catch(_) {}
      throw new Error(errMsg)
    }

    reader = r.body.getReader()
    const dec = new TextDecoder()
    const NL  = String.fromCharCode(10)
    let buf   = ''

    // ── SSE 스트림 읽기 ──────────────────────────────────────
    readLoop: while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buf += dec.decode(value, { stream: true })

      // 완전한 줄 단위로 처리 (마지막 불완전 줄은 버퍼에 남김)
      const lastNL = buf.lastIndexOf(NL)
      if (lastNL === -1) continue

      const chunk  = buf.slice(0, lastNL + 1)
      buf = buf.slice(lastNL + 1)

      for (const line of chunk.split(NL)) {
        const trimmed = line.trim()
        if (!trimmed || !trimmed.startsWith('data:')) continue
        const data = trimmed.slice(5).trim()

        // ── 스트림 종료 ───────────────────────────────────────
        if (data === '[DONE]') break readLoop

        try {
          const j      = JSON.parse(data)
          const choice = j.choices?.[0]
          // finish_reason이 있으면 종료 신호
          if (choice?.finish_reason && choice.finish_reason !== null) break readLoop
          const delta  = choice?.delta?.content
          if (delta) {
            fullContent += delta
            updateAiBubble(assistantMsgId, fullContent, false)
          }
        } catch(_) {}
      }
    }

    // 스트림 정상 종료 — reader 닫기
    try { await reader.cancel() } catch(_) {}

    if (!fullContent) throw new Error('응답이 비어 있습니다.')
    updateAiBubble(assistantMsgId, fullContent, true)
    aiChatHistory.push({ role:'assistant', content: fullContent })

  } catch(e) {
    // reader 열려있으면 닫기
    if (reader) { try { await reader.cancel() } catch(_) {} }
    const errTxt = (e && e.message) ? e.message : String(e)
    updateAiBubble(assistantMsgId, '⚠ 오류: ' + errTxt, true)
    aiChatHistory.pop()  // 실패한 user 메시지 제거
  } finally {
    aiStreaming = false
    setAiStatus('idle')
  }
}

function sendAiQuick(text) {
  if (aiStreaming) {
    toast('AI가 응답 중입니다. 잠시 후 다시 시도해주세요.', 'info')
    return
  }
  const input = document.getElementById('ai-input')
  if (input) input.value = text
  sendAiMessage()
}

/* ── AI 패널 펼치기 / 접기 ── */
let aiPanelOpen = false
function toggleAiPanel() {
  aiPanelOpen = !aiPanelOpen
  const panel   = document.getElementById('sim-ai-panel')
  const chevron = document.getElementById('ai-panel-chevron')
  if (!panel) return
  if (aiPanelOpen) {
    panel.style.height = '520px'
    if (chevron) chevron.style.transform = 'rotate(180deg)'
    // 열리면 입력창 포커스
    setTimeout(function() {
      const inp = document.getElementById('ai-input')
      if (inp) inp.focus()
    }, 320)
  } else {
    panel.style.height = '52px'
    if (chevron) chevron.style.transform = ''
  }
}

/* 시뮬레이션 페이지 진입 시 패널 표시, 다른 페이지에선 숨김 */
function syncAiPanel(pageName) {
  const panel = document.getElementById('sim-ai-panel')
  if (!panel) return
  if (pageName === 'simulation') {
    panel.style.display = 'flex'
  } else {
    panel.style.display = 'none'
    // 다른 페이지로 이동하면 접어둠
    aiPanelOpen = false
    panel.style.height = '52px'
    const chevron = document.getElementById('ai-panel-chevron')
    if (chevron) chevron.style.transform = ''
  }
}

function clearAiChat() {
  aiChatHistory = []
  const hist  = document.getElementById('ai-chat-history')
  const empty = document.getElementById('ai-chat-empty')
  if (hist) {
    hist.innerHTML = ''
    if (empty) { empty.style.display=''; hist.appendChild(empty) }
  }
  setAiStatus('idle')
  toast('대화가 초기화되었습니다.','info')
}

function aiInputKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    sendAiMessage()
  }
}

function aiInputResize(el) {
  el.style.height = '44px'
  el.style.height = Math.min(el.scrollHeight, 140) + 'px'
}

/* ══════════════════════════════════════
   지폭조합 시뮬레이션
══════════════════════════════════════ */
// 시뮬레이션 상태: 'idle' | 'generated' | 'confirmed' | 'ordered'
let simState = 'idle'
let simOrders = []      // 현재 시뮬레이션 대상 오더
let simCombos = []      // 생성된 조합 결과
let simExcluded = []    // 분리된 예외 오더
let currentSimCode = '' // 현재 세션 코드 (S-YYYY-MM-DD-0001)

async function loadSimulation() {
  updateSimConstraintSummary()
  setSimState('idle')
  currentSimCode = ''
  const codeEl = document.getElementById('sim-session-code')
  if (codeEl) { codeEl.textContent = ''; codeEl.style.display = 'none' }

  // DB 저장 상태 확인 + allOrders 갱신
  const dbBanner  = document.getElementById('sim-db-banner')
  const dbIcon    = document.getElementById('sim-db-icon')
  const dbText    = document.getElementById('sim-db-text')
  const dbSub     = document.getElementById('sim-db-sub')
  const dbGoBtn   = document.getElementById('sim-db-go-btn')
  const dbRefBtn  = document.getElementById('sim-db-refresh-btn')
  const genBtn    = document.getElementById('btn-sim-generate')

  // 로딩 상태
  if (dbBanner) { dbBanner.style.borderColor='var(--border)'; dbBanner.style.background='var(--bg-input)' }
  if (dbIcon)   { dbIcon.style.color='#60a5fa'; dbIcon.className='fas fa-spinner fa-spin' }
  if (dbText)   dbText.textContent='DB 저장 데이터 확인 중...'
  if (dbSub)    dbSub.textContent=''
  if (dbGoBtn)  dbGoBtn.style.display='none'
  if (dbRefBtn) dbRefBtn.style.display='none'
  if (genBtn)   genBtn.disabled = true

  try {
    const r = await fetch(API+'/klean-aps-api/sales-orders')
    const d = await r.json()
    allOrders = d.data || []
    updateBwDatalist(allOrders)

    const openCnt = allOrders.filter(o => o.status==='OPEN' && !o.isExcluded).length
    const exclCnt = allOrders.filter(o => o.isExcluded).length

    if (allOrders.length === 0) {
      // DB 비어있음 → 불러오기 유도
      if (dbBanner) { dbBanner.style.borderColor='#f59e0b55'; dbBanner.style.background='#f59e0b0a' }
      if (dbIcon)   { dbIcon.style.color='#f59e0b'; dbIcon.className='fas fa-exclamation-triangle' }
      if (dbText)   dbText.innerHTML='<span style="color:#f59e0b">DB에 판매오더가 없습니다</span>'
      if (dbSub)    dbSub.textContent='판매오더를 먼저 불러와야 시뮬레이션을 실행할 수 있습니다.'
      if (dbGoBtn)  dbGoBtn.style.display=''
      if (genBtn)   genBtn.disabled = true
    } else {
      // DB 정상
      if (dbBanner) { dbBanner.style.borderColor='#34d39944'; dbBanner.style.background='#34d3790a' }
      if (dbIcon)   { dbIcon.style.color='#34d399'; dbIcon.className='fas fa-check-circle' }
      if (dbText)   dbText.innerHTML='<span style="color:#34d399">DB 데이터 로드 완료</span>'
      if (dbSub)    dbSub.textContent='총 '+allOrders.length+'건 (OPEN '+openCnt+'건 / 예외 '+exclCnt+'건)'
      if (dbRefBtn) dbRefBtn.style.display=''
      if (genBtn)   genBtn.disabled = false
    }
  } catch(e) {
    // 서버 오류
    if (dbBanner) { dbBanner.style.borderColor='#f8717155'; dbBanner.style.background='#f871710a' }
    if (dbIcon)   { dbIcon.style.color='#f87171'; dbIcon.className='fas fa-times-circle' }
    if (dbText)   dbText.innerHTML='<span style="color:#f87171">서버 연결 오류</span>'
    if (dbSub)    dbSub.textContent='서버가 응답하지 않습니다. 잠시 후 새로고침해 주세요.'
    if (dbRefBtn) dbRefBtn.style.display=''
    if (genBtn)   genBtn.disabled = true
  }
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

// 예외 오더 판별 — 제약조건 설정(localStorage)을 우선, 시뮬레이션 UI는 보조
function isExcludedOrder(o) {
  const c = getConstraints()
  // 제약조건 설정 페이지의 저장값 사용 (c-exc-*)
  const excJapan   = c.excJapan
  const excSpecial = c.excSpecial
  const excFlagged = c.excFlagged
  if (excJapan   && o.orderType === '일본수출') return '일본수출 분리'
  if (excSpecial && o.orderType === '특수지')   return '특수지 분리'
  if (excFlagged && o.isExcluded)               return '예외 플래그'
  return null
}

// ═══════════════════════════════════════════════════════════════
//  FFD + 납기 가중치 알고리즘 (First Fit Decreasing + Due-Date Priority)
//
//  [정렬 전략]
//  1. 납기 긴급도 점수(urgency) 내림차순  — 납기 임박 오더 우선
//  2. 동점 시 지폭(paperWidth) 내림차순  — FFD: 큰 폭 먼저 배치
//
//  [긴급도 점수 계산]
//  • today 기준 잔여일 = daysLeft
//  • daysLeft ≤ 0  → 긴급도 1000 (이미 납기 초과, 최우선)
//  • daysLeft ≤ 3  → 긴급도 500  (D-3 이내)
//  • daysLeft ≤ 7  → 긴급도 200  (D-7 이내)
//  • daysLeft ≤ 14 → 긴급도 100  (D-14 이내)
//  • 그 외         → 긴급도 max(0, 50 - daysLeft)  (점진 감소)
//
//  [배치 전략 — Best Fit]
//  각 오더를 배치할 때 "추가 시 Loss가 가장 작아지는 기존 조합" 에 배치
//  → 단순 순차 적재(First Fit) 대비 공간 활용률 향상
//
//  [제약 조건 — 기존과 동일하게 전부 적용]
//  • maxWidth / mimi(미미 여유) / maxPok(최대 폭 수)
//  • noProdLimit: 이 지폭 이하 단독 조합 금지 (폭 수 ≥ 2 강제)
//  • m2FourPokMin: 2호기 4폭 시 각 폭 최소 지폭
//  • m3ExcBw / m3ExcMax: 3호기 평량별 예외 최대 지폭
// ═══════════════════════════════════════════════════════════════
function runCombinationAlgorithm(orders) {
  const c   = getConstraints()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // ── 납기 긴급도 점수 ──────────────────────────────────────────
  function urgencyScore(o) {
    if (!o.dueDate) return 0
    const due = new Date(o.dueDate)
    due.setHours(0, 0, 0, 0)
    const daysLeft = Math.floor((due - today) / 86400000)
    if (daysLeft <= 0)  return 1000
    if (daysLeft <= 3)  return 500
    if (daysLeft <= 7)  return 200
    if (daysLeft <= 14) return 100
    return Math.max(0, 50 - daysLeft)
  }

  // ── [호기 + 평량] 그룹화 ──────────────────────────────────────
  const grouped = {}
  orders.forEach(o => {
    const key = (o.machineNo || '') + '_' + o.basisWeight
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(o)
  })

  const combos = []
  let comboIdx  = 1

  Object.entries(grouped).forEach(([key, grpOrders]) => {
    const [machineNo, bwStr] = key.split('_')
    const bw = Number(bwStr)

    // 호기별 제약값
    const maxW   = machineNo === '2'
      ? c.m2Max
      : (c.m3ExcBw.includes(bw) ? c.m3ExcMax : c.m3Max)
    const maxPok = machineNo === '2' ? c.m2MaxPok : c.m3MaxPok
    const fourPokMin = machineNo === '2' ? (c.m2FourPokMin || 0) : 0
    const noProdLim  = c.noprodLimit || 625   // 이 이하 단독 배치 금지

    // ── FFD 정렬: 긴급도 DESC → 지폭 DESC ──────────────────────
    const sorted = [...grpOrders].sort((a, b) => {
      const ud = urgencyScore(b) - urgencyScore(a)
      if (ud !== 0) return ud
      return b.paperWidth - a.paperWidth
    })

    // ── 조합 버킷 목록 (이 그룹 내) ─────────────────────────────
    // bucket: { orders:[], rawWidth:number (mimi 제외 순수 지폭 합) }
    const buckets = []

    // 조합 가능 여부 검사 (maxPok, maxW, 4폭 최소 폭 조건)
    function canFit(bucket, order) {
      if (bucket.orders.length >= maxPok) return false
      const newRaw  = bucket.rawWidth + order.paperWidth
      const newTotalW = newRaw + c.mimi * bucket.orders.length  // 추가 후 mimi 간격 포함
      if (newTotalW > maxW) return false
      // 4폭 최소 폭 조건 (2호기): 4폭 편성 시 각 폭 ≥ fourPokMin
      if (fourPokMin > 0 && bucket.orders.length + 1 === maxPok) {
        const allWidths = [...bucket.orders.map(o => o.paperWidth), order.paperWidth]
        if (allWidths.some(w => w < fourPokMin)) return false
      }
      return true
    }

    // 배치 후 Loss 계산 (Best Fit 선택 기준)
    function calcLoss(bucket, order) {
      const newRaw    = bucket.rawWidth + order.paperWidth
      const newTotalW = newRaw + c.mimi * bucket.orders.length
      return maxW - newTotalW
    }

    // ── Best Fit Decreasing 배치 ────────────────────────────────
    sorted.forEach(order => {
      let bestIdx  = -1
      let bestLoss = Infinity

      buckets.forEach((bkt, idx) => {
        if (!canFit(bkt, order)) return
        const loss = calcLoss(bkt, order)
        // noProdLimit: 현재 1폭뿐이고 order 추가 시 2폭 → OK
        // (단독 1폭으로 확정되는 것만 막음 — flush 시 체크)
        if (loss < bestLoss) { bestLoss = loss; bestIdx = idx }
      })

      if (bestIdx >= 0) {
        // 기존 조합에 배치
        buckets[bestIdx].orders.push(order)
        buckets[bestIdx].rawWidth += order.paperWidth
      } else {
        // 새 조합 Open
        buckets.push({ orders: [order], rawWidth: order.paperWidth })
      }
    })

    // ── 버킷 → combos 변환 ──────────────────────────────────────
    buckets.forEach(bkt => {
      if (!bkt.orders.length) return

      // noProdLimit 처리: 단독 1폭이고 지폭 ≤ noProdLim 이면 경고 태그만 부여
      // (실제 생산 결정은 사용자가 하므로 제거하지 않고 flag 추가)
      const isSingleNarrow =
        bkt.orders.length === 1 && bkt.orders[0].paperWidth <= noProdLim

      const totalW   = bkt.rawWidth + c.mimi * (bkt.orders.length - 1)
      const loss     = Math.max(0, maxW - totalW)
      const lossRate = maxW > 0 ? (loss / maxW * 100) : 0
      const totalTon = bkt.orders.reduce((s, o) => s + (o.orderQtyTon || 0), 0)

      // 납기 긴급도: 조합 내 가장 높은 점수를 조합 대표값으로
      const maxUrgency = Math.max(...bkt.orders.map(o => urgencyScore(o)))
      const daysArr    = bkt.orders
        .filter(o => o.dueDate)
        .map(o => Math.floor((new Date(o.dueDate).setHours(0,0,0,0) - today) / 86400000))
      const minDaysLeft = daysArr.length ? Math.min(...daysArr) : null

      combos.push({
        comboId     : comboIdx++,
        machineNo,
        basisWeight : bw,
        orders      : [...bkt.orders],
        widthSum    : totalW,
        maxWidth    : maxW,
        loss,
        lossRate    : lossRate.toFixed(1),
        totalTon    : totalTon.toFixed(3),
        pokCount    : bkt.orders.length,
        // 추가 메타 (UI 표시용)
        urgency     : maxUrgency,
        minDaysLeft,
        isSingleNarrow,
        algoTag     : 'FFD+DUE'   // 알고리즘 태그
      })
    })
  })

  // ── 최종 정렬: 납기 긴급도 높은 조합을 상단에 표시 ───────────
  combos.sort((a, b) => {
    const ud = (b.urgency || 0) - (a.urgency || 0)
    if (ud !== 0) return ud
    return parseFloat(a.lossRate) - parseFloat(b.lossRate)  // 긴급도 동점 시 Loss 낮은 순
  })
  // comboId 재부여 (정렬 후 순번 재정렬)
  combos.forEach((cb, i) => { cb.comboId = i + 1 })

  return combos
}

// 진행률 표시 헬퍼
function simSetProgress(pct, msg) {
  const overlay = document.getElementById('sim-progress-overlay')
  const bar     = document.getElementById('sim-progress-bar')
  const pctEl   = document.getElementById('sim-progress-pct')
  const msgEl   = document.getElementById('sim-progress-msg')
  if (!overlay) return
  if (pct === null) {
    overlay.style.display = 'none'; return
  }
  overlay.style.display = 'block'
  if (bar)   bar.style.width   = pct + '%'
  if (pctEl) pctEl.textContent = pct + '%'
  if (msgEl) msgEl.textContent = msg || ''
}

async function simGenerate() {
  if (simState === 'confirmed') {
    toast('확정된 시뮬레이션입니다. 확정취소 후 재생성하세요.','info'); return
  }

  const genBtn = document.getElementById('btn-sim-generate')
  if (genBtn) genBtn.disabled = true

  // ── 1단계: DB에서 최신 판매오더 조회 (10%)
  simSetProgress(10, '① DB에서 판매오더 조회 중...')
  const tbody = document.getElementById('sim-order-tbody')
  if (tbody) tbody.innerHTML = '<tr><td colspan="11" class="empty-state"><i class="fas fa-spinner fa-spin"></i> 판매오더 불러오는 중...</td></tr>'

  try {
    const r = await fetch(API+'/klean-aps-api/sales-orders')
    if (!r.ok) throw new Error('HTTP '+r.status)
    const d = await r.json()
    allOrders = d.data || []
    updateBwDatalist(allOrders)
  } catch(e) {
    simSetProgress(null, '')
    if (genBtn) genBtn.disabled = false
    toast('서버 연결 오류. 잠시 후 다시 시도해 주세요.','err')
    if (tbody) tbody.innerHTML = '<tr><td colspan="11" class="empty-state" style="color:#f87171"><i class="fas fa-times-circle"></i> 서버 연결 오류</td></tr>'
    return
  }

  if (allOrders.length === 0) {
    simSetProgress(null, '')
    if (genBtn) genBtn.disabled = false
    toast('DB에 판매오더가 없습니다. 판매오더 불러오기를 먼저 실행해 주세요.','warn')
    if (tbody) tbody.innerHTML = '<tr><td colspan="11" class="empty-state"><i class="fas fa-exclamation-triangle" style="color:#f59e0b"></i> 판매오더 불러오기를 먼저 실행해 주세요.</td></tr>'
    // DB 배너도 갱신
    const dbIcon = document.getElementById('sim-db-icon')
    const dbText = document.getElementById('sim-db-text')
    const dbSub  = document.getElementById('sim-db-sub')
    const dbGoBtn = document.getElementById('sim-db-go-btn')
    if (dbIcon) { dbIcon.style.color='#f59e0b'; dbIcon.className='fas fa-exclamation-triangle' }
    if (dbText) dbText.innerHTML='<span style="color:#f59e0b">DB에 판매오더가 없습니다</span>'
    if (dbSub)  dbSub.textContent='판매오더 불러오기를 먼저 실행해 주세요.'
    if (dbGoBtn) dbGoBtn.style.display=''
    return
  }

  // ── 2단계: 조회 조건 적용 (30%)
  simSetProgress(30, '② 조회 조건 필터링 중...')
  await new Promise(r => setTimeout(r, 120))

  const plant       = (document.getElementById('sim-plant')||{}).value||''
  const machineNo   = (document.getElementById('sim-machineNo')||{}).value||''
  const basisWeight = (document.getElementById('sim-basisWeight')||{}).value||''
  const dueFrom     = (document.getElementById('sim-dueFrom')||{}).value||''
  const dueTo       = (document.getElementById('sim-dueTo')||{}).value||''
  const orderStatus = (document.getElementById('sim-orderStatus')||{}).value||''

  // DB저장 오더 중 OPEN 상태만 기본 선적용
  let filtered = allOrders.filter(o => o.status === 'OPEN')
  if (plant)       filtered = filtered.filter(o => o.plant       === plant)
  if (machineNo)   filtered = filtered.filter(o => o.machineNo   === machineNo)
  if (basisWeight) filtered = filtered.filter(o => o.basisWeight === Number(basisWeight))
  if (dueFrom)     filtered = filtered.filter(o => o.dueDate >= dueFrom)
  if (dueTo)       filtered = filtered.filter(o => o.dueDate <= dueTo)
  if (orderStatus && orderStatus !== 'OPEN')
                   filtered = filtered.filter(o => o.status    === orderStatus)

  // ── 3단계: 예외 오더 분리 (55%)
  simSetProgress(55, '③ 예외 오더 분리 중...')
  await new Promise(r => setTimeout(r, 120))

  simExcluded = []
  simOrders   = filtered.filter(o => {
    const reason = isExcludedOrder(o)
    if (reason) { simExcluded.push({...o, _excludeReason: reason}); return false }
    return true
  })

  renderSimOrderTable(simOrders)

  // ── 4단계: 지폭조합 알고리즘 실행 (80%)
  simSetProgress(80, '④ FFD+납기가중치 알고리즘 실행 중... ('+simOrders.length+'건)')
  await new Promise(r => setTimeout(r, 200))

  simCombos = runCombinationAlgorithm(simOrders)

  // ── 5단계: 결과 렌더링 (100%)
  simSetProgress(100, '⑤ 결과 렌더링 완료')
  await new Promise(r => setTimeout(r, 150))

  renderSimResult(simCombos)
  renderSimExcluded(simExcluded)

  document.getElementById('sim-result-panel').style.display = 'flex'
  document.getElementById('sim-result-panel').style.flexDirection = 'column'
  if (simExcluded.length) {
    document.getElementById('sim-excl-panel').style.display = 'block'
  } else {
    document.getElementById('sim-excl-panel').style.display = 'none'
  }

  // DB 배너 최신 상태 반영
  const openCnt = allOrders.filter(o => o.status==='OPEN' && !o.isExcluded).length
  const exclCnt = allOrders.filter(o => o.isExcluded).length
  const dbIcon2  = document.getElementById('sim-db-icon')
  const dbText2  = document.getElementById('sim-db-text')
  const dbSub2   = document.getElementById('sim-db-sub')
  const dbRefBtn = document.getElementById('sim-db-refresh-btn')
  const dbBanner = document.getElementById('sim-db-banner')
  if (dbBanner)  { dbBanner.style.borderColor='#34d39944'; dbBanner.style.background='#34d3790a' }
  if (dbIcon2)   { dbIcon2.style.color='#34d399'; dbIcon2.className='fas fa-check-circle' }
  if (dbText2)   dbText2.innerHTML='<span style="color:#34d399">DB 데이터 로드 완료</span>'
  if (dbSub2)    dbSub2.textContent='총 '+allOrders.length+'건 (OPEN '+openCnt+'건 / 예외 '+exclCnt+'건)'
  if (dbRefBtn)  dbRefBtn.style.display=''

  // ── 6단계: 세션 코드 미리 예약 (확정 전까지는 DB 미저장 — 확정 시에만 저장)
  // 코드는 생성해서 화면에 표시하되 실제 저장은 simConfirm() 시점에 수행
  currentSimCode = ''  // 확정 전 초기화
  // 상태 표시줄에는 "미확정" 코드 예고 없이 빈 상태 유지
  const codeEl = document.getElementById('sim-session-code')
  if (codeEl) { codeEl.textContent = ''; codeEl.style.display = 'none' }

  // 진행률 숨김 + 버튼 복원
  setTimeout(() => simSetProgress(null, ''), 600)
  if (genBtn) genBtn.disabled = false

  setSimState('generated')
  toast('지폭조합 시뮬레이션이 생성되었습니다. ('+simCombos.length+'조합 / '+simOrders.length+'건)','ok')
}

function renderSimOrderTable(list) {
  const tbody = document.getElementById('sim-order-tbody')
  const cnt   = document.getElementById('sim-order-count')
  if (cnt) cnt.textContent = list.length + '건'
  if (!tbody) return
  if (!list.length) {
    tbody.innerHTML = '<tr><td colspan="11" class="empty-state">조건에 맞는 오더가 없습니다.</td></tr>'; return
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
      '<td class="center" style="font-weight:700;">'+o.basisWeight+'</td>' +
      '<td class="center" style="font-weight:700;">'+o.paperWidth.toLocaleString()+'</td>' +
      '<td class="center">'+qtyStr+'</td>' +
      '<td style="font-family:monospace;font-size:10px;color:var(--text-muted);white-space:nowrap;">'+(o.matCode||'-')+'</td>' +
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
    const cid = 'combo-check-' + combo.comboId

    // ── 납기 긴급도 배지 ──────────────────────────────────────
    const dl = combo.minDaysLeft
    let urgencyBadge = ''
    if (dl !== null && dl !== undefined) {
      if (dl <= 0) {
        urgencyBadge = '<span style="padding:2px 7px;border-radius:4px;font-size:10px;font-weight:800;background:#7f1d1d;color:#fca5a5;letter-spacing:.3px;">납기초과 D+'+Math.abs(dl)+'</span>'
      } else if (dl <= 3) {
        urgencyBadge = '<span style="padding:2px 7px;border-radius:4px;font-size:10px;font-weight:800;background:#7c2d12;color:#fdba74;letter-spacing:.3px;">긴급 D-'+dl+'</span>'
      } else if (dl <= 7) {
        urgencyBadge = '<span style="padding:2px 7px;border-radius:4px;font-size:10px;font-weight:800;background:#713f12;color:#fde68a;letter-spacing:.3px;">주의 D-'+dl+'</span>'
      } else {
        urgencyBadge = '<span style="padding:2px 7px;border-radius:4px;font-size:10px;font-weight:700;background:var(--bg-base);color:var(--text-muted);letter-spacing:.3px;">D-'+dl+'</span>'
      }
    }

    // ── 단독 협폭 경고 ────────────────────────────────────────
    const narrowWarn = combo.isSingleNarrow
      ? '<span style="padding:2px 7px;border-radius:4px;font-size:10px;font-weight:700;background:#1e1b4b;color:#c4b5fd;letter-spacing:.3px;">⚠ 협폭단독</span>'
      : ''

    // ── 카드 테두리 색 (긴급도 반영) ─────────────────────────
    const cardBorderColor = (dl !== null && dl !== undefined && dl <= 0)  ? '#f87171'
                          : (dl !== null && dl !== undefined && dl <= 3)  ? '#fb923c'
                          : (dl !== null && dl !== undefined && dl <= 7)  ? '#fbbf24'
                          : 'var(--border)'

    // ── 오더별 납기 D-day 색상 ────────────────────────────────
    function orderDayColor(dueDate) {
      if (!dueDate) return 'var(--text-muted)'
      const today2 = new Date(); today2.setHours(0,0,0,0)
      const due2   = new Date(dueDate); due2.setHours(0,0,0,0)
      const d = Math.floor((due2 - today2) / 86400000)
      if (d <= 0) return '#f87171'
      if (d <= 3) return '#fb923c'
      if (d <= 7) return '#fbbf24'
      return 'var(--text-muted)'
    }

    return '<div id="combo-card-'+combo.comboId+'" style="border:2px solid '+cardBorderColor+';border-radius:10px;margin-bottom:10px;background:var(--bg-input);overflow:hidden;transition:border-color .15s;">'+
      '<!-- header -->'+
      '<div style="display:flex;align-items:center;gap:8px;padding:10px 16px;background:var(--bg-card);border-bottom:1px solid var(--border);flex-wrap:wrap;">'+
        '<!-- checkbox -->'+
        '<label style="display:flex;align-items:center;cursor:pointer;gap:0;" title="이 조합 선택">'+
          '<input type="checkbox" id="'+cid+'" checked onchange="onComboCheckChange('+combo.comboId+')" style="width:18px;height:18px;cursor:pointer;accent-color:#7c3aed;" />'+
        '</label>'+
        '<span style="font-weight:800;font-size:15px;color:#a78bfa;">#'+combo.comboId+'</span>'+
        urgencyBadge+
        narrowWarn+
        '<span class="machine-badge" style="font-size:13px;padding:3px 12px;">'+combo.machineNo+'호기</span>'+
        '<span style="font-size:12px;color:var(--text-muted);">평량 <b style="color:var(--text-main);">'+combo.basisWeight+'g/m²</b></span>'+
        '<span style="font-size:12px;color:var(--text-muted);"><b style="color:var(--text-main);">'+combo.pokCount+'</b>폭</span>'+
        '<div style="margin-left:auto;display:flex;gap:10px;align-items:center;">'+
          '<span style="font-size:12px;color:var(--text-muted);">합계 지폭: <b style="color:var(--text-main);">'+combo.widthSum.toLocaleString()+'mm</b> / '+combo.maxWidth.toLocaleString()+'mm</span>'+
          '<span style="font-size:13px;color:'+lossColor+';font-weight:800;">Loss '+combo.lossRate+'%</span>'+
          '<span style="font-size:13px;color:#34d399;font-weight:800;">'+combo.totalTon+'T</span>'+
        '</div>'+
      '</div>'+
      '<!-- body -->'+
      '<div style="padding:12px 16px 4px;">'+
        '<div style="margin-bottom:10px;">'+widthBars+'</div>'+
        '<table style="width:100%;border-collapse:collapse;font-size:11px;">'+
          '<thead style="background:var(--bg-card);">'+
            '<tr>'+
              '<th style="padding:5px 6px;text-align:left;color:var(--text-muted);">오더번호</th>'+
              '<th style="padding:5px 6px;text-align:left;color:var(--text-muted);">납품처</th>'+
              '<th style="padding:5px 6px;text-align:right;color:var(--text-muted);">지폭</th>'+
              '<th style="padding:5px 6px;text-align:right;color:var(--text-muted);">수량</th>'+
              '<th style="padding:5px 6px;text-align:left;color:var(--text-muted);">자재코드</th>'+
              '<th style="padding:5px 6px;text-align:center;color:var(--text-muted);">납기일</th>'+
            '</tr>'+
          '</thead>'+
          '<tbody>'+
            combo.orders.map(o => {
              const q = o.orderQtyTon ? o.orderQtyTon.toFixed(3)+'T' : o.orderQtyR ? o.orderQtyR+'R' : '-'
              const dc = orderDayColor(o.dueDate)
              return '<tr>'+
                '<td style="padding:5px 6px;font-family:monospace;color:#60a5fa;">'+o.sapOrderNo+'</td>'+
                '<td style="padding:5px 6px;">'+o.customerName+'</td>'+
                '<td style="padding:5px 6px;text-align:right;font-weight:700;">'+o.paperWidth.toLocaleString()+'mm</td>'+
                '<td style="padding:5px 6px;text-align:right;color:#34d399;">'+q+'</td>'+
                '<td style="padding:5px 6px;font-family:monospace;font-size:10px;color:var(--text-muted);white-space:nowrap;">'+(o.matCode||'-')+'</td>'+
                '<td style="padding:5px 6px;text-align:center;font-weight:700;color:'+dc+';">'+o.dueDate+'</td>'+
                '</tr>'
            }).join('')+
          '</tbody>'+
        '</table>'+
      '</div>'+
    '</div>'
  }).join('')
  // 체크박스 초기 상태 반영
  combos.forEach(combo => onComboCheckChange(combo.comboId))
  // 전체선택 체크박스 초기 상태 동기화 (최초 렌더 시 전체 체크 → checked=true)
  const allChk = document.getElementById('combo-chk-all')
  if (allChk) {
    allChk.checked = true
    allChk.indeterminate = false
  }
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
      '<td style="font-family:monospace;font-size:10px;color:var(--text-muted);white-space:nowrap;">'+(o.matCode||'-')+'</td>'+
      '<td>'+renderOrderTypeBadge(o.orderType)+'</td>'+
      '<td><span class="badge b-cancel" style="font-size:10px;">'+o._excludeReason+'</span></td>'+
      '</tr>'
  }).join('')
}

// 지폭조합 결과 전체선택 / 전체해제
function comboSelectAll(checked) {
  simCombos.forEach(c => {
    const cb = document.getElementById('combo-check-' + c.comboId)
    if (cb) { cb.checked = checked; onComboCheckChange(c.comboId) }
  })
  // 확정 버튼 상태 갱신
  const confBtn = document.getElementById('btn-sim-confirm')
  if (confBtn) confBtn.disabled = getCheckedComboIds().length === 0
}

// 체크박스 변경 시 카드 테두리 색 + 비활성화 스타일 토글
// + 전체선택 체크박스 indeterminate 상태 자동 갱신
function onComboCheckChange(comboId) {
  const cb = document.getElementById('combo-check-' + comboId)
  const card = document.getElementById('combo-card-' + comboId)
  if (!cb || !card) return
  if (cb.checked) {
    card.style.borderColor = '#7c3aed'
    card.style.opacity = '1'
  } else {
    card.style.borderColor = 'var(--border)'
    card.style.opacity = '0.45'
  }
  // 전체선택 체크박스 상태 동기화 (전체 체크/전체 해제/일부 체크)
  const allChk = document.getElementById('combo-chk-all')
  if (!allChk || !simCombos.length) return
  const checkedCount = simCombos.filter(c => {
    const el = document.getElementById('combo-check-' + c.comboId)
    return el && el.checked
  }).length
  if (checkedCount === 0) {
    allChk.checked = false
    allChk.indeterminate = false
  } else if (checkedCount === simCombos.length) {
    allChk.checked = true
    allChk.indeterminate = false
  } else {
    allChk.checked = false
    allChk.indeterminate = true
  }
  // 확정 버튼 상태 갱신
  const confBtn = document.getElementById('btn-sim-confirm')
  if (confBtn) confBtn.disabled = checkedCount === 0
}

// 선택된 comboId 목록 반환
function getCheckedComboIds() {
  return simCombos
    .filter(c => { var cb = document.getElementById('combo-check-' + c.comboId); return cb && cb.checked })
    .map(c => c.comboId)
}

async function simConfirm() {
  if (simState !== 'generated') return
  if (!simCombos.length) { toast('조합 결과가 없습니다.','info'); return }
  const selectedIds = getCheckedComboIds()
  if (!selectedIds.length) { toast('확정할 조합을 하나 이상 선택해주세요.','info'); return }

  // ── 확정된 조합만 추출
  const confirmedCombos = simCombos.filter(c => selectedIds.indexOf(c.comboId) !== -1)

  // ── 세션 생성 + 확정 동시 처리 (확정 조합만 저장)
  try {
    const plant       = (document.getElementById('sim-plant')||{}).value||''
    const machineNo   = (document.getElementById('sim-machineNo')||{}).value||''
    const basisWeight = (document.getElementById('sim-basisWeight')||{}).value||''
    const dueFrom     = (document.getElementById('sim-dueFrom')||{}).value||''
    const dueTo       = (document.getElementById('sim-dueTo')||{}).value||''

    const sessRes  = await fetch(API+'/klean-aps-api/sim-sessions', {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({
        plant,
        machineNo      : machineNo,
        basisWeight    : basisWeight ? Number(basisWeight) : 0,
        dueFrom,
        dueTo,
        targetOrders   : simOrders.length,
        excludedOrders : simExcluded.length,
        combosTotal    : simCombos.length,          // 전체 생성 조합 수
        combos         : confirmedCombos,            // 확정된 조합만 저장
      })
    })
    const sessJson = await sessRes.json()
    if (sessJson.success) {
      currentSimCode = sessJson.simCode

      // ── 결과 화면에 세션 코드 표시 (상태 표시줄 + 결과 섹션 타이틀)
      const codeEl = document.getElementById('sim-session-code')
      if (codeEl) { codeEl.textContent = currentSimCode; codeEl.style.display = '' }
      const titleCodeEl = document.getElementById('sim-result-simcode')
      if (titleCodeEl) { titleCodeEl.textContent = currentSimCode; titleCodeEl.style.display = '' }
    }
  } catch(e) {
    console.warn('세션 저장 실패 (비차단):', e)
  }

  setSimState('confirmed')
  toast('선택된 ' + selectedIds.length + '개 조합이 확정되었습니다. (세션코드: '+(currentSimCode||'-')+') 오더생성 버튼으로 SAP에 전달하세요.','ok')
}

function simUnconfirm() {
  if (simState !== 'confirmed') return
  // 세션 코드 초기화 (확정 취소 → 재확정 시 새 코드 발급)
  currentSimCode = ''
  const codeEl = document.getElementById('sim-session-code')
  if (codeEl) { codeEl.textContent = ''; codeEl.style.display = 'none' }
  const titleCodeEl = document.getElementById('sim-result-simcode')
  if (titleCodeEl) { titleCodeEl.textContent = ''; titleCodeEl.style.display = 'none' }
  setSimState('generated')
  toast('확정이 취소되었습니다. 조합을 수정하거나 재확정할 수 있습니다.','ok')
}

// ── 점보롤 오더 번호 시퀀스 (프론트 로컬)
let _jumboLocalSeq = 1

// 점보롤 생산오더 생성 → API 저장 → 화면 렌더링 → SAP RFC 로그
async function simSendOrder() {
  if (simState !== 'confirmed') return
  if (!simCombos.length) { toast('전송할 조합이 없습니다.','info'); return }

  // 선택된 조합만 처리
  const selectedIds = getCheckedComboIds()
  if (!selectedIds.length) { toast('전송할 조합을 하나 이상 선택해주세요.','info'); return }
  const selectedCombos = simCombos.filter(c => selectedIds.indexOf(c.comboId) !== -1)

  const btn = document.getElementById('btn-sim-order')
  if (btn) btn.disabled = true
  toast('선택된 ' + selectedCombos.length + '개 조합 점보롤 생산오더 생성 중...','ok')

  // ── 1. 조합 결과 → 점보롤 오더 페이로드 빌드
  const c = getConstraints()
  const today = new Date()
  const pad = n => String(n).padStart(2,'0')
  const todayStr = today.getFullYear()+'-'+pad(today.getMonth()+1)+'-'+pad(today.getDate())

  const jumboPayload = selectedCombos.map(combo => {
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

    // ── 5. 세션 SENT 상태 갱신 (비차단)
    if (currentSimCode) {
      const sentItems = created.map(j => ({
        comboId     : j.sourceComboId,
        jumboOrderNo: j.jumboOrderNo,
      }))
      fetch(API+'/klean-aps-api/sim-sessions/'+currentSimCode+'/send', {
        method : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ sentItems })
      }).catch(() => {})
    }

    // ── 6. 상태 전환 (오더생성 완료 = 새 상태 'ordered')
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