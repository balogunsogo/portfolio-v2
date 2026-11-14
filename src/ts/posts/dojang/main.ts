import { initImageSwitch } from './image-switch.js';
import { initSoundCompare } from './sound-compare.js';
import { initControlsDemo } from './controls-demo.js';

document.querySelectorAll<HTMLElement>('[data-image-switch]').forEach(initImageSwitch);
document.querySelectorAll<HTMLElement>('[data-sound-compare]').forEach(initSoundCompare);
document.querySelectorAll<HTMLElement>('[data-touch-demo]').forEach(initControlsDemo);
