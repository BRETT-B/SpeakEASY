

class Patrons {
	constructor () {
		this.patrons = [];
	}
	addPatron (id, name, room) {
		var patron = {id, name, room};
		this.patrons.push(patron);
		return patron;
	}
	removePatron (id) {
		var patron = this.getPatron(id);

		if (patron) {
			this.patrons = this.patrons.filter((patron) => patron.id !== id);
		}

		return patron;
	}
	getPatron (id) {
		return this.patrons.filter((patron) => patron.id === id)[0];
	}
	getPatronList (room) {
		var patrons = this.patrons.filter((patron) => patron.room === room);
		var namesArray = patrons.map((patron) => patron.name);
		return namesArray;
	}
}

module.exports = {Patrons};