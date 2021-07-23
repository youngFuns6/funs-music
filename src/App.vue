<template>
  <div id="app" class="contain-top">
    <!-- 回到顶部 -->
    <el-backtop target=".contain-top" :bottom='80'>
      <div>
        <i class="iconfont icon-huidaodingbu"></i>
      </div>
    </el-backtop>
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
      this.updataMusicUrl(JSON.parse(window.localStorage.getItem("musicUrl")));
    }

    // 获取本地音乐播放列表 歌曲 id
    if (window.localStorage.getItem("musicPlayListId")) {
      this.updataMusicPlayListId(
        JSON.parse(window.localStorage.getItem("musicPlayListId"))
      );
    }

    // 获取本地当前播放歌曲详情
    if (window.localStorage.getItem("currentMusicInfo")) {
      this.songDetMutations(
        JSON.parse(window.localStorage.getItem("currentMusicInfo"))
      );
    }

    // 获取本地 mv id
    if (window.sessionStorage.getItem("mvId")) {
      this.mvIdMutations(JSON.parse(window.sessionStorage.getItem("mvId")));
    }

    // 获取本地搜索信息
    if(window.sessionStorage.getItem('searchValue')){
      this.searchValueMutations(JSON.parse(window.sessionStorage.getItem('searchValue')))
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
      "updataMusicPlayListId",
      "mvIdMutations",
      "songDetMutations",
      "searchValueMutations"
    ]),
  },
};
</script>

<style lang="less">
.contain-top {
  height: 100%;
  overflow-x: hidden;
}
.icon-huidaodingbu {
  font-size: 50px !important;
}
</style>
