import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const freightRouter: RouteConfig = {
  path: '/freight', /* 货源中心 */
  component: Layout,
  redirect: '/freight/freightlist',
  name: 'Freight',
  meta: {
    title: 'freightTitle',
    icon: 'lifeCycle',
    alwaysShow: true,
    apiUrl: ['/v2/waybill/getConfirmInfoList']
  },
  children: [
    {
      path: 'freightlist', /* 运费列表 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/freight/FreightList.vue'),
      name: 'FreightList',
      meta: {
        apiUrl: '/v2/waybill/getConfirmInfoList',
        // apiUrl: 'root',
        title: 'freightList',
        noCache: false
      }
    },
    {
      path: 'freightdetail', /* 运费详情 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/freight/FreightDetail.vue'),
      name: 'FreightDetail',
      meta: {
        apiUrl: '/v2/waybill/shipping/shippingDetail',
        // apiUrl: 'root',
        activeMenu: '/freight/freightlist',
        title: 'freightDetail',
        icon: 'cargo',
        hidden: true,
        noCache: true
      }
    },
    {
      path: 'freightlog', /* 运费日志 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/freight/FreightLog.vue'),
      name: 'FreightLog',
      meta: {
        // apiUrl: '/v2/waybill/shipping/queryLog',
        apiUrl: 'root',
        activeMenu: '/freight/freightlist',
        title: 'freightLog',
        icon: 'cargo',
        hidden: true,
        noCache: false
      }
    }
  ]
}

export default freightRouter
