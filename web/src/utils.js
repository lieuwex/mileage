import { html } from 'lit-html';

export const locale = 'nl';

export function formatDate (date) {
	return date.toLocaleDateString(locale);
}

export function formatDateTime (date) {
	return date.toLocaleString(locale);
}

export function formatDuration (seconds) {
	let minutes = Math.round(seconds / 60);
	const hours = Math.round(minutes / 60);
	seconds = Math.round(seconds % 60);
	minutes = Math.round(minutes % 60);

	let res = '';
	if (hours !== 0) {
		res += `${hours}u`;
	}
	if (minutes !== 0) {
		res += `${minutes}m`;
	}
	if (seconds !== 0) {
		res += `${seconds}s`;
	}
	return res;
}

export function getDate (date) {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function sameDate (a, b) {
	return getDate(a).getTime() === getDate(b).getTime();
}

export const loading = html`
	<span class="loading">
		Loading...
	</span>
`;
