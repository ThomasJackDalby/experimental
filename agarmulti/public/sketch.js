var blob;
var blobs = [];
var start_radius;
var socket;
var zoom = 1;
var radius = 16;

function setup(){
    frameRate(30);
    createCanvas(600, 600);
    socket = io.connect('http://localhost:3000');
    start_radius = random(16, 64);
    blob = new Blob(width/2, height/2, start_radius);
    var data = {
        x: blob.pos.x,
        y: blob.pos.y,
    }
    socket.emit('start', data);
    socket.on('update', function(data){
        console.log("update");
        blobs = data;
        var blob_data = data[socket.id];
        if (blob_data === undefined){
            console.log("Not in list");
            return;
        }          
        blob.pos.x = blob_data.x;
        blob.pos.y = blob_data.y;
    });
}

function draw(){
    background(51);
    strokeWeight(4);
    translate(width/2.0, height/2.0);
    translate(-blob.pos.x, -blob.pos.y);
    for(id in blobs) {
        fill(0, 0, 255);
        if (id!== socket.id) {
            other = blobs[id];
            if (other === null) return;
            ellipse(other.x, other.y,2*radius, 2*radius);
            var dirv = p5.Vector.fromAngle(other.dir);
            dirv.setMag(radius*1.3);
            line(other.x, other.y, other.x + dirv.x, other.y + dirv.y);
        }
    }
    blob.show(); 
    blob.update();
    if (!focused) return;
    var data = {
        up: keyIsDown(UP_ARROW) || keyIsDown(W),
        down: keyIsDown(DOWN_ARROW) || keyIsDown(S),
        left: keyIsDown(LEFT_ARROW) || keyIsDown(A),
        right: keyIsDown(RIGHT_ARROW) || keyIsDown(D),
        dir: blob.dir,
        fire: mouseIsPressed,
    }
    socket.emit('action', data);
}