import Cookies from 'js-cookie'

const CookieKey = '__remember_me'

// 获取 cookie
export function getCookie() {
    return Cookies.get(CookieKey)
}

// 设置 cookie
export function setCookie(value) {
    return Cookies.set(CookieKey, value)
}

// 删除 cookie
export function removeCookie() {
    return Cookies.remove(CookieKey)
}