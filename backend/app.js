var express = require('express');
var socket = require('socket.io');

var app = express();


server = app.listen(5000, function () {
    console.log('server is running on port 5000')
});

io = socket(server);

io.on('connection', (socket) => {
    console.log(socket.handshake.query.room);
    let room = socket.handshake.query.room;
    socket.join(room, () => {
        console.log(Object.keys(socket.rooms)); // [ <socket.id>, 'room 237' ]
        // io.to(rooms).emit('a new user has joined the room');
    });
    socket.on('SEND_MESSAGE', function (data) {
        console.log(data);
        io.to(room).emit('MESS', data);
        io.to(data.to).emit('MESS', data);
    })
});

