/**
 * Created by Ryan on 3/29/2017.
 */
function Pipe(option){
    this.ctx = option.ctx;
    this.x = option.x;
    this.topY = 0;
    this.bottomY = 0;
    this.imgTop = option.imgTop;
    this.imgBottom = option.imgBottom;
    this.picWidth = this.imgTop.width;
    this.picHeight = this.imgTop.height;
    this.speed = 2;
    this.spaceHeight = option.spaceHeight;

    //对象刚创建好，就需要计算一次y值
    this.initY();
}

Pipe.prototype = {
    constructor: Pipe,
    draw: function () {
        this.x -= this.speed;
        if(this.x < -3 * this.picWidth){
            this.x += 3 * this.picWidth * 6;
            //对象重新绘制（重新从右边进入屏幕）的时候，也需要获取一次Y值
            this.initY();
        }

        //1.画上面的管子
        this.ctx.drawImage(this.imgTop, this.x, this.topY);
        this.ctx.rect(this.x, this.topY, this.picWidth, this.picHeight);
        //2.画下面的管子
        this.ctx.drawImage(this.imgBottom, this.x, this.bottomY);
        this.ctx.rect(this.x, this.bottomY, this.picWidth, this.picHeight);

    },
    initY: function () {
        //先确定y的范围
        this.topY = -(Math.random() * 200 + 150);
        this.bottomY = this.topY + this.picHeight + this.spaceHeight;
    }
}