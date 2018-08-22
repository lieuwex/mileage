import { html } from 'lit-html';

import { updateEntries } from '../api/api.js';
import { currentForm } from '../model.js';

const submit = info => {
	return fetch('/add', {
		method: 'POST',
		body: JSON.stringify(info),
	});
};

const startTripForm = {
	html() {
		return html`
			<label>
				Begin Mileage
				<input type="number" name="beginMileage" id="beginMileage" min="0" />
			</label>
		`;
	},

	handler(state) {
		const input = document.getElementById('beginMileage');
		const mileage = Number.parseInt(input.value, 10);

		submit({
			type: 'trip-start',
			mileage,
		}).then(res => res.json()).then(trip => {
			window.state = state.set('currentTrip', trip);
			window.renderApp();
		});
	},
};

const endTripForm = {
	html() {
		return html`
			<label>
				End Mileage
				<input type="number" name="endMileage" id="endMileage" min="0" />
			</label>
		`;
	},

	handler(state) {
		const input = document.getElementById('endMileage');
		submit({
			type: 'trip-end',
			mileage: Number.parseInt(input.value, 10),
		}).then(() => {
			state = state.set('currentTrip', null);
			return updateEntries(state);
		}).then(state => {
			window.state = state;
			window.renderApp();
		});
	},
}

const paymentForm = {
	html() {
		return html`
			<label>
				Price
				<input type="number" name="price" id="price" min="0" />
			</label>
		`;
	},

	handler(state) {
		const input = document.getElementById('price');
		submit({
			type: 'payment',
			price: Number.parseInt(input.value, 10),
		}).then(() => {
			return updateEntries(state);
		}).then(state => {
			window.state = state;
			window.renderApp();
		});
	},
};

export default state => {
	const option = currentForm(state);
	const form = ({
		startTrip: startTripForm,
		endTrip: endTripForm,
		payment: paymentForm,
	})[option];

	function handler (event) {
		event.preventDefault();
		return form.handler(state);
	}

	return html`
		<div id="create">
			<form on-submit=${handler}>
				${form.html()}
				<input type="submit" value="Submit" />
			</form>
		</div>
	`;
};
