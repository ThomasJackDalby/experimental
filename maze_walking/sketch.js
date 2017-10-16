var rows = 50
var cols = 50
var spacing = 10
var path = []
var cells = []
var cells_to_do = []
var line_width = 5
var found_maze = false;
var colour_cells = []
var h = 0
var find_iter = 100;

function setup(){
    // frameRate(15)
    colorMode(HSL)
    createCanvas((cols+1)*spacing, (rows+1)*spacing)
    background(0);
    strokeWeight(line_width)
    for(var row=0;row<rows;row++){
        for(var col=0;col<cols;col++){
            cells.push(new Cell(col, row));
        }
    }
    for(var i=0;i<cells.length;i++){
        cells[i].set_neightbours()
    }
    cells[0].done = true

    // modified cell search
    for(var i=0;i<cells.length;i++){
        cells_to_do.push(cells[i])
    }
}

function get_next_cell(){
    // modified cell search
    if (cells_to_do.length > 0) {
        i = Math.floor(random() *cells_to_do.length) 
        next_cell = cells_to_do[i]
        cells_to_do.splice(i, 1)
        return next_cell
    }
    // for(var row=0;row<rows;row++){
    //     for(var col=0;col<cols;col++){
    //         cell = cells[get_index(col, row)];
    //         if (!cell.done){
    //             return cell;
    //         }
    //     }
    // }
    return null
}

function get_index(col, row){
    return row*cols+col
}

function draw(){
    translate(spacing, spacing)
    if (!found_maze) find_maze()
    else colour_maze();
}


function colour_maze(){
    // colour the cells in the list with the current hue
    h += 3
    if (h > 360) h = 0
    fill(h, 100, 50)
    noStroke();
    next_colour_cells = []
    for(var i=0;i<colour_cells.length;i++){
        var c = colour_cells[i];
        rect((c.col-0.5)*spacing, (c.row-0.5)*spacing, spacing, spacing)

        // add the current cells doors to the colour list.
        for(var j=0;j<c.doors.length;j++){
            if (!c.doors[j].coloured){
                c.coloured = true
                next_colour_cells.push(c.doors[j])
            }
        }
    }
    colour_cells = next_colour_cells;
}

function find_maze(){
    for(var t=0;t<find_iter;t++){
        if (path.length === 0){
            // if nothing in the path, start the path somewhere
            cell = get_next_cell()
            if (cell === null){
                // the path is complete
                found_maze = true
                colour_cells = [cells[0]]
                return;           
            }
            cell.in_path = true;
            path.push(cell)
        }
        else {
            // otherwise add a neighbouring cell to the path
            var current_cell = path[path.length-1]
            var next_cell = current_cell.neighbours[Math.floor(random(0, current_cell.neighbours.length))]

            if (next_cell.in_path){
                // find where the cell is in the path
                var i = 0
                var new_path = []
                while(true){
                    cell = path[i++]
                    new_path.push(cell)
                    if (cell === next_cell){
                        break;
                    }
                }
                stroke(0, 0, 0)
                for(;i<path.length;i++){
                    path[i].in_path = false
                    var a = path[i];
                    var b = path[i-1];
                    line(a.col*spacing, a.row*spacing, b.col*spacing, b.row*spacing)

                }
                path = new_path
            }
            else if (next_cell.done) {
                // turn all the path to done. good job.
                path.push(next_cell)
                next_cell.in_path = true
                for(var i=0;i<path.length;i++){
                    var cell = path[i]
                    cell.done = true
                    cell.in_path = false
                }
                stroke(255, 100, 50)
                for(var i=0;i<path.length-1;i++){
                    var a = path[i];
                    var b = path[i+1];
                    line(a.col*spacing, a.row*spacing, b.col*spacing, b.row*spacing)
                    // the path is done. ad all the bits as neww neighbours to each other.
                    a.doors.push(b);
                    b.doors.push(a);
                }
                path = []
            }
            else{
                stroke(0, 100, 50)
                line(current_cell.col*spacing, current_cell.row*spacing, next_cell.col*spacing, next_cell.row*spacing)
                path.push(next_cell)
                next_cell.in_path = true
            }
        }
    }
}

function Cell(col, row){
    this.col = col
    this.row = row
    this.coloured = false;
    this.in_path = false
    this.done = false;
    this.neighbours = []
    this.doors = []

    this.set_neightbours = function() {
        if (this.col > 0) this.neighbours.push(cells[get_index(this.col-1, this.row)])
        if (this.col < cols-1) this.neighbours.push(cells[get_index(this.col+1, this.row)])
        if (this.row > 0) this.neighbours.push(cells[get_index(this.col, this.row-1)]) 
        if (this.row < rows-1) this.neighbours.push(cells[get_index(this.col, this.row+1)])
    }
}