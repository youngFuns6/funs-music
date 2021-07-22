<template>
  <div>
    <el-row :gutter="20">
      <el-col :offset="2" :span="14">
        <el-card>
          <!--  专辑描述区域 -->
          <div class="header">
            <div class="cover">
              <img :src="newSongInfoObj.album.picUrl" alt="" />
              <div class="mask"></div>
            </div>
            <div class="albumInfo">
              <h3>{{ newSongInfoObj.album.name }}</h3>
              <p class="singer">
                歌手：<a href="#" @click="getSingerId(newSongInfoObj.album.artist.id)">{{ newSongInfoObj.album.artist.name }}</a>
              </p>
              <p class="singer">
                发行时间：{{ newSongInfoObj.album.publishTime | dataFormate }}
              </p>
              <p class="singer">发行公司：{{ newSongInfoObj.album.company }}</p>
            </div>
          </div>

          <div class="boxDec">
            <!-- 专辑描述1 -->
            <div class="dec1" v-show="isShow">
              <p class="pro">专辑介绍</p>
              <p
                ref="decRef"
                class="isShowCon"
                v-for="(item, index) in description"
                :key="index"
              >
                {{ item }}
              </p>
            </div>
            <!-- 专辑描述2 -->
            <div class="dec2" v-show="isShowE">
              <p class="pro">专辑介绍</p>
              <p
                ref="decRef"
                class="isShowCon"
                v-for="(item, index) in description"
                :key="index"
              >
                {{ item }}
              </p>
            </div>
            <!-- 展开收起按钮 -->
            <div class="show" @click="doShowText" v-if="showText">展开</div>
            <div class="show" @click="doShowTextE" v-else>收起</div>
          </div>

          <!-- 歌曲列表 -->
          <div class="list">
            <h4>包含歌曲列表</h4>
            <el-table :data="newSongInfoObj.songs" style="width: 100%" stripe>
              <el-table-column type="index" label="#" width="60">
              </el-table-column>
              <el-table-column width="100">
                <template #default="scope">
                  <span class="iconfont icon-hm_video_light" @click="playAudio(scope.row.id)"></span>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="播放mv"
                    placement="bottom-end"
                    :enterable="false"
                  >
                    <span class="iconfont icon-chakanMV" v-show="scope.row.mv" @click="saveMvId(scope.row.mv)">
                    </span>
                  </el-tooltip>
                </template>
              </el-table-column>

              <el-table-column label="歌曲" width="260">
                <template #default="scope">
                  <span class="row_po" @click="getSongId(scope.row.id)">{{ scope.row.name }}</span>
                </template>
              </el-table-column>

              <el-table-column label="歌手">
                <template #default="scope">
                  <span
                    class="row_po"
                    v-for="(item, index) in scope.row.ar"
                    :key="item.id"
                    @click="getSingerId(item.id)"
                    >{{ item.name
                    }}<i v-if="index === scope.row.ar.length - 1 ? 0 : 1"
                      >/</i
                    ></span
                  >
                </template>
              </el-table-column>

              <el-table-column prop="dt" label="时长" width="100">
                <template #default="scope">
                  {{ scope.row.dt | secondFormate }}
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- 专辑评论 -->
          <album-coment :albumComentsObj="albumComents"></album-coment>
          <!-- 分页 -->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="this.pageNum"
            :page-sizes="[20, 100, 200, 400]"
            :page-size="this.queryInfo.limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="this.albumComents.total"
          >
          </el-pagination>
        </el-card>
      </el-col>
      <el-col :span="6">
        <!-- 关于歌手 -->
        <el-card>
          <div class="newSongs">关于歌手</div>
          <div>
            <p
              class="singerDec"
              v-for="(item, index) in singerDec"
              :key="index"
            >
              {{ item }}
            </p>
          </div>
        </el-card>
        <!-- 相似歌手推荐 -->
        <el-row>
          <el-col>
            <el-card>
              <div class="newSongs">相似歌手推荐</div>
              <div class="singerTag">
                <el-tag
                  type="success"
                  v-for="(item, index) in simiSingers"
                  :key="index"
                  @click="getSingerId(item.id)"
                >
                  <img :src="item.picUrl" />
                  {{ item.name }}
                </el-tag>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
    
<script>
import { getNewSongInfo, getAlbumDet, getSimiSinger } from "../../network/Sing";
import { getAlbumComment } from "../../network/comment";
import AlbumComent from "../../components/coments/AlbumComent.vue"; // 导入专辑评论组件
import {mapMutations, mapActions} from 'vuex'

export default {
  name: "newSongInfo",
  data() {
    return {
      // 新碟详情信息对象
      newSongInfoObj: {
        // 新碟详情描述
        album: {
          artist: {
            // 歌手 id
            id: "",
          },
        },
        // 新碟包含歌曲
        songs: [],
      },
      // 专辑描述字符串数组
      description: [],

      // 是否展开描述
      isShow: true,
      isShowE: false,
      // 展开 收起 文字
      showText: true,

      // 专辑评论查询参数
      queryInfo: {
        id: this.$store.state.albumId,
        limit: 20,
        offset: 0,
        before: null,
      },

      // 专辑评论 数据对象
      albumComents: {
        // 评论数量
        total: 0,
        comments: [],
        hotComments: [],
      },

      // 分页参数
      pageNum: 1,

      // 歌手描述信息
      singerDec: [],

      // 相似歌手推荐
      simiSingers: [],
    };
  },
  created() {
    this.getNewSongInfoRef();
    this.getAlbumCommentRef();
    this.getSimiSingerRef();
  },
  methods: {
    // 根据对应 id 获取 新碟详情
    async getNewSongInfoRef() {
      const { data: res } = await getNewSongInfo(this.$store.state.albumId);
      // console.log(res);
      if (res.code !== 200) {
        return this.$message.error("获取新碟详情失败");
      }
      // 处理专辑描述字符串 存为数组
      this.description = res.album.description
        .split()
        .join()
        .split("\n\n")
        .join("\n")
        .split("\n");
      // console.log(this.description);
      this.newSongInfoObj.album = res.album;
      this.newSongInfoObj.songs = res.songs;
      this.newSongInfoObj.album.artist.id = res.album.artist.id;
      // console.log(this.newSongInfoObj.album.artist.id);
      // // 获取相关歌手 id
      // res.album.artists.forEach(item => {
      //   this.singerId.push(item.id)
      // })
      // console.log(res);
      this.getAlbumDetRef();
      // this.getAr();
    },

    // 展开文字事件监听
    doShowText() {
      this.isShow = false;
      this.isShowE = true;
      this.showText = false;
    },
    doShowTextE() {
      this.isShow = true;
      this.isShowE = false;
      this.showText = true;
    },

    // // 处理原有数据 获取每首歌的所有歌手
    // getAr() {
    //   // console.log(this.newSongInfoObj.songs);
    //   this.newSongInfoObj.songs.forEach((item) => {
    //     let arName = "";
    //     item.ar.forEach((arItem) => {
    //       arName = arName + arItem.name + "/";
    //     });

    //     item.arName = arName.slice(0, arName.length - 1);
    //   });
    // },

    // 获取专辑评论
    async getAlbumCommentRef() {
      const { data: res } = await getAlbumComment(this.queryInfo);
      if (res.code !== 200) {
        return this.$message.error("评论获取失败");
      }
      this.albumComents.total = res.total;
      this.albumComents.comments = res.comments;
      this.albumComents.hotComments = res.hotComments;

      // console.log(res);
    },

    // 单页评论数量改变事件
    handleSizeChange(pagesize) {
      this.queryInfo.limit = pagesize;
      this.getAlbumCommentRef();
    },

    // 页面改变事件
    handleCurrentChange(pagenum) {
      this.pageNum = pagenum;
      this.queryInfo.offset = (pagenum - 1) * this.queryInfo.limit;
      this.getAlbumCommentRef();
    },

    // 获取歌手详情
    async getAlbumDetRef() {
      // console.log(this.$store.state.albumId)
      // console.log(this.newSongInfoObj.album.artist.id);
      const { data: res } = await getAlbumDet(
        this.newSongInfoObj.album.artist.id
      );

      if (res.code !== 200) {
        return this.$message.error("新歌速递获取失败");
      }
      // console.log(res);
      // 分割歌手描述字符串 存入数组
      this.singerDec = res.briefDesc.split().join().split("\n\n");
      // console.log(this.singerDec);
    },

    // 获取相似歌手推荐
    getSimiSingerRef() {
      new Promise((resolve, reject) => {
        if (this.newSongInfoObj.album.artist.id === "") {
          this.newSongInfoObj.album.artist.id = getNewSongInfo(
            this.$store.state.albumId
          ).then((res) => {
            return res.data.album.artist.id;
          });
          resolve(this.newSongInfoObj.album.artist.id);
        }
        reject();
      })
        .then((value) => {
          getSimiSinger(value).then((res) => {
            this.simiSingers = res.data.artists;
            // console.log(this.simiSingers);
          });
        })
        .catch((err) => err);
    },
    ...mapMutations(['singerIdMutations','SongIdMutations','musicUrlMutations','mvIdMutations']),
    ...mapActions(['getSongsDetActions']),
    // 点击歌手 存储歌手 id 并跳转至歌手详情
    getSingerId(id){
      this.singerIdMutations(id)
      this.$router.push('/singer/detail')
    },
    // 点击歌曲 存储歌曲 id 并跳转至歌曲详情
    getSongId(id){
      this.SongIdMutations(id)
      this.$router.push('/songs/detail')
    },
    // 点击播放按钮 播放歌曲
    playAudio(id){
       // 存储当前音乐 id
      this.musicUrlMutations(id);
      // 获取播放音乐详情
      this.getSongsDetActions(id)
      // 通过事件总线触发播放条的 播放事件
      this.$bus.$emit("onPlay");
    },
    // 点击 mv 按钮 跳转至 mv 详情
    saveMvId(id){
      this.mvIdMutations(id)
      this.$router.push('/mvdet')
    }
  },

  components: {
    AlbumComent,
  },
};
</script>
    
<style lang='less' scoped>
.el-row {
  margin-top: 20px;
}

.header::after {
  content: "";
  display: block;
  clear: both;
  overflow: hidden;
}

.cover {
  position: relative;
  width: 177px;
  height: 177px;
  float: left;
  background-color: #000;
  img {
    width: 100%;
    height: 100%;
    display: block;
  }
  .mask {
    position: absolute;
    left: 0;
    top: 0;
    width: 209px;
    height: 177px;
    background: url(../../assets/coverall.png);
    background-position: 0 -986px;
    // background-color: pink;
  }
}

.albumInfo {
  float: left;
  margin: 20px 0 0 200px;
  font-size: 24px;
  h3,
  p {
    margin: 15px 0;
  }
  .singer {
    font-size: 14px;
    color: #000;
    a {
      text-decoration: none;
      color: #0c73c2;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}

.row_po {
  cursor: pointer;
  &:hover {
    text-decoration: underline;
    color: #0c73c2;
  }
}

.boxDec {
  position: relative;
  margin: 50px 0 80px 0;
}
.dec1 {
  box-sizing: border-box;
  height: 110px;
  overflow: hidden;
}
.pro {
  font-weight: 600;
  color: #000;
  line-height: 2.5;
}

.isShowCon {
  word-wrap: break-word;
  word-break: break-word;
  white-space: normal;
  font-weight: normal;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 12px;
  color: #000;
  line-height: 2;
  text-indent: 2em;
}
.show {
  // background-color: #333;
  height: 50px;
  position: absolute;
  right: 30px;
  bottom: -80px;
  color: #0c73c2;
  cursor: pointer;
  user-select: none;
  &:hover {
    text-decoration: underline;
  }
}

.list h4 {
  font-weight: 600;
  padding-bottom: 20px;
  border-bottom: 1px solid red;
}

.icon-hm_video_light,
.icon-chakanMV {
  font-size: 24px;
  cursor: pointer;
  &:last-child {
    margin-left: 20px;
  }
  &:hover {
    color: #0c73c2;
  }
}

.newSongs {
  padding: 20px 10px;
  font-weight: 600;
  border-bottom: 1px solid red;
  margin-bottom: 20px;
}

.singerDec {
  font-size: 12px;
  color: #000;
  line-height: 2;
  text-indent: 2em;
}

.singerTag .el-tag img {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  vertical-align: middle;
}

.el-tag {
  margin: 10px;
  cursor: pointer;
}
</style>