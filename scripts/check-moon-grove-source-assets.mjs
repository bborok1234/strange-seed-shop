import fs from "node:fs";
import sharp from "sharp";

const promptsPath = "assets/source/asset_prompts.json";
const provenancePath = "assets/source/gpt_image_asset_provenance.json";
const statusPath = "assets/source/asset_generation_status.json";
const reviewPath = "reports/assets/moon_grove_source_asset_review_20260511.md";
const contactSheetPath = "reports/assets/moon_grove_source_asset_contact_sheet_20260511.png";

const expected = [
  {
    assetId: "seed_moon_grove_001_icon",
    width: 1024,
    height: 1024,
    postProcessing: "border_connected_checkerboard_alpha_cleanup"
  },
  {
    assetId: "fx_moon_grove_source_reward_strip_v1",
    width: 768,
    height: 96,
    postProcessing: "strict_strip_normalization",
    binding: "moon_fence.reward.action.claim_source_clue",
    frames: 8,
    frameWidth: 96,
    frameHeight: 96,
    fps: 12
  }
];

const failures = [];
const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, "utf8"));
const exists = (filePath) => fs.existsSync(filePath) && fs.statSync(filePath).size > 0;

const prompts = readJson(promptsPath).prompts ?? [];
const provenance = readJson(provenancePath).records ?? [];
const status = readJson(statusPath);
const review = exists(reviewPath) ? fs.readFileSync(reviewPath, "utf8") : "";

if (!exists(contactSheetPath)) {
  failures.push(`missing contact sheet: ${contactSheetPath}`);
}
if (!review.includes("gpt-image-2") || !review.includes("Runtime separation")) {
  failures.push(`${reviewPath} must document model and runtime separation`);
}

const batch = status.batches?.issue_0532_moon_grove_source_asset_generation_review;
if (!batch || batch.total !== expected.length || batch.completed !== expected.length || batch.blocked !== false) {
  failures.push(`${statusPath} missing issue_0532_moon_grove_source_asset_generation_review completion`);
}

for (const spec of expected) {
  const prompt = prompts.find((entry) => entry.asset_id === spec.assetId);
  if (!prompt) {
    failures.push(`${spec.assetId} missing prompt`);
    continue;
  }
  if (!/\.png$/i.test(prompt.output_path)) {
    failures.push(`${spec.assetId} output_path must be PNG: ${prompt.output_path}`);
  }
  if (!exists(prompt.output_path)) {
    failures.push(`${spec.assetId} missing PNG: ${prompt.output_path}`);
  } else {
    const metadata = await sharp(prompt.output_path).metadata();
    if (metadata.width !== spec.width || metadata.height !== spec.height) {
      failures.push(`${spec.assetId} expected ${spec.width}x${spec.height}, got ${metadata.width}x${metadata.height}`);
    }
    if (!metadata.hasAlpha) {
      failures.push(`${spec.assetId} must have alpha after postprocess`);
    }
  }

  const record = provenance.find((entry) => entry.asset_id === spec.assetId);
  if (!record) {
    failures.push(`${spec.assetId} missing provenance record`);
  } else {
    if (record.provider !== "openai_images_api" || record.model !== "gpt-image-2") {
      failures.push(`${spec.assetId} provenance must be openai_images_api/gpt-image-2`);
    }
    if (!exists(record.raw_output_path)) {
      failures.push(`${spec.assetId} missing raw_output_path: ${record.raw_output_path}`);
    }
    if (record.accepted_output_path !== prompt.output_path) {
      failures.push(`${spec.assetId} accepted_output_path must match prompt output_path`);
    }
    if (!record.post_processing?.includes(spec.postProcessing)) {
      failures.push(`${spec.assetId} missing post_processing ${spec.postProcessing}`);
    }
    if (spec.binding) {
      const normalization = record.normalization;
      if (!normalization || normalization.binding !== spec.binding || normalization.frames !== spec.frames || normalization.frameWidth !== spec.frameWidth || normalization.frameHeight !== spec.frameHeight || normalization.frameRate !== spec.fps) {
        failures.push(`${spec.assetId} normalization metadata must match binding/frame contract`);
      }
    }
  }

  if (!review.includes(spec.assetId)) {
    failures.push(`${reviewPath} missing ${spec.assetId}`);
  }
}

console.log(JSON.stringify({ ok: failures.length === 0, checked: expected.length, review: reviewPath, contactSheet: contactSheetPath, failures }, null, 2));

if (failures.length > 0) {
  process.exit(1);
}
