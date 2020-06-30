import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const orderRouter: RouteConfig = {
  path: '/order', /* 订单管理 */
  component: Layout,
  redirect: '/order/list',
  name: 'Order',
  meta: {
    title: 'orderTitle',
    icon: 'order',
    apiUrl: 'root'
  },
  children: [
    {
      path: 'creatorder', /* 创建订单 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/order/CreatOrder.vue'),
      name: 'CreatOrder',
      meta: {
        apiUrl: '/bss/v1/bss/driver/selectListByKey',
        title: 'creatOrder',
        noCache: false
      }
    },
    {
      path: 'ordermanage', /* 订单管理 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/order/OrderManage.vue'),
      name: 'OrderManage',
      meta: {
        apiUrl: '/bss/v1/bss/driver/selectListByKey',
        title: 'orderManage',
        noCache: false
      }
    },
    {
      path: 'refundorder', /* 退款订单 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/order/RefundOrder.vue'),
      name: 'RefundOrder',
      meta: {
        apiUrl: '/bss/v1/bss/driver/selectListByKey',
        title: 'refundOrder',
        noCache: false
      }
    },
    {
      path: 'contractlist', /* 合同列表 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/order/ContractList.vue'),
      name: 'ContractList',
      meta: {
        apiUrl: '/bss/v1/bss/driver/selectListByKey',
        title: 'contractList',
        noCache: false
      }
    },
    {
      path: 'dealstatistics', /* 成交统计 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/order/DealStatistics.vue'),
      name: 'DealStatistics',
      meta: {
        apiUrl: '/bss/v1/bss/driver/selectListByKey',
        title: 'dealStatistics',
        noCache: false
      }
    }
  ]
}

export default orderRouter
