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
		this.parts.scoring = result.appendChild(this.dom.scoring());
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
		const result = document.createElement("gv-scoring");
		this.addEventListener("keydown", (e) => {
			if (e.key === "Enter" || e.key === "NumpadEnter" || e.key === "Return" || e.key === "Tab") {
				let nextCriteria;
				if (e.shiftKey) {
					nextCriteria = this.navigate(-1);
				} else if (this._criteria.length > 0) {
					nextCriteria = this._criteria[0].navigate();
				} else {
					nextCriteria = this.navigate(1);
				}
				if (!nextCriteria) {
					return;
				}
				nextCriteria.scrollIntoView({ behavior: "smooth", block: "center" });
				nextCriteria.focus();

				e.preventDefault();
				e.stopPropagation();
			}
		});
		result.addEventListener("change", (e) => {
			this.score = result.value;
		});
		return result;
	}
	scale() {
		const scale = document.createElement("gv-scale");
		scale.slot = "helpers";
		scale.min = 0;
		scale.max = this.max;
		return scale;
	}
}