import './card-grid-demo.css';

export class CardGridDemo extends HTMLElement {
  static get observedAttributes(): string[] {
    return ['data-solution'];
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (name === 'data-solution' && oldValue !== newValue && newValue) {
      // Attribute is read directly by CSS selectors (:scope[data-solution="..."])
      // We can also dispatch custom events or update internal ARIA states here if needed.
    }
  }

  connectedCallback(): void {
    if (!this.hasAttribute('data-solution')) {
      this.setAttribute('data-solution', 'baseline');
    }
  }
}

if (!customElements.get('card-grid-demo')) {
  customElements.define('card-grid-demo', CardGridDemo);
}
