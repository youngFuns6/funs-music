import { request } from "../network/request";


// 搜索建议
export function getTips(word) {
    return request({
        url: `/search/suggest?keywords=${word}`,
        
        // params: {
        //     keywords: word
        // }
    })
}

// 搜索结果
export function getResult(queryInfo) {
    return request({
        url: '/cloudsearch',
        params: queryInfo
    })
}