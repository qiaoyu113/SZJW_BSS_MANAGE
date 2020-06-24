import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const driverRouter: RouteConfig = {
  path: '/customer',
  component: Layout,
  redirect: '/customer/list',
  name: 'Customer',
  meta: {
    title: 'customerTitle',
    icon: 'client',
    apiUrl: 'root'
  },
  children: [
    {
      path: 'list',
      component: () => import(/* webpackChunkName: "driver" */ '@/views/customer/CustomerList.vue'),
      name: 'CustomerList',
      meta: {
        apiUrl: '/bss/v1/bss/line/customer/selectListByKey',
        title: 'customerList',
        icon: 'client',
        noCache: false
      }
    },
    {
      path: 'detail',
      component: () => import(/* webpackChunkName: "driver" */ '@/views/customer/CustomerDetail.vue'),
      name: 'CustomerDetail',
      meta: {
        title: 'customerDetail',
        activeMenu: '/customer/list',
        hidden: true,
        noCache: true,
        apiUrl: 'root'
      }
    }
  ]
}

export default driverRouter
