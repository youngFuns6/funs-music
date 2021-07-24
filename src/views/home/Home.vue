<template>
  <div>
    <banner-img :bannerInfo="banner"></banner-img>

    <new-songs @getArea="getAreaInfo"></new-songs>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageInfo.pageNum"
        :page-sizes="[30, 60, 100, 200]"
        :page-size="newSongsInfo.queryInfo.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="newSongsInfo.total"
      >
      </el-pagination>
    </div>
  </div>
</template>
    
<script>
import BannerImg from "../../components/banner/BannerImg.vue"; // 导入 banner 图组件
import NewSongs from "../homeChildren/newSongs.vue"; // 导入新碟组件
import newSongInfo from "../homeChildren/newSongInfo.vue"; // 导入新碟详情组件

import { getBannerImg } from "../../network/bannerImg"; // 导入获取 banner 请求函数
import { getNewSong } from "../../network/Sing"; 

export default {
  name: "home",
  data() {
    return {
      // banner 图数据
      banner: [],
      // 新碟数据信息
      newSongsInfo: {
        // 数据条数
        total: 0,
        // 请求参数
        queryInfo: {
          limit: 30,
          offset: 0,
          area: "",
        },
      },
      pageInfo: {
        //当前页码
        pageNum: 1,
        //总页码
        total: 0,
      },
    };
  },
  methods: {
    // 获取 banner 图数据
    async getBannerImgRef() {
      const { data: res } = await getBannerImg();
      console.log(res);
      if (res.code !== 200) {
        return this.$message.error("获取 banner 图失败");
      }

      this.banner = res.banners;
    },

    // 获取新碟数据
    async getNewSongsRef() {
      const { data: res } = await getNewSong(this.newSongsInfo.queryInfo);
      // console.log(res);
      if (res.code !== 200) {
        return this.$message.error("新碟列表请求失败");
      }
      this.$store.state.resSongs = res.albums;
      this.newSongsInfo.total = res.total;
    },
    // 监听页面数据个数事件
    handleSizeChange(pageSize) {
      this.newSongsInfo.queryInfo.limit = pageSize;
      this.getNewSongsRef();
    },
    // 监听当前页改变事件
    handleCurrentChange(pagenum) {
      this.pageInfo.pageNum = pagenum;
      this.newSongsInfo.queryInfo.offset =
        (this.pageInfo.pageNum - 1) * this.newSongsInfo.queryInfo.limit;
      this.getNewSongsRef();
    },
    // 获取 newSongs 子组件 传来的地区切换数据
    getAreaInfo(areaInfo) {
      // console.log(areaInfo)
      this.newSongsInfo.queryInfo.area = areaInfo;
      // 将请求数据的偏移量重置为 0
      this.newSongsInfo.queryInfo.offset;
      this.getNewSongsRef();
    },

    
  },
  created() {
    this.getBannerImgRef();
    this.getNewSongsRef();
  },
  components: {
    BannerImg,
    NewSongs,
    newSongInfo
  },
};
</script>
    
<style lang='less' scoped>
.pagination {
  display: flex;
  justify-content: center;
  margin-bottom: 50px;
}
</style>