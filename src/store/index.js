import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // cookie
    cookie: false,
    // 用户信息
    profile: {
      nickName: '',
      avatarUrl: '',
      userId: '',
      backgroundUrl: '',
      level: '',
      listenSongs: '',
      createDays: ''
    },
    // 新碟数据 数组
    resSongs: []
  },
  mutations: {},
  actions: {},
  getters: {},
  modules: {}
  
})
