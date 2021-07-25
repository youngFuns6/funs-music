<template>
  <div>
    <el-row>
      <el-col :span="20" :offset="2">
        <el-carousel :interval="4000" type="card" height="235px">
          <el-carousel-item v-for="(item, index) in bannerInfo" :key="index">
            <h3 class="medium">
              <img :src="item.imageUrl" alt="" @click="saveId(item)" />
            </h3>
          </el-carousel-item>
        </el-carousel>
      </el-col>
    </el-row>
  </div>
</template>
    
<script>
import { mapMutations } from "vuex";
export default {
  name: "banner",
  props: {
    bannerInfo: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {};
  },
  methods: {
    ...mapMutations(["mvIdMutations", "SongIdMutations","albumIdMutations"]),
    // 点击跳转
    saveId(item) {
      // 判断类型 跳转页面
      if (item.targetType === 1004) {
        this.mvIdMutations(item.targetId);
        this.$router.push("/mvdet");
      } else if (item.targetType === 3000) {
        window.open(item.url);
      } else if (item.targetType === 1) {
        this.SongIdMutations(item.targetId);
        this.$router.push("/songs/detail");
      } else if (item.targetType === 10) {
        this.albumIdMutations(item.targetId);
        this.$router.push("/newSongInfo");
      }
    },
  },
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
  height: 100%;
}
</style>