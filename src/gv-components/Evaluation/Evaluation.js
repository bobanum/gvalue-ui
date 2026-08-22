import Criterion from "../Criterion/Criterion.js";
import Dom from "./dom.js";
import css from "./style.css?inline";

export default class Evaluation extends Criterion {
	constructor() {
		super();
		this.level = 0;
		const criteria = this.querySelectorAll('gv-criterion');
		this.criteriaCount = criteria.length;
		criteria.forEach((c) => {
			c.slot = "criteria";
		});
		
		this.shadowRoot.querySelector("style").replaceWith(this.dom.style(css));
		this.shadowRoot.appendChild(this.dom.navigation());
	}
	connectedCallback() {
		super.connectedCallback();
		const scale = document.createElement("gv-scale");
		scale.slot = "helpers";
	}
	removeHelpers() {
		this.parts.helpers.assignedElements().forEach((s) => s.remove());
	}
	fillComments(comments) {
		this.append(...comments);
		return this;
	}
	fetch(...url) {
		return Promise.all(url.map((u) => fetch(u).then((response) => response.json())))
			.then(([data, comments]) => {
				this.fill(data);
				this.comments = comments;
				return this;
			})
			.catch((error) => {
				console.error("Error fetching evaluation data:", error);
				throw error;
			});
	}
	get studentId() {
		return this.shadowRoot.querySelector(".id")?.textContent || "";
	}
	set studentId(value) {
		const id = this.shadowRoot.querySelector(".id");
		if (id) {
			id.textContent = value || "";
		}
	}
	serializeScoring() {
		return {
			eval_id: this.id || "",
			student_id: this.studentId,
			criteria: this.serializeCriteria(this.criteria),
		};
	}
	serializeCriteria(criteria = []) {
		return criteria.reduce((result, criterion) => {
			const value = this.serializeCriterion(criterion);
			if (value) {
				result[criterion.id] = value;
			}
			return result;
		}, {});
	}
	serializeCriterion(criterion) {
		const comments = criterion.comments
			.filter((comment) => comment.checked)
			.map((comment) => comment.id);
		if (criterion.criteria.length > 0) {
			const nested = this.serializeCriteria(criterion.criteria);
			if (Object.keys(nested).length === 0 && comments.length === 0) {
				return null;
			}
			return {
				...(Object.keys(nested).length > 0 ? { criteria: nested } : {}),
				...(comments.length > 0 ? { comments } : {}),
			};
		}
		if (criterion.score === undefined && comments.length === 0) {
			return null;
		}
		return {
			...(criterion.score === undefined ? {} : { value: criterion.score }),
			...(comments.length > 0 ? { comments } : {}),
		};
	}
	applyScoring(scoring = {}) {
		if (typeof scoring.student_id === "string") {
			this.studentId = scoring.student_id;
		}
		this.applyCriteria(this.criteria, scoring.criteria || {});
		this.score = null;
		return this;
	}
	applyCriteria(criteria = [], scoring = {}) {
		criteria.forEach((criterion) => {
			const entry = scoring?.[criterion.id];
			const selectedComments = new Set(entry?.comments || []);
			criterion.comments.forEach((comment) => {
				comment.checked = selectedComments.has(comment.id);
			});
			if (criterion.criteria.length > 0) {
				this.applyCriteria(criterion.criteria, entry?.criteria || {});
				criterion.score = null;
				return;
			}
			const hasValue = entry && Object.prototype.hasOwnProperty.call(entry, "value");
			criterion.score = hasValue ? entry.value : null;
		});
	}
	navigate() {
		const next = this._criteria[0].navigate();
		if (!next) {
			return;
		}
		return next;
	}
	center() {
		this._criteria[0].center();
	}
}
Evaluation.register('gv-evaluation', { Dom });