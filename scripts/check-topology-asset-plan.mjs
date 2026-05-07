import { readFile } from "node:fs/promises";

const requiredIds = [
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

const spriteIds = new Set([
  "actor_pori_caretaker_strip_v1",
  "actor_momo_carrier_strip_v1",
  "fx_care_spark_strip_v1",
  "fx_harvest_leaf_flyout_strip_v1"
]);

const plan = JSON.parse(await readFile("assets/source/asset_plan.json", "utf8"));
const prompts = JSON.parse(await readFile("assets/source/asset_prompts.json", "utf8"));
const failures = [];

const planIds = plan.assets.map((asset) => asset.id);
const promptIds = prompts.prompts.map((prompt) => prompt.asset_id);
const planIdSet = new Set(planIds);
const promptIdSet = new Set(promptIds);

for (const [label, ids] of [
  ["plan", planIds],
  ["prompts", promptIds]
]) {
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicates.length > 0) {
    failures.push(`${label} duplicate ids: ${[...new Set(duplicates)].join(", ")}`);
  }
}

for (const id of requiredIds) {
  const asset = plan.assets.find((candidate) => candidate.id === id);
  const prompt = prompts.prompts.find((candidate) => candidate.asset_id === id);
  if (!asset) failures.push(`missing plan asset: ${id}`);
  if (!prompt) failures.push(`missing prompt: ${id}`);
  if (asset?.output_path?.endsWith(".svg")) failures.push(`${id} uses SVG output`);
  if (asset && !asset.output_path?.startsWith("public/assets/game/")) {
    failures.push(`${id} output path is not project-local game asset path`);
  }
  if (prompt && !prompt.prompt.includes("Use case:") && !prompt.prompt.includes("Use case")) {
    failures.push(`${id} prompt missing Use case`);
  }
  if (prompt && !prompt.prompt.includes("Avoid")) {
    failures.push(`${id} prompt missing Avoid section`);
  }
}

const promptOnly = promptIds.filter((id) => !planIdSet.has(id));
const planOnly = planIds.filter((id) => !promptIdSet.has(id));
if (promptOnly.length > 0) failures.push(`prompt ids missing from plan: ${promptOnly.join(", ")}`);
if (planOnly.length > 0) failures.push(`plan ids missing from prompts: ${planOnly.join(", ")}`);

for (const id of spriteIds) {
  const asset = plan.assets.find((candidate) => candidate.id === id);
  const prompt = prompts.prompts.find((candidate) => candidate.asset_id === id);
  if (!asset?.frame_count) failures.push(`${id} missing frame_count`);
  if (!asset?.frame_size) failures.push(`${id} missing frame_size`);
  if (!asset?.intended_fps) failures.push(`${id} missing intended_fps`);
  if (!asset?.animation?.binding) failures.push(`${id} missing animation.binding`);
  if (prompt && !prompt.prompt.includes("horizontal")) failures.push(`${id} prompt missing horizontal strip direction`);
}

const backgroundPrompt = prompts.prompts.find((prompt) => prompt.asset_id === "bg_garden_terrain_open_v1");
if (backgroundPrompt && !backgroundPrompt.prompt.includes("Do not draw or imply active gameplay objects")) {
  failures.push("background prompt missing baked-in gameplay object prohibition");
}

const result = {
  ok: failures.length === 0,
  requiredCount: requiredIds.length,
  planCount: plan.assets.length,
  promptCount: prompts.prompts.length,
  failures
};

console.log(JSON.stringify(result, null, 2));
if (failures.length > 0) {
  process.exit(1);
}
