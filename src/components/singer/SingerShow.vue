<template>
  <div>
    <el-card>
      <div>
        <!-- 头部 -->
        <div class="header">
          <h4><slot name="title"></slot></h4>
          <a href="#"><slot name="more"></slot></a>
        </div>
        <slot name="query"></slot>
        <!-- 内容 -->
        <div>
          <div>
            <ul class="content">
              <li v-for="item in ListInfoAttr" :key="item.id">
                <div class="cover">
                  <a href="#" class="mask"></a>
                  <img :src="item.img1v1Url" alt="" />
                </div>

                <p class="clearfix">
                  <a href="#">{{ item.name }}</a>
                  <a href="#" class="iconfont icon-icon--my"></a>
                </p>
              </li>
            </ul>
           
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>
    
<script>

export default {
  name: "SingerShow",
  props: {
    ListInfoAttr: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      loading: false,
    };
  },
  destroyed(){
    this.$emit('clearListInfo')
  },
 
  methods: {},
  
  computed: {},
};
</script>
    
<style lang='less' scoped>
.header {
  height: 50px;
  border-bottom: 2px solid red;
  margin-bottom: 30px;
  h4 {
    float: left;
    font-size: 24px;
    line-height: 50px;
  }
  a {
    float: right;
    line-height: 50px;
    color: #333;
    text-decoration: none;
  }
}

.content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.content li {
  position: relative;
  margin: 20px;
  width: 130px;
  height: 154px;
  .cover {
    width: 130px;
    height: 130px;
  }
  .mask {
    position: absolute;
    left: 0;
    top: 0;
    width: 130px;
    height: 130px;
  }

  img {
    width: 100%;
    height: 100%;
  }
  p {
    margin: 10px 0;
  }
  p a {
    color: #333;
    text-decoration: none;
    &:first-child:hover {
      text-decoration: underline;
    }
  }
  p a:last-child {
    float: right;
  }
}

.kk {
  height: 100%;
}
</style>