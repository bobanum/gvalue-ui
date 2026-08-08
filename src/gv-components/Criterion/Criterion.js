import Component from '../../Component.js';
import Dom from './dom.js';
import css from "./style.css?inline";

export default class Criterion extends Component {
	constructor() {
		super();
		this._comments = [];
		this._value;
		this._score;
		this._criteria = [];
		this.shadowRoot.appendChild(this.dom.style(css));
		this.shadowRoot.appendChild(this.dom.main());
	}
	connectedCallback() {
		this.parts.value.textContent = this.value;
	}
	get label() {
		return this.parts.label.textContent;
	}
	set label(value) {
		this.parts.label.textContent = value;
	}
	get value() {
		return this.total * (this.parentNode?.ratio || 1);
	}
	set value(val) {
		this._value = val;
		this.parts.score.max = val;
	}
	get score() {
		if (this._score === undefined) {
			this._score = this._criteria.reduce((total, criterion) => total + criterion.score, 0);
		}
		return this._score;
	}
	set score(val) {
		if (this._score === val) return;
		if (val === null || val === undefined) {
			this._score = undefined;
		} else {
			this._score = val;
		}
		this.parts.score.value = this.score;
		this.dispatchEvent(new CustomEvent("change", {
			detail: { value: this.value }
		}));
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
		if (this._value === undefined || this._criteria.length === 0) {
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
		return this._criteria;
	}
	set criteria(criteriaData) {
		this._criteria.forEach((c) => c.remove());
		this._criteria.splice(0);
		this._criteria.push(...criteriaData.map((criterionData) => {
			const criterion = document.createElement('gv-criterion');
			criterion.slot = "criteria";
			criterion.fill(criterionData);
			this.appendChild(criterion);
			criterion.addEventListener("change", (e) => {
				this.score = null; // Reset score to recalculate based on criteria
			});
			return criterion;
		}));
		if (this._criteria.length > 0) {
			this.classList.add("has-criteria");
			this.makeInputReadOnly(this.parts.score, true);
		} else {
			this.makeInputReadOnly(this.parts.score, false);
			this.classList.remove("has-criteria");
		}
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
	activate() {
		this.classList.add("current");
		const evaluation = this.closest("gv-evaluation");
		evaluation.removeHelpers();
		evaluation.fillComments(this._comments);
		const scale = evaluation.appendChild(this.dom.scale());
		this.parts.scale = scale;
		scale.addEventListener("change", (e) => {
			this.score = e.detail.value;
		});
	}
	deactivate() {
		this.classList.remove("current");
		this._comments.forEach((c) => c.remove());
	}
}

Criterion.register('gv-criterion', { Dom });