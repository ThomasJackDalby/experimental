var rooms = []
var room_width = 100;
var room_height = 100;
var number_of_rooms = 50;


function setup(){
    createCanvas(500, 500);

    for(var i=0;i<number_of_rooms;i++){
        rooms.push(new Room())
    }

}

function draw(){
    background(51);
    stroke(255);
    noFill()
    translate(width/2, height/2)

    for(var i=0;i<rooms.length;i++){
        rooms[i].update();
    }

    for(var i=0;i<rooms.length;i++){
        rooms[i].show();
    }
}

function Room(){
    var angle = random() * 2 * Math.PI
    var radius = random() * 100
    this.pos = createVector(Math.cos(angle)*radius, Math.sin(angle)*radius)
    this.w = random()*room_width+5
    this.h = random()*room_height+5

    this.intersects = function(other){
        if (this.x + this.w < other.x) return false;
        else if (this.x > other.x + other.w) return false;
        else if (this.y + this.h < other.y) return false;
        else if (this.y > other.y + other.h) return false;         
        else return true;
    }

    this.update = function(){
        // get rooms which it intersects with
        var intersecting_rooms = []
        for(var i=0;i<rooms.length;i++){
            var other = rooms[i];
            if (other === this) continue;
            if (other.intersects(this)){
                intersecting_rooms.push(other);
            }
        }
        // move away from all items
        var dir = createVector(0, 0);
        for(var i=0;i<intersecting_rooms.length;i++){
            var d = p5.Vector.sub(intersecting_rooms[i].pos, this.pos);
            d.setMag(1)
            dir.add(d)
        }
        dir.mult(-1);
        if (intersecting_rooms.length > 0){
            this.pos.add(dir);
        }
    }

    this.show = function(){
        rect(this.pos.x - this.w/2, this.pos.y - this.h/2, this.w, this.h);
    }
}