import { Component } from "./Component.js";

class ButtonPonent extends Component {
	static defaultUrl = "/public/icons.svg";
	constructor() {
		super();
		this.shadowRoot.appendChild(this.dom.main());
	}
	connectedCallback() {
		console.log(123);

	}
	get icon() {
		return this._icon?.value;
	}
	set icon(value) {

		if (!value.match(/^[a-zA-Z0-9]+:\/\/|^\/|^\./)) {
			value = `${ButtonPonent.defaultUrl}#${value}`;
		}
		console.log(value);
		this._icon.value = value;
	}
	get label() {
		return this._label.value;
	}
	set label(value) {
		console.log(value);
		
		this._label.value = value;
	}
	dom = {
		main: () => {
			const result = document.createDocumentFragment();
			result.appendChild(this.dom.style());
			result.appendChild(this.dom.icon());
			result.appendChild(this.dom.label());
			return result;
		},
		style: () => {
			const result = document.createElement("style");
			result.textContent = `
				:host {
					display: inline-flex;
					align-items: center;
					justify-content: center;
					width: 1em;
					height: 1em;
				}
				svg {
					width: 100%;
					height: 100%;
				}
			`;
			return result;
		},
		icon: () => {
			const result = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
			use.setAttribute("href", this.icon);
			result.appendChild(use);
			this._icon = use.attributes.getNamedItem("href");
			return result;
		},
		label: () => {
			const result = document.createElement("slot");
			Object.defineProperty(result, "value", {
				get: () => result.textContent,
				set: (value) => result.textContent = value
			});
			this._label = result;
			result.textContent = this.label;
			return result;
		}
	};
	static get observedAttributes() {
		return ["icon", "label"];
	}
	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;
		this[name] = newValue;
	}
}

ButtonPonent.register();