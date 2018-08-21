export async function updateEntries (state) {
	const raw = await fetch('/entries').then(r => r.json());

	const entries = raw.map(entry => {
		entry.beginDate = entry.beginDate && new Date(entry.beginDate);
		entry.endDate = new Date(entry.endDate);
		entry.distance = entry.endMileage - entry.beginMileage;
		return entry;
	});

	state.updateEntries(entries);
	return state;
}
