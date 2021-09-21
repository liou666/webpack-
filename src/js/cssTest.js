/*
 * @Description:
 * @Autor: Liou
 * @Date: 2021-09-21 13:51:15
 * @LastEditors: Liou
 * @LastEditTime: 2021-09-21 17:32:23
 */


// import 'css-loader!./css/index.css' 内联loader
import '../css/index.css'
import '../css/test.less'
const a = () => {
    const div = document.createElement("div");
    div.innerHTML = "hello webpack"
    div.className = "content"
    return div
}

document.body.appendChild(a())