export class Camera {
    ctx: CanvasRenderingContext2D;
    bgColor: string;
    drawables: Array<Drawable>;
    x: number;
    y: number;
    width: number;
    height: number;

    constructor() {
        this.drawables = [];
        this.x = 0;
        this.y = 0;
        this.width = 1280;
        this.height = 720;
        this.bgColor = '#FFFFFF';
    }

    addCanvas(canvas: HTMLCanvasElement) {
        this.ctx = canvas.getContext('2d');
    }

    pan(deltaX: number, deltaY: number) {
        this.x += deltaX;
        this.y += deltaY;
    }

    panTo(deltaX: number, deltaY: number, durration: number) {
        //TODO implement this.
    }

    drawScene(){
        //Clear the frame
        this.ctx.fillStyle = this.bgColor;
        this.ctx.fillRect(0, 0, this.width, this.height);
        let currentLayer = 0;
        let drawnCount = 0;
        do {
            drawnCount = 0;
            this.drawables.forEach(d => {
                if (d.layer == currentLayer) {
                    //TODO this call could be optimized!
                    let newX = this.width/2 + d.x - this.x;
                    let newY = this.height/2 + d.y + this.y;
                    d.draw(this.ctx, newX, newY);
                    drawnCount++;
                }
            });
            currentLayer++;
        } while (drawnCount != 0)
    }

    addDrawable(add: Drawable){
        this.drawables.push(add);
    }

    removeDrawable(remove: Drawable){
        this.drawables.forEach((d, i) => {
            if (d == remove) {
                this.drawables.splice(i, 1);
            }
        });
    }
}

export interface Drawable {
    x: number;
    y: number;
    width: number;
    height: number;
    layer: number;

    draw(_: CanvasRenderingContext2D, x: number, y: number): void;
};

export interface Physical {
    x: number;
    y: number;
    width: number;
    height: number;
    velocity: number;
    solid: boolean;
    elasticity: number;
    isPhysical: boolean;
}

export class Color {
    r: number;
    g: number;
    b: number;
    a: number;

    constructor(r, g, b, a){
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    public ToHex(): string {
        let rgb = this.b | (this.g << 8) | (this.r << 16);
        return '#' + (0x1000000 + rgb).toString(16).slice(1)
    }
};

export class Box implements Drawable, Physical{
    x: number;
    y: number;
    width: number;
    height: number;
    color: Color;
    layer: number;
    solid: boolean;
    velocity: number;
    elasticity: number;
    isPhysical: boolean;

    constructor(x, y, width, height, color, layer){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.layer = layer;
        this.solid = false;
        this.velocity = 0;
        this.elasticity = 0.9;
        this.isPhysical = false;
    }

    draw(ctx: CanvasRenderingContext2D, x: number, y: number): void {
        ctx.fillStyle = this.color.ToHex();
        ctx.globalAlpha = this.color.a/255;
        ctx.fillRect(x - this.width/2, y - this.height/2, this.width, this.height);
        ctx.globalAlpha = 1.0;
    }
}

export class EventHandeler {
    keyCode: string;
    boundingBox: {x: number, y: number, width: number, height: number};
    mouseEvent: string;
    callBack: Function;
}

export class Engine {
    cameras: Array<Camera>;
    currentCamera: Camera;
    objects: Array<Box>;
    physObjects: Array<Physical>;
    framrate: number;

    controllHandler: Array<EventHandeler>;

    addKeyStates: Array<string>;
    removeKeyStates: Array<string>;
    keyStates: Array<string>;

    addMouseStates: Array<string>;
    removeMouseStates: Array<string>;
    mouseStates: Array<string>;
    
    static MOUSE_STATES: string[] = ['leftClick','middleClick','rightClick',
        'start_leftClick','start_middleClick','start_rightClick',
        'end_leftClick','end_middleClick','end_rightClick'];

    mousePosition: {x: number, y: number};
    canvas: HTMLCanvasElement;

    physicsEngine: PhysicsEngine;

    constructor(canvas: HTMLCanvasElement, camera: Camera, physics: PhysicsEngine, objects: Array<Box>, framerate: number) {
        this.cameras = [camera];
        this.currentCamera = this.cameras[0];
        this.objects = objects;

        this.objects.forEach(d => {
            this.currentCamera.addDrawable(d);
        });
        this.currentCamera.addCanvas(canvas);

        this.framrate = framerate;

        this.controllHandler = [];
        this.keyStates = [];
        this.mouseStates = [];
        this.mousePosition = {x: 0, y: 0};
        this.canvas = canvas;
        this.physicsEngine = physics;

        this.addEventListeners(canvas);
    }

    private addEventListeners(canvas: HTMLCanvasElement):void {
        //Prevent the right click menue on the canvas
        canvas.addEventListener('contextmenu', function (ev) {
            ev.preventDefault();
        }, false);

        document.addEventListener('mousedown', (ev) => {
            let add = true;
            this.mouseStates.forEach(s => {
                if (s == Engine.MOUSE_STATES[ev.button]) {
                    add = false;
                }
            });
            if (add) {
                this.mouseStates.push(Engine.MOUSE_STATES[ev.button + 3]);
            }
        });

        document.addEventListener('mouseup', (ev) => {
            this.mouseStates.forEach((s, i) => {
                if (s == Engine.MOUSE_STATES[ev.button]) {
                    this.mouseStates.splice(i, 1);
                    this.mouseStates.push(Engine.MOUSE_STATES[ev.button + 6]);
                }
            })
        });

        canvas.addEventListener('mousemove', (ev) => {
            let rect = canvas.getBoundingClientRect();
            this.mousePosition.x = ev.clientX - rect.left;
            this.mousePosition.y = ev.clientY - rect.top;
        });

        document.addEventListener('keydown', (ev) => {
            let add = true;
            this.keyStates.forEach(s => {
                if (s == ev.code){
                    add = false;
                }
            });
            if (add) {
                this.keyStates.push(ev.code);
            }
        });
        document.addEventListener('keyup', (ev) => {
            this.keyStates.forEach((s, i) => {
                if (s == ev.code) {
                    this.keyStates = this.keyStates.splice(i, 1);
                }
            })
        });
    }

    run(): void{
        setInterval(() => {          
            this.currentCamera.drawScene();
            this.handleEvents();
            this.physicsEngine.runPhysics(this.objects);
        }, 1000/this.framrate);
    }

    addMouseHandler(boundingBox: {x: number, y: number, width: number, height: number}, event: string, callback: () => {}){
        let ev: EventHandeler = new EventHandeler();
        ev.boundingBox = boundingBox;
        ev.callBack = callback;
        ev.mouseEvent = event;
        this.controllHandler.push(ev);
    }

    addKeyHandler(keyCode: string, callback: () => {}){
        let ev: EventHandeler = new EventHandeler();
        ev.keyCode = keyCode;
        ev.callBack = callback;
        this.controllHandler.push(ev);
    }

    mouseToWorld(mousePos) {
        let x = mousePos.x - (this.canvas.width / 2) + this.currentCamera.x;
        let y = mousePos.y - (this.canvas.height / 2) - this.currentCamera.y;
        return {
            x: x,
            y: y,
        };
    }

    private handleEvents() {
        let actionPerformed = false;
        this.controllHandler.forEach(handler => {
            this.keyStates.forEach(state => {
                if (state == handler.keyCode) {
                    handler.callBack();
                    actionPerformed = true;
                }
            });
        
            if (actionPerformed) {
                return;
            }

            if (handler.boundingBox != null
                && this.mousePosition.x > handler.boundingBox.x
                && this.mousePosition.x < handler.boundingBox.x + handler.boundingBox.width
                && this.mousePosition.y > handler.boundingBox.y
                && this.mousePosition.y < handler.boundingBox.y + handler.boundingBox.height){
                
                this.mouseStates.forEach(state => {
                    if (state == handler.mouseEvent) {
                        handler.callBack(this.mousePosition);
                        actionPerformed = true;
                    }
                });

                if (actionPerformed) {
                    return;
                }

                if (handler.mouseEvent == 'hover') {
                    handler.callBack(this.mousePosition);
                }
            }
        });

        this.mouseStates.forEach((state, i) => {
            if (state.substr(0, 3) == 'end'){
                this.mouseStates.splice(i, 1)
            }
            if (state.substr(0, 5) == 'start'){
                this.mouseStates.splice(i, 1);
                this.mouseStates.push(state.substr(6, state.length));
            }
        });
    }
}

export class PhysicsEngine {
    gravity: number;

    constructor(gravity: number) {
        this.gravity = gravity;
    }

    runPhysics(phys: Physical[]):void {
        phys.forEach(p => {
            if (!p.isPhysical) {
                return
            }
            p.velocity += this.gravity;
            p.y += p.velocity;
        });

        phys.forEach((p, i) => {
            for(let start = i + 1; start < phys.length; start++){
                if (this.collided(p, phys[start])){
                    p.velocity *= -p.elasticity;
                    phys[start].velocity *= -phys[start].elasticity;
                }
            }
        });
    }

    collided(a: Physical, b:Physical): boolean {
        if (!a.solid || !b.solid) {
            return false;
        }
        if (Math.abs(a.x - b.x) < (a.width / 2) + (b.width / 2) &&
            Math.abs(a.y - b.y) < (a.height / 2) + (b.height / 2)) {
            //Reposition the object and return true;
            a.y -= a.velocity;
            b.y -= b.velocity;
            return true;
        }
    }
}