import fs from "node:fs";
import sharp from "sharp";

const requiredAssetIds = [
  "bg_garden_terrain_open_v1",
  "tile_plot_empty_v1",
  "tile_plot_sprout_v1",
  "tile_plot_growing_v1",
  "tile_plot_ready_v1",
  "tile_plot_locked_preview_v1",
  "facility_workbench_v1",
  "facility_order_crate_empty_v1",
  "facility_order_crate_filled_v1",
  "actor_pori_caretaker_strip_v1",
  "actor_momo_carrier_strip_v1",
  "fx_care_spark_strip_v1",
  "fx_harvest_leaf_flyout_strip_v1",
  "ui_shadow_soft_v1"
];

const promptsPath = "assets/source/asset_prompts.json";
const provenancePath = "assets/source/gpt_image_asset_provenance.json";
const statusPath = "assets/source/asset_generation_status.json";
const reportPath = "reports/assets/topology_asset_review_20260508.md";
const contactSheetPath = "reports/assets/topology_asset_contact_sheet_20260508.png";
const normalizedDimensions = new Map([
  ["actor_pori_caretaker_strip_v1", { width: 768, height: 128 }],
  ["actor_momo_carrier_strip_v1", { width: 768, height: 128 }],
  ["fx_care_spark_strip_v1", { width: 576, height: 96 }],
  ["fx_harvest_leaf_flyout_strip_v1", { width: 768, height: 96 }]
]);

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, "utf8"));
const exists = (filePath) => fs.existsSync(filePath) && fs.statSync(filePath).size > 0;

const prompts = readJson(promptsPath).prompts ?? [];
const provenance = readJson(provenancePath).records ?? [];
const status = readJson(statusPath);
const report = exists(reportPath) ? fs.readFileSync(reportPath, "utf8") : "";
const failures = [];

if (!exists(contactSheetPath)) {
  failures.push(`missing contact sheet: ${contactSheetPath}`);
}

if (!report.includes("gpt-image-2") || !report.includes("transparent background is not supported")) {
  failures.push(`${reportPath} must record the gpt-image-2 transparent-background blocker`);
}

if (!report.includes("manifest 투입 전 알파/배경 후처리 필요")) {
  failures.push(`${reportPath} must record alpha/background follow-up before manifest use`);
}

const batch = status.batches?.issue_0237_topology_asset_generation_review;
if (!batch || batch.total !== requiredAssetIds.length || batch.completed !== requiredAssetIds.length) {
  failures.push(`${statusPath} missing issue_0237_topology_asset_generation_review batch completion`);
}

for (const assetId of requiredAssetIds) {
  const prompt = prompts.find((entry) => entry.asset_id === assetId);
  if (!prompt) {
    failures.push(`${assetId} missing from ${promptsPath}`);
    continue;
  }

  if (!/\.png$/i.test(prompt.output_path)) {
    failures.push(`${assetId} output_path must be PNG: ${prompt.output_path}`);
  }

  if (!exists(prompt.output_path)) {
    failures.push(`${assetId} missing generated PNG: ${prompt.output_path}`);
  } else {
    const metadata = await sharp(prompt.output_path).metadata();
    const expected = normalizedDimensions.get(assetId) ?? { width: 1024, height: 1024 };
    if (metadata.width !== expected.width || metadata.height !== expected.height) {
      failures.push(`${assetId} expected ${expected.width}x${expected.height} candidate PNG, got ${metadata.width}x${metadata.height}`);
    }
  }

  const record = provenance.find((entry) => entry.asset_id === assetId);
  if (!record) {
    failures.push(`${assetId} missing provenance record`);
  } else {
    if (record.provider !== "openai_images_api") {
      failures.push(`${assetId} provider must be openai_images_api`);
    }
    if (record.model !== "gpt-image-2") {
      failures.push(`${assetId} model must be gpt-image-2`);
    }
    if (!exists(record.raw_output_path)) {
      failures.push(`${assetId} missing raw_output_path: ${record.raw_output_path}`);
    }
    if (record.accepted_output_path !== prompt.output_path || !exists(record.accepted_output_path)) {
      failures.push(`${assetId} accepted_output_path must match prompt output and exist`);
    }
    if (record.review_required !== true) {
      const normalized = record.post_processing?.includes("strict_strip_normalization");
      if (!normalized) {
        failures.push(`${assetId} must remain review_required before manifest integration`);
      }
    }
  }

  if (!report.includes(assetId)) {
    failures.push(`${reportPath} missing review row for ${assetId}`);
  }
}

if (failures.length > 0) {
  console.error(JSON.stringify({ ok: false, failures }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  checked: requiredAssetIds.length,
  report: reportPath,
  contactSheet: contactSheetPath
}, null, 2));
