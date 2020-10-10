import request from '@/utils/request'

// let prefix = '/mock/67'
let prefix = ''
// let prefix2 = '/mock/25'
let prefix2 = ''
// let prefix = '/api/waybill_center'

/**
 * 操作日志查询
 */
export const freightLog = (data: any) =>
  request({
    url: `${prefix || '/waybill'}/v2/waybill/shipping/queryLog`,
    method: 'post',
    data
  })

/**
   *
   * 运单详情
   */
export const freightDetail = (params: any) =>
  request({
    url: `${prefix || '/waybill'}/v2/waybill/shipping/shippingDetail`,
    method: 'post',
    params
  })

/**
   *
   * 获取司机线索相信信息
   */
export const GetClueDetailByClueId = (params: any) =>
  request({
    url: `${prefix || '/driver'}/v1/driver/clue/clue/detail`,
    method: 'get',
    params
  })

/**
   *
   * 获取列表
   */
export const GetConfirmInfoList = (data: any) =>
  request({
    url: `${prefix || '/waybill_center'}/v2/waybill/getConfirmInfoList`,
    method: 'post',
    data
  })

/**
   *
   * 上报出车金额
   */
export const ReportMoneyBatch = (data: any, parmas: any) =>
  request({
    url: `${prefix || '/waybill'}/v2/waybill/shipping/reportMoneyBatch?remark=` + parmas,
    method: 'post',
    data
  })

/**
   *
   * 批量上报、运费回显
   */
export const WayBillAmountDetail = (data: any) =>
  request({
    url: `${prefix || '/waybill'}/v2/waybill/shipping/wayBillAmountDetail`,
    method: 'post',
    data
  })

/**
   *
   * 批量未上报
   */
export const NoCarBatch = (data: any) =>
  request({
    url: `${prefix || '/waybill'}/v2/waybill/shipping/noCarBatch`,
    method: 'post',
    data
  })

/**
   *
   * 获取外线销售和上岗经理
   */
export const GetSpecifiedRoleList = (params: any) =>
  request({
    url: `${prefix2 || '/base'}/v1/base/role/getSpecifiedRoleList?roleId=` + params,
    method: 'post'
  })

/**
   *
   * 获取出车详情运费列表
   */
export const freightDetailLog = (params: any) =>
  request({
    url: `${prefix || '/waybill'}/v2/waybill/shipping/getFreightDetailLog`,
    method: 'post',
    params
  })
