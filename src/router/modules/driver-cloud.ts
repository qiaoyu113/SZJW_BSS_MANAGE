import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'
// 司机云
const driverCloud: RouteConfig = {
  path: '/driverClond',
  component: Layout,
  redirect: '/driverClond/selfDriverTag',
  name: 'DriverClond',
  meta: {
    title: 'driverClond',
    icon: 'driver-cloud',
    apiUrl: '/v2/driver/label-sync/list',
    alwaysShow: true
  },
  children: [
    {
      path: 'list',
      component: () => import(/* webpackChunkName: "driverCloud" */ '@/views/driver-cloud/SelfDriverTag.vue'),
      name: 'SelfDriverTag',
      meta: {
        apiUrl: '/v2/driver/label-sync/list',
        title: 'selfDriverTag',
        noCache: false
      }
    }
  ]
}

export default driverCloud
