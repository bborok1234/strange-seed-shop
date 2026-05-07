import fs from "node:fs";
import sharp from "sharp";

const alphaCleanupIds = [
  "tile_plot_empty_v1",
  "tile_plot_sprout_v1",
  "tile_plot_growing_v1",
  "tile_plot_ready_v1",
  "tile_plot_locked_preview_v1",
  "facility_workbench_v1",
  "facility_order_crate_empty_v1",
  "facility_order_crate_filled_v1",
  "ui_shadow_soft_v1"
];

const promptsPath = "assets/source/asset_prompts.json";
const provenancePath = "assets/source/gpt_image_asset_provenance.json";
const statusPath = "assets/source/asset_generation_status.json";

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, "utf8"));
const writeJson = (filePath, value) => fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);

const prompts = readJson(promptsPath).prompts ?? [];
const provenance = readJson(provenancePath);
const status = readJson(statusPath);
const records = [];

for (const assetId of alphaCleanupIds) {
  const prompt = prompts.find((entry) => entry.asset_id === assetId);
  if (!prompt) {
    throw new Error(`missing prompt: ${assetId}`);
  }

  const result = await alphaClean(prompt.output_path);
  records.push({ asset_id: assetId, output_path: prompt.output_path, ...result });

  const record = (provenance.records ?? []).find((entry) => entry.asset_id === assetId);
  if (record) {
    record.post_processing = Array.from(
      new Set([...(record.post_processing ?? []), "edge_connected_checkerboard_alpha_cleanup"])
    );
    record.review_required = true;
  }

  const batchAsset = status.batches?.issue_0237_topology_asset_generation_review?.completed_assets?.find(
    (entry) => entry.asset_id === assetId
  );
  if (batchAsset) {
    batchAsset.channels = 4;
    batchAsset.has_alpha = true;
    batchAsset.post_processing = Array.from(
      new Set([...(batchAsset.post_processing ?? []), "edge_connected_checkerboard_alpha_cleanup"])
    );
    batchAsset.notes = `${batchAsset.notes} Postprocessed in #444 for Phaser runtime layering.`;
  }
}

provenance.updated_at = new Date().toISOString();
writeJson(provenancePath, provenance);
writeJson(statusPath, status);

console.log(JSON.stringify({ ok: true, cleaned: records }, null, 2));

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
  let cleared = 0;
  for (let index = 0; index < pixelCount; index += 1) {
    if (visited[index]) {
      out[index * info.channels + 3] = 0;
      cleared += 1;
    }
  }

  await sharp(out, {
    raw: {
      width: info.width,
      height: info.height,
      channels: info.channels
    }
  })
    .png()
    .toFile(filePath);

  return {
    width: info.width,
    height: info.height,
    clearedPixels: cleared,
    clearedPercent: Number(((cleared / pixelCount) * 100).toFixed(2))
  };
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
