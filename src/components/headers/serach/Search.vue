<template>
  <div>
    <div class="location">
      <el-input
        placeholder="请输入内容"
        v-model="inputValue"
        @input="keyValue($event, cb)"
        @focus="focusStatus"
        @blur="blurStatus"
        ref="searchInputRef"
        @keydown.enter.native="SearchResult"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="SearchResult"
        ></el-button>
      </el-input>

      <!-- 提示框 -->
      <div class="tipBox" v-show="isShow">
        <div class="sing">
          <p>歌曲</p>
          <ul>
            <li
              v-for="item in tipInfo.song"
              :key="item.id"
              @click="getSongId(item.id)"
            >
              {{ item.name }}
            </li>
          </ul>
        </div>
        <div class="singer">
          <p>歌手</p>
          <ul>
            <li
              v-for="(item, index) in tipInfo.singer"
              :key="index"
              class="border-line"
              @click="getSingerId(item.id)"
            >
              {{ item.name }}
            </li>
          </ul>
        </div>
        <div class="sing-list">
          <p>专辑</p>
          <ul>
            <li
              v-for="item in tipInfo.singList"
              :key="item.id"
              @click="toggleNewSongInfo(item.id)"
            >
              {{ item.name }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
    
<script>
import { getTips } from "../../../network/serchTips"; // 搜索提示 网络请求
import { mapMutations } from "vuex";
export default {
  name: "search",
  data() {
    return {
      // 用户输入信息
      inputValue: '',
      // 提示信息
      tipInfo: {
        song: [],
        singer: [],
        singList: [],
      },
      // 是否显示隐藏输入框
      isShow: false,
    };
  },
  methods: {
    ...mapMutations([
      "searchValueMutations",
      "SongIdMutations",
      "singerIdMutations",
      "albumIdMutations",
    ]),
    // 搜索建议提示
    async cb() {
      // 判断输入有意义的值再进行搜索
      if (this.inputValue.match(/^\S/) || this.inputValue.match(/^\s\s*\S+/)) {
        const { data: res } = await getTips(this.inputValue.trim());
        // console.log(res);
        this.tipInfo.song = res.result.songs;
        this.tipInfo.singer = res.result.artists;
        this.tipInfo.singList = res.result.albums;
        this.isShow = true;
      } else {
        this.isShow = false;
        // console.log('666')
      }
    },

    // 监听 input 值改变事件
    keyValue(e, cb) {
      cb();
      // 存储输入框聚焦状态
      // console.log(this.$refs.inputRef);
      // console.log(document.activeElement);
    },

    // 监听 input 聚焦事件
    focusStatus() {
      if (this.inputValue) this.isShow = true;
      this.cb();
    },

    // 监听失焦事件
    blurStatus() {
      // 利用定时器延迟搜索框关闭 让其在跳转发生之后
      setTimeout(() => {
        this.isShow = false;
        // console.log('88')
      }, 100);
      
    },

    // 按下 enter 搜索
    SearchResult() {
      this.isShow = false;
      this.$refs.searchInputRef.blur();
      if (this.inputValue.match(/^\S/) || this.inputValue.match(/^\s\s*\S+/)) {
        // console.log("6666");
        // 储存搜索信息
        this.searchValueMutations(this.inputValue);
        this.$bus.$emit("getResultRef");
        // 如果已经在搜索结果页 则不进行跳转
        if (this.$route.path !== "/search/result") {
          this.$router.push("/search/result");
        }
      }
    },
    // 点击歌曲 存储歌曲 id 并跳转至歌曲详情
    getSongId(id) {
      // console.log('666')
      this.isShow = false;
      this.SongIdMutations(id);
      if (this.$route.path !== "/songs/detail") {
        this.$router.push("/songs/detail");
      } else {
        this.$router.go(0);
      }
    },
    // 点击歌手 存储歌手 id 并跳转至歌手详情
    getSingerId(id) {
      this.isShow = false;
      this.singerIdMutations(id);
      if (this.$route.path !== "/singer/detail") {
        this.$router.push("/singer/detail");
      } else {
        this.$router.go(0);
      }
    },
    // 点击专辑跳转至专辑详情页面
    toggleNewSongInfo(id) {
      this.isShow = false;
      if (this.$route.path !== "/newSongInfo") {
        this.$router.push("/newSongInfo");
      } else {
        this.$router.go(0);
      }
      this.albumIdMutations(id);
      // console.log(id)
    },
  },
};
</script>
    
<style lang='less' scoped>
.location {
  position: relative;
}

.tipBox {
  position: absolute;
  left: 0;
  top: 60px;
  z-index: 11111;
  border: 1px solid #bebebe;
  box-shadow: 0 4px 7px #555;
  border-radius: 5px;
  width: 100%;
  background-color: #fff;

  .sing,
  .singer,
  .sing-list {
    display: flex;
    p {
      flex: 1;
      width: 52px;
      padding: 10px 20px;
      font-size: 14px;
      cursor: text;
    }
    ul {
      flex: 6;
      border-left: 1px solid #e2e2e2;
      li {
        width: 100%;
        box-sizing: border-box;
        padding: 10px 20px;
        font-size: 14px;
        cursor: pointer;
        &:hover {
          background-color: rgb(197, 196, 196);
        }
      }
    }
  }

  .singer ul {
    border-bottom: 1px solid #e2e2e2;
    border-top: 1px solid #e2e2e2;
    background-color: #f9f8f8;
  }
}
</style>