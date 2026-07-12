export class Component extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
	}
	static register(tag) {
		tag = tag || this.toKebabCase(this.name);
		customElements.define(tag, this);
	}
	static toKebabCase(str) {
		return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
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
}