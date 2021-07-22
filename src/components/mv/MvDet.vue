<template>
  <div>
    <el-row :gutter="20">
      <el-col :offset="2" :span="15">
        <el-card>
          <div class="info">
            <h4>{{ mvInfo.name }}</h4>
            <a href="#" v-for="(item, i) in mvInfo.artists" :key="item.id" @click='saveSingerId(item.id)'
              >{{ item.name
              }}<i>{{ i === mvInfo.artists.length - 1 ? "" : "/" }}</i></a
            >
          </div>
          <!-- mv 展示 -->
          <div class="mv-show">
            <video :src="mvUrl" controls></video>
          </div>
          <div class="emj">
            <i class="iconfont icon-qingdankushoucang">{{ mvInfo.subCount }}</i>
            <i class="iconfont icon-iconfenxiang">{{ mvInfo.shareCount }}</i>
          </div>
        </el-card>
        <!-- 评论 -->
        <album-coment :albumComentsObj="comments"></album-coment>
        <!-- 分页 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="this.pageNum"
          :page-sizes="[20, 100, 200, 400]"
          :page-size="this.queryInfo.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="this.comments.total"
        >
        </el-pagination>
      </el-col>
      <el-col :span="5">
        <el-card>
          <div class="desc">
            <h4>MV 简介</h4>
            <div>发布时间：{{ mvInfo.publishTime }}</div>
            <div>播放次数：{{ mvInfo.playCount | counFormate}}</div>
            <p>{{ mvInfo.desc }}</p>
          </div>
          <!-- 相关推荐 -->
          <div class="more">
            <div class="desc">
              <h4>相关推荐</h4>
              <ul>
                  <li v-for="item in mvs" :key="item.id">
                      <a href="#" @click.prevent="getCurrentMvDet(item.id)">
                          <img :src="item.cover" alt="">
                          <i class="iconfont icon-shexiang">{{item.playCount | counFormate}}</i>
                      </a>
                      <div>
                          <p @click.prevent="getCurrentMvDet(item.id)">{{item.name}}</p>
                          <p>{{item.duration |secondFormate}}</p>
                          <p>by {{item.artistName}}</p>
                      </div>
                  </li>
              </ul>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
    
<script>
import { getMvUrl, getMvDet, getMvComment, getSimiMv } from "../../network/mv"; // mv 播放地址 详情 评论 相关mv 网络请求
import AlbumComent from "../coments/AlbumComent.vue"; // 引入评论组件
import {mapMutations} from 'vuex'
export default {
  data() {
    return {
      // mv 地址
      mvUrl: "",
      // mv 信息
      mvInfo: {
        // 歌手
        artists: [],
      },
      // 评论请求查询参数
      queryInfo: {
        id: this.$store.state.mvId,
        limit: 20,
        offset: 0,
        before: null,
      },
      // 当前页
      pageNum: 1,
      // 评论
      comments: {},
      // 相关 mv
      mvs: []
    };
  },
  created() {
    this.getMvUrlRef();
    this.getMvDetRef();
    this.getMvCommentRef();
    this.getSimiMvRef()
  },
  methods: {
    // 获取 mv 播放地址
    async getMvUrlRef() {
      //   console.log(this.$store.state.mvId)
      const { data: res } = await getMvUrl(this.$store.state.mvId);
      // console.log(res)
      if (res.code !== 200) {
        return this.$message.error("获取mv详情失败");
      }
      this.mvUrl = res.data.url;
    },
    // 获取 mv 详情
    async getMvDetRef() {
      const { data: res } = await getMvDet(this.$store.state.mvId);
    //   console.log(res);
      this.mvInfo = res.data;
    },
    // 获取 mv 评论
    async getMvCommentRef() {
      const { data: res } = await getMvComment(this.queryInfo);
      //   console.log(res);
      if (res.code !== 200) {
        return this.$message.error("获取评论失败");
      }
      // 判断评论是否超过 5000
      if(res.total >= 5000){
          this.queryInfo.before = res.comments[res.comments.length - 1].time
      }
      this.comments = res;
    },
    // 单页评论数量改变事件
    handleSizeChange(pagesize) {
      this.queryInfo.limit = pagesize;
      this.getMvCommentRef();
    },

    // 页面改变事件
    handleCurrentChange(pagenum) {
      this.pageNum = pagenum;
      this.queryInfo.offset = (pagenum - 1) * this.queryInfo.limit;
      this.getMvCommentRef();
    },
    
    // 获取相关 mv
    async getSimiMvRef(){
        const {data: res} = await getSimiMv(this.$store.state.mvId)
        console.log(res)
        if(res.code !== 200){
            return this.$message.error('获取相关 mv 推荐失败')
        }
        this.mvs = res.mvs
    },

    ...mapMutations(['mvIdMutations','singerIdMutations']),
    // 点击相关 mv 显示该 mv 详情
    getCurrentMvDet(id){
        this.mvIdMutations(id)
        this.$router.go(0)
    },
    // 点击歌手名跳转至歌手详情
    saveSingerId(id){
        this.singerIdMutations(id)
        this.$router.push('/singer/detail')
    }
  },
  components: {
    AlbumComent,
  },
};
</script>
    
<style lang='less' scoped>
.info {
  display: flex;
  justify-content: center;
  align-items: center;
  h4 {
    margin-right: 20px;
    font-size: 24px;
  }
  a {
    text-decoration: none;
    color: #0c73c2;
    &:hover {
      text-decoration: underline;
    }
  }
}
.mv-show {
  display: flex;
  justify-content: center;
  margin: 30px 0;
}
video {
  width: 768px;
  height: 432px;
  box-shadow: 0 0 10px;
  border-radius: 10px;
}
.emj {
  display: flex;
  justify-content: center;
  i {
    width: 80px;
    height: 30px;
  }
}
.desc {
  h4 {
    font-weight: 600;
    line-height: 2;
    border-bottom: 1px solid #000;
    margin-bottom: 20px;
  }
  div {
    margin: 5px 0;
    color: #666;
  }
  p {
    margin: 20px 0;
    line-height: 1.5;
    font-size: 14px;
  }
}
.more {
    h4 {
        font-weight: 600;
    }
    li {
        display: flex;
        justify-content: left;
        align-items: center;
        a {
            position: relative;
            width: 96px;
            height: 54px;
            color: #fff;
            img{
                width: 100%;
                height: 100%;
            }
            i {
                position: absolute;
                right: 0;
                top: 0;
            }
        }
        div {
            margin-left: 10px;
            p {
                margin: 0;
                font-size: 14px;
            }
            p:first-child {
                color: #000;
                cursor: pointer;
                &:hover {
                    text-decoration: underline;
                }
            }
        }

    }
}
</style>