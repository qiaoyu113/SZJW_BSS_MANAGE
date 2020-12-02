import request from '@/utils/request'
// 司机运费账户

let prefix = '/mock/81'
const driverPrefix = '/driver'
const carrierPrefix = '/carrier_center'
// 获取自承运司机标签列表
export const GetDriverTagList = (data: any) =>
  request({
    url: `${driverPrefix}/v2/driver/label-sync/list`,
    method: 'post',
    data
  })
// 导出自承运司机标签列表
export const ExportDriverTagList = (data: any) =>
  request({
    url: `${driverPrefix}/v2/driver/label-sync/export`,
    method: 'post',
    data
  })

// 承运司机标签新增或修改
export const AddDriverTag = (data: any) =>
  request({
    url: `${driverPrefix}/v2/driver/label-sync/create`,
    method: 'post',
    data
  })

export const EditDriverTag = (data: any) =>
  request({
    url: `${driverPrefix}/v2/driver/label-sync/update`,
    method: 'post',
    data
  })
  // 根据司机姓名获取司机信息
export const GetDriverByDriverName = (data: any) =>
  request({
    url: `${carrierPrefix}/v2/driver/getDriverNoAndNameAndBusiTypeListFromESAndRedis`,
    method: 'post',
    data
  })
// 获取司机线索列表
export const GetDriverClueList = (data: any) =>
  request({
    url: `${prefix}/getDriverClueList`,
    method: 'post',
    data
  })
  // 导出司机线索
export const ExportDriverClue = (data: any) =>
  request({
    url: `${prefix}/exportDriverClue`,
    method: 'post',
    data
  })
// 获取司机线索详情
export const GetDriverClueDetail = (params: any) =>
  request({
    url: `${prefix}/getDriverClueDetail`,
    method: 'get',
    params
  })
