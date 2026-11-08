import { initSourcesDemo } from './sources-demo.js';
import { initEditsDemo } from './edits-demo.js';

for (const root of document.querySelectorAll<HTMLElement>('[data-sources-demo]')) initSourcesDemo(root);
for (const root of document.querySelectorAll<HTMLElement>('[data-edits-demo]')) initEditsDemo(root);
