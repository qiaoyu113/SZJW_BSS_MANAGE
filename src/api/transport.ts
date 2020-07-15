import request from '@/utils/request'

/**
 *
 * 获取司机详情
 */
export const GetDriverDetail = (params: any) =>
  request({
    url: `/v1/driver/driverDetailByInview`,
    method: 'post',
    params
  })

/**
  *
  *编辑司机信息
  */
export const EditDriverInfo = (data: any) =>
  request({
    url: '/v1/driver/updateDriver',
    method: 'post',
    data
  })

/**
   *
   * 司机跟进页面信息
   */
export const DriverFollowFormation = (params: any) =>
  request({
    url: '/v1/driver/driverFollowFormation',
    method: 'post',
    params
  })

/**
   *
   * 司机跟进页 --司机跟进操作
   */
export const DriverFollowOp = (data: any) =>
  request({
    url: '/v1/driver/driverFollowSave',
    method: 'post',
    data
  })

/**
   *
   * 司机放弃操作
   */
export const DriverFollowUpToDown = (params: any) =>
  request({
    url: '/v1/driver/driverFollowUpToDown',
    method: 'post',
    params
  })

/**
   *
   * 司机列表--修改加盟经理
   */
export const UpdateDriverBDManager = (data: any) =>
  request({
    url: '/v1/driver/updateDriverBDManager',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })

/**
 *
 * 分配加盟经理
 */
export const driverDownToGm = (params: any) =>
  request({
    url: '/v1/driver/driverDownToGm',
    method: 'post',
    params
  })

/**
   *
   * 通过driverId获取司机信息
   */
export const driverDetailByDriverId = (params: any) =>
  request({
    url: '/v1/driver/driverDetail',
    method: 'get',
    params
  })

/**
   *
   * 司机详情-运力信息
   */
export const driverDetailToCarrierInfo = (params: any) =>
  request({
    url: '/v1/driver/driverDetailToCarrierInfo',
    method: 'get',
    params
  })

/**
   *
   *司机详情-获取订单信息
   */
export const driverDetailToOrderInfo = (params: any) =>
  request({
    url: '/v1/driver/driverDetailToOrderInfo',
    method: 'get',
    params
  })

/* 获取开通城市 */
export const GetReginByCityCode = (data: any[]) =>
  request({
    url: '/api/base/user/area/getCityByCode',
    method: 'post',
    data
  })

/* 获取司机索引列表 */
export const GetDriverClueList = (data: any[]) =>
  request({
    url: '',
    method: 'post',
    data
  })

/* 修改司机索引 */
export const EditDriverClue = (data: any[]) =>
  request({
    url: '',
    method: 'post',
    data
  })
