import axios from 'axios'
import Vue from 'vue'
// import { getCookie } from '../utils/cookie'

export function request(config) {
    const instance = axios.create({
        baseURL: 'http://localhost:3000/',
        withCredentials: true  // 允许请求携带 cookie
    })
    instance.interceptors.request.use(config => {
        // 请求前显示加载动画
        Vue.prototype.$loading.service({
            lock: true,
            text: '你是最帅的',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
        })
        return config
    })
    instance.interceptors.response.use(config => {
        // 响应后关闭加载动画
        Vue.prototype.$loading.service().close()
        return config
    }

    )
    return instance(config)
}