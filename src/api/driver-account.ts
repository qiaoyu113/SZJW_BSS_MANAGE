import request from '@/utils/request'

let prefix = '/driver'

/**
 * XXXX
 */
export const CreateActivity = (data: any) =>
  request({
    url: `${prefix}/v1/driver/clue/create/manually`,
    method: 'post',
    data
  })
