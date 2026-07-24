export class Component extends HTMLElement {
	constructor() {
		super();
		this.dom = this.adoptFunctions(this.constructor.dom || {});
		this.attachShadow({ mode: "open" });
	}
	static register(tag) {
		tag = tag || this.toKebabCase(this.name);
		customElements.define(tag, this);
	}
	static toKebabCase(str) {
		return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
	}
	adoptFunctions(source) {
		const result = {};
		for (let k in source) {
			if (typeof source[k] === "function") {
				result[k] = source[k].bind(this);
			}
		}
		return result;
	}
	createSlot(name, defaultContent) {
		const result = document.createElement("slot");
		if (name) {
			result.setAttribute("name", name);
		}
		if (defaultContent) {
			result.textContent = defaultContent;
		}
		return result;
	}
	static dom = {
		test() {
			console.log("test static");
		}
	};
}