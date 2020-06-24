import request from '@/utils/request'

export const GetCustomerList = (data: any) =>
  request({
    url: '/api/bss/v1/bss/line/customer/selectListByKey',
    method: 'post',
    data
  })

export const GetCustomerDetail = (data: any) =>
  request({
    url: 'api/line/line/customer/customerPool/detail',
    method: 'get',
    params: data
  })
