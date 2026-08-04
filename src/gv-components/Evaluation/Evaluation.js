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
	}
	connectedCallback() {
		super.connectedCallback();
		const scale = document.createElement("gv-scale");
		scale.min = 0;
		scale.max = 2;
		scale.length = 6;
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
	fillComments(comments) {
		// this.emptyComments();
		this.append(...comments);
		return this;
	}
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
Evaluation.register('gv-evaluation', { Dom });