<template>
  <div>
    <el-row :gutter="20">
      <el-col :offset="2" :span="15">
        <el-card>
          <div class="contain">
            <!-- 转盘 -->
            <div class="avatar">
              <div class="cover">
                <img :src="songDet.al.picUrl" alt="" />
                <span class="mask"></span>
              </div>
            </div>
            <div class="wrop">
              <!-- 歌曲 -->
              <h4>
                <span>{{ songDet.name }}</span>
                <i class="iconfont icon-MV" v-if="songDet.mv"></i>
              </h4>
              <p class="s_name">
                歌手：<span
                  v-for="(item, index) in songDet.ar"
                  :key="item.id"
                  @click="getSingerId(item.id)"
                  >{{ item.name
                  }}<i>{{
                    index === songDet.ar.length - 1 ? "" : "/"
                  }}</i></span
                >
              </p>
              <p class="al_name">
                所属专辑：<span @click="getalbumId(songDet.al.id)">{{
                  songDet.al.name
                }}</span>
              </p>
              <!-- 按钮 -->
              <det-btn :totalAttr="songComments.total" :songDet='songDet'></det-btn>
              <!-- 歌词 -->
              <div :class="className">
                <div  v-html="lrc"></div>
                <a href="#" class="rc_on" @click.prevent="onShow" v-if="showText">展开</a>
                <a href="#" class="rc_on" @click.prevent="onClose" v-else>收起</a>
              </div>
            </div>
          </div>
          <!-- 评论 -->
          <album-coment :albumComentsObj="songComments"></album-coment>
        </el-card>
        <!-- 评论 分页 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagenum"
          :page-sizes="[100, 200, 300, 400]"
          :page-size="queryInfo.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="songComments.total"
        >
        </el-pagination>
      </el-col>
      <el-col :span="5">
        <!-- 相似歌单 -->
        <more-songs
          :simiPlaylistAttr="simiPlaylist"
          :simiSongsAttr="simiSongs"
        ></more-songs>
      </el-col>
    </el-row>
  </div>
</template>
    
<script>
import DetBtn from "../DetBtn.vue"; // 引入四个按钮组件
import AlbumComent from "../../coments/AlbumComent.vue"; // 引入评论组件
import {
  getSongsDet,
  getLyric,
  getSimiPlaylist,
  getSimiSongs,
} from "../../../network/Sing"; // 歌曲、歌词、相似歌单、相似歌曲详情 网络请求
import MoreSongs from "./MoreSongs.vue"; // 引入右侧 相似歌单组件
import { getSongComment } from "../../../network/comment"; // 歌曲评论 网络请求
import { mapMutations } from "vuex";
export default {
  name: "SongDet",
  data() {
    return {
      // 歌曲详情
      songDet: {
        // 专辑
        al: {},
      },
      // 歌词
      lrc: "",
      // 歌词展开收起按钮 文字
      showText: true,
      // 歌词样式类名
      className: 'rc',
      // 相似歌单
      simiPlaylist: [],
      // 相似歌曲
      simiSongs: [],
      // 歌曲评论请求 查询参数
      queryInfo: {
        id: this.$store.state.songId,
        limit: 20,
        offset: 0,
        before: null,
      },
      // 当前评论页
      pagenum: 1,
      // 歌曲评论
      songComments: {},
    };
  },
  created() {
    this.getSongsDetRef();
  },
  methods: {
    // 获取歌曲详情
    async getSongsDetRef() {
      const { data: res } = await getSongsDet(this.$store.state.songId);
      console.log(res);
      if (res.code !== 200) {
        return this.$message.error("获取歌曲详情失败");
      }
      this.songDet = res.songs[0];
      this.getLyricRef();
      this.getSimiPlaylistRef();
      this.getSimiSongsRef();
      this.getSongCommentRef();
    },
    // 获取歌词
    async getLyricRef() {
      const { data: res } = await getLyric(this.$store.state.songId);
      // console.log(res);
      this.lrc = res.lrc.lyric
        .split("\n")
        .map((item) => item.slice(11))
        .join("<br>");
    },
    // 监听歌词展开按钮事件
    onShow(){
      this.className = 'rc_s'
      this.showText = false
    },
    // 监听歌词收起按钮事件
    onClose(){
      this.className = 'rc'
      this.showText = true
    },
    // 获取相似歌单
    async getSimiPlaylistRef() {
      const { data: res } = await getSimiPlaylist(this.$store.state.songId);
      // console.log(res)
      this.simiPlaylist = res.playlists;
    },
    // 获取相似歌曲
    async getSimiSongsRef() {
      const { data: res } = await getSimiSongs(this.$store.state.songId);
      // console.log(res)
      this.simiSongs = res.songs;
    },

    // 获取歌曲评论
    async getSongCommentRef() {
      const { data: res } = await getSongComment(this.queryInfo);
      // console.log(res);
      this.songComments = res;
    },
    // 监听页面数量
    handleSizeChange(size){
      this.queryInfo.limit = size;
      this.getSongCommentRef()
    },
    // 监听页面改变
    handleCurrentChange(pagenum){
      this.pagenum = pagenum;
      this.queryInfo.offset = (pagenum - 1) * this.queryInfo.limit;
      this.getSongCommentRef()
    },

    ...mapMutations(["singerIdMutations", "albumIdMutations"]),
    // 点击歌手 存储歌手 id 并跳转至歌手详情
    getSingerId(id) {
      this.singerIdMutations(id);
      this.$router.push("/singer/detail");
    },
    // 点击专辑 存储专辑 id 并跳转至专辑页面
    getalbumId(id) {
      this.albumIdMutations(id);
      this.$router.push("/newSongInfo");
    },
  },
  components: {
    DetBtn,
    AlbumComent,
    MoreSongs,
  },
};
</script>
    
<style lang='less' scoped>
.contain {
  margin: 30px;
  &::after {
    content: "";
    clear: both;
    display: block;
    overflow: hidden;
  }
}

.avatar {
  position: relative;
  float: left;
  width: 198px;
  height: 198px;
}
.cover {
  width: 198px;
  height: 198px;
  img {
    width: 130px;
    height: 130px;
    margin: 34px;
  }
  .mask {
    position: absolute;
    top: -4px;
    left: -4px;
    width: 206px;
    height: 205px;
    background: url("../../../assets/coverall (1).png") no-repeat;
    background-position: -140px -580px;
  }
}
.wrop {
  float: left;
  margin: 0 50px;
  h4 {
    font-size: 26px;
    i {
      margin-left: 10px;
      font-size: 24px;
      color: red;
      cursor: pointer;
    }
  }
  .s_name,
  .al_name {
    margin: 20px 0;
    span {
      color: #0c73c2;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
  }
  .rc {
    position: relative;
    height: 320px;
    overflow: hidden;
    margin-top: 50px;
    line-height: 2;
  }
  .rc_s {
    position: relative;
    margin-top: 50px;
    line-height: 2;
  }
  .rc_on {
    position: absolute;
    left: 400px;
    bottom: 0px;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>