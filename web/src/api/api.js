async function getEntries () {
	const raw = await fetch('/entries').then(r => r.json());

	return raw.map(entry => {
		entry.beginDate = entry.beginDate && new Date(entry.beginDate);
		entry.endDate = new Date(entry.endDate);
		entry.distance = entry.endMileage - entry.beginMileage;
		return entry;
	});
}

async function getCurrentTrip () {
	return await fetch('/currentTrip').then(r => r.json());
}

export async function updateEntries (state) {
	const currentTrip = await getCurrentTrip();
	const entries = await getEntries();

	return state.merge({
		loadingEntries: false,
		entries,
		currentTrip,
	});
}

export async function updateCurrentTrip (state) {
	const currentTrip = await getCurrentTrip();
	return state.set('currentTrip', currentTrip);
}
