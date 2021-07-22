<template>
  <div>
    <el-row>
      <el-col :offset="2" :span="20">
        <el-card>
          <!-- 头部 -->
          <div class="header">
            <h3>
              <span>全部新碟</span>
            </h3>
            <div class="tip">
              <a @click.prevent="toggleZH">华语</a><span>|</span>
              <a @click.prevent="toggleEA">欧美</a><span>|</span>
              <a @click.prevent="toggleKR">韩国</a><span>|</span>
              <a @click.prevent="toggleJP">日本</a>
            </div>
          </div>
          <!-- 内容 -->
          <ul>
            <li v-for="item in this.$store.state.resSongs" :key="item.id">
              <div class="cover">
                <img :src="item.picUrl" alt="" />
                <a
                  href="#"
                  class="mask"
                  @click.prevent="toggleNewSongInfo(item.id)"
                ></a>
                <p>{{ item.name }}</p>
                <p>{{ item.artist.name }}</p>
              </div>
            </li>
          </ul>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
    
<script>
import {  mapMutations } from "vuex";
export default {
  name: "newSongs",

  data() {
    return {};
  },
  methods: {
    // 点击地区分类 切换相应内容
    toggleZH() {
      this.$emit("getArea", "ZH");
    },
    toggleEA() {
      this.$emit("getArea", "EA");
    },
    toggleKR() {
      this.$emit("getArea", "KR");
    },
    toggleJP() {
      this.$emit("getArea", "JP");
    },

    // vuex 中相关处理数据函数
    ...mapMutations(["albumIdMutations"]),

    // 点击新碟 跳转至该碟详情
    toggleNewSongInfo(id) {
      this.$router.push("/newSongInfo");
      this.albumIdMutations(id);
      // console.log(id)
    },
  },
};
</script>
    
<style lang='less' scoped>
.header {
  margin: 30px 30px 20px 30px;
  height: 40px;
  border-bottom: 2px solid red;
}
.header::after {
  content: "";
  display: block;
  clear: both;
  visibility: hidden;
}
h3,
.tip a,
span {
  float: left;
}
.tip a {
  text-decoration-line: none;
  color: #000;
  font-size: 16px;
  cursor: pointer;
}

.tip a:hover {
  text-decoration: underline;
}

.header h3 span {
  font-size: 28px;
  color: #333;
}

.tip {
  float: left;
  margin: 12px 0 0 30px;
  span {
    margin: 0 20px;
    font-size: 12px;
    color: #d2c7c7;
  }
}
ul {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
ul li {
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

  background: url("../../assets/coverall.png") no-repeat;
  background-position: 0 -845px;
  // background-color: #666;
}
</style>