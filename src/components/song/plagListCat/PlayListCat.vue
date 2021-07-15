<template>
  <div class="contain">
    <div class="sanjiao"></div>
    <div class="cat_box">
      <div class="cat_h">
        <el-button type="primary" size="mini" @click="queryAll"
          >全部风格</el-button
        >
      </div>
      <div class="content">
        <div>
          <div
            class="big_cat"
            v-for="(value, keyValue) in categoriesAttr"
            :key="keyValue"
          >
            <div>{{ value }}</div>
            <ul>
              <li
                class="small_cat"
                v-for="(item, index) in subObj[keyValue]"
                :key="index"
                @click="queryCat(item)"
              >
                <span>{{ item }}</span>
                <span>{{index === subObj[keyValue].length - 1 ? '' : '|'}}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
    
<script>
export default {
  name: "PlayListCat",
  props: {
    categoriesAttr: {
      type: Object,
      default() {
        return {};
      },
    },
    subAttr: {
      type: Array,
      default() {
        return [];
      },
    },
  },

  data() {
    return {
      // 处理后的 subAttr 数据
      subObj: {},
      // subObj 初始键
      i: 0,
    };
  },
  beforeUpdate() {
    this.subHandle();
  },

  methods: {
    // 递归处理所有 subAttr 数据
    subHandle() {
      this.subObj[this.i] = [];
      this.subAttr.forEach((item) => {
        if (item.category == this.i) {
          this.subObj[this.i].push(item.name);
        }
      });
      // 判断对应 总分类个数
      if (this.i < Object.keys(this.categoriesAttr).length - 1) {
        this.i++;
        this.subHandle();
      }
    },
    // 查询全部
    queryAll() {
      this.$emit('emitQueryAll')
    },
    // 分类查询
    queryCat(item){
      this.$emit('emitQueryCat',item)
    }
  },
  computed: {},
};
</script>
    
<style lang='less' scoped>
.contain{
position: relative;
}
.sanjiao {
  position: absolute;
  left: 150px;
  top: -20px;
  width: 0;
  height: 0;
  border: 10px solid transparent;
  border-bottom: 10px solid #fff;
}
.cat_box {
  background-color: rgba(white, .8);
  box-shadow: 0 0 10px #333;
  width: 700px;
  border-radius: 5px;
  .cat_h {
    border-bottom: 1px solid #666;
   
    .el-button {
     margin: 20px 50px;
    }
  }
}
.big_cat {
  display: flex;
  // justify-content: left;
  align-items: center;
  
  
  div:first-child {
    font-weight: 600;
    padding: 10px 20px;
    width: 75px;
  }
  ul {
    padding: 10px 0 10px 30px;
    
    border-left: 1px solid #666;
    display: flex;
    justify-content: left;
    flex-wrap: wrap;
    width: 550px;
  }
    margin-left: 40px;
    li {
      font-size: 14px;
      margin: 10px 0;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
    span {
      margin: 0 5px;
    }
  }
 

// .small_cat {
//   border-left: 1px solid #666;
// }
</style>