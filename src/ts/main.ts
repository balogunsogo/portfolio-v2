import { initClock } from './clock.js';
import { initPreview } from './preview.js';

const clock = document.querySelector<HTMLTimeElement>('[data-clock]');
if (clock) initClock(clock);

const list = document.querySelector<HTMLElement>('[data-work-list]');
const frame = document.querySelector<HTMLElement>('[data-preview]');
const image = document.querySelector<HTMLImageElement>('[data-preview-image]');
const label = document.querySelector<HTMLElement>('[data-preview-label]');
if (list && frame && image && label) initPreview({ list, frame, image, label });
