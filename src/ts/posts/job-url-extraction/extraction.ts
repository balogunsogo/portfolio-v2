// Local fixtures and JobTrackr's extraction rules; no DOM, requests or persistence.
export const extractable = ['role', 'company', 'companyUrl', 'source', 'location', 'workMode', 'employment', 'salMin', 'salMax', 'currency', 'desc'] as const;
export type Extractable = typeof extractable[number];
export type Field = Extractable | 'url' | 'status' | 'date' | 'priority' | 'notes';
export const salary: readonly Extractable[] = ['salMin', 'salMax', 'currency'];
export const labels: Record<Extractable, string> = {
  role: 'Role', company: 'Company', companyUrl: 'Company URL', source: 'Source',
  location: 'Location', workMode: 'Work mode', employment: 'Employment type',
  salMin: 'Salary minimum', salMax: 'Salary maximum', currency: 'Currency', desc: 'Job description',
};
export const choices = {
  source: ['Select source', 'LinkedIn', 'Contra', 'Upwork', 'Company website', 'Referral', 'Other'],
  status: ['Saved', 'Applied', 'Assessment', 'Interviewing'],
  workMode: ['Not specified', 'Remote', 'Hybrid', 'On-site'],
  employment: ['Not specified', 'Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance', 'Other'],
  priority: ['Low', 'Medium', 'High'],
} as const;
export type SelectField = keyof typeof choices;
export const initialMessage = 'Paste a public job URL to fill available details automatically.';
export interface Result {
  values: Partial<Record<Extractable, string>>;
  metadata?: boolean;
  blocked?: boolean;
  warnings?: string[];
}
export interface ExtractionState {
  values: Record<Field, string>;
  touched: Set<Extractable>;
  owned: Map<Extractable, string>;
  suggestions: Map<Extractable, string>;
  result: Result | null;
  message: string;
  busy: boolean;
  details: boolean;
  errors: Partial<Record<'role' | 'company', string>>;
  generation: number;
}
export function createState(url = ''): ExtractionState {
  const now = new Date();
  const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  return {
    values: { url, role: '', company: '', companyUrl: '', source: '', location: '', workMode: '', employment: '', salMin: '', salMax: '', currency: '', desc: '', status: 'Applied', date, priority: 'Medium', notes: '' },
    touched: new Set(), owned: new Map(), suggestions: new Map(), result: null,
    message: initialMessage, busy: false, details: false, errors: {}, generation: 0,
  };
}
export function edit(state: ExtractionState, key: Field, value: string): void {
  state.values[key] = value;
  if (!(extractable as readonly string[]).includes(key)) return;
  for (const field of salary.includes(key as Extractable) ? salary : [key as Extractable]) {
    state.touched.add(field);
    state.owned.delete(field);
  }
}
export function changeURL(state: ExtractionState, url: string): void {
  state.generation++;
  for (const [field, value] of state.owned) {
    if (!state.touched.has(field) && state.values[field] === value) state.values[field] = '';
  }
  state.owned.clear();
  state.values.url = url;
}
export function start(state: ExtractionState): number {
  state.generation++;
  state.result = null;
  state.suggestions.clear();
  state.busy = true;
  state.message = 'Looking for job details… You can keep editing.';
  return state.generation;
}
export function apply(state: ExtractionState, result: Result): void {
  state.busy = false;
  state.result = result;
  const protectedSalary = salary.some(key => state.touched.has(key) || state.values[key] !== '');
  for (const field of extractable) {
    const value = result.values[field];
    if (value === undefined || value === '') continue;
    const current = state.values[field];
    if (!current && !state.touched.has(field) && !(salary.includes(field) && protectedSalary) && !result.metadata) {
      state.values[field] = value;
      state.owned.set(field, value);
    } else if (current !== value) state.suggestions.set(field, value);
  }
  if (Object.keys(result.values).some(key => !['role', 'company', 'source'].includes(key)) || result.warnings?.length) state.details = true;
  state.message = result.blocked
    ? 'This site prevents automatic extraction. Enter details manually or paste the job description below.'
    : result.warnings?.length || !result.values.role || !result.values.company
      ? 'Some details were found. Review suggestions and complete missing fields.'
      : 'Details added. Review them before saving.';
}
export function accept(state: ExtractionState, field: Extractable): Field {
  if (salary.includes(field)) {
    for (const key of salary) {
      edit(state, key, state.result?.values[key] ?? '');
      state.suggestions.delete(key);
    }
    return 'salMin';
  }
  edit(state, field, state.suggestions.get(field)!);
  state.suggestions.delete(field);
  return field;
}
export function dismiss(state: ExtractionState, field: Extractable): void {
  for (const key of salary.includes(field) ? salary : [field]) state.suggestions.delete(key);
}
export function validate(state: ExtractionState): boolean {
  state.errors = {};
  if (!state.values.role.trim()) state.errors.role = 'Role is required.';
  if (!state.values.company.trim()) state.errors.company = 'Company is required.';
  return Object.keys(state.errors).length === 0;
}
export const urls = [
  'https://job-boards.greenhouse.io/northwind/jobs/4012345',
  'https://careers.haldenlabs.example/jobs/ux-engineer',
  'https://fernway.example/careers/content-designer',
  'https://jobs.boardly.example/view/88213',
] as const;
export const results: readonly Result[] = [
  { values: { role: 'Senior Product Designer', company: 'Northwind', location: 'London', desc: 'About the role\n\nNorthwind is looking for a senior product designer to lead the design of our scheduling tools, from early research to shipped interfaces.' } },
  { values: { role: 'UX Engineer', company: 'Halden Labs', companyUrl: 'https://haldenlabs.example', location: 'Remote — United Kingdom', workMode: 'Remote', employment: 'Full-time', salMin: '70000', salMax: '85000', currency: 'GBP', desc: 'Halden Labs builds research tools for small teams. As a UX engineer you’ll turn designs into accessible, production-ready interfaces.' } },
  { metadata: true, warnings: ['Only page metadata was found. Review the title; the description is a page summary, not the full job description.'], values: { role: 'Content Designer | Fernway Careers', desc: 'Join Fernway as a content designer and help shape how people plan their trips.' } },
  { blocked: true, values: {} },
];
export const editResults: readonly Result[] = [
  { values: { role: 'Senior Product Designer', company: 'Northwind', location: 'London' } },
  { values: { role: 'UX Engineer', company: 'Halden Labs', location: 'Remote' } },
];
