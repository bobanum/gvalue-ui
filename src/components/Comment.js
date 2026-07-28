import { Component } from '../Component.js';
import css from './comment.css?inline';

class Comment extends Component {
	constructor() {
		super();
		this._ = {
			value: "",
			id: "",
			criterionId: "",
			proportionnal: false,
			absolute: false,
			checked: false
		};
		this.dom = this.adoptFunctions(this.constructor.dom || {});
		this.shadowRoot.appendChild(this.dom.style());
		this.shadowRoot.appendChild(this.dom.main());
	}
	connectedCallback() {
		this.addEventListener("click", this.evt.open.bind(this));
	}
	get value() {
		return this._.value;
	}
	set value(value) {
		this._.value = value;
		this.shadowRoot.querySelector(".value").textContent = value;
	}
	evt = {
		open(e) {
			if (e.originalTarget.tagName !== "SLOT") return;
			console.log(e);
			e.stopPropagation();
			e.stopImmediatePropagation();
			e.preventDefault();

			const popup = document.createElement("popup-ponent");
			const title = document.createElement("div");
			title.textContent = "Modifier le commentaire";
			title.slot = "title";
			popup.appendChild(title);

			const dup = document.createElement("button");
			dup.slot = "footer";
			dup.textContent = "Dupliquer";
			popup.appendChild(dup);
			popup.appendChild(this.dom.form());
			this.shadowRoot.appendChild(popup);
		}
	};
	static dom = {
		style() {
			const result = document.createElement("style");
			result.textContent = css;
			return result;
		},
		main() {
			const result = document.createDocumentFragment();
			const label = document.createElement("label");
			const checkbox = document.createElement("input");
			checkbox.type = "checkbox";
			checkbox.addEventListener("change", () => {
				this.toggleAttribute("checked", checkbox.checked);
			});
			label.appendChild(checkbox);
			label.appendChild(this.createSlot());
			const valueSpan = document.createElement("span");
			valueSpan.classList.add("value");
			label.appendChild(valueSpan);
			result.appendChild(label);
			return result;
		},
		form() {
			const result = document.createElement("form");

			const textarea = document.createElement("textarea");
			textarea.rows = 4;
			textarea.cols = 30;
			textarea.placeholder = "Commentaire...";
			textarea.value = this.textContent;
			result.appendChild(textarea);

			const div = document.createElement("div");
			div.classList.add("value-container");
			const valueLabel = document.createElement("label");
			valueLabel.textContent = "Valeur : ";
			const valueInput = document.createElement("input");
			valueInput.type = "number";
			valueInput.size = 5;
			valueInput.addEventListener("input", () => {
				fieldset.disabled = (valueInput.value === "");
			});
			valueLabel.appendChild(valueInput);
			valueInput.value = this.value;
			div.appendChild(valueLabel);

			const fieldset = document.createElement("fieldset");

			// const negative = document.createElement("label");
			// const negativeCheckbox = document.createElement("input");
			// negativeCheckbox.type = "checkbox";
			// negative.appendChild(negativeCheckbox);
			// negative.appendChild(document.createTextNode("Négatif"));
			// negativeCheckbox.checked = this.negative;
			// fieldset.appendChild(negative);
			
			const proportionnal = document.createElement("label");
			const proportionnalCheckbox = document.createElement("input");
			proportionnalCheckbox.type = "checkbox";
			proportionnal.appendChild(proportionnalCheckbox);
			proportionnal.appendChild(document.createTextNode("[0-1]"));
			proportionnalCheckbox.checked = this.proportionnal;
			fieldset.appendChild(proportionnal);

			const absolute = document.createElement("label");
			const absoluteCheckbox = document.createElement("input");
			absoluteCheckbox.type = "checkbox";
			absolute.appendChild(absoluteCheckbox);
			absolute.appendChild(document.createTextNode("Absolu"));
			absoluteCheckbox.checked = this.absolute;
			fieldset.disabled = (valueInput.value === "");
			fieldset.appendChild(absolute);

			div.appendChild(fieldset);

			result.appendChild(div);
			return result;
		}
	};
}

Comment.register('gv-comment');