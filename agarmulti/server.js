var express = require('express');
var app = express();
var server = app.listen(process.env.PORT || 3000, listen);
var blobs = {};
var speed = 3;

function listen() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Agar IO Server running at http://'+host+":"+port);
}

app.use(express.static('public'));
setInterval(heartbeat, 33);

function heartbeat() {
    io.sockets.emit('update', blobs);
}

var io = require('socket.io')(server);
io.sockets.on('connection', 
    function(socket) {
    console.log("["+socket.id+"] connected.");
    socket.on('start', function(data){
        blobs[socket.id] = new Blob(data.x, data.y, 0);
    });

    socket.on('action', function(data) {
        var blob = blobs[socket.id];
        if (blob == null) {
            console.log("unknown blob");
            return;
        }
        if (data.up === true) blob.y -= speed;
        if (data.down === true) blob.y += speed;
        if (data.left === true) blob.x -= speed;
        if (data.right === true) blob.x += speed;
        blob.dir = data.dir;
    });

    socket.on('disconnect', function() {
      console.log("["+socket.id + "] disconnected.");
        delete blobs[socket.id];
    });
});

function Blob(x, y, dir) {
    this.x = x;
    this.y = y;
    this.dir = dir;
}