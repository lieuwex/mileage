import { html } from 'lit-html';
import { entries } from '../model.js';
import {
	formatDate,
	formatDateTime,
	formatDuration,
	locale,
	sameDate,
} from './utils.js';

const entryElem = entry => {
	const [ friendlyType, rows ] = (function () {
		const makeRow = (key, value) =>
			html`
				<div class="row">
					<b>${key}</b>: ${value}
				</div>
			`;

		switch (entry.type) {
		case 'mileage': {
			const duration = entry.endDate - entry.beginDate;
			const dateRow = sameDate(entry.beginDate, entry.endDate) ?
				formatDate(entry.beginDate) :
				`${formatDate(entry.beginDate)} - ${formatDate(entry.endDate)}`;

			return [ 'Trip', [
				makeRow('Date', dateRow),
				makeRow('Duration', formatDuration(duration / 1000)),
				makeRow('Distance Driven', `${entry.distance}km`),
			]];
		}
		case 'payment':
			return [ 'Payment', [
				makeRow('Date', formatDateTime(entry.endDate)),
				makeRow('Price', '€' + entry.price.toLocaleString(locale)),
			]];
		}

		throw new Error(`unkown type '${entry.type}'`);
	})();

	return html`
		<div class$="entry ${entry.type}">
			<div class="type">
				${friendlyType}
			</div>

			<div class="rows">
				${rows}
			</div>
		</div>
	`;
};

export const entriesList = state =>
	html`
		<div id="entries">
			${state.get('loadingEntries') ?
				html`<span class="loading">Loading entries...</span>` :
				entries(state).map(entryElem).reverse()
			}
		</div>
	`;
