<template>
  <div>
    <el-card>
      <div class="playlist">
        <h4>包含这首歌的歌单</h4>
        <ul>
          <li v-for="item in simiPlaylistAttr" :key="item.id">
            <div @click="getPlaylistId(item.id)">
              <img :src="item.coverImgUrl" alt="" />
            </div>
            <div class="tp">
              <p class="ts" @click="getPlaylistId(item.id)">{{ item.name }}</p>
              <p><span>by</span> {{ item.creator.nickname }}</p>
            </div>
          </li>
        </ul>
      </div>
      <div class="songs">
        <h4>相似歌曲</h4>
        <ul>
          <li v-for="item1 in simiSongsAttr" :key="item1.id">
            <div class="s_name">
              <p @click="getSongId(item1.id)">{{ item1.name }}</p>
              <p>
                <span
                  @click="getSingerId(item2.id)"
                  v-for="(item2, index) in item1.artists"
                  :key="index"
                  >{{ item2.name
                  }}<i>{{
                    index === item1.artists.length - 1 ? "" : "/"
                  }}</i></span
                >
              </p>
            </div>
            <div class="s_icon">
              <i class="iconfont icon-jiantou" @click="playAudio(item1.id)"></i>
              <i class="iconfont icon-tianjia" @click ='savePlayAudioId(item1.id)'></i>
            </div>
          </li>
        </ul>
      </div>
    </el-card>
  </div>
</template>
    
<script>
import { mapMutations,mapActions } from "vuex";
export default {
  name: "MoreSongs",
  props: {
    // 相似歌单数据
    simiPlaylistAttr: {
      type: Array,
      default() {
        return [];
      },
    },
    // 相似歌曲数据
    simiSongsAttr: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {};
  },
  methods: {
    ...mapMutations(["playListIdMutations", "singerIdMutations",'SongIdMutations','musicUrlMutations','musicPlayListId']),
    ...mapActions(['getSongsDetActions']),
    // 存储歌单 id 并跳转至歌单详情
    getPlaylistId(id) {
      this.playListIdMutations(id);
      this.$router.push("/singlist/detail");
    },
    // 存储歌手 id 并跳转至歌手详情
    getSingerId(id) {
      this.singerIdMutations(id);
      this.$router.push("/singer/detail");
    },
    // 存储歌曲 id 并更新页面
    getSongId(id){
        this.SongIdMutations(id);
        this.$router.go(0)
    },
     // 点击播放按钮播放歌曲
    playAudio(id){
       // 存储当前音乐 id
      this.musicUrlMutations(id);
      // 获取播放音乐详情
      this.getSongsDetActions(id)
      // 通过事件总线触发播放条的 播放事件
      this.$bus.$emit("onPlay");
    },
    // 点击加号 加入到播放列表
    savePlayAudioId(id){
      this.musicPlayListId(id)
      // 更新播放列表
      this.$bus.$emit('addMusic')
    }
  },
};
</script>
    
<style lang='less' scoped>
.playlist {
  margin: 30px 0;
  h4 {
    font-weight: 600;
    padding: 20px 0;
    border-bottom: 1px solid #000;
  }
  li {
    display: flex;
    justify-content: left;
    margin: 10px 0;
  }
  .ts:hover {
    text-decoration: underline;
    cursor: pointer;
  }
  .tp {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-left: 10px;
    padding: 5px 0;
    font-size: 16px;
    .ts {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 200px;
    }

    p:last-child {
      font-size: 14px;
      color: #666;
      span {
        color: #666;
      }
    }
  }
  img {
    display: block;
    width: 50px;
    height: 50px;
    // background-color: #fff;
    cursor: pointer;
  }
}
.songs {
  h4 {
    font-weight: 600;
    padding: 20px 0;
    border-bottom: 1px solid #000;
  }
  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px 0;
  }
  .s_name p {
    cursor: pointer;
    margin: 5px 0;

    &:first-child {
      width: 100px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      &:hover {
          text-decoration: underline;
        }
    }
    &:last-child {
      color: #666;
      span {
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
  .s_icon {
    i {
      margin: 0 10px;
      cursor: pointer;
    }
  }
}
</style>