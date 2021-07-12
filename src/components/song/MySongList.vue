<template>
  <div>
    <el-card>
      <div class="create">
        <h4>
          <span @click="showCreateList"
            ><i class="iconfont icon-jiantou ani-jiantou1"> </i
            ><i class="fw"
              >创建的歌单({{ songListObjAttr.createSongList.length }})</i
            ></span
          >
          <span class="iconfont icon-tianjia">新建</span>
        </h4>
        <div>
          <ul class="create-list create-list-show">
            <li
              v-for="item in songListObjAttr.createSongList"
              :key="item.id"
              @mouseenter="showListIcon(item, item.userId)"
              @mouseleave="hideListIcon(item, item.userId)"
              @click="getListDet(item)"
            >
              <span class="create-img">
                <img :src="item.coverImgUrl" alt="" />
              </span>
              <div class="create-dec">
                <p class="name">{{ item.name }}</p>
                <p class="count">{{ item.trackCount }}首</p>
                <p class="time" :id="'b' + item.id">
                  {{ item.createTime | dataFormate }}
                </p>
                <p class="opt" :id="'a' + item.id">
                  <span
                    class="iconfont icon-bianji"
                    @click.stop="editPlaylistFun(item.id)"
                  ></span>
                  <span class="iconfont icon-shanchu"></span>
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="collection">
        <h4>
          <span @click="showCollectionList"
            ><i class="iconfont icon-jiantou ani-jiantou2"> </i
            ><i class="fw"
              >收藏的歌单({{ songListObjAttr.collectionSongList.length }})</i
            ></span
          >
        </h4>
        <div>
          <ul class="collection-list">
            <li
              v-for="item in songListObjAttr.collectionSongList"
              :key="item.id"
              @mouseenter="showListIcon(item, item.userId)"
              @mouseleave="hideListIcon(item, item.userId)"
              @click="getListDet(item)"
            >
              <span class="collection-img">
                <img :src="item.coverImgUrl" alt="" />
              </span>
              <div class="collection-dec">
                <p class="name">{{ item.name }}</p>
                <p class="count">
                  {{ item.trackCount }}首 by
                  <span>{{ item.creator.nickname }}</span>
                </p>
                <p class="opt" :id="'a' + item.id">
                  <span class="iconfont icon-shanchu"></span>
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </el-card>
  </div>
</template>
    
<script>

export default {
  name: "MySongList",
  props: {
    songListObjAttr: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      // 存储列表展示状态
      isShowCreate: true,
      isShowCollection: true,
    };
  },
  methods: {
    // 鼠标经过左侧列表 展示 icon
    showListIcon(item, userId) {
      if (this.$store.state.profile.userId === userId) {
        // 判断是否为 我喜欢的音乐 歌单 是则隐藏该 icon 节点
        if (item.name === `${this.$store.state.profile.nickName}喜欢的音乐`) {
          // console.log("111");
          document.querySelector(`#a${item.id}`).style.display = "none";
        } else {
          document.querySelector(`#a${item.id}`).style.display = "block";
          document.querySelector(`#b${item.id}`).style.display = "none";
        }
      } else {
        document.querySelector(`#a${item.id}`).style.display = "block";
      }
    },
    // 鼠标离开左侧列表 隐藏 icon
    hideListIcon(item, userId) {
      if (this.$store.state.profile.userId === userId) {
        document.querySelector(`#a${item.id}`).style.display = "none";
        document.querySelector(`#b${item.id}`).style.display = "block";
      } else {
        document.querySelector(`#a${item.id}`).style.display = "none";
      }
    },

    // 点击展开隐藏歌单列表
    showCreateList() {
      if (this.isShowCreate) {
        document.querySelector(".create-list-show").style.height = "0px";
        document.querySelector(".ani-jiantou1").style.transform =
          "rotateZ(0deg)";
        this.isShowCreate = false;
      } else {
        document.querySelector(".create-list-show").style.height = "";
        document.querySelector(".ani-jiantou1").style.transform =
          "rotateZ(90deg)";
        this.isShowCreate = true;
      }
    },
    showCollectionList() {
      if (this.isShowCollection) {
        document.querySelector(".collection-list").style.height = "0px";
        document.querySelector(".ani-jiantou2").style.transform =
          "rotateZ(0deg)";
        this.isShowCollection = false;
      } else {
        document.querySelector(".collection-list").style.height = "";
        document.querySelector(".ani-jiantou2").style.transform =
          "rotateZ(90deg)";
        this.isShowCollection = true;
      }
    },
    // 点击歌单列表获取歌单详情
    getListDet(item) {
      // console.log("666");
      this.$emit("sendPlaylistId", item);
      // console.log(document.querySelector(`li[key='${id}']`));
    },
    
  },
};
</script>
    
<style lang='less' scoped>
h4 {
  margin: 20px 0;
  // background-color: #fff;
}
.create .icon-jiantou {
  color: #ccc;
  cursor: pointer;
}

.icon-tianjia {
  padding: 5px;
  border: 1px solid #ccc;
  font-size: 12px;
  background-color: #f3f3f3;
  margin-left: 60px;
  cursor: pointer;
  &:hover {
    background-color: #fff;
  }
}

.collection .icon-jiantou {
  color: #ccc;
  cursor: pointer;
}
.fw {
  color: #000;
  cursor: pointer;
  font-weight: 600;
}

.create-list li::after,
.collection-list li::after,
.collection-dec::after,
.create-dec::after {
  content: "";
  clear: both;
  display: block;
  overflow: hidden;
}

.collection-dec,
.create-dec {
  float: left;
}

.create-img,
.collection-img {
  float: left;
  width: 50px;
  height: 50px;
  img {
    width: 100%;
    height: 100%;
  }
}

.create-list li,
.collection-list li {
  position: relative;
  padding: 10px 0;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    background-color: #999;
  }

  p {
    line-height: 1.5;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .name {
    width: 180px;
    float: left;
    margin-left: 10px;
  }

  .count {
    position: absolute;
    left: 60px;
    bottom: 10px;
    width: 180px;
    color: #303133;
    span {
      cursor: pointer;
      &:hover {
        text-decoration: underline;
        color: #eee;
      }
    }
  }
  .time,
  .opt {
    position: absolute;
    right: 20px;
    bottom: 10px;
    color: #303133;
    span {
      margin: 0 10px;
    }
  }
  .opt {
    display: none;
  }
}

.icon-shanchu,
.icon-bianji {
  &:hover {
    color: #666;
  }
}

.create-list-show,
.collection-list {
  overflow: hidden;
}

.ani-jiantou1,
.ani-jiantou2 {
  display: inline-block;
  transform: rotateZ(90deg);
}

.mask {
  height: 70px;
}
</style>