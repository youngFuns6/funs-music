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