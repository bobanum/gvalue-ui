import Component from '../../Component.js';
import Dom from './dom.js';
import css from "./style.css?inline";

export default class Scoring extends Component {
	static shadowRootOptions = { mode: "open", delegatesFocus: true };

	constructor() {
		super();
		this._max;
		this._value;
		this._step;
		this.shadowRoot.appendChild(this.dom.style(css));
		this.shadowRoot.appendChild(this.dom.main());
		this.internals_ = this.attachInternals();
	}
	connectedCallback() {
		// this.tabIndex = 1;
		this.parts.max.value = this.max;
	}
	focus() {
		console.log(1234566);

	}
	get max() {
		return this.total * (this.parentNode?.ratio || 1);
	}
	set max(val) {
		this._max = val;
		this.parts.input.max = val;
		this.step = 10 ** (Math.floor(Math.log10(this._max)) - 1);
	}
	get value() {
		// if (this._value === undefined) {
		// 	this._value = this._criteria.reduce((total, criterion) => total + criterion.score, 0);
		// }
		return this._value;
	}
	set value(val) {
		if (this._value === val) return;
		if (val === null || val === undefined) {
			this._value = undefined;
			this.parts.input.value = "";
		} else {
			this._value = val;
			this.parts.input.value = this._value;
		}
		this.style.setProperty("--highlight-color", this.colorCode(this.value / this.max));

		this.dispatchEvent(new CustomEvent("change", {
			detail: { value: this.value }
		}));
	}
	get step() {
		return this._step || 1;
	}
	set step(val) {
		this._step = val;
		this.parts.input.step = val;
	}
	get totalRaw() {
		if (this._totalRaw !== undefined) return this._totalRaw;
		const criteria = [...this.querySelectorAll(':scope>gv-criterion')];
		if (criteria.length === 0) return;
		return this._totalRaw = criteria.reduce((total, criterion) => total + criterion.total, 0);
	}
	get total() {
		// if (this._total !== undefined) return this._total;
		if (this._max !== undefined) {
			return this._total = this._max;
		}
		const totalRaw = this.totalRaw;
		if (totalRaw === undefined) {
			return this._total = this._max || 0;
		}
		return this._total = totalRaw;
	}
	get ratio() {
		if (this._ratio !== undefined && !isNaN(this._ratio)) return this._ratio;
		let ratio = this.parentNode?.ratio || 1;
		if (this._max === undefined || this._criteria.length === 0) {
			return this._ratio = ratio;
		}
		return this._ratio = ratio * this._max / this.totalRaw;
	}
	colorCode(v) {
		if (v < 0) {
			return "hsl(55, 98%, 46%)";
		}
		if (v < 0.6) {
			return `hsl(0 100% ${this.interpolate(v, 0, 0.6, 50, 100)}%)`;
		}
		if (v < 0.95) {
			return `hsl(120, 0%, 100%, 0)`;
		}
		if (v <= 1) {
			return `hsl(120, 100%, ${this.interpolate(v, 0.95, 1, 100, 50)}%)`;
		}
		if (v > 1) {
			return "hsl(200, 98%, 46%)";
		}
		return "";
	}
	interpolate(v, min, max, MIN, MAX) {
		return MIN + (MAX - MIN) * (v - min) / (max - min);
	}
	makeInputReadOnly(input, revert = false) {
		input.readOnly = true;
		// input.style.pointerEvents = "none";
		input.placeholder = "10";
		input.tabIndex = -1;
		const enableInput = () => {
			input.readOnly = false;
			input.value = input.placeholder;
			input.focus();
			input.select();
			input.addEventListener("blur", () => {
				input.readOnly = true;
			}, { once: true });
		};

		let longPressTimer;
		const LONG_PRESS_MS = 500;
		let result = input.parentElement;
		// this.addEventListener.call(result, "ctrl-click|longpress", (e) => {
		this.addEventListener.call(result, "contextmenu", (e) => {
			enableInput();
		});
	}
}

Scoring.register('gv-scoring', { Dom });