import Component from "../../Component.js";
import Dom from "./dom.js";
import css from "./style.css?inline";

class Scale extends Component {
	constructor() {
		super();
		this._.min = 0;
		this._.max = 5;
		this._.length = 9;

		this.shadowRoot.appendChild(this.dom.style(css));
		this.shadowRoot.appendChild(this.dom.main());
	}
	get min() {
		return this._.min;
	}
	set min(val) {
		this._.min = val;
		this.update();
	}
	get max() {
		return this._.max;
	}
	set max(val) {
		this._.max = val;
		this.update();
	}
	get length() {
		return this._.length;
	}
	set length(val) {
		this._.length = val;
		this.update();
	}
	update() {
		const part = this.parts.fieldset;
		part.innerHTML = "";
		part.appendChild(this.buttons(this.max, this.min));
	}
	buttons(max, min, length) {
		const range = max - min;
		if (length === undefined) {
			length = this.findLength(range);
		}
		if (typeof length === "object") {
			const { modulo, remainder } = length;
			const result = this.buttons(max - remainder, min, modulo);
			const range2 = range - remainder;
			result.appendChild(this.dom.step(max));
			return result;
		} else {
			const result = document.createDocumentFragment();
			const step = range / length;
			for (let i = min; i <= max; i += step) {
				result.appendChild(this.dom.step(i));
			}
			return result;
		}
	}
	findLength(range) {
		if (range < 3) {
			const length60 = {
				"15": 1, "20": 1, "30": 2, "40": 2, "45": 3, "75": 5,
				"80": 4, "90": 6, "100": 5, "105": 5, "135": 9, "140": 7, "150": 5,
				"160": 8, "165": 10, "12": 1, "24": 2, "36": 3, "48": 4, "72": 6, "84": 7,
				"96": 4, "108": 5, "132": 9, "144": 5, "156": 12, "168": 6
			}[Math.round(range * 60)];
			if (length60) {
				return length60;
			}
		}
		const lengthInt = { "1": 4, "2": 4, "3": 6, "4": 4, "5": 5, "6": 6, "7": 7 }[range];
		if (lengthInt) {
			return lengthInt;
		}
		const { modulo, remainder } = this.findModulo(range);
		if (remainder === 0) {
			return modulo;
		}
		return { modulo, remainder };
	}
	findModulo(range) {
		if (range % 1 !== 0) {
			let frac = range % 1;
			let { modulo, remainder } = this.findModulo(range - frac);
			remainder += frac;
			return { modulo, remainder };
		}
		// const modulos = [7, 6, 5, 4, 3];
		const modulos = [5, 4, 3];
		for (const modulo of modulos) {
			if (range % modulo === 0) {
				return { modulo, remainder: 0 };
			}
		}
		let { modulo, remainder } = this.findModulo(range - 1);
		remainder++;
		return { modulo, remainder };
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