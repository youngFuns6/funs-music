// 导出滑块高度处理函数
// slide 滑块元素
// lrcHeight 真个歌词高度
// wropHeight 歌词容器高度
export function handlerSlide(slider, lrcHeight, wropHeight) {
    // 计算滑块高度
    let slideHeight = wropHeight / lrcHeight * wropHeight  + 'px';
    // 限定滑块高度范围
    if (slideHeight <= '10px') {
        slideHeight = '10px'
    }
    // 如果滑块占比超过 1 则表示容器完全容纳歌词高度 隐藏滑块
    if (wropHeight / lrcHeight >= 1) {
        slider.style.display = 'none'
    }
    // 设置滑块高度
    slider.style.height = slideHeight;
}


// 导出歌词滚动处理函数
// lrcwrop 歌词容器元素
// slide 滑块元素
// lrc 歌词元素
// lineHeight 每行歌词行高
// callback 回调
export function handlerLrcSco(lrcWrop, slide, lrc, callback) {
    
    // 滑块滚动增量
    let y = 0
    // 监听 鼠标滚轮事件
    lrcWrop.addEventListener("mousewheel", (e) => {
        // console.log(e);
        // 阻止默认事件与冒泡
        e.stopPropagation()
        e.preventDefault()
       // 滚动时获取歌词高度
        let lrcHeight = lrc.clientHeight + 40
        // 如果滑块向下滚动
        if (e.wheelDeltaY < 0) {
            // 每次滚动 10 px
            y += 10;
        } else if (e.wheelDeltaY > 0) {
            // 如果滑块向上滚动
            y -= 10;
        }
        // 限制滚动范围
        if (y <= 0) {
            y = 0

        }
        if (y >= lrcWrop.clientHeight - slide.clientHeight) {
            y = lrcWrop.clientHeight - slide.clientHeight
        }
        // 滑块滚动位置
        slide.style.top = y + 'px'
        // 歌词变化位置
        lrc.style.top = -y / lrcWrop.clientHeight * lrcHeight + 'px'
        // console.log(lrc.clientHeight)
        // 通过回调传参
        callback(lrcHeight)
    });
}

export function lrcscroll() {
    
}