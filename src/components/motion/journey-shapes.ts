import type { ShapeDef, ShapeSet } from "./Particles";

/**
 * The Journey graphics as Particles shapes, drawn in a 512×400 field. Each chapter's swarm
 * rests as loose dust and gathers into its graphic while the chapter is on screen.
 * Same rules as service-shapes.ts: solid parts are `fill`, line work is `stroke` thick
 * enough for two rows of dots, and nothing overlaps under evenodd.
 */

export const JOURNEY_FIELD = { w: 512, h: 400 };

const disc = (p: Path2D, x: number, y: number, r: number) => {
  p.moveTo(x + r, y);
  p.arc(x, y, r, 0, Math.PI * 2);
};

/** Silicon — a microchip: package, die, pins on all four sides and traces running off them. */
const silicon = (): ShapeDef => {
  const cx = 256;
  const cy = 200;
  const fill = new Path2D();
  // package ring (outer minus inner under evenodd) with the die inside the hole
  fill.roundRect(cx - 100, cy - 100, 200, 200, 18);
  fill.rect(cx - 70, cy - 70, 140, 140);
  fill.roundRect(cx - 40, cy - 40, 80, 80, 6);
  // five pins per side, clear of the package
  const pins = [-80, -40, 0, 40, 80];
  for (const o of pins) {
    fill.rect(cx + o - 7, cy - 134, 14, 28);
    fill.rect(cx + o - 7, cy + 106, 14, 28);
    fill.rect(cx - 134, cy + o - 7, 28, 14);
    fill.rect(cx + 106, cy + o - 7, 28, 14);
  }

  // traces: off a pin end, a 45° jog, out to a pad
  const stroke = new Path2D();
  const pads: [number, number][] = [];
  const trace = (pts: [number, number][]) => {
    stroke.moveTo(...pts[0]);
    pts.slice(1).forEach((p) => stroke.lineTo(...p));
    pads.push(pts[pts.length - 1]);
  };
  trace([[cx - 134, cy - 40], [cx - 170, cy - 40], [cx - 200, cy - 70]]);
  trace([[cx - 134, cy + 40], [cx - 184, cy + 40], [cx - 210, cy + 66]]);
  trace([[cx - 134, cy], [cx - 216, cy]]);
  trace([[cx + 134, cy - 80], [cx + 176, cy - 80], [cx + 204, cy - 108]]);
  trace([[cx + 134, cy + 0], [cx + 214, cy + 0]]);
  trace([[cx + 134, cy + 80], [cx + 172, cy + 80], [cx + 200, cy + 108]]);
  trace([[cx - 40, cy - 134], [cx - 40, cy - 172]]);
  trace([[cx + 40, cy + 134], [cx + 40, cy + 172]]);
  pads.forEach(([x, y]) => disc(fill, x, y, 11));

  return { fill, fillRule: "evenodd", stroke, lineWidth: 10 };
};

/** Strategy — a target with an arrow struck dead centre. */
const strategy = (): ShapeDef => {
  const cx = 220;
  const cy = 214;
  const fill = new Path2D();
  // concentric discs under evenodd alternate filled / empty rings
  [168, 132, 98, 62, 28].forEach((r) => disc(fill, cx, cy, r));

  // arrow in from the top right, with its fletching
  const tail: [number, number] = [470, 26];
  const len = Math.hypot(tail[0] - cx, tail[1] - cy);
  const u = [(tail[0] - cx) / len, (tail[1] - cy) / len];
  const n = [-u[1], u[0]];
  const stroke = new Path2D();
  stroke.moveTo(cx + u[0] * 10, cy + u[1] * 10);
  stroke.lineTo(...tail);
  for (const back of [0, 22, 44]) {
    const bx = tail[0] - u[0] * back;
    const by = tail[1] - u[1] * back;
    for (const side of [1, -1]) {
      stroke.moveTo(bx, by);
      stroke.lineTo(bx + (n[0] * side - u[0]) * 26, by + (n[1] * side - u[1]) * 26);
    }
  }
  return { fill, fillRule: "evenodd", stroke, lineWidth: 11 };
};

/** State — the scales of justice, level: AI that is fair and accountable. */
const state = (): ShapeDef => {
  const cx = 256;
  const fill = new Path2D();
  // finial, pans, foot and base
  disc(fill, cx, 50, 16);
  const pan = (x: number) => {
    fill.moveTo(x - 66, 234);
    fill.arc(x, 234, 66, 0, Math.PI);
    fill.closePath();
  };
  pan(106);
  pan(406);
  fill.moveTo(cx - 40, 342);
  fill.lineTo(cx + 40, 342);
  fill.lineTo(cx + 56, 360);
  fill.lineTo(cx - 56, 360);
  fill.closePath();
  fill.roundRect(cx - 104, 364, 208, 20, 10);

  const stroke = new Path2D();
  // pillar and beam
  stroke.moveTo(cx, 70);
  stroke.lineTo(cx, 340);
  stroke.moveTo(96, 96);
  stroke.lineTo(416, 96);
  // hangers: from each end of the beam down to the rim of its pan
  for (const x of [106, 406]) {
    stroke.moveTo(x, 96);
    stroke.lineTo(x - 60, 230);
    stroke.moveTo(x, 96);
    stroke.lineTo(x + 60, 230);
  }
  return { fill, stroke, lineWidth: 11 };
};

const dust = (seed: number) => (): ShapeDef => ({ scatter: { seed, margin: 24 } });

/** One set per chapter: its graphic, plus the dust it rests as. Keyed by chapter id. */
export const JOURNEY_SHAPES: Record<string, ShapeSet> = {
  silicon: { dust: dust(11), silicon },
  strategy: { dust: dust(23), strategy },
  state: { dust: dust(37), state },
};
