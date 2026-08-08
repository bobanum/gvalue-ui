import Component from "../../Component.js";

export default class Dom extends Component.Dom {
	main() {
		const result = document.createElement("fieldset");
		this.parts.fieldset = result;

		// result.appendChild(this.dom.sec());
		return result;
	}
	step(val) {
		const result = document.createElement("div");
		result.tabIndex = 1;
		result.innerHTML = this.formatFrac(val);
		result.dataset.value = val;
		result.addEventListener("click", () => {
			this.dispatchEvent(new CustomEvent("change", {
				detail: { value: val }
			}));
		});
		return result;
	}
	sec() {
		const result = document.createElement("span");
		result.classList.add("sec");
		for (let i = 0; i < 7; i++) {
			const fracs = ["18", "14", "38", "12", "58", "34", "78"];
			const step = document.createElement("div");
			step.tabIndex = -1;
			step.innerHTML = `&frac${fracs[i]};`;
			result.appendChild(step);
		}
		return result;
	}
}
