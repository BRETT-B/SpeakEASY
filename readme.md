<p align="center"><img style="text-align: center" src="https://stark-reaches-93085.herokuapp.com/img/speakeasy-logo.png"/></p>

# speakEASY

speakEASY is an web based multi-room chat client themed around Atlanta's speakeasy locations.  With a style reminiscent of the 1920s, The chat rooms are private, meaning the messages only emit to the room. A geographical feature allows the user to send their location to the room.  When other users click on the link sent a custom Google map will populate on the page, dropping custom markers at each speakeasy location in the city. Instead of using the Google Maps API for the info window I created a side div to load in all the speakeasy's information, such as history, info, and of course the nitty-gritty on how to gain entry. Also inside the info div is a linked title that, when clicked, will open a new tab placing the user inside the private room specific to that location.

<p align="center"><img style="text-align: center" src ="https://stark-reaches-93085.herokuapp.com/img/speakEASY.gif"/></p>

## Features

- No installation necessary - just visit the [live demo](https://stark-reaches-93085.herokuapp.com/)
- Messages are persistent, stored in a database. Location links are removed on exit from the room.
- Custom styled map, to enrich the prohibition-era theme
- "In-the-know" information to each of Atlanta's most esoteric speakeasy bars.
- Private chatrooms for every location.

## Languages & Libraries

Full-Stack Web Application 
* Node.js server (sripts written using ES6)
* Node modules used:
	* mongodb
	* soket.io
	* mustache.js
	* yargs
	* express
	* moment.js
	* lodash
* jQuery
* Bootstrap (SASS)
* Mocha (TDD)

## Future Plans

* Emit sound on messsage recieved
* Create login, so user can set up their own private chat room
* Create administration portal to add more speakeasy locations to the database

## Developer

[Brett Burdick](https://github.com/BRETT-B)






