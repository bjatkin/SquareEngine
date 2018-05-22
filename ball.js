function wall(context, settings) {
    this.ctx = context;
    this.origin = settings.x;
    this.x = settings.x;
    this.y = settings.y;
    this.height = settings.height;
    this.width = settings.width;
    this.speed = settings.speed;
    this.scroll = function(){
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(this.x - 2, this.y - 2, this.width + 4, this.height + 4);
        ctx.fillStyle = '#000000';
        this.x-=this.speed;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        if (this.x < -this.width) {
            this.x = this.origin;
        }
    }
    this.checkCollision = function(x, y, width, height) {
        //make the four points
        points = [{x: x, y: y}, {x: x + width, y: y}, {x: x + width, y: y + height}, {x: x, y: y + height}]
        collided = false;
        points.forEach(p => {
            if (p.x > this.x && p.x < this.x + this.width && p.y > this.y && p.y < this.y + height) {
                collided = true;
            }
        });
        return collided;
    }
}