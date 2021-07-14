<template>
  <div>
    <my-song-show :playListInfoAttr='playListInfo'></my-song-show>
  </div>
</template>
    
<script>
import MySongShow from '../../components/song/MySongShow.vue' // 引入歌单展示组件
import {getPlaylistDet} from '../../network/Sing'

  export default {
      name: 'SingListDet',
    data() {
      return {
          // 歌单详情信息
      playListInfo: {
        // 歌单名称
        playlist: {
          // 作者信息
          creator: {},
          // 歌曲
          tracks: [],
        },
      },
      }
    },
    created() {
        this.getPlayListRef()
    },
    methods: {
        async getPlayListRef(){
            console.log('666')
          const {data: res} = await getPlaylistDet(this.$store.state.playListId)
          console.log(res)
          this.playListInfo = res
        }
    },
    components: {
        MySongShow
    }
  }
</script>
    
<style lang='less' scoped>
</style>