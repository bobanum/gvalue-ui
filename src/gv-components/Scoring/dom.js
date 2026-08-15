import Component from '../../Component.js';
export default class Dom extends Component.Dom {
	main() {
		const result = document.createDocumentFragment();
		const input = this.dom.input();
		this.parts.input = result.appendChild(input);
		const max = this.dom.max();
		this.parts.max = result.appendChild(max);
		return result;
	}
	input() {
		const result = document.createElement("input");
		result.inputMode = "none";
		result.type = "number";
		result.size = "1";
		result.min = "0";
		result.tabIndex = 1;
		result.addEventListener("change", (e) => {
			console.log("change", e, result.value, this._value);
			this.value = result.valueAsNumber;
			
			// this.dispatchEvent(new CustomEvent("change", {
			// 	detail: { value: result.value }
			// }));
		});

		result.addEventListener("keydown", (e) => {
			if (e.key === "Enter") {
				this.dispatchEvent(new CustomEvent("enter", {
					detail: { value: result.value }
				}));
				return;
			}
			
			if (e.key === "ArrowUp") {
				console.log(e, this.value);
				if (!e.shiftKey && !e.ctrlKey && !e.metaKey) return;
				let newValue = (this.value || 0);
				if (e.shiftKey) {
					newValue += 10 * this.step;
				} else if (e.ctrlKey) {
					newValue += 0.1 * this.step;
				}
				this.value = Math.min(this.max, newValue);
				e.preventDefault();
				return;
			}
			if (e.key === "ArrowDown") {
				console.log(e, this.value);
				if (!e.shiftKey && !e.ctrlKey && !e.metaKey) return;
				let newValue = (this.value || 0);
				if (e.shiftKey) {
					newValue -= 10 * this.step;
				} else if (e.ctrlKey) {
					newValue -= 0.1 * this.step;
				}
				this.value = Math.max(0, newValue);
				e.preventDefault();
				return;
			}
		});
		return result;
	}
	max() {
		const result = document.createElement("span");
		result.classList.add("max");
		Component.addTextContentValue(result);
		return result;
	}
}