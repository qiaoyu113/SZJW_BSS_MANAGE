import request from '@/utils/request'
const baseURL = '/base'
export const GetDictionary = (data: any) =>
  request({
    url: `${baseURL}/v1/base/dict/dictData/list`,
    method: 'get',
    params: data
  })
// 批量查询字典
export const GetDictionaryList = (data: any) =>
  request({
    url: `${baseURL}/v1/base/dict/dict/list/types`,
    method: 'post',
    data
  })
// 获取加盟经理列表
export const GetJoinManageList = (data: any) =>
  request({
    url: `${baseURL}/v1/base/user/getLowerStaffInfo`,
    method: 'post',
    data
  })

// 地区
export const GetArea = (data: any) =>
  request({
    url: `${baseURL}/v1/base/area/getCityByCode`,
    method: 'post',
    data
  })

// 获取工作城市
export const GetOpenCityData = () => request({
  url: `${baseURL}/v1/base/area/getOpenCityData`,
  method: 'get'
})

// 运营经理
export const getOperManager = () =>
  request({
    url: `${baseURL}/v1/base/user/getOperManagerListByUserId`,
    method: 'post'
  })

/**
   *根据父级code获取子列表
   *
   */
export const GetCityByCode = (data: any) =>
  request({
    url: `${baseURL}/v1/base/area/getCityByCode`,
    method: 'post',
    data
  })

/**
   *
   *获取加盟经理列表
   */
export const GetManagerLists = () =>
  request({
    url: `${baseURL}/v1/base/user/getJoinManagerListByUserId`,
    method: 'post'
  })

/**
   *
   *获取加盟经理列表
   */
export const detailCity = (data:any) =>
  request({
    url: `${baseURL}/v1/base/area/getTownByCountryCode`,
    method: 'get',
    params: data
  })

// 上传文件
export const Upload = (params: any, data: any) =>
  request({
    url: `core/v1/upload/uploadOSS/${params.folder}/${params.isEncode}/${params.expire}`,
    method: 'post',
    data
  })

// 获取支付方式
export const GetPayList = (data:any) =>
  request({
    url: `order/v1/order/getPayTypeList`,
    method: 'get',
    data
  })
