import { render } from 'lit-html/lib/lit-extended';

import Model from './model.js';
import view from './view/view.js';
import { updateEntries } from './api/api.js';

window.renderApp = function (state) {
	render(view(state), document.body);
}

let state = new Model();
window.renderApp(state);

async function updateLoop () {
	state = await updateEntries(state);
	window.renderApp(state);
	// setTimeout(updateLoop, 1000*60); // 1 minute
}
updateLoop(state);
