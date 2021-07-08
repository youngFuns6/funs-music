import { request } from "../network/request";

export function getTips(word) {
    return request({
        url: `/search/suggest?keywords=${word}`,
        // paramas: {
        //     keywords: word
        // }
    })
}