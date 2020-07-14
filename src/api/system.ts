import request from '@/utils/request'
// 用户管理-账号查询
export const getUserList = (params: any) =>
  request({
    url: `/v1/base/user/page/list`,
    method: 'get',
    params
  })

// 组织管理-组织列表
export const getOfficeList2 = (params: any) =>
  request({
    url: `/v1/base/office/list`,
    method: 'get',
    params
  })

// 组织管理-组织列表
export const getOfficeList = (num: number = 0) =>
  request({
    url: `/v1/base/office/list/${num}`,
    method: 'get'
  })
// 组织管理-创建组织
export const createOffice = (data: any = {}) =>
  request({
    url: `/v1/base/office/create`,
    method: 'post',
    data
  })
// 组织管理-删除组织
export const deleteOffice = (data: any = {}) =>
  request({
    url: `/v1/base/office/delete`,
    method: 'post',
    data
  })
// 组织管理-俩个组织排序
export const sortOffice = (data: any = {}) =>
  request({
    url: `/v1/base/office/sort`,
    method: 'post',
    data
  })
// 组织管理-修改组织信息
export const updateOffice = (data: any = {}) =>
  request({
    url: `/v1/base/office/update`,
    method: 'post',
    data
  })

// 角色管理-角色列表
export const roleList = () =>
  request({
    url: `/v1/base/role/list`,
    method: 'get'
  })
// 角色管理-角色新增
export const createRole = (data: any = {}) =>
  request({
    url: `/v1/base/role/create`,
    method: 'post',
    data
  })
// 角色管理-角色修改
export const updateRole = (data: any = {}) =>
  request({
    url: `/v1/base/role/update`,
    method: 'post',
    data
  })
// 角色管理-角色删除
export const deleteRole = (id:number) =>
  request({
    url: `/v1/base/role/delete/${id}`,
    method: 'get'
  })
// 角色管理-获取角色详情
export const getRoleDetail = (id:number) =>
  request({
    url: `/v1/base/role/get/${id}`,
    method: 'get'
  })

// 权限管理-权限列表
export const authorityList = () =>
  request({
    url: `/v1/base/authority/list`,
    method: 'get'
  })
// 权限管理-新增权限
export const createAuthority = (data: any = {}) =>
  request({
    url: `/v1/base/authority/create`,
    method: 'post',
    data
  })
// 权限管理-修改权限
export const updateAuthority = (data: any = {}) =>
  request({
    url: `/v1/base/authority/update`,
    method: 'post',
    data
  })
// 权限管理-修改权限
export const deleteAuthority = (id: number) =>
  request({
    url: `/v1/base/authority/${id}`,
    method: 'get'
  })
