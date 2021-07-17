<template>
  <div>
    <div class="g_playlist">
      <div class="g_header">
        <div class="header-l">
          <span>播放列表{{}}</span>
          <span><i class="iconfont icon-shanchu"></i> <i>清除</i></span>
        </div>
        <div class="header-r">下雨天
            <span @click="close">×</span>
        </div>
        
      </div>
      <div class="g_content">
          <!-- 歌曲列表展示 -->
          <ul>
              <li >
                  <span class="s_name">1</span>
                  <div>
                      <span class="e_name">
                      <i>2</i>
                  </span>
                  <span class="s_time">3</span>
                  </div>
              </li>
          </ul>
          <!-- 歌词展示 -->
          <div class="lrc">
              <div>666</div>
          </div>
      </div>
    </div>
  </div>
</template>
    
<script>
export default {
    name: 'MusicPlaylist',
  data() {
    return {};
  },
  methods: {
      // 点击叉号关闭列表
      close(){
          this.$emit('closeDialog')
      }
  },
};
</script>
    
<style lang='less' scoped>
.g_playlist {
  width: 986px;
  height: 301px;
//   background-color: #ccc;
  .g_header {
      display: flex;
      background-color: #1B1B1B;
  }
  .header-l {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 553px;
    height: 41px;
  }
  .header-l span:first-child {
    margin-left: 20px;
    color: #fff;
  }
  .header-l span:last-child {
    margin-right: 20px;
    color: #7e7e7e;
    i:hover {
      color: #fff;
      cursor: pointer;
    }
    i:last-child:hover {
      text-decoration: underline;
      cursor: pointer;
    }
  }
  .header-r {
      width: 433px;
      line-height: 41px;
      text-align: center;
      color: #fff;
      span {
          float: right;
          margin-right: 20px;
          font-size: 26px;
          color: #7e7e7e;
          &:hover {
              cursor: pointer;
              color: #666;
          }
      }
  }
}
.g_content ul{
    float: left;
    width: 553px;
    height: 260px;
    border-right: 6px solid #0F1011;
    box-sizing: border-box;
    background-color: #1A1B1C;
    li {
        display: flex;
        justify-content: space-between;
        margin: 10px 20px;
        div span {
            margin: 0 20px;
        }
        .s_name {
            color: #7e7e7e;
            &:hover {
                color: #fff;
                cursor: pointer;
            }
        }
        .e_name {
            color: #7e7e7e;
            i:hover {
                text-decoration: underline;
                cursor: pointer;
                color: #fff;
            }
        }
        .s_time {
            color: #7e7e7e;
            &:hover {
                color: #fff;
                cursor: pointer;
            }
        }
    }
}
.lrc {
    float: left;
    width: 433px;
    height: 260px;
    overflow: hidden;
    background-color: #1E1F21;
    div {
        margin-top: 30px;
        text-align: center;
        color: #7e7e7e;
    }
}
</style>