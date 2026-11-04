// Local simulation: no requests, storage or analytics, and no form serialization.
const root = document.querySelector<HTMLElement>('[data-form-demo]');

if (root) initFormDemo(root);

function initFormDemo(root: HTMLElement): void {
  const form = root.querySelector<HTMLFormElement>('[data-demo-form]')!;
  const input = root.querySelector<HTMLInputElement>('[data-demo-email]')!;
  const submit = root.querySelector<HTMLButtonElement>('[data-demo-submit]')!;
  const heading = root.querySelector<HTMLHeadingElement>('[data-demo-heading]')!;
  const description = root.querySelector<HTMLElement>('[data-demo-description]')!;
  const message = root.querySelector<HTMLElement>('[data-demo-message]')!;
  const reset = root.querySelector<HTMLButtonElement>('[data-demo-reset]')!;
  const note = root.querySelector<HTMLElement>('[data-demo-note]')!;
  const radios = Array.from(root.querySelectorAll<HTMLInputElement>('[data-demo-condition]'));
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const timers = new Set<number>();
  let state: 'form' | 'pending' | 'error' | 'success' = 'form';
  let retry = false;

  const clearTimers = (): void => {
    timers.forEach((timer) => window.clearTimeout(timer));
    timers.clear();
  };
  const later = (callback: () => void, delay: number): void => {
    const timer = window.setTimeout(() => {
      timers.delete(timer);
      callback();
    }, delay);
    timers.add(timer);
  };
  const busy = (pending: boolean): void => {
    submit.setAttribute('aria-disabled', String(pending));
    submit.textContent = pending ? 'Joining…' : 'Join';
    submit.setAttribute('aria-busy', String(pending));
    form.setAttribute('aria-busy', String(pending));
    input.readOnly = pending;
    radios.forEach((radio) => { radio.disabled = pending; });
  };
  const textButton = (text: string, action: () => void): HTMLButtonElement => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'form-demo__text-button';
    button.textContent = text;
    button.addEventListener('click', action);
    return button;
  };
  const restore = (clear: boolean, focus: boolean): void => {
    clearTimers();
    state = 'form';
    retry = false;
    busy(false);
    form.hidden = false;
    if (clear) input.value = '';
    input.setAttribute('aria-invalid', 'false');
    heading.textContent = 'Join the waitlist';
    description.textContent = "Leave your email and we’ll let you know when it opens.";
    message.replaceChildren();
    if (focus) input.focus();
  };
  const success = (): void => {
    state = 'success';
    busy(false);
    form.hidden = true;
    heading.textContent = "You’re on the list.";
    description.textContent = `We’ll email ${input.value.trim()} when it opens.`;
    message.replaceChildren(textButton('Start over', () => restore(true, true)));
    heading.focus();
  };
  const start = (): void => {
    if (state === 'pending' || state === 'success') return;
    if (state === 'error') retry = true;
    // Check the current value at submit time, including browser autofill.
    if (!emailPattern.test(input.value.trim())) {
      input.setAttribute('aria-invalid', 'true');
      message.textContent = 'Enter an email address, like name@example.com.';
      input.focus();
      return;
    }
    clearTimers();
    input.setAttribute('aria-invalid', 'false');
    state = 'pending';
    busy(true);
    message.replaceChildren();
    const condition = radios.find((radio) => radio.checked)!.value;
    if (condition === 'slow') {
      later(() => { message.textContent = 'Still working. This is taking longer than usual.'; }, 1500);
      later(success, 3500);
    } else if (condition === 'error' && !retry) {
      later(() => {
        state = 'error';
        busy(false);
        const text = document.createElement('p');
        text.textContent = "Something went wrong on our side, so you haven’t joined yet. Your email is still here.";
        message.replaceChildren(text, textButton('Try again', () => { retry = true; submit.focus(); start(); }));
      }, 1200);
    } else later(success, condition === 'error' ? 900 : 700);
  };

  form.addEventListener('submit', (event) => { event.preventDefault(); start(); });
  input.addEventListener('input', () => {
    if (emailPattern.test(input.value.trim()) && input.getAttribute('aria-invalid') === 'true') {
      input.setAttribute('aria-invalid', 'false');
      message.replaceChildren();
    }
  });
  radios.forEach((radio) => radio.addEventListener('change', () => restore(false, false)));
  reset.addEventListener('click', () => restore(true, true));
  window.addEventListener('pagehide', clearTimers);
  window.addEventListener('pageshow', (event) => { if (event.persisted) restore(false, false); });
  input.disabled = false;
  submit.disabled = false;
  reset.disabled = false;
  note.textContent = 'A demo running in your browser. Nothing you type is sent or stored.';
  restore(false, false);
}
