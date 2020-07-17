import request from '@/utils/request'

const ptrfix = '/carrier'
const base = '/base'

export const GetDriverDetail = (id: number, params: any) =>
  request({
    url: '/api/driver/driver/detail',
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

/* 创建运力 */
export const saveCarrierInfo = (data: any[]) =>
  request({
    url: `${ptrfix}/v1/carrier/saveCarrierInfo`,
    method: 'post',
    data
  })

/* 运力详情 */
export const carrierDetail = (params: any) =>
  request({
    url: `${ptrfix}/v1/carrier/getCarrierInfoByCarrierId`,
    method: 'get',
    params
  })

/* 创建运力查询订单列表 */
export const transportOrderList = (params: any) =>
  request({
    // url: `${ptrfix}/v1/carrier/getOrderListByDriverId`,
    url: `${ptrfix}/v1/carrier/getOrderInfoByDriver`,
    method: 'get',
    params
  })

// 根据运力编号查询运力详情
export const transportOrderDetail = (params: any) =>
  request({
    url: `${ptrfix}/v1/carrier/getCarrierInfoByCarrierId`,
    method: 'get',
    params
  })

// 运力停用与激活
export const updateCarrierStatus = (data: any) =>
  request({
    url: `${ptrfix}/v1/carrier/updateCarrierStatus`,
    method: 'post',
    data
  })

// 修改运营经理
export const updateGmId = (data: any) =>
  request({
    url: `${ptrfix}/v1/carrier/updateGmId`,
    method: 'post',
    data
  })

// 运力列表
export const getCarrierInfoList = (data: any) =>
  request({
    url: `/carrier_center/v1/order/getCarrierInfoList`,
    method: 'post',
    data
  })

// 查询司机列表
export const driverList = () =>
  request({
    url: `${ptrfix}/v1/driver/getDriverAll`,
    method: 'get'
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
