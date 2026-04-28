import fs from "node:fs";

const manifestPath = "public/assets/manifest/assetManifest.json";
const requiredAssetIds = [
  "seed_herb_001_idle_strip",
  "seed_herb_001_tap_strip",
  "sprout_herb_001_grow_strip",
  "creature_herb_common_ready_strip",
  "fx_harvest_sparkle_strip",
  "fx_leaf_reward_pop_strip"
];

const requiredBindings = {
  seed_herb_001_idle_strip: {
    target: "plot",
    slot: "seed_idle",
    seedIds: ["seed_herb_001"],
    plotStates: ["growing"]
  },
  seed_herb_001_tap_strip: {
    target: "effect",
    slot: "tap_feedback",
    seedIds: ["seed_herb_001"],
    plotStates: ["growing"],
    actions: ["tap_growth"]
  },
  sprout_herb_001_grow_strip: {
    target: "plot",
    slot: "growth",
    seedIds: ["seed_herb_001"],
    plotStates: ["growing"]
  },
  creature_herb_common_ready_strip: {
    target: "plot",
    slot: "ready",
    seedIds: ["seed_herb_001"],
    creatureIds: ["creature_herb_common_001"],
    plotStates: ["ready"]
  },
  fx_harvest_sparkle_strip: {
    target: "effect",
    slot: "harvest_fx",
    seedIds: ["seed_herb_001"],
    creatureIds: ["creature_herb_common_001"],
    plotStates: ["ready"],
    actions: ["harvest_plot"]
  },
  fx_leaf_reward_pop_strip: {
    target: "effect",
    slot: "reward_fx",
    seedIds: ["seed_herb_001"],
    creatureIds: ["creature_herb_common_001"],
    plotStates: ["ready"],
    actions: ["harvest_plot"]
  }
};

const requiredVisualEvidence = [
  {
    path: "reports/visual/sprite-batch-browser-use-fallback-20260427.md",
    phrases: ["Browser Use 우선 시도", "qaSpriteState=growing", "qaSpriteState=ready"]
  },
  { path: "reports/visual/sprite-batch-mobile-360-20260427.png", width: 360, height: 800 },
  { path: "reports/visual/sprite-batch-desktop-1280-20260427.png", width: 1280, height: 900 },
  {
    path: "reports/visual/sprite-mapping-browser-use-fallback-20260428.md",
    phrases: ["Browser Use 우선 시도", "qaSpriteState=growing", "qaSpriteState=ready", "manifest animation binding"]
  },
  { path: "reports/visual/sprite-mapping-growing-20260428.png", width: 393, height: 900 },
  { path: "reports/visual/sprite-mapping-ready-20260428.png", width: 393, height: 900 }
];

function readPngSize(path) {
  const buffer = fs.readFileSync(path);
  if (buffer.length < 24 || buffer.toString("ascii", 1, 4) !== "PNG") {
    throw new Error(`${path} is not a PNG file`);
  }

  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20)
  };
}

function requireIncludes(assetId, field, actualValues = [], expectedValues = []) {
  for (const expectedValue of expectedValues) {
    if (!actualValues.includes(expectedValue)) {
      failures.push(`${assetId} binding.${field} missing ${expectedValue}`);
    }
  }
}

const failures = [];
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const gardenScene = fs.readFileSync("src/game/playfield/GardenScene.ts", "utf8");

if (manifest.runtime_generation_allowed !== false) {
  failures.push("asset manifest must keep runtime_generation_allowed=false");
}

if (gardenScene.includes("SPRITE_KEYS")) {
  failures.push("GardenScene must not use hard-coded SPRITE_KEYS; use manifest animation bindings");
}

for (const assetId of requiredAssetIds) {
  if (gardenScene.includes(assetId)) {
    failures.push(`GardenScene must not hard-code animation asset id: ${assetId}`);
  }
}

for (const [assetId, asset] of Object.entries(manifest.assets ?? {})) {
  if (
    asset.status === "accepted" &&
    (asset.category === "sprite_strip" || asset.category === "fx_strip") &&
    asset.animation?.kind === "spritesheet" &&
    !asset.animation.binding
  ) {
    failures.push(`${assetId} missing animation binding metadata`);
  }
}

for (const assetId of requiredAssetIds) {
  const asset = manifest.assets?.[assetId];
  if (!asset) {
    failures.push(`missing manifest asset: ${assetId}`);
    continue;
  }

  if (asset.runtime_generation_allowed === true) {
    failures.push(`${assetId} must not allow runtime generation`);
  }

  if (asset.status !== "accepted") {
    failures.push(`${assetId} status must be accepted`);
  }

  if (!asset.animation || asset.animation.kind !== "spritesheet") {
    failures.push(`${assetId} missing spritesheet animation metadata`);
    continue;
  }

  for (const field of ["key", "frames", "frameWidth", "frameHeight", "frameRate", "repeat"]) {
    if (asset.animation[field] === undefined || asset.animation[field] === null) {
      failures.push(`${assetId} animation missing ${field}`);
    }
  }

  const expectedBinding = requiredBindings[assetId];
  const binding = asset.animation.binding;
  if (!binding) {
    failures.push(`${assetId} missing animation binding`);
  } else {
    for (const field of ["target", "slot"]) {
      if (binding[field] !== expectedBinding[field]) {
        failures.push(`${assetId} binding.${field} expected ${expectedBinding[field]}, got ${binding[field]}`);
      }
    }

    for (const field of ["seedIds", "creatureIds", "plotStates", "actions"]) {
      requireIncludes(assetId, field, binding[field], expectedBinding[field]);
    }
  }

  const localPath = asset.path?.startsWith("/") ? `public${asset.path}` : asset.path;
  if (!localPath || !fs.existsSync(localPath)) {
    failures.push(`${assetId} missing file at ${localPath}`);
    continue;
  }

  const size = readPngSize(localPath);
  if (size.width !== asset.width || size.height !== asset.height) {
    failures.push(`${assetId} manifest dimensions ${asset.width}x${asset.height} do not match PNG ${size.width}x${size.height}`);
  }

  const margin = asset.animation.margin ?? 0;
  const spacing = asset.animation.spacing ?? 0;
  const expectedWidth = margin * 2 + asset.animation.frameWidth * asset.animation.frames + spacing * (asset.animation.frames - 1);
  const expectedHeight = margin * 2 + asset.animation.frameHeight;

  if (size.width !== expectedWidth || size.height !== expectedHeight) {
    failures.push(`${assetId} slicing mismatch: expected ${expectedWidth}x${expectedHeight}, got ${size.width}x${size.height}`);
  }
}

const visualEvidence = [];
for (const evidence of requiredVisualEvidence) {
  if (!fs.existsSync(evidence.path)) {
    failures.push(`missing visual evidence: ${evidence.path}`);
    continue;
  }

  visualEvidence.push(evidence.path);

  if (evidence.phrases) {
    const content = fs.readFileSync(evidence.path, "utf8");
    for (const phrase of evidence.phrases) {
      if (!content.includes(phrase)) {
        failures.push(`${evidence.path} missing phrase: ${phrase}`);
      }
    }
  }

  if (evidence.width && evidence.height) {
    const size = readPngSize(evidence.path);
    if (size.width !== evidence.width || size.height !== evidence.height) {
      failures.push(`${evidence.path} expected ${evidence.width}x${evidence.height}, got ${size.width}x${size.height}`);
    }
  }
}

const result = {
  ok: failures.length === 0,
  checkedAssets: requiredAssetIds.length,
  visualEvidence,
  failures
};

console.log(JSON.stringify(result, null, 2));

if (!result.ok) {
  process.exit(1);
}
