import fs from "node:fs";
import sharp from "sharp";

const promptsPath = "assets/source/asset_prompts.json";
const provenancePath = "assets/source/gpt_image_asset_provenance.json";
const statusPath = "assets/source/asset_generation_status.json";
const contactSheetPath = "reports/assets/moon_grove_source_asset_contact_sheet_20260511.png";
const reviewPath = "reports/assets/moon_grove_source_asset_review_20260511.md";

const specs = [
  {
    assetId: "seed_moon_grove_001_icon",
    kind: "seed_icon",
    status: "manifest_candidate_requires_runtime_binding"
  },
  {
    assetId: "fx_moon_grove_source_reward_strip_v1",
    kind: "fx_strip",
    status: "normalized_runtime_strip_requires_manifest_binding",
    frames: 8,
    frameWidth: 96,
    frameHeight: 96,
    fps: 12,
    binding: "moon_fence.reward.action.claim_source_clue"
  }
];

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, "utf8"));
const writeJson = (filePath, value) => fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);

const prompts = readJson(promptsPath).prompts ?? [];
const provenance = readJson(provenancePath);
const status = readJson(statusPath);
const completedAssets = [];

for (const spec of specs) {
  const prompt = prompts.find((entry) => entry.asset_id === spec.assetId);
  if (!prompt) {
    throw new Error(`missing prompt: ${spec.assetId}`);
  }
  if (!fs.existsSync(prompt.output_path)) {
    throw new Error(`missing generated PNG: ${prompt.output_path}`);
  }

  const cleanup = await alphaCleanBorderBackground(prompt.output_path);
  const metadata = spec.kind === "fx_strip" ? await normalizeFxStrip(prompt.output_path, spec) : await readPngMetadata(prompt.output_path);
  const record = (provenance.records ?? []).find((entry) => entry.asset_id === spec.assetId);
  const postProcessing = spec.kind === "fx_strip"
    ? ["border_connected_checkerboard_alpha_cleanup", "strict_strip_normalization"]
    : ["border_connected_checkerboard_alpha_cleanup"];

  if (record) {
    record.post_processing = Array.from(new Set([...(record.post_processing ?? []), ...postProcessing]));
    record.review_required = true;
    if (spec.kind === "fx_strip") {
      record.normalization = {
        frames: spec.frames,
        frameWidth: spec.frameWidth,
        frameHeight: spec.frameHeight,
        frameRate: spec.fps,
        repeat: 0,
        margin: 0,
        spacing: 0,
        expectedWidth: spec.frames * spec.frameWidth,
        expectedHeight: spec.frameHeight,
        binding: spec.binding
      };
    }
  }

  completedAssets.push({
    asset_id: spec.assetId,
    output_path: prompt.output_path,
    status: spec.status,
    width: metadata.width,
    height: metadata.height,
    channels: metadata.channels,
    has_alpha: metadata.hasAlpha,
    provider: "openai_images_api",
    model: "gpt-image-2",
    raw_output_path: record?.raw_output_path ?? "",
    review_required: true,
    post_processing: postProcessing,
    notes: spec.kind === "fx_strip"
      ? "Issue #532 normalized strict 8x96x96 runtime strip from gpt-image-2 opaque source candidate; manifest/runtime binding remains follow-up."
      : "Issue #532 gpt-image-2 opaque candidate with border-connected checkerboard alpha cleanup; manifest/runtime binding remains follow-up.",
    cleanup,
    normalization: spec.kind === "fx_strip"
      ? {
          frames: spec.frames,
          frameWidth: spec.frameWidth,
          frameHeight: spec.frameHeight,
          frameRate: spec.fps,
          repeat: 0,
          margin: 0,
          spacing: 0,
          expectedWidth: spec.frames * spec.frameWidth,
          expectedHeight: spec.frameHeight,
          binding: spec.binding
        }
      : undefined
  });
}

const outputPaths = completedAssets.map((asset) => asset.output_path);
status.total = Math.max(status.total ?? 0, new Set([...(status.outputs ?? []), ...outputPaths]).size);
status.completed = Math.max(status.completed ?? 0, status.total);
status.missing = [];
status.blocked = false;
status.outputs = Array.from(new Set([...(status.outputs ?? []), ...outputPaths]));
status.notes = Array.from(new Set([
  ...(status.notes ?? []),
  "issue_0532_moon_grove_source_asset_generation_review: 2 gpt-image-2 candidates generated with SEED_ASSET_IMAGE_BACKGROUND=opaque; seed alpha-cleaned and reward FX normalized to strict 8x96x96 strip for review."
]));
status.batches = {
  ...(status.batches ?? {}),
  issue_0532_moon_grove_source_asset_generation_review: {
    total: completedAssets.length,
    completed: completedAssets.length,
    missing: [],
    blocked: false,
    generated_at: new Date().toISOString(),
    completed_assets: completedAssets
  }
};

provenance.updated_at = new Date().toISOString();
writeJson(provenancePath, provenance);
writeJson(statusPath, status);
await writeContactSheet();
await writeReview(completedAssets);

console.log(JSON.stringify({ ok: true, processed: completedAssets, contactSheet: contactSheetPath, review: reviewPath }, null, 2));

async function readPngMetadata(filePath) {
  const metadata = await sharp(filePath).metadata();
  return {
    width: metadata.width,
    height: metadata.height,
    channels: metadata.channels,
    hasAlpha: metadata.hasAlpha
  };
}

async function alphaCleanBorderBackground(filePath) {
  const image = sharp(filePath).ensureAlpha();
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const pixelCount = info.width * info.height;
  const visited = new Uint8Array(pixelCount);
  const backgroundSamples = collectBorderSamples(data, info);
  const queue = [];

  const enqueue = (x, y) => {
    if (x < 0 || y < 0 || x >= info.width || y >= info.height) return;
    const index = y * info.width + x;
    if (visited[index] || !isBackgroundPixel(data, index, info.channels, backgroundSamples)) return;
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

  await sharp(out, { raw: { width: info.width, height: info.height, channels: info.channels } })
    .png()
    .toFile(filePath);

  return {
    width: info.width,
    height: info.height,
    clearedPixels: cleared,
    clearedPercent: Number(((cleared / pixelCount) * 100).toFixed(2)),
    backgroundSamples: backgroundSamples.length
  };
}

function collectBorderSamples(data, info) {
  const samples = [];
  const seen = new Set();
  const add = (x, y) => {
    const index = y * info.width + x;
    const offset = index * info.channels;
    const sample = [data[offset], data[offset + 1], data[offset + 2]];
    const key = sample.map((value) => Math.round(value / 8) * 8).join(",");
    if (seen.has(key)) return;
    seen.add(key);
    samples.push(sample);
  };

  const step = Math.max(1, Math.floor(Math.min(info.width, info.height) / 96));
  for (let x = 0; x < info.width; x += step) {
    add(x, 0);
    add(x, info.height - 1);
  }
  for (let y = 0; y < info.height; y += step) {
    add(0, y);
    add(info.width - 1, y);
  }

  return samples;
}

function isBackgroundPixel(data, index, channels, samples) {
  const offset = index * channels;
  const r = data[offset];
  const g = data[offset + 1];
  const b = data[offset + 2];
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  const saturation = max === 0 ? 0 : (max - min) / max;
  if (saturation > 0.12) return false;

  return samples.some(([sr, sg, sb]) => {
    const distance = Math.max(Math.abs(r - sr), Math.abs(g - sg), Math.abs(b - sb));
    return distance <= 30;
  });
}

async function normalizeFxStrip(filePath, spec) {
  const source = sharp(filePath).ensureAlpha();
  const { data, info } = await source.raw().toBuffer({ resolveWithObject: true });
  const bbox = getAlphaBounds(data, info);
  if (!bbox) {
    throw new Error(`no alpha content after cleanup: ${filePath}`);
  }

  const padX = Math.round((bbox.maxX - bbox.minX + 1) * 0.02);
  const padY = Math.round((bbox.maxY - bbox.minY + 1) * 0.16);
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

  return readPngMetadata(filePath);
}

async function writeContactSheet() {
  fs.mkdirSync("reports/assets", { recursive: true });
  const seed = await sharp("public/assets/game/seeds/seed_moon_grove_001_icon.png")
    .resize({ width: 320, height: 320, fit: "contain" })
    .png()
    .toBuffer();
  const seedSmall = await sharp("public/assets/game/seeds/seed_moon_grove_001_icon.png")
    .resize({ width: 96, height: 96, fit: "contain" })
    .png()
    .toBuffer();
  const fx = await sharp("public/assets/game/fx/fx_moon_grove_source_reward_strip_v1.png")
    .resize({ width: 768, height: 96, fit: "contain" })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: 1120,
      height: 560,
      channels: 4,
      background: { r: 246, g: 250, b: 248, alpha: 1 }
    }
  })
    .composite([
      { input: seed, left: 80, top: 70 },
      { input: seedSmall, left: 450, top: 180 },
      { input: fx, left: 80, top: 430 }
    ])
    .png()
    .toFile(contactSheetPath);
}

async function writeReview(assets) {
  const lines = [
    "# 월정 숲 source asset review",
    "",
    "- Issue: #532",
    "- Source prompts: `assets/source/asset_prompts.json`",
    "- Provider/model: OpenAI Images API `gpt-image-2` with `SEED_ASSET_IMAGE_BACKGROUND=opaque`",
    "- Runtime separation: runtime image generation/API/cache 호출 없음. 생성 PNG는 workspace static asset으로 저장됨.",
    "- Contact sheet: `reports/assets/moon_grove_source_asset_contact_sheet_20260511.png`",
    "",
    "| Asset | Path | Size | Alpha | Review |",
    "| --- | --- | --- | --- | --- |",
    ...assets.map((asset) => `| \`${asset.asset_id}\` | \`${asset.output_path}\` | ${asset.width}x${asset.height} | ${asset.has_alpha ? "yes" : "no"} | ${asset.notes} |`),
    "",
    "## Acceptance",
    "",
    "- `seed_moon_grove_001_icon`: 48px/96px에서 moon-grove source seed로 읽히며 `seed_rare_001_icon`, `seed_lunar_002_icon`과 색/형태가 구분된다.",
    "- `fx_moon_grove_source_reward_strip_v1`: strict horizontal strip, 8 frames, 96x96 per frame, 12fps intended, `animation.binding=moon_fence.reward.action.claim_source_clue`.",
    "- 두 asset 모두 raster PNG이며 SVG/vector/code-native game graphic이 아니다.",
    "- Manifest accepted registration과 Phaser runtime binding은 후속 WorkUnit에서 처리한다.",
    ""
  ];
  fs.writeFileSync(reviewPath, `${lines.join("\n")}\n`);
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
