var moment = require('moment');

var generateMessage = (from, text) => {
	return {
		from,
		text,
		timestamp: moment().valueOf()
	};
};
var generateLocation = (from, latitude, longitude) => {
	return {
		from,
		coords: `${latitude},${longitude}`,
		timestamp: moment().valueOf()
	};
};



module.exports = {generateMessage, generateLocation};