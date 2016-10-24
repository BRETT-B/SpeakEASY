var generateMessage = (from, text) => {
	return {
		from,
		text,
		timestamp: new Date().getTime()
	};
};
var generateLocation = (from, latitude, longitude) => {
	return {
		from,
		url: `https://www.google.com/maps?q=${latitude},${longitude}`,
		timestamp: new Date().getTime()
	};
};



module.exports = {generateMessage, generateLocation};