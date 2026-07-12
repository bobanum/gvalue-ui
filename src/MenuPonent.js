import { Component } from "./Component.js";

class MenuPonent extends Component {
	static defaultUrl = "/public/icons.svg#hamburger";
	constructor() {
		super();
		this.shadowRoot.appendChild(this.dom.main());
	}
	connectedCallback() {
		// this.tabIndex = 0;
		this.addEventListener("click", () => {
			this.open = !this.open;
		});
	}
	get icon() {
		return this._icon?.value;
	}
	set icon(value) {

		if (!value.match(/^[a-zA-Z0-9]+:\/\/|^\/|^\./)) {
			value = `${MenuPonent.defaultUrl}#${value}`;
		}
		this._icon.value = value;
	}
	get label() {
		return this._label.value;
	}
	set label(value) {
		this._label.value = value;
	}
	dom = {
		main: () => {
			const result = document.createDocumentFragment();
			result.appendChild(this.dom.style());
			result.appendChild(this.dom.icon());
			result.appendChild(this.createSlot());
			return result;
		},
		style: () => {
			const result = document.createElement("style");
			result.textContent = `
				:host {
					position: relative;
					float: right;
				}

				svg {
					width: 1em;
					height: 1em;
					display: block;
				}

				:host(:focus-within) svg {
					pointer-events: none;
				}

				:host(:not(:focus-within)) slot {
					display: none;
				}

				slot {
					white-space: nowrap;
					display: block;
					position: absolute;
					top: 0%;
					right: 1.5em;
					background-color: #334;
					box-shadow: 0 0 1em #000;
				}

				::slotted(*) {
					padding: .5em;
				}

				::slotted(:hover) {
					background-color: #445;
				}
			`;
			return result;
		},
		icon: () => {
			const result = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			result.tabIndex = 0;
			const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
			use.setAttribute("href", MenuPonent.defaultUrl);
			result.appendChild(use);
			this._icon = use.attributes.getNamedItem("href");
			return result;
		},
	};
	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;
		this[name] = newValue;
	}
}

MenuPonent.register();