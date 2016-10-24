var socket = io();

socket.on('connect', function() {
    console.log('Connected to server');
});
socket.on('disconnect', function() {
    console.log('Disconnected from server')
});

socket.on('newMessage', function(message) {
	console.log('newMessage', message);
	var listItem = $('<li></li>');
	listItem.text(`${message.from}: ${message.text}`);

	$('#messages').append(listItem);
});

$('#message-form').on('submit', function (event) {
	event.preventDefault();

	socket.emit('createMessage', {
		from: 'User',
		text: $('[name=message]').val()
	}, function () {

	});
});