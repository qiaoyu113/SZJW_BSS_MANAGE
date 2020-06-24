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
