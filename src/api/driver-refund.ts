import request from '@/utils/request'

export const GetFreightChargeList = (data: any) =>
  request({
    url: `$/v2/driverBilling/freightCharge/list`,
    method: 'post',
    data
  })
