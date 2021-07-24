// 导出滑块高度处理函数
// slide 滑块元素
// lrcHeight 真个歌词高度
// wropHeight 歌词容器高度
export function handlerSlide(slider, lrcHeight, wropHeight) {
    // 判断 lrcHeight 高度为 0 给个初始值 因为不给初始值先点击播放再按显示播放列表按钮 此时会获取不到 lrcHeight 高度 导致滑块没有高度
    if (lrcHeight == 0) {
        lrcHeight = 500
    }
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
// callback 
export function handlerLrcSco(lrcWrop, slide, lrc, callback) {
    
    // 滑块滚动增量
    let y = 0
    // 监听 鼠标滚轮事件
    lrcWrop.addEventListener("mousewheel", (e) => {
        // console.log(e);
        // 阻止默认事件与冒泡
        e.stopPropagation()
        e.preventDefault()
       // 滚动时获取歌词高度 40为元素的上下 margin
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
        // 传参
        callback(lrcHeight)
    });
}
