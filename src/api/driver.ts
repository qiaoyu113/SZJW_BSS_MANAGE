import request from '@/utils/request'

let prefix = '/api/driver'
/**
 * 创建司机线索--人工录入
 */
export const CreateActivity = (data: any) =>
  request({
    url: `${prefix}/v1/driver/clue/create/manually`,
    method: 'post',
    data
  })

/**
   *
   * 编辑司机索引
   */
export const EditActivity = (data: any) =>
  request({
    url: `${prefix}/v1/driver/clue/clue/edit`,
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
   * 分配司机线索
   */
export const ClueDispatch = (data: any) =>
  request({
    url: `${prefix}/v1/driver/clue/clue/dispatch`,
    method: 'post',
    data
  })

/**
   *
   * 获取司机线索跟进列表
   */
export const ClueFollowList = (params: any) =>
  request({
    url: `${prefix}/v1/driver/clue/clue/follow/list`,
    method: 'get',
    params
  })

/**
   *
   * 司机线索跟进
   */
export const ClueFollow = (data: any) =>
  request({
    url: `${prefix}/v1/driver/clue/clue/follow`,
    method: 'post',
    data
  })

/**
   *
   * 填写面试表---step1
   */
export const InterviewBasic = (data: any) =>
  request({
    url: `${prefix}/v1/driver/clue/clue/interview/basic`,
    method: 'post',
    data
  })

export const ShareInterview = (data: any) =>
  request({
    url: `${prefix}/v1/driver/clue/clue/share/interview`,
    method: 'post',
    data
  })
