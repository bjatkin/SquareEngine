let bubble = new Bubble();
let tracker = new Sprite([new Geometry([[p(1,1),p(-1,1),p(-1,-1),p(1,-1)]],"blue")],"",10);
let levels = [p(3,2),p(3,3),p(4,3),p(4,5),p(5,5),p(5,6),p(7,8),p(8,9),p(10,10),p(10,12),p(12,13),p(15,15),p(15,19),p(17,19),p(20,20)];
let currentLevel = 0;
let winCountdown = -1;

function OnStart(){
//this code will be run before the game engine starts up.
    graph.init(levels[currentLevel].x, levels[currentLevel].y);
    bubble.init(graph);

    Engine.addSprite(tracker);
}

function Update(){
//This code will be run once a frame after all engine variables have been computed.
    bubble.run();
    graph.edges.forEach(e => {e.update()});

    let minX = Number.MAX_SAFE_INTEGER;
    let minY = Number.MAX_SAFE_INTEGER;
    let maxX = Number.MIN_SAFE_INTEGER;
    let maxY = Number.MIN_SAFE_INTEGER;
    graph.nodes.forEach(n => {
        minX = n.number.sprite.x < minX ? n.number.sprite.x : minX;
        minY = n.number.sprite.y < minY ? n.number.sprite.y : minY;
        maxX = n.number.sprite.x > maxX ? n.number.sprite.x : maxX;
        maxY = n.number.sprite.y > maxY ? n.number.sprite.y : maxY;
    });

    let cameraSpeed = 0.5;
    let zoomSpeed = 0.1;
    let visualWidth = Engine.mainCamera.width/Engine.mainCamera.z;
    let visualHeight = Engine.mainCamera.height/Engine.mainCamera.z;
    let padding = 70;
    let panPadding = 3;

    if (visualWidth - padding > maxX - minX && visualHeight - padding > maxY - minY) {
        Engine.mainCamera.z += zoomSpeed;
    } else if (visualWidth - padding * 1.1 < maxX - minX && visualHeight - padding * 1.1 < maxY - minY) {
        Engine.mainCamera.z -= zoomSpeed;
    }

    if (Engine.mainCamera.x + panPadding < (maxX + minX)/2) {
        Engine.mainCamera.move(cameraSpeed, 0);
    }
    if (Engine.mainCamera.x - panPadding > (maxX + minX)/2) {
        Engine.mainCamera.move(-cameraSpeed, 0);
    }
    if (Engine.mainCamera.y + panPadding < (maxY + minY)/2) {
        Engine.mainCamera.move(0, cameraSpeed);
    }
    if (Engine.mainCamera.y - panPadding > (maxY + minY)/2) {
        Engine.mainCamera.move(0, -cameraSpeed);
    }

    //Also try to add some juice/ visual feedback by scaling the receiving nodes with an animator.
    let pos = Engine.worldMousePos();
    tracker.moveTo(pos.x, pos.y);
    if (winCountdown < 0) {
        graph.nodes.forEach(n => {
            if (Math.abs(pos.x - n.number.sprite.x) < 10 && Math.abs(pos.y - n.number.sprite.y) < 10) {
                if(Engine.checkInput(0, 'start', 'mouse')){
                    n.send();
                }
            }
        });

        let inDebt = graph.nodes.filter(n => n.value < 0);
        if (inDebt.length == 0) {
            //Reset the game here
            winCountdown = 30;
        }
    }

    if (winCountdown >= 0 && winCountdown <= 10) {
        alert('You WON!');
        setNewGame(++currentLevel);
        winCountdown = -1;
    }

    winCountdown--;
}

function setNewGame(level) {
    if (level > levels.length) {
        return;
    }
    Engine.sprites = [];
    graph.init(levels[level].x, levels[level].y);
    bubble.init(graph);

    Engine.addSprite(tracker);
}