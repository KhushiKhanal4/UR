/**
 * Renders the raster icons from src/app/icon.svg (the source of truth). Run after changing it:
 *   node scripts/make-icons.mjs
 *
 * - src/app/icon1.png    96×96   the PNG favicon Google Search shows (it needs ≥48px, raster)
 * - src/app/apple-icon.png 180×180 iOS home screen; full-bleed, since iOS rounds the corners
 * - src/app/favicon.ico   48×48   for browsers and crawlers that ask for /favicon.ico directly
 * - public/icon-512.png   512×512 the web app manifest's large icon
 */
import { readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

const svg = await readFile("src/app/icon.svg", "utf8");
const square = svg.replace(/\srx="[^"]*"/, ""); // no rounded corners

const render = (source, size) => sharp(Buffer.from(source), { density: 384 }).resize(size, size).png().toBuffer();

await writeFile("src/app/icon1.png", await render(svg, 96));
await writeFile("src/app/apple-icon.png", await render(square, 180));
await writeFile("public/icon-512.png", await render(square, 512));

/* an .ico is a small header followed by images; modern ones may embed a PNG as-is */
const png = await render(svg, 48);
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(1, 4); // one image
header.writeUInt8(48, 6); // width
header.writeUInt8(48, 7); // height
header.writeUInt8(0, 8); // no palette
header.writeUInt8(0, 9); // reserved
header.writeUInt16LE(1, 10); // colour planes
header.writeUInt16LE(32, 12); // bits per pixel
header.writeUInt32LE(png.length, 14); // image size
header.writeUInt32LE(22, 18); // image offset
await writeFile("src/app/favicon.ico", Buffer.concat([header, png]));

console.log("icons written: icon1.png, apple-icon.png, favicon.ico, public/icon-512.png");
