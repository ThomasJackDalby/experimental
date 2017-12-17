var grid = []
var walkers = []
var nodes_x = 2*550
var nodes_y = 2*350
var spacing = 3
var node_radius = 5
var walker_radius = 10
var count = 0
var limit = 10000

var max_level = 5
var walker_turn_probability =  [0.4,0.4,0.2,0.2,0.05,0.005]
var walker_create_probability = [0.6,0.5,0.3,0.3,0.3,0.3]
var walker_level_probability = [0,0.4,0.2,0.1,0.1,0.0]
var walker_move_probability = [0,0.4,0.2,0.1,0.1,0.5]

function reset(){
    grid = []
    walkers = []

    for(var x=0;x<nodes_x;x++){
        grid[x] = []
        for(var y=0;y<nodes_y;y++){
            grid[x][y] = new Node(x, y)
        }
    }

    for(var i=0;i<4;i++){
        walkers.push(new Walker(Math.floor(nodes_x/2),Math.floor(nodes_y/2), Math.floor(random()*4), max_level))
    }

    // set some initial road
    // y = Math.floor(nodes_y/2)
    // for(var x=0;x<nodes_x;x++){
    //     grid[x][y].level = max_level
    //     if (random() < 0.4) walkers.push(new Walker(x, y, random()<0.5?1:3, random()<walker_level_probability[max_level]?max_level:max_level - 1))
    // }
    background(0, 0, 20);
}

function setup(){
    colorMode(HSL)
    // frameRate(5)
    strokeWeight(1)
    createCanvas(spacing*(nodes_x+1), spacing*(nodes_y+1))
    reset()
}

function draw(){
    if (count++ > limit){
        reset();
        return;
    }
    // translate(spacing, spacing)
    //background(0, 0, 20);
    for(var i=0;i<walkers.length;i++){
        var w = walkers[i]
        keep_walking = w.update()
        if (!keep_walking) {
            walkers.splice(i, 1);
        }
        w.show();
    }

    for(var x=0;x<nodes_x;x++){
        for(var y=0;y<nodes_y;y++){
            grid[x][y].show()
        }
    }
}

function Node(x, y){
    this.x = x
    this.y = y
    this.level = -1

    this.show = function(){
        // if (this.level === -1) return // fill(0,0,100)
        // else fill(255/(max_level+1)*this.level, 50, 50)
        // ellipse(this.x*spacing, this.y*spacing, node_radius, node_radius)
    }
}

function Walker(x, y, dir, level){
    // Walks from node to node, randomly spawning new lesser walkers
    this.x = x
    this.y = y
    this.dir = dir
    this.level = level

    this.update = function(){
        if (this.level === -1) return false

        px = this.x
        py = this.y

        // move in their direction
        var r = random()
        var angle = Math.atan2(((nodes_y/2)-this.y),((nodes_x/2)-this.x))
        // if (random()<walker_move_probability[this.level]){
        if (r > 0.85 * Math.max(Math.abs(Math.sin(angle)), Math.abs(Math.cos(angle)))){
            if (this.dir === 0) this.x += 1
            else if (this.dir === 1) this.y -= 1
            else if (this.dir === 2) this.x -= 1
            else if (this.dir === 3) this.y += 1
        }
        else return true;

        stroke(255/(max_level+1)*this.level, 50, 50)
        //strokeWeight(5/(max_level+1)*this.level+1)
        line(this.x*spacing, this.y*spacing, px*spacing, py*spacing)

        // Check out of bounds
        if (this.x < 0 || this.x >= nodes_x) return false
        if (this.y < 0 || this.y >= nodes_y) return false
        var n = grid[this.x][this.y];
        
        // if the node is the same or greater, terminate, or if lesser, set to level
        if (n.level < this.level) n.level = this.level
        else return false

        // if distance to center is larger, maybe terminate

        // randomly turn
        if (random() < walker_turn_probability[this.level]){
            this.dir = (this.dir === 1 || this.dir === 3) ? (random()<0.5?0:2) : (random()<0.5?1:3)
        }

        // randomly create a new walker at an angle
        if (random() < walker_create_probability[this.level]) {
            new_dir = (this.dir === 1 || this.dir === 3) ? (random()<0.5?0:2) : (random()<0.5?1:3)
            walkers.push(new Walker(this.x, this.y, new_dir, random()<walker_level_probability[this.level]?this.level:this.level - 1))
        }

        return true
    }

    this.show = function(){
        // fill(0, 50, 50)
        // ellipse(this.x*spacing, this.y*spacing, walker_radius, walker_radius)
    }
}