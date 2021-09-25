/*
 * @Description:
 * @Autor: Liou
 * @Date: 2021-09-25 10:53:37
 * @LastEditors: Liou
 * @LastEditTime: 2021-09-25 15:40:30
 */
let component = () => {
    let img = document.createElement('img');
    let div = document.createElement('div');
    div.style.width = "100px";
    div.style.height = "100px";
    div.style.backgroundColor = "pink"
    div.className = "test_url"

    img.src = require('../img/1.jpg');


    let i = document.createElement('i');
    i.className = "iconfont icon-shatan_fangshaishuang"


    document.body.appendChild(img)
    document.body.appendChild(div);
    document.body.appendChild(i)
}
component()