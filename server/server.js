/**
 * Created by Administrator on 2017/7/22.
 */
let http = require("http");
let url = require("url");
let fs = require('fs');

let {RequestManager,ResponseHandler,ResponseType} = require('./RequestManager');


let resultItems = [];
let rm = new RequestManager();
rm.add('saveNum',function (req,res) {
    let postData = "";
    // 数据块接收中
    req.addListener("data", function (postDataChunk) {
        postData += postDataChunk;
    });
    // 数据接收完毕，执行回调函数
    req.addListener("end", function () {
        let item = JSON.parse(postData);
        console.log(item);

        if(resultItems.find(currentItem => currentItem.userName === item.userName)){
            new ResponseHandler(ResponseType.DUPLICATE_NAME,"你已经玩过了").exec(res);
            return;
        }

        resultItems.push(item);
        new ResponseHandler(ResponseType.SUCCESS).exec(res);
    });
});

rm.add('query',function (req,res) {
    console.log(req.url);

    new ResponseHandler(ResponseType.SUCCESS,'',resultItems).exec(res);
});

http.createServer(function(req, res) {
    console.log('request received,url: ' + req.url);

    rm.process(req,res);
}).listen(8888);
console.log('server started at 8888');