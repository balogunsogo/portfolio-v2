import { DemoState, type ValueChange } from './dom.js';
import { el, hook, button, input, update, status } from './dom.js';

interface SettlementRow { id: number; name: string; acct: string; share: string; isDefault?: boolean; paid: boolean; removed: boolean; paidKobo: number }
interface SettlementState { stAmount: string; stRows: SettlementRow[]; stNext: number }
// Money is integer kobo; shares are integer basis points.
export class Settlement extends DemoState<SettlementState> {
  constructor(onChange: () => void) {
    super({ stAmount: '', stRows: [], stNext: 4 }, onChange);
    this.state = this.stInit();
  }
  stInit(): SettlementState {
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

  stKobo(text: string) {
    const s = String(text).replace(/[,\s]/g, '');
    const m = /^(\d{1,9})(?:\.(\d{0,2}))?$/.exec(s);
    if (!m) return null;
    const kobo = Number(m[1]) * 100 + Number(((m[2] || '') + '00').slice(0, 2));
    return kobo > 0 ? kobo : null;
  }

  stBp(text: string) {
    const m = /^(\d{1,3})(?:\.(\d{1,2}))?$/.exec(String(text).trim());
    if (!m) return null;
    const bp = Number(m[1]) * 100 + Number(((m[2] || '') + '00').slice(0, 2));
    return bp <= 10000 ? bp : null;
  }

  stNaira(kobo: number) {
    const neg = kobo < 0;
    const k = Math.abs(kobo);
    const whole = String(Math.floor(k / 100)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `${neg ? '−' : ''}₦${whole}.${String(k % 100).padStart(2, '0')}`;
  }

  stPct(bp: number) {
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
    const amounts: (number | null)[] = st.stRows.map(() => null);
    const extra = st.stRows.map(() => 0);
    let sumBp = 0;
    let badShare = false;
    st.stRows.forEach((r, i) => {
      if (r.removed) return;
      if (bps[i] === null) badShare = true; else sumBp += bps[i]!;
    });
    const accts: Record<string, boolean> = {};
    let dupAcct: string | null = null;
    let badAcct = false;
    active.forEach((r) => {
      if (!/^\d{4}$/.test(r.acct)) { badAcct = true; return; }
      if (accts[r.acct]) dupAcct = r.acct;
      accts[r.acct] = true;
    });
    if (total !== null && !badShare) {
      const rem: { i: number; r: number }[] = [];
      let allocated = 0;
      st.stRows.forEach((r, i) => {
        if (r.removed) return;
        if (r.paid) { amounts[i] = r.paidKobo; allocated += r.paidKobo; return; }
        const exact = total * bps[i]!;
        amounts[i] = Math.floor(exact / 10000);
        allocated += amounts[i]!;
        rem.push({ i, r: exact % 10000 });
      });
      if (sumBp === 10000) {
        let left = total - allocated;
        rem.sort((a, b) => b.r - a.r || a.i - b.i);
        for (let k = 0; left > 0 && rem.length; k = (k + 1) % rem.length) { amounts[rem[k].i]! += 1; extra[rem[k].i] += 1; left -= 1; }
      }
    }
    const allocated = amounts.reduce<number>((a, b, i) => a + (st.stRows[i].removed || b === null ? 0 : b), 0);
    const diff = total === null ? null : total - allocated;
    let status;
    let ok = false;
    if (total === null) status = 'Enter the settlement in naira, up to two decimal places.';
    else if (badShare) status = 'Each share must be a number from 0 to 100, with up to two decimals.';
    else if (badAcct) status = 'Each account needs its last four digits.';
    else if (dupAcct) status = `Two beneficiaries use the account ending ${dupAcct}. An account can only be paid once.`;
    else if (sumBp < 10000) status = `Shares add up to ${this.stPct(sumBp)}%. ${this.stNaira(diff!)} is still unallocated.`;
    else if (sumBp > 10000) status = `Shares add up to ${this.stPct(sumBp)}%, ${this.stNaira(-diff!)} more than the settlement.`;
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

  stPatchRow(id: number, patch: Partial<SettlementRow>) {
    this.setState({ stRows: this.state.stRows.map((r) => (r.id === id ? Object.assign({}, r, patch) : r)) });
  }

  stSplitEqually() {
    const live = this.state.stRows.filter((r) => !r.removed);
    const n = live.length;
    if (!n) return;
    const base = Math.floor(10000 / n);
    let left = 10000 - base * n;
    const shares: Record<number, number> = {};
    live.forEach((r) => { shares[r.id] = base + (left > 0 ? 1 : 0); left -= 1; });
    this.setState({ stRows: this.state.stRows.map((r) => (r.removed ? r : Object.assign({}, r, { share: this.stPct(shares[r.id]) }))) });
  }

  stTryList(): { label: string; patch?: Partial<SettlementState>; run?: () => void }[] {
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
      stChangeAmount: (e: ValueChange) => this.setState({ stAmount: e.target.value }),
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
          changeAcct: (e: ValueChange) => this.stPatchRow(r.id, { acct: e.target.value.replace(/\D/g, '').slice(0, 4) }),
          changeShare: (e: ValueChange) => this.stPatchRow(r.id, { share: e.target.value }),
          pay: () => { const mm = this.stModel(); if (mm.ok) this.stPatchRow(r.id, { paid: true, paidKobo: mm.amounts[i]! }); },
          remove: () => this.stPatchRow(r.id, { removed: true }),
          restore: () => this.stPatchRow(r.id, { removed: false }),
        };
      }),
      stAllocated: this.stNaira(m.allocated),
      stTotal: m.total === null ? '–' : this.stNaira(m.total),
      stDiff: m.diff === null ? '–' : this.stNaira(m.diff),
      stStatus: m.status,
      stStatusCls: m.ok ? ' is-ok' : ' is-held',
      stTries: this.stTryList().map((t) => ({ label: t.label, run: t.run || (() => this.setState(t.patch!)) })),
      stReset: () => this.setState(this.stInit()),
    };
  }
}

export function initSettlement(root: HTMLElement): void {
  const model = new Settlement(() => update(root, render));
  const amount = hook<HTMLInputElement>(root, 'amount');
  const split = hook<HTMLButtonElement>(root, 'split');
  const add = hook<HTMLButtonElement>(root, 'add');
  const rows = hook(root, 'rows');
  const message = hook(root, 'status');

  function render(): void {
    const v = model.stVals();
    amount.disabled = false;
    amount.readOnly = v.stAmountLocked;
    if (amount.value !== v.stAmount) amount.value = v.stAmount;
    amount.className = `axa-input axa-input--money${v.stAmountCls}`;
    amount.setAttribute('aria-invalid', v.stAmountInvalid);
    split.disabled = v.stSplitDisabled;
    add.disabled = v.stAddDisabled;
    rows.replaceChildren(...v.stRows.map((r, i) => {
      const row = el('li', `axa-st__row${r.cls}`);
      const who = el('div', 'axa-st__who');
      const name = el('p', 'axa-st__name', r.name);
      name.append(el('span', 'axa-st__badge', r.badge));
      const acct = el('label', 'axa-st__acct');
      const acctInput = input(r.acct, r.acctInvalid, r.changeAcct, `row-${i}-acct`, ` axa-input--acct${r.acctCls}`);
      acctInput.inputMode = 'numeric';
      acctInput.maxLength = 4;
      acctInput.readOnly = r.locked;
      acct.append(el('span', '', 'Account ending'), acctInput);
      who.append(name, acct);
      const share = el('label', 'axa-st__share');
      const shareInput = input(r.share, r.shareInvalid, r.changeShare, `row-${i}-share`, ` axa-input--num${r.shareCls}`);
      shareInput.inputMode = 'decimal';
      shareInput.readOnly = r.locked;
      const unit = el('span', 'axa-st__unit', '%');
      unit.setAttribute('aria-hidden', 'true');
      share.append(el('span', 'visually-hidden', `Share for ${r.name}, percent`), shareInput, unit);
      const actions = el('div', 'axa-st__acts');
      if (r.canPay) {
        const pay = button('Mark paid', () => {
          r.pay();
          if (model.state.stRows[i].paid) amount.focus({ preventScroll: true });
        }, `row-${i}-pay`);
        pay.disabled = r.payDisabled;
        actions.append(pay);
      }
      if (r.canRemove) actions.append(button('Remove', r.remove, `row-${i}-remove`, 'axa-btn axa-btn--quiet'));
      if (r.removed) {
        const restore = button('Restore', r.restore, `row-${i}-remove`);
        restore.disabled = v.stAddDisabled;
        actions.append(restore);
      }
      if (r.paid) actions.append(el('p', 'axa-st__note', 'Paid, locked'));
      row.append(who, share, el('p', 'axa-st__amt', r.amount), actions);
      return row;
    }));
    hook(root, 'allocated').textContent = v.stAllocated;
    hook(root, 'total').textContent = v.stTotal;
    hook(root, 'difference').textContent = v.stDiff;
    status(message, v.stStatus, v.stStatusCls);
  }

  amount.addEventListener('input', () => model.stVals().stChangeAmount({ target: amount }));
  split.addEventListener('click', () => model.stVals().stSplit());
  add.addEventListener('click', () => model.stVals().stAdd());
  root.querySelectorAll<HTMLButtonElement>('[data-axa-try]').forEach((node, i) => {
    node.disabled = false;
    node.addEventListener('click', () => model.stVals().stTries[i].run());
  });
  const reset = hook<HTMLButtonElement>(root, 'reset');
  reset.disabled = false;
  reset.addEventListener('click', () => model.stVals().stReset());
  render();
}
