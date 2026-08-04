import Component from "../../Component.js";
import Dom from "./dom.js";
import css from "./style.css?inline";

class Scale extends Component { 
	constructor() {
		super();
		this.min = 0;
		this.max = 5;
		this.length = 6;
		this.shadowRoot.appendChild(this.dom.style(css));
	}
	connectedCallback() {
		this.shadowRoot.appendChild(this.dom.main());
	}
}

Scale.register("gv-scale", { Dom });