import { DemoState, type ValueChange } from './dom.js';
import { el, hook } from './dom.js';

const END_DAY = 12;

interface TurnaroundState { ttOn: Record<string, boolean>; ttNow: number; ttPlaying: boolean }
interface Interval { a: number; b: number; kind: string; open?: boolean }
// Synthetic days and events; ignored events never add time.
export class Turnaround extends DemoState<TurnaroundState> {
  private ttTimer: number | null = null;
  constructor(onChange: () => void) {
    super({ ttOn: {}, ttNow: END_DAY, ttPlaying: false }, onChange);
    this.state = this.ttInit();
  }

  ttDefs() {
    return [
      { id: 'reg', day: 0, type: 'register', label: 'Claim registered', fixed: true },
      { id: 'early', day: 1, type: 'request', label: 'A document requested before the file is complete', on: false },
      { id: 'docs', day: 2, type: 'complete', label: 'Required documents complete', fixed: true },
      { id: 'req1', day: 4, type: 'request', label: 'Missing document requested', on: true },
      { id: 'dup', day: 5, type: 'request', label: 'The same request sent again', on: false },
      { id: 'rec1', day: 7, type: 'receive', label: 'Document received', on: true },
      { id: 'req2', day: 8, type: 'request', label: 'Another document requested', on: true },
      { id: 'rec2', day: 9, type: 'receive', label: 'Document received', on: true },
      { id: 'settle', day: 12, type: 'settle', label: 'Claim settled', fixed: true },
      { id: 'late', day: 13, type: 'receive', label: 'A late document after settlement', on: false },
    ];
  }

  ttInit() {
    const on: Record<string, boolean> = {};
    this.ttDefs().forEach((d) => { if (!d.fixed) on[d.id] = !!d.on; });
    return { ttOn: on, ttNow: END_DAY, ttPlaying: false };
  }

  ttRun(onMap: Record<string, boolean>) {
    const H = END_DAY;
    const segs: Interval[] = [];
    const effects: Record<string, { text: string; kind: string }> = {};
    let state = 'idle';
    let from = 0;
    let start: number | null = null;
    let end: number | null = null;
    this.ttDefs().forEach((e) => {
      const live = e.fixed || onMap[e.id];
      if (!live) { effects[e.id] = { text: 'Switched off', kind: 'off' }; return; }
      const set = (text: string, kind: string) => { effects[e.id] = { text, kind }; };
      if (e.type === 'register') set('Opens the claim', 'info');
      else if (e.type === 'complete') {
        if (state === 'idle') { state = 'running'; from = e.day; start = e.day; set('Starts the clock', 'acts'); } else set('Ignored: already started', 'ignored');
      } else if (e.type === 'request') {
        if (state === 'running') { segs.push({ a: from, b: e.day, kind: 'run' }); state = 'paused'; from = e.day; set('Pauses the clock', 'acts'); }
        else if (state === 'paused') set('Ignored: already paused', 'ignored');
        else if (state === 'idle') set('Ignored: the clock hasn’t started', 'ignored');
        else set('Ignored: the claim is closed', 'ignored');
      } else if (e.type === 'receive') {
        if (state === 'paused') { segs.push({ a: from, b: e.day, kind: 'pause' }); state = 'running'; from = e.day; set('Resumes the clock', 'acts'); }
        else if (state === 'running') set('Ignored: nothing outstanding', 'ignored');
        else if (state === 'idle') set('Ignored: the clock hasn’t started', 'ignored');
        else set('Ignored: the claim is closed', 'ignored');
      } else if (e.type === 'settle') {
        if (state === 'running' || state === 'paused') { segs.push({ a: from, b: e.day, kind: state === 'running' ? 'run' : 'pause' }); end = e.day; state = 'stopped'; set('Stops the clock', 'acts'); }
        else set('Closes the claim. The clock never started', 'acts');
      }
    });
    if (state === 'running' || state === 'paused') segs.push({ a: from, b: H, kind: state === 'running' ? 'run' : 'pause', open: true });
    return { segs, effects, start, end, H };
  }

  // Totals up to a moment: every interval is clipped to [its start, now], so time can't go negative.
  ttTotals(run: ReturnType<Turnaround["ttRun"]>, now: number) {
    let active = 0;
    let paused = 0;
    run.segs.forEach((s) => {
      const len = Math.max(0, Math.min(s.b, now) - s.a);
      if (s.kind === 'run') active += len; else paused += len;
    });
    let state = 'Not started';
    if (run.start !== null && now >= run.start) state = `Running since day ${run.start}`;
    run.segs.forEach((s) => { if (now >= s.a && now < s.b) state = `${s.kind === 'run' ? 'Running' : 'Paused'} since day ${s.a}`; });
    if (run.end !== null && now >= run.end) state = `Stopped on day ${run.end}`;
    return { active, paused, elapsed: active + paused, state };
  }

  ttDays(n: number) {
    const v = Math.round(n * 2) / 2;
    const txt = Number.isInteger(v) ? String(v) : `${Math.floor(v)}½`;
    return `${txt} day${v === 1 ? '' : 's'}`;
  }

  ttTogglePlay() {
    if (this.ttTimer) { window.clearInterval(this.ttTimer!); this.ttTimer = null; this.setState({ ttPlaying: false }); return; }
    const reduce = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { this.setState({ ttNow: END_DAY, ttPlaying: false }); return; }
    const from = this.state.ttNow >= END_DAY ? 0 : this.state.ttNow;
    this.setState({ ttNow: from, ttPlaying: true });
    this.ttTimer = window.setInterval(() => {
      const next = Math.min(END_DAY, this.state.ttNow + 0.5);
      if (next >= END_DAY) { window.clearInterval(this.ttTimer!); this.ttTimer = null; this.setState({ ttNow: END_DAY, ttPlaying: false }); }
      else this.setState({ ttNow: next });
    }, 500);
  }

  ttStop() { if (this.ttTimer) { window.clearInterval(this.ttTimer!); this.ttTimer = null; } }

  ttVals() {
    const st = this.state;
    const run = this.ttRun(st.ttOn);
    const now = st.ttNow;
    const t = this.ttTotals(run, now);
    const pct = (d: number) => `${(d / run.H * 100).toFixed(4)}%`;
    const parts = (a: number, b: number, cls: string) => {
      const out = [];
      const mid = Math.min(Math.max(now, a), b);
      if (mid > a) out.push({ from: pct(a), width: pct(mid - a), cls });
      return out;
    };
    const activeSegs: { from: string; width: string; cls: string }[] = [];
    run.segs.forEach((s) => { if (s.kind === 'run') activeSegs.push(...parts(s.a, s.b, '')); });
    const pausedSegs: { from: string; width: string; cls: string }[] = [];
    run.segs.forEach((s) => { if (s.kind === 'pause') pausedSegs.push(...parts(s.a, s.b, ' is-paused')); });
    const endDay = run.end !== null ? run.end : (run.start !== null ? run.H : null);
    const elapsedSegs = run.start === null ? [] : parts(run.start, endDay!, ' is-elapsed');
    const defs = this.ttDefs();
    return {
      ttActive: this.ttDays(t.active),
      ttPaused: this.ttDays(t.paused),
      ttElapsed: this.ttDays(t.elapsed),
      ttState: t.state,
      ttNow: now,
      ttNowLabel: Number.isInteger(now) ? String(now) : `${Math.floor(now)}½`,
      ttNowAt: pct(now),
      ttMarks: defs.filter((d) => d.fixed || st.ttOn[d.id]).map((d) => ({ at: pct(d.day), cls: run.effects[d.id].kind === 'ignored' ? ' is-ignored' : '' })),
      ttActiveSegs: activeSegs,
      ttPausedSegs: pausedSegs,
      ttElapsedSegs: elapsedSegs.map((s) => Object.assign({}, s, { cls: s.cls.replace(' is-elapsed', ' is-paused') })),
      ttEvents: defs.map((d) => {
        const ef = run.effects[d.id];
        return {
          day: d.day, label: d.label, fixed: !!d.fixed, toggle: !d.fixed, on: !!(d.fixed || st.ttOn[d.id]),
          effect: ef.text,
          cls: (ef.kind === 'off' ? ' is-off' : '') + (ef.kind === 'ignored' ? ' is-ignored' : ''),
          flip: () => this.setState({ ttOn: Object.assign({}, this.state.ttOn, { [d.id]: !this.state.ttOn[d.id] }) }),
        };
      }),
      ttPlay: () => this.ttTogglePlay(),
      ttPlayLabel: st.ttPlaying ? 'Pause' : 'Play',
      ttScrub: (e: ValueChange) => { this.ttStop(); this.setState({ ttNow: Number(e.target.value), ttPlaying: false }); },
      ttReset: () => { this.ttStop(); this.setState(this.ttInit()); },
    };
  }}

// A single fixed example: completed on arrival, explicit playback, no editable events.
export function initTurnaround(root: HTMLElement): void {
  const model = new Turnaround(render);
  const play = hook<HTMLButtonElement>(root, 'play');
  const caption = hook(root, 'caption');
  const summary = hook(root, 'summary');
  let played = false;
  const stages = [
    { day: 0, text: 'Day 0 · Claim registered — waiting for complete documents.' },
    { day: 2, text: 'Day 2 · Documents complete — clock starts.' },
    { day: 4, text: 'Day 4 · Document requested — clock pauses.' },
    { day: 7, text: 'Day 7 · Document received — clock resumes.' },
    { day: 8, text: 'Day 8 · Another document requested — clock pauses.' },
    { day: 9, text: 'Day 9 · Document received — clock resumes.' },
    { day: END_DAY, text: 'Day 12 · Claim settled — clock stops.' },
  ];

  function render(): void {
    const v = model.ttVals();
    for (const [key, value] of [['active', v.ttActive], ['paused', v.ttPaused], ['elapsed', v.ttElapsed]]) {
      const node = hook(root, key);
      if (node.textContent !== value) node.textContent = value;
    }
    const complete = v.ttNow >= END_DAY;
    play.textContent = model.state.ttPlaying ? 'Pause' : played ? (complete ? 'Replay' : 'Continue') : 'Play example';
    const stage = stages.filter(s => s.day <= v.ttNow).pop()!;
    if (caption.textContent !== stage.text) caption.textContent = stage.text;
    summary.classList.toggle('is-pending', !complete);
    summary.setAttribute('aria-hidden', String(!complete));
    hook(root, 'now').style.left = v.ttNowAt;
    for (const [key, segments] of [['active-track', v.ttActiveSegs], ['paused-track', v.ttPausedSegs]] as const) {
      hook(root, key).replaceChildren(...segments.map(s => {
        const seg = el('span', 'axa-tt__seg' + s.cls);
        seg.style.left = s.from;
        seg.style.width = s.width;
        return seg;
      }));
    }
  }

  play.disabled = false;
  play.addEventListener('click', () => {
    played = true;
    model.ttTogglePlay();
  });
  window.addEventListener('pagehide', () => {
    model.ttStop();
    model.setState({ ttPlaying: false });
  });
  window.addEventListener('pageshow', event => {
    if (!event.persisted) return;
    played = false;
    model.ttStop();
    model.setState(model.ttInit());
  });
  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', event => {
    if (event.matches) {
      model.ttStop();
      model.setState({ ttNow: END_DAY, ttPlaying: false });
    }
  });
  render();
}
