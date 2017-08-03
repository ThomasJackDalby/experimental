var blob;
var blobs = [];
var start_radius = 64;
var zoom = 1;

function setup(){
    createCanvas(600, 600);
    blob = new Blob(0, 0, start_radius);
    for(var i=0;i<200;i++){
        blobs[i] = new Blob(random(-width, width), random(-height, height),16);
    }
}

function draw(){
    background(51);
    translate(width/2.0, height/2.0);
    zoom = lerp(zoom, start_radius / blob.r, 0.1);
    scale(zoom);
    translate(-blob.pos.x, -blob.pos.y);

    for(var i=blobs.length-1;i>=0;i--){
        if (blob.eats(blobs[i])){
            blob.eat(blobs[i]);
            blobs.splice(i, 1);
        }
        else blobs[i].show();
    }
    blob.show(); 
    blob.update();
}