<template>
  <div>
    <el-row>
      <el-col :offset="2" :span="20">
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
</template>
    
<script>
import MySongShow from "../../components/song/MySongShow.vue"; // 引入歌单展示组件
import AlbumComent from "../../components/coments/AlbumComent.vue"; // 引入评论组件
import { getPlaylistDet } from "../../network/Sing"; // 歌单详情 网络请求
import { getPlayComment } from "../../network/comment"; // 歌单评论 网络请求

export default {
  name: "SingListDet",
  data() {
    return {
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
    this.getPlayListRef();
    this.getPlayListCommentsRef();
  },
  methods: {
    // 获取歌单详情
    async getPlayListRef() {
      // console.log("666");
      const { data: res } = await getPlaylistDet(this.$store.state.playListId);
      // console.log(res);
      this.playListInfo = res;
    },
    // 获取歌单评论
    async getPlayListCommentsRef() {
      this.queryInfo.id = this.$store.state.playListId;
      const { data: res } = await getPlayComment(this.queryInfo);
      // console.log(res);
      if(res.code !== 200){
        return this.$message.error('获取评论失败')
      }
      this.playListComments = res;
      // 超 5000 评论 获取下一页数据
      if(this.total > 5000){
        this.queryInfo.before = res.comments[res.comments.length - 1].time
      }
    },
    // 页面评论数量改变事件
    handleSizeChange(size) {
      this.queryInfo.limit = size;
      this.getPlayListCommentsRef();
    },
    // 当前页改变事件
    handleCurrentChange(pagenum) {
      this.pagenum = pagenum;
      this.queryInfo.offset = (pagenum - 1) * this.queryInfo.limit;
      this.getPlayListCommentsRef();
    },
  },
  components: {
    MySongShow,
    AlbumComent,
  },
};
</script>
    
<style lang='less' scoped>
.box {
  display: flex;
  justify-content: center;
  margin: 20px 0 50px 0;
  height: 100%;
}
</style>