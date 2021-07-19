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
            <p v-for="(item, index) in lrcInfo" :key="index">
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
      // 控制歌词播放
      // playLrc: false
    };
  },
  created() {
    //  当前歌曲名
    getSongsDet(this.$store.state.musicUrl.id).then((res) => {
      this.currentName = res.data.songs[0].name;
    });
    this.getPlayMusicLrc();
    this.getPlayMusicList();
    // 播放条点击播放传递的事件
    this.$bus.$on("onPlayLrc", () => {
      // 获取滑块元素
      let slide = document.querySelector(".s-scorll-r");

      // 整个歌词高度
      let lrcHeight = 35 * this.lrcInfo.length;
      // 滚动条高度
      let slideHeight = (260 / lrcHeight) * 260 + "px";
      // 限定滑块的最小值
      if (slideHeight <= "10px") {
        slideHeight = "10px";
      }
      // 如果长度大于 1 没有歌曲 则隐藏滑块
      if (260 / lrcHeight >= 1) {
        slide.style.display = "none";
      }
      // 设置滑块高度
      slide.style.height = slideHeight;

      // this.lrcInfo.forEach(item => {

      // })
    });
  },
  mounted() {
    // 获取歌词容器
    let lrcWrop = document.querySelector(".lrc");
    // 获取滑块
    let slide = document.querySelector('.s-scorll-r')
    // 获取歌词元素
    let lrc = document.querySelector('.lrc_c')
    // 获取歌词高度
    let lrcHeight = 35 * document.querySelector('.lrc_c p').clientHeight
    // 滑块滚动增量
    let y = 0;
    // 监听 鼠标滚轮事件
    lrcWrop.addEventListener("mousewheel", (e) => {
      console.log(e);
      // 如果滑块向下滚动
      if (e.wheelDeltaY < 0) {
        // 每次滚动 10 px
        y += 10;
      } else if (e.wheelDeltaY > 0) {
        // 如果滑块向上滚动
        y -= 10;
      }
      // 限制滚动范围
      if(y <= 0){
        y = 0
      }
      if(y > lrcWrop.clientHeight - slide.clientHeight){
        y = lrcWrop.clientHeight - slide.clientHeight
      }
      // 滑块滚动位置
      slide.style.top = y +'px'
      // 歌词变化位置
      lrc.style.top = -y / lrcWrop.clientHeight * lrcHeight + 'px'
      console.log(lrc.clientHeight)
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
      // 歌词信息处理
      this.lrcInfo = res.lrc.lyric.split("\n").map((item) => {
        return {
          duration: item.slice(1, 3) * 60 + +item.slice(4, 10),
          lrc: item.slice(11),
        };
      });
      // console.log(this.lrcInfo)
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
    p {
      line-height: 35px;
      text-align: center;
      height: auto;
      min-height: 35px;
      font-size: 14px;
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
</style>