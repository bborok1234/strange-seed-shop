import fs from "node:fs";

const manifestPath = "public/assets/manifest/assetManifest.json";
const exceptionPath = "assets/source/asset_alpha_exceptions.json";
const alphaRequiredCategories = new Set(["creature", "seed", "seed_icon", "ui", "ui_frame", "sprite_strip", "fx", "fx_strip"]);
const alphaOptionalIntendedUses = new Set(["background", "shop_card", "panel_background"]);
const failures = [];

function readJson(path) {
  try {
    return JSON.parse(fs.readFileSync(path, "utf8"));
  } catch (error) {
    failures.push(`${path} must parse as JSON: ${error.message}`);
    return null;
  }
}

function toLocalPath(assetPath) {
  return assetPath.startsWith("/") ? `public${assetPath}` : assetPath;
}

function readPngInfo(path) {
  const buffer = fs.readFileSync(path);
  if (buffer.length < 33 || buffer.toString("ascii", 1, 4) !== "PNG") {
    return { isPng: false, hasAlpha: false, colorType: null };
  }

  const colorType = buffer.readUInt8(25);
  const hasAlpha = colorType === 4 || colorType === 6 || buffer.includes(Buffer.from("tRNS"));
  return { isPng: true, hasAlpha, colorType };
}

const manifest = readJson(manifestPath);
const exceptionDoc = fs.existsSync(exceptionPath) ? readJson(exceptionPath) : { exceptions: [] };
const exceptions = new Map();
for (const entry of exceptionDoc?.exceptions ?? []) {
  if (!entry.asset_id || !entry.reason || !entry.follow_up || !entry.expires_after) {
    failures.push(`${exceptionPath} exception must include asset_id, reason, follow_up, expires_after`);
    continue;
  }
  exceptions.set(entry.asset_id, entry);
}

let checked = 0;
let alphaPassed = 0;
let excepted = 0;
const alphaFailures = [];

for (const [assetId, asset] of Object.entries(manifest?.assets ?? {})) {
  if (asset.status !== "accepted") continue;
  const category = asset.category;
  const intendedUse = asset.intended_use;
  const requiresAlpha = alphaRequiredCategories.has(category) && !alphaOptionalIntendedUses.has(intendedUse);
  if (!requiresAlpha) continue;

  checked += 1;
  const localPath = toLocalPath(asset.path ?? "");
  if (!localPath || !fs.existsSync(localPath)) {
    failures.push(`${assetId} missing local asset path for alpha quality check: ${localPath}`);
    continue;
  }

  const info = readPngInfo(localPath);
  if (!info.isPng) {
    failures.push(`${assetId} must be PNG for alpha quality check`);
    continue;
  }

  if (info.hasAlpha) {
    alphaPassed += 1;
    continue;
  }

  const exception = exceptions.get(assetId);
  if (exception) {
    excepted += 1;
    continue;
  }

  alphaFailures.push(`${assetId} (${localPath}) has no alpha channel and no exception`);
}

for (const assetId of exceptions.keys()) {
  if (!manifest?.assets?.[assetId]) {
    failures.push(`${exceptionPath} references missing manifest asset: ${assetId}`);
  }
}

if (alphaFailures.length > 0) {
  failures.push(...alphaFailures);
}

console.log(JSON.stringify({ ok: failures.length === 0, checked, alphaPassed, excepted, failures }, null, 2));

if (failures.length > 0) {
  process.exit(1);
}
