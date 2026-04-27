import fs from "node:fs";

const jsonFiles = [
  "public/assets/manifest/assetManifest.json",
  "src/data/seeds.json",
  "src/data/creatures.json",
  "src/data/growth_curves.json",
  "src/data/rewards.json",
  "src/data/expeditions.json",
  "src/data/missions.json",
  "src/data/shop_surfaces.json"
];

const readJson = (path) => JSON.parse(fs.readFileSync(path, "utf8"));

for (const file of jsonFiles) {
  readJson(file);
}

const manifest = readJson("public/assets/manifest/assetManifest.json");
const seeds = readJson("src/data/seeds.json");
const creatures = readJson("src/data/creatures.json");
const shopSurfaces = readJson("src/data/shop_surfaces.json");
const assetIds = new Set(Object.keys(manifest.assets));
const creatureIds = new Set(creatures.map((creature) => creature.id));

const missingAssetRefs = [];

for (const seed of seeds) {
  if (!assetIds.has(seed.iconAssetId)) {
    missingAssetRefs.push(`${seed.id}.iconAssetId -> ${seed.iconAssetId}`);
  }

  for (const creatureId of seed.creaturePool) {
    if (!creatureIds.has(creatureId)) {
      missingAssetRefs.push(`${seed.id}.creaturePool -> ${creatureId}`);
    }
  }
}

for (const creature of creatures) {
  if (!assetIds.has(creature.assetId)) {
    missingAssetRefs.push(`${creature.id}.assetId -> ${creature.assetId}`);
  }
}

for (const surface of shopSurfaces) {
  if (!assetIds.has(surface.assetId)) {
    missingAssetRefs.push(`${surface.id}.assetId -> ${surface.assetId}`);
  }
}

const missingFiles = Object.entries(manifest.assets)
  .filter(([, asset]) => !fs.existsSync(`public${asset.path}`))
  .map(([id, asset]) => `${id} -> public${asset.path}`);

if (missingAssetRefs.length > 0 || missingFiles.length > 0) {
  console.error(JSON.stringify({ missingAssetRefs, missingFiles }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      json_ok: true,
      manifest_assets: assetIds.size,
      seeds: seeds.length,
      creatures: creatures.length,
      shop_surfaces: shopSurfaces.length,
      missingAssetRefs: 0,
      missingFiles: 0
    },
    null,
    2
  )
);
