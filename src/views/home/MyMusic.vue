<template>
  <div>
    <div class="contain">
      <el-row>
        <el-col :span="6" :offset="2" class="left-list">
          <!-- 左侧歌单列表 -->
          <div class="left-contain">
            <my-song-list
              :songListObjAttr="songListObj"
              class="songList"
            ></my-song-list>
          </div>
        </el-col>
        <el-col :span="14" :offset="8" class="right-show">
          <!-- 右侧歌单展示 -->
          <el-card> 我喜欢的音乐 </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
    
<script>
import { getMyMusic } from "../../network/mySong"; // 我的歌单 网络请求
import MySongList from "../../components/song/MySongList.vue"; // 导入我的歌单列表组件
export default {
  name: "MyMusic",
  data() {
    return {
      // 歌单列表对象
      songListObj: {
        // 创建的歌单
        createSongList: [],
        // 收藏的歌单
        collectionSongList: [],
      },
    };
  },
  created() {
    this.getMyMusicRef();
  },
  methods: {
    // 获取我的歌单
    async getMyMusicRef() {
      const { data: res } = await getMyMusic(this.$store.state.profile.userId);
      console.log(res);
      if (res.code !== 200) {
        return this.$message.error("请求失败");
      }
      // 循环判断是创建的歌单还是收藏的歌单 push 到不同数组
      res.playlist.forEach((item) => {
        if (item.userId === this.$store.state.profile.userId) {
          this.songListObj.createSongList.push(item);
        } else {
          this.songListObj.collectionSongList.push(item);
        }
      });
    },
  },
  components: {
    MySongList,
  },
};
</script>
    
<style lang='less' scoped>
.left-contain {
  min-height: 266px;
 position: fixed;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>