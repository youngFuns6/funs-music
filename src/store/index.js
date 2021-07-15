import Vue from 'vue'
import Vuex from 'vuex'




Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 主页菜单导航的 index
    activeIndex: '',
    
    // cookie
    cookie: false,
    // 用户信息
    profile: {
      nickName: '',
      avatarUrl: '',
      userId: ''
    },

    // 新碟数据 数组
    resSongs: [],
    // 专辑 id
    albumId: '',

    // 歌手 id
    singerId: '',
    // 歌单 id
    playListId: '',

    // 音乐播放地址
    musicUrl: ''

  },
  mutations: {
    // cookie 处理函数
    // cookieMutations(state, cookie) {
    //   state.cookie = cookie;
    // },

    // 用户信息处理函数
    profileMutations(state, profile) {
      state.profile = profile
      // console.log(state.profile)
    },
    // 新碟 id 处理函数
    albumIdMutations(state, id) {
      state.albumId = id
    },

    // 歌手 id 处理函数
    singerIdMutations(state, id) {
      state.singerId = id
    },

    // 歌单 id 处理函数
    playListIdMutations(state, id) {
      state.playListId = id
    }

  },
  actions: {

  },
  getters: {},
  modules: {}

})
