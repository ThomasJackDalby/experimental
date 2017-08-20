angles = []
speeds = [];
radius = [];
centres = [];
amount = 8;
paths = [];
var last = [0,0];

function setup(){
    createCanvas(700, 700);
    for(var i=0;i<amount;i++){
        if (i === 0){
            centres[i] = [0, 0];
            angles[i] = 0;
            speeds[i] = 0.01;
            radius[i] = 50;
        }
        else {
            centres[i] = [0, 0];
            angles[i] = 0;
            speeds[i] = speeds[i-1] * 1.1;
            radius[i] = radius[i-1]*0.95;
        }
    }
    background(51);
}
function draw(){
    strokeWeight(2);
    noFill();
    for(var i=0;i<amount;i++){
        angles[i] += speeds[i];        
        if (i==0) {
            centres[i][0] = width/2; 
            centres[i][1] = height/2; 
        }
        else { 
            centres[i][0] = centres[i-1][0]+Math.cos(angles[i-1])*radius[i-1];
            centres[i][1] = centres[i-1][1]+Math.sin(angles[i-1])*radius[i-1];
        }
        //ellipse(centres[i][0], centres[i][1], 2*radius[i]);
        //line(centres[i][0], centres[i][1], centres[i][0]+Math.cos(angles[i])*radius[i], centres[i][1]+Math.sin(angles[i])*radius[i])
    }

    //var last_centre = centres[centres.length-1];
    stroke(255);
    if (last !== undefined){
    var new_last = [0, 0];
        new_last[0] = centres[centres.length-1][0]+Math.cos(angles[centres.length-1])*radius[centres.length-1];
        new_last[1] = centres[centres.length-1][1]+Math.sin(angles[centres.length-1])*radius[centres.length-1];
    //paths.push([last[0], last[1]]);
    //stroke(255, 0, 0);
    //for(var i=1;i<paths.length;i++){
        line(new_last[0], new_last[1], last[0], last[1]);
        last = new_last;
    }
    //}

}

function get_next(){
    return [x, y];
}