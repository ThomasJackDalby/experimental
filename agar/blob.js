function Blob(x, y, r){
    this.pos = createVector(x, y);
    this.r = r;
    this.area = r*r*PI;
    this.vel = createVector(0, 0);
    colorMode(HSB);
    this.colour = color(random(255), 255, 255);

    this.update = function() {
        var newvel = createVector(mouseX - width/2, mouseY-height/2);
        newvel.setMag(3);
        this.vel.lerp(newvel, 0.2);
        this.pos.add(this.vel);
        this.r = lerp(this.r, Math.sqrt(this.area/PI), 0.1);
    }

    this.eats = function(other) {
        var d2 = (this.pos.x-other.pos.x)*(this.pos.x-other.pos.x) + (this.pos.y-other.pos.y)*(this.pos.y-other.pos.y);
        return d2 < (this.r+other.r)*(this.r+other.r);
    }

    this.eat = function(other){
        this.area = 10*PI*other.r*other.r + this.r*this.r*PI;
    }

    this.show = function() {
        fill(this.colour);
        ellipse(this.pos.x, this.pos.y, this.r*2, this.r*2);
    }
}