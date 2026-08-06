import '../css/style.css';
import './webponents/index.js';
import './gv-components/index.js';

const app = document.getElementById('app');
const evaluation = document.createElement('gv-evaluation');
app.appendChild(evaluation);
evaluation.fetch(`${import.meta.env.BASE_URL}data/eval2.json`, `${import.meta.env.BASE_URL}data/eval2_comments.json`);

const fullscreenToggle = document.querySelector('.fullscreen-toggle');

if (fullscreenToggle) {
	const updateFullscreenToggle = () => {
		const isFullscreen = Boolean(document.fullscreenElement);
		const use = fullscreenToggle.querySelector('use');
		const url = new URL(use.getAttribute('href'), window.location.href);
		console.log(url);
		url.hash = isFullscreen ? '#fullscreen-off' : '#fullscreen-on';
		use.setAttribute('href', url.href);
		// fullscreenToggle.textContent = isFullscreen ? '⤢' : '⛶';
		fullscreenToggle.setAttribute('aria-label', isFullscreen ? 'Quitter le plein écran' : 'Basculer en plein écran');
	};

	fullscreenToggle.addEventListener('click', async () => {
		try {
			if (document.fullscreenElement) {
				await document.exitFullscreen();
			} else if (document.fullscreenEnabled) {
				await document.documentElement.requestFullscreen();
			}
		} catch (error) {
			console.warn('Fullscreen request failed:', error);
		}
		updateFullscreenToggle();
	});

	document.addEventListener('fullscreenchange', updateFullscreenToggle);
	updateFullscreenToggle();
}