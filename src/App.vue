<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  created() {
    // 页面重构前获取本地保存的信息

    // 获取本地专辑 id
    this.albumIdMutations(JSON.parse(window.sessionStorage.getItem("albumId")));
    
    // 获取本地歌手 id
    this.singerIdMutations(
      JSON.parse(window.sessionStorage.getItem("singerId"))
    );

    // 获取本地歌单 id
    this.playListIdMutations(
      JSON.parse(window.sessionStorage.getItem("playListId"))
    );

    // 获取本地用户信息
    this.profileMutations(JSON.parse(window.sessionStorage.getItem("profile")));

    // 获取本地歌曲 id
    this.SongIdMutations(JSON.parse(window.sessionStorage.getItem("songId")));

    // 获取本地 当前播放音乐地址
    if (window.localStorage.getItem("musicUrl")) {
      this.updataMusicUrl(
        JSON.parse(window.localStorage.getItem("musicUrl"))
      );
    }

    // 获取本地音乐播放列表 歌曲 id
    if (window.localStorage.getItem("musicPlayListId")) {
      this.updataMusicPlayListId(
        JSON.parse(window.localStorage.getItem("musicPlayListId"))
      );
    }

    // 获取本地当前导航菜单的 index
    if (window.sessionStorage.getItem("activeIndex") === null) {
      this.$store.state.activeIndex = "/home";
    } else {
      this.$store.state.activeIndex =
        window.sessionStorage.getItem("activeIndex");
    }
  },
  methods: {
    ...mapMutations([
      "profileMutations",
      "albumIdMutations",
      "singerIdMutations",
      "playListIdMutations",
      "SongIdMutations",
      "updataMusicUrl",
      "updataMusicPlayListId"
    ]),
  },
};
</script>

<style lang="less">
</style>
