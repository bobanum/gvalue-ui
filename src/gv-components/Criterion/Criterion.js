import { Component } from '../../Component.js';
import CSS from './criterion.css?inline';

export class Criterion extends Component {
	constructor() {
		super();
		this._comments = [];
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
		return this.total * (this.parentNode?.ratio || 1);
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
		// if (this._total !== undefined) return this._total;
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
	get description() {
		return this.shadowRoot.querySelector(".description").textContent;
	}
	set description(value) {
		this.shadowRoot.querySelector(".description").textContent = value;
	}
	get criteria() {
		return [...this.querySelectorAll(':scope>gv-criterion')];
	}
	set criteria(val) {
		this.criteria.forEach((c) => c.remove());
		this.criteriaCount = val.length;
		if (this.criteriaCount > 0) {
			this.classList.add("has-criteria");
			this.makeInputReadOnly(this.shadowRoot.querySelector("header input"), true);
		} else {
			this.makeInputReadOnly(this.shadowRoot.querySelector("header input"), false);
			this.classList.remove("has-criteria");
			console.log(this.shadowRoot.querySelectorAll("input"));
		}
		val.forEach((criterionData) => {
			const criterion = document.createElement('gv-criterion');
			criterion.slot = "criteria";
			criterion.fill(criterionData);
			this.appendChild(criterion);
		});
	}
	get comments() {
		return this._comments || [];
	}
	set comments(val) {
		this._comments = val.filter((c) => c.criterion_id === this.id).map((c) => {
			const comment = document.createElement("gv-comment");
			comment.fill(c);
			comment.criterion = this;
			return comment;
		});
		
		if (this._comments.length > 0) {
			this.classList.add("has-comments");
			this.append(...this._comments);
		}
		this.criteria.forEach((c) => {
			c.comments = val;
		});
	}
	makeInputReadOnly(input, revert = false) {
		input.readOnly = true;
		input.style.pointerEvents = "none";
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
	activate () {
		this.classList.add("current");
		const evaluation = this.closest("gv-evaluation");
		evaluation.showComments(this.comments);
	}
	deactivate () {
		this.classList.remove("current");
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
			const description = document.createElement("div");
			description.classList.add("description");
			result.appendChild(description);
			// result.appendChild(this.createSlot("comments"));
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
			const input = document.createElement("input", { is: "gv-number" });
			input.type = "text";
			input.size = "1";
			input.name = "scriterion1";
			input.id = "scriterion1";
			input.step = "0.25";
			input.min = "0";
			input.max = "10";
			input.tabIndex = 0;
			result.appendChild(input);
			const value = document.createElement("span");
			value.classList.add("value");
			value.textContent = "0";
			result.appendChild(value);
			input.addEventListener("focus", (e) => {
				this.activate();
			});
			input.addEventListener("blur", (e) => {
				this.deactivate();
			});
			return result;
		}
	};

}

Criterion.register('gv-criterion');