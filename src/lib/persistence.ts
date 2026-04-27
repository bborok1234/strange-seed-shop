import type { PlayerSave, PlotState } from "../types/game";

const SAVE_KEY = "strange-seed-shop:phase0-save";

export interface SaveStore {
  load(): PlayerSave | null;
  save(nextSave: PlayerSave): void;
  clear(): void;
}

export const localSaveStore: SaveStore = {
  load() {
    const raw = window.localStorage.getItem(SAVE_KEY);
    return raw ? normalizeSave(JSON.parse(raw) as Partial<PlayerSave>) : null;
  },
  save(nextSave) {
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(nextSave));
  },
  clear() {
    window.localStorage.removeItem(SAVE_KEY);
  }
};

export function createNewSave(now = new Date()): PlayerSave {
  const timestamp = now.toISOString();

  return {
    version: 1,
    playerId: crypto.randomUUID(),
    createdAt: timestamp,
    updatedAt: timestamp,
    leaves: 0,
    pollen: 0,
    materials: 0,
    unlockedSeedIds: ["seed_herb_001", "seed_herb_002", "seed_candy_001"],
    discoveredCreatureIds: [],
    claimedAlbumMilestoneIds: [],
    seedInventory: {},
    missionProgress: {},
    claimedMissionIds: [],
    plotCount: 1,
    tapPowerLevel: 0,
    plots: createEmptyPlots(),
    lastSeenAt: timestamp
  };
}

export function normalizeSave(raw: Partial<PlayerSave>, now = new Date()): PlayerSave {
  const fallback = createNewSave(now);
  const plots = Array.isArray(raw.plots) ? raw.plots : fallback.plots;

  return {
    ...fallback,
    ...raw,
    version: 2,
    leaves: raw.leaves ?? fallback.leaves,
    pollen: raw.pollen ?? fallback.pollen,
    materials: raw.materials ?? fallback.materials,
    unlockedSeedIds: raw.unlockedSeedIds ?? fallback.unlockedSeedIds,
    discoveredCreatureIds: raw.discoveredCreatureIds ?? fallback.discoveredCreatureIds,
    claimedAlbumMilestoneIds: raw.claimedAlbumMilestoneIds ?? [],
    seedInventory: raw.seedInventory ?? {},
    missionProgress: raw.missionProgress ?? {},
    claimedMissionIds: raw.claimedMissionIds ?? [],
    plotCount: raw.plotCount ?? fallback.plotCount,
    tapPowerLevel: raw.tapPowerLevel ?? fallback.tapPowerLevel,
    plots: createEmptyPlots().map((plot) => normalizePlot(plots[plot.index], plot.index)),
    lastSeenAt: raw.lastSeenAt ?? fallback.lastSeenAt
  };
}

function createEmptyPlots(): PlotState[] {
  return Array.from({ length: 9 }, (_, index) => ({
    index,
    tapProgressSeconds: 0
  }));
}

function normalizePlot(raw: Partial<PlotState> | undefined, index: number): PlotState {
  return {
    index,
    seedId: raw?.seedId,
    plantedAt: raw?.plantedAt,
    tapProgressSeconds: raw?.tapProgressSeconds ?? 0,
    harvestedCreatureId: raw?.harvestedCreatureId
  };
}
