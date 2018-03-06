/**
 * 键盘控制
 */
var KeyBoard = function () {
    var self = this;
    // 监听键盘按下事件
    document.addEventListener('keydown', function (event) {
        self.keydown(event)
    })
    // 键盘按键释放时触发
    document.addEventListener('keyup', function (event) {
        self.keyup(event);
    })
}

KeyBoard.prototype = {
    pressLeft: false,//点击左键
    pressRight:false,//点击右键
    pressX:false,//点击X键（用来发射子弹的）
    pressUp:false, //点击上键（也是用来发射子弹）
    keydown:function(event){
        // 获取键位
        var key = event.keyCode;
        switch (key) {
            case 88:
                this.pressX = true;
                break;
            case 37:
                this.pressLeft = true;
                break;
            case 38:
                this.pressUp = true;
                break;
            case 39:
                this.pressRight = true;
                break;
        }
    },
    keyup:function(event){
        var key = event.keyCode;
        switch (key) {
            case 88:
                this.pressX = false;
                break;
            case 37:
                this.pressLeft = false;
                break;
            case 39:
                this.pressRight = false;
                break;
        }
    }
}