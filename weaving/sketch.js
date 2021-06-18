let sketch_div;

let thickness_slider;
let width_slider;
let height_slider;
let background_input;
let weave_color_input;
let number_of_strands_slider;

function setup() {
    var display = createCanvas(500, 500);
    display.parent("sketch-div");
    sketch_div = document.getElementById("sketch-div");

    thickness_slider = createSliderInput("thickness", "inputs-div", "Thickness", 1, 20, 12);
    width_slider = createSliderInput("width", "inputs-div", "Width", 1, 100, 25);
    height_slider = createSliderInput("height", "inputs-div", "Height", 1, 100, 25);
    number_of_strands_slider = createSliderInput("number_of_strands", "inputs-div", "No. Strands", 1, 10, 5);
    pattern_input = createTextInput("pattern", "inputs-div", "Pattern");

    background_input = createColorPickerInput("background", "inputs-div", "Background");
    weave_color_input = createColorPickerInput("weave_color", "inputs-div", "Weave Colour", '#ff0000');
}

function draw() {
    resizeCanvas(sketch_div.offsetWidth, sketch_div.offsetHeight);
    background(background_input.color());
    strokeWeight(thickness_slider.value());
    translate(width / 2, 20);

    let w = width_slider.value();
    let h = height_slider.value();
    let raw_pattern = pattern_input.value().split(",");
    let min_strands = 1;
    for (let i = 0; i < raw_pattern.length; i++) {

    }

    let number_of_strands = number_of_strands_slider.value()

    let weave = new Weave(number_of_strands, ["0+", "4-", "0+", "4-", "1+", "3-", "1+", "3-"]);
    weave.draw(w, h);
}

function Weave(number_of_strands, twists) {
    this.number_of_strands = number_of_strands;
    this.twists = twists;

    this.colours = [];
    for (var i = 0; i < this.number_of_strands; i++) {
        this.colours.push(color('hsl(' + Math.round(i / this.number_of_strands * 255) + ', 100%, 50%)'));
    }

    this.draw = function (w, h) {
        var positions = [];
        for (var i = 0; i < this.number_of_strands; i++) {
            positions.push(i);
        }
        translate(-w * this.number_of_strands / 2, 0);
        for (var iter = 0; iter < 10; iter++) {
            for (var t = 0; t < this.twists.length; t++) {
                var twist_strand = +this.twists[t].substring(0, this.twists[t].length - 1);
                var twist_direction = this.twists[t].substring(this.twists[t].length - 1, this.twists[t].length) === "+";
                var twist_swap = twist_strand + (twist_direction ? 1 : -1);
                for (var s = 0; s < this.number_of_strands; s++) {
                    stroke(this.colours[positions[s]]);
                    if (s === twist_strand) continue;
                    else if (s === twist_strand - 1 && twist_direction === false) {
                        line(s * w, t * h, (s + 1) * w, (t + 1) * h);
                    }
                    else if (s === twist_strand + 1 && twist_direction === true) line(s * w, t * h, (s - 1) * w, (t + 1) * h)
                    else line(s * w, t * h, s * w, (t + 1) * h);
                }
                stroke(this.colours[positions[twist_strand]]);
                if (twist_direction === false) line(twist_strand * w, t * h, (twist_strand - 1) * w, (t + 1) * h);
                else line(twist_strand * w, t * h, (twist_strand + 1) * w, (t + 1) * h);
                var temp = positions[twist_strand];
                positions[twist_strand] = positions[twist_swap];
                positions[twist_swap] = temp;
            }
            translate(0, h * this.twists.length - 1);
        }
    }
}