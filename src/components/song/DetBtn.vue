<template>
  <div>
    <p class="opt_btn">
      <el-button
        type="primary"
        @click="
          playAudio();
          savePlayListId();
        "
        ><i class="iconfont icon-bofang"></i>播放</el-button
      >
      <el-button type="primary"
        ><i class="iconfont icon-yinle"></i>收藏</el-button
      >
      <el-button type="primary"
        ><i class="iconfont icon-fenxiang1"></i> 分享</el-button
      >
      <el-button type="primary"
        ><i class="iconfont icon-xiazai"></i>下载</el-button
      >
      <el-button type="primary"
        ><i class="iconfont icon-xinxi"></i>评论
        <span>({{ totalAttr ? totalAttr : "0" }})</span>
      </el-button>
    </p>
  </div>
</template>
    
<script>
import { mapMutations,mapActions } from "vuex";
export default {
  name: "DetBtn",
  props: {
    // 歌曲评论数量
    totalAttr: null,
    // 歌曲详情
    songDet: {
      type: Object,
      default() {
        return {};
      },
    },
    // 歌单详情
    playListInfoAttr: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {};
  },
  methods: {
    ...mapMutations(["musicUrlMutations", "musicPlayListId"]),
    ...mapActions(['getSongsDetActions']),
    // 点击播放按钮 播放歌曲
    playAudio() {
      // console.log(this.songDet.id === undefined)
      // 歌曲详情和歌单详情都使用了此组件 发送同一事件前需判断
      if (this.songDet.id === undefined) {
        return;
      } else {
        // 存储当前音乐 id
        this.musicUrlMutations(this.songDet.id);
        // 获取播放音乐详情
      this.getSongsDetActions(this.songDet.id)
        // 通过事件总线触发播放条的 播放事件
        this.$bus.$emit("onPlay");
      }
    },
    // 点击歌单播放按钮 将歌单所有歌曲加入播放列表 并播放歌单第一首歌曲
    savePlayListId() {
      // console.log(this.playListInfoAttr);
      // 歌曲详情和歌单详情都使用了此组件 发送同一事件前需判断
      if (this.playListInfoAttr.playlist === undefined) {
        return;
      } else {
        // console.log(this.playListInfoAttr.playlist.trackIds)
        // 处理歌单中歌曲数据
        let arr = this.playListInfoAttr.playlist.tracks.map((item) => {
          return item.id;
        });
        // console.log(...arr)
        // 调用播放列表音乐 id 处理函数
        this.musicPlayListId(arr);
        // 获取播放音乐详情
      this.getSongsDetActions(arr[0])
        // 存储第一首音乐 id  播放第一首歌曲
        this.musicUrlMutations(arr[0]);
        // 通过事件总线触发播放条的 播放事件
        this.$bus.$emit("onPlay");
        // 更新播放列表
        this.$bus.$emit("addMusic");
      }
    },
  },
};
</script>
    
<style lang='less' scoped>
.opt_btn {
  display: flex;
  justify-content: space-between;
}
</style>