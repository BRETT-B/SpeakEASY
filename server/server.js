const path = require('path');
const http = require('http');
const ex = require('express');
const socketIO = require('socket.io');

const { generateMessage, generateLocation } = require('./utils/message');
const { validString } = require('./utils/validation');

const publicPath = path.join(__dirname, '../public');
// Set up a environment variable for Heroku
const port = process.env.PORT || 3000;
// Create a app variable to configure Express application
var app = ex();
// Create a server using http library
var server = http.createServer(app);
// Configure a web socket server
var io = socketIO(server);
// Config Express static middleware
app.use(ex.static(publicPath));

io.on('connection', (socket) => {
    console.log('New client connection opened');


    socket.on('join', (params, callback) => {
        if (!validString(params.name) || !validString(params.room)) {
            callback('Display Name & Room Name are Required')
        }

        socket.join(params.room);
        // socket.leave('')
        //io.emit - this emits to every single connected user (method to() which sends to the given argument)
        //socket.broadcast.emit - this sends the message to everyone except for the current user
        //socket.emit - sends to specifically one user
        // Emit message to welcome user from Admin
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to SpeakEASY'));
        // Emit message to all sockets that user joined, excluding that user
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));

        callback();
    });

    socket.on('createMessage', (message, callback) => {
        console.log('createMessage', message);
        io.emit('newMessage', generateMessage(message.from, message.text));
        callback();
    });

    socket.on('createLocation', (coords) => {
        io.emit('newLocation', generateLocation('Admin', coords.latitude, coords.longitude));
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
