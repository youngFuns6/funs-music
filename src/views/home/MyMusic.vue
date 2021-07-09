<template>
  <div>vue组件</div>
</template>
    
<script>
import { getMyMusic } from "../../network/mySong"; // 我的歌单 网络请求
export default {
  data() {
    return {};
  },
  created() {
    this.getMyMusicRef();
  },
  methods: {
    async getMyMusicRef() {
      const { data: res } = await getMyMusic(this.$store.state.profile.userId);
      console.log(res)
    },
  },
};
</script>
    
<style lang='less' scoped>
</style>