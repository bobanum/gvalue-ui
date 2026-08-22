import Component from "../../Component.js";

class Menu extends Component {
	static defaultUrl = "icons.svg";
	static defaultIcon = "hamburger";
	constructor() {
		super();
		this.shadowRoot.appendChild(this.dom.main());
		this.closeOnOutsideClick = this.closeOnOutsideClick.bind(this);
		this.closeOnEscape = this.closeOnEscape.bind(this);
		this.toggleMenu = this.toggleMenu.bind(this);
	}
	connectedCallback() {
		this.parts.button.addEventListener("click", this.toggleMenu);
		document.addEventListener("click", this.closeOnOutsideClick);
		document.addEventListener("keydown", this.closeOnEscape);
		this.updateExpandedState();
	}
	disconnectedCallback() {
		this.parts.button.removeEventListener("click", this.toggleMenu);
		document.removeEventListener("click", this.closeOnOutsideClick);
		document.removeEventListener("keydown", this.closeOnEscape);
	}
	get icon() {
		return this._icon?.value;
	}
	set icon(value) {
		value = value || Menu.defaultIcon;
		if (!value.match(/^[a-zA-Z0-9]+:\/\/|^\/|^\./)) {
			value = `${Menu.defaultUrl}#${value}`;
		}
		this._icon.value = value;
	}
	get label() {
		return this._label.value;
	}
	set label(value) {
		const label = value || "Menu";
		this._label.value = label;
		this.parts.button?.setAttribute("aria-label", label);
	}
	get open() {
		return this.hasAttribute("open");
	}
	set open(value) {
		this.toggleAttribute("open", Boolean(value));
		this.updateExpandedState();
	}
	toggleMenu(event) {
		event.stopPropagation();
		this.open = !this.open;
	}
	closeOnOutsideClick(event) {
		if (!this.contains(event.target)) {
			this.open = false;
		}
	}
	closeOnEscape(event) {
		if (event.key !== "Escape") {
			return;
		}
		this.open = false;
		this.parts.button.focus();
	}
	updateExpandedState() {
		this.parts.button?.setAttribute("aria-expanded", this.open);
	}
	dom = {
		main: () => {
			const result = document.createDocumentFragment();
			result.appendChild(this.dom.style());
			result.appendChild(this.dom.button());
			this.parts.panel = result.appendChild(this.createSlot());
			return result;
		},
		style: () => {
			const result = document.createElement("style");
			result.textContent = `
				:host {
					position: relative;
				}

				button {
					display: inline-grid;
					place-items: center;
					border: 0;
					background: transparent;
					color: inherit;
					font: inherit;
					padding: 0.35em;
					border-radius: 999px;
					cursor: pointer;
				}

				button:hover,
				button:focus-visible {
					background-color: #0002;
				}

				svg {
					width: 1.4em;
					height: 1.4em;
					display: block;
				}

				.label {
					position: absolute;
					width: 1px;
					height: 1px;
					padding: 0;
					margin: -1px;
					overflow: hidden;
					clip: rect(0, 0, 0, 0);
					white-space: nowrap;
					border: 0;
				}

				:host(:not([open])) slot {
					display: none;
				}

				slot {
					display: block;
					position: absolute;
					top: calc(100% + 0.25em);
					right: 0;
					min-width: 15rem;
					white-space: nowrap;
					background-color: var(--background-color);
					color: var(--text-color);
					border-radius: 0.75em;
					box-shadow: 0 0 1em #0006;
					overflow: hidden;
				}

				::slotted(*) {
					display: block;
					width: 100%;
					box-sizing: border-box;
					padding: 0.75em 1em;
					border: 0;
					background: transparent;
					color: inherit;
					font: inherit;
					text-align: left;
					cursor: pointer;
				}

				::slotted(:hover) {
					background-color: hsl(from var(--background-color) h s calc(l + var(--less)));
				}
			`;
			return result;
		},
		button: () => {
			const result = document.createElement("button");
			result.type = "button";
			result.setAttribute("aria-haspopup", "menu");
			const icon = this.dom.icon();
			result.appendChild(icon);
			const label = document.createElement("span");
			label.classList.add("label");
			Object.defineProperty(label, "value", {
				get: () => label.textContent,
				set: (value) => label.textContent = value,
			});
			label.textContent = this.label || "Menu";
			this._label = label;
			result.appendChild(label);
			this.parts.button = result;
			this.label = this.getAttribute("label");
			return result;
		},
		icon: () => {
			const result = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
			use.setAttribute("href", `${Menu.defaultUrl}#${Menu.defaultIcon}`);
			result.appendChild(use);
			this._icon = use.attributes.getNamedItem("href");
			return result;
		},
	};
	static get observedAttributes() {
		return ["icon", "label", "open"];
	}
	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;
		if (name === "open") {
			this.updateExpandedState();
			return;
		}
		this[name] = newValue;
	}
}

Menu.register("menu-ponent");