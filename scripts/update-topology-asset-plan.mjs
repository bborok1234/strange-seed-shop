import { readFile, writeFile } from "node:fs/promises";

const PLAN_PATH = "assets/source/asset_plan.json";
const PROMPTS_PATH = "assets/source/asset_prompts.json";

const STYLE =
  "Cute-strange greenhouse collectible style, polished 2D mobile game art, soft rounded shapes, crisp readable silhouette, subtle painterly texture, warm whimsical garden shop mood, clean edges, no text, no watermark.";

const topologyAssets = [
  {
    id: "bg_garden_terrain_open_v1",
    category: "background",
    family: "sun_greenhouse",
    rarity: "common",
    growth_stage: "not_applicable",
    intended_use: "phaser_terrain_background",
    output_path: "public/assets/game/backgrounds/bg_garden_terrain_open_v1.png",
    manifest_tags: ["v1", "phaser", "terrain", "background", "topology_foundation_0236"],
    notes:
      "Open greenhouse terrain only. Must not bake in plots, workbench, order crate, storage, research desk, expedition gate, or active gameplay object."
  },
  {
    id: "tile_plot_empty_v1",
    category: "plot_tile",
    family: "sun_greenhouse",
    rarity: "common",
    growth_stage: "empty",
    intended_use: "phaser_runtime_plot_state",
    output_path: "public/assets/game/tiles/tile_plot_empty_v1.png",
    manifest_tags: ["v1", "phaser", "plot", "empty", "topology_foundation_0236"],
    notes: "Runtime plot tile for empty unlocked slot. 256x192 target."
  },
  {
    id: "tile_plot_sprout_v1",
    category: "plot_tile",
    family: "sun_greenhouse",
    rarity: "common",
    growth_stage: "sprout",
    intended_use: "phaser_runtime_plot_state",
    output_path: "public/assets/game/tiles/tile_plot_sprout_v1.png",
    manifest_tags: ["v1", "phaser", "plot", "sprout", "topology_foundation_0236"],
    notes: "Runtime plot tile for freshly planted starter seed. 256x192 target."
  },
  {
    id: "tile_plot_growing_v1",
    category: "plot_tile",
    family: "sun_greenhouse",
    rarity: "common",
    growth_stage: "growing",
    intended_use: "phaser_runtime_plot_state",
    output_path: "public/assets/game/tiles/tile_plot_growing_v1.png",
    manifest_tags: ["v1", "phaser", "plot", "growing", "topology_foundation_0236"],
    notes: "Runtime plot tile for visible growth progress. 256x192 target."
  },
  {
    id: "tile_plot_ready_v1",
    category: "plot_tile",
    family: "sun_greenhouse",
    rarity: "common",
    growth_stage: "ready",
    intended_use: "phaser_runtime_plot_state",
    output_path: "public/assets/game/tiles/tile_plot_ready_v1.png",
    manifest_tags: ["v1", "phaser", "plot", "ready", "topology_foundation_0236"],
    notes: "Runtime plot tile for harvest-ready state with readable payoff. 256x192 target."
  },
  {
    id: "tile_plot_locked_preview_v1",
    category: "plot_tile",
    family: "sun_greenhouse",
    rarity: "common",
    growth_stage: "locked_preview",
    intended_use: "phaser_runtime_plot_state",
    output_path: "public/assets/game/tiles/tile_plot_locked_preview_v1.png",
    manifest_tags: ["v1", "phaser", "plot", "locked_preview", "topology_foundation_0236"],
    notes: "Runtime plot tile for third-slot preview. 256x192 target."
  },
  {
    id: "facility_workbench_v1",
    category: "facility",
    family: "sun_greenhouse",
    rarity: "common",
    growth_stage: "not_applicable",
    intended_use: "phaser_runtime_facility",
    output_path: "public/assets/game/facilities/facility_workbench_v1.png",
    manifest_tags: ["v1", "phaser", "facility", "workbench", "topology_foundation_0236"],
    notes: "Runtime workbench prop. 320x220 target."
  },
  {
    id: "facility_order_crate_empty_v1",
    category: "facility",
    family: "sun_greenhouse",
    rarity: "common",
    growth_stage: "not_applicable",
    intended_use: "phaser_runtime_order_crate_state",
    output_path: "public/assets/game/facilities/facility_order_crate_empty_v1.png",
    manifest_tags: ["v1", "phaser", "facility", "order_crate", "empty", "topology_foundation_0236"],
    notes: "Runtime order crate empty state. 192x160 target."
  },
  {
    id: "facility_order_crate_filled_v1",
    category: "facility",
    family: "sun_greenhouse",
    rarity: "common",
    growth_stage: "not_applicable",
    intended_use: "phaser_runtime_order_crate_state",
    output_path: "public/assets/game/facilities/facility_order_crate_filled_v1.png",
    manifest_tags: ["v1", "phaser", "facility", "order_crate", "filled", "topology_foundation_0236"],
    notes: "Runtime order crate filled/sealed preview state. 192x160 target."
  },
  {
    id: "actor_pori_caretaker_strip_v1",
    category: "sprite_strip",
    family: "malang_leaf",
    rarity: "common",
    growth_stage: "complete",
    intended_use: "phaser_actor_caretaker",
    output_path: "public/assets/game/sprites/actor_pori_caretaker_strip_v1.png",
    manifest_tags: ["v1", "phaser", "actor", "pori", "caretaker", "topology_foundation_0236"],
    frame_count: 6,
    frame_size: "128x128",
    intended_fps: 8,
    animation: {
      binding: "actor.task.care_plot",
      behavior: "loop"
    },
    notes: "Horizontal sprite strip, 6 frames, bottom-center anchor, no clipping."
  },
  {
    id: "actor_momo_carrier_strip_v1",
    category: "sprite_strip",
    family: "shield_sprout",
    rarity: "common",
    growth_stage: "complete",
    intended_use: "phaser_actor_carrier",
    output_path: "public/assets/game/sprites/actor_momo_carrier_strip_v1.png",
    manifest_tags: ["v1", "phaser", "actor", "momo", "carrier", "topology_foundation_0236"],
    frame_count: 6,
    frame_size: "128x128",
    intended_fps: 8,
    animation: {
      binding: "actor.task.carry_leaves",
      behavior: "loop"
    },
    notes: "Horizontal sprite strip, 6 frames, bottom-center anchor, no clipping."
  },
  {
    id: "fx_care_spark_strip_v1",
    category: "fx_strip",
    family: "care",
    rarity: "common",
    growth_stage: "not_applicable",
    intended_use: "phaser_care_feedback_fx",
    output_path: "public/assets/game/fx/fx_care_spark_strip_v1.png",
    manifest_tags: ["v1", "phaser", "fx", "care", "topology_foundation_0236"],
    frame_count: 6,
    frame_size: "96x96",
    intended_fps: 12,
    animation: {
      binding: "plot.action.care_tapped",
      behavior: "once"
    },
    notes: "Horizontal FX strip for plot care/tap feedback."
  },
  {
    id: "fx_harvest_leaf_flyout_strip_v1",
    category: "fx_strip",
    family: "reward",
    rarity: "common",
    growth_stage: "not_applicable",
    intended_use: "phaser_harvest_reward_fx",
    output_path: "public/assets/game/fx/fx_harvest_leaf_flyout_strip_v1.png",
    manifest_tags: ["v1", "phaser", "fx", "harvest", "reward", "topology_foundation_0236"],
    frame_count: 8,
    frame_size: "96x96",
    intended_fps: 14,
    animation: {
      binding: "plot.action.harvest_reward",
      behavior: "once"
    },
    notes: "Horizontal FX strip for leaf flyout from plot/actor to HUD."
  },
  {
    id: "ui_shadow_soft_v1",
    category: "utility",
    family: "ui",
    rarity: "common",
    growth_stage: "not_applicable",
    intended_use: "phaser_actor_entity_grounding_shadow",
    output_path: "public/assets/game/ui/ui_shadow_soft_v1.png",
    manifest_tags: ["v1", "phaser", "utility", "shadow", "topology_foundation_0236"],
    notes: "Soft transparent grounding shadow for actors/entities. 128x64 target."
  }
];

const compatibilityAssets = [
  {
    id: "creature_herb_common_001_actor_work_idle_strip",
    category: "sprite_strip",
    family: "herb",
    rarity: "common",
    growth_stage: "complete",
    intended_use: "phaser_actor_work_idle_alias",
    output_path: "public/assets/game/sprites/starter/creature_herb_common_ready_strip.png",
    manifest_tags: ["phase0", "p0_5", "sprite", "actor", "alias"],
    frame_count: 4,
    frame_size: "96x96",
    intended_fps: 8,
    animation: {
      binding: "actor.task.work_idle",
      behavior: "loop"
    },
    notes: "Plan alias for an existing accepted raster strip reused as actor work_idle binding; no new generation required."
  },
  {
    id: "fx_lunar_harvest_moonburst_001",
    category: "fx_strip",
    family: "lunar",
    rarity: "common",
    growth_stage: "not_applicable",
    intended_use: "phaser_harvest_moonburst_alias",
    output_path: "public/assets/game/fx/fx_lunar_greenhouse_planting_pulse_001_strip.png",
    manifest_tags: ["phase0", "p0_5", "fx", "lunar", "alias"],
    frame_count: 4,
    frame_size: "160x160",
    intended_fps: 12,
    animation: {
      binding: "plot.action.harvest_plot",
      behavior: "once"
    },
    notes: "Plan alias for an existing accepted raster FX strip reused as lunar harvest moonburst fallback; no new generation required."
  }
];

function promptFor(asset) {
  const base = {
    asset_id: asset.id,
    output_path: asset.output_path,
    prompt: "",
    acceptance: [
      "raster PNG output path, no SVG/vector/code-native accepted game graphic",
      "no text, watermark, logo, or copyrighted character resemblance",
      "matches cute-strange greenhouse collectible style",
      "readable in a 393x852 mobile Phaser playfield"
    ]
  };

  const avoid =
    "Avoid text, watermark, logos, brand marks, copyrighted characters, living artist imitation, photorealism, horror, cluttered backgrounds, low contrast, and tiny unreadable details.";

  if (asset.id === "bg_garden_terrain_open_v1") {
    return {
      ...base,
      prompt: `Use case: stylized-concept\nAsset type: Phaser terrain background\nPrimary request: Create an open 햇살 온실 정원 terrain background for 이상한 씨앗상회 v1.\nSubject: Warm greenhouse floor, gentle depth, soft plant atmosphere, empty buildable spaces, inviting garden shop mood.\nStyle/medium: ${STYLE}\nComposition/framing: Vertical mobile background, 768x1664 or 1179x2556 composition, safe central board area, clear ground plane.\nColor palette: Fresh herb greens, warm cream light, soft leaf yellow, gentle greenhouse teal accents.\nConstraints: Do not draw or imply active gameplay objects. No plots, planters, workbench, order crate, storage basket, research shelf, expedition gate, character, UI, text, or icons baked into the background.\n${avoid}`,
      acceptance: [
        ...base.acceptance,
        "background contains no baked-in plot/facility/order/storage/research/expedition gameplay object",
        "empty terrain supports runtime slot placement"
      ]
    };
  }

  if (asset.category === "plot_tile") {
    return {
      ...base,
      prompt: `Use case: stylized-concept\nAsset type: Phaser runtime plot tile\nPrimary request: Create ${asset.id} for 이상한 씨앗상회 v1.\nSubject: A small raised garden plot tile for the ${asset.growth_stage} state, designed as a runtime entity placed on top of terrain.\nStyle/medium: ${STYLE}\nComposition/framing: Isometric-ish front-facing tile, transparent or clean removable background, 256x192 target, centered with generous padding.\nColor palette: Warm soil brown, fresh herb green, cream highlights, soft yellow growth accents.\nConstraints: The state must be readable at 64px and 96px. No text, no UI label, no character, no background scene.\n${avoid}`,
      acceptance: [
        ...base.acceptance,
        `${asset.growth_stage} plot state is visually distinct without text`,
        "works as a runtime entity, not a full background"
      ]
    };
  }

  if (asset.category === "facility") {
    const stateHint = asset.id.includes("filled") ? "filled/sealed order state" : asset.id.includes("empty") ? "empty order state" : "active workbench state";
    return {
      ...base,
      prompt: `Use case: stylized-concept\nAsset type: Phaser runtime facility prop\nPrimary request: Create ${asset.id} for 이상한 씨앗상회 v1.\nSubject: A cute greenhouse shop facility prop showing ${stateHint}.\nStyle/medium: ${STYLE}\nComposition/framing: Runtime prop with transparent or clean removable background, centered, readable at mobile scale.\nColor palette: Warm wood, herb green accents, cream highlights, small greenhouse teal shadows.\nConstraints: No text, no UI frame, no full background, no character. The facility state must read through prop shape and contents.\n${avoid}`,
      acceptance: [
        ...base.acceptance,
        "facility state is readable without text",
        "prop can sit on terrain as a runtime entity"
      ]
    };
  }

  if (asset.category === "sprite_strip") {
    return {
      ...base,
      prompt: `Use case: stylized-concept\nAsset type: horizontal Phaser actor sprite sheet\nPrimary request: Create ${asset.id} for 이상한 씨앗상회 v1.\nSubject: ${asset.id.includes("pori") ? "말랑잎 포리, a small leafy caretaker plant-creature, doing a gentle plot-care work loop." : "방패새싹 모모, a sturdy sprout carrier plant-creature, carrying leaves/material toward a crate."}\nStyle/medium: ${STYLE}\nComposition/framing: One horizontal sprite strip with exactly ${asset.frame_count} frames, each frame ${asset.frame_size}, consistent bottom-center anchor, full body visible, no clipping, transparent or clean removable background.\nColor palette: ${asset.id.includes("pori") ? "fresh leaf greens, warm yellow, cream face accents" : "shield-leaf greens, soft teal shadows, warm cream highlights"}.\nConstraints: Intended fps ${asset.intended_fps}; animation.binding ${asset.animation.binding}; loop behavior ${asset.animation.behavior}. No text, no UI, no background scene.\n${avoid}`,
      acceptance: [
        ...base.acceptance,
        `exactly ${asset.frame_count} frames in a horizontal strip`,
        `each frame is ${asset.frame_size}`,
        `animation.binding is ${asset.animation.binding}`,
        "bottom-center anchor remains stable and no frame is clipped"
      ]
    };
  }

  if (asset.category === "fx_strip") {
    return {
      ...base,
      prompt: `Use case: stylized-concept\nAsset type: horizontal Phaser FX sprite sheet\nPrimary request: Create ${asset.id} for 이상한 씨앗상회 v1.\nSubject: ${asset.id.includes("care") ? "soft care spark feedback around a plot after the player taps 돌보기." : "leaf reward flyout particles moving from harvest/action source toward the HUD."}\nStyle/medium: ${STYLE}\nComposition/framing: One horizontal FX strip with exactly ${asset.frame_count} frames, each frame ${asset.frame_size}, transparent background, consistent effect center.\nColor palette: Warm leaf yellow, fresh green, cream glow, tiny teal accent.\nConstraints: Intended fps ${asset.intended_fps}; animation.binding ${asset.animation.binding}; behavior ${asset.animation.behavior}. No text, no UI frame, no full background.\n${avoid}`,
      acceptance: [
        ...base.acceptance,
        `exactly ${asset.frame_count} frames in a horizontal strip`,
        `each frame is ${asset.frame_size}`,
        `animation.binding is ${asset.animation.binding}`,
        "FX reads at 96px and does not obscure plot/actor silhouette"
      ]
    };
  }

  return {
    ...base,
    prompt: `Use case: stylized-concept\nAsset type: Phaser utility sprite\nPrimary request: Create ${asset.id}, a soft transparent grounding shadow for 이상한 씨앗상회 runtime entities.\nSubject: A simple oval soft shadow suitable under small actors, plots, and facility props.\nStyle/medium: polished 2D mobile game utility asset, soft clean alpha.\nComposition/framing: 128x64 target, transparent background, centered oval with gentle blur/falloff.\nColor palette: translucent deep greenhouse teal/soft brown shadow.\nConstraints: No text, no object, no hard border, no background scene.\n${avoid}`,
    acceptance: [
      ...base.acceptance,
      "transparent soft oval shadow",
      "does not look like a gameplay object"
    ]
  };
}

function upsertById(items, additions, idKey = "id") {
  const ids = new Set(additions.map((item) => item[idKey]));
  return [...items.filter((item) => !ids.has(item[idKey])), ...additions];
}

const plan = JSON.parse(await readFile(PLAN_PATH, "utf8"));
plan.assets = upsertById(plan.assets, [...topologyAssets, ...compatibilityAssets]);
plan.batch = {
  ...plan.batch,
  purpose:
    "Validate and extend static Phase 0/P0.5/v1 assets, including Phaser garden board topology runtime terrain, plot states, facility states, actor strips, and FX strips.",
  target_asset_count: plan.assets.length
};

const prompts = JSON.parse(await readFile(PROMPTS_PATH, "utf8"));
const topologyPrompts = topologyAssets.map(promptFor);
prompts.prompts = upsertById(prompts.prompts, topologyPrompts, "asset_id");
prompts.source_plan = PLAN_PATH;
prompts.runtime_generation_allowed = false;

await writeFile(PLAN_PATH, `${JSON.stringify(plan, null, 2)}\n`);
await writeFile(PROMPTS_PATH, `${JSON.stringify(prompts, null, 2)}\n`);

console.log(
  JSON.stringify(
    {
      ok: true,
      plan: PLAN_PATH,
      prompts: PROMPTS_PATH,
      added: topologyAssets.map((asset) => asset.id),
      compatibilityAliases: compatibilityAssets.map((asset) => asset.id),
      planCount: plan.assets.length,
      promptCount: prompts.prompts.length
    },
    null,
    2
  )
);
