<template>
  <div>
    <el-card>
      <div class="cloud">
        <h4>云音乐特色榜</h4>
        <ul>
          <li
            v-for="(item, index) in cloudList"
            :key="item.id"
            @click="getToplistId(item.id, index)"
            :class="[active === index ? 'activeClass' : '']"
          >
            <img :src="item.coverImgUrl" alt="" />
            <div class="cloud-list-name">
              <p>{{ item.name }}</p>
              <p>{{ item.updateFrequency }}</p>
            </div>
          </li>
        </ul>
      </div>
      <div class="all">
        <h4>全球媒体榜</h4>
        <ul>
          <li
            v-for="item in allList"
            :key="item.id"
            @click="getToplistId(item.id, index)"
          >
            <img :src="item.coverImgUrl" alt="" />
            <div class="cloud-list-name">
              <p>{{ item.name }}</p>
              <p>{{ item.updateFrequency }}</p>
            </div>
          </li>
        </ul>
      </div>
    </el-card>
  </div>
</template>
    
<script>
import { getToplist } from "../../network/rank"; // 排行榜榜单 网络请求
export default {
  name: "RankList",
  data() {
    return {
      // 云音乐特色榜
      cloudList: [],
      // 全球媒体榜
      allList: [],
      // 判断是否添加类名
      active: 0,
    };
  },
  created() {
    this.getToplistRef();
  },

  methods: {
    // 获取榜单
    async getToplistRef() {
      const { data: res } = await getToplist();
      // console.log(res);
      if (res.code !== 200) {
        return this.$message.error("获取榜单失败");
      }
      this.cloudList = res.list.slice(0, 4);
      this.allList = res.list.slice(4);
      // console.log(this.cloudList);
      // console.log(this.allList);
      this.getToplistId(res.list[0].id);
      this.active = 0;
    },
    // 点击榜单 获取 id
    getToplistId(id, index) {
      this.active = index;
      this.$emit("getToplistDet", id);
    },
  },
};
</script>
    
<style lang='less' scoped>
.cloud,
.all {
  h4 {
    font-weight: 600;
    margin: 20px 0;
  }
  ul {
    margin-bottom: 20px;
    li {
      display: flex;
      justify-content: left;
      padding: 15px 0;
      cursor: pointer;
      &:hover {
        background-color: #9aaec7;
      }
      img {
        width: 50px;
        height: 50px;
        margin-right: 20px;
      }
      .cloud-list-name {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        p:last-child {
          color: #666;
        }
      }
    }
  }
}
.activeClass {
  background-color: #7f96b3;
}
</style>