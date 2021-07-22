<template>
  <div>
    <el-row :gutter="20">
      <el-col :offset="2" :span="5">
        <rank-list @getToplistDet="getToplistDet"></rank-list>
      </el-col>
      <el-col :span="15">
        <my-song-show :playListInfoAttr="toplist" :playListCommentsAttr='toplistComments'></my-song-show>
        <!-- 评论组件 -->
        <album-coment :albumComentsObj="toplistComments"></album-coment>
        <!-- 分页 -->
        <div class="box">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pagenum"
            :page-sizes="[50, 100, 200, 400]"
            :page-size="queryInfo.limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="toplistComments.total"
          >
          </el-pagination>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
  
<script>
import RankList from "../../components/rank/RankList.vue"; // 引入排行榜榜单组件
import MySongShow from "../../components/song/MySongShow.vue"; // 引入歌曲展示组件
import { getPlaylistDet } from "../../network/Sing"; // 榜单详情 网络请求
import { getPlayComment } from "../../network/comment"; // 榜单评论 网络请求
import AlbumComent from "../../components/coments/AlbumComent.vue"; // 引入评论组件

export default {
  name: "Rank",
  data() {
    return {
      // 榜单详情
      toplist: {
        // 榜单名称
        playlist: {
          // 作者信息
          creator: {},
          // 歌曲
          tracks: [],
        },
      },
      // 榜单评论数据对象
      toplistComments: {
        // 评论数量
        total: null,
        comments: [],
        hotComments: [],
      },
      // 榜单评论查询参数
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
  
  methods: {
    // 获取榜单详情
    async getToplistDet(id) {
      const { data: res } = await getPlaylistDet(id);
      // console.log(res);
      if (res.code !== 200) {
        return this.$message.error("获取详情失败");
      }
      this.toplist = res;
      this.queryInfo.id = id;
      this.getToplistCommentRef()
      // console.log(id)
    },
    // 获取榜单评论
    async getToplistCommentRef() {
      // console.log('666')
      const { data: res } = await getPlayComment(this.queryInfo);
      // console.log(res);
      if (res.code !== 200) {
        return this.$message.error("获取评论失败");
      }
      this.toplistComments = res;
      // 超 5000 评论 获取下一页数据
      if (res.total > 5000) {
        this.queryInfo.before = res.comments[res.comments.length - 1].time;
      }
    },

    // 页面评论数量改变事件
    handleSizeChange(size) {
      this.queryInfo.limit = size;
      this.getToplistCommentRef();
    },
    // 当前页改变事件
    handleCurrentChange(pagenum) {
      this.pagenum = pagenum;
      this.queryInfo.offset = (pagenum - 1) * this.queryInfo.limit;
      this.getToplistCommentRef();
    },
  },
  components: {
    RankList,
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