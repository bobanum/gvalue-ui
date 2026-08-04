import Component from '../../Component.js';
import Dom from './dom.js';
import css from "./style.css?inline";

export default class Criterion extends Component {
	constructor() {
		super();
		this._comments = [];
		this._value;
		this.criteriaCount = 0;
		this.shadowRoot.appendChild(this.dom.style(css));
		this.shadowRoot.appendChild(this.dom.main());
	}
	connectedCallback() {
		this.tabIndex = -2;
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
			console.log(this._comments);

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
	activate() {
		this.classList.add("current");
		const evaluation = this.closest("gv-evaluation");
		evaluation.fillComments(this.comments);
		const oldScale = evaluation.querySelector("gv-scale");
		const newScale = document.createElement("gv-scale");
		newScale.slot = "helpers";
		newScale.min = 0;
		newScale.max = this.value;
		oldScale.replaceWith(newScale);
	}
	deactivate() {
		this.classList.remove("current");
		this._comments.forEach((c) => c.remove());
	}
}

Criterion.register('gv-criterion', { Dom });