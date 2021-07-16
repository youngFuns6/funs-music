import { request } from "./request";

// 获取专辑评论
export function getAlbumComment(queryInfo) {
    return request({
        url: '/comment/album',
        params: queryInfo

    })
}

// 获取歌单评论
export function getPlayComment(queryInfo) {
    return request({
        url: '/comment/playlist',
        params: queryInfo

    })
}

// 获取歌曲评论
export function getSongComment(queryInfo) {
    return request({
        url: '/comment/music',
        params: queryInfo

    })
}