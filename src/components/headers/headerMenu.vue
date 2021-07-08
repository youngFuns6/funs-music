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
            :default-active="activeIndex"
            mode="horizontal"
            @select="handleSelect"
            background-color="#545c64"
            text-color="#DFDFDF"
            active-text-color="#fff"
          >
            <el-menu-item index="1"
              ><router-link to="home" tag="div" class="link-div"
                >发现音乐</router-link
              ></el-menu-item
            >
            <el-menu-item index="2"
              ><router-link to="/hottopic" tag="div" class="link-div"
                >我的音乐</router-link
              ></el-menu-item
            >
            <el-menu-item index="3"
              ><router-link to="/singer" tag="div" class="link-div"
                >歌手</router-link
              ></el-menu-item
            >
            <el-menu-item index="4"
              ><router-link to="/singlist" tag="div" class="link-div"
                >歌单</router-link
              ></el-menu-item
            >
            <el-menu-item index="5"
              ><router-link to="/mv" tag="div" class="link-div"
                >MV</router-link
              ></el-menu-item
            >
          </el-menu>
        </el-col>
        <!-- 搜索登录 -->
        <el-col :span="8" class="colInput">
          <search></search>
          <div class="login" @click="login" v-if="isAvatar">登录</div>
          <div class="avatar" v-else>
            <img
              :src="avatarUrl"
              alt=""
              srcset=""
              @mouseover="showUserInfo"
              @mouseleave="remeveUserInfo"
            />
            <span>{{ nickName }}</span>
          </div>
        </el-col>
      </el-row>
    </div>

    <!--  发现音乐 我的音乐 歌手 歌单 MV -->
    <router-view></router-view>

    <!-- 登录对话框 -->
    <login-dialog
      v-show="isShow"
      ref="loginRef"
      :ctrIsShow="isShow"
      @ctrClose="ctrClosed"
    ></login-dialog>
    <!-- 用户信息 -->
    <user-info v-show="isUserInfo">
      <template #level>
        我的等级是：<span class="infoFont">{{ userInfoObj.level }}</span> 级
      </template>
      <template #listenSongs>
        已听歌曲数量：<span class="infoFont">{{
          userInfoObj.listenSongs
        }}</span>
        首
      </template>
      <template #createDays>
        使用天数：<span class="infoFont">{{ userInfoObj.createDays }}</span> 天
      </template>
    </user-info>
  </div>
</template>
    
<script>
import LoginDialog from "./login/Login.vue"; // 导入登录框组件
import Search from '../headers/serach/Search.vue'; // 导入搜索框组件
import userInfo from "./userInfo/userInfo.vue"; // 导入用户详情信息组件
import { getUserInfo } from "../../network/login"; // 用户详情信息 网络请求


export default {
  name: "headerMenu",
  data() {
    return {
      activeIndex: "1",
      isShow: false, // 登录弹框显示与隐藏
      // 是否显示登录后头像
      isAvatar: true,
      // 头像地址
      avatarUrl: "",
      // 用户昵称
      nickName: "",
      // 是否展示用户信息下拉框
      isUserInfo: false,
      // 用户详情
      userInfoObj: {
        level: null,
        listenSongs: null,
        createDays: null,
      },

      
    };
  },
  methods: {
    handleSelect() {},
    login() {
      this.isShow = true;
      // console.log(this.isShow)
    },
    ctrClosed(v) {
      this.isShow = v; // 将子组件传的值重新赋给父组件的 isShow
      // console.log(v)

      // 判断用户是否登录
      if (this.$store.state.profile.avatarUrl) {
        // console.log(this.$store.state.profile.avatarUrl)
        this.isAvatar = false;
        this.avatarUrl = this.$store.state.profile.avatarUrl;
        this.nickName = this.$store.state.profile.nickName;
      }
      // this.isAvatar = true;
    },

    // 鼠标经过展示用户信息下拉框
    async showUserInfo() {
      const { data: res } = await getUserInfo(this.$store.state.profile.userId);
      // console.log(res)
      this.userInfoObj.level = res.level;
      this.userInfoObj.listenSongs = res.listenSongs;
      this.userInfoObj.createDays = res.createDays;
      this.isUserInfo = true;
    },
    // 鼠标离开隐藏用户信息下拉框
    remeveUserInfo() {
      // console.log('666')
      this.isUserInfo = false;
    },

    
  },

  components: {
    LoginDialog,
    userInfo,
    Search
  },
};
</script>
    
<style lang='less' scoped>
.container {
  height: 69px;
  background-color: #545c64;
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
  vertical-align: middle;
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
  }
}
</style>