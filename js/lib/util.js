// requestAnimFrame兼容写法
window.requestAnimFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
        window.setTimeout(callback, 1000 / 30);
    }


/**
 * 资源加载
 * @param {*} resource 资源列表 
 * @param {*} callback 
 */
function resourceOnload(resources, callback) {
    var total = resources.length;
    var finish = 0;
    var images = [];
    for (var i = 0; i < total; i++) {
        images[i] = new Image()
        images[i].src = resources[i]
        images[i].onload = function () {
            finish++
            if (finish == total) {
                callback(images);
            }
        }

    }
}
/**
 * 方法：获取怪兽的水平边界
 */
function getHorizontalBoundary(arrs) {
    var minX, maxX;
    arrs.forEach(function (item) {
        if (!minX && !maxX) {
            minX = item.x;
            maxX = item.x;
        } else {
            if (item.x < minX) {
                minX = item.x;
            }
            if (item.x > maxX) {
                maxX = item.x
            }
        }
    });
    return {
        minX: minX,
        maxX: maxX
    }
}

var util = {
    resourceOnload: resourceOnload,
    getHorizontalBoundary: getHorizontalBoundary
}
