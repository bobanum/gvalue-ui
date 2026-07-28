import { Component } from "./Component.js";
import css from "../css/popup.css?inline";

class PopupPonent extends Component {
	constructor() {
		super();
		this.shadowRoot.appendChild(this.dom.style());
		this.shadowRoot.appendChild(this.dom.main());
	}
	connectedCallback() {
		setTimeout(() => {
			this.classList.add("visible");
		}, 50);
	}
	remove() {
		this.classList.remove("visible");
		this.addEventListener("transitionend", () => {
			super.remove();
		}, { once: true });
	}
	set title(value) {
		this.shadowRoot.querySelector("slot[name=title]").textContent = value;
	}
	dom = {
		style: () => {
			const result = document.createElement("style");
			result.textContent = css;
			return result;
		},
		main: () => {
			const result = document.createDocumentFragment();
			result.appendChild(this.dom.box());
			const xButton = document.createElement("button");
			xButton.classList.add("x-button");
			xButton.innerHTML = "&times;";
			xButton.addEventListener("click", (e) => {
				if (e.target === xButton) {
					this.remove();
				}
			});
			result.appendChild(xButton);
			return result;
		},
		box: () => {
			const result = document.createElement("section");
			result.classList.add("box");
			result.part = "box";
			const title = this.createSlot("title");
			result.appendChild(title);
			result.appendChild(this.createSlot());
			result.appendChild(this.dom.footer());
			return result;
		},
		footer: () => {
			const result = document.createElement("footer");
			result.appendChild(this.createSlot("footer"));
			const confirmButton = this.dom.button("Confirmer", "hsl(120, 50%, 30%)");
			result.appendChild(confirmButton);
			const cancelButton = this.dom.button("Annuler", "hsl(0, 70%, 50%)", () => {
				this.remove();
			});
			result.appendChild(cancelButton);
			return result;
		},
		button: (text, color, onClick) => {
			const result = document.createElement("button");
			result.textContent = text;
			result.style.setProperty("--color", color);
			result.slot = "footer";
			if (onClick) {
				result.addEventListener("click", onClick);
			}
			return result;
		},
	};
}

PopupPonent.register();