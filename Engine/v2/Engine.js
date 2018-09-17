let Engine = {
    cameras: [],
    mainCamera: null,
    backgrounds: [],
    sprites: [],
    GUI: [],
    Layers: [],
    framerate: 60,
    InputHandler: null,
    inputs: [],
    mousePos: {x: 0, y: 0},
    checkInput: function(event, stage, type) {
        let eventMatch = Engine.inputs.filter(i => i.event == event);
        if (type == undefined && stage == undefined) {
            return eventMatch.length > 0;
        }

        if (type == undefined && stage != undefined) {
            let r = eventMatch.filter(
                i => i.stage == stage
            );
            return r.length > 0;
        }

        if (type != undefined && stage != undefined) {
            return eventMatch.filter(
                i => i.type == type && i.stage == stage
            ).length > 0;
        }
        return false;
    },
    screenMousePos: () => {
        return Engine.mousePos;
    },
    worldMousePos: () => {
        //Engine.dosent handle scale
        return {
            x: (Engine.mousePos.x - (Engine.mainCamera.width/2))/Engine.mainCamera.z + Engine.mainCamera.x,
            y: (-(Engine.mousePos.y - (Engine.mainCamera.height/2)))/Engine.mainCamera.z + Engine.mainCamera.y
        }
    },
    addSprite: (sprite) => {
        Engine.sprites.push(sprite);
        let less = Engine.Layers.filter(l => l < sprite.layer);
        let greater = Engine.Layers.filter(l => l > sprite.layer);
        Engine.Layers = less.concat([sprite.layer]).concat(greater);
    },
    addInputHandler: (handler) => {
        Engine.InputHandler = handler;
    },
    addCamera: (camera, id) => {
        if (!(camera instanceof Camera)) {
            //Log a warning here
            return;
        }
        
        if (id == undefined) {
            //Log a warning here
            return;
        }

        Engine.cameras.push({id: id, camera: camera}); 
    },
    setMainCamera: (id) => {
        Engine.mainCamera = Engine.cameras.filter(c => c.id == id)[0].camera;
    },
    start: (updateFunc = () => {}) => {
        window.setInterval(() => {
            Engine.tick(updateFunc);
        }, 1000/this.framerate);
    },
    tick: (updateFunc) => {
        //code to run each frame should go here
        Engine.inputs = Engine.InputHandler.getInput();
        Engine.updateMousePos(Engine.inputs);
        updateFunc();
        Engine.mainCamera.clear();
        Engine.drawBackgrounds();
        Engine.drawSprites();
        Engine.drawGUI();
    },
    updateMousePos: (inputs) => {
        let pos = inputs.filter(i => i.type == "mousepos");
        if (pos.length > 0){
            Engine.mousePos = {x: pos[0].event.x, y: pos[0].event.y};
        }
    },
    drawBackgrounds: () => {
        Engine.backgrounds.forEach(bg => {
        });
    },
    drawSprites: () => {
        Engine.Layers.forEach(layer => {
            Engine.sprites.forEach(s => {
                if (s.layer == layer) {
                    s.draw(Engine.mainCamera);
                }
            });
        });
    },
    drawGUI: () => {
        Engine.GUI.forEach(g => {
        });
    },
}