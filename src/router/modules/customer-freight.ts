import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'
// 客户运费账户
const customerFreight: RouteConfig = {
  path: '/customerfreight',
  component: Layout,
  redirect: '/customerfreight/list',
  name: 'CustomerFreightAccount',
  meta: {
    title: 'customerFreightAccount',
    icon: 'clientFreight',
    apiUrl: ['/v2/waybill/custBilling/freightCharge/list', '/v2/waybill/custBilling/monthlyBill/list']
    // hidden: true
  },
  children: [
    {
      path: 'list',
      component: () => import(/* webpackChunkName: "customerfreight" */ '@/views/customer-freight/FreightList.vue'),
      name: 'CustomerFreightList',
      meta: {
        apiUrl: 'root',
        hidden: true,
        title: 'customerFreightList',
        noCache: false
      }
    },
    {
      path: 'bill',
      component: () => import(/* webpackChunkName: "customerfreight" */ '@/views/customer-freight/FreightBill.vue'),
      name: 'CustomerFreightBillList',
      meta: {
        apiUrl: '/v2/waybill/custBilling/freightCharge/list',
        title: 'customerFreightBillList',
        noCache: false
      }
    },
    {
      path: 'monthbill',
      component: () => import(/* webpackChunkName: "customerfreight" */ '@/views/customer-freight/FreightMonthBill.vue'),
      name: 'CustomerFreightMonthBill',
      meta: {
        apiUrl: '/v2/waybill/custBilling/monthlyBill/list',
        title: 'customerFreightMonthBill',
        noCache: false
      }
    }
  ]
}

export default customerFreight
