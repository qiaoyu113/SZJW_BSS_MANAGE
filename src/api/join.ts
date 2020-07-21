import request from '@/utils/request'

export const CreateNewOrder = (params: any) =>
  request({
    url: '/order/v1/order/createNewOrder',
    method: 'post',
    data: params
  })

export const RepayOrder = (params: any) =>
  request({
    url: '/order/v1/order/rePay',
    method: 'post',
    data: params
  })

export const GetOrderDetail = (params: any) =>
  request({
    url: '/order/v1/order/orderDetail',
    method: 'get',
    params
  })

export const GetOrderLog = (params: any) =>
  request({
    url: '/order/v1/order/getOrderStatusLogById',
    method: 'get',
    params
  })

export const GetDriverList = (params: any) =>
  request({
    url: '/driver/v1/driver/getDriverAll',
    method: 'get',
    params
  })

export const GetDriverDetail = (params: any) =>
  request({
    url: '/transactions',
    method: 'get',
    params
  })

// 合同详情
export const GetContractDetail = (params: any) =>
  request({
    url: '/order/v1/order/contract/contractDetail',
    method: 'get',
    params
  })

// 交付详情
export const GetOrderDeliverDetail = (params: any) =>
  request({
    url: '/order/v1/order/orderDeliver/orderDeliverDetail',
    method: 'get',
    params
  })

// 提交交付信息
export const SubmitOrderDeliver = (params: any) =>
  request({
    url: '/order/v1/order/orderDeliver/submitOrderDeliverCreateCarrier',
    method: 'post',
    data: params
  })

// 交付详情
export const SelectOrderInfo = (params: any) =>
  request({
    url: '/order/v1/order/orderDeliver/selectOrderInfo',
    method: 'get',
    params
  })

// 获取供应商
export const GetSupplierByTypeAndCity = (data: any) =>
  request({
    url: '/product/v1/product/product/getSupplierByTypeAndCity',
    method: 'post',
    data: data
  })
// 合作车型
export const GetCarTypeByTypeAndCityAndSupplier = (params: any) =>
  request({
    url: '/product/v1/product/product/getCarTypeByTypeAndCityAndSupplier',
    method: 'post',
    data: params
  })
// 合同列表

export const GetContractList = (params: any) =>
  request({
    url: '/business_center/v1/contract/getContractList',
    method: 'post',
    data: params
  })

// 无税车价
export const GetPriceByTypeAndCityAndSupplierAndCarType = (params: any) =>
  request({
    url: '/product/v1/product/product/getCarTypeByTypeAndCityAndSupplier',
    method: 'post',
    data: params
  })

// 车价
export const GetPriceAndByTypeAndCityAndSupplierAndCarType = (params: any) =>
  request({
    url: '/product/v1/product/product/getPriceAndByTypeAndCityAndSupplierAndCarType',
    method: 'post',
    data: params
  })

// 激活

export const ActiveContract = (params: any) =>
  request({
    url: '/order/v1/order/contract/activeContract',
    method: 'get',
    params
  })
// 下载合同

export const DownloadContract = (params: any) =>
  request({
    url: '/order/v1/order/contract/downloadContract',
    method: 'get',
    params
  })

// 订单列表
export const GetOrderInfoList = (params: any) =>
  request({
    url: '/business_center/v1/order/getOrderInfoList',
    method: 'post',
    data: params
  })

// 取消订单
export const CancelOrder = (params: any) =>
  request({
    url: '/order/v1/order/cancelOrder',
    method: 'post',
    data: params
  })

// 订单审核
export const PostAuditOrder = (params: any) =>
  request({
    url: '/order/v1/order/auditOrder',
    method: 'post',
    data: params
  })

// 订单确认
export const PostConfirmOrder = (params: any) =>
  request({
    url: '/order/v1/order/confirmOrder',
    method: 'post',
    data: params
  })

// 交付列表
export const GetDelieverList = (params: any) =>
  request({
    // url: 'line_center/v1/line/customer/queryLineCustomerList',
    url: '/business_center/v1/order/deliever/getDelieverList',
    method: 'post',
    data: params
  })

// 交付列表
export const GetOperManagerListByUserId = (params: any) =>
  request({
    url: '/order/v1/order/deliever/getDelieverList',
    method: 'post',
    data: params
  })

// 获取车型
export const GetModelByTypeAndCityAndSupplierAndCarType = (data: any) =>
  request({
    url: '/product/v1/product/product/getModelByTypeAndCityAndSupplierAndCarType',
    method: 'post',
    data
  })

// 交付导出
export const DelieverExportDown = (params: any) =>
  request({
    url: '/business_center/v1/order/deliever/delieverExport',
    method: 'post',
    responseType: 'blob',
    data: params
  })

// 合同导出
export const ContractExport = (params: any) =>
  request({
    url: `business_center/v1/contract/contractExport`,
    method: 'post',
    responseType: 'blob',
    data: params
  })

// 订单导出
export const OrderExport = (params: any) =>
  request({
    url: `business_center/v1/order/orderExport`,
    method: 'post',
    responseType: 'blob',
    data: params
  })
