function Camera(canvasID, x = 0, y = 0, z = 1, bg = new RGBA(255, 255, 255, 255)){
    this.x = x;
    this.y = y;
    this.z = z;
    this.camera = document.getElementById(canvasID);
    this.width = this.camera.getAttribute('width');
    this.height = this.camera.getAttribute('height');
    this.ctx = this.camera.getContext('2d');
    this.bg = bg;
    this.newObject = false; 

    this.clear = function() {
        this.ctx.rect(0, 0, this.width, this.height);
        this.ctx.fillStyle = this.bg.getHex();
        this.ctx.fill();
    }

    this.setHeight = function(height){
        Engine.mainCamera.height = height;
        Engine.mainCamera.camera.height = height;
    }

    this.setWidth = function(width){
        Engine.mainCamera.width = width; 
        Engine.mainCamera.camera.width = width;
    }

    this.startObject = function() {
        this.newObject = true;
    }

    this.startPath = function(x, y) {
        if (this.newObject) {
            this.ctx.beginPath();
            this.newObject = false;
        }

        this.ctx.moveTo(x * this.z + this.width/2 - this.x * this.z, -y * this.z + this.height/2 + this.y * this.z);
    }
    
    this.draw = function(x, y) {
        this.ctx.lineTo(x * this.z + this.width/2 - this.x * this.z, -y * this.z + this.height/2 + this.y * this.z);
    }

    this.fill = function(fillStyle) {
        this.ctx.fillStyle = fillStyle;
        this.ctx.fill();
    }
    this.move = function(x, y) {
        this.x += x;
        this.y += y;
    }

    this.moveTo = function(x, y) {
        this.x = x;
        this.y = y;
    }
}