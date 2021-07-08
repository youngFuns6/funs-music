import axios from 'axios'
// import { getCookie } from '../utils/cookie'

export function request(config) {
    const instance = axios.create({
        baseURL: 'http://localhost:3000/',
        withCredentials: true  // 允许请求携带 cookie
    })
    instance.interceptors.request.use(config => {
        
        return config
    })
    return instance(config)
}