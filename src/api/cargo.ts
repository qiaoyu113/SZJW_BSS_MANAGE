import request from '@/utils/request'

export const GetDriverDetail = (id: number, params: any) =>
  request({
    url: '/api/driver/driver/detail',
    method: 'get',
    params
  })

export const GetDriverList = (data: any) =>
  request({
    url: '/api/bss/v1/bss/driver/selectListByKey',
    method: 'post',
    data
  })

// 获取货主详情
export const GetOwnerDetail = (data: any) =>
  request({
    url: '/line/v1/customer/customerInfo',
    method: 'get',
    data
  })
