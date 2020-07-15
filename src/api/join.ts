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

// 合同详情
export const GetContractDetail = (params: any) =>
  request({
    url: '/order/contract/contractDetail',
    method: 'get',
    params
  })

// 交付提交
export const SubmitOrderDeliver = (params: any) =>
  request({
    url: '/order/vl/orderDeliver/submitOrderDeliver',
    method: 'post',
    params
  })

// 交付详情
export const GetOrderDeliverDetail = (params: any) =>
  request({
    url: '/order/vl/orderDeliver/orderDeliverDetail',
    method: 'get',
    params
  })

// 交付详情
export const SelectOrderInfo = (params: any) =>
  request({
    url: '/order/v1/order/orderDeliver/selectOrderInfo',
    method: 'get',
    params
  })
