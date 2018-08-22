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
	const makeRow = (key, value) => {
		return html`
			<div class="row">
				<b>${key}</b>: ${value}
			</div>
		`;
	};

	let friendlyType;
	let rows;
	if (entry.type === 'mileage') {
		const duration = entry.endDate - entry.beginDate;
		const dateRow = sameDate(entry.beginDate, entry.endDate) ?
			formatDate(entry.beginDate) :
			`${formatDate(entry.beginDate)} - ${formatDate(entry.endDate)}`;

		friendlyType = 'Trip';
		rows = [
			makeRow('Date', dateRow),
			makeRow('Duration', formatDuration(duration / 1000)),
			makeRow('Distance Driven', `${entry.distance}km`),
		];
	} else if (entry.type === 'payment') {
		friendlyType = 'Payment';
		rows = [
			makeRow('Date', formatDateTime(entry.endDate)),
			makeRow('Price', '€' + entry.price.toLocaleString(locale)),
		]
	} else {
		throw new Error(`unkown type '${entry.type}'`);
	}

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

export const entriesList = state => html`
	<div id="entries">
		${state.get('loadingEntries') ?
			html`<span class="loading">Loading entries...</span>` :
			entries(state).map(entryElem).reverse()
		}
	</div>
`;
