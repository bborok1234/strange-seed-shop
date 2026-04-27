import fs from "node:fs";

const seeds = JSON.parse(fs.readFileSync("src/data/seeds.json", "utf8"));
const expeditions = JSON.parse(fs.readFileSync("src/data/expeditions.json", "utf8"));
const growth = JSON.parse(fs.readFileSync("src/data/growth_curves.json", "utf8"));
const rewards = JSON.parse(fs.readFileSync("src/data/rewards.json", "utf8"));

const horizons = [
  { id: "1h", seconds: 60 * 60 },
  { id: "D1", seconds: 24 * 60 * 60 },
  { id: "D3", seconds: 3 * 24 * 60 * 60 },
  { id: "D7", seconds: 7 * 24 * 60 * 60 }
];

const baseSeeds = seeds.slice(0, 6);
const quickExpedition = expeditions.find((expedition) => expedition.id === "quick_scout");
const albumRewardLeaves = rewards.albumMilestones.reduce((sum, reward) => sum + reward.leaves, 0);

const projection = horizons.map((horizon) => {
  const activeCycles = Math.floor(horizon.seconds / 180);
  const seedRevenue = baseSeeds.reduce((sum, seed) => {
    const cycles = Math.max(1, Math.floor(horizon.seconds / seed.baseGrowthSeconds));
    return sum + cycles * seed.baseHarvestLeaves * 0.15;
  }, 0);
  const expeditionRevenue = quickExpedition ? Math.floor(horizon.seconds / quickExpedition.durationSeconds) * quickExpedition.rewardLeaves * 0.2 : 0;
  const offlineRevenue = Math.floor(Math.min(horizon.seconds, growth.offlineReward.experimentalCapSeconds) * 0.04 * growth.offlineReward.efficiency);
  const leaves = Math.floor(seedRevenue + expeditionRevenue + offlineRevenue + Math.min(albumRewardLeaves, activeCycles * 12));

  return {
    horizon: horizon.id,
    projectedLeaves: leaves,
    expectedPlots: leaves >= 1000 ? 5 : leaves >= 420 ? 4 : leaves >= 130 ? 3 : leaves >= 25 ? 2 : 1,
    notes: leaves >= 25 ? "첫 업그레이드 가능" : "초기 수확 필요"
  };
});

console.log(JSON.stringify({ version: "phase0-v1", projection }, null, 2));
