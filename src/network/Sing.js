import { request } from "./request";

// 获取歌手信息
export function getSinger() {
    return request({
        url: '',

    })

}

// 获取新碟信息
export function getNewSong(info) {
    return request({
        url: '/album/new',
        params: info

    })

}

// 获取新碟详情
export function getNewSongInfo(id) {
    return request({
        url: '/album',
        params: {id}

    })

}

// 获取专辑动态信息
export function getAlbumDet(id) {
    return request({
        url: `/artist/detail?id=${id}`,
       
    })
}

// 获取音乐 url
export function getSongUrl(id) {
    return request({
        url: '/song/url',
        params: {id}

    })

}

