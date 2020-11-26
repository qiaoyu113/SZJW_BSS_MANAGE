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
