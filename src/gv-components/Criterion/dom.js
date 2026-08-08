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
		this.parts.criteria = result.appendChild(this.dom.criteria());
		return result;
	}
	label() {
		const result = document.createElement("label");
		this.parts.label = result.appendChild(this.createSlot());
		result.appendChild(this.dom.scoring());
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
	scoring() {
		const result = document.createElement("div");
		result.classList.add("scoring");
		const score = document.createElement("input", { is: "gv-number" });
		score.inputMode = "none";
		score.type = "text";
		score.size = "1";
		score.min = "0";
		score.tabIndex = 0;
		this.parts.score = result.appendChild(score);
		const value = document.createElement("span");
		value.classList.add("value");
		this.parts.value = result.appendChild(value);
		result.appendChild(value);

		score.addEventListener("pointerdown", (e) => {
			if (this.shadowRoot.activeElement === score && !score.readOnly) {
				score.inputMode = "decimal";
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
	scale() {
		const scale = document.createElement("gv-scale");
		scale.slot = "helpers";
		scale.min = 0;
		scale.max = this.value;
		return scale;
	}
}