function Sprite(geo, text, layer = 0){
    //check to make sure geometires is an array if not make it one
    this.layer = layer;
    this.geometries = geo;
    this.text = text; 
    this.x = 0;
    this.y = 0;
    this.scaleCurr = {
        x: 1,
        y: 1,
    }
    
    this.updateGeometry = function(geo, text) {
        this.geometries = geo;
        this.text = text;
    }

    this.move = function(x, y) {
        this.x += x;
        this.y += y;
    }

    this.moveTo = function(x, y) {
        this.x = x;
        this.y = y;
    }
   
    this.scale = function(x, y) {
        this.scaleCurr.x += x;
        this.scaleCurr.y += y;
    }
    
    this.scaleTo = function(x, y) {
        this.scaleCurr.x = x;
        this.scaleCurr.y = y;
    }

    this.draw = function(camera) {
        this.geometries.forEach((geo) => {
            camera.startObject();
            geo.points.forEach(pointList => {
                pointList.forEach((pt, i) => {
                    t = this.transform(pt, {x: this.x, y: this.y});
                    t = this.scalePt(t, this.scaleCurr);
                    if (i === 0){
                        camera.startPath(t.x, t.y);
                    } else {
                        camera.draw(t.x, t.y);
                    }
                });
            });
            if (this.text != "") {
                camera.fill(this.text);
            } else {
                camera.fill(geo.texture);
            }
        });
    }

    this.scalePt = function(pt, scale) {
        return {x: pt.x * scale.x, y: pt.y * scale.y}
    }

    this.transform = function(pt, transform) {
        return {x: pt.x + transform.x, y: pt.y + transform.y};
    }
}