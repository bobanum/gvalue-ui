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
	makeInputReadOnly(input, revert = false) {
		return; // Do nothing, the evaluation input should never be editable
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
}
Evaluation.register('gv-evaluation', { Dom });