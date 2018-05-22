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
        this.drawables.forEach(function (d) {
            //TODO this call could be optimized!
            var newX = _this.width / 2 + d.x - _this.x;
            var newY = _this.height / 2 + d.y + _this.y;
            d.draw(_this.ctx, newX, newY);
        });
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
var Box = /** @class */ (function () {
    function Box(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }
    Box.prototype.draw = function (ctx, x, y) {
        ctx.fillStyle = this.color.ToHex();
        ctx.fillRect(x - this.width / 2, y - this.height / 2, this.width, this.height);
    };
    return Box;
}());
exports.Box = Box;
var EventHandeler = /** @class */ (function () {
    function EventHandeler() {
    }
    return EventHandeler;
}());
exports.EventHandeler = EventHandeler;
var Engine = /** @class */ (function () {
    function Engine(canvas, camera, objects, framerate) {
        var _this = this;
        this.cameras = [camera];
        this.currentCamera = this.cameras[0];
        this.objects = objects;
        this.objects.forEach(function (d) {
            _this.currentCamera.addDrawable(d);
        });
        this.currentCamera.addCanvas(canvas);
        this.framrate = framerate;
        this.controllHandler = [];
        this.keyStates = [];
        this.mouseStates = [];
        this.mousePosition = { x: 0, y: 0 };
        this.canvas = canvas;
        this.addEventListeners(canvas);
    }
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
                if (s == ev.code) {
                    add = false;
                }
            });
            if (add) {
                _this.keyStates.push(ev.code);
            }
        });
        document.addEventListener('keyup', function (ev) {
            _this.keyStates.forEach(function (s, i) {
                if (s == ev.code) {
                    _this.keyStates = _this.keyStates.splice(i, 1);
                }
            });
        });
    };
    Engine.prototype.run = function () {
        var _this = this;
        setInterval(function () {
            _this.currentCamera.drawScene();
            _this.handleEvents();
        }, 1000 / this.framrate);
    };
    Engine.prototype.addMouseHandler = function (boundingBox, event, callback) {
        var ev = new EventHandeler();
        ev.boundingBox = boundingBox;
        ev.callBack = callback;
        ev.mouseEvent = event;
        this.controllHandler.push(ev);
    };
    Engine.prototype.addKeyHandler = function (keyCode, callback) {
        var ev = new EventHandeler();
        ev.keyCode = keyCode;
        ev.callBack = callback;
        this.controllHandler.push(ev);
    };
    Engine.prototype.mouseToWorld = function (mousePos) {
        var x = mousePos.x - (this.canvas.width / 2) + this.currentCamera.x;
        var y = mousePos.y - (this.canvas.height / 2) - this.currentCamera.y;
        return {
            x: x,
            y: y,
        };
    };
    Engine.prototype.handleEvents = function () {
        var _this = this;
        var actionPerformed = false;
        this.controllHandler.forEach(function (handler) {
            _this.keyStates.forEach(function (state) {
                if (state == handler.keyCode) {
                    handler.callBack();
                    actionPerformed = true;
                }
            });
            if (actionPerformed) {
                return;
            }
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
