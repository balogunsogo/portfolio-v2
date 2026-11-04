import { initWritingPlayback } from './media-switch.js';

export function initAnnotatedMedia(root: HTMLElement): void {
  const video = root.querySelector<HTMLVideoElement>('[data-media-video]');
  if (video) initWritingPlayback(root, video);

  const notes = root.querySelector<HTMLElement>('[data-media-notes]');
  const sections = Array.from(root.querySelectorAll<HTMLElement>('[data-media-note]'));
  if (!notes || sections.length === 0) return;
  const tablist = document.createElement('div');
  tablist.className = 'writing-notes__tabs';
  tablist.setAttribute('role', 'tablist');
  tablist.setAttribute('aria-label', notes.dataset.mediaNotes!);
  const tabs: HTMLButtonElement[] = [];
  const panels: HTMLElement[] = [];
  const select = (index: number): void => {
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
      panels[i].hidden = i !== index;
    });
  };

  for (const [index, section] of sections.entries()) {
    const heading = section.querySelector<HTMLElement>('[data-media-note-heading]');
    const panel = section.querySelector<HTMLElement>('[data-media-note-panel]');
    if (!heading || !panel) return;
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = heading.className;
    tab.textContent = heading.textContent;
    tab.id = `${panel.id}-tab`;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', panel.id);
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tab.id);
    panel.tabIndex = 0;
    tab.addEventListener('click', () => select(index));
    tab.addEventListener('keydown', (event) => {
      let next: number;
      switch (event.key) {
        case 'ArrowRight': case 'ArrowDown': next = (index + 1) % sections.length; break;
        case 'ArrowLeft': case 'ArrowUp': next = (index + sections.length - 1) % sections.length; break;
        case 'Home': next = 0; break;
        case 'End': next = sections.length - 1; break;
        default: return;
      }
      event.preventDefault();
      select(next);
      tabs[next].focus();
    });
    tabs.push(tab);
    panels.push(panel);
    tablist.append(tab);
  }
  notes.replaceChildren(tablist, ...panels);
  select(0);
}
