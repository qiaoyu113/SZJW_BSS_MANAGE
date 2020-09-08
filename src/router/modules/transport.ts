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
        apiUrl: '/v1/driver/clue/list/key-query',
        activeMenu: '/transport/driverclue',
        title: 'driverClue',
        icon: '',
        noCache: true
      }
    },
    {
      path: 'createClue', /* 创建司机线索 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/transport/driveClue/CreateClue.vue'),
      name: 'CreateClue',
      meta: {
        apiUrl: 'root',
        activeMenu: '/transport/driverclue',
        title: 'createDriverClue',
        hidden: true,
        icon: '',
        noCache: true
      }
    },
    {
      path: 'editClue', /* 编辑司机线索 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/transport/driveClue/CreateClue.vue'),
      name: 'EditClue',
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
      component: () => import(/* webpackChunkName: "driver" */ '@/views/transport/driveClue/Interview.vue'),
      name: 'Interview',
      meta: {
        apiUrl: 'root',
        activeMenu: '/transport/driverclue',
        title: 'driverInterview',
        hidden: true,
        icon: '',
        noCache: true
      }
    },
    {
      path: 'followClue', /* 线索跟进 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/transport/driveClue/FollowClue.vue'),
      name: 'FollowClue',
      meta: {
        apiUrl: 'root',
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
      name: '/v1/driver/getDriverList',
      meta: {
        apiUrl: 'root',
        activeMenu: '/transport/driverlist',
        title: 'driverList',
        icon: '',
        noCache: true
      }
    },
    {
      path: 'editDriver', /* 编辑司机 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/transport/driverList/EditDriver.vue'),
      name: 'EditDriver',
      meta: {
        apiUrl: 'root',
        activeMenu: '/transport/driverlist',
        title: 'editDriver',
        hidden: true,
        icon: '',
        noCache: true
      }
    },
    {
      path: 'followDriver', /* 跟进司机 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/transport/driverList/FollowDriver.vue'),
      name: 'FollowDriver',
      meta: {
        apiUrl: 'root',
        activeMenu: '/transport/driverlist',
        title: 'followDriver',
        hidden: true,
        icon: '',
        noCache: true
      }
    },
    {
      path: 'driverDetail', /* 司机详情 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/transport/driverList/DriverDetail.vue'),
      name: 'driverDetail',
      meta: {
        apiUrl: 'root',
        activeMenu: '/transport/driverlist',
        title: 'driverDetail',
        hidden: true,
        icon: '',
        noCache: true
      }
    },
    {
      path: 'transportlist', /* 运力列表 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/transport/transportList/TransportList.vue'),
      name: 'TransportList',
      meta: {
        title: 'transportList',
        activeMenu: '/transport/transportlist',
        noCache: true,
        icon: '',
        apiUrl: '/v1/carrier/getCarrierInfoList'
      }
    },
    {
      path: 'creattransport', /* 创建运力 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/transport/transportList/CreatTransport.vue'),
      name: 'CreatTransport',
      meta: {
        title: 'creatTransport',
        activeMenu: '/transport/transportlist',
        noCache: true,
        hidden: true,
        icon: '',
        apiUrl: 'root'
      }
    },
    {
      path: 'editortransport', /* 编辑运力 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/transport/transportList/CreatTransport.vue'),
      name: 'EditorTransport',
      meta: {
        title: 'editorTransport',
        activeMenu: '/transport/transportlist',
        noCache: true,
        hidden: true,
        icon: '',
        apiUrl: 'root'
      }
    },
    {
      path: 'transportdetail', /* 运力详情 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/transport/transportList/TransportDetail.vue'),
      name: 'TransportDetail',
      meta: {
        title: 'transportDetail',
        activeMenu: '/transport/transportlist',
        noCache: true,
        hidden: true,
        icon: '',
        apiUrl: 'root'
      }
    },
    {
      path: 'accountlist', /* 司机账户 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/transport/accountList/AccountList.vue'),
      name: 'AccountList',
      meta: {
        title: 'accountList',
        activeMenu: '/transport/accountlist',
        noCache: false,
        icon: '',
        apiUrl: 'root'
      }
    },
    {
      path: 'accorderdetail', /* 司机账户订单详情 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/transport/accountList/AccOrderDetail.vue'),
      name: 'AccOrderDetail',
      meta: {
        title: 'accOrderDetail',
        activeMenu: '/transport/accountlist',
        noCache: true,
        hidden: true,
        icon: '',
        apiUrl: 'root'
      }
    },
    {
      path: 'accountdetail', /* 司机订单详情 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/transport/accountList/AccountDetail.vue'),
      name: 'AccountDetail',
      meta: {
        title: 'accountDetail',
        activeMenu: '/transport/accountlist',
        noCache: true,
        hidden: true,
        icon: '',
        apiUrl: 'root'
      }
    }
  ]
}

export default transportRouter
