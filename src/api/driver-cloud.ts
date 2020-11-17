import request from '@/utils/request'
// 司机运费账户

let prefix = '/mock/81'
// let prefix = '/'
// 获取自承运司机标签列表
export const GetDriverTagList = (params: any) =>
  request({
    url: `${prefix}/getDriverTagList`,
    method: 'get',
    params
  })
// 导出自承运司机标签列表
export const ExportDriverTagList = (params: any) =>
  request({
    url: `${prefix}/exportDriverTagList`,
    method: 'get',
    params
  })

// 承运司机标签新增或修改
export const AddOrEditDriverTag = (data: any) =>
  request({
    url: `${prefix}/addOrEditDriverTag`,
    method: 'post',
    data
  })
  // 根据司机姓名获取司机信息
export const GetDriverByDriverName = (params: any) =>
  request({
    url: `${prefix}/getDriverByDriverName`,
    method: 'get',
    params
  })
