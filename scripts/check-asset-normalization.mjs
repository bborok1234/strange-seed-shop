import fs from "node:fs";

const failures = [];

function requirePath(filePath) {
  if (!fs.existsSync(filePath)) failures.push(`missing required path: ${filePath}`);
}

function requirePhrases(filePath, phrases) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, "utf8");
  for (const phrase of phrases) {
    if (!content.includes(phrase)) failures.push(`${filePath} missing phrase: ${phrase}`);
  }
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    failures.push(`${filePath} must parse as JSON: ${error.message}`);
    return null;
  }
}

function readPngSize(filePath) {
  const buffer = fs.readFileSync(filePath);
  if (buffer.length < 24 || buffer.toString("ascii", 1, 4) !== "PNG") {
    failures.push(`${filePath} is not a PNG file`);
    return null;
  }

  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20)
  };
}

const requiredPaths = [
  "reports/assets/asset_export_normalization_20260428.md",
  "assets/source/sprite_normalization_provenance.example.json",
  "reports/assets/sprite_batch_001_review_20260427.md",
  "public/assets/manifest/assetManifest.json",
  "scripts/check-asset-normalization.mjs"
];

for (const filePath of requiredPaths) requirePath(filePath);

requirePhrases("reports/assets/asset_export_normalization_20260428.md", [
  "generated output -> normalized strip -> manifest -> checker",
  "Codex native image generation one asset at a time",
  "Do not leave final project assets only in Codex cache",
  "assets/source/generated/<batch>/<asset_id>/raw_*.png",
  "normalized 96x96 frame grid strip",
  "expectedWidth = margin * 2 + frameWidth * frames + spacing * (frames - 1)",
  "runtime_generation_allowed=false",
  "animation.binding",
  "raw workspace paths",
  "normalized output paths",
  "Stop conditions"
]);

requirePhrases("reports/assets/sprite_batch_001_review_20260427.md", [
  "deterministic static PNG strip",
  "runtime image generation",
  "strict slicing"
]);

const provenance = readJson("assets/source/sprite_normalization_provenance.example.json");
if (provenance) {
  if (provenance.generation_mode !== "codex_native_image_generation") {
    failures.push("provenance example must use codex_native_image_generation");
  }
  if (provenance.runtime_generation_allowed !== false) {
    failures.push("provenance example must keep runtime_generation_allowed=false");
  }
  if (!Array.isArray(provenance.records) || provenance.records.length === 0) {
    failures.push("provenance example must include records");
  } else {
    for (const [index, record] of provenance.records.entries()) {
      for (const field of [
        "asset_id",
        "prompt_id",
        "source_prompt_path",
        "raw_outputs",
        "selected_raw_output",
        "frame_sources",
        "normalized_output_path",
        "manifest_asset_id",
        "normalization",
        "checker",
        "reviewer",
        "rejected_outputs"
      ]) {
        if (record[field] === undefined || record[field] === null) {
          failures.push(`provenance record ${index} missing ${field}`);
        }
      }

      const normalization = record.normalization ?? {};
      const expectedWidth = normalization.margin * 2 + normalization.frameWidth * normalization.frames + normalization.spacing * (normalization.frames - 1);
      const expectedHeight = normalization.margin * 2 + normalization.frameHeight;
      if (normalization.frameWidth !== 96 || normalization.frameHeight !== 96) {
        failures.push(`provenance record ${index} must normalize to 96x96 frames`);
      }
      if (normalization.expectedWidth !== expectedWidth || normalization.expectedHeight !== expectedHeight) {
        failures.push(`provenance record ${index} expected dimensions do not match formula`);
      }
    }
  }
}

const manifest = readJson("public/assets/manifest/assetManifest.json");
let checkedSpriteStrips = 0;
if (manifest) {
  if (manifest.runtime_generation_allowed !== false) {
    failures.push("asset manifest must keep runtime_generation_allowed=false");
  }

  for (const [assetId, asset] of Object.entries(manifest.assets ?? {})) {
    const animation = asset.animation;
    if (asset.status !== "accepted" || !animation || animation.kind !== "spritesheet") {
      continue;
    }

    checkedSpriteStrips += 1;
    if (typeof asset.path !== "string" || asset.path.includes("/tmp") || asset.path.includes("cache") || /^https?:/.test(asset.path)) {
      failures.push(`${assetId} manifest path must be a project-local public asset path`);
      continue;
    }

    const localPath = asset.path.startsWith("/") ? `public${asset.path}` : asset.path;
    if (!fs.existsSync(localPath)) {
      failures.push(`${assetId} missing normalized output at ${localPath}`);
      continue;
    }

    const size = readPngSize(localPath);
    if (!size) continue;

    const margin = animation.margin ?? 0;
    const spacing = animation.spacing ?? 0;
    const expectedWidth = margin * 2 + animation.frameWidth * animation.frames + spacing * (animation.frames - 1);
    const expectedHeight = margin * 2 + animation.frameHeight;
    if (size.width !== expectedWidth || size.height !== expectedHeight) {
      failures.push(`${assetId} normalized strip expected ${expectedWidth}x${expectedHeight}, got ${size.width}x${size.height}`);
    }
    if (asset.width !== size.width || asset.height !== size.height) {
      failures.push(`${assetId} manifest dimensions ${asset.width}x${asset.height} do not match PNG ${size.width}x${size.height}`);
    }
  }
}

if (checkedSpriteStrips === 0) {
  failures.push("expected at least one accepted spritesheet asset in manifest");
}

if (failures.length > 0) {
  console.error(JSON.stringify({ ok: false, checkedSpriteStrips, failures }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ ok: true, checkedSpriteStrips, failures: [] }, null, 2));
