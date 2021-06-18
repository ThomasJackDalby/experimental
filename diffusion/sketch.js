let sketch_div;

let tree = [];
let particles = [];
let numberOfParticles = 400;
let numberOfIterations = 20;
let particleSize = 10;

let particleSizeSlider;
let backgroundColorInput;
let particleColorInput;
let particleStuckColorInput;
let isFixedInput;
let numberOfParticlesInput;
let wrapParticlesInput;

function resetParticles() {
    tree = [];
    particles = [];
}

function addParticle() {
    particles.push(new Particle(particleSizeSlider.value(), isFixedInput.checked(), particleStuckColorInput.color(), particleColorInput.color(), mouseX, mouseY));
}

function addParticles() {
    for(let i=0;i<numberOfParticlesInput.value();i++) {
        particles.push(new Particle(particleSizeSlider.value(), isFixedInput.checked(), particleStuckColorInput.color(), particleColorInput.color()));
    }
}

function setup() {
    let display = createCanvas(500, 500);
    display.parent("sketch-div");
    sketch_div = document.getElementById("sketch-div");
    colorMode(RGB);

    display.mousePressed(addParticle);

    particleSizeSlider = createSliderInput("particle_size", "inputs-div", "Particle Size", 1, 100, 4);
    isFixedInput = createCheckInput("is_stuck", "inputs-div", "Stuck?", false);
    
    backgroundColorInput = createColorPickerInput("background", "inputs-div", "Background Colour", "#000000");
    particleColorInput = createColorPickerInput("particle_color", "inputs-div", "Particle Colour", "whitesmoke");
    particleStuckColorInput = createColorPickerInput("particle_stuck_color", "inputs-div", "Particle (Stuck) Colour", "blue");
    
    numberOfParticlesInput = createSliderInput("numberOfParticles", "inputs-div", "No. of Particles", 1, 100, 1);
    
    createButtonInput("addParticlesButton", "inputs-div", "Add", addParticles);
    createButtonInput("resetButton", "inputs-div", "Reset", resetParticles);
    
    wrapParticlesInput = createCheckInput("wrapParticles", "inputs-div", "Wrap Particles?", false);
    resetParticles();
}

function draw() {
    resizeCanvas(sketch_div.offsetWidth, sketch_div.offsetHeight);

    for (let t = 0; t < numberOfIterations; t++) {
        for (let i = 0; i < particles.length; i++) {
            let particle = particles[i];
            particle.update();
            particle.checkIsStuck(tree);

            if (particle.stuck) {
                tree.push(particles[i]);
                particles.splice(i, 1);
                break;
            }
        }
        for (let i = particles.length-1; i >= 0; i--) {
            let particle = particles[i];
            if (particle.destroy) particles.splice(i, 1); 
        }
    }
    background(backgroundColorInput.color());
    for (let i = 0; i < particles.length; i++) {
        particles[i].show();
    }
    for (let i = 0; i < tree.length; i++) {
        tree[i].show();
    }
}

function createRandomPos() {
    let x = random(width);
    let y = random(height);
    return createVector(x, y);
}

function quadrance(pos, other) {
    let dx = pos.x - other.x;
    let dy = pos.y - other.y;
    return dx * dx + dy * dy;
}

class Particle {
    constructor(r, stuck, stuckColor, color, x, y) {
        this.r = r;
        this.radius = r;
        this.stuck = stuck;
        this.color = color;
        this.destroy = false;
        this.stuckColor = stuckColor;
        if (arguments.length == 6) this.pos = createVector(x, y);
        else this.pos = createRandomPos();
    }

    checkIsStuck(others) {
        for (let i = 0; i < others.length; i++) {
            if (quadrance(this.pos, others[i].pos) < (this.r + others[i].r) * (this.r + others[i].r)) {
                this.stuck = true;
                return true;
            }
        }
        return false;
    }

    update() {
        this.pos.x += random(-2, 2);
        this.pos.y += random(-2, 2);

        if (!wrapParticlesInput.checked()) {
            if (this.pos.x + this.radius < 0) this.destroy = true;
            else if (this.pos.x - this.radius > width) this.destroy = true;
            else if (this.pos.y + this.radius < 0) this.destroy = true;
            else if (this.pos.y - this.radius > height) this.destroy = true;
        }
        else {
            if (this.pos.x + this.radius < 0) this.pos.x = width + this.radius;
            else if (this.pos.x - this.radius > width) this.pos.x = -this.radius;
            else if (this.pos.y + this.radius < 0) this.pos.y = height + this.radius;
            else if (this.pos.y - this.radius > height) this.pos.y = -this.radius;
        }
    }

    show() {
        if (this.stuck) fill(this.stuckColor);
        else fill(this.color);
        ellipse(this.pos.x, this.pos.y, 2 * this.r, 2 * this.r);
    }
}