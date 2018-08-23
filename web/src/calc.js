import _ from 'lodash/fp';

import { entries } from './model.js';

// REVIEW: option for not average but last price?
export const avgPrice = state =>
	_.flow(
		_.reduce(([ distance, prices ], entry) => {
			switch (entry.type) {
			case 'mileage':
				distance += entry.endMileage - entry.beginMileage;
				return [ distance, prices ];
			case 'payement':
				if (distance !== 0) {
					prices.push(entry.price / distance);
					return [ 0, prices ];
				}
			}

			return [ distance, prices ];
		}, [ 0, [] ]),
		_.last,
		_.mean,
	)(entries(state));

export const unpayedDistance = state =>
	_.flow(
		_.takeRightWhile(entry => entry.type !== 'payment'),
		_.reduce(
			(distance, entry) =>
				distance + (entry.endMileage - entry.beginMileage),
			0
		),
	)(entries(state));

export const estimatedPrice = state =>
	avgPrice(state) * unpayedDistance(state);
