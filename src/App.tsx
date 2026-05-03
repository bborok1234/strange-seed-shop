import { useEffect, useMemo, useRef, useState } from "react";
import { getAssetPath, getPlayfieldAnimationAssets, loadAssetManifest } from "./lib/assetManifest";
import { createNewSave, localSaveStore } from "./lib/persistence";
import { content, getStarterSeeds } from "./lib/content";
import { readEvents, trackEvent } from "./lib/analytics";
import { GardenPlayfieldHost } from "./game/playfield";
import type { GardenPlayfieldAction, GardenPlayfieldViewModel, GardenPlotView } from "./game/playfield";
import type {
  AssetManifest,
  CreatureDefinition,
  ExpeditionState,
  ExpeditionRewardSource,
  MissionDefinition,
  PlayerSave,
  PlotState,
  SeedDefinition
} from "./types/game";

type MainTab = "garden" | "seeds" | "album" | "expedition" | "shop";

interface NextCreatureGoal {
  seed: SeedDefinition;
  creature: CreatureDefinition;
  discoveredCount: number;
  totalCount: number;
}

interface AlbumMilestone {
  id: string;
  requiredDiscoveries: number;
  leaves: number;
  pollen: number;
}

interface FirstOrderDefinition {
  id: string;
  title: string;
  customer: string;
  requiredLeaves: number;
  rewardLeaves: number;
  rewardPollen: number;
  rewardMaterials?: number;
}

interface ProductionStatus {
  ratePerMinute: number;
  pendingLeaves: number;
  order: FirstOrderDefinition;
  orderProgress: number;
  orderReady: boolean;
  orderCompleted: boolean;
  workerCreatures: CreatureDefinition[];
  primaryWorker?: CreatureDefinition;
  primaryWorkAssetId: string;
  workerLabel: string;
  workerDetail: string;
}

type ProductionFxKind = "production" | "order";

interface ProductionFxState {
  assetId: string;
  id: number;
  kind: ProductionFxKind;
}

interface ProductionClaimReceipt {
  id: number;
  leaves: number;
  orderTitle: string;
  orderProgress: number;
  orderRequired: number;
}

interface ProductionBoostReceipt {
  id: number;
  previousRatePerMinute: number;
  nextRatePerMinute: number;
  bonusPercent: number;
}

interface ResearchUnlockReceipt {
  id: number;
  orderTitle: string;
  rewardLabel: string;
  researchTitle: string;
}

interface ResearchCompleteReceipt {
  id: number;
  researchTitle: string;
  clueLabel: string;
  seedName: string;
  creatureName: string;
}

interface ResearchSeedReceipt {
  id: number;
  seedName: string;
  creatureName: string;
  clueLabel: string;
  actionLabel: string;
}

interface ResearchHarvestReceipt {
  id: number;
  seedName: string;
  creatureName: string;
  clueLabel: string;
}

interface ResearchAlbumRecord {
  id: number;
  creatureId: string;
  creatureName: string;
  seedName: string;
  clueLabel: string;
}

interface OrderDeliveryReceipt {
  id: number;
  orderId: string;
  title: string;
  rewardLabel: string;
  nextOrderTitle: string;
}

interface UpgradeChoice {
  id: string;
  title: string;
  detail: string;
  status: string;
  tone: "ready" | "waiting" | "done";
  onSelect?: () => void;
}

interface OfflineRewardResult {
  leaves: number;
  awayMinutes: number;
  guardianBonusPercent: number;
  guardianName?: string;
  shelfBonusPercent: number;
  shelfBonusLabel?: string;
}

interface ComebackProductionTarget {
  title: string;
  detail: string;
  ctaLabel: string;
  action: "claim_production" | "deliver_order" | "view_goal";
}

const FIRST_UPGRADE_COST = 25;
const PRODUCTION_BOOST_COST_LEAVES = 40;
const PRODUCTION_BOOST_COST_POLLEN = 1;
const PRODUCTION_BOOST_MAX_LEVEL = 1;
const PRODUCTION_BOOST_RATE_BONUS = 0.25;
const MATERIAL_WORKBENCH_COST_MATERIALS = 2;
const MATERIAL_WORKBENCH_MAX_LEVEL = 1;
const MATERIAL_WORKBENCH_RATE_BONUS = 0.15;
const GREENHOUSE_FACILITY_COST_LEAVES = 80;
const GREENHOUSE_FACILITY_COST_MATERIALS = 1;
const GREENHOUSE_FACILITY_MAX_LEVEL = 1;
const GREENHOUSE_FACILITY_RATE_BONUS = 0.1;
const GREENHOUSE_SHELF_OFFLINE_BONUS = 0.1;
const GREENHOUSE_STORAGE_COST_MATERIALS = 1;
const GREENHOUSE_STORAGE_MAX_LEVEL = 1;
const GREENHOUSE_STORAGE_OFFLINE_BONUS = 0.1;
const GREENHOUSE_ROUTE_COST_MATERIALS = 2;
const GREENHOUSE_ROUTE_MAX_LEVEL = 1;
const GREENHOUSE_ROUTE_PLOT_COUNT = 3;
const GREENHOUSE_IRRIGATION_COST_MATERIALS = 1;
const GREENHOUSE_IRRIGATION_COST_POLLEN = 4;
const GREENHOUSE_IRRIGATION_MAX_LEVEL = 1;
const GREENHOUSE_IRRIGATION_RATE_BONUS = 0.15;
const GREENHOUSE_MIST_COST_MATERIALS = 1;
const GREENHOUSE_MIST_COST_POLLEN = 3;
const GREENHOUSE_MIST_MAX_LEVEL = 1;
const GREENHOUSE_MIST_OFFLINE_BONUS = 0.1;
const FIRST_RESEARCH_COST_LEAVES = 40;
const FIRST_RESEARCH_COST_POLLEN = 2;
const FIRST_RESEARCH_MAX_LEVEL = 1;
const FIRST_EXPEDITION_ID = "quick_scout";
const RESEARCH_EXPEDITION_ID = "moon_hint";
const LUNAR_REWARD_SEED_ID = "seed_lunar_001";
const LUNAR_REWARD_CREATURE_ID = "creature_lunar_common_001";
const LUNAR_CARE_MEMORY_ID = "care_lunar_nunu_001";
const LUNAR_CARE_REWARD_LEAVES = 18;
const GUARDIAN_OFFLINE_BONUS = 0.2;
const OFFLINE_CAP_SECONDS = 8 * 60 * 60;
const MIN_REPEAT_SEED_COST = 10;
const PRODUCTION_FX_ASSETS: Record<ProductionFxKind, string> = {
  production: "fx_production_tick_leaf_001",
  order: "fx_order_delivery_burst_001"
};
const FIRST_ORDER: FirstOrderDefinition = {
  id: "order_pori_leaf_001",
  title: "말랑잎 첫 납품",
  customer: "상회 앞 작은 주문 상자",
  requiredLeaves: 12,
  rewardLeaves: 18,
  rewardPollen: 1
};
const SECOND_ORDER: FirstOrderDefinition = {
  id: "order_research_leaf_bundle_001",
  title: "연구 준비 잎 묶음",
  customer: "온실 연구대",
  requiredLeaves: 24,
  rewardLeaves: 28,
  rewardPollen: 2
};
const GREENHOUSE_ORDER: FirstOrderDefinition = {
  id: "order_greenhouse_shelf_001",
  title: "온실 선반 납품",
  customer: "새 온실 선반",
  requiredLeaves: 36,
  rewardLeaves: 42,
  rewardPollen: 2,
  rewardMaterials: 1
};
const GREENHOUSE_EXPANSION_ORDER: FirstOrderDefinition = {
  id: "order_greenhouse_expansion_001",
  title: "온실 확장 준비",
  customer: "정리된 온실 통로",
  requiredLeaves: 60,
  rewardLeaves: 70,
  rewardPollen: 3,
  rewardMaterials: 2
};
const GREENHOUSE_ROUTE_SUPPLY_ORDER: FirstOrderDefinition = {
  id: "order_greenhouse_route_supply_001",
  title: "3번 밭 순환 납품",
  customer: "넓어진 온실 통로",
  requiredLeaves: 90,
  rewardLeaves: 110,
  rewardPollen: 4,
  rewardMaterials: 1
};
const GREENHOUSE_IRRIGATION_ORDER: FirstOrderDefinition = {
  id: "order_greenhouse_irrigation_check_001",
  title: "온실 물길 점검",
  customer: "반짝이는 온실 물길",
  requiredLeaves: 120,
  rewardLeaves: 135,
  rewardPollen: 3,
  rewardMaterials: 1
};
const GREENHOUSE_MIST_RETURN_ORDER: FirstOrderDefinition = {
  id: "order_greenhouse_mist_return_001",
  title: "물안개 응축 납품",
  customer: "안개 맺힌 온실 선반",
  requiredLeaves: 150,
  rewardLeaves: 165,
  rewardPollen: 2,
  rewardMaterials: 1
};
const LUNAR_GUARDIAN_ORDER: FirstOrderDefinition = {
  id: "order_lunar_guardian_watch_001",
  title: "달빛 보호 주문",
  customer: "밤 온실 주문 상자",
  requiredLeaves: 72,
  rewardLeaves: 88,
  rewardPollen: 3,
  rewardMaterials: 1
};
const ORDER_DEFINITIONS: FirstOrderDefinition[] = [
  FIRST_ORDER,
  SECOND_ORDER,
  GREENHOUSE_ORDER,
  GREENHOUSE_EXPANSION_ORDER,
  GREENHOUSE_ROUTE_SUPPLY_ORDER,
  GREENHOUSE_IRRIGATION_ORDER,
  GREENHOUSE_MIST_RETURN_ORDER,
  LUNAR_GUARDIAN_ORDER
];
const MAIN_TABS: Array<{ id: MainTab; label: string }> = [
  { id: "garden", label: "정원" },
  { id: "seeds", label: "씨앗" },
  { id: "album", label: "도감" },
  { id: "expedition", label: "원정" },
  { id: "shop", label: "상점" }
];

export default function App() {
  const [manifest, setManifest] = useState<AssetManifest | null>(null);
  const [save, setSave] = useState<PlayerSave | null>(null);
  const [manifestError, setManifestError] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [offlineMessage, setOfflineMessage] = useState<string | null>(null);
  const [offlineRewardSummary, setOfflineRewardSummary] = useState<OfflineRewardResult | null>(null);
  const [activeTab, setActiveTab] = useState<MainTab>(() => getLocalQaTab() ?? "garden");
  const [rewardPulse, setRewardPulse] = useState<number | null>(null);
  const [harvestReveal, setHarvestReveal] = useState<CreatureDefinition | null>(null);
  const [productionFx, setProductionFx] = useState<ProductionFxState | null>(null);
  const [productionClaimReceipt, setProductionClaimReceipt] = useState<ProductionClaimReceipt | null>(null);
  const [productionBoostReceipt, setProductionBoostReceipt] = useState<ProductionBoostReceipt | null>(null);
  const [researchUnlockReceipt, setResearchUnlockReceipt] = useState<ResearchUnlockReceipt | null>(null);
  const [researchCompleteReceipt, setResearchCompleteReceipt] = useState<ResearchCompleteReceipt | null>(null);
  const [researchSeedReceipt, setResearchSeedReceipt] = useState<ResearchSeedReceipt | null>(null);
  const [researchHarvestReceipt, setResearchHarvestReceipt] = useState<ResearchHarvestReceipt | null>(null);
  const [researchAlbumRecord, setResearchAlbumRecord] = useState<ResearchAlbumRecord | null>(null);
  const [orderDeliveryReceipt, setOrderDeliveryReceipt] = useState<OrderDeliveryReceipt | null>(null);
  const [brokenAssetIds, setBrokenAssetIds] = useState<Set<string>>(() => new Set());
  const [creatureStageReaction, setCreatureStageReaction] = useState(0);
  const [albumMemoryPage, setAlbumMemoryPage] = useState(0);
  const albumClueFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    loadAssetManifest()
      .then(setManifest)
      .catch((error: unknown) => setManifestError(error instanceof Error ? error.message : "manifest load failed"));

    if (getLocalQaReset()) {
      localSaveStore.clear();
    }

    const qaOfflineMinutes = getLocalQaOfflineMinutes();
    const qaSpriteState = getLocalQaSpriteState();
    const qaHarvestReveal = getLocalQaHarvestReveal();
    const qaLunarGuardian = getLocalQaLunarGuardian();
    const qaGreenhouseShelf = getLocalQaGreenhouseShelf();
    const qaGreenhouseStorage = getLocalQaGreenhouseStorage();
    const qaGreenhouseRoute = getLocalQaGreenhouseRoute();
    const qaGreenhouseRouteSupply = getLocalQaGreenhouseRouteSupply();
    const qaGreenhouseIrrigation = getLocalQaGreenhouseIrrigation();
    const qaGreenhouseMist = getLocalQaGreenhouseMist();
    const qaExpeditionActive = getLocalQaExpeditionActive();
    const qaExpeditionReady = getLocalQaExpeditionReady();
    const qaProductionReady = getLocalQaProductionReady();
    const qaResearchReady = getLocalQaResearchReady();
    const qaResearchComplete = getLocalQaResearchComplete();
    const qaResearchExpeditionReady = getLocalQaResearchExpeditionReady();
    const qaResearchExpeditionClaimReady = getLocalQaResearchExpeditionClaimReady();
    const qaGreenhouseLunarClaimReady = getLocalQaGreenhouseLunarClaimReady();
    const qaGreenhouseLunarSeedPlantReady = getLocalQaGreenhouseLunarSeedPlantReady();
    const qaLunarSeedReady = getLocalQaLunarSeedReady();
    const qaLunarSeedReadyToHarvest = getLocalQaLunarSeedReadyToHarvest();
    const qaLunarOrderReady = getLocalQaLunarOrderReady();
    const existingSave = qaSpriteState
      ? createSpriteQaSave(qaSpriteState)
      : qaHarvestReveal
        ? createHarvestRevealQaSave()
        : qaLunarOrderReady
          ? createLunarOrderReadyQaSave()
          : qaLunarSeedReadyToHarvest
            ? createLunarSeedReadyToHarvestQaSave()
            : qaLunarSeedReady
              ? createLunarSeedReadyQaSave()
              : qaGreenhouseLunarSeedPlantReady
                ? createGreenhouseLunarSeedPlantReadyQaSave()
                : qaGreenhouseLunarClaimReady
                  ? createGreenhouseLunarClaimReadyQaSave()
                  : qaResearchExpeditionClaimReady
                ? createResearchExpeditionClaimReadyQaSave()
                : qaResearchExpeditionReady
                  ? createResearchExpeditionReadyQaSave()
                  : qaResearchComplete
                    ? createResearchCompleteQaSave()
                    : qaResearchReady
                      ? createResearchReadyQaSave()
                      : qaProductionReady
                        ? createProductionReadyQaSave()
                        : qaExpeditionActive
                          ? createExpeditionActiveQaSave()
                          : qaExpeditionReady
                            ? createExpeditionReadyQaSave()
                            : qaOfflineMinutes
                              ? createOfflineQaSave(
                                  qaOfflineMinutes,
                                  qaLunarGuardian,
                                  qaGreenhouseShelf,
                                  qaGreenhouseStorage,
                                  qaGreenhouseRoute,
                                  qaGreenhouseRouteSupply,
                                  qaGreenhouseIrrigation,
                                  qaGreenhouseMist
                                )
                              : localSaveStore.load();
    const nextSave = existingSave ?? createNewSave();
    const offlineReward = calculateOfflineReward(nextSave, Date.now());
    if (offlineReward.leaves > 0) {
      nextSave.leaves += offlineReward.leaves;
      nextSave.lastSeenAt = new Date().toISOString();
      nextSave.updatedAt = nextSave.lastSeenAt;
      setOfflineMessage(getOfflineRewardMessage(offlineReward));
      setOfflineRewardSummary(offlineReward);
      triggerRewardPulse();
      trackEvent("offline_reward_claimed", {
        leaves: offlineReward.leaves,
        guardianBonusPercent: offlineReward.guardianBonusPercent,
        guardianName: offlineReward.guardianName ?? null,
        shelfBonusPercent: offlineReward.shelfBonusPercent,
        shelfBonusLabel: offlineReward.shelfBonusLabel ?? null
      });
    }
    localSaveStore.save(nextSave);
    setSave(nextSave);
    if (qaHarvestReveal) {
      setHarvestReveal(getCreature("creature_herb_common_001") ?? null);
    }
    trackEvent("session_start", { playerId: nextSave.playerId });
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const starterSeeds = useMemo(() => getStarterSeeds(), []);
  const backgroundPath = getAssetPath(manifest, "background_greenhouse_day_001");
  const discoveredCreatures = save
    ? content.creatures.filter((creature) => save.discoveredCreatureIds.includes(creature.id))
    : [];
  const discoveredCreatureIds = new Set(save?.discoveredCreatureIds ?? []);
  const albumDiscoveredCount = discoveredCreatures.length;
  const firstOwnedCreature = discoveredCreatures[0];
  const activePlot = save?.plots.find((plot) => plot.seedId && !plot.harvestedCreatureId);
  const activePlotSeed = getSeed(activePlot?.seedId);
  const activePlotReady = Boolean(activePlot && activePlotSeed && isPlotReady(activePlot, activePlotSeed, now));
  const firstAlbumRewardReady =
    save && save.discoveredCreatureIds.length > 0 && !save.claimedAlbumMilestoneIds.includes("album_1");
  const expeditionReady = save?.activeExpedition
    ? isExpeditionReady(save.activeExpedition, now) && !save.activeExpedition.claimed
    : false;
  const firstExpedition = content.expeditions.find((item) => item.id === FIRST_EXPEDITION_ID);
  const researchExpedition = save?.researchLevel && save.researchLevel >= FIRST_RESEARCH_MAX_LEVEL
    ? content.expeditions.find((item) => item.id === RESEARCH_EXPEDITION_ID)
    : undefined;
  const activeExpeditionDefinition = save?.activeExpedition
    ? content.expeditions.find((item) => item.id === save.activeExpedition?.expeditionId)
    : undefined;
  const expeditionRemainingSeconds = save?.activeExpedition
    ? getExpeditionRemainingSeconds(save.activeExpedition, now)
    : 0;
  const expeditionCreatureShortfall =
    save && firstExpedition
      ? Math.max(firstExpedition.requiredCreatures - save.discoveredCreatureIds.length, 0)
      : undefined;
  const expeditionNeedsMoreCreatures = (expeditionCreatureShortfall ?? 0) > 0;
  const researchExpeditionShortfall =
    save && researchExpedition ? Math.max(researchExpedition.requiredCreatures - save.discoveredCreatureIds.length, 0) : 0;
  const researchExpeditionRewardClaimed = Boolean(save?.unlockedSeedIds.includes(LUNAR_REWARD_SEED_ID));
  const showResearchExpeditionClue = Boolean(save && researchExpedition && !save.activeExpedition && !researchExpeditionRewardClaimed);
  const greenhouseLunarExpedition = content.expeditions.find((item) => item.id === RESEARCH_EXPEDITION_ID);
  const hasGreenhouseLunarClue = Boolean(
    save &&
      !showResearchExpeditionClue &&
      !save.activeExpedition &&
      !researchExpeditionRewardClaimed &&
      save.idleProduction.completedOrderIds.includes(GREENHOUSE_MIST_RETURN_ORDER.id)
  );
  const greenhouseLunarExpeditionShortfall =
    save && greenhouseLunarExpedition
      ? Math.max(greenhouseLunarExpedition.requiredCreatures - save.discoveredCreatureIds.length, 0)
      : 0;
  const lunarExpeditionGoal = useMemo(() => getLunarExpeditionGoal(save), [save]);
  const lunarRewardSourceLabel = getLunarRewardSourceLabel(save);
  const visibleMissions = save ? content.missions : [];
  const availableSeeds = save ? content.seeds.filter((seed) => save.unlockedSeedIds.includes(seed.id)).slice(0, 3) : [];
  const hasOpenPlot = save ? save.plots.some((plot) => plot.index < save.plotCount && !plot.seedId) : false;
  const showSeedShop = Boolean(save?.selectedStarterSeedId) && !firstAlbumRewardReady;
  const nextAction = getNextAction(save, activePlot, firstAlbumRewardReady, now);
  const nextCreatureGoal = useMemo(() => getNextCreatureGoal(save), [save]);
  const stageHeroCreature = useMemo(() => getStageHeroCreature(save, firstOwnedCreature), [save, firstOwnedCreature]);
  const stageNextCreatureGoal = useMemo(() => getStageNextCreatureGoal(save, nextCreatureGoal), [save, nextCreatureGoal]);
  const lunarCareMemoryEligible = Boolean(
    save &&
      stageHeroCreature?.id === LUNAR_REWARD_CREATURE_ID &&
      save.discoveredCreatureIds.includes(LUNAR_REWARD_CREATURE_ID)
  );
  const lunarCareMemoryClaimed = Boolean(save?.claimedCareMemoryIds.includes(LUNAR_CARE_MEMORY_ID));
  const showLunarCareMemoryReward = lunarCareMemoryEligible && (lunarCareMemoryClaimed || creatureStageReaction > 0);
  const stageCareButtonLabel = lunarCareMemoryClaimed
    ? "도감 기록 보기"
    : creatureStageReaction > 1
      ? "곁에 앉기"
      : creatureStageReaction > 0
        ? "단서 따라가기"
        : "돌보기";
  const creatureStageState = lunarCareMemoryClaimed
    ? "memory-reward"
    : creatureStageReaction >= 2
      ? "clue"
      : creatureStageReaction >= 1
        ? "care"
        : "idle";
  const comebackGoalSeed = nextCreatureGoal?.seed ?? null;
  const comebackGoalSeedCost = comebackGoalSeed ? getSeedPurchaseCost(comebackGoalSeed) : 0;
  const canBuyComebackGoalSeed = Boolean(
    save && comebackGoalSeed && save.unlockedSeedIds.includes(comebackGoalSeed.id) && save.leaves >= comebackGoalSeedCost
  );
  const canBuyAndPlantComebackGoalSeed = canBuyComebackGoalSeed && hasOpenPlot;
  const nextAlbumMilestone = save ? getNextAlbumMilestone(albumDiscoveredCount, save.claimedAlbumMilestoneIds) : null;
  const nextAlbumRewardRemaining = nextAlbumMilestone
    ? Math.max(0, nextAlbumMilestone.requiredDiscoveries - albumDiscoveredCount)
    : 0;
  const albumFeaturedCreature = lunarCareMemoryClaimed ? getCreature(LUNAR_REWARD_CREATURE_ID) ?? firstOwnedCreature : firstOwnedCreature;
  const albumMemoryVariant = albumMemoryPage % 2 === 1;
  const albumMemoryCopy = albumMemoryVariant
    ? albumFeaturedCreature
      ? `${albumFeaturedCreature.name}${getSubjectParticle(albumFeaturedCreature.name)} 온실 바닥의 작은 흔적을 먼저 살피는 버릇을 남겼어요.`
      : ""
    : albumFeaturedCreature?.greeting ?? "";
  const albumMemoryNote = albumMemoryVariant
    ? `기록 ${String((albumMemoryPage % 3) + 1).padStart(2, "0")} · 좋아하는 것: ${albumFeaturedCreature?.favoriteThing ?? "조용한 온실"}`
    : albumFeaturedCreature
      ? `첫 발견 기록 · ${getCreatureRoleLabel(albumFeaturedCreature.role)} · ${getCreatureFamilyLabel(albumFeaturedCreature.family)}`
      : "";
  const albumCareMemoryActive = Boolean(albumFeaturedCreature?.id === LUNAR_REWARD_CREATURE_ID && lunarCareMemoryClaimed);
  const albumCareMemoryLabel = albumCareMemoryActive ? `누누 돌봄 도장 · +${LUNAR_CARE_REWARD_LEAVES} 잎 기억` : "";
  const researchAlbumRecordCreature = researchAlbumRecord ? getCreature(researchAlbumRecord.creatureId) : null;
  const albumClueCreatures = useMemo(() => {
    if (!save) {
      return [];
    }

    const discovered = new Set(save.discoveredCreatureIds);
    const lockedCreatures = content.creatures.filter((creature) => !discovered.has(creature.id));
    const nextGoalCreature = nextCreatureGoal?.creature;
    const ordered = nextGoalCreature
      ? [nextGoalCreature, ...lockedCreatures.filter((creature) => creature.id !== nextGoalCreature.id)]
      : lockedCreatures;

    return ordered.slice(0, 3);
  }, [nextCreatureGoal, save]);
  const productionStatus = useMemo(() => (save ? getProductionStatus(save, now) : null), [save, now]);
  const comebackProductionTarget = productionStatus ? getComebackProductionTarget(productionStatus) : null;
  const mistCondenserPayoffActive = Boolean(
    productionStatus?.order.id === GREENHOUSE_MIST_RETURN_ORDER.id && productionStatus.orderCompleted
  );
  const lunarGuardianOrderPayoffActive = Boolean(
    productionStatus?.order.id === LUNAR_GUARDIAN_ORDER.id && productionStatus.orderCompleted
  );
  const firstOrderDispatchReceiptActive = Boolean(orderDeliveryReceipt?.orderId === FIRST_ORDER.id);
  const firstOrderDispatchReady = Boolean(
    productionStatus?.order.id === FIRST_ORDER.id && productionStatus.orderReady && !productionStatus.orderCompleted
  );
  const hasResearchSeedPlot = Boolean(save?.plots.some((plot) => plot.source === "research" && plot.seedId));
  const actionSurfaceClassName = [
    "starter-panel garden-action-surface",
    productionStatus ? "has-production" : "",
    productionStatus && productionStatus.workerCreatures.length > 1 && productionStatus.orderCompleted ? "has-roster-complete" : "",
    productionStatus?.order.id === GREENHOUSE_ORDER.id ? "has-greenhouse-order" : "",
    productionStatus?.order.id === GREENHOUSE_ORDER.id && !productionStatus.orderCompleted ? "has-open-greenhouse-order" : "",
    productionStatus?.order.id === GREENHOUSE_MIST_RETURN_ORDER.id ? "has-mist-return-order" : "",
    productionStatus?.order.id === GREENHOUSE_MIST_RETURN_ORDER.id && !productionStatus.orderCompleted ? "has-open-mist-return-order" : "",
    productionStatus?.order.id === FIRST_ORDER.id && productionStatus.workerCreatures.length > 1 && !productionStatus.orderCompleted
      ? "has-first-order-return-briefing"
      : "",
    productionStatus?.order.id === LUNAR_GUARDIAN_ORDER.id ? "has-lunar-guardian-order" : "",
    productionStatus?.order.id === LUNAR_GUARDIAN_ORDER.id && !productionStatus.orderCompleted ? "has-open-lunar-guardian-order" : "",
    mistCondenserPayoffActive ? "has-mist-condenser-payoff" : "",
    lunarGuardianOrderPayoffActive ? "has-lunar-guardian-payoff" : "",
    productionClaimReceipt ? "has-production-claim-receipt" : "",
    productionBoostReceipt ? "has-production-boost-receipt" : "",
    researchUnlockReceipt ? "has-research-unlock-receipt" : "",
    researchCompleteReceipt ? "has-research-complete-receipt" : "",
    researchHarvestReceipt ? "has-research-harvest-receipt" : "",
    orderDeliveryReceipt ? "has-order-dispatch-receipt" : "",
    firstOrderDispatchReceiptActive ? "has-first-order-dispatch-receipt" : "",
    save &&
    save.idleProduction.completedOrderIds.includes(GREENHOUSE_EXPANSION_ORDER.id) &&
    save.greenhouseRouteLevel < GREENHOUSE_ROUTE_MAX_LEVEL &&
    save.plotCount < GREENHOUSE_ROUTE_PLOT_COUNT
      ? "has-greenhouse-route-choice"
      : "",
    save && (save.greenhouseRouteLevel >= GREENHOUSE_ROUTE_MAX_LEVEL || save.plotCount >= GREENHOUSE_ROUTE_PLOT_COUNT)
      ? "has-greenhouse-route-complete"
      : "",
    save &&
    save.idleProduction.completedOrderIds.includes(GREENHOUSE_ROUTE_SUPPLY_ORDER.id) &&
    save.greenhouseIrrigationLevel < GREENHOUSE_IRRIGATION_MAX_LEVEL
      ? "has-greenhouse-irrigation-choice"
      : "",
    save && save.greenhouseIrrigationLevel >= GREENHOUSE_IRRIGATION_MAX_LEVEL ? "has-greenhouse-irrigation-complete" : "",
    save &&
    save.idleProduction.completedOrderIds.includes(GREENHOUSE_IRRIGATION_ORDER.id) &&
    save.greenhouseMistLevel < GREENHOUSE_MIST_MAX_LEVEL
      ? "has-greenhouse-mist-choice"
      : "",
    save && save.greenhouseMistLevel >= GREENHOUSE_MIST_MAX_LEVEL ? "has-greenhouse-mist-complete" : "",
    researchSeedReceipt || hasResearchSeedPlot ? "has-research-seed-receipt" : "",
    activePlot ? "has-active-plot" : "",
    activePlotReady ? "has-ready-plot" : ""
  ]
    .filter(Boolean)
    .join(" ");
  const upgradeChoices =
    save && productionStatus?.ratePerMinute
      ? buildUpgradeChoices(
          save,
          productionStatus,
          buyFirstUpgrade,
          buyProductionBoost,
          buyMaterialWorkbench,
          buyGreenhouseFacility,
          buyGreenhouseStorage,
          buyGreenhouseRoute,
          buyGreenhouseIrrigation,
          buyGreenhouseMist,
          buyFirstResearch
        )
      : [];
  const researchClue = getResearchClue(save, nextCreatureGoal);
  const researchClueTargetSeedId = researchClue && nextCreatureGoal ? nextCreatureGoal.seed.id : null;
  const visibleSeedInventorySeeds =
    nextCreatureGoal && !availableSeeds.some((seed) => seed.id === nextCreatureGoal.seed.id)
      ? [nextCreatureGoal.seed, ...availableSeeds]
      : availableSeeds;
  const seedInventorySeeds = nextCreatureGoal
    ? [...visibleSeedInventorySeeds].sort(
        (first, second) => Number(second.id === nextCreatureGoal.seed.id) - Number(first.id === nextCreatureGoal.seed.id)
      )
    : visibleSeedInventorySeeds;
  const totalOwnedSeeds = save ? Object.values(save.seedInventory).reduce((total, count) => total + count, 0) : 0;
  const researchGrowthPreview = hasResearchSeedPlot && nextCreatureGoal
    ? `${nextCreatureGoal.seed.name} 수확 예고 · ${nextCreatureGoal.creature.name} 단서 추적 중`
    : null;
  const gardenViewModel = useMemo(
    () =>
      buildGardenPlayfieldViewModel(
        save,
        now,
        manifest,
        orderDeliveryReceipt,
        productionClaimReceipt,
        productionBoostReceipt,
        researchUnlockReceipt,
        researchCompleteReceipt,
        researchSeedReceipt,
        researchHarvestReceipt
      ),
    [
      save,
      now,
      manifest,
      orderDeliveryReceipt,
      productionClaimReceipt,
      productionBoostReceipt,
      researchUnlockReceipt,
      researchCompleteReceipt,
      researchSeedReceipt,
      researchHarvestReceipt
    ]
  );
  const playfieldAssets = useMemo(() => getPlayfieldAnimationAssets(manifest), [manifest]);
  const showDebugPanel = getLocalDebugMode();
  const isPlayerTabScreen = activeTab !== "garden";
  const showSidePanel = showDebugPanel || isPlayerTabScreen || Boolean(manifestError);

  function commit(mutator: (draft: PlayerSave) => void) {
    setSave((current) => {
      if (!current) {
        return current;
      }

      const draft: PlayerSave = structuredClone(current);
      mutator(draft);
      draft.updatedAt = new Date().toISOString();
      localSaveStore.save(draft);
      return draft;
    });
  }

  function showResearchSeedReceipt(seed: SeedDefinition, actionLabel: string) {
    if (!nextCreatureGoal || seed.id !== researchClueTargetSeedId || seed.id === LUNAR_REWARD_SEED_ID) {
      return;
    }

    const receipt: ResearchSeedReceipt = {
      id: Date.now(),
      seedName: seed.name,
      creatureName: nextCreatureGoal.creature.name,
      clueLabel: researchClue ?? `${seed.name}에서 다음 생명체 단서`,
      actionLabel
    };

    setOrderDeliveryReceipt(null);
    setProductionClaimReceipt(null);
    setProductionBoostReceipt(null);
    setResearchUnlockReceipt(null);
    setResearchCompleteReceipt(null);
    setResearchHarvestReceipt(null);
    setResearchAlbumRecord(null);
    setResearchSeedReceipt(receipt);
    window.setTimeout(() => {
      setResearchSeedReceipt((current) => (current?.id === receipt.id ? null : current));
    }, 6_000);
  }

  function selectStarter(seed: SeedDefinition) {
    commit((draft) => {
      draft.selectedStarterSeedId = seed.id;
      draft.plots[0] = plantSeedInPlot(draft.plots[0], seed);
      advanceMission(draft, "tutorial_plant_first_seed");
      trackEvent("starter_seed_selected", { seedId: seed.id });
      trackEvent("seed_planted", { seedId: seed.id, plotIndex: 0 });
    });
  }

  function buySeed(seed: SeedDefinition) {
    const costLeaves = getSeedPurchaseCost(seed);
    const canPurchase = Boolean(save?.unlockedSeedIds.includes(seed.id) && save.leaves >= costLeaves);
    commit((draft) => {
      if (!draft.unlockedSeedIds.includes(seed.id) || draft.leaves < costLeaves) {
        return;
      }

      draft.leaves -= costLeaves;
      draft.seedInventory[seed.id] = (draft.seedInventory[seed.id] ?? 0) + 1;
      advanceMission(draft, "daily_buy_3_seeds");
      trackEvent(
        "seed_purchased",
        seed.id === researchClueTargetSeedId && seed.id !== LUNAR_REWARD_SEED_ID
          ? { seedId: seed.id, costLeaves, rewardMotion: "research_clue_seed_purchased" }
          : { seedId: seed.id, costLeaves }
      );
    });
    if (canPurchase) {
      showResearchSeedReceipt(seed, "구매 완료");
    }
  }

  function buyComebackGoalSeed(seed: SeedDefinition) {
    buySeed(seed);
    setOfflineRewardSummary(null);
    setActiveTab("seeds");
  }

  function continueComebackProductionTarget() {
    if (!productionStatus || !comebackProductionTarget) {
      setOfflineRewardSummary(null);
      setActiveTab("garden");
      return;
    }

    setOfflineRewardSummary(null);
    setActiveTab("garden");

    if (comebackProductionTarget.action === "claim_production") {
      claimProductionLeaves();
      setOfflineMessage(
        `${offlineRewardSummary?.leaves ?? 0} 잎 복귀 보상을 받고 ${productionStatus.pendingLeaves} 잎을 주문 상자에 채웠어요.`
      );
    } else if (comebackProductionTarget.action === "deliver_order") {
      deliverFirstOrder();
      setOfflineMessage(`${productionStatus.order.title}까지 이어서 납품했어요.`);
    } else {
      setOfflineMessage(`복귀 보상 수령 완료. 다음 생산 목표는 ${productionStatus.order.title}입니다.`);
      triggerProductionFx("production");
      triggerRewardPulse();
    }

    trackEvent("comeback_production_target_selected", {
      action: comebackProductionTarget.action,
      orderId: productionStatus.order.id,
      pendingLeaves: productionStatus.pendingLeaves,
      orderProgress: productionStatus.orderProgress
    });
  }

  function buyAndPlantComebackGoalSeed(seed: SeedDefinition) {
    commit((draft) => {
      const costLeaves = getSeedPurchaseCost(seed);
      const plot = draft.plots.find((candidate) => candidate.index < draft.plotCount && !candidate.seedId);
      if (!draft.unlockedSeedIds.includes(seed.id) || draft.leaves < costLeaves || !plot) {
        return;
      }

      draft.leaves -= costLeaves;
      draft.seedInventory[seed.id] = (draft.seedInventory[seed.id] ?? 0) + 1;
      advanceMission(draft, "daily_buy_3_seeds");
      trackEvent("seed_purchased", { seedId: seed.id, costLeaves, source: "comeback_one_tap" });

      draft.seedInventory[seed.id] -= 1;
      const seedSource = getSeedPlantingSource(draft, seed);
      draft.plots[plot.index] = plantSeedInPlot(plot, seed, seedSource);
      trackEvent("seed_planted", { seedId: seed.id, plotIndex: plot.index, source: seedSource ?? "comeback_one_tap" });
    });
    setOfflineRewardSummary(null);
    setOfflineMessage(`${seed.name}을 바로 심었어요. 밭을 톡톡 두드려 성장시켜요.`);
    setActiveTab("garden");
  }

  function plantOwnedSeed(seed: SeedDefinition) {
    const isResearchClueSeed = seed.id === researchClueTargetSeedId && seed.id !== LUNAR_REWARD_SEED_ID;
    const shouldOpenGardenAfterPlanting =
      save !== null &&
      (save.seedInventory[seed.id] ?? 0) > 0 &&
      save.plots.some((candidate) => candidate.index < save.plotCount && !candidate.seedId) &&
      (getSeedPlantingSource(save, seed) === "greenhouse_mist" || isResearchClueSeed);
    const canPlant =
      save !== null &&
      (save.seedInventory[seed.id] ?? 0) > 0 &&
      save.plots.some((candidate) => candidate.index < save.plotCount && !candidate.seedId);

    commit((draft) => {
      if ((draft.seedInventory[seed.id] ?? 0) <= 0) {
        return;
      }

      const plot = draft.plots.find((candidate) => candidate.index < draft.plotCount && !candidate.seedId);
      if (!plot) {
        return;
      }

      draft.seedInventory[seed.id] -= 1;
      const seedSource = isResearchClueSeed ? "research" : getSeedPlantingSource(draft, seed);
      draft.plots[plot.index] = plantSeedInPlot(plot, seed, seedSource);
      trackEvent(
        "seed_planted",
        isResearchClueSeed
          ? {
              seedId: seed.id,
              plotIndex: plot.index,
              source: seedSource ?? "research_clue",
              rewardMotion: "research_clue_seed_planted"
            }
          : { seedId: seed.id, plotIndex: plot.index, source: seedSource ?? "inventory" }
      );
    });
    if (canPlant && isResearchClueSeed) {
      showResearchSeedReceipt(seed, "심기 완료");
    }
    if (shouldOpenGardenAfterPlanting) {
      setActiveTab("garden");
    }
  }

  function tapGrowth(plotIndex: number) {
    commit((draft) => {
      const plot = draft.plots[plotIndex];
      const seed = getSeed(plot.seedId);
      if (!seed || isPlotReady(plot, seed, now)) {
        return;
      }

      plot.tapProgressSeconds += seed.tapSecondsRemoved * (1 + draft.tapPowerLevel * 0.12);
      trackEvent("growth_tapped", { seedId: seed.id, plotIndex });
    });
  }

  function harvest(plotIndex: number) {
    const currentPlot = save?.plots[plotIndex];
    const currentSeed = getSeed(currentPlot?.seedId);
    const harvestedCreature = currentSeed && currentPlot && isPlotReady(currentPlot, currentSeed, now)
      ? getCreature(currentSeed.creaturePool[0])
      : undefined;
    const isResearchClueHarvest = Boolean(
      currentPlot?.source === "research" &&
        currentSeed &&
        harvestedCreature &&
        currentSeed.id === researchClueTargetSeedId &&
        currentSeed.id !== LUNAR_REWARD_SEED_ID
    );
    const researchHarvest: ResearchHarvestReceipt | null =
      isResearchClueHarvest && currentSeed && harvestedCreature
        ? {
            id: Date.now(),
            seedName: currentSeed.name,
            creatureName: harvestedCreature.name,
            clueLabel: researchClue ?? `${currentSeed.name}에서 ${harvestedCreature.name} 단서 발견`
          }
        : null;

    commit((draft) => {
      const plot = draft.plots[plotIndex];
      const seed = getSeed(plot.seedId);
      if (!seed || !isPlotReady(plot, seed, now)) {
        return;
      }

      const creatureId = seed.creaturePool[0];
      draft.idleProduction.pendingLeaves = getPendingProductionLeaves(draft, now);
      draft.idleProduction.lastTickAt = new Date(now).toISOString();
      draft.leaves += seed.baseHarvestLeaves;
      plot.harvestedCreatureId = creatureId;
      plot.seedId = undefined;
      plot.source = undefined;
      plot.plantedAt = undefined;
      plot.tapProgressSeconds = 0;

      if (!draft.discoveredCreatureIds.includes(creatureId)) {
        draft.discoveredCreatureIds.push(creatureId);
      }
      advanceMission(draft, "tutorial_harvest_first_creature");
      advanceMission(draft, "daily_harvest_5");
      trackEvent(
        "creature_harvested",
        isResearchClueHarvest
          ? {
              seedId: seed.id,
              creatureId,
              leaves: seed.baseHarvestLeaves,
              source: "research_clue",
              rewardMotion: "research_clue_creature_reveal"
            }
          : { seedId: seed.id, creatureId, leaves: seed.baseHarvestLeaves }
      );
    });
    if (harvestedCreature) {
      setOrderDeliveryReceipt(null);
      setProductionClaimReceipt(null);
      setProductionBoostReceipt(null);
      setResearchUnlockReceipt(null);
      setResearchCompleteReceipt(null);
      setResearchSeedReceipt(null);
      setResearchHarvestReceipt(researchHarvest);
      setResearchAlbumRecord(null);
      setHarvestReveal(harvestedCreature);
    }
    triggerRewardPulse();
  }

  function recordHarvestRevealToAlbum() {
    if (researchHarvestReceipt && harvestReveal) {
      setResearchAlbumRecord({
        id: Date.now(),
        creatureId: harvestReveal.id,
        creatureName: researchHarvestReceipt.creatureName,
        seedName: researchHarvestReceipt.seedName,
        clueLabel: researchHarvestReceipt.clueLabel
      });
      setActiveTab("album");
    }
    setHarvestReveal(null);
  }

  function claimAlbumReward() {
    commit((draft) => {
      if (draft.claimedAlbumMilestoneIds.includes("album_1") || draft.discoveredCreatureIds.length === 0) {
        return;
      }

      draft.claimedAlbumMilestoneIds.push("album_1");
      draft.leaves += 25;
      advanceMission(draft, "tutorial_claim_album_reward");
      trackEvent("album_reward_claimed", { milestoneId: "album_1", leaves: 25 });
    });
    triggerRewardPulse();
  }

  function careForStageCreature() {
    if (lunarCareMemoryClaimed) {
      setCreatureStageReaction((current) => Math.max(current, 2));
      setActiveTab("album");
      return;
    }

    setCreatureStageReaction((current) => Math.max(current + 1, 1));

    if (!lunarCareMemoryEligible) {
      return;
    }

    commit((draft) => {
      if (
        !draft.discoveredCreatureIds.includes(LUNAR_REWARD_CREATURE_ID) ||
        draft.claimedCareMemoryIds.includes(LUNAR_CARE_MEMORY_ID)
      ) {
        return;
      }

      draft.claimedCareMemoryIds.push(LUNAR_CARE_MEMORY_ID);
      draft.leaves += LUNAR_CARE_REWARD_LEAVES;
      trackEvent("creature_care_memory_claimed", {
        creatureId: LUNAR_REWARD_CREATURE_ID,
        memoryId: LUNAR_CARE_MEMORY_ID,
        leaves: LUNAR_CARE_REWARD_LEAVES
      });
    });
    triggerRewardPulse();
  }

  function buyFirstUpgrade() {
    commit((draft) => {
      if (draft.leaves < FIRST_UPGRADE_COST || draft.plotCount >= 2) {
        return;
      }

      draft.leaves -= FIRST_UPGRADE_COST;
      draft.plotCount = 2;
      trackEvent("upgrade_purchased", { upgradeId: "plot_2", costLeaves: FIRST_UPGRADE_COST });
    });
  }

  function buyProductionBoost() {
    if (
      !save ||
      save.productionBoostLevel >= PRODUCTION_BOOST_MAX_LEVEL ||
      save.leaves < PRODUCTION_BOOST_COST_LEAVES ||
      save.pollen < PRODUCTION_BOOST_COST_POLLEN ||
      !save.idleProduction.completedOrderIds.includes(FIRST_ORDER.id)
    ) {
      return;
    }

    const previousRatePerMinute = getProductionRatePerSecond(save) * 60;
    const nextRatePerMinute =
      getProductionRatePerSecond({ ...save, productionBoostLevel: save.productionBoostLevel + 1 }) * 60;
    const boostReceipt: ProductionBoostReceipt = {
      id: Date.now(),
      previousRatePerMinute,
      nextRatePerMinute,
      bonusPercent: Math.round(PRODUCTION_BOOST_RATE_BONUS * 100)
    };

    setOrderDeliveryReceipt(null);
    setProductionClaimReceipt(null);
    setResearchUnlockReceipt(null);
    setResearchCompleteReceipt(null);
    setResearchHarvestReceipt(null);
    setResearchAlbumRecord(null);
    setResearchSeedReceipt(null);
    commit((draft) => {
      draft.leaves -= PRODUCTION_BOOST_COST_LEAVES;
      draft.pollen -= PRODUCTION_BOOST_COST_POLLEN;
      draft.productionBoostLevel += 1;
      trackEvent("upgrade_purchased", {
        upgradeId: "production_boost_1",
        costLeaves: PRODUCTION_BOOST_COST_LEAVES,
        costPollen: PRODUCTION_BOOST_COST_POLLEN,
        productionBoostLevel: draft.productionBoostLevel,
        previousRatePerMinute,
        nextRatePerMinute,
        rewardMotion: "worker_snack_buff"
      });
    });
    setProductionBoostReceipt(boostReceipt);
    window.setTimeout(() => {
      setProductionBoostReceipt((current) => (current?.id === boostReceipt.id ? null : current));
    }, 1_800);
    triggerProductionFx("production");
    triggerRewardPulse();
  }

  function buyMaterialWorkbench() {
    commit((draft) => {
      if (
        draft.materialWorkbenchLevel >= MATERIAL_WORKBENCH_MAX_LEVEL ||
        draft.materials < MATERIAL_WORKBENCH_COST_MATERIALS
      ) {
        return;
      }

      draft.materials -= MATERIAL_WORKBENCH_COST_MATERIALS;
      draft.materialWorkbenchLevel += 1;
      trackEvent("upgrade_purchased", {
        upgradeId: "material_workbench_1",
        costMaterials: MATERIAL_WORKBENCH_COST_MATERIALS,
        materialWorkbenchLevel: draft.materialWorkbenchLevel
      });
    });
    triggerRewardPulse();
  }

  function buyGreenhouseFacility() {
    commit((draft) => {
      if (
        draft.greenhouseFacilityLevel >= GREENHOUSE_FACILITY_MAX_LEVEL ||
        draft.materialWorkbenchLevel < MATERIAL_WORKBENCH_MAX_LEVEL ||
        draft.leaves < GREENHOUSE_FACILITY_COST_LEAVES ||
        draft.materials < GREENHOUSE_FACILITY_COST_MATERIALS
      ) {
        return;
      }

      draft.leaves -= GREENHOUSE_FACILITY_COST_LEAVES;
      draft.materials -= GREENHOUSE_FACILITY_COST_MATERIALS;
      draft.greenhouseFacilityLevel += 1;
      draft.idleProduction.pendingLeaves = Math.max(draft.idleProduction.pendingLeaves, GREENHOUSE_ORDER.requiredLeaves);
      trackEvent("upgrade_purchased", {
        upgradeId: "greenhouse_facility_1",
        costLeaves: GREENHOUSE_FACILITY_COST_LEAVES,
        costMaterials: GREENHOUSE_FACILITY_COST_MATERIALS,
        greenhouseFacilityLevel: draft.greenhouseFacilityLevel
      });
    });
    triggerRewardPulse();
  }

  function buyGreenhouseStorage() {
    commit((draft) => {
      if (
        draft.greenhouseStorageLevel >= GREENHOUSE_STORAGE_MAX_LEVEL ||
        !draft.idleProduction.completedOrderIds.includes(GREENHOUSE_ORDER.id) ||
        draft.materials < GREENHOUSE_STORAGE_COST_MATERIALS
      ) {
        return;
      }

      draft.materials -= GREENHOUSE_STORAGE_COST_MATERIALS;
      draft.greenhouseStorageLevel += 1;
      trackEvent("upgrade_purchased", {
        upgradeId: "greenhouse_storage_1",
        costMaterials: GREENHOUSE_STORAGE_COST_MATERIALS,
        greenhouseStorageLevel: draft.greenhouseStorageLevel
      });
    });
    triggerRewardPulse();
  }

  function buyGreenhouseRoute() {
    commit((draft) => {
      if (
        draft.greenhouseRouteLevel >= GREENHOUSE_ROUTE_MAX_LEVEL ||
        !draft.idleProduction.completedOrderIds.includes(GREENHOUSE_EXPANSION_ORDER.id) ||
        draft.materials < GREENHOUSE_ROUTE_COST_MATERIALS ||
        draft.plotCount >= GREENHOUSE_ROUTE_PLOT_COUNT
      ) {
        return;
      }

      draft.materials -= GREENHOUSE_ROUTE_COST_MATERIALS;
      draft.greenhouseRouteLevel += 1;
      draft.plotCount = GREENHOUSE_ROUTE_PLOT_COUNT;
      trackEvent("upgrade_purchased", {
        upgradeId: "greenhouse_route_1",
        costMaterials: GREENHOUSE_ROUTE_COST_MATERIALS,
        greenhouseRouteLevel: draft.greenhouseRouteLevel,
        plotCount: draft.plotCount
      });
    });
    triggerRewardPulse();
  }

  function buyGreenhouseIrrigation() {
    commit((draft) => {
      if (
        draft.greenhouseIrrigationLevel >= GREENHOUSE_IRRIGATION_MAX_LEVEL ||
        !draft.idleProduction.completedOrderIds.includes(GREENHOUSE_ROUTE_SUPPLY_ORDER.id) ||
        draft.materials < GREENHOUSE_IRRIGATION_COST_MATERIALS ||
        draft.pollen < GREENHOUSE_IRRIGATION_COST_POLLEN
      ) {
        return;
      }

      draft.materials -= GREENHOUSE_IRRIGATION_COST_MATERIALS;
      draft.pollen -= GREENHOUSE_IRRIGATION_COST_POLLEN;
      draft.greenhouseIrrigationLevel += 1;
      trackEvent("upgrade_purchased", {
        upgradeId: "greenhouse_irrigation_1",
        costMaterials: GREENHOUSE_IRRIGATION_COST_MATERIALS,
        costPollen: GREENHOUSE_IRRIGATION_COST_POLLEN,
        greenhouseIrrigationLevel: draft.greenhouseIrrigationLevel
      });
    });
    triggerRewardPulse();
  }

  function buyGreenhouseMist() {
    commit((draft) => {
      if (
        draft.greenhouseMistLevel >= GREENHOUSE_MIST_MAX_LEVEL ||
        !draft.idleProduction.completedOrderIds.includes(GREENHOUSE_IRRIGATION_ORDER.id) ||
        draft.materials < GREENHOUSE_MIST_COST_MATERIALS ||
        draft.pollen < GREENHOUSE_MIST_COST_POLLEN
      ) {
        return;
      }

      draft.materials -= GREENHOUSE_MIST_COST_MATERIALS;
      draft.pollen -= GREENHOUSE_MIST_COST_POLLEN;
      draft.greenhouseMistLevel += 1;
      trackEvent("upgrade_purchased", {
        upgradeId: "greenhouse_mist_1",
        costMaterials: GREENHOUSE_MIST_COST_MATERIALS,
        costPollen: GREENHOUSE_MIST_COST_POLLEN,
        greenhouseMistLevel: draft.greenhouseMistLevel
      });
    });
    triggerRewardPulse();
  }

  function buyFirstResearch() {
    if (
      !save ||
      save.researchLevel >= FIRST_RESEARCH_MAX_LEVEL ||
      save.leaves < FIRST_RESEARCH_COST_LEAVES ||
      save.pollen < FIRST_RESEARCH_COST_POLLEN ||
      !save.idleProduction.completedOrderIds.includes(SECOND_ORDER.id)
    ) {
      return;
    }

    const clueLabel = nextCreatureGoal
      ? `${nextCreatureGoal.seed.name}에서 ${nextCreatureGoal.creature.albumHint}`
      : "다음 씨앗 목표를 도감에 기록";
    const researchReceipt: ResearchCompleteReceipt = {
      id: Date.now(),
      researchTitle: "새싹 기록법 연구",
      clueLabel,
      seedName: nextCreatureGoal?.seed.name ?? "다음 씨앗",
      creatureName: nextCreatureGoal?.creature.name ?? "다음 생명체"
    };

    setOrderDeliveryReceipt(null);
    setProductionClaimReceipt(null);
    setProductionBoostReceipt(null);
    setResearchUnlockReceipt(null);
    setResearchCompleteReceipt(researchReceipt);
    commit((draft) => {
      if (
        draft.researchLevel >= FIRST_RESEARCH_MAX_LEVEL ||
        draft.leaves < FIRST_RESEARCH_COST_LEAVES ||
        draft.pollen < FIRST_RESEARCH_COST_POLLEN ||
        !draft.idleProduction.completedOrderIds.includes(SECOND_ORDER.id)
      ) {
        return;
      }

      draft.leaves -= FIRST_RESEARCH_COST_LEAVES;
      draft.pollen -= FIRST_RESEARCH_COST_POLLEN;
      draft.researchLevel += 1;
      trackEvent("research_purchased", {
        researchId: "seed_log_1",
        costLeaves: FIRST_RESEARCH_COST_LEAVES,
        costPollen: FIRST_RESEARCH_COST_POLLEN,
        researchLevel: draft.researchLevel,
        rewardMotion: "research_clue_recorded",
        clueLabel
      });
    });
    window.setTimeout(() => {
      setResearchCompleteReceipt((current) => (current?.id === researchReceipt.id ? null : current));
    }, 2_200);
    triggerRewardPulse();
  }

  function startExpedition(expeditionId = FIRST_EXPEDITION_ID, source?: ExpeditionRewardSource) {
    commit((draft) => {
      const expedition = content.expeditions.find((item) => item.id === expeditionId);
      if (!expedition || draft.activeExpedition || draft.discoveredCreatureIds.length < expedition.requiredCreatures) {
        return;
      }

      const expeditionCreatureIds = draft.discoveredCreatureIds.slice(0, expedition.requiredCreatures);

      draft.activeExpedition = {
        expeditionId: expedition.id,
        source,
        creatureIds: expeditionCreatureIds,
        startedAt: new Date().toISOString(),
        durationSeconds: expedition.durationSeconds,
        claimed: false
      };
      advanceMission(draft, "daily_start_expedition");
      trackEvent("expedition_started", {
        expeditionId: expedition.id,
        source: source ?? null,
        creatureCount: expeditionCreatureIds.length,
        primaryCreatureId: expeditionCreatureIds[0] ?? null
      });
    });
  }

  function claimMissionReward(mission: MissionDefinition) {
    commit((draft) => {
      if (draft.claimedMissionIds.includes(mission.id)) {
        return;
      }

      if ((draft.missionProgress[mission.id] ?? 0) < mission.target) {
        return;
      }

      draft.claimedMissionIds.push(mission.id);
      draft.leaves += mission.rewardLeaves;
      trackEvent("mission_reward_claimed", { missionId: mission.id, leaves: mission.rewardLeaves });
    });
    triggerRewardPulse();
  }

  function claimExpedition() {
    commit((draft) => {
      if (!draft.activeExpedition || !isExpeditionReady(draft.activeExpedition, now)) {
        return;
      }

      const expedition = content.expeditions.find((item) => item.id === draft.activeExpedition?.expeditionId);
      const activeExpeditionId = draft.activeExpedition.expeditionId;
      const activeExpeditionSource = getExpeditionRewardSource(draft);
      draft.leaves += expedition?.rewardLeaves ?? 0;
      draft.materials += expedition?.rewardMaterials ?? 0;
      if (activeExpeditionId === RESEARCH_EXPEDITION_ID && !draft.unlockedSeedIds.includes(LUNAR_REWARD_SEED_ID)) {
        draft.unlockedSeedIds.push(LUNAR_REWARD_SEED_ID);
      }
      if (activeExpeditionId === RESEARCH_EXPEDITION_ID && activeExpeditionSource) {
        draft.lunarRewardSource = activeExpeditionSource;
      }
      trackEvent("expedition_claimed", {
        expeditionId: activeExpeditionId,
        source: activeExpeditionSource ?? null,
        leaves: expedition?.rewardLeaves ?? 0,
        materials: expedition?.rewardMaterials ?? 0,
        unlockedSeedId: activeExpeditionId === RESEARCH_EXPEDITION_ID ? LUNAR_REWARD_SEED_ID : null
      });
      draft.activeExpedition = undefined;
    });
    triggerRewardPulse();
  }

  function claimProductionLeaves() {
    if (!save) {
      return;
    }

    const pendingLeaves = getPendingProductionLeaves(save, now);
    if (pendingLeaves <= 0) {
      return;
    }

    const currentOrder = getCurrentOrder(save);
    const currentProgress = save.idleProduction.orderProgress[currentOrder.id] ?? 0;
    const nextProgress = Math.min(currentOrder.requiredLeaves, currentProgress + pendingLeaves);
    const claimReceipt: ProductionClaimReceipt = {
      id: Date.now(),
      leaves: pendingLeaves,
      orderTitle: currentOrder.title,
      orderProgress: nextProgress,
      orderRequired: currentOrder.requiredLeaves
    };

    setOrderDeliveryReceipt(null);
    setResearchUnlockReceipt(null);
    setResearchCompleteReceipt(null);
    setResearchHarvestReceipt(null);
    setResearchAlbumRecord(null);
    setResearchSeedReceipt(null);
    commit((draft) => {
      draft.leaves += pendingLeaves;
      draft.idleProduction.pendingLeaves = 0;
      draft.idleProduction.lastTickAt = new Date(now).toISOString();
      draft.idleProduction.orderProgress[currentOrder.id] = nextProgress;
      trackEvent("idle_production_claimed", {
        leaves: pendingLeaves,
        orderId: currentOrder.id,
        orderProgress: nextProgress,
        orderRequiredLeaves: currentOrder.requiredLeaves,
        ratePerMinute: getProductionRatePerSecond(draft) * 60,
        rewardMotion: "worker_leaf_burst"
      });
    });
    setProductionClaimReceipt(claimReceipt);
    window.setTimeout(() => {
      setProductionClaimReceipt((current) => (current?.id === claimReceipt.id ? null : current));
    }, 1_700);
    triggerProductionFx("production");
    triggerRewardPulse();
  }

  function deliverFirstOrder() {
    if (!save) {
      return;
    }

    const orderBeforeDelivery = getCurrentOrder(save);
    const orderProgress = save.idleProduction.orderProgress[orderBeforeDelivery.id] ?? 0;
    if (
      save.idleProduction.completedOrderIds.includes(orderBeforeDelivery.id) ||
      orderProgress < orderBeforeDelivery.requiredLeaves
    ) {
      return;
    }

    setProductionClaimReceipt(null);
    setProductionBoostReceipt(null);
    setResearchCompleteReceipt(null);
    setResearchHarvestReceipt(null);
    setResearchAlbumRecord(null);
    setResearchSeedReceipt(null);

    const orderFxAssetId = getProductionFxAssetId("order", orderBeforeDelivery);
    const deliveryReceipt: OrderDeliveryReceipt = {
      id: Date.now(),
      orderId: orderBeforeDelivery.id,
      title: orderBeforeDelivery.title,
      rewardLabel: formatOrderReward(orderBeforeDelivery),
      nextOrderTitle: getOrderAfterCompleting(save, orderBeforeDelivery).title
    };
    const researchReceipt: ResearchUnlockReceipt | null =
      orderBeforeDelivery.id === SECOND_ORDER.id
        ? {
            id: Date.now(),
            orderTitle: orderBeforeDelivery.title,
            rewardLabel: formatOrderReward(orderBeforeDelivery),
            researchTitle: "새싹 기록법 연구"
          }
        : null;

    commit((draft) => {
      const currentOrder = getCurrentOrder(draft);
      const progress = draft.idleProduction.orderProgress[currentOrder.id] ?? 0;
      if (draft.idleProduction.completedOrderIds.includes(currentOrder.id) || progress < currentOrder.requiredLeaves) {
        return;
      }

      draft.idleProduction.completedOrderIds.push(currentOrder.id);
      draft.leaves += currentOrder.rewardLeaves;
      draft.pollen += currentOrder.rewardPollen;
      draft.materials += currentOrder.rewardMaterials ?? 0;
      trackEvent("order_delivered", {
        orderId: currentOrder.id,
        rewardLeaves: currentOrder.rewardLeaves,
        rewardPollen: currentOrder.rewardPollen,
        rewardMaterials: currentOrder.rewardMaterials ?? 0,
        dispatchState: "crate_dispatched",
        researchUnlock: currentOrder.id === SECOND_ORDER.id
      });
      if (currentOrder.id === SECOND_ORDER.id) {
        trackEvent("research_unlocked", {
          orderId: currentOrder.id,
          researchId: "seed_log_1",
          rewardMotion: "research_note_unlock"
        });
      }
    });
    if (orderBeforeDelivery.id === FIRST_ORDER.id) {
      setOrderDeliveryReceipt(deliveryReceipt);
      window.setTimeout(() => {
        setOrderDeliveryReceipt((current) => (current?.id === deliveryReceipt.id ? null : current));
      }, 1_800);
    } else {
      setOrderDeliveryReceipt(null);
    }
    if (researchReceipt) {
      setResearchUnlockReceipt(researchReceipt);
      window.setTimeout(() => {
        setResearchUnlockReceipt((current) => (current?.id === researchReceipt.id ? null : current));
      }, 2_000);
    }
    triggerProductionFx("order", orderFxAssetId);
    triggerRewardPulse();
  }

  function handlePlayfieldAction(action: GardenPlayfieldAction) {
    if (action.type === "tap_growth") {
      tapGrowth(action.plotIndex);
      return;
    }

    if (action.type === "harvest_plot") {
      harvest(action.plotIndex);
    }
  }

  function triggerRewardPulse() {
    setRewardPulse(Date.now());
    window.setTimeout(() => setRewardPulse(null), 420);
  }

  function triggerProductionFx(kind: ProductionFxKind, assetId = PRODUCTION_FX_ASSETS[kind]) {
    const id = Date.now();
    setProductionFx({ assetId, id, kind });
    const qaWindow = window as unknown as {
      __productionFxEvents?: Array<{ kind: ProductionFxKind; assetId: string; timestamp: number }>;
    };
    qaWindow.__productionFxEvents = [
      ...(qaWindow.__productionFxEvents ?? []),
      { kind, assetId, timestamp: Date.now() }
    ];
    window.setTimeout(() => {
      setProductionFx((current) => (current?.id === id ? null : current));
    }, 1_600);
  }

  function focusAlbumClues() {
    setAlbumMemoryPage((current) => current + 1);
    window.setTimeout(() => {
      albumClueFocusRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
    }, 0);
  }

  function markAssetBroken(assetId: string) {
    setBrokenAssetIds((current) => {
      const next = new Set(current);
      next.add(assetId);
      return next;
    });
  }

  function renderAsset(assetId: string, fallbackText: string) {
    const path = brokenAssetIds.has(assetId) ? "" : getAssetPath(manifest, assetId);

    if (!path) {
      return (
        <span className="asset-fallback" aria-hidden="true">
          {fallbackText}
        </span>
      );
    }

    return <img alt="" onError={() => markAssetBroken(assetId)} src={path} />;
  }

  function renderProductionFx(effect: ProductionFxState) {
    const path = brokenAssetIds.has(effect.assetId) ? "" : getAssetPath(manifest, effect.assetId);
    if (!path) {
      return null;
    }

    return (
      <span aria-hidden="true" className={`production-fx production-fx-${effect.kind}`} key={effect.id}>
        <img alt="" onError={() => markAssetBroken(effect.assetId)} src={path} />
      </span>
    );
  }

  return (
    <main className={showDebugPanel ? "app-shell debug-shell" : "app-shell playable-focus"}>
      <section
        className={["garden-stage", isPlayerTabScreen ? "has-player-tab" : "", showDebugPanel ? "debug-mode" : ""]
          .concat(stageHeroCreature ? ["has-creature-stage"] : [])
          .concat(productionStatus?.order.id === LUNAR_GUARDIAN_ORDER.id ? ["has-lunar-guardian-order"] : [])
          .filter(Boolean)
          .join(" ")}
        style={backgroundPath ? { backgroundImage: `url(${backgroundPath})` } : undefined}
      >
        <div className="top-bar">
          <div>
            <p className="eyebrow">햇살 온실 정원</p>
            <h1>이상한 씨앗상회</h1>
            <p className="objective-chip">{nextAction.title}</p>
          </div>
          <div className={rewardPulse ? "currency-cluster reward-pop" : "currency-cluster"} aria-label="현재 재화">
            <span>잎 {save?.leaves ?? 0}</span>
            <span>꽃가루 {save?.pollen ?? 0}</span>
            <span>재료 {save?.materials ?? 0}</span>
          </div>
        </div>

        {offlineMessage && <div className="toast">{offlineMessage}</div>}
        {offlineRewardSummary && (
          <section className="comeback-reward" aria-label="오프라인 복귀 보상">
            <div className="comeback-reward-card">
              <p className="reveal-kicker">정원 복귀</p>
              <p className="panel-label">오프라인 복귀 보상</p>
              <h2>다녀온 동안 정원이 자랐어요</h2>
              <div className="comeback-reward-grid" aria-label="복귀 보상 요약">
                <span>
                  <small>비운 시간</small>
                  <strong>{getAwayTimeLabel(offlineRewardSummary.awayMinutes)}</strong>
                </span>
                <span>
                  <small>모은 잎</small>
                  <strong>{offlineRewardSummary.leaves} 잎</strong>
                </span>
              </div>
              {(offlineRewardSummary.guardianName && offlineRewardSummary.guardianBonusPercent > 0) ||
              offlineRewardSummary.shelfBonusPercent > 0 ? (
                <div className="comeback-bonus-stack">
                  {offlineRewardSummary.guardianName && offlineRewardSummary.guardianBonusPercent > 0 && (
                    <article className="comeback-guardian-bonus" aria-label="달빛 수호자 보너스">
                      <span>{offlineRewardSummary.guardianName}</span>
                      <strong>달빛 보상 +{Math.round(offlineRewardSummary.guardianBonusPercent * 100)}%</strong>
                      <small>밤 사이 모은 잎을 더 안전하게 지켜줬어요.</small>
                    </article>
                  )}
                  {offlineRewardSummary.shelfBonusPercent > 0 && (
                    <article className="comeback-guardian-bonus comeback-shelf-bonus" aria-label="온실 선반 보관 보너스">
                      <span>{offlineRewardSummary.shelfBonusLabel ?? "온실 선반 보관"}</span>
                      <strong>보관 보상 +{Math.round(offlineRewardSummary.shelfBonusPercent * 100)}%</strong>
                      <small>납품한 선반이 잎을 더 깔끔하게 모아줬어요.</small>
                    </article>
                  )}
                </div>
              ) : (
                <p className="comeback-next-copy">씨앗을 심고 생명체를 더 모으면 복귀 보상이 커집니다.</p>
              )}
              {comebackProductionTarget && (
                <article className="comeback-production-target" aria-label="복귀 다음 생산 목표">
                  <span>다음 생산 목표</span>
                  <strong>{comebackProductionTarget.title}</strong>
                  <small>{comebackProductionTarget.detail}</small>
                </article>
              )}
              <div className="comeback-reward-actions">
                {comebackProductionTarget && (
                  <button className="primary-action comeback-production-button" onClick={continueComebackProductionTarget} type="button">
                    보상 받고 {comebackProductionTarget.ctaLabel}
                  </button>
                )}
                {nextCreatureGoal && canBuyAndPlantComebackGoalSeed && (
                  <button className="primary-action" onClick={() => buyAndPlantComebackGoalSeed(nextCreatureGoal.seed)} type="button">
                    {nextCreatureGoal.seed.name} 구매하고 심기
                  </button>
                )}
                {nextCreatureGoal && canBuyComebackGoalSeed && (
                  <button
                    className={canBuyAndPlantComebackGoalSeed ? "comeback-dismiss-button" : "primary-action"}
                    onClick={() => buyComebackGoalSeed(nextCreatureGoal.seed)}
                    type="button"
                  >
                    {nextCreatureGoal.seed.name} 바로 구매
                  </button>
                )}
                {nextCreatureGoal && (
                  <button
                    className={canBuyComebackGoalSeed ? "comeback-dismiss-button" : "primary-action"}
                    onClick={() => {
                      setOfflineRewardSummary(null);
                      setActiveTab("seeds");
                    }}
                    type="button"
                  >
                    {nextCreatureGoal.seed.name} 보러가기
                  </button>
                )}
                <button className="comeback-dismiss-button" onClick={() => setOfflineRewardSummary(null)} type="button">
                  보상 확인
                </button>
              </div>
            </div>
          </section>
        )}

        <section aria-hidden={isPlayerTabScreen ? true : undefined} className="garden-panel" aria-label="정원">
          <GardenPlayfieldHost onAction={handlePlayfieldAction} playfieldAssets={playfieldAssets} viewModel={gardenViewModel} />

          {stageHeroCreature && (
            <section
              className={[
                "creature-stage-focus",
                creatureStageReaction > 0 ? "is-cared" : "",
                creatureStageReaction > 1 ? "is-clue" : "",
                showLunarCareMemoryReward ? "is-memory-reward" : ""
              ]
                .filter(Boolean)
                .join(" ")}
              data-stage-state={creatureStageState}
              aria-label="대표 생명체 무대"
            >
              <div className="creature-stage-floor-light" aria-hidden="true" />
              <div className="creature-stage-hero">
                <p className="panel-label">오늘의 온실 친구</p>
                <div className="creature-stage-portrait" aria-hidden="true">
                  <span className="creature-stage-eye-glint left" />
                  <span className="creature-stage-eye-glint right" />
                  <span className="creature-stage-sparkle sparkle-one" />
                  <span className="creature-stage-sparkle sparkle-two" />
                  <span className="creature-stage-sparkle sparkle-three" />
                  {renderAsset(stageHeroCreature.assetId, "생명체")}
                </div>
                <div className="creature-stage-shadow" aria-hidden="true" />
                <h2>{stageHeroCreature.name}</h2>
                <p>
                  {lunarCareMemoryClaimed
                    ? "반짝이는 흔적이 도감 기억 도장으로 남았어요. 누누가 다음 사진을 보러 가자고 손짓합니다."
                    : creatureStageReaction > 1
                    ? "젤리콩처럼 말랑한 발자국 끝에서 닫힌 씨앗이 톡톡 흔들립니다."
                    : creatureStageReaction > 0
                      ? `${stageHeroCreature.name}${getSubjectParticle(stageHeroCreature.name)} 눈을 뜨고 발밑의 반짝이는 흔적을 살펴요.`
                      : stageHeroCreature.greeting}
                </p>
              </div>
              <button
                className="creature-stage-care"
                onClick={careForStageCreature}
                type="button"
              >
                {stageCareButtonLabel}
              </button>
              {showLunarCareMemoryReward && (
                <div className="creature-care-reward" aria-label="달빛 돌보기 기억 보상">
                  <span className="care-memory-stamp">누누 돌봄 도장</span>
                  <strong>+{LUNAR_CARE_REWARD_LEAVES} 잎 기억 보상</strong>
                  <small>{lunarCareMemoryClaimed ? "도감 사진에 오늘 돌본 기록이 찍혔어요" : "돌보면 도감 기억으로 남아요"}</small>
                </div>
              )}
              {stageNextCreatureGoal && (
                <button
                  className="creature-stage-clue-trail"
                  onClick={() => setCreatureStageReaction((current) => Math.max(current + 1, 2))}
                  type="button"
                  aria-label={`${stageNextCreatureGoal.creature.name} 발자국 단서 따라가기`}
                >
                  <span className="creature-footprint footprint-one" aria-hidden="true" />
                  <span className="creature-footprint footprint-two" aria-hidden="true" />
                  <span className="creature-footprint footprint-three" aria-hidden="true" />
                  <span className="creature-footprint footprint-four" aria-hidden="true" />
                  <span className="creature-footprint footprint-five" aria-hidden="true" />
                  <span className="creature-stage-seed-pod" aria-hidden="true">
                    <span className="creature-stage-pod-glow" />
                    {renderAsset(stageNextCreatureGoal.seed.iconAssetId, "씨앗")}
                  </span>
                  <span className="creature-stage-trail-label">
                    <strong>{stageNextCreatureGoal.creature.name}</strong>
                    <small>젤리콩 발자국</small>
                  </span>
                </button>
              )}
            </section>
          )}

          <aside className={actionSurfaceClassName}>
            <p className="panel-label">다음 행동</p>
            <h2>{nextAction.title}</h2>
            <p className={activePlot ? "action-copy active-growth-copy" : "action-copy"}>{nextAction.body}</p>
            {productionStatus && productionStatus.ratePerMinute > 0 && (
              <article
                className={[
                  "production-card production-action-card",
                  productionStatus.workerCreatures.length > 1 ? "has-worker-roster" : "",
                  productionStatus.orderCompleted ? "has-completed-order" : "",
                  productionStatus.order.id === GREENHOUSE_ORDER.id ? "has-greenhouse-order" : "",
                  productionStatus.order.id === GREENHOUSE_ROUTE_SUPPLY_ORDER.id ? "has-route-supply-order" : "",
                  productionStatus.order.id === GREENHOUSE_IRRIGATION_ORDER.id ? "has-irrigation-order" : "",
                  productionStatus.order.id === GREENHOUSE_MIST_RETURN_ORDER.id ? "has-mist-return-order" : "",
                  productionStatus.order.id === LUNAR_GUARDIAN_ORDER.id ? "has-lunar-guardian-order" : "",
                  mistCondenserPayoffActive ? "has-mist-condenser-payoff" : "",
                  lunarGuardianOrderPayoffActive ? "has-lunar-guardian-payoff" : "",
                  productionClaimReceipt ? "has-production-claim-receipt" : "",
                  productionBoostReceipt ? "has-production-boost-receipt" : "",
                  researchUnlockReceipt ? "has-research-unlock-receipt" : "",
                  researchCompleteReceipt ? "has-research-complete-receipt" : "",
                  researchSeedReceipt ? "has-research-seed-receipt" : "",
                  orderDeliveryReceipt ? "has-order-dispatch-receipt" : "",
                  firstOrderDispatchReady ? "has-order-ready" : "",
                  save?.materialWorkbenchLevel ? "has-material-workbench" : ""
                ]
                  .filter(Boolean)
                  .join(" ")}
                aria-label="자동 생산과 첫 주문"
              >
                {productionFx ? renderProductionFx(productionFx) : null}
                <div className="production-card-heading">
                  <div className="production-scene">
                    <div
                      className={[
                        "production-asset production-asset-work",
                        productionStatus.primaryWorker?.family === "lunar" ? "production-asset-lunar-work" : ""
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      aria-hidden="true"
                    >
                      {renderAsset(productionStatus.primaryWorkAssetId, "작업")}
                    </div>
                    <div>
                      <p className="panel-label">자동 생산</p>
                      <strong>{productionStatus.workerLabel}</strong>
                      <small className="production-worker-detail">{productionStatus.workerDetail}</small>
                    </div>
                  </div>
                  <span className="production-card-rate">분당 {formatRatePerMinute(productionStatus.ratePerMinute)} 잎</span>
                </div>
                {productionStatus.workerCreatures.length > 1 && (
                  <div className="production-roster" aria-label="생산 동료 roster">
                    {productionStatus.workerCreatures.slice(0, 3).map((creature) => (
                      <div className="production-roster-chip" key={creature.id}>
                        <span className="production-roster-portrait" aria-hidden="true">
                          {renderAsset(creature.assetId, "동료")}
                        </span>
                        <span>
                          <strong>{creature.name}</strong>
                          <small>
                            {getCreatureRoleLabel(creature.role)} +{(getCreatureProductionRate(creature) * 60).toFixed(1)}/분
                          </small>
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="production-meter-row">
                  <span>생산 대기 {productionStatus.pendingLeaves} 잎</span>
                  <button disabled={productionStatus.pendingLeaves <= 0} onClick={claimProductionLeaves} type="button">
                    생산 잎 수령
                  </button>
                </div>
                {productionClaimReceipt && (
                  <div className="production-claim-receipt" aria-label="생산 잎 수령 작업 FX">
                    <span className="production-claim-chip">포리 작업 완료</span>
                    <strong>+{productionClaimReceipt.leaves} 잎 수령</strong>
                    <span>{productionClaimReceipt.orderTitle} {productionClaimReceipt.orderProgress}/{productionClaimReceipt.orderRequired}</span>
                    <small>잎 반짝임이 주문 상자로 이동</small>
                  </div>
                )}
                {productionBoostReceipt && (
                  <div className="production-boost-receipt" aria-label="작업 간식 강화 완료">
                    <span className="production-boost-chip">포리 간식 충전</span>
                    <strong>생산 +{productionBoostReceipt.bonusPercent}%</strong>
                    <span>분당 {formatRatePerMinute(productionBoostReceipt.previousRatePerMinute)} → {formatRatePerMinute(productionBoostReceipt.nextRatePerMinute)} 잎</span>
                    <small>다음 주문을 더 빨리 채워요</small>
                  </div>
                )}
                {researchUnlockReceipt && (
                  <div className="research-unlock-receipt" aria-label="연구 노트 열림">
                    <span className="research-unlock-chip">연구 노트 열림</span>
                    <strong>{researchUnlockReceipt.researchTitle}</strong>
                    <span>{researchUnlockReceipt.orderTitle} · {researchUnlockReceipt.rewardLabel}</span>
                    <small>다음 생명체 단서를 기록할 수 있어요</small>
                  </div>
                )}
                {researchCompleteReceipt && (
                  <div className="research-complete-receipt" aria-label="도감 단서 기록">
                    <span className="research-complete-chip">연구 완료</span>
                    <strong>{researchCompleteReceipt.seedName} 단서 저장</strong>
                    <span>{researchCompleteReceipt.clueLabel}</span>
                    <small>{researchCompleteReceipt.creatureName} 목표가 도감과 씨앗 탭에 연결됐어요</small>
                  </div>
                )}
                {researchSeedReceipt && (
                  <div className="research-seed-receipt" aria-label="연구 단서 씨앗 심기">
                    <span className="research-seed-chip">연구 단서 씨앗</span>
                    <strong>{researchSeedReceipt.seedName} {researchSeedReceipt.actionLabel}</strong>
                    <span>{researchSeedReceipt.clueLabel}</span>
                    <small>{researchSeedReceipt.creatureName}을 만날 밭으로 연결됐어요</small>
                  </div>
                )}
                {orderDeliveryReceipt && (
                  <div className="order-dispatch-receipt" aria-label="주문 상자 출하 완료">
                    <span className="order-dispatch-chip">상자 출하 완료</span>
                    <strong>{orderDeliveryReceipt.title}</strong>
                    <span>{orderDeliveryReceipt.rewardLabel} 수거</span>
                    <small>다음 주문: {orderDeliveryReceipt.nextOrderTitle}</small>
                  </div>
                )}
                {productionStatus.orderCompleted ? (
                  <div
                    className={[
                      "production-complete-row",
                      mistCondenserPayoffActive ? "mist-condenser-complete-row" : "",
                      lunarGuardianOrderPayoffActive ? "lunar-guardian-complete-row" : ""
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    aria-label={`${productionStatus.order.title} 납품 완료`}
                  >
                    <div className="production-asset production-asset-celebrate" aria-hidden="true">
                      {renderAsset("creature_herb_common_001_celebrate", "완료")}
                    </div>
                    <div className="production-complete-copy">
                      <span>{productionStatus.order.title} 완료</span>
                      <strong>{formatOrderReward(productionStatus.order)}</strong>
                      {mistCondenserPayoffActive && (
                        <div className="mist-condenser-payoff" aria-label="물안개 응축 보상 상태">
                          <span>응축기 가동</span>
                          <strong>달빛 온실 단서 +1</strong>
                          <small>다음 온실 원정 준비</small>
                        </div>
                      )}
                      {lunarGuardianOrderPayoffActive && (
                        <div className="lunar-guardian-payoff" aria-label="달빛 보호 주문 보상 상태">
                          <span>누누 야간 근무</span>
                          <strong>달빛 보상 재료 +1</strong>
                          <small>다음 달빛 씨앗 연구 준비</small>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div
                    className={[
                      "order-progress-card",
                      firstOrderDispatchReady ? "order-progress-ready" : "",
                      productionStatus.order.id === LUNAR_GUARDIAN_ORDER.id ? "order-progress-lunar-guardian" : ""
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <div className="order-progress-main">
                      <div
                        className={[
                          "production-asset production-asset-crate",
                          productionStatus.order.id === LUNAR_GUARDIAN_ORDER.id ? "production-asset-lunar-crate" : ""
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        aria-hidden="true"
                      >
                        {renderAsset("ui_order_crate_leaf_001", "주문")}
                      </div>
                      <div>
                        <p className="panel-label">{productionStatus.order.customer}</p>
                        <strong>{productionStatus.order.title}</strong>
                        <span>
                          {productionStatus.orderProgress}/{productionStatus.order.requiredLeaves} 잎
                          {firstOrderDispatchReady ? " · 출하 준비" : " 납품 준비"}
                        </span>
                        {firstOrderDispatchReady && (
                          <small className="order-dispatch-readiness">상자 봉인 완료 · 납품하면 보상 수거</small>
                        )}
                      </div>
                    </div>
                    <progress max={productionStatus.order.requiredLeaves} value={productionStatus.orderProgress} />
                    <button disabled={!productionStatus.orderReady} onClick={deliverFirstOrder} type="button">
                      {getOrderDeliveryCta(productionStatus.order)} {formatOrderReward(productionStatus.order)}
                    </button>
                  </div>
                )}
              </article>
            )}
            {upgradeChoices.length > 0 && (
              <article className="upgrade-choice-card" aria-label="다음 성장 선택">
                <div className="upgrade-choice-heading">
                  <p className="panel-label">다음 성장 선택</p>
                  <strong>생산 보상을 어디에 쓸까요?</strong>
                </div>
                <div className="upgrade-choice-list">
                  {upgradeChoices.map((choice) => (
                    <button
                      className={`upgrade-choice upgrade-choice-${choice.tone} upgrade-choice-${choice.id}`}
                      disabled={!choice.onSelect}
                      key={choice.id}
                      onClick={choice.onSelect}
                      type="button"
                    >
                      <span>{choice.status}</span>
                      <strong>{choice.title}</strong>
                      <small>{choice.detail}</small>
                    </button>
                  ))}
                </div>
              </article>
            )}
            {nextCreatureGoal && (
              <article className="next-creature-card next-creature-compact" aria-label="다음 생명체 수집 목표">
                <div className="next-creature-portrait">{renderAsset(nextCreatureGoal.creature.assetId, "?")}</div>
                <div>
                  <p className="panel-label">다음에 만날 아이</p>
                  <div className="next-creature-title-line">
                    <strong>{nextCreatureGoal.creature.name}</strong>
                    <span className="next-creature-trait-line">
                      {getRarityLabel(nextCreatureGoal.creature.rarity)} · {getCreatureFamilyLabel(nextCreatureGoal.creature.family)}
                    </span>
                  </div>
                  <span>힌트: {nextCreatureGoal.creature.albumHint}</span>
                  {researchClue && <span className="research-clue-line">연구 단서: {researchClue}</span>}
                  {researchGrowthPreview && <span className="research-growth-preview-line">수확 예고: {researchGrowthPreview}</span>}
                  <small>
                    {nextCreatureGoal.seed.name}에서 만날 수 있어요 · 도감 {nextCreatureGoal.discoveredCount}/{nextCreatureGoal.totalCount}
                  </small>
                </div>
              </article>
            )}
            <div className="garden-support-stack">
              {!save?.selectedStarterSeedId &&
                starterSeeds.map((seed) => (
                  <button className="seed-row" key={seed.id} onClick={() => selectStarter(seed)} type="button">
                    {renderAsset(seed.iconAssetId, "씨앗")}
                    <span>{seed.name}</span>
                    <strong>{seed.baseGrowthSeconds}s</strong>
                  </button>
                ))}
              {save && showSeedShop && (
                <article className="garden-action-dock" aria-label="정원 빠른 행동">
                  <div>
                    <p className="panel-label">씨앗 행동</p>
                    <strong>{hasOpenPlot ? "열린 밭에 다음 씨앗을 심어보세요" : "밭이 가득 찼어요"}</strong>
                    <span>씨앗 구매와 보유 목록은 씨앗 탭에서 정리해 볼 수 있어요.</span>
                  </div>
                  <button onClick={() => setActiveTab("seeds")} type="button">
                    씨앗 탭 열기
                  </button>
                </article>
              )}
              {activePlot && <p className="hint">밭을 누르면 성장이 빨라지고, 100%가 되면 수확합니다.</p>}
              {firstOwnedCreature && (
                <article className="ownership-card" aria-label="첫 생명체 소유 증거">
                  <div className="ownership-portrait">{renderAsset(firstOwnedCreature.assetId, "생명체")}</div>
                  <div>
                    <p className="panel-label">내 첫 생명체</p>
                    <strong>{firstOwnedCreature.name}</strong>
                    <span>{getCreatureRoleLabel(firstOwnedCreature.role)} · {firstOwnedCreature.albumHint}</span>
                    <p className="creature-personality">{firstOwnedCreature.personality}</p>
                    <small>좋아하는 것: {firstOwnedCreature.favoriteThing}</small>
                  </div>
                </article>
              )}
              {firstAlbumRewardReady && (
                <button className="primary-action" onClick={claimAlbumReward} type="button">
                  첫 도감 보상 받기 +25 잎
                </button>
              )}
              {(!productionStatus || productionStatus.ratePerMinute <= 0) && (
                <button
                  className="primary-action"
                  disabled={!save || save.plotCount >= 2 || save.leaves < FIRST_UPGRADE_COST}
                  onClick={buyFirstUpgrade}
                  type="button"
                >
                  두 번째 밭 열기 {FIRST_UPGRADE_COST} 잎
                </button>
              )}
            </div>
          </aside>
        </section>

        {showSidePanel && (
          <section
            className={["dev-panel", showDebugPanel ? "debug-panel" : "player-panel", `tab-${activeTab}`]
              .filter(Boolean)
              .join(" ")}
            aria-label={showDebugPanel ? "디버그 및 탭 정보" : "모바일 게임 탭 화면"}
          >
            <header className="tab-screen-header">
              <div>
                <p className="panel-label">{showDebugPanel ? "Debug surface" : "게임 화면"}</p>
                <h2>{MAIN_TABS.find((tab) => tab.id === activeTab)?.label}</h2>
              </div>
              {!showDebugPanel && activeTab !== "garden" && (
                <button className="tab-screen-return" onClick={() => setActiveTab("garden")} type="button">
                  정원 보기
                </button>
              )}
            </header>
            {showDebugPanel && (
              <ul className="status-list">
                <li>asset {manifest ? Object.keys(manifest.assets).length : "loading"}</li>
                <li>save {save ? "ready" : "loading"}</li>
                <li>events {readEvents().length}</li>
                <li>runtime image generation disabled</li>
              </ul>
            )}

            {showDebugPanel && activeTab === "garden" && (
            <section className="tab-panel mission-board" aria-label="정원 미션">
              <h3>오늘의 의뢰</h3>
              <div className="mission-list">
                {visibleMissions.map((mission) => {
                  const progress = Math.min(save?.missionProgress[mission.id] ?? 0, mission.target);
                  const ready = progress >= mission.target;
                  const claimed = save?.claimedMissionIds.includes(mission.id) ?? false;

                  return (
                    <article className={claimed ? "mission-row mission-claimed" : "mission-row"} key={mission.id}>
                      <div>
                        <span>{mission.type === "tutorial" ? "튜토리얼" : "일일"}</span>
                        <strong>{mission.label}</strong>
                        <progress max={mission.target} value={progress} />
                      </div>
                      <button disabled={!ready || claimed} onClick={() => claimMissionReward(mission)} type="button">
                        {claimed ? "완료" : `+${mission.rewardLeaves} 잎`}
                      </button>
                    </article>
                  );
                })}
              </div>
            </section>
          )}

          {activeTab === "seeds" && (
            <section className="tab-panel seed-inventory-panel" aria-label="씨앗 주머니">
              <header className="tab-section-heading">
                <div>
                  <p className="panel-label">씨앗 보관함</p>
                  <h3>씨앗 주머니</h3>
                </div>
                <span className="tab-section-chip">보유 {totalOwnedSeeds}개</span>
              </header>
              {nextCreatureGoal && (
                <article className="seed-goal-banner" aria-label="다음 도감 목표 씨앗">
                  {renderAsset(getSeedIconAssetId(nextCreatureGoal.seed, save), "씨앗")}
                  <div>
                    <p className="panel-label">도감 목표 씨앗</p>
                    <strong>{nextCreatureGoal.seed.name}</strong>
                    <span>
                      {getRarityLabel(nextCreatureGoal.creature.rarity)} · {nextCreatureGoal.creature.name}
                      {getObjectParticle(nextCreatureGoal.creature.name)} 만날 차례예요.
                    </span>
                    {lunarRewardSourceLabel && nextCreatureGoal.seed.id === LUNAR_REWARD_SEED_ID && (
                      <span className="lunar-source-line">온실 단서 source: {lunarRewardSourceLabel}</span>
                    )}
                    {researchClue && <span className="research-clue-line">연구 단서: {researchClue}</span>}
                    <button className="seed-goal-action-button" onClick={() => setActiveTab("garden")} type="button">
                      정원에서 심기
                    </button>
                  </div>
                </article>
              )}
              <div className="seed-inventory-list">
                {seedInventorySeeds.map((seed) => {
                  const owned = save?.seedInventory[seed.id] ?? 0;
                  const costLeaves = getSeedPurchaseCost(seed);
                  const currentLeaves = save?.leaves ?? 0;
                  const leafShortfall = Math.max(0, costLeaves - currentLeaves);
                  const previewCreature = getDeterministicCreatureForSeed(seed);
                  const previewDiscovered = previewCreature ? (save?.discoveredCreatureIds.includes(previewCreature.id) ?? false) : false;
                  const targetSeed = seed.id === nextCreatureGoal?.seed.id;
                  const targetSeedStatus = targetSeed ? getTargetSeedStatus(seed, owned, hasOpenPlot, leafShortfall) : null;

                  return (
                    <article className={targetSeed ? "seed-inventory-row seed-inventory-row-target seed-shop-row-target" : "seed-inventory-row"} key={seed.id}>
                      {renderAsset(getSeedIconAssetId(seed, save), "씨앗")}
                      <div>
                        <strong>{seed.name}</strong>
                        <span>보유 {owned}개 · {getSeedHarvestSummary(seed)}</span>
                        {targetSeed && <span className="seed-target-badge">다음 발견</span>}
                        {targetSeedStatus && <span className="seed-target-status-line">{targetSeedStatus}</span>}
                        {targetSeed && researchClue && <span className="research-clue-line">연구 단서: {researchClue}</span>}
                        {leafShortfall > 0 && <span className="seed-shortfall-note">{leafShortfall} 잎 더 모으면 구매 가능</span>}
                        {previewCreature && (
                          <small className="seed-creature-preview">
                            만날 아이: {previewCreature.name} · {previewDiscovered ? "발견함" : "미발견"}
                          </small>
                        )}
                      </div>
                      <div className="seed-row-actions">
                        <button disabled={!save || save.leaves < costLeaves} onClick={() => buySeed(seed)} type="button">
                          {leafShortfall > 0 ? `${leafShortfall} 잎 부족` : `구매 ${costLeaves}`}
                        </button>
                        <button disabled={owned <= 0 || !hasOpenPlot} onClick={() => plantOwnedSeed(seed)} type="button">
                          심기
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          )}

          {activeTab === "album" && (
            <section className="tab-panel album-strip" aria-label="도감">
              {researchAlbumRecord && researchAlbumRecordCreature && (
                <article className="album-new-record-card" aria-label="새 단서 기록">
                  <div className="album-new-record-portrait" aria-hidden="true">
                    {renderAsset(researchAlbumRecordCreature.assetId, "생명체")}
                  </div>
                  <div className="album-new-record-copy">
                    <p className="panel-label">도감 기록 저장</p>
                    <h3>{researchAlbumRecord.creatureName}</h3>
                    <p>{researchAlbumRecord.seedName}에서 찾은 연구 단서가 새 기억으로 붙었어요.</p>
                    <small>{researchAlbumRecord.clueLabel}</small>
                    {nextCreatureGoal && (
                      <button className="album-memory-secondary" onClick={() => setActiveTab("seeds")} type="button">
                        다음 씨앗 목표: {nextCreatureGoal.creature.name}
                      </button>
                    )}
                  </div>
                </article>
              )}
              {albumFeaturedCreature ? (
                <article
                  className={albumMemoryVariant ? "album-memory-feature is-memory-variant" : "album-memory-feature"}
                  aria-label="도감 대표 생명체 기록"
                >
                  <div className="album-memory-photo" aria-hidden="true">
                    <span className="album-page-ribbon">기록 {String((albumMemoryPage % 3) + 1).padStart(2, "0")}</span>
                    <span className="album-memory-stamp">seed shop</span>
                    {albumCareMemoryActive && <span className="album-care-stamp">누누 돌봄 도장</span>}
                    <span className="album-photo-shimmer" />
                    <div className="album-memory-portrait">{renderAsset(albumFeaturedCreature.assetId, "생명체")}</div>
                  </div>
                  <div className="album-memory-copy">
                    <p className="panel-label">오늘의 표정 photo</p>
                    <h3>{albumFeaturedCreature.name}</h3>
                    <p>{albumMemoryCopy}</p>
                    <small>{albumMemoryNote}</small>
                    {albumCareMemoryActive && (
                      <span className="album-care-memory-note" aria-label="도감 돌봄 기억 도장">
                        {albumCareMemoryLabel}
                      </span>
                    )}
                    <div className="album-memory-actions">
                      <button onClick={() => setAlbumMemoryPage((current) => current + 1)} type="button">
                        기록 넘기기
                      </button>
                      {albumClueCreatures.length > 0 && (
                        <button className="album-memory-secondary" onClick={focusAlbumClues} type="button">
                          단서 보기
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              ) : (
                <p>아직 없습니다. 씨앗을 키워 첫 생명체를 수확하세요.</p>
              )}
              <div className="album-status-strip" aria-label="도감 보조 진행 정보">
                <span>{albumDiscoveredCount}마리 발견</span>
                <span>
                  {nextAlbumMilestone
                    ? nextAlbumRewardRemaining > 0
                      ? `다음 보상까지 ${nextAlbumRewardRemaining}마리`
                      : "도감 보상 준비"
                    : "도감 보상 완료"}
                </span>
                <span>{albumCareMemoryActive ? "돌봄 도장 완료" : albumFeaturedCreature ? `${albumFeaturedCreature.name} 기록` : "첫 기록 대기"}</span>
              </div>
              {nextAlbumMilestone && (
                <article className="album-reward-preview" aria-label="다음 도감 보상">
                  <div>
                    <p className="panel-label">다음 도감 보상</p>
                    <strong>
                      발견 {albumDiscoveredCount}/{nextAlbumMilestone.requiredDiscoveries}
                    </strong>
                    <span>
                      {nextAlbumRewardRemaining > 0 ? `${nextAlbumRewardRemaining}마리 더 발견하면` : "보상 준비됨"} · +{nextAlbumMilestone.leaves} 잎
                      {nextAlbumMilestone.pollen > 0 ? ` · +${nextAlbumMilestone.pollen} 꽃가루` : ""}
                    </span>
                  </div>
                  <span className="album-reward-chip">수집 보상 예고</span>
                </article>
              )}
              {albumClueCreatures.length > 0 && (
                <section className="album-clue-focus" ref={albumClueFocusRef} aria-label="도감 단서 사진">
                  <div className="album-clue-heading">
                    <strong>다음에 만날 아이들</strong>
                    <span>보상보다 먼저, 흔적을 봅니다</span>
                  </div>
                  <div className="album-clue-polaroids">
                    {albumClueCreatures.map((creature, index) => {
                      const isNextGoal = creature.id === nextCreatureGoal?.creature.id;
                      const seedHint = getSeedHintForCreature(creature);

                      return (
                        <button
                          aria-label={`${getAlbumClueLabel(creature, index)} 단서, ${seedHint} 보러가기`}
                          className={isNextGoal ? "album-clue-polaroid is-next" : "album-clue-polaroid"}
                          key={creature.id}
                          onClick={() => setActiveTab("seeds")}
                          type="button"
                        >
                          <span className={`album-clue-photo clue-${creature.family}`} aria-hidden="true">
                            {renderAsset(creature.assetId, "단서")}
                          </span>
                          <strong>{getAlbumClueLabel(creature, index)}</strong>
                          <small>{getAlbumClueCopy(creature, seedHint, index)}</small>
                          <span className="album-clue-action-text">씨앗 보러가기</span>
                        </button>
                      );
                    })}
                  </div>
                </section>
              )}
              {nextCreatureGoal && (
                <button
                  aria-label={`다음 발견 목표 ${nextCreatureGoal.creature.name}, ${nextCreatureGoal.seed.name} 씨앗 보러가기`}
                  className="album-next-action-chip album-next-action-chip-legacy-bridge"
                  onClick={() => setActiveTab("seeds")}
                  type="button"
                >
                  <span>다음 발견</span>
                  <strong>{nextCreatureGoal.creature.name}</strong>
                  <small>
                    {getRarityLabel(nextCreatureGoal.creature.rarity)} · {nextCreatureGoal.seed.name} 단서 · 씨앗 보러가기
                  </small>
                </button>
              )}
              <header className="tab-section-heading album-grid-heading">
                <div>
                  <p className="panel-label">수집 도감</p>
                  <h3>발견한 생명체</h3>
                </div>
                <span className="tab-section-chip">{albumDiscoveredCount}/{content.creatures.length}</span>
              </header>
              <p className="album-progress-copy">미발견 슬롯의 단서를 따라 씨앗을 심고 도감 칸을 채워보세요.</p>
              <div className="creature-list album-grid">
                {content.creatures.map((creature) => {
                  const discovered = discoveredCreatureIds.has(creature.id);
                  const seedHint = getSeedHintForCreature(creature);
                  const isNextGoal = creature.id === nextCreatureGoal?.creature.id;

                  return (
                    <figure
                      className={[
                        discovered ? "album-slot" : "album-slot album-slot-locked",
                        isNextGoal ? "album-slot-next-goal" : "",
                        researchAlbumRecord?.creatureId === creature.id ? "album-slot-new-record" : ""
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      key={creature.id}
                    >
                      {isNextGoal && !discovered ? <span className="album-target-badge">다음 후보</span> : null}
                      {discovered ? (
                        renderAsset(creature.assetId, "생명체")
                      ) : (
                        <span className="album-silhouette" aria-hidden="true">
                          ?
                        </span>
                      )}
                      <figcaption>{discovered ? creature.name : getAlbumClueLabel(creature, 0)}</figcaption>
                      <small>
                        {discovered
                          ? `${getCreatureRoleLabel(creature.role)} · ${creature.personality}`
                          : `${getRarityLabel(creature.rarity)} · ${getCreatureFamilyLabel(creature.family)} · ${seedHint}`}
                      </small>
                      {!discovered && <span className="album-lock-note">미발견 슬롯</span>}
                    </figure>
                  );
                })}
              </div>
              {nextCreatureGoal && (
                <article className="album-next-goal" aria-label="도감 다음 수집 목표">
                  <div className="next-creature-portrait">{renderAsset(nextCreatureGoal.creature.assetId, "?")}</div>
                  <div>
                    <p className="panel-label">다음 도감 칸</p>
                    <strong>{nextCreatureGoal.creature.name}</strong>
                    <span>{nextCreatureGoal.creature.albumHint}</span>
                    {lunarRewardSourceLabel && nextCreatureGoal.seed.id === LUNAR_REWARD_SEED_ID && (
                      <span className="lunar-source-line">온실 단서 source: {lunarRewardSourceLabel}</span>
                    )}
                    <small>{nextCreatureGoal.seed.name}을 심어 만나보세요.</small>
                    <button className="goal-link-button" onClick={() => setActiveTab("seeds")} type="button">
                      {nextCreatureGoal.seed.name} 보러가기
                    </button>
                  </div>
                </article>
              )}
            </section>
          )}

          {activeTab === "expedition" && (
            <section className="tab-panel expedition-card" aria-label="원정">
              <header className="tab-section-heading">
                <div>
                  <p className="panel-label">원정 준비소</p>
                  <h3>원정</h3>
                </div>
                <span className="tab-section-chip">
                  {save?.activeExpedition
                    ? expeditionReady
                      ? "완료"
                      : "진행 중"
                    : hasGreenhouseLunarClue
                      ? "온실 단서"
                    : expeditionNeedsMoreCreatures
                      ? `${expeditionCreatureShortfall}마리 필요`
                      : "시작 가능"}
                </span>
              </header>
              {firstExpedition && (
                <article className="expedition-preview" aria-label="첫 원정 보상 미리보기">
                  <div>
                    <p className="panel-label">첫 원정</p>
                    <strong>{firstExpedition.name}</strong>
                    <span>
                      {getExpeditionDurationLabel(firstExpedition.durationSeconds)} · 생명체 {firstExpedition.requiredCreatures}마리 필요 ·{" "}
                      {getExpeditionRewardSummary(firstExpedition)}
                    </span>
                  </div>
                  <span className="expedition-reward-chip">원정 보상 예고</span>
                </article>
              )}
              {showResearchExpeditionClue && researchExpedition && (
                <article className="expedition-preview research-expedition-preview" aria-label="연구 완료 후 원정 단서">
                  <div>
                    <p className="panel-label">연구 원정 단서</p>
                    <strong>{researchExpedition.name}</strong>
                    <span>
                      {getExpeditionDurationLabel(researchExpedition.durationSeconds)} · 생명체 {researchExpedition.requiredCreatures}마리 필요 ·{" "}
                      {getExpeditionRewardSummary(researchExpedition)}
                    </span>
                    <small>
                      {researchExpeditionShortfall > 0
                        ? `${researchExpeditionShortfall}마리 더 발견하면 달빛 계열 단서를 추적할 수 있어요.`
                        : "연구 기록으로 새 원정 준비가 끝났어요."}
                    </small>
                    {researchExpeditionShortfall === 0 && (
                      <button className="research-expedition-action" onClick={() => startExpedition(researchExpedition.id, "research")} type="button">
                        {researchExpedition.name} 시작
                      </button>
                    )}
                  </div>
                  <span className="expedition-reward-chip">연구 단서</span>
                </article>
              )}
              {hasGreenhouseLunarClue && greenhouseLunarExpedition && (
                <article className="expedition-preview greenhouse-lunar-clue-preview" aria-label="달빛 온실 조사 단서">
                  <div>
                    <p className="panel-label">온실 원정 단서</p>
                    <strong>달빛 온실 조사</strong>
                    <span>
                      {getExpeditionDurationLabel(greenhouseLunarExpedition.durationSeconds)} · 생명체{" "}
                      {greenhouseLunarExpedition.requiredCreatures}마리 필요 · {getExpeditionRewardSummary(greenhouseLunarExpedition)}
                    </span>
                    <small>
                      {greenhouseLunarExpeditionShortfall > 0
                        ? `${greenhouseLunarExpeditionShortfall}마리 더 발견하면 응축기 단서를 따라갈 수 있어요.`
                        : "응축기에서 모은 달빛 단서로 원정 준비가 끝났어요."}
                    </small>
                    {greenhouseLunarExpeditionShortfall === 0 && (
                      <button
                        className="research-expedition-action greenhouse-lunar-clue-action"
                        onClick={() => startExpedition(greenhouseLunarExpedition.id, "greenhouse_mist")}
                        type="button"
                      >
                        달빛 온실 조사 시작
                      </button>
                    )}
                  </div>
                  <span className="expedition-reward-chip">온실 단서</span>
                </article>
              )}
              {!save?.activeExpedition && firstExpedition && !hasGreenhouseLunarClue && (
                <p
                  className={
                    expeditionNeedsMoreCreatures
                      ? "expedition-unlock-note"
                      : "expedition-unlock-note expedition-unlock-note-ready"
                  }
                >
                  {!save
                    ? "정원 기록을 불러오고 있어요."
                    : expeditionNeedsMoreCreatures
                      ? `${expeditionCreatureShortfall}마리 더 발견하면 ${firstExpedition.name}을 시작할 수 있어요.`
                      : "생명체가 원정을 기다리고 있어요."}
                </p>
              )}
              {!save?.activeExpedition && !hasGreenhouseLunarClue && (
                <button
                  className="primary-action"
                  disabled={!save || save.discoveredCreatureIds.length === 0}
                  onClick={() => startExpedition()}
                  type="button"
                >
                  틈새길 정찰 시작
                </button>
              )}
              {save?.activeExpedition && (
                <>
                  <p className="expedition-progress-status">{expeditionReady ? "원정 완료" : "원정 진행 중"}</p>
                  <small className="expedition-progress-note">
                    {expeditionReady
                      ? `${activeExpeditionDefinition ? getExpeditionRewardSummary(activeExpeditionDefinition) : "보상"} 수령 가능`
                      : `${getExpeditionDurationLabel(expeditionRemainingSeconds)} 남음 · 돌아오면 보상 수령`}
                  </small>
                  <button className="primary-action" disabled={!expeditionReady} onClick={claimExpedition} type="button">
                    원정 보상 받기
                  </button>
                </>
              )}
              {!save?.activeExpedition && researchExpeditionRewardClaimed && lunarExpeditionGoal && (
                <article
                  className={lunarRewardSourceLabel ? "expedition-preview lunar-expedition-reward greenhouse-lunar-reward" : "expedition-preview lunar-expedition-reward"}
                  aria-label="달빛 원정 보상 다음 목표"
                >
                  <div>
                    <p className="panel-label">{lunarRewardSourceLabel ? "달빛 온실 조사 보상" : "달빛 원정 보상"}</p>
                    <strong>{lunarExpeditionGoal.seed.name}</strong>
                    <span>
                      {lunarExpeditionGoal.creature.name} 단서 해금 · {getRarityLabel(lunarExpeditionGoal.creature.rarity)} ·{" "}
                      {getCreatureFamilyLabel(lunarExpeditionGoal.creature.family)}
                    </span>
                    {lunarRewardSourceLabel && <span className="lunar-source-line">{lunarRewardSourceLabel}</span>}
                    <small>{lunarExpeditionGoal.creature.albumHint}</small>
                    <button className="research-expedition-action" onClick={() => setActiveTab("seeds")} type="button">
                      {lunarExpeditionGoal.seed.name} 보러가기
                    </button>
                  </div>
                  <span className="expedition-reward-chip">다음 수집</span>
                </article>
              )}
            </section>
          )}

          {activeTab === "shop" && (
            <section className="tab-panel shop-panel" aria-label="상점">
              <header className="tab-section-heading">
                <div>
                  <p className="panel-label">모의 상점</p>
                  <h3>상점</h3>
                </div>
                <span className="tab-section-chip">결제 없음</span>
              </header>
              <div className="shop-list">
                {content.shopSurfaces.map((surface) => (
                  <article className="shop-card" key={surface.id}>
                    {renderAsset(surface.assetId, "상품")}
                    <div>
                      <strong>{surface.name}</strong>
                      <span>{getShopSurfaceDescription(surface.id)}</span>
                      <small className="mock-shop-chip">{surface.realPayment ? "결제 준비 중" : "실제 결제 없음"}</small>
                    </div>
                    <button
                      onClick={() => trackEvent("shop_surface_clicked", { surfaceId: surface.id, realPayment: surface.realPayment })}
                      type="button"
                    >
                      {surface.cta}
                    </button>
                  </article>
                ))}
              </div>
            </section>
          )}
            {manifestError && <p className="error-text">{manifestError}</p>}
          </section>
        )}
        <nav className="bottom-tabs" aria-label="주요 화면">
          {MAIN_TABS.map((tab) => {
            const albumProgressBadge =
              tab.id === "album" && save ? `${albumDiscoveredCount}/${content.creatures.length}` : null;
            const expeditionStatusBadge =
              tab.id === "expedition" && save?.activeExpedition
                ? expeditionReady
                  ? "완료"
                  : "진행"
                : tab.id === "expedition" && showResearchExpeditionClue
                  ? researchExpeditionShortfall === 0
                    ? "준비"
                    : "단서"
                  : tab.id === "expedition" && hasGreenhouseLunarClue
                    ? "온실"
                  : null;

            return (
              <button
                aria-pressed={activeTab === tab.id}
                className={activeTab === tab.id ? "tab-active" : undefined}
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                type="button"
              >
                <span className="tab-label">{tab.label}</span>
                {albumProgressBadge && (
                  <span aria-label={`도감 진행 ${albumProgressBadge}`} className="tab-progress-badge">
                    {albumProgressBadge}
                  </span>
                )}
                {expeditionStatusBadge && (
                  <span aria-label={`원정 상태 ${expeditionStatusBadge}`} className="tab-progress-badge">
                    {expeditionStatusBadge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </section>

      {harvestReveal && (
        <section
          className="harvest-reveal"
          aria-live="polite"
          aria-label={researchHarvestReceipt ? "단서 생명체 발견" : "첫 생명체 획득"}
        >
          <div className={`harvest-reveal-card${researchHarvestReceipt ? " is-research-reveal" : ""}`}>
            <div className="reveal-sparkles" aria-hidden="true">
              <span>✦</span>
              <span>✧</span>
              <span>✦</span>
            </div>
            <p className="reveal-kicker">{researchHarvestReceipt ? "단서 생명체 발견" : "도감 첫 발견"}</p>
            <div className="harvest-portrait-frame">{renderAsset(harvestReveal.assetId, "생명체")}</div>
            <p className="panel-label reveal-label">
              {researchHarvestReceipt ? "도감 단서 기록" : "새 생명체가 찾아왔어요"}
            </p>
            <h2>{harvestReveal.name}</h2>
            <div className="reveal-trait-row" aria-label="생명체 특징">
              <span>{getCreatureRoleLabel(harvestReveal.role)}</span>
              <span>{getRarityLabel(harvestReveal.rarity)}</span>
              <span>{getCreatureFamilyLabel(harvestReveal.family)}</span>
            </div>
            <p className="reveal-flavor">{harvestReveal.albumHint}</p>
            <blockquote>“{harvestReveal.greeting}”</blockquote>
            {researchHarvestReceipt && (
              <article className="reveal-next-goal research-harvest-receipt" aria-label="도감 단서 기록">
                <p className="panel-label">연구 단서 수확</p>
                <strong>{researchHarvestReceipt.seedName} → {researchHarvestReceipt.creatureName}</strong>
                <span>{researchHarvestReceipt.clueLabel}</span>
              </article>
            )}
            {harvestReveal.id === LUNAR_REWARD_CREATURE_ID && (
              <article className="reveal-next-goal reveal-lunar-complete" aria-label="달빛 수집 완료">
                <p className="panel-label">달빛 원정 수집 완료</p>
                <strong>{harvestReveal.name} 도감 기록</strong>
                <span>원정 보상이 실제 새 생명체 수집으로 이어졌어요.</span>
              </article>
            )}
            {nextCreatureGoal && (
              <article className="reveal-next-goal" aria-label="수확 후 다음 목표">
                <p className="panel-label">다음 발견 예고</p>
                <strong>{nextCreatureGoal.creature.name}</strong>
                <span>{nextCreatureGoal.seed.name}을 심으면 만날 수 있어요.</span>
              </article>
            )}
            <button className="primary-action reveal-cta" onClick={recordHarvestRevealToAlbum} type="button">
              도감에 기록하기
            </button>
          </div>
        </section>
      )}

    </main>
  );
}

function getNextAlbumMilestone(discoveredCount: number, claimedMilestoneIds: string[]): AlbumMilestone | null {
  const milestones = content.rewards.albumMilestones as AlbumMilestone[];
  return milestones.find((milestone) => !claimedMilestoneIds.includes(milestone.id) || discoveredCount < milestone.requiredDiscoveries) ?? null;
}

function getNextCreatureGoal(save: PlayerSave | null): NextCreatureGoal | null {
  if (!save || save.discoveredCreatureIds.length === 0) {
    return null;
  }

  const discovered = new Set(save.discoveredCreatureIds);
  const lunarGoal = getLunarExpeditionGoal(save);
  if (lunarGoal && !discovered.has(lunarGoal.creature.id)) {
    return lunarGoal;
  }

  const seed = content.seeds.find((candidate) => {
    const deterministicCreature = getDeterministicCreatureForSeed(candidate);
    return save.unlockedSeedIds.includes(candidate.id) && deterministicCreature && !discovered.has(deterministicCreature.id);
  });
  const creature = seed ? getDeterministicCreatureForSeed(seed) : undefined;

  if (!seed || !creature) {
    return null;
  }

  return {
    seed,
    creature,
    discoveredCount: save.discoveredCreatureIds.length,
    totalCount: content.creatures.length
  };
}

function getStageHeroCreature(
  save: PlayerSave | null,
  fallbackCreature: CreatureDefinition | undefined
): CreatureDefinition | undefined {
  if (!save || !save.discoveredCreatureIds.includes(LUNAR_REWARD_CREATURE_ID)) {
    return undefined;
  }

  return getCreature(LUNAR_REWARD_CREATURE_ID) ?? fallbackCreature;
}

function getStageNextCreatureGoal(save: PlayerSave | null, nextCreatureGoal: NextCreatureGoal | null): NextCreatureGoal | null {
  if (nextCreatureGoal) {
    return nextCreatureGoal;
  }

  if (!save || save.discoveredCreatureIds.includes("creature_candy_common_001")) {
    return null;
  }

  const seed = getSeed("seed_candy_001");
  const creature = getCreature("creature_candy_common_001");
  if (!seed || !creature) {
    return null;
  }

  return {
    seed,
    creature,
    discoveredCount: save.discoveredCreatureIds.length,
    totalCount: content.creatures.length
  };
}

function getLunarExpeditionGoal(save: PlayerSave | null): NextCreatureGoal | null {
  if (!save || !save.unlockedSeedIds.includes(LUNAR_REWARD_SEED_ID)) {
    return null;
  }

  const seed = getSeed(LUNAR_REWARD_SEED_ID);
  const creature = getCreature(LUNAR_REWARD_CREATURE_ID);
  if (!seed || !creature || save.discoveredCreatureIds.includes(creature.id)) {
    return null;
  }

  return {
    seed,
    creature,
    discoveredCount: save.discoveredCreatureIds.length,
    totalCount: content.creatures.length
  };
}

function getExpeditionRewardSource(save: PlayerSave): ExpeditionRewardSource | undefined {
  if (save.activeExpedition?.expeditionId !== RESEARCH_EXPEDITION_ID) {
    return undefined;
  }

  return save.activeExpedition.source ?? (save.idleProduction.completedOrderIds.includes(GREENHOUSE_MIST_RETURN_ORDER.id) ? "greenhouse_mist" : "research");
}

function getLunarRewardSourceLabel(save: PlayerSave | null): string | null {
  if (save?.lunarRewardSource !== "greenhouse_mist") {
    return null;
  }

  return "응축기에서 회수한 온실 단서";
}

function getSeedIconAssetId(seed: SeedDefinition, save: PlayerSave | null): string {
  if (seed.id === LUNAR_REWARD_SEED_ID && save?.lunarRewardSource === "greenhouse_mist") {
    return "seed_lunar_001_greenhouse_source_icon";
  }

  return seed.iconAssetId;
}

function getSeedPlantingSource(save: PlayerSave, seed: SeedDefinition): ExpeditionRewardSource | undefined {
  if (seed.id === LUNAR_REWARD_SEED_ID && save.lunarRewardSource === "greenhouse_mist") {
    return "greenhouse_mist";
  }

  return undefined;
}

function getResearchClue(save: PlayerSave | null, nextCreatureGoal: NextCreatureGoal | null): string | null {
  if (!save || !nextCreatureGoal || save.researchLevel < FIRST_RESEARCH_MAX_LEVEL) {
    return null;
  }

  return `${nextCreatureGoal.seed.name}에서 ${nextCreatureGoal.creature.albumHint}`;
}

function getObjectParticle(label: string): "을" | "를" {
  const lastCode = label.charCodeAt(label.length - 1);
  const hasFinalConsonant = lastCode >= 0xac00 && lastCode <= 0xd7a3 && (lastCode - 0xac00) % 28 !== 0;

  return hasFinalConsonant ? "을" : "를";
}

function getSubjectParticle(label: string): "이" | "가" {
  const lastCode = label.charCodeAt(label.length - 1);
  const hasFinalConsonant = lastCode >= 0xac00 && lastCode <= 0xd7a3 && (lastCode - 0xac00) % 28 !== 0;

  return hasFinalConsonant ? "이" : "가";
}

function getNextAction(
  save: PlayerSave | null,
  activePlot: PlotState | undefined,
  firstAlbumRewardReady: boolean | null,
  now: number
) {
  if (!save) {
    return {
      title: "정원 준비 중",
      body: "씨앗과 정원 기록을 불러오고 있습니다."
    };
  }

  if (!save.selectedStarterSeedId) {
    return {
      title: "첫 씨앗을 고르세요",
      body: "씨앗 하나를 심으면 정원이 바로 자라기 시작합니다."
    };
  }

  if (activePlot) {
    const seed = getSeed(activePlot.seedId);
    const progressPercent = seed ? Math.min(100, Math.round(getGrowthProgress(activePlot, seed, now))) : 0;
    const secondsRemaining = seed ? Math.max(0, Math.ceil(seed.baseGrowthSeconds * (1 - progressPercent / 100))) : 0;
    const remainingLabel = getGrowthRemainingLabel(secondsRemaining);
    const tapReductionSeconds = seed ? seed.tapSecondsRemoved * (1 + save.tapPowerLevel * 0.12) : 0;
    const tapReductionLabel = getTapReductionLabel(tapReductionSeconds);
    const tapsRemaining = tapReductionSeconds > 0 ? Math.max(1, Math.ceil(secondsRemaining / tapReductionSeconds)) : 0;
    const greenhouseLunarSource = seed?.id === LUNAR_REWARD_SEED_ID && activePlot.source === "greenhouse_mist";
    return {
      title: greenhouseLunarSource ? "온실 단서 달빛 성장" : seed ? `${seed.name} 성장 중` : "성장 중",
      body:
        progressPercent >= 100
          ? greenhouseLunarSource
            ? "응축기에서 회수한 온실 단서가 수확 직전이에요. 반짝이는 밭을 눌러 달방울 누누 도감으로 이어가세요."
            : "현재 100% · 수확할 준비가 됐어요. 반짝이는 밭을 눌러 도감 보상으로 이어가세요."
          : greenhouseLunarSource
            ? `온실 단서가 밭에서 자라는 중 · 현재 ${progressPercent}% · 약 ${remainingLabel} 남음 · 1회 ${tapReductionLabel} 단축.`
            : `현재 ${progressPercent}% · 약 ${remainingLabel} 남음. 약 ${tapsRemaining}번 더 톡톡하면 수확 준비 · 1회 ${tapReductionLabel} 단축.`
    };
  }

  if (firstAlbumRewardReady) {
    return {
      title: "첫 생명체를 소유했습니다",
      body: "이름 있는 생명체가 도감에 들어왔습니다. 보상을 받아 두 번째 밭을 여세요."
    };
  }

  if (save.plotCount < 2) {
    return {
      title: "두 번째 밭 열기",
      body: "다음 생명체를 키울 공간입니다. 잎을 모아 정원 확장을 시작하세요."
    };
  }

  return {
    title: "다음 생명체를 준비하세요",
    body: "씨앗을 구매해 열린 밭에 심고, 다음 도감 칸을 채우세요."
  };
}

function getGrowthRemainingLabel(secondsRemaining: number): string {
  if (secondsRemaining >= 90) {
    return `${Math.ceil(secondsRemaining / 60)}분`;
  }

  return `${secondsRemaining}초`;
}

function getTapReductionLabel(secondsRemoved: number): string {
  const rounded = Math.round(secondsRemoved * 10) / 10;
  return Number.isInteger(rounded) ? `${rounded}초` : `${rounded.toFixed(1)}초`;
}

function buildGardenPlayfieldViewModel(
  save: PlayerSave | null,
  now: number,
  manifest: AssetManifest | null,
  orderDeliveryReceipt: OrderDeliveryReceipt | null,
  productionClaimReceipt: ProductionClaimReceipt | null,
  productionBoostReceipt: ProductionBoostReceipt | null,
  researchUnlockReceipt: ResearchUnlockReceipt | null,
  researchCompleteReceipt: ResearchCompleteReceipt | null,
  researchSeedReceipt: ResearchSeedReceipt | null,
  researchHarvestReceipt: ResearchHarvestReceipt | null
): GardenPlayfieldViewModel {
  if (!save) {
    return {
      headline: "정원 준비 중",
      hint: "씨앗과 정원 기록을 불러오고 있습니다",
      updatedAt: now,
      plots: Array.from({ length: 9 }, (_, index): GardenPlotView => ({
        index,
        state: index === 0 ? "empty" : "locked",
        label: index === 0 ? "첫 밭" : "잠김",
        progressPercent: 0
      }))
    };
  }

  const plots = save.plots.map((plot): GardenPlotView => {
    const locked = plot.index >= save.plotCount;
    const seed = getSeed(plot.seedId);

    if (locked) {
      return {
        index: plot.index,
        state: "locked",
        label: `${plot.index + 1}번 밭`,
        progressPercent: 0
      };
    }

    if (!seed) {
      return {
        index: plot.index,
        state: "empty",
        label: plot.index === 0 ? "첫 밭" : `${plot.index + 1}번 밭`,
        progressPercent: 0
      };
    }

    const progressPercent = getGrowthProgress(plot, seed, now);
    const secondsRemaining = Math.max(0, Math.ceil(seed.baseGrowthSeconds * (1 - progressPercent / 100)));
    const tapReductionSeconds = seed.tapSecondsRemoved * (1 + save.tapPowerLevel * 0.12);
    const greenhouseLunarSource = seed.id === LUNAR_REWARD_SEED_ID && plot.source === "greenhouse_mist";
    const researchSeedSource = plot.source === "research";

    return {
      index: plot.index,
      state: progressPercent >= 100 ? "ready" : "growing",
      label: seed.name,
      seedId: seed.id,
      family: seed.family,
      source: plot.source,
      sourceLabel: greenhouseLunarSource ? "온실 단서" : researchSeedSource ? "연구 단서" : undefined,
      sourceAssetPath: greenhouseLunarSource ? getAssetPath(manifest, "seed_lunar_001_greenhouse_source_icon") : undefined,
      progressPercent,
      secondsRemaining,
      tapReductionLabel: getTapReductionLabel(tapReductionSeconds),
      tapReductionSeconds
    };
  });

  const readyCount = plots.filter((plot) => plot.state === "ready").length;
  const growingPlot = plots.find((plot) => plot.state === "growing");
  const openCount = plots.filter((plot) => plot.state === "empty").length;
  const productionStatus = getProductionStatus(save, now);
  const greenhouseShelfStored = save.idleProduction.completedOrderIds.includes(GREENHOUSE_ORDER.id);
  const mistCondenserPayoffActive =
    productionStatus.order.id === GREENHOUSE_MIST_RETURN_ORDER.id && productionStatus.orderCompleted;
  const lunarGuardianOrderActive = productionStatus.order.id === LUNAR_GUARDIAN_ORDER.id;
  const firstOrderDispatchReceiptActive = orderDeliveryReceipt?.orderId === FIRST_ORDER.id;
  const productionClaimActive = Boolean(productionClaimReceipt);
  const productionBoostActive = Boolean(productionBoostReceipt);
  const researchUnlockActive = Boolean(researchUnlockReceipt);
  const researchCompleteActive = Boolean(researchCompleteReceipt);
  const researchSeedActive = Boolean(researchSeedReceipt);
  const researchHarvestActive = Boolean(researchHarvestReceipt);
  const researchSourcePlot = plots.find((plot) => plot.source === "research" && plot.state === "growing");
  const researchSeedPlantedActive = researchSeedActive || Boolean(researchSourcePlot);
  const researchSeedName = researchSeedReceipt?.seedName ?? researchSourcePlot?.label ?? "연구 단서 씨앗";
  const productionScene =
    productionStatus.ratePerMinute > 0
      ? {
          actorName: productionStatus.workerLabel,
          actorLine: firstOrderDispatchReceiptActive
            ? `${orderDeliveryReceipt.title} 출하 완료 · 다음 주문 준비`
            : productionClaimActive
              ? `+${productionClaimReceipt?.leaves ?? 0} 잎 수령 · 주문 상자에 반짝임 전달`
              : productionBoostActive
                ? `작업 간식 충전 · 분당 ${formatRatePerMinute(productionBoostReceipt?.nextRatePerMinute ?? productionStatus.ratePerMinute)} 잎`
                : researchUnlockActive
                  ? "연구 노트 발견 · 새싹 기록법 열림"
                : researchCompleteActive
                  ? "도감 단서 기록 · 다음 씨앗 목표 표시"
                  : researchHarvestActive
                    ? `단서 생명체 발견 · ${researchHarvestReceipt?.creatureName ?? "새 생명체"} 도감 기록`
                    : researchSeedPlantedActive
                      ? `연구 단서 씨앗 심기 · ${researchSeedName} 준비`
                      : productionStatus.orderCompleted
              ? `${productionStatus.workerDetail} · 납품을 마치고 쉬는 중`
              : productionStatus.workerDetail,
          rateLabel: `분당 ${formatRatePerMinute(productionStatus.ratePerMinute)} 잎`,
          pendingLabel: `대기 ${productionStatus.pendingLeaves} 잎`,
          orderTitle: firstOrderDispatchReceiptActive
            ? "첫 주문 상자 출하"
            : researchUnlockActive
              ? "연구 노트 개방"
              : researchCompleteActive
                ? "연구 노트 저장"
                : researchHarvestActive
                  ? "단서 생명체 발견"
                : researchSeedPlantedActive
                  ? "도감 목표 심기"
                  : mistCondenserPayoffActive
            ? "물안개 응축 완료"
            : productionStatus.orderCompleted
              ? `${productionStatus.order.title} 완료`
              : productionStatus.order.title,
          orderProgressLabel: firstOrderDispatchReceiptActive
            ? "보상 수거 완료"
            : productionClaimActive
              ? `${productionClaimReceipt?.orderProgress ?? productionStatus.orderProgress}/${productionClaimReceipt?.orderRequired ?? productionStatus.order.requiredLeaves} 잎`
              : researchUnlockActive
                ? "새싹 기록법 연구"
              : researchCompleteActive
                ? researchCompleteReceipt?.seedName ?? "다음 씨앗 목표"
                : researchHarvestActive
                  ? researchHarvestReceipt?.creatureName ?? "새 생명체"
                : researchSeedPlantedActive
                  ? researchSeedName
                  : mistCondenserPayoffActive
            ? "응축기 가동"
            : `${productionStatus.orderProgress}/${productionStatus.order.requiredLeaves} 잎`,
          orderReady:
            productionStatus.orderReady ||
            firstOrderDispatchReceiptActive ||
            researchUnlockActive ||
            researchCompleteActive ||
            researchHarvestActive ||
            researchSeedPlantedActive,
          orderCompleted:
            productionStatus.orderCompleted ||
            firstOrderDispatchReceiptActive ||
            researchUnlockActive ||
            researchCompleteActive ||
            researchHarvestActive ||
            researchSeedPlantedActive,
          orderVariant: firstOrderDispatchReceiptActive
            ? ("first-dispatched" as const)
            : lunarGuardianOrderActive
            ? ("lunar-guardian" as const)
            : mistCondenserPayoffActive
              ? ("mist-condenser-complete" as const)
              : undefined,
          orderStatusLabel: firstOrderDispatchReceiptActive
            ? `${orderDeliveryReceipt.rewardLabel} 수거`
            : productionClaimActive
              ? `+${productionClaimReceipt?.leaves ?? 0} 잎 이동`
              : productionBoostActive
                ? `생산 +${productionBoostReceipt?.bonusPercent ?? Math.round(PRODUCTION_BOOST_RATE_BONUS * 100)}%`
                : researchUnlockActive
                  ? "연구 열림"
                  : researchCompleteActive
                    ? "단서 기록"
                    : researchHarvestActive
                      ? "도감 단서 기록"
                    : researchSeedPlantedActive
                      ? researchSeedReceipt?.actionLabel ?? "연구 단서"
                      : mistCondenserPayoffActive
            ? "달빛 온실 단서 +1"
            : lunarGuardianOrderActive
              ? productionStatus.orderCompleted
                ? "달빛 보호 완료"
                : "누누 보호 주문"
              : greenhouseShelfStored
                ? `선반 보관 +${Math.round(getGreenhouseShelfOfflineBonus(save) * 100)}%`
                : undefined,
          actorFamily: productionStatus.primaryWorker?.family,
          workAssetPath: getAssetPath(manifest, productionStatus.primaryWorkAssetId),
          crateAssetPath: getAssetPath(manifest, "ui_order_crate_leaf_001")
        }
      : undefined;

  return {
    plots,
    headline: readyCount > 0 ? "수확할 씨앗이 반짝입니다" : growingPlot ? "밭을 눌러 성장을 밀어주세요" : "새 씨앗을 기다리는 정원",
    hint:
      readyCount > 0
        ? "빛나는 밭을 누르면 React가 수확을 처리합니다"
        : growingPlot
          ? `${growingPlot.secondsRemaining ?? 0}초 남음 · 탭하면 시간이 줄어듭니다`
          : openCount > 0
            ? "오른쪽 HUD에서 씨앗을 골라 심으세요"
            : "두 번째 밭을 열어 반복 속도를 올리세요",
    productionLine:
      productionStatus.ratePerMinute > 0 ? `자동 생산 +${formatRatePerMinute(productionStatus.ratePerMinute)}/분` : undefined,
    orderLine:
      productionStatus.ratePerMinute > 0
        ? `주문 ${productionStatus.orderProgress}/${productionStatus.order.requiredLeaves}`
        : undefined,
    productionScene,
    updatedAt: now
  };
}

function getShopSurfaceDescription(surfaceId: string): string {
  if (surfaceId === "starter_pack_mock") {
    return "초반 정원 성장을 빠르게 상상해보는 미리보기";
  }

  if (surfaceId === "monthly_license_mock") {
    return "매일 돌아오고 싶은 온실 혜택 미리보기";
  }

  return "관심 확인용 미리보기";
}

function getProductionStatus(save: PlayerSave, now: number): ProductionStatus {
  const currentOrder = getCurrentOrder(save);
  const pendingLeaves = getPendingProductionLeaves(save, now);
  const workerCreatures = getProductionWorkers(save);
  const primaryWorker = getPrimaryProductionWorker(workerCreatures);
  const lunarGuardianOrderActive = currentOrder.id === LUNAR_GUARDIAN_ORDER.id;
  const workerNames = primaryWorker
    ? [primaryWorker.name, ...workerCreatures.filter((creature) => creature.id !== primaryWorker.id).map((creature) => creature.name)]
    : workerCreatures.map((creature) => creature.name);
  const orderProgress = Math.min(
    currentOrder.requiredLeaves,
    save.idleProduction.orderProgress[currentOrder.id] ?? 0
  );
  const orderCompleted = save.idleProduction.completedOrderIds.includes(currentOrder.id);

  return {
    ratePerMinute: getProductionRatePerSecond(save) * 60,
    pendingLeaves,
    order: currentOrder,
    orderProgress,
    orderReady: orderProgress >= currentOrder.requiredLeaves,
    orderCompleted,
    workerCreatures,
    primaryWorker,
    primaryWorkAssetId: getProductionWorkAssetId(primaryWorker),
    workerLabel:
      workerCreatures.length > 1
        ? `정원 동료 ${workerCreatures.length}명 작업 중`
        : workerCreatures[0]
          ? `${workerCreatures[0].name} 작업 중`
          : "생명체 작업 중",
    workerDetail:
      lunarGuardianOrderActive
        ? "달방울 누누가 밤 온실 주문을 지키는 중"
        : workerCreatures.length > 1
        ? `${workerNames.slice(0, 2).join(" · ")}${workerNames.length > 2 ? ` 외 ${workerNames.length - 2}명` : ""}`
        : workerCreatures[0]
          ? `${getCreatureRoleLabel(workerCreatures[0].role)} 역할`
          : "첫 생명체를 수확하면 생산을 시작해요"
  };
}

function getComebackProductionTarget(productionStatus: ProductionStatus): ComebackProductionTarget {
  if (!productionStatus.orderCompleted && productionStatus.orderReady) {
    return {
      title: `${productionStatus.order.title} 납품 가능`,
      detail: `${formatOrderReward(productionStatus.order)} 보상이 다음 성장 선택으로 이어집니다.`,
      ctaLabel: getOrderDeliveryCta(productionStatus.order),
      action: "deliver_order"
    };
  }

  const remainingLeaves = Math.max(productionStatus.order.requiredLeaves - productionStatus.orderProgress, 0);
  if (!productionStatus.orderCompleted && productionStatus.pendingLeaves > 0) {
    const completesOrder = productionStatus.pendingLeaves >= remainingLeaves;
    return {
      title: `${productionStatus.pendingLeaves} 잎 생산 대기`,
      detail: completesOrder
        ? `${productionStatus.order.title} 주문 상자를 바로 채울 수 있어요.`
        : `${remainingLeaves} 잎 중 ${productionStatus.pendingLeaves} 잎을 먼저 상자에 넣어요.`,
      ctaLabel: "생산 잎 수령",
      action: "claim_production"
    };
  }

  if (productionStatus.orderCompleted) {
    return {
      title: `${productionStatus.order.title} 완료`,
      detail: "아래 성장 선택에서 복귀 보상을 다음 설비나 연구로 바꿀 차례예요.",
      ctaLabel: "정원 목표 보기",
      action: "view_goal"
    };
  }

  return {
    title: `${productionStatus.order.title} 준비 중`,
    detail: `${remainingLeaves} 잎을 더 모으면 ${formatOrderReward(productionStatus.order)} 보상이 열립니다.`,
    ctaLabel: "정원 목표 보기",
    action: "view_goal"
  };
}

function getPrimaryProductionWorker(workerCreatures: CreatureDefinition[]): CreatureDefinition | undefined {
  return workerCreatures.find((creature) => creature.id === LUNAR_REWARD_CREATURE_ID) ?? workerCreatures[0];
}

function getProductionWorkAssetId(worker: CreatureDefinition | undefined): string {
  if (!worker) {
    return "creature_herb_common_001_work";
  }

  if (worker.id === "creature_herb_common_001") {
    return "creature_herb_common_001_work";
  }

  return worker.assetId;
}

function getProductionWorkers(save: PlayerSave): CreatureDefinition[] {
  return save.discoveredCreatureIds
    .map((creatureId) => getCreature(creatureId))
    .filter((creature): creature is CreatureDefinition => Boolean(creature));
}

function getCurrentOrder(save: PlayerSave): FirstOrderDefinition {
  if (!save.idleProduction.completedOrderIds.includes(FIRST_ORDER.id)) {
    return FIRST_ORDER;
  }

  if (!save.idleProduction.completedOrderIds.includes(SECOND_ORDER.id)) {
    return SECOND_ORDER;
  }

  if (
    save.greenhouseFacilityLevel >= GREENHOUSE_FACILITY_MAX_LEVEL &&
    !save.idleProduction.completedOrderIds.includes(GREENHOUSE_ORDER.id)
  ) {
    return GREENHOUSE_ORDER;
  }

  if (
    save.greenhouseStorageLevel >= GREENHOUSE_STORAGE_MAX_LEVEL &&
    !save.idleProduction.completedOrderIds.includes(GREENHOUSE_EXPANSION_ORDER.id)
  ) {
    return GREENHOUSE_EXPANSION_ORDER;
  }

  if (
    save.greenhouseRouteLevel >= GREENHOUSE_ROUTE_MAX_LEVEL &&
    save.plotCount >= GREENHOUSE_ROUTE_PLOT_COUNT &&
    !save.idleProduction.completedOrderIds.includes(GREENHOUSE_ROUTE_SUPPLY_ORDER.id)
  ) {
    return GREENHOUSE_ROUTE_SUPPLY_ORDER;
  }

  if (
    save.greenhouseIrrigationLevel >= GREENHOUSE_IRRIGATION_MAX_LEVEL &&
    !save.idleProduction.completedOrderIds.includes(GREENHOUSE_IRRIGATION_ORDER.id)
  ) {
    return GREENHOUSE_IRRIGATION_ORDER;
  }

  if (
    save.greenhouseMistLevel >= GREENHOUSE_MIST_MAX_LEVEL &&
    !save.idleProduction.completedOrderIds.includes(GREENHOUSE_MIST_RETURN_ORDER.id)
  ) {
    return GREENHOUSE_MIST_RETURN_ORDER;
  }

  if (save.idleProduction.completedOrderIds.includes(GREENHOUSE_MIST_RETURN_ORDER.id)) {
    return GREENHOUSE_MIST_RETURN_ORDER;
  }

  if (save.idleProduction.completedOrderIds.includes(GREENHOUSE_IRRIGATION_ORDER.id)) {
    return GREENHOUSE_IRRIGATION_ORDER;
  }

  if (save.idleProduction.completedOrderIds.includes(GREENHOUSE_ROUTE_SUPPLY_ORDER.id)) {
    return GREENHOUSE_ROUTE_SUPPLY_ORDER;
  }

  if (save.idleProduction.completedOrderIds.includes(GREENHOUSE_EXPANSION_ORDER.id)) {
    return GREENHOUSE_EXPANSION_ORDER;
  }

  if (save.idleProduction.completedOrderIds.includes(GREENHOUSE_ORDER.id)) {
    return GREENHOUSE_ORDER;
  }

  if (save.idleProduction.completedOrderIds.includes(LUNAR_GUARDIAN_ORDER.id)) {
    return LUNAR_GUARDIAN_ORDER;
  }

  if (
    save.discoveredCreatureIds.includes(LUNAR_REWARD_CREATURE_ID) &&
    !save.idleProduction.completedOrderIds.includes(LUNAR_GUARDIAN_ORDER.id)
  ) {
    return LUNAR_GUARDIAN_ORDER;
  }

  return save.greenhouseFacilityLevel >= GREENHOUSE_FACILITY_MAX_LEVEL ? GREENHOUSE_ORDER : SECOND_ORDER;
}

function getOrderAfterCompleting(save: PlayerSave, completedOrder: FirstOrderDefinition): FirstOrderDefinition {
  if (save.idleProduction.completedOrderIds.includes(completedOrder.id)) {
    return getCurrentOrder(save);
  }

  const draft: PlayerSave = structuredClone(save);
  draft.idleProduction.completedOrderIds.push(completedOrder.id);
  return getCurrentOrder(draft);
}

function getProductionFxAssetId(kind: ProductionFxKind, order?: FirstOrderDefinition): string {
  if (kind === "order" && order?.id === LUNAR_GUARDIAN_ORDER.id) {
    return "fx_lunar_harvest_moonburst_001";
  }

  return PRODUCTION_FX_ASSETS[kind];
}

function getOrderDeliveryCta(order: FirstOrderDefinition): string {
  if (order.id === FIRST_ORDER.id) {
    return "첫 잎 주문 납품";
  }

  if (order.id === LUNAR_GUARDIAN_ORDER.id) {
    return "달빛 보호 주문 납품";
  }

  return "주문 납품";
}

function formatOrderReward(order: FirstOrderDefinition): string {
  return [
    `+${order.rewardLeaves} 잎`,
    `+${order.rewardPollen} 꽃가루`,
    order.rewardMaterials ? `+${order.rewardMaterials} 재료` : ""
  ]
    .filter(Boolean)
    .join(" · ");
}

function buildUpgradeChoices(
  save: PlayerSave,
  productionStatus: ProductionStatus,
  buyFirstUpgrade: () => void,
  buyProductionBoost: () => void,
  buyMaterialWorkbench: () => void,
  buyGreenhouseFacility: () => void,
  buyGreenhouseStorage: () => void,
  buyGreenhouseRoute: () => void,
  buyGreenhouseIrrigation: () => void,
  buyGreenhouseMist: () => void,
  buyFirstResearch: () => void
): UpgradeChoice[] {
  const plotComplete = save.plotCount >= 2;
  const plotShortfall = Math.max(FIRST_UPGRADE_COST - save.leaves, 0);
  const speedComplete = save.productionBoostLevel >= PRODUCTION_BOOST_MAX_LEVEL;
  const speedUnlocked = save.idleProduction.completedOrderIds.includes(FIRST_ORDER.id);
  const speedAffordable = save.leaves >= PRODUCTION_BOOST_COST_LEAVES && save.pollen >= PRODUCTION_BOOST_COST_POLLEN;
  const speedShortfallLeaves = Math.max(PRODUCTION_BOOST_COST_LEAVES - save.leaves, 0);
  const speedShortfallPollen = Math.max(PRODUCTION_BOOST_COST_POLLEN - save.pollen, 0);
  const workbenchComplete = save.materialWorkbenchLevel >= MATERIAL_WORKBENCH_MAX_LEVEL;
  const workbenchAffordable = save.materials >= MATERIAL_WORKBENCH_COST_MATERIALS;
  const workbenchUnlocked = workbenchAffordable || workbenchComplete;
  const workbenchShortfallMaterials = Math.max(MATERIAL_WORKBENCH_COST_MATERIALS - save.materials, 0);
  const facilityComplete = save.greenhouseFacilityLevel >= GREENHOUSE_FACILITY_MAX_LEVEL;
  const facilityUnlocked = workbenchComplete;
  const facilityAffordable =
    save.leaves >= GREENHOUSE_FACILITY_COST_LEAVES && save.materials >= GREENHOUSE_FACILITY_COST_MATERIALS;
  const facilityShortfallLeaves = Math.max(GREENHOUSE_FACILITY_COST_LEAVES - save.leaves, 0);
  const facilityShortfallMaterials = Math.max(GREENHOUSE_FACILITY_COST_MATERIALS - save.materials, 0);
  const greenhouseOrderComplete = save.idleProduction.completedOrderIds.includes(GREENHOUSE_ORDER.id);
  const storageComplete = save.greenhouseStorageLevel >= GREENHOUSE_STORAGE_MAX_LEVEL;
  const storageUnlocked = greenhouseOrderComplete;
  const storageAffordable = save.materials >= GREENHOUSE_STORAGE_COST_MATERIALS;
  const storageShortfallMaterials = Math.max(GREENHOUSE_STORAGE_COST_MATERIALS - save.materials, 0);
  const expansionOrderComplete = save.idleProduction.completedOrderIds.includes(GREENHOUSE_EXPANSION_ORDER.id);
  const routeComplete =
    save.greenhouseRouteLevel >= GREENHOUSE_ROUTE_MAX_LEVEL || save.plotCount >= GREENHOUSE_ROUTE_PLOT_COUNT;
  const routeUnlocked = expansionOrderComplete;
  const routeAffordable = save.materials >= GREENHOUSE_ROUTE_COST_MATERIALS;
  const routeShortfallMaterials = Math.max(GREENHOUSE_ROUTE_COST_MATERIALS - save.materials, 0);
  const routeSupplyComplete = save.idleProduction.completedOrderIds.includes(GREENHOUSE_ROUTE_SUPPLY_ORDER.id);
  const irrigationComplete = save.greenhouseIrrigationLevel >= GREENHOUSE_IRRIGATION_MAX_LEVEL;
  const irrigationUnlocked = routeSupplyComplete;
  const irrigationAffordable =
    save.materials >= GREENHOUSE_IRRIGATION_COST_MATERIALS && save.pollen >= GREENHOUSE_IRRIGATION_COST_POLLEN;
  const irrigationShortfallMaterials = Math.max(GREENHOUSE_IRRIGATION_COST_MATERIALS - save.materials, 0);
  const irrigationShortfallPollen = Math.max(GREENHOUSE_IRRIGATION_COST_POLLEN - save.pollen, 0);
  const irrigationOrderComplete = save.idleProduction.completedOrderIds.includes(GREENHOUSE_IRRIGATION_ORDER.id);
  const mistComplete = save.greenhouseMistLevel >= GREENHOUSE_MIST_MAX_LEVEL;
  const mistUnlocked = irrigationOrderComplete;
  const mistAffordable = save.materials >= GREENHOUSE_MIST_COST_MATERIALS && save.pollen >= GREENHOUSE_MIST_COST_POLLEN;
  const mistShortfallMaterials = Math.max(GREENHOUSE_MIST_COST_MATERIALS - save.materials, 0);
  const mistShortfallPollen = Math.max(GREENHOUSE_MIST_COST_POLLEN - save.pollen, 0);
  const researchComplete = save.researchLevel >= FIRST_RESEARCH_MAX_LEVEL;
  const researchUnlocked = save.idleProduction.completedOrderIds.includes(SECOND_ORDER.id);
  const researchAffordable = save.leaves >= FIRST_RESEARCH_COST_LEAVES && save.pollen >= FIRST_RESEARCH_COST_POLLEN;
  const researchShortfallLeaves = Math.max(FIRST_RESEARCH_COST_LEAVES - save.leaves, 0);
  const researchShortfallPollen = Math.max(FIRST_RESEARCH_COST_POLLEN - save.pollen, 0);

  return [
    {
      id: "plot_2",
      title: "밭 확장",
      detail: plotComplete
        ? "2번째 밭 가동 중"
        : plotShortfall === 0
          ? `${FIRST_UPGRADE_COST} 잎으로 반복 속도 상승`
          : `${plotShortfall} 잎 더 모으면 열림`,
      status: plotComplete ? "완료" : plotShortfall === 0 ? "가능" : "부족",
      tone: plotComplete ? "done" : plotShortfall === 0 ? "ready" : "waiting",
      onSelect: !plotComplete && plotShortfall === 0 ? buyFirstUpgrade : undefined
    },
    {
      id: "production_rate",
      title: "생산 속도",
      detail: speedComplete
        ? `분당 ${formatRatePerMinute(productionStatus.ratePerMinute)} 잎 가동`
        : !speedUnlocked
          ? "첫 납품 후 열림"
          : speedAffordable
            ? `${PRODUCTION_BOOST_COST_LEAVES} 잎 · ${PRODUCTION_BOOST_COST_POLLEN} 꽃가루로 +25%`
            : `${speedShortfallLeaves ? `${speedShortfallLeaves} 잎` : ""}${
                speedShortfallLeaves && speedShortfallPollen ? " · " : ""
              }${speedShortfallPollen ? `${speedShortfallPollen} 꽃가루` : ""} 부족`,
      status: speedComplete ? "강화 완료" : speedAffordable && speedUnlocked ? "작업 간식 강화" : speedUnlocked ? "재화 부족" : "첫 납품 후",
      tone: speedComplete ? "done" : speedAffordable && speedUnlocked ? "ready" : "waiting",
      onSelect: !speedComplete && speedUnlocked && speedAffordable ? buyProductionBoost : undefined
    },
    ...(workbenchUnlocked
      ? [
          {
            id: "material_workbench",
            title: "작업대 강화",
            detail: workbenchComplete
              ? `재료 작업대 +${Math.round(MATERIAL_WORKBENCH_RATE_BONUS * 100)}% 가동`
              : workbenchAffordable
                ? `${MATERIAL_WORKBENCH_COST_MATERIALS} 재료로 자동 생산 +${Math.round(MATERIAL_WORKBENCH_RATE_BONUS * 100)}%`
                : `${workbenchShortfallMaterials} 재료 더 필요`,
            status: workbenchComplete ? "강화 완료" : workbenchAffordable ? "재료 사용" : "재료 부족",
            tone: workbenchComplete ? "done" : workbenchAffordable ? "ready" : "waiting",
            onSelect: !workbenchComplete && workbenchAffordable ? buyMaterialWorkbench : undefined
          } satisfies UpgradeChoice
        ]
      : []),
    ...(facilityUnlocked
      ? [
          {
            id: "greenhouse_facility",
            title: "온실 설비",
            detail: facilityComplete
              ? `온실 선반 +${Math.round(GREENHOUSE_FACILITY_RATE_BONUS * 100)}% 가동`
              : facilityAffordable
                ? `${GREENHOUSE_FACILITY_COST_LEAVES} 잎 · ${GREENHOUSE_FACILITY_COST_MATERIALS} 재료로 선반 설치`
                : `${facilityShortfallLeaves ? `${facilityShortfallLeaves} 잎` : ""}${
                    facilityShortfallLeaves && facilityShortfallMaterials ? " · " : ""
                  }${facilityShortfallMaterials ? `${facilityShortfallMaterials} 재료` : ""} 더 필요`,
            status: facilityComplete ? "설비 완료" : facilityAffordable ? "설비 준비" : "자원 부족",
            tone: facilityComplete ? "done" : facilityAffordable ? "ready" : "waiting",
            onSelect: !facilityComplete && facilityAffordable ? buyGreenhouseFacility : undefined
          } satisfies UpgradeChoice
        ]
      : []),
    ...(storageUnlocked
      ? [
          {
            id: "greenhouse_storage",
            title: "선반 정리",
            detail: storageComplete
              ? `보관 보너스 +${Math.round(getGreenhouseShelfOfflineBonus(save) * 100)}% 가동`
              : storageAffordable
                ? `${GREENHOUSE_STORAGE_COST_MATERIALS} 재료로 보관 보너스 +20%`
                : `${storageShortfallMaterials} 재료 더 필요`,
            status: storageComplete ? "정리 완료" : storageAffordable ? "정리 가능" : "재료 부족",
            tone: storageComplete ? "done" : storageAffordable ? "ready" : "waiting",
            onSelect: !storageComplete && storageAffordable ? buyGreenhouseStorage : undefined
          } satisfies UpgradeChoice
        ]
      : []),
    ...(routeUnlocked
      ? [
          {
            id: "greenhouse_route",
            title: "온실 동선",
            detail: routeComplete
              ? "3번 밭 개방 중"
              : routeAffordable
                ? `${GREENHOUSE_ROUTE_COST_MATERIALS} 재료로 3번 밭 개방`
                : `${routeShortfallMaterials} 재료 더 필요`,
            status: routeComplete ? "동선 완료" : routeAffordable ? "확장 가능" : "재료 부족",
            tone: routeComplete ? "done" : routeAffordable ? "ready" : "waiting",
            onSelect: !routeComplete && routeAffordable ? buyGreenhouseRoute : undefined
          } satisfies UpgradeChoice
        ]
      : []),
    ...(irrigationUnlocked
      ? [
          {
            id: "greenhouse_irrigation",
            title: "온실 물길",
            detail: irrigationComplete
              ? `자동 생산 +${Math.round(GREENHOUSE_IRRIGATION_RATE_BONUS * 100)}% 가동`
              : irrigationAffordable
                ? `${GREENHOUSE_IRRIGATION_COST_MATERIALS} 재료 · ${GREENHOUSE_IRRIGATION_COST_POLLEN} 꽃가루로 자동 생산 +15%`
                : `${irrigationShortfallMaterials ? `${irrigationShortfallMaterials} 재료` : ""}${
                    irrigationShortfallMaterials && irrigationShortfallPollen ? " · " : ""
                  }${irrigationShortfallPollen ? `${irrigationShortfallPollen} 꽃가루` : ""} 부족`,
            status: irrigationComplete ? "물길 완료" : irrigationAffordable ? "연결 가능" : "재료 부족",
            tone: irrigationComplete ? "done" : irrigationAffordable ? "ready" : "waiting",
            onSelect: !irrigationComplete && irrigationAffordable ? buyGreenhouseIrrigation : undefined
          } satisfies UpgradeChoice
        ]
      : []),
    ...(mistUnlocked
      ? [
          {
            id: "greenhouse_mist",
            title: "온실 물안개",
            detail: mistComplete
              ? `복귀 보관 +${Math.round(GREENHOUSE_MIST_OFFLINE_BONUS * 100)}% 가동`
              : mistAffordable
                ? `${GREENHOUSE_MIST_COST_MATERIALS} 재료 · ${GREENHOUSE_MIST_COST_POLLEN} 꽃가루로 복귀 보관 +10%`
                : `${mistShortfallMaterials ? `${mistShortfallMaterials} 재료` : ""}${
                    mistShortfallMaterials && mistShortfallPollen ? " · " : ""
                  }${mistShortfallPollen ? `${mistShortfallPollen} 꽃가루` : ""} 부족`,
            status: mistComplete ? "물안개 완료" : mistAffordable ? "분사 가능" : "재료 부족",
            tone: mistComplete ? "done" : mistAffordable ? "ready" : "waiting",
            onSelect: !mistComplete && mistUnlocked && mistAffordable ? buyGreenhouseMist : undefined
          } satisfies UpgradeChoice
        ]
      : []),
    {
      id: "first_order",
      title: "주문 준비",
      detail: productionStatus.orderCompleted
        ? `${productionStatus.order.title} 완료`
        : `${productionStatus.orderProgress}/${productionStatus.order.requiredLeaves} 잎 준비`,
      status: productionStatus.orderCompleted ? "완료" : productionStatus.orderReady ? "납품 가능" : "진행",
      tone: productionStatus.orderCompleted ? "done" : productionStatus.orderReady ? "ready" : "waiting"
    },
    {
      id: "seed_research_1",
      title: "연구",
      detail: researchComplete
        ? "새싹 기록법 완료"
        : !researchUnlocked
          ? "두 번째 주문 후 열림"
          : researchAffordable
            ? `${FIRST_RESEARCH_COST_LEAVES} 잎 · ${FIRST_RESEARCH_COST_POLLEN} 꽃가루`
            : `${researchShortfallLeaves ? `${researchShortfallLeaves} 잎` : ""}${
                researchShortfallLeaves && researchShortfallPollen ? " · " : ""
              }${researchShortfallPollen ? `${researchShortfallPollen} 꽃가루` : ""} 부족`,
      status: researchComplete
        ? "연구 완료"
        : researchAffordable && researchUnlocked
          ? "새싹 기록법 연구"
          : researchUnlocked
            ? "재료 부족"
            : "두 번째 주문 후",
      tone: researchComplete ? "done" : researchAffordable && researchUnlocked ? "ready" : "waiting",
      onSelect: !researchComplete && researchUnlocked && researchAffordable ? buyFirstResearch : undefined
    }
  ];
}

function getPendingProductionLeaves(save: PlayerSave, now: number): number {
  const ratePerSecond = getProductionRatePerSecond(save);
  if (ratePerSecond <= 0) {
    return save.idleProduction.pendingLeaves;
  }

  const elapsedSeconds = Math.max(0, (now - new Date(save.idleProduction.lastTickAt).getTime()) / 1000);
  return save.idleProduction.pendingLeaves + Math.floor(elapsedSeconds * ratePerSecond);
}

function getProductionRatePerSecond(save: PlayerSave): number {
  const baseRate = save.discoveredCreatureIds.reduce((total, creatureId) => {
    const creature = getCreature(creatureId);
    if (!creature) {
      return total;
    }

    return total + getCreatureProductionRate(creature);
  }, 0);
  const productionBoost = Math.min(save.productionBoostLevel, PRODUCTION_BOOST_MAX_LEVEL) * PRODUCTION_BOOST_RATE_BONUS;
  const workbenchBoost =
    Math.min(save.materialWorkbenchLevel, MATERIAL_WORKBENCH_MAX_LEVEL) * MATERIAL_WORKBENCH_RATE_BONUS;
  const facilityBoost =
    Math.min(save.greenhouseFacilityLevel, GREENHOUSE_FACILITY_MAX_LEVEL) * GREENHOUSE_FACILITY_RATE_BONUS;
  const irrigationBoost =
    Math.min(save.greenhouseIrrigationLevel, GREENHOUSE_IRRIGATION_MAX_LEVEL) * GREENHOUSE_IRRIGATION_RATE_BONUS;
  return baseRate * (1 + productionBoost + workbenchBoost + facilityBoost + irrigationBoost);
}

function formatRatePerMinute(ratePerMinute: number): string {
  return (Math.round((ratePerMinute + 1e-6) * 10) / 10).toFixed(1);
}

function getCreatureProductionRate(creature: CreatureDefinition): number {
  const roleRates: Record<CreatureDefinition["role"], number> = {
    gatherer: 0.12,
    alchemist: 0.07,
    guardian: 0.05,
    merchant: 0.08,
    mascot: 0.04
  };

  const rarityBonus: Record<CreatureDefinition["rarity"], number> = {
    common: 1,
    uncommon: 1.25,
    rare: 1.65,
    epic: 2.1
  };

  return roleRates[creature.role] * rarityBonus[creature.rarity];
}

function getSeed(seedId: string | undefined): SeedDefinition | undefined {
  return seedId ? content.seeds.find((seed) => seed.id === seedId) : undefined;
}

function getDeterministicCreatureForSeed(seed: SeedDefinition): CreatureDefinition | undefined {
  return getCreature(seed.creaturePool[0]);
}

function getCreature(creatureId: string | undefined): CreatureDefinition | undefined {
  return creatureId ? content.creatures.find((creature) => creature.id === creatureId) : undefined;
}

function getCreatureRoleLabel(role: CreatureDefinition["role"]): string {
  const labels: Record<CreatureDefinition["role"], string> = {
    gatherer: "수집가",
    alchemist: "연금술사",
    guardian: "수호자",
    merchant: "상인",
    mascot: "마스코트"
  };

  return labels[role];
}

function getCreatureFamilyLabel(family: CreatureDefinition["family"]): string {
  const labels: Record<CreatureDefinition["family"], string> = {
    herb: "허브 계열",
    candy: "사탕 계열",
    lunar: "달빛 계열"
  };

  return labels[family];
}

function getRarityLabel(rarity: CreatureDefinition["rarity"]): string {
  const labels: Record<CreatureDefinition["rarity"], string> = {
    common: "흔함",
    uncommon: "희귀",
    rare: "레어",
    epic: "에픽"
  };

  return labels[rarity];
}

function getSeedHintForCreature(creature: CreatureDefinition): string {
  const sourceSeed = content.seeds.find((seed) => seed.creaturePool.includes(creature.id));
  return sourceSeed ? `${sourceSeed.name} 단서` : `${getCreatureFamilyLabel(creature.family)} 씨앗 단서`;
}

function getAlbumClueLabel(creature: CreatureDefinition, index: number): string {
  if (creature.family === "candy") {
    return "젤리콩 흔적";
  }

  if (creature.family === "lunar") {
    return index === 0 ? "달잎 그림자" : "밤잎 그림자";
  }

  return index === 0 ? "향기 둥근 발자국" : "풀잎 방문 흔적";
}

function getAlbumClueCopy(creature: CreatureDefinition, seedHint: string, index: number): string {
  if (creature.family === "candy") {
    return `말랑한 발자국이 ${seedHint}${getObjectParticle(seedHint)} 가리킵니다`;
  }

  if (creature.family === "lunar") {
    return `밤마다 조금씩 자라는 잎 그림자 · ${seedHint}`;
  }

  return index === 0 ? `흙 위에 남은 둥근 향기 자국 · ${seedHint}` : `${creature.albumHint} · ${seedHint}`;
}

function advanceMission(draft: PlayerSave, missionId: string, amount = 1) {
  const mission = content.missions.find((item) => item.id === missionId);
  if (!mission || draft.claimedMissionIds.includes(mission.id)) {
    return;
  }

  const current = draft.missionProgress[mission.id] ?? 0;
  draft.missionProgress[mission.id] = Math.min(mission.target, current + amount);
}

function getSeedHarvestSummary(seed: SeedDefinition): string {
  return `${seed.baseGrowthSeconds}s · +${seed.baseHarvestLeaves} 잎`;
}

function getSeedPurchaseCost(seed: SeedDefinition): number {
  return Math.max(MIN_REPEAT_SEED_COST, seed.costLeaves);
}

function getTargetSeedStatus(seed: SeedDefinition, owned: number, hasOpenPlot: boolean, leafShortfall: number): string {
  if (owned > 0 && hasOpenPlot) {
    return `${seed.name} 보유 중 · 열린 밭에 바로 심을 수 있어요`;
  }

  if (owned > 0) {
    return `${seed.name} 보유 중 · 밭을 비우면 심을 수 있어요`;
  }

  if (leafShortfall > 0) {
    return `${leafShortfall} 잎을 더 모으면 다음 생명체 단서가 열려요`;
  }

  return `${seed.name} 구매 가능 · 구매 후 열린 밭에 심어보세요`;
}

function plantSeedInPlot(plot: PlotState, seed: SeedDefinition, source?: ExpeditionRewardSource): PlotState {
  return {
    ...plot,
    seedId: seed.id,
    source,
    plantedAt: new Date().toISOString(),
    tapProgressSeconds: 0,
    harvestedCreatureId: undefined
  };
}

function getGrowthProgress(plot: PlotState, seed: SeedDefinition, now: number): number {
  if (!plot.plantedAt) {
    return 0;
  }

  const elapsedSeconds = (now - new Date(plot.plantedAt).getTime()) / 1000 + plot.tapProgressSeconds;
  return Math.min(100, (elapsedSeconds / seed.baseGrowthSeconds) * 100);
}

function isPlotReady(plot: PlotState, seed: SeedDefinition, now: number): boolean {
  return getGrowthProgress(plot, seed, now) >= 100;
}

function calculateOfflineReward(save: PlayerSave, now: number): OfflineRewardResult {
  const awaySeconds = Math.min(OFFLINE_CAP_SECONDS, Math.max(0, (now - new Date(save.lastSeenAt).getTime()) / 1000));
  const guardianBonus = getOfflineGuardianBonus(save);
  const shelfBonus = getOfflineShelfBonus(save);

  if (awaySeconds < 15 * 60 || save.discoveredCreatureIds.length === 0) {
    return {
      leaves: 0,
      awayMinutes: Math.floor(awaySeconds / 60),
      guardianBonusPercent: guardianBonus.percent,
      guardianName: guardianBonus.guardianName,
      shelfBonusPercent: shelfBonus.percent,
      shelfBonusLabel: shelfBonus.label
    };
  }

  const baseRate = Math.max(0.03, save.discoveredCreatureIds.length * 0.02 + save.plotCount * 0.01);
  const multiplier = guardianBonus.multiplier + shelfBonus.percent;
  return {
    leaves: Math.floor(awaySeconds * baseRate * 0.35 * multiplier),
    awayMinutes: Math.floor(awaySeconds / 60),
    guardianBonusPercent: guardianBonus.percent,
    guardianName: guardianBonus.guardianName,
    shelfBonusPercent: shelfBonus.percent,
    shelfBonusLabel: shelfBonus.label
  };
}

function getOfflineGuardianBonus(save: PlayerSave): { multiplier: number; percent: number; guardianName?: string } {
  const guardians = save.discoveredCreatureIds
    .map((creatureId) => getCreature(creatureId))
    .filter((creature): creature is CreatureDefinition => Boolean(creature && creature.role === "guardian"));
  const percent = guardians.length * GUARDIAN_OFFLINE_BONUS;

  return {
    multiplier: 1 + percent,
    percent,
    guardianName: guardians[0]?.name
  };
}

function getOfflineShelfBonus(save: PlayerSave): { percent: number; label?: string } {
  const hasGreenhouseShelf = save.idleProduction.completedOrderIds.includes(GREENHOUSE_ORDER.id);
  return {
    percent: hasGreenhouseShelf ? getGreenhouseShelfOfflineBonus(save) : 0,
    label: hasGreenhouseShelf ? "온실 선반 보관" : undefined
  };
}

function getGreenhouseShelfOfflineBonus(save: PlayerSave): number {
  return (
    GREENHOUSE_SHELF_OFFLINE_BONUS +
    Math.min(save.greenhouseStorageLevel, GREENHOUSE_STORAGE_MAX_LEVEL) * GREENHOUSE_STORAGE_OFFLINE_BONUS +
    Math.min(save.greenhouseMistLevel, GREENHOUSE_MIST_MAX_LEVEL) * GREENHOUSE_MIST_OFFLINE_BONUS
  );
}

function getOfflineRewardMessage(reward: OfflineRewardResult): string {
  const base = `자리를 비운 동안 잎 ${reward.leaves}개를 모았습니다.`;
  const bonusMessages = [
    reward.guardianBonusPercent > 0 && reward.guardianName
      ? `${reward.guardianName}가 달빛 보상 +${Math.round(reward.guardianBonusPercent * 100)}%를 지켜줬어요.`
      : "",
    reward.shelfBonusPercent > 0
      ? `${reward.shelfBonusLabel ?? "온실 선반 보관"}이 보관 보상 +${Math.round(reward.shelfBonusPercent * 100)}%를 더했어요.`
      : ""
  ].filter(Boolean);

  if (bonusMessages.length === 0) {
    return base;
  }

  return `${base} ${bonusMessages.join(" ")}`;
}

function getAwayTimeLabel(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}분`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}시간 ${remainingMinutes}분` : `${hours}시간`;
}

function getExpeditionDurationLabel(durationSeconds: number): string {
  if (durationSeconds < 60) {
    return `${durationSeconds}초`;
  }

  return `${Math.round(durationSeconds / 60)}분`;
}

function getExpeditionRewardSummary(expedition: { rewardLeaves: number; rewardMaterials: number }): string {
  const materialReward = expedition.rewardMaterials > 0 ? ` · +${expedition.rewardMaterials} 재료` : "";
  return `+${expedition.rewardLeaves} 잎${materialReward}`;
}

function getExpeditionRemainingSeconds(expedition: ExpeditionState, now: number): number {
  const finishAt = new Date(expedition.startedAt).getTime() + expedition.durationSeconds * 1000;
  return Math.max(0, Math.ceil((finishAt - now) / 1000));
}

function isExpeditionReady(expedition: ExpeditionState, now: number): boolean {
  const elapsedSeconds = (now - new Date(expedition.startedAt).getTime()) / 1000;
  return elapsedSeconds >= expedition.durationSeconds;
}

function getLocalQaOfflineMinutes(): number | null {
  if (!import.meta.env.DEV || !["127.0.0.1", "localhost"].includes(window.location.hostname)) {
    return null;
  }

  const raw = new URLSearchParams(window.location.search).get("qaOfflineMinutes");
  if (!raw) {
    return null;
  }

  const minutes = Number.parseInt(raw, 10);
  if (!Number.isFinite(minutes) || minutes < 15) {
    return null;
  }

  return Math.min(minutes, 8 * 60);
}

function getLocalQaLunarGuardian(): boolean {
  if (!import.meta.env.DEV || !["127.0.0.1", "localhost"].includes(window.location.hostname)) {
    return false;
  }

  return new URLSearchParams(window.location.search).get("qaLunarGuardian") === "1";
}

function getLocalQaGreenhouseShelf(): boolean {
  if (!import.meta.env.DEV || !["127.0.0.1", "localhost"].includes(window.location.hostname)) {
    return false;
  }

  return new URLSearchParams(window.location.search).get("qaGreenhouseShelf") === "1";
}

function getLocalQaGreenhouseStorage(): boolean {
  if (!import.meta.env.DEV || !["127.0.0.1", "localhost"].includes(window.location.hostname)) {
    return false;
  }

  return new URLSearchParams(window.location.search).get("qaGreenhouseStorage") === "1";
}

function getLocalQaGreenhouseRoute(): boolean {
  if (!import.meta.env.DEV || !["127.0.0.1", "localhost"].includes(window.location.hostname)) {
    return false;
  }

  return new URLSearchParams(window.location.search).get("qaGreenhouseRoute") === "1";
}

function getLocalQaGreenhouseRouteSupply(): boolean {
  if (!import.meta.env.DEV || !["127.0.0.1", "localhost"].includes(window.location.hostname)) {
    return false;
  }

  return new URLSearchParams(window.location.search).get("qaGreenhouseRouteSupply") === "1";
}

function getLocalQaGreenhouseIrrigation(): boolean {
  if (!import.meta.env.DEV || !["127.0.0.1", "localhost"].includes(window.location.hostname)) {
    return false;
  }

  return new URLSearchParams(window.location.search).get("qaGreenhouseIrrigation") === "1";
}

function getLocalQaGreenhouseMist(): boolean {
  if (!import.meta.env.DEV || !["127.0.0.1", "localhost"].includes(window.location.hostname)) {
    return false;
  }

  return new URLSearchParams(window.location.search).get("qaGreenhouseMist") === "1";
}

function getLocalQaReset(): boolean {
  if (!import.meta.env.DEV || !["127.0.0.1", "localhost"].includes(window.location.hostname)) {
    return false;
  }

  return new URLSearchParams(window.location.search).get("qaReset") === "1";
}

function getLocalQaExpeditionActive(): boolean {
  if (!import.meta.env.DEV || !["127.0.0.1", "localhost"].includes(window.location.hostname)) {
    return false;
  }

  return new URLSearchParams(window.location.search).get("qaExpeditionActive") === "1";
}

function getLocalQaExpeditionReady(): boolean {
  if (!import.meta.env.DEV || !["127.0.0.1", "localhost"].includes(window.location.hostname)) {
    return false;
  }

  return new URLSearchParams(window.location.search).get("qaExpeditionReady") === "1";
}

function getLocalQaHarvestReveal(): boolean {
  if (!import.meta.env.DEV || !["127.0.0.1", "localhost"].includes(window.location.hostname)) {
    return false;
  }

  return new URLSearchParams(window.location.search).get("qaHarvestReveal") === "1";
}

function getLocalQaProductionReady(): boolean {
  if (!import.meta.env.DEV || !["127.0.0.1", "localhost"].includes(window.location.hostname)) {
    return false;
  }

  return new URLSearchParams(window.location.search).get("qaProductionReady") === "1";
}

function getLocalQaResearchReady(): boolean {
  if (!import.meta.env.DEV || !["127.0.0.1", "localhost"].includes(window.location.hostname)) {
    return false;
  }

  return new URLSearchParams(window.location.search).get("qaResearchReady") === "1";
}

function getLocalQaResearchComplete(): boolean {
  if (!import.meta.env.DEV || !["127.0.0.1", "localhost"].includes(window.location.hostname)) {
    return false;
  }

  return new URLSearchParams(window.location.search).get("qaResearchComplete") === "1";
}

function getLocalQaResearchExpeditionReady(): boolean {
  if (!import.meta.env.DEV || !["127.0.0.1", "localhost"].includes(window.location.hostname)) {
    return false;
  }

  return new URLSearchParams(window.location.search).get("qaResearchExpeditionReady") === "1";
}

function getLocalQaResearchExpeditionClaimReady(): boolean {
  if (!import.meta.env.DEV || !["127.0.0.1", "localhost"].includes(window.location.hostname)) {
    return false;
  }

  return new URLSearchParams(window.location.search).get("qaResearchExpeditionClaimReady") === "1";
}

function getLocalQaGreenhouseLunarClaimReady(): boolean {
  if (!import.meta.env.DEV || !["127.0.0.1", "localhost"].includes(window.location.hostname)) {
    return false;
  }

  return new URLSearchParams(window.location.search).get("qaGreenhouseLunarClaimReady") === "1";
}

function getLocalQaGreenhouseLunarSeedPlantReady(): boolean {
  if (!import.meta.env.DEV || !["127.0.0.1", "localhost"].includes(window.location.hostname)) {
    return false;
  }

  return new URLSearchParams(window.location.search).get("qaGreenhouseLunarSeedPlantReady") === "1";
}

function getLocalQaLunarSeedReady(): boolean {
  if (!import.meta.env.DEV || !["127.0.0.1", "localhost"].includes(window.location.hostname)) {
    return false;
  }

  return new URLSearchParams(window.location.search).get("qaLunarSeedReady") === "1";
}

function getLocalQaLunarSeedReadyToHarvest(): boolean {
  if (!import.meta.env.DEV || !["127.0.0.1", "localhost"].includes(window.location.hostname)) {
    return false;
  }

  return new URLSearchParams(window.location.search).get("qaLunarSeedReadyToHarvest") === "1";
}

function getLocalQaLunarOrderReady(): boolean {
  if (!import.meta.env.DEV || !["127.0.0.1", "localhost"].includes(window.location.hostname)) {
    return false;
  }

  return new URLSearchParams(window.location.search).get("qaLunarOrderReady") === "1";
}

function getLocalDebugMode() {
  if (typeof window === "undefined") {
    return false;
  }

  const params = new URLSearchParams(window.location.search);
  return params.get("debug") === "1" || params.get("qaDebug") === "1";
}

function getLocalQaTab(): MainTab | null {
  if (!import.meta.env.DEV || !["127.0.0.1", "localhost"].includes(window.location.hostname)) {
    return null;
  }

  const value = new URLSearchParams(window.location.search).get("qaTab");
  return MAIN_TABS.some((tab) => tab.id === value) ? (value as MainTab) : null;
}

function getLocalQaSpriteState(): "growing" | "ready" | null {
  if (!import.meta.env.DEV || !["127.0.0.1", "localhost"].includes(window.location.hostname)) {
    return null;
  }

  const value = new URLSearchParams(window.location.search).get("qaSpriteState");
  return value === "growing" || value === "ready" ? value : null;
}

function createSpriteQaSave(spriteState: "growing" | "ready"): PlayerSave {
  const save = createNewSave();
  const plantedAt = new Date(Date.now() - (spriteState === "ready" ? 35_000 : 8_000)).toISOString();

  return {
    ...save,
    leaves: 10,
    selectedStarterSeedId: "seed_herb_001",
    plotCount: 1,
    plots: save.plots.map((plot) =>
      plot.index === 0
        ? {
            ...plot,
            seedId: "seed_herb_001",
            plantedAt,
            tapProgressSeconds: 0,
            harvestedCreatureId: undefined
          }
        : plot
    ),
    lastSeenAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

function createOfflineQaSave(
  minutesAway: number,
  includeLunarGuardian = false,
  includeGreenhouseShelf = false,
  includeGreenhouseStorage = false,
  includeGreenhouseRoute = false,
  includeGreenhouseRouteSupply = false,
  includeGreenhouseIrrigation = false,
  includeGreenhouseMist = false
): PlayerSave {
  const lastSeen = new Date(Date.now() - minutesAway * 60 * 1000);
  const save = createNewSave(lastSeen);
  const hasGreenhouseShelf =
    includeGreenhouseShelf ||
    includeGreenhouseStorage ||
    includeGreenhouseRoute ||
    includeGreenhouseRouteSupply ||
    includeGreenhouseIrrigation ||
    includeGreenhouseMist;
  const hasGreenhouseStorage =
    includeGreenhouseStorage || includeGreenhouseRoute || includeGreenhouseRouteSupply || includeGreenhouseIrrigation || includeGreenhouseMist;
  const hasGreenhouseRoute = includeGreenhouseRoute || includeGreenhouseRouteSupply || includeGreenhouseIrrigation || includeGreenhouseMist;
  const hasGreenhouseRouteSupply = includeGreenhouseRouteSupply || includeGreenhouseIrrigation || includeGreenhouseMist;
  const hasGreenhouseIrrigation = includeGreenhouseIrrigation || includeGreenhouseMist;
  const discoveredCreatureIds = includeLunarGuardian
    ? ["creature_herb_common_001", LUNAR_REWARD_CREATURE_ID]
    : includeGreenhouseMist
      ? ["creature_herb_common_001", "creature_herb_common_002"]
      : ["creature_herb_common_001"];

  return {
    ...save,
    leaves: 10,
    selectedStarterSeedId: "seed_herb_001",
    unlockedSeedIds: includeLunarGuardian
      ? Array.from(new Set([...save.unlockedSeedIds, LUNAR_REWARD_SEED_ID]))
      : save.unlockedSeedIds,
    discoveredCreatureIds,
    claimedAlbumMilestoneIds: ["album_1"],
    plotCount: hasGreenhouseRoute ? GREENHOUSE_ROUTE_PLOT_COUNT : 2,
    greenhouseFacilityLevel: hasGreenhouseShelf ? GREENHOUSE_FACILITY_MAX_LEVEL : save.greenhouseFacilityLevel,
    greenhouseStorageLevel: hasGreenhouseStorage ? GREENHOUSE_STORAGE_MAX_LEVEL : save.greenhouseStorageLevel,
    greenhouseRouteLevel: hasGreenhouseRoute ? GREENHOUSE_ROUTE_MAX_LEVEL : save.greenhouseRouteLevel,
    greenhouseIrrigationLevel: hasGreenhouseIrrigation ? GREENHOUSE_IRRIGATION_MAX_LEVEL : save.greenhouseIrrigationLevel,
    greenhouseMistLevel: includeGreenhouseMist ? GREENHOUSE_MIST_MAX_LEVEL : save.greenhouseMistLevel,
    materials: includeGreenhouseMist ? 0 : includeGreenhouseIrrigation ? 0 : hasGreenhouseRouteSupply ? 1 : hasGreenhouseStorage ? 0 : hasGreenhouseShelf ? 1 : save.materials,
    pollen: includeGreenhouseMist ? 0 : includeGreenhouseIrrigation ? 0 : hasGreenhouseRouteSupply ? 4 : save.pollen,
    idleProduction: hasGreenhouseShelf
      ? {
          pendingLeaves: 0,
          lastTickAt: lastSeen.toISOString(),
          orderProgress: {
            [FIRST_ORDER.id]: FIRST_ORDER.requiredLeaves,
            [SECOND_ORDER.id]: SECOND_ORDER.requiredLeaves,
            [GREENHOUSE_ORDER.id]: GREENHOUSE_ORDER.requiredLeaves,
            ...(hasGreenhouseRoute ? { [GREENHOUSE_EXPANSION_ORDER.id]: GREENHOUSE_EXPANSION_ORDER.requiredLeaves } : {}),
            ...(hasGreenhouseRouteSupply ? { [GREENHOUSE_ROUTE_SUPPLY_ORDER.id]: GREENHOUSE_ROUTE_SUPPLY_ORDER.requiredLeaves } : {}),
            ...(includeGreenhouseMist ? { [GREENHOUSE_IRRIGATION_ORDER.id]: GREENHOUSE_IRRIGATION_ORDER.requiredLeaves } : {})
          },
          completedOrderIds: [
            FIRST_ORDER.id,
            SECOND_ORDER.id,
            GREENHOUSE_ORDER.id,
            ...(hasGreenhouseRoute ? [GREENHOUSE_EXPANSION_ORDER.id] : []),
            ...(hasGreenhouseRouteSupply ? [GREENHOUSE_ROUTE_SUPPLY_ORDER.id] : []),
            ...(includeGreenhouseMist ? [GREENHOUSE_IRRIGATION_ORDER.id] : [])
          ]
        }
      : save.idleProduction,
    lastSeenAt: lastSeen.toISOString(),
    updatedAt: lastSeen.toISOString()
  };
}

function createHarvestRevealQaSave(): PlayerSave {
  const now = new Date();
  const save = createNewSave(now);

  return {
    ...save,
    leaves: 20,
    selectedStarterSeedId: "seed_herb_001",
    discoveredCreatureIds: ["creature_herb_common_001"],
    claimedAlbumMilestoneIds: ["album_1"],
    plotCount: 2,
    lastSeenAt: now.toISOString(),
    updatedAt: now.toISOString()
  };
}

function createProductionReadyQaSave(): PlayerSave {
  const now = new Date();
  const save = createNewSave(now);

  return {
    ...save,
    leaves: 20,
    pollen: 0,
    selectedStarterSeedId: "seed_herb_001",
    discoveredCreatureIds: ["creature_herb_common_001"],
    claimedAlbumMilestoneIds: ["album_1"],
    plotCount: 2,
    idleProduction: {
      pendingLeaves: 14,
      lastTickAt: now.toISOString(),
      orderProgress: {},
      completedOrderIds: []
    },
    lastSeenAt: now.toISOString(),
    updatedAt: now.toISOString()
  };
}

function createResearchReadyQaSave(): PlayerSave {
  const now = new Date();
  const save = createNewSave(now);

  return {
    ...save,
    leaves: 40,
    pollen: 0,
    selectedStarterSeedId: "seed_herb_001",
    discoveredCreatureIds: ["creature_herb_common_001"],
    claimedAlbumMilestoneIds: ["album_1"],
    plotCount: 2,
    productionBoostLevel: 1,
    researchLevel: 0,
    idleProduction: {
      pendingLeaves: 0,
      lastTickAt: now.toISOString(),
      orderProgress: {
        [FIRST_ORDER.id]: FIRST_ORDER.requiredLeaves,
        [SECOND_ORDER.id]: SECOND_ORDER.requiredLeaves
      },
      completedOrderIds: [FIRST_ORDER.id]
    },
    lastSeenAt: now.toISOString(),
    updatedAt: now.toISOString()
  };
}

function createResearchCompleteQaSave(): PlayerSave {
  const now = new Date();
  const save = createNewSave(now);

  return {
    ...save,
    leaves: 28,
    pollen: 0,
    selectedStarterSeedId: "seed_herb_001",
    discoveredCreatureIds: ["creature_herb_common_001"],
    claimedAlbumMilestoneIds: ["album_1"],
    plotCount: 2,
    productionBoostLevel: 1,
    researchLevel: 1,
    idleProduction: {
      pendingLeaves: 0,
      lastTickAt: now.toISOString(),
      orderProgress: {
        [FIRST_ORDER.id]: FIRST_ORDER.requiredLeaves,
        [SECOND_ORDER.id]: SECOND_ORDER.requiredLeaves
      },
      completedOrderIds: [FIRST_ORDER.id, SECOND_ORDER.id]
    },
    lastSeenAt: now.toISOString(),
    updatedAt: now.toISOString()
  };
}

function createResearchExpeditionReadyQaSave(): PlayerSave {
  const save = createResearchCompleteQaSave();
  return {
    ...save,
    leaves: 72,
    materials: 1,
    discoveredCreatureIds: ["creature_herb_common_001", "creature_herb_common_002"],
    seedInventory: {
      ...save.seedInventory,
      seed_herb_002: 0
    },
    lastSeenAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

function createResearchExpeditionClaimReadyQaSave(): PlayerSave {
  const now = new Date();
  const save = createResearchExpeditionReadyQaSave();
  const expedition = content.expeditions.find((item) => item.id === RESEARCH_EXPEDITION_ID);
  const durationSeconds = expedition?.durationSeconds ?? 3600;
  const startedAt = new Date(now.getTime() - (durationSeconds + 15) * 1000);

  return {
    ...save,
    leaves: 72,
    materials: 1,
    activeExpedition: {
      expeditionId: RESEARCH_EXPEDITION_ID,
      creatureIds: ["creature_herb_common_001", "creature_herb_common_002"],
      startedAt: startedAt.toISOString(),
      durationSeconds,
      claimed: false
    },
    lastSeenAt: now.toISOString(),
    updatedAt: now.toISOString()
  };
}

function createGreenhouseLunarClaimReadyQaSave(): PlayerSave {
  const now = new Date();
  const save = createOfflineQaSave(60, false, false, false, false, false, false, true);
  const expedition = content.expeditions.find((item) => item.id === RESEARCH_EXPEDITION_ID);
  const durationSeconds = expedition?.durationSeconds ?? 3600;
  const startedAt = new Date(now.getTime() - (durationSeconds + 15) * 1000);

  return {
    ...save,
    leaves: 175,
    materials: 1,
    pollen: 2,
    idleProduction: {
      ...save.idleProduction,
      orderProgress: {
        ...save.idleProduction.orderProgress,
        [GREENHOUSE_MIST_RETURN_ORDER.id]: GREENHOUSE_MIST_RETURN_ORDER.requiredLeaves
      },
      completedOrderIds: Array.from(new Set([...save.idleProduction.completedOrderIds, GREENHOUSE_MIST_RETURN_ORDER.id]))
    },
    activeExpedition: {
      expeditionId: RESEARCH_EXPEDITION_ID,
      source: "greenhouse_mist",
      creatureIds: ["creature_herb_common_001", "creature_herb_common_002"],
      startedAt: startedAt.toISOString(),
      durationSeconds,
      claimed: false
    },
    lastSeenAt: now.toISOString(),
    updatedAt: now.toISOString()
  };
}

function createGreenhouseLunarSeedPlantReadyQaSave(): PlayerSave {
  const now = new Date();
  const save = createLunarSeedReadyQaSave();

  return {
    ...save,
    leaves: 595,
    materials: 3,
    pollen: 2,
    discoveredCreatureIds: ["creature_herb_common_001", "creature_herb_common_002"],
    claimedAlbumMilestoneIds: ["album_1"],
    plotCount: GREENHOUSE_ROUTE_PLOT_COUNT,
    greenhouseFacilityLevel: GREENHOUSE_FACILITY_MAX_LEVEL,
    greenhouseStorageLevel: GREENHOUSE_STORAGE_MAX_LEVEL,
    greenhouseRouteLevel: GREENHOUSE_ROUTE_MAX_LEVEL,
    greenhouseIrrigationLevel: GREENHOUSE_IRRIGATION_MAX_LEVEL,
    greenhouseMistLevel: GREENHOUSE_MIST_MAX_LEVEL,
    lunarRewardSource: "greenhouse_mist",
    seedInventory: {
      ...save.seedInventory,
      [LUNAR_REWARD_SEED_ID]: 0
    },
    idleProduction: {
      pendingLeaves: 0,
      lastTickAt: now.toISOString(),
      orderProgress: {
        [FIRST_ORDER.id]: FIRST_ORDER.requiredLeaves,
        [SECOND_ORDER.id]: SECOND_ORDER.requiredLeaves,
        [GREENHOUSE_ORDER.id]: GREENHOUSE_ORDER.requiredLeaves,
        [GREENHOUSE_EXPANSION_ORDER.id]: GREENHOUSE_EXPANSION_ORDER.requiredLeaves,
        [GREENHOUSE_ROUTE_SUPPLY_ORDER.id]: GREENHOUSE_ROUTE_SUPPLY_ORDER.requiredLeaves,
        [GREENHOUSE_IRRIGATION_ORDER.id]: GREENHOUSE_IRRIGATION_ORDER.requiredLeaves,
        [GREENHOUSE_MIST_RETURN_ORDER.id]: GREENHOUSE_MIST_RETURN_ORDER.requiredLeaves
      },
      completedOrderIds: [
        FIRST_ORDER.id,
        SECOND_ORDER.id,
        GREENHOUSE_ORDER.id,
        GREENHOUSE_EXPANSION_ORDER.id,
        GREENHOUSE_ROUTE_SUPPLY_ORDER.id,
        GREENHOUSE_IRRIGATION_ORDER.id,
        GREENHOUSE_MIST_RETURN_ORDER.id
      ]
    },
    activeExpedition: undefined,
    lastSeenAt: now.toISOString(),
    updatedAt: now.toISOString()
  };
}

function createLunarSeedReadyQaSave(): PlayerSave {
  const now = new Date();
  const save = createResearchExpeditionReadyQaSave();

  return {
    ...save,
    leaves: 492,
    materials: 3,
    unlockedSeedIds: Array.from(new Set([...save.unlockedSeedIds, LUNAR_REWARD_SEED_ID])),
    seedInventory: {
      ...save.seedInventory,
      [LUNAR_REWARD_SEED_ID]: 0
    },
    activeExpedition: undefined,
    lastSeenAt: now.toISOString(),
    updatedAt: now.toISOString()
  };
}

function createLunarSeedReadyToHarvestQaSave(): PlayerSave {
  const now = new Date();
  const save = createLunarSeedReadyQaSave();
  const plantedAt = new Date(now.getTime() - 11 * 60 * 1000).toISOString();

  return {
    ...save,
    leaves: 192,
    seedInventory: {
      ...save.seedInventory,
      [LUNAR_REWARD_SEED_ID]: 0
    },
    plots: save.plots.map((plot) =>
      plot.index === 1
        ? {
            ...plot,
            seedId: LUNAR_REWARD_SEED_ID,
            plantedAt,
            tapProgressSeconds: 0,
            harvestedCreatureId: undefined
          }
        : plot
    ),
    lastSeenAt: now.toISOString(),
    updatedAt: now.toISOString()
  };
}

function createLunarOrderReadyQaSave(): PlayerSave {
  const now = new Date();
  const save = createLunarSeedReadyQaSave();

  return {
    ...save,
    leaves: 244,
    pollen: 2,
    materials: 3,
    discoveredCreatureIds: Array.from(new Set([...save.discoveredCreatureIds, LUNAR_REWARD_CREATURE_ID])),
    plots: save.plots.map((plot) =>
      plot.index === 1
        ? {
            ...plot,
            seedId: undefined,
            source: undefined,
            plantedAt: undefined,
            tapProgressSeconds: 0,
            harvestedCreatureId: LUNAR_REWARD_CREATURE_ID
          }
        : plot
    ),
    idleProduction: {
      ...save.idleProduction,
      pendingLeaves: 0,
      lastTickAt: now.toISOString(),
      orderProgress: {
        ...save.idleProduction.orderProgress,
        [LUNAR_GUARDIAN_ORDER.id]: LUNAR_GUARDIAN_ORDER.requiredLeaves
      },
      completedOrderIds: save.idleProduction.completedOrderIds.filter((orderId) => orderId !== LUNAR_GUARDIAN_ORDER.id)
    },
    lastSeenAt: now.toISOString(),
    updatedAt: now.toISOString()
  };
}

function createExpeditionActiveQaSave(): PlayerSave {
  return createExpeditionQaSave(false);
}

function createExpeditionReadyQaSave(): PlayerSave {
  return createExpeditionQaSave(true);
}

function createExpeditionQaSave(ready: boolean): PlayerSave {
  const now = new Date();
  const save = createNewSave(now);
  const expedition = content.expeditions.find((item) => item.id === FIRST_EXPEDITION_ID);
  const durationSeconds = expedition?.durationSeconds ?? 300;
  const elapsedSeconds = ready ? durationSeconds + 5 : Math.min(90, Math.max(5, durationSeconds - 60));
  const startedAt = new Date(now.getTime() - elapsedSeconds * 1000);

  return {
    ...save,
    leaves: 20,
    selectedStarterSeedId: "seed_herb_001",
    discoveredCreatureIds: ["creature_herb_common_001"],
    claimedAlbumMilestoneIds: ["album_1"],
    plotCount: 2,
    activeExpedition: {
      expeditionId: FIRST_EXPEDITION_ID,
      creatureIds: ["creature_herb_common_001"],
      startedAt: startedAt.toISOString(),
      durationSeconds,
      claimed: false
    },
    lastSeenAt: now.toISOString(),
    updatedAt: now.toISOString()
  };
}
