import { DemoState, type ValueChange } from './dom.js';
import { el, hook, button, input, update, status } from './dom.js';

interface Beneficiary { name: string; share: string }
interface Product { label: string; code: string; bens?: boolean; fields: { id: string; label: string; table: string; key: string; shared?: boolean }[] }
interface TranslatorState { trProduct: string; trValues: Record<string, string>; trBens: Beneficiary[] }
// Fictional contracts and lookup data, ported verbatim from the approved model.
export class Translator extends DemoState<TranslatorState> {
  constructor(onChange: () => void) {
    super({ trProduct: '', trValues: {}, trBens: [] }, onChange);
    this.state = this.trInit();
  }
  trTables(): Record<string, { id: string; name: string; recent?: boolean }[]> {
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

  trProductDefs(): Record<string, Product> {
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
  trLookup(table: string, raw: string) {
    const norm = String(raw).trim().toLowerCase();
    if (!norm) return { kind: 'empty', norm };
    const hits = this.trTables()[table].filter((r) => r.name.trim().toLowerCase() === norm);
    if (!hits.length) return { kind: 'unknown', norm };
    const pick = hits.slice().sort((a, b) => (a.id < b.id ? -1 : 1))[0];
    if (hits.length > 1) return { kind: 'duplicate', norm, id: pick.id, count: hits.length };
    if (pick.recent) return { kind: 'reloaded', norm, id: pick.id };
    return { kind: 'found', norm, id: pick.id };
  }

  trBenCheck(bens: Beneficiary[]) {
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
    const checks: { name: string; flow: string; result: string; cls: string }[] = [];
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
      record.push({ key: f.key, value: bad ? 'Held' : r.id!, cls: bad ? ' is-held' : '' });
      return { id: f.id, label: f.label, value: raw, invalid: bad ? 'true' : 'false', cls: bad ? ' is-invalid' : '' };
    });
    let ben: ReturnType<Translator["trBenCheck"]> | null = null;
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

  trSet(patch: Partial<TranslatorState>) { this.setState(patch); }
  trSetValue(id: string, v: string) { this.setState({ trValues: Object.assign({}, this.state.trValues, { [id]: v }) }); }
  trSetBen(i: number, key: keyof Beneficiary, v: string) {
    const bens = this.state.trBens.map((b, j) => (j === i ? Object.assign({}, b, { [key]: v }) : b));
    this.setState({ trBens: bens });
  }

  trTryList(): { label: string; patch: Partial<TranslatorState> }[] {
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
      trFields: m.fields.map((f) => Object.assign({}, f, { change: (e: ValueChange) => this.trSetValue(f.id, e.target.value) })),
      trIsLife: !!m.def.bens,
      trBens: st.trBens.map((b, i) => {
        const nameBad = m.ben && m.ben.nameMissing === i;
        const shareBad = m.ben && m.ben.shareBad === i;
        return {
          n: i + 1, name: b.name, share: b.share,
          nameInvalid: String(!!nameBad), nameCls: nameBad ? ' is-invalid' : '',
          shareInvalid: String(!!shareBad), shareCls: shareBad ? ' is-invalid' : '',
          changeName: (e: ValueChange) => this.trSetBen(i, 'name', e.target.value),
          changeShare: (e: ValueChange) => this.trSetBen(i, 'share', e.target.value),
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
}

export function initTranslator(root: HTMLElement): void {
  const model = new Translator(() => update(root, render));
  const fields = hook(root, 'fields');
  const checks = hook(root, 'checks');
  const record = hook(root, 'record');
  const message = hook(root, 'status');
  const products = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-axa-product]'));

  function render(): void {
    const v = model.trVals();
    products.forEach((node, i) => {
      node.disabled = false;
      node.className = `axa-opt${v.trProducts[i].cls}`;
      node.setAttribute('aria-pressed', v.trProducts[i].pressed);
    });
    const nodes: HTMLElement[] = v.trFields.map(f => {
      const label = el('label', 'axa-field');
      label.append(el('span', 'axa-field__label', f.label), input(f.value, f.invalid, f.change, f.id, f.cls));
      return label;
    });
    if (v.trIsLife) {
      const bens = el('div', 'axa-bens');
      bens.setAttribute('role', 'group');
      bens.setAttribute('aria-labelledby', 'tr-bens');
      const title = el('p', 'axa-field__label', 'Beneficiaries and shares');
      title.id = 'tr-bens';
      bens.append(title);
      v.trBens.forEach(b => {
        const row = el('div', 'axa-ben');
        const name = el('label', 'axa-ben__name');
        name.append(el('span', 'visually-hidden', `Beneficiary ${b.n} name`), input(b.name, b.nameInvalid, b.changeName, `ben-${b.n}-name`, b.nameCls));
        const share = el('label', 'axa-ben__share');
        const field = input(b.share, b.shareInvalid, b.changeShare, `ben-${b.n}-share`, ` axa-input--num${b.shareCls}`);
        field.inputMode = 'numeric';
        const unit = el('span', 'axa-ben__unit', '%');
        unit.setAttribute('aria-hidden', 'true');
        share.append(el('span', 'visually-hidden', `Beneficiary ${b.n} share, percent`), field, unit);
        const remove = button('Remove', () => {
          b.remove();
          hook(root, 'fields').querySelector<HTMLElement>('[data-axa-key="add-beneficiary"]')?.focus({ preventScroll: true });
        }, `ben-${b.n}-remove`, 'axa-btn axa-btn--quiet axa-ben__remove');
        remove.setAttribute('aria-label', `Remove beneficiary ${b.n}`);
        row.append(name, share, remove);
        bens.append(row);
      });
      const add = button('Add beneficiary', v.trAddBen, 'add-beneficiary', 'axa-btn axa-bens__add');
      add.disabled = v.trAddDisabled;
      bens.append(add);
      nodes.push(bens);
    }
    fields.replaceChildren(...nodes);
    checks.replaceChildren(...v.trChecks.map(c => {
      const row = el('li', `axa-check${c.cls}`);
      row.append(el('p', 'axa-check__name', c.name), el('p', 'axa-check__flow', c.flow), el('p', 'axa-check__result', c.result));
      return row;
    }));
    record.replaceChildren(...v.trRecord.map(r => {
      const row = el('div', `axa-rec__row${r.cls}`);
      row.append(el('dt', '', r.key), el('dd', '', r.value));
      return row;
    }));
    status(message, v.trStatus, v.trStatusCls);
  }

  products.forEach((node, i) => node.addEventListener('click', () => model.trVals().trProducts[i].pick()));
  root.querySelectorAll<HTMLButtonElement>('[data-axa-try]').forEach((node, i) => {
    node.disabled = false;
    node.addEventListener('click', () => model.trVals().trTries[i].run());
  });
  const reset = hook<HTMLButtonElement>(root, 'reset');
  reset.disabled = false;
  reset.addEventListener('click', () => model.trVals().trReset());
  render();
}
