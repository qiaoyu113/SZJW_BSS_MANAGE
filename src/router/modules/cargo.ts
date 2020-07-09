import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const cargoRouter: RouteConfig = {
  path: '/cargo', /* 货源中心 */
  component: Layout,
  redirect: '/cargo/cluelist',
  name: 'Cargo',
  meta: {
    title: 'cargoTitle',
    icon: 'cargo',
    apiUrl: 'root'
  },
  children: [
    {
      path: 'cluelist', /* 线索列表 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/cargo/ClueList.vue'),
      name: 'ClueList',
      meta: {
        apiUrl: '/bss/v1/bss/line/customer/selectListByKey',
        activeMenu: '/cargo/cluelist',
        title: 'clueList',
        icon: '',
        noCache: false
      }
    },
    {
      path: 'addclue', /* 新增线索 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/cargo/AddClue.vue'),
      name: 'AddClue',
      meta: {
        apiUrl: '/bss/v1/bss/line/customer/selectListByKey',
        activeMenu: '/cargo/cluelist',
        title: 'addClue',
        hidden: true,
        icon: '',
        noCache: true
      }
    },
    {
      path: 'editclue', /* 编辑线索 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/cargo/AddClue.vue'),
      name: 'EditClue',
      meta: {
        apiUrl: '/bss/v1/bss/line/customer/selectListByKey',
        activeMenu: '/cargo/cluelist',
        title: 'editClue',
        hidden: true,
        icon: '',
        noCache: true
      }
    },
    {
      path: 'followclue', /* 跟进线索 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/cargo/AddClue.vue'),
      name: 'FollowClue',
      meta: {
        apiUrl: '/bss/v1/bss/line/customer/selectListByKey',
        activeMenu: '/cargo/cluelist',
        title: 'followClue',
        hidden: true,
        icon: '',
        noCache: true
      }
    },
    {
      path: 'conversionclue', /* 转化货主 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/cargo/ConversionClue.vue'),
      name: 'ConversionClue',
      meta: {
        apiUrl: '/bss/v1/bss/line/customer/selectListByKey',
        activeMenu: '/cargo/cluelist',
        title: 'conversionClue',
        hidden: true,
        icon: '',
        noCache: true
      }
    },
    {
      path: 'importclue', /* 导入 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/cargo/ImportClue.vue'),
      name: 'ImportClue',
      meta: {
        apiUrl: '/bss/v1/bss/line/customer/selectListByKey',
        activeMenu: '/cargo/cluelist',
        title: 'importClue',
        hidden: true,
        icon: '',
        noCache: true
      }
    },
    {
      path: 'importdetail', /* 导入详情 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/cargo/ImportDetail.vue'),
      name: 'ImportDetail',
      meta: {
        apiUrl: '/bss/v1/bss/line/customer/selectListByKey',
        activeMenu: '/cargo/cluelist',
        title: 'importDetail',
        hidden: true,
        icon: '',
        noCache: true
      }
    },
    {
      path: 'cluedetail', /* 线索详情 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/cargo/ClueDetail.vue'),
      name: 'ClueDetail',
      meta: {
        apiUrl: '/bss/v1/bss/line/customer/selectListByKey',
        activeMenu: '/cargo/cluelist',
        title: 'clueDetail',
        hidden: true,
        icon: '',
        noCache: true
      }
    },
    {
      path: 'myclue', /* 我的线索 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/cargo/MyClue.vue'),
      name: 'MyClue',
      meta: {
        title: 'myClue',
        activeMenu: '/cargo/myclue',
        noCache: false,
        icon: '',
        apiUrl: 'root'
      }
    },
    {
      path: 'ownerlist', /* 货主列表 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/cargo/OwnerList.vue'),
      name: 'OwnerList',
      meta: {
        title: 'ownerList',
        activeMenu: '/cargo/ownerlist',
        noCache: false,
        icon: '',
        apiUrl: 'root'
      }
    },
    {
      path: 'linemanage', /* 线路清单 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/cargo/LineManage.vue'),
      name: 'LineManage',
      meta: {
        title: 'lineManage',
        activeMenu: '/cargo/linemanage',
        noCache: false,
        icon: '',
        apiUrl: 'root'
      }
    },
    {
      path: 'tendermanage', /* 标书管理 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/cargo/TenderManage.vue'),
      name: 'TenderManage',
      meta: {
        title: 'tenderManage',
        activeMenu: '/cargo/tendermanage',
        noCache: false,
        icon: '',
        apiUrl: 'root'
      }
    }
  ]
}

export default cargoRouter
