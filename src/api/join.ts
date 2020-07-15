import request from '@/utils/request'

export const CreateNewOrder = (params: any) =>
  request({
    url: '/vl/order/createNewOrder',
    method: 'post',
    params
  })

export const GetOrderDetail = (params: any) =>
  request({
    url: '/v1/order/orderDetail',
    method: 'get',
    params
  })

export const GetOrderLog = (params: any) =>
  request({
    url: '/vl/order/getOrderStatusLogById',
    method: 'get',
    params
  })

export const GetDriverList = (data: any) =>
  request({
    url: '/bss/v1/bss/driver/selectListByKey',
    method: 'post',
    data
  })

export const GetDriverDetail = (params: any) =>
  request({
    url: '/transactions',
    method: 'get',
    params
  })
