var socket = io();

socket.on('connect', function() {
    console.log('Connected to server');
});
socket.on('disconnect', function() {
    console.log('Disconnected from server')
});

socket.on('newMessage', function(message) {
	var formattedTime = moment(message.timestamp).format('h:mm a');
	var li = $('<li></li>');
	li.text(`${message.from} ${formattedTime}: ${message.text}`);

	$('#messages').append(li);
});
socket.on('newLocation', function (message) {
	var formattedTime = moment(message.timestamp).format('h:mm a');
	var li = $('<li></li>');
	var a = $('<a target="_blank">My Location</a>');
	li.text(`${message.from} ${formattedTime}: `);
	a.attr('href', message.url);
	li.append(a);
	$('#messages').append(li);
});

$('#message-form').on('submit', function (event) {
	event.preventDefault();
	var messageInput = $('[name=message]');
	socket.emit('createMessage', {
		from: 'User',
		text: messageInput.val()
	}, function () {
		messageInput.val('');
	});
});

var locationButton = $('#send-location');
locationButton.on('click', function () {
	if (!navigator.geolocation) {
		return alert('Geolocation not supported by your current browser');
	}
	locationButton.attr('disabled', 'disabled').text('Sending...');
	navigator.geolocation.getCurrentPosition(function (position) {
		locationButton.removeAttr('disabled').text('Send Location');
		socket.emit('createLocation', {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		});
	}, function () {
		locationButton.removeAttr('disabled').text('Send Location');
		alert('Unable to fetch location');
	});
});