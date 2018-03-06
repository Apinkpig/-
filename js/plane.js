/**
 * 子类：飞机类
 */
var Plane = function (opts) {
    var opts = opts || {}
    Element.call(this, opts);

    // 私有属性
    this.minX = opts.minX;
    this.maxX = opts.maxX;
    this.icon = opts.icon;

    // 子弹的属性
    this.bullets = [];
    this.bulletSpeed = opts.bulletSpeed;
    this.bulletSize = opts.bulletSize;
}

//继承Element的方法
Plane.prototype = new Element();

/**
 * 方法：判断是否击中当前元素
 * @param {*} aim 
 */
Plane.prototype.hasHit = function (enemy) {
    var bullets = this.bullets;
    var hasHit = false;
    for (let j = bullets.length - 1; j >= 0; j--) {
        if (bullets[j].crash(enemy)) {
            this.bullets.splice(j, 1);
            hasHit = true;
        }

    }
    return hasHit;
}
/**
 * 方法：左右移动
 * @param {*} direction 
 */
Plane.prototype.translate = function (direction) {
    var speed = this.speed;
    var addX;
    if (direction === 'left') {
        // 判断是否移动到最左边
        addX = this.x < this.mixX ? 0 : -speed;
    } else {
        // 同理，判断是否移动到最右边
        addX = this.x > this.maxX ? 0 : speed;
    }
    this.move(addX, 0);
    return this;
}
/**
 * 方法：射击
 */
Plane.prototype.shoot = function () {
    // 子弹是在飞机中间发出，设置x位置为飞机中间
    var x = this.x + this.size.width / 2;
    this.bullets.push(new Bullet({
        x: x,
        y: this.y,
        size: this.bulletSize,
        speed: this.bulletSpeed
    }));
    return this;
}
/**
 * 方法：更新子弹状态
 */
Plane.prototype.updateBullets = function () {
    var bullets = this.bullets;
    var i = bullets.length;
    // 遍历更新
    while (i--) {
        var bullet = bullets[i];
        bullet.fly();
        // 判断子弹y坐标是非超出canvas的顶部，超出就删除
        if (bullet.y <= 0) {
            bullets.splice(i, 1);
        }
    }
}
/**
 * 方法：画子弹
 */
Plane.prototype.drawBullets = function () {
    this.bullets.forEach((bullet) => {
        bullet.draw();
    });
}
/**
 * 方法：画飞机
 */
Plane.prototype.draw = function () {
    context.drawImage(this.icon, this.x, this.y, this.size.width, this.size.height);
    this.drawBullets();
    return this;
}