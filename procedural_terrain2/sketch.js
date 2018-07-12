var renderer;
var geometry;
var flying = 0;
function setup() {

  renderer = createCanvas(windowWidth, windowHeight, WEBGL);

  noStroke();
  camera(0, -600, 110, 0, 0, 0, 0, -1, 0);

  geometry = new p5.Geometry(100, 100, function() {
    for (var y = 0; y <= this.detailY; y++) {
      var v = y / this.detailY;
      for (var x = 0; x <= this.detailX; x++) {
        var u = x / this.detailX;
        var p = new p5.Vector(u - 0.5, v - 0.5, 0);
        this.vertices.push(p);
        this.uvs.push(u, v);
      }
    }
  });
}

function draw() {
  var tt = millis();
  background(0);

  var sunPos = p5.Vector.fromAngles(tt / 5000, PI / 4, 1000);
  var moonPos = p5.Vector.fromAngles(PI + tt / 5000, PI / 4, 1000);
  
  push();
  fill(255, 250, 136);
  translate(sunPos);
  sphere(60);
  pop();

  push();
  translate(moonPos);
  fill(255);
  sphere(40);
  pop();

  var scl = 0.08;
  var xOff = 0;
  for(let x=0;x<geometry.detailX;x++){
      var xDist = 5*Math.abs(x - geometry.detailX/2);
      var xScale = 0.00005 * xDist * xDist + 1;
      var yOff = flying;
      for(let y=0;y<geometry.detailY;y++){
          var z = map(noise(xOff, yOff) * xScale, 0, 1.5, -0.2, 0.3);
          if (z < 0) z = 0;
          geometry.vertices[y * (geometry.detailX + 1) + x].z = z;
          yOff += scl;
        }
        xOff += scl;
  }
  flying += 0.09;

  fill(255);
  pointLight(255, 250, 136, sunPos);
  pointLight(150, 150, 150, moonPos);

  geometry.computeFaces().computeNormals();
  renderer.createBuffers("!", geometry);
  renderer.drawBuffersScaled("!", 1000, 1000, 500);
}
