import { Criterion } from "../Criterion/Criterion.js";
import css from "./evaluation.css?inline";

export class Evaluation extends Criterion {
	constructor() {
		super();
		this.level = 0;
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
		// this.addComments();
	}
	makeInputReadOnly(input, revert = false) {
		return; // Do nothing, the evaluation input should never be editable
	}
	emptyComments() {
		const comments = [...this.querySelectorAll('gv-comment')];
		comments.forEach((c) => {
			c.remove();
		});
	}
	showComments(comments) {
		this.emptyComments();
		this.append(...comments);
		return this;
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
			result.appendChild(this.dom.helpers());
			const description = document.createElement("p");
			description.classList.add("description");
			result.appendChild(description);
			return result;
		},
		header() {
			const result = document.createElement("header");
			result.appendChild(this.createSlot("title", "Évaluation"));
			result.appendChild(this.dom.student());
			result.appendChild(this.dom.scoring());
			return result;
		},
		helpers() {
			const result = document.createElement("div");
			result.classList.add("helpers");
			result.appendChild(this.dom.comments());
			result.appendChild(this.createSlot("helpers"));
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
		},
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
	};
	addComments() {
		const comments = [
			"Bonne progression, et le sourire revient déjà quand on regarde le travail.",
			"Le raisonnement est solide, même si la mise en page a encore besoin d'un peu d'enthousiasme.",
			"Quelques idées brillantes, mais l'ordinateur semble avoir pris un café avant la fin.",
			"Le fond est intéressant, il ne manque plus qu'un petit coup de polish pour le rendre vraiment élégant.",
			"On sent une vraie compréhension du sujet, avec un petit goût pour le chaos bien organisé.",
			"C'est clair, pertinent et franchement plus convaincant que la moyenne des brouillons de dernière minute.",
			"Un très bon effort, avec juste assez de personnalité pour rester mémorable.",
			"La structure est là, il reste à peaufiner les détails pour un rendu encore plus net.",
			"Pas mal du tout : on dirait que la créativité a fait une apparition surprise.",
			"Le travail est cohérent, et même les petites imperfections ont du charme.",
			"On voit de la méthode, de l'initiative et un soupçon de magie bien placée.",
			"L'idée est bonne, la présentation pourrait encore gagner un peu de punch.",
			"Très correct, avec une vraie volonté de progresser et de faire mieux.",
			"Le résultat est prometteur, presque aussi convaincant qu'un café bien servi.",
			"Quelques accroches très réussies, et un ensemble qui tient bien la route.",
		];

		comments.forEach((commentText, i) => {
			let comment = document.createElement("gv-comment");
			comment.slot = "comments";
			comment.criterion = this;
			comment.textContent = commentText;
			if (Math.random() < 0.5) {
				comment.value = Math.random() * 10 - 5;
				// comment.absolute = Math.random() < 0.5;
				// comment.proportionnal = Math.random() < 0.5;
			}
			this.appendChild(comment);
		});
	}
	fetch(...url) {
		Promise.all(url.map((u) => fetch(u).then((response) => response.json())))
			.then(([data, comments]) => {
				// console.log(data, comments);
				// this.addComments(comments);
				this.fill(data);
				this.comments = comments;
			})
			.catch((error) => {
				console.error("Error fetching evaluation data:", error);
			});
	}
}

Evaluation.register('gv-evaluation');