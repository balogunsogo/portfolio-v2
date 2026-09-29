// Small-screen project detail: a bottom sheet.
//
// Tapping a project below the desktop breakpoint opens a sheet with the project's
// title, type, image, description, a "Visit site" link and "Next" to move through
// the list without closing. It slides up over a light scrim, and closes with the
// Close button, a tap on the scrim, Escape, or a downward drag on its header.
//
// Focus follows the input: opened from the keyboard, focus goes to Close and
// returns to the project afterwards. Opened by touch, focus goes to the panel
// itself (no outline) and is released on close, so no focus ring is painted.
// Programmatic focus after a tap would otherwise match :focus-visible in
// WebKit/Chrome and draw rings on Close and then on the project link.

import type { Project } from './projects.js';

const mobileLayout = window.matchMedia('(max-width: 1023px)');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// Keep in sync with the sheet transition duration in _index.scss.
const TRANSITION_MS = 420;
// Drag distance (px) or release speed (px/ms) that dismisses the sheet.
const DISMISS_DISTANCE = 96;
const DISMISS_VELOCITY = 0.6;

interface SheetElements {
  list: HTMLElement;
  root: HTMLElement;
  scrim: HTMLElement;
  panel: HTMLElement;
  handle: HTMLElement;
  title: HTMLElement;
  meta: HTMLElement;
  image: HTMLImageElement;
  description: HTMLElement;
  link: HTMLAnchorElement;
  closeButton: HTMLButtonElement;
  nextButton: HTMLButtonElement;
  nextTitle: HTMLElement;
  projects: readonly Project[];
}

export function initProjectSheet(el: SheetElements): void {
  const { list, root, scrim, panel, handle, projects } = el;
  const swapTargets = Array.from(panel.querySelectorAll<HTMLElement>('[data-sheet-swap]'));

  let current = -1;
  let opener: HTMLElement | null = null;
  let closeTimer = 0;
  let previousOverflow = '';
  let keyboardMode = false;

  const duration = (): number => (reducedMotion.matches ? 0 : TRANSITION_MS);

  const fill = (index: number): void => {
    const project = projects[index];
    if (!project) return;
    current = index;
    el.title.textContent = project.title;
    el.meta.textContent = project.meta;
    el.image.src = project.image;
    el.image.alt = `${project.title} preview`;
    el.image.style.background = project.previewTone;
    el.description.textContent = project.description;
    el.link.href = project.href;
    el.link.target = project.external ? '_blank' : '_self';
    el.link.rel = project.external ? 'noopener' : '';
    el.nextTitle.textContent = projects[(index + 1) % projects.length]?.title ?? '';
  };

  const focusable = (): HTMLElement[] =>
    Array.from(panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'));

  const onKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close(true);
      return;
    }
    if (event.key !== 'Tab') return;
    const items = focusable();
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const open = (index: number, source: HTMLElement, fromKeyboard: boolean): void => {
    window.clearTimeout(closeTimer);
    opener = source;
    keyboardMode = fromKeyboard;
    fill(index);
    panel.scrollTop = 0;
    panel.style.transform = '';

    if (root.hidden) {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      root.hidden = false;
      // Let the browser paint the closed state first so the slide-up transitions.
      void root.offsetHeight;
    }
    root.classList.add('is-open');
    document.addEventListener('keydown', onKeydown);
    (keyboardMode ? el.closeButton : panel).focus({ preventScroll: true });
  };

  function close(fromKeyboard = false): void {
    if (root.hidden || !root.classList.contains('is-open')) return;
    root.classList.remove('is-open');
    panel.style.transform = '';
    document.removeEventListener('keydown', onKeydown);
    closeTimer = window.setTimeout(() => {
      root.hidden = true;
      document.body.style.overflow = previousOverflow;
      current = -1;
    }, duration());
    if (keyboardMode || fromKeyboard) {
      opener?.focus({ preventScroll: true });
    } else if (document.activeElement instanceof HTMLElement && panel.contains(document.activeElement)) {
      document.activeElement.blur();
    }
    opener = null;
  }

  // "Next" swaps the content in place with a short fade, without re-running the slide.
  const next = (): void => {
    if (current < 0) return;
    const target = (current + 1) % projects.length;
    const listLink = list.querySelector<HTMLElement>(`a[data-project-index="${target}"]`);
    if (listLink) opener = listLink;
    if (reducedMotion.matches) {
      fill(target);
      return;
    }
    swapTargets.forEach((node) => node.classList.add('is-swapping'));
    window.setTimeout(() => {
      fill(target);
      panel.scrollTop = 0;
      swapTargets.forEach((node) => node.classList.remove('is-swapping'));
    }, 140);
  };

  // Drag the header down to dismiss (touch and pen).
  let dragStart = 0;
  let dragLast = 0;
  let dragTime = 0;
  let dragging = false;

  handle.addEventListener('pointerdown', (event: PointerEvent) => {
    if (event.pointerType === 'mouse') return;
    if (event.target instanceof Element && event.target.closest('button, a')) return;
    dragging = true;
    dragStart = dragLast = event.clientY;
    dragTime = event.timeStamp;
    panel.classList.add('is-dragging');
    handle.setPointerCapture(event.pointerId);
  });

  handle.addEventListener('pointermove', (event: PointerEvent) => {
    if (!dragging) return;
    const offset = Math.max(0, event.clientY - dragStart);
    panel.style.transform = `translateY(${offset}px)`;
    dragLast = event.clientY;
    dragTime = event.timeStamp;
  });

  const endDrag = (event: PointerEvent): void => {
    if (!dragging) return;
    dragging = false;
    panel.classList.remove('is-dragging');
    const offset = Math.max(0, event.clientY - dragStart);
    const velocity = (event.clientY - dragLast) / Math.max(1, event.timeStamp - dragTime);
    if (offset > DISMISS_DISTANCE || velocity > DISMISS_VELOCITY) {
      close();
    } else {
      panel.style.transform = '';
    }
  };
  handle.addEventListener('pointerup', endDrag);
  handle.addEventListener('pointercancel', endDrag);

  list.addEventListener('click', (event: MouseEvent) => {
    if (!mobileLayout.matches) return;
    const target = event.target;
    if (!(target instanceof Element)) return;
    const link = target.closest<HTMLAnchorElement>('a[data-project-index]');
    if (!link || !list.contains(link)) return;
    const index = Number(link.dataset.projectIndex);
    if (!projects[index]) return;
    event.preventDefault();
    // A click with detail 0 came from Enter/Space rather than a pointer.
    open(index, link, event.detail === 0);
  });

  scrim.addEventListener('click', () => close());
  el.closeButton.addEventListener('click', (event: MouseEvent) => close(event.detail === 0));
  el.nextButton.addEventListener('click', next);

  // Warm the image cache once the list is first touched.
  list.addEventListener(
    'pointerdown',
    () => projects.forEach((project) => (new Image().src = project.image)),
    { once: true },
  );

  mobileLayout.addEventListener('change', (event: MediaQueryListEvent) => {
    if (!event.matches) close();
  });
}
