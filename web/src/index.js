import { html, render } from 'lit-html/lib/lit-extended';
import { until } from 'lit-html/lib/until';

import currentPrice from './currentPrice.js'
import form from './form.js';
import { entriesList } from './entries.js';
import { loading } from './utils.js';

let choosenForm = 'startTrip';
const radioOnChange = event => {
	const el = event.target;
	if (!el.checked) {
		return;
	}

	choosenForm = ({
		trip: 'startTrip',
		payment: 'payment',
	})[el.id];
	renderApp();
};
const formSwitchPanel = () => currentTrip.then(trip => {
	if (trip != null) {
		return undefined;
	}

	return html`
		<form>
			<label>
				Add trip
				<input
					type="radio"
					id="trip"
					name="formSwitch"
					onchange=${radioOnChange}
					checked=${choosenForm === 'startTrip'} />
			</label>

			<label>
				Add payment
				<input
					type="radio"
					id="payment"
					name="formSwitch"
					onchange=${radioOnChange}
					checked=${choosenForm === 'payment'} />
			</label>
		</form>
	`;
});

// TODO: automatically update this
const currentTrip = fetch('/currentTrip').then(r => r.json());

const currentForm = () => {
	return currentTrip.then(r => {
		const formType = r == null ?
			choosenForm :
			'endTrip';

		return form(formType);
	});
};

const app = () => html`
	${currentPrice()}
	${until(formSwitchPanel(), loading)}
	${until(currentForm(), loading)}
	${entriesList()}
`;

function renderApp () {
	render(app(), document.body);
}
renderApp();
