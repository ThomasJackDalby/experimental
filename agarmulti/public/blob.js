function Blob(x, y){
    this.pos = createVector(x, y);
    this.dir = 0;
    colorMode(HSB);
    this.colour = color(random(255), 255, 255);

    this.update = function() {
        this.dir = createVector(mouseX - width/2, mouseY-height/2).heading();
    }

    this.show = function() {
        fill(this.colour);
        ellipse(this.pos.x, this.pos.y,2*radius, 2*radius);
        var dirv = p5.Vector.fromAngle(this.dir);
        dirv.setMag(radius*1.3);
        line(this.pos.x, this.pos.y, this.pos.x + dirv.x, this.pos.y + dirv.y);
    }
}