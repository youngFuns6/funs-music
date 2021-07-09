<template>
  <div>
    <div class="location">
      <el-input
        placeholder="请输入内容"
        v-model="inputValue"
        @input="keyValue($event, cb)"
        @blur="blurStatus"
        @focus="focusStatus"
        @change="changeStatus"
      >
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>

      <!-- 提示框 -->
      <div class="tipBox" v-show="isShow">
        <div class="sing">
          <p>歌曲</p>
          <ul>
            <li v-for="item in tipInfo.song" :key="item.id">
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
            >
              {{ item.name }}
            </li>
          </ul>
        </div>
        <div class="sing-list">
          <p>专辑</p>
          <ul>
            <li v-for="item in tipInfo.singList" :key="item.id">
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
export default {
  name: 'search',
  data() {
    return {
      // 用户输入信息 未提交输入框前
      inputValue: "",
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
    // 搜索建议提示
    async cb() {
      
      const { data: res } = await getTips(this.inputValue);

      //   console.log(res);

      if (this.inputValue !== "" ) {
        this.tipInfo.song = res.result.songs;
        this.tipInfo.singer = res.result.artists;
        this.tipInfo.singList = res.result.albums;
        this.isShow = true;


        // console.log(this.tipInfo.song + '' !== 'undefined'); 
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

    // 监听 input 失焦或按下回车事件
    blurStatus() {
      this.isShow = false;

      // console.log("777");
    },

    // 监听 input 聚焦事件
    focusStatus() {
      if(this.inputValue !== '')
      this.isShow = true;
      // console.log("666");
    },

    // 监听 input 回车按下事件
    changeStatus(){
      this.isShow = false;
      // console.log('888')
    }
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