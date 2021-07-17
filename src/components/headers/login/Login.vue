<template>
  <div>
    <div class="mask"></div>
    <div class="loginBox" ref="loginBoxRef">
      <h2 @mousedown="moveLogin">
        <span>登录</span>
        <span @click="close">×</span>
      </h2>
      <!-- 二维码登录 -->
      <p v-show="qrShow" class="qrStatus">二维码不存在或已过期，请刷新</p>
      <div class="qr" v-if="toggle">
        <img :src="qr64" alt="" />
        <span class="iconfont icon-qiehuan" @click="togglePh"></span>
        <span class="iconfont icon-shuaxin1" @click="refreshQr"></span>
      </div>

      <!-- 密码登录 -->
      <div class="login" v-else>
        <el-form
          :model="loginForm"
          :rules="loginRules"
          ref="loginRef"
          label-width="70px"
        >
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="loginForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="loginForm.password" type="password"></el-input>
          </el-form-item>
          <div class="btn">
            <el-button type="primary" size="mini" @click="loginBtn"
              >登录</el-button
            >
          </div>
          <span class="iconfont icon-erweima" @click="toggleQr"></span>
        </el-form>
      </div>
    </div>
  </div>
</template>
    
<script>
import { getQr, statusQr, loginPh } from "../../../network/login";
// import { getCookie, setCookie } from "../../../utils/cookie";
import { mapMutations } from "vuex";

export default {
  name: "login",
  props: ["ctrIsShow"], // 接收父组件的传值
  data() {
    // 自定义验证手机规则
    var checkPhone = (rule, value, cb) => {
      //验证手机号的正则表达式
      const regMobile =
        /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法手机号"));
    };
    return {
      // isShow: true, // 登录框显示与隐藏
      // 登录表单数据
      loginForm: {
        phone: null,
        password: "",
      },

      // 登录表单验证规则
      loginRules: {
        phone: [
          { required: true, message: "请输入手机", trigger: "blur" },
          { validator: checkPhone, trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "用户名长度在6~15个字符",
            trigger: "blur",
          },
        ],
      },
      // 是否切换登录
      toggle: false,
      // 登录二维码 base64 编码
      qr64: null,

      // 定时器对象
      time: null,
      // 二维码状态信息
      qrShow: false,
    };
  },
  methods: {
    // 点击 × 关闭登录框事件
    close() {
      this.$emit("ctrClose"); // 通过自定义事件向父组件传值
      // 登录框关闭重置表单并移除验证
      this.$refs.loginRef.resetFields();
      // 如果当前路由为 /login 则关闭窗口跳转至 home
      if (this.$route.path === "/login") {
        this.$router.push("/home");
        window.sessionStorage.setItem("activeIndex", "/home");
        this.$store.state.activeIndex = "/home";
      }
      // console.log(this.$route.path)
    },
    // 点击切换二维码登录
    toggleQr() {
      this.toggle = true;
      // 获取登录二维码信息
      this.getQrInfo();
    },

    // 获取二维码信息并检测状态
    async getQrInfo() {
      const { data: res } = await getQr();
      if (res.code !== 200) {
        return this.$message.error("二维码获取失败");
      }
      this.qr64 = res.data.qrimg;
      // console.log(this.qr64);
      // 每隔 30s 检测二维码状态 提示用户是否需要刷新
      this.time = setTimeout(async () => {
        const { data: res } = await statusQr();
        // console.log(res);
        if (res.code === 800) {
          this.qrShow = true;
          this.time = null;
          // console.log(this);
        }
      }, 3000);
    },
    // 点击切换密码登录
    togglePh() {
      // console.log('666')
      this.toggle = false;
      this.qrShow = false;
    },
    // 点击刷新按钮 刷新二维码
    refreshQr() {
      // const {data: res} = await refreshStatus()
      this.getQrInfo();
      // console.log(this.qr64);
    },

    // 手机号登录
    loginBtn() {
      // 请求前进行表单预验证
      this.$refs.loginRef.validate((valid) => {
        if (!valid) {
          return this.$message.info("请检查手机号或密码后重试");
        }
        this.getLoginInfo();
      });
    },
    // vuex mapMutations 相关处理函数
    ...mapMutations(["profileMutations"]),

    // 获取登录信息
    async getLoginInfo() {
      // 发送登录请求
      const { data: res } = await loginPh(
        this.loginForm.phone,
        this.$md5(this.loginForm.password)
      );

      // console.log(res);
      if (res.code !== 200) {
        return this.$message.error("登录失败");
      }

      // 将用户相关信息存入 vuex
      let profile = {
        nickName: res.profile.nickname,
        avatarUrl: res.profile.avatarUrl,
        userId: res.profile.userId,
      };
      this.profileMutations(profile);
      // 将用户 信息 存入 sessionStorage
      window.sessionStorage.setItem("profile", JSON.stringify(profile));
      this.$emit("ctrLoginBtn");

      // 登录成功跳转至 mymusic
      if (this.$route.path === "/login") {
        this.$router.push("/mymusic");
        window.sessionStorage.setItem("activeIndex", "/mymusic");
        this.$store.state.activeIndex = "/mymusic";
      }
    },

    // 登录框拖拽效果
    moveLogin(e) {
      let oh2 = this.$refs.loginBoxRef; // 获取目标元素
      // 计算鼠标相对元素位置
      let disX = e.clientX - oh2.offsetLeft;
      let disY = e.clientY - oh2.offsetTop;
      document.onmousemove = (e) => {
        // 元素位置随鼠标移动的变化
        let left = e.clientX - disX;
        let top = e.clientY - disY;

        oh2.style.left = left + "px";
        oh2.style.top = top + "px";
      };
      document.onmouseup = (e) => {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    },
  },
  computed: {},
};
</script>
    
<style lang='less' scoped>
.mask {
  width: 100%;
  height: 100%;
  position: absolute;
  top: -100px;
  z-index: 99998;
}

.loginBox {
  position: absolute;
  left: 50%;
  bottom: 50%;
  transform: translate(-50%, 50%);
  z-index: 99999;
  width: 500px;
  height: 350px;
  background-color: #fff;
  box-shadow: 0 0 1px;

  h2 {
    position: relative;
    background-color: #2d2d2d;
    cursor: move;
    &::after {
      content: "";
      display: block;
      clear: both;
    }
    span:first-child {
      float: left;
      height: 16px;
      margin: 15px 20px;
      color: #fff;
    }
    span:last-child {
      position: absolute;
      top: 8px;
      right: 20px;
      // margin: 15px 20px ;
      color: #888;
      font-size: 25px;
      cursor: pointer;
    }
  }
}

.el-form {
  margin: 40px 40px;
  .el-form-item {
    width: 400px;
    margin-bottom: 40px;
  }
  .btn {
    float: right;
  }
  span {
    position: absolute;
    bottom: 30px;
    right: 50px;
    font-size: 30px;
    cursor: pointer;
  }
}
.qr {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) scale(1.5);
  .icon-qiehuan {
    cursor: pointer;
    position: absolute;
    top: 95%;
    right: 5%;
  }
  .icon-shuaxin1 {
    left: 5%;
    cursor: pointer;
    position: absolute;
    top: 95%;
  }
}

.qrStatus {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 5px;
  font-size: 5px;
  color: #888;
}
</style>