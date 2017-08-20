var circles = [];
var count;

function setup(){
    colorMode(HSL);
    createCanvas(1200, 800);
    noFill();
    stroke(255);
    strokeWeight(2);
    count = 0;
}

function draw(){
    count++;
    if (count > 500){
        circles = [];
        count = 0;
    }
    background(0);

    for(var j=0;j<5;j++){
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
    var hue = random(255);
    this.growing = true;
    this.speed = random(1, 10);

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
            this.r += this.speed;
        }
    }

    this.show = function(){
        fill(hue, 100, 50);
        ellipse(this.x, this.y, 2*this.r, 2*this.r);
    }
}