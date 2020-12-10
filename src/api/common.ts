import request from '@/utils/request'
const baseURL = '/base'
const baseCenterUrl = '/base_center'
export const GetDictionary = (data: any) =>
  request({
    // url: `${baseURL}/v1/base/dict/dictData/list`, //旧 12.10
    url: `${baseCenterUrl}/open/v1/dict/dictData/list`,
    method: 'get',
    params: data
  })
// 批量查询字典
export const GetDictionaryList = (data: any) =>
  request({
    // url: `${baseURL}/v1/base/dict/dict/list/types`, //旧 12.10
    url: `${baseCenterUrl}/open/v1/dict/list/types`,
    method: 'post',
    data
  })
// 获取加盟经理列表
export const GetJoinManageList = (params: any) =>
  request({
    url: `${baseURL}/v1/base/user/getCurrUserAuthList?url=${params.uri}`,
    method: 'post'
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
  url: `${baseURL}/v1/base/office/getCurrentLowerOfficeCityData`,
  method: 'get'
})
// 获取字典城市
export const GetDictionaryCity = () => request({
  // url: `${baseURL}/v1/base/area/getOpenCityData`,//旧 12.10
  url: `${baseCenterUrl}/open/v1/area/getOpenCityData`,
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
export const GetManagerLists = (params:any) =>
  request({
    url: `${baseURL}/v1/base/user/getCurrUserAuthList?url=${params.uri}`,
    method: 'post'
  })
// 获取城市详情
export const detailCity = (data:any) =>
  request({
    // url: `${baseURL}/v1/base/area/getTownByCountryCode`,//旧 12.10
    url: `${baseCenterUrl}/open/v1/area/getTownByCountryCode`,
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
    url: `business_center/v1/order/getPayTypeList`,
    method: 'get',
    data
  })

/**
   *
   * 获取下载文件列表
   */
export const GetDownFileList = (data:any) =>
  request({
    url: `/core/v1/core/exportDownRecord/selectByUserId`,
    method: 'post',
    data
  })

// 组织大区查询
export const getOfficeByType = (data:any) =>
  request({
    url: `base/v2/base/office/getOfficeByType`,
    method: 'get',
    params: data
  })

// 组织大区下城市查询
export const getOfficeByTypeAndOfficeId = (data:any) =>
  request({
    url: `base/v2/base/office/getOfficeByTypeAndOfficeId`,
    method: 'get',
    params: data
  })

// 加盟经理(1)  外销销售(2) 上岗经理(3)
export const GetSpecifiedRoleList = (data:any) =>
  request({
    url: `/base/v2/base/user/getSpecifiedLowerUserListByCondition`,
    method: 'post',
    data
  })
// 获取业务线列表
export const GetDutyListByLevel = (data:any) =>
  request({
    url: `/base/v2/base/duty/getPartFirstDutyList`,
    method: 'get',
    data,
    params: data
  })
// 获取加盟经理（可塞选）
export const GetSpecifiedLowerUserListByCondition = (data:any) =>
  request({
    url: `/base/v2/base/user/getSpecifiedLowerUserListByCondition`,
    method: 'post',
    data
  })

// 查询加盟经理
export const getSpecifiedUserListByCondition = (data:any) =>
  request({
    url: `/base/v2/base/user/getSpecifiedUserListByCondition`,
    method: 'post',
    data
  })

// 根据城市、业务线获取小组
export const getGroupInfoByCityCodeAndProductLine = (params:any) =>
  request({
    url: `/base/v2/base/office/getGroupInfoByCondition`,
    method: 'get',
    params
  })
