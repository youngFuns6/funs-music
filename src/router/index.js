import Vue from 'vue'
import VueRouter from 'vue-router'
import headerMenu from '../components/headers/headerMenu'
import MyMusic from '../views/home/MyMusic.vue'
import Home from '../views/home/Home.vue'
import Singer from '../views/home/Singer.vue'
import SingList from '../views/home/SingList.vue'
import Mv from '../views/home/Mv.vue'
import newSongInfo from '../views/homeChildren/newSongInfo.vue'



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
        path: '/newSongInfo', component: newSongInfo
      },
      {
        path: '/mymusic', component: MyMusic,
        
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
