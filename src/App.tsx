import { useEffect, useMemo, useState } from "react";
import { getAssetPath, loadAssetManifest } from "./lib/assetManifest";
import { createNewSave, localSaveStore } from "./lib/persistence";
import { content, getStarterSeeds } from "./lib/content";
import { readEvents, trackEvent } from "./lib/analytics";
import type { AssetManifest, ExpeditionState, PlayerSave, PlotState, SeedDefinition } from "./types/game";

const FIRST_UPGRADE_COST = 25;
const FIRST_EXPEDITION_ID = "quick_scout";
const OFFLINE_CAP_SECONDS = 8 * 60 * 60;

export default function App() {
  const [manifest, setManifest] = useState<AssetManifest | null>(null);
  const [save, setSave] = useState<PlayerSave | null>(null);
  const [manifestError, setManifestError] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [offlineMessage, setOfflineMessage] = useState<string | null>(null);

  useEffect(() => {
    loadAssetManifest()
      .then(setManifest)
      .catch((error: unknown) => setManifestError(error instanceof Error ? error.message : "manifest load failed"));

    const qaOfflineMinutes = getLocalQaOfflineMinutes();
    const existingSave = qaOfflineMinutes ? createOfflineQaSave(qaOfflineMinutes) : localSaveStore.load();
    const nextSave = existingSave ?? createNewSave();
    const offlineLeaves = calculateOfflineLeaves(nextSave, Date.now());
    if (offlineLeaves > 0) {
      nextSave.leaves += offlineLeaves;
      nextSave.lastSeenAt = new Date().toISOString();
      nextSave.updatedAt = nextSave.lastSeenAt;
      setOfflineMessage(`자리를 비운 동안 잎 ${offlineLeaves}개를 모았습니다.`);
      trackEvent("offline_reward_claimed", { leaves: offlineLeaves });
    }
    localSaveStore.save(nextSave);
    setSave(nextSave);
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
  const activePlot = save?.plots.find((plot) => plot.seedId && !plot.harvestedCreatureId);
  const firstAlbumRewardReady =
    save && save.discoveredCreatureIds.length > 0 && !save.claimedAlbumMilestoneIds.includes("album_1");
  const expeditionReady = save?.activeExpedition
    ? isExpeditionReady(save.activeExpedition, now) && !save.activeExpedition.claimed
    : false;

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
      trackEvent("starter_seed_selected", { seedId: seed.id });
      trackEvent("seed_planted", { seedId: seed.id, plotIndex: 0 });
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
      trackEvent("creature_harvested", { seedId: seed.id, creatureId, leaves: seed.baseHarvestLeaves });
    });
  }

  function claimAlbumReward() {
    commit((draft) => {
      if (draft.claimedAlbumMilestoneIds.includes("album_1") || draft.discoveredCreatureIds.length === 0) {
        return;
      }

      draft.claimedAlbumMilestoneIds.push("album_1");
      draft.leaves += 25;
      trackEvent("album_reward_claimed", { milestoneId: "album_1", leaves: 25 });
    });
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
      trackEvent("expedition_started", { expeditionId: expedition.id, creatureId: firstCreatureId });
    });
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
  }

  return (
    <main className="app-shell">
      <section
        className="garden-stage"
        style={backgroundPath ? { backgroundImage: `url(${backgroundPath})` } : undefined}
      >
        <div className="top-bar">
          <div>
            <p className="eyebrow">Phase 0 Playable Loop</p>
            <h1>이상한 씨앗상회</h1>
          </div>
          <div className="currency-cluster" aria-label="현재 재화">
            <span>잎 {save?.leaves ?? 0}</span>
            <span>꽃가루 {save?.pollen ?? 0}</span>
            <span>재료 {save?.materials ?? 0}</span>
          </div>
        </div>

        {offlineMessage && <div className="toast">{offlineMessage}</div>}

        <section className="garden-panel" aria-label="정원">
          <div className="plot-grid" aria-label="밭 9칸">
            {save?.plots.map((plot) => {
              const seed = getSeed(plot.seedId);
              const ready = seed ? isPlotReady(plot, seed, now) : false;
              const progress = seed ? getGrowthProgress(plot, seed, now) : 0;
              const locked = plot.index >= (save?.plotCount ?? 1);

              return (
                <button
                  className={ready ? "plot plot-ready" : locked ? "plot plot-locked" : "plot"}
                  disabled={locked || !seed}
                  key={plot.index}
                  onClick={() => (ready ? harvest(plot.index) : tapGrowth(plot.index))}
                  type="button"
                >
                  {seed ? (
                    <>
                      <img alt="" src={getAssetPath(manifest, seed.iconAssetId)} />
                      <span>{ready ? "수확" : `${Math.round(progress)}%`}</span>
                    </>
                  ) : (
                    <span>{locked ? "잠김" : "빈 밭"}</span>
                  )}
                </button>
              );
            })}
          </div>

          <aside className="starter-panel">
            <p className="panel-label">{save?.selectedStarterSeedId ? "다음 행동" : "스타터 씨앗"}</p>
            {starterSeeds.map((seed) => (
              <button
                className="seed-row"
                disabled={Boolean(save?.selectedStarterSeedId)}
                key={seed.id}
                onClick={() => selectStarter(seed)}
                type="button"
              >
                <img alt="" src={getAssetPath(manifest, seed.iconAssetId)} />
                <span>{seed.name}</span>
                <strong>{seed.baseGrowthSeconds}s</strong>
              </button>
            ))}
            {activePlot && <p className="hint">밭을 누르면 성장이 빨라지고, 100%가 되면 수확합니다.</p>}
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
          <button type="button">정원</button>
          <button type="button">씨앗</button>
          <button type="button">도감</button>
          <button type="button">원정</button>
          <button type="button">상점</button>
        </nav>
      </section>

      <section className="dev-panel" aria-label="스캐폴드 검증 정보">
        <h2>플레이 루프 상태</h2>
        <ul>
          <li>manifest asset 수: {manifest ? Object.keys(manifest.assets).length : "loading"}</li>
          <li>seed config 수: {content.seeds.length}</li>
          <li>creature config 수: {content.creatures.length}</li>
          <li>local save: {save ? "ready" : "loading"}</li>
          <li>analytics events: {readEvents().length}</li>
          <li>runtime image generation: disabled</li>
        </ul>
        <section className="album-strip">
          <h3>발견한 생명체</h3>
          {discoveredCreatures.length === 0 ? (
            <p>아직 없습니다. 씨앗을 키워 첫 생명체를 수확하세요.</p>
          ) : (
            <div className="creature-list">
              {discoveredCreatures.map((creature) => (
                <figure key={creature.id}>
                  <img alt="" src={getAssetPath(manifest, creature.assetId)} />
                  <figcaption>{creature.name}</figcaption>
                </figure>
              ))}
            </div>
          )}
        </section>
        <section className="expedition-card">
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
        {manifestError && <p className="error-text">{manifestError}</p>}
      </section>
    </main>
  );
}

function getSeed(seedId: string | undefined): SeedDefinition | undefined {
  return seedId ? content.seeds.find((seed) => seed.id === seedId) : undefined;
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
