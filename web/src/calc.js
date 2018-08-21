import _ from 'lodash';

// REVIEW: option for not average but last price?
export function avgPrice (state) {
	return state.entriesPromise.then(() => {
		let distance = 0;
		const prices = [];

		for (const entry of state.entries) {
			switch (entry.type) {
			case 'mileage':
				distance += entry.endMileage - entry.beginMileage;
				break;

			case 'payment':
				if (distance !== 0) {
					prices.push(entry.price / distance);
					distance = 0;
				}
				break;

			default:
				console.warn(`unknown type '${entry.type}', skipping...`);
				break;
			}
		}

		return _.mean(prices);
	});
}

export function unpayedDistance (state) {
	return state.entriesPromise.then(() => {
		let distance = 0;
		for (const entry of state.entries) {
			switch (entry.type) {
			case 'mileage':
				distance += entry.endMileage - entry.beginMileage;
				break;

			case 'payment':
				distance = 0;
				break;
			}
		}
		return distance;
	});
}

export function estimatedPrice (state) {
	return Promise.all([
		avgPrice(state),
		unpayedDistance(state),
	]).then(([ price, distance ]) => {
		console.log(price, distance);
		return price * distance;
	});
}
