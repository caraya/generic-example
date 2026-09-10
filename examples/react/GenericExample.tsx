import React, { useEffect } from 'react';

interface Props {
  title?: string;
  initialWidth?: number;
  resize?: 'horizontal' | 'vertical' | 'both' | 'none';
  children: React.ReactNode;
}

export function GenericExample({
  title,
  initialWidth = 780,
  resize = 'horizontal',
  children,
}: Props) {
  useEffect(() => {
    import('./example-harness');
  }, []);

  return (
    // @ts-expect-error - Custom element tag
    <example-harness
      data-resize-mode={resize}
      data-initial-width={initialWidth}
    >
      <header className="harness-bar">
        {title && <span className="harness-title">{title}</span>}
        <output data-width-label>{initialWidth}px</output>
        <input type="range" defaultValue={initialWidth} data-slider-width />
        <button type="button" data-reset-btn>Reset</button>
      </header>

      <div className={`harness-viewport resize-${resize}`} data-viewport>
        <div className="harness-content">{children}</div>
      </div>
    </example-harness>
  );
}
