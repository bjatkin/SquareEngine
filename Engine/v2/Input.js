function InputHandler(canvasID){
    this.CanvasListen = document.getElementById(canvasID); 
    this.inputList = [];
    this.nextInputs = [];

    this.init = function() {
        document.addEventListener('keydown', (event) => {
            this.addInput(this.newEvent('start', 'keyboard', event.key));
        });

        document.addEventListener('keyup', (event) => {
            this.addInput(this.newEvent('end', 'keyboard', event.key));
        });

        this.CanvasListen.addEventListener('mousedown', (event) => {
            this.addInput(this.newEvent('start', 'mouse', event.button));
        });
        //TODO check if we even really need this?
        this.CanvasListen.addEventListener('click', (event) => { 
            this.addInput(this.newEvent('input', 'mouse', event.button));
        });

        this.CanvasListen.addEventListener('mouseup', (event) => {
            this.addInput(this.newEvent('end', 'mouse', event.button));
        });

        this.CanvasListen.addEventListener('mousemove', (event) => {
            this.addInput(this.newEvent('input', 'mousepos', {x: event.clientX, y: event.clientY}));
        });
    }

    this.addInput = function(e) {
        let add = true;
        this.inputList = this.inputList.map(i => {
            if (i.type == 'mousepos' && e.type == 'mousepos') {
                i.event = e.event;
                add = false;
            }

            if (i.event == e.event) {
                if (e.stage == 'end' && i.stage == 'input') {
                    i.stage = e.stage;
                }
                if (e.stage == 'end' && i.stage == 'start') {
                    this.nextInputs.push(e);
                }
                add = false;
            }
            return i;
        });

        if (add) {
            this.inputList.push(e);
        }
    }

    this.getInput = function() {
        //Copy this array by value not reference
        let ret = this.copyInputList();

        this.inputList = this.inputList.map(i => {
            if (i.stage == 'start') {
                i.stage = 'input';
            }
            return i;
        }).filter(i => i.stage == 'input');

        this.inputList.concat(this.nextInputs);
        this.nextInputs = [];
        return ret;
    }

    this.copyInputList = function() {
        let ret = [];
        this.inputList.forEach(i => {
            ret.push(this.newEvent(i.stage, i.type, i.event));
        });
        return ret;
    }

    this.newEvent = function(stage, type, event) {
        return {
            stage: stage,
            type: type,
            event: event,
        }
    }
}