/**
 * 获取el内部可用高度(除去el的border和padding后)
 * @param el 容器
 */
export const getAvailableHeight = (el: HTMLElement): number => {
    let style = getComputedStyle(el);
    let h = parseFloat(style.height);
    let bh = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
    let ph = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
    return h - bh - ph;
}
/**
 * 获取容器el整体 + margin部分高度.
 * @param el 容器
 */
export const getHeightWithMargin = (el: HTMLElement): number => {
    if(!el){
        return 0;
    }
    let style = getComputedStyle(el);
    return parseFloat(style.height) - parseFloat(style.marginTop) - parseFloat(style.marginBottom);
}
/**
 * 获取el高度方向的边框+padding+margin和.
 * @param el
 */
export const getOutlineHeight = (...el: HTMLElement[]): number => {
    let h = 0;
    el.forEach((elm)=>{
        if(!elm){
            return;
        }
        let style = getComputedStyle(elm);
        h += parseFloat(style.marginBottom) + parseFloat(style.marginTop) +
        parseFloat(style.paddingTop) + parseFloat(style.paddingBottom) +
        parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
    })
    return h;
}