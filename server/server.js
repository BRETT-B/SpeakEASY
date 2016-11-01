const path = require('path');
const http = require('http');
const express = require('express');
var router = express.Router();
const socketIO = require('socket.io');

const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;
const dbURL = 'mongodb://localhost:27017/speakEASY';
var db;

const { generateMessage, generateLocation } = require('./utils/message');
const { validString } = require('./utils/validation');

const {Patrons} = require('./utils/patrons');

const publicPath = path.join(__dirname, '../public');
// Set up a environment variable for Heroku
const port = process.env.PORT || 3000;
// Create a app variable to configure Express application
var app = express();
app.use('/', router);
// Create a server using http library
var server = http.createServer(app);
// Configure a web socket server
var io = socketIO(server);
// Create new instance of Users
var patrons = new Patrons();
// Config Express static middleware
app.use(express.static(publicPath));
var speakeasyData;
mongoClient.connect(dbURL, function(error, database){
    if(error){
        console.log(error); //Print out the error because there is one
    }else{
        db = database; //Set the database object that was passed back to our callback, to our global db.
        console.log("Connected to Mongo successfully.");
        speakeasyData = db.collection('localeData');
        console.log(speakeasyData)
    }
});
router.get('/getData', (req, res, next) => {
    speakeasyData.find({}).toArray((err, speakJSON) => res.json(speakJSON));
});
io.on('connection', (socket) => {
    console.log('New client connection opened');


    socket.on('join', (params, callback) => {
        if (!validString(params.name) || !validString(params.room)) {
            return callback('Display Name & Room Name are Required')
        }
        var chatroom = params.room;
        socket.join(params.room);
        patrons.removePatron(socket.id);
        patrons.addPatron(socket.id, params.name, params.room);

        io.to(params.room).emit('updatePatronList', patrons.getPatronList(params.room))
        // socket.leave('')
        //io.emit - this emits to every single connected user (method to() which sends to the given argument)
        //socket.broadcast.emit - this sends the message to everyone except for the current user
        //socket.emit - sends to specifically one user
        // Emit message to welcome user from Admin
        socket.emit('newMessage', generateMessage('Admin', `Welcome to ${chatroom} chatroom`));
        // Emit message to all sockets that user joined, excluding that user
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));

        callback();
    });

    socket.on('createMessage', (message, callback) => {
        var patron = patrons.getPatron(socket.id);
        if (patron && validString(message.text)) {
        	io.to(patron.room).emit('newMessage', generateMessage(patron.name, message.text));
        }
        callback();
    });

    socket.on('createLocation', (coords) => {
    	var patron = patrons.getPatron(socket.id);
    	if (patron){
        	io.to(patron.room).emit('newLocation', generateLocation(patron.name, coords.latitude, coords.longitude));
    	}
    });

    socket.on('disconnect', () => {
        var patron = patrons.removePatron(socket.id);

        if (patron) {
        	io.to(patron.room).emit('updatePatronList', patrons.getPatronList(patron.room));
        	io.to(patron.room).emit('newMessage', generateMessage('Admin', `${patron.name} has left`));
        }
    });
});

server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
