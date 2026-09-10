import './example-harness.css';

export class ExampleHarness extends HTMLElement {
  private widthSlider: HTMLInputElement | null = null;
  private heightSlider: HTMLInputElement | null = null;
  private viewport: HTMLElement | null = null;
  private widthLabel: HTMLOutputElement | null = null;
  private heightLabel: HTMLOutputElement | null = null;
  private solutionSelect: HTMLSelectElement | null = null;
  private resetBtn: HTMLButtonElement | null = null;
  private observer: ResizeObserver | null = null;

  private initialWidth: string = '780';
  private initialHeight: string = '360';
  private resizeMode: string = 'horizontal';

  connectedCallback(): void {
    this.resizeMode = this.getAttribute('data-resize-mode') ?? 'horizontal';
    this.initialWidth = this.getAttribute('data-initial-width') ?? '780';
    this.initialHeight = this.getAttribute('data-initial-height') ?? '360';

    this.widthSlider = this.querySelector<HTMLInputElement>('[data-slider-width]');
    this.heightSlider = this.querySelector<HTMLInputElement>('[data-slider-height]');
    this.viewport = this.querySelector<HTMLElement>('[data-viewport]');
    this.widthLabel = this.querySelector<HTMLOutputElement>('[data-width-label]');
    this.heightLabel = this.querySelector<HTMLOutputElement>('[data-height-label]');
    this.solutionSelect = this.querySelector<HTMLSelectElement>('[data-solution-select]');
    this.resetBtn = this.querySelector<HTMLButtonElement>('[data-reset-btn]');

    this.setupObservers();
    this.bindListeners();
  }

  disconnectedCallback(): void {
    this.observer?.disconnect();
    this.widthSlider?.removeEventListener('input', this.handleWidthSlider);
    this.heightSlider?.removeEventListener('input', this.handleHeightSlider);
    this.solutionSelect?.removeEventListener('change', this.handleSolutionChange);
    this.resetBtn?.removeEventListener('click', this.handleReset);
  }

  private setupObservers(): void {
    if (!this.viewport) return;

    // Two-way sync: Observe native drag resize changes
    this.observer = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      for (const entry of entries) {
        const width = Math.round(
          entry.borderBoxSize?.[0]?.inlineSize ?? entry.contentRect.width
        );
        const height = Math.round(
          entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height
        );

        if (this.widthSlider && this.widthSlider.value !== String(width)) {
          this.widthSlider.value = String(width);
        }
        if (this.widthLabel) {
          this.widthLabel.textContent = `${width}px`;
        }

        if (this.heightSlider && this.heightSlider.value !== String(height)) {
          this.heightSlider.value = String(height);
        }
        if (this.heightLabel) {
          this.heightLabel.textContent = `${height}px`;
        }
      }
    });

    this.observer.observe(this.viewport);
  }

  private bindListeners(): void {
    this.widthSlider?.addEventListener('input', this.handleWidthSlider);
    this.heightSlider?.addEventListener('input', this.handleHeightSlider);
    this.solutionSelect?.addEventListener('change', this.handleSolutionChange);
    this.resetBtn?.addEventListener('click', this.handleReset);
  }

  private handleWidthSlider = (e: Event): void => {
    const val = (e.target as HTMLInputElement).value;
    this.applyDimension('width', `${val}px`, this.widthLabel);
  };

  private handleHeightSlider = (e: Event): void => {
    const val = (e.target as HTMLInputElement).value;
    this.applyDimension('height', `${val}px`, this.heightLabel);
  };

  private handleReset = (): void => {
    if (this.resizeMode === 'horizontal' || this.resizeMode === 'both') {
      this.applyDimension('width', `${this.initialWidth}px`, this.widthLabel);
      if (this.widthSlider) this.widthSlider.value = this.initialWidth;
    }
    if (this.resizeMode === 'vertical' || this.resizeMode === 'both') {
      this.applyDimension('height', `${this.initialHeight}px`, this.heightLabel);
      if (this.heightSlider) this.heightSlider.value = this.initialHeight;
    }
  };

  private applyDimension(prop: 'width' | 'height', val: string, label: HTMLOutputElement | null): void {
    if (this.viewport) {
      this.viewport.style[prop] = val;
    }
    if (label) {
      label.textContent = val;
    }
  }

  private handleSolutionChange = (e: Event): void => {
    const solution = (e.target as HTMLSelectElement).value;
    this.setAttribute('data-solution', solution);

    // Notify the slotted child element of the active solution
    const childCustomElement = this.viewport?.querySelector(':first-child');
    if (childCustomElement) {
      childCustomElement.setAttribute('data-solution', solution);
    }
  };
}

if (!customElements.get('example-harness')) {
  customElements.define('example-harness', ExampleHarness);
}
