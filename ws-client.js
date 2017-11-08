var socket = io();

var canvas = document.getElementById("a");
var ctx = canvas.getContext("2d");
 
var id;

var ballX = 0;
var ballY = 0;

    socket.on('init', function (data) {
        id = data.id;
        console.log('Created ball: ' + id); 
        //document.querySelector("p").innerHTML = id;
        document.querySelector("h1").innerHTML = "";
        socket.emit('init', {width: canvas.width, height: canvas.height, id: id});     
    });

    socket.on('move', function (data) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        var gridX = ballX;
        var gridY = ballY;

        while (gridX > 200)
            gridX -= 200;
        while (gridY > 200)
            gridY -= 200;

        gridX *= -0.005;
        gridY *= -0.005;

        for (var i = gridX; i < data.width; i++){
            for (var c = gridY; c < data.height; c++){
                ctx.fillStyle = "#e0e0e0";
                ctx.beginPath();
                ctx.rect(i * 200, c * 200, 196, 196);
                ctx.closePath();
                ctx.fill();
            }
        }

        for (var i = 0; i < data.balls.length; i++) {
            console.log(data.balls[i].id);
            if (data.balls[i].id == id){
                ctx.fillStyle = "#0000BB";
                ctx.beginPath();
                //ctx.arc(data.balls[i].x, data.balls[i].y, 20, 0, Math.PI * 2);
                ctx.arc(canvas.width / 2, canvas.height / 2, 20, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
                ballX = data.balls[i].x;
                ballY = data.balls[i].y;
            }
            else {
                ctx.fillStyle = "#BB0000";
                ctx.beginPath();
                ctx.arc(data.balls[i].x - (ballX + gridX) + canvas.width / 2, data.balls[i].y - (ballY + gridY) + canvas.height / 2, 20, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
            }
        }
    });

    socket.on('setBallPos', function(data) {
        ballX = data.x;
        ballY = data.y;
    });

document.addEventListener('keydown', function(event) {
    if(event.keyCode == 65) {
        socket.emit('moveLeft', {id: id});
    }
    if(event.keyCode == 68) {
        socket.emit('moveRight', {id: id});
    }
    if(event.keyCode == 87) {
        socket.emit('moveUp', {id: id});
    }
    if(event.keyCode == 83) {
        socket.emit('moveDown', {id: id});
    }
});

document.addEventListener('keyup', function(event) {
    if(event.keyCode == 65) {
        socket.emit('stopLeft', {id: id});
    }
    if(event.keyCode == 68) {
        socket.emit('stopRight', {id: id});
    }
    if(event.keyCode == 87) {
        socket.emit('stopUp', {id: id});
    }
    if(event.keyCode == 83) {
        socket.emit('stopDown', {id: id});
    }
});