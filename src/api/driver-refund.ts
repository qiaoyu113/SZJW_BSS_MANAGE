import request from '@/utils/request'

export const GetFreightChargeList = (data: any) =>
  request({
    url: `/v2/driverBilling/freightCharge/list`,
    method: 'post',
    data
  })

// /v2/wt-driver-account/refund/create
// 创建申请退费
export const createRefund = (data:any) => request({
  url: `/v2/wt-driver-account/refund/create`,
  method: 'post',
  data
})

/// v2/wt-driver-account/refund/create/echo
// 用户账户信息回显
export const getRefundEcho = (params:any) => request({
  url: `/v2/wt-driver-account/refund/create/echo`,
  method: 'get',
  params
})
// /v2/wt-driver-account/refund/haveRecordToBeApproved
// 是否有待退款
// http://szjw-domain-bill.m2.yunniao.cn/v2/wt-driver-account/refund/haveRecordToBeApproved?driverId=ewqweqeqe
export const haveRecordToBeApproved = (params:any) => request({
  url: `/v2/wt-driver-account/refund/haveRecordToBeApproved`,
  method: 'get',
  params
})
