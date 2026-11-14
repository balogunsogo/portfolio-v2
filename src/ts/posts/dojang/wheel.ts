// DOJANG main b34f80c: phone-pixel geometry, independent of the DOM.
export const WHEEL = [
  { kind: 'leadFront', angle: 95, ring: 'lead', ko: 'lead' },
  { kind: 'leadRound', angle: 140, ring: 'lead', ko: 'lead' },
  { kind: 'leadSide', angle: 185, ring: 'lead', ko: 'cut' },
  { kind: 'front', angle: 92, ring: 'rear', ko: 'Ap' },
  { kind: 'round', angle: 127, ring: 'rear', ko: 'Dollyeo' },
  { kind: 'side', angle: 162, ring: 'rear', ko: 'Yeop' },
  { kind: 'back', angle: 197, ring: 'rear', ko: 'Dwi' },
] as const;

export type Kick = typeof WHEEL[number]['kind'];
export interface Pick { kind: Kick; head: boolean }
export const KICK: Record<Kick, readonly [string, string]> = {
  front: ['Front', 'Ap'], round: ['Round', 'Dollyeo'], side: ['Side', 'Yeop'], back: ['Back', 'Dwi'],
  leadFront: ['L·Front', 'lead leg'], leadRound: ['L·Round', 'lead leg'], leadSide: ['L·Side', 'cut kick'],
};
export const NAME: Record<Kick, string> = {
  front: 'Front kick', round: 'Roundhouse kick', side: 'Side kick', back: 'Back kick',
  leadFront: 'Lead-leg front kick', leadRound: 'Lead-leg roundhouse kick', leadSide: 'Lead-leg side kick',
};
const KEY: Record<Kick, string> = { front: 'K', round: 'L', side: 'U', back: 'I', leadFront: 'K', leadRound: 'L', leadSide: 'U' };
export const HOLD_MS = 200;
export const TAP_SLOP = 14;

export function pickWheel(dx: number, dy: number): Pick | null {
  const r = Math.hypot(dx, dy);
  if (r < 26) return null;
  let angle = Math.atan2(-dy, dx) * 180 / Math.PI;
  if (angle < -60) angle += 360;
  const ring = r < 86 ? 'lead' : 'rear';
  let best: typeof WHEEL[number] | null = null;
  let bestD = Infinity;
  for (const item of WHEEL) {
    if (item.ring !== ring) continue;
    const distance = Math.abs(angle - item.angle);
    if (distance < bestD) { bestD = distance; best = item; }
  }
  if (!best || bestD > 22 + 8) return null;
  return { kind: best.kind, head: ring === 'rear' && r >= 160 };
}

export function keys(kind: Kick, head: boolean): string {
  const mods: string[] = [];
  if (kind.startsWith('lead')) mods.push('F');
  if (head) mods.push('E');
  if (!mods.length) return `On a keyboard: ${KEY[kind]}.`;
  if (mods.length === 1) return `On a keyboard: hold ${mods[0]} and press ${KEY[kind]}.`;
  return `On a keyboard: hold ${mods.join(' and ')}, then press ${KEY[kind]}.`;
}
