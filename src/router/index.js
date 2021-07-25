import Vue from 'vue'
import VueRouter from 'vue-router'
// import headerMenu from '../components/headers/headerMenu'
const headerMenu = () => import(/* webpackChunkName: "group-head" */ '../components/headers/headerMenu')


// import Home from '../views/home/Home.vue'
// import MyMusic from '../views/home/MyMusic.vue'
// import Singer from '../views/home/Singer.vue'
// import SingList from '../views/home/SingList.vue'
// import MvDet from '../components/mv/MvDet.vue'
// import newSongInfo from '../views/homeChildren/newSongInfo.vue'
// import SingListDet from '../views/singListChildren/SingListDet.vue'
// import SingerDet from '../components/singer/SingerDet.vue'
// import ToLogin from '../views/ToLogin.vue'
// import SongDet from '../components/song/songDet/SongDet.vue'
// import Rank from '../views/home/Rank.vue'
// import SearchResult from '../components/headers/serach/SearchResult.vue'


const Home = () => import(/* webpackChunkName: "group-head" */ '../views/home/Home.vue')

const MyMusic = () => import(/* webpackChunkName: "group-music" */ '../views/home/MyMusic.vue')

const Singer = () => import(/* webpackChunkName: "group-music" */ '../views/home/Singer.vue')

const SingList = () => import(/* webpackChunkName: "group-music" */ '../views/home/SingList.vue')

const MvDet = () => import(/* webpackChunkName: "group-det" */ '../components/mv/MvDet.vue')

const newSongInfo = () => import(/* webpackChunkName: "group-info" */ '../views/homeChildren/newSongInfo.vue')

const SingListDet = () => import(/* webpackChunkName: "group-det" */ '../views/singListChildren/SingListDet.vue')

const SingerDet = () => import(/* webpackChunkName: "group-det" */ '../components/singer/SingerDet.vue')

const SongDet = () => import(/* webpackChunkName: "group-det" */ '../components/song/songDet/SongDet.vue')

const ToLogin = () => import(/* webpackChunkName: "group-head" */ '../views/ToLogin.vue')

const Rank = () => import(/* webpackChunkName: "group-info" */ '../views/home/Rank.vue')

const SearchResult = () => import(/* webpackChunkName: "group-search" */ '../components/headers/serach/SearchResult.vue')



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
      { path: '/login', component: ToLogin },
      { path: '/mvdet', component: MvDet },
      { path: '/rank', component: Rank },
      { path: '/search/result', component: SearchResult }
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
