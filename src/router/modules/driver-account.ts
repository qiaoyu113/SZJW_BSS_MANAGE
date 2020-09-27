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
    apiUrl: 'root'
  },
  children: [
    {
      path: 'payFee',
      component: () => import(/* webpackChunkName: "driverAccount" */ '@/views/acount/payFee/payList/index.vue'),
      name: 'payList',
      meta: {
        title: 'payFee',
        icon: '',
        apiUrl: '/v1/base/user/menu',
        noCache: true
      }
    },
    {
      path: 'payDetail',
      component: () => import(/* webpackChunkName: "driver" */ '@/views/acount/payFee/payDetail/index.vue'),
      name: 'payDetail',
      meta: {
        apiUrl: '/v1/base/user/menu',
        title: 'payDetail',
        hidden: true,
        noCache: true
      }
    },
    {
      path: 'payAudit',
      component: () => import(/* webpackChunkName: "driver" */ '@/views/acount/payFee/payDetail/index.vue'),
      name: 'payAudit',
      meta: {
        apiUrl: '/v1/base/user/menu',
        title: 'payAudit',
        hidden: true,
        noCache: true
      }
    },
    {
      path: 'addPay',
      component: () => import(/* webpackChunkName: "driver" */ '@/views/acount/payFee/addPay/index.vue'),
      name: 'addPay',
      meta: {
        apiUrl: '/v1/base/user/menu',
        title: 'addPay',
        hidden: true,
        noCache: true
      }
    },
    {
      path: 'wtAcountList',
      component: () => import(/* webpackChunkName: "driver" */ '@/views/acount/wtAcountList/index.vue'),
      name: 'wtAcountList',
      meta: {
        apiUrl: '/v1/base/user/menu',
        title: 'wtAcountList',
        noCache: true
      }
    }
  ]
}

export default driverAccountRouter
