<template>
  <div>
    <div class="contain">
      <el-row :gutter="20">
        <el-col :span="5" :offset="2" class="left-list">
          <!-- 左侧歌单列表 -->
          
            <my-song-list 
              :songListObjAttr="songListObj"
              class="songList"
              @sendPlaylistId="getPlaylistId"
            ></my-song-list>
          
        </el-col>
        <el-col :span="15"  class="right-show">
          <!-- 右侧歌单展示 -->
          <my-song-show :playListInfoAttr="playListInfo" :playListCommentsAttr='playListComments'></my-song-show>
          <album-coment :albumComentsObj="playListComments"></album-coment>
          <!-- 分页 -->
          <div class="box">
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pagenum"
            :page-sizes="[50, 100, 200, 400]"
            :page-size="queryInfo.limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="playListComments.total"
          >
          </el-pagination>
          </div>
        </el-col>
      </el-row>
    </div>
    
  </div>
</template>
    
<script>
import { getMyMusic } from "../../network/mySong"; // 我的歌单 网络请求
import MySongList from "../../components/song/MySongList.vue"; // 导入我的歌单列表组件
import MySongShow from "../../components/song/MySongShow.vue"; // 导入歌单详情展示组件
import { getPlaylistDet } from "../../network/Sing"; // 歌单详情 网络请求
import { getPlayComment } from "../../network/comment"; // 歌单评论 网络请求
import AlbumComent from "../../components/coments/AlbumComent.vue"; // 引入评论组件
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

      // 歌单详情信息
      playListInfo: {
        // 歌单名称
        playlist: {
          // 作者信息
          creator: {},
          // 歌曲
          tracks: [],
        },
      },

      // 歌单评论数据对象
      playListComments: {
        // 评论数量
        total: null,
        comments: [],
        hotComments: [],
      },
      // 歌单评论查询参数
      queryInfo: {
        id: "",
        limit: 20,
        offset: 0,
        before: null,
      },
      // 当前评论页
      pagenum: 1,
    };
  },
  created() {
    this.getMyMusicRef();
  },
  methods: {
    // 获取我的歌单
    async getMyMusicRef() {
      const { data: res } = await getMyMusic(this.$store.state.profile.userId);
      // console.log(res);
      if (res.code !== 200 && this.$store.state.profile.userId !== '') {
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
      // 默认展示的歌单
      this.getPlaylistId(this.songListObj.createSongList[1]);
    },

    // 接收歌单
    async getPlaylistId(item) {
      if (item.name === `${this.$store.state.profile.nickName}喜欢的音乐`) {
        return;
      } else {
        const { data: res } = await getPlaylistDet(item.id).catch((err) => err);
        if (res.code !== 200) {
          return this.$message.error("获取歌单详情失败");
        }
        this.playListInfo.playlist = res.playlist;
        this.queryInfo.id = res.playlist.id;
        // this.playListInfo.privileges = res.privileges;

        // // 处理歌曲列表中的歌手数组后返回
        // this.playListInfo.playlist.tracks.forEach((item) => {
        //   // 增加 arName 属性用于存储每首歌的歌手信息
        //   let arName = "";
        //   item.ar.forEach((arItem) => {
        //     arName = arName + arItem.name + "/";
        //   });

        //   item.arName = arName.slice(0, arName.length - 1);
        // });

        console.log(res);

        // console.log(this.playListInfo.playlist.tracks);
      }
      // 获取歌单评论
      this.getPlayCommentFun();
    },

    // 获取歌单评论
    async getPlayCommentFun() {
      const { data: res } = await getPlayComment(this.queryInfo);
      // console.log(res);
      if(res.code !== 200){
        return this.$message.error('获取评论失败')
      }
      this.playListComments = res;
      // 超 5000 评论 获取下一页数据
      if(res.total > 5000){
        this.queryInfo.before = res.comments[res.comments.length - 1].time
      }
    },

    // 页面评论数量改变事件
    handleSizeChange(size) {
      this.queryInfo.limit = size;
      this.getPlayCommentFun();
    },
    // 当前页改变事件
    handleCurrentChange(pagenum) {
      this.pagenum = pagenum;
      this.queryInfo.offset = (pagenum - 1) * this.queryInfo.limit
      this.getPlayCommentFun();
    },
  },
  components: {
    MySongList,
    MySongShow,
    AlbumComent,
  },
};
</script>
    
<style lang='less' scoped>

.box {
  display: flex;
  justify-content: center;
}
</style>