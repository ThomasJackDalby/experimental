var rows = 25;
var cols = 25;
var w = 50;
var h = 50;
var cells = [];
var x = 0;
var y = 0;
var path = []


function setup(){
    createCanvas(w*cols, h*rows);
    noFill();
    stroke(255);
    strokeWeight(2);
    frameRate(25);
    reset();
}

function reset(){
    cells = [];
    for(var j=0;j<cols;j++){
        for(var i=0;i<rows;i++){
            cells.push(new Cell(i, j));
        }
    }
    for(var i=0;i<cells.length;i++){
        var c = cells[i];
        if (c.i != 0) c.neighbours.push(cells[get_index(c.i-1, c.j)]);
        if (c.i != cols-1) c.neighbours.push(cells[get_index(c.i+1, c.j)]);
        if (c.j != 0) c.neighbours.push(cells[get_index(c.i, c.j-1)]);
        if (c.j != rows-1) c.neighbours.push(cells[get_index(c.i, c.j+1)]);
    }
}

function draw(){
    var i = get_index(x, y);
    var current_cell = cells[i];
    current_cell.visited = true;
    var allowed_cells = current_cell.neighbours.filter(function(c) { return !c.visited });
    var next_cell;
    if (allowed_cells.length == 0){
        if (path.length == 0) {
            reset();
            return;
        }
        else {
            next_cell = path.pop();
        }
    }
    else{
        next_cell = allowed_cells[Math.floor(random(allowed_cells.length))];
        path.push(next_cell);
        if (next_cell.i === current_cell.i-1){
            next_cell.walls[2] = false;
            current_cell.walls[0] = false;
        }
        else if (next_cell.i === current_cell.i+1){
            next_cell.walls[0] = false;
            current_cell.walls[2] = false;
        }
        else if (next_cell.j === current_cell.j-1){
            next_cell.walls[3] = false;
            current_cell.walls[1] = false;
        }
        else if (next_cell.j === current_cell.j+1){
            next_cell.walls[1] = false;
            current_cell.walls[3] = false;
        }
    } 

    x = next_cell.i;
    y = next_cell.j;

   background(0);
   noFill();
   for(var i=0;i<cells.length;i++){
       cells[i].show();
   }
   fill(255, 0, 0);
   rect(x*w, y*h, w, h);
}

function get_index(i, j){
    return j * cols + i;
}

function Cell(i, j){
    this.i = i;
    this.j = j;
    this.visited = false;
    this.neighbours = [];
    this.walls = [true, true, true, true];
    this.show = function(){
        push();
        if (this.walls[0]) line(this.i*w, this.j*h, this.i*w, (this.j+1)*h);
        if (this.walls[1]) line(this.i*w, this.j*h, (this.i+1)*w, this.j*h);
        if (this.walls[2]) line((this.i+1)*w, this.j*h, (this.i+1)*w, (this.j+1)*h);
        if (this.walls[3]) line(this.i*w, (this.j+1)*h, (this.i+1)*w, (this.j+1)*h);
        if (this.visited) {
            noStroke();
            rect(this.i*w, this.j*h, w, h);
        }
        pop();
    }
}