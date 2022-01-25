import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import(/* webpackChunkName: "home" */ './views/Index.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
