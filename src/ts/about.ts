// The portrait and Work / About switch select the visible content. CSS reserves the
// intro and navigation tracks, and lets the content row grow with a longer bio.
// Hover peeks; touch and keyboard toggle; a switch-opened About stays until closed.

const hoverDesktop = window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)');
const CLOSE_DELAY_MS = 100;

interface AboutElements {
  page: HTMLElement;
  toggle: HTMLButtonElement;
  statement: HTMLElement;
  about: HTMLElement;
}

// What opened it decides what closes it: 'pointer' (hovering the portrait) closes on leaving,
// 'tap' (the portrait) on the next tap, 'switch' ("About") only on "Work", Escape or the portrait.
type Source = 'pointer' | 'tap' | 'switch';

export function initAbout({ page, toggle }: AboutElements): void {
  let open = false;
  let source: Source | null = null; // what opened it, which decides what closes it
  let lastPointer = '';
  let closeTimer: number | undefined;

  const switches = Array.from(page.querySelectorAll<HTMLButtonElement>('[data-about-show]'));
  const set = (next: boolean, from: Source | null = null): void => {
    window.clearTimeout(closeTimer);
    if (next === open) {
      // A peek becomes a choice once tapped or switched; a choice never falls back to a peek.
      if (next && from && source === 'pointer') source = from;
      return;
    }
    open = next;
    source = next ? from : null;
    toggle.setAttribute('aria-expanded', String(next));
    for (const button of switches) {
      button.setAttribute('aria-pressed', String((button.dataset.aboutShow === 'about') === next));
    }
    page.classList.toggle('is-about-open', next);
  };

  // A deep link uses the same open path as the switch, without moving focus or scrolling.
  if (location.hash === '#about') {
    set(true, 'switch');
    history.replaceState(history.state, '', location.pathname + location.search);
  }

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
}
