import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const transportRouter: RouteConfig = {
  path: '/transport', /* 运力中心 */
  component: Layout,
  redirect: '/transport/driverclue',
  name: 'Transport',
  meta: {
    title: 'transportTitle',
    icon: 'client',
    apiUrl: 'root'
  },
  children: [
    {
      path: 'driverclue', /* 司机线索 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/transport/DriverClue.vue'),
      name: 'DriverClue',
      meta: {
        apiUrl: '/bss/v1/bss/line/customer/selectListByKey',
        activeMenu: '/transport/driverclue',
        title: 'driverClue',
        icon: '',
        noCache: false
      }
    },
    {
      path: 'driverlist', /* 司机列表 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/transport/DriverList.vue'),
      name: 'DriverList',
      meta: {
        apiUrl: '/bss/v1/bss/line/customer/selectListByKey',
        activeMenu: '/transport/driverlist',
        title: 'driverList',
        icon: '',
        noCache: false
      }
    },
    {
      path: 'transportlist', /* 运力列表 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/transport/TransportList.vue'),
      name: 'TransportList',
      meta: {
        title: 'transportList',
        activeMenu: '/transport/transportlist',
        noCache: false,
        icon: '',
        apiUrl: 'root'
      }
    },
    {
      path: 'accountlist', /* 司机账户 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/transport/AccountList.vue'),
      name: 'AccountList',
      meta: {
        title: 'accountList',
        activeMenu: '/transport/accountlist',
        noCache: false,
        icon: '',
        apiUrl: 'root'
      }
    }
  ]
}

export default transportRouter
