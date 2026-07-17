import { Component } from '../Component.js';
import criteriumCss from './criterium.css?inline';

class Criterium extends Component {
	constructor() {
		super();
		const criteria = this.querySelectorAll('gv-criterium');
		this.criteriaCount = criteria.length;
		criteria.forEach((c) => {
			c.slot = "criteria";
		});
	}
	connectedCallback() {
		this.shadowRoot.appendChild(this.dom.style());
		this.shadowRoot.appendChild(this.dom.main());
	}
	dom = {
		style: () => {
			const result = document.createElement("style");
			result.textContent = criteriumCss;
			return result;
		},
		main: () => {
			const result = document.createDocumentFragment();
			const header = document.createElement("header");
			header.appendChild(this.dom.label());
			result.appendChild(header);
			result.appendChild(this.createSlot("criteria"));
			return result;
		},
		label: () => {
			const result = document.createElement("label");
			result.appendChild(this.createSlot());
			result.appendChild(this.dom.input());
			const value = document.createElement("span");
			value.textContent = "/10";
			result.appendChild(value);
			return result;
		},
		input: () => {
			const result = document.createElement("input");
			result.type = "number";
			result.size = "1";
			result.name = "scriterion1";
			result.id = "scriterion1";
			if (this.criteriaCount > 0) {
				result.readOnly = true;
			}
			return result;
		}
	};
}

Criterium.register('gv-criterium');