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
        apiUrl: '/v1/line/clue/queryLineClueList',
        activeMenu: '/cargo/cluelist',
        title: 'clueList',
        icon: '',
        noCache: false
      }
    },
    {
      path: 'cluelista', /* 线索列表a */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/cargo/ClueLista.vue'),
      name: 'ClueLista',
      meta: {
        apiUrl: '/v1/line/clue/queryLineClueList',
        activeMenu: '/cargo/cluelist',
        title: 'clueLista',
        icon: '',
        noCache: false
      }
    },
    {
      path: 'addclue', /* 新增线索 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/cargo/AddClue.vue'),
      name: 'AddClue',
      meta: {
        apiUrl: '/v1/line/clue/save',
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
        apiUrl: '/v1/line/clue/lineClueEdit',
        activeMenu: '/cargo/cluelist',
        title: 'editClue',
        hidden: true,
        icon: '',
        noCache: true
      }
    },
    {
      path: 'followupclue', /* 跟进线索 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/cargo/FollowUpClue.vue'),
      name: 'FollowUpClue',
      meta: {
        apiUrl: '/v1/line/clue/followClue',
        activeMenu: '/cargo/cluelist',
        title: 'followUpClue',
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
        apiUrl: '/v1/customer/transformCustomer',
        activeMenu: '/cargo/cluelist',
        title: 'conversionClue',
        hidden: true,
        icon: '',
        noCache: true
      }
    },
    {
      path: 'editcustomer', /* 编辑货主 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/cargo/ConversionClue.vue'),
      name: 'EditCustomer',
      meta: {
        apiUrl: '/v1/customer/edit',
        activeMenu: '/cargo/ownerlist',
        title: 'editcustomer',
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
        apiUrl: '/v1/line/clue/importInfoList',
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
        apiUrl: '/v1/line/clue/importDetailList',
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
        apiUrl: '/v1/line/clue/lineClueInfo',
        activeMenu: '/cargo/cluelist',
        title: 'clueDetail',
        hidden: true,
        icon: '',
        noCache: true
      }
    },
    // {
    //   path: 'myclue', /* 我的线索 */
    //   component: () => import(/* webpackChunkName: "driver" */ '@/views/cargo/MyClue.vue'),
    //   name: 'MyClue',
    //   meta: {
    //     title: 'myClue',
    //     activeMenu: '/cargo/myclue',
    //     noCache: false,
    //     icon: '',
    //     apiUrl: 'root'
    //   }
    // },
    {
      path: 'ownerlist', /* 货主列表 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/cargo/OwnerList.vue'),
      name: 'OwnerList',
      meta: {
        apiUrl: '/v1/line/customer/queryLineCustomerList',
        title: 'ownerList',
        activeMenu: '/cargo/ownerlist',
        noCache: false,
        icon: ''
      }
    },
    {
      path: 'ownerdetail', /* 货主列表 */
      component: () => import(/* webpackChunkName: "cargo" */ '@/views/cargo/OwnerDetail.vue'),
      name: 'OwnerDetail',
      meta: {
        title: 'ownerDetail',
        activeMenu: '/cargo/ownerlist',
        noCache: true,
        hidden: true,
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
        noCache: true,
        icon: '',
        apiUrl: '/v1/line/lineInfo/queryLineListByConditionsQuery'
      }
    },
    {
      path: 'tendermanage', /* 标书管理 */
      component: () => import(/* webpackChunkName: "tender" */ '@/views/cargo/TenderManage.vue'),
      name: 'TenderManage',
      meta: {
        title: 'tenderManage',
        activeMenu: '/cargo/tendermanage',
        noCache: false,
        icon: '',
        apiUrl: 'root'
      }
    },
    {
      path: 'tenderDetail', /* 标书详情 */
      component: () => import(/* webpackChunkName: "tender" */ '@/views/cargo/TenderDetail.vue'),
      name: 'TenderDetail',
      meta: {
        title: 'tenderDetail',
        activeMenu: '/cargo/tendermanage',
        noCache: false,
        hidden: true,
        icon: '',
        apiUrl: 'root'
      }
    },
    {
      path: 'tenderEdit', /* 标书编辑 */
      component: () => import(/* webpackChunkName: "tender" */ '@/views/cargo/TenderDetail.vue'),
      name: 'tenderEdit',
      meta: {
        title: 'tenderEdit',
        hidden: true,
        activeMenu: '/cargo/tendermanage',
        noCache: false,
        icon: '',
        apiUrl: 'root'
      }
    },
    {
      path: 'tenderLog', /* 标书日志 */
      component: () => import(/* webpackChunkName: "tender" */ '@/views/cargo/TenderLog.vue'),
      name: 'tenderLog',
      meta: {
        title: 'tenderLog',
        hidden: true,
        activeMenu: '/cargo/tendermanage',
        noCache: false,
        icon: '',
        apiUrl: 'root'
      }
    },
    {
      path: 'creatline', /* 创建新线路 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/cargo/CreatLine.vue'),
      name: 'CreatLine',
      meta: {
        title: 'creatLine',
        activeMenu: '/cargo/linemanage',
        noCache: true,
        icon: '',
        apiUrl: 'root',
        hidden: true
      }
    },
    {
      path: 'linedetail', /* 线路详情 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/cargo/LineDetail.vue'),
      name: 'LineDetail',
      meta: {
        title: 'lineDetail',
        activeMenu: '/cargo/linemanage',
        noCache: true,
        icon: '',
        hidden: true,
        apiUrl: 'root'
      }
    },
    {
      path: 'lineedit', /* 编辑新线路 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/cargo/CreatLine.vue'),
      name: 'LineEdit',
      meta: {
        title: 'lineEdit',
        activeMenu: '/cargo/linemanage',
        noCache: true,
        icon: '',
        hidden: true,
        apiUrl: 'root'
      }
    },
    {
      path: 'linecopy', /* 复制线路 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/cargo/CreatLine.vue'),
      name: 'LineCopy',
      meta: {
        title: 'lineCopy',
        activeMenu: '/cargo/linemanage',
        noCache: true,
        icon: '',
        hidden: true,
        apiUrl: 'root'
      }
    },
    {
      path: 'lineaudit', /* 审核线路 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/cargo/LineDetail.vue'),
      name: 'LineAudit',
      meta: {
        title: 'lineAudit',
        activeMenu: '/cargo/linemanage',
        noCache: true,
        icon: '',
        hidden: true,
        apiUrl: 'root'
      }
    },
    {
      path: 'takepicture', /* 拍照 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/cargo/TakePicture.vue'),
      name: 'TakePicture',
      meta: {
        title: 'takePicture',
        activeMenu: '/cargo/linemanage',
        noCache: true,
        icon: '',
        hidden: true,
        apiUrl: 'root'
      }
    },
    {
      path: 'showpicture', /* 查看拍照 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/cargo/TakePicture.vue'),
      name: 'ShowPicture',
      meta: {
        title: 'showPicture',
        activeMenu: '/cargo/linemanage',
        noCache: false,
        hidden: true,
        icon: '',
        apiUrl: 'root'
      }
    },
    {
      path: 'showtender', /* 查看标书 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/cargo/ShowTender.vue'),
      name: 'ShowTender',
      meta: {
        title: 'showTender',
        activeMenu: '/cargo/linemanage',
        noCache: false,
        hidden: true,
        icon: '',
        apiUrl: 'root'
      }
    },
    {
      path: 'showlog', /* 查看操作日志 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/cargo/ShowLog.vue'),
      name: 'ShowLog',
      meta: {
        title: 'showLog',
        activeMenu: '/cargo/linemanage',
        noCache: true,
        hidden: true,
        icon: '',
        apiUrl: 'root'
      }
    },
    {
      path: 'wechatshow', /* 小程序预览 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/cargo/WechatShow.vue'),
      name: 'WechatShow',
      meta: {
        title: 'wechatShow',
        activeMenu: '/cargo/linemanage',
        noCache: false,
        hidden: true,
        icon: '',
        apiUrl: 'root'
      }
    }
  ]
}

export default cargoRouter
