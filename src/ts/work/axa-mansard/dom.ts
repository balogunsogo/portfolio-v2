// Page-local DOM helpers. Values always become text nodes or input properties.
export function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls = '', text?: string): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  node.className = cls;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function hook<T extends HTMLElement = HTMLElement>(root: HTMLElement, name: string): T {
  const node = root.querySelector<T>(`[data-axa-${name}]`);
  if (!node) throw new Error(`Missing AXA demo hook: ${name}`);
  return node;
}

export function button(text: string, run: () => void, key: string, cls = 'axa-btn'): HTMLButtonElement {
  const node = el('button', cls, text);
  node.type = 'button';
  node.dataset.axaKey = key;
  node.addEventListener('click', run);
  return node;
}

export type ValueChange = { target: { value: string } };

export function input(value: string, invalid: string, change: (e: ValueChange) => void, key: string, cls = ''): HTMLInputElement {
  const node = el('input', `axa-input${cls}`);
  node.type = 'text';
  node.value = value;
  node.autocomplete = 'off';
  node.setAttribute('aria-invalid', invalid);
  node.dataset.axaKey = key;
  node.addEventListener('input', () => change({ target: node }));
  return node;
}

// Retain the active control and caret when a dynamic row is updated. Static Reset,
// product and edge-case buttons stay in place, so their focus never needs moving.
export function update(root: HTMLElement, render: () => void): void {
  const active = document.activeElement;
  const key = active instanceof HTMLElement && root.contains(active) ? active.dataset.axaKey : undefined;
  const selection = active instanceof HTMLInputElement && active.type === 'text'
    ? [active.selectionStart, active.selectionEnd] as const : null;
  render();
  if (!key || (active && root.contains(active))) return;
  const next = Array.from(root.querySelectorAll<HTMLElement>('[data-axa-key]')).find(node => node.dataset.axaKey === key);
  next?.focus({ preventScroll: true });
  if (next instanceof HTMLInputElement && selection) next.setSelectionRange(...selection);
}

export function status(node: HTMLElement, text: string, cls: string): void {
  node.className = `axa-status${cls}`;
  if (node.textContent !== text) node.textContent = text;
}

export class DemoState<S extends object> {
  constructor(public state: S, private readonly onChange: () => void) {}

  setState(patch: Partial<S>, done?: () => void): void {
    Object.assign(this.state, patch);
    this.onChange();
    done?.();
  }
}
