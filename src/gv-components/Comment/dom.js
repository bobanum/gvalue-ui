import Component from '../../Component.js';

export default class Dom extends Component.Dom {
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
	}
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
}
