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

// /v2/wt-driver-account/refund/create
// 创建申请退费
export const createRefund = (data:any) => request({
  url: `${billFix}/v2/wt-driver-account/refund/create`,
  method: 'post',
  data
})

/// v2/wt-driver-account/refund/create/echo
// 用户账户信息回显
export const getRefundEcho = (params:any) => request({
  url: `${billFix}/v2/wt-driver-account/refund/create/echo`,
  method: 'get',
  params
})
// /v2/wt-driver-account/refund/haveRecordToBeApproved
// 是否有待退款
// http://szjw-domain-bill.m2.yunniao.cn/v2/wt-driver-account/refund/haveRecordToBeApproved?driverId=ewqweqeqe
export const haveRecordToBeApproved = (params:any) => request({
  url: `${billFix}/v2/wt-driver-account/refund/haveRecordToBeApproved`,
  method: 'get',
  params
})
