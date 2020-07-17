import request from '@/utils/request'
const ptrfix = '/api/base'

export const GetDictionary = (data: any) =>
  request({
    url: `${ptrfix}/api/base/base/dict/qryDictByType`,
    method: 'get',
    params: data
  })
// 批量查询字典
export const GetDictionaryList = (data: any) =>
  request({
    url: `${ptrfix}/v1/base/dict/dict/list/types`,
    method: 'post',
    data
  })

// 工作城市
export const GetOpenCityData = () =>
  request({
    url: `${ptrfix}/v1/base/area/getOpenCityData`,
    method: 'get'
  })

// 运营经理
export const getOperManager = () =>
  request({
    url: `${ptrfix}/v1/base/user/getOperManagerListByUserId`,
    method: 'post'
  })
