function Rock(x, y, r){
    this.pos = createVector(x, y);
    this.vel = createVector(random(-2, 2), random(-2, 2));
    this.acc = createVector(0, 0);
    this.force = createVector(0, 0);
    this.r = r;
    this.mass = 10;

    this.update = function(){
        this.acc = this.force.mult(this.mass); 
        this.vel.add(this.acc);
        this.vel.limit(5);
        this.pos.add(this.vel);
        this.force.mult(0);
        wrap(this.pos);
    }
    this.show = function(){
        ellipse(this.pos.x, this.pos.y, 2*this.r, 2*this.r);
    }
}