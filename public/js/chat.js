$(document).ready(function() {
    var socket = io();
    function scrollMessages() {
        // selectors
        var messages = $('#messages');
        var newMessage = messages.children('li:last-child');
        // heights
        var clientHeight = messages.prop('clientHeight');
        var scrollTop = messages.prop('scrollTop');
        var scrollHeight = messages.prop('scrollHeight');
        var newMessageHeight = newMessage.innerHeight();
        var lastMessageHeight = newMessage.prev().innerHeight();
        if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
            messages.scrollTop(scrollHeight);
        }
    };
    socket.on('connect', function() {
        var params = $.deparam(window.location.search);
        socket.emit('join', params, function(error) {
            if (error) {
                alert(error);
                window.location.href = '/';
            } else {
                console.log('No error');
            }
        });
    });
    socket.on('disconnect', function() {
        console.log('Disconnected from server')
    });
    socket.on('updatePatronList', function (patrons) {
    	var ul = $('<ul></ul>');

    	patrons.forEach(function (patron) {
    		ul.append($('<li></li>').text(patron));
    	});

    	$('#patrons').html(ul);
    });
    socket.on('newMessage', function(message) {
        var formattedTime = moment(message.timestamp).format('h:mm a');
        var template = $('#message-template').html();
        var html = Mustache.render(template, {
            text: message.text,
            from: message.from,
            timestamp: formattedTime
        });
        $('#messages').append(html);
        scrollMessages();
    });
    socket.on('newLocation', function(message) {
        var formattedTime = moment(message.timestamp).format('h:mm a');
        var template = $('#location-template').html();
        var html = Mustache.render(template, {
            from: message.from,
            url: message.url,
            timestamp: formattedTime
        });
        $('#messages').append(html);
        scrollMessages();
    });
    $('#message-form').on('submit', function(event) {
        event.preventDefault();
        var messageInput = $('[name=message]');
        socket.emit('createMessage', {
            from: 'User',
            text: messageInput.val()
        }, function() {
            messageInput.val('');
        });
    });
    var locationButton = $('#send-location');
    locationButton.on('click', function() {
        if (!navigator.geolocation) {
            return alert('Geolocation not supported by your current browser');
        }
        locationButton.attr('disabled', 'disabled').html('<i class="fa fa-refresh"></i>');
        navigator.geolocation.getCurrentPosition(function(position) {
            locationButton.removeAttr('disabled').html('<i class="fa fa-map-marker"></i>');
            socket.emit('createLocation', {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            });
        }, function() {
            locationButton.removeAttr('disabled').html('<i class="fa fa-map-marker"></i>');
            alert('Unable to fetch location');
        });
    });
});
