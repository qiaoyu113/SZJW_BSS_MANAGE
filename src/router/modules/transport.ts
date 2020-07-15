import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const transportRouter: RouteConfig = {
  path: '/transport', /* 运力中心 */
  component: Layout,
  redirect: '/transport/driverclue',
  name: 'Transport',
  meta: {
    title: 'transportTitle',
    icon: 'transport',
    apiUrl: 'root'
  },
  children: [
    {
      path: 'driverclue', /* 司机线索 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/transport/driveClue/DriverClue.vue'),
      name: 'DriverClue',
      meta: {
        apiUrl: '/bss/v1/bss/line/customer/selectListByKey',
        activeMenu: '/transport/driverclue',
        title: 'driverClue',
        icon: '',
        noCache: true
      }
    },
    {
      path: 'createClue', /* 创建司机线索 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/transport/driveClue/createClue.vue'),
      name: 'CreateDriverClue',
      meta: {
        apiUrl: '/bss/v1/bss/line/customer/selectListByKey',
        activeMenu: '/transport/driverclue',
        title: 'createDriverClue',
        hidden: true,
        icon: '',
        noCache: true
      }
    },
    {
      path: 'editClue', /* 编辑司机线索 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/transport/driveClue/createClue.vue'),
      name: 'EditDriverClue',
      meta: {
        apiUrl: '/bss/v1/bss/line/customer/selectListByKey',
        activeMenu: '/transport/driverclue',
        title: 'editDriverClue',
        hidden: true,
        icon: '',
        noCache: true
      }
    },
    {
      path: 'interview', /* 发起面试 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/transport/driveClue/interview.vue'),
      name: 'Interview',
      meta: {
        apiUrl: '/bss/v1/bss/line/customer/selectListByKey',
        activeMenu: '/transport/driverclue',
        title: 'driverInterview',
        hidden: true,
        icon: '',
        noCache: true
      }
    },
    {
      path: 'followClue', /* 线索跟进 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/transport/driveClue/followClue.vue'),
      name: 'FollowClue',
      meta: {
        apiUrl: '/bss/v1/bss/line/customer/selectListByKey',
        activeMenu: '/transport/driverclue',
        title: 'driverFollowClue',
        hidden: true,
        icon: '',
        noCache: true
      }
    },
    {
      path: 'driverlist', /* 司机列表 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/transport/driverList/DriverList.vue'),
      name: 'DriverList',
      meta: {
        apiUrl: '/bss/v1/bss/line/customer/selectListByKey',
        activeMenu: '/transport/driverlist',
        title: 'driverList',
        icon: '',
        noCache: true
      }
    },
    {
      path: 'editDriver', /* 编辑司机 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/transport/driverList/editDriver.vue'),
      name: 'EditDriver',
      meta: {
        apiUrl: '/bss/v1/bss/line/customer/selectListByKey',
        activeMenu: '/transport/driverlist',
        title: 'editDriver',
        hidden: true,
        icon: '',
        noCache: true
      }
    },
    {
      path: 'followDriver', /* 跟进司机 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/transport/driverList/followDriver.vue'),
      name: 'FollowDriver',
      meta: {
        apiUrl: '/bss/v1/bss/line/customer/selectListByKey',
        activeMenu: '/transport/driverlist',
        title: 'followDriver',
        hidden: true,
        icon: '',
        noCache: true
      }
    },
    {
      path: 'driverDetail', /* 司机详情 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/transport/driverList/driverDetail.vue'),
      name: 'driverDetail',
      meta: {
        apiUrl: '/bss/v1/bss/line/customer/selectListByKey',
        activeMenu: '/transport/driverlist',
        title: 'driverDetail',
        hidden: true,
        icon: '',
        noCache: true
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
