<template>
  <div class="wrop">
    <audio :src="musicUrl" autoplay></audio>
    <div class="r_s_wrop">
      <div class="lock"></div>
    </div>
    <el-row>
      <el-col :offset="2" :span="20">
        <div class="contain">
          <div class="left-p">
            <!-- 上一首 -->
            <div class="left-p-l"></div>
            <!-- 播放 -->
            <div class="left-p-m" @click="playAudio"></div>
            <!-- 下一首 -->
            <div class="left-p-r"></div>
          </div>
          <div class="mid-p">
            <img :src="songsDet.al.picUrl" alt="" />
            <div class="m_wr">
              <p>
                <!-- 歌名 -->
                <span>{{ songsDet.name }} </span>
                <i class="iconfont icon-chakanMV m_wr_mv"></i>
                <!-- 歌手 -->
                <span
                  class="m_wr_s_i"
                  v-for="(item, index) in songsDet.ar"
                  :key="index"
                  ><i>{{ item.name }}</i
                  ><i>{{
                    index === songsDet.ar.length - 1 ? "" : "/"
                  }}</i></span
                >
              </p>
              <div>
                <!-- 播放滑块 -->
                <el-slider
                  v-model="playValue"
                  :format-tooltip="dataFormate"
                ></el-slider>
                <p class="m_time">
                  <i>{{ playValue }}</i>
                  <i>{{ (duration * 1000) | secondFormate }}</i>
                </p>
              </div>
            </div>
          </div>
          <div class="right-p-l">
            <a title="画中画歌词"></a>
            <a title="收藏"></a>
            <a title="分享"></a>
          </div>
          <div class="right-p-r">
            <a></a>
            <a title="循环"></a>
            <a title="播放列表" @click="close"><i>3</i></a>
          </div>
          <!-- 播放列表 -->
          <music-playlist
            class="m-playlist"
            @closeDialog="close"
            v-show="isShow"
          ></music-playlist>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
    
<script>
import { mapMutations } from "vuex";
import { getSongsDet } from "../../network/Sing"; // 歌曲详情 网络请求
import MusicPlaylist from "./MusicPlaylist.vue"; // 引入播放列表组件
export default {
  name: "PlayBar",
  data() {
    return {
      // 播放列表 显示与隐藏
      isShow: false,
      // 播放控制
      play: true,
      // 播放滑块值
      playValue: 10.666,
      // 音频地址
      musicUrl: "",
      // 歌曲详情
      songsDet: {
        al: {},
      },
      // 音频时长
      duration: "",
    };
  },
  created() {
    this.getSongDet();
  },
  methods: {
    ...mapMutations(['musicUrlMutations']),
    // 格式化滑块值
    dataFormate(val) {
      return val;
    },
    // 点击叉号关闭列表
    close() {
      this.isShow = !this.isShow;
    },
    // 点击播放按钮 播放歌曲
    playAudio() {
      let songAudio = document.querySelector("audio");
      if (this.play) {
        // 按钮变为暂停
        document.querySelector(".left-p-m").style.backgroundPosition =
          "-40px -165px";
        // 先拿到 url 再执行 play 函数
        new Promise((resolve, reject) => {
          // 音乐 url
          this.musicUrl = this.$store.state.musicUrl.url;
          resolve();
          reject(err);
        })
          .then(() => {
            songAudio.play();
            // console.log(songAudio.duration)
            // 获取音频时长
            songAudio.onemptied = () => {
              this.duration = songAudio.duration;
              // songAudio.load()
            };
            this.play = false;
          })
          .catch((err) => err);
      } else {
        // 按钮变为播放
        document.querySelector(".left-p-m").style.backgroundPosition =
          "0 -204px";
        songAudio.pause();
        this.play = true;
      }
    },

    // 获取当前歌曲详情
    getSongDet() {
      // 获取到音乐 id 后才能获取到歌曲详情
      this.musicUrlMutations(JSON.parse(window.localStorage.getItem('musicUrl')).id)
      this.songsDet = this.$store.state.currentMusicInfo;
      // new Promise((resolve, reject) => {
      //   if (this.$store.state.musicUrl.id !== '') {
      //     resolve(this.$store.state.currentMusicInfo);
      //   }
      //   reject(err);
      // }).then(() => {
      //   console.log('666')
      //   // 获取歌曲 头像 歌名 歌手
      //   this.songsDet = this.$store.state.currentMusicInfo;
      //   console.log(this.songsDet);
      // }).catch(err => console.log(err));
    },
  },
  computed: {},
  components: {
    MusicPlaylist,
  },
};
</script>
    
<style lang='less' scoped>
.r_s_wrop {
  position: absolute;
  right: 20px;
  bottom: 0;
  width: 52px;
  height: 67px;
  background: url("../../assets/playbar.png") no-repeat;
  background-position: 0 -380px;
}
.lock {
  position: absolute;
  top: 6px;
  left: 17px;
  width: 18px;
  height: 18px;
  background: url("../../assets/playbar.png") no-repeat;
  background-position: -100px -380px;
  &:hover {
    background-position: -100px -400px;
    cursor: pointer;
  }
}
.wrop {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 53px;
  background: url("../../assets/playbar.png") repeat-x;
  .contain {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 47px;
    transform: translateY(6px);
  }
  .left-p {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 137px;
    .left-p-l {
      width: 28px;
      height: 28px;
      background: url("../../assets/playbar.png") no-repeat;
      background-position: 0 -130px;
      &:hover {
        background-position: -30px -130px;
        cursor: pointer;
      }
    }
    .left-p-m {
      width: 36px;
      height: 36px;
      background: url("../../assets/playbar.png") no-repeat;
      background-position: 0 -204px;
      &:hover {
        background-position: -40px -204px;
        cursor: pointer;
      }
    }
    .left-p-r {
      width: 28px;
      height: 28px;
      background: url("../../assets/playbar.png") no-repeat;
      background-position: -80px -130px;
      &:hover {
        background-position: -110px -130px;
        cursor: pointer;
      }
    }
  }
  .mid-p {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 650px;
    height: 47px;
    font-size: 14px;
    img {
      width: 34px;
      height: 35px;
      &:hover {
        cursor: pointer;
      }
    }
    p {
      margin-bottom: 5px;
    }
    p span:first-child {
      color: #d3d3d3;
      &:hover {
        text-decoration: underline;
        cursor: pointer;
      }
    }
    p span:last-child i {
      color: #959595;
      &:hover {
        text-decoration: underline;
        cursor: pointer;
      }
    }
    .m_wr {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 581px;
      height: 47px;
      margin-right: 15px;
      p .m_wr_mv {
        margin-right: 20px;
        color: #959595;
        cursor: pointer;
        &:hover {
          color: #fff;
        }
      }
      .m_wr_s_i {
        color: #959595;
        i:first-child:hover {
          cursor: pointer;
          text-decoration: underline;
        }
      }
      .el-slider {
        width: 500px;
      }
      div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .m_time i:first-child {
          color: #d3d3d3;
          margin-left: 20px;
        }
        .m_time i:last-child {
          color: #959595;
          margin-left: 10px;
        }
      }
    }
  }
  .right-p-l {
    width: 87px;
    a {
      display: inline-block;
      width: 25px;
      height: 25px;
      margin: 0 2px;
    }
    a:first-child {
      background: url("../../assets/DL.png") no-repeat;
      &:hover {
        background-position-y: -25px;
        cursor: pointer;
      }
    }
    a:nth-child(2) {
      background: url("../../assets/playbar.png") no-repeat;
      background-position: -88px -163px;
      &:hover {
        background-position: -88px -189px;
        cursor: pointer;
      }
    }
    a:last-child {
      background: url("../../assets/playbar.png") no-repeat;
      background-position: -114px -163px;
      &:hover {
        background-position: -114px -189px;
        cursor: pointer;
      }
    }
  }
  .right-p-r {
    width: 126px;
    a {
      margin: 0 2px;
    }
    a:first-child {
      display: inline-block;
      width: 25px;
      height: 25px;
      background: url("../../assets/playbar.png") no-repeat;
      background-position: -2px -248px;
      &:hover {
        background-position: -31px -248px;
        cursor: pointer;
      }
    }
    a:nth-child(2) {
      display: inline-block;
      width: 25px;
      height: 25px;
      background: url("../../assets/playbar.png") no-repeat;
      background-position: -3px -344px;
      &:hover {
        background-position: -33px -344px;
        cursor: pointer;
      }
    }
    a:last-child {
      position: relative;
      display: inline-block;
      width: 59px;
      height: 25px;
      background: url("../../assets/playbar.png") no-repeat;
      background-position: -42px -68px;
      &:hover {
        background-position: -42px -98px;
        cursor: pointer;
      }
      i {
        position: absolute;
        left: 30px;
        top: 5px;
        color: #666;
        text-shadow: 0 1px 0 #080707;
        font-size: 14px;
        user-select: none;
      }
    }
  }
}
.m-playlist {
  position: absolute;
  left: 50%;
  bottom: 47px;
  transform: translateX(-50%);
}
</style>