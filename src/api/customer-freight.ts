import request from '@/utils/request'
// 客户运费账户
// let prefix = '/mock/112'
let prefix = '/waybill_center'

// 客户运费流水列表
export const GetFreightChargeList = (data: any) =>
  request({
    url: `${prefix}/v2/waybill/custBilling/freightCharge/list`,
    method: 'post',
    data
  })

// 客户运费流水列表导出
export const ExportFreightChargeList = (data: any) =>
  request({
    url: `${prefix}/v2/waybill/custBilling/freightCharge/export`,
    method: 'post',
    data
  })

// 客户运费流水-标记付款
export const BjfreightChargeReceive = (data: any) =>
  request({
    url: `${prefix}/v2/waybill/custBilling/freightCharge/receive`,
    method: 'post',
    data
  })
// 获取客户月账单
export const GetMonthlyBillList = (data: any) =>
  request({
    url: `${prefix}/v2/waybill/custBilling/monthlyBill/list`,
    method: 'post',
    data
  })

// 客户运费月账单导出
export const ExportMonthlyBill = (data: any) =>
  request({
    url: `${prefix}/v2/waybill/custBilling/monthlyBill/export`,
    method: 'post',
    data
  })

// 客户运费月账单--客户确认
export const CustomerMonthlyBillCheck = (data: any) =>
  request({
    url: `${prefix}/v2/waybill/custBilling/monthlyBill/check`,
    method: 'post',
    data
  })

// 获取项目列表
export const GetProjectSearch = (data: any) =>
  request({
    url: `/line_center/v2/line/project/fuzzy/check`,
    method: 'post',
    data
  })
