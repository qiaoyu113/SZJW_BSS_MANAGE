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

// 地区
export const GetArea = (data: any) =>
  request({
    url: `${baseURL}/v1/base/area/getCityByCode`,
    method: 'post',
    data
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
    url: `${baseURL}/v1/base/user/getManagerListByUserId`,
    method: 'post'
  })

/**
   *获取已开通的城市
   */
export const GetOpenCityData = () =>
  request({
    url: `${baseURL}/v1/base/area/getOpenCityData`,
    method: 'get'
  })
