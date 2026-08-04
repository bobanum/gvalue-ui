import Criterion from '../Criterion/Criterion.js';

export default class Dom extends Criterion.Dom {
	main() {
		const result = document.createDocumentFragment();
		result.appendChild(this.dom.header());
		result.appendChild(this.createSlot("criteria"));
		result.appendChild(this.dom.helpers());
		const description = document.createElement("p");
		description.classList.add("description");
		result.appendChild(description);
		return result;
	}
	header() {
		const result = document.createElement("header");
		result.appendChild(this.createSlot("title", "Évaluation"));
		result.appendChild(this.dom.student());
		result.appendChild(this.dom.scoring());
		return result;
	}
	helpers() {
		const result = document.createElement("div");
		result.classList.add("helpers");
		result.appendChild(this.dom.comments());
		result.appendChild(this.createSlot("helpers"));
		return result;
	}
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
	}
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
	comments() {
		const result = document.createElement("section");
		result.classList.add("comments");
		const header = document.createElement("header");
		const title = document.createElement("h1");
		title.classList.add("title");
		title.textContent = "Commentaires";
		header.appendChild(title);
		const add = document.createElement("button");
		add.classList.add("add");
		add.textContent = "\u2795\uFE0E";
		header.appendChild(add);
		result.appendChild(header);
		result.appendChild(this.createSlot("comments"));

		return result;
	}
}
