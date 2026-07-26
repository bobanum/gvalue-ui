import { Component } from '../Component.js';
import CSS from './criterion.css?inline';

export class Criterion extends Component {
	constructor() {
		super();
		this._value;
		this.criteriaCount = 0;
		this.dom = this.adoptFunctions(this.constructor.dom || {});
		this.shadowRoot.appendChild(this.dom.style());
		this.shadowRoot.appendChild(this.dom.main());
	}
	connectedCallback() {
		const criteria = [...this.querySelectorAll(':scope>gv-criterion')];
		this.shadowRoot.querySelector(".value").textContent = this.value;
	}
	get label() {
		return this.shadowRoot.querySelector("slot:not([name])").textContent;
	}
	set label(value) {
		this.shadowRoot.querySelector("slot:not([name])").textContent = value;
	}
	get value() {
		return this.total * this.parentNode.ratio;
	}
	set value(val) {
		this._value = val;
	}
	get totalRaw() {
		if (this._totalRaw !== undefined) return this._totalRaw;
		const criteria = [...this.querySelectorAll(':scope>gv-criterion')];
		if (criteria.length === 0) return;
		return this._totalRaw = criteria.reduce((total, criterion) => total + criterion.total, 0);
	}
	get total() {
		if (this._total !== undefined) return this._total;
		if (this._value !== undefined) {
			return this._total = this._value;
		}
		const totalRaw = this.totalRaw;
		if (totalRaw === undefined) {
			return this._total = this._value || 0;
		}
		return this._total = totalRaw;
	}

	get ratio() {
		if (this._ratio !== undefined && !isNaN(this._ratio)) return this._ratio;
		let ratio = this.parentNode?.ratio || 1;
		if (this._value === undefined || this.criteriaCount === 0) {
			return this._ratio = ratio;
		}
		return this._ratio = ratio * this._value / this.totalRaw;
	}
	set criteria(val) {
		this.querySelectorAll('gv-criterion').forEach((c) => c.remove());
		this.criteriaCount = val.length;
		if (this.criteriaCount > 0) {
			this.classList.add("has-criteria");
			this.makeInputReadOnly();
		} else {
			this.makeInputReadOnly(false);
			this.classList.remove("has-criteria");
		}
		val.forEach((criterionData) => {
			const criterion = document.createElement('gv-criterion');
			criterion.slot = "criteria";
			criterion.fill(criterionData);
			this.appendChild(criterion);
		});
	}
	makeInputReadOnly(revert = false) {
		const input = this.shadowRoot.querySelector("header input");
		// if (revert) {
		// 	input.disabled = true;
		// 	input.style.pointerEvents = "none";
		// 	return;
		// }
		
		input.disabled = true;
		input.style.pointerEvents = "none";
		input.placeholder = "10";
		console.log(input);
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
		let result = input.parentElement;
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