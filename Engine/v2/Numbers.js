function Numbers(value) {

    this.ints = {
        one: [[p(-1,0),p(-2,0),p(-2,6),p(-1,6),p(-1,0)]],
        two: [[p(0,0),p(-3,0),p(-3,1),p(-1,4),p(-1,5),p(-3,5),p(-3,6),p(0,6),p(0,4),p(-2,1),p(0,1),p(0,0)]],
        three: [[p(0,0),p(-3,0),p(-3,1),p(-1,1),p(-1,3),p(-2,3),p(-2,4),p(-1,4),p(-1,5),p(-3,5),p(-3,6),p(0,6),p(0,0)]],
        four: [[p(0,0),p(-1,0),p(-1,3),p(-3,3),p(-3,6),p(-2,6),p(-2,4),p(-1,4),p(-1,6),p(0,6),p(0,0)]],
        five: [[p(0,0),p(-3,0),p(-3,1),p(-1,1),p(-1,2),p(-3,3),p(-3,6),p(0,6),p(0,5),p(-2,5),p(-2,4),p(0,3),p(0,0)]],
        six: [[p(-1,2),p(-2,2),p(-2,1),p(-1,1),p(-1,2),p(0,3),p(0,0),p(-3,0),p(-3,6),p(0,6),p(0,4),p(-1,4),p(-1,5),p(-2,5),p(-2,3),p(0,3),p(-1,2)]],
        seven: [[p(-2,0),p(-3,0),p(-3,2),p(-1,4),p(-1,5),p(-3,5),p(-3,6),p(0,6),p(0,4),p(-2,2),p(-2,0)]],
        eight: [[p(0,0),p(-3,0),p(-3,6),p(0,6),p(-1,5),p(-2,5),p(-2,4),p(-1,4),p(-1,5),p(0,6),p(0,0),p(-1,1),p(-1,3),p(-2,3),p(-2,1),p(-1,1),p(0,0)]],
        nine: [[p(-3,0),p(0,0),p(0,6),p(-3,6),p(-3,3),p(-2,4),p(-2,5),p(-1,5),p(-1,4),p(-2,4),p(-3,3),p(-1,3),p(-1,1),p(-3,1),p(-3,0)]],
        zero: [[p(0,0),p(-3,0),p(-3,6),p(0,6),p(0,0),p(-1,1),p(-1,5),p(-2,5),p(-2,1),p(-1,1)]],
        neg: [[p(0,4),p(-2,4),p(-2,3),p(0,3),p(0,4)]],
    }

    this.BGSide = [[p(0,-2),p(-1,-2),p(-1,8),p(0,8),p(2,6),p(2,0),p(0,-2)]],

    this.BGMid = [[p(0,-2),p(-4,-2),p(-4,8),p(0,8),p(0,-2)]],

    this.sprite = new Sprite(
        [],
        ""
    );
    Engine.addSprite(this.sprite);
    this.value = value;

    this.setNumber = function(value) {
        let s = value.toString();
        let offset = -((s.length - 1) * 4) + ((s.length - 0.25)/2);
        let Geos = [
            new Geometry(this.BGSide, "red").transform((s.length - 0.25)/2, 0),
            new Geometry(this.BGMid, "red").scale(s.length - 0.25, 1).transform((s.length - 0.25)/2, 0),
            new Geometry(this.BGSide, "red").scale(-1, 1).transform(offset - 3,0)
        ];

        for(let i = 0; i < s.length; i++){
            let setGeo = null;
            switch (s.charAt(i)) {
                case "-":
                    setGeo = this.ints.neg;
                break;
                case "0":
                    setGeo = this.ints.zero;
                break;
                case "1":
                    setGeo = this.ints.one;
                break;
                case "2":
                    setGeo = this.ints.two;
                break;
                case "3":
                    setGeo = this.ints.three;
                break;
                case "4":
                    setGeo = this.ints.four;
                break;
                case "5":
                    setGeo = this.ints.five;
                break;
                case "6":
                    setGeo = this.ints.six;
                break;
                case "7":
                    setGeo = this.ints.seven;
                break;
                case "8":
                    setGeo = this.ints.eight;
                break;
                case "9":
                    setGeo = this.ints.nine;
                break;
                default:
                    offset -= 4;
            }
            Geos.push(new Geometry(setGeo, "black").transform(offset, 0));
            offset += 4;
        }
        this.sprite.updateGeometry(Geos, "");
    }

    this.setNumber(value); 
}