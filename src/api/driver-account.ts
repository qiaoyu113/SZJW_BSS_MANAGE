import request from '@/utils/request'

let prefix = '/mock/112/v2/bill'
let prefix2 = '/mock/112'

/**
 * XXXX
 */
export const CreateActivity = (data: any) =>
  request({
    url: `${prefix}/v1/driver/clue/create/manually`,
    method: 'post',
    data
  })

/**
   *
   * 获取梧桐账户列表
   */
export const getAcountList = (data: any) =>
  request({
    url: `${prefix}/v2/wt-driver-account/management/list`,
    method: 'post',
    data
  })

/**
   *
   * 梧桐账户列表冻结
   */
export const accountFreeze = (data: any) =>
  request({
    url: `${prefix}/v2/wt-driver-account/management/freeze`,
    method: 'post',
    data
  })

/**
   *
   * 梧桐账户列表冻结
   */
export const accountUnfreeze = (data: any) =>
  request({
    url: `${prefix}/v2/wt-driver-account/management/unfreeze`,
    method: 'post',
    data
  })

// 获取财务流水列表
export const getFlowList = (params: any) =>
  request({
    url: `${prefix}/v2/wt-driver-account/flow/list`,
    method: 'get',
    params
  })

// 导出财务流水
export const exportFlowList = (params: any) =>
  request({
    url: `${prefix2}/v2/wt-driver-account/flow/export`,
    method: 'get',
    params
  })

// 手动添加流水
export const saveFlowData = (data: any) =>
  request({
    url: `${prefix2}/v2/wt-driver-account/flow/manual/create`,
    method: 'post',
    data
  })
