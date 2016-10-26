const expect = require('expect');

const {Patrons} = require('./patrons');

describe('Patrons', () => {

	var patrons;

	beforeEach(() => {
		patrons = new Patrons();
		patrons.patrons = [{
			id: '1',
			name: 'Al',
			room: 'C'
		},
		{
			id: '2',
			name: 'Bob',
			room: 'B'
		},
		{
			id: '3',
			name: 'Chris',
			room: 'C'
		}]
	});

	it('should add new patron', () => {
		var patrons = new Patrons();
		var patron = {
			id: '123',
			name: 'Brett',
			room: '2'
		};
		var responsePatron = patrons.addPatron(patron.id, patron.name, patron.room);

		expect(patrons.patrons).toEqual([patron]);

	});

	it('should find a patron', () => {
		var patronId = '2';
		var patron = patrons.getPatron(patronId);
		expect(patron.id).toBe(patronId);
	});

	it('should not find a patron', () => {
		var patronId = '99';
		var patron = patrons.getPatron(patronId);
		expect(patron).toNotExist();
	});

	it('should remove a patron', () => {
		var patronId = '1';
		var patron = patrons.removePatron(patronId);

		expect(patron.id).toBe(patronId);
		expect(patrons.patrons.length).toBe(2);
	});

	it('should not remove a patron', () => {
		var patronId = '99';
		var patron = patrons.removePatron(patronId);

		expect(patron).toNotExist();
		expect(patrons.patrons.length).toBe(3);
	});

	it('should return names for room C', () => {
		var patronsList = patrons.getPatronList('C');
		expect(patronsList).toEqual(['Al', 'Chris']);
	});

	it('should return names for room B', () => {
		var patronsList = patrons.getPatronList('B');
		expect(patronsList).toEqual(['Bob']);
	});
});