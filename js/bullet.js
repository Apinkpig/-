/**
 * 子类：子弹类
 */
var Bullet = function (opts) {
    var opts = opts || {}
    Element.call(this, opts);
}

//继承父类的方法
Bullet.prototype = new Element();
/**
 * 方法：向上移动
 */
Bullet.prototype.fly = function () {
    this.move(0, -this.speed);
    return this;
}
/**
 * 方法：绘制子弹线条
 */
Bullet.prototype.draw = function () {
    context.strokeStyle = '#fff';
    context.beginPath();
    context.moveTo(this.x, this.y);
    context.lineTo(this.x, this.y - this.size);
    context.closePath();
    context.stroke();
    return this;
}
/**
 * 方法：判断是否碰撞
 * @param {*} aim 
 */
Bullet.prototype.crash = function(enemy){
    // 判断四边是否都没有空隙
    if (!(enemy.x + enemy.size < this.x) &&
        !(this.x + 1 < enemy.x) &&
        !(enemy.y + enemy.size < this.y) &&
        !(this.y + this.size < enemy.y)) {
        // 物体碰撞了
        return true;
    }
    return false
}