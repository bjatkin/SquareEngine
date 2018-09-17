function RGBA(r, g, b, a = 255) {
    if (r == undefined || g == undefined || b == undefined) {
        return new RGBA(0, 0, 0);
    }

    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;

    this.getHex = function(){
        let rgb = this.b | (this.g << 8) | (this.r << 16);
        return '#' + (0x1000000 + rgb).toString(16).slice(1)
    }
}