<template>
  <div>
    <el-row>
      <el-col :offset="2" :span="20">
        <div>
          <!-- 上部歌手详情区域 -->
          <div class="avatar">
            <img :src="singerInfo.picUrl" alt="" />
          </div>
          <div class="s_name">
            <p>{{ singerInfo.name }}</p>
            <p v-for="(item, index) in singerInfo.alias" :key="index">
              <span
                >{{ item }}
                <i>{{ index === singerInfo.alias.length - 1 ? "" : "/" }}</i>
              </span>
            </p>
          </div>
          <div class="icon">
            <span class="iconfont icon-yinle1"
              ><i>{{ singerInfo.musicSize }}</i></span
            >
            <span class="iconfont icon-zhuanjiguangpan"
              ><i>{{ singerInfo.albumSize }}</i></span
            >
            <span class="iconfont icon-MV"
              ><i>{{ singerInfo.mvSize }}</i></span
            >
          </div>
        </div>
        <el-card>
          <el-tabs type="border-card" :stretch="true" @tab-click="toggle">
            <!-- 热门作品 -->
            <el-tab-pane label="热门作品">
              <el-table
                :data="hotSongs"
                :row-style="{ backgroundColor: '#EDE3E7' }"
                :show-header="false"
              >
                <el-table-column
                  type="index"
                  label="#"
                  width="50px"
                ></el-table-column>
                <el-table-column width="200px">
                  <template #default="scope">
                    <i class="iconfont icon-hm_video_light" @click="playAudio(scope.row.id)"></i>
                    <i class="iconfont icon-chakanMV" v-if="scope.row.mv" @click="saveMvId(scope.row.mv)"></i>
                  </template>
                </el-table-column>
                <el-table-column label="歌曲" width="400px" class="s_name">
                  <template #default="scope">
                    <span class="l_s_name" @click="getSongDet(scope.row.id)">{{ scope.row.name }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="时长" width="200px">
                  <template #default="scope">
                    {{ scope.row.dt | secondFormate }}
                  </template>
                </el-table-column>

                <el-table-column label="专辑">
                  <template #default="scope">
                    <span
                      class="l_s_name"
                      @click="saveAlbumId(scope.row.al.id)"
                      >{{ scope.row.al.name }}</span
                    >
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <!-- 所有专辑 -->
            <el-tab-pane label="所有专辑">
              <ul class="u_al">
                <li v-for="item in this.hotAlbums" :key="item.id">
                  <div class="cover">
                    <img :src="item.picUrl" alt="" />
                    <a
                      href="#"
                      class="mask_al"
                      @click.prevent="saveAlbumId(item.id)"
                    ></a>
                    <p>{{ item.name }}</p>
                    <p>{{ item.artist.name }}</p>
                  </div>
                </li>
              </ul>
            </el-tab-pane>
            <!-- 相关 MV -->
            <el-tab-pane label="相关MV">
              <ul class="u_mv">
                <li v-for="item in mvs" :key="item.id" @click.prevent="saveMvId(item.id)">
                  <div class="mv_cover">
                    <img :src="item.imgurl" alt="" />
                  </div>
                  <a href="#" class="mask_mv"></a>
                  <a href="#" class="icon_mv iconfont icon-bofang" ></a>
                  <p @click.prevent="saveMvId(item.id)">{{ item.name }}</p>
                </li>
              </ul>
            </el-tab-pane>
            <!-- 艺人介绍 -->
            <el-tab-pane label="艺人介绍">
              <div>
                <p class="s_desc">{{singerInfo.name}}：简介</p>
                <p class="intr">{{singerDesc.briefDesc}}</p>
                <ul class="desc">
                  <li v-for="(item1, index1) in this.singerDesc.introduction" :key="index1">
                    <p class="s_desc">{{item1.ti}}</p>
                    <p class="intr" v-for="(item2, index2) in item1.txt" :key="index2">{{item2}}</p>
                  </li>
                </ul>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
    
<script>
import {
  getArtists,
  getSingerAl,
  getSingerMv,
  getSingerDesc,
} from "../../network/singer"; // 歌手相关 网络请求
import { mapMutations,mapActions } from "vuex";
export default {
  name: "SingerDet",
  data() {
    return {
      // 歌手信息
      singerInfo: {},
      // 歌手热门单曲
      hotSongs: [],
      // 歌手专辑查询参数
      queryInfo: {
        id: this.$store.state.singerId,
        limit: 50,
        offset: 0,
      },
      // 歌手专辑
      hotAlbums: [],
      // 歌手 MV
      mvs: [],
      // 歌手描述
      singerDesc: {
        // 描述
        briefDesc: {},
        // 介绍
        introduction: [],
      },
    };
  },
  created() {
    this.getArtistsRef();
  },
  methods: {
    // 获取歌手详情及单曲
    async getArtistsRef() {
      const { data: res } = await getArtists(this.$store.state.singerId);
      console.log(res);
      if (res.code !== 200) {
        return this.$message.error("获取歌手单曲失败");
      }
      this.hotSongs = res.hotSongs;
      this.singerInfo = res.artist;
    },
    // vuex 歌手 id 处理函数
    ...mapMutations(["albumIdMutations","SongIdMutations","musicUrlMutations","mvIdMutations"]),
    ...mapActions(["getSongsDetActions"]),
    // 点击专辑跳转至专辑详情页
    saveAlbumId(id) {
      // 储存专辑 id 到 vuex
      this.albumIdMutations(id);
      this.$router.push("/newSongInfo");
    },
    // 点击歌曲跳转至歌曲详情页
    getSongDet(ids){
      // console.log(ids)
      // 存储歌曲 id 到 vuex
      this.SongIdMutations(ids)
      this.$router.push("/songs/Detail");
    },
    // 获取歌手专辑
    async getSingerAlRef() {
      const { data: res } = await getSingerAl(this.queryInfo);
      console.log(res);
      if (res.code !== 200) {
        return this.$message.error("获取歌手专辑失败");
      }
      this.hotAlbums = res.hotAlbums;
    },
    // 获取歌手 mv
    async getSingerMvRef() {
      const { data: res } = await getSingerMv(this.$store.state.singerId);
      console.log(res);
      this.mvs = res.mvs;
    },
    // 获取歌手描述
    async getSingerDescRef() {
      const { data: res } = await getSingerDesc(this.$store.state.singerId);
      if (res.code !== 200) {
        return this.$message.error("请求失败");
      }
      console.log(res);
      this.singerDesc.briefDesc = res.briefDesc;
      
      // 处理 res.introduction 中 txt 数据
        res.introduction.forEach(item => {
          item.txt = item.txt.split('\n')  
        });
        this.singerDesc.introduction = res.introduction;
        console.log(this.singerDesc.introduction)
    },

    // 监听 tab 栏切换事件 obj 为该面板对象实例 根据 paneName 属性请求不同数据
    toggle(obj) {
      //   console.log(obj);
      if (obj.paneName == 0) {
        this.getArtistsRef();
      } else if (obj.paneName == 1) {
        this.getSingerAlRef();
      } else if (obj.paneName == 2) {
        this.getSingerMvRef();
      } else if (obj.paneName == 3) {
        this.getSingerDescRef();
      }
    },

    // 点击播放按钮播放歌曲
    playAudio(id){
       // 存储当前音乐 id
      this.musicUrlMutations(id);
      // 获取播放音乐详情
      this.getSongsDetActions(id)
      // 通过事件总线触发播放条的 播放事件
      this.$bus.$emit("onPlay");
    },
    
    // 点击 mv 储存当前 mv id
    saveMvId(id){
      this.mvIdMutations(id)
      // 跳转至 mv 详情
      this.$router.push('/mvdet')
    },
    
  },

};
</script>
    
<style lang='less' scoped>
.avatar {
  margin: 30px auto;
  margin-bottom: 10px;
  width: 700px;
  height: 400px;
  background-color: #666;
  box-shadow: 0 0 10px;
  border-radius: 10px;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
  }
}
.s_name {
  font-size: 25px;
  p {
    text-align: center;
    margin: 10px 0;
  }
}
.icon {
  display: flex;
  justify-content: center;
  text-align: center;
  span {
    display: flex;
    margin: 10px 50px;
    font-size: 30px;
    i {
      font-size: 16px;
      line-height: 30px;
    }
  }
}
.icon-hm_video_light,
.icon-chakanMV {
  margin: 0 10px;
  font-size: 24px;
  cursor: pointer;
  &:hover {
    color: #333;
  }
}
.l_s_name:hover {
  text-decoration: underline;
  cursor: pointer;
}
.u_al {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.u_al li {
  padding: 0 30px 33px 30px;
  width: 153px;
  height: 178px;
  p {
    width: 153px;
    margin: 10px 0 10px 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  p:last-child {
    font-size: 12px;
  }
  // background-color: rgb(151, 147, 147);
  .cover {
    position: relative;
    width: 130px;
    height: 130px;
    // background-color: pink;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.mask_al {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 99999;
  width: 153px;
  height: 130px;

  background: url("../../assets/coverall.png") no-repeat;
  background-position: 0 -845px;
  // background-color: #666;
}

.el-tabs {
  background-color: #1b5e20;
  color: #fff;
}

.u_mv {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  li {
    position: relative;
    width: 137px;
    height: 140px;
    margin: 50px;
  }
  .mv_cover {
    width: 137px;
    height: 103px;
    border-radius: 5px;
    box-shadow: 0 0 10px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .mask_mv {
    position: absolute;
    left: 0;
    top: 0;
    width: 137px;
    height: 103px;
  }
  .icon_mv {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -80%);
    text-decoration: none;
    color: #bdbdbd;
    width: 44px;
    height: 44px;
    font-size: 40px;
    &:hover {
      color: #fff;
    }
  }
  p {
    margin: 5px 0;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
}
.desc li {
    margin: 20px 0;
}

.s_desc {
  font-weight: 600;
  line-height: 2;
  
}
.intr {
  font-size: 14px;
  line-height: 2;
  text-indent: 2em;
}
</style>