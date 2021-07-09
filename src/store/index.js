import Vue from 'vue'
import Vuex from 'vuex'
import { getCookie } from '../utils/cookie'



Vue.use(Vuex)

export default new Vuex.Store({
  state: {
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
    }

  },
  actions: {

  },
  getters: {},
  modules: {}

})
