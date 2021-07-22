import { request } from "./request";
// 获取 mv 播放地址
export function getMvUrl(id){
    return request({
        url: '/mv/url',
        params: {
            id
        }
    })
}

// 获取 mv 详情
export function getMvDet(id) {
    return request({
        url: '/mv/detail',
        params: {
            mvid: id
        }
    })
}

// 获取 mv 评论
export function getMvComment(queryInfo) {
    return request({
        url: '/comment/mv',
        params: queryInfo
    })
}

// 获取 相关 mv
export function getSimiMv(id) {
    return request({
        url: '/simi/mv',
        params: {
            mvid: id
        }
    })
}