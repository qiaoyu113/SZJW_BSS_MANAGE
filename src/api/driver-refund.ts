import request from '@/utils/request'
let prefix2 = '/mock/25'
let prefix = '/bill'
const billFix = '/bill_center'
// 退费管理列表
export const refundList = (data: any) =>
  request({
    url: `${billFix}/v2/wt-driver-account/refund/list`,
    method: 'post',
    data
  })
// 退费管理详情
export const refundDetail = (params: any) =>
  request({
    url: `${prefix}/v2/wt-driver-account/refund/getRefundDetail`,
    method: 'get',
    params
  })
// 退费管理审核
export const refundAudit = (data: any) =>
  request({
    url: `${prefix}/v2/wt-driver-account/refund/approve`,
    method: 'post',
    data
  })
// 退费管理导出
export const refundExport = (data: any) =>
  request({
    url: `${billFix}/v2/wt-driver-account/refund/export`,
    method: 'post',
    data
  })
// 下载
export const refundDownLod = (params: any) =>
  request({
    url: `${billFix}/v2/wt-driver-account/refund/downTemplate`,
    method: 'get',
    params
  })

// 退费
export const refundExecute = (params: any) =>
  request({
    url: `${prefix}/v2/wt-driver-account/refund/execute`,
    method: 'get',
    params
  })
// 批量退费
export const batchRefundExecute = (data: any) =>
  request({
    url: `${prefix}/v2/wt-driver-account/refund/batch/execute`,
    method: 'post',
    data
  })
// 驳回   批量驳回
export const refundRejection = (data: any) =>
  request({
    url: `${prefix}/v2/wt-driver-account/refund/batch/reject`,
    method: 'post',
    data
  })

// /v2/wt-driver-account/refund/create
// 创建申请退费
export const createRefund = (data:any) => request({
  url: `/bill/v2/wt-driver-account/refund/create`,
  method: 'post',
  data
})

/// v2/wt-driver-account/refund/create/echo
// 用户账户信息回显
export const getRefundEcho = (params:any) => request({
  url: `/bill/v2/wt-driver-account/refund/create/echo`,
  method: 'get',
  params
})
// /v2/wt-driver-account/refund/haveRecordToBeApproved
// 是否有待退款
// http://szjw-domain-bill.m2.yunniao.cn/v2/wt-driver-account/refund/haveRecordToBeApproved?driverId=ewqweqeqe
export const haveRecordToBeApproved = (params:any) => request({
  url: `/bill/v2/wt-driver-account/refund/haveRecordToBeApproved`,
  method: 'get',
  params
})

//
// 批量驳回/退费 前置校验是否有非待退费数据
export const checkBatch = (data:any) => request({
  url: `/bill/v2/wt-driver-account/refund/batch/check`,
  method: 'post',
  data
})
