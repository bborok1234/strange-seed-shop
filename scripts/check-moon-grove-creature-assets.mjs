import fs from "node:fs";
import sharp from "sharp";

const promptsPath = "assets/source/asset_prompts.json";
const provenancePath = "assets/source/gpt_image_asset_provenance.json";
const statusPath = "assets/source/asset_generation_status.json";
const reviewPath = "reports/assets/moon_grove_creature_asset_review_20260526.md";
const contactSheetPath = "reports/assets/moon_grove_creature_asset_contact_sheet_20260526.png";
const failures = [];

const specs = [
  {
    assetId: "creature_moon_grove_001",
    path: "public/assets/game/creatures/creature_moon_grove_001.png",
    width: 1024,
    height: 1024,
    postProcessing: ["border_connected_checkerboard_alpha_cleanup"]
  },
  {
    assetId: "actor_moon_grove_miru_idle_strip_v1",
    path: "public/assets/game/actors/actor_moon_grove_miru_idle_strip_v1.png",
    width: 768,
    height: 96,
    frames: 8,
    frameWidth: 96,
    frameHeight: 96,
    frameRate: 8,
    repeat: -1,
    binding: "moon_grove.discovery.actor.idle",
    postProcessing: ["border_connected_checkerboard_alpha_cleanup", "strict_strip_normalization", "frame_edge_fragment_cleanup"]
  },
  {
    assetId: "actor_moon_grove_miru_work_strip_v1",
    path: "public/assets/game/actors/actor_moon_grove_miru_work_strip_v1.png",
    width: 768,
    height: 96,
    frames: 8,
    frameWidth: 96,
    frameHeight: 96,
    frameRate: 10,
    repeat: -1,
    binding: "moon_grove.discovery.actor.work",
    postProcessing: ["border_connected_checkerboard_alpha_cleanup", "strict_strip_normalization", "frame_edge_fragment_cleanup"]
  },
  {
    assetId: "fx_moon_grove_discovery_bloom_strip_v1",
    path: "public/assets/game/fx/fx_moon_grove_discovery_bloom_strip_v1.png",
    width: 768,
    height: 96,
    frames: 8,
    frameWidth: 96,
    frameHeight: 96,
    frameRate: 12,
    repeat: 0,
    binding: "moon_grove.discovery.action.reveal",
    postProcessing: ["border_connected_checkerboard_alpha_cleanup", "strict_strip_normalization", "frame_edge_fragment_cleanup"]
  }
];

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    failures.push(`${filePath} must parse as JSON: ${error.message}`);
    return {};
  }
}

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    failures.push(`missing required file: ${filePath}`);
    return "";
  }

  return fs.readFileSync(filePath, "utf8");
}

async function pngMetadata(filePath) {
  try {
    return await sharp(filePath).metadata();
  } catch (error) {
    failures.push(`${filePath} must be readable PNG: ${error.message}`);
    return {};
  }
}

const prompts = readJson(promptsPath);
const provenance = readJson(provenancePath);
const status = readJson(statusPath);
const promptById = new Map((prompts.prompts ?? []).map((prompt) => [prompt.asset_id, prompt]));
const provenanceById = new Map((provenance.records ?? []).map((record) => [record.asset_id, record]));
const statusOutputs = new Set(status.outputs ?? []);
const batch = status.batches?.issue_0546_moon_grove_creature_asset_generation_review;
const review = read(reviewPath);

if (!fs.existsSync(contactSheetPath)) {
  failures.push(`missing contact sheet: ${contactSheetPath}`);
}

if (!batch) {
  failures.push(`${statusPath} missing issue_0546_moon_grove_creature_asset_generation_review completion`);
} else {
  if (batch.total !== specs.length || batch.completed !== specs.length || batch.blocked !== false) {
    failures.push(`${statusPath} issue_0546 batch should be complete/unblocked for ${specs.length} assets`);
  }
}

for (const phrase of ["gpt-image-2", "Runtime separation", "animation.binding=moon_grove.discovery.actor.idle", "animation.binding=moon_grove.discovery.actor.work", "animation.binding=moon_grove.discovery.action.reveal"]) {
  if (!review.includes(phrase)) {
    failures.push(`${reviewPath} missing phrase: ${phrase}`);
  }
}

for (const spec of specs) {
  const prompt = promptById.get(spec.assetId);
  if (!prompt) {
    failures.push(`${spec.assetId} missing prompt entry`);
  } else if (prompt.output_path !== spec.path) {
    failures.push(`${spec.assetId} prompt output_path ${prompt.output_path} should be ${spec.path}`);
  }

  if (!statusOutputs.has(spec.path)) {
    failures.push(`${spec.assetId} missing from ${statusPath} outputs`);
  }

  if (!fs.existsSync(spec.path)) {
    failures.push(`${spec.assetId} missing PNG at ${spec.path}`);
    continue;
  }

  const metadata = await pngMetadata(spec.path);
  if (metadata.width !== spec.width || metadata.height !== spec.height) {
    failures.push(`${spec.assetId} expected ${spec.width}x${spec.height}, got ${metadata.width}x${metadata.height}`);
  }
  if (!metadata.hasAlpha) {
    failures.push(`${spec.assetId} must have alpha channel after postprocess`);
  }

  const record = provenanceById.get(spec.assetId);
  if (!record) {
    failures.push(`${spec.assetId} missing provenance record`);
    continue;
  }

  if (record.provider !== "openai_images_api" || record.model !== "gpt-image-2") {
    failures.push(`${spec.assetId} provenance must be openai_images_api/gpt-image-2`);
  }
  if (record.accepted_output_path !== spec.path) {
    failures.push(`${spec.assetId} provenance accepted_output_path should be ${spec.path}`);
  }
  if (!record.raw_output_path || !fs.existsSync(record.raw_output_path)) {
    failures.push(`${spec.assetId} provenance raw_output_path missing or nonexistent`);
  }
  for (const step of spec.postProcessing) {
    if (!record.post_processing?.includes(step)) {
      failures.push(`${spec.assetId} provenance missing post_processing: ${step}`);
    }
  }

  if (spec.binding) {
    const normalization = record.normalization ?? {};
    for (const [key, value] of Object.entries({
      frames: spec.frames,
      frameWidth: spec.frameWidth,
      frameHeight: spec.frameHeight,
      frameRate: spec.frameRate,
      repeat: spec.repeat,
      expectedWidth: spec.width,
      expectedHeight: spec.height,
      binding: spec.binding
    })) {
      if (normalization[key] !== value) {
        failures.push(`${spec.assetId} normalization.${key} expected ${value}, got ${normalization[key]}`);
      }
    }
  }
}

console.log(
  JSON.stringify(
    {
      ok: failures.length === 0,
      checked: specs.length,
      review: reviewPath,
      contactSheet: contactSheetPath,
      failures
    },
    null,
    2
  )
);

if (failures.length > 0) process.exit(1);
