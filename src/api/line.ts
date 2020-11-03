
import request from '@/utils/request'
const lineURL = '/line'
// 获取配置管理列表
export const getLableLists = (params:any) =>
  request({
    url: `${lineURL}/v2/line/label/list`,
    method: 'get',
    params
  })
// 校验当前城市是否配置过肥瘦标签
export const checkCityIsExist = (params:any) =>
  request({
    url: `${lineURL}/v2/line/label/checkCityIsExist`,
    method: 'get',
    params
  })
  // 创建线路标签
export const saveLineLabel = (data:any) =>
  request({
    url: `${lineURL}/v2/line/label/create`,
    method: 'post',
    data
  })

// 调整线路标签
export const updateLineLabel = (data:any) =>
  request({
    url: `${lineURL}/v2/line/label/update`,
    method: 'put',
    data
  })

// 查询线路标签详情
export const getLineLabelById = (params:any) =>
  request({
    url: `${lineURL}/v2/line/label/getLineLabelById`,
    method: 'get',
    params
  })
