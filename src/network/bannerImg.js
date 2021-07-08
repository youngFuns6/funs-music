import { request } from "./request";
export function getBannerImg() {
    return request({
        url: '/banner?type=0'
    })
}