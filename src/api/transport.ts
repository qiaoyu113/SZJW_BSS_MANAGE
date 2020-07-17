import request from '@/utils/request'


/* 获取开通城市 */
export const GetReginByCityCode = (data: any[]) =>
  request({
    url: '/api/base/user/area/getCityByCode',
    method: 'post',
    data
  })

/* 获取司机索引列表 */
export const GetDriverClueList = (data: any[]) =>
  request({
    url: '',
    method: 'post',
    data
  })

/* 修改司机索引 */
export const EditDriverClue = (data: any[]) =>
  request({
    url: '',
    method: 'post',
    data
  })
