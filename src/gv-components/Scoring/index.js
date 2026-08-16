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
		this.criterion = this.getRootNode().host;
		this.parts.max.value = this.max;
	}
	focus() {
		this.parts.input.focus();
	}
	get max() {
		return this.criterion.max;
	}
	set max(val) {
		this._max = val;
		this.parts.input.max = val;
		this.step = this.findStep(this._max);
	}
	get value() {
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
	findStep(v) {
		let v0 = v;
		if (v === 0) return 1;
		const factor = 10 ** (Math.floor(Math.log10(v)));
		v = Math.abs(v) / factor;
		
		const steps = {
			"2": 0.1,
			"3": 0.25,
			"5": 0.5,
		};
		for (const [key, value] of Object.entries(steps)) {
			if (v < key) {
				return value * factor;
			}
		}
		
		return 1 * factor;
	}
	interpolate(v, min, max, MIN, MAX) {
		return MIN + (MAX - MIN) * (v - min) / (max - min);
	}
}

Scoring.register('gv-scoring', { Dom });
