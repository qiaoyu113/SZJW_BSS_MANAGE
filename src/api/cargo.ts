import request from '@/utils/request'
const ptrfix = '/line'

// 获取司机详情
export const GetDriverDetail = (id: number, params: any) =>
  request({
    url: '/api/driver/driver/detail',
    method: 'get',
    params
  })
// 获取司机列表
export const GetDriverList = (data: any) =>
  request({
    url: '/api/bss/v1/bss/driver/selectListByKey',
    method: 'post',
    data
  })
// 线索列表
export const GetClueList = (data: any) =>
  request({
    url: `/line_center/v1/line/clue/queryLineClueList`,
    method: 'post',
    data
  })
// 根据当前登陆人,获取所分配的销售列表,统计货主线索
export const GetSaleList = () =>
  request({
    url: `${ptrfix}/v1/line/clue/saleList`,
    method: 'get'
  })
// 批量分配销售
export const Distribution = (data: any) =>
  request({
    url: `${ptrfix}/v1/line/clue/distribution`,
    method: 'post',
    data
  })
// 无效货主线索 & 点击有效不允许调用
export const ExpiredClue = (data: any) =>
  request({
    url: `${ptrfix}/v1/line/clue/expiredClue`,
    method: 'post',
    data
  })
// 根据货主线索ID查询详细内容
export const GetLineClueDetail = (params: any) =>
  request({
    url: `${ptrfix}/v1/line/clue/lineClueInfo`,
    method: 'get',
    params
  })
// 新增货主线索信息
export const SaveLineClue = (data: any) =>
  request({
    url: `${ptrfix}/v1/line/clue/save`,
    method: 'post',
    data
  })
// 货主线索进行编辑
export const EditLineClue = (data: any) =>
  request({
    url: `${ptrfix}/v1/line/clue/lineClueEdit`,
    method: 'put',
    data
  })
// 是否继续跟进
export const IsFollowClue = (data: any) =>
  request({
    url: `${ptrfix}/v1/line/clue/followClue`,
    method: 'post',
    data
  })

// 线路详情
export const GetLineDetail = (params: any) =>
  request({
    url: `${ptrfix}/v1/line/detail`,
    method: 'get',
    params
  })

// 货主线索编辑为有效线索
export const ActivationClue = (params: any) =>
  request({
    url: `${ptrfix}/v1/line/clue/activationClue`,
    method: 'get',
    params
  })
// 转化货主
export const TransformCustomer = (data: any) =>
  request({
    url: `${ptrfix}/v1/customer/transformCustomer`,
    method: 'post',
    data
  })
// 货主详情
export const GetCustomerDetails = (params: any) =>
  request({
    url: `${ptrfix}/v1/customer/onlyCustomerInfo`,
    method: 'get',
    params
  })
// 货主编辑
export const EditCustomer = (data: any) =>
  request({
    url: `${ptrfix}/v1/customer/edit`,
    method: 'post',
    data
  })
// 获取手机号
export const GetPhone = (params: any) =>
  request({
    url: `${ptrfix}/v1/line/clue/getPhone`,
    method: 'get',
    params
  })
// 获取手机号2
export const ShowPhone = (params: any) =>
  request({
    url: `${ptrfix}/v1/line/clue/showPhone`,
    method: 'get',
    params
  })
// 查询当前用户所拥有的地市
export const GetCustomerOff = () =>
  request({
    url: `/base/v1/base/office/getCurrentLowerOfficeCityData`,
    method: 'get'
  })
// 创建线路提交
export const createLine = (data: any) =>
  request({
    url: `${ptrfix}/v1/line/create`,
    method: 'post',
    data
  })
  // 复制线路提交
export const copyLine = (data: any) =>
  request({
    url: `${ptrfix}/v1/line/copy`,
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
    params: data
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
    params: data
  })
// 线路下架
export const shelveLine = (data: any) =>
  request({
    url: `${ptrfix}/v1/line/shelveLine`,
    method: 'post',
    params: data
  })

// 线路列表
export const lineListAll = (data: any) =>
  request({
    url: `/line_center/v1/line/lineInfo/queryLineListByConditionsQuery`,
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
export const GetOwnerDetail = (params: any) =>
  request({
    url: '/line/v1/customer/customerInfo',
    method: 'get',
    params
  })

// 获取线索详情
export const GetLineClueInfo = (params: any) =>
  request({
    url: '/line/v1/line/clue/lineClueInfo',
    method: 'get',
    params
  })

/**
   *保存修改线路照片
   *
   */
export const SaveOrUpdatePicture = (data: any) =>
  request({
    url: `${ptrfix}/v1/line/saveOrUpdatePicture`,
    method: 'post',
    data
  })

// 模糊查询货主名称
export const customerCheckNames = (data: any) =>
  request({
    url: `/line_center/v1/line/customer/fuzzy/checkNames`,
    method: 'post',
    data
  })

// 线索模版导入记录列表
export const importInfoList = (data: any) =>
  request({
    url: `${ptrfix}/v1/line/clue/importInfoList`,
    method: 'post',
    data
  })
// 线索模版导入详细记录列表
export const importDetailList = (data: any) =>
  request({
    url: `${ptrfix}/v1/line/clue/importDetailList`,
    method: 'post',
    data
  })
// 批量导入货主线索列表—— 展示消息_此次操作信息会在导入详细列表展示
export const fileUpload = (data: any) =>
  request({
    url: `${ptrfix}/v1/line/clue/importLineClue`,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
// 货主手机号查询
export const GetFindBusinessPhone = (params: any) =>
  request({
    url: `/line/v1/customer/findBusinessPhone`,
    method: 'get',
    params
  })

// 线索手机号查询

export const GetShowPhone = (params: any) =>
  request({
    url: `/line/v1/line/clue/showPhone`,
    method: 'get',
    params
  })

// 线路名称模糊查询
export const fuzzyCheckNames = (data: any) =>
  request({
    url: `/line_center/v1/line/lineInfo/fuzzyCheckNames`,
    method: 'post',
    data
  })

// 线路导出下载
export const lineExport = (data: any) =>
  request({
    url: `/line_center/v1/line/lineInfo/lineExport`,
    method: 'post',
    data
  })

// 线路批量审核通过
export const batchApproved = (data: any) =>
  request({
    url: `${ptrfix}/v1/line/batchApproved`,
    method: 'post',
    data
  })

// 线路批量不审核通过
export const batchNoApproved = (data: any, bodyParams:any) =>
  request({
    url: `${ptrfix}/v1/line/batchNotApproved?reason${data.reason}`,
    method: 'post',
    data: bodyParams
  })
