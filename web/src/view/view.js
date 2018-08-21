import { html } from 'lit-html/lib/lit-extended';
import { until } from 'lit-html/lib/until';

import currentPrice from './currentPrice.js'
import form from './form.js';
import { entriesList } from './entries.js';
import { loading } from './utils.js';

// TODO: less state
function radioOnChange (state) {
	return event => {
		const el = event.target;
		if (!el.checked) {
			return;
		}

		state.choosenForm = ({
			trip: 'startTrip',
			payment: 'payment',
		})[el.id];

		window.renderApp(state);
	};
}

const formSwitchPanel = state => {
	if (state.currentTrip != null) {
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
					checked=${state.currentForm() === 'startTrip'} />
			</label>

			<label>
				Add payment
				<input
					type="radio"
					id="payment"
					name="formSwitch"
					onchange=${radioOnChange(state)}
					checked=${state.currentForm() === 'payment'} />
			</label>
		</form>
	`;
};

function currentForm (state) {
	return form(state);
}

export default state => html`
	${currentPrice(state)}
	${until(formSwitchPanel(state), loading)}
	${until(currentForm(state), loading)}
	${entriesList(state)}
`;

