import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const orderRouter: RouteConfig = {
  path: '/join', /* 加盟中心 */
  component: Layout,
  redirect: '/join/list',
  name: 'Join',
  meta: {
    title: 'joinTitle',
    icon: 'join',
    apiUrl: 'root'
  },
  children: [
    {
      path: 'creatorder', /* 创建订单 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/join/CreatOrder.vue'),
      name: 'CreatOrder',
      meta: {
        hidden: true,
        apiUrl: '/bss/v1/bss/driver/selectListByKey',
        activeMenu: '/join/ordermanage',
        title: 'creatOrder',
        noCache: false
      }
    },
    {
      path: 'orderdetail', /* 订单详情 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/join/OrderDetail.vue'),
      name: 'OrderDetail',
      meta: {
        hidden: true,
        apiUrl: '/bss/v1/bss/driver/selectListByKey',
        activeMenu: '/join/ordermanage',
        title: 'orderDetail',
        noCache: false
      }
    },
    {
      path: 'orderlog', /* 订单日志 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/join/OrderLog.vue'),
      name: 'OrderLog',
      meta: {
        hidden: true,
        apiUrl: '/bss/v1/bss/driver/selectListByKey',
        activeMenu: '/join/ordermanage',
        title: 'orderLog',
        noCache: false
      }
    },
    {
      path: 'orderaudit', /* 订单审核 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/join/OrderAudit.vue'),
      name: 'OrderAudit',
      meta: {
        hidden: true,
        apiUrl: '/bss/v1/bss/driver/selectListByKey',
        activeMenu: '/join/ordermanage',
        title: 'orderAudit',
        noCache: false
      }
    },
    {
      path: 'ordermanage', /* 订单管理 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/join/OrderManage.vue'),
      name: 'OrderManage',
      meta: {
        apiUrl: '/bss/v1/bss/driver/selectListByKey',
        title: 'orderManage',
        noCache: false
      }
    },
    {
      path: 'refundorder', /* 退款订单 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/join/RefundOrder.vue'),
      name: 'RefundOrder',
      meta: {
        hidden: true,
        apiUrl: '/bss/v1/bss/driver/selectListByKey',
        title: 'refundOrder',
        noCache: false
      }
    },
    {
      path: 'contractlist', /* 合同列表 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/join/ContractList.vue'),
      name: 'ContractList',
      meta: {
        apiUrl: '/bss/v1/bss/driver/selectListByKey',
        title: 'contractList',
        noCache: false
      }
    },
    {
      path: 'contractdetail', /* 合同详情 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/join/ContractDetail.vue'),
      name: 'ContractDetail',
      meta: {
        hidden: true,
        apiUrl: '/bss/v1/bss/driver/selectListByKey',
        activeMenu: '/join/contractlist',
        title: 'contractDetail',
        noCache: false
      }
    },
    {
      path: 'dealform', /* 交付 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/join/DealForm.vue'),
      name: 'DealForm',
      meta: {
        apiUrl: '/bss/v1/bss/driver/selectListByKey',
        activeMenu: '/join/contractlist',
        title: 'dealForm',
        noCache: false,
        hidden: true
      }
    },
    {
      path: 'dealmanagedetail', /* 交付详情 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/join/DealManageDetail.vue'),
      name: 'DealManageDetail',
      meta: {
        apiUrl: '/bss/v1/bss/driver/selectListByKey',
        title: 'dealManageDetail',
        noCache: false,
        hidden: true
      }
    },
    {
      path: 'dealmanage', /* 成交管理 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/join/DealManage.vue'),
      name: 'DealManage',
      meta: {
        apiUrl: '/bss/v1/bss/driver/selectListByKey',
        title: 'dealManage',
        noCache: false
      }
    },
    {
      path: 'dealstatistics', /* 成交统计 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/join/DealStatistics.vue'),
      name: 'DealStatistics',
      meta: {
        hidden: true,
        apiUrl: '/bss/v1/bss/driver/selectListByKey',
        title: 'dealStatistics',
        noCache: false
      }
    }
  ]
}

export default orderRouter
