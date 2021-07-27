import axios from 'axios'
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'
// import { getCookie } from '../utils/cookie'

export function request(config) {
    const instance = axios.create({
        baseURL: 'http://localhost:3000/',
        withCredentials: true,  // 允许请求携带 cookie
       
    })
    instance.interceptors.request.use(config => {
        // 请求前显示加载动画
        // Vue.prototype.$loading.service({
        //     lock: true,
        //     text: 'loading',
        //     spinner: 'el-icon-loading',
        //     background: 'rgba(0, 0, 0, 0.7)'
        // })
        Nprogress.start()
        return config
    })
    instance.interceptors.response.use(config => {
        // 响应后关闭加载动画
        // Vue.prototype.$loading.service().close()
        Nprogress.done()
        return config
    })



    return instance(config)
}