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
