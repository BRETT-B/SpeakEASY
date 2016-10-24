var expect = require('expect');

var {generateMessage} = require('./message');

describe('generateMessage', () => {
	it('should generate the correct message object', () => {
		var from = 'Brett';
		var text = 'Test message';
		var message = generateMessage(from, text);

		expect(message.timestamp).toBeA('number');
		expect(message).toInclude({from, text});
	});
});