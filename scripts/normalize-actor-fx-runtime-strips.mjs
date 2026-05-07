import fs from "node:fs";
import sharp from "sharp";

const promptsPath = "assets/source/asset_prompts.json";
const provenancePath = "assets/source/gpt_image_asset_provenance.json";
const statusPath = "assets/source/asset_generation_status.json";

const specs = [
  {
    assetId: "actor_pori_caretaker_strip_v1",
    frames: 6,
    frameWidth: 128,
    frameHeight: 128,
    fps: 8,
    binding: "actor.task.care_plot"
  },
  {
    assetId: "actor_momo_carrier_strip_v1",
    frames: 6,
    frameWidth: 128,
    frameHeight: 128,
    fps: 8,
    binding: "actor.task.carry_leaves"
  },
  {
    assetId: "fx_care_spark_strip_v1",
    frames: 6,
    frameWidth: 96,
    frameHeight: 96,
    fps: 12,
    binding: "plot.action.care_tapped"
  },
  {
    assetId: "fx_harvest_leaf_flyout_strip_v1",
    frames: 8,
    frameWidth: 96,
    frameHeight: 96,
    fps: 14,
    binding: "plot.action.harvest_reward"
  }
];

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, "utf8"));
const writeJson = (filePath, value) => fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);

const prompts = readJson(promptsPath).prompts ?? [];
const provenance = readJson(provenancePath);
const status = readJson(statusPath);
const results = [];

for (const spec of specs) {
  const prompt = prompts.find((entry) => entry.asset_id === spec.assetId);
  if (!prompt) throw new Error(`missing prompt: ${spec.assetId}`);

  await alphaClean(prompt.output_path);
  const normalized = await normalizeStrip(prompt.output_path, spec);
  results.push({ asset_id: spec.assetId, output_path: prompt.output_path, ...normalized });

  const record = (provenance.records ?? []).find((entry) => entry.asset_id === spec.assetId);
  if (record) {
    record.post_processing = Array.from(
      new Set([...(record.post_processing ?? []), "edge_connected_checkerboard_alpha_cleanup", "strict_strip_normalization"])
    );
    record.review_required = false;
    record.normalization = {
      frames: spec.frames,
      frameWidth: spec.frameWidth,
      frameHeight: spec.frameHeight,
      frameRate: spec.fps,
      repeat: spec.assetId.startsWith("fx_") ? 0 : -1,
      margin: 0,
      spacing: 0,
      expectedWidth: spec.frames * spec.frameWidth,
      expectedHeight: spec.frameHeight,
      binding: spec.binding
    };
  }

  const batchAsset = status.batches?.issue_0237_topology_asset_generation_review?.completed_assets?.find(
    (entry) => entry.asset_id === spec.assetId
  );
  if (batchAsset) {
    batchAsset.status = "normalized_runtime_strip";
    batchAsset.width = spec.frames * spec.frameWidth;
    batchAsset.height = spec.frameHeight;
    batchAsset.channels = 4;
    batchAsset.has_alpha = true;
    batchAsset.post_processing = Array.from(
      new Set([...(batchAsset.post_processing ?? []), "edge_connected_checkerboard_alpha_cleanup", "strict_strip_normalization"])
    );
    batchAsset.normalization = {
      frames: spec.frames,
      frameWidth: spec.frameWidth,
      frameHeight: spec.frameHeight,
      frameRate: spec.fps,
      repeat: spec.assetId.startsWith("fx_") ? 0 : -1,
      margin: 0,
      spacing: 0,
      expectedWidth: spec.frames * spec.frameWidth,
      expectedHeight: spec.frameHeight,
      binding: spec.binding
    };
    batchAsset.notes = "Issue #446 normalized strict runtime strip from gpt-image-2 source candidate.";
  }
}

provenance.updated_at = new Date().toISOString();
writeJson(provenancePath, provenance);
writeJson(statusPath, status);

console.log(JSON.stringify({ ok: true, normalized: results }, null, 2));

async function normalizeStrip(filePath, spec) {
  const source = sharp(filePath).ensureAlpha();
  const { data, info } = await source.raw().toBuffer({ resolveWithObject: true });
  const bbox = getAlphaBounds(data, info);
  if (!bbox) throw new Error(`no alpha content after cleanup: ${filePath}`);

  const padX = Math.round((bbox.maxX - bbox.minX + 1) * 0.04);
  const padY = Math.round((bbox.maxY - bbox.minY + 1) * 0.12);
  const left = Math.max(0, bbox.minX - padX);
  const top = Math.max(0, bbox.minY - padY);
  const width = Math.min(info.width - left, bbox.maxX - bbox.minX + 1 + padX * 2);
  const height = Math.min(info.height - top, bbox.maxY - bbox.minY + 1 + padY * 2);
  const cellWidth = width / spec.frames;
  const composites = [];

  for (let frame = 0; frame < spec.frames; frame += 1) {
    const frameLeft = Math.max(0, Math.round(left + cellWidth * frame));
    const nextLeft = frame === spec.frames - 1 ? left + width : Math.round(left + cellWidth * (frame + 1));
    const frameWidth = Math.max(1, Math.min(info.width - frameLeft, nextLeft - frameLeft));
    const frameBuffer = await sharp(filePath)
      .extract({ left: frameLeft, top, width: frameWidth, height })
      .resize({
        width: spec.frameWidth,
        height: spec.frameHeight,
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toBuffer();
    composites.push({ input: frameBuffer, left: frame * spec.frameWidth, top: 0 });
  }

  await sharp({
    create: {
      width: spec.frames * spec.frameWidth,
      height: spec.frameHeight,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
    .composite(composites)
    .png()
    .toFile(filePath);

  return {
    width: spec.frames * spec.frameWidth,
    height: spec.frameHeight,
    frames: spec.frames,
    frameWidth: spec.frameWidth,
    frameHeight: spec.frameHeight,
    sourceBounds: bbox
  };
}

async function alphaClean(filePath) {
  const image = sharp(filePath).ensureAlpha();
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const pixelCount = info.width * info.height;
  const visited = new Uint8Array(pixelCount);
  const queue = [];

  const enqueue = (x, y) => {
    if (x < 0 || y < 0 || x >= info.width || y >= info.height) return;
    const index = y * info.width + x;
    if (visited[index] || !isBackgroundPixel(data, index, info.channels)) return;
    visited[index] = 1;
    queue.push(index);
  };

  for (let x = 0; x < info.width; x += 1) {
    enqueue(x, 0);
    enqueue(x, info.height - 1);
  }
  for (let y = 0; y < info.height; y += 1) {
    enqueue(0, y);
    enqueue(info.width - 1, y);
  }

  let head = 0;
  while (head < queue.length) {
    const index = queue[head];
    head += 1;
    const x = index % info.width;
    const y = Math.floor(index / info.width);
    enqueue(x + 1, y);
    enqueue(x - 1, y);
    enqueue(x, y + 1);
    enqueue(x, y - 1);
  }

  const out = Buffer.from(data);
  for (let index = 0; index < pixelCount; index += 1) {
    if (visited[index]) {
      out[index * info.channels + 3] = 0;
    }
  }

  await sharp(out, { raw: { width: info.width, height: info.height, channels: info.channels } }).png().toFile(filePath);
}

function getAlphaBounds(data, info) {
  let minX = info.width;
  let minY = info.height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < info.height; y += 1) {
    for (let x = 0; x < info.width; x += 1) {
      const alpha = data[(y * info.width + x) * info.channels + 3];
      if (alpha <= 8) continue;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }

  if (maxX < minX || maxY < minY) return null;
  return { minX, minY, maxX, maxY };
}

function isBackgroundPixel(data, index, channels) {
  const offset = index * channels;
  const r = data[offset];
  const g = data[offset + 1];
  const b = data[offset + 2];
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  const saturation = max === 0 ? 0 : (max - min) / max;
  return min >= 176 && saturation <= 0.1;
}
