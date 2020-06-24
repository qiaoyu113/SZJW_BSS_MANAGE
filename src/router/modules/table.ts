import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const tableRoutes: RouteConfig = {
  path: '/table',
  component: Layout,
  redirect: '/table/complex-table',
  name: 'Table',
  meta: {
    title: 'table',
    icon: 'table',
    apiUrl: 'root'
  },
  children: [
    {
      path: 'dynamic-table',
      component: () => import(/* webpackChunkName: "dynamic-table" */ '@/views/table/dynamic-table/index.vue'),
      name: 'DynamicTable',
      meta: { title: 'dynamicTable',
        apiUrl: 'root' }
    },
    {
      path: 'draggable-table',
      component: () => import(/* webpackChunkName: "draggable-table" */ '@/views/table/draggable-table.vue'),
      name: 'DraggableTable',
      meta: { title: 'draggableTable',
        apiUrl: 'root' }
    },
    {
      path: 'inline-edit-table',
      component: () => import(/* webpackChunkName: "inline-edit-table" */ '@/views/table/inline-edit-table.vue'),
      name: 'InlineEditTable',
      meta: { title: 'inlineEditTable',
        apiUrl: 'root' }
    },
    {
      path: 'complex-table',
      component: () => import(/* webpackChunkName: "complex-table" */ '@/views/table/complex-table.vue'),
      name: 'ComplexTable',
      meta: { title: 'complexTable',
        apiUrl: 'root' }
    }
  ]
}

export default tableRoutes
