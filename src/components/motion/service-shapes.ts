import type { ShapeDef, ShapeSet } from "./Particles";

/**
 * The four Services graphics as Particles shapes, drawn in a 512×512 field.
 * Particles fills each one with an even hex grid of dots, so:
 * - solid parts are `fill` (holes via `fillRule: "evenodd"` or `cut`),
 * - line work is `stroke` at a width that holds at least two rows of dots,
 * - nothing overlaps under evenodd, or the overlap would become a hole.
 * Keys are the service titles, so the section can select a shape by card.
 */

export const SERVICE_FIELD = { w: 512, h: 512 };

/** 01 — AI Growth Advisory: value over time, flat, then the take-off. */
const growth = (): ShapeDef => {
  const stroke = new Path2D();
  // axes with arrow heads
  stroke.moveTo(70, 66);
  stroke.lineTo(70, 440);
  stroke.lineTo(464, 440);
  stroke.moveTo(46, 94);
  stroke.lineTo(70, 66);
  stroke.lineTo(94, 94);
  stroke.moveTo(436, 416);
  stroke.lineTo(464, 440);
  stroke.lineTo(436, 464);
  // flat-then-exponential curve
  for (let x = 100; x <= 456; x += 4) {
    const t = Math.max(0, (x - 290) / 166);
    const y = 360 - Math.pow(t, 2.2) * 296;
    if (x === 100) stroke.moveTo(x, y);
    else stroke.lineTo(x, y);
  }

  const fill = new Path2D();
  // the inflection point, where AI kicks in, and data points along the rise
  [
    [290, 360, 30],
    [352, 334, 17],
    [398, 264, 17],
    [434, 168, 17],
  ].forEach(([x, y, r]) => {
    fill.moveTo(x + r, y);
    fill.arc(x, y, r, 0, Math.PI * 2);
  });
  // thick enough that the same dot count spaces out like the solid shapes
  return { stroke, lineWidth: 26, fill };
};

/** 02 — Policy & Government Advisory: a classical government building. */
const policy = (): ShapeDef => {
  const p = new Path2D();
  // pediment: outer triangle, inner triangle (a hole under evenodd), emblem inside the hole
  p.moveTo(256, 58);
  p.lineTo(460, 166);
  p.lineTo(52, 166);
  p.closePath();
  p.moveTo(256, 92);
  p.lineTo(400, 152);
  p.lineTo(112, 152);
  p.closePath();
  p.moveTo(272, 128);
  p.arc(256, 128, 16, 0, Math.PI * 2);
  // entablature
  p.rect(66, 176, 380, 24);
  // columns: capital / shaft / base, stacked without overlapping
  for (let i = 0; i < 6; i++) {
    const x = 88 + i * 64;
    p.rect(x - 8, 210, 40, 10);
    p.rect(x, 220, 24, 154);
    p.rect(x - 8, 374, 40, 10);
  }
  // steps
  p.rect(58, 394, 396, 18);
  p.rect(36, 420, 440, 20);
  return { fill: p, fillRule: "evenodd" };
};

/** 03 — Keynotes & Speaking: a stage microphone with sound waves. */
const keynotes = (): ShapeDef => {
  const cx = 256;
  const fill = new Path2D();
  // capsule, with grille slots cut through it (evenodd)
  fill.roundRect(cx - 50, 66, 100, 168, 50);
  for (let y = 104; y <= 196; y += 26) fill.rect(cx - 30, y, 60, 8);
  // base
  fill.roundRect(cx - 86, 404, 172, 20, 10);

  const stroke = new Path2D();
  // cradle and stand
  stroke.arc(cx, 196, 80, 0.06 * Math.PI, 0.94 * Math.PI);
  stroke.moveTo(cx, 276);
  stroke.lineTo(cx, 404);
  // sound waves, both sides
  [118, 162, 206].forEach((r) => {
    stroke.moveTo(cx + Math.cos(-0.26 * Math.PI) * r, 150 + Math.sin(-0.26 * Math.PI) * r);
    stroke.arc(cx, 150, r, -0.26 * Math.PI, 0.26 * Math.PI);
    stroke.moveTo(cx + Math.cos(0.74 * Math.PI) * r, 150 + Math.sin(0.74 * Math.PI) * r);
    stroke.arc(cx, 150, r, 0.74 * Math.PI, 1.26 * Math.PI);
  });
  return { fill, fillRule: "evenodd", stroke, lineWidth: 12 };
};

/** 04 — Backing Founders: a rocket lifting off, flame and a few stars. */
const founders = (): ShapeDef => {
  const local = new Path2D();
  // body
  local.moveTo(0, -176);
  local.bezierCurveTo(66, -124, 66, -10, 50, 72);
  local.lineTo(-50, 72);
  local.bezierCurveTo(-66, -10, -66, -124, 0, -176);
  local.closePath();
  // fins
  local.moveTo(-48, 6);
  local.lineTo(-104, 96);
  local.lineTo(-46, 76);
  local.closePath();
  local.moveTo(48, 6);
  local.lineTo(104, 96);
  local.lineTo(46, 76);
  local.closePath();
  // nozzle and flame
  local.rect(-30, 74, 60, 14);
  local.moveTo(-26, 98);
  local.quadraticCurveTo(0, 210, 26, 98);
  local.closePath();

  const porthole = new Path2D();
  porthole.arc(0, -72, 24, 0, Math.PI * 2);

  // fly towards the top-right
  const m = new DOMMatrix().translate(256, 252).rotate(45);
  const fill = new Path2D();
  fill.addPath(local, m);
  const cut = new Path2D();
  cut.addPath(porthole, m);

  [
    [96, 98, 8],
    [430, 118, 7],
    [116, 300, 6],
    [404, 404, 8],
    [72, 444, 6],
  ].forEach(([x, y, r]) => {
    fill.moveTo(x + r, y);
    fill.arc(x, y, r, 0, Math.PI * 2);
  });
  return { fill, cut };
};

export const SERVICE_SHAPES: ShapeSet = {
  "AI Growth Advisory": growth,
  "Policy & Government Advisory": policy,
  "Keynotes & Speaking": keynotes,
  "Backing Founders": founders,
};
