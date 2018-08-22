import { render } from 'lit-html/lib/lit-extended';

import Model from './model.js';
import view from './view/view.js';
import { updateEntries } from './api/api.js';

window.state = Model;
window.renderApp = function () {
	render(view(window.state), document.body);
}

window.renderApp();

async function updateLoop () {
	window.state = await updateEntries(window.state);
	window.renderApp();
	// setTimeout(updateLoop, 1000*60); // 1 minute
}
updateLoop(window.state);
