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
		Promise.all(url.map((u) => fetch(u).then((response) => response.json())))
			.then(([data, comments]) => {
				this.fill(data);
				this.comments = comments;
			})
			.catch((error) => {
				console.error("Error fetching evaluation data:", error);
			});
	}
	navigate() {
		const next = this._criteria[0].navigate();
		if (!next) {
			return;
		}
		return next;
	}
}
Evaluation.register('gv-evaluation', { Dom });