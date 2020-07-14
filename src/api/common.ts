import request from '@/utils/request'

export const GetDictionary = (data: any) =>
  request({
    url: '/v1/base/dict/dictData/list',
    method: 'get',
    params: data
  })
// 批量查询字典
export const GetDictionaryList = (data: any) =>
  request({
    url: '/v1/base/dict/dict/list/types',
    method: 'post',
    data
  })
