/**
 * Converts every PNG/JPG under public/images to WebP beside it, then removes the original.
 * Run after adding new images:  node scripts/convert-images.mjs
 * (Remember to update the paths that reference them, e.g. in src/data/content.ts.)
 */
import { readdir, stat, unlink } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve("public/images");
const MAX_SIDE = 2000;
/* logos and other flat art with hard edges (and everything under building/): keep them lossless */
const LOSSLESS = new Set(["hero-employer-logos.png"]);
const isLossless = (file) => LOSSLESS.has(path.basename(file)) || file.includes(`${path.sep}building${path.sep}`);

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (/\.(png|jpe?g)$/i.test(entry.name)) yield full;
  }
}

const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
let before = 0;
let after = 0;

for await (const file of walk(ROOT)) {
  const out = file.replace(/\.(png|jpe?g)$/i, ".webp");
  const lossless = isLossless(file);
  const { width = 0, height = 0 } = await sharp(file).metadata();
  // the logo strip is drawn cropped and scaled up, so it keeps its full size
  const resize = !lossless && Math.max(width, height) > MAX_SIDE;

  let img = sharp(file);
  if (resize) img = img.resize({ width: MAX_SIDE, height: MAX_SIDE, fit: "inside" });
  await img.webp(lossless ? { lossless: true, effort: 6 } : { quality: 82, effort: 6 }).toFile(out);

  const [a, b] = [(await stat(file)).size, (await stat(out)).size];
  before += a;
  after += b;
  console.log(`${path.relative(ROOT, file).padEnd(42)} ${kb(a).padStart(8)} → ${kb(b).padStart(7)}`);
  await unlink(file);
}

console.log(`\nTotal ${kb(before)} → ${kb(after)} (${(100 - (after / before) * 100).toFixed(0)}% smaller)`);
