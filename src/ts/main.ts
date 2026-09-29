import { initClock } from './clock.js';
import { initProjectSheet } from './modal.js';
import { initPreview } from './preview.js';
import { projects, renderProjects } from './projects.js';

const $ = <T extends Element>(selector: string): T | null => document.querySelector<T>(selector);

const clock = $<HTMLTimeElement>('[data-clock]');
if (clock) initClock(clock);

const list = $<HTMLElement>('[data-work-list]');
if (list) renderProjects(list);

// Desktop: hover / focus preview with the description column.
const frame = $<HTMLElement>('[data-preview]');
const image = $<HTMLImageElement>('[data-preview-image]');
const label = $<HTMLElement>('[data-preview-label]');
const meta = $<HTMLElement>('[data-preview-meta]');
const description = $<HTMLElement>('[data-preview-description]');

if (list && frame && image && label && meta && description) {
  initPreview({ list, frame, image, label, meta, description, projects });
}

// Small screens: bottom sheet.
const sheet = {
  root: $<HTMLElement>('[data-sheet]'),
  scrim: $<HTMLElement>('[data-sheet-scrim]'),
  panel: $<HTMLElement>('[data-sheet-panel]'),
  handle: $<HTMLElement>('[data-sheet-handle]'),
  title: $<HTMLElement>('[data-sheet-title]'),
  meta: $<HTMLElement>('[data-sheet-meta]'),
  image: $<HTMLImageElement>('[data-sheet-image]'),
  description: $<HTMLElement>('[data-sheet-description]'),
  link: $<HTMLAnchorElement>('[data-sheet-link]'),
  closeButton: $<HTMLButtonElement>('[data-sheet-close]'),
  nextButton: $<HTMLButtonElement>('[data-sheet-next]'),
  nextTitle: $<HTMLElement>('[data-sheet-next-title]'),
};

if (list && Object.values(sheet).every((node) => node !== null)) {
  initProjectSheet({ list, projects, ...(sheet as { [K in keyof typeof sheet]: NonNullable<(typeof sheet)[K]> }) });
}
