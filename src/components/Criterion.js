import { Component } from '../Component.js';
import CSS from './criterion.css?inline';

export class Criterion extends Component {
	constructor() {
		super();
		this.dom = this.adoptFunctions(this.constructor.dom || {});
		const criteria = this.querySelectorAll('gv-criterion');
		this.criteriaCount = criteria.length;
		criteria.forEach((c) => {
			c.slot = "criteria";
		});
	}
	connectedCallback() {
		this.shadowRoot.appendChild(this.dom.style());
		this.shadowRoot.appendChild(this.dom.main());
	}
	static dom = {
		style() {
			const result = document.createElement("style");
			result.textContent = CSS;
			return result;
		},
		main() {
			const result = document.createDocumentFragment();
			const header = document.createElement("header");
			header.appendChild(this.dom.label());
			result.appendChild(header);
			result.appendChild(this.createSlot("criteria"));
			return result;
		},
		label() {
			const result = document.createElement("label");
			result.appendChild(this.createSlot());
			result.appendChild(this.dom.input());
			return result;
		},
		input() {
			const result = document.createElement("div");
			result.classList.add("input");
			const input = document.createElement("input");
			input.type = "number";
			input.size = "1";
			input.name = "scriterion1";
			input.id = "scriterion1";
			if (this.criteriaCount > 0) {
				input.disabled = true;
				input.style.pointerEvents = "none";
				input.placeholder = "10";
				const enableInput = () => {
					input.disabled = false;
					input.value = input.placeholder;
					input.focus();
					input.select();
					input.addEventListener("blur", () => {
						input.disabled = true;
					}, { once: true });
				};

				let longPressTimer;
				const LONG_PRESS_MS = 500;

				result.addEventListener("click", (e) => {
					if (e.ctrlKey) {
						enableInput();
					}
				});

				result.addEventListener("mousedown", () => {
					longPressTimer = window.setTimeout(() => {
						enableInput();
					}, LONG_PRESS_MS);
				});

				const clearLongPress = () => {
					if (longPressTimer) {
						window.clearTimeout(longPressTimer);
						longPressTimer = undefined;
					}
				};

				result.addEventListener("mouseup", clearLongPress);
				result.addEventListener("mouseleave", clearLongPress);
				result.addEventListener("contextmenu", (e) => {
					e.preventDefault();
				});
				result.addEventListener("touchstart", () => {
					longPressTimer = window.setTimeout(() => {
						enableInput();
					}, LONG_PRESS_MS);
				});
				result.addEventListener("touchend", clearLongPress);
				result.addEventListener("touchcancel", clearLongPress);
			}
			result.appendChild(input);
			const value = document.createElement("span");
			value.textContent = "/10";
			result.appendChild(value);
			return result;
		}
	};
}

Criterion.register('gv-criterion');