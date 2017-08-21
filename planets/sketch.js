var planets = [];
var stars = [];
var g = 20;
var dash = 0;
var DASH_LENGTH = 5;
var NUMBER_OF_DASHES = 50;
var active_planet = null;

function setup(){
    createCanvas(1000, 600);
    colorMode(HSL);
    strokeWeight(3);
    textSize(10);
    stars.push(new Star(width/2, height/2, 20, 100));
    for(var i=0;i<10;i++){
        planets.push(new Planet(random(width), random(height), random(1, 5), random(1, 5)));
    }
    active_planet = planets[0];
}

function draw(){
    background(0);
    evaluateForces();
    dash++;
    if (dash > DASH_LENGTH) dash = 0;
    for(var i=0;i<planets.length;i++){
        planets[i].update();
        planets[i].show();
    }
    for(var i=0;i<stars.length;i++){
        stars[i].show();
    }
}

function mousePressed(){
    if (mouseIsPressed){
        for(var i=0;i<planets.length;i++){
            var p = planets[i];
            if ((mouseX-p.pos.x)*(mouseX-p.pos.x) + (mouseY-p.pos.y)*(mouseY-p.pos.y) < 1000){ //, this.radius*this.radius){
                active_planet = p;
                return;
            }
        }
    }
    active_planet = null;
} 

function evaluateForces() {
    for (var j=0;j<stars.length;j++){
        var s = stars[j];
        for(var i=0;i<planets.length;i++){
            var p = planets[i];
            p.force.mult(0);
            var dir = p5.Vector.sub(s.pos, p.pos);
            var d = dir.mag();
            dir.normalize();
            if (d > s.radius+p.radius){
                var f = (g*p.mass*s.mass) / (d*d);
                var force = createVector(dir.x * f, dir.y*f);
                planets[i].force.add(force);
            }
        }
    }
}

function Star(x, y, radius, mass){
    this.radius = radius;
    this.mass = mass;
    this.pos = createVector(x, y);

    this.show = function() {
        stroke(60, 100, 70);
        fill(60, 100, 70);
        ellipse(this.pos.x, this.pos.y, 2*this.radius);
    }
}

function randomPlanetName(){
    var name = "";
    name += names[Math.floor(random(names.length))];
    name = name.toUpperCase();
    name += " ";
    for(var i=0;i<2;i++){
        name += caps[Math.floor(random(caps.length))];
    }
    for(var i=0;i<3;i++){
        name += Math.floor(random(0, 10));
    }
    return name;
}

function getInitialOrbitalSpeed(pos, starmass, starpos){
    var vel = p5.Vector.sub(starpos, pos);
    var d = vel.mag();
    if (random() > 0.5) vel.rotate(Math.PI/2.0);
    else vel.rotate(-Math.PI/2.0);
    var initvel = Math.sqrt(g*starmass/d) * random(0.5, 1);
    vel.setMag(initvel); 
    return vel;
}

function Planet(x, y, radius, mass){
    this.name = randomPlanetName();
    this.hue = random(255);
    this.radius = radius;
    this.mass = mass;
    this.pos = createVector(x, y);
    this.vel = getInitialOrbitalSpeed(this.pos, stars[0].mass, stars[0].pos);
    this.force = createVector();
    this.path = [];
    this.update = function(){
        var acc = p5.Vector.mult(this.force, 1/this.mass);
        this.vel.add(acc);
        this.pos.add(this.vel);
        if (dash >= DASH_LENGTH){
            this.path.push(this.pos.copy());
            if (this.path.length > NUMBER_OF_DASHES) this.path.shift();
        }
    }

    this.show = function() {
        fill(this.hue, 80, 50);
        stroke(this.hue, 80, 50);
        ellipse(this.pos.x, this.pos.y, 2*this.radius);
        for(var i=0;i<this.path.length;i++){
            point(this.path[i].x, this.path[i].y);
        }
        noStroke();
        fill(0, 100, 100);
        text(this.name, this.pos.x+10, this.pos.y);
        if (active_planet === this){
            var l = 0;
            var left = width-120;
            var h = 10;
            text("Name: "+this.name, left, 20+l++*h);
            text("Pos: "+this.pos.x.toFixed(2) + " " +this.pos.y.toFixed(2), left, 20+l++*h);
            text("Speed: "+this.vel.mag().toFixed(2), left, 20+l++*h);
            text("Force: "+this.force.mag().toFixed(10), left, 20+l++*h);
            stroke(0, 100, 50);
            noFill();
            ellipse(this.pos.x, this.pos.y, 50);
            stroke(100, 100, 50);
            line(this.pos.x, this.pos.y, this.pos.x+this.vel.x*100, this.pos.y+this.vel.y*100);
            stroke(200, 100, 50);
            line(this.pos.x, this.pos.y, this.pos.x+this.force.x*5000, this.pos.y+this.force.y*5000);
        } 
    }
}