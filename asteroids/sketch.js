FORWARD_THRUST = 0.05;
ROTATION_SPEED = 0.1;
MAX_SPEED = 3;

MARGIN = 10;

var ship;
var rocks = [];
var bullets = [];

function setup(){
    createCanvas(800, 500);
    strokeWeight(2);
    ship = new Ship();

    for(var i=0;i<20;i++){
        rocks.push(new Rock(random(width), random(height), random(10, 50)));
    }

    noFill();
}

function draw(){
    background(51);
    ship.update();
    ship.show();
    stroke(255);

    // for (var i=0;i<rocks.length;i++){
    //     for(var j=i+1;j<rocks.length;j++){
    //         var a = rocks[i];
    //         var b = rocks[j];
    //         var d2 = (a.pos.x-b.pos.x)*(a.pos.x-b.pos.x) + (a.pos.y-b.pos.y)*(a.pos.y-b.pos.y);
    //         if (d2 < (a.r+b.r)*(a.r+b.r)){
                
    //             // Direction between two balls
    //             var c = p5.Vector.sub(b.pos, a.pos);
    //             c.normalise();
                
    //             var a_vel = collide(a.vel, c);
    //             var b_vel = collide(b.vel, c.mult(-1));

    //             b.force.add(c);
    //             a.force.sub(c);
    //         }
    //     }
    // }


    for(var i=0;i<bullets.length;i++){
        bullets[i].update();
        bullets[i].show();
    }
    for(var i=0;i<rocks.length;i++){
        rocks[i].update();
        rocks[i].show();
    }
}

function collide(vel, dir){
    var vel_parallel = p5.dot(vel, c);
    var vel_perpendicular = p5.sub(vel, vel_parallel);
    vel_parallel.mult(0.8);
    var vel_new = vel_parallel.add(vel_perpendicular);
    return vel_new;
}

function wrap(pos){
    if (pos.x < -+MARGIN){
        pos.x = width+MARGIN;
    }
    if (pos.x > width+MARGIN){
        pos.x = -MARGIN;
    }
    if (pos.y < -MARGIN){
        pos.y = height+MARGIN;
    }
    if (pos.y > height+MARGIN){
        pos.y = -MARGIN;
    }
}