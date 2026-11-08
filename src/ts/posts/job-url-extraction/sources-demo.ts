import { Drawer, initOptions, savedMessage } from './drawer.js';
import { results, urls } from './extraction.js';

const paths = [
  ['Used', 'Checked, to fill any gaps', 'Not used'],
  ['Not a Greenhouse or Lever link', 'Used', 'Not needed'],
  ['Not a Greenhouse or Lever link', 'None on the page', 'Used, as suggestions'],
  ['Not a Greenhouse or Lever link', 'Couldn’t read the page', 'Couldn’t read the page'],
];
const paragraphs = [
  ['This is a Greenhouse job link, so JobTrackr asked Greenhouse’s public job board API for this posting. It returned the role, company, location and description.', 'JobTrackr then read the posting page itself, in case its structured data could fill anything still missing. Lever links work the same way, through Lever’s API.'],
  ['This careers page isn’t on Greenhouse or Lever, so JobTrackr read the page itself and found JobPosting structured data, written as JSON-LD.', 'That data names the role, the hiring organisation, the location, the employment type, the salary and the description. Salary only fills when the page gives an annual amount with a currency.'],
  ['The page had no JobPosting data, so JobTrackr fell back to its title and description tags.', 'Those are less certain. A page title often carries the site’s name, and the description is a summary, not the full posting. So they’re offered as suggestions, and nothing fills on its own.'],
  ['The site refused JobTrackr’s request, so there was nothing to read. JobTrackr says so and leaves the form to you.', 'Everything can still be entered by hand, and the job description can be pasted in.'],
];
export function initSourcesDemo(root: HTMLElement): void {
  const get = <T extends HTMLElement = HTMLElement>(selector: string): T => root.querySelector<T>(selector)!;
  const drawer = new Drawer(get('[data-drawer]'), urls[0]);
  const prompt = get('[data-source-prompt]');
  const flow = get('[data-source-flow]');
  const saved = get('[data-saved-note]');
  const wrap = get('[data-how-wrap]');
  const toggle = get<HTMLButtonElement>('[data-how-toggle]');
  const how = get('[data-how]');
  let example = 0;
  const clear = (): void => {
    saved.hidden = true; saved.textContent = ''; flow.hidden = true; wrap.hidden = true;
    how.hidden = true; toggle.setAttribute('aria-expanded', 'false'); prompt.hidden = false;
  };
  const reset = (): void => { drawer.reset(urls[example]); clear(); };
  initOptions(root, index => { example = index; reset(); });
  drawer.onStart = clear;
  drawer.onExtract = () => drawer.run(results[example], 900, () => {
    prompt.hidden = true; flow.hidden = false; wrap.hidden = false;
    const path = get('[data-path]'); path.replaceChildren();
    ['Greenhouse or Lever API', 'JobPosting data on the page', 'Page title and description'].forEach((name, i) => {
      const row = document.createElement('li'); row.className = 'jxp__step';
      row.classList.toggle('is-used', example === i);
      const title = document.createElement('span'); title.textContent = name;
      const status = document.createElement('span'); status.textContent = paths[example][i];
      row.append(title, status); path.append(row);
    });
    const explanation = get('[data-explanation]'); explanation.replaceChildren();
    for (const text of paragraphs[example]) { const p = document.createElement('p'); p.textContent = text; explanation.append(p); }
  });
  drawer.onSave = () => { flow.hidden = false; saved.hidden = false; saved.textContent = savedMessage; };
  drawer.onReset = reset;
  toggle.disabled = false;
  toggle.addEventListener('click', () => { how.hidden = !how.hidden; toggle.setAttribute('aria-expanded', String(!how.hidden)); });
  const resetButton = get<HTMLButtonElement>('[data-reset]'); resetButton.disabled = false; resetButton.addEventListener('click', reset);
  get('[data-demo-note]').textContent = 'Interactive simulation. It runs in your browser and doesn’t contact JobTrackr. Nothing you type is sent or saved.';
  window.addEventListener('pagehide', () => drawer.cancel());
  window.addEventListener('pageshow', event => { if (event.persisted) reset(); });
}
