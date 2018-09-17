function Animation(name){
    this.name = name;
    this.keys = [];
    this.currentFrame = 0;
    this.replay = true;
    this.pause = true;
    this.firstFrame = 0;
    this.lastFrame = 0;

    this.addKeyFrame = function(frame, property, value){
        //Add the new keyframe in in the correct place
        let before = this.keys.filter(key => key.frame <= frame);
        let after = this.keys.filter(key => key.value > frame);
        this.keys = before.concat([{frame: frame, property: property, value: value}]).concat(after);

        this.lastFrame = this.keys.reduce((MinMax, frame) => {
            MinMax.min = frame.value < MinMax.min ? frame.value : MinMax.min;
            MinMax.max = frame.value > MinMax.max ? frame.value : MinMax.max;
            return MinMax;
        }, {min: Number.MAX_SAFE_INTEGER, max: Number.MIN_SAFE_INTEGER});
        this.firstFrame = min;
        this.lastFrame = max;
    }

    this.getProperty = function(property) {
        let prekey = 0;
        let postkey = 0;
        let onkey = false;
        this.keys.forEach((key, i) => {
            if (key.frame <= this.currentFrame && key.property == property){
                prekey = i;
                if (key.frame == this.currentFrame) {
                    onkey = true;
                }
            } else if (key.frame > this.currentFrame && key.property == property) {
                postkey = i;
            }
        });
        if (onkey) {
            return this.keys[prekey].value;
        }

        let pre = this.keys[prekey];
        let post = this.keys[postkey];
        let vDiff = post.value - pre.value;
        let fDiff = post.frame - pre.frame; 
        let cDiff = this.currentFrame - pre.frame;

        return pre.value + vDiff*(cDiff/fDiff);
    }

    this.getCurrentFrame = function() {
        return this.currentFrame;
    }

    this.start = function() {
        this.currentFrame = this.firstFrame;
    }

    this.nextFrame = function() {
        this.currentFrame++;
        if (this.currentFrame > this.lastFrame) {
            if (this.replay) {
                this.currentFrame = this.firstFrame;
            } else {
                this.currentFrame = this.lastFrame;
            }
        }
    }
}