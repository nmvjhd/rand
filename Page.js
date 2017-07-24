/**
 * Created by Administrator on 2017/7/22.
 */
const DOMAIN = "http://localhost:8888";
const ADMINUSER = "马瑜";
const CANLOGINUSER = ["张三","李四","王五"];

/*page基类*/
class Page{
    enter(){}

    exit(){}
}

/*登陆page*/
class LoginPage extends Page{
    constructor(){
        super();
    }

    enter(){
        this.initDom();
        this.bindEvents();
    }

    exit(){
        this.removeDom();
    }

    initDom(){
        this.$tpl = $(`
            <div class="login-page">
                <div class="login-bg"></div>
                <form class="login-form">
                    <div class="form-group">
                        <h5 class="text-center">登陆</h5>
                    </div>
                    <div class="form-group">
                        <input type="text" class="form-control user-name" placeholder="用户名">
                    </div>
                    <div class="form-group">
                        <button type="submit" class="btn btn-default login-button">Login</button>
                    </div>
                </form>
            </div>
         `);

        this._$userName = $('.user-name',this.$tpl);
        this._$loginButton = $('.login-button',this.$tpl);

        this.$tpl.appendTo(document.body);
    }

    removeDom(){
        this.$tpl.remove();
    }

    bindEvents(){
        this._$loginButton.on('click',this._loginClicked.bind(this));
    }

    _loginClicked(){
        let userName = this._$userName.val();
        if(userName === ADMINUSER){
            pm.gotoPage(new QueryPage());
            return;
        }
        if(!this._validate(userName)){
            return ;
        }

        Rand.user = {
            userName: userName
        };
        pm.gotoPage(new SurpisePage());
    }

    _validate(userName) {
        let nameGroup = CANLOGINUSER;
        if(!userName){
            alert('请输入用户名');
            return false;
        }
        if(nameGroup.indexOf((userName)) === -1){
            alert('请输入正确的用户名');
            return false;
        }

        return true;
    }
}

/*抽题page*/
class SurpisePage extends Page{
    constructor(){
        super();
    }

    enter(){
        this.initDom();
        this.bindEvents();
    }

    exit(){
        this.removeDom();
    }


    initDom(){
        this.$tpl = $(`
            <div class="surprise-page">
                   <div class="bg-circle">
                         <img src="img/bg-circle2.png">              
                    </div>
                   <div class="arrow">
                        <img src="img/arrow.png">
                    </div>
            </div>
        `);

        this.$bgCircleImg = $('.bg-circle img',this.$tpl);
        this.$arrow = $('.arrow',this.$tpl);

        this.$tpl.appendTo(document.body);
    }

    removeDom(){
        this.$tpl.remove();
    }

    bindEvents(){
        this.$arrow.on('click',this._arrowClicked.bind(this));
        this.$bgCircleImg.on('webkitAnimationEnd',this._animationEnd.bind(this));
    }

    _arrowClicked(){
        this._createAnimation();

        this.$bgCircleImg.css({
            "animation": "rotate 1s 1 linear",
            "animation-fill-mode": "forwards"
        });

    }

    _createAnimation(){
        let deg = Math.random() * 360 + 360;
        this.deg = deg;

        let $animateStyle = $('.rotate-animate-style');
        if($animateStyle){
            $animateStyle.remove();
        }

        let $animate = $(`
            <style class="rotate-animate-style">
                @keyframes rotate {
                    from {
                        transform: rotate(0deg);
                    }
        
                    to {
                        transform: rotate(${deg}deg);
                    }
                }
            </style>
        `);

        $animate.appendTo(document.head);
    }

    _animationEnd(){
        console.log('动画结束');

        // this.$bgCircleImg.css({
        //     animation: "none"
        // })
        let num = parseInt((this.deg - 360) / (360/8)) + 1;
        alert(`您转到了${num}`);
        this._sendNum(Rand.user.userName,num);

        pm.back();
    }

    _sendNum(userName,num){
        randAjax({
            url : `${DOMAIN}/saveNum/`,
            type : "POST",
            contentType: "application/json;charset=utf-8",
            data : JSON.stringify({'userName':userName,'num':num}),
            dataType : "text"
        }).then(function () {
            alert('保存成功');
        },function () {
            alert('保存失败，请刷新重试');
        })
    }
}

/*查询page*/
class QueryPage extends Page{
    constructor(){
        super();
    }

    enter(){
        this.fetchData().then(data => {
            this.data = data;
            this.initDom();
        });
    }


    exit(){
        this.removeDom();
    }


    fetchData(){
        return randAjax({
            url:`${DOMAIN}/query/`,
            type: "GET",
            contentType: "application/json;charset=utf-8"
        });
    }

    initDom(){
        this.$tpl = $(`
            <div class="query-page">
                <h1 class="text-center">题目列表</h1>
                <table class="table table-bordered table-hover">
                     <thead>
                      <th>姓名</th>
                      <th>编号</th>
                    </thead>
                    
                    ${this.data.map(item => `
                        <tr>
                           <td>${item.userName}</td>
                           <td>${item.num}</td>
                        </tr>`).join('\n')
                    }
                </table>
            </div>
        `);


        this.$tpl.appendTo(document.body);
    }

    removeDom(){
        this.$tpl.remove();
    }
}

/*page管理*/
class PageManager{
    constructor(){
        this.pageStack = [];
    }

    gotoPage(page){
        if(this.topPage()){
            this.topPage().exit();
        }

        page.enter();
        this.pageStack.push(page);
    }

    back(){
        if(this.pageStack.length === 0){
            throw new Error('no before page');
        }

        this.topPage().exit();
        this.pageStack.splice(this.pageStack.length -1,1);
        this.topPage().enter();
    }

    topPage(){
        if(this.pageStack.length === 0){
            return null;
        }
        else{
            return this.pageStack[this.pageStack.length - 1];
        }
    }
}