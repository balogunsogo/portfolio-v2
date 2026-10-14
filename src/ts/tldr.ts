// Case-study reading mode: the full story, or TL;DR (the hero, the pictures and videos,
// Stack and Outcome; the rules are under "TL;DR" in _case.scss).
//
// A page that has the switch also has a one-line script in its head. Before the first
// paint it sets html.has-tldr (the browser supports :has(), so the switch is shown) and
// html.is-tldr when the saved choice is TL;DR, so a page never flashes the other mode.
// This module keeps the buttons, the saved choice and the reader's place in step.

// Shared with the head script.
const STORAGE_KEY = 'tldr';
const SAVED = '1';
const CAPABLE_CLASS = 'has-tldr';
const STATE_CLASS = 'is-tldr';

// The cross-fade between the modes is left out when reduced motion is asked for.
const motionOK = window.matchMedia('(prefers-reduced-motion: no-preference)');

interface ReadingModeOptions {
  /** [data-reading]: the group holding the two [data-reading-option] buttons. */
  group: HTMLElement;
  /** [data-reading-status]: a visually hidden live region. */
  status: HTMLElement | null;
  /** Runs after the page has been moved, so the top bar doesn't take it for a scroll. */
  onJump?: () => void;
}

const root = document.documentElement;

const isRendered = (element: Element): boolean => element.getClientRects().length > 0;

function readSaved(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === SAVED;
  } catch {
    return false;
  }
}

function save(tldr: boolean): void {
  try {
    if (tldr) localStorage.setItem(STORAGE_KEY, SAVED);
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage is blocked: the choice holds on this page only.
  }
}

// Changes the mode and keeps the reader's place. The block under the reading line (a
// quarter of the way down the screen), or the first one after it that is still shown
// afterwards, stays where it was, or moves up into the top third if it was further down.
// Every block a section is made of. A wrapper laid out with display: contents (the split,
// scroll and architecture layouts below 1024px) has no box of its own, so its children
// stand in for it.
function collectBlocks(main: HTMLElement): Element[] {
  const blocks: Element[] = [];
  const add = (element: Element): void => {
    if (getComputedStyle(element).display === 'contents') {
      for (const child of Array.from(element.children)) add(child);
    } else {
      blocks.push(element);
    }
  };
  for (const element of Array.from(main.querySelectorAll(':scope > section > *'))) add(element);
  return blocks;
}

function switchMode(main: HTMLElement, tldr: boolean): void {
  const blocks = collectBlocks(main);
  const before = blocks.map((block) => (isRendered(block) ? block.getBoundingClientRect() : null));
  const line = window.innerHeight / 4;

  root.classList.toggle(STATE_CLASS, tldr);

  for (let i = 0; i < blocks.length; i += 1) {
    const was = before[i];
    const block = blocks[i];
    if (!was || was.bottom <= line || !block || !isRendered(block)) continue;

    const target = Math.min(was.top, window.innerHeight / 3);
    const now = block.getBoundingClientRect().top;
    window.scrollTo({ top: window.scrollY + now - target, behavior: 'instant' });
    return;
  }
}

export function initReadingMode({ group, status, onJump }: ReadingModeOptions): void {
  const main = document.querySelector<HTMLElement>('main');
  if (!main || !root.classList.contains(CAPABLE_CLASS)) return;

  const options = Array.from(group.querySelectorAll<HTMLButtonElement>('[data-reading-option]'));
  let tldr = root.classList.contains(STATE_CLASS);

  const sync = (): void => {
    for (const option of options) {
      option.setAttribute('aria-pressed', String((option.dataset.readingOption === 'tldr') === tldr));
    }
  };

  const apply = (next: boolean, animate: boolean): void => {
    if (next === tldr) return;
    tldr = next;
    sync();
    save(tldr);

    const update = (): void => {
      switchMode(main, tldr);
      onJump?.();
    };

    if (animate && motionOK.matches && typeof document.startViewTransition === 'function') {
      // A newer switch can skip the previous snapshot. Its update still runs, but the
      // ready promise rejects with AbortError; that cancellation isn't a page error.
      const transition = document.startViewTransition(update);
      void transition.ready.catch((error: unknown) => {
        if (!(error instanceof DOMException) || error.name !== 'AbortError') throw error;
      });
    } else {
      update();
    }
  };

  for (const option of options) {
    option.addEventListener('click', () => {
      const next = option.dataset.readingOption === 'tldr';
      if (next === tldr) return;
      apply(next, true);
      if (status) status.textContent = tldr ? 'TL;DR: the pictures, the videos, the stack and the outcome.' : 'The full story.';
    });
  }

  // Back and forward restore a page as it was left; bring it in line with a choice made
  // on another case study since.
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) apply(readSaved(), false);
  });

  sync();
}
