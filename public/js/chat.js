var current;
sendLocation = function(latitude, longitude) {
    latitude = latitude;
    longitude = longitude;
    initMap(latitude, longitude);
}

$(document).ready(function() {
    var width = $('#info-window').width()
    console.log(width);
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
    socket.on('updatePatronList', function(patrons) {
        var ul = $('<ul></ul>');
        patrons.forEach(function(patron) {
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
            coords: message.coords,
            timestamp: formattedTime
        });
        $('#messages').append(html);
        scrollMessages();
    });
    $('#message-form').on('submit', function(event) {
        event.preventDefault();
        var messageInput = $('[name=message]');
        socket.emit('createMessage', {
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
/*===========================================================================================
                            GENERATE MAP AND INFO DIV
============================================================================================*/
    var map;
    var mapStyle = [{ "featureType": "administrative", "elementType": "labels.text.fill", "stylers": [{ "color": "#444444" }] }, { "featureType": "landscape", "elementType": "all", "stylers": [{ "color": "#f2f2f2" }] }, { "featureType": "landscape", "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }] }, { "featureType": "landscape.man_made", "elementType": "geometry.fill", "stylers": [{ "hue": "#ffd100" }, { "saturation": "44" }] }, { "featureType": "landscape.man_made", "elementType": "geometry.stroke", "stylers": [{ "saturation": "-1" }, { "hue": "#ff0000" }] }, { "featureType": "landscape.natural", "elementType": "geometry", "stylers": [{ "saturation": "-16" }] }, { "featureType": "landscape.natural", "elementType": "geometry.fill", "stylers": [{ "hue": "#ffd100" }, { "saturation": "44" }] }, { "featureType": "poi", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "road", "elementType": "all", "stylers": [{ "saturation": "-30" }, { "lightness": "12" }, { "hue": "#ff8e00" }] }, { "featureType": "road.highway", "elementType": "all", "stylers": [{ "visibility": "simplified" }, { "saturation": "-26" }] }, { "featureType": "road.arterial", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "transit", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "water", "elementType": "all", "stylers": [{ "color": "#c0b78d" }, { "visibility": "on" }, { "saturation": "4" }, { "lightness": "40" }] }, { "featureType": "water", "elementType": "geometry", "stylers": [{ "hue": "#ffe300" }] }, { "featureType": "water", "elementType": "geometry.fill", "stylers": [{ "hue": "#ffe300" }, { "saturation": "-3" }, { "lightness": "-10" }] }, { "featureType": "water", "elementType": "labels", "stylers": [{ "hue": "#ff0000" }, { "saturation": "-100" }, { "lightness": "-5" }] }, { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "visibility": "off" }] }, { "featureType": "water", "elementType": "labels.text.stroke", "stylers": [{ "visibility": "off" }] }];

    var infoDiv = $('#info-window');
    var infoDivH4 = $('#info-window h4');
    window.initMap = function(latitude, longitude) {
        if (typeof latitude === 'number') {
            current = new google.maps.LatLng(latitude, longitude);
            var mapOptions = {
                center: current,
                mapTypeId: 'terrain',
                zoom: 12,
                styles: mapStyle
            };
            map = new google.maps.Map(document.getElementById("map"),
                mapOptions);
            fetch('https://raw.githubusercontent.com/BRETT-B/SpeakEASY/master/public/js/geolocation/speakeasy.json')
                .then(function(response) {
                    return response.json()
                })
                .then(plotMarkers);
        } else if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                current = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                var mapOptions = {
                    center: current,
                    mapTypeId: 'terrain',
                    zoom: 12,
                    styles: mapStyle
                };
                map = new google.maps.Map(document.getElementById("map"),
                    mapOptions);
                fetch('https://raw.githubusercontent.com/BRETT-B/SpeakEASY/master/public/js/geolocation/speakeasy.json')
                    .then(function(response) {
                        return response.json()
                    })
                    .then(plotMarkers);
            });
        } else {
            return alert('Geolocation not supported by your current browser');
        }
    }
    google.maps.event.addDomListener(window, 'load', initMap);
    var markers;
    var bounds;

    function plotMarkers(m) {
        markers = [];
        bounds = new google.maps.LatLngBounds();
        m.forEach(function(marker) {
            var position = new google.maps.LatLng(marker.lat, marker.lng);
            var title = marker.name;
            var est = marker.est;
            var info = marker.info;
            var entry = marker.entry;
            var speakeasy = new google.maps.Marker({
                position: position,
                map: map,
                animation: google.maps.Animation.DROP,
                icon: 'https://raw.githubusercontent.com/BRETT-B/SpeakEASY/master/public/img/marker.png',
                title: title
            });
            var contentString = '<div id="title-container" class="container-fluid" />'+
            '<a href="chat.html?name=Brett+Burdick&room='+encodeURI(marker.name)+'#">'+
            '<h4 id="info-title" style="width:'+width+'px" class="h4-responsive font-italic text-xs-center">'+marker.name+'</h4></a><h6 class="h6-responsive text-xs-center p-t-3">est. '+marker.est+'</h6></div><div id="info-text" class="text-justify p-a-1"><p>'+marker.info+'</p><p>'+marker.entry+'</p></div>';
            markers.push(
                new google.maps.Marker({
                    position: current,
                    map: map
                })
            );
            markers.push(speakeasy);
            speakeasy.addListener('click', function() {
                infoDiv.html(contentString);
            });  
            
            bounds.extend(position);
        });
    }
});
