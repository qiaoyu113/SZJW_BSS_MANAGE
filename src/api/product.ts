import request from '@/utils/request'
const baseURL = '/product'
// 分页查询商品信息
export const getProductList = (params: any) =>
  request({
    url: `${baseURL}/v1/product/product/list/page`,
    method: 'get',
    params
  })

// 创建商品
export const createProduct = (data: any) =>
  request({
    url: `${baseURL}/v1/product/product/create`,
    method: 'post',
    data
  })

// 编辑商品
export const updateProduct = (data: any) =>
  request({
    url: `${baseURL}/v1/product/product/update`,
    method: 'post',
    data
  })

// 上架或者下架商品
export const shelvesOrTheshelves = (data: any) =>
  request({
    url: `${baseURL}/v1/product/product/shelvesOrTheshelves`,
    method: 'post',
    data
  })

// 系统设置
export const settingSystem = (data: any) =>
  request({
    url: `${baseURL}/v1/product/product/system/setting`,
    method: 'post',
    data
  })

// 获取系统设置
export const getSettingSystem = () =>
  request({
    url: `${baseURL}/v1/product/product/system/setting`,
    method: 'get'
  })
