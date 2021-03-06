import { html } from 'lit-html/lib/lit-extended';

import currentPrice from './currentPrice.js'
import form from './form.js';
import { entriesList } from './entries.js';
import { currentForm } from '../model.js';

function radioOnChange (state) {
	return event => {
		const el = event.target;
		if (!el.checked) {
			return;
		}

		const form = ({
			trip: 'startTrip',
			payment: 'payment',
		})[el.id];
		window.state = state.set('choosenForm', form);

		window.renderApp();
	};
}

const formSwitchPanel = state => {
	if (state.get('currentTrip') != null) {
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
					onchange=${radioOnChange(state)}
					checked=${currentForm(state) === 'startTrip'} />
			</label>

			<label>
				Add payment
				<input
					type="radio"
					id="payment"
					name="formSwitch"
					onchange=${radioOnChange(state)}
					checked=${currentForm(state) === 'payment'} />
			</label>
		</form>
	`;
};

export default state => html`
	${currentPrice(state)}
	${formSwitchPanel(state)}
	${form(state)}
	${entriesList(state)}
`;

