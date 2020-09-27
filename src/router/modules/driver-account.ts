import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const driverAccountRouter: RouteConfig = {
  path: '/driveraccount',
  component: Layout,
  redirect: '/driveraccount/refundlist',
  name: 'DriverAccount',
  meta: {
    title: 'driverAccount',
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
      path: 'refundlist',
      component: () => import(/* webpackChunkName: "driver" */ '@/views/driver-account/RefundList.vue'),
      name: 'RefundList',
      meta: {
        apiUrl: 'root',
        title: 'refundList',
        noCache: false,
        hidden: true
      }
    },
    {
      path: 'refunddetail',
      component: () => import(/* webpackChunkName: "driver" */ '@/views/driver-account/RefundDetail.vue'),
      name: 'RefundDetail',
      redirect: '/driveraccount/refundlist',
      meta: {
        apiUrl: 'root',
        title: 'refundDetail',
        noCache: false,
        hidden: true
      }
    },
    {
      path: 'refundaudit',
      component: () => import(/* webpackChunkName: "driver" */ '@/views/driver-account/RefundAudit.vue'),
      name: 'RefundAudit',
      redirect: '/driveraccount/refundlist',
      meta: {
        apiUrl: 'root',
        title: 'refundAudit',
        noCache: false,
        hidden: true
      }
    },
    {
      path: 'refundapply',
      component: () => import(/* webpackChunkName: "driver" */ '@/views/driver-account/RefundApply.vue'),
      name: 'RefundApply',
      redirect: '/driveraccount/refundlist',
      meta: {
        apiUrl: 'root',
        title: 'refundApply',
        noCache: false,
        hidden: true
      }
    }
  ]
}

export default driverAccountRouter
