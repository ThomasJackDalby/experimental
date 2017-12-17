let last_map;
let map;
let next_map;
let cells_x = 100;
let cells_y = 100;
let cell_w = 10;
let cell_h = 10; 


function setup(){
    map = make2Darray(cells_x, cells_y)
    next_map = make2Darray(cells_x, cells_y)
    createCanvas(400, 400);
    frameRate(15);
}

function get_alive_neighbours(x, y){
    let count = 0;
    if (x > 0){
        if (y > 0) count += map[x-1][y-1];
        count += map[x-1][y];
        if (y < cells_y-1) count += map[x-1][y+1];
    } 
    if (y > 0) count += map[x][y-1];
    if (y < cells_y-1) count += map[x][y+1];
    if (x < cells_x-1)  {
        if (y > 0) count += map[x+1][y-1];
        count += map[x+1][y];
        if (y < cells_y-1) count += map[x+1][y+1];
    }
    return count;
}

function update(){
    for(let y=0;y<cells_y;y++){
        for(let x=0;x<cells_x;x++){
            let c = get_alive_neighbours(x, y);
            if (map[x][y] == 0 && c == 3) {
                next_map[x][y] = 1;
            }
            else if (map[x][y] == 1) {
                if (c < 2) next_map[x][y] = 0;
                if (c > 3) next_map[x][y] = 0;
            }
            else next_map[x][y] = 0;
        }        
    }
    let temp = map;
    map = next_map;
    next_map = temp;
}

function make2Darray(w, h){
    let a = []
    for(let i=0;i<h;i++){
        a[i] = []
        for(let j=0;j<w;j++){
            a[i][j] = Math.floor(random()*2);
        }
    }
    return a;
}

function draw(){
    update();
    fill(255);
    background(51);
    for(let y=0;y<cells_y;y++){
        for(let x=0;x<cells_x;x++){
            if (map[x][y] == 1) {
                rect(x*cell_w, y*cell_h, cell_w, cell_h);
            }
        }
    }
}