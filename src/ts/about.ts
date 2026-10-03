// About on the home page: the portrait in the name swaps the role line and the work list for
// the About.
//   Desktop with a mouse: shows while the pointer is on the portrait, hides 100ms after it leaves.
//   Touch, and any device without hover: a tap toggles it.
//   Keyboard: Enter / Space toggle it; Escape, Tab or moving focus away hide it. Focus alone
//   doesn't open it: the portrait is the page's first tab stop, and while the About shows the
//   work list is hidden, so Tab closes it first and lands on the first project.
// If the About can't rise above the work list without reaching the statement (short screens),
// .is-about-flow puts both in the flow instead and the page scrolls.

const hoverDesktop = window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)');
const CLOSE_DELAY_MS = 100;
const MIN_CLEARANCE = 32; // px between the statement and the About before it falls back to the flow

interface AboutElements {
  page: HTMLElement;
  toggle: HTMLButtonElement;
  statement: HTMLElement;
  about: HTMLElement;
}

// Layout top of an element, ignoring the 8px rise it may be mid-way through.
const layoutTop = (el: HTMLElement): number =>
  el.getBoundingClientRect().top - new DOMMatrixReadOnly(getComputedStyle(el).transform).m42;

type Source = 'pointer' | 'tap';

export function initAbout({ page, toggle, statement, about }: AboutElements): void {
  let open = false;
  let source: Source | null = null; // what opened it, which decides what closes it
  let lastPointer = '';
  let closeTimer: number | undefined;

  // The About's top is the top of its tallest column (the bio, or the facts on desktop).
  const aboutTop = (): number =>
    Math.min(...Array.from(about.children, (child) => layoutTop(child as HTMLElement)));

  const fitLayout = (): void => {
    if (!open) return;
    page.classList.remove('is-about-flow');
    const statementBottom = layoutTop(statement) + statement.offsetHeight;
    page.classList.toggle('is-about-flow', aboutTop() - statementBottom < MIN_CLEARANCE);
  };

  const set = (next: boolean, from: Source | null = null): void => {
    window.clearTimeout(closeTimer);
    if (next === open) {
      if (next && from) source = from;
      return;
    }
    open = next;
    source = next ? from : null;
    toggle.setAttribute('aria-expanded', String(next));
    page.classList.toggle('is-about-open', next);
    if (next) fitLayout();
    else page.classList.remove('is-about-flow');
  };

  toggle.addEventListener('pointerdown', (event) => {
    lastPointer = event.pointerType;
  });

  toggle.addEventListener('pointerenter', (event) => {
    if (hoverDesktop.matches && event.pointerType === 'mouse') set(true, 'pointer');
  });

  toggle.addEventListener('pointerleave', (event) => {
    if (event.pointerType !== 'mouse' || source !== 'pointer') return;
    window.clearTimeout(closeTimer);
    closeTimer = window.setTimeout(() => set(false), CLOSE_DELAY_MS);
  });

  // On desktop, focus leaving closes a keyboard-opened About. On touch it waits for the next tap.
  toggle.addEventListener('blur', () => {
    if (source === 'tap' && hoverDesktop.matches) set(false);
  });

  // Tab closes it before focus moves, so the (now visible) work list is next in line.
  toggle.addEventListener('keydown', (event) => {
    if (event.key === 'Tab' && open) set(false);
  });

  // A mouse click on desktop changes nothing (hover already showed it). Taps, pen, and
  // Enter / Space (clicks with detail 0) toggle.
  toggle.addEventListener('click', (event) => {
    if (hoverDesktop.matches && event.detail > 0 && lastPointer === 'mouse') return;
    set(!open, 'tap');
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && open) set(false);
  });

  // Switching between the hover and tap layouts (resize, rotation) starts closed.
  hoverDesktop.addEventListener('change', () => set(false));

  let frame = 0;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(fitLayout);
  });
}
