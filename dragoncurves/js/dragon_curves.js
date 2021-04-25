let sketch_div;

let diameter_slider;
let thickness_slider;
let order_slider;
let x_patches_slider;
let y_patches_slider;
let num_rotations_slider;
let background_input;
let curve_color_inputs = [];
let curve_color_input_groups = [];

function setup() {
    var display = createCanvas(500, 500);
    display.parent("sketch-div");
    sketch_div = document.getElementById("sketch-div");

    diameter_slider = createSliderInput("diameter", "inputs-div", "Diameter", 1, 100, 25);
    thickness_slider = createSliderInput("thickness", "inputs-div", "Thickness", 1, 15, 10);
    order_slider = createSliderInput("order", "inputs-div", "Order", 1, 10, 3);
    x_patches_slider = createSliderInput("x_patches", "inputs-div", "X Patches", 1, 5, 1);
    y_patches_slider = createSliderInput("y_patches", "inputs-div", "Y Patches", 1, 5, 1);
    num_rotations_slider = createSliderInput("num_rotations", "inputs-div", "No. Rotations", 1, 4, 1);

    background_input = createColorPickerInput("background", "inputs-div", "Background");
    for(let i=0;i<4;i++) {
        curve_color_inputs.push(createColorPickerInput("curve_color_"+i, "inputs-div", "Curve #"+i+" Colour", '#ff0000'));
        curve_color_input_groups.push(document.getElementById("curve_color_"+i+"-form-group"));
    }
}

function draw() {
    resizeCanvas(sketch_div.offsetWidth, sketch_div.offsetHeight);
    background(background_input.color());
    noFill();
    
    let diameter = diameter_slider.value();;
    let thickness = thickness_slider.value();;
    let order = order_slider.value();
    let x_patches = x_patches_slider.value();
    let y_patches = y_patches_slider.value();
    let num_rotations = num_rotations_slider.value();
    let colours = [
        curve_color_inputs[0].color(),
        curve_color_inputs[1].color(),
        curve_color_inputs[2].color(),
        curve_color_inputs[3].color()
    ];
    
    for (let i=0;i<4;i++) {
        if (i < num_rotations) curve_color_input_groups[i].style.display = "block";
        else curve_color_input_groups[i].style.display = "none";
    }

    strokeWeight(thickness);
    let offset = 2*order*diameter;
    translate(width/2, height/2);
    for(var x=0;x<x_patches;x++){
        for(var y=0;y<y_patches;y++){
            patch(order, x*offset, y*offset, num_rotations, colours, diameter);
        }
    }
}

function patch(order, x, y, num_rotations, colours, diameter){
    push();
    translate(x, y);
    for (let i=0;i<num_rotations;i++) {
        stroke(colours[i]);
        make_curve(order, diameter);
        rotate(PI/2.0);
    }
    pop();
}

function make_curve(order, diameter){
    push();
    let curve = calculate_curve(order);
    translate(0, -diameter/2.0);
    draw_curve(curve, 0, diameter);
    pop();
}

function draw_curve(curve, index, diameter) {
    if (index >= curve.length) return;
    let x = -diameter/2.0;
    let rotation_angle = -Math.PI/2.0;
    let end_angle = 0;
    let start_angle = -Math.PI/2.0;

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
    draw_curve(curve, ++index, diameter);    
}

function calculate_curve(order) {
    if (order == 0) return [1];
    let head = calculate_curve(order-1);
    let tail = head.slice(); // Copy the head section.
    tail[tail.length / 2 - 0.5] = 0; // Invert the middle of the tail section.
    return head.concat([1]).concat(tail);
}