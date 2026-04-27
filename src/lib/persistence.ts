import type { PlayerSave } from "../types/game";

const SAVE_KEY = "strange-seed-shop:phase0-save";

export interface SaveStore {
  load(): PlayerSave | null;
  save(nextSave: PlayerSave): void;
  clear(): void;
}

export const localSaveStore: SaveStore = {
  load() {
    const raw = window.localStorage.getItem(SAVE_KEY);
    return raw ? (JSON.parse(raw) as PlayerSave) : null;
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
    lastSeenAt: timestamp
  };
}
