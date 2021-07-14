<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  created() {
    // 页面重构前获取本地保存的信息
    this.$store.state.albumId = JSON.parse(
      window.sessionStorage.getItem("albumId")
    );

    this.$store.state.playListId = JSON.parse(
      window.sessionStorage.getItem("playListId")
    );

    this.$store.state.profile = JSON.parse(
      window.sessionStorage.getItem("profile")
    );

    if (window.sessionStorage.getItem("activeIndex") === null) {
      this.$store.state.activeIndex = "/home";
    } else {
      this.$store.state.activeIndex =
        window.sessionStorage.getItem("activeIndex");
    }

   
  },
};
</script>

<style lang="less">
</style>
