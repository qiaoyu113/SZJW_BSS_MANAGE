import request from '@/utils/request'
// 客户运费账户
let prefix = '/mock/112'

// 客户运费流水列表
export const GetFreightChargeList = (params: any) =>
  request({
    url: `${prefix}/v2/customerBilling/freightCharge/list`,
    method: 'get',
    params
  })

// 客户运费流水列表导出
export const ExportFreightChargeList = (params: any) =>
  request({
    url: `${prefix}/v2/customerBilling/freightCharge/export`,
    method: 'get',
    params
  })

// 客户运费流水-标记付款
export const BjfreightChargeReceive = (data: any) =>
  request({
    url: `${prefix}/v2/customerBilling/freightCharge/receive`,
    method: 'post',
    data
  })
// 获取客户月账单
export const GetMonthlyBillList = (params: any) =>
  request({
    url: `${prefix}/v2/customerBilling/monthlyBill/list`,
    method: 'get',
    params
  })

// 客户运费月账单导出
export const ExportMonthlyBill = (params: any) =>
  request({
    url: `${prefix}/v2/customerBilling/monthlyBill/export`,
    method: 'get',
    params
  })

// 客户运费月账单--客户确认
export const CustomerMonthlyBillCheck = (data: any) =>
  request({
    url: `${prefix}/v2/customerBilling/monthlyBill/check`,
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
