const expect = require('expect');

const {validString} = require('./validation');

describe('validString', () => {
	it('should reject non string values', () => {
		var response = validString(15);
		expect(response).toBe(false);
	});

	it('should reject string with ONLY spaces', () => {
		var response = validString('    ');
		expect(response).toBe(false);
	});

	it('should allow string with non-space characters', () => {
		var response = validString('  Name  ');
		expect(response).toBe(true);
	});
});