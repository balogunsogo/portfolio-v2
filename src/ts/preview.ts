// Hover / focus preview for the featured work list (desktop pointers only).
// The frame stays hidden until a project is hovered or focused, and hides again when the
// pointer leaves the list or focus moves outside it.

const canHover = window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)');

interface PreviewElements {
  list: HTMLElement;
  frame: HTMLElement;
  image: HTMLImageElement;
  label: HTMLElement;
}

export function initPreview({ list, frame, image, label }: PreviewElements): void {
  const links = Array.from(list.querySelectorAll<HTMLAnchorElement>('a'));
  let active: HTMLAnchorElement | null = null;
  let preloaded = false;

  // Warm the cache for every preview image the first time the list is approached.
  const preload = (): void => {
    if (preloaded) return;
    preloaded = true;
    for (const link of links) {
      const src = link.dataset.previewSrc;
      if (src) new Image().src = src;
    }
  };

  const show = (link: HTMLAnchorElement): void => {
    if (!canHover.matches || link === active) return;
    active = link;

    const src = link.dataset.previewSrc ?? '';
    frame.style.setProperty('--preview-tone', link.dataset.previewTone ?? 'transparent');
    frame.style.setProperty('--preview-ink', link.dataset.previewInk ?? 'inherit');
    // Use only the visible title, not the screen-reader "(opens in a new tab)" suffix.
    const title = link.querySelector('[data-work-title]') ?? link;
    label.textContent = title.textContent?.trim() ?? '';

    if (src) {
      image.src = src;
      frame.classList.add('has-image');
    } else {
      image.removeAttribute('src');
      frame.classList.remove('has-image');
    }

    frame.classList.add('is-visible');
  };

  const hide = (): void => {
    active = null;
    frame.classList.remove('is-visible');
  };

  image.addEventListener('error', () => {
    image.removeAttribute('src');
    frame.classList.remove('has-image');
  });

  list.addEventListener('pointerenter', preload);
  list.addEventListener('pointerleave', hide);

  for (const link of links) {
    link.addEventListener('pointerenter', () => show(link));
    link.addEventListener('focus', () => show(link));
  }

  list.addEventListener('focusout', (event: FocusEvent) => {
    const next = event.relatedTarget;
    if (!(next instanceof Node) || !list.contains(next)) hide();
  });

  // Leaving the desktop layout (resize / orientation change) resets the frame.
  canHover.addEventListener('change', hide);
}
