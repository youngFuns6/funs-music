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
  Pagination

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


Vue.prototype.$message = Message

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
