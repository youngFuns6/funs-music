<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import {mapMutations} from 'vuex'
export default {
  created() {
    
    // 页面重构前获取本地保存的信息
    this.albumIdMutations(JSON.parse(
      window.sessionStorage.getItem("albumId")
    ))
    // this.$store.state.albumId = JSON.parse(
    //   window.sessionStorage.getItem("albumId")
    // );

    this.singerIdMutations(JSON.parse(
      window.sessionStorage.getItem("singerId")
    ))

    // this.$store.state.singerId = JSON.parse(
    //   window.sessionStorage.getItem("singerId")
    // );

    this.playListIdMutations(JSON.parse(
      window.sessionStorage.getItem("playListId")
    ))

    // this.$store.state.playListId = JSON.parse(
    //   window.sessionStorage.getItem("playListId")
    // );

    this.profileMutations(JSON.parse(
      window.sessionStorage.getItem("profile")
    ))

    // this.$store.state.profile = JSON.parse(
    //   window.sessionStorage.getItem("profile")
    // );

    this.SongIdMutations(JSON.parse(
      window.sessionStorage.getItem("songId")
    ))

    if (window.sessionStorage.getItem("activeIndex") === null) {
      this.$store.state.activeIndex = "/home";
    } else {
      this.$store.state.activeIndex =
        window.sessionStorage.getItem("activeIndex");
        
    }
  },
  methods:{
    ...mapMutations(['profileMutations', 'albumIdMutations', 'singerIdMutations', 'playListIdMutations','SongIdMutations'])
  }
};
</script>

<style lang="less">
</style>
