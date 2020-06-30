import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const systemRouter: RouteConfig = {
  path: '/system', /* 系统管理 */
  component: Layout,
  redirect: '/system/usermanage',
  name: 'System',
  meta: {
    title: 'systemTitle',
    icon: 'client',
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
    }
  ]
}

export default systemRouter
