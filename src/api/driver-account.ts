import request from '@/utils/request'

const prefix = '/mock/112'
const driverFix = '/business_center'

/**
 * XXXX
 */
export const CreateActivity = (data: any) =>
  request({
    url: `${prefix}/v1/driver/clue/create/manually`,
    method: 'post',
    data
  })

/**
   *
   * 获取梧桐账户列表
   */
export const getAcountList = (data: any) =>
  request({
    url: `${prefix}/v2/wt-driver-account/management/list`,
    method: 'post',
    data
  })

/**
   *
   * 梧桐账户列表冻结
   */
export const accountFreeze = (data: any) =>
  request({
    url: `${prefix}/v2/wt-driver-account/management/freeze`,
    method: 'post',
    data
  })

/**
   *
   * 梧桐账户列表冻结
   */
export const accountUnfreeze = (data: any) =>
  request({
    url: `${prefix}/v2/wt-driver-account/management/unfreeze`,
    method: 'post',
    data
  })

/**
   *
   * 梧桐账户列表导出
   */
export const managementExport = (data: any) =>
  request({
    url: `${prefix}/v2/wt-driver-account/management/export`,
    method: 'post',
    data
  })

/**
 * 订单列表
 */
export const orderList = (data: any) => {
  return request({
    url: `${driverFix}/v2/order/getOrderListByDriverId`,
    method: 'get',
    params: data
  })
}

/**
 * 订单详情
 */
export const orderDetail = (data: any) => {
  return request({
    url: `${driverFix}/v2/order/getOrderDetialByDriverId`,
    method: 'get',
    params: data
  })
}

/**
 * 订单详情
 */
export const countConfirmByDriver = (data: any) => {
  return request({
    url: `waybill/v2/waybill/shipping/countConfirmByDriver`,
    method: 'get',
    params: data
  })
}
