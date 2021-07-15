import { request } from "./request";
// 获取歌手
export function getSingerType(queryInfo) {
    return request({
        url: '/artist/list',
        params: queryInfo
    })
}

// 获取热门歌手
export function getHotSinger(queryInfo) {
    return request({
        url: '/top/artists',
        params: queryInfo
    })
}

// 获取歌手描述
export function getSingerDesc(id) {
    return request({
        url: '/artist/desc',
        params: {
            id: id
        }

    })

}

// 获取歌手详情及单曲
export function getArtists(id) {
    return request({
        url: '/artists',
        params: {
            id: id
        }
    })
}

// 获取歌手专辑
export function getSingerAl(queryInfo) {
    return request({
        url: '/artist/album',
        params: queryInfo
    })
}
// 获取歌手MV
export function getSingerMv(id) {
    return request({
        url: '/artist/mv',
        params: {
            id,
            limit: 50
        }
    })
}