import MathExpressionEvaluator from './MathExpressionEvaluator.js';

function countDecimals(value) {
	if (!globalThis.Number.isFinite(value)) {
		return 0;
	}
	const text = String(value);
	if (!text.includes('.')) {
		return 0;
	}
	return text.split('.')[1].length;
}

function formatEditableNumber(value, step) {
	if (!globalThis.Number.isFinite(value)) {
		return '';
	}
	const decimals = Math.min(12, Math.max(0, countDecimals(step)));
	let text = decimals > 0 ? value.toFixed(decimals) : String(Math.trunc(value));
	if (decimals > 0) {
		text = text.replace(/\.?0+$/, '');
	}
	return text;
}

export default class GvNumberInput extends HTMLInputElement {
	connectedCallback() {
		if (this._connected) {
			return;
		}
		this._connected = true;
		this._lastCommitted = null;
		if (!this.hasAttribute('inputmode')) {
			this.inputMode = 'decimal';
		}
		if (this.type === 'number') {
			this.type = 'text';
		}

		const initial = this._parseInput(this.value);
		if (initial !== null) {
			this._commit(initial, false);
		}

		this.addEventListener('focus', () => {
			this._isEditing = true;
			if (this._lastCommitted !== null) {
				this.value = formatEditableNumber(this._lastCommitted, this._step);
				this.select();
			}
		});

		this.addEventListener('blur', () => {
			this._isEditing = false;
			this._commitFromInput();
		});

		this.addEventListener('keydown', (event) => {
			if (event.key === 'Escape') {
				event.preventDefault();
				this._restoreLastCommitted();
				this.blur();
				return;
			}
			if (event.key === 'Enter') {
				event.preventDefault();
				this._commitFromInput();
				this.blur();
				return;
			}
			if (event.key === 'Home') {
				if (this._min !== null) {
					event.preventDefault();
					this._commit(this._min, true);
					this.blur();
				}
				return;
			}
			if (event.key === 'End') {
				if (this._max !== null) {
					event.preventDefault();
					this._commit(this._max, true);
					this.blur();
				}
				return;
			}
			if (event.key === 'Tab') {
				this._commitFromInput();
				return;
			}
			if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
				event.preventDefault();
				let factor = 1;
				if (event.ctrlKey) {
					factor *= 0.1;
				}
				if (event.shiftKey) {
					factor *= 10;
				}
				const direction = event.key === 'ArrowUp' ? 1 : -1;
				this._increment(direction, factor);
			}
		});
	}

	get _locale() {
		return this.getAttribute('locale') || navigator.language || 'en-US';
	}

	get _step() {
		const value = globalThis.Number.parseFloat(this.getAttribute('step'));
		return globalThis.Number.isFinite(value) && value > 0 ? value : 1;
	}

	get _min() {
		const value = globalThis.Number.parseFloat(this.getAttribute('min'));
		return globalThis.Number.isFinite(value) ? value : null;
	}

	get _max() {
		const value = globalThis.Number.parseFloat(this.getAttribute('max'));
		return globalThis.Number.isFinite(value) ? value : null;
	}

	get numberValue() {
		if (this._lastCommitted !== null) {
			return this._lastCommitted;
		}
		const parsed = this._parseInput(this.value);
		return parsed === null ? globalThis.Number.NaN : parsed;
	}

	set numberValue(value) {
		if (!globalThis.Number.isFinite(value)) {
			return;
		}
		this._commit(value, false);
	}

	_increment(direction, factor) {
		const base = this._parseInput(this.value);
		const current = base !== null ? base : (this._lastCommitted ?? 0);
		const next = current + direction * this._step * factor;
		this._commit(next, true);
		if (this._isEditing) {
			this.value = formatEditableNumber(this._lastCommitted, this._step);
			this.select();
		}
	}

	_restoreLastCommitted() {
		if (this._lastCommitted === null) {
			this.value = '';
			return;
		}
		this.value = this._isEditing
			? formatEditableNumber(this._lastCommitted, this._step)
			: this._formatDisplay(this._lastCommitted);
	}

	_commitFromInput() {
		const parsed = this._parseInput(this.value);
		if (parsed === null) {
			this._restoreLastCommitted();
			return false;
		}
		this._commit(parsed, true);
		return true;
	}

	_commit(value, notify) {
		const bounded = this._applyBounds(value);
		if (!globalThis.Number.isFinite(bounded)) {
			return;
		}
		this._lastCommitted = bounded;
		this.value = this._isEditing
			? formatEditableNumber(bounded, this._step)
			: this._formatDisplay(bounded);
		if (notify) {
			this.dispatchEvent(new Event('input', { bubbles: true }));
			this.dispatchEvent(new Event('change', { bubbles: true }));
		}
	}

	_applyBounds(value) {
		let result = value;
		if (this._min !== null && result < this._min) {
			result = this._min;
		}
		if (this._max !== null && result > this._max) {
			result = this._max;
		}
		return result;
	}

	_parseInput(raw) {
		if (!raw || !raw.trim()) {
			return null;
		}

		const localeParts = new Intl.NumberFormat(this._locale).formatToParts(12345.6);
		const decimalPart = localeParts.find((part) => part.type === 'decimal');
		const groupPart = localeParts.find((part) => part.type === 'group');
		const decimal = decimalPart ? decimalPart.value : '.';
		const group = groupPart ? groupPart.value : ',';

		let text = raw.trim();
		if (this.hasAttribute('prefix')) {
			text = text.replaceAll(this.getAttribute('prefix'), '');
		}
		if (this.hasAttribute('suffix')) {
			text = text.replaceAll(this.getAttribute('suffix'), '');
		}
		text = text
			.replaceAll('\u00A0', '')
			.replaceAll(' ', '')
			.replaceAll(group, '')
			.replaceAll(decimal, '.')
			.replaceAll(',', '.');

		if (/[^0-9+\-*/().]/.test(text)) {
			return null;
		}

		const evaluated = new MathExpressionEvaluator(text).evaluate();
		if (evaluated === null || !globalThis.Number.isFinite(evaluated)) {
			return null;
		}

		return this._applyBounds(evaluated);
	}

	_formatDisplay(value) {
		const formatter = new Intl.NumberFormat(this._locale, {
			maximumFractionDigits: Math.max(2, countDecimals(this._step)),
		});
		const localized = formatter.format(value);
		const pattern = this.getAttribute('format');
		if (pattern && pattern.includes('{value}')) {
			return pattern.replaceAll('{value}', localized);
		}
		const prefix = this.getAttribute('prefix') || '';
		const suffix = this.getAttribute('suffix') || '';
		return `${prefix}${localized}${suffix}`;
	}
}

customElements.define('gv-number', GvNumberInput, { extends: 'input' });