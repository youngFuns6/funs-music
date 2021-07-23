import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import headerMenu from '../components/headers/headerMenu'
import MyMusic from '../views/home/MyMusic.vue'
import Home from '../views/home/Home.vue'
import Singer from '../views/home/Singer.vue'
import SingList from '../views/home/SingList.vue'
import MvDet from '../components/mv/MvDet.vue'
import newSongInfo from '../views/homeChildren/newSongInfo.vue'
import SingListDet from '../views/singListChildren/SingListDet.vue'
import SingerDet from '../components/singer/SingerDet.vue'
import SongDet from '../components/song/songDet/SongDet.vue'
import ToLogin from '../views/ToLogin.vue'
import Rank from '../views/home/Rank.vue'
import SearchResult from '../components/headers/serach/SearchResult.vue'



Vue.use(VueRouter)

const routes = [
  {
    path: '/', redirect: '/home',
  },
  {
    path: '/home', component: headerMenu,
    children: [
      {
        path: '/home', component: Home,
      },
      { path: '/newSongInfo', component: newSongInfo },
      { path: '/mymusic', component: MyMusic, },
      {
        path: '/singer', component: Singer
      },
      { path: '/singlist', component: SingList, },
      { path: '/singlist/detail', component: SingListDet },
      { path: '/singer/detail', component: SingerDet },
      { path: '/songs/detail', component: SongDet },
      { path: '/login', component:  ToLogin},
      { path: '/mvdet', component: MvDet },
      { path: '/rank', component: Rank },
      { path: '/search/result', component: SearchResult}
    ],

  },


]

const router = new VueRouter({
  routes
})



// 未登陆验证 阻止跳转到我的音乐
router.beforeEach((to, from, next) => {
  // to and from are both route objects. must call `next`.
  if (to.path === '/mymusic' && window.sessionStorage.getItem('profile') === null) {
    next('/login')
  }
  next()
})

export default router
