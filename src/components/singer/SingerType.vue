<template>
  <div>
    <el-card>
      <div>
        <p>热门歌手</p>
        <ul>
          <li @click="clickHotSinger">
            <span class="iconfont icon-biaoqianA01_fenlei-02"></span>
            <span>热门歌手</span>
          </li>
        </ul>
      </div>
      <div v-for="(item1, index1) in singerTypeValue.info" :key="index1">
        <p>{{ item1.name }}</p>
        <ul>
          <li
            v-for="(item2, index2) in item1.singerTypeInfo"
            :key="index2"
            @click="getSinger(item1.area, item2.type, item2.name)"
          >
            <span class="iconfont icon-biaoqianA01_fenlei-02"></span>
            <span>{{ item2.name }}</span>
          </li>
        </ul>
      </div>
    </el-card>
  </div>
</template>
    
<script>
import singerTypeValue from "../../utils/singerTypeInfo"; // 导入歌手分类数据

export default {
  name: "singerType",
  data() {
    return {
      // 歌手分类数据对象
      singerTypeValue,
    };
  },
  methods: {
    async clickHotSinger() {
      // console.log('777')
      this.$emit("emitHotSinger");
    },
    getSinger(area, type, title) {
      this.$emit("emitGetSinger", area, type, title);
    },
  },
};
</script>
    
<style lang='less' scoped>
.el-card div {
  border-bottom: 1px solid #000;
}
li,
p {
  margin: 20px 0;
  span {
    margin: 0 10px;
  }
}
li {
  cursor: pointer;
  &:hover span:last-child {
    text-decoration: underline;
  }
}
p {
  font-size: 20px;
  font-weight: 600;
}
</style>