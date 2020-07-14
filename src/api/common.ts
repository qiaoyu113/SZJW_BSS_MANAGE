import request from '@/utils/request'

export const GetDictionary = (data: any) =>
  request({
    url: '/v1/base/dict/dictData/list',
    method: 'get',
    params: data
  })
