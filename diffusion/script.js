var tree = [];
var particles = [];

var numberOfParticles = 400;
var numberOfIterations = 20;

function setup() {
    createCanvas(400, 400);
    tree.push(new Particle(width/2, height/2, 4));
    for(var i=0;i<numberOfParticles;i++){
        particles.push(new Particle(4));        
    }
}

function draw(){
    for(var i=0;i<particles.length;i++){
        for(var j=0;j<numberOfIterations;j++){

        particles[i].update();
        particles[i].checkIsStuck(tree);
        if (particles[i].stuck){
            tree.push(particles[i]);
            particles.splice(i, 1);
            break;
        }
        }
    }
    
    background(51);
    for(var i=0;i<particles.length;i++){
        particles[i].show();
    }
    for(var i=0;i<tree.length;i++){
        tree[i].show();
    }
}

function createRandomPos(){
    var x = random(width);
    var y = random(height);
    return createVector(x, y);
}

function distSqr(pos, other){
    var dx = pos.x - other.x;
    var dy = pos.y - other.y;
    return dx*dx + dy*dy;r
}

function Particle(x, y, r){
    if (arguments.length == 3) {
        this.pos = createVector(x, y);
        this.r = r;
        this.stuck = true;
    }
    else {
        this.pos = createRandomPos();
        this.r = x;
        this.stuck = false;
    }

    this.checkIsStuck= function(others) {
        for(var i=0;i<others.length;i++){
            if (distSqr(this.pos, others[i].pos) < (this.r + others[i].r) * (this.r + others[i].r) ) {
                this.stuck = true;
                return true;
            }
        } 
        return false;
    }

    this.update = function(){
        this.pos.x += random(-2, 2)
        this.pos.y += random(-2, 2);
    }

    this.show = function() {
        if (this.stuck){
            fill(0, 0, 100, 200);
        }
        else {
            fill(255, 200);  
        }
        ellipse(this.pos.x, this.pos.y, 2*this.r, 2*this.r);
    }
}