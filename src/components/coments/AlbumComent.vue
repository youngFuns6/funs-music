<template>
  <div>
    <div class="comment">
      <p class="comment-header">
        热门评论
        <span>共{{ albumComentsObj.total }}条评论</span>
      </p>
      <ul>
        <li v-for="item in albumComentsObj.hotComments" :key="item.commentId">
          <div class="avatar">
            <img :src="item.user.avatarUrl" />
          </div>
          <div class="info">
            <a href="#">{{ item.user.nickname }}</a
            >：
            <span>{{ item.content }}</span>
            <p class="rp">{{ item.time | dataFormate }}</p>
          </div>
          <div class="beReplied">
            <div
              class="beReplied_pl"
              v-for="(item, index) in item.beReplied"
              :key="index"
            >
              <span
                ><img :src="item.user.avatarUrl" alt="" />
                <i>{{ item.user.nickname }}</i>：</span
              >
              <span>{{ item.content }}</span>
            </div>
            <el-divider class="line"></el-divider>
          </div>
        </li>
      </ul>
      <div>
        <p class="hot">所有评论</p>
        <el-divider></el-divider>
        <ul>
          <li v-for="item in albumComentsObj.comments" :key="item.commentId">
            <div class="avatar">
              <img :src="item.user.avatarUrl" />
            </div>
            <div class="info">
              <a href="#">{{ item.user.nickname }}</a
              >：
              <span>{{ item.content }}</span>
              <p class="rp">{{ item.time | dataFormate }}</p>
            </div>

            <div class="beReplied">
              <div
                class="beReplied_pl"
                v-for="(item, index) in item.beReplied"
                :key="index"
              >
                <span
                  ><img :src="item.user.avatarUrl" alt="" />
                  <i>{{ item.user.nickname }}</i> ：</span
                >
                <span>{{ item.content }}</span>
              </div>
              <el-divider class="line"></el-divider>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
    
<script>
export default {
  name: "AlbumComent",
  props: {
    albumComentsObj: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {};
  },

  methods: {},
};
</script>
    
<style lang='less' scoped>
.comment-header {
  padding: 40px 0 20px 0;
  border-bottom: 1px solid red;
  font-size: 24px;
  color: #000;
  span {
    font-size: 12px;
    color: #666;
    margin-left: 20px;
  }
}

.hot {
  margin-top: 40px;
}

.comment li {
  position: relative;
  margin: 20px 0;
  font-size: 14px;
  line-height: 1.5;
  .gl {
    height: 20px;
  }
  .info {
    position: relative;
    padding-top: 2px;
  }
  &::after {
    content: "";
    clear: both;
    display: block;
    overflow: hidden;
  }
}

.avatar {
  float: left;
  margin-right: 10px;
  width: 50px;
  height: 50px;
  background-color: pink;
  img {
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
}

.rp {
  position: absolute;
  left: 60px;
  bottom: -30px;
  font-size: 12px;
  color: #666;
}

.info a {
  color: #0c73c2;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
}

.beReplied {
  position: relative;
  margin-top: 50px;
  margin-left: 60px;
  img {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    vertical-align: middle;
    cursor: pointer;
  }
  .beReplied_pl {
    background-color: #545c64;
    padding: 10px 20px;
    span i {
      color: #0c73c2;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
    }
  }
}
// .line {
//   position: absolute;
// }
</style>