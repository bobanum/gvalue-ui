import './wc-counter.js'

const template = document.createElement('template')

template.innerHTML = `
  <style>
    :host {
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 1.5rem;
      color: #0f172a;
    }

    .card {
      width: min(680px, 100%);
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid rgba(148, 163, 184, 0.45);
      border-radius: 20px;
      padding: clamp(1.2rem, 3vw, 2rem);
      box-shadow: 0 20px 40px rgba(15, 23, 42, 0.1);
      backdrop-filter: blur(6px);
    }

    h1 {
      margin: 0;
      font-size: clamp(1.7rem, 3vw, 2.4rem);
      letter-spacing: -0.02em;
    }

    p {
      margin: 0.65rem 0 1.2rem;
      line-height: 1.5;
      color: #334155;
    }

    code {
      background: #e2e8f0;
      border-radius: 0.35rem;
      padding: 0.14rem 0.35rem;
      font-size: 0.9em;
    }
  </style>

  <main class="card">
    <h1>Vite + Web Components</h1>
    <p>
      Squelette prêt avec des Custom Elements natifs et Shadow DOM.
      Modifie <code>src/components</code> pour ajouter tes composants.
    </p>
    <wc-counter></wc-counter>
  </main>
`

class GvalueApp extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
  }
}

customElements.define('gvalue-app', GvalueApp)
