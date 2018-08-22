import im from 'immutable';

export default im.Map({
	choosenForm: 'startTrip',

	currentTrip: null,
	entries: [],

	loadingEntries: true,
});

export function currentForm (state) {
	if (state.get('currentTrip') != null) {
		return 'endTrip';
	}

	return state.get('choosenForm');
}

export function entries (state) {
	return state.toJS().entries;
}
