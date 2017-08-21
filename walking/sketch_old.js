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
    noLoop();
}

function Creature(){
    this.nodes = [];
    this.connections = [];

    for(var i=0;i<5;i++){
        this.nodes.push(new Node());
    }
    for(var i=0;i<10;i++){
        this.connections.push(new Connection(Math.floor(random(0, this.nodes.length)), Math.floor(random(0, this.nodes.length))));
    }

    this.show = function(){
        for(var i=0;i<this.connections.length;i++){
            var c = this.connections[i];
            var a = this.nodes[c.a];
            var b = this.nodes[c.b];
            line(a.pos.x, a.pos.y, b.pos.x, b.pos.y);
        }
        for(var i=0;i<this.nodes.length;i++){
            var n = this.nodes[i];
            ellipse(n.pos.x, n.pos.y, 10, 10);
        }
    }
} 

function Node() {
    this.pos = createVector(random(width), random(height));
}
function Connection(a, b){
    this.a = a;
    this.b = b;
}