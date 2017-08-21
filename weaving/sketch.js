function setup() {
    createCanvas(200, 800);
}

function draw() {
    background(51);
    stroke(255);
    strokeWeight(12);

    translate(width/2, 20);
    // var w = new Weave(3, ["0+", "2-"]);
    var w = new Weave(4, ["0+", "2+", "2-"]);
    //var w = new Weave(4, ["0+", "2+", "2-", "2-"]);
    //var w = new Weave(3, ["1-", "2-", "2-", "1-"]);
    var w = new Weave(5, ["0+", "4-", "0+", "4-", "1+", "3-", "1+", "3-",]);
    w.draw();

    noLoop();
}

var h = 30;
var w = 25;

function Weave(number_of_strands, twists) {
    this.number_of_strands = number_of_strands;
    this.twists = twists;

    this.colours = [];
    for(var i=0;i<this.number_of_strands;i++) {
        this.colours.push(color('hsl('+Math.round(i/this.number_of_strands * 255)+', 100%, 50%)'));
    }

    this.draw = function() {
        var positions = [];
        for(var i=0;i<this.number_of_strands;i++){
            positions.push(i);
        }
        translate(-w*this.number_of_strands/2, 0);
        for(var iter=0;iter<10;iter++){
            for(var t=0;t<this.twists.length;t++) {
                var twist_strand = +this.twists[t].substring(0, this.twists[t].length-1);
                var twist_direction = this.twists[t].substring(this.twists[t].length-1, this.twists[t].length) === "+";
                var twist_swap = twist_strand + (twist_direction ? 1 : -1);
                for(var s=0;s<this.number_of_strands;s++){
                    stroke(this.colours[positions[s]]);
                    if (s === twist_strand) continue;
                    else if (s === twist_strand-1 && twist_direction === false) {
                        line(s*w, t*h, (s+1)*w, (t+1)*h);
                    }
                    else if (s === twist_strand+1 && twist_direction === true) line(s*w, t*h, (s-1)*w, (t+1)*h)
                    else line(s*w, t*h, s*w, (t+1)*h);
                }
                stroke(this.colours[positions[twist_strand]]);
                if (twist_direction === false) line(twist_strand*w, t*h, (twist_strand-1)*w, (t+1)*h);
                else line(twist_strand*w, t*h, (twist_strand+1)*w, (t+1)*h);
                var temp = positions[twist_strand];
                positions[twist_strand] = positions[twist_swap];
                positions[twist_swap] = temp;
            }
            translate(0, h*this.twists.length-1);
        }
    }
}