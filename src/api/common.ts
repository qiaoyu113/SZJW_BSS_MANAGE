import request from '@/utils/request'

export const GetDictionary = (data: any) =>
  request({
    url: '/api/base/base/dict/qryDictByType',
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

// 字典列表接口
export const GetDictionaryList = (data: any) =>
  request({
    url: '/v1/base/dict/dictType/list',
    method: 'get',
    params: data
  })

// 多字典一次性查询
export const GetDictionaryAll = (data: any) =>
  request({
    url: '/v1/base/dict/dict/list/types',
    method: 'get',
    params: data
  })
