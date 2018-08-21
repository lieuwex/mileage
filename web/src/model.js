export default class Model {
	constructor() {
		this.currentTrip = null;
		this.choosenForm = 'startTrip';
		this.entries = [];

		this.entriesPromise = new Promise(resolve => {
			this._done = () => resolve();
		});
	}

	currentForm() {
		if (this.currentTrip != null) {
			return 'endTrip';
		}

		return this.choosenForm;
	}

	updateEntries(entries) {
		this._done();
		this.entries = entries;
	}
}

export async function getCurrentTrip (model) {
	const currentTrip = await fetch('/currentTrip').then(r => r.json());
	model.currentTrip = currentTrip;

	return model;
}
