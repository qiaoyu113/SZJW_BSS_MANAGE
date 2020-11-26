import request from '@/utils/request'
let prefix2 = '/mock/25'
const billFix = '/bill_center'
// 退费管理列表
export const refundList = (data: any) =>
  request({
    url: `${billFix}/v2/wt-driver-account/refund/list`,
    method: 'post',
    data
  })
// 退费管理详情
export const refundDetail = (data: any) =>
  request({
    url: `${prefix2}/v1/base/role/refundDetail`,
    method: 'post',
    data
  })
// 退费管理审核
export const refundAudit = (data: any) =>
  request({
    url: `${prefix2}/v1/base/role/refundAudit`,
    method: 'post',
    data
  })
// 退费管理导出
export const refundExport = (data: any) =>
  request({
    url: `${billFix}/v2/waybill/amount/export`,
    method: 'post',
    data
  })
