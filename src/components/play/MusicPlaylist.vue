<template>
  <div>
    <div class="g_playlist">
      <div class="g_header">
        <div class="header-l">
          <span>播放列表{{ playMusicList.length }}</span>
          <span><i class="iconfont icon-shanchu"></i> <i>清除</i></span>
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
            <span class="s_name">{{ item1.name }}</span>
            <div class="d_box">
              <div class="d_con">
                <span
                  class="e_name"
                  v-for="(item2, index) in item1.ar"
                  :key="item2.id"
                  :title="item2.name"
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
import { handlerSlide, handlerLrcSco, lrcscroll } from "../../utils/lrcHandler"; // 引入滑块相关处理函数
export default {
  name: "MusicPlaylist",
  props: {},
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

      // 控制歌词播放
      // playLrc: false
    };
  },
  updated() {},
  created() {
    //  当前歌曲名
    getSongsDet(this.$store.state.musicUrl.id).then((res) => {
      this.currentName = res.data.songs[0].name;
    });
    this.getPlayMusicLrc();
    this.getPlayMusicList();
    // 播放条点击播放传递的事件
    this.$bus.$on("onPlayLrc", () => {});
  },
  mounted() {
    this.$nextTick(() => {
      // console.log(this.$refs.lrcRef.dataset.index);
      // 歌词高亮到第四行开始滚动
      if (parseInt(this.$refs.lrcRef) === 4) {
        document.querySelector("lrc_c").style.top = "-35px";
      }
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
      immediate: true,
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
        // 拿到滚动函数 回调传的参数  此方法有个小 bug 滑块高度 滚动时会有一个偏差
        function callback(value) {
          // 动态设置滑块高度 函数
          handlerSlide(slide, value, wropHeight);
        }
      },
      deep: true,
      // immediate: true
    },
    playTime: {
      handler() {
        // 实时监听当前播放时间 给当前歌词添加 高亮
        this.$bus.$on("currentTime", (value) => {
          // console.log(value);
          // this.playTime = value;
          // 存储每次循环满足歌词时间小于当前时间的 index
          let arr = [];
          this.lrcInfo.forEach((item, index) => {
            // 如果歌词时间小于等于播放时间 则当前行高亮
            if (parseInt(item.duration) <= value) {
              // console.log(index)
              arr.push(index);

              //  每首歌歌词最后一句时间为空 总会满足条件 所以数组中倒数第二个 index 为当前高亮行
              this.active = arr[arr.length - 2];
              // console.log(arr);
            }
          });
        });
      },
      immediate: true,
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
      if (res.code !== 200) {
        return this.$message.error("获取音乐播放列表失败");
      }
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
        this.lrcInfo = res.lrc.lyric.split("\n").map((item) => {
          return {
            // duration: item.slice(0, 11),
            // 时间处理成秒
            duration: item.slice(1, 3) * 60 + +item.slice(4, 10),
            lrc: item.slice(11),
          };
        });
        // console.log(this.lrcInfo);
      }
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
      height: 100px;
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