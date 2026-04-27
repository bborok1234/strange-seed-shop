import fs from "node:fs";

const seeds = JSON.parse(fs.readFileSync("src/data/seeds.json", "utf8"));
const expeditions = JSON.parse(fs.readFileSync("src/data/expeditions.json", "utf8"));
const rewards = JSON.parse(fs.readFileSync("src/data/rewards.json", "utf8"));
const missions = JSON.parse(fs.readFileSync("src/data/missions.json", "utf8"));

const starterSeedIds = ["seed_herb_001", "seed_herb_002", "seed_candy_001"];
const starterSeeds = seeds.filter((seed) => starterSeedIds.includes(seed.id));
const firstSeed = seeds.find((seed) => seed.id === "seed_herb_001");
const firstAlbumReward = rewards.albumMilestones.find((milestone) => milestone.id === "album_1");
const firstExpedition = expeditions.find((expedition) => expedition.id === "quick_scout");
const requiredMissionIds = [
  "tutorial_plant_first_seed",
  "tutorial_harvest_first_creature",
  "tutorial_claim_album_reward",
  "daily_start_expedition"
];
const requiredMissions = requiredMissionIds.map((missionId) => missions.find((mission) => mission.id === missionId));

const failures = [];

if (starterSeeds.length !== 3) {
  failures.push(`starter seed count expected 3, got ${starterSeeds.length}`);
}

if (!firstSeed) {
  failures.push("seed_herb_001 missing");
} else {
  if (firstSeed.baseGrowthSeconds > 90) {
    failures.push(`first seed growth exceeds 90s: ${firstSeed.baseGrowthSeconds}`);
  }

  if (firstSeed.creaturePool.length === 0) {
    failures.push("first seed has no creature pool");
  }
}

if (!firstAlbumReward) {
  failures.push("album_1 reward missing");
}

const firstUpgradeCost = 25;
const firstHarvestLeaves = firstSeed?.baseHarvestLeaves ?? 0;
const firstAlbumLeaves = firstAlbumReward?.leaves ?? 0;
if (firstHarvestLeaves + firstAlbumLeaves < firstUpgradeCost) {
  failures.push(
    `first harvest + album leaves cannot buy first upgrade: ${firstHarvestLeaves + firstAlbumLeaves} < ${firstUpgradeCost}`
  );
}

if (!firstExpedition) {
  failures.push("quick_scout expedition missing");
} else if (firstExpedition.durationSeconds > 600) {
  failures.push(`first expedition exceeds 10 minutes: ${firstExpedition.durationSeconds}`);
}

requiredMissions.forEach((mission, index) => {
  const missionId = requiredMissionIds[index];
  if (!mission) {
    failures.push(`${missionId} mission missing`);
    return;
  }

  if (mission.rewardLeaves <= 0) {
    failures.push(`${missionId} mission must reward leaves`);
  }
});

if (failures.length > 0) {
  console.error(JSON.stringify({ ok: false, failures }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      ok: true,
      starterSeeds: starterSeeds.map((seed) => seed.id),
      firstSeedGrowthSeconds: firstSeed.baseGrowthSeconds,
      firstUpgradeLeavesAvailable: firstHarvestLeaves + firstAlbumLeaves,
      firstUpgradeCost,
      firstExpeditionSeconds: firstExpedition.durationSeconds,
      firstLoopMissions: requiredMissionIds
    },
    null,
    2
  )
);
