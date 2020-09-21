import request from '@/utils/request'
const baseURL = '/base'
// 用户管理-账号查询
export const getUserList = (params: any) =>
  request({
    url: `${baseURL}/v1/base/user/page/list`,
    method: 'get',
    params
  })
// 用户管理-账号禁用
export const enableOrDisable = (data: any) =>
  request({
    url: `${baseURL}/v1/base/user/enableOrDisable`,
    method: 'post',
    data
  })

// 用户管理-重置密码
export const resetPassword = (data: any) =>
  request({
    url: `${baseURL}/v1/base/user/password/reset`,
    method: 'post',
    data
  })
// 用户管理-创建用户
export const createUser = (data: any) =>
  request({
    url: `${baseURL}/v1/base/user/create`,
    method: 'post',
    data
  })
// 用户管理-编辑用户
export const updateUser = (data: any) =>
  request({
    url: `${baseURL}/v1/base/user/update`,
    method: 'post',
    data
  })
// 用户管理-用户详情
export const userDetail = (id: number) =>
  request({
    url: `${baseURL}/v1/base/user/getUserById`,
    method: 'get',
    params: {
      userId: id
    }
  })
//
export const getOfficeByCurrentUser = () =>
  request({
    url: `${baseURL}/v1/base/office/list/getOfficeByCurrentUser`,
    method: 'get'
  })
// 组织管理-组织列表
export const getOfficeList2 = (params: any) =>
  request({
    url: `${baseURL}/v1/base/office/list`,
    method: 'get',
    params
  })

// 组织管理-组织列表
export const getOfficeList = () =>
  request({
    url: `${baseURL}/v2/base/office/list`,
    method: 'get'
  })
// 组织管理-创建组织
export const createOffice = (data: any = {}) =>
  request({
    url: `${baseURL}/v2/base/office/create`,
    method: 'post',
    data
  })
// 组织管理-俩个组织排序
export const sortOffice = (data: any = {}) =>
  request({
    url: `${baseURL}/v1/base/office/sort`,
    method: 'post',
    data
  })
  // 组织管理-查询职责列表
export const getDutyListByLevel = (params: any = {}) =>
  request({
    url: `${baseURL}/v2/base/duty/getDutyListByLevel`,
    method: 'post',
    params
  })
// 组织管理-修改组织信息
export const updateOffice = (data: any = {}) =>
  request({
    url: `${baseURL}/v2/base/office/update`,
    method: 'post',
    data
  })
  // 组织管理-删除组织
export const deleteOffice = (data: any = {}) =>
  request({
    url: `${baseURL}/v2/base/office/delete`,
    method: 'post',
    data
  })
// 获取当前登录人下属的相关角色的用户列表
export const getSpecifiedLower = (data: any = {}) =>
  request({
    url: `${baseURL}/v2/base/user/getSpecifiedLowerUserListByCondition`,
    method: 'post',
    data
  })

// 角色管理-角色列表
export const roleList = () =>
  request({
    url: `${baseURL}/v2/base/role/list`,
    method: 'get'
  })
// 角色管理-角色新增
export const createRole = (data: any = {}) =>
  request({
    url: `${baseURL}/v2/base/role/create`,
    method: 'post',
    data
  })
// 角色管理-角色修改
export const updateRole = (data: any = {}) =>
  request({
    url: `${baseURL}/v1/base/role/update`,
    method: 'post',
    data
  })
// 角色管理-角色删除
export const deleteRole = (id:number) =>
  request({
    url: `${baseURL}/v2/base/role/deleteByRoleId`,
    method: 'get',
    params: {
      roleId: id
    }
  })
// 角色管理-获取角色详情
export const getRoleDetail = (id:number) =>
  request({
    url: `${baseURL}/v2/base/role/getByRoleId`,
    method: 'get',
    params: {
      roleId: id
    }
  })

// 权限管理-权限列表
export const authorityList = () =>
  request({
    url: `${baseURL}/v1/base/authority/list`,
    method: 'get'
  })
// 权限管理-新增权限
export const createAuthority = (data: any = {}) =>
  request({
    url: `${baseURL}/v1/base/authority/create`,
    method: 'post',
    data
  })
// 权限管理-修改权限
export const updateAuthority = (data: any = {}) =>
  request({
    url: `${baseURL}/v1/base/authority/update`,
    method: 'post',
    data
  })
// 权限管理-删除权限
export const deleteAuthority = (id: number) =>
  request({
    url: `${baseURL}/v1/base/authority/deleteByAuthId`,
    method: 'get',
    params: {
      authId: id
    }
  })

// 职责管理-职责列表
export const dutyList = () =>
  request({
    url: `${baseURL}/v2/base/duty/list`,
    method: 'get'
  })
// 职责管理-创建职责
export const createDuty = (data: any = {}) =>
  request({
    url: `${baseURL}/v2/base/duty/create`,
    method: 'post',
    data
  })
// 职责管理-编辑职责
export const updateDuty = (data: any = {}) =>
  request({
    url: `${baseURL}/v2/base/duty/update`,
    method: 'post',
    data
  })
// 职责管理-删除职责
export const deleteDuty = (data: any = {}) =>
  request({
    url: `${baseURL}/v2/base/duty/delete`,
    method: 'post',
    data
  })
// 获取用户列表-new
export const getUserManagerList = (params:any) =>
  request({
    url: `${baseURL}/v1/base/user/page/list`,
    method: 'get',
    params
  })
// 获取组织架构-new
export const getOfficeByCurrentUserV2 = () =>
  request({
    url: `${baseURL}/v2/base/office/list`,
    method: 'get'
  })

export interface RoleParams {
    dutyId?:number;
    officeLevel:number;
  }
// 根据组织架构获取角色-new
export const getDutyAndRoleList = (data:RoleParams) =>
  request({
    url: `${baseURL}/v2/base/duty/getDutyAndRoleList`,
    method: 'post',
    data
  })

// 创建用户-new
export const addUser = (data:any) =>
  request({
    url: `${baseURL}/v2/base/user/create`,
    method: 'post',
    data
  })

// 修改用户-new
export const modifyUser = (data:any) =>
  request({
    url: `${baseURL}/v2/base/user/update`,
    method: 'post',
    data
  })

// 启用或禁用用户
export const enableOrDisableUser = (data:any) =>
  request({
    url: `${baseURL}/v2/base/user/enableOrDisable`,
    method: 'post',
    data
  })

// 同步用户到crm
export const pushUserToCRM = (params:any) =>
  request({
    url: `${baseURL}/v2/base/user/pushUserToCRM`,
    method: 'post',
    params
  })
