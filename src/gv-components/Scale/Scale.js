import Component from "../../Component.js";
import Dom from "./dom.js";
import css from "./style.css?inline";

class Scale extends Component {
	constructor() {
		super();
		this._.min = 0;
		this._.max = 5;
		this._.length = 6;
		console.log(123);

		this.shadowRoot.appendChild(this.dom.style(css));
		this.shadowRoot.appendChild(this.dom.main());
	}
	connectedCallback() {
	}
	get min() {
		return this._.min;
	}
	set min(value) {
		this._.min = value;
		this.update();
	}
	get max() {
		return this._.max;
	}
	set max(value) {
		this._.max = value;
		this.update();
	}
	get length() {
		return this._.length;
	}
	set length(value) {
		this._.length = value;
		this.update();
	}
	update() {
		const part = this.parts.fieldset;
		part.innerHTML = "";
		const step = (this.max - this.min) / (this.length - 1);
		for (let i = this.min; i <= this.max; i += step) {
			const button = document.createElement("div");
			button.tabIndex = -1;
			button.innerHTML = this.formatFrac(i);
			part.appendChild(button);
		}
		// const steps = this.shadowRoot.querySelectorAll("fieldset > div");
	}
	formatFrac(value) {
		const codes = [
			["15", "25", "35", "45"],
			["16", "13", "12", "23", "56"],
			["18", "14", "38", "12", "58", "34", "78"]
		];
		const integer = Math.floor(value);
		let result;
		for (let i = 0; i < codes.length; i++) {
			const code = codes[i];
			const mult = code.length + 1;
			const frac = (value - integer) * mult;
			const rFrac = Math.round(frac);
			if (Math.abs(frac - rFrac) < 0.0001) {
				if (rFrac === 0) {
					result = integer.toString();
				} else if (rFrac === mult) {
					result = (integer + 1).toString();
				} else {
					result = `${integer || ""}&frac${code[rFrac - 1]};`;
				}
				break;
			}
		}
		return result || value.toString(10);
	}
}

Scale.register("gv-scale", { Dom });