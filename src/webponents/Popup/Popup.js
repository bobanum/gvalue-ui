import Component from "../../Component.js";
import Dom from "./dom.js";
import css from "./style.css?inline";

class Popup extends Component {
	constructor() {
		super();
		this.shadowRoot.appendChild(this.dom.style(css));
		this.shadowRoot.appendChild(this.dom.main());
	}
	connectedCallback() {
		setTimeout(() => {
			this.classList.add("visible");
		}, 50);
		document.addEventListener("keydown", (e) => {
			if (e.key === "Escape") {
				return this.remove();
			}
			if (e.key === "Enter" && e.ctrlKey) {
				// send "submit" event to the popup
				this.dispatchEvent(new CustomEvent("submit"));
				this.remove();
			}
		});
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
}

Popup.register("popup-ponent", { Dom });