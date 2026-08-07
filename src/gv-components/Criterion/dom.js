import Component from '../../Component.js';
export default class Dom extends Component.Dom {
	main() {
		const result = document.createDocumentFragment();
		const header = document.createElement("header");
		header.appendChild(this.dom.label());


		result.appendChild(header);
		const description = document.createElement("div");
		description.classList.add("description");
		result.appendChild(description);
		result.appendChild(this.dom.criteria());
		return result;
	}
	label() {
		const result = document.createElement("label");
		result.appendChild(this.createSlot());
		result.appendChild(this.dom.input());
		return result;
	}
	criteria() {
		const result = this.createSlot("criteria");
		result.addEventListener("click", (e) => {
			if (e.target !== e.currentTarget) {
				return;
			}
			this.classList.toggle("collapsed");
		});
		return result;
	}
	input() {
		const result = document.createElement("div");
		result.classList.add("input");
		const input = document.createElement("input", { is: "gv-number" });
		input.inputMode = "none";
		input.type = "text";
		input.size = "1";
		input.name = "scriterion1";
		input.id = "scriterion1";
		input.step = "0.25";
		input.min = "0";
		input.max = "10";
		input.tabIndex = 0;
		result.appendChild(input);
		const value = document.createElement("span");
		value.classList.add("value");
		value.textContent = "0";
		result.appendChild(value);

		input.addEventListener("pointerdown", (e) => {
			if (this.shadowRoot.activeElement === input && !input.readOnly) {
				input.inputMode = "decimal";
			}
		});
		this.addEventListener("focusin", (e) => {
			const currentCriterion = document.body.querySelector("gv-criterion.current");
			if (currentCriterion && currentCriterion !== this) {
				currentCriterion.deactivate();
			}
			this.activate();
			e.stopPropagation();
		});
		return result;
	}
}