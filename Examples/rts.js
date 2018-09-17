"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Camera = /** @class */ (function () {
    function Camera() {
        this.drawables = [];
        this.x = 0;
        this.y = 0;
        this.width = 1280;
        this.height = 720;
        this.bgColor = '#FFFFFF';
    }
    Camera.prototype.addCanvas = function (canvas) {
        this.ctx = canvas.getContext('2d');
    };
    Camera.prototype.pan = function (deltaX, deltaY) {
        this.x += deltaX;
        this.y += deltaY;
    };
    Camera.prototype.panTo = function (deltaX, deltaY, durration) {
        //TODO implement this.
    };
    Camera.prototype.drawScene = function () {
        var _this = this;
        //Clear the frame
        this.ctx.fillStyle = this.bgColor;
        this.ctx.fillRect(0, 0, this.width, this.height);
        var currentLayer = 0;
        var drawnCount = 0;
        do {
            drawnCount = 0;
            this.drawables.forEach(function (d) {
                if (d.layer == currentLayer) {
                    //TODO this call could be optimized!
                    var newX = _this.width / 2 + d.x - _this.x;
                    var newY = _this.height / 2 + d.y + _this.y;
                    d.draw(_this.ctx, newX, newY);
                    drawnCount++;
                }
            });
            currentLayer++;
        } while (drawnCount != 0);
    };
    Camera.prototype.addDrawable = function (add) {
        this.drawables.push(add);
    };
    Camera.prototype.removeDrawable = function (remove) {
        var _this = this;
        this.drawables.forEach(function (d, i) {
            if (d == remove) {
                _this.drawables.splice(i, 1);
            }
        });
    };
    return Camera;
}());
exports.Camera = Camera;
;
var Color = /** @class */ (function () {
    function Color(r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    Color.prototype.ToHex = function () {
        var rgb = this.b | (this.g << 8) | (this.r << 16);
        return '#' + (0x1000000 + rgb).toString(16).slice(1);
    };
    return Color;
}());
exports.Color = Color;
;
var Text = /** @class */ (function () {
    function Text(text, font, color, x, y, layer) {
        this.x = x;
        this.y = y;
        this.layer = layer;
        this.font = font;
        this.text = text;
        this.color = color;
    }
    Text.prototype.draw = function (ctx, x, y) {
        ctx.font = this.font;
        ctx.fillStyle = this.color.ToHex();
        ctx.globalAlpha = this.color.a / 255;
        //We ignore the coordinates given to us by the camera
        //becase text dosen't use world space.
        ctx.fillText(this.text, this.x, this.y);
    };
    Text.prototype.setText = function (text) {
        this.text = text;
    };
    return Text;
}());
exports.Text = Text;
var Box = /** @class */ (function () {
    function Box(x, y, width, height, color, layer) {
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
    Box.prototype.draw = function (ctx, x, y) {
        ctx.fillStyle = this.color.ToHex();
        ctx.globalAlpha = this.color.a / 255;
        ctx.fillRect(x - this.width / 2, y - this.height / 2, this.width, this.height);
        ctx.globalAlpha = 1.0;
    };
    return Box;
}());
exports.Box = Box;
var KeyEventHandeler = /** @class */ (function () {
    function KeyEventHandeler() {
    }
    return KeyEventHandeler;
}());
exports.KeyEventHandeler = KeyEventHandeler;
var MouseEventHandler = /** @class */ (function () {
    function MouseEventHandler() {
    }
    return MouseEventHandler;
}());
exports.MouseEventHandler = MouseEventHandler;
var Engine = /** @class */ (function () {
    function Engine(canvas, framerate) {
        this.updateFunc = function () { return void {}; };
        this.objects = [];
        this.texts = [];
        this.cameras = [];
        this.framrate = framerate;
        this.keyHandlers = [];
        this.mouseHandlers = [];
        this.keyStates = [];
        this.mouseStates = [];
        this.mousePosition = { x: 0, y: 0 };
        this.canvas = canvas;
        this.addEventListeners(canvas);
    }
    Engine.prototype.addPhysics = function (physics) {
        this.physicsEngine = physics;
        return this;
    };
    Engine.prototype.addCamera = function (camera) {
        this.cameras.push(camera);
        if (this.cameras.length == 1) {
            this.currentCamera = camera;
            this.currentCamera.addCanvas(this.canvas);
        }
        return this;
    };
    Engine.prototype.addText = function (txt) {
        var _this = this;
        txt.forEach(function (t) {
            _this.texts.push(t);
            _this.currentCamera.addDrawable(t);
        });
    };
    Engine.prototype.addObjects = function (obj) {
        var _this = this;
        obj.forEach(function (o) {
            _this.objects.push(o);
            _this.currentCamera.addDrawable(o);
        });
    };
    Engine.prototype.addEventListeners = function (canvas) {
        var _this = this;
        //Prevent the right click menue on the canvas
        canvas.addEventListener('contextmenu', function (ev) {
            ev.preventDefault();
        }, false);
        document.addEventListener('mousedown', function (ev) {
            var add = true;
            _this.mouseStates.forEach(function (s) {
                if (s == Engine.MOUSE_STATES[ev.button]) {
                    add = false;
                }
            });
            if (add) {
                _this.mouseStates.push(Engine.MOUSE_STATES[ev.button + 3]);
            }
        });
        document.addEventListener('mouseup', function (ev) {
            _this.mouseStates.forEach(function (s, i) {
                if (s == Engine.MOUSE_STATES[ev.button]) {
                    _this.mouseStates.splice(i, 1);
                    _this.mouseStates.push(Engine.MOUSE_STATES[ev.button + 6]);
                }
            });
        });
        canvas.addEventListener('mousemove', function (ev) {
            var rect = canvas.getBoundingClientRect();
            _this.mousePosition.x = ev.clientX - rect.left;
            _this.mousePosition.y = ev.clientY - rect.top;
        });
        document.addEventListener('keydown', function (ev) {
            var add = true;
            _this.keyStates.forEach(function (s) {
                if (s == ev.code || s == 'start_' + ev.code || s == 'end_' + ev.code) {
                    add = false;
                }
            });
            if (add) {
                _this.keyStates.push('start_' + ev.code);
            }
        });
        document.addEventListener('keyup', function (ev) {
            _this.keyStates.forEach(function (s, i) {
                if (s == ev.code) {
                    _this.keyStates.splice(i, 1);
                    _this.keyStates.push('end_' + ev.code);
                }
            });
        });
    };
    Engine.prototype.onUpdate = function (f) {
        this.updateFunc = f;
    };
    Engine.prototype.keyIsPressed = function (key) {
        var matched = false;
        this.keyStates.forEach(function (k) {
            matched = matched || (key == k);
        });
        return matched;
    };
    Engine.prototype.run = function () {
        var _this = this;
        setInterval(function () {
            _this.handleKeyEvents();
            _this.handleMouseEvents();
            _this.physicsEngine.runPhysics(_this.objects);
            _this.updateFunc();
            _this.currentCamera.drawScene();
        }, 1000 / this.framrate);
    };
    Engine.prototype.addMouseHandler = function (boundingBox, event, callback) {
        var ev = new MouseEventHandler();
        ev.boundingBox = boundingBox;
        ev.callBack = callback;
        ev.mouseEvent = event;
        this.mouseHandlers.push(ev);
    };
    Engine.prototype.addKeyHandler = function (keyCode, callback) {
        var ev = new KeyEventHandeler();
        ev.keyCode = keyCode;
        ev.callBack = callback;
        this.keyHandlers.push(ev);
    };
    Engine.prototype.mouseToWorld = function (mousePos) {
        var x = mousePos.x - (this.canvas.width / 2) + this.currentCamera.x;
        var y = mousePos.y - (this.canvas.height / 2) - this.currentCamera.y;
        return {
            x: x,
            y: y,
        };
    };
    Engine.prototype.handleKeyEvents = function () {
        var _this = this;
        this.keyHandlers.forEach(function (handler) {
            _this.keyStates.forEach(function (state) {
                if (state == handler.keyCode) {
                    handler.callBack();
                }
            });
        });
        this.keyStates.forEach(function (state, i) {
            if (state.substr(0, 3) == 'end') {
                _this.keyStates.splice(i, 1);
            }
            if (state.substr(0, 5) == 'start') {
                _this.keyStates.splice(i, 1);
                _this.keyStates.push(state.substr(6, state.length));
            }
        });
    };
    Engine.prototype.handleMouseEvents = function () {
        var _this = this;
        var actionPerformed = false;
        this.mouseHandlers.forEach(function (handler) {
            if (handler.boundingBox != null
                && _this.mousePosition.x > handler.boundingBox.x
                && _this.mousePosition.x < handler.boundingBox.x + handler.boundingBox.width
                && _this.mousePosition.y > handler.boundingBox.y
                && _this.mousePosition.y < handler.boundingBox.y + handler.boundingBox.height) {
                _this.mouseStates.forEach(function (state) {
                    if (state == handler.mouseEvent) {
                        handler.callBack(_this.mousePosition);
                        actionPerformed = true;
                    }
                });
                if (actionPerformed) {
                    return;
                }
                if (handler.mouseEvent == 'hover') {
                    handler.callBack(_this.mousePosition);
                }
            }
        });
        this.mouseStates.forEach(function (state, i) {
            if (state.substr(0, 3) == 'end') {
                _this.mouseStates.splice(i, 1);
            }
            if (state.substr(0, 5) == 'start') {
                _this.mouseStates.splice(i, 1);
                _this.mouseStates.push(state.substr(6, state.length));
            }
        });
    };
    Engine.MOUSE_STATES = ['leftClick', 'middleClick', 'rightClick',
        'start_leftClick', 'start_middleClick', 'start_rightClick',
        'end_leftClick', 'end_middleClick', 'end_rightClick'];
    return Engine;
}());
exports.Engine = Engine;
var PhysicsEngine = /** @class */ (function () {
    function PhysicsEngine(gravity) {
        this.gravity = gravity;
    }
    PhysicsEngine.prototype.runPhysics = function (phys) {
        var _this = this;
        phys.forEach(function (p) {
            if (!p.isPhysical) {
                return;
            }
            p.velocity += _this.gravity;
            p.y += p.velocity;
        });
        phys.forEach(function (p, i) {
            for (var start = i + 1; start < phys.length; start++) {
                if (_this.collided(p, phys[start])) {
                    p.velocity *= -p.elasticity;
                    phys[start].velocity *= -phys[start].elasticity;
                }
            }
        });
    };
    PhysicsEngine.prototype.collided = function (a, b) {
        if (!a.solid || !b.solid) {
            return false;
        }
        if (Math.abs(a.x - b.x) < (a.width / 2) + (b.width / 2) &&
            Math.abs(a.y - b.y) < (a.height / 2) + (b.height / 2)) {
            //Reposition the object and return true;
            a.y -= a.velocity;
            b.y -= b.velocity;
            if (a.velocity == 0) {
                b.y += (a.y - b.y) - (a.height / 2) - (b.height / 2);
                return true;
            }
            if (b.velocity == 0) {
                a.y += (b.y - a.y) - (a.height / 2) - (b.height / 2);
                return true;
            }
            b.y += (b.velocity / (b.velocity + a.velocity)) * ((a.y - b.y) - (a.height / 2) - (b.height / 2));
            a.y += (a.velocity / (b.velocity + a.velocity)) * ((b.y - a.y) - (a.height / 2) - (b.height / 2));
            return true;
        }
    };
    return PhysicsEngine;
}());
exports.PhysicsEngine = PhysicsEngine;
