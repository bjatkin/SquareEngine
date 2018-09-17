function Bubble() {
    // this.maxSpeedDecay = 0.99;
    this.bubbles = [];
    this.addBubble = function(bubb) {
        this.bubbles.push(bubb);
    }

    this.init = function(graph) {
        graph.nodes.forEach(n => {
            n.number = new Numbers(n.value);
            this.addBubble(new Bubb(
                graph.getRand(200),
                graph.getRand(200),
                70,
                n.number.sprite,
                false
            ));
        });
    };

    this.run = function() {
        let dirs = [];
        this.bubbles.forEach((bubb, i) => {
            let dir = bubb.computeDir(this.bubbles);
            dirs.push(dir); 
        });

        // let decay = this.maxSpeedDecay;
        this.bubbles.forEach((bubb, i) => {
            bubb.move(dirs[i]);
            // bubb.maxSpeed *= decay;
        });
    }
}
 let nextBub = 0;

function Bubb(x, y, rad, sprite = null, fixed = false) {
    this.id = nextBub++;
    this.radius = rad;
    this.x = x;
    this.y = y;
    this.fixed = fixed;
    this.sprite = sprite;
    this.maxSpeed = 15;
    this.minSpeed = 8; 
    this.oldVect = {x:0, y:0};

    this.move = function(dir) {
        if (this.sprite != null) {
            this.sprite.x = this.x;
            this.sprite.y = this.y;
        }
        if (this.fixed) {
            return;
        }

        //Keep us from going too fast
        scale = 1;
        let vectLen = Math.sqrt(dir.x*dir.x + dir.y*dir.y);
        if (vectLen > this.maxSpeed) {
            scale = (this.maxSpeed/Math.abs(scale * vectLen));
        }
        if (vectLen < this.minSpeed) {
            scale = 0.2;
        }
        
        //prevent jitter
        let diffX = dir.x * scale;
        let diffY = dir.y * scale;
        let net = {x: diffX + this.oldVect.x, y: diffY + this.oldVect.y};

        this.oldVect.x = dir.x * scale;
        this.oldVect.y = dir.y * scale;

        if (Math.abs(net.x*net.x + net.y*net.y) < 0.05) {
            this.fixed = true;
            return;
        }

        this.x += dir.x * scale;
        this.y += dir.y * scale;
    }

    this.computeDir = function(bubbles) {
        let finalDir = {x: 0, y: 0};
        let x = this.x;
        let y = this.y;
        let id = this.id;
        bubbles.forEach(b => {
            if (b.id == id ) {
                return;
            }
            let vect = {x: x - b.x, y: y - b.y};
            let vectLen = Math.sqrt(vect.x*vect.x + vect.y*vect.y);
            let scale = ((b.radius - vectLen)/vectLen);

            finalDir.x += vect.x * scale;// * 0.5;
            finalDir.y += vect.y * scale;// * 0.5;
        });

        finalDir.x *= 0.1;
        finalDir.y *= 0.1;

        return finalDir;
    }
}