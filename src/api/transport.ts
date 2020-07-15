import request from '@/utils/request'

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
    url: '/v1/carrier/saveCarrierInfo',
    method: 'post',
    data
  })

/* 运力详情 */
export const carrierDetail = (params: any) =>
  request({
    url: '/v1/carrier/getCarrierInfoByCarrierId',
    method: 'get',
    params
  })

/* 创建运力查询订单列表 */
export const transportOrderList = (params: any) =>
  request({
    url: '/v1/carrier/getOrderListByDriverId',
    method: 'get',
    params
  })
