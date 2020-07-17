import request from '@/utils/request'

// 获取货主列表
export const GetCustomerList = (data: any) =>
  request({
    url: '/line_center/v1/line/customer/queryLineCustomerList',
    method: 'post',
    data
  })

export const GetCustomerDetail = (data: any) =>
  request({
    url: 'api/line/line/customer/customerPool/detail',
    method: 'get',
    params: data
  })

// 获取分配货主列表
export const GetCustomerSaleList = (data: any) =>
  request({
    url: '/product/v1/product/product/getCarTypeByTypeAndCityAndSupplier',
    method: 'post',
    data
  })

// 分配货主销售

export const Distribution = (data: any) =>
  request({
    url: '/line/v1/customer/distribution',
    method: 'post',
    data
  })
