<template>
  <div>
    <el-card>
      <div class="header-contain clearfix">
        <div class="avater">
          <img :src="playListInfoAttr.playlist.coverImgUrl" alt="" />
        </div>
        <div class="opt clearfix">
          <div class="clearfix">
            <div class="bq_box">
              <span class="bq">歌单</span><i class="sanjiao"></i>
            </div>
            <div class="bq_text">{{ playListInfoAttr.playlist.name }}</div>
          </div>
          <p class="user_info">
            <img :src="playListInfoAttr.playlist.creator.avatarUrl" alt="" />
            <span>
              <i>{{ playListInfoAttr.playlist.creator.nickname }}</i>
              <i
                >创建时间：{{
                  playListInfoAttr.playlist.createTime | dataFormate
                }}</i
              >
            </span>
          </p>
          <!-- 四个按钮 -->
          <det-btn :totalAttr='playListCommentsAttr.total' :playListInfoAttr='playListInfoAttr'></det-btn>
          <!-- 歌单描述 -->
          <div class="list-dec">
            <div>
              <span>标签：</span>
              <span>
                <el-tag
                  type="success"
                  v-for="(item, index) in playListInfoAttr.playlist.tags"
                  :key="index"
                  >{{ item }}</el-tag
                >
              </span>
            </div>
            <div>
              <span>介绍：</span>
              <span>{{ playListInfoAttr.playlist.description }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="show-list">
        <h4>
          <span>歌曲列表</span>
          <span>{{ playListInfoAttr.playlist.trackCount }}首歌</span>
          <span
            >播放：<i>{{ playListInfoAttr.playlist.playCount }}</i
            >次</span
          >
        </h4>
      </div>
      <!-- 歌曲列表 -->
      <el-table
        :data="playListInfoAttr.playlist.tracks"
        style="width: 100%"
        stripe
      >
        <el-table-column type="index" width="50"> </el-table-column>
        <el-table-column type="index" width="100">
          <template #default="scope">
            <i class="iconfont icon-hm_video_light" @click="saveAudio(scope.row.id)"></i>
            <i class="iconfont icon-chakanMV" v-show="scope.row.mv" @click="saveMvId(scope.row.mv)"></i>
          </template>
        </el-table-column>
        <el-table-column label="歌曲标题" width="180">
          <template #default="scope">
            <span class="row_po" @click="getSongId(scope.row.id)">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="时长">
          <template #default="scope">
            <i>{{ scope.row.dt | secondFormate }}</i>
          </template>
        </el-table-column>
        <el-table-column label="歌手">
          <template #default="scope">
            <span
              class="row_po"
              v-for="(item, index) in scope.row.ar"
              :key="item.id"
              @click="getSingerId(item.id)"
              >{{ item.name
              }}<i v-if="index === scope.row.ar.length - 1 ? 0 : 1">/</i></span
            >
          </template>
        </el-table-column>
        <el-table-column label="专辑">
          <template #default="scope">
            <span class="row_po" @click="toggleNewSongInfo(scope.row.al.id)">{{
              scope.row.al.name
            }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
    
<script>
import DetBtn from './DetBtn.vue' // 四个按钮
import { mapMutations,mapActions } from "vuex";
export default {
  name: "MySongShow",
  props: {
    // 歌单详情
    playListInfoAttr: {
      type: Object,
      default() {
        return {};
      },
    },
    // 歌单评论
    playListCommentsAttr:{
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {};
  },
  methods: {
    // 引入 vuex 中函数
    ...mapMutations(["albumIdMutations",'singerIdMutations','SongIdMutations','musicUrlMutations', 'onPlayMutations','mvIdMutations']),
    ...mapActions(["getSongsDetActions"]),
    // 点击专辑跳转至专辑详情页面
    toggleNewSongInfo(id) {
      this.$router.push("/newSongInfo");
      this.albumIdMutations(id);
      // console.log(id)
    },
     // 点击歌手 存储歌手 id 并跳转至歌手详情
    getSingerId(id){
      this.singerIdMutations(id)
      this.$router.push('/singer/detail')
    },
    // 点击歌曲 存储歌曲 id 并跳转至歌曲详情
    getSongId(id){
      this.SongIdMutations(id)
      this.$router.push('/songs/detail')
    },
    // 点击播放图标 播放歌曲
     saveAudio(id){
      // 存储当前音乐 id
      this.musicUrlMutations(id)
      // 获取播放音乐详情
      this.getSongsDetActions(id)
      // console.log(res.data)
      // 通过事件总线触发播放条的 播放事件
      this.$bus.$emit('onPlay')
    },
    // 点击 mv 按钮跳转至 mv 详情
    saveMvId(id){
      this.mvIdMutations(id)
      this.$router.push('/mvdet')
    }
  },
  components: {
    DetBtn
  }
};
</script>
    
<style lang='less' scoped>
.clearfix::after {
  content: "";
  clear: both;
  display: block;
  overflow: hidden;
}

.el-tag {
  margin: 0 10px;
}

.avater {
  float: left;
  width: 208px;
  height: 208px;
  background-color: #fff;
  img {
    width: 100%;
    height: 100%;
  }
}

.opt {
  float: left;
  margin-left: 30px;
  width: 600px;
  .bq_box {
    float: left;
    height: 40px;
    line-height: 40px;
  }

  .bq_text {
    float: left;
    // height: 40px;
    line-height: 40px;
    font-size: 24px;
  }

  .bq {
    float: left;
    height: 40px;
    width: 60px;
    line-height: 40px;
    box-sizing: border-box;
    background-color: #cf1717;
    color: #fff;
    font-size: 14px;
    text-align: center;
  }
  .sanjiao {
    display: inline-block;
    width: 0;
    height: 0;
    border: 20px solid transparent;
    border-left-color: #cf1717;
  }
}

.user_info {
  display: flex;
  justify-content: left;
  align-items: center;
  margin: 20px 0;
  i:first-child {
    margin: 0 20px;
    &:hover {
      color: #f8f8f8;
      text-decoration: underline;
      cursor: pointer;
    }
  }
  i:last-child {
    margin-left: 50px;
  }
  img {
    width: 50px;
    height: 50px;
    cursor: pointer;
  }
}



.show-list h4 {
  height: 50px;
  line-height: 50px;
  font-size: 24px;
  margin: 30px 0 20px 0;
  border-bottom: 2px solid red;
  span:nth-child(2) {
    margin-left: 20px;
    font-size: 14px;
  }
  span:last-child {
    float: right;
    font-size: 14px;
    i {
      color: #cf1717;
    }
  }
}

.list-dec {
  margin: 50px 0;
  div {
    margin: 30px 0;
  }
}

.icon-hm_video_light,
.icon-chakanMV {
  font-size: 24px;
  cursor: pointer;
  margin: 0 5px;
  &:hover {
    color: #0c73c2;
  }
}

.row_po {
  cursor: pointer;
  &:hover {
    text-decoration: underline;
    color: #0c73c2;
  }
}
</style>