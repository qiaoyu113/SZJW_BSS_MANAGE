import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const systemRouter: RouteConfig = {
  path: '/system', /* 系统管理 */
  component: Layout,
  redirect: '/system/usermanage',
  name: 'System',
  meta: {
    title: 'systemTitle',
    icon: 'system',
    apiUrl: 'root'
  },
  children: [
    {
      path: 'usermanage', /* 用户管理 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/system/UserManage.vue'),
      name: 'UserManage',
      meta: {
        apiUrl: '/bss/v1/bss/line/customer/selectListByKey',
        activeMenu: '/system/usermanage',
        title: 'userManage',
        icon: '',
        noCache: false
      }
    },
    {
      path: 'createuser',
      component: () => import(/* webpackChunkName: "driver" */ '@/views/system/CreateUser.vue'),
      name: 'CreateUser',
      meta: {
        apiUrl: '/bss/v1/bss/line/customer/selectListByKey',
        activeMenu: '/system/usermanage',
        title: 'createUser',
        hidden: true,
        icon: '',
        noCache: true
      }
    },
    {
      path: 'edituser',
      component: () => import(/* webpackChunkName: "driver" */ '@/views/system/CreateUser.vue'),
      name: 'EditUser',
      meta: {
        apiUrl: '/bss/v1/bss/line/customer/selectListByKey',
        activeMenu: '/system/usermanage',
        title: 'editUser',
        icon: '',
        hidden: true,
        noCache: true
      }
    },
    {
      path: 'rolemanage', /* 角色管理 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/system/RoleManage.vue'),
      name: 'RoleManage',
      meta: {
        title: 'roleManage',
        activeMenu: '/system/rolemanage',
        noCache: false,
        icon: '',
        apiUrl: 'root'
      }
    },
    {
      path: 'createrole',
      component: () => import(/* webpackChunkName: "driver" */ '@/views/system/CreateRole.vue'),
      name: 'CreateRole',
      meta: {
        apiUrl: '/bss/v1/bss/line/customer/selectListByKey',
        activeMenu: '/system/rolemanage',
        title: 'createRole',
        hidden: true,
        icon: '',
        noCache: true
      }
    },
    {
      path: 'editRole',
      component: () => import(/* webpackChunkName: "driver" */ '@/views/system/CreateRole.vue'),
      name: 'EditRole',
      meta: {
        apiUrl: '/bss/v1/bss/line/customer/selectListByKey',
        activeMenu: '/system/rolemanage',
        title: 'editRole',
        icon: '',
        hidden: true,
        noCache: true
      }
    },
    {
      path: 'organizationmanage', /* 组织管理 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/system/OrganizationManage.vue'),
      name: 'OrganizationManage',
      meta: {
        title: 'organizationManage',
        activeMenu: '/system/organizationmanage',
        noCache: false,
        icon: '',
        apiUrl: 'root'
      }
    },
    {
      path: 'permissionmanage', /* 权限管理 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/system/PermissionManage.vue'),
      name: 'PermissionManage',
      meta: {
        title: 'permissionManage',
        activeMenu: '/system/permissionmanage',
        noCache: false,
        icon: '',
        apiUrl: 'root'
      }
    },
    {
      path: 'systemsetting', /* 权限管理 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/system/SystemSetting.vue'),
      name: 'SystemSetting',
      meta: {
        title: 'systemSetting',
        activeMenu: '/system/systemsetting',
        noCache: false,
        icon: '',
        apiUrl: 'root'
      }
    },
    {
      path: 'buycartype', /* 购车车型 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/system/BuyCarType.vue'),
      name: 'BuyCarType',
      meta: {
        title: 'carType',
        activeMenu: '/system/systemsetting',
        noCache: false,
        icon: '',
        apiUrl: 'root'
      }
    },
    {
      path: 'rentcartype', /* 租车车型 */
      component: () => import(/* webpackChunkName: "driver" */ '@/views/system/RentCarType.vue'),
      name: 'RentCarType',
      meta: {
        title: 'rentCar',
        activeMenu: '/system/systemsetting',
        noCache: false,
        icon: '',
        apiUrl: 'root'
      }
    }
  ]
}

export default systemRouter
