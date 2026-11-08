import { accept, apply, changeURL, choices, createState, dismiss, edit, labels, salary, start, validate } from './extraction.js';
import type { ExtractionState, Field, Result, SelectField } from './extraction.js';

const check = '<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>';
const closeIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m18 6-12 12M6 6l12 12"/></svg>';
const alertIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/></svg>';
export const savedMessage = 'This is where JobTrackr would save the application. Nothing is saved here.';

// One independent replica. DOM updates preserve input nodes, selection and focus.
export class Drawer {
  state: ExtractionState;
  onExtract: () => void = () => {};
  onReset: () => void = () => {};
  onSave: () => void = () => {};
  onEdit: () => void = () => {};
  onStart: () => void = () => {};
  private timers = new Set<number>();
  private selects: DrawerSelect[] = [];
  private buttonLabel = 'Extract details';
  readonly extract: HTMLButtonElement;
  private fields: (HTMLInputElement | HTMLTextAreaElement)[];

  constructor(readonly root: HTMLElement, url = '') {
    this.state = createState(url);
    this.buttonLabel = 'Extract details';
    this.extract = this.get<HTMLButtonElement>('[data-extract]');
    this.fields = [...root.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[data-field]')];
    for (const field of this.fields) {
      field.addEventListener('input', () => {
        edit(this.state, field.dataset.field as Field, field.value);
        this.onEdit();
      });
    }
    for (const trigger of root.querySelectorAll<HTMLButtonElement>('[data-select]')) {
      this.selects.push(new DrawerSelect(this, trigger));
    }
    this.extract.addEventListener('click', () => { if (!this.state.busy) this.onExtract(); });
    this.get('[data-more]').addEventListener('click', () => {
      this.state.details = !this.state.details;
      this.render();
    });
    for (const button of root.querySelectorAll<HTMLButtonElement>('[data-cancel]')) {
      button.addEventListener('click', () => { this.onReset(); this.extract.focus(); });
    }
    this.get('[data-drawer-form]').addEventListener('submit', event => {
      event.preventDefault();
      this.cancel();
      const valid = validate(this.state);
      this.render();
      if (valid) this.onSave();
      else this.focus(this.state.errors.role ? 'role' : 'company');
    });
    for (const control of root.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLButtonElement>('[data-demo-control]')) control.disabled = false;
    this.render();
  }
  get<T extends HTMLElement = HTMLElement>(selector: string): T { return this.root.querySelector<T>(selector)!; }
  focus(field: Field): void {
    this.root.querySelector<HTMLElement>(`[data-field="${field}"], [data-select="${field}"]`)!.focus();
  }
  later(callback: () => void, delay: number): void {
    const timer = window.setTimeout(() => { this.timers.delete(timer); callback(); }, delay);
    this.timers.add(timer);
  }
  cancel(): void {
    for (const timer of this.timers) window.clearTimeout(timer);
    this.timers.clear();
    this.state.generation++;
    if (this.state.busy) this.state.message = 'Paste a public job URL to fill available details automatically.';
    this.state.busy = false;
    for (const select of this.selects) select.close(false);
  }
  reset(url = ''): void {
    this.cancel();
    this.state = createState(url);
    this.get('[data-drawer-body]').scrollTop = 0;
    this.render();
  }
  setURL(url: string): void { changeURL(this.state, url); this.render(); }
  setEdit(field: Field, value: string): void { edit(this.state, field, value); this.render(); this.onEdit(); }
  run(result: Result, delay: number, done?: () => void, stale?: () => void): void {
    if (!this.state.values.url) {
      this.state.message = 'Enter a valid public job URL first.';
      this.render();
      return;
    }
    const generation = start(this.state);
    const url = this.state.values.url;
    this.onStart();
    this.render();
    this.later(() => {
      if (generation !== this.state.generation || url !== this.state.values.url) { stale?.(); return; }
      apply(this.state, result);
      this.render();
      done?.();
    }, delay);
  }
  render(): void {
    const state = this.state;
    for (const field of this.fields) {
      const value = state.values[field.dataset.field as Field];
      if (field.value !== value) field.value = value;
    }
    for (const select of this.selects) select.render();
    const more = this.get('[data-more]');
    more.textContent = state.details ? '− Fewer details' : '+ More details';
    more.setAttribute('aria-expanded', String(state.details));
    this.get('[data-details]').hidden = !state.details;
    this.get('[data-date-field]').hidden = state.values.status === 'Saved';
    this.get('[data-saved-status]').hidden = state.values.status !== 'Saved';
    for (const key of ['role', 'company'] as const) {
      const error = this.get(`[data-error="${key}"]`);
      error.hidden = !state.errors[key];
      error.innerHTML = state.errors[key] ? alertIcon : '';
      if (state.errors[key]) error.append(document.createTextNode(state.errors[key]!));
      this.get(`[data-field="${key}"]`).setAttribute('aria-invalid', String(!!state.errors[key]));
      this.get(`[data-control="${key}"]`).classList.toggle('is-invalid', !!state.errors[key]);
    }
    if (!state.busy) this.buttonLabel = state.result ? 'Retry extraction' : 'Extract details';
    this.extract.textContent = this.buttonLabel;
    this.extract.classList.toggle('is-busy', state.busy);
    this.extract.setAttribute('aria-busy', String(state.busy));
    this.extract.setAttribute('aria-disabled', String(state.busy));
    if (state.busy) {
      const spinner = document.createElement('span'); spinner.className = 'jspin'; spinner.setAttribute('aria-hidden', 'true');
      this.extract.prepend(spinner);
    }
    this.get('[data-extraction-status]').textContent = state.message;
    const warnings = this.get('[data-warnings]');
    warnings.replaceChildren();
    warnings.hidden = !state.result?.warnings?.length;
    for (const warning of state.result?.warnings ?? []) { const li = document.createElement('li'); li.textContent = warning; warnings.append(li); }
    const hint = this.get('[data-salary-hint]');
    hint.hidden = !salary.some(key => state.suggestions.has(key));
    const suggestions = this.get('[data-suggestions]');
    suggestions.replaceChildren();
    suggestions.hidden = state.suggestions.size === 0;
    for (const [key, value] of state.suggestions) {
      const row = document.createElement('div'); row.className = 'jsug'; row.dataset.suggestion = key;
      const text = document.createElement('p'), label = document.createElement('strong');
      label.textContent = `${labels[key]} suggestion:`;
      text.append(label, document.createTextNode(' ' + (value.length > 300 ? value.slice(0, 300) + '…' : value)));
      const actions = document.createElement('div');
      const use = document.createElement('button'); use.type = 'button'; use.className = 'jbtn'; use.dataset.accept = key;
      use.textContent = salary.includes(key) ? 'Use suggestions for salary' : 'Use suggestion';
      use.setAttribute('aria-label', `Accept ${labels[key]} suggestion`);
      if (salary.includes(key)) use.setAttribute('aria-describedby', hint.id);
      use.addEventListener('click', () => { const field = accept(state, key); this.render(); this.focus(field); this.onEdit(); });
      const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'jbtn'; remove.dataset.dismiss = key;
      remove.textContent = 'Dismiss'; remove.setAttribute('aria-label', `Dismiss ${labels[key]} suggestion`);
      remove.addEventListener('click', () => {
        const keys = [...state.suggestions.keys()]; const index = keys.indexOf(key);
        dismiss(state, key); this.render();
        const next = keys.slice(index + 1).find(field => state.suggestions.has(field)) ?? [...state.suggestions.keys()][0];
        (next ? this.get(`[data-accept="${next}"]`) : this.extract).focus();
      });
      actions.append(use, remove); row.append(text, actions); suggestions.append(row);
    }
  }
}

// JobTrackr's select-only combobox: a drawer-local listbox, or a contained phone sheet.
class DrawerSelect {
  private popup: HTMLElement | null = null;
  private list: HTMLElement | null = null;
  private options: HTMLElement[] = [];
  private active = 0;
  private prefix = '';
  private typedAt = 0;
  private mobile = false;
  private readonly key: SelectField;
  private readonly values: readonly string[];
  private readonly outside = (event: PointerEvent): void => {
    if (!this.popup?.contains(event.target as Node) && !this.trigger.contains(event.target as Node)) this.close(false);
  };
  private readonly reposition = (): void => {
    if (!this.popup) return;
    if (this.mobile !== window.matchMedia('(max-width: 1023px)').matches) { this.close(true); return; }
    if (this.mobile) return;
    const field = this.trigger.parentElement!.getBoundingClientRect();
    const drawer = this.drawer.root.getBoundingClientRect();
    const height = Math.min(296, this.values.length * 33 + 13);
    this.popup.style.left = `${field.left - drawer.left}px`;
    this.popup.style.width = `${field.width}px`;
    this.popup.style.right = 'auto';
    this.popup.style.top = `${field.bottom + 4 + height > drawer.bottom - 8 ? Math.max(8, field.top - drawer.top - height - 4) : field.bottom - drawer.top + 4}px`;
  };
  constructor(private drawer: Drawer, private trigger: HTMLButtonElement) {
    this.key = trigger.dataset.select as SelectField;
    this.values = choices[this.key];
    trigger.addEventListener('click', () => this.popup ? this.close(true) : this.open());
    trigger.parentElement!.addEventListener('click', event => { if (!trigger.contains(event.target as Node)) trigger.click(); });
    trigger.addEventListener('keydown', event => this.keydown(event));
  }
  render(): void {
    this.trigger.querySelector<HTMLElement>('[data-select-value]')!.textContent = this.drawer.state.values[this.key] || this.values[0];
  }
  close(focus: boolean): void {
    this.prefix = '';
    this.typedAt = 0;
    if (!this.popup) return;
    this.popup.remove(); this.popup = null; this.list = null; this.options = [];
    this.trigger.setAttribute('aria-expanded', 'false');
    this.trigger.removeAttribute('aria-activedescendant');
    document.removeEventListener('pointerdown', this.outside, true);
    window.removeEventListener('resize', this.reposition);
    this.drawer.root.removeEventListener('scroll', this.reposition, true);
    if (focus) this.trigger.focus();
  }
  private choose(): void {
    const label = this.values[this.active];
    const value = ['source', 'workMode', 'employment'].includes(this.key) && this.active === 0 ? '' : label;
    if (value !== this.drawer.state.values[this.key]) edit(this.drawer.state, this.key, value);
    this.close(true); this.drawer.render(); this.drawer.onEdit();
  }
  private setActive(index: number): void {
    this.active = Math.max(0, Math.min(index, this.values.length - 1));
    this.options.forEach((option, i) => option.classList.toggle('is-active', i === this.active));
    if (this.mobile) this.options[this.active].focus();
    else this.trigger.setAttribute('aria-activedescendant', this.options[this.active].id);
    this.options[this.active].scrollIntoView({block: 'nearest'});
  }
  private open(index?: number): void {
    if (this.popup) return;
    this.mobile = window.matchMedia('(max-width: 1023px)').matches;
    this.active = index ?? Math.max(0, this.values.indexOf(this.drawer.state.values[this.key] || this.values[0]));
    const popup = document.createElement('div'); popup.className = this.mobile ? 'jss' : 'jlist'; popup.dataset.selectPopup = '';
    const list = document.createElement('div'); list.id = this.trigger.getAttribute('aria-controls')!; list.setAttribute('role', 'listbox');
    const label = document.getElementById(this.trigger.getAttribute('aria-labelledby')!)!.textContent!;
    list.setAttribute('aria-label', label);
    if (this.mobile) {
      const scrim = document.createElement('div'); scrim.className = 'jss__scrim'; scrim.addEventListener('click', () => this.close(true));
      const sheet = document.createElement('div'); sheet.className = 'jss__sheet'; sheet.setAttribute('role', 'dialog'); sheet.setAttribute('aria-modal', 'true'); sheet.setAttribute('aria-labelledby', `${list.id}-heading`);
      const grab = document.createElement('div'); grab.className = 'jt__grab'; grab.setAttribute('aria-hidden', 'true');
      const head = document.createElement('div'); head.className = 'jss__head';
      const title = document.createElement('h4'); title.id = `${list.id}-heading`; title.className = 'jss__title'; title.textContent = label;
      const close = document.createElement('button'); close.type = 'button'; close.className = 'jss__close'; close.setAttribute('aria-label', 'Close'); close.innerHTML = closeIcon; close.addEventListener('click', () => this.close(true));
      head.append(title, close);
      const body = document.createElement('div'); body.className = 'jss__body'; list.className = 'jss__list'; body.append(list);
      sheet.append(grab, head, body); popup.append(scrim, sheet);
      popup.addEventListener('keydown', event => this.keydown(event));
    } else {
      // The popup itself is the desktop listbox, outside the scrolling body.
      popup.id = list.id; popup.setAttribute('role', 'listbox'); popup.setAttribute('aria-label', label);
    }
    this.popup = popup; this.list = this.mobile ? list : popup;
    this.options = this.values.map((value, i) => {
      const option = document.createElement(this.mobile ? 'button' : 'div'); option.className = this.mobile ? 'jss__row' : 'jopt';
      if (option instanceof HTMLButtonElement) option.type = 'button';
      option.id = `${list.id}-${i}`; option.setAttribute('role', 'option');
      const selected = value === (this.drawer.state.values[this.key] || this.values[0]); option.setAttribute('aria-selected', String(selected));
      const text = document.createElement('span'); text.className = 'jopt__label'; text.textContent = value; option.append(text);
      if (selected) option.insertAdjacentHTML('beforeend', check);
      option.addEventListener('mousedown', event => event.preventDefault());
      option.addEventListener('pointermove', () => this.setActive(i));
      option.addEventListener('click', () => { this.active = i; this.choose(); });
      this.list!.append(option); return option;
    });
    this.drawer.root.append(popup);
    this.trigger.setAttribute('aria-expanded', 'true');
    this.reposition(); this.setActive(this.active);
    document.addEventListener('pointerdown', this.outside, true);
    window.addEventListener('resize', this.reposition);
    this.drawer.root.addEventListener('scroll', this.reposition, true);
  }
  private keydown(event: KeyboardEvent): void {
    const key = event.key;
    if (key === 'Escape' && this.popup) { event.preventDefault(); event.stopPropagation(); this.close(true); return; }
    if (key === 'Tab' && this.popup) { this.choose(); return; }
    if (this.popup && (key === 'Enter' || key === ' ' || (event.altKey && key === 'ArrowUp'))) {
      event.preventDefault(); this.choose(); return;
    }
    if (['ArrowDown', 'ArrowUp', 'Home', 'End', 'PageDown', 'PageUp', 'Enter', ' '].includes(key)) {
      event.preventDefault();
      if (!this.popup) this.open(key === 'Home' ? 0 : key === 'End' ? this.values.length - 1 : undefined);
      else this.setActive(key === 'Home' ? 0 : key === 'End' ? this.values.length - 1 : this.active + (key === 'ArrowDown' ? 1 : key === 'ArrowUp' ? -1 : key === 'PageDown' ? 10 : -10));
      return;
    }
    if (key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      const now = performance.now();
      this.prefix = (now - this.typedAt < 500 ? this.prefix : '') + key.toLowerCase(); this.typedAt = now;
      const match = this.values.findIndex(value => value.toLowerCase().startsWith(this.prefix));
      if (!this.popup) this.open(match < 0 ? undefined : match);
      else if (match >= 0) this.setActive(match);
    }
  }
}

// Radios intentionally have no names, so the demo never serializes reader input.
// Keep native radio semantics and implement their group/arrow behavior locally.
export function initOptions(root: HTMLElement, changed: (index: number) => void): HTMLInputElement[] {
  const radios = [...root.querySelectorAll<HTMLInputElement>('[data-option]')];
  const choose = (index: number): void => {
    radios.forEach((radio, i) => { radio.checked = i === index; radio.tabIndex = i === index ? 0 : -1; });
    changed(index);
  };
  radios.forEach((radio, index) => {
    radio.disabled = false;
    radio.tabIndex = radio.checked ? 0 : -1;
    radio.addEventListener('change', () => choose(index));
    radio.addEventListener('keydown', event => {
      if (!['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'].includes(event.key)) return;
      event.preventDefault();
      const next = (index + (['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : radios.length - 1)) % radios.length;
      radios[next].focus(); choose(next);
    });
  });
  return radios;
}
