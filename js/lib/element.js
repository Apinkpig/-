/**
 * 父类：元素类
 */
var Element = function (opts) {
    var opts = opts || {};
    // 设置坐标，尺寸，移动等
    this.x = opts.x;
    this.y = opts.y;
    this.size = opts.size;
    this.speed = opts.speed;

};
Element.prototype = {
    move: function (x, y) {
        var addX = x || 0;
        var addY = y || 0;
        this.x += x;
        this.y += y;
    }
}