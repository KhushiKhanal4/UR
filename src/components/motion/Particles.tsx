"use client";

import { useEffect, useRef } from "react";

/* ══ Particles ════════════════════════════════════════════
   A shape made of dots. Move over it and the dots are pushed
   away from the pointer and spring home behind it; press and a
   shockwave throws them out, and they gather again into the
   NEXT shape — circle, square, flower, round again.

   ── ONE SET OF DOTS, MANY SHAPES ────────────────────────
   The dots never change, only where home is. Every shape is
   sampled to the same number of points, and a change of shape
   pairs each dot with a new home by angle round the middle, so
   the swarm sweeps round into the new outline rather than
   crossing itself.

   ── STRETCHED BY SPEED ──────────────────────────────────
   A dot at rest is round; a moving one is drawn a little long
   along the way it is going, which is what makes a burst read
   as a splash rather than a scatter of points.

   ── ADDED FOR THIS PROJECT ──────────────────────────────
   Adapted from Bencho (MIT — bencho.dev/licence). The
   behaviour above is untouched; what changed is only what
   it can be pointed at:
   - `shapes`: any set of shapes, not just the three built in.
     A shape is a filled Path2D (with an optional cut-out and
     fill rule) and/or a stroked Path2D, because line-drawn
     graphics — axes, sound waves — have no inside to fill.
   - `field`: the size of the drawing space; the built-ins
     keep Bencho's 480×400.
   - `count`: dots per shape (Bencho's N, still 720 by default).
   - `fluid`: the canvas fits its container instead of
     sitting at the field's pixel size.
   - `pressAdvances`: when the shape is chosen from outside
     (the Services section picks it by scroll), a press throws
     the shockwave and the dots re-gather into the SAME shape.
   - `allowScroll`: inside a scrolling page on touch, vertical
     panning must still scroll the page. */

/* ── inlined from lab/spring ──────────────────────── */
/* ── one spring, for everything that settles ───────────────
   The maths was already on this bench twice, copied by hand:
   Humidity's wheel and Brightness's column both accumulate
   velocity toward a target, damp it, and snap when both the
   delta and the velocity fall under 0.02. Two copies is a
   coincidence; five would be a policy, so it comes out here
   before the elastic blocks are written against it.

   The two shipped copies are deliberately NOT refactored onto
   this. They work, they are tuned, and rewriting the innards
   of two live components to prove a point about duplication
   is how a good afternoon becomes a bad one. This is the one
   new code uses.

   Frames, not milliseconds. `dt` is expressed in sixtieths of
   a second and the damping is RAISED to it rather than
   multiplied by it, so a dropped frame decays the same amount
   of energy as the two frames it replaced. Multiplying is the
   version that makes a spring behave differently on a busy
   page, which is the hardest kind of bug to see.

   The loop parks itself the moment the value has settled.
   CLAUDE.md is not complimentary about the one permanent
   requestAnimationFrame already on this bench and there is no
   case for five more. */

/* Read once, the way the wheel and the pill nav do. A
   preference, not a live input. */
const stillness = () =>
  typeof window !== "undefined" &&
  !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/* Bencho's own field — the built-in shapes are drawn in it */
const W = 480;
const H = 400;
const CX = W / 2;
const CY = H / 2;
/* how many dots every shape is sampled to */
const N = 720;

export const SHAPES = ["Circle", "Square", "Flower"] as const;

/** What a dot's home can be inside. Built lazily: Path2D only exists in the browser. */
export type ShapeDef = {
  fill?: Path2D;
  fillRule?: CanvasFillRule;
  /** removed from `fill` (a window in a rocket, a gap in a pediment) */
  cut?: Path2D;
  stroke?: Path2D;
  lineWidth?: number;
  /** added: no outline at all — the dots drift loose over the field, seeded so it's stable */
  scatter?: { seed: number; margin?: number };
};
export type ShapeSet = Record<string, () => ShapeDef>;
type Field = { w: number; h: number };

/* fx/fy: where the dot set off for its current home; dl: its delay into the morph, ms */
type Dot = { hx: number; hy: number; x: number; y: number; vx: number; vy: number; fx: number; fy: number; dl: number };

/* ── a change of shape is a glide, not a fling ───────────
   Each dot's target eases from where it was to its new home
   over MORPH_MS, staggered round the swarm by angle so the new
   outline sweeps in; a stiff, well-damped spring follows that
   target. Thrown straight at the new home, the loose hover
   spring overshot and wobbled. */
const MORPH_MS = 1100;
const STAGGER_MS = 280;
const ease = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

function outline(s: (typeof SHAPES)[number]): Path2D {
  const p = new Path2D();
  if (s === "Circle") p.arc(CX, CY, 150, 0, Math.PI * 2);
  else if (s === "Square") p.roundRect(CX - 140, CY - 140, 280, 280, 36);
  else {
    /* five round petals round a smaller middle — circles drawn
       the same way round, so the fill is their union. Petals
       just touching their neighbours, so the notches between
       them read at the dots' own grain */
    for (let i = 0; i < 5; i++) {
      const a = -Math.PI / 2 + (i * Math.PI * 2) / 5;
      const x = CX + Math.cos(a) * 104;
      const y = CY + 8 + Math.sin(a) * 104;
      p.moveTo(x + 60, y);
      p.arc(x, y, 60, 0, Math.PI * 2);
    }
    p.moveTo(CX + 58, CY + 8);
    p.arc(CX, CY + 8, 58, 0, Math.PI * 2);
  }
  return p;
}

const BUILT_IN: ShapeSet = Object.fromEntries(SHAPES.map((s) => [s, () => ({ fill: outline(s) })]));
const BUILT_IN_FIELD: Field = { w: W, h: H };

/* ── N points, spread evenly over the inside of a shape ──
   A hex grid spaced so the shape holds about N of them — its
   area over N, which is the spacing that fills it evenly — then
   trimmed or topped up to exactly N. It was a fixed fine grid
   thinned by a stride, and the stride beat against the grid:
   the circle came out in zigzag bands. */
function homes(def: ShapeDef, field: Field, n: number, start = false): [number, number][] {
  if (def.scatter) {
    /* mulberry32: the same dust on every render, so server and client agree */
    let a = def.scatter.seed >>> 0;
    const rand = () => {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    const m = def.scatter.margin ?? 16;
    return Array.from({ length: n }, () => [m + rand() * (field.w - 2 * m), m + rand() * (field.h - 2 * m)]);
  }
  const c = document.createElement("canvas");
  c.width = field.w;
  c.height = field.h;
  const g = c.getContext("2d")!;
  g.lineWidth = def.lineWidth ?? 1;
  g.lineCap = "round";
  g.lineJoin = "round";
  const inside = (x: number, y: number) =>
    (!!def.fill && g.isPointInPath(def.fill, x, y, def.fillRule ?? "nonzero") && !(def.cut && g.isPointInPath(def.cut, x, y))) ||
    (!!def.stroke && g.isPointInStroke(def.stroke, x, y));
  let area = 0;
  for (let y = 1; y < field.h; y += 2) for (let x = 1; x < field.w; x += 2) if (inside(x, y)) area += 4;
  const sp = Math.sqrt((area / n) * (2 / Math.sqrt(3)));
  const rowH = (sp * Math.sqrt(3)) / 2;
  const pts: [number, number][] = [];
  for (let y = rowH / 2, row = 0; y < field.h; y += rowH, row++) {
    for (let x = sp / 2 + (row % 2) * (sp / 2); x < field.w; x += sp) {
      if (inside(x, y)) pts.push([x, y]);
    }
  }
  /* within a few of N either way; drop evenly or repeat evenly */
  const out: [number, number][] = [];
  for (let i = 0; i < n; i++) out.push(pts[Math.floor((i * pts.length) / n)]);
  /* added: `align="start"` sets every shape flush with the left edge of the field */
  if (start) {
    const dx = Math.min(...out.map((p) => p[0])) - 3;
    return out.map(([x, y]) => [x - dx, y]);
  }
  return out;
}

export function Particles({
  /* the shape it opens as */
  shape = "Circle",
  /* how far the pointer's push reaches, px */
  reach = 80,
  /* how hard it pushes, 0..100 */
  force = 60,
  /* the size of a dot */
  grain = "Fine",
  shapes = BUILT_IN,
  field = BUILT_IN_FIELD,
  count = N,
  fluid = false,
  pressAdvances = true,
  allowScroll = false,
  align = "center",
  label = "A shape made of dots. Move over it; press to change the shape.",
  className = "",
}: {
  shape?: string;
  reach?: number;
  force?: number;
  grain?: string;
  shapes?: ShapeSet;
  field?: Field;
  count?: number;
  fluid?: boolean;
  pressAdvances?: boolean;
  allowScroll?: boolean;
  /* "start": shapes and canvas sit flush left instead of centred */
  align?: "center" | "start";
  label?: string;
  className?: string;
} = {}) {
  const still = stillness();
  const names = Object.keys(shapes);
  const { w: FW, h: FH } = field;
  const cv = useRef<HTMLCanvasElement | null>(null);
  const dots = useRef<Dot[]>([]);
  const at = useRef(names[0]);
  const hand = useRef<{ x: number; y: number } | null>(null);
  const raf = useRef(0);
  /* when the current morph began (rAF clock), 0 when none is running */
  const morph = useRef(0);
  const knobs = useRef({ reach, force, grain });
  knobs.current = { reach, force, grain };
  /* sampling a shape walks every other pixel of the field; do it once per shape */
  const cache = useRef(new Map<string, [number, number][]>());

  /* ── give every dot a home in a shape ────────────────── */
  const become = (s: string) => {
    at.current = s;
    let next = cache.current.get(s);
    if (!next) {
      next = homes(shapes[s](), field, count, align === "start");
      cache.current.set(s, next);
    }
    const ds = dots.current;
    if (!ds.length) {
      dots.current = next.map(([x, y]) => ({ hx: x, hy: y, x, y, vx: 0, vy: 0, fx: x, fy: y, dl: 0 }));
      return;
    }
    const angle = (x: number, y: number) => Math.atan2(y - FH / 2, x - FW / 2);
    /* pair by angle round the middle, so the swarm sweeps */
    const a = ds.map((d, i) => [angle(d.x, d.y), i] as const).sort((p, q) => p[0] - q[0]);
    const b = next.map((h, i) => [angle(h[0], h[1]), i] as const).sort((p, q) => p[0] - q[0]);
    a.forEach(([, di], k) => {
      const h = next[b[k][1]];
      const d = ds[di];
      d.fx = d.x;
      d.fy = d.y;
      d.dl = (k / a.length) * STAGGER_MS;
      d.hx = h[0];
      d.hy = h[1];
      if (still) { d.x = h[0]; d.y = h[1]; }
    });
    morph.current = still ? 0 : performance.now();
  };

  const draw = () => {
    const c = cv.current;
    if (!c) return;
    const x = c.getContext("2d")!;
    const k = c.width / FW;
    x.setTransform(k, 0, 0, k, 0, 0);
    x.clearRect(0, 0, FW, FH);
    x.fillStyle = getComputedStyle(c).color;
    const r = knobs.current.grain === "Coarse" ? 2.7 : 1.9;
    x.beginPath();
    for (const d of dots.current) {
      const sp = Math.hypot(d.vx, d.vy);
      if (sp < 0.3) {
        x.moveTo(d.x + r, d.y);
        x.arc(d.x, d.y, r, 0, Math.PI * 2);
      } else {
        /* long along its path, a little thin across it */
        const s = Math.min(2.6, 1 + sp * 0.12);
        const rot = Math.atan2(d.vy, d.vx);
        x.moveTo(d.x + Math.cos(rot) * r * s, d.y + Math.sin(rot) * r * s);
        x.ellipse(d.x, d.y, r * s, r / Math.sqrt(s), rot, 0, Math.PI * 2);
      }
    }
    x.fill();
  };

  const run = () => {
    if (raf.current) return;
    let prev = 0;
    const tick = (t: number) => {
      const dt = prev ? clamp((t - prev) / 16.67, 0, 2.5) : 1;
      prev = t;
      const h = hand.current;
      const R = clamp(knobs.current.reach, 30, 160);
      const S = (clamp(knobs.current.force, 0, 100) / 100) * 11;
      let busy = !!h;
      const m = morph.current;
      if (m && t - m > MORPH_MS + STAGGER_MS) morph.current = 0;
      for (const d of dots.current) {
        /* mid-morph: chase the eased target on a stiff, damped spring */
        let tx = d.hx;
        let ty = d.hy;
        let pull = 0.05;
        let damp = 0.84;
        if (morph.current) {
          const p = clamp((t - m - d.dl) / MORPH_MS, 0, 1);
          if (p < 1) {
            const e = ease(p);
            tx = d.fx + (d.hx - d.fx) * e;
            ty = d.fy + (d.hy - d.fy) * e;
            pull = 0.22;
            damp = 0.58;
            busy = true;
          }
        }
        if (h) {
          const dx = d.x - h.x;
          const dy = d.y - h.y;
          const dd = Math.hypot(dx, dy);
          if (dd < R && dd > 0.01) {
            const f = Math.pow(1 - dd / R, 2) * S;
            d.vx += (dx / dd) * f * dt;
            d.vy += (dy / dd) * f * dt;
          }
        }
        d.vx = (d.vx + (tx - d.x) * pull * dt) * Math.pow(damp, dt);
        d.vy = (d.vy + (ty - d.y) * pull * dt) * Math.pow(damp, dt);
        d.x += d.vx * dt;
        d.y += d.vy * dt;
        if (Math.abs(d.hx - d.x) < 0.05 && Math.abs(d.hy - d.y) < 0.05 && Math.abs(d.vx) < 0.02 && Math.abs(d.vy) < 0.02) {
          d.x = d.hx; d.y = d.hy; d.vx = 0; d.vy = 0;
        } else busy = true;
      }
      draw();
      raf.current = busy ? requestAnimationFrame(tick) : 0;
    };
    raf.current = requestAnimationFrame(tick);
  };

  /* set up once, then follow the Shape knob. Fluid: the backing
     store follows the displayed size so the dots stay crisp */
  useEffect(() => {
    const c = cv.current;
    if (!c) return;
    const size = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const shown = fluid ? c.getBoundingClientRect().width || FW : FW;
      c.width = Math.round(shown * dpr);
      c.height = Math.round(((shown * FH) / FW) * dpr);
      draw();
    };
    size();
    if (!fluid) return;
    const ro = new ResizeObserver(size);
    ro.observe(c);
    return () => ro.disconnect();
  }, [fluid, FW, FH]);
  useEffect(() => {
    const s = names.includes(shape) ? shape : names[0];
    become(s);
    draw();
    run();
  }, [shape]);
  useEffect(() => { draw(); }, [grain]);
  useEffect(() => () => { cancelAnimationFrame(raf.current); raf.current = 0; }, []);
  useEffect(() => {
    const mo = new MutationObserver(() => draw());
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, []);

  const where = (e: React.PointerEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    const k = r.width / FW;
    return { x: (e.clientX - r.left) / k, y: (e.clientY - r.top) / k };
  };

  return (
    <div className={`ptc ${className}`} data-fluid={fluid || undefined} data-align={align === "start" ? "start" : undefined}>
      <canvas
        ref={cv}
        className="ptc-canvas"
        data-scroll={allowScroll || undefined}
        style={
          fluid
            ? ({ aspectRatio: `${FW} / ${FH}`, "--ptc-ratio": FW / FH } as React.CSSProperties)
            : { width: FW, height: FH }
        }
        role="img"
        aria-label={label}
        onPointerMove={(e) => {
          if (still) return;
          hand.current = where(e);
          run();
        }}
        onPointerLeave={() => { hand.current = null; run(); }}
        onPointerDown={(e) => {
          /* the shockwave, then the next shape */
          const p = where(e);
          if (!still) {
            const S = 0.4 + (clamp(knobs.current.force, 0, 100) / 100) * 1.2;
            for (const d of dots.current) {
              const dx = d.x - p.x;
              const dy = d.y - p.y;
              const dd = Math.hypot(dx, dy);
              if (dd > 200 || dd < 0.01) continue;
              const f = (1 - dd / 200) * 30 * S;
              d.vx += (dx / dd) * f;
              d.vy += (dy / dd) * f;
            }
          }
          if (pressAdvances) become(names[(names.indexOf(at.current) + 1) % names.length]);
          draw();
          run();
        }}
      />
    </div>
  );
}
