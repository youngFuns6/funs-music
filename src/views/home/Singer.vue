<template>
  <div>
    <el-row :gutter="20">
      <el-col :offset="2" :span="4">
        <!-- 左侧歌手分类列表 -->
        <singer-type @emitHotSinger="getHotSingerEvent"></singer-type>
      </el-col>
      <el-col :span="16">
        <!-- 右侧歌手展示区域 -->
        <singer-show
          :ListInfoAttr="ListInfoImg"
          @emitLoad="loadEvent"
          v-if="isShow_1"
        >
          <template #title> 热门歌手 </template>
          <template #more> 更多 </template>
        </singer-show>
        <!-- ———————————————————————————————— -->
        <singer-show :ListInfoAttr="ListInfoImg" v-else>
          <template #title> 热门歌手 </template>
          <template #more> </template>
        </singer-show>
        <el-card v-show="isShow_2">
          <ul>
            <li class="bt" v-for="item in ListInfo" :key="item.id">
              <a href="#">{{ item.name }}</a>
              <a href="#" class="iconfont icon-icon--my"></a>
            </li>
          </ul>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
    
<script>
import SingerType from "../../components/singer/SingerType.vue"; // 导入左侧歌手分类组件
import SingerShow from "../../components/singer/SingerShow.vue"; // 导入右侧歌手展示组件
import { getHotSinger, getSingerType } from "../../network/singer"; // 热门歌手 歌手分类 网络请求
export default {
  name: "Singer",
  data() {
    return {
      //  显示图片热门歌手
      ListInfoImg: [],
      //  不显示图片热门歌手
      ListInfo: [],
      // 默认展示热门歌手
      isShow_1: true,
      isShow_2: true,
      // 热门歌手查询参数
      HotQueryInfo: {
        limit: 30,
        offset: 0,
      },

      // 歌手分类查询参数
      queryInfo: {
        limit: 10,
        offset: 0,
        type: null,
        area: null,
        initial: null,
      },
    };
  },
  created() {
    this.singerTypeRef();
  },
  methods: {
    // 获取 10 个热门歌手
    async singerTypeRef() {
      const { data: res } = await getHotSinger({ limit: 100 });
      // console.log(res);
      if (res.code !== 200) {
        return this.$message.error("歌手列表获取失败");
      }
      this.ListInfoImg = res.artists.slice(0, 10);
      this.ListInfo = res.artists.slice(10);
    },

    // 点击热门歌手事件
    async getHotSingerEvent() {
      const { data: res } = await getSingerType(this.HotQueryInfo);
      //  console.log(res)
      if (res.code !== 200) {
        return this.$message.error("获取失败");
      }
      this.ListInfoImg = res.artists;
      this.isShow_1 = false;
      this.isShow_2 = false;
    },

    // 滚动加载事件
    loadEvent() {
      // this.HotQueryInfo.offset += 10
      // this.getHotSingerEvent()
    },
  },
  components: {
    SingerType,
    SingerShow,
  },
};
</script>
    
<style lang='less' scoped>
.el-card {
  margin: 30px 0;
  background-color: #dad6d3;
  ul {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
}
li {
  margin: 5px 0;
  width: 130px;
  height: 30px;
}
li a {
  text-decoration: none;
  color: #333;
  &:first-child:hover {
    text-decoration: underline;
  }
}
</style>