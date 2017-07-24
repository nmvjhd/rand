/**
 * Created by Administrator on 2017/7/21.
 */

let Rand = {};  //全局数据对象
let pm = new PageManager();
pm.gotoPage(new LoginPage());


$(document).on('keydown',function (e) {
    if(e.keyCode === 27){
        pm.back();
    }
});

function gotoSurpise() {
    alert('hahaha');
}
