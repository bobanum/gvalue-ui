import { Component } from "../Component.js";
import css from "./scale.css?inline";

class Scale extends Component { 
	constructor() {
		super();
		this.dom = this.adoptFunctions(this.constructor.dom || {});
		this.min = 0;
		this.max = 5;
		this.length = 6;
		this.shadowRoot.appendChild(this.dom.style());
	}
	connectedCallback() {
		this.shadowRoot.appendChild(this.dom.main());
	}
	static dom = {
		style() {
			const result = document.createElement("style");
			result.textContent = css;
			return result;
		},
		main() {
			const result = document.createElement("fieldset");
			for (let i = 0; i <= 5; i++) {
				const step = document.createElement("div");
				step.tabIndex = -1;
				step.innerHTML = i;
				result.appendChild(step);
			}
			result.appendChild(this.dom.sec());
			return result;
		},
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
}

Scale.register("gv-scale");