function Line(start, end, width = 5) {
    this.width = width;
    this.start = start;
    this.end = end;
    
    this.update = function(start, end) {
        this.start = start;
        this.end = end;
        this.sprite.updateGeometry(
            [new Geometry(this.calcGeometry(start, end), "green")],
            "",
            -1
        );
    }

    this.calcGeometry = function(start, end) {
        let vect = {x: start.x - end.x, y: start.y - end.y};
        let perp = {x: -vect.y, y: vect.x};
        let dist = Math.sqrt((perp.x*perp.x) + (perp.y*perp.y));
        let scaled = {x: perp.x*(this.width/dist), y: perp.y*(this.width/dist)}

        let corners = [[
            p(start.x - scaled.x, start.y - scaled.y),
            p(start.x, start.y),
            p(end.x + scaled.x, end.y + scaled.y),
            p(end.x, end.y)
        ]];

        return corners;
    }

    this.sprite = new Sprite(
        [new Geometry(this.calcGeometry(this.start, this.end), "green")],
        "",
        -1
    );
}