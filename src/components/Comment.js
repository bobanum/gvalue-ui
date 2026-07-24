import { Component } from '../Component.js';
import css from './comment.css?inline';

class Comment extends Component {
	constructor() {
		super();
		this._ = {
			value: 0,
			id: "",
			criterionId: "",
			proportionnal: false,
			absolute: false,
			checked: false
		};
		this.shadowRoot.appendChild(this.dom.syle());
		this.shadowRoot.appendChild(this.dom.main());
	}
	static dom = {
		style() {
			const result = document.createElement("style");
			result.textContent = css;
			return result;
		},
		main() {
			const result = document.createDocumentFragment();
			result.appendChild(this.dom.menu());
			const label = document.createElement("label");
			const checkbox = document.createElement("input");
			checkbox.type = "checkbox";
			checkbox.addEventListener("change", () => {
				this.toggleAttribute("checked", checkbox.checked);
			});
			label.appendChild(checkbox);
			label.appendChild(this.createSlot());
			result.appendChild(label);
			return result;
		},
		menu() {
			const result = document.createElement("menu-ponent");
			result.setAttribute("icon", "hamburger");
			const menuItems = [
				"Modifier le commentaire",
				"Marquer comme important",
				"Copier le texte",
				"Proportionnel",
				"Absolu",
				"Supprimer"
			];
			menuItems.forEach((item) => {
				const menuItem = document.createElement("div");
				menuItem.textContent = item;
				result.appendChild(menuItem);
			});
			return result;
		}
	}
}

Comment.register('gv-comment');