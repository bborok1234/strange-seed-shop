export type AssetCategory =
  | "background"
  | "creature"
  | "seed_icon"
  | "shop_image"
  | "ui_frame"
  | "sprite_strip"
  | "fx_strip";

export type SeedFamily = "herb" | "candy" | "lunar" | "greenhouse" | "shop" | "album";

export type Rarity = "common" | "uncommon" | "rare" | "epic";

export type PlayfieldAnimationTarget = "plot" | "effect";

export type PlayfieldAnimationSlot =
  | "seed_idle"
  | "growth"
  | "ready"
  | "tap_feedback"
  | "harvest_fx"
  | "reward_fx";

export type PlayfieldAnimationAction = "tap_growth" | "harvest_plot";

export type PlayfieldAnimationPlotState = "growing" | "ready";

export interface PlayfieldAnimationBinding {
  target: PlayfieldAnimationTarget;
  slot: PlayfieldAnimationSlot;
  seedIds?: string[];
  creatureIds?: string[];
  plotStates?: PlayfieldAnimationPlotState[];
  actions?: PlayfieldAnimationAction[];
}

export interface ManifestAnimation {
  kind: "spritesheet";
  key: string;
  frames: number;
  frameWidth: number;
  frameHeight: number;
  margin?: number;
  spacing?: number;
  frameRate: number;
  repeat: number;
  yoyo?: boolean;
  sourceAssetIds?: string[];
  binding?: PlayfieldAnimationBinding;
}

export interface ManifestAsset {
  path: string;
  category: AssetCategory;
  family: SeedFamily;
  rarity: Rarity;
  intended_use: string;
  width: number;
  height: number;
  status: "accepted" | "rejected" | "needs_review";
  tags?: string[];
  notes?: string;
  animation?: ManifestAnimation;
}

export interface AssetManifest {
  version: string;
  project: string;
  runtime_generation_allowed: boolean;
  assets: Record<string, ManifestAsset>;
}

export interface SeedDefinition {
  id: string;
  name: string;
  family: Extract<SeedFamily, "herb" | "candy" | "lunar">;
  unlock: string;
  costLeaves: number;
  baseGrowthSeconds: number;
  tapSecondsRemoved: number;
  baseHarvestLeaves: number;
  iconAssetId: string;
  creaturePool: string[];
}

export interface CreatureDefinition {
  id: string;
  name: string;
  family: Extract<SeedFamily, "herb" | "candy" | "lunar">;
  rarity: Rarity;
  role: "gatherer" | "alchemist" | "guardian" | "merchant" | "mascot";
  assetId: string;
  albumHint: string;
  personality: string;
  favoriteThing: string;
  greeting: string;
}

export interface MissionDefinition {
  id: string;
  type: "tutorial" | "daily";
  label: string;
  target: number;
  rewardLeaves: number;
}

export interface PlayerSave {
  version: number;
  playerId: string;
  createdAt: string;
  updatedAt: string;
  leaves: number;
  pollen: number;
  materials: number;
  unlockedSeedIds: string[];
  discoveredCreatureIds: string[];
  claimedAlbumMilestoneIds: string[];
  seedInventory: Record<string, number>;
  missionProgress: Record<string, number>;
  claimedMissionIds: string[];
  selectedStarterSeedId?: string;
  plotCount: number;
  tapPowerLevel: number;
  plots: PlotState[];
  activeExpedition?: ExpeditionState;
  idleProduction: IdleProductionState;
  lastSeenAt: string;
}

export interface IdleProductionState {
  pendingLeaves: number;
  lastTickAt: string;
  orderProgress: Record<string, number>;
  completedOrderIds: string[];
}

export interface PlotState {
  index: number;
  seedId?: string;
  plantedAt?: string;
  tapProgressSeconds: number;
  harvestedCreatureId?: string;
}

export interface ExpeditionState {
  expeditionId: string;
  creatureIds: string[];
  startedAt: string;
  durationSeconds: number;
  claimed: boolean;
}
