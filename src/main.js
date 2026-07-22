import '../css/style.css';
import './components/gvalue-app.js';
import './ButtonPonent.js';
import './MenuPonent.js';
import './components/index.js';


document.getElementById('app').addEventListener('wheel', (e) => {
	console.log(app.getBoundingClientRect(), e.deltaY);
	if (app.getBoundingClientRect().top > 0) {
		// scroll body instead of app
		// e.preventDefault();
		
		// document.body.scrollTop += e.deltaY;
	} else {
		// scroll app
		// e.currentTarget.scrollTop += e.deltaY;
	}
}, { passive: false });