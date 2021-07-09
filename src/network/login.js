import { request } from "./request";

// 获取二维码的key
function getQrKey() {
    return request({
        url: '/login/qr/key'
    })
}

// 生成二维码
export function getQr() {
    return request({
        url: `/login/qr/create?key=${getQrKey().then((res) => { res.data.unikey })}&qrimg=66`
    })
}

export function statusQr() {
    return request({
        url: `/login/qr/check?key=${getQrKey().then((res) => { res.data.unikey })}`
    })
}

export function loginPh(ph, md5_pw) {
    return request({

        url: `/login/cellphone`,
        params: {
            phone: ph,
            // password: pw,
            md5_password: md5_pw
        }
    })
}

// 获取用户信息
export function getUserInfo(id) {
    return request({
        url: `/user/detail?uid=${id}`,

    })
}

// 退出登录
export function getQuit() {
    return request({
        url: `/logout`,

    })
}