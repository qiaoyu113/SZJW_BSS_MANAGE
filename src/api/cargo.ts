import request from '@/utils/request'
const ptrfix = '/api/line'

export const GetDriverDetail = (id: number, params: any) =>
  request({
    url: '/api/driver/driver/detail',
    method: 'get',
    params
  })

export const GetDriverList = (data: any) =>
  request({
    url: '/api/bss/v1/bss/driver/selectListByKey',
    method: 'post',
    data
  })

export const GetLineDetail = (params: any) =>
  request({
    url: `${ptrfix}/v1/line/detail`,
    method: 'get',
    params
  })

// 创建线路提交
export const createLine = (data: any) =>
  request({
    url: `${ptrfix}/v1/line/create`,
    method: 'post',
    data
  })

// 线路编辑
export const editLine = (data: any) =>
  request({
    url: `${ptrfix}/v1/line/edit`,
    method: 'post',
    data
  })

// 线路审核通过
export const approvedLine = (data: any) =>
  request({
    url: `${ptrfix}/v1/line/approved`,
    method: 'post',
    data
  })

// 线路审核不通过
export const notApprovedLine = (data: any) =>
  request({
    url: `${ptrfix}/v1/line/notApproved`,
    method: 'post',
    data
  })

// 线路操作日志列表

export const GetLogList = (params: any) =>
  request({
    url: `${ptrfix}/v1/line/list`,
    method: 'get',
    params
  })

// 线路停用
export const manualDeactivate = (data: any) =>
  request({
    url: `${ptrfix}/v1/line/manualDeactivate`,
    method: 'post',
    data
  })

// 线路上架
export const shelfAdjustment = (data: any) =>
  request({
    url: `${ptrfix}/v1/line/shelfAdjustment`,
    method: 'post',
    data
  })
// 线路上岗
export const mountGuard = (data: any) =>
  request({
    url: `${ptrfix}/v1/line/mountGuard`,
    method: 'post',
    data
  })
// 线路下架
export const shelveLine = (data: any) =>
  request({
    url: `${ptrfix}/v1/line/shelveLine`,
    method: 'post',
    data
  })

// 线路列表
export const lineListAll = (data: any) =>
  request({
    url: `/api/line-center/v1/line/lineInfo/queryLineListByConditionsQuery`,
    method: 'post',
    data
  })

// 线路照片查看
export const pictureDetail = (params: any) =>
  request({
    url: `${ptrfix}/v1/line/pictureDetail`,
    method: 'get',
    params
  })

// 获取货主详情
export const GetOwnerDetail = (data: any) =>
  request({
    url: '/line/v1/customer/customerInfo',
    method: 'get',
    data
  })
