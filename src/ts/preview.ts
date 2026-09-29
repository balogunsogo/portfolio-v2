import type { Project } from './projects.js';

const canHover = window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)');

interface PreviewElements {
  list: HTMLElement;
  frame: HTMLElement;
  image: HTMLImageElement;
  label: HTMLElement;
  meta: HTMLElement;
  description: HTMLElement;
  projects: readonly Project[];
}

export function initPreview({ list, frame, image, label, meta, description, projects }: PreviewElements): void {
  const links = Array.from(list.querySelectorAll<HTMLAnchorElement>('a'));
  let activeIndex: number | null = null;
  let preloaded = false;

  // Warm the cache for every preview image the first time the list is approached.
  const preload = (): void => {
    if (preloaded) return;
    preloaded = true;
    for (const project of projects) {
      new Image().src = project.image;
    }
  };

  const show = (link: HTMLAnchorElement): void => {
    const index = Number(link.dataset.projectIndex);
    const project = projects[index];
    if (!canHover.matches || !project || index === activeIndex) return;
    const isSwitch = activeIndex !== null;
    activeIndex = index;

    frame.style.setProperty('--preview-tone', project.previewTone);
    frame.style.setProperty('--preview-ink', project.previewInk);
    label.textContent = project.title;
    meta.textContent = project.meta;
    description.textContent = project.description;

    // Dim the other titles so it's clear which project the copy belongs to.
    list.classList.add('has-active');
    links.forEach((item) => item.classList.toggle('is-active', item === link));
    image.src = project.image;
    frame.classList.add('has-image');

    if (isSwitch) {
      frame.classList.remove('is-switching');
      meta.classList.remove('is-switching');
      description.classList.remove('is-switching');
      void frame.offsetWidth;
      frame.classList.add('is-switching');
      meta.classList.add('is-switching');
      description.classList.add('is-switching');
    }

    frame.classList.add('is-visible');
    meta.classList.add('is-visible');
    description.classList.add('is-visible');
  };

  const hide = (): void => {
    activeIndex = null;
    frame.classList.remove('is-visible', 'is-switching');
    meta.classList.remove('is-visible', 'is-switching');
    description.classList.remove('is-visible', 'is-switching');
    list.classList.remove('has-active');
    links.forEach((item) => item.classList.remove('is-active'));
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
