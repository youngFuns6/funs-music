<template>
  <div>
    <el-row>
      <el-col :span="20" :offset="2">
        <el-carousel :interval="4000" type="card" height="235px">
          <el-carousel-item v-for="(item,index) in bannerInfo" :key="index">
            <h3 class="medium"><img :src="item.imageUrl" alt=""></h3>
          </el-carousel-item>
        </el-carousel>
      </el-col>
    </el-row>
  </div>
</template>
    
<script>
export default {
  name: 'banner',
  props: {
    bannerInfo: {
      type: Array,
      default(){
        return []
      }
    }
  },
  data() {
    return {
      
    };
  },
  methods: {},
};
</script>
    
<style lang='less' scoped>
.el-col {
  margin-top: 20px;
}

h3 {
  margin: 0;
}

img {
  width: 100%;
  height: 100% ;
}
</style>