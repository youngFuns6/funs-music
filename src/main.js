import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/global.css'
import './assets/css/normalize.css'
import './assets/css/reset.css'
import './assets/font/iconfont.css'
import md5 from 'js-md5'
Vue.prototype.$md5 = md5



// 按需导入 element ui 组件
import {
  Button,
  Carousel,
  CarouselItem,
  Col,
  Input,
  Menu,
  MenuItem,
  Row,
  Message,
  Form,
  FormItem,
  Autocomplete,
  Card,
  Pagination,
  Table,
  TableColumn,
  Divider,
  Tooltip,
  Loading,
  Tag,
 



} from 'element-ui'


// 注册 element-ui 组件
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Row)
Vue.use(Col)
Vue.use(Input)
Vue.use(Button)
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Autocomplete)
Vue.use(Card)
Vue.use(Pagination)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Divider)
Vue.use(Tooltip)
Vue.use(Tag)





Vue.prototype.$message = Message
Vue.prototype.$loading = Loading


// 时间过滤器
Vue.filter('dataFormate', function (time) {
  let dt = new Date(time);
  let y = dt.getFullYear();
  let m = (dt.getMonth() + 1 + '').padStart(2, '0');
  let d = (dt.getDate() + '').padStart(2, '0');
  return `${y}-${m}-${d}`
})

// 毫秒过滤器
Vue.filter('secondFormate', function (s) {
  let time = parseFloat(s) / 1000;
  if (time != null && time != '') {
    if (time < 60) { return (parseInt(time) + '').padStart(2, '0') }
    else if (time >= 60 && time <= 60 * 60) { return `${(parseInt(parseFloat(time / 60)) + '').padStart(2, '0')}:${(parseInt(parseFloat(time % 60)) + '').padStart(2, '0')}` }
  } else {
    return `${(parseInt(parseFloat(time / 60 / 60)) + '').padStart(2, '0')}:${((parseInt(parseFloat(time / 60 % 60)) + '') + '').padStart(2, '0')}:${(parseInt(parseFloat(time / 60 % 60 * 60 % 60)) + '').padStart(2, '0')}`
  }

})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
