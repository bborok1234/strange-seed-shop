import { useEffect, useMemo, useState } from "react";
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

const FIRST_UPGRADE_COST = 25;
const FIRST_EXPEDITION_ID = "quick_scout";
const OFFLINE_CAP_SECONDS = 8 * 60 * 60;
const MIN_REPEAT_SEED_COST = 10;
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
  const [activeTab, setActiveTab] = useState<MainTab>(() => getLocalQaTab() ?? "garden");
  const [rewardPulse, setRewardPulse] = useState<number | null>(null);
  const [harvestReveal, setHarvestReveal] = useState<CreatureDefinition | null>(null);
  const [brokenAssetIds, setBrokenAssetIds] = useState<Set<string>>(() => new Set());

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
    const existingSave = qaSpriteState
      ? createSpriteQaSave(qaSpriteState)
      : qaHarvestReveal
        ? createHarvestRevealQaSave()
        : getLocalQaExpeditionReady()
          ? createExpeditionReadyQaSave()
          : qaOfflineMinutes
            ? createOfflineQaSave(qaOfflineMinutes)
            : localSaveStore.load();
    const nextSave = existingSave ?? createNewSave();
    const offlineLeaves = calculateOfflineLeaves(nextSave, Date.now());
    if (offlineLeaves > 0) {
      nextSave.leaves += offlineLeaves;
      nextSave.lastSeenAt = new Date().toISOString();
      nextSave.updatedAt = nextSave.lastSeenAt;
      setOfflineMessage(`자리를 비운 동안 잎 ${offlineLeaves}개를 모았습니다.`);
      triggerRewardPulse();
      trackEvent("offline_reward_claimed", { leaves: offlineLeaves });
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
  const firstAlbumRewardReady =
    save && save.discoveredCreatureIds.length > 0 && !save.claimedAlbumMilestoneIds.includes("album_1");
  const expeditionReady = save?.activeExpedition
    ? isExpeditionReady(save.activeExpedition, now) && !save.activeExpedition.claimed
    : false;
  const visibleMissions = save ? content.missions : [];
  const availableSeeds = save ? content.seeds.filter((seed) => save.unlockedSeedIds.includes(seed.id)).slice(0, 3) : [];
  const hasOpenPlot = save ? save.plots.some((plot) => plot.index < save.plotCount && !plot.seedId) : false;
  const showSeedShop = Boolean(save?.selectedStarterSeedId) && !firstAlbumRewardReady;
  const nextAction = getNextAction(save, activePlot, firstAlbumRewardReady);
  const nextCreatureGoal = useMemo(() => getNextCreatureGoal(save), [save]);
  const visibleSeedInventorySeeds =
    nextCreatureGoal && !availableSeeds.some((seed) => seed.id === nextCreatureGoal.seed.id)
      ? [nextCreatureGoal.seed, ...availableSeeds]
      : availableSeeds;
  const seedInventorySeeds = nextCreatureGoal
    ? [...visibleSeedInventorySeeds].sort(
        (first, second) => Number(second.id === nextCreatureGoal.seed.id) - Number(first.id === nextCreatureGoal.seed.id)
      )
    : visibleSeedInventorySeeds;
  const gardenViewModel = useMemo(() => buildGardenPlayfieldViewModel(save, now), [save, now]);
  const playfieldAssets = useMemo(() => getPlayfieldAnimationAssets(manifest), [manifest]);

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
    commit((draft) => {
      const costLeaves = getSeedPurchaseCost(seed);
      if (!draft.unlockedSeedIds.includes(seed.id) || draft.leaves < costLeaves) {
        return;
      }

      draft.leaves -= costLeaves;
      draft.seedInventory[seed.id] = (draft.seedInventory[seed.id] ?? 0) + 1;
      advanceMission(draft, "daily_buy_3_seeds");
      trackEvent("seed_purchased", { seedId: seed.id, costLeaves });
    });
  }

  function plantOwnedSeed(seed: SeedDefinition) {
    commit((draft) => {
      if ((draft.seedInventory[seed.id] ?? 0) <= 0) {
        return;
      }

      const plot = draft.plots.find((candidate) => candidate.index < draft.plotCount && !candidate.seedId);
      if (!plot) {
        return;
      }

      draft.seedInventory[seed.id] -= 1;
      draft.plots[plot.index] = plantSeedInPlot(plot, seed);
      trackEvent("seed_planted", { seedId: seed.id, plotIndex: plot.index, source: "inventory" });
    });
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

    commit((draft) => {
      const plot = draft.plots[plotIndex];
      const seed = getSeed(plot.seedId);
      if (!seed || !isPlotReady(plot, seed, now)) {
        return;
      }

      const creatureId = seed.creaturePool[0];
      draft.leaves += seed.baseHarvestLeaves;
      plot.harvestedCreatureId = creatureId;
      plot.seedId = undefined;
      plot.plantedAt = undefined;
      plot.tapProgressSeconds = 0;

      if (!draft.discoveredCreatureIds.includes(creatureId)) {
        draft.discoveredCreatureIds.push(creatureId);
      }
      advanceMission(draft, "tutorial_harvest_first_creature");
      advanceMission(draft, "daily_harvest_5");
      trackEvent("creature_harvested", { seedId: seed.id, creatureId, leaves: seed.baseHarvestLeaves });
    });
    if (harvestedCreature) {
      setHarvestReveal(harvestedCreature);
    }
    triggerRewardPulse();
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

  function startExpedition() {
    commit((draft) => {
      const firstCreatureId = draft.discoveredCreatureIds[0];
      if (!firstCreatureId || draft.activeExpedition) {
        return;
      }

      const expedition = content.expeditions.find((item) => item.id === FIRST_EXPEDITION_ID);
      if (!expedition) {
        return;
      }

      draft.activeExpedition = {
        expeditionId: expedition.id,
        creatureIds: [firstCreatureId],
        startedAt: new Date().toISOString(),
        durationSeconds: expedition.durationSeconds,
        claimed: false
      };
      advanceMission(draft, "daily_start_expedition");
      trackEvent("expedition_started", { expeditionId: expedition.id, creatureId: firstCreatureId });
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
      draft.leaves += expedition?.rewardLeaves ?? 0;
      draft.materials += expedition?.rewardMaterials ?? 0;
      trackEvent("expedition_claimed", {
        expeditionId: draft.activeExpedition.expeditionId,
        leaves: expedition?.rewardLeaves ?? 0,
        materials: expedition?.rewardMaterials ?? 0
      });
      draft.activeExpedition = undefined;
    });
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

  return (
    <main className="app-shell">
      <section
        className="garden-stage"
        style={backgroundPath ? { backgroundImage: `url(${backgroundPath})` } : undefined}
      >
        <div className="top-bar">
          <div>
            <p className="eyebrow">mobile garden HUD</p>
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

        <section className="garden-panel" aria-label="정원">
          <GardenPlayfieldHost onAction={handlePlayfieldAction} playfieldAssets={playfieldAssets} viewModel={gardenViewModel} />

          <aside className="starter-panel">
            <p className="panel-label">다음 행동</p>
            <h2>{nextAction.title}</h2>
            <p className="action-copy">{nextAction.body}</p>
            {nextCreatureGoal && (
              <article className="next-creature-card" aria-label="다음 생명체 수집 목표">
                <div className="next-creature-portrait">{renderAsset(nextCreatureGoal.creature.assetId, "?")}</div>
                <div>
                  <p className="panel-label">다음에 만날 아이</p>
                  <strong>{nextCreatureGoal.creature.name}</strong>
                  <span>힌트: {nextCreatureGoal.creature.albumHint}</span>
                  <small>
                    {nextCreatureGoal.seed.name}에서 만날 수 있어요 · 도감 {nextCreatureGoal.discoveredCount}/{nextCreatureGoal.totalCount}
                  </small>
                </div>
              </article>
            )}
            {!save?.selectedStarterSeedId &&
              starterSeeds.map((seed) => (
                <button className="seed-row" key={seed.id} onClick={() => selectStarter(seed)} type="button">
                  {renderAsset(seed.iconAssetId, "씨앗")}
                  <span>{seed.name}</span>
                  <strong>{seed.baseGrowthSeconds}s</strong>
                </button>
              ))}
            {save && showSeedShop && (
              <div className="seed-shop-list">
                {seedInventorySeeds.map((seed) => {
                  const owned = save.seedInventory[seed.id] ?? 0;
                  const costLeaves = getSeedPurchaseCost(seed);
                  const leafShortfall = Math.max(0, costLeaves - save.leaves);
                  const previewCreature = getDeterministicCreatureForSeed(seed);
                  const previewDiscovered = previewCreature ? save.discoveredCreatureIds.includes(previewCreature.id) : false;
                  const targetSeed = seed.id === nextCreatureGoal?.seed.id;

                  return (
                    <article className={targetSeed ? "seed-shop-row seed-shop-row-target" : "seed-shop-row"} key={seed.id}>
                      {renderAsset(seed.iconAssetId, "씨앗")}
                      <div>
                        <strong>{seed.name}</strong>
                        <span>보유 {owned}개</span>
                        {targetSeed && <span className="seed-target-badge">다음 발견</span>}
                        {leafShortfall > 0 && <span className="seed-shortfall-note">{leafShortfall} 잎 더 모으면 구매 가능</span>}
                        {previewCreature && (
                          <small className="seed-creature-preview">
                            만날 아이: {previewCreature.name} · {previewDiscovered ? "발견함" : "미발견"}
                          </small>
                        )}
                      </div>
                      <button disabled={save.leaves < costLeaves} onClick={() => buySeed(seed)} type="button">
                        {leafShortfall > 0 ? `${leafShortfall} 잎 부족` : `구매 ${costLeaves}`}
                      </button>
                      <button disabled={owned <= 0 || !hasOpenPlot} onClick={() => plantOwnedSeed(seed)} type="button">
                        심기
                      </button>
                    </article>
                  );
                })}
              </div>
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
            <button
              className="primary-action"
              disabled={!save || save.plotCount >= 2 || save.leaves < FIRST_UPGRADE_COST}
              onClick={buyFirstUpgrade}
              type="button"
            >
              두 번째 밭 열기 {FIRST_UPGRADE_COST} 잎
            </button>
          </aside>
        </section>

        <nav className="bottom-tabs" aria-label="주요 화면">
          {MAIN_TABS.map((tab) => (
            <button
              aria-pressed={activeTab === tab.id}
              className={activeTab === tab.id ? "tab-active" : undefined}
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
          </nav>
      </section>

      {harvestReveal && (
        <section className="harvest-reveal" aria-live="polite" aria-label="첫 생명체 획득">
          <div className="harvest-reveal-card">
            {renderAsset(harvestReveal.assetId, "생명체")}
            <p className="panel-label">새 생명체 소유</p>
            <h2>{harvestReveal.name}</h2>
            <p>{getCreatureRoleLabel(harvestReveal.role)} · {harvestReveal.albumHint}</p>
            <blockquote>“{harvestReveal.greeting}”</blockquote>
            {nextCreatureGoal && (
              <article className="reveal-next-goal" aria-label="수확 후 다음 목표">
                <p className="panel-label">다음에 만날 아이</p>
                <strong>{nextCreatureGoal.creature.name}</strong>
                <span>{nextCreatureGoal.seed.name}을 심으면 만날 수 있어요.</span>
              </article>
            )}
            <button className="primary-action" onClick={() => setHarvestReveal(null)} type="button">
              도감에 기록하기
            </button>
          </div>
        </section>
      )}

      <section className={`dev-panel tab-${activeTab}`} aria-label="스캐폴드 검증 정보">
        <h2>{MAIN_TABS.find((tab) => tab.id === activeTab)?.label}</h2>
        <ul className="status-list">
          <li>asset {manifest ? Object.keys(manifest.assets).length : "loading"}</li>
          <li>save {save ? "ready" : "loading"}</li>
          <li>events {readEvents().length}</li>
          <li>runtime image generation disabled</li>
        </ul>

        {activeTab === "garden" && (
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
            <h3>씨앗 주머니</h3>
            {nextCreatureGoal && (
              <article className="seed-goal-banner" aria-label="다음 도감 목표 씨앗">
                {renderAsset(nextCreatureGoal.seed.iconAssetId, "씨앗")}
                <div>
                  <p className="panel-label">도감 목표 씨앗</p>
                  <strong>{nextCreatureGoal.seed.name}</strong>
                  <span>
                    {getRarityLabel(nextCreatureGoal.creature.rarity)} · {nextCreatureGoal.creature.name}을 만날 차례예요.
                  </span>
                  <button className="seed-goal-action-button" onClick={() => setActiveTab("garden")} type="button">
                    정원에서 심기
                  </button>
                </div>
              </article>
            )}
            <div className="seed-inventory-list">
              {seedInventorySeeds.map((seed) => {
                const previewCreature = getDeterministicCreatureForSeed(seed);
                const previewDiscovered = previewCreature ? (save?.discoveredCreatureIds.includes(previewCreature.id) ?? false) : false;
                const targetSeed = seed.id === nextCreatureGoal?.seed.id;

                return (
                  <article className={targetSeed ? "seed-inventory-row seed-inventory-row-target" : "seed-inventory-row"} key={seed.id}>
                    {renderAsset(seed.iconAssetId, "씨앗")}
                    <div>
                      <strong>{seed.name}</strong>
                      <span>보유 {save?.seedInventory[seed.id] ?? 0}개</span>
                      {targetSeed && <span className="seed-target-badge">다음 발견</span>}
                      {previewCreature && (
                        <small className="seed-creature-preview">
                          만날 아이: {previewCreature.name} · {previewDiscovered ? "발견함" : "미발견"}
                        </small>
                      )}
                    </div>
                    <span>{seed.baseGrowthSeconds}s</span>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {activeTab === "album" && (
          <section className="tab-panel album-strip" aria-label="도감">
            <h3>
              발견한 생명체 {albumDiscoveredCount}/{content.creatures.length}
            </h3>
            <p className="album-progress-copy">미발견 슬롯의 단서를 따라 씨앗을 심고 도감 칸을 채워보세요.</p>
            {nextCreatureGoal && (
              <button
                aria-label={`다음 발견 목표 ${nextCreatureGoal.creature.name}, ${nextCreatureGoal.seed.name} 씨앗 보러가기`}
                className="album-next-action-chip"
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
            {albumDiscoveredCount === 0 && <p>아직 없습니다. 씨앗을 키워 첫 생명체를 수확하세요.</p>}
            <div className="creature-list album-grid">
              {content.creatures.map((creature) => {
                const discovered = discoveredCreatureIds.has(creature.id);
                const seedHint = getSeedHintForCreature(creature);

                return (
                  <figure className={discovered ? "album-slot" : "album-slot album-slot-locked"} key={creature.id}>
                    {discovered ? (
                      renderAsset(creature.assetId, "생명체")
                    ) : (
                      <span className="album-silhouette" aria-hidden="true">
                        ?
                      </span>
                    )}
                    <figcaption>{discovered ? creature.name : "???"}</figcaption>
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
            <h3>원정</h3>
            {!save?.activeExpedition && (
              <button
                className="primary-action"
                disabled={!save || save.discoveredCreatureIds.length === 0}
                onClick={startExpedition}
                type="button"
              >
                틈새길 정찰 시작
              </button>
            )}
            {save?.activeExpedition && (
              <>
                <p>{expeditionReady ? "원정 완료" : "원정 진행 중"}</p>
                <button className="primary-action" disabled={!expeditionReady} onClick={claimExpedition} type="button">
                  원정 보상 받기
                </button>
              </>
            )}
          </section>
        )}

        {activeTab === "shop" && (
          <section className="tab-panel shop-panel" aria-label="상점">
            <h3>상점</h3>
            <div className="shop-list">
              {content.shopSurfaces.map((surface) => (
                <article className="shop-card" key={surface.id}>
                  {renderAsset(surface.assetId, "상품")}
                  <div>
                    <strong>{surface.name}</strong>
                    <span>{getShopSurfaceDescription(surface.id)}</span>
                    <small>{surface.realPayment ? "결제 준비 중" : "실제 결제 없음"}</small>
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
    </main>
  );
}

function getNextCreatureGoal(save: PlayerSave | null): NextCreatureGoal | null {
  if (!save || save.discoveredCreatureIds.length === 0) {
    return null;
  }

  const discovered = new Set(save.discoveredCreatureIds);
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

function getNextAction(save: PlayerSave | null, activePlot: PlotState | undefined, firstAlbumRewardReady: boolean | null) {
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
    return {
      title: seed ? `${seed.name} 성장 중` : "성장 중",
      body: "밭을 눌러 시간을 줄이고, 100%가 되면 수확하세요."
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

function buildGardenPlayfieldViewModel(save: PlayerSave | null, now: number): GardenPlayfieldViewModel {
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

    return {
      index: plot.index,
      state: progressPercent >= 100 ? "ready" : "growing",
      label: seed.name,
      seedId: seed.id,
      family: seed.family,
      progressPercent,
      secondsRemaining
    };
  });

  const readyCount = plots.filter((plot) => plot.state === "ready").length;
  const growingPlot = plots.find((plot) => plot.state === "growing");
  const openCount = plots.filter((plot) => plot.state === "empty").length;

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

function advanceMission(draft: PlayerSave, missionId: string, amount = 1) {
  const mission = content.missions.find((item) => item.id === missionId);
  if (!mission || draft.claimedMissionIds.includes(mission.id)) {
    return;
  }

  const current = draft.missionProgress[mission.id] ?? 0;
  draft.missionProgress[mission.id] = Math.min(mission.target, current + amount);
}

function getSeedPurchaseCost(seed: SeedDefinition): number {
  return Math.max(MIN_REPEAT_SEED_COST, seed.costLeaves);
}

function plantSeedInPlot(plot: PlotState, seed: SeedDefinition): PlotState {
  return {
    ...plot,
    seedId: seed.id,
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

function calculateOfflineLeaves(save: PlayerSave, now: number): number {
  const awaySeconds = Math.min(OFFLINE_CAP_SECONDS, Math.max(0, (now - new Date(save.lastSeenAt).getTime()) / 1000));

  if (awaySeconds < 15 * 60 || save.discoveredCreatureIds.length === 0) {
    return 0;
  }

  const baseRate = Math.max(0.03, save.discoveredCreatureIds.length * 0.02 + save.plotCount * 0.01);
  return Math.floor(awaySeconds * baseRate * 0.35);
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

function getLocalQaReset(): boolean {
  if (!import.meta.env.DEV || !["127.0.0.1", "localhost"].includes(window.location.hostname)) {
    return false;
  }

  return new URLSearchParams(window.location.search).get("qaReset") === "1";
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

function createOfflineQaSave(minutesAway: number): PlayerSave {
  const lastSeen = new Date(Date.now() - minutesAway * 60 * 1000);
  const save = createNewSave(lastSeen);

  return {
    ...save,
    leaves: 10,
    selectedStarterSeedId: "seed_herb_001",
    discoveredCreatureIds: ["creature_herb_common_001"],
    claimedAlbumMilestoneIds: ["album_1"],
    plotCount: 2,
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

function createExpeditionReadyQaSave(): PlayerSave {
  const now = new Date();
  const save = createNewSave(now);
  const expedition = content.expeditions.find((item) => item.id === FIRST_EXPEDITION_ID);
  const startedAt = new Date(now.getTime() - ((expedition?.durationSeconds ?? 300) + 5) * 1000);

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
      durationSeconds: expedition?.durationSeconds ?? 300,
      claimed: false
    },
    lastSeenAt: now.toISOString(),
    updatedAt: now.toISOString()
  };
}
