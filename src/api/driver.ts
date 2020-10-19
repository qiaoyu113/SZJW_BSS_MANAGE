import request from '@/utils/request'

let prefix = '/driver'
// let prefix = '/mock/81'

let prefixCarrier = '/carrier_center'
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

export const GetInterviewDetail = (params: any) =>
  request({
    url: `${prefix}/v1/driver/clue/clue/interview/detail`,
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
   * 编辑面试表获取面试表信息
   */
export const GetInterviewEditDetail = (params: any) =>
  request({
    url: `${prefix}/v1/driver/clue/clue/interview/edit/detail`,
    method: 'get',
    params
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

/**
   *
   * 共享金数据保存-面试表
   */
export const ShareInterview = (data: any) =>
  request({
    url: `${prefix}/v1/driver/clue/clue/share/interview`,
    method: 'post',
    data
  })

/**
   *
   * 专车金数据保存-面试表
   */
export const SpecialInterview = (data: any) =>
  request({
    url: `${prefix}/v1/driver/clue/clue/special/interview`,
    method: 'post',
    data
  })

/**
   *
   * 获取司机线索列表
   */
export const GetSpecialInterviewLists = (data: any) =>
  request({
    url: `${prefixCarrier}/v1/driver/clue/list/key-query`,
    method: 'post',
    data
  })

/**
   *
   * 修改司机面试表
   */
export const EditDriverInterviewEdit = (data: any[]) =>
  request({
    url: `${prefix}/v1/driver/clue/clue/edit/interview`,
    method: 'post',
    data
  })

// ------------司机列表接口-----------------

/**
 *
 * 获取司机详情
 */
export const GetDriverDetail = (params: any) =>
  request({
    url: `${prefix}/v1/driver/driverDetailByInview`,
    method: 'post',
    params
  })

/**
 *
 *编辑司机信息
 */
export const EditDriverInfo = (data: any) =>
  request({
    url: `${prefix}/v1/driver/updateDriver`,
    method: 'post',
    data
  })

/**
 *
 * 司机跟进页面信息
 */
export const DriverFollowFormation = (params: any) =>
  request({
    url: `${prefix}/v1/driver/driverFollowFormation`,
    method: 'post',
    params
  })

/**
 *
 * 司机跟进页 --司机跟进操作
 */
export const DriverFollowOp = (data: any) =>
  request({
    url: `${prefix}/v1/driver/driverFollowSave`,
    method: 'post',
    data
  })

/**
 *
 * 司机放弃操作
 */
export const DriverFollowUpToDown = (params: any) =>
  request({
    url: `${prefix}/v1/driver/driverFollowUpToDown`,
    method: 'post',
    params
  })

/**
 *
 * 司机列表--修改加盟经理
 */
export const UpdateDriverBDManager = (data: any) =>
  request({
    url: `${prefix}/v1/driver/updateDriverBDManager`,
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })

/**
 *
 * 分配加盟经理
 */
export const driverDownToGm = (params: any) =>
  request({
    url: `${prefix}/v1/driver/driverDownToGm`,
    method: 'post',
    params
  })

/**
 *
 * 通过driverId获取司机信息
 */
export const driverDetailByDriverId = (params: any) =>
  request({
    url: `${prefix}/v1/driver/driverDetail`,
    method: 'get',
    params
  })

/**
 *
 * 司机详情-运力信息
 */
export const driverDetailToCarrierInfo = (params: any) =>
  request({
    url: `${prefix}/v1/driver/driverDetailToCarrierInfo`,
    method: 'post',
    params
  })

/**
 *
 *司机详情-获取订单信息
 */
export const driverDetailToOrderInfo = (params: any) =>
  request({
    url: `${prefix}/v1/driver/driverDetailToOrderInfo`,
    method: 'post',
    params
  })

/**
   *
   * 获取司机列表
   */
export const GetDriverList = (data: any) =>
  request({
    url: `${prefixCarrier}/v1/driver/getDriverList`,
    method: 'post',
    data
  })

// ==============v2====================

// 根据关键字搜索司机
export const GetDriverListByKerWord = (data: any) =>
  request({
    url: `${prefixCarrier}/v2/driver/getDriverList`,
    method: 'post',
    data
  })

// 加盟经理查询司机列表
export const getDriverListByGmId = (params: any) =>
  request({
    url: `${prefix}/v2/driver/getDriverListByGmId`,
    method: 'get',
    params
  })

// 根据加盟经理模糊查询司机列表
export const getDriverNoAndNameList = (data: any) =>
  request({
    url: `${prefixCarrier}/v2/driver/getDriverNoAndNameList`,
    method: 'post',
    data
  })
// 获取司机名字通过司机id
export const getDriverNameByNo = (params: any) =>
  request({
    url: `${prefixCarrier}/v2/driver/getDriverNameByNo`,
    method: 'get',
    params
  })
