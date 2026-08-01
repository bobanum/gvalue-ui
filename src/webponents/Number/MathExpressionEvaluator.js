export default class MathExpressionEvaluator {
	constructor(expression) {
		this._expression = expression;
		this._tokens = [];
		this._index = 0;
	}

	evaluate() {
		if (!this._tokenize()) {
			return null;
		}
		const result = this._parseAddSub();
		if (result === null || this._index !== this._tokens.length || !globalThis.Number.isFinite(result)) {
			return null;
		}
		return result;
	}

	_tokenize() {
		let i = 0;
		while (i < this._expression.length) {
			const char = this._expression[i];
			if ('+-*/()'.includes(char)) {
				this._tokens.push(char);
				i += 1;
				continue;
			}
			if (char >= '0' && char <= '9' || char === '.') {
				let number = '';
				let dotCount = 0;
				while (i < this._expression.length) {
					const current = this._expression[i];
					if (current === '.') {
						dotCount += 1;
						if (dotCount > 1) {
							return false;
						}
						number += current;
						i += 1;
						continue;
					}
					if (current < '0' || current > '9') {
						break;
					}
					number += current;
					i += 1;
				}
				if (number === '.' || number === '') {
					return false;
				}
				this._tokens.push(globalThis.Number.parseFloat(number));
				continue;
			}
			return false;
		}
		return true;
	}

	_parsePrimary() {
		const token = this._tokens[this._index];
		if (token === '(') {
			this._index += 1;
			const value = this._parseAddSub();
			if (this._tokens[this._index] !== ')') {
				return null;
			}
			this._index += 1;
			return value;
		}
		if (typeof token === 'number') {
			this._index += 1;
			return token;
		}
		return null;
	}

	_parseUnary() {
		if (this._tokens[this._index] === '+') {
			this._index += 1;
			return this._parseUnary();
		}
		if (this._tokens[this._index] === '-') {
			this._index += 1;
			const value = this._parseUnary();
			return value === null ? null : -value;
		}
		return this._parsePrimary();
	}

	_parseMulDiv() {
		let value = this._parseUnary();
		if (value === null) {
			return null;
		}
		while (this._tokens[this._index] === '*' || this._tokens[this._index] === '/') {
			const operator = this._tokens[this._index];
			this._index += 1;
			const right = this._parseUnary();
			if (right === null) {
				return null;
			}
			if (operator === '*') {
				value *= right;
			} else {
				value /= right;
			}
		}
		return value;
	}

	_parseAddSub() {
		let value = this._parseMulDiv();
		if (value === null) {
			return null;
		}
		while (this._tokens[this._index] === '+' || this._tokens[this._index] === '-') {
			const operator = this._tokens[this._index];
			this._index += 1;
			const right = this._parseMulDiv();
			if (right === null) {
				return null;
			}
			if (operator === '+') {
				value += right;
			} else {
				value -= right;
			}
		}
		return value;
	}
}
