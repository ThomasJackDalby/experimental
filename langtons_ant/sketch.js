// Langtons ant

var cells = []
var ant_dir = 0
var rows = 200
var cols = 200
var ant_x = Math.floor(cols/2)
var ant_y = Math.floor(rows/2)
var scaling = 1
var margin = 0
var iterations = 20

function setup(){
    createCanvas(cols*scaling, rows*scaling)
    background(0)
    // frameRate(3)
    noStroke();
    for(var i=0;i<rows;i++){
        for(var j=0;j<cols;j++){
            n = 0; // Math.floor(random(0, 2))
            if (n === 0) fill(200, 200, 200)
            else fill(255, 255, 255)
            cells.push(n)
            rect((j+margin)*scaling, (i+margin)*scaling, (1-2*margin)*scaling, (1-2*margin)*scaling)
        }
    }
}

function draw(){
    for(var t=0;t<iterations;t++){
        // turn the ant based on the cell colour
        var i = get_index(ant_x, ant_y);
        if (cells[i] === 1) {
            ant_dir += 1
            fill(0, 0, 0)
            cells[i] = 0
        }
        else {
            ant_dir -= 1
            fill(255, 255, 255)
            cells[i] = 1
        }
        rect((ant_x+margin)*scaling, (ant_y+margin)*scaling, (1-2*margin)*scaling, (1-2*margin)*scaling)

        // bound the direction
        if (ant_dir < 0) ant_dir = 3
        else if (ant_dir > 3) ant_dir = 0

        // walk the ant forward
        if (ant_dir === 0) ant_x += 1
        else if (ant_dir === 1) ant_y -= 1
        else if (ant_dir === 2) ant_x -= 1
        else if (ant_dir === 3) ant_y += 1

        // draw the ant
        fill(255, 0, 0)
        rect((ant_x+margin)*scaling, (ant_y+margin)*scaling, (1-2*margin)*scaling, (1-2*margin)*scaling)
    }
}

function get_index(col, row){
    return row*cols+col
}