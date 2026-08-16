import Component from '../../Component.js';
import Dom from './dom.js';
import css from "./style.css?inline";

export default class Criterion extends Component {
	static shadowRootOptions = { mode: "open", delegatesFocus: true };
	constructor() {
		super();
		this._comments = [];
		this._max;
		this._score;
		this._criteria = [];
		this.shadowRoot.appendChild(this.dom.style(css));
		this.shadowRoot.appendChild(this.dom.main());
	}
	connectedCallback() {
		this.parts.scoring.max = this.max;
		this.addEventListener("focusin", (e) => {
			this.scrollIntoView({ behavior: "smooth", block: "center" });
			const currentCriterion = document.body.querySelector("gv-criterion.current");
			if (currentCriterion && currentCriterion !== this) {
				currentCriterion.deactivate();
			}
			this.activate();
			e.stopPropagation();
		});
	}
	get label() {
		return this.parts.label.textContent;
	}
	set label(val) {
		this.parts.label.textContent = val;
	}
	get max() {
		return this.total * (this.parentNode?.ratio || 1);
	}
	set max(val) {
		this._max = val;
		this.parts.scoring.max = val;
	}
	get score() {
		if (this._score === undefined) {
			this._score = 1*this._criteria.reduce((total, criterion) => total + criterion.score, 0);
		}
		return this._score;
	}
	set score(val) {
		if (this._score === val) return;
		if (val === null || val === undefined) {
			this._score = undefined;
		} else {
			this._score = parseFloat(val);
		}

		this.parts.scoring.value = this.score;
		this.dispatchEvent(new CustomEvent("change"));
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
	get description() {
		return this.shadowRoot.querySelector(".description").textContent;
	}
	set description(val) {
		this.shadowRoot.querySelector(".description").textContent = val;
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
			this.parts.scoring.tabIndex = -1;
			// this.makeInputReadOnly(this.parts.score, true);
		} else {
			// this.makeInputReadOnly(this.parts.score, false);
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
	navigate(direction = 0, last = false) {
		if (direction === 0) {
			if (this._criteria.length === 0) {
				// this.focus();
				return this;
			}
			if (last) {
				return this._criteria[this._criteria.length - 1].navigate(direction, true);
			}
			return this._criteria[0].navigate();
		}
		if (direction < 0 && this.previousSibling && this.previousSibling.navigate) {
			return this.previousSibling.navigate(0, true);
		}
		if (direction > 0 && this.nextSibling && this.nextSibling.navigate) {
			return this.nextSibling.navigate();
		}
		return (this.parentNode.navigate) ? this.parentNode.navigate(direction) : null;
	}
}

Criterion.register('gv-criterion', { Dom });