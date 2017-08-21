var creature;

function setup(){
    createCanvas(1000, 600);
    colorMode(HSL);
    creature = new Creature();
}

function draw(){
    background(255);
    stroke(0);
    strokeWeight(2);
    creature.update();
    creature.show();
}

function Creature(){
    this.nodes = [];
    this.connections = [];
    for(var i=0;i<5;i++){
        this.nodes.push(new Node());
    }
    for(var i=0;i<10;i++){
        var a = this.nodes[Math.floor(random(this.nodes.length))];
        var b = this.nodes[Math.floor(random(this.nodes.length))];
        if (a === b) continue;
        var c = new Connection(a, b);
        a.connections.push(b);
        b.connections.push(a);
        this.connections.push(c);
    }


    this.update = function(){
        for(var i=0;i<this.connections.length;i++){
            var c = this.connections[i];
            var a2b = p5.Vector.sub(c.a.pos, c.b.pos);
            var mag = a2b.mag();
            var f = c.get_force();
            a2b.mult(f/mag);
            //console.log(f/mag);
            c.b.force.add(a2b);
            a2b.mult(-1);
            c.a.force.add(a2b);
        }
        for(var i=0;i<this.nodes.length;i++){
            var n = this.nodes[i];
            b.update();
        }
    }

    this.show = function(){
        for(var i=0;i<this.connections.length;i++){
            var c = this.connections[i];
            line(c.a.pos.x, c.a.pos.y, c.b.pos.x, c.b.pos.y);
        }
        for(var i=0;i<this.nodes.length;i++){
            var n = this.nodes[i];
            ellipse(n.pos.x, n.pos.y, 10, 10);
        }
    }
} 

function Node() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector();
    this.force = createVector();
    this.connections = [];

    this.update = function(){
        // console.log(this.force.x, this.force.y)
        this.vel.add(this.force);
        this.pos.add(this.vel);
        line(this.pos.x, this.pos.y, this.pos.x+this.force.x, this.pos.y+this.force.y);
        this.force.mult(0);
    }
}
function Connection(a, b){
    this.a = a;
    this.b = b;
    this.natural_length = 20;
    this.k = 10;
    this.get_force = function(){
        return -this.k*Math.abs(this.natural_length - this.get_length());
    }
    this.get_length = function(){
        var d = a.pos.dist(b.pos); 
        console.log(d);
        return d 
    }
}