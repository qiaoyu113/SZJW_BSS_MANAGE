import request from '@/utils/request'

let prefix = '/api/base'
export const GetDictionary = (data: any) =>
  request({
    url: `${prefix}/v1/base/dict/dictData/list`,
    method: 'get',
    params: data
  })
// 批量查询字典
export const GetDictionaryList = (data: any) =>
  request({
    url: `${prefix}/v1/base/dict/dict/list/types`,
    method: 'post',
    data
  })
