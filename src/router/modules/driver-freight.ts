import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'
// 司机运费账户
const driverFreight: RouteConfig = {
  path: '/driverfreight',
  component: Layout,
  redirect: '/driverfreight/list',
  name: 'DriverFreightAccount',
  meta: {
    title: 'driverFreightAccount',
    icon: 'driver',
    apiUrl: 'root'
  },
  children: [
    {
      path: 'list',
      component: () => import(/* webpackChunkName: "driver" */ '@/views/driver-freight/FreightList.vue'),
      name: 'DriverFreightList',
      meta: {
        hidden: true,
        apiUrl: 'root',
        title: 'driverFreightList',
        noCache: false
      }
    },
    {
      path: 'bill',
      component: () => import(/* webpackChunkName: "driver" */ '@/views/driver-freight/FreightBill.vue'),
      name: 'DriverFreightBillList',
      meta: {
        apiUrl: 'root',
        title: 'driverFreightBillList',
        noCache: false
      }
    },
    {
      path: 'monthbill',
      component: () => import(/* webpackChunkName: "driver" */ '@/views/driver-freight/FreightMonthBill.vue'),
      name: 'DriverFreightMonthBill',
      meta: {
        apiUrl: 'root',
        title: 'driverFreightMonthBill',
        noCache: false
      }
    },
    {
      path: 'adjustmentList',
      component: () => import(/* webpackChunkName: "driver" */ '@/views/driver-freight/AdjustmentList.vue'),
      name: 'AdjustmentList',
      meta: {
        apiUrl: 'root',
        title: 'adjustmentList',
        noCache: false
      }
    }
  ]
}

export default driverFreight
