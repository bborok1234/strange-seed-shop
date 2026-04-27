import seeds from "../data/seeds.json";
import creatures from "../data/creatures.json";
import growthCurves from "../data/growth_curves.json";
import rewards from "../data/rewards.json";
import expeditions from "../data/expeditions.json";
import missions from "../data/missions.json";
import shopSurfaces from "../data/shop_surfaces.json";
import type { CreatureDefinition, SeedDefinition } from "../types/game";

export const content = {
  seeds: seeds as SeedDefinition[],
  creatures: creatures as CreatureDefinition[],
  growthCurves,
  rewards,
  expeditions,
  missions,
  shopSurfaces
};

export function getStarterSeeds(): SeedDefinition[] {
  return content.seeds.filter((seed) => ["seed_herb_001", "seed_herb_002", "seed_candy_001"].includes(seed.id));
}
