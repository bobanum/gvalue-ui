import Component from '../../Component.js';
import Dom from './dom.js';
import css from "./style.css?inline";

class Comment extends Component {
	constructor() {
		super();
		this._ = {
			value: "",
			id: "",
			criterionId: "",
			proportionnal: false,
			absolute: false,
			checked: false
		};
		this.shadowRoot.appendChild(this.dom.style(css));
		this.shadowRoot.appendChild(this.dom.main());
		this.addEventListener("contextmenu", this.evt.open.bind(this));
	}
	connectedCallback() {
		this.slot = "comments";
		this.checked = this.checked;
		// this.addEventListener("longpress", this.evt.open.bind(this));
	}
	get checked() {
		return this.hasAttribute("checked");
	}
	set checked(value) {
		const checked = Boolean(value);
		this.toggleAttribute("checked", checked);
		const input = this.shadowRoot.querySelector('input[type="checkbox"]');
		if (input) {
			input.checked = checked;
		}
	}
	get value() {
		return this._.value;
	}
	set value(value) {
		this._.value = value;
		const textValue = this.formatValue(value);
		this.shadowRoot.querySelector(".value").textContent = textValue;
	}
	set text(value) {
		this.textContent = value;
	}
	formatValue(value, precision = 2) {
		let frac = precision % 1;
		precision -= frac;
		let result = value;
		let sign = Math.sign(value);
		result = Math.abs(value);
		let length = Math.floor(Math.log10(result));
		const mult = 10 ** (precision - length - 1);

		result = Math.round(result * mult) / mult;
		if (frac > 0) {
			let residu = value - result;
			residu = residu * mult / frac;
			residu = Math.round(residu);
			residu = residu * frac / mult;
			result = +(result + residu).toFixed(9);
		}
		result = result.toString();
		if (sign <= 0) {
			result = `\u2796\uFE0E${result}`;
		} else {
			result = `\u2795\uFE0E${result}`;
		}
		return result;
	}
	evt = {
		open(e) {
			if (e.originalTarget.tagName !== "SLOT") return;
			e.stopPropagation();
			e.stopImmediatePropagation();
			e.preventDefault();

			const popup = document.createElement("popup-ponent");
			const title = document.createElement("div");
			title.textContent = "Modifier le commentaire";
			title.slot = "title";
			popup.appendChild(title);

			const dup = document.createElement("button");
			dup.slot = "footer";
			dup.textContent = "Dupliquer";
			popup.appendChild(dup);
			popup.appendChild(this.dom.form());
			const top = this.getBoundingClientRect().top;
			const left = this.getBoundingClientRect().left;

			popup.style.setProperty("--offset-y", `${window.innerHeight - top}px`);
			popup.style.setProperty("--offset-x", `${window.innerWidth - left}px`);
			this.shadowRoot.appendChild(popup);
		}
	};
	static get observedAttributes() {
		return ["checked"];
	}
	attributeChangedCallback(name, oldValue, newValue) {
		if (name !== "checked" || oldValue === newValue) {
			return;
		}
		this.checked = newValue !== null;
	}
}

Comment.register('gv-comment', { Dom });
