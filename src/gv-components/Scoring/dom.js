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
		result.addEventListener("input", (e) => {
			this.value = result.valueAsNumber;

			this.dispatchEvent(new CustomEvent("change", {
				detail: { value: result.value }
			}));
		});

		result.addEventListener("keydown", (e) => {

			switch (e.key) {
				case "ArrowUp":
				case "ArrowDown":
					let step = this.step * (e.key === "ArrowUp" ? 1 : -1);
					if (e.shiftKey) {
						step *= 10;
					} else if (e.ctrlKey) {
						step /= 10;
					}
					let value = (this.value || 0) + step;
					this.value = Math.min(this.max, value);
					e.preventDefault();
					return;
				case "End":
					if (e.ctrlKey) {
						this.criterion.parentElement.minimize();
					} else {
						this.criterion.minimize();
					}
					e.preventDefault();
					return;
				case "Home":
					if (e.ctrlKey) {
						this.criterion.parentElement.maximize();
					} else {
						this.criterion.maximize();
					}
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