import fs from "node:fs";

const styleBiblePath = "assets/source/asset_style_bible.json";
const promptsPath = "assets/source/asset_prompts.json";
const latestReportPath = "reports/assets/asset_style_consistency_latest.md";
const latestContactSheetPath = "reports/assets/asset_style_contact_sheet_latest.html";
const failures = [];

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    failures.push(`${filePath} must parse as JSON: ${error.message}`);
    return null;
  }
}

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    failures.push(`missing required file: ${filePath}`);
    return "";
  }

  return fs.readFileSync(filePath, "utf8");
}

const styleBible = readJson(styleBiblePath);
const prompts = readJson(promptsPath);
const report = read(latestReportPath);
const contactSheet = read(latestContactSheetPath);

if (!styleBible?.style_anchor || styleBible.style_anchor.length < 80) {
  failures.push(`${styleBiblePath} must define a substantial style_anchor`);
}

if (!Array.isArray(styleBible?.reference_asset_ids) || styleBible.reference_asset_ids.length < 5) {
  failures.push(`${styleBiblePath} must define at least 5 reference_asset_ids`);
}

if (styleBible?.default_generation?.provider !== "openai_images_api") {
  failures.push(`${styleBiblePath} default_generation.provider must be openai_images_api`);
}

if (styleBible?.default_generation?.default_model !== "gpt-image-2") {
  failures.push(`${styleBiblePath} default_generation.default_model must be gpt-image-2`);
}

if (styleBible?.default_generation?.endpoint !== "v1/images/generations") {
  failures.push(`${styleBiblePath} default_generation.endpoint must be v1/images/generations`);
}

if (styleBible?.default_generation?.fallback_provider !== "codex_native_image_generation") {
  failures.push(`${styleBiblePath} default_generation.fallback_provider must be codex_native_image_generation`);
}

for (const reason of ["credits_exhausted", "quota_exhausted", "organization_verification_blocked"]) {
  if (!(styleBible?.default_generation?.fallback_when ?? []).includes(reason)) {
    failures.push(`${styleBiblePath} default_generation.fallback_when must include ${reason}`);
  }
}

const sharedStyle = prompts?.shared_style ?? "";
if (!sharedStyle.includes("Cute-strange greenhouse collectible")) {
  failures.push(`${promptsPath} shared_style must keep the project style anchor`);
}

for (const prompt of prompts?.prompts ?? []) {
  if (/^public\/assets\/game\//.test(prompt.output_path) && !/\.png$/i.test(prompt.output_path)) {
    failures.push(`${prompt.asset_id} output_path must be PNG for style-consistent game graphics`);
  }
}

for (const phrase of [
  "Style anchor",
  "Reference assets",
  "Contact sheet",
  "48px",
  "96px",
  "same-screen",
  "family motif",
  "screen integration",
  "regenerate"
]) {
  if (!report.includes(phrase)) failures.push(`${latestReportPath} missing phrase: ${phrase}`);
}

for (const assetId of styleBible?.reference_asset_ids ?? []) {
  if (!contactSheet.includes(assetId)) failures.push(`${latestContactSheetPath} missing reference asset id: ${assetId}`);
}

console.log(
  JSON.stringify(
    {
      ok: failures.length === 0,
      styleBible: styleBiblePath,
      report: latestReportPath,
      contactSheet: latestContactSheetPath,
      failures
    },
    null,
    2
  )
);

if (failures.length > 0) {
  process.exit(1);
}
