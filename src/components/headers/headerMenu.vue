<template>
  <div>
    <div class="container">
      <el-row>
        <!-- logo -->
        <el-col :span="4" :offset="2" class="col1">
          <h1 class="logo">
            <a href="/">funsMusic</a>
          </h1>
        </el-col>
        <!-- 菜单栏 -->
        <el-col :span="8">
          <el-menu
            :default-active="this.$store.state.activeIndex"
            mode="horizontal"
            background-color="#545c64"
            text-color="#DFDFDF"
            active-text-color="#fff"
            @select="setActiveIndex"
          >
            <el-menu-item index="/home"
              ><router-link to="/home" tag="div" class="link-div"
                >发现音乐</router-link
              ></el-menu-item
            >
            <el-menu-item index="/mymusic"
              ><router-link to="/mymusic" tag="div" class="link-div"
                >我的音乐</router-link
              ></el-menu-item
            >
            <el-menu-item index="/singer"
              ><router-link to="/singer" tag="div" class="link-div"
                >歌手</router-link
              ></el-menu-item
            >
            <el-menu-item index="/singlist"
              ><router-link to="/singlist" tag="div" class="link-div"
                >歌单</router-link
              ></el-menu-item
            >
            <el-menu-item index="/rank"
              ><router-link to="/rank" tag="div" class="link-div"
                >排行</router-link
              ></el-menu-item
            >
          </el-menu>
        </el-col>
        <!-- 搜索登录 -->
        <el-col :span="8" class="colInput">
          <search></search>
          <div class="login" @click="login" v-if="isAvatar">登录</div>
          <div class="avatar" v-else @mouseover="showUserInfo">
            <img :src="avatarUrl" alt="" />
            <span>{{ nickName }}</span>

            <!-- 用户信息 -->
            <keep-alive>
              <user-info>
                <template #level>
                  我的等级是：<span class="infoFont"
                    >{{ userInfoObj.level }}级</span
                  >
                </template>
                <template #listenSongs>
                  已听歌曲数量：<span class="infoFont"
                    >{{ userInfoObj.listenSongs }}首</span
                  >
                </template>
                <template #createDays>
                  使用天数：<span class="infoFont"
                    >{{ userInfoObj.createDays }}天</span
                  >
                </template>
              </user-info>
            </keep-alive>
          </div>
          <el-button type="primary" size="mini" @click="quit" v-show="isButton"
            >退出</el-button
          >
        </el-col>
      </el-row>
    </div>

    <!--  发现音乐 我的音乐 歌手 歌单 MV -->

    <router-view @emitLogin="ctrLogin"></router-view>

    <!-- 底部链接 -->

    <div class="mylink" v-show="$route.path === '/login' ? false : true ">
      <a href="https://github.com/youngFuns6/funs-music">
        <i class="iconfont icon-github"></i>
        <i>github 地址</i>
      </a>
      <a href="">
        <i class="iconfont icon-git"> </i>
        <i>gitee 地址</i>
      </a>
    </div>

    <!-- 登录对话框 -->
    <login-dialog
      v-show="isShow"
      ref="loginRef"
      :ctrIsShow="isShow"
      @ctrClose="ctrClosed"
      @ctrLoginBtn="ctrLogin"
    ></login-dialog>

    <!-- 播放控件 -->
    <play-bar v-show="PlayBarIsShow" class="play-bar"></play-bar>
  </div>
</template>
    
<script>
import LoginDialog from "./login/Login.vue"; // 导入登录框组件
import Search from "../headers/serach/Search.vue"; // 导入搜索框组件
import userInfo from "./userInfo/userInfo.vue"; // 导入用户详情信息组件
import { getUserInfo, getQuit } from "../../network/login"; // 用户详情信息 网络请求
import newSongInfo from "../../views/homeChildren/newSongInfo.vue"; // 新碟详情组件
import PlayBar from "../play/PlayBar.vue"; // 引入播放控件
import { removeCookie } from "../../utils/cookie";

export default {
  name: "headerMenu",
  data() {
    return {
      isShow: false, // 登录弹框显示与隐藏
      // 是否显示登录后头像
      isAvatar: true,
      // 头像地址
      avatarUrl: "",
      // 用户昵称
      nickName: "",
      // 用户详情
      userInfoObj: {
        level: 0,
        listenSongs: null,
        createDays: null,
      },
      // 退出按钮隐藏与显示
      isButton: false,
      // 播放控件 显示与隐藏
      PlayBarIsShow: true,
    };
  },

  created() {
    this.isLogin();
  },

  methods: {
    // 刷新页面判断用户是否登录
    isLogin() {
      // console.log(this.$store.state.profile == null);
      if (this.$store.state.profile === null) {
        return;
      } else {
        this.isAvatar = false;
        this.isButton = true;
        this.avatarUrl = this.$store.state.profile.avatarUrl;
        this.nickName = this.$store.state.profile.nickName;
        // console.log(this.$store.state.profile.nickName);
      }
    },
    // 点击登录显示 登录框
    login() {
      this.isShow = true;

      // console.log(this.isShow)
    },
    // 登录框 叉号 事件
    ctrClosed() {
      this.isShow = false;
      this.isAvatar = true;
      this.isButton = false;
    },
    // 登录框 登陆事件
    ctrLogin() {
      this.isShow = false;
      this.isAvatar = false;
      this.isButton = true;
      this.avatarUrl = this.$store.state.profile.avatarUrl;
      this.nickName = this.$store.state.profile.nickName;
    },

    // 鼠标经过展示用户信息下拉框
    async showUserInfo() {
      if (this.userInfoObj.level === 0) {
        const { data: res } = await getUserInfo(
          this.$store.state.profile.userId
        );
        // console.log(res)

        this.userInfoObj.level = res.level;
        this.userInfoObj.listenSongs = res.listenSongs;
        this.userInfoObj.createDays = res.createDays;
      }
    },

    // 点击按钮退出登录
    async quit() {
      const { data: res } = await getQuit();
      // console.log(res)
      if (res.code === 200) {
        this.$message.info("已退出登录");
        // 退出登录 清空状态及本地数据
        this.isAvatar = true;
        this.isButton = false;

        window.sessionStorage.removeItem("profile");
        // console.log(window.sessionStorage.getItem("profile"));
        removeCookie("__remember_me");
        if (this.$route.path === "/mymusic") {
          // 退出登录跳转至 home
          this.$router.push("/home");
          window.sessionStorage.setItem("activeIndex", "/home");
          this.$store.state.activeIndex = "/home";
        }
      }
    },

    // 改变页面 activeIndex
    setActiveIndex(index) {
      this.$store.state.activeIndex = index;
      // 将 activeIndex 保存至本地
      window.sessionStorage.setItem("activeIndex", index);
    },
  },

  components: {
    LoginDialog,
    userInfo,
    Search,
    newSongInfo,
    PlayBar,
  },
};
</script>
    
<style lang='less' scoped>
.container {
  height: 69px;
  background-color: #545c64;
  height: 100%;
}

h1 {
  width: 176px;
  background: url(../../assets/spring/1.png) no-repeat;
  a {
    display: block;
    height: 69px;
    width: 157px;
    font-size: 0;
  }
}

.el-menu {
  border-bottom: none;
}

.el-menu-item {
  padding: 0 30px;
  height: 69px;
  line-height: 69px;
}

.el-input {
  width: 300px;
}

.colInput {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 69px;
  .login {
    margin: 0 30px;
    &:hover {
      color: #fff;
      cursor: pointer;
    }
  }
}

.avatar img {
  margin-left: 20px;
  width: 50px;
  border-radius: 50%;
  cursor: pointer;
  // vertical-align: middle;
}
.avatar span {
  float: right;
  margin-left: 5px;
  height: 50px;
  line-height: 50px;
  font-size: 16px;
  color: #d6dfd7;

  &:hover {
    color: #fff;
    text-decoration-line: underline;
  }
}

.infoFont {
  font-size: 20px;
}
.el-menu-item {
  padding: 0;
  .link-div {
    padding: 0 30px;
    user-select: none;
  }
}

.userInfoBox {
  display: none;
}

.avatar:hover .userInfoBox {
  display: block;
}

.el-button {
  margin-left: 20px;
}

.play-bar {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 99999;
}
.mylink {
  width: 100%;
  height: 100px;
  margin-top: 60px;
  padding-bottom: 30px;
  border-top: 1px solid #666;
  background-color: #98d6ce;
  display: flex;
  flex-direction: column;
  a {
    display: flex;
    align-items: center;
    margin: 20px 0 0 120px;
    text-decoration: none;
    color: #666;
    font-size: 20px;
    i:first-child {
      font-size: 30px;
      margin-right: 10px;
    }
    i:last-child {
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>