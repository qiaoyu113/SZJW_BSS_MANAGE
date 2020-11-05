import request from '@/utils/request'

const payFix = '/mock/112'
const prefix = '/bill'
const driverFix = '/business_center'
const billFix = '/bill_center'
const wayBillFix = '/waybill'
const localMock = '/local'

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
    url: `${billFix}/v2/wt-driver-account/management/list`,
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
    url: `${billFix}/v2/wt-driver-account/management/export`,
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
 * 获取订单冻结金额
 */
export const orderMoney = (data: any) => {
  return request({
    url: `${prefix}/v2/wt-driver-account/management/order-freezing-money/orderid`,
    method: 'get',
    params: data
  })
}

/**
 * 获取订单冻结金额
 */
export const orderCanExtractMoney = (data: any) => {
  return request({
    url: `${prefix}/v2/wt-driver-account/management/getCanExtractByUserId`,
    method: 'post',
    params: data
  })
}

/**
 * 订单是否确认
 */
export const countConfirmByDriver = (data: any) => {
  return request({
    url: `${wayBillFix}/v2/waybill/shipping/getWayBillStatusByOrderId`,
    method: 'get',
    params: data
  })
}
// 获取财务流水列表
export const getFlowList = (data: any) =>
  request({
    url: `/bill_center/v2/wt-driver-account/flow/list`,
    method: 'post',
    data
  })

// 导出财务流水
export const exportFlowList = (data: any) =>
  request({
    url: `/bill_center/v2/wt-driver-account/flow/export`,
    method: 'post',
    data
  })

// 手动添加流水
export const saveFlowData = (data: any) =>
  request({
    url: `/bill/v2/wt-driver-account/flow/manual/create`,
    method: 'post',
    data
  })
// 根据司机id获取已终止订单列表
export const getOrderListByDriverId = (params: any) =>
  request({
    url: `/order/v2/order/getOnlyOrderListByDriverId`,
    method: 'get',
    params
  })
  // 根据司机id订单id获取订单详情
export const getOrderDetailByDriverId = (params: any) =>
  request({
    url: `/order/v2/order/getOrderOnlyDetialByDriverId`,
    method: 'get',
    params
  })

// 通过加盟经理id获取司机列表
export const getDriverListByGmId = (params: any) =>
  request({
    url: `/driver/v2/driver/getDriverListByGmId`,
    method: 'get',
    params
  })

// 获取计费类型列表
export const getListAll = () =>
  request({
    url: `/bill/v2/wt-driver-account/billing/currUserChargeList`,
    method: 'get'
  })

// 获取计费金额
export const GetChargeAmountByChargeId = (params:any) =>
  request({
    url: `${prefix}/v2/wt-driver-account/billing/getChargeAmountByChargeId`,
    method: 'get',
    params
  })

// 获取计费管理列表
export const GetChargingList = (params:any) =>
  request({
    url: `${localMock}/getChargingList`,
    method: 'get',
    params
  })

// 获取计费管理详情
export const GetChargingDetail = (params:any) =>
  request({
    url: `${localMock}/getChargingDetail`,
    method: 'get',
    params
  })
// 计费管理修改状态
export const ChangeChargingStatus = (data:any) =>
  request({
    url: `${localMock}/changeChargingStatus`,
    method: 'post',
    data
  })

// 计费管理操作日志
export const GetChargingLog = (params:any) =>
  request({
    url: `${localMock}/getChargingLog`,
    method: 'get',
    params
  })
  // 计费管理-新建
export const AddCharging = (data:any) =>
  request({
    url: `${localMock}/addCharging`,
    method: 'post',
    data
  })
  // 计费管理-调整
export const EditCharging = (data:any) =>
  request({
    url: `${localMock}/editCharging`,
    method: 'post',
    data
  })
