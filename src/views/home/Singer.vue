<template>
  <div>
    <el-row :gutter="20">
      <el-col :offset="2" :span="4">
        <!-- 左侧歌手分类列表 -->
        <singer-type
          @emitHotSinger="getHotSingerEvent"
          @emitGetSinger="getSingerEvent"
        ></singer-type>
      </el-col>
      <el-col :span="16">
        <!-- 右侧歌手展示区域 -->
        <singer-show :ListInfoAttr="ListInfoImg" v-if="isShow_3">
          <template #title> 热门歌手 </template>
          <template #more> </template>
        </singer-show>
        <!-- ———————————————————————————————— -->
        <div v-if="isShow_2">
          <singer-show :ListInfoAttr="ListInfoImg">
            <template #title> {{ title }} </template>
            <template #query>
              <div class="letter-query" v-show="isShow_4">
                <a
                  :class="active === index ? 'letter_bgc' : ''"
                  href=""
                  v-for="(item, index) in letter"
                  :key="index"
                  @click.prevent="letterQuery($event, index, item)"
                  >{{ item }}</a
                >
              </div>
            </template>
          </singer-show>
        </div>
        <el-card v-show="isShow_1"> 
          <ul>
            <li
              class="bt"
              v-for="item in ListInfo"
              :key="item.id"
              @click.prevent="saveSingerId(item.id)"
            >
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
import { mapMutations } from "vuex";
export default {
  name: "Singer",
  data() {
    return {
      //  显示图片热门歌手
      ListInfoImg: [],
      //  不显示图片热门歌手
      ListInfo: [],
      // 展示歌手区域 显示隐藏
      isShow_1: true,
      isShow_2: false,
      isShow_3: true,
      // 字母查询 显示隐藏
      isShow_4: false,
      // 热门歌手查询参数
      HotQueryInfo: {
        limit: 30,
        offset: 0,
      },
      // 更新 热门歌手个数 初始量
      count: 0,

      // 歌手分类查询参数
      queryInfo: {
        limit: 100,
        offset: 0,
        type: null,
        area: null,
        initial: null,
      },
      // 右侧展示歌手大标题
      title: "",
      // 存储字母查询
      letter: [
        "热门",
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
        "其他",
      ],
      // 查询字母的 class
      active: 0,
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
      const { data: res } = await getHotSinger(this.HotQueryInfo);
      //  console.log(res)
      if (res.code !== 200) {
        return this.$message.error("获取失败");
      }
      this.isShow_1 = false;
      this.isShow_3 = false;
      this.isShow_2 = true;
      this.isShow_4 = false;
      this.title = "热门歌手";
      // console.log(this.ListInfoImg);
      // 判断 ListInfoImg 是否存储原有 10 位歌手 有则清空
      if (this.ListInfoImg.length === 10) {
        this.ListInfoImg = [];
      }
      if(this.ListInfoImg.length !== 30){
        this.ListInfoImg.push(...res.artists)
      }

      // 监听滚动事件
      window.addEventListener("scroll", () => {
        // console.log(document.documentElement.scrollTop)
 console.log("999");
        // 判断滚动条是否到页面底部
        if (
          document.documentElement.scrollTop +
            document.documentElement.clientHeight >=
          document.body.scrollHeight
        ) {
          console.log("999");

          this.HotQueryInfo.offset = 30 + this.count;
          // 每次更新 10 位歌手
          this.HotQueryInfo.limit = 10;

          this.getHotSingerEvent();

          this.count += 10;
        }
      });
    },

    // 区域歌手分类数据对象
    async getSingerEvent(area, type, title) {
      // console.log(area,type)
      this.queryInfo.area = area;
      this.queryInfo.type = type;
      this.title = title;
      const { data: res } = await getSingerType(this.queryInfo);
      // console.log(res);
      if (res.code !== 200) {
        return this.$message.error("获取失败");
      }

      this.ListInfoImg = res.artists.slice(0, 10);
      this.ListInfo = res.artists.slice(10);
      this.isShow_1 = true;
      this.isShow_2 = true;
      this.isShow_3 = false;
      this.isShow_4 = true;
    },

    // 根据字母查询歌手
    async letterQuery(e, index, item) {
      // console.log(e.target.className)
      // 点击当前字母添加样式
      this.active = index;

      // 判断 item 值是否为 ‘热门’或‘其他’ 改为 -1 和 # 传值
      if (item === "热门") {
        this.queryInfo.initial = "-1";
      } else if (item === "其他") {
        this.queryInfo.initial = "0";
      } else {
        this.queryInfo.initial = item.toLowerCase();
      }
      // this.getSingerEvent()
      //  判断是否同一查询字母连续点击两次 是则不发送请求
      if (e.target.className === "letter_bgc") {
        return;
      } else {
        const { data: res } = await getSingerType(this.queryInfo);
        this.ListInfoImg = res.artists.slice(0, 10);
        this.ListInfo = res.artists.slice(10);
        console.log(res);
      }
    },
    // vuex 歌手 id 处理函数
    ...mapMutations(["singerIdMutations"]),
    // 点击歌手存储歌手 id
    saveSingerId(id) {
      this.singerIdMutations(id);
      // console.log(this.$store.state.singerId)
       this.$router.push('/singer/detail')
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
  font-size: 14px;
  &:first-child:hover {
    text-decoration: underline;
  }
}
.letter-query {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  margin-bottom: 10px;
  a {
    padding: 2px 5px;
    text-decoration: none;
    font-size: 18px;
    color: #333;
    &:hover {
      text-decoration: underline;
    }
  }
  .letter_bgc {
    background-color: red;
    color: #fff;
  }
}
</style>