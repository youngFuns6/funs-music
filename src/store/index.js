import Vue from 'vue'
import Vuex from 'vuex'




Vue.use(Vuex)
import { getSongsDet } from "../network/Sing"; // 歌曲详情 网络请求
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
    // 歌曲 id
    songId: '',

    // 音乐播放地址
    musicUrl: { url: '', id: '' },
    // 当前播放音乐信息
    currentMusicInfo: {
      al: {},
      name: '',
      picUrl: '',
      ar: []
    },
    // 音乐播放列表音乐 id
    musicPlayListId: [],
    

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
    },

    // 歌曲 id 处理函数
    SongIdMutations(state, ids) {
      state.songId = ids
    },

    // 音乐 url 处理函数
    musicUrlMutations(state, id) {
      // 获取音乐地址
      state.musicUrl.url = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
      state.musicUrl.id = id
      // console.log(state.musicUrl)
      // 如果音乐播放列表有该歌曲则不进行 push
      if (state.musicPlayListId.indexOf(id) === -1) {
        state.musicPlayListId.push(id)
      }
      // 获取当前播放音乐的名字 头像等信息
      getSongsDet(id).then((res) => {
        state.currentMusicInfo.al = res.data.songs[0].al;
        state.currentMusicInfo.name = res.data.songs[0].name;
        state.currentMusicInfo.picUrl = res.data.songs[0].picUrl;
        state.currentMusicInfo.ar = res.data.songs[0].ar;
        state.currentMusicInfo.dt = res.data.songs[0].dt
        state.currentMusicInfo.mv = res.data.songs[0].mv
        // console.log(state.currentMusicInfo);

      });
      // 保存至本地
      window.localStorage.setItem('musicUrl', JSON.stringify(state.musicUrl))
      window.localStorage.setItem('musicPlayListId', JSON.stringify(state.musicPlayListId))
    },

    // 更新音乐 地址
    updataMusicUrl(state,url) {
      state.musicUrl = url
    },

    // 音乐播放列表 id 处理函数
    musicPlayListId(state, id) {
      // 如果音乐播放列表有该歌曲则不进行 push
      if (state.musicPlayListId.indexOf(id) === -1) {
        state.musicPlayListId.push(id)
      }
      window.localStorage.setItem('musicPlayListId', JSON.stringify(state.musicPlayListId))
    },

    // 更新音乐播放列表 id
    updataMusicPlayListId(state,arr) {
      state.musicPlayListId = arr
    },

    

  },
  actions: {

  },
  getters: {},
  modules: {}

})
