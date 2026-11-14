import { HOLD_MS, TAP_SLOP, WHEEL, KICK, NAME, keys, pickWheel } from './wheel.js';
import type { Kick, Pick } from './wheel.js';

const SAY0 = 'Tap Kick to repeat your selected kick. Slide from it, or hold it, to open the wheel.';
const MOVING = 'Moving. On a keyboard: W, A, S and D, or the arrow keys.';
const STATUS: Record<string, string> = {
  guard: 'Guarding while you hold Guard. On a keyboard: hold Space.',
  dash: 'Dash. On a keyboard: Shift.', punch: 'Punch. On a keyboard: J.',
  switch: 'Switched stance. On a keyboard: Q.',
  pause: 'Pause. On a keyboard: Esc or P.', lock: 'Lock-on. On a keyboard: Tab.',
};

interface Gesture { id: number; x: number; y: number; k: number; moved: boolean; timer: number }
interface Stick { id: number; k: number; left: number; top: number; ox: number; oy: number }

export function initControlsDemo(root: HTMLElement): void {
  const get = <T extends HTMLElement = HTMLElement>(hook: string): T | null => root.querySelector<T>(`[data-touch-${hook}]`);
  const versions = Array.from(root.querySelectorAll<HTMLElement>('[data-touch-version]'));
  const bar = get('bar'), controls = get('controls'), group = get('versions'), read = get('read'), say = get('say');
  const stage = get('stage'), layer = get('layer'), shot = get<HTMLImageElement>('shot');
  const kick = get<HTMLButtonElement>('kick'), cluster = get('cluster'), wheel = get('wheel');
  const kickLabel = get('kick-label'), kickSub = get('kick-sub');
  const highButton = get<HTMLButtonElement>('high'), highLabel = get('high-label');
  const stickButton = get<HTMLButtonElement>('stick'), base = get('base'), knob = get('knob');
  if (!bar || !controls || !group || !read || !say || !stage || !layer || !shot || !kick || !cluster || !wheel || !kickLabel || !kickSub || !highButton || !highLabel || !stickButton || !base || !knob || versions.length < 2) return;

  const items = Array.from(root.querySelectorAll<HTMLElement>('[data-touch-item]'));
  const pressButtons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-touch-hold], [data-touch-tap]'));
  const pressed = new Map<HTMLButtonElement, number>();
  let selected: Kick = 'round', high = false, open = false, pick: Pick | null = null;
  let gesture: Gesture | null = null, stick: Stick | null = null;
  let version = -1;

  const paint = (): void => {
    cluster.classList.toggle('is-open', open);
    wheel.hidden = !open;
    kick.classList.toggle('is-head', high);
    kickLabel.textContent = KICK[selected][0];
    kickSub.textContent = KICK[selected][1];
    kick.setAttribute('aria-label', `Kick: ${NAME[selected]}. Hold or slide for the wheel.`);
    highButton.classList.toggle('is-on', high);
    highButton.setAttribute('aria-pressed', String(high));
    highLabel.textContent = high ? 'Head' : 'Body';
    for (const item of items) {
      const kind = item.dataset.touchItem;
      const on = pick?.kind === kind;
      item.classList.toggle('is-sel', selected === kind);
      item.classList.toggle('is-on', on);
      item.classList.toggle('is-head', on && !!pick?.head);
      const sub = item.querySelector<HTMLElement>('[data-touch-item-sub]');
      if (sub) sub.textContent = on && pick?.head ? 'HEAD' : WHEEL.find((entry) => entry.kind === kind)!.ko;
    }
  };
  const capture = (button: HTMLElement, event: PointerEvent): void => {
    event.preventDefault();
    try { button.setPointerCapture(event.pointerId); } catch { /* Pointer may already be lost. */ }
  };
  const release = (button: HTMLElement, id: number): void => {
    if (button.hasPointerCapture(id)) button.releasePointerCapture(id);
  };
  const cancelKick = (): void => {
    const old = gesture;
    if (old) window.clearTimeout(old.timer);
    gesture = null;
    open = false;
    pick = null;
    kick.classList.remove('is-down');
    if (old) release(kick, old.id);
    paint();
  };
  const homeStick = (): void => {
    const old = stick;
    stick = null;
    base.classList.remove('is-active');
    base.style.left = '36px'; base.style.top = '229px';
    knob.style.transform = 'translate(0px, 0px)';
    if (old) release(stickButton, old.id);
  };
  const reset = (): void => {
    cancelKick(); homeStick();
    for (const [button, id] of pressed) {
      button.classList.remove('is-down');
      release(button, id);
    }
    pressed.clear();
    highButton.classList.remove('is-down');
    selected = 'round'; high = false;
    say.textContent = SAY0;
    paint();
  };
  const fire = (kind: Kick, head: boolean, changed: boolean): void => {
    const height = head || high;
    say.textContent = `${NAME[kind]} to the ${height ? 'head' : 'body'}.` +
      (changed ? ` Kick now repeats it${head && !high ? ' at body height' : ''}.` : '') + ` ${keys(kind, height)}`;
  };
  const scale = (): number => layer.getBoundingClientRect().width / 667 || 1;

  kick.addEventListener('pointerdown', (event) => {
    if (gesture) return;
    const rect = kick.getBoundingClientRect();
    capture(kick, event);
    gesture = {
      id: event.pointerId, x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, k: scale(), moved: false,
      timer: window.setTimeout(() => { if (gesture) { open = true; paint(); } }, HOLD_MS),
    };
    kick.classList.add('is-down');
  });
  kick.addEventListener('pointermove', (event) => {
    if (!gesture || gesture.id !== event.pointerId) return;
    const dx = (event.clientX - gesture.x) / gesture.k, dy = (event.clientY - gesture.y) / gesture.k;
    if (!gesture.moved && Math.hypot(dx, dy) > TAP_SLOP) { gesture.moved = true; open = true; }
    if (gesture.moved || open) pick = pickWheel(dx, dy);
    paint();
  });
  kick.addEventListener('pointerup', (event) => {
    if (!gesture || gesture.id !== event.pointerId) return;
    const dx = (event.clientX - gesture.x) / gesture.k, dy = (event.clientY - gesture.y) / gesture.k;
    const picked = pickWheel(dx, dy), wasOpen = open || gesture.moved;
    cancelKick();
    if (!wasOpen) fire(selected, false, false);
    else if (picked) {
      const changed = picked.kind !== selected;
      selected = picked.kind;
      fire(selected, picked.head, changed);
      paint();
    } else if (Math.hypot(dx, dy) < TAP_SLOP) fire(selected, false, false);
    else say.textContent = 'Released away from the kicks, so nothing was thrown.';
  });
  for (const event of ['pointercancel', 'lostpointercapture'] as const) {
    kick.addEventListener(event, (e) => { if (gesture?.id === e.pointerId) cancelKick(); });
  }
  kick.addEventListener('click', (event) => { if (event.detail === 0) fire(selected, false, false); });

  const toggleHigh = (): void => {
    high = !high;
    say.textContent = high ? 'Kicks now go to the head. On a keyboard: hold E.' : 'Kicks go to the body again.';
    paint();
  };
  highButton.addEventListener('pointerdown', (event) => {
    if (pressed.has(highButton)) return;
    capture(highButton, event);
    pressed.set(highButton, event.pointerId);
    highButton.classList.add('is-down');
    toggleHigh();
  });
  highButton.addEventListener('click', (event) => { if (event.detail === 0) toggleHigh(); });
  for (const button of [...pressButtons, highButton]) {
    const status = STATUS[button.dataset.touchHold ?? button.dataset.touchTap ?? ''];
    if (button !== highButton) {
      button.addEventListener('pointerdown', (event) => {
        if (pressed.has(button)) return;
        capture(button, event);
        pressed.set(button, event.pointerId);
        button.classList.add('is-down');
        say.textContent = status;
      });
      button.addEventListener('click', (event) => { if (event.detail === 0) say.textContent = status; });
    }
    for (const event of ['pointerup', 'pointercancel', 'lostpointercapture'] as const) {
      button.addEventListener(event, (e) => {
        if (pressed.get(button) !== e.pointerId) return;
        pressed.delete(button);
        button.classList.remove('is-down');
        release(button, e.pointerId);
      });
    }
  }

  stickButton.addEventListener('pointerdown', (event) => {
    if (stick) return;
    capture(stickButton, event);
    const rect = layer.getBoundingClientRect(), k = scale();
    stick = { id: event.pointerId, k, left: rect.left, top: rect.top, ox: (event.clientX - rect.left) / k, oy: (event.clientY - rect.top) / k };
    base.style.left = `${stick.ox - 52}px`; base.style.top = `${stick.oy - 52}px`;
    base.classList.add('is-active');
    say.textContent = MOVING;
  });
  stickButton.addEventListener('pointermove', (event) => {
    if (!stick || stick.id !== event.pointerId) return;
    const px = (event.clientX - stick.left) / stick.k, py = (event.clientY - stick.top) / stick.k;
    let dx = px - stick.ox, dy = py - stick.oy;
    const distance = Math.hypot(dx, dy);
    if (distance > 52) {
      const f = (distance - 52) / distance;
      stick.ox += dx * f; stick.oy += dy * f;
      dx = px - stick.ox; dy = py - stick.oy;
    }
    base.style.left = `${stick.ox - 52}px`; base.style.top = `${stick.oy - 52}px`;
    knob.style.transform = `translate(${dx}px, ${dy}px)`;
  });
  for (const event of ['pointerup', 'pointercancel', 'lostpointercapture'] as const) {
    stickButton.addEventListener(event, (e) => { if (stick?.id === e.pointerId) homeStick(); });
  }
  stickButton.addEventListener('click', (event) => { if (event.detail === 0) say.textContent = MOVING; });

  const buttons: HTMLButtonElement[] = [];
  const select = (index: number): void => {
    if (version === index) return;
    reset();
    versions[index].querySelector('[data-touch-plate]')!.append(bar);
    versions.forEach((item, i) => { item.hidden = i !== index; });
    buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    read.textContent = versions[index].dataset.touchCoverage!;
    say.classList.toggle('is-off', index === 0);
    version = index;
  };
  versions.forEach((item, index) => {
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'writing-control';
    button.textContent = item.dataset.touchVersion!;
    button.addEventListener('click', () => { select(index); button.focus({ preventScroll: true }); });
    buttons.push(button); group.append(button);
  });
  shot.src = shot.dataset.liveSrc!;
  shot.alt = shot.dataset.liveAlt!;
  layer.hidden = false;
  for (const button of [kick, highButton, stickButton, ...pressButtons]) button.disabled = false;
  controls.hidden = false;
  const resize = (): void => { layer.style.setProperty('--dj-scale', String(stage.getBoundingClientRect().width / 667)); };
  new ResizeObserver(resize).observe(stage);
  resize();
  select(0);
  window.addEventListener('pagehide', reset);
  window.addEventListener('pageshow', (event) => { if (event.persisted) reset(); });
}
