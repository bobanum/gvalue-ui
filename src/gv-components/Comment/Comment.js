import { Component } from '../../Component.js';
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
		this.addEventListener("contextmenu", this.evt.open.bind(this));
	}
	connectedCallback() {
		this.slot = "comments";
		// this.addEventListener("longpress", this.evt.open.bind(this));
	}
	get value() {
		return this._.value;
	}
	set value(value) {
		this._.value = value;
		const textValue = this.formatValue(value);
		this.shadowRoot.querySelector(".value").textContent = textValue;
	}
	set text(value) {
		this.textContent = value;
	}
	formatValue(value, precision = 2) {
		let frac = precision % 1;
		precision -= frac;
		let result = value;
		let sign = Math.sign(value);
		result = Math.abs(value);
		let length = Math.floor(Math.log10(result));
		const mult = 10 ** (precision - length - 1);

		result = Math.round(result * mult) / mult;
		if (frac > 0) {
			let residu = value - result;
			residu = residu * mult / frac;
			residu = Math.round(residu);
			residu = residu * frac / mult;
			result = +(result + residu).toFixed(9);
		}
		result = result.toString();
		if (sign <= 0) {
			result = `\u2796\uFE0E${result}`;
		} else {
			result = `\u2795\uFE0E${result}`;
		}
		return result;
	}
	evt = {
		open(e) {
			if (e.originalTarget.tagName !== "SLOT") return;
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
			const top = this.getBoundingClientRect().top;
			const left = this.getBoundingClientRect().left;

			popup.style.setProperty("--offset-y", `${window.innerHeight - top}px`);
			popup.style.setProperty("--offset-x", `${window.innerWidth - left}px`);
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

			const radio = (name, label, checked) => {
				let result = document.createElement("label");
				const box = document.createElement("input");
				box.type = "radio";
				box.name = name;
				result.appendChild(box);
				result.appendChild(document.createTextNode(label));
				box.checked = checked;
				return result;
			};

			fieldset.appendChild(radio("proportionnal", `[-1➔1]`, this.proportionnal));
			fieldset.appendChild(radio("proportionnal", `[-${this.criterion.value}➔${this.criterion.value}]`, !this.proportionnal));

			// const absolute = document.createElement("label");
			// const absoluteCheckbox = document.createElement("input");
			// absoluteCheckbox.type = "checkbox";
			// absolute.appendChild(absoluteCheckbox);
			// absolute.appendChild(document.createTextNode("Absolu"));
			// absoluteCheckbox.checked = this.absolute;
			// fieldset.disabled = (valueInput.value === "");
			// fieldset.appendChild(absolute);

			div.appendChild(fieldset);

			result.appendChild(div);
			return result;
		}
	};
}

Comment.register('gv-comment');