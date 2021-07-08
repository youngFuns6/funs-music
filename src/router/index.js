import Vue from 'vue'
import VueRouter from 'vue-router'
import headerMenu from '../components/headers/headerMenu'
import HotTopic from '../views/home/HotTopic.vue'
import Home from '../views/home/Home.vue'
import Singer from '../views/home/Singer.vue'
import SingList from '../views/home/SingList.vue'
import Mv from '../views/home/Mv.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/', redirect: '/home',
  },
  {
    path: '/home', component: headerMenu,
    children: [
      {
        path: '/home', component: Home
      },
      {
        path: '/hottopic', component: HotTopic
      },
      {
        path: '/singer', component: Singer
      },
      {
        path: '/singlist', component: SingList
      },
      {
        path: '/mv', component: Mv
      }

    ],

  },


]

const router = new VueRouter({
  routes
})

export default router
