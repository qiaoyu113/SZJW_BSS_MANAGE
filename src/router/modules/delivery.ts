import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const deliveryRouter: RouteConfig = {
  path: '/delivery', /* 交付管理 */
  component: Layout,
  redirect: '/delivery/buycar',
  name: 'Delivery',
  meta: {
    title: 'deliveryTitle',
    icon: 'delivery',
    apiUrl: 'root'
  },
  children: [
    {
      path: 'buycar', /* 购车交付 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/delivery/BuyCar.vue'),
      name: 'BuyCar',
      meta: {
        apiUrl: '/bss/v1/bss/driver/selectListByKey',
        title: 'buyCar',
        noCache: false
      }
    },
    {
      path: 'gps', /* GPS */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/delivery/GPS.vue'),
      name: 'GPS',
      meta: {
        apiUrl: '/bss/v1/bss/driver/selectListByKey',
        title: 'GPS',
        noCache: false
      }
    },
    {
      path: 'cartype', /* 购车车型 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/delivery/CarType.vue'),
      name: 'CarType',
      meta: {
        apiUrl: '/bss/v1/bss/driver/selectListByKey',
        title: 'carType',
        noCache: false
      }
    },
    {
      path: 'rentcar', /* 租车车型 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/delivery/RentCar.vue'),
      name: 'RentCar',
      meta: {
        apiUrl: '/bss/v1/bss/driver/selectListByKey',
        title: 'rentCar',
        noCache: false
      }
    },
    {
      path: 'gpsmanage', /* 成交统计 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/delivery/GPSManage.vue'),
      name: 'GPSManage',
      meta: {
        apiUrl: '/bss/v1/bss/driver/selectListByKey',
        title: 'gpsManage',
        noCache: false
      }
    }
  ]
}

export default deliveryRouter
