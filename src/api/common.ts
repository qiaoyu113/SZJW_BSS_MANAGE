import request from '@/utils/request'

export const GetDictionary = (data: any) =>
  request({
    url: '/api/base/base/dict/qryDictByType',
    method: 'get',
    params: data
  })
