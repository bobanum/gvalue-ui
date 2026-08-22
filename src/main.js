import '../css/style.css';
import './webponents/index.js';
import './gv-components/index.js';

const STORAGE_KEYS = {
	global: 'gvalue-ui:preferences',
	evaluationPrefix: 'gvalue-ui:evaluation:',
};

const DEFAULT_THEME = 'system';
const DEFAULT_LAYOUT = 'default';
const EVALUATION_THEME_DEFAULT = 'inherit';
const EVALUATION_LAYOUT_DEFAULT = 'inherit';
const baseUrl = import.meta.env.BASE_URL;
const defaultEvaluationUrl = `${baseUrl}data/eval2.json`;
const defaultCommentsUrl = `${baseUrl}data/eval2_comments.json`;

const app = document.getElementById('app');
const evaluation = document.createElement('gv-evaluation');
app.appendChild(evaluation);

const generalMenu = document.querySelector('.general-menu');
const fullscreenToggle = document.querySelector('.fullscreen-toggle');

const importInput = document.createElement('input');
importInput.type = 'file';
importInput.accept = '.json,application/json';
importInput.hidden = true;
document.body.appendChild(importInput);

const readStoredJson = (key) => {
	try {
		const value = localStorage.getItem(key);
		return value ? JSON.parse(value) : {};
	} catch (error) {
		console.warn(`Unable to read "${key}" from localStorage:`, error);
		return {};
	}
};

const writeStoredJson = (key, value) => {
	localStorage.setItem(key, JSON.stringify(value));
};

const sanitizeTheme = (value, { allowSystem = false, allowInherit = false } = {}) => {
	const allowed = new Set(['light', 'dark']);
	if (allowSystem) {
		allowed.add('system');
	}
	if (allowInherit) {
		allowed.add('inherit');
	}
	return allowed.has(value) ? value : null;
};

const sanitizeLayout = (value, { allowInherit = false } = {}) => {
	const allowed = new Set(['default', 'compact']);
	if (allowInherit) {
		allowed.add('inherit');
	}
	return allowed.has(value) ? value : null;
};

const getEvaluationPreferenceKey = (evaluationId) => `${STORAGE_KEYS.evaluationPrefix}${evaluationId}:preferences`;

const getGlobalPreferences = () => {
	const stored = readStoredJson(STORAGE_KEYS.global);
	return {
		theme: sanitizeTheme(stored.theme, { allowSystem: true }) || DEFAULT_THEME,
		layout: sanitizeLayout(stored.layout) || DEFAULT_LAYOUT,
	};
};

const getEvaluationPreferences = (evaluationId = evaluation.id) => {
	if (!evaluationId) {
		return {
			theme: EVALUATION_THEME_DEFAULT,
			layout: EVALUATION_LAYOUT_DEFAULT,
		};
	}
	const stored = readStoredJson(getEvaluationPreferenceKey(evaluationId));
	return {
		theme: sanitizeTheme(stored.theme, { allowInherit: true }) || EVALUATION_THEME_DEFAULT,
		layout: sanitizeLayout(stored.layout, { allowInherit: true }) || EVALUATION_LAYOUT_DEFAULT,
	};
};

const setThemePreference = (element, theme) => {
	if (!theme || theme === 'system' || theme === 'inherit') {
		element.removeAttribute('data-theme');
		return;
	}
	element.dataset.theme = theme;
};

const setLayoutPreference = (element, layout) => {
	if (!layout || layout === 'inherit' || layout === 'default') {
		element.removeAttribute('data-layout');
		return;
	}
	element.dataset.layout = layout;
};

const applyPreferences = () => {
	const globalPreferences = getGlobalPreferences();
	const evaluationPreferences = getEvaluationPreferences();
	setThemePreference(document.documentElement, globalPreferences.theme);
	setLayoutPreference(document.documentElement, globalPreferences.layout);
	setThemePreference(evaluation, evaluationPreferences.theme);
	const effectiveLayout = evaluationPreferences.layout === 'inherit'
		? globalPreferences.layout
		: evaluationPreferences.layout;
	setLayoutPreference(evaluation, effectiveLayout);
};

const createPreferencesFieldset = (legendText, prefix, values) => {
	const fieldset = document.createElement('fieldset');
	const legend = document.createElement('legend');
	legend.textContent = legendText;
	fieldset.appendChild(legend);

	const createSelect = (name, labelText, options, value) => {
		const label = document.createElement('label');
		label.textContent = `${labelText} `;
		const select = document.createElement('select');
		select.name = `${prefix}-${name}`;
		options.forEach(([optionValue, optionLabel]) => {
			const option = document.createElement('option');
			option.value = optionValue;
			option.textContent = optionLabel;
			select.appendChild(option);
		});
		select.value = value;
		label.appendChild(select);
		fieldset.appendChild(label);
	};

	createSelect('theme', 'Thème', values.themeOptions, values.theme);
	createSelect('layout', 'Layout', values.layoutOptions, values.layout);
	return fieldset;
};

const openPreferences = () => {
	const popup = document.createElement('popup-ponent');
	popup.title = 'Préférences';

	const globalPreferences = getGlobalPreferences();
	const evaluationPreferences = getEvaluationPreferences();
	const form = document.createElement('form');

	form.appendChild(createPreferencesFieldset('Préférences globales', 'global', {
		theme: globalPreferences.theme,
		layout: globalPreferences.layout,
		themeOptions: [
			['system', 'Système'],
			['light', 'Clair'],
			['dark', 'Sombre'],
		],
		layoutOptions: [
			['default', 'Standard'],
			['compact', 'Compact'],
		],
	}));

	form.appendChild(createPreferencesFieldset('Préférences de cette évaluation', 'evaluation', {
		theme: evaluationPreferences.theme,
		layout: evaluationPreferences.layout,
		themeOptions: [
			['inherit', 'Utiliser les préférences globales'],
			['light', 'Clair'],
			['dark', 'Sombre'],
		],
		layoutOptions: [
			['inherit', 'Utiliser les préférences globales'],
			['default', 'Standard'],
			['compact', 'Compact'],
		],
	}));

	popup.appendChild(form);
	popup.addEventListener('submit', () => {
		const formData = new FormData(form);
		writeStoredJson(STORAGE_KEYS.global, {
			theme: sanitizeTheme(formData.get('global-theme'), { allowSystem: true }) || DEFAULT_THEME,
			layout: sanitizeLayout(formData.get('global-layout')) || DEFAULT_LAYOUT,
		});
		if (evaluation.id) {
			writeStoredJson(getEvaluationPreferenceKey(evaluation.id), {
				theme: sanitizeTheme(formData.get('evaluation-theme'), { allowInherit: true }) || EVALUATION_THEME_DEFAULT,
				layout: sanitizeLayout(formData.get('evaluation-layout'), { allowInherit: true }) || EVALUATION_LAYOUT_DEFAULT,
			});
		}
		applyPreferences();
	}, { once: true });

	document.body.appendChild(popup);
};

const sanitizeFilename = (value, fallback) => {
	const normalized = `${value || ''}`.trim().replaceAll(/[^\w.-]+/g, '_').replaceAll(/^_+|_+$/g, '');
	return normalized || fallback;
};

const exportEvaluation = () => {
	const data = evaluation.serializeScoring();
	const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
	const link = document.createElement('a');
	link.href = URL.createObjectURL(blob);
	link.download = `${sanitizeFilename(data.eval_id, 'evaluation')}_${sanitizeFilename(data.student_id, 'resultat')}.json`;
	link.click();
	URL.revokeObjectURL(link.href);
};

const importEvaluation = async (file) => {
	let data;
	try {
		data = JSON.parse(await file.text());
	} catch (error) {
		console.error('Unable to parse imported evaluation:', error);
		window.alert("Le fichier d'évaluation n'est pas un JSON valide.");
		return;
	}

	if (Array.isArray(data?.criteria)) {
		evaluation.removeHelpers();
		evaluation.querySelectorAll('gv-comment').forEach((comment) => comment.remove());
		evaluation.fill(data);
		evaluation.comments = Array.isArray(data.comments) ? data.comments : [];
		applyPreferences();
		return;
	}

	if (data?.criteria && typeof data.criteria === 'object') {
		evaluation.applyScoring(data);
		applyPreferences();
		return;
	}

	window.alert("Le fichier importé ne correspond ni à une évaluation ni à un export de notes.");
};

if (generalMenu) {
	generalMenu.addEventListener('click', (event) => {
		const action = event.target.closest('[data-action]')?.dataset.action;
		if (!action) {
			return;
		}
		switch (action) {
			case 'import':
				importInput.click();
				break;
			case 'export':
				exportEvaluation();
				break;
			case 'preferences':
				openPreferences();
				break;
		}
		generalMenu.open = false;
	});
}

importInput.addEventListener('change', async () => {
	const [file] = importInput.files || [];
	if (file) {
		await importEvaluation(file);
	}
	importInput.value = '';
});

applyPreferences();
evaluation.fetch(defaultEvaluationUrl, defaultCommentsUrl)
	.then(() => {
		applyPreferences();
	})
	.catch(() => {
		window.alert("Le chargement initial de l'évaluation a échoué.");
	});

if (fullscreenToggle) {
	const updateFullscreenToggle = () => {
		const isFullscreen = Boolean(document.fullscreenElement);
		const use = fullscreenToggle.querySelector('use');
		const url = new URL(use.getAttribute('href'), window.location.href);
		url.hash = isFullscreen ? '#fullscreen-off' : '#fullscreen-on';
		use.setAttribute('href', url.href);
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
