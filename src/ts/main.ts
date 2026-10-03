import { initAbout } from './about.js';
import { initClock } from './clock.js';
import { initMedia } from './media.js';
import { initProjectSheet } from './modal.js';
import { initPreview } from './preview.js';
import { renderProjects, shownProjects as projects } from './projects.js';
import { initTopBar } from './top.js';

const $ = <T extends Element>(selector: string): T | null => document.querySelector<T>(selector);

const clock = $<HTMLTimeElement>('[data-clock]');
const hourHand = $<SVGElement>('[data-clock-hour]');
const minuteHand = $<SVGElement>('[data-clock-minute]');
const readout = $<SVGElement>('[data-clock-readout]');
if (clock) {
  initClock(clock, hourHand && minuteHand ? { hour: hourHand, minute: minuteHand, readout } : undefined);
}

// Home: the portrait in the name shows the About.
const page = $<HTMLElement>('[data-page]');
const aboutToggle = $<HTMLButtonElement>('[data-about-toggle]');
const statement = $<HTMLElement>('[data-about-statement]');
const about = $<HTMLElement>('[data-about]');
if (page && aboutToggle && statement && about) initAbout({ page, toggle: aboutToggle, statement, about });

// Case study: the top bar hides on the way down and returns on the way up.
const topBar = $<HTMLElement>('[data-case-top]');
if (topBar) initTopBar(topBar);

// Case study: videos play only while they're in view.
const videos = Array.from(document.querySelectorAll<HTMLVideoElement>('[data-case-video]'));
if (videos.length > 0) initMedia(videos);

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
  linkLabel: $<HTMLElement>('[data-sheet-link-label]'),
  linkSuffix: $<HTMLElement>('[data-sheet-link-suffix]'),
  closeButton: $<HTMLButtonElement>('[data-sheet-close]'),
  nextButton: $<HTMLButtonElement>('[data-sheet-next]'),
  nextTitle: $<HTMLElement>('[data-sheet-next-title]'),
};

if (list && Object.values(sheet).every((node) => node !== null)) {
  initProjectSheet({ list, projects, ...(sheet as { [K in keyof typeof sheet]: NonNullable<(typeof sheet)[K]> }) });
}
