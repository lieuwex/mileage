import { html } from 'lit-html';

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

	handler() {
		const input = document.getElementById('beginMileage');
		submit({
			type: 'trip-start',
			mileage: Number.parseInt(input.value, 10),
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

	handler() {
		const input = document.getElementById('endMileage');
		submit({
			type: 'trip-end',
			mileage: Number.parseInt(input.value, 10),
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

	handler() {
		const input = document.getElementById('price');
		submit({
			type: 'payment',
			price: Number.parseInt(input.value, 10),
		});
	},
};

export default option => {
	const form = ({
		startTrip: startTripForm,
		endTrip: endTripForm,
		payment: paymentForm,
	})[option];

	function handler (event) {
		event.preventDefault();
		form.handler.apply(this, arguments);
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
