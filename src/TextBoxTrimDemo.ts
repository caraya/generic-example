/**
 * Scoped styles for the text-box demo.
 * Uses @scope (text-box-demo) to ensure zero outward bleed, paired with an
 * inward reset on typography elements to shield from host blog overrides.
 */
const DEMO_STYLES = `
@scope (text-box-demo) {
  :scope {
    display: block;
    width: 100%;
    box-sizing: border-box;
    padding: 1.5rem;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: var(--text-color, #0f172a);
  }

  /* Inward reset: Neutralize host article typography and list margins */
  h1, h2, h3, p, div, span, label, article {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .demo-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    max-width: 680px;
    margin: 0 auto;
  }

  .settings {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .setting {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    font-size: 0.875rem;
  }

  .setting select {
    min-height: 44px;
    max-width: 100%;
    padding: 0.5rem;
    font: inherit;
  }

  /* Comparison card displaying text alignment against adjacent components */
  .comparison-row {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem;
    border: 1px solid var(--border-color, #e2e8f0);
    border-radius: 8px;
    background: var(--bg-card, #ffffff);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  /* Text inspection container showing half-leading boundaries */
  .sample-box {
    position: relative;
    flex: 1;
    min-width: 0;
    background: rgba(2, 132, 199, 0.05);
  }

  .sample-paragraph {
    font-family: Verdana, sans-serif;
    font-size: 1.125rem;
    line-height: 1.4;
    margin-block: 2em;
    color: #0f172a;
    overflow-wrap: anywhere;
    border-top: 2px solid #d0008f;
    border-bottom: 2px solid #d0008f;
  }

  .metric-label {
    font-size: 0.75rem;
    font-family: ui-monospace, monospace;
    color: #64748b;
    margin-top: 0.5rem;
    display: block;
    overflow-wrap: anywhere;
  }

  /* Solution 1: Untrimmed default line-box (Notice excess half-leading space) */
  :scope[data-solution="untrimmed"] .sample-paragraph {
    text-box-trim: none;
  }

  /* Solution 2: Trim to Cap Height & Alphabetic Baseline (Standard headline trimming) */
  :scope[data-solution="trim-cap"] .sample-paragraph {
    text-box-trim: trim-both;
    text-box-edge: cap alphabetic;
    /* Experimental / shorthand syntax support */
    text-box: trim-both cap alphabetic;
  }

  /* Solution 3: Trim to x-height (ex) & Alphabetic Baseline */
  :scope[data-solution="trim-ex"] .sample-paragraph {
    text-box-trim: trim-both;
    text-box-edge: ex alphabetic;
    text-box: trim-both ex alphabetic;
  }

  /* Solution 4: Trim Start only (Top edge aligned, bottom preserves leading) */
  :scope[data-solution="trim-start"] .sample-paragraph {
    text-box-trim: trim-start;
    text-box-edge: cap alphabetic;
  }

  /* Fallback notice for browsers without CSS Text Box Trim support */
  .support-notice {
    font-size: 0.8rem;
    padding: 0.5rem 0.75rem;
    border-radius: 4px;
    background: #fef3c7;
    color: #92400e;
    border: 1px solid #fde68a;
  }

  @supports (text-box-trim: trim-both) {
    .support-notice {
      display: none;
    }
  }
}
`;

export class TextBoxDemo extends HTMLElement {
  static get observedAttributes(): string[] {
    return ['data-solution'];
  }

  /**
   * Responds to data-solution attribute updates propagated by <example-harness>.
   */
  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (name === 'data-solution' && oldValue !== newValue && newValue) {
      this.updateActiveSolution(newValue);
    }
  }

  connectedCallback(): void {
    this.injectStyles();

    if (!this.hasAttribute('data-solution')) {
      this.setAttribute('data-solution', 'untrimmed');
    }

    this.render();
    this.updateActiveSolution(this.getAttribute('data-solution') ?? 'untrimmed');
    this.addEventListener('change', this.handleSettingsChange);
  }

  disconnectedCallback(): void {
    this.removeEventListener('change', this.handleSettingsChange);
  }

  /**
   * Injects scoped styles once per document into <head>.
   */
  private injectStyles(): void {
    const styleId = 'text-box-demo-injected-styles';
    if (!document.getElementById(styleId)) {
      const styleEl = document.createElement('style');
      styleEl.id = styleId;
      styleEl.textContent = DEMO_STYLES;
      document.head.appendChild(styleEl);
    }
  }

  private render(): void {
    this.innerHTML = `
      <div class="demo-container">
        <div class="support-notice">
          ⚠️ Your browser doesn't yet support <code>text-box-trim</code> natively. Inspect styles in Chromium 133+ or Safari Technology Preview to see hardware-rendered trimming.
        </div>

        <div class="settings">
          <label class="setting">
            <span>Text box trim</span>
            <select data-trim>
              <option value="none">none</option>
              <option value="trim-start">trim-start</option>
              <option value="trim-end">trim-end</option>
              <option value="trim-both">trim-both</option>
            </select>
          </label>
          <label class="setting">
            <span>Start edge</span>
            <select data-start-edge>
              <option value="auto">auto</option>
              <option value="text">text</option>
              <option value="cap">cap</option>
              <option value="ex">ex</option>
            </select>
          </label>
          <label class="setting">
            <span>End edge</span>
            <select data-end-edge>
              <option value="text">text</option>
              <option value="alphabetic">alphabetic</option>
            </select>
          </label>
          <label class="setting">
            <span>Font family</span>
            <select data-font-family>
              <option value="Verdana, sans-serif">Verdana</option>
              <option value="Helvetica, Arial, sans-serif">Helvetica</option>
              <option value="Courier, monospace">Courier</option>
              <option value="Arial, sans-serif">Arial</option>
              <option value="Georgia, serif">Georgia</option>
              <option value="Times New Roman, serif">Times New Roman</option>
              <option value="system-ui, sans-serif">System UI</option>
            </select>
          </label>
          <label class="setting">
            <span>Line height</span>
            <select data-line-height>
              <option value="1">1</option>
              <option value="1.1">1.1</option>
              <option value="1.2">1.2</option>
              <option value="1.4" selected>1.4</option>
              <option value="1.6">1.6</option>
              <option value="2">2</option>
            </select>
          </label>
        </div>

        <div class="comparison-row">
          <div class="sample-box">
            <p class="sample-paragraph">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            <p class="sample-paragraph">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          </div>
        </div>

        <output class="metric-label" data-metric-description aria-live="polite">
          Active Config: text-box-trim: none; text-box-edge: auto;
        </output>
      </div>
    `;
  }

  private updateActiveSolution(solutionId: string): void {
    const trim = this.querySelector<HTMLSelectElement>('[data-trim]');
    const startEdge = this.querySelector<HTMLSelectElement>('[data-start-edge]');
    const endEdge = this.querySelector<HTMLSelectElement>('[data-end-edge]');
    if (!trim || !startEdge || !endEdge) return;

    trim.value = solutionId === 'untrimmed' ? 'none'
      : solutionId === 'trim-start' ? 'trim-start' : 'trim-both';
    startEdge.value = solutionId === 'untrimmed' ? 'auto'
      : solutionId === 'trim-ex' ? 'ex' : 'cap';
    endEdge.value = 'alphabetic';
    this.updateSample();
  }

  private handleSettingsChange = (event: Event): void => {
    if (event.target instanceof HTMLSelectElement &&
        event.target.matches('[data-trim], [data-start-edge], [data-end-edge], [data-font-family], [data-line-height]')) {
      this.updateSample();
    }
  };

  private updateSample(): void {
    const trim = this.querySelector<HTMLSelectElement>('[data-trim]');
    const startEdge = this.querySelector<HTMLSelectElement>('[data-start-edge]');
    const endEdge = this.querySelector<HTMLSelectElement>('[data-end-edge]');
    const fontFamily = this.querySelector<HTMLSelectElement>('[data-font-family]');
    const lineHeight = this.querySelector<HTMLSelectElement>('[data-line-height]');
    const paragraphs = this.querySelectorAll<HTMLElement>('.sample-paragraph');
    const description = this.querySelector<HTMLOutputElement>('[data-metric-description]');
    if (!trim || !startEdge || !endEdge || !fontFamily || !lineHeight || paragraphs.length === 0 || !description) return;

    endEdge.disabled = startEdge.value === 'auto';
    const edge = startEdge.value === 'auto' ? 'auto' : `${startEdge.value} ${endEdge.value}`;
    paragraphs.forEach((paragraph) => {
      paragraph.style.setProperty('text-box-trim', trim.value);
      paragraph.style.setProperty('text-box-edge', edge);
      paragraph.style.setProperty('font-family', fontFamily.value);
      paragraph.style.setProperty('line-height', lineHeight.value);
    });
    description.textContent = `text-box-trim: ${trim.value}; text-box-edge: ${edge}; font-family: ${fontFamily.value}; line-height: ${lineHeight.value};`;
  }
}

if (!customElements.get('text-box-demo')) {
  customElements.define('text-box-demo', TextBoxDemo);
}