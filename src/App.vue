<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  // 页面重构前获取本地保存的信息
  created() {
    this.$store.state.albumId = JSON.parse(
      window.sessionStorage.getItem("albumId")
    );
    
    this.$store.state.profile = JSON.parse(
      window.sessionStorage.getItem("profile")
    );
  },
};
</script>

<style lang="less">
</style>
