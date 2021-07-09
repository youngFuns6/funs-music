<template>
  <div class="userInfoBox">
    <div class="sanjiao"></div>
    <div>
      <slot name='level'></slot>
      
    </div>
    <div>
      <slot name='listenSongs'></slot>
    </div>
    <div>
      <slot name='createDays'></slot>
    </div>
  </div>
</template>
    
<script>
  export default {
    name: 'userInfo',
    
    data() {
      return {}
    },
    methods: {}
  }
</script>
    
<style lang='less' scoped>
.userInfoBox {
  position: absolute;
  z-index: 10000;
  left: 80%;
  top: 80px;
  width: 200px;
  background-color: #fff;
  box-shadow: 0 0 2px;
  
  .sanjiao {
    position: absolute;
    z-index: 11111;
    left: 15%;
    top: -60px;
    width: 0;
    height: 0;
    border: 10px solid transparent;
    border-bottom-color:  rgba(rgb(13, 12, 14), .1);
  }
  div {
    margin: 40px 15px;
    color: #000;
    font-size: 14px;
    font-weight: 600;
    
  }
}

</style>