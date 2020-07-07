import request from '@/utils/request'

// 获取线索
export const GetCustomerList = (data: any) =>
  request({
    url: 'api/bss/v1/bss/line/task/selectListByConditionsQuery',
    method: 'post',
    data
  })

export const GetCustomerDetail = (data: any) =>
  request({
    url: 'api/line/line/customer/customerPool/detail',
    method: 'get',
    params: data
  })
