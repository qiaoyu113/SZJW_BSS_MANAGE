import request from '@/utils/request'

let prefix = '/mock/67'

/**
 * 操作日志查询
 */
export const freightLog = (data: any) =>
  request({
    url: `${prefix}/v2/waybill/shipping/queryLog`,
    method: 'post',
    data
  })

/**
   *
   * 运单详情
   */
export const freightDetail = (data: any) =>
  request({
    url: `${prefix}/v2/waybill/shipping/shippingDetail`,
    method: 'post',
    data
  })

/**
   *
   * 获取司机线索相信信息
   */
export const GetClueDetailByClueId = (params: any) =>
  request({
    url: `${prefix}/v1/driver/clue/clue/detail`,
    method: 'get',
    params
  })

/**
   *
   * 获取列表
   */
export const GetConfirmInfoList = (data: any) =>
  request({
    url: `${prefix}/v2/waybill/getConfirmInfoList`,
    method: 'post',
    data
  })

/**
   *
   * 上报出车金额
   */
export const ReportMoneyBatch = (data: any) =>
  request({
    url: `${prefix}/v2/waybill/reportMoneyBatch`,
    method: 'post',
    data
  })

/**
   *
   * 批量上报、运费回显
   */
export const WayBillAmountDetail = (data: any) =>
  request({
    url: `${prefix}/v2/waybill/wayBillAmountDetail`,
    method: 'post',
    data
  })

/**
   *
   * 批量未上报
   */
export const NoCarBatch = (data: any) =>
  request({
    url: `${prefix}/v2/waybill/noCarBatch`,
    method: 'post',
    data
  })
