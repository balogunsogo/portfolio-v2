import { Drawer, initOptions, savedMessage } from './drawer.js';
import { editResults, urls } from './extraction.js';

export function initEditsDemo(root: HTMLElement): void {
  const get = <T extends HTMLElement = HTMLElement>(selector: string): T => root.querySelector<T>(selector)!;
  const drawer = new Drawer(get('[data-drawer]'));
  const prompt = get('[data-task-prompt]');
  const paste = get<HTMLButtonElement>('[data-paste]');
  const change = get<HTMLButtonElement>('[data-change-role]');
  const log = get('[data-log]');
  let scenario = 0;
  let step: 'start' | 'looking' | 'done' = 'start';
  const setLog = (text: string, settled = true): void => { log.textContent = text; log.classList.toggle('is-on', !!text && settled); };
  const renderTask = (): void => {
    change.hidden = scenario !== 0 || step !== 'looking' || !drawer.state.busy || drawer.state.touched.has('role');
    paste.disabled = scenario === 0 ? step !== 'start' : step === 'done';
    paste.textContent = scenario === 0 ? 'Paste example URL' : step === 'start' ? 'Paste URL A' : 'Paste URL B';
    prompt.textContent = scenario === 0
      ? step === 'start' ? 'Paste the example URL, then change the Role while JobTrackr is looking.' : step === 'looking' ? 'While it’s looking, change the Role.' : 'Try the suggestion buttons, or Reset and try again.'
      : step === 'start' ? 'Paste URL A, then replace it with URL B before A finishes.' : step === 'looking' ? 'Before it finishes, paste a different job.' : 'URL B was the newer request, so its answer wins.';
  };
  const reset = (): void => { drawer.reset(); step = 'start'; setLog(''); renderTask(); };
  initOptions(root, index => { scenario = index; reset(); });
  drawer.onReset = reset;
  drawer.onSave = () => { setLog(savedMessage); change.hidden = true; };
  drawer.onEdit = () => { change.hidden = scenario !== 0 || step !== 'looking' || !drawer.state.busy || drawer.state.touched.has('role'); };
  drawer.onExtract = () => drawer.run(editResults[drawer.state.values.url === urls[1] ? 1 : 0], 1200, () => { change.hidden = true; });
  paste.disabled = false; change.disabled = false;
  paste.addEventListener('click', () => {
    if (paste.disabled) return;
    if (step === 'start') {
      drawer.setURL(urls[0]); step = 'looking';
      drawer.run(editResults[0], 4000, () => {
        step = 'done'; renderTask();
        setLog(scenario === 0
          ? drawer.state.touched.has('role') ? 'Your edit stayed. The extracted value is offered as a suggestion, and the blank fields filled.' : 'Every field was blank, so everything filled. Reset, then change the Role while it’s looking.'
          : 'URL A finished first because nothing replaced it. Reset and paste URL B before it finishes.');
      }, () => {
        if (scenario === 1 && drawer.state.values.url === urls[1]) setLog('URL A’s answer arrived late and was ignored. The form still shows URL B.');
      });
    } else if (scenario === 1 && step === 'looking') {
      drawer.setURL(urls[1]); step = 'done'; setLog('Waiting for URL A as well…', false);
      drawer.run(editResults[1], 1200);
    }
    renderTask();
  });
  change.addEventListener('click', () => {
    if (step !== 'looking' || !drawer.state.busy || drawer.state.touched.has('role')) return;
    drawer.setEdit('role', 'Product Designer'); renderTask();
  });
  const resetButton = get<HTMLButtonElement>('[data-reset]'); resetButton.disabled = false; resetButton.addEventListener('click', reset);
  get('[data-demo-note]').textContent = 'A simulation running in your browser. It doesn’t contact JobTrackr.';
  window.addEventListener('pagehide', () => drawer.cancel());
  window.addEventListener('pageshow', event => { if (event.persisted) reset(); });
  renderTask();
}
