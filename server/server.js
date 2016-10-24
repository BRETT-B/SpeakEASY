const path = require('path');
const http = require('http');
const ex = require('express');
const socketIO = require('socket.io');

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
	console.log('New user connected');
	// Emit message to welcome user from Admin
	socket.emit('newMessage', {
		from: 'Admin',
		text: 'Welcome to the SpeakEASY chat client',
		timestamp: new Date().getTime()
	});
	// Emit message to all sockets that user joined, excluding that user
	socket.broadcast.emit('newMessage', {
		from: 'Admin',
		text: 'New user joined',
		timestamp: new Date().getTime()
	});
	socket.on('createMessage', (message) => {
		console.log('createMessage', message);
		io.emit('newMessage', {
			from: message.from,
			text: message.text,
			timestamp: new Date().getTime()
		});
		// socket.broadcast.emit('newMessage', {
		// 	from: message.from,
		// 	text: message.text,
		// 	timestamp: new Date().getTime()
		// });
	});

	socket.on('disconnect', () => {
		console.log('Client disconnected');
	});
});

server.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});
