<template>
  <div>
    vue组件
  </div>
</template>
    
<script> 
 import { getHotTopic } from "../../network/topic";// 热门话题 网络请求
  export default {
   
    data() {
      return {}
    },
    created() {
      this.getHotTopicRef()
    },
    methods: {
      async getHotTopicRef(){
        const {data: res} = await getHotTopic()
        console.log(res)
      }
    }
  }
</script>
    
<style lang='less' scoped>
</style>