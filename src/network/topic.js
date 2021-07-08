import { request } from "./request";

export function getHotTopic() {
    return request({
        url: '/search/hot/detail',

    })

}