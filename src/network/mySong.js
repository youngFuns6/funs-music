import { request } from "./request";

export function getMyMusic(id) {
    return request({
        url: '/user/playlist',
        params: {
            uid: id
        }

    })

}