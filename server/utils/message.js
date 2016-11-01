var moment = require('moment');

var generateMessage = (from, text, timestamp) => {
	if (!timestamp) {
		timestamp = moment().valueOf();
	}
	return {
		from,
		text,
		timestamp
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