import fs from "node:fs";

const seeds = JSON.parse(fs.readFileSync("src/data/seeds.json", "utf8"));
const expeditions = JSON.parse(fs.readFileSync("src/data/expeditions.json", "utf8"));
const rewards = JSON.parse(fs.readFileSync("src/data/rewards.json", "utf8"));
const missions = JSON.parse(fs.readFileSync("src/data/missions.json", "utf8"));
const creatures = JSON.parse(fs.readFileSync("src/data/creatures.json", "utf8"));

const starterSeedIds = ["seed_herb_001", "seed_herb_002", "seed_candy_001"];
const starterSeeds = seeds.filter((seed) => starterSeedIds.includes(seed.id));
const firstSeed = seeds.find((seed) => seed.id === "seed_herb_001");
const firstAlbumReward = rewards.albumMilestones.find((milestone) => milestone.id === "album_1");
const firstExpedition = expeditions.find((expedition) => expedition.id === "quick_scout");
const firstCreature = creatures.find((creature) => creature.id === firstSeed?.creaturePool?.[0]);
const nextDeterministicSeed = seeds.find(
  (seed) => starterSeedIds.includes(seed.id) && seed.creaturePool?.[0] && seed.creaturePool[0] !== firstSeed?.creaturePool?.[0]
);
const nextCreatureGoal = creatures.find((creature) => creature.id === nextDeterministicSeed?.creaturePool?.[0]);
const appSource = fs.readFileSync("src/App.tsx", "utf8");
const repeatStarterCost = Math.max(10, firstSeed?.costLeaves ?? 0);
const requiredMissionIds = [
  "tutorial_plant_first_seed",
  "tutorial_harvest_first_creature",
  "tutorial_claim_album_reward",
  "daily_buy_3_seeds",
  "daily_start_expedition"
];
const requiredMissions = requiredMissionIds.map((missionId) => missions.find((mission) => mission.id === missionId));

const failures = [];

const normalizedAppSource = appSource.replace(/\s+/g, " ").trim();
const normalizeFragment = (fragment) => fragment.replace(/\s+/g, " ").trim();
const requiredAppFragments = [
  {
    label: "seed shop computes a non-negative leaf shortfall from cost and current leaves",
    fragment: "const leafShortfall = Math.max(0, costLeaves - currentLeaves);"
  },
  {
    label: "shortfall helper copy is gated by positive shortfall",
    fragment: `{leafShortfall > 0 && <span className="seed-shortfall-note">{leafShortfall} 잎 더 모으면 구매 가능</span>}`
  },
  {
    label: "purchase button preserves buy-cost fallback when no shortfall exists",
    fragment: "{leafShortfall > 0 ? `${leafShortfall} 잎 부족` : `구매 ${costLeaves}`}"
  },
  {
    label: "purchase button remains disabled by leaf affordability",
    fragment: `<button disabled={!save || save.leaves < costLeaves} onClick={() => buySeed(seed)} type="button">`
  }
];


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

if (!firstCreature) {
  failures.push("first seed's first creature is missing from creature content");
} else {
  if (!firstCreature.name || firstCreature.name.trim().length === 0) {
    failures.push("first creature must have a display name for the ownership reveal");
  }

  if (!firstCreature.albumHint || firstCreature.albumHint.trim().length === 0) {
    failures.push("first creature must have an album hint for the ownership reveal");
  }

  for (const field of ["personality", "favoriteThing", "greeting"]) {
    if (!firstCreature[field] || firstCreature[field].trim().length === 0) {
      failures.push(`first creature must have ${field} for the attachment reveal`);
    }
  }
}

if (!nextDeterministicSeed || !nextCreatureGoal) {
  failures.push("next collection goal must point to an unlocked deterministic seed creature");
} else if (nextCreatureGoal.id === firstCreature?.id) {
  failures.push("next collection goal must not repeat the first creature");
}


for (const { label, fragment } of requiredAppFragments) {
  if (!normalizedAppSource.includes(normalizeFragment(fragment))) {
    failures.push(`App.tsx missing shortfall behavior fragment: ${label}`);
  }
}

for (const phrase of [
  "getNextCreatureGoal",
  "다음에 만날 아이",
  "다음 생명체 수집 목표",
  "next-creature-title-line",
  "next-creature-trait-line",
  "getRarityLabel(nextCreatureGoal.creature.rarity)",
  "getCreatureFamilyLabel(nextCreatureGoal.creature.family)",
  "도감 {nextCreatureGoal.discoveredCount}/{nextCreatureGoal.totalCount}",
  "getDeterministicCreatureForSeed",
  "만날 아이: {previewCreature.name}",
  "seed-creature-preview",
  "getSeedHarvestSummary",
  "+${seed.baseHarvestLeaves} 잎",
  "getSeedHarvestSummary(seed)",
  "reveal-next-goal",
  "qaHarvestReveal",
  "createHarvestRevealQaSave",
  "수확 후 다음 목표",
  "albumDiscoveredCount",
  "albumProgressBadge",
  "getNextAlbumMilestone",
  "album-reward-preview",
  "다음 도감 보상",
  "수집 보상 예고",
  "nextAlbumRewardRemaining",
  "tab-progress-badge",
  "도감 진행",
  "${albumDiscoveredCount}/${content.creatures.length}",
  "미발견 슬롯",
  "album-silhouette",
  "getSeedHintForCreature",
  "getRarityLabel",
  "getCreatureFamilyLabel",
  "qaTab",
  "getLocalQaTab",
  "goal-link-button",
  "보러가기",
  "setActiveTab(\"seeds\")",
  "album-next-action-chip",
  "다음 발견",
  "getRarityLabel(nextCreatureGoal.creature.rarity)",
  "씨앗 보러가기",
  "seed-goal-banner",
  "도감 목표 씨앗",
  "seed-inventory-row-target",
  "seed-target-badge",
  "targetSeed",
  "seedInventorySeeds",
  "visibleSeedInventorySeeds",
  "!availableSeeds.some((seed) => seed.id === nextCreatureGoal.seed.id)",
  "seed-shop-row-target",
  "seed-goal-action-button",
  "정원에서 심기",
  "setActiveTab(\"garden\")",
  "firstExpedition",
  "expedition-preview",
  "첫 원정 보상 미리보기",
  "원정 보상 예고",
  "getExpeditionDurationLabel",
  "expeditionCreatureShortfall",
  "expeditionNeedsMoreCreatures",
  "expedition-unlock-note",
  "마리 더 발견하면",
  "생명체가 원정을 기다리고 있어요",
  "qaExpeditionActive",
  "createExpeditionQaSave",
  "getExpeditionRemainingSeconds",
  "getExpeditionRewardSummary",
  "expedition-progress-note",
  "남음 · 돌아오면 보상 수령",
  "수령 가능",
  "expeditionStatusBadge",
  "원정 상태",
  'showResearchExpeditionClue',
  'RESEARCH_EXPEDITION_ID',
  '"단서"',
  "leafShortfall",
  "seed-shortfall-note",
  "잎 더 모으면 구매 가능",
  "잎 부족",
  "idleProduction",
  "getProductionStatus",
  "getPendingProductionLeaves",
  "getProductionRatePerSecond",
  "자동 생산",
  "생산 잎 수령",
  "FIRST_ORDER",
  "orderProgress",
  "첫 잎 주문 납품",
  "order_delivered",
  "qaProductionReady",
  "createProductionReadyQaSave"
]) {
  if (!appSource.includes(phrase)) {
    failures.push(`App.tsx missing collection goal UI phrase: ${phrase}`);
  }
}

const seedCreaturePreview = starterSeeds.map((seed) => ({
  seedId: seed.id,
  creatureId: seed.creaturePool?.[0],
  creatureName: creatures.find((creature) => creature.id === seed.creaturePool?.[0])?.name
}));

for (const preview of seedCreaturePreview) {
  if (!preview.creatureId || !preview.creatureName) {
    failures.push(`seed creature preview missing deterministic creature for ${preview.seedId}`);
  }
}

const albumLockedSlotCountAfterFirstHarvest = creatures.filter((creature) => creature.id !== firstCreature?.id).length;
if (albumLockedSlotCountAfterFirstHarvest <= 0) {
  failures.push("album locked slots need at least one undiscovered creature after first harvest");
}

for (const creature of creatures) {
  const sourceSeed = seeds.find((seed) => seed.creaturePool?.includes(creature.id));
  if (!sourceSeed) {
    failures.push(`album locked slot seed hint missing source seed for ${creature.id}`);
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
} else if (firstExpedition.rewardLeaves <= 0) {
  failures.push("quick_scout expedition must reward leaves");
}

const seedBuyMission = missions.find((mission) => mission.id === "daily_buy_3_seeds");
if (!seedBuyMission) {
  failures.push("daily_buy_3_seeds mission missing");
} else if (repeatStarterCost * seedBuyMission.target > 60) {
  failures.push(`seed buy mission is too expensive for offline QA: ${repeatStarterCost * seedBuyMission.target} > 60`);
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
      firstCreatureName: firstCreature.name,
      firstLoopSequence: [
        "starter_seed",
        "plant",
        "tap_growth",
        "harvest",
        "named_creature_ownership",
        "album_reward",
        "second_plot",
        "next_collection_goal"
      ],
      firstUpgradeLeavesAvailable: firstHarvestLeaves + firstAlbumLeaves,
      firstUpgradeCost,
      repeatStarterCost,
      firstExpeditionSeconds: firstExpedition.durationSeconds,
      firstExpeditionRewardLeaves: firstExpedition.rewardLeaves,
      firstCreatureAttachment: {
        personality: firstCreature.personality,
        favoriteThing: firstCreature.favoriteThing,
        greeting: firstCreature.greeting
      },
      nextCollectionGoal: {
        seedId: nextDeterministicSeed.id,
        creatureId: nextCreatureGoal.id,
        creatureName: nextCreatureGoal.name
      },
      seedCreaturePreview,
      harvestRevealNextGoalQa: "qaHarvestReveal",
      albumLockedSlots: {
        totalCreatures: creatures.length,
        discoveredAfterFirstHarvest: firstCreature ? 1 : 0,
        lockedAfterFirstHarvest: albumLockedSlotCountAfterFirstHarvest
      },
      firstLoopMissions: requiredMissionIds
    },
    null,
    2
  )
);
