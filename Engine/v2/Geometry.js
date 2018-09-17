function Geometry(points, text) {
    this.points = copyPtArray(points);
    this.texture = text;

    this.minX = Number.MAX_SAFE_INTEGER;
    this.minY = Number.MAX_SAFE_INTEGER; 
    this.maxX = Number.MIN_SAFE_INTEGER;
    this.maxY = Number.MIN_SAFE_INTEGER;

    points.forEach(pts => {
        pts.forEach(pt => {
            this.minX = pt.x < this.minX ? pt.x : this.minX;        
            this.minY = pt.y < this.minY ? pt.y : this.minY;        
            this.maxX = pt.x > this.maxX ? pt.x : this.maxX;        
            this.maxY = pt.y > this.maxY ? pt.y : this.maxY;        
        })
    });
    
    this.boundingBox = {
        x: this.minX,
        y: this.maxY,
        width: this.maxX - this.minX,
        height: this.maxY - this.minY
    }

    this.transform = function(x, y) {
        return new Geometry(this.points.map(pts => pts.map(p => {p.x += x; p.y += y; return p})),this.texture);
    }

    this.scale = function(x, y) {
        return new Geometry(this.points.map(pts => pts.map(p => {p.x *= x; p.y *= y; return p})),this.texture);
    }
}

function point(x, y) {
    this.x = x,
    this.y = y
}

function p(x, y){
    return new point(x, y);
}

function copyPtArray(points) {
    let ret = [];
    let i = 0;
    points.forEach(seg => {
        ret.push([]);
        seg.forEach(pt => {
            ret[i].push(p(pt.x, pt.y));
        });
        i++;
    });
    return ret;
}
