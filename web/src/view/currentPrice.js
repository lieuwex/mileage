import { html } from 'lit-html';
import { unpayedDistance, estimatedPrice } from '../calc.js';
import { until } from 'lit-html/lib/until';
import { loading } from './utils.js';

const mileageInfo = distance => {
	console.log('distance', distance);

	return html`
		<span id="distance">
			<b>${distance}</b>km
		</span>
	`;
};

const priceInfo = price => {
	console.log('price', price);
	const euros = Math.floor(price);
	const cents = (price - euros).toFixed(4).slice(2);

	if (!price) {
		return undefined;
	}

	return html`
		<span id="priceEstimate">
			<span id="euro">&euro;</span>
			<span id="euros">${euros}</span>
			<span id="cents">${cents}</span>
		</span>
	`;
};

export default state => {
	const distance = unpayedDistance(state);
	const price = estimatedPrice(state);

	const mInfo = mileageInfo(distance);
	const pInfo = priceInfo(price);

	return html`
		<div id="currentInfo">
			${mInfo}
			${pInfo == null ?
				undefined :
				html`
					<span class="divider"></span>
					${pInfo}
				`}
		</div>
	`;
};
