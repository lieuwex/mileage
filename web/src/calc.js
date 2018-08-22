import _ from 'lodash';

import { entries } from './model.js';

// REVIEW: option for not average but last price?
export function avgPrice (state) {
	let distance = 0;
	const prices = [];

	for (const entry of entries(state)) {
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
}

export function unpayedDistance (state) {
	let distance = 0;
	for (const entry of entries(state)) {
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
}

export function estimatedPrice (state) {
	const price = avgPrice(state);
	const distance = unpayedDistance(state);
	console.log(price, distance);
	return price * distance;
}
