// About on the home page: the portrait in the name swaps the role line and the work list for
// the About.
//   Desktop with a mouse: shows while the pointer is on the portrait, hides 100ms after it leaves.
//   Touch, and any device without hover: a tap toggles it.
//   Keyboard: Enter / Space toggle it; Escape, Tab or moving focus away hide it. Focus alone
//   doesn't open it: the portrait is the page's first tab stop, and while the About shows the
//   work list is hidden, so Tab closes it first and lands on the first project.
// The Work / About switch over the list ([data-about-show]) does the same on every device:
// "About" opens it and it stays open until "Work", Escape or the portrait closes it; a pointer
// passing over the portrait doesn't. The same switch row stays put ([data-about-switch]) on every
// screen size, so keyboard focus stays on the pressed word. On mobile the About flows below it.
// If the About can't rise above the work list without reaching the statement (short screens),
// or on desktop the statement would reach the switch row or the About rise past the list's
// first line, .is-about-flow puts both in the flow instead and the page scrolls.

const hoverDesktop = window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)');
const desktop = window.matchMedia('(min-width: 1024px)');
const CLOSE_DELAY_MS = 100;
const MIN_CLEARANCE = 32; // px between the statement and the About before it falls back to the flow
const ROW_GAP = 16; // px between the switch row and the stage on desktop (the grid's row gap)

interface AboutElements {
  page: HTMLElement;
  toggle: HTMLButtonElement;
  statement: HTMLElement;
  about: HTMLElement;
}

// Layout top of an element, ignoring the 8px rise it may be mid-way through.
const layoutTop = (el: HTMLElement): number =>
  el.getBoundingClientRect().top - new DOMMatrixReadOnly(getComputedStyle(el).transform).m42;

// What opened it decides what closes it: 'pointer' (hovering the portrait) closes on leaving,
// 'tap' (the portrait) on the next tap, 'switch' ("About") only on "Work", Escape or the portrait.
type Source = 'pointer' | 'tap' | 'switch';

export function initAbout({ page, toggle, statement, about }: AboutElements): void {
  let open = false;
  let source: Source | null = null; // what opened it, which decides what closes it
  let lastPointer = '';
  let closeTimer: number | undefined;
  let mobileSwitchTop: number | null = null;

  const switches = Array.from(page.querySelectorAll<HTMLButtonElement>('[data-about-show]'));
  const row = page.querySelector<HTMLElement>('[data-about-switch]');

  // The About's top is the top of its tallest column (the bio, or the facts on desktop).
  const aboutTop = (): number =>
    Math.min(...Array.from(about.children, (child) => layoutTop(child as HTMLElement)));

  const fitLayout = (): void => {
    if (!open) return;
    if (!desktop.matches && row) {
      // The bio grows down from the original switch instead of bringing a higher row with it.
      // Keep its document position even when the taller content makes the page scroll.
      page.classList.add('is-about-flow');
      const currentOffset = parseFloat(page.style.getPropertyValue('--about-switch-offset')) || 0;
      const naturalTop = layoutTop(row) + window.scrollY - currentOffset;
      const offset = Math.max(0, (mobileSwitchTop ?? naturalTop) - naturalTop);
      page.style.setProperty('--about-switch-offset', offset + 'px');
      return;
    }
    page.style.removeProperty('--about-switch-offset');
    page.classList.remove('is-about-flow');
    const statementBottom = layoutTop(statement) + statement.offsetHeight;
    let fits = aboutTop() - statementBottom >= MIN_CLEARANCE;
    // Desktop: the switch row stays put, so the statement has to clear it too, and the About
    // can't rise past the list's top.
    if (fits && desktop.matches && row) {
      const rowBox = row.getBoundingClientRect();
      fits = rowBox.top - statementBottom >= MIN_CLEARANCE && aboutTop() >= rowBox.bottom + ROW_GAP;
    }
    page.classList.toggle('is-about-flow', !fits);
  };

  const set = (next: boolean, from: Source | null = null): void => {
    window.clearTimeout(closeTimer);
    if (next === open) {
      // A peek becomes a choice once tapped or switched; a choice never falls back to a peek.
      if (next && from && source === 'pointer') source = from;
      return;
    }
    mobileSwitchTop = next && !desktop.matches && row ? layoutTop(row) + window.scrollY : null;
    open = next;
    source = next ? from : null;
    toggle.setAttribute('aria-expanded', String(next));
    for (const button of switches) {
      button.setAttribute('aria-pressed', String((button.dataset.aboutShow === 'about') === next));
    }
    page.classList.toggle('is-about-open', next);
    if (next) fitLayout();
    else {
      page.classList.remove('is-about-flow');
      page.style.removeProperty('--about-switch-offset');
    }
  };

  // The same buttons remain visible, so touch and keyboard focus never need another row.
  for (const button of switches) {
    button.addEventListener('click', () => {
      const next = button.dataset.aboutShow === 'about';
      set(next, next ? 'switch' : null);
    });
  }

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

  // Tab closes it before focus moves, so the (now visible) work list is next in line. An About
  // chosen from the switch stays: Tab moves on to the switch.
  toggle.addEventListener('keydown', (event) => {
    if (event.key === 'Tab' && open && source !== 'switch') set(false);
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
    frame = requestAnimationFrame(() => {
      fitLayout();
      // Recheck after responsive type has settled into its new line heights.
      if (!desktop.matches) frame = requestAnimationFrame(fitLayout);
    });
  });
}
