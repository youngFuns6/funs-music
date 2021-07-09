import { request } from "./request";
export function getAlbumComment(queryInfo) {
    return request({
        url: '/comment/album',
        params: queryInfo

    })
}