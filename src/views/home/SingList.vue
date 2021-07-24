<template>
  <div>
    <div>
      <el-row>
        <el-col :offset="2" :span="20">
          <el-card>
            <!-- 头部 -->
            <div class="header">
              <div>
                <h4 class="cat_name">全部</h4>
                <el-button type="primary" @click="showCat"
                  >选择分类<i class="iconfont icon-jiantou"></i
                ></el-button>
                <play-list-cat
                  class="list_cat"
                  :categoriesAttr="categories"
                  :subAttr="sub"
                  @emitQueryAll="QueryAll"
                  @emitQueryCat='queryCat'
                  v-show="isShow"
                ></play-list-cat>
              </div>
              <span @click="QueryAll">热门</span>
            </div>
            <!-- 内容 -->
            <div class="content">
              <ul>
                <li v-for="(item,i) in playList" :key="i">
                  <a href="#" @click.prevent="toPlayListDet(item.id)"
                    ><img :src="item.coverImgUrl" alt=""
                  /></a>
                  <div class="b_icon">
                    <i class="iconfont icon-icon-test"
                      ><span>{{ item.playCount | counFormate }}</span></i
                    ><i class="iconfont icon-hm_video_light"></i>
                  </div>
                  <p class="s_name" @click.prevent="toPlayListDet(item.id)">
                    {{ item.name }}
                  </p>
                  <p class="nick_name">
                    <span>by</span><span>{{ item.creator.nickname }}</span>
                  </p>
                </li>
              </ul>
            </div>
          </el-card>
          <!-- 分页 -->
          <div class="pagination">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="this.pagenum"
              :page-sizes="[50, 100, 300, 400]"
              :page-size="this.queryInfo.limit"
              layout="total, sizes, prev, pager, next, jumper"
              :total="this.total"
            >
            </el-pagination>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
    
<script>
import { getPlaylistCat, getPlaylistTop } from "../../network/Sing"; // 歌单分类 网络请求
import PlayListCat from "../../components/song/plagListCat/PlayListCat.vue"; // 歌单分类组件
import { mapMutations } from "vuex"; // 引入 vuex 数据处理函数
export default {
  name: "SingList",
  data() {
    return {
      // 歌单分类数据
      categories: {},
      sub: [],

      // 歌单分类列表 显示与隐藏
      isShow: false,

      // 歌单请求查询参数
      queryInfo: {
        limit: 50,
        offset: 0,
        cat: "",
        order: "hot",
      },
      // 歌单数量
      total: null,
      // 当前页
      pagenum: 1,
      // 歌单数据
      playList: [],
    };
  },
  created() {
    this.getPlaylistCatRef();
  },
  beforeMount() {
    this.getPlaylistTopRef();
  },
  methods: {
    // 获取歌单分类
    async getPlaylistCatRef() {
      const { data: res } = await getPlaylistCat();
      // console.log(res);
      this.categories = res.categories;
      this.sub = res.sub;
    },

    // 获取网友精选歌单
    async getPlaylistTopRef() {
      const { data: res } = await getPlaylistTop(this.queryInfo);
      console.log(res);
      if (res.code !== 200) {
        return this.$message.error("获取失败");
      }
      this.playList = res.playlists;
      this.total = res.total;
    },

    // 歌单展示数量改变事件
    handleSizeChange(pagesize) {
      this.queryInfo.limit = pagesize;
      this.getPlaylistTopRef();
    },
    // 当前页改变事件
    handleCurrentChange(pagenum) {
      this.pagenum = pagenum;
      this.queryInfo.offset = (this.pagenum - 1) * this.queryInfo.limit;
      this.getPlaylistTopRef();
    },

    // 歌单 id 处理函数
    ...mapMutations(["playListIdMutations"]),
    // 点击歌单跳转至歌单详情页
    toPlayListDet(id) {
      // 将歌单 id 存入 vuex
      this.playListIdMutations(id);
      // 将歌单 id 存入本地
      window.sessionStorage.setItem("playListId", JSON.stringify(id));
      this.$router.push("/singlist/detail");
    },
    // 点击分类按钮 展示分类选择框
    showCat() {
      this.isShow = !this.isShow;
    },
    // 点击全部风格 查询全部热门歌单
    QueryAll() {
      this.queryInfo.cat = ''
      this.getPlaylistTopRef();
      this.isShow = false;
    },
    // 点击其余分类按钮 查询对应分类歌单
    queryCat(item){
      this.queryInfo.cat = item
      this.getPlaylistTopRef();
      this.isShow = false;
    }
  },
  components: {
    PlayListCat,
  },
};
</script>
    
<style lang='less' scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid red;
  padding: 20px 0;
  margin-bottom: 50px;
  div:first-child {
    position: relative;
    display: flex;
    align-items: center;
  }

  h4 {
    font-size: 24px;
  }
  .el-button {
    margin-left: 30px;
    i {
      display: inline-block;
      margin-left: 5px;
      transform: rotateZ(90deg);
    }
  }
  span {
    padding: 5px 10px;
    background-color: #a3080b;
    border-radius: 3px;
    cursor: pointer;
    color: #fff;
    &:hover {
      text-decoration: underline;
    }
  }
}
.list_cat {
  position: absolute;
  left: -10px;
  top: 70px;
  z-index: 1111;
}

.el-card {
  min-height: 700px;
}

.content ul {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  height: 100%;
}
.content li {
  position: relative;
  width: 140px;
  height: 188px;
  margin: 20px 50px;
 
  .b_icon {
    position: absolute;
    left: 0;
    top: 110px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 30px;
    width: 140px;
    background-color: rgba(rgb(54, 53, 53), 0.7);
    color: rgb(209, 205, 205);
    i {
      margin: 0 10px;
      span {
        font-size: 12px;
      }
    }
    i:last-child {
      cursor: pointer;
      font-size: 24px;
      &:hover {
        color: rgb(182, 179, 179);
      }
    }
  }
  a {
    display: inline-block;
    width: 140px;
    height: 140px;
    box-shadow: 0 0 10px;
     border-radius: 5px;
  overflow: hidden;
  }
  img {
    width: 100%;
    height: 100%;
     
  }
  p {
    margin: 5px 0;
  }
  .s_name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
  .nick_name {
    font-size: 12px;
    span {
      color: rgb(12, 12, 12);
      margin-right: 5px;
    }
    span:last-child {
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
.pagination {
  display: flex;
  justify-content: center;
  margin: 10px 0 50px 0;
}
</style>