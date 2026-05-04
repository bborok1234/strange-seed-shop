#!/usr/bin/env node
import fs from "node:fs";
import sharp from "sharp";

const args = process.argv.slice(2);
const getArgValue = (name) => {
  const prefix = `${name}=`;
  return args.find((arg) => arg.startsWith(prefix))?.slice(prefix.length);
};

const inputPath = getArgValue("--input");
const outputPath = getArgValue("--output") ?? inputPath;
const threshold = Number(getArgValue("--threshold") ?? 225);
const featherWidth = Number(getArgValue("--feather") ?? 12);

if (!inputPath) {
  console.error("usage: node scripts/chroma-key-asset.mjs --input=<path> [--output=<path>] [--threshold=225] [--feather=12]");
  process.exit(1);
}

if (!fs.existsSync(inputPath)) {
  console.error(`input not found: ${inputPath}`);
  process.exit(1);
}

const meta = await sharp(inputPath).metadata();
const channels = meta.channels;
const { data, info } = await sharp(inputPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

const pixelCount = info.width * info.height;
const out = Buffer.alloc(pixelCount * 4);

let cleared = 0;
let feathered = 0;

for (let i = 0; i < pixelCount; i += 1) {
  const ri = i * info.channels;
  const oi = i * 4;
  const r = data[ri];
  const g = data[ri + 1];
  const b = data[ri + 2];
  const a = info.channels === 4 ? data[ri + 3] : 255;

  const minChannel = Math.min(r, g, b);
  const maxChannel = Math.max(r, g, b);
  const saturation = maxChannel === 0 ? 0 : (maxChannel - minChannel) / maxChannel;

  out[oi] = r;
  out[oi + 1] = g;
  out[oi + 2] = b;

  if (minChannel >= threshold && saturation < 0.04) {
    out[oi + 3] = 0;
    cleared += 1;
  } else if (minChannel >= threshold - featherWidth && saturation < 0.06) {
    const span = featherWidth;
    const ratio = Math.max(0, Math.min(1, (minChannel - (threshold - span)) / span));
    out[oi + 3] = Math.round(a * (1 - ratio));
    feathered += 1;
  } else {
    out[oi + 3] = a;
  }
}

await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
  .png()
  .toFile(outputPath);

console.log(JSON.stringify({
  ok: true,
  input: inputPath,
  output: outputPath,
  width: info.width,
  height: info.height,
  inputChannels: channels,
  outputChannels: 4,
  threshold,
  feather: featherWidth,
  cleared,
  feathered,
  totalPixels: pixelCount,
  clearedPercent: Number(((cleared / pixelCount) * 100).toFixed(2)),
  featheredPercent: Number(((feathered / pixelCount) * 100).toFixed(2))
}, null, 2));
