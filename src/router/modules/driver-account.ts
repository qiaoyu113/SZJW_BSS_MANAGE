import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const driverAccountRouter: RouteConfig = {
  path: '/driveraccount',
  component: Layout,
  redirect: '/driveraccount/list',
  name: 'DriverAccount',
  meta: {
    title: 'driverAccount',
    icon: 'driver',
    hidden: true,
    apiUrl: 'root'
  },
  children: [
    {
      path: 'list',
      component: () => import(/* webpackChunkName: "driver" */ '@/views/driver/DriverList.vue'),
      name: 'DriverList',
      meta: {
        apiUrl: '/bss/v1/bss/driver/selectListByKey',
        title: 'driverList',
        noCache: false
      }
    },
    {
      path: 'billing', /* 计费管理 */
      component: () => import(/* webpackChunkName: "billing" */ '@/views/billing/List/index.vue'),
      name: 'Billing',
      meta: {
        apiUrl: 'root',
        activeMenu: '/driveraccount/billing',
        title: 'billing',
        icon: 'cargo',
        noCache: false
      }
    },
    {
      path: 'billingLog', /* 计费管理日志 */
      component: () => import(/* webpackChunkName: "billing" */ '@/views/billing/Log/index.vue'),
      name: 'BillingLog',
      meta: {
        apiUrl: 'root',
        activeMenu: '/driveraccount/billing',
        title: 'billingLog',
        icon: 'cargo',
        hidden: true,
        noCache: false
      }
    }
  ]
}

export default driverAccountRouter
