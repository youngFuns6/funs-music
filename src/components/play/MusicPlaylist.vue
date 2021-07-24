<template>
  <div>
    <div class="g_playlist">
      <div class="g_header">
        <div class="header-l">
          <span>播放列表{{ playMusicList.length }}</span>
          <span
            ><i class="iconfont icon-shanchu" @click="clearList"></i>
            <i @click="clearList">清除</i></span
          >
        </div>
        <div class="header-r">
          <span>{{ currentName }}</span>
          <span @click="close">×</span>
        </div>
      </div>
      <div class="g_content">
        <!-- 歌曲列表展示 -->
        <ul>
          <li
            v-for="item1 in playMusicList"
            :key="item1.id"
            :class="[item1.id == $store.state.musicUrl.id ? 'add-class' : '']"
          >
            <!-- 歌曲名 -->
            <span class="s_name" @click="clickPlaySong(item1.id)">{{
              item1.name
            }}</span>
            <div class="d_box">
              <div class="d_con">
                <!-- 歌手名 -->
                <span
                  class="e_name"
                  v-for="(item2, index) in item1.ar"
                  :key="item2.id"
                  :title="item2.name"
                  @click="savesingerId(item2.id)"
                >
                  {{ item2.name }}
                  <i>{{ index === item1.ar.length - 1 ? "" : "/" }}</i>
                </span>
              </div>
              <span class="s_time">{{ item1.dt | secondFormate }}</span>
            </div>
          </li>
        </ul>
        <!-- 歌词展示 -->
        <div class="lrc">
          <div class="lrc_c">
            <p
              v-for="(item, index) in lrcInfo"
              :key="index"
              :class="[active === index ? 'lineLight' : '']"
              ref="lrcRef"
              :data-index="index"
            >
              {{ item.lrc }}
            </p>
          </div>
          <div class="scroll-r">
            <div class="s-scorll-r"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
    
<script>
import { getSongsDet, getLyric } from "../../network/Sing"; // 歌曲详情 网络请求
import { handlerSlide, handlerLrcSco } from "../../utils/lrcHandler"; // 引入滑块相关处理函数
import { mapActions, mapMutations } from "vuex";
export default {
  name: "MusicPlaylist",
  props: {
    // 歌曲时长
    duration: null,
  },
  data() {
    return {
      musicUrl: this.$store.state.musicUrl,
      // 当前歌曲名
      currentName: "",
      // 音乐播放列表
      playMusicList: [],
      // 歌词
      lrcInfo: [
        {
          // 每段歌词时间
          duration: "",
          // 每段歌词
          lrc: "",
        },
      ],
      // 当前歌词行高亮类名
      active: 0,
      // 当前歌曲时间
      currentTime: null,
    };
  },
  mounted() {
      this.$bus.$on("currentTime", (value) => {
          // console.log(value);
          // 保存当前歌曲时间
          this.currentTime = value;
          // this.playTime = value;
          // 存储每次循环满足歌词时间小于当前时间的 index
          let arr = [];
          this.lrcInfo.forEach((item, index) => {
            // 如果歌词时间小于等于播放时间 则当前行高亮
            if (parseInt(item.duration) <= value) {
              arr.push(index);

              //   数组最后一个 为当前高亮行
              this.active = arr[arr.length - 1];
              // console.log(arr);
            }
            // 判断播放歌曲是否结束 重置歌词及滑块位置
            // console.log(this.duration)
            // console.log(this.currentTime)
            if (this.duration == this.currentTime) {
              // console.log('666')
              document.querySelector(".s-scorll-r").style.top = 0
              document.querySelector(".lrc_c").style.top = 0;
            }
          });
        });
  },
  created() {
    // console.log(this.$store.state.musicUrl)
    //  当前歌曲名
    if (this.$store.state.musicUrl.id !== "") {
      getSongsDet(this.$store.state.musicUrl.id).then((res) => {
        this.currentName = res.data.songs[0].name;
      });
      this.getPlayMusicLrc();
      this.getPlayMusicList();
    }

    // 点击其余页面加入歌曲按钮 更新播放列表
    this.$bus.$on("addMusic", () => {
      // console.log('999')
      this.getPlayMusicList();
    });
  },
  watch: {
    musicUrl: {
      handler() {
        // 监听歌曲切换时更新页面信息
        this.getPlayMusicLrc();
        getSongsDet(this.$store.state.musicUrl.id).then((res) => {
          this.currentName = res.data.songs[0].name;
        });
        this.getPlayMusicList();
      },
      deep: true,
      // immediate: true,
    },
    lrcInfo: {
      // 监听歌词变化 处理滑块高度 歌词滚动
      handler() {
        // 获取歌词元素
        let lrc = document.querySelector(".lrc_c");

        // 获取歌词容器
        let lrcWrop = document.querySelector(".lrc");

        // let lrcHeight = this.lrcInfo.length * 35
        // 无法保证每个 p 元素高度都为 35 所以通过鼠标滚动函数回调拿到歌词实际高度

        // 获取滑块元素
        let slide = document.querySelector(".s-scorll-r");
        // 整个歌词高度
        // let lrcHeight = 0
        // 歌词容器高度
        let wropHeight = 260;
        // console.log(wropHeight);

        // 歌词滚动处理函数
        handlerLrcSco(lrcWrop, slide, lrc, callback);
        // 拿到滚动函数 传的参数  此方法有个小 bug 滑块高度 滚动时会有一个偏差
        function callback(value) {
          // 动态设置滑块高度 函数
          handlerSlide(slide, value, wropHeight);
        }
      },
      deep: true,
      // immediate: true
    },
    active: {
      // 监听歌词变化 实现歌词自动滚动
      handler() {
        // console.log(this.duration)
        if (this.active >= 3 && this.active <= this.lrcInfo.length - 2) {
          let slide = document.querySelector(".s-scorll-r");
          // 整个歌词高度
          let lrcHeight = document.querySelector(".lrc_c").clientHeight;
          // 歌词容器高度
          let wropHeight = 260;
          // 设置滑块高度
          handlerSlide(slide, lrcHeight, wropHeight);
          // console.log(lrcHeight)
          // 歌词每次上移 35px
          document.querySelector(".lrc_c").style.top =
            -35 * (this.active - 3) + "px";
          // 歌词上移 35px 滑块需下移 35/lrcHeight * 260
          slide.style.top = (35 / lrcHeight) * 240 * (this.active - 3) + "px";
        }
      },
    },
  },
  methods: {
    // 点击叉号关闭列表
    close() {
      this.$emit("closeDialog");
    },
    // 获取播放列表
    async getPlayMusicList() {
      // 从本地获取音乐 id 发送请求
      const { data: res } = await getSongsDet(
        this.$store.state.musicPlayListId.join(",")
      );
      // console.log(res);
      // if (res.code !== 200) {
      //   return this.$message.error("获取音乐播放列表失败");
      // }
      this.playMusicList = res.songs;
    },
    // 获取歌词
    async getPlayMusicLrc() {
      const { data: res } = await getLyric(this.$store.state.musicUrl.id);
      // console.log(res);
      if (res.code !== 200) {
        return this.$message.error("获取歌词失败");
      }
      // console.log(res.lrc)
      // 判断歌词列表中是否有歌词 没有则清空列表
      if (!res.lrc) {
        this.lrcInfo.lrc = [];
      } else {
        // 歌词信息处理
        this.lrcInfo = res.lrc.lyric.split("\n").map((item, index) => {
          // 判断 item 是否为最后一项  因为最后一项时间为空 处理会报错
          if (index < res.lrc.lyric.split("\n").length - 1) {
            return {
              // duration: item.slice(0, 11),
              // 时间处理成秒
              // duration: item.slice(1, 3) * 60 + +item.slice(4, 10),
              // 用正则匹配出时间 转换成秒
              duration:
                item.match(/^\[+([0-5][0-9]):([0-5][0-9]\.[0-9][0-9]+)\]/)[1] *
                  60 +
                +item.match(/^\[+([0-5][0-9]):([0-5][0-9]\.[0-9][0-9]+)\]/)[2],

              lrc: item
                .split(/\s*\n*\[.*?\]\s*/)
                .filter((v) => !!v)
                .join(""),
            };
          } else {
            return {
              duration: null,
              lrc: "",
            };
          }
        });
        // console.log(this.lrcInfo);
      }
    },
    ...mapMutations([
      "musicUrlMutations",
      "singerIdMutations",
      "clearPlaylist",
    ]),
    // 点击播放列表歌曲名
    clickPlaySong(id) {
      // 存储当前音乐 id
      this.musicUrlMutations(id);
      // 通过事件总线触发播放条的 播放事件
      this.$bus.$emit("onPlay");
    },
    // 点击歌手名 跳转至歌手详情
    savesingerId(id) {
      // 关闭播放列表
      this.$emit("closeDialog");
      this.singerIdMutations(id);
      window.sessionStorage.setItem("songId", JSON.stringify(id));
      this.$router.push("/singer/detail");
    },
    // 点击清空 清除列表
    clearList() {
      // console.log('666')
      // 清空数据
      this.clearPlaylist();
      window.localStorage.removeItem("musicPlayListId");
      window.localStorage.removeItem("musicUrl");
      // 刷新列表
      this.playMusicList = [];
    },
  },
};
</script>
    
<style lang='less' scoped>
.g_playlist {
  width: 986px;
  height: 301px;
  //   background-color: #ccc;
  .g_header {
    display: flex;
    background-color: #1b1b1b;
  }
  .header-l {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 553px;
    height: 41px;
  }
  .header-l span:first-child {
    margin-left: 20px;
    color: #fff;
  }
  .header-l span:last-child {
    margin-right: 20px;
    color: #7e7e7e;
    i:hover {
      color: #fff;
      cursor: pointer;
    }
    i:last-child:hover {
      text-decoration: underline;
      cursor: pointer;
    }
  }
  .header-r {
    position: relative;
    width: 433px;
    line-height: 41px;
    text-align: center;
    color: #fff;
    span:last-child {
      position: absolute;
      right: 20px;
      font-size: 26px;
      color: #7e7e7e;
      &:hover {
        cursor: pointer;
        color: #666;
      }
    }
  }
}
.g_content ul {
  float: left;
  width: 553px;
  height: 260px;
  border-right: 6px solid #0f1011;
  box-sizing: border-box;
  background-color: #1a1b1c;
  overflow: auto;

  li {
    display: flex;
    justify-content: space-between;
    padding: 10px 20px;
    font-size: 14px;
    color: #7e7e7e;
    &:hover {
      background-color: #0f0f0f;
      cursor: pointer;
      color: #fff;
      .d_box,
      .d_con,
      .e_name,
      .s_time {
        color: #fff;
      }
    }

    .d_box {
      display: flex;
      justify-content: space-between;
    }
    .d_con {
      width: 90px;
      margin: 0 20px;

      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      span:hover {
        text-decoration: underline;
      }
    }

    // .e_name {

    //   i:hover {
    //     text-decoration: underline;
    //     cursor: pointer;
    //     color: #fff;
    //   }
    // }
    .s_time {
      margin-left: 30px;
      // color: #7e7e7e;
      // &:hover {
      //   color: #fff;
      //   cursor: pointer;
      // }
    }
  }
}
.lrc {
  position: relative;
  float: left;
  width: 433px;
  height: 260px;
  overflow: hidden;
  background-color: #1e1f21;
  .lrc_c {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    margin: 20px 0;
    color: #7e7e7e;
    transition: all 0.7s linear;
    // height: 260px;
    p {
      line-height: 35px;
      text-align: center;
      width: 400px;
      min-height: 35px;
      font-size: 14px;
      transition: all 0.2s;
    }
  }

  .scroll-r {
    position: absolute;
    top: 0;
    right: 2px;
    height: 260px;
    width: 6px;
    background-color: #000;
    opacity: 0.5;
    .s-scorll-r {
      position: absolute;
      top: 0;
      right: 0;
      width: 4px;
      height: 50px;
      opacity: 0.8;
      border-radius: 5px;
      margin: 0;
      // cursor: pointer;
      background: #868686;
      border: 1px solid #a6a6a6;
    }
  }
}

.add-class {
  background-color: #0f0f0f !important;
  color: #fff !important;
}
.lineLight {
  color: #fff !important;
  font-size: 16px !important;
}
</style>