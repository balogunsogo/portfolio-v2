// Capture harness (?lab=clip), identical in every build it is dropped into.
// Runs one scripted exchange through that build's own simulation, animator,
// characters, dojang and effects, one 60 Hz tick per frame, with a fixed
// camera. Playwright calls __clip.frame(n) and grabs the canvas.
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as THREE from 'three';
import { FighterAnimator } from '../game/anim/FighterAnimator';
import { CombatWorld } from '../game/combat/CombatWorld';
import { emptyIntent, type FighterIntent } from '../game/input/actions';
import { approachAngle } from '../game/math';
import { CHARACTERS, createCharacter, loadFighterAsset } from '../game/render/characterFactory';
import { buildDojang } from '../game/render/Dojang';
import { Effects } from '../game/render/Effects';
import { PROFILES } from '../game/render/quality';
import { ArcadeRules } from '../game/rules/rules';

const I = (p: Partial<FighterIntent> = {}): FighterIntent => ({ ...emptyIntent(), ...p });
const gap = (w: CombatWorld) => Math.hypot(w.fighters[1].x - w.fighters[0].x, w.fighters[1].z - w.fighters[0].z);
const towards = (w: CombatWorld, i: 0 | 1, k = 1): Partial<FighterIntent> => {
  const a = w.fighters[i];
  const b = w.fighters[1 - i];
  const d = gap(w) || 1;
  return { moveX: ((b.x - a.x) / d) * k, moveZ: ((b.z - a.z) / d) * k };
};
const lateral = (w: CombatWorld, i: 0 | 1, k = 1): Partial<FighterIntent> => {
  const a = w.fighters[i];
  const b = w.fighters[1 - i];
  const d = gap(w) || 1;
  return { moveX: ((b.z - a.z) / d) * k, moveZ: (-(b.x - a.x) / d) * k };
};

/** One step of the exchange: intents per tick until `done`. */
interface Step {
  run(t: number, w: CombatWorld): [FighterIntent, FighterIntent];
  done(t: number, w: CombatWorld): boolean;
}
const hold = (ticks: number, run: Step['run'] = () => [I(), I()]): Step => ({ run, done: (t) => t >= ticks });
const close = (who: 0 | 1, range: number, max: number, other: (w: CombatWorld) => Partial<FighterIntent> = () => ({})): Step => ({
  run: (_t, w) => (who === 0 ? [I(towards(w, 0)), I(other(w))] : [I(other(w)), I(towards(w, 1))]),
  done: (t, w) => gap(w) <= range || t >= max,
});
const strike = (who: 0 | 1, attack: FighterIntent['attack'], after: number, height: FighterIntent['height'] = 'body', guard = false): Step => ({
  run: (t) => {
    const k = I(t === 0 ? { attack, height } : {});
    const d = I({ guard });
    return who === 0 ? [k, d] : [d, k];
  },
  done: (t) => t >= after,
});

// Blue (Jae) and red (Hana). Same order and thresholds in every build.
const SCRIPT: Step[] = [
  hold(50),
  close(0, 1.05, 90),
  strike(0, 'round', 46),
  hold(34, (_t, w) => [I(towards(w, 0, -1)), I()]),
  close(1, 1.12, 80, () => ({})),
  strike(1, 'side', 48, 'body', true),
  hold(44, (_t, w) => [I(lateral(w, 0)), I()]),
  close(0, 1.02, 80),
  strike(0, 'back', 56),
  hold(30, (_t, w) => [I(), I(towards(w, 1, -1))]),
  close(1, 1.0, 70),
  strike(1, 'round', 50, 'head'),
  hold(54),
];

export async function runClipLab(root: HTMLElement) {
  const params = new URLSearchParams(location.search);
  const W = Number(params.get('w') ?? 1280);
  const H = Number(params.get('h') ?? 720);
  const quality = PROFILES.high;
  const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, stencil: false, alpha: false });
  renderer.setPixelRatio(1);
  renderer.setSize(W, H);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = quality.shadows;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  root.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#1a1510');
  const env = buildDojang(quality);
  scene.add(env.group);
  const gltf = await loadFighterAsset();
  const defs = [CHARACTERS.jae, CHARACTERS.hana] as const;
  const chars = [createCharacter(gltf, defs[0], 'chung', 'green'), createCharacter(gltf, defs[1], 'hong', 'yellow')];
  chars.forEach((c) => scene.add(c.group));
  const anims = chars.map((c, i) => new (FighterAnimator as any)(c.group, c.model, c.clips, i + 1) as FighterAnimator);
  const fx = new (Effects as any)(!quality.shadows, undefined) as Effects;
  scene.add(fx.group);

  const camera = new THREE.PerspectiveCamera(32, W / H, 0.1, 60);
  const w = new CombatWorld(ArcadeRules, [defs[0].stats, defs[1].stats]);
  w.skipIntro = true;
  w.resetMatch();
  const [f0, f1] = w.fighters;
  f0.x = 0;
  f0.z = -1.25;
  f1.x = 0;
  f1.z = 1.25;
  f0.yaw = 0;
  f1.yaw = Math.PI;
  w.events.length = 0;
  const visYaw = [f0.yaw, f1.yaw];
  const mid = new THREE.Vector3(0, 0.95, 0);
  /** Camera direction from the midpoint: side-on to the fighters' line, a little behind blue. */
  const viewAngle = () => {
    const dx = f1.x - f0.x;
    const dz = f1.z - f0.z;
    const d = Math.hypot(dx, dz) || 1;
    const px = -dz / d - (dx / d) * 0.32;
    const pz = dx / d - (dz / d) * 0.32;
    return Math.atan2(pz, px);
  };
  let camAng = viewAngle();
  let step = 0;
  let local = 0;
  let tick = 0;
  let finished = false;
  const log: string[] = [];

  const advance = () => {
    const s = SCRIPT[step];
    let intents: [FighterIntent, FighterIntent] = [I(), I()];
    if (s) {
      intents = s.run(local, w);
      local++;
      if (s.done(local, w)) {
        step++;
        local = 0;
      }
    } else finished = true;
    w.step(intents);
    for (const e of w.events as any[]) {
      if (e.type === 'hit') {
        log.push(`${tick} hit ${e.move.id} ${e.zone}`);
        const mir = (w.fighters[e.attacker] as any).mirror ?? 1;
        (anims[e.defender] as any).noteImpact?.(e.move.id === 'round' ? mir : e.move.id === 'leadRound' ? -mir : 0, e.zone);
        fx.spawn(e.point, e.counter || e.zone === 'head' || e.move.pushback > 3 ? 'heavy' : 'hit');
      } else if (e.type === 'block') {
        log.push(`${tick} block ${e.move.id}`);
        fx.spawn(e.point, 'block');
      } else if (e.type === 'whiff') log.push(`${tick} whiff ${e.move.id}`);
    }
    w.events.length = 0;
    tick++;
  };

  const draw = (dt: number) => {
    const stopped = w.hitstop > 0;
    w.fighters.forEach((f, i) => {
      visYaw[i] = approachAngle(visYaw[i], f.yaw, 14 * dt);
      (anims[i] as any).update(f, 0, f.x, f.z, visYaw[i], stopped ? 0 : dt);
    });
    const tx = (f0.x + f1.x) / 2;
    const tz = (f0.z + f1.z) / 2;
    mid.x += (tx - mid.x) * 0.08;
    mid.z += (tz - mid.z) * 0.08;
    camAng = approachAngle(camAng, viewAngle(), 0.9 * dt);
    camera.position.set(mid.x + Math.cos(camAng) * 5.1, 1.4, mid.z + Math.sin(camAng) * 5.1);
    camera.lookAt(mid.x, 0.98, mid.z);
    fx.update(dt, camera, w.fighters);
    renderer.render(scene, camera);
  };

  // Settle the rig before the first frame (the animator eases in from bind pose).
  for (let i = 0; i < 20; i++) draw(1 / 60);
  mid.set((f0.x + f1.x) / 2, 0.95, (f0.z + f1.z) / 2);
  camAng = viewAngle();

  (window as any).__clip = {
    ready: true,
    /** Advance one tick and render. Returns false once the script has ended. */
    frame() {
      advance();
      draw(1 / 60);
      return !finished;
    },
    get tick() {
      return tick;
    },
    log,
  };
}
