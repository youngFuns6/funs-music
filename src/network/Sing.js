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
        params: { id }

    })

}

// 获取专辑歌手描述
export function getAlbumDet(value) {
    return request({
        url: `/artist/desc`,
        params: {
            id: value
        }

    })
}

// 获取相似歌手
export function getSimiSinger(value) {
    return request({
        url: `/simi/artist`,
        params: {
            id: value
        }

    })
}

// 获取歌单详情 不完整
export function getPlaylistDet(value) {
    return request({
        url: `/playlist/detail`,
        params: {
            id: value
        }

    })
}

// 获取歌单分类
export function getPlaylistCat() {
    return request({
        url: `/playlist/catlist`,

    })
}

// 获取歌单（网友精选单）
export function getPlaylistTop(queryInfo) {
    return request({
        url: `/top/playlist`,
        params: queryInfo
    })
}


// 获取音乐 url
export function getSongUrl(id) {
    return request({
        url: '/song/url',
        params: { id }

    })

}

