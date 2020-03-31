import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routeOptions = [
  {
    path: '/',
    name: 'Home'
  },
  {
    path: '/rooms/id',
    name: 'RoomId'
  },
  {
    path: '/about',
    name: 'About'
  }
]

const routes = routeOptions.map(r => {
  return {
    ...r,
    component: () => import(/* webpackChunkName: "[request]" */ `../views/${r.name}/Index.vue`)
  }
})

const router = new VueRouter({
  routes
})

export default router
