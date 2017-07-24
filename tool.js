/**
 * Created by Administrator on 2017/7/23.
 */

function randAjax(...args) {
    return new Promise(function (resolve,reject) {
        return $.ajax(...args).then(e => {
            let resObj = JSON.parse(e);
            if(resObj.type === 0){
                resolve(resObj.data);
            }
            else{
                reject(resObj.msg);
            }
        },e => {
            reject(e);
        });
    });
}