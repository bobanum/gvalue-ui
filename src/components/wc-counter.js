const template = document.createElement('template')

template.innerHTML = `
  <style>
    :host {
      display: block;
    }

    button {
      border: 0;
      border-radius: 999px;
      background: #0f172a;
      color: #f8fafc;
      font-size: 0.95rem;
      font-weight: 600;
      padding: 0.7rem 1.1rem;
      cursor: pointer;
      transition: transform 120ms ease, box-shadow 120ms ease;
      box-shadow: 0 6px 12px rgba(15, 23, 42, 0.25);
    }

    button:hover {
      transform: translateY(-1px);
      box-shadow: 0 8px 16px rgba(15, 23, 42, 0.32);
    }

    button:active {
      transform: translateY(0);
    }
  </style>
  <button type="button" part="button">Count: 0</button>
`

class WcCounter extends HTMLElement {
  #count = 0

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
  }

  connectedCallback() {
    this.button = this.shadowRoot.querySelector('button')
    this.button.addEventListener('click', this.#increment)
  }

  disconnectedCallback() {
    this.button?.removeEventListener('click', this.#increment)
  }

  #increment = () => {
    this.#count += 1
    this.button.textContent = `Count: ${this.#count}`
  }
}

customElements.define('wc-counter', WcCounter)
