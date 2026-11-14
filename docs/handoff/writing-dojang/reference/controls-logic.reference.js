// Reference only: the behaviour of Interactive 02 as built on the design canvas.
// It ports DOJANG main b34f80c src/ui/TouchControls.tsx (CompactCluster) and src/ui/wheel.ts.

const WHEEL = [
    { kind: 'leadFront', angle: 95, ring: 'lead', ko: 'lead' },
    { kind: 'leadRound', angle: 140, ring: 'lead', ko: 'lead' },
    { kind: 'leadSide', angle: 185, ring: 'lead', ko: 'cut' },
    { kind: 'front', angle: 92, ring: 'rear', ko: 'Ap' },
    { kind: 'round', angle: 127, ring: 'rear', ko: 'Dollyeo' },
    { kind: 'side', angle: 162, ring: 'rear', ko: 'Yeop' },
    { kind: 'back', angle: 197, ring: 'rear', ko: 'Dwi' }
];
const KICK = { front: ['Front', 'Ap'], round: ['Round', 'Dollyeo'], side: ['Side', 'Yeop'], back: ['Back', 'Dwi'], leadFront: ['L·Front', 'lead leg'], leadRound: ['L·Round', 'lead leg'], leadSide: ['L·Side', 'cut kick'] };
const NAME = { front: 'Front kick', round: 'Roundhouse kick', side: 'Side kick', back: 'Back kick', leadFront: 'Lead-leg front kick', leadRound: 'Lead-leg roundhouse kick', leadSide: 'Lead-leg side kick' };
const KEY = { front: 'K', round: 'L', side: 'U', back: 'I', leadFront: 'K', leadRound: 'L', leadSide: 'U' };
const HOLD_MS = 200, TAP_SLOP = 14, DEADZONE = 26, LEAD_EDGE = 86, HEAD_R = 160, HALF = 22, R = 52;
const SAY0 = 'Tap Kick to repeat your selected kick. Slide from it, or hold it, to open the wheel.';
function pickWheel(dx, dy) {
  const r = Math.hypot(dx, dy);
  if (r < DEADZONE) return null;
  let ang = (Math.atan2(-dy, dx) * 180) / Math.PI;
  if (ang < -60) ang += 360;
  const ring = r < LEAD_EDGE ? 'lead' : 'rear';
  let best = null, bestD = Infinity;
  for (const it of WHEEL) { if (it.ring !== ring) continue; const d = Math.abs(ang - it.angle); if (d < bestD) { bestD = d; best = it; } }
  if (!best || bestD > HALF + 8) return null;
  return { kind: best.kind, head: ring === 'rear' && r >= HEAD_R };
}
function keys(kind, head) {
  const mods = [];
  if (kind.indexOf('lead') === 0) mods.push('F');
  if (head) mods.push('E');
  if (!mods.length) return 'On a keyboard: ' + KEY[kind] + '.';
  if (mods.length === 1) return 'On a keyboard: hold ' + mods[0] + ' and press ' + KEY[kind] + '.';
  return 'On a keyboard: hold ' + mods.join(' and ') + ', then press ' + KEY[kind] + '.';
}

// Methods of the canvas board's component (DCLogic). Port the behaviour, not the structure.
class Reference {
  touchInit() {
    return { sel: 'round', high: false, down: '', open: false, pick: null, say: SAY0, baseL: 36, baseT: 229, knobX: 0, knobY: 0, stickOn: false };
  }
  ratio(el) { const s = el.closest('[data-screen]'); const w = s ? s.getBoundingClientRect().width : 667; return w / 667 || 1; }
  fire(kind, head, changed) {
    const h = head || this.state.high;
    const said = NAME[kind] + ' to the ' + (h ? 'head' : 'body') + '.' + (changed ? ' Kick now repeats it' + (head && !this.state.high ? ' at body height' : '') + '.' : '') + ' ' + keys(kind, h);
    this.setState({ say: said });
  }
  kickDown(e) {
    if (this.g) return;
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) {}
    const r = e.currentTarget.getBoundingClientRect();
    const timer = setTimeout(() => { if (this.g) this.setState({ open: true }); }, HOLD_MS);
    this.g = { id: e.pointerId, x: r.left + r.width / 2, y: r.top + r.height / 2, k: this.ratio(e.currentTarget), moved: false, timer };
    this.setState({ down: 'kick' });
  }
  kickMove(e) {
    const s = this.g;
    if (!s || s.id !== e.pointerId) return;
    const dx = (e.clientX - s.x) / s.k, dy = (e.clientY - s.y) / s.k;
    if (!s.moved && Math.hypot(dx, dy) > TAP_SLOP) { s.moved = true; this.setState({ open: true }); }
    if (s.moved || this.state.open) this.setState({ pick: pickWheel(dx, dy) });
  }
  kickUp(e) {
    const s = this.g;
    if (!s || s.id !== e.pointerId) return;
    clearTimeout(s.timer);
    const dx = (e.clientX - s.x) / s.k, dy = (e.clientY - s.y) / s.k;
    const p = pickWheel(dx, dy);
    const wasOpen = this.state.open || s.moved;
    this.g = null;
    this.setState({ down: '', open: false, pick: null });
    if (!wasOpen) this.fire(this.state.sel, false, false);
    else if (p) { const changed = p.kind !== this.state.sel; if (changed) this.setState({ sel: p.kind }); this.fire(p.kind, p.head, changed); }
    else if (Math.hypot(dx, dy) < TAP_SLOP) this.fire(this.state.sel, false, false);
    else this.setState({ say: 'Released away from the kicks, so nothing was thrown.' });
  }
  kickCancel() {
    if (this.g) clearTimeout(this.g.timer);
    this.g = null;
    this.setState({ down: '', open: false, pick: null });
  }
  kickKey(e) {
    if (e && e.detail === 0) this.fire(this.state.sel, false, false);
  }
  tapDown(e, name, say) {
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) {}
    this.setState({ down: name, say });
  }
  tapUp() { this.setState({ down: '' }); }
  keyTap(e, say) { if (e && e.detail === 0) this.setState({ say }); }
  toggleHigh() {
    const v = !this.state.high;
    this.setState({ high: v, say: v ? 'Kicks now go to the head. On a keyboard: hold E.' : 'Kicks go to the body again.' });
  }
  stickDown(e) {
    if (this.st) return;
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) {}
    const scr = e.currentTarget.closest('[data-screen]').getBoundingClientRect();
    const k = scr.width / 667;
    this.st = { id: e.pointerId, k, left: scr.left, top: scr.top, ox: (e.clientX - scr.left) / k, oy: (e.clientY - scr.top) / k };
    this.setState({ baseL: this.st.ox - R, baseT: this.st.oy - R, knobX: 0, knobY: 0, stickOn: true, say: 'Moving. On a keyboard: W, A, S and D, or the arrow keys.' });
  }
  stickMove(e) {
    const s = this.st;
    if (!s || s.id !== e.pointerId) return;
    const px = (e.clientX - s.left) / s.k, py = (e.clientY - s.top) / s.k;
    let dx = px - s.ox, dy = py - s.oy;
    const d = Math.hypot(dx, dy);
    if (d > R) { const f = (d - R) / d; s.ox += dx * f; s.oy += dy * f; dx = px - s.ox; dy = py - s.oy; }
    this.setState({ baseL: s.ox - R, baseT: s.oy - R, knobX: dx, knobY: dy });
  }
  stickUp(e) {
    if (!this.st || this.st.id !== e.pointerId) return;
    this.st = null;
    this.setState({ baseL: 36, baseT: 229, knobX: 0, knobY: 0, stickOn: false });
  }
  touchVals() {
    const st = this.state, pick = st.pick;
    const o = {
      open: st.open, clusterCls: st.open ? ' is-open' : '', say: st.say,
      kickCls: (st.down === 'kick' ? ' is-down' : '') + (st.high ? ' is-head' : ''), kickL: KICK[st.sel][0], kickS: KICK[st.sel][1], kickName: NAME[st.sel],
      guardCls: st.down === 'guard' ? ' is-down' : '', dashCls: st.down === 'dash' ? ' is-down' : '', punchCls: st.down === 'punch' ? ' is-down' : '',
      switchCls: st.down === 'switch' ? ' is-down' : '', highCls: (st.high ? ' is-on' : '') + (st.down === 'high' ? ' is-down' : ''),
      highLabel: st.high ? 'Head' : 'Body', highPressed: st.high ? 'true' : 'false',
      baseCls: st.stickOn ? ' is-active' : '', baseL: st.baseL, baseT: st.baseT, knobX: st.knobX, knobY: st.knobY,
      kickDown: (e) => this.kickDown(e), kickMove: (e) => this.kickMove(e), kickUp: (e) => this.kickUp(e), kickCancel: () => this.kickCancel(), kickKey: (e) => this.kickKey(e),
      guardDown: (e) => this.tapDown(e, 'guard', 'Guarding while you hold Guard. On a keyboard: hold Space.'), guardUp: () => this.tapUp(),
      guardKey: (e) => this.keyTap(e, 'Guarding while you hold Guard. On a keyboard: hold Space.'),
      dashDown: (e) => this.tapDown(e, 'dash', 'Dash. On a keyboard: Shift.'), dashKey: (e) => this.keyTap(e, 'Dash. On a keyboard: Shift.'),
      punchDown: (e) => this.tapDown(e, 'punch', 'Punch. On a keyboard: J.'), punchKey: (e) => this.keyTap(e, 'Punch. On a keyboard: J.'),
      switchDown: (e) => this.tapDown(e, 'switch', 'Switched stance. On a keyboard: Q.'), switchKey: (e) => this.keyTap(e, 'Switched stance. On a keyboard: Q.'),
      highDown: (e) => { try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) {} this.setState({ down: 'high' }); this.toggleHigh(); },
      highKey: (e) => { if (e && e.detail === 0) this.toggleHigh(); },
      tapUp: () => this.tapUp(),
      pauseTap: () => this.setState({ say: 'Pause. On a keyboard: Esc or P.' }), lockTap: () => this.setState({ say: 'Lock-on. On a keyboard: Tab.' }),
      stickDown: (e) => this.stickDown(e), stickMove: (e) => this.stickMove(e), stickUp: (e) => this.stickUp(e),
      stickKey: (e) => { if (e && e.detail === 0) this.setState({ say: 'Moving. On a keyboard: W, A, S and D, or the arrow keys.' }); },
    };
    for (const it of WHEEL) {
      const on = !!pick && pick.kind === it.kind;
      o['w_' + it.kind] = (on ? ' is-on' : '') + (on && pick.head ? ' is-head' : '') + (it.kind === st.sel ? ' is-sel' : '');
      o['ws_' + it.kind] = on && pick.head ? 'HEAD' : it.ko;
    }
    return o;
  }
}
