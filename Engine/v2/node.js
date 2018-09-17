let NodeID = 0;

function Node(value) {
    this.id = NodeID++;
    this.value = value;
    this.number = null;
    this.edges = [];

    this.add = function(val = 1){
        this.value += val;
        if (this.number != null){
            this.number.setNumber(this.value);
        }
    }

    this.sub = function(val = 1) {
        this.value -= val;
        if (this.number != null) {
            this.number.setNumber(this.value);
        }
    }

    this.addEdge = function(edge) {
        this.edges.push(edge);
    }

    this.getEdgeIDs = function() {
        return this.edges.map(c => c.id);
    }

    this.getEdgeCount = function() {
        return this.edges.length;
    }

    this.send = function() {
        let id = this.id;
        this.edges.forEach(e => {
            e.add();
        });
        this.sub(this.edges.length);
    }
}

function Edge(nodeA, nodeB) {
    this.nodeA = nodeA;
    this.nodeB = nodeB;
    this.runInit = true;
    this.spriteA = null;
    this.spriteB = null;

    this.init = function() {
        this.spriteA = this.nodeA.number.sprite; 
        this.spriteB = this.nodeB.number.sprite;
        this.line = new Line(
            {x: this.spriteA.x, y: this.spriteA.y},
            {x: this.spriteB.x, y: this.spriteB.y},
            1
        );
        Engine.addSprite(this.line.sprite);
        this.init = true;
    }

    this.update = function() {
        if (this.runInit) {
            this.init();
            this.runInit = false;
            return;
        }
        this.line.update(
            {x: this.spriteA.x, y: this.spriteA.y},
            {x: this.spriteB.x, y: this.spriteB.y}
        );
    }
}