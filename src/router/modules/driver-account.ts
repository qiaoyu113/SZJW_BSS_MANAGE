import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const driverAccountRouter: RouteConfig = {
  path: '/driveraccount',
  component: Layout,
  redirect: '/driveraccount/list',
  name: 'DriverAccount',
  meta: {
    title: 'driverAccount',
    // hidden: true,
    icon: 'driver',
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
      component: () => import(/* webpackChunkName: "billing" */ '@/views/billing/charge/List/index.vue'),
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
      component: () => import(/* webpackChunkName: "billing" */ '@/views/billing/charge/Log/index.vue'),
      name: 'BillingLog',
      meta: {
        apiUrl: 'root',
        activeMenu: '/driveraccount/billing',
        title: 'billingLog',
        icon: 'cargo',
        hidden: true,
        noCache: false
      }
    },
    {
      path: 'billingDetail', /* 计费管理详情 */
      component: () => import(/* webpackChunkName: "billing" */ '@/views/billing/charge/Detail/index.vue'),
      name: 'BillingDetail',
      meta: {
        apiUrl: 'root',
        activeMenu: '/driveraccount/billing',
        title: 'billingDetail',
        icon: 'cargo',
        hidden: true,
        noCache: false
      }
    },
    {
      path: 'billingAdjust', /* 计费管理调整 */
      component: () => import(/* webpackChunkName: "billing" */ '@/views/billing/charge/Add/index.vue'),
      name: 'BillingAdjust',
      meta: {
        apiUrl: 'root',
        activeMenu: '/driveraccount/billing',
        title: 'billingAdjust',
        icon: 'cargo',
        hidden: true,
        noCache: false
      }
    },
    {
      path: 'billingCreate', /* 新增计费 */
      component: () => import(/* webpackChunkName: "billing" */ '@/views/billing/charge/Add/index.vue'),
      name: 'BillingCreate',
      meta: {
        apiUrl: 'root',
        activeMenu: '/driveraccount/billing',
        title: 'billingCreate',
        icon: 'cargo',
        hidden: true,
        noCache: false
      }
    },
    {
      path: 'financialFlow', /* 财务流水列表 */
      component: () => import(/* webpackChunkName: "billing" */ '@/views/billing/financialFlow/List/index.vue'),
      name: 'FinancialFlow',
      meta: {
        apiUrl: 'root',
        activeMenu: '/driveraccount/financialFlow',
        title: 'financialFlow',
        icon: 'cargo',
        noCache: false
      }
    },
    {
      path: 'orderList', /* 订单列表 */
      component: () => import(/* webpackChunkName: "order" */ '@/views/billing/order/List/index.vue'),
      name: 'OrderList',
      meta: {
        apiUrl: 'root',
        activeMenu: '/driveraccount/orderList',
        title: 'orderList',
        icon: 'cargo',
        noCache: false
      }
    }
  ]
}

export default driverAccountRouter
