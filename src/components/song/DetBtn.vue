<template>
  <div>
    <p class="opt_btn">
            <el-button type="primary"
              ><i class="iconfont icon-bofang"></i>播放</el-button
            >
            <el-button type="primary"
              ><i class="iconfont icon-yinle"></i>收藏</el-button
            >
            <el-button type="primary"
              ><i class="iconfont icon-fenxiang1"></i> 分享</el-button
            >
            <el-button type="primary"
              ><i class="iconfont icon-xiazai"></i>下载</el-button
            >
            <el-button type="primary"
              ><i class="iconfont icon-xinxi"></i>评论 <span>({{totalAttr ? totalAttr : '0'}})</span> </el-button
            >
          </p>
  </div>
</template>
    
<script>
  export default {
      name:'DetBtn',
      props: {
        totalAttr: null
      },
    data() {
      return {}
    },
    methods: {}
  }
</script>
    
<style lang='less' scoped>
.opt_btn {
  display: flex;
  justify-content: space-between;
}
</style>