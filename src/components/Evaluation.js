import { Component } from "../Component.js";
import css from "./evaluation.css?inline";

class Evaluation extends Component {
	constructor() {
		super();
		this.shadowRoot.appendChild(this.dom.style());
		this.shadowRoot.appendChild(this.dom.main());
	}
	dom = {
		style: () => {
			const result = document.createElement("style");
			result.textContent = css;
			return result;
		},
		main: () => {
			const result = document.createDocumentFragment();
			result.appendChild(this.dom.header());
			result.appendChild(this.createSlot("criteria"));
			result.appendChild(this.createSlot("helpers"));
			return result;
		},
		header: () => {
			const result = document.createElement("header");
			const h1 = document.createElement("h1");
			h1.appendChild(this.createSlot("title"));
			result.appendChild(h1);
			const h2 = document.createElement("h2");
			h2.appendChild(this.dom.student());
			result.appendChild(h2);
			return result;
		},
		student: () => {
			const result = document.createDocumentFragment();
			const lastName = document.createElement("span");
			lastName.classList.add("last-name");
			result.appendChild(lastName);
			const firstName = document.createElement("span");
			firstName.classList.add("first-name");
			result.appendChild(firstName);
			const id = document.createElement("span");
			id.classList.add("id");
			result.appendChild(id);
			return result;
		},
		score: () => {
			const result = document.createDocumentFragment();
			const score = document.createElement("span");
			score.classList.add("score");
			result.appendChild(score);
			result.appendChild(document.createTextNode("/"));
			const maxScore = document.createElement("span");
			maxScore.classList.add("value");
			result.appendChild(maxScore);
			return result;
		}
	};
}

Evaluation.register('gv-evaluation');