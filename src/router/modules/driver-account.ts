import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

// 司机梧桐账户
const driverAccountRouter: RouteConfig = {
  path: '/driveraccount',
  component: Layout,
  redirect: '/driveraccount/refundlist',
  name: 'DriverAccount',
  meta: {
    title: 'driverAccount',
    icon: 'driverAccount',
    apiUrl: ['/v2/wt-driver-account/flow/list', '/v2/wt-driver-account/management/list']
  },
  children: [
    {
      path: 'payFee',
      component: () => import(/* webpackChunkName: "billing" */ '@/views/acount/payFee/payList/index.vue'),
      name: 'payList',
      meta: {
        title: 'payFee',
        icon: '',
        apiUrl: 'root',
        noCache: true,
        hidden: true
      }
    },
    {
      path: 'payDetail',
      component: () => import(/* webpackChunkName: "billing" */ '@/views/acount/payFee/payDetail/index.vue'),
      name: 'payDetail',
      meta: {
        apiUrl: 'root',
        title: 'payDetail',
        hidden: true,
        noCache: true
      }
    },
    {
      path: 'payAudit',
      component: () => import(/* webpackChunkName: "billing" */ '@/views/acount/payFee/payDetail/index.vue'),
      name: 'payAudit',
      meta: {
        apiUrl: 'root',
        title: 'payAudit',
        hidden: true,
        noCache: true
      }
    },
    {
      path: 'addPay',
      component: () => import(/* webpackChunkName: "billing" */ '@/views/acount/payFee/addPay/index.vue'),
      name: 'addPay',
      meta: {
        apiUrl: 'root',
        title: 'addPay',
        hidden: true,
        noCache: true
      }
    },
    {
      path: 'wtAcountList',
      component: () => import(/* webpackChunkName: "billing" */ '@/views/acount/wtAcountList/index.vue'),
      name: 'wtAcountList',
      meta: {
        apiUrl: '/v2/wt-driver-account/management/list',
        title: 'driverAccount',
        noCache: true,
        icon: '',
        activeMenu: '/driveraccount/wtAcountList'
      }
    },
    // 退费管理
    {
      path: 'refundlist',
      component: () => import(/* webpackChunkName: "driver" */ '@/views/driver-account/RefundList.vue'),
      name: 'RefundList',
      meta: {
        apiUrl: '/v2/wt-driver-account/refund/list',
        title: 'refundList',
        noCache: false,
        hidden: false
      }
    },
    // 退费详情
    {
      path: 'refunddetail',
      component: () => import(/* webpackChunkName: "driver" */ '@/views/driver-account/RefundDetail.vue'),
      name: 'RefundDetail',
      meta: {
        apiUrl: 'root',
        title: 'refundDetail',
        noCache: false,
        hidden: true
      }
    },
    // 退费申请
    {
      path: 'refundapply',
      component: () => import(/* webpackChunkName: "driver" */ '@/views/driver-account/RefundApply.vue'),
      name: 'RefundApply',
      meta: {
        apiUrl: 'root',
        title: 'refundApply',
        noCache: true,
        hidden: true
      }
    },
    // 退费审核
    {
      path: 'refundaudit',
      component: () => import(/* webpackChunkName: "driver" */ '@/views/driver-account/RefundDetail.vue'),
      name: 'RefundAudit',
      meta: {
        apiUrl: 'root',
        title: 'refundAudit',
        noCache: false,
        hidden: true
      }
    },
    {
      path: 'billing', /* 计费管理 */
      component: () => import(/* webpackChunkName: "billing" */ '@/views/billing/charge/List/index.vue'),
      name: 'Billing',
      meta: {
        apiUrl: 'root',
        hidden: true,
        activeMenu: '/driveraccount/billing',
        title: 'billing',
        icon: '',
        noCache: false
      }
    },
    {
      path: 'billingLog', /* 计费管理日志 */
      component: () => import(/* webpackChunkName: "billing" */ '@/views/billing/charge/Log/index.vue'),
      name: 'BillingLog',
      meta: {
        apiUrl: 'root',
        activeMenu: '/driveraccount/billing',
        title: 'billingLog',
        icon: '',
        hidden: true,
        noCache: false
      }
    },
    {
      path: 'billingDetail', /* 计费管理详情 */
      component: () => import(/* webpackChunkName: "billing" */ '@/views/billing/charge/Detail/index.vue'),
      name: 'BillingDetail',
      meta: {
        apiUrl: 'root',
        activeMenu: '/driveraccount/billing',
        title: 'billingDetail',
        icon: '',
        hidden: true,
        noCache: false
      }
    },
    {
      path: 'billingAdjust', /* 计费管理调整 */
      component: () => import(/* webpackChunkName: "billing" */ '@/views/billing/charge/Add/index.vue'),
      name: 'BillingAdjust',
      meta: {
        apiUrl: 'root',
        activeMenu: '/driveraccount/billing',
        title: 'billingAdjust',
        icon: 'cargo',
        hidden: true,
        noCache: false
      }
    },
    {
      path: 'billingCreate', /* 新增计费 */
      component: () => import(/* webpackChunkName: "billing" */ '@/views/billing/charge/Add/index.vue'),
      name: 'BillingCreate',
      meta: {
        apiUrl: 'root',
        activeMenu: '/driveraccount/billing',
        title: 'billingCreate',
        icon: 'cargo',
        hidden: true,
        noCache: false
      }
    },
    {
      path: 'financialFlow', /* 财务流水列表 */
      component: () => import(/* webpackChunkName: "billing" */ '@/views/billing/financialFlow/List/index.vue'),
      name: 'FinancialFlow',
      meta: {
        apiUrl: '/v2/wt-driver-account/flow/list',
        // hidden: true,
        activeMenu: '/driveraccount/financialFlow',
        title: 'financialFlow',
        icon: '',
        noCache: false
      }
    },
    {
      path: 'orderList', /* 订单列表 */
      component: () => import(/* webpackChunkName: "order" */ '@/views/billing/order/List/index.vue'),
      name: 'OrderList',
      meta: {
        apiUrl: 'root',
        hidden: true,
        activeMenu: '/driveraccount/orderList',
        title: 'orderList',
        icon: '',
        noCache: false
      }
    }
  ]
}

export default driverAccountRouter
