/**
 * Created by Ryan on 3/29/2017.
 */
function Bird(option){
    this.ctx = option.ctx;
    this.x = option.x;
    this.y = option.y;
    this.img = option.img;
    this.width = this.img.width / 3;
    this.height = this.img.height;
    this.index = 0;
    this.speed = 0;
    this.acc = 0.0003;
    this.maxAngle = 45;
    this.maxSpeed = 0.3;
}

Bird.prototype = {
    constructor: Bird,
    draw: function (deltaTime) {
        this.ctx.save();

        //位移量，下落的高度
        var deltaY = this.speed * deltaTime + this.acc * deltaTime * deltaTime / 2;
        //改变后的速度
        this.speed = this.speed + this.acc * deltaTime;

        //把位移量也计算进来，改变y值
        this.y += deltaY;

        //最大角度 / 最大速度 = 角度 / 速度
        //旋转的角度
        var currentAngle = this.maxAngle / this.maxSpeed * this.speed;
        if(currentAngle > this.maxAngle){
            currentAngle = this.maxAngle;
        }

        this.ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        this.ctx.rotate(this.angleToRadian(currentAngle));

        this.ctx.drawImage(this.img, this.index * this.width, 0, this.width, this.height, -this.width / 2, -this.height /2, this.width, this.height);

        this.index ++;
        this.index %= 3;

        this.ctx.restore();
    },
    angleToRadian: function (angle) {
        return angle / 180 * Math.PI;
    }
}