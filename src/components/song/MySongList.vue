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
              @mouseenter="showListIcon(item.id, item.userId)"
              @mouseleave="hideListIcon(item.id, item.userId)"
            >
              <span class="create-img">
                <img :src="item.coverImgUrl" alt="" />
              </span>
              <span class="create-dec">
                <p class="name">{{ item.name }}</p>
                <p class="count">{{ item.trackCount }}首</p>
                <p class="time" :id="'b' + item.id">
                  创建时间：{{ item.createTime | dataFormate }}
                </p>
                <p class="opt" :id="'a' + item.id">
                  <span class="iconfont icon-bianji"></span>
                  <span class="iconfont icon-shanchu"></span>
                </p>
              </span>
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
              @mouseenter="showListIcon(item.id, item.userId)"
              @mouseleave="hideListIcon(item.id, item.userId)"
            >
              <span class="collection-img">
                <img :src="item.coverImgUrl" alt="" />
              </span>
              <span class="collection-dec">
                <p class="name">{{ item.name }}</p>
                <p class="count">
                  {{ item.trackCount }}首 by {{ item.creator.nickname }}
                </p>
                <p class="opt" :id="'a' + item.id">
                  <span class="iconfont icon-shanchu"></span>
                </p>
              </span>
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
    showListIcon(id, userId) {
      //   console.log(e.target.lastChild);
      // e.target.lastChild.style.display = 'none '
      // console.log(document.querySelector(`#a${id}`));

      if (this.$store.state.profile.userId === userId) {
        document.querySelector(`#a${id}`).style.display = "block";
        document.querySelector(`#b${id}`).style.display = "none";
      } else {
        document.querySelector(`#a${id}`).style.display = "block";
      }
    },
    // 鼠标离开左侧列表 隐藏 icon
    hideListIcon(id, userId) {
      if (this.$store.state.profile.userId === userId) {
        document.querySelector(`#a${id}`).style.display = "none";
        document.querySelector(`#b${id}`).style.display = "block";
      } else {
        document.querySelector(`#a${id}`).style.display = "none";
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
    // 点击歌单列表事件
    //   clickSong(id){
    //       console.log(document.querySelector(`li[key='${id}']`))
    //   }
  },
};
</script>
    
<style lang='less' scoped>


h4 {
  margin: 20px 0;
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
    background-color: #f8f8f8;
  }

  p {
    line-height: 1.5;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .name {
    float: left;
    margin-left: 10px;
  }

  .count {
    position: absolute;
    left: 60px;
    bottom: 10px;
    color: #ccc;
  }
  .time,
  .opt {
    position: absolute;
    right: 20px;
    bottom: 10px;
    color: #ccc;
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