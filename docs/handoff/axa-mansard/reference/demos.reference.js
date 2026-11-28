// Reference logic for the three AXA Mansard demos, taken from the approved canvas prototype.
// Port the rules to TypeScript (src/ts/work/axa-mansard/), not this structure: the prototype ran in a React-like
// canvas runtime, so each demo exposes init (state), model (pure rules) and vals (the view model its template reads).
// Every table, code, ID, name and amount is fictional. Nothing here sends, stores or records anything.
//
// Run it as is with: const m = new AxaDemoModels(() => console.log(m.trVals().trStatus));
class AxaDemoModels {
  constructor(onChange) {
    this.state = Object.assign({}, this.trInit(), this.stInit(), this.ttInit());
    this.onChange = onChange || (() => {});
  }

  setState(patch, done) {
    Object.assign(this.state, typeof patch === 'function' ? patch(this.state) : patch);
    this.onChange();
    if (done) done();
  }

  // ---------------------------------------------------------------- Demo 1: request translator
  // Every table, code and ID is invented for the demo.
  trTables() {
    return {
      colour: [
        { id: 'C-0031', name: 'White' }, { id: 'C-0058', name: 'Black' }, { id: 'C-0107', name: 'Silver' },
        { id: 'C-0123', name: 'Red' }, { id: 'C-0177', name: 'Blue' }, { id: 'C-0214', name: 'Charcoal grey' },
        { id: 'C-0260', name: 'Green' }, { id: 'C-0342', name: 'SILVER ' }, { id: 'C-0391', name: 'Purple', recent: true },
      ],
      body: [
        { id: 'B-11', name: 'Saloon' }, { id: 'B-14', name: 'SUV' }, { id: 'B-17', name: 'Pickup' },
        { id: 'B-20', name: 'Bus' }, { id: 'B-23', name: 'Motorcycle' },
      ],
      risk: [
        { id: 'R-301', name: 'Contractors all risks' }, { id: 'R-305', name: 'Plant and machinery' },
        { id: 'R-309', name: 'Electronic equipment' }, { id: 'R-312', name: 'Machinery breakdown' },
      ],
      occupation: [
        { id: 'O-1001', name: 'Accountant' }, { id: 'O-1102', name: 'Engineer' }, { id: 'O-1204', name: 'Teacher' },
        { id: 'O-1310', name: 'Nurse' }, { id: 'O-1415', name: 'Driver' }, { id: 'O-1520', name: 'Trader' },
        { id: 'O-1608', name: 'Data analyst', recent: true },
      ],
    };
  }

  trProductDefs() {
    return {
      motor: { label: 'Motor', code: 'MTR', fields: [
        { id: 'colour', label: 'Colour', table: 'colour', key: 'COLOUR_ID' },
        { id: 'body', label: 'Body type', table: 'body', key: 'BODY_TYPE_ID' },
      ] },
      engineering: { label: 'Engineering', code: 'ENG', fields: [
        { id: 'risk', label: 'Risk category', table: 'risk', key: 'RISK_CLASS_ID' },
        { id: 'equip', label: 'Equipment colour', table: 'colour', key: 'EQUIP_COLOUR_ID', shared: true },
      ] },
      life: { label: 'Term life', code: 'TLF', bens: true, fields: [
        { id: 'occ', label: 'Occupation', table: 'occupation', key: 'OCCUPATION_ID' },
      ] },
    };
  }

  trInit() {
    return {
      trProduct: 'motor',
      trValues: { colour: 'Charcoal grey', body: 'Saloon', risk: 'Plant and machinery', equip: 'Silver', occ: 'Teacher' },
      trBens: [{ name: 'Ada Obi', share: '60' }, { name: 'Chidi Obi', share: '40' }],
    };
  }

  // Exact match after trimming and ignoring case. A miss reloads the table once; duplicates resolve
  // to the lowest ID, so the answer never depends on the order rows come back in.
  trLookup(table, raw) {
    const norm = String(raw).trim().toLowerCase();
    if (!norm) return { kind: 'empty', norm };
    const hits = this.trTables()[table].filter((r) => r.name.trim().toLowerCase() === norm);
    if (!hits.length) return { kind: 'unknown', norm };
    const pick = hits.slice().sort((a, b) => (a.id < b.id ? -1 : 1))[0];
    if (hits.length > 1) return { kind: 'duplicate', norm, id: pick.id, count: hits.length };
    if (pick.recent) return { kind: 'reloaded', norm, id: pick.id };
    return { kind: 'found', norm, id: pick.id };
  }

  trBenCheck(bens) {
    const SLOTS = 3;
    const shares = bens.map((b) => (/^\d{1,3}$/.test(String(b.share).trim()) ? Number(String(b.share).trim()) : NaN));
    const total = shares.reduce((a, b) => a + (Number.isNaN(b) ? 0 : b), 0);
    const nameMissing = bens.findIndex((b) => !String(b.name).trim());
    const shareBad = shares.findIndex((x) => Number.isNaN(x) || x > 100);
    let problem = '';
    if (!bens.length) problem = 'At least one beneficiary is needed. Held.';
    else if (bens.length > SLOTS) problem = `${bens.length} beneficiaries, but the core has ${SLOTS} slots. Held.`;
    else if (nameMissing >= 0) problem = `Beneficiary ${nameMissing + 1} has no name. Held.`;
    else if (shareBad >= 0) problem = `Beneficiary ${shareBad + 1} needs a whole-number share. Held.`;
    else if (total !== 100) problem = `Shares add up to ${total}%. Held.`;
    return { SLOTS, shares, total, problem, nameMissing, shareBad };
  }

  trModel() {
    const st = this.state;
    const def = this.trProductDefs()[st.trProduct];
    const checks = [];
    const record = [{ key: 'PRODUCT_CODE', value: def.code, cls: '' }];
    let problems = 0;
    const fields = def.fields.map((f) => {
      const raw = st.trValues[f.id];
      const r = this.trLookup(f.table, raw);
      const bad = r.kind === 'unknown' || r.kind === 'empty';
      if (bad) problems += 1;
      let result;
      if (r.kind === 'found') result = `Found · ${r.id}`;
      else if (r.kind === 'reloaded') result = `Not cached. Found after one reload · ${r.id}`;
      else if (r.kind === 'duplicate') result = `${r.count} matches. Using the lowest ID · ${r.id}`;
      else if (r.kind === 'unknown') result = 'No match after one reload. Held, with no default ID.';
      else result = 'Required. Held.';
      if (f.shared && !bad) result += ' (motor’s colour table)';
      checks.push({ name: f.label, flow: r.kind === 'empty' ? '“” (empty)' : `“${raw}” → ${r.norm}`, result, cls: bad ? ' is-held' : '' });
      record.push({ key: f.key, value: bad ? 'Held' : r.id, cls: bad ? ' is-held' : '' });
      return { id: f.id, label: f.label, value: raw, invalid: bad ? 'true' : 'false', cls: bad ? ' is-invalid' : '' };
    });
    let ben = null;
    if (def.bens) {
      ben = this.trBenCheck(st.trBens);
      if (ben.problem) problems += 1;
      const n = st.trBens.length;
      checks.push({
        name: 'Beneficiaries',
        flow: `A list of ${n} → ${n > ben.SLOTS ? `${ben.SLOTS} fixed slots` : `slot${n === 1 ? '' : 's'} 1${n > 1 ? `–${n}` : ''} of ${ben.SLOTS}`}`,
        result: ben.problem || 'Shares add up to 100%',
        cls: ben.problem ? ' is-held' : '',
      });
      for (let i = 0; i < ben.SLOTS; i += 1) {
        const b = st.trBens[i];
        const empty = !b;
        record.push({ key: `BEN${i + 1}_NAME`, value: empty ? 'Empty' : (ben.problem ? 'Held' : String(b.name).trim().toUpperCase()), cls: empty ? ' is-empty' : (ben.problem ? ' is-held' : '') });
        record.push({ key: `BEN${i + 1}_PCT`, value: empty ? 'Empty' : (ben.problem ? 'Held' : String(ben.shares[i])), cls: empty ? ' is-empty' : (ben.problem ? ' is-held' : '') });
      }
    }
    const mapped = record.filter((r) => !r.cls).length;
    const status = problems
      ? `Held. ${problems} problem${problems === 1 ? '' : 's'} to fix before sending.`
      : `Ready to send. ${mapped} values translated.`;
    return { def, fields, checks, record, problems, status, ben };
  }

  trSet(patch) { this.setState(patch); }
  trSetValue(id, v) { this.setState({ trValues: Object.assign({}, this.state.trValues, { [id]: v }) }); }
  trSetBen(i, key, v) {
    const bens = this.state.trBens.map((b, j) => (j === i ? Object.assign({}, b, { [key]: v }) : b));
    this.setState({ trBens: bens });
  }

  trTryList() {
    const base = this.trInit();
    return [
      { label: 'Extra spaces and capitals', patch: { trProduct: 'motor', trValues: Object.assign({}, base.trValues, { colour: '   charcoal GREY  ' }) } },
      { label: 'A typo', patch: { trProduct: 'motor', trValues: Object.assign({}, base.trValues, { colour: 'Charcol grey' }) } },
      { label: 'A duplicate name', patch: { trProduct: 'engineering', trValues: Object.assign({}, base.trValues, { equip: 'silver' }) } },
      { label: 'A newly added value', patch: { trProduct: 'motor', trValues: Object.assign({}, base.trValues, { colour: 'Purple' }) } },
      { label: 'Four beneficiaries', patch: { trProduct: 'life', trBens: [{ name: 'Ada Obi', share: '40' }, { name: 'Chidi Obi', share: '30' }, { name: 'Emeka Obi', share: '20' }, { name: 'Ngozi Obi', share: '10' }] } },
      { label: 'Shares under 100%', patch: { trProduct: 'life', trBens: [{ name: 'Ada Obi', share: '60' }, { name: 'Chidi Obi', share: '30' }] } },
    ];
  }

  trVals() {
    const m = this.trModel();
    const st = this.state;
    const defs = this.trProductDefs();
    return {
      trProducts: Object.keys(defs).map((k) => ({
        label: defs[k].label, pressed: String(st.trProduct === k), cls: st.trProduct === k ? ' is-on' : '',
        pick: () => this.trSet({ trProduct: k }),
      })),
      trFields: m.fields.map((f) => Object.assign({}, f, { change: (e) => this.trSetValue(f.id, e.target.value) })),
      trIsLife: !!m.def.bens,
      trBens: st.trBens.map((b, i) => {
        const nameBad = m.ben && m.ben.nameMissing === i;
        const shareBad = m.ben && m.ben.shareBad === i;
        return {
          n: i + 1, name: b.name, share: b.share,
          nameInvalid: String(!!nameBad), nameCls: nameBad ? ' is-invalid' : '',
          shareInvalid: String(!!shareBad), shareCls: shareBad ? ' is-invalid' : '',
          changeName: (e) => this.trSetBen(i, 'name', e.target.value),
          changeShare: (e) => this.trSetBen(i, 'share', e.target.value),
          remove: () => this.setState({ trBens: this.state.trBens.filter((_, j) => j !== i) }),
        };
      }),
      trAddBen: () => this.setState({ trBens: this.state.trBens.concat([{ name: '', share: '0' }]) }),
      trAddDisabled: st.trBens.length >= 5,
      trChecks: m.checks,
      trRecord: m.record,
      trStatus: m.status,
      trStatusCls: m.problems ? ' is-held' : ' is-ok',
      trTries: this.trTryList().map((t) => ({ label: t.label, run: () => this.trSet(t.patch) })),
      trReset: () => this.trSet(this.trInit()),
    };
  }
  // ---------------------------------------------------------------- Demo 2: settlement allocation
  // Money is whole kobo and shares are basis points (1% = 100), so every sum is exact integer maths.
  stInit() {
    return {
      stAmount: '250,000.00',
      stRows: [
        { id: 1, name: 'Adaeze Okafor', acct: '4821', share: '50', isDefault: true, paid: false, removed: false, paidKobo: 0 },
        { id: 2, name: 'Tunde Okafor', acct: '7730', share: '30', paid: false, removed: false, paidKobo: 0 },
        { id: 3, name: 'Ngozi Okafor', acct: '1194', share: '20', paid: false, removed: false, paidKobo: 0 },
      ],
      stNext: 4,
    };
  }

  stKobo(text) {
    const s = String(text).replace(/[,\s]/g, '');
    const m = /^(\d{1,9})(?:\.(\d{0,2}))?$/.exec(s);
    if (!m) return null;
    const kobo = Number(m[1]) * 100 + Number(((m[2] || '') + '00').slice(0, 2));
    return kobo > 0 ? kobo : null;
  }

  stBp(text) {
    const m = /^(\d{1,3})(?:\.(\d{1,2}))?$/.exec(String(text).trim());
    if (!m) return null;
    const bp = Number(m[1]) * 100 + Number(((m[2] || '') + '00').slice(0, 2));
    return bp <= 10000 ? bp : null;
  }

  stNaira(kobo) {
    const neg = kobo < 0;
    const k = Math.abs(kobo);
    const whole = String(Math.floor(k / 100)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `${neg ? '−' : ''}₦${whole}.${String(k % 100).padStart(2, '0')}`;
  }

  stPct(bp) {
    const whole = Math.floor(bp / 100);
    const frac = bp % 100;
    return frac ? `${whole}.${String(frac).padStart(2, '0').replace(/0$/, '')}` : String(whole);
  }

  // Largest remainder: everyone gets their floor, leftover kobo go to the biggest remainders, ties
  // to the earlier row. Paid rows keep their recorded amount, so rounding can never move them.
  stModel() {
    const st = this.state;
    const total = this.stKobo(st.stAmount);
    const active = st.stRows.filter((r) => !r.removed);
    const bps = st.stRows.map((r) => this.stBp(r.share));
    const amounts = st.stRows.map(() => null);
    const extra = st.stRows.map(() => 0);
    let sumBp = 0;
    let badShare = false;
    st.stRows.forEach((r, i) => {
      if (r.removed) return;
      if (bps[i] === null) badShare = true; else sumBp += bps[i];
    });
    const accts = {};
    let dupAcct = null;
    let badAcct = false;
    active.forEach((r) => {
      if (!/^\d{4}$/.test(r.acct)) { badAcct = true; return; }
      if (accts[r.acct]) dupAcct = r.acct;
      accts[r.acct] = true;
    });
    if (total !== null && !badShare) {
      const rem = [];
      let allocated = 0;
      st.stRows.forEach((r, i) => {
        if (r.removed) return;
        if (r.paid) { amounts[i] = r.paidKobo; allocated += r.paidKobo; return; }
        const exact = total * bps[i];
        amounts[i] = Math.floor(exact / 10000);
        allocated += amounts[i];
        rem.push({ i, r: exact % 10000 });
      });
      if (sumBp === 10000) {
        let left = total - allocated;
        rem.sort((a, b) => b.r - a.r || a.i - b.i);
        for (let k = 0; left > 0 && rem.length; k = (k + 1) % rem.length) { amounts[rem[k].i] += 1; extra[rem[k].i] += 1; left -= 1; }
      }
    }
    const allocated = amounts.reduce((a, b, i) => a + (st.stRows[i].removed || b === null ? 0 : b), 0);
    const diff = total === null ? null : total - allocated;
    let status;
    let ok = false;
    if (total === null) status = 'Enter the settlement in naira, up to two decimal places.';
    else if (badShare) status = 'Each share must be a number from 0 to 100, with up to two decimals.';
    else if (badAcct) status = 'Each account needs its last four digits.';
    else if (dupAcct) status = `Two beneficiaries use the account ending ${dupAcct}. An account can only be paid once.`;
    else if (sumBp < 10000) status = `Shares add up to ${this.stPct(sumBp)}%. ${this.stNaira(diff)} is still unallocated.`;
    else if (sumBp > 10000) status = `Shares add up to ${this.stPct(sumBp)}%, ${this.stNaira(-diff)} more than the settlement.`;
    else if (diff !== 0) status = 'The paid amounts no longer fit these shares. Adjust the unpaid ones.';
    else {
      ok = true;
      const got = st.stRows.map((r, i) => (extra[i] ? r.name.split(' ')[0] : null)).filter(Boolean);
      const leftover = extra.reduce((a, b) => a + b, 0);
      status = leftover
        ? `Reconciled. ${leftover} kobo of rounding went to ${got.join(' and ')}, the largest remainder${got.length === 1 ? '' : 's'}.`
        : 'Reconciled, with no rounding left over.';
      if (st.stRows.some((r) => r.paid && !r.removed)) status += ' Paid amounts stay fixed.';
    }
    return { total, amounts, extra, sumBp, ok, status, diff, allocated, dupAcct, badShare, bps, activeCount: active.length };
  }

  stPatchRow(id, patch) {
    this.setState({ stRows: this.state.stRows.map((r) => (r.id === id ? Object.assign({}, r, patch) : r)) });
  }

  stSplitEqually() {
    const live = this.state.stRows.filter((r) => !r.removed);
    const n = live.length;
    if (!n) return;
    const base = Math.floor(10000 / n);
    let left = 10000 - base * n;
    const shares = {};
    live.forEach((r) => { shares[r.id] = base + (left > 0 ? 1 : 0); left -= 1; });
    this.setState({ stRows: this.state.stRows.map((r) => (r.removed ? r : Object.assign({}, r, { share: this.stPct(shares[r.id]) }))) });
  }

  stTryList() {
    const base = this.stInit();
    return [
      { label: 'An awkward amount', patch: { stAmount: '99,999.99', stRows: base.stRows } },
      { label: 'Three equal shares', run: () => { this.setState({ stAmount: '100,000.01', stRows: base.stRows }, () => this.stSplitEqually()); } },
      { label: 'The same account twice', patch: { stAmount: base.stAmount, stRows: base.stRows.map((r) => (r.id === 3 ? Object.assign({}, r, { acct: '4821' }) : r)) } },
      { label: 'Shares under 100%', patch: { stAmount: base.stAmount, stRows: base.stRows.map((r) => (r.id === 3 ? Object.assign({}, r, { share: '15' }) : r)) } },
    ];
  }

  stVals() {
    const m = this.stModel();
    const st = this.state;
    const anyPaid = st.stRows.some((r) => r.paid);
    const NEW = [{ name: 'Emeka Okafor', acct: '5502' }, { name: 'Ifeoma Okafor', acct: '3318' }, { name: 'Bisi Okafor', acct: '6045' }];
    return {
      stAmount: st.stAmount,
      stAmountLocked: anyPaid,
      stAmountInvalid: String(m.total === null),
      stAmountCls: m.total === null ? ' is-invalid' : '',
      stChangeAmount: (e) => this.setState({ stAmount: e.target.value }),
      stSplit: () => this.stSplitEqually(),
      stSplitDisabled: anyPaid,
      stAdd: () => {
        const n = NEW[(this.state.stNext - 4) % NEW.length];
        this.setState({ stRows: this.state.stRows.concat([{ id: this.state.stNext, name: n.name, acct: n.acct, share: '0', paid: false, removed: false, paidKobo: 0 }]), stNext: this.state.stNext + 1 });
      },
      stAddDisabled: m.activeCount >= 4,
      stRows: st.stRows.map((r, i) => {
        const shareBad = !r.removed && m.bps[i] === null;
        const acctBad = !r.removed && (!/^\d{4}$/.test(r.acct) || r.acct === m.dupAcct);
        const amt = m.amounts[i];
        return {
          name: r.name,
          badge: r.isDefault ? 'Default' : (r.removed ? 'Removed, kept on record' : ''),
          acct: r.acct, share: r.share,
          amount: r.removed ? '–' : (amt === null ? '–' : this.stNaira(amt)),
          locked: r.paid || r.removed,
          shareInvalid: String(shareBad), shareCls: shareBad ? ' is-invalid' : '',
          acctInvalid: String(acctBad), acctCls: acctBad ? ' is-invalid' : '',
          cls: (r.paid ? ' is-paid' : '') + (r.removed ? ' is-removed' : ''),
          canPay: !r.paid && !r.removed,
          payDisabled: !m.ok,
          canRemove: !r.paid && !r.removed && !r.isDefault,
          removed: r.removed,
          paid: r.paid,
          changeAcct: (e) => this.stPatchRow(r.id, { acct: e.target.value.replace(/\D/g, '').slice(0, 4) }),
          changeShare: (e) => this.stPatchRow(r.id, { share: e.target.value }),
          pay: () => { const mm = this.stModel(); if (mm.ok) this.stPatchRow(r.id, { paid: true, paidKobo: mm.amounts[i] }); },
          remove: () => this.stPatchRow(r.id, { removed: true }),
          restore: () => this.stPatchRow(r.id, { removed: false }),
        };
      }),
      stAllocated: this.stNaira(m.allocated),
      stTotal: m.total === null ? '–' : this.stNaira(m.total),
      stDiff: m.diff === null ? '–' : this.stNaira(m.diff),
      stStatus: m.status,
      stStatusCls: m.ok ? ' is-ok' : ' is-held',
      stTries: this.stTryList().map((t) => ({ label: t.label, run: t.run || (() => this.setState(t.patch)) })),
      stReset: () => this.setState(this.stInit()),
    };
  }
  // ---------------------------------------------------------------- Demo 3: turnaround clock
  // Synthetic days. The clock starts on complete documents, pauses on a request, resumes on a
  // receipt and stops at settlement; anything else is recorded as ignored, never as time.
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
    const on = {};
    this.ttDefs().forEach((d) => { if (!d.fixed) on[d.id] = d.on; });
    return { ttOn: on, ttNow: 14, ttPlaying: false };
  }

  ttRun(onMap) {
    const H = 14;
    const segs = [];
    const effects = {};
    let state = 'idle';
    let from = null;
    let start = null;
    let end = null;
    this.ttDefs().forEach((e) => {
      const live = e.fixed || onMap[e.id];
      if (!live) { effects[e.id] = { text: 'Switched off', kind: 'off' }; return; }
      const set = (text, kind) => { effects[e.id] = { text, kind }; };
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
  ttTotals(run, now) {
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

  ttDays(n) {
    const v = Math.round(n * 2) / 2;
    const txt = Number.isInteger(v) ? String(v) : `${Math.floor(v)}½`;
    return `${txt} day${v === 1 ? '' : 's'}`;
  }

  ttTogglePlay() {
    if (this.ttTimer) { clearInterval(this.ttTimer); this.ttTimer = null; this.setState({ ttPlaying: false }); return; }
    const reduce = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { this.setState({ ttNow: 14, ttPlaying: false }); return; }
    const from = this.state.ttNow >= 14 ? 0 : this.state.ttNow;
    this.setState({ ttNow: from, ttPlaying: true });
    this.ttTimer = setInterval(() => {
      const next = Math.min(14, this.state.ttNow + 0.25);
      if (next >= 14) { clearInterval(this.ttTimer); this.ttTimer = null; this.setState({ ttNow: 14, ttPlaying: false }); }
      else this.setState({ ttNow: next });
    }, 70);
  }

  ttStop() { if (this.ttTimer) { clearInterval(this.ttTimer); this.ttTimer = null; } }

  ttVals() {
    const st = this.state;
    const run = this.ttRun(st.ttOn);
    const now = st.ttNow;
    const t = this.ttTotals(run, now);
    const pct = (d) => `${(d / run.H * 100).toFixed(4)}%`;
    const parts = (a, b, cls) => {
      const out = [];
      const mid = Math.min(Math.max(now, a), b);
      if (mid > a) out.push({ from: pct(a), width: pct(mid - a), cls });
      return out;
    };
    const activeSegs = [];
    run.segs.forEach((s) => { if (s.kind === 'run') activeSegs.push(...parts(s.a, s.b, '')); });
    const endDay = run.end !== null ? run.end : (run.start !== null ? run.H : null);
    const elapsedSegs = run.start === null ? [] : parts(run.start, endDay, ' is-elapsed');
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
      ttScrub: (e) => { this.ttStop(); this.setState({ ttNow: Number(e.target.value), ttPlaying: false }); },
      ttReset: () => { this.ttStop(); this.setState(this.ttInit()); },
    };
  }
}

if (typeof module !== 'undefined') module.exports = { AxaDemoModels };
