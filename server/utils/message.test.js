var expect = require('expect');

var {generateMessage, generateLocation} = require('./message');

describe('generateMessage', () => {
	it('should generate the correct message object', () => {
		var from = 'Brett';
		var text = 'Test message';
		var message = generateMessage(from, text);

		expect(message.timestamp).toBeA('number');
		expect(message).toInclude({from, text});
	});
});
describe('generateMessage', () => {
	it('should generate the correct location object', () => {
		var from = 'Brett';
		var latitude = '11';
		var longitude = '12';
		var coords = '11,12';
		var message = generateLocation(from, latitude, longitude);

		expect(message.timestamp).toBeA('number');
		expect(message).toInclude({from, coords});
	});
});

