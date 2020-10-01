import request from '@/utils/request'

let prefix = '/mock/112'

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
    url: `${prefix2}/v2/wt-driver-account/flow/list`,
    method: 'get',
    params
  })
