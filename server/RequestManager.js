/**
 * Created by Administrator on 2017/7/22.
 */
const ResponseType = {
    SUCCESS: 0,
    NO_REQ_HANDLER: 1,
    DUPLICATE_NAME: 2,
};

class ResponseHandler{
    constructor(type,msg = '',data = {}){
        if(!type && type !== 0){
            throw new Error('不能没有type');
        }
        if(type !== ResponseType.SUCCESS && msg === ''){
            throw new Error('type不为success时，msg不能为空');
        }
        this.type = type;
        this.msg = msg;
        this.data = data;
    }

    toString(){
        return JSON.stringify(this);
    }

    exec(res){
        res.writeHead(200, {
            "Content-Type": "text/plain;charset=utf-8"
        });
        res.write(this.toString());
        res.end();
    }
}

class RequestManager{
    constructor(){
        this.requestMap = {};
    }
    
    add(type,callback){
        this.requestMap[type] = callback;
    }
    
    process(req,res){
        let reqType = this._getType(req.url);
        let reqCallback = this.requestMap[reqType];
        if(reqCallback){
            return reqCallback(req,res);
        }
        else{
            return new ResponseHandler(ResponseType.NO_REQ_HANDLER,"没有这种类型的处理器").exec(res);
        }
    }

    _getType(url){
        return url.match(/\w+/)[0];
    }
}

module.exports = {RequestManager,ResponseHandler,ResponseType};