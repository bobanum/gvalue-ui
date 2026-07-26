import { Criterion } from "./Criterion.js";
import css from "./evaluation.css?inline";

export class Evaluation extends Criterion {
	constructor() {
		super();
		this.dom = this.adoptFunctions(this.constructor.dom || {});
		const criteria = this.querySelectorAll('gv-criterion');
		this.criteriaCount = criteria.length;
		criteria.forEach((c) => {
			c.slot = "criteria";
		});
	}
	connectedCallback() {
		super.connectedCallback();
		const scale = document.createElement("gv-scale");
		scale.slot = "helpers";
		this.appendChild(scale);
		// this.appendChild(scale.cloneNode(true));
	}
	static dom = {
		style() {
			const result = document.createElement("style");
			result.textContent = css;
			return result;
		},
		main() {
			const result = document.createDocumentFragment();
			result.appendChild(this.dom.header());
			result.appendChild(this.createSlot("criteria"));
			result.appendChild(this.createSlot("helpers", "Cjoisir"));
			return result;
		},
		header() {
			const result = document.createElement("header");
			result.appendChild(this.createSlot("title", "Évaluation"));
			result.appendChild(this.dom.student());
			result.appendChild(this.dom.scoring());
			return result;
		},
		student() {
			const result = document.createElement("div");
			result.classList.add("student");
			const lastName = document.createElement("span");
			lastName.classList.add("last-name");
			lastName.textContent = "Nom";
			result.appendChild(lastName);
			const firstName = document.createElement("span");
			firstName.classList.add("first-name");
			firstName.textContent = "Prénom";
			result.appendChild(firstName);
			const id = document.createElement("span");
			id.classList.add("id");
			id.textContent = "Matricule";
			result.appendChild(id);
			return result;
		},
		scoring() {
			const result = document.createElement("div");
			result.classList.add("scoring");
			const grade = document.createElement("span");
			grade.classList.add("grade");
			grade.textContent = "0";
			result.appendChild(grade);
			result.appendChild(document.createTextNode("/"));
			const maxScore = document.createElement("span");
			maxScore.classList.add("value");
			result.appendChild(maxScore);
			return result;
		}
	};
	fetch(url) {
		fetch(url)
			.then((response) => response.json())
			.then((data) => {
				this.render(data);
			})
			.catch((error) => {
				console.error("Error fetching evaluation data:", error);
			});
	}
	render(data) {
		const { title, student, scoring } = data;
		// this.shadowRoot.querySelector('slot[name="title"]').textContent = data.title;
		this.appendChild(document.createTextNode(data.title));
		data.criteria.forEach((criterionData) => {
			const criterion = document.createElement('gv-criterion');
			criterion.slot = "criteria";
			criterion.fill(criterionData);
			// criterion.setAttribute('data', JSON.stringify(criterionData));
			this.appendChild(criterion);
		});

		// this.shadowRoot.querySelector('slot[name="student"]').textContent = student;
		// this.shadowRoot.querySelector('slot[name="scoring"]').textContent = scoring;
	}
}

Evaluation.register('gv-evaluation');