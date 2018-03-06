// 获取元素
var container = document.getElementById('game');
var levelText = document.querySelector('.game-level');
var nextLevelText = document.querySelector('.game-next-level');
// var scoreText = document.querySelector('.game-info .score');
var totalScoreText = document.querySelector('game-info-text .score');

// 获取画布信息
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var canvasWidth = canvas.clientWidth;
var canvasHeight = canvas.clientHeight;




/**
 * 整个游戏对象
 */
var GAME = {
  /**
   * 初始化函数,这个函数只执行一次
   * @param  {object} opts 
   * @return {[type]}      [description]
   */
  init: function (opts) {
    var opts = Object.assign({}, opts, CONFIG);
    var padding = opts.canvasPadding;
    var self = this;

    this.padding = padding;
    // 小怪兽极限坐标
    this.enemyMixX = padding;
    this.enemyMaxX = canvasWidth - padding - opts.enemySize;
    this.enemyLimitY = canvasHeight - padding - opts.planeSize.height;

    // 飞机的极限坐标
    var planeWidth = opts.planeSize.width;
    this.planeMinX = padding;
    this.planeMaxX = canvasWidth - padding - planeWidth;
    // 飞机的位置
    this.planePosX = canvasWidth / 2 - planeWidth / 2;
    this.planePosY = this.enemyLimitY;

    // 更新
    this.status = opts.status || 'start';
    this.score = 0;
    this.keyBoard = new KeyBoard();

    this.opts = opts; //保存opts
    var resources = [
      opts.enemyIcon,
      opts.enemyBoomIcon,
      opts.planeIcon
    ];
    util.resourceOnload(resources, function (images) {
      //更新图片
      opts.enemyIcon = images[0];
      opts.enemyBoomIcon = images[1];
      opts.planeIcon = images[2];
      self.opts = opts;
      self.bindEvent();
    });
  },
  bindEvent: function () {
    var self = this;
    var playBtn = document.querySelector('.js-play');
    var replayBtn = document.querySelectorAll('.js-replay');
    var nextBtn = document.querySelector('.js-next');
    // 开始游戏按钮绑定
    playBtn.onclick = function () {
      self.level = 1;
      self.play();
    };
    replayBtn.forEach((btn) => {
      btn.onclick = function(){
        self.opts.level = 1;
        self.play();
        self.score = 0;
        totalScoreText.innerText = self.score;
      }
    });
    nextBtn.onclick = function(){
      self.opts.level += 1;
      self.play();
    }
  },
  /**
   * 更新游戏状态，分别有以下几种状态：
   * start  游戏前
   * playing 游戏中
   * failed 游戏失败
   * success 游戏成功
   * all-success 游戏通过
   * stop 游戏暂停（可选）
   */
  setStatus: function (status) {
    this.status = status;
    container.setAttribute("data-status", status);
  },
  play: function () {
    var self = this;
    var opts = this.opts;
    var padding = this.padding;
    /**
     * 获取config里面的参数
     */
    var level = opts.level;
    var totalLevel = opts.totalLevel;
    var numPerLine = opts.numPerLine;
    var enemySpeed = opts.enemySpeed;
    var enemySize = opts.enemySize;
    var enemyGap = opts.enemyGap;
    var enemyIcon = opts.enemyIcon;
    var enemyBoomIcon = opts.enemyBoomIcon;
    var planeIcon = opts.planeIcon;


    //先清空对象数组
    this.enemies = [];
    for (var i = 0; i < level; i++) {
      for (var j = 0; j < numPerLine; j++) {
        var initOpt = {
          x: padding + j * (enemySize + enemyGap),
          y: padding + i * enemySize,
          size: enemySize,
          speed: enemySpeed,
          icon: enemyIcon,
          boomIcon: enemyBoomIcon
        };
        this.enemies.push(new Enemy(initOpt));
      }
    }

    var planeIcon = opts.planeIcon;
    // 创建飞机对象
    this.plane = new Plane({
      x: this.planePosX,
      y: this.planePosY,
      minX: this.planeMinX,
      maxX: this.planeMaxX,
      size: opts.planeSize,
      speed: opts.planeSpeed,
      bulletSize: opts.bulletSize,
      bulletSpeed: opts.bulletSpeed,
      icon: planeIcon
    });
    console.log(this.plane);

    this.setStatus('playing');
    this.update();
  },
  /**
   * 更新操作
   */
  update: function () {
    var self = this; //指代本作用域的对象
    var opts = this.opts;

    var padding = opts.padding;

    //清理画布
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    //更新飞机
    this.updatePlane();
    // 更新怪兽
    this.updateEnemies();
    var enemies = this.enemies;
    // 判断没有怪兽的话，游戏结束
    if (enemies.length === 0) {
      // 判断是否全部通过
      var endType = opts.level === opts.totalLevel ? 'all-success' : 'success';
      this.end(endType);
      // 停止动画循环
      return;
    }
    // 判断最后一个怪兽是否到达底部，到达则结束游戏
    if (enemies[enemies.length - 1].y >= this.enemyLimitY) {
      this.end('failed');
      return;
    }


    // 绘制
    this.draw();
    // 循环
    requestAnimationFrame(function () {
      self.update();
    })
  },
  /**
   * 方法：更新怪兽
   */
  updateEnemies: function () {
    var opts = this.opts;
    var padding = opts.padding;
    var enemySize = opts.enemySizel;
    var enemies = this.enemies;
    var plane = this.plane;

    // 判断怪兽是否需要向下移动，默认false
    var enemyNeedDown = false;
    // 获取怪兽移动的极限横坐标
    var enemiesBoundary = util.getHorizontalBoundary(enemies);

    if (enemiesBoundary.minX < this.enemyMixX ||
      enemiesBoundary.maxX > this.enemyMaxX) {
      opts.enemyDirection = opts.enemyDirection === 'right' ? 'left' : 'right';
      enemyNeedDown = true;
    }

    // 循环更新怪兽
    var i = enemies.length;
    while (i--) {
      var enemy = enemies[i];
      if (enemyNeedDown) {
        enemy.down();
      }
      // 怪兽左右移动
      enemy.translate(opts.enemyDirection);

      // 判断怪兽状态
      switch (enemy.status) {
        case 'normal':
          if (plane.hasHit(enemy)) {
            enemy.booming();
          }
          break;

        case 'booming':
          enemy.booming();
          break;
        case 'boomed':
          this.enemies.splice(i, 1);
          this.score += 1;
      }
    }
  },
  /**
   * 方法：更新飞机
   */
  updatePlane: function () {
    this.plane.updateBullets();

    var plane = this.plane;
    var keyBoard = this.keyBoard;
    //判断点击了哪个按键
    if (keyBoard.pressLeft) {
      plane.translate('left');
    }
    if (keyBoard.pressRight) {
      plane.translate('right')
    }
    // 按X键射击子弹
    if (keyBoard.pressX || keyBoard.pressUp) {
      plane.shoot();
      // 射击之后取消
      keyBoard.pressX = false;
      keyBoard.pressUp = false;
    }
  },
  draw: function () {
    // 绘制怪兽
    this.enemies.forEach(function (enemy) {
      enemy.draw();
    });
    // 绘制飞机
    this.plane.draw();
  },
  /**
   * 游戏结束的三种状态
   * all-success
   * success
   * failed
   */
  end: function (type) {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    this.setStatus(type);
  },
};


// 初始化
GAME.init();