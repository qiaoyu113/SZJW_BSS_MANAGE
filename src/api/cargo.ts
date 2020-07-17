import request from '@/utils/request'
const baseURL = '/line'
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

// 线索列表
export const GetClueList = (data: any) =>
  request({
    url: `${baseURL}/v1/line/clue/queryLineClueList`,
    method: 'post',
    data
  })
// 根据当前登陆人,获取所分配的销售列表,统计货主线索
export const GetSaleList = () =>
  request({
    url: `${baseURL}/v1/line/clue/saleList`,
    method: 'get'
  })
// 批量分配销售
export const Distribution = (data: any) =>
  request({
    url: `${baseURL}/v1/line/clue/distribution`,
    method: 'post',
    data
  })
// 无效货主线索 & 点击有效不允许调用
export const ExpiredClue = (data: any) =>
  request({
    url: `${baseURL}/v1/line/clue/expiredClue`,
    method: 'post',
    data
  })
// 根据货主线索ID查询详细内容
export const GetLineClueDetail = (params: any) =>
  request({
    url: `${baseURL}/v1/line/clue/lineClueInfo`,
    method: 'get',
    params
  })
// 是否继续跟进
export const IsFollowClue = (data: any) =>
  request({
    url: `${baseURL}/v1/line/clue/followClue`,
    method: 'post',
    data
  })
