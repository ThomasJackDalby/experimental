function Ship(){
    this.pos = createVector(width/2.0, height/2.0);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.dir = 0;

    this.update = function(){
        if (keyIsDown(UP_ARROW)){
            this.acc = p5.Vector.fromAngle(this.dir);
            this.acc.setMag(FORWARD_THRUST);
        }
        else{
            this.acc = createVector(0, 0);
        }

        if (keyIsDown(LEFT_ARROW)){
            this.dir -= ROTATION_SPEED;
            if (this.dir < 0){
                this.dir = 2*PI;
            }
        }
        else if (keyIsDown(RIGHT_ARROW)){
            this.dir += ROTATION_SPEED;
            if (this.dir > 2*PI){
                this.dir = 0;
            }
        }
        if (keyIsDown(DOWN_ARROW)){
            this.fire();
        }

        this.vel.add(this.acc);
        this.vel.limit(MAX_SPEED);
        this.pos.add(this.vel);
        this.acc.mult(0);

        wrap(this.pos);
    }

    this.fire = function(){
        bullets.push(new Bullet(this.pos.x, this.pos.y, this.dir));
    }

    this.show = function(){
        push();
        var w = 10;
        var l = 20;
        var o = 5;
        stroke(255);
        translate(this.pos.x, this.pos.y);
        rotate(this.dir);
        triangle(l-o, 0, -o, w, -o, -w);
        if (keyIsDown(UP_ARROW)){
            stroke(255, 0, 0);
            triangle(-15, 0, -4, 4, -4, -4);
        }
        pop();
    }
}

function Bullet(x, y, dir){
    this.pos = createVector(x, y);
    this.vel = createVector(Math.cos(dir), Math.sin(dir));
    this.vel.setMag(5);

    this.update = function(){
        this.pos.add(this.vel);
    }

    this.show = function(){
        ellipse(this.pos.x, this.pos.y, 3, 3);
    }
}