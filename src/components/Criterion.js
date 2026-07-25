import { Component } from '../Component.js';
import CSS from './criterion.css?inline';

export class Criterion extends Component {
	constructor() {
		super();
		this._calcValue;
		this._value;
		this.dom = this.adoptFunctions(this.constructor.dom || {});
		this.shadowRoot.appendChild(this.dom.style());
		this.shadowRoot.appendChild(this.dom.main());
	}
	connectedCallback() {
		console.log(123, this.value);
		this.shadowRoot.querySelector(".value").textContent = this.value;
	}
	get label() {
		return this.shadowRoot.querySelector("slot:not([name])").textContent;
	}
	set label(value) {
		this.shadowRoot.querySelector("slot:not([name])").textContent = value;
	}
	get value() {
		return (this._value !== undefined ? this._value : this.total) * this.parentNode.ratio;
	}
	set value(val) {
		this._value = val;
	}
	get total() {
		if (this._total === undefined) {
			const criteria = [...this.querySelectorAll(':scope>gv-criterion')];
			if (criteria.length === 0) {
				this._total = this._value || 0;
			} else {
				this._total = criteria.reduce((total, criterion) => total + criterion.value, 0);
			}
		}
		return this._total;
	}
	get ratio() {
		if (this._value === undefined) {
			return 1;
		}
		return this._value / this.total;
	}
	set calcValue(val) {
		this._calcValue = val;
	}
	set criteria(val) {
		this.querySelectorAll('gv-criterion').forEach((c) => c.remove());
		val.forEach((criterionData) => {
			const criterion = document.createElement('gv-criterion');
			criterion.slot = "criteria";
			criterion.fill(criterionData);
			this.appendChild(criterion);
		});
	}
	static dom = {
		style() {
			const result = document.createElement("style");
			result.textContent = CSS;
			return result;
		},
		main() {
			const result = document.createDocumentFragment();
			const header = document.createElement("header");
			header.appendChild(this.dom.label());
			result.appendChild(header);
			result.appendChild(this.createSlot("criteria"));
			return result;
		},
		label() {
			const result = document.createElement("label");
			result.appendChild(this.createSlot());
			result.appendChild(this.dom.input());
			return result;
		},
		input() {
			const result = document.createElement("div");
			result.classList.add("input");
			const input = document.createElement("input");
			input.type = "number";
			input.size = "1";
			input.name = "scriterion1";
			input.id = "scriterion1";
			if (this.criteriaCount > 0) {
				input.disabled = true;
				input.style.pointerEvents = "none";
				input.placeholder = "10";
				const enableInput = () => {
					input.disabled = false;
					input.value = input.placeholder;
					input.focus();
					input.select();
					input.addEventListener("blur", () => {
						input.disabled = true;
					}, { once: true });
				};

				let longPressTimer;
				const LONG_PRESS_MS = 500;

				result.addEventListener("click", (e) => {
					if (e.ctrlKey) {
						enableInput();
					}
				});

				result.addEventListener("mousedown", () => {
					longPressTimer = window.setTimeout(() => {
						enableInput();
					}, LONG_PRESS_MS);
				});

				const clearLongPress = () => {
					if (longPressTimer) {
						window.clearTimeout(longPressTimer);
						longPressTimer = undefined;
					}
				};

				result.addEventListener("mouseup", clearLongPress);
				result.addEventListener("mouseleave", clearLongPress);
				result.addEventListener("contextmenu", (e) => {
					e.preventDefault();
				});
				result.addEventListener("touchstart", () => {
					longPressTimer = window.setTimeout(() => {
						enableInput();
					}, LONG_PRESS_MS);
				});
				result.addEventListener("touchend", clearLongPress);
				result.addEventListener("touchcancel", clearLongPress);
			}
			result.appendChild(input);
			const value = document.createElement("span");
			value.classList.add("value");
			value.textContent = "0";
			result.appendChild(value);
			return result;
		}
	};
}

Criterion.register('gv-criterion');