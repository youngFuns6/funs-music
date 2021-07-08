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