import { request } from "../network/request";
import Vue from 'vue'


export function getTips(word) {
    
    
    return request({
        url: `/search/suggest?keywords=${word}`,
        
        // paramas: {
        //     keywords: word
        // }
    })
}