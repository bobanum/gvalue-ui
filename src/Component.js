export default class Component extends HTMLElement {
	static LONG_PRESS_DELAY = 500;
	static shadowRootOptions = { mode: "open", delegatesFocus: false };
	constructor() {
		super();
		this._ = {};
		this.parts = {};
		this.dom = this.adoptFunctions(new this.constructor.Dom());
		this.attachShadow(this.constructor.shadowRootOptions);
	}
	static register(tag, options = {}) {
		tag = tag || this.toKebabCase(this.name);
		customElements.define(tag, this);
		for (let k in options) {
			this[k] = options[k];
		}
	}
	static toKebabCase(str) {
		return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
	}
	getAllProperties(obj) {
		if (obj === null || obj.constructor.name === "Object") return {};

		const props = this.getAllProperties(Object.getPrototypeOf(obj));
		Object.getOwnPropertyNames(obj).forEach(p => props[p] = obj[p]);

		return props;
	}
	adoptFunctions(source) {
		const props = this.getAllProperties(source);

		for (let k in props) {
			if (typeof props[k] === "function") {
				props[k] = props[k].bind(this);
			}
		}
		return props;
	}
	createSlot(name, defaultContent) {
		const result = document.createElement("slot");
		result.classList.add(name || "default");
		if (name) {
			result.setAttribute("name", name);
		}
		if (defaultContent) {
			result.textContent = defaultContent;
		}
		return result;
	}
	fill(content) {
		for (let k in content) {
			this[k] = content[k];
		}
	}
	addEventListener(type, listener, options) {
		let types = type.split("|");
		if (types.length > 1) {
			for (let t of types) {
				this.addEventListener(t, listener, options);
			}
			return;
		}
		let eventProperties = {
			ctrl: "ctrlKey",
			shift: "shiftKey",
			alt: "altKey",
			meta: "metaKey",
			stop: "stopImmediatePropagation",
			prevent: "preventDefault",
		};
		let behaviours = type.split(":");
		type = behaviours.shift();
		let modifiers = type.split("-");
		type = modifiers.pop();
		let customs = ["longpress"];

		if (modifiers.length > 0 || behaviours.length > 0) {
			let originalListener = listener;
			listener = function (e) {
				for (let mod of modifiers) {
					if (mod[0] === "!" && e[eventProperties[mod.slice(1)]] || !e[eventProperties[mod]]) {
						return;
					}
				}
				for (let behaviour of behaviours) {
					behaviour = eventProperties[behaviour] || behaviour;
					e[behaviour]();
				}
				originalListener.call(this, e);
			};
		}
		if (!customs.includes(type)) {
			return super.addEventListener(type, listener, options);
		}
		if (modifiers.length > 0 && !customs.includes(type)) {
			return super.addEventListener(type, function (e) {
			}, options);
		}
		if (type === "longpress") {
			super.addEventListener("pointerdown", e => {
				// e.stopImmediatePropagation();
				// e.preventDefault();
				let timer = setTimeout(() => {
					document.addEventListener("contextmenu", (e) => {
						e.preventDefault();
					}, { once: true });
					listener.call(this, e);
					timer = undefined;
				}, Component.LONG_PRESS_DELAY);
				document.addEventListener("pointerup", (e) => {
					e.preventDefault();
					e.stopImmediatePropagation();
					clearTimeout(timer);
					timer = undefined;
				}, { once: true });
			}, options);
		}
	}
	static from(content) {
		const result = new this();
		result.fill(content);
		return result;
	}
	static Dom = class {
		style(cssText) {
			const result = document.createElement("style");
			result.textContent = cssText;
			return result;
		}
	};
	static addTextContentValue(element) {
		Object.defineProperty(element, "value", {
			get: function () {
				return this.textContent;
			},
			set: function (val) {
				this.textContent = val;
			}
		});
	}
}