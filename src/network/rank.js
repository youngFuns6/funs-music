import { request } from "./request";
// 获取所有榜单
export function getToplist() {
    return request({
        url: '/toplist'
    })
}

// 获取榜单概要 （非榜单详情）
export function getToplistDet() {
    return request({
        url: '/toplist/detail'
    })
}