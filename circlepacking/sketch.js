var circles = [];

function setup(){
    createCanvas(1200, 800);
    noFill();
    stroke(255);
    strokeWeight(2);
}

function draw(){
    background(51);

    for(var j=0;j<100;j++){
        var c = createNewCircle();
        if (c != null){
            circles.push(c);
        }
    }

    for(var i=0;i<circles.length;i++){
        var c = circles[i];
        c.update();
        c.show();
    }

}

function createNewCircle(){
    var x = random(width);
    var y = random(height);

    for(var i=0;i<circles.length;i++){
        var other = circles[i];
        if ((x-other.x)*(x-other.x) + (y-other.y)*(y-other.y) < 4+other.r*other.r) return null;
    }
    return new Circle(x, y, 2);
}


function Circle(x, y, r){
    this.x = x;
    this.y = y;
    this.r = r;
    this.growing = true;

    this.isTouchingEdge = function() {
        if (this.x - this.r < 0) return true;
        if (this.x + this.r > width) return true;
        if (this.y - this.r < 0) return true;
        if (this.y + this.r > height) return true;
        return false;
    }

    this.isTouchingCircle = function(){
        for(var i=0;i<circles.length;i++){
            var other = circles[i];
            if (this == other) continue;
            if ((this.x-other.x)*(this.x-other.x) + (this.y-other.y)*(this.y-other.y) < (this.r+other.r)*(this.r+other.r)) return true;
        }
        return false;
    }

    this.update = function(){
        if (!this.growing) return;
        else {
            if (this.isTouchingEdge() || this.isTouchingCircle()){
                this.growing = false;
                return;
            }
            this.r += 2;
        }
    }

    this.show = function(){
        ellipse(this.x, this.y, 2*this.r, 2*this.r);
    }
}