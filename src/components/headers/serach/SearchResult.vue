<template>
  <div>
    <el-row>
      <el-col :offset="2" :span="20">
        <el-card>
          <!-- 搜索框 -->
          <el-row>
            <el-col :offset="6" :span="12">
              <div class="search-p">
                <search></search>
              </div>
            </el-col>
          </el-row>
          <el-tabs
            v-model="activeName"
            @tab-click="handleClick"
            :stretch="true"
            ref="tabsRef"
          >
            <el-tab-pane label="单曲" name="first">
              <el-table :data="searchInfo.songs" stripe>
                <el-table-column width="80px">
                  <template #default="scope">
                    <i
                      class="iconfont icon-bofang"
                      @click="saveAudio(scope.row.id)"
                    ></i>
                  </template>
                </el-table-column>
                <!-- 歌名 -->
                <el-table-column>
                  <template #default="scope">
                    <span
                      class="song-name"
                      v-html="scope.row.name"
                      @click="getSongId(scope.row.id)"
                    ></span>
                  </template>
                </el-table-column>

                <el-table-column>
                  <template #default="scope">
                    <span
                      @click="getSingerId(item.id)"
                      class="singer-name"
                      v-for="(item, index) in scope.row.ar"
                      :key="item.id"
                      v-html="
                        item.name +
                        `${index === scope.row.ar.length - 1 ? '' : '/'}`
                      "
                    >
                    </span>
                  </template>
                </el-table-column>

                <el-table-column>
                  <template #default="scope">
                    <span
                      class="al-name"
                      v-html="scope.row.al.name"
                      @click="toggleNewSongInfo(scope.row.al.id)"
                    ></span>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <!-- 歌手 -->
            <el-tab-pane label="歌手" name="second">
              <ul class="singer-wrop">
                <li v-for="item in searchInfo.singer" :key="item.id">
                  <a href="#" @click.prevent="getSingerId(item.id)">
                    <img :src="item.picUrl" alt="" />
                  </a>
                  <p v-html="item.name" @click="getSingerId(item.id)"></p>
                </li>
              </ul>
            </el-tab-pane>
            <!-- 专辑 -->
            <el-tab-pane label="专辑" name="third">
              <ul class="album-ul">
                <li v-for="item in searchInfo.albums" :key="item.id">
                  <div class="cover">
                    <img :src="item.picUrl" alt="" />
                    <a
                      href="#"
                      class="mask"
                      @click.prevent="toggleNewSongInfo(item.id)"
                    ></a>
                    <p v-html="item.name"></p>
                    <p v-html="item.artist.name"></p>
                  </div>
                </li>
              </ul>
            </el-tab-pane>
            <!-- 视频 -->
            <el-tab-pane label="视频" name="fourth">
              <ul class="mv-ul">
                <li v-for="item in searchInfo.mv" :key="item.id">
                  <a href="#" @click.prevent="saveMvId(item.id)">
                    <img :src="item.cover" alt="" />
                    <i
                      class="iconfont icon-shexiang"
                      @click="saveMvId(item.id)"
                      >{{ item.playCount | counFormate }}</i
                    >
                  </a>
                  <p
                    class="mvtitle"
                    v-html="item.name"
                    @click="saveMvId(item.id)"
                  ></p>
                  <p>
                    <span
                      @click="getSingerId(i.id)"
                      v-for="(i, index) in item.artists"
                      :key="i.id"
                      v-html="
                        i.name +
                        `${index === item.artists.length - 1 ? '' : '/'}`
                      "
                    ></span>
                  </p>
                </li>
              </ul>
            </el-tab-pane>
            <!-- 歌词 -->
            <el-tab-pane label="歌词" name="five">
              <el-table :data="searchInfo.lrc" stripe>
                <!-- 展开行 -->
                <el-table-column width="50px" type="expand">
                  <template #default="scope">
                    <div class="expan-lrc">
                      <p
                        v-for="(item, index) in scope.row.lyrics"
                        :key="index"
                        v-html="item"
                      ></p>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column width="80px">
                  <template #default="scope">
                    <i
                      class="iconfont icon-bofang"
                      @click="saveAudio(scope.row.id)"
                    ></i>
                  </template>
                </el-table-column>
                <el-table-column>
                  <template #default="scope">
                    <span
                      class="song-name"
                      v-html="scope.row.name"
                      @click="getSongId(scope.row.id)"
                    ></span>
                  </template>
                </el-table-column>
                <el-table-column>
                  <template #default="scope">
                    <span
                      @click="getSingerId(item.id)"
                      class="singer-name"
                      v-for="(item, index) in scope.row.ar"
                      :key="item.id"
                      v-html="
                        item.name +
                        `${index === scope.row.ar.length - 1 ? '' : '/'}`
                      "
                    >
                    </span>
                  </template>
                </el-table-column>

                <el-table-column>
                  <template #default="scope">
                    <span
                      class="al-name"
                      v-html="scope.row.al.name"
                      @click="toggleNewSongInfo(scope.row.al.id)"
                    ></span>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
    
<script>
import { getResult } from "../../../network/serchTips";
import Search from "./Search.vue"; // 引入搜索组件
import newSongInfo from "../../../views/homeChildren/newSongInfo.vue";
import { mapMutations, mapActions } from "vuex";
export default {
  name: "SearchResult",
  data() {
    return {
      // 搜索查询参数
      queryInfo: {
        keywords: "",
        limit: 30,
        offset: 0,
        type: 1,
      },
      // 默认面板
      activeName: "first",
      // 搜索信息
      searchInfo: {
        // 单曲
        songs: [],
        // 歌手
        singer: [],
        // 专辑
        albums: [],
        // 视频
        mv: [],
        // 歌词
        lrc: [],
      },
    };
  },
  created() {
    // 刷新获取信息
    this.getSongsRef();
    // 点击搜索获取搜索信息
    this.$bus.$on("getResultRef", async () => {
      if (this.activeName === "first") {
        this.getSongsRef();
      } else if (this.activeName === "second") {
        this.getSingerRef();
      } else if (this.activeName === "third") {
        this.getAlbumsRef();
      }else if(this.activeName === "fourth"){
        this.getMvRef();
      }else if(this.activeName === "six"){
        this.getLrcRef();
      }
    });
  },
  methods: {
    // 刷新获取信息
    async getSongsRef() {
      this.queryInfo.type = 1;
      this.queryInfo.keywords = this.$store.state.searchValue;
      const { data: res } = await getResult(this.queryInfo);
      if (res.code !== 200) {
        return this.$message.error("搜索失败");
      }
      let result = res.result.songs;
      // 对返回的文本处理 高亮关键字
      this.handleText(result);
      this.searchInfo.songs = result;
    },
    // 处理文本 高亮关键字
    handleText(textInfo) {
      textInfo.forEach((item) => {
        item.name = item.name.replace(
          `${this.$store.state.searchValue}`,
          `<i style='color: #0C73C2'>${this.$store.state.searchValue}</i>`
        );
        item.ar.forEach((item2) => {
          item2.name = item2.name.replace(
            `${this.$store.state.searchValue}`,
            `<i style='color: #0C73C2'>${this.$store.state.searchValue}</i>`
          );
        });
        item.al.name =
          "《" +
          item.al.name.replace(
            `${this.$store.state.searchValue}`,
            `<i style='color: #0C73C2'>${this.$store.state.searchValue}</i>`
          ) +
          "》";
      });
    },
    ...mapMutations([
      "musicUrlMutations",
      "SongIdMutations",
      "singerIdMutations",
      "albumIdMutations",
      "mvIdMutations",
    ]),
    ...mapActions(["getSongsDetActions"]),
    // 点击播放图标 播放歌曲
    saveAudio(id) {
      // 存储当前音乐 id
      this.musicUrlMutations(id);
      // 获取播放音乐详情
      this.getSongsDetActions(id);
      // console.log(res.data)
      // 通过事件总线触发播放条的 播放事件
      this.$bus.$emit("onPlay");
    },
    // 点击歌曲 存储歌曲 id 并跳转至歌曲详情
    getSongId(id) {
      this.SongIdMutations(id);
      this.$router.push("/songs/detail");
    },
    // 点击歌手 存储歌手 id 并跳转至歌手详情
    getSingerId(id) {
      this.singerIdMutations(id);
      this.$router.push("/singer/detail");
    },
    // 点击专辑跳转至专辑详情页面
    toggleNewSongInfo(id) {
      this.$router.push("/newSongInfo");
      this.albumIdMutations(id);
      // console.log(id)
    },
    // 点击 mv 按钮跳转至 mv 详情
    saveMvId(id) {
      this.mvIdMutations(id);
      this.$router.push("/mvdet");
    },
    // 点击面板菜单事件
    handleClick() {
      // console.log(this.$refs.tabsRef.currentName);
      if (this.$refs.tabsRef.currentName === "first") {
        this.activeName = "first";
        this.getSongsRef();
      } else if (this.$refs.tabsRef.currentName === "second") {
        this.activeName = "second";
        this.getSingerRef();
      } else if (this.$refs.tabsRef.currentName === "third") {
        this.activeName = "third";
        this.getAlbumsRef();
      } else if (this.$refs.tabsRef.currentName === "fourth") {
        this.activeName = "fourth";
        this.getMvRef();
      } else if (this.$refs.tabsRef.currentName === "five") {
        this.activeName = "five";
        this.getLrcRef();
      }
    },
    // 获取歌手信息
    async getSingerRef() {
      this.queryInfo.type = 100;
      this.queryInfo.keywords = this.$store.state.searchValue;
      const { data: res } = await getResult(this.queryInfo);
      //   console.log(res);
      if (res.code !== 200) {
        return this.$message.error("搜索失败");
      }
      // 处理数据
      let result = res.result.artists;
      result.forEach((item) => {
        item.name = item.name.replace(
          `${this.$store.state.searchValue}`,
          `<i style='color: #0C73C2'>${this.$store.state.searchValue}</i>`
        );
      });
      this.searchInfo.singer = result;
    },
    // 获取专辑信息
    async getAlbumsRef() {
      this.queryInfo.type = 10;
      this.queryInfo.keywords = this.$store.state.searchValue;
      const { data: res } = await getResult(this.queryInfo);
      console.log(res);
      if (res.code !== 200) {
        return this.$message.error("搜索失败");
      }
      // 处理数据
      let result = res.result.albums;
      result.forEach((item) => {
        item.name = item.name.replace(
          `${this.$store.state.searchValue}`,
          `<i style='color: #0C73C2'>${this.$store.state.searchValue}</i>`
        );
        item.artist.name = item.artist.name.replace(
          `${this.$store.state.searchValue}`,
          `<i style='color: #0C73C2'>${this.$store.state.searchValue}</i>`
        );
      });
      this.searchInfo.albums = result;
    },

    // 获取视频信息
    async getMvRef() {
      this.queryInfo.type = 1004;
      this.queryInfo.keywords = this.$store.state.searchValue;
      const { data: res } = await getResult(this.queryInfo);
      console.log(res);
      if (res.code !== 200) {
        return this.$message.error("搜索失败");
      }
      // 处理数据
      let result = res.result.mvs;
      result.forEach((item) => {
        item.name = item.name.replace(
          `${this.$store.state.searchValue}`,
          `<i style='color: #0C73C2'>${this.$store.state.searchValue}</i>`
        );
        item.artists.forEach((item) => {
          item.name = item.name.replace(
            `${this.$store.state.searchValue}`,
            `<i style='color: #0C73C2'>${this.$store.state.searchValue}</i>`
          );
        });
      });
      this.searchInfo.mv = result;
    },
    // 获取歌词
    async getLrcRef() {
      this.queryInfo.type = 1006;
      this.queryInfo.keywords = this.$store.state.searchValue;
      const { data: res } = await getResult(this.queryInfo);
      console.log(res);
      if (res.code !== 200) {
        return this.$message.error("搜索失败");
      }
      this.searchInfo.lrc = res.result.songs;
    },
  },
  components: {
    Search,
    newSongInfo,
  },
};
</script>
    
<style lang='less' scoped>
.el-card {
  min-height: 600px;
}
.search-p {
  margin: 30px 0;
}
.el-table-column {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.icon-bofang {
  margin: 0 5px;
  &:hover {
    color: #333;
    cursor: pointer;
    font-weight: 600;
  }
}
.song-name {
  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
}
.singer-name {
  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
}
.al-name:hover {
  text-decoration: underline;
  cursor: pointer;
}
.singer-wrop {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  li {
    margin: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 164px;
    a {
      width: 140px;
      height: 140px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    p:hover {
      text-decoration: underline;
      cursor: pointer;
    }
  }
}

.album-ul {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.album-ul li {
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
.mask {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 99999;
  width: 153px;
  height: 130px;

  background: url("../../../assets/coverall.png") no-repeat;
  background-position: 0 -845px;
  // background-color: #666;
}
.mv-ul {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  li {
    margin: 30px;
    width: 159px;
    a {
      position: relative;
      display: block;
      width: 159px;
      height: 90px;
      img {
        width: 100%;
        height: 100%;
      }
      i {
        position: absolute;
        right: 0;
        top: 0;
        color: #fff;
        line-height: 1.5;
        background-color: rgba(rgb(156, 156, 156), 0.5);
      }
    }
    p {
      margin: 10px 0;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      span:hover {
        cursor: pointer;
        text-decoration: underline;
      }
    }
    .mvtitle:hover {
      cursor: pointer;
      text-decoration: underline;
    }
  }
}
.expan-lrc {
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 2;
}
</style>