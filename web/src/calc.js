import _ from 'lodash';

import { entriesPromise } from './entries.js';

// REVIEW: option for not average but last price?
export function avgPrice () {
	return entriesPromise.then(entries => {
		let distance = 0;
		const prices = [];

		for (const entry of entries) {
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

export function unpayedDistance() {
	return entriesPromise.then(entries => {
		let distance = 0;
		for (const entry of entries) {
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

export function estimatedPrice() {
	return Promise.all([
		avgPrice(),
		unpayedDistance(),
	]).then(([ price, distance ]) => {
		console.log(price, distance);
		return price * distance;
	});
}
