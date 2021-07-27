<template>
  <div class="wrop-plybar" @mouseenter="touchPlayBar" @mouseleave="leavePlayBar">
    <div class="r_s_wrop">
      <a href="#" class="lock" @click.prevent="lock"></a>
    </div>
    <el-row>
      <el-col :offset="2" :span="20">
        <div class="contain">
          <div class="left-p">
            <!-- 上一首 -->
            <div class="left-p-l" @click="preSong"></div>
            <!-- 播放 -->
            <div class="left-p-m" @click="playAudio"></div>
            <!-- 下一首 -->
            <div class="left-p-r" @click="nextSong"></div>
          </div>
          <div class="mid-p">
            <img :src="songsDet.al.picUrl" alt="" @click="saveSongId" />
            <div class="m_wr">
              <p>
                <!-- 歌名 -->
                <span @click="saveSongId">{{ songsDet.name }} </span>
                <i
                  class="iconfont icon-chakanMV m_wr_mv"
                  v-if="songsDet.mv"
                ></i>
                <!-- 歌手 -->
                <span class="m_wr_s_s">
                  <span
                    class="m_wr_s_i"
                    v-for="(item, index) in songsDet.ar"
                    :key="index"
                    ><i @click="saveSingerId(item.id)">{{ item.name }}</i
                    ><i>{{
                      index === songsDet.ar.length - 1 ? "" : "/"
                    }}</i></span
                  >
                </span>
              </p>
              <div class="playbar-wrop">
                <i class="loadingAn"></i>
                <!-- 播放滑块 -->
                <el-slider
                  v-model="playValue"
                  :show-tooltip="false"
                  :max="songsDet.dt / 1000"
                  @change="slideChange"
                  @mousedown="flag = true"
                  @mouseup="flag = false"
                >
                </el-slider>
                <p class="m_time">
                  <i>{{ (playValue * 1000) | secondFormate }}</i>
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
            <a @click="clickAudio">
              <!-- 声音滑块 -->
              <el-slider
                class="audio-slider"
                v-model="audioValue"
                :show-tooltip="false"
                :vertical="true"
                height="100px"
                @change="changeAudio"
                v-show="audioShow"
              ></el-slider>
            </a>
            <a
              :title="titleTip"
              class="loopStatus"
              @click="changeLoopStatus"
            ></a>
            <a title="播放列表" @click="close"
              ><i>{{ $store.state.musicPlayListId.length }}</i></a
            >
          </div>
          <!-- 播放列表 -->
          <music-playlist
            class="m-playlist"
            @closeDialog="close"
            v-show="isShow"
            :duration="duration"
          ></music-playlist>
          <!-- 音频 -->
          <audio
            :src="musicUrl"
            @loadstart="togglePlay"
            ref="audioRef"
            @timeupdate="updateTime"
            @ended="playOver"
            @waiting="loadingAn"
            :loop="isLoop"
          ></audio>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
    
<script>
import { mapMutations, mapActions } from "vuex";
import MusicPlaylist from "./MusicPlaylist.vue"; // 引入播放列表组件

export default {
  name: "PlayBar",
  data() {
    return {
      // 播放列表 显示与隐藏
      isShow: false,
      // 播放控制
      play: true,
      // 播放滑块实时数值
      playValue: 0,
      // 音频地址
      musicUrl: "",
      // 歌曲详情
      songsDet: {
        al: {},
        name: "",
        picUrl: "",
        ar: [],
      },
      // 音频时长
      duration: null,
      // 声音控制滑块显示与隐藏
      audioShow: false,
      // 声音 大小
      audioValue: 50,
      // 控制播放条小锁状态
      lockStatus: false,
      // 单曲循环状态
      isLoop: false,
      // 循环状态  0 代表列表播放  1 代表单曲循环  2 代表随机循环
      loopStatus: 0,
      // 循环图标提示
      // 循环图标提示信息
      titleTip: "列表播放",
    };
  },
  created() {
    this.getSongDet();
  },
  mounted() {
    // 让播放条在页面刷新未锁定时显示 鼠标发生滚动则未锁定就隐藏 随后立即删除滚动事件
    document.onmousewheel = () => {
      //  console.log('666')
      this.leavePlayBar();
      document.onmousewheel = null;
    };
  },
  methods: {
    ...mapMutations([
      "musicUrlMutations",
      "SongIdMutations",
      "singerIdMutations",
    ]),
    ...mapActions(["getSongsDetActions"]),
    // 点击叉号关闭列表
    close() {
      this.isShow = !this.isShow;
    },
    // 点击播放按钮 播放歌曲
    playAudio() {
      // this.condition = true;
      let songAudio = this.$refs.audioRef;
      if (this.play) {
        // 按钮变为暂停
        document.querySelector(".left-p-m").style.backgroundPosition =
          "-40px -165px";
        // 先拿到音频 url 才能进行播放
        new Promise((resolve, reject) => {
          this.musicUrl = this.$store.state.musicUrl.url;
          resolve();
          reject(err);
        })
          .then(() => {
            // 播放歌曲
            songAudio.play();
            // 更新页面歌曲信息
            this.getSongDet();
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
      if (this.$store.state.musicUrl.id !== "") {
        this.getSongsDetActions(this.$store.state.musicUrl.id);
        this.songsDet = this.$store.state.currentMusicInfo;
      }
    },

    // 播放事件
    updateTime() {
      // 如果拖动 则停止 currentTime 对 playValue 的赋值
      if (!this.flag) {
        // 获取音频时长
        this.duration = this.$refs.audioRef.duration;
        // console.log(this.duration)
        // 当前时间动态赋值给滑块
        this.playValue = this.$refs.audioRef.currentTime;
        // console.log(this.playValue)
        // 将当前歌曲时间传给 播放列表
        this.$bus.$emit("currentTime", this.$refs.audioRef.currentTime);
      }
      // 播放完毕 playValue 重置
      if (parseInt(this.playValue) === parseInt(this.$refs.audioRef.duration)) {
        this.playValue = 0;
      }
      // 顺利播放时关闭动画
      document.querySelector(".loadingAn").style.display = "none";
    },

    // 播放结束事件
    playOver() {
      document.querySelector(".left-p-m").style.backgroundPosition = "0 -204px";
      this.duration = null;
      // 判断播放状态 播放下一首歌曲
      if (this.loopStatus === 0) {
        this.nextSong();
      } else if (this.loopStatus === 2) {
        // 循环列表
        let loopList = this.$store.state.musicPlayListId;
        // 随机取得循环列表的下标
        let index = Math.floor(Math.random() * loopList.length + 1) - 1;
        // 获取播放地址信息
        this.musicUrlMutations(loopList[index]);
        // 获取播放音乐详情
        this.getSongsDetActions(loopList[index]);
        this.play = true;
        this.playAudio();
      } else if (this.loopStatus === 1) {
        this.play = true;
        this.playAudio();
      }
    },

    // 拖拽滑块事件
    slideChange(value) {
      this.$refs.audioRef.currentTime = value;
      this.playValue = value;
    },

    // 点击页面中播放按钮 切换播放
    togglePlay() {
      // console.log(this)
      // 通过时间总线拿到其他组件发送的事件
      this.$bus.$on("onPlay", () => {
        // console.log('666')
        this.playAudio();
      });
    },
    // 点击上一首 切换播放
    preSong() {
      // 播放列表歌曲数量大于等于 2 才可操作
      if (this.$store.state.musicPlayListId.length > 1) {
        // 当前歌曲不是第一首歌才可进行操作
        if (
          this.$store.state.musicUrl.id != this.$store.state.musicPlayListId[0]
        ) {
          // console.log(this.$store.state.musicUrl.id);
          // console.log(this.$store.state.musicPlayListId[0]);
          // console.log(this.$store.state.musicPlayListId.indexOf(
          //     +this.$store.state.musicUrl.id,
          //   ))
          // 上一首歌曲在播放列表的下标
          let index =
            this.$store.state.musicPlayListId.indexOf(
              this.$store.state.musicUrl.id
            ) - 1;
          this.musicUrlMutations(this.$store.state.musicPlayListId[index]);
          // 获取播放音乐详情
          this.getSongsDetActions(this.$store.state.musicPlayListId[index]);
          this.play = true;
          this.playAudio();
        }
      }
    },
    // 点击下一首 切换播放
    nextSong() {
      // 播放列表歌曲数量大于等于 2 才可操作
      if (this.$store.state.musicPlayListId.length > 1) {
        // 当前歌曲不是最后一首歌 才可进行操作
        if (
          this.$store.state.musicUrl.id !=
          this.$store.state.musicPlayListId[
            this.$store.state.musicPlayListId.length - 1
          ]
        ) {
          // 下一首歌曲在播放列表的下标
          let index =
            this.$store.state.musicPlayListId.indexOf(
              this.$store.state.musicUrl.id
            ) + 1;
          this.musicUrlMutations(this.$store.state.musicPlayListId[index]);
          // 获取播放音乐详情
          this.getSongsDetActions(this.$store.state.musicPlayListId[index]);
          this.play = true;
          this.playAudio();
        }
      }
    },
    // 点击声音按钮事件
    clickAudio() {
      // console.log('666')
      this.audioShow = !this.audioShow;
    },
    // 改变音量大小事件
    changeAudio() {
      document.querySelector("audio").volume = this.audioValue / 100;
    },
    // 点击播放条小锁事件
    lock() {
      if (this.lockStatus) {
        document.querySelector(".lock").style.backgroundPosition =
          "-80px -380px";
        this.lockStatus = false;
      } else {
        document.querySelector(".lock").style.backgroundPosition =
          "-100px -400px";
        this.lockStatus = true;
      }
    },
    // 触碰播放条显示
    touchPlayBar() {
      document.querySelector(".wrop-plybar").style.bottom = "0";
    },
    // 离开播放条事件
    leavePlayBar() {
      // console.log('666')
      // 判断小锁状态 锁住或者播放列表打开播放条则显示 否则隐藏
      if (this.lockStatus || this.isShow) {
        document.querySelector(".wrop-plybar").style.bottom = "0";
      } else {
        document.querySelector(".wrop-plybar").style.bottom = "-45px";
      }
    },
    // 点击播放条头像跳转至歌曲详情
    saveSongId() {
      if (this.$route.path !== "/songs/detail") {
        this.SongIdMutations(this.$store.state.musicUrl.id);
        this.$router.push("/songs/detail");
      } else {
        // 已处在歌曲详情页面则刷新
        this.$router.go(0);
      }
    },
    // 点击播放条歌手名跳转至歌曲详情
    saveSingerId(id) {
      this.singerIdMutations(id);
      this.$router.push("/singer/detail");
    },
    // 音频加载动画
    loadingAn() {
      // console.log('888')
      // 加载时显示动画
      document.querySelector(".loadingAn").style.display = "block";
    },
    // 单曲循环事件
    changeLoopStatus() {
      // 如果循环状态等于 0  让其变成随机循环
      if (this.loopStatus === 0) {
        // 让其循环状态变为 2
        this.loopStatus = 2;
        // 提示信息
        this.titleTip = "随机循环";
        this.isLoop = false;
        // 改变图标
        document.querySelector(".loopStatus").style.backgroundPosition =
          "-66px -248px";
      } else if (this.loopStatus === 2) {
        // 让其循环状态变为 1
        this.loopStatus = 1;
        // 提示信息
        this.titleTip = "单曲循环";
        this.isLoop = true;
        // 改变图标
        document.querySelector(".loopStatus").style.backgroundPosition =
          "-66px -344px";
      } else if ((this.loopStatus = 1)) {
        // 让其状态变为 0
        this.loopStatus = 0;
        // 提示信息
        this.titleTip = "列表播放";
        this.isLoop = false;
        // 改变图标
        document.querySelector(".loopStatus").style.backgroundPosition =
          "-3px -344px";
      }
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
  text-decoration: none;
  background: url("../../assets/playbar.png") no-repeat;
  background-position: -80px -380px;
  &:hover {
    background-position: -100px -400px;
  }
}
.wrop-plybar {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  min-width: 1510px;
  height: 53px;
  background: url("../../assets/playbar.png") repeat-x;
  transition: all 0.5s;
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
        color: #959595;
        cursor: pointer;
        &:hover {
          color: #fff;
        }
      }
      .m_wr_s_s {
        margin-left: 20px;
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
      position: relative;
      display: inline-block;
      width: 25px;
      height: 25px;
      background: url("../../assets/playbar.png") no-repeat;
      background-position: -2px -248px;
      .audio-slider {
        position: absolute;
        top: -110px;
        left: -6px;
      }
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
.playbar-wrop {
  position: relative;
  .loadingAn {
    position: absolute;
    right: 90px;
    top: 4px;
    width: 12px;
    height: 12px;
    display: none;
    background: url(../../assets/loading.gif) no-repeat;
  }
}
</style>