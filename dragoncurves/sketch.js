var diameter = 25;
var thickness = 4;

function setup() {
    createCanvas(600, 600);
}

function draw() {
    background(51);
    colorMode(HSL);
    stroke(255);
    noFill();
    strokeWeight(thickness);

    var order = 4;
    var offset = 2*order*diameter;
    translate(0, 0);
    for(var x=0;x<5;x++){
        for(var y=0;y<5;y++){
            patch(order, x*offset, y*offset);
        }
    }
    noLoop();
}

function patch(order, x, y){
    push();
    translate(x, y);
    stroke(0, 255, 50);
    make_curve(order);
    rotate(PI/2.0);
    stroke(30, 255, 50);
    make_curve(order);
    rotate(PI/2.0);
    stroke(60, 255, 50);
    make_curve(order);
    rotate(PI/2.0);
    stroke(90, 255, 50);
    make_curve(order);
    pop();
}

function make_curve(order){
    push();
    var curve = calculate_curve(order);
    translate(0, -diameter/2.0);
    draw_curve(curve, 0);
    pop();
}

function draw_curve(curve, index) {
    if (index >= curve.length) return;
    var x = -diameter/2.0;
    var rotation_angle = -Math.PI/2.0;
    var end_angle = 0;
    var start_angle = -Math.PI/2.0;

    if (curve[index] == 1) {
        x *= -1;
        rotation_angle *= -1;
        start_angle = Math.PI;
        end_angle = 3*Math.PI/2.0;
    }
    
    arc(x, 0, diameter, diameter, start_angle, end_angle);
    y = -diameter/2.0;
    translate(x, y);
    rotate(rotation_angle);
    draw_curve(curve, ++index);    
}

function calculate_curve(order) {
    if (order == 0) return [1];
    var head = calculate_curve(order-1);
    var tail = head.slice(); // Copy the head section.
    tail[tail.length/2-0.5] = 0; // Invert the middle of the tail section.
    return head.concat([1]).concat(tail);
}