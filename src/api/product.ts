import request from '@/utils/request'
const baseURL = '/product'
// 分页查询商品信息
export const getProductList = (params: any) => {
  const type = params.busiType === 1 ? 'buyCar' : 'rentalCar'
  return request({
    url: `${baseURL}/v1/product/product/${type}/list/page`,
    method: 'get',
    params
  })
}
// 创建商品
export const createProduct = (data: any) => {
  const type = data.busiType === 1 ? 'buyCar' : 'rentalCar'
  return request({
    url: `${baseURL}/v1/product/product/${type}/create`,
    method: 'post',
    data
  })
}

// 编辑商品
export const updateProduct = (data: any) => {
  const type = data.busiType === 1 ? 'buyCar' : 'rentalCar'
  return request({
    url: `${baseURL}/v1/product/product/${type}/update`,
    method: 'post',
    data
  })
}
// 获取所有车型
export const getCarlist = () =>
  request({
    url: `${baseURL}/v1/product/product/carType/list`,
    method: 'get'
  })
// 获取车辆型号
export const GetCarModelList = (params: any) => {
  const type = params.busiType === 1 ? 'buyCar' : 'rentalCar'
  return request({
    url: `${baseURL}/v1/product/product/${type}/getCarModelList`,
    method: 'get',
    params
  })
}

// 上架或者下架商品
export const shelvesOrTheshelves = (data: any) => {
  const type = data.busiType === 1 ? 'buyCar' : 'rentalCar'
  delete data.busiType
  return request({
    url: `${baseURL}/v1/product/product/${type}/shelvesOrTheshelves`,
    method: 'post',
    data
  })
}
// 系统设置
export const settingSystem = (data: any) =>
  request({
    url: `${baseURL}/v1/product/product/set/system/setting`,
    method: 'post',
    data
  })

// 获取系统设置
export const getSettingSystem = () =>
  request({
    url: `${baseURL}/v1/product/product/get/system/setting`,
    method: 'get'
  })

// 导出
export const ProductDownload = (params: any) => {
  const type = params.busiType === 1 ? 'buyCar' : 'rentalCar'
  return request({
    url: `${baseURL}/v1/product/product/${type}/download`,
    method: 'get',
    responseType: 'blob',
    params
  })
}
