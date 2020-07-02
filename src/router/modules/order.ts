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
        title: 'creatOrder',
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
