/**
 * 子类：怪兽类
 */

var Enemy = function (opts) {
    var opts = opts || {};
    // 继承
    Element.call(this,opts);
    //私有属性：normal.booming,boomed;
    this.status = 'normal';
    this.icon = opts.icon;
    this.boomIcon = opts.boomIcon; //爆炸的iocn
    // 计算爆炸次数
    this.boomCount = 0;
}

Enemy.prototype = new Element();
/**
 * 原型方法：
 * down：向下移动一个身位(大小相当于自己的size)
 */
Enemy.prototype.down = function () {
    this.move(0, this.size);
    return this;
}
Enemy.prototype.booming = function(){
    this.status = 'booming';
    this.boomCount += 1;
    // 判断：当大于三帧的时候就爆炸结束
    if (this.boomCount > 4) {
        this.status = 'boomed'
    }
    return this;
}
/**
 * 原型方法：
 * translate：左右移动
 * direction：方向（左右）
 */
Enemy.prototype.translate = function (direction) {
    if (direction === 'left') {
        this.move(-this.speed, 0);
    } else {
        this.move(this.speed, 0);
    }
    return this;
}
/**
 * 原型方法：draw绘制
 */
Enemy.prototype.draw = function () {
    switch (this.status) {
        case 'normal':
            context.drawImage(this.icon, this.x, this.y, this.size, this.size);
            break;

        case 'booming':
            context.drawImage(this.boomIcon, this.x, this.y, this.size, this.size);
            break;
    }
    return this;
}