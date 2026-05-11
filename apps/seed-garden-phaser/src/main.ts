import * as Phaser from "phaser";
import {
  careSelectedPlot,
  claimBackyardGapExpeditionReward,
  claimNightGlassSourceReward,
  claimResearchNextGoalSeed,
  claimOrderCrateDelivery,
  claimStoredLeaves,
  claimWorkbenchProduction,
  completeMoonFencePrepDelivery,
  confirmLunarSproutDiscovery,
  createGardenState,
  getFacilityBySlot,
  getPlotBySlot,
  getSlot,
  harvestSelectedPlot,
  inspectMoonFenceRoute,
  inspectMoonFenceRequirements,
  inspectResearchShelfPreview,
  LUNAR_SOURCE_SEED_ID,
  markBackyardGapExpeditionReturned,
  markNightGlassSourceExpeditionReturned,
  NIGHT_GLASS_RARE_CREATURE_ID,
  NIGHT_GLASS_RARE_CREATURE_NAME,
  NIGHT_GLASS_ORO_ACTOR_ID,
  NIGHT_GLASS_ROUTE_PREVIEW_ID,
  NIGHT_GLASS_SOURCE_SEED_ID,
  NEXT_EXPEDITION_ROUTE_PREVIEW_ID,
  MOON_FENCE_REQUIRED_CLUES,
  MOON_FENCE_REQUIRED_MATERIALS,
  MOON_FENCE_UNLOCKED_ROUTE_ID,
  plantLunarSourceSeed,
  plantNightGlassSourceSeed,
  plantResearchNextGoalSeed,
  plantResearchClueSeed,
  plantStarterSeed,
  packageMoonFenceSecondClue,
  previewExpeditionGateRoute,
  previewExpeditionSourceClue,
  previewNightGlassSource,
  recordResearchClueInAlbum,
  selectSlot,
  startBackyardGapExpedition,
  startNightGlassSourceExpedition,
  STORAGE_BASKET_UNLOCK_COST,
  THIRD_PLOT_UNLOCK_COST,
  unlockStorageBasket,
  unlockMoonFenceRoute,
  unlockThirdPlot,
  type ActorEntity,
  type BoardSlot,
  type FacilityEntity,
  type GardenState,
  type PlotEntity
} from "./gameState";
import "./styles.css";

const gameState = createGardenState();

const TOPOLOGY_ASSETS = {
  terrain: {
    key: "bg_garden_terrain_open_v1",
    path: "/assets/game/backgrounds/bg_garden_terrain_open_v1.png"
  },
  plots: {
    empty: { key: "tile_plot_empty_v1", path: "/assets/game/tiles/tile_plot_empty_v1.png" },
    planted: { key: "tile_plot_sprout_v1", path: "/assets/game/tiles/tile_plot_sprout_v1.png" },
    growing: { key: "tile_plot_growing_v1", path: "/assets/game/tiles/tile_plot_growing_v1.png" },
    ready: { key: "tile_plot_ready_v1", path: "/assets/game/tiles/tile_plot_ready_v1.png" },
    locked: { key: "tile_plot_locked_preview_v1", path: "/assets/game/tiles/tile_plot_locked_preview_v1.png" }
  },
  seeds: {
    lunarSource: {
      key: "seed_lunar_002_icon",
      path: "/assets/game/seeds/seed_lunar_002_icon.png"
    },
    nightGlassSource: {
      key: "seed_rare_001_icon",
      path: "/assets/game/seeds/seed_rare_001_icon.png"
    }
  },
  creatures: {
    lunarSource: {
      key: "creature_lunar_uncommon_001",
      path: "/assets/game/creatures/creature_lunar_uncommon_001.png"
    },
    lunarRare: {
      key: "creature_lunar_rare_001",
      path: "/assets/game/creatures/creature_lunar_rare_001.png"
    }
  },
  facilities: {
    workbench: { key: "facility_workbench_v1", path: "/assets/game/facilities/facility_workbench_v1.png" },
    orderCrateEmpty: {
      key: "facility_order_crate_empty_v1",
      path: "/assets/game/facilities/facility_order_crate_empty_v1.png"
    },
    orderCrateFilled: {
      key: "facility_order_crate_filled_v1",
      path: "/assets/game/facilities/facility_order_crate_filled_v1.png"
    },
    expeditionGate: {
      key: "facility_expedition_gate_v1",
      path: "/assets/game/facilities/facility_expedition_gate_v1.png"
    },
    expeditionReturnCrate: {
      key: "facility_expedition_return_crate_v1",
      path: "/assets/game/facilities/facility_expedition_return_crate_v1.png"
    },
    shadow: { key: "ui_shadow_soft_v1", path: "/assets/game/ui/ui_shadow_soft_v1.png" }
  },
  actors: {
    pori: {
      key: "actor_pori_caretaker_strip_v1",
      path: "/assets/game/sprites/actor_pori_caretaker_strip_v1.png",
      frameWidth: 128,
      frameHeight: 128
    },
    momo: {
      key: "actor_momo_carrier_strip_v1",
      path: "/assets/game/sprites/actor_momo_carrier_strip_v1.png",
      frameWidth: 128,
      frameHeight: 128
    }
  },
  fx: {
    care: {
      key: "fx_care_spark_strip_v1",
      path: "/assets/game/fx/fx_care_spark_strip_v1.png",
      frameWidth: 96,
      frameHeight: 96
    },
    harvest: {
      key: "fx_harvest_leaf_flyout_strip_v1",
      path: "/assets/game/fx/fx_harvest_leaf_flyout_strip_v1.png",
      frameWidth: 96,
      frameHeight: 96
    },
    expeditionReturn: {
      key: "fx_expedition_return_reward_strip_v1",
      path: "/assets/game/fx/fx_expedition_return_reward_strip_v1.png",
      frameWidth: 96,
      frameHeight: 96
    },
    lunarHarvest: {
      key: "fx_lunar_harvest_moonburst_001",
      path: "/assets/game/fx/fx_lunar_greenhouse_planting_pulse_001_strip.png",
      frameWidth: 160,
      frameHeight: 160
    },
    nightGlassSourceUnlock: {
      key: "fx_night_glass_source_unlock_strip_v1",
      path: "/assets/game/fx/fx_night_glass_source_unlock_strip_v1.png",
      frameWidth: 96,
      frameHeight: 96
    }
  }
} as const;

const TOPOLOGY_ASSET_KEYS = [
  TOPOLOGY_ASSETS.terrain.key,
  ...Object.values(TOPOLOGY_ASSETS.plots).map((asset) => asset.key),
  ...Object.values(TOPOLOGY_ASSETS.seeds).map((asset) => asset.key),
  ...Object.values(TOPOLOGY_ASSETS.creatures).map((asset) => asset.key),
  ...Object.values(TOPOLOGY_ASSETS.facilities).map((asset) => asset.key),
  ...Object.values(TOPOLOGY_ASSETS.actors).map((asset) => asset.key),
  ...Object.values(TOPOLOGY_ASSETS.fx).map((asset) => asset.key)
];

interface HudElements {
  root: HTMLDivElement;
  leaves: HTMLSpanElement;
  seeds: HTMLSpanElement;
  viewToggle: HTMLButtonElement;
  objective: HTMLDivElement;
  selected: HTMLDivElement;
  actions: HTMLDivElement;
  receipts: HTMLDivElement;
}

type ViewMode = "manage" | "overview";

function createHud(): HudElements {
  const root = document.createElement("div");
  root.className = "garden-hud";
  root.innerHTML = `
    <div class="hud-top" data-testid="phaser-resource-hud">
      <span class="resource-chip">잎 <strong data-hud="leaves">0</strong></span>
      <span class="resource-chip">씨앗 <strong data-hud="seeds">1</strong></span>
      <button class="view-mode-toggle" type="button" data-testid="phaser-view-mode-toggle">감상</button>
    </div>
    <div class="objective-chip" data-testid="phaser-objective"></div>
    <div class="action-rail" data-testid="phaser-action-rail">
      <div class="selected-entity"></div>
      <div class="action-buttons"></div>
      <div class="receipt-stack" aria-live="polite"></div>
    </div>
  `;
  document.body.appendChild(root);

  return {
    root,
    leaves: root.querySelector("[data-hud='leaves']") as HTMLSpanElement,
    seeds: root.querySelector("[data-hud='seeds']") as HTMLSpanElement,
    viewToggle: root.querySelector("[data-testid='phaser-view-mode-toggle']") as HTMLButtonElement,
    objective: root.querySelector(".objective-chip") as HTMLDivElement,
    selected: root.querySelector(".selected-entity") as HTMLDivElement,
    actions: root.querySelector(".action-buttons") as HTMLDivElement,
    receipts: root.querySelector(".receipt-stack") as HTMLDivElement
  };
}

class GardenBoardScene extends Phaser.Scene {
  private hud?: HudElements;
  private renderLayer?: Phaser.GameObjects.Container;
  private pendingFx?: {
    kind: "care" | "harvest" | "delivery" | "expeditionReturn" | "lunarHarvest" | "nightGlassAcquire";
    slotId: string;
  };
  private viewMode: ViewMode = "manage";

  constructor() {
    super("GardenBoardScene");
  }

  preload() {
    this.load.image(TOPOLOGY_ASSETS.terrain.key, TOPOLOGY_ASSETS.terrain.path);
    Object.values(TOPOLOGY_ASSETS.plots).forEach((asset) => this.load.image(asset.key, asset.path));
    Object.values(TOPOLOGY_ASSETS.seeds).forEach((asset) => this.load.image(asset.key, asset.path));
    Object.values(TOPOLOGY_ASSETS.creatures).forEach((asset) => this.load.image(asset.key, asset.path));
    Object.values(TOPOLOGY_ASSETS.facilities).forEach((asset) => this.load.image(asset.key, asset.path));
    Object.values(TOPOLOGY_ASSETS.actors).forEach((asset) =>
      this.load.spritesheet(asset.key, asset.path, { frameWidth: asset.frameWidth, frameHeight: asset.frameHeight })
    );
    Object.values(TOPOLOGY_ASSETS.fx).forEach((asset) =>
      this.load.spritesheet(asset.key, asset.path, { frameWidth: asset.frameWidth, frameHeight: asset.frameHeight })
    );
  }

  create() {
    this.cameras.main.setBackgroundColor("#d9e7c6");
    this.createAnimations();
    (window as unknown as { __seedGardenTopologyAssets?: string[] }).__seedGardenTopologyAssets = TOPOLOGY_ASSET_KEYS;
    this.hud = createHud();
    this.hud.viewToggle.addEventListener("click", () => this.toggleViewMode());
    this.renderGarden();
  }

  private renderGarden() {
    this.renderLayer?.destroy();
    this.renderLayer = this.add.container(0, 0);
    this.renderTerrain();
    this.renderSlots();
    this.renderNightGlassSourcePreview();
    this.renderNightGlassAcquisitionMarker();
    this.renderLunarSourceReveal();
    this.renderNightGlassRareReveal();
    this.renderActors();
    this.renderPendingFx();
    this.applyViewModeCamera();
    (window as unknown as { __seedGardenActorIds?: string[] }).__seedGardenActorIds = gameState.actors.map(
      (actor) => actor.id
    );
    (window as unknown as { __seedGardenViewMode?: ViewMode }).__seedGardenViewMode = this.viewMode;
    (window as unknown as { __seedGardenHudCollapsed?: boolean }).__seedGardenHudCollapsed =
      this.viewMode === "overview";
    (window as unknown as { __seedGardenOrderCrateProgress?: number }).__seedGardenOrderCrateProgress =
      getFacilityBySlot(gameState, "facility_order_crate")?.progress ?? 0;
    (window as unknown as { __seedGardenCompletedDeliveries?: number }).__seedGardenCompletedDeliveries =
      gameState.completedDeliveries;
    (window as unknown as { __seedGardenStorageCapacity?: number }).__seedGardenStorageCapacity =
      gameState.storageCapacity;
    (window as unknown as { __seedGardenStoredLeaves?: number }).__seedGardenStoredLeaves = gameState.storedLeaves;
    (window as unknown as { __seedGardenStorageFillRatio?: number }).__seedGardenStorageFillRatio =
      gameState.storageCapacity > 0 ? gameState.storedLeaves / gameState.storageCapacity : 0;
    (window as unknown as { __seedGardenResearchShelfPreviewSeen?: boolean }).__seedGardenResearchShelfPreviewSeen =
      gameState.researchShelfPreviewSeen;
    (window as unknown as { __seedGardenResearchClueSeedAvailable?: boolean })
      .__seedGardenResearchClueSeedAvailable = gameState.researchClueSeedAvailable;
    (window as unknown as { __seedGardenResearchClueSeedPlanted?: boolean }).__seedGardenResearchClueSeedPlanted =
      gameState.researchClueSeedPlanted;
    (window as unknown as { __seedGardenResearchClueHarvested?: boolean }).__seedGardenResearchClueHarvested =
      gameState.researchClueHarvested;
    (window as unknown as { __seedGardenResearchClueRecordReady?: boolean }).__seedGardenResearchClueRecordReady =
      gameState.researchClueRecordReady;
    (window as unknown as { __seedGardenResearchClueAlbumRecorded?: boolean })
      .__seedGardenResearchClueAlbumRecorded = gameState.researchClueAlbumRecorded;
    (window as unknown as { __seedGardenResearchClueGoalSurfaceVisible?: boolean })
      .__seedGardenResearchClueGoalSurfaceVisible = gameState.researchClueGoalSurfaceVisible;
    (window as unknown as { __seedGardenResearchNextGoalSeedAvailable?: boolean })
      .__seedGardenResearchNextGoalSeedAvailable = gameState.researchNextGoalSeedAvailable;
    (window as unknown as { __seedGardenResearchNextGoalSeedClaimed?: boolean })
      .__seedGardenResearchNextGoalSeedClaimed = gameState.researchNextGoalSeedClaimed;
    (window as unknown as { __seedGardenResearchNextGoalSeedPlanted?: boolean })
      .__seedGardenResearchNextGoalSeedPlanted = gameState.researchNextGoalSeedPlanted;
    (window as unknown as { __seedGardenResearchNextGoalSeedHarvested?: boolean })
      .__seedGardenResearchNextGoalSeedHarvested = gameState.researchNextGoalSeedHarvested;
    (window as unknown as { __seedGardenResearchNextGoalRevealReady?: boolean })
      .__seedGardenResearchNextGoalRevealReady = gameState.researchNextGoalRevealReady;
    (window as unknown as { __seedGardenResearchLunarFamilyRevealed?: boolean })
      .__seedGardenResearchLunarFamilyRevealed = gameState.researchLunarFamilyRevealed;
    (window as unknown as { __seedGardenExpeditionGatePreviewVisible?: boolean })
      .__seedGardenExpeditionGatePreviewVisible = gameState.expeditionGatePreviewVisible;
    (window as unknown as { __seedGardenExpeditionState?: string }).__seedGardenExpeditionState =
      gameState.expeditionState;
    (window as unknown as { __seedGardenActiveExpeditionRouteId?: string }).__seedGardenActiveExpeditionRouteId =
      gameState.activeExpeditionRouteId ?? "";
    (window as unknown as { __seedGardenExpeditionRewardLeaves?: number }).__seedGardenExpeditionRewardLeaves =
      gameState.expeditionRewardLeaves;
    (window as unknown as { __seedGardenExpeditionSourceClueAvailable?: boolean })
      .__seedGardenExpeditionSourceClueAvailable = gameState.expeditionSourceClueAvailable;
    (window as unknown as { __seedGardenExpeditionSourcePreviewVisible?: boolean })
      .__seedGardenExpeditionSourcePreviewVisible = gameState.expeditionSourcePreviewVisible;
    (window as unknown as { __seedGardenNextExpeditionRoutePreviewId?: string })
      .__seedGardenNextExpeditionRoutePreviewId = gameState.nextExpeditionRoutePreviewId ?? "";
    (window as unknown as { __seedGardenLunarSourceSeedId?: string }).__seedGardenLunarSourceSeedId =
      gameState.lunarSourceSeedId ?? "";
    (window as unknown as { __seedGardenLunarSourceSeedAvailable?: boolean }).__seedGardenLunarSourceSeedAvailable =
      gameState.lunarSourceSeedAvailable;
    (window as unknown as { __seedGardenLunarSourceSeedPlanted?: boolean }).__seedGardenLunarSourceSeedPlanted =
      gameState.lunarSourceSeedPlanted;
    (window as unknown as { __seedGardenLunarSourceSeedHarvested?: boolean }).__seedGardenLunarSourceSeedHarvested =
      gameState.lunarSourceSeedHarvested;
    (window as unknown as { __seedGardenLunarSourceCreatureRevealed?: boolean })
      .__seedGardenLunarSourceCreatureRevealed = gameState.lunarSourceCreatureRevealed;
    (window as unknown as { __seedGardenLunarSourceCreatureId?: string }).__seedGardenLunarSourceCreatureId =
      gameState.lunarSourceCreatureId ?? "";
    (window as unknown as { __seedGardenNightGlassSourceSeedId?: string }).__seedGardenNightGlassSourceSeedId =
      NIGHT_GLASS_SOURCE_SEED_ID;
    (window as unknown as { __seedGardenNightGlassSourcePreviewAvailable?: boolean })
      .__seedGardenNightGlassSourcePreviewAvailable = gameState.nightGlassSourcePreviewAvailable;
    (window as unknown as { __seedGardenNightGlassSourcePreviewVisible?: boolean })
      .__seedGardenNightGlassSourcePreviewVisible = gameState.nightGlassSourcePreviewVisible;
    (window as unknown as { __seedGardenNightGlassRoutePreviewId?: string }).__seedGardenNightGlassRoutePreviewId =
      gameState.nightGlassRoutePreviewId ?? "";
    (window as unknown as { __seedGardenNightGlassSourceRenderedAssetKey?: string })
      .__seedGardenNightGlassSourceRenderedAssetKey = gameState.nightGlassSourcePreviewVisible
        ? TOPOLOGY_ASSETS.seeds.nightGlassSource.key
        : "";
    (window as unknown as { __seedGardenNightGlassSourceFxKey?: string }).__seedGardenNightGlassSourceFxKey =
      gameState.nightGlassSourcePreviewVisible ? TOPOLOGY_ASSETS.fx.nightGlassSourceUnlock.key : "";
    (window as unknown as { __seedGardenNightGlassAcquisitionState?: string })
      .__seedGardenNightGlassAcquisitionState = gameState.nightGlassAcquisitionState;
    (window as unknown as { __seedGardenNightGlassSourceSeedAvailable?: boolean })
      .__seedGardenNightGlassSourceSeedAvailable = gameState.nightGlassSourceSeedAvailable;
    (window as unknown as { __seedGardenNightGlassSourceSeedPlanted?: boolean })
      .__seedGardenNightGlassSourceSeedPlanted = gameState.nightGlassSourceSeedPlanted;
    (window as unknown as { __seedGardenNightGlassSourceSeedHarvested?: boolean })
      .__seedGardenNightGlassSourceSeedHarvested = gameState.nightGlassSourceSeedHarvested;
    (window as unknown as { __seedGardenNightGlassSourceAcquired?: boolean }).__seedGardenNightGlassSourceAcquired =
      gameState.nightGlassSourceAcquired;
    (window as unknown as { __seedGardenNightGlassRareCreatureRevealed?: boolean })
      .__seedGardenNightGlassRareCreatureRevealed = gameState.nightGlassRareCreatureRevealed;
    (window as unknown as { __seedGardenNightGlassRareCreatureId?: string }).__seedGardenNightGlassRareCreatureId =
      gameState.nightGlassRareCreatureId ?? "";
    (window as unknown as { __seedGardenNightGlassRareCreatureName?: string }).__seedGardenNightGlassRareCreatureName =
      gameState.nightGlassRareCreatureRevealed ? NIGHT_GLASS_RARE_CREATURE_NAME : "";
    (window as unknown as { __seedGardenNightGlassOroActorJoined?: boolean }).__seedGardenNightGlassOroActorJoined =
      gameState.nightGlassOroActorJoined;
    (window as unknown as { __seedGardenNightGlassOroRouteHandoffVisible?: boolean })
      .__seedGardenNightGlassOroRouteHandoffVisible = gameState.nightGlassOroRouteHandoffVisible;
    (window as unknown as { __seedGardenNightGlassOroRouteActionAvailable?: boolean })
      .__seedGardenNightGlassOroRouteActionAvailable = gameState.nightGlassOroRouteActionAvailable;
    (window as unknown as { __seedGardenMoonFenceRoutePreviewVisible?: boolean }).__seedGardenMoonFenceRoutePreviewVisible =
      gameState.moonFenceRoutePreviewVisible;
    (window as unknown as { __seedGardenMoonFenceRouteInspected?: boolean }).__seedGardenMoonFenceRouteInspected =
      gameState.moonFenceRouteInspected;
    (window as unknown as { __seedGardenMoonFenceRequirementSurfaceVisible?: boolean })
      .__seedGardenMoonFenceRequirementSurfaceVisible = gameState.moonFenceRequirementSurfaceVisible;
    (window as unknown as { __seedGardenMoonFenceRequirementsInspected?: boolean })
      .__seedGardenMoonFenceRequirementsInspected = gameState.moonFenceRequirementsInspected;
    (window as unknown as { __seedGardenMoonFenceRequiredClues?: number }).__seedGardenMoonFenceRequiredClues =
      gameState.moonFenceRequiredClues;
    (window as unknown as { __seedGardenMoonFenceCurrentClues?: number }).__seedGardenMoonFenceCurrentClues =
      gameState.moonFenceCurrentClues;
    (window as unknown as { __seedGardenMoonFenceRequiredMaterials?: number }).__seedGardenMoonFenceRequiredMaterials =
      gameState.moonFenceRequiredMaterials;
    (window as unknown as { __seedGardenMoonFenceCurrentMaterials?: number }).__seedGardenMoonFenceCurrentMaterials =
      gameState.moonFenceCurrentMaterials;
    (window as unknown as { __seedGardenMoonFencePrepDeliveryAvailable?: boolean })
      .__seedGardenMoonFencePrepDeliveryAvailable = gameState.moonFencePrepDeliveryAvailable;
    (window as unknown as { __seedGardenMoonFencePrepDeliveryCompleted?: boolean })
      .__seedGardenMoonFencePrepDeliveryCompleted = gameState.moonFencePrepDeliveryCompleted;
    (window as unknown as { __seedGardenMoonFencePrepDeliveryCrateVisible?: boolean })
      .__seedGardenMoonFencePrepDeliveryCrateVisible = gameState.moonFencePrepDeliveryCrateVisible;
    (window as unknown as { __seedGardenMoonFenceMaterialsReady?: boolean }).__seedGardenMoonFenceMaterialsReady =
      gameState.moonFenceMaterialsReady;
    (window as unknown as { __seedGardenMoonFenceSecondClueAvailable?: boolean })
      .__seedGardenMoonFenceSecondClueAvailable = gameState.moonFenceSecondClueAvailable;
    (window as unknown as { __seedGardenMoonFenceSecondCluePackaged?: boolean })
      .__seedGardenMoonFenceSecondCluePackaged = gameState.moonFenceSecondCluePackaged;
    (window as unknown as { __seedGardenMoonFenceClueStampVisible?: boolean })
      .__seedGardenMoonFenceClueStampVisible = gameState.moonFenceClueStampVisible;
    (window as unknown as { __seedGardenMoonFenceCluesReady?: boolean }).__seedGardenMoonFenceCluesReady =
      gameState.moonFenceCluesReady;
    (window as unknown as { __seedGardenMoonFenceUnlockAvailable?: boolean }).__seedGardenMoonFenceUnlockAvailable =
      gameState.moonFenceUnlockAvailable;
    (window as unknown as { __seedGardenMoonFenceRouteUnlocked?: boolean }).__seedGardenMoonFenceRouteUnlocked =
      gameState.moonFenceRouteUnlocked;
    (window as unknown as { __seedGardenMoonFenceUnlockedRouteId?: string }).__seedGardenMoonFenceUnlockedRouteId =
      gameState.moonFenceUnlockedRouteId ?? "";
    (window as unknown as { __seedGardenMoonFenceUnlockedMarkerVisible?: boolean })
      .__seedGardenMoonFenceUnlockedMarkerVisible = gameState.moonFenceUnlockedMarkerVisible;
    (window as unknown as { __seedGardenMoonFenceRequiredExplorerId?: string }).__seedGardenMoonFenceRequiredExplorerId =
      gameState.moonFenceRequiredExplorerId ?? "";
    (window as unknown as { __seedGardenNextRareRoutePreviewId?: string }).__seedGardenNextRareRoutePreviewId =
      gameState.nextRareRoutePreviewId ?? "";
    (window as unknown as { __seedGardenNightGlassRewardLeaves?: number }).__seedGardenNightGlassRewardLeaves =
      gameState.nightGlassRewardLeaves;
    (window as unknown as { __seedGardenUnlockedSlotIds?: string[] }).__seedGardenUnlockedSlotIds = gameState.slots
      .filter((slot) => slot.unlockState === "unlocked")
      .map((slot) => slot.id);
    (window as unknown as { __seedGardenPreviewSlotIds?: string[] }).__seedGardenPreviewSlotIds = gameState.slots
      .filter((slot) => slot.unlockState === "preview")
      .map((slot) => slot.id);
    (window as unknown as { __seedGardenFacilityStates?: Array<Pick<FacilityEntity, "slotId" | "kind" | "level" | "visualState" | "progress">> })
      .__seedGardenFacilityStates = gameState.facilities.map((facility) => ({
        slotId: facility.slotId,
        kind: facility.kind,
        level: facility.level,
        visualState: facility.visualState,
        progress: facility.progress
      }));
    (window as unknown as { __seedGardenPlotIds?: string[] }).__seedGardenPlotIds = gameState.plots.map(
      (plot) => plot.slotId
    );
    (window as unknown as { __seedGardenPlotStates?: Array<Pick<PlotEntity, "slotId" | "state" | "growth" | "seedId">> })
      .__seedGardenPlotStates = gameState.plots.map((plot) => ({
        slotId: plot.slotId,
        state: plot.state,
        growth: plot.growth,
        seedId: plot.seedId
      }));
    (window as unknown as { __seedGardenReceipts?: string[] }).__seedGardenReceipts = gameState.receipts;
    this.updateHud();
  }

  private applyViewModeCamera() {
    if (!this.renderLayer) {
      return;
    }
    if (this.viewMode === "overview") {
      this.renderLayer.setPosition(28, 54);
      this.renderLayer.setScale(0.86);
      return;
    }
    this.renderLayer.setPosition(0, 0);
    this.renderLayer.setScale(1);
  }

  private createAnimations() {
    this.anims.create({
      key: "pori-care-loop",
      frames: this.anims.generateFrameNumbers(TOPOLOGY_ASSETS.actors.pori.key, { start: 0, end: 5 }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key: "momo-carry-loop",
      frames: this.anims.generateFrameNumbers(TOPOLOGY_ASSETS.actors.momo.key, { start: 0, end: 5 }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key: "care-spark-once",
      frames: this.anims.generateFrameNumbers(TOPOLOGY_ASSETS.fx.care.key, { start: 0, end: 5 }),
      frameRate: 12,
      repeat: 0
    });
    this.anims.create({
      key: "harvest-leaf-flyout-once",
      frames: this.anims.generateFrameNumbers(TOPOLOGY_ASSETS.fx.harvest.key, { start: 0, end: 7 }),
      frameRate: 14,
      repeat: 0
    });
    this.anims.create({
      key: "expedition-return-reward-once",
      frames: this.anims.generateFrameNumbers(TOPOLOGY_ASSETS.fx.expeditionReturn.key, { start: 0, end: 7 }),
      frameRate: 14,
      repeat: 0
    });
    this.anims.create({
      key: "lunar-harvest-moonburst-once",
      frames: this.anims.generateFrameNumbers(TOPOLOGY_ASSETS.fx.lunarHarvest.key, { start: 0, end: 3 }),
      frameRate: 10,
      repeat: 0
    });
    this.anims.create({
      key: "night-glass-source-unlock-once",
      frames: this.anims.generateFrameNumbers(TOPOLOGY_ASSETS.fx.nightGlassSourceUnlock.key, { start: 0, end: 7 }),
      frameRate: 12,
      repeat: 0
    });
  }

  private renderTerrain() {
    const graphics = this.add.graphics();
    graphics.fillStyle(0xdce8c6, 1);
    graphics.fillRect(0, 0, 393, 852);
    this.renderLayer?.add(graphics);

    const terrain = this.add.image(196, 398, TOPOLOGY_ASSETS.terrain.key);
    terrain.setDisplaySize(393, 393);
    terrain.setAlpha(0.98);
    terrain.setDepth(0);
    this.renderLayer?.add(terrain);

    const vignette = this.add.graphics();
    vignette.fillStyle(0xb8d2a0, 0.3);
    vignette.fillRoundedRect(22, 124, 349, 620, 40);
    vignette.fillStyle(0x9cb77e, 0.55);
    vignette.fillRoundedRect(44, 684, 305, 22, 12);
    vignette.lineStyle(2, 0x6d8c65, 0.32);
    vignette.strokeRoundedRect(22, 124, 349, 620, 40);
    this.renderLayer?.add(vignette);

    const title = this.add
      .text(196, 104, "햇살 온실 정원", {
        color: "#203b2f",
        fontFamily: "system-ui, sans-serif",
        fontSize: "20px",
        fontStyle: "700"
      })
      .setOrigin(0.5);
    this.renderLayer?.add(title);
  }

  private renderSlots() {
    [...gameState.slots]
      .sort((a, b) => a.depth - b.depth)
      .forEach((slot) => {
        if (slot.kind === "plot") {
          this.renderPlotSlot(slot, getPlotBySlot(gameState, slot.id));
          return;
        }
        this.renderFacilitySlot(slot, getFacilityBySlot(gameState, slot.id));
      });
  }

  private renderPlotSlot(slot: BoardSlot, plot?: PlotEntity) {
    const container = this.add.container(slot.x, slot.y);
    container.setScale(slot.scale);
    container.setDepth(slot.depth);
    const isSelected = gameState.selectedSlotId === slot.id;
    const locked = slot.unlockState !== "unlocked";
    const outline = isSelected ? 0xffcf5a : locked ? 0x8a927f : 0x557a51;

    const shadow = this.add.image(0, 32, TOPOLOGY_ASSETS.facilities.shadow.key);
    shadow.setDisplaySize(110, 40);
    shadow.setAlpha(0.38);
    container.add(shadow);

    const tile = this.add.image(0, -4, this.getPlotTextureKey(plot, slot.unlockState));
    tile.setDisplaySize(136, 108);
    tile.setAlpha(locked ? 0.76 : 1);
    container.add(tile);

    const bed = this.add.graphics();
    bed.lineStyle(isSelected ? 5 : 2, outline, isSelected ? 0.95 : 0.42);
    bed.strokeRoundedRect(-62, -46, 124, 92, 24);
    container.add(bed);

    const label = this.add
      .text(0, 53, slot.label, {
        align: "center",
        color: "#203b2f",
        fontFamily: "system-ui, sans-serif",
        fontSize: "12px",
        fontStyle: isSelected ? "700" : "500"
      })
      .setOrigin(0.5);
    container.add(label);

    if (plot && (plot.state === "planted" || plot.state === "growing" || plot.state === "ready")) {
      const bar = this.add.graphics();
      bar.fillStyle(0xffffff, 0.82);
      bar.fillRoundedRect(-40, 29, 80, 8, 4);
      bar.fillStyle(plot.state === "ready" ? 0xffc84b : 0x65a864, 1);
      bar.fillRoundedRect(-40, 29, Math.max(8, plot.growth * 0.8), 8, 4);
      container.add(bar);
    }

    if (plot?.seedId === "seed_lunar_clue_001" || plot?.seedId === "seed_lunar_sprout_001") {
      const clueChip = this.add
        .text(0, -52, plot.seedId === "seed_lunar_sprout_001" ? "목표" : "단서", {
          align: "center",
          backgroundColor: "rgba(49, 67, 96, 0.82)",
          color: "#f4f0c9",
          fontFamily: "system-ui, sans-serif",
          fontSize: "10px",
          fontStyle: "800",
          padding: { x: 6, y: 2 }
        })
        .setOrigin(0.5);
      container.add(clueChip);
    }

    if (plot?.seedId === "seed_lunar_002") {
      const sourceIcon = this.add.image(0, -18, TOPOLOGY_ASSETS.seeds.lunarSource.key);
      sourceIcon.setDisplaySize(58, 58);
      sourceIcon.setAlpha(plot.state === "ready" ? 1 : 0.94);
      container.add(sourceIcon);

      const sourceChip = this.add
        .text(0, -52, "초승달순", {
          align: "center",
          backgroundColor: "rgba(39, 57, 93, 0.88)",
          color: "#f4f0c9",
          fontFamily: "system-ui, sans-serif",
          fontSize: "10px",
          fontStyle: "800",
          padding: { x: 7, y: 2 }
        })
        .setOrigin(0.5);
      container.add(sourceChip);
    }

    if (plot?.seedId === NIGHT_GLASS_SOURCE_SEED_ID) {
      const sourceIcon = this.add.image(0, -18, TOPOLOGY_ASSETS.seeds.nightGlassSource.key);
      sourceIcon.setDisplaySize(60, 60);
      sourceIcon.setAlpha(plot.state === "ready" ? 1 : 0.96);
      container.add(sourceIcon);

      const sourceChip = this.add
        .text(0, -52, "밤유리", {
          align: "center",
          backgroundColor: "rgba(51, 43, 92, 0.9)",
          color: "#f9e9ff",
          fontFamily: "system-ui, sans-serif",
          fontSize: "10px",
          fontStyle: "800",
          padding: { x: 7, y: 2 }
        })
        .setOrigin(0.5);
      container.add(sourceChip);
    }

    container.setSize(132, 112);
    container.setInteractive(new Phaser.Geom.Rectangle(-66, -52, 132, 112), Phaser.Geom.Rectangle.Contains);
    container.on("pointerdown", () => this.selectAndRender(slot.id));
    this.renderLayer?.add(container);
  }

  private renderFacilitySlot(slot: BoardSlot, facility?: FacilityEntity) {
    const container = this.add.container(slot.x, slot.y);
    container.setScale(slot.scale);
    container.setDepth(slot.depth);
    const isSelected = gameState.selectedSlotId === slot.id;
    const locked = slot.unlockState === "locked";
    const preview = slot.unlockState === "preview";

    const shadow = this.add.image(0, 38, TOPOLOGY_ASSETS.facilities.shadow.key);
    shadow.setDisplaySize(124, 44);
    shadow.setAlpha(0.32);
    container.add(shadow);

    const image = this.add.image(0, -4, this.getFacilityTextureKey(facility));
    image.setDisplaySize(facility?.kind === "workbench" ? 132 : 122, facility?.kind === "workbench" ? 104 : 96);
    image.setAlpha(locked ? 0.42 : preview ? 0.84 : 1);
    container.add(image);

    const prop = this.add.graphics();
    prop.lineStyle(isSelected ? 5 : 3, isSelected ? 0xffcf5a : 0x5d6d58, 0.9);
    prop.strokeRoundedRect(-58, -46, 116, 88, 18);
    container.add(prop);

    const label = this.add
      .text(0, 42, slot.label, {
        align: "center",
        color: "#203b2f",
        fontFamily: "system-ui, sans-serif",
        fontSize: "12px",
        fontStyle: isSelected ? "700" : "500"
      })
      .setOrigin(0.5);
    container.add(label);

    if (facility && facility.kind === "order_crate" && facility.progress > 0) {
      const bar = this.add.graphics();
      bar.fillStyle(0xffffff, 0.8);
      bar.fillRoundedRect(-36, 26, 72, 7, 4);
      bar.fillStyle(facility.progress >= 100 ? 0xffc84b : 0x7cae70, 1);
      bar.fillRoundedRect(-36, 26, Math.max(6, facility.progress * 0.72), 7, 4);
      container.add(bar);
    }

    if (facility?.kind === "storage" && slot.unlockState === "unlocked") {
      const ratio = gameState.storageCapacity > 0 ? gameState.storedLeaves / gameState.storageCapacity : 0;
      const storageBar = this.add.graphics();
      storageBar.fillStyle(0xffffff, 0.86);
      storageBar.fillRoundedRect(-40, 20, 80, 12, 6);
      storageBar.lineStyle(1, 0x6f8f63, 0.55);
      storageBar.strokeRoundedRect(-40, 20, 80, 12, 6);
      if (ratio > 0) {
        storageBar.fillStyle(0x7cae70, 1);
        storageBar.fillRoundedRect(-38, 22, Math.max(6, ratio * 76), 8, 4);
      }
      container.add(storageBar);

      const storageText = this.add
        .text(0, 26, `${gameState.storedLeaves}/${gameState.storageCapacity}`, {
          align: "center",
          color: "#203b2f",
          fontFamily: "system-ui, sans-serif",
          fontSize: "9px",
          fontStyle: "800"
        })
        .setOrigin(0.5);
      container.add(storageText);
    }

    if (facility?.kind === "research_shelf" && slot.unlockState === "preview") {
      const clue = this.add.graphics();
      clue.fillStyle(gameState.researchLunarFamilyRevealed ? 0x8dc6ff : 0x9fd6c8, 0.9);
      clue.fillCircle(-24, -28, 8);
      clue.fillStyle(0xffe1a1, 0.9);
      clue.fillCircle(2, -34, 6);
      clue.fillStyle(0x6d8ad4, 0.88);
      clue.fillCircle(24, -24, 7);
      container.add(clue);

      if (gameState.researchLunarFamilyRevealed) {
        const familyChip = this.add
          .text(0, -55, "달빛", {
            align: "center",
            backgroundColor: "rgba(49, 67, 96, 0.86)",
            color: "#f4f0c9",
            fontFamily: "system-ui, sans-serif",
            fontSize: "10px",
            fontStyle: "800",
            padding: { x: 7, y: 2 }
          })
          .setOrigin(0.5);
        container.add(familyChip);
      }
    }

    if (facility?.kind === "expedition_gate" && slot.unlockState === "preview") {
      const gateChip = this.add
        .text(0, -55, "D7", {
          align: "center",
          backgroundColor: "rgba(49, 67, 96, 0.86)",
          color: "#f4f0c9",
          fontFamily: "system-ui, sans-serif",
          fontSize: "10px",
          fontStyle: "800",
          padding: { x: 7, y: 2 }
        })
        .setOrigin(0.5);
      container.add(gateChip);
    }

    if (facility?.kind === "expedition_gate" && slot.unlockState === "unlocked") {
      const stateLabel =
        gameState.expeditionState === "traveling"
          ? "원정중"
          : gameState.expeditionState === "returned"
            ? "귀환"
            : gameState.expeditionState === "claimed"
              ? "완료"
              : "출발";
      const routeChip = this.add
        .text(0, -55, stateLabel, {
          align: "center",
          backgroundColor: "rgba(37, 86, 71, 0.9)",
          color: "#f4f0c9",
          fontFamily: "system-ui, sans-serif",
          fontSize: "10px",
          fontStyle: "800",
          padding: { x: 7, y: 2 }
        })
        .setOrigin(0.5);
      container.add(routeChip);

      if (gameState.expeditionState === "traveling" || gameState.expeditionState === "returned") {
        const bar = this.add.graphics();
        bar.fillStyle(0xffffff, 0.86);
        bar.fillRoundedRect(-36, 24, 72, 8, 4);
        bar.fillStyle(gameState.expeditionState === "returned" ? 0xffc84b : 0x7cae70, 1);
        bar.fillRoundedRect(-36, 24, gameState.expeditionState === "returned" ? 72 : 44, 8, 4);
        container.add(bar);
      }

      if (gameState.expeditionState === "returned") {
        const returnCrate = this.add.image(35, 15, TOPOLOGY_ASSETS.facilities.expeditionReturnCrate.key);
        returnCrate.setDisplaySize(58, 46);
        returnCrate.setDepth(2);
        container.add(returnCrate);
      }

      if (gameState.expeditionSourceClueAvailable) {
        const source = this.add.graphics();
        source.fillStyle(0x27395d, gameState.expeditionSourcePreviewVisible ? 0.92 : 0.58);
        source.fillCircle(-41, -20, 15);
        source.fillStyle(0xf7e9a6, 0.95);
        source.fillCircle(-35, -24, 9);
        source.fillStyle(0x27395d, 0.96);
        source.fillCircle(-31, -26, 9);
        source.lineStyle(2, 0xf7e9a6, gameState.expeditionSourcePreviewVisible ? 0.92 : 0.46);
        source.strokeRoundedRect(12, -31, 42, 24, 10);
        source.fillStyle(0xf7e9a6, gameState.expeditionSourcePreviewVisible ? 0.95 : 0.48);
        source.fillCircle(31, -19, 5);
        container.add(source);

        const sourceLabel = this.add
          .text(gameState.expeditionSourcePreviewVisible ? -6 : -41, gameState.expeditionSourcePreviewVisible ? -56 : -44, gameState.expeditionSourcePreviewVisible ? "초승달순" : "단서", {
            align: "center",
            backgroundColor: "rgba(39, 57, 93, 0.88)",
            color: "#f4f0c9",
            fontFamily: "system-ui, sans-serif",
            fontSize: "10px",
            fontStyle: "800",
            padding: { x: 7, y: 2 }
          })
          .setOrigin(0.5);
        container.add(sourceLabel);

        if (gameState.expeditionSourcePreviewVisible) {
          const routeLock = this.add
            .text(33, 0, "달빛 울타리\n잠김", {
              align: "center",
              backgroundColor: "rgba(37, 86, 71, 0.88)",
              color: "#f4f0c9",
              fontFamily: "system-ui, sans-serif",
              fontSize: "9px",
              fontStyle: "800",
              lineSpacing: 1,
              padding: { x: 6, y: 3 }
            })
            .setOrigin(0.5);
          container.add(routeLock);
        }
      }

      if (gameState.moonFenceRoutePreviewVisible) {
        const routeSpark = this.add.sprite(-34, 16, TOPOLOGY_ASSETS.fx.nightGlassSourceUnlock.key);
        routeSpark.setDisplaySize(52, 46);
        routeSpark.setAlpha(0.58);
        routeSpark.play("night-glass-source-unlock-once");
        container.add(routeSpark);

        const moonFence = this.add
          .text(34, 20, gameState.moonFenceRouteUnlocked ? "월정 문\n열림" : "월정 문\n잠김", {
            align: "center",
            backgroundColor: gameState.moonFenceRouteUnlocked ? "rgba(38, 88, 65, 0.92)" : "rgba(38, 50, 89, 0.9)",
            color: "#f4f0c9",
            fontFamily: "system-ui, sans-serif",
            fontSize: "9px",
            fontStyle: "800",
            lineSpacing: 1,
            padding: { x: 6, y: 3 }
          })
          .setOrigin(0.5);
        container.add(moonFence);

        if (gameState.moonFenceRequirementSurfaceVisible) {
          const requirements = this.add
            .text(0, 49, `조건 ${gameState.moonFenceCurrentClues}/${MOON_FENCE_REQUIRED_CLUES} · ${gameState.moonFenceCurrentMaterials}/${MOON_FENCE_REQUIRED_MATERIALS}`, {
              align: "center",
              backgroundColor: "rgba(245, 238, 194, 0.9)",
              color: "#263259",
              fontFamily: "system-ui, sans-serif",
              fontSize: "9px",
              fontStyle: "800",
              padding: { x: 6, y: 2 }
            })
            .setOrigin(0.5);
          container.add(requirements);
        }

        if (gameState.moonFencePrepDeliveryCrateVisible) {
          const prepCrate = this.add
            .text(-42, -9, "준비 상자\n재료 3/3", {
              align: "center",
              backgroundColor: "rgba(64, 83, 49, 0.9)",
              color: "#fff4c1",
              fontFamily: "system-ui, sans-serif",
              fontSize: "8px",
              fontStyle: "800",
              lineSpacing: 1,
              padding: { x: 6, y: 3 }
            })
            .setOrigin(0.5);
          container.add(prepCrate);
        }

        if (gameState.moonFenceClueStampVisible) {
          const clueStamp = this.add
            .text(42, -10, "단서 도장\n2/2", {
              align: "center",
              backgroundColor: "rgba(87, 64, 121, 0.9)",
              color: "#f8eefe",
              fontFamily: "system-ui, sans-serif",
              fontSize: "8px",
              fontStyle: "800",
              lineSpacing: 1,
              padding: { x: 6, y: 3 }
            })
            .setOrigin(0.5);
          container.add(clueStamp);
        }

        if (gameState.moonFenceUnlockedMarkerVisible) {
          const unlocked = this.add
            .text(0, 67, `${MOON_FENCE_UNLOCKED_ROUTE_ID}\nroute open`, {
              align: "center",
              backgroundColor: "rgba(227, 247, 194, 0.92)",
              color: "#263259",
              fontFamily: "system-ui, sans-serif",
              fontSize: "8px",
              fontStyle: "800",
              lineSpacing: 1,
              padding: { x: 6, y: 3 }
            })
            .setOrigin(0.5);
          container.add(unlocked);
        }
      }
    }

    container.setSize(118, 104);
    container.setInteractive(new Phaser.Geom.Rectangle(-59, -48, 118, 104), Phaser.Geom.Rectangle.Contains);
    container.on("pointerdown", () => this.selectAndRender(slot.id));
    this.renderLayer?.add(container);
  }

  private renderActors() {
    gameState.actors.forEach((actor) => {
      const slot = getSlot(gameState, actor.slotId);
      const target = getSlot(gameState, actor.targetSlotId);
      this.renderTaskPath(slot, target);
      this.renderActor(actor, slot, target);
    });
  }

  private renderLunarSourceReveal() {
    if (!gameState.lunarSourceCreatureRevealed) {
      return;
    }
    const container = this.add.container(304, 234);
    container.setDepth(48);

    const shadow = this.add.image(0, 52, TOPOLOGY_ASSETS.facilities.shadow.key);
    shadow.setDisplaySize(88, 32);
    shadow.setAlpha(0.42);
    container.add(shadow);

    const creature = this.add.image(0, 0, TOPOLOGY_ASSETS.creatures.lunarSource.key);
    creature.setDisplaySize(88, 88);
    creature.setAlpha(0.98);
    container.add(creature);

    const label = this.add
      .text(0, 55, "은빛이끼 루미", {
        align: "center",
        backgroundColor: "rgba(37, 48, 82, 0.86)",
        color: "#f4f0c9",
        fontFamily: "system-ui, sans-serif",
        fontSize: "11px",
        fontStyle: "800",
        padding: { x: 8, y: 3 }
      })
      .setOrigin(0.5);
    container.add(label);
    this.renderLayer?.add(container);
  }

  private renderNightGlassRareReveal() {
    if (!gameState.nightGlassRareCreatureRevealed) {
      return;
    }
    const container = this.add.container(302, 236);
    container.setDepth(56);

    const aura = this.add.sprite(0, -4, TOPOLOGY_ASSETS.fx.nightGlassSourceUnlock.key);
    aura.setDisplaySize(126, 104);
    aura.setAlpha(0.88);
    aura.play("night-glass-source-unlock-once");
    container.add(aura);

    const shadow = this.add.image(0, 54, TOPOLOGY_ASSETS.facilities.shadow.key);
    shadow.setDisplaySize(96, 34);
    shadow.setAlpha(0.42);
    container.add(shadow);

    const creature = this.add.image(0, 0, TOPOLOGY_ASSETS.creatures.lunarRare.key);
    creature.setDisplaySize(92, 92);
    creature.setAlpha(0.99);
    container.add(creature);

    const label = this.add
      .text(0, 58, `${NIGHT_GLASS_RARE_CREATURE_NAME}\n발견`, {
        align: "center",
        backgroundColor: "rgba(42, 36, 84, 0.9)",
        color: "#f9e9ff",
        fontFamily: "system-ui, sans-serif",
        fontSize: "11px",
        fontStyle: "800",
        lineSpacing: 1,
        padding: { x: 8, y: 3 }
      })
      .setOrigin(0.5);
    container.add(label);
    this.renderLayer?.add(container);
  }

  private renderNightGlassSourcePreview() {
    if (!gameState.nightGlassSourcePreviewVisible) {
      return;
    }

    const container = this.add.container(104, 258);
    container.setDepth(47);

    const lockAura = this.add.graphics();
    lockAura.fillStyle(0x27395d, 0.24);
    lockAura.fillEllipse(0, 10, 118, 90);
    lockAura.lineStyle(3, 0xf4d77d, 0.7);
    lockAura.strokeEllipse(0, 3, 98, 72);
    lockAura.lineStyle(2, 0x70c4bc, 0.48);
    lockAura.strokeRoundedRect(-48, -38, 96, 78, 26);
    container.add(lockAura);

    const unlockFx = this.add.sprite(0, -7, TOPOLOGY_ASSETS.fx.nightGlassSourceUnlock.key);
    unlockFx.setDisplaySize(116, 92);
    unlockFx.setAlpha(0.84);
    unlockFx.play("night-glass-source-unlock-once");
    container.add(unlockFx);

    const sourceIcon = this.add.image(0, -9, TOPOLOGY_ASSETS.seeds.nightGlassSource.key);
    sourceIcon.setDisplaySize(72, 72);
    sourceIcon.setAlpha(0.98);
    container.add(sourceIcon);

    const lockLabel = this.add
      .text(0, 49, `밤유리 source\n${this.getNightGlassStateLabel()}`, {
        align: "center",
        backgroundColor: "rgba(37, 48, 82, 0.88)",
        color: "#f4f0c9",
        fontFamily: "system-ui, sans-serif",
        fontSize: "10px",
        fontStyle: "800",
        lineSpacing: 1,
        padding: { x: 8, y: 3 }
      })
      .setOrigin(0.5);
    container.add(lockLabel);

    const routeLabel = this.add
      .text(78, -36, NIGHT_GLASS_ROUTE_PREVIEW_ID, {
        align: "center",
        backgroundColor: "rgba(32, 59, 47, 0.84)",
        color: "#f4f0c9",
        fontFamily: "system-ui, sans-serif",
        fontSize: "8px",
        fontStyle: "800",
        padding: { x: 5, y: 2 }
      })
      .setOrigin(0.5);
    routeLabel.setRotation(-0.04);
    container.add(routeLabel);

    this.renderLayer?.add(container);
  }

  private getNightGlassStateLabel() {
    if (gameState.nightGlassAcquisitionState === "traveling") {
      return "조사중";
    }
    if (gameState.nightGlassAcquisitionState === "returned") {
      return "귀환";
    }
    if (gameState.nightGlassAcquisitionState === "claimed") {
      return "획득";
    }
    return "조사 준비";
  }

  private renderNightGlassAcquisitionMarker() {
    if (!gameState.nightGlassSourcePreviewVisible || gameState.nightGlassAcquisitionState === "ready") {
      return;
    }

    const container = this.add.container(314, 306);
    container.setDepth(50);

    const fill =
      gameState.nightGlassAcquisitionState === "claimed"
        ? 0x2f7b5f
        : gameState.nightGlassAcquisitionState === "returned"
          ? 0x9a5d3d
          : 0x27395d;
    const badge = this.add.graphics();
    badge.fillStyle(fill, 0.9);
    badge.fillRoundedRect(-58, -22, 116, 44, 14);
    badge.lineStyle(2, 0xf4d77d, 0.72);
    badge.strokeRoundedRect(-58, -22, 116, 44, 14);
    container.add(badge);

    const icon = this.add.image(-38, 0, TOPOLOGY_ASSETS.seeds.nightGlassSource.key);
    icon.setDisplaySize(28, 28);
    container.add(icon);

    const label = this.add
      .text(-16, -10, this.getNightGlassMarkerText(), {
        align: "left",
        color: "#f4f0c9",
        fontFamily: "system-ui, sans-serif",
        fontSize: "9px",
        fontStyle: "800",
        lineSpacing: 0
      })
      .setOrigin(0, 0);
    container.add(label);
    this.renderLayer?.add(container);
  }

  private getNightGlassMarkerText() {
    if (gameState.nightGlassAcquisitionState === "traveling") {
      return "밤유리 조사\n진행 중";
    }
    if (gameState.nightGlassAcquisitionState === "returned") {
      return "귀환 상자\n도착";
    }
    return "source\n획득";
  }

  private renderTaskPath(from: BoardSlot, to: BoardSlot) {
    const path = this.add.graphics();
    path.lineStyle(3, 0x4f8d6d, 0.42);
    path.beginPath();
    path.moveTo(from.x, from.y + 34);
    path.lineTo((from.x + to.x) / 2, Math.min(from.y, to.y) + 72);
    path.lineTo(to.x, to.y - 34);
    path.strokePath();
    path.setDepth(31);
    this.renderLayer?.add(path);
  }

  private renderActor(actor: ActorEntity, from: BoardSlot, to: BoardSlot) {
    const container = this.add.container(from.x + 8, from.y - 72);
    container.setDepth(42);

    const shadow = this.add.graphics();
    shadow.fillStyle(0x315b45, 0.28);
    shadow.fillEllipse(0, 42, 54, 18);
    container.add(shadow);

    if (actor.id === NIGHT_GLASS_ORO_ACTOR_ID) {
      const aura = this.add.sprite(0, 3, TOPOLOGY_ASSETS.fx.nightGlassSourceUnlock.key);
      aura.setDisplaySize(72, 64);
      aura.setAlpha(0.68);
      aura.play("night-glass-source-unlock-once");
      container.add(aura);

      const creature = this.add.image(0, 0, TOPOLOGY_ASSETS.creatures.lunarRare.key);
      creature.setDisplaySize(58, 58);
      container.add(creature);
    } else {
      const textureKey = actor.role === "carrier" ? TOPOLOGY_ASSETS.actors.momo.key : TOPOLOGY_ASSETS.actors.pori.key;
      const sprite = this.add.sprite(0, 4, textureKey);
      sprite.setDisplaySize(actor.role === "carrier" ? 72 : 64, actor.role === "carrier" ? 72 : 64);
      sprite.play(actor.role === "carrier" ? "momo-carry-loop" : "pori-care-loop");
      container.add(sprite);
    }

    const label = this.add
      .text(0, 59, actor.name, {
        align: "center",
        color: "#203b2f",
        fontFamily: "system-ui, sans-serif",
        fontSize: "11px",
        fontStyle: "700"
      })
      .setOrigin(0.5);
    container.add(label);
    this.tweens.add({
      targets: container,
      x: { from: from.x + 8, to: to.x - 8 },
      y: { from: from.y - 72, to: to.y - 74 },
      duration: 2600,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut"
    });
    this.renderLayer?.add(container);
  }

  private renderPendingFx() {
    if (!this.pendingFx) {
      return;
    }
    const slot = getSlot(gameState, this.pendingFx.slotId);
    const key =
      this.pendingFx.kind === "care"
        ? TOPOLOGY_ASSETS.fx.care.key
        : this.pendingFx.kind === "nightGlassAcquire"
          ? TOPOLOGY_ASSETS.fx.nightGlassSourceUnlock.key
        : this.pendingFx.kind === "lunarHarvest"
          ? TOPOLOGY_ASSETS.fx.lunarHarvest.key
        : this.pendingFx.kind === "expeditionReturn"
          ? TOPOLOGY_ASSETS.fx.expeditionReturn.key
          : TOPOLOGY_ASSETS.fx.harvest.key;
    const animation =
      this.pendingFx.kind === "care"
        ? "care-spark-once"
        : this.pendingFx.kind === "nightGlassAcquire"
          ? "night-glass-source-unlock-once"
        : this.pendingFx.kind === "lunarHarvest"
          ? "lunar-harvest-moonburst-once"
        : this.pendingFx.kind === "expeditionReturn"
          ? "expedition-return-reward-once"
          : "harvest-leaf-flyout-once";
    const sprite = this.add.sprite(slot.x, slot.y - 28, key);
    sprite.setDepth(60);
    const fxWidth =
      this.pendingFx.kind === "care"
        ? 96
        : this.pendingFx.kind === "nightGlassAcquire"
          ? 132
        : this.pendingFx.kind === "expeditionReturn"
          ? 132
          : this.pendingFx.kind === "lunarHarvest"
            ? 156
            : 144;
    const fxHeight =
      this.pendingFx.kind === "care"
        ? 96
        : this.pendingFx.kind === "nightGlassAcquire"
          ? 108
        : this.pendingFx.kind === "expeditionReturn"
          ? 92
          : this.pendingFx.kind === "lunarHarvest"
            ? 156
            : 104;
    sprite.setDisplaySize(fxWidth, fxHeight);
    sprite.play(animation);
    if (
      this.pendingFx.kind === "delivery" ||
      this.pendingFx.kind === "expeditionReturn" ||
      this.pendingFx.kind === "lunarHarvest" ||
      this.pendingFx.kind === "nightGlassAcquire"
    ) {
      this.tweens.add({
        targets: sprite,
        y: slot.y - 62,
        alpha: { from: 1, to: 0.42 },
        duration: 720,
        ease: "Sine.easeOut"
      });
    }
    sprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => sprite.destroy());
    this.renderLayer?.add(sprite);
    this.pendingFx = undefined;
  }

  private selectAndRender(slotId: string) {
    selectSlot(gameState, slotId);
    this.viewMode = "manage";
    this.renderGarden();
  }

  private toggleViewMode() {
    this.viewMode = this.viewMode === "manage" ? "overview" : "manage";
    this.renderGarden();
  }

  private performAction(
    action:
      | "plant"
      | "care"
      | "harvest"
      | "claim"
      | "deliver"
      | "expand"
      | "unlock_storage"
      | "claim_storage"
      | "inspect_research"
      | "plant_clue"
      | "record_clue"
      | "claim_goal_seed"
      | "plant_goal_seed"
      | "confirm_discovery"
      | "preview_expedition"
      | "start_expedition"
      | "claim_expedition"
      | "preview_source"
      | "plant_lunar_source"
      | "plant_night_glass_source"
      | "preview_night_glass"
      | "start_night_glass"
      | "claim_night_glass"
      | "inspect_moon_fence"
      | "inspect_moon_fence_requirements"
      | "complete_moon_fence_prep_delivery"
      | "package_moon_fence_second_clue"
      | "unlock_moon_fence_route"
  ) {
    const selectedSlotId = gameState.selectedSlotId;
    if (action === "plant") {
      plantStarterSeed(gameState);
    } else if (action === "plant_clue") {
      plantResearchClueSeed(gameState);
    } else if (action === "plant_goal_seed") {
      plantResearchNextGoalSeed(gameState);
    } else if (action === "claim_goal_seed") {
      claimResearchNextGoalSeed(gameState);
    } else if (action === "record_clue") {
      recordResearchClueInAlbum(gameState);
    } else if (action === "confirm_discovery") {
      confirmLunarSproutDiscovery(gameState);
    } else if (action === "preview_expedition") {
      previewExpeditionGateRoute(gameState);
    } else if (action === "start_expedition") {
      startBackyardGapExpedition(gameState);
      this.time.delayedCall(420, () => {
        markBackyardGapExpeditionReturned(gameState);
        this.renderGarden();
      });
    } else if (action === "claim_expedition") {
      claimBackyardGapExpeditionReward(gameState);
      this.pendingFx = { kind: "expeditionReturn", slotId: selectedSlotId };
    } else if (action === "preview_source") {
      previewExpeditionSourceClue(gameState);
      this.pendingFx = { kind: "expeditionReturn", slotId: selectedSlotId };
    } else if (action === "plant_lunar_source") {
      plantLunarSourceSeed(gameState);
      this.pendingFx = { kind: "care", slotId: selectedSlotId };
    } else if (action === "plant_night_glass_source") {
      plantNightGlassSourceSeed(gameState);
      this.pendingFx = { kind: "nightGlassAcquire", slotId: selectedSlotId };
    } else if (action === "preview_night_glass") {
      previewNightGlassSource(gameState);
      this.pendingFx = { kind: "lunarHarvest", slotId: "facility_expedition_gate" };
    } else if (action === "start_night_glass") {
      startNightGlassSourceExpedition(gameState);
      this.time.delayedCall(420, () => {
        markNightGlassSourceExpeditionReturned(gameState);
        this.renderGarden();
      });
    } else if (action === "claim_night_glass") {
      claimNightGlassSourceReward(gameState);
      this.pendingFx = { kind: "nightGlassAcquire", slotId: selectedSlotId };
    } else if (action === "inspect_moon_fence") {
      inspectMoonFenceRoute(gameState);
      this.pendingFx = { kind: "nightGlassAcquire", slotId: "facility_expedition_gate" };
    } else if (action === "inspect_moon_fence_requirements") {
      inspectMoonFenceRequirements(gameState);
      this.pendingFx = { kind: "nightGlassAcquire", slotId: "facility_expedition_gate" };
    } else if (action === "complete_moon_fence_prep_delivery") {
      completeMoonFencePrepDelivery(gameState);
      this.pendingFx = { kind: "delivery", slotId: "facility_expedition_gate" };
    } else if (action === "package_moon_fence_second_clue") {
      packageMoonFenceSecondClue(gameState);
      this.pendingFx = { kind: "lunarHarvest", slotId: "facility_expedition_gate" };
    } else if (action === "unlock_moon_fence_route") {
      unlockMoonFenceRoute(gameState);
      this.pendingFx = { kind: "expeditionReturn", slotId: "facility_expedition_gate" };
    } else if (action === "care") {
      careSelectedPlot(gameState);
      this.pendingFx = { kind: "care", slotId: selectedSlotId };
    } else if (action === "harvest") {
      const harvestedSeedId = getPlotBySlot(gameState, selectedSlotId)?.seedId;
      harvestSelectedPlot(gameState);
      this.pendingFx = {
        kind:
          harvestedSeedId === NIGHT_GLASS_SOURCE_SEED_ID
            ? "nightGlassAcquire"
            : harvestedSeedId === LUNAR_SOURCE_SEED_ID
              ? "lunarHarvest"
              : "harvest",
        slotId: selectedSlotId
      };
    } else if (action === "claim") {
      claimWorkbenchProduction(gameState);
    } else if (action === "deliver") {
      claimOrderCrateDelivery(gameState);
      this.pendingFx = { kind: "delivery", slotId: selectedSlotId };
    } else if (action === "expand") {
      unlockThirdPlot(gameState);
    } else if (action === "unlock_storage") {
      unlockStorageBasket(gameState);
    } else if (action === "claim_storage") {
      claimStoredLeaves(gameState);
      this.pendingFx = { kind: "delivery", slotId: selectedSlotId };
    } else {
      inspectResearchShelfPreview(gameState);
    }
    this.renderGarden();
  }

  private updateHud() {
    if (!this.hud) {
      return;
    }
    const selectedSlot = getSlot(gameState, gameState.selectedSlotId);
    this.hud.leaves.textContent = String(gameState.resources.leaves);
    this.hud.seeds.textContent = String(gameState.resources.starterSeeds);
    this.hud.root.dataset.viewMode = this.viewMode;
    this.hud.viewToggle.textContent = this.viewMode === "overview" ? "관리" : "감상";
    this.hud.viewToggle.setAttribute(
      "aria-label",
      this.viewMode === "overview" ? "관리 모드로 돌아가기" : "감상 모드 열기"
    );
    this.hud.objective.textContent = gameState.objective;
    this.hud.selected.textContent = selectedSlot.label;
    this.hud.actions.innerHTML = "";
    this.hud.receipts.innerHTML = gameState.receipts
      .slice(0, 2)
      .map((receipt) => `<div>${receipt}</div>`)
      .join("");

    const actions = this.getAvailableActions(gameState, selectedSlot);
    if (gameState.researchNextGoalRevealReady) {
      const revealSurface = document.createElement("div");
      revealSurface.className = "collection-goal-surface";
      revealSurface.innerHTML = `
        <strong>달빛 새싹 수확됨</strong>
        <span>다음 발견 준비 완료</span>
      `;
      this.hud.actions.appendChild(revealSurface);
    }
    if (gameState.researchLunarFamilyRevealed) {
      const familySurface = document.createElement("div");
      familySurface.className = "collection-goal-surface";
      familySurface.innerHTML = `
        <strong>달빛 family reveal</strong>
        <span>다음 연구 목표: 원정 문 단서</span>
      `;
      this.hud.actions.appendChild(familySurface);
    }
    if (gameState.expeditionGatePreviewVisible) {
      const stateText =
        gameState.expeditionState === "ready"
          ? "뒷마당 틈새길 출발 가능"
          : gameState.expeditionState === "traveling"
            ? "뒷마당 틈새길 원정 중"
            : gameState.expeditionState === "returned"
              ? "귀환 상자 도착"
              : gameState.expeditionState === "claimed"
                ? "첫 원정 완료 · 다음 route 잠금"
                : "D7 route 잠금 · 전용 asset 후보 필요";
      const expeditionSurface = document.createElement("div");
      expeditionSurface.className = "collection-goal-surface";
      expeditionSurface.innerHTML = `
        <strong>원정 문 preview</strong>
        <span>${stateText}</span>
      `;
      this.hud.actions.appendChild(expeditionSurface);
    }
    if (gameState.expeditionSourceClueAvailable) {
      const sourceText = gameState.expeditionSourcePreviewVisible
        ? gameState.lunarSourceSeedHarvested
          ? "수확 완료 · 은빛이끼 루미 발견 · 밤유리 source 예고"
          : gameState.lunarSourceSeedPlanted
          ? "첫 원정 보상 · 초승달순 재배 중"
          : "첫 원정 보상 · 빈 밭에 심기 · 달빛 울타리 잠김"
        : "귀환 상자에서 새 source 단서 발견";
      const sourceSurface = document.createElement("div");
      sourceSurface.className = "collection-goal-surface";
      sourceSurface.innerHTML = `
        <strong>초승달순 씨앗 source</strong>
        <span>${sourceText}</span>
      `;
      this.hud.actions.appendChild(sourceSurface);
    }
    if (gameState.lunarSourceCreatureRevealed) {
      const lunarRevealSurface = document.createElement("div");
      lunarRevealSurface.className = "collection-goal-surface";
      lunarRevealSurface.innerHTML = `
        <strong>은빛이끼 루미 발견</strong>
        <span>${gameState.nightGlassSourcePreviewVisible ? "밤유리 source route 고정됨" : "다음 rare route: 밤유리 source"}</span>
      `;
      this.hud.actions.appendChild(lunarRevealSurface);
    }
    if (gameState.nightGlassSourcePreviewVisible) {
      const nightGlassStateText =
        gameState.nightGlassOroActorJoined
          ? `${NIGHT_GLASS_RARE_CREATURE_NAME} 합류 · ${NIGHT_GLASS_RARE_CREATURE_ID} · ${NEXT_EXPEDITION_ROUTE_PREVIEW_ID}`
          : gameState.nightGlassRareCreatureRevealed
          ? `${NIGHT_GLASS_RARE_CREATURE_NAME} 발견 · ${NIGHT_GLASS_RARE_CREATURE_ID}`
          : gameState.nightGlassSourceSeedHarvested
            ? `${NIGHT_GLASS_SOURCE_SEED_ID} 수확 완료 · rare reveal 저장`
            : gameState.nightGlassSourceSeedPlanted
          ? `${NIGHT_GLASS_SOURCE_SEED_ID} 재배 중 · 밤유리 rare source`
          : gameState.nightGlassAcquisitionState === "claimed"
          ? `${NIGHT_GLASS_SOURCE_SEED_ID} source 획득 · 빈 밭에 밤유리 심기`
          : gameState.nightGlassAcquisitionState === "returned"
            ? `${NIGHT_GLASS_ROUTE_PREVIEW_ID} 귀환 상자 도착`
            : gameState.nightGlassAcquisitionState === "traveling"
              ? `${NIGHT_GLASS_ROUTE_PREVIEW_ID} 조사 중`
              : `${NIGHT_GLASS_SOURCE_SEED_ID} · research_rare_glass · ${NIGHT_GLASS_ROUTE_PREVIEW_ID} 조사 준비`;
      const nightGlassSurface = document.createElement("div");
      nightGlassSurface.className = "collection-goal-surface";
      nightGlassSurface.innerHTML = `
        <strong>밤유리 source</strong>
        <span>${nightGlassStateText}</span>
      `;
      this.hud.actions.appendChild(nightGlassSurface);
    }
    if (gameState.nightGlassOroRouteHandoffVisible) {
      const oroSurface = document.createElement("div");
      oroSurface.className = "collection-goal-surface";
      const oroRouteText = gameState.moonFenceRouteInspected
        ? `${gameState.nextRareRoutePreviewId ?? NEXT_EXPEDITION_ROUTE_PREVIEW_ID} locked · 월정 문 단서 확인됨`
        : gameState.nightGlassOroRouteActionAvailable
          ? `${gameState.nextRareRoutePreviewId ?? NEXT_EXPEDITION_ROUTE_PREVIEW_ID} preview · 월정 문 단서 보기 대기`
          : `${gameState.nextRareRoutePreviewId ?? NEXT_EXPEDITION_ROUTE_PREVIEW_ID} preview · 월정 문 단서`;
      oroSurface.innerHTML = `
        <strong>밤유리 오로 합류</strong>
        <span>${oroRouteText}</span>
      `;
      this.hud.actions.appendChild(oroSurface);
    }
    if (gameState.moonFenceRoutePreviewVisible) {
      const moonFenceSurface = document.createElement("div");
      moonFenceSurface.className = "collection-goal-surface";
      const moonFenceText = gameState.moonFenceRequirementSurfaceVisible
        ? `오로 explorer · 달빛 단서 ${gameState.moonFenceCurrentClues}/${gameState.moonFenceRequiredClues} · 재료 ${gameState.moonFenceCurrentMaterials}/${gameState.moonFenceRequiredMaterials}${gameState.moonFenceMaterialsReady ? " ready" : ""}`
        : `${NEXT_EXPEDITION_ROUTE_PREVIEW_ID} locked · 다음 expedition route`;
      moonFenceSurface.innerHTML = `
        <strong>월정 문 단서 확인</strong>
        <span>${moonFenceText}</span>
      `;
      this.hud.actions.appendChild(moonFenceSurface);
    }
    if (gameState.moonFenceRequirementSurfaceVisible) {
      const requirementSurface = document.createElement("div");
      requirementSurface.className = "collection-goal-surface";
      requirementSurface.innerHTML = `
        <strong>월정 문 개방 조건</strong>
        <span>오로 explorer · 달빛 단서 ${gameState.moonFenceCurrentClues}/${gameState.moonFenceRequiredClues} · 재료 ${gameState.moonFenceCurrentMaterials}/${gameState.moonFenceRequiredMaterials}${gameState.moonFenceMaterialsReady ? " ready" : ""}</span>
      `;
      this.hud.actions.appendChild(requirementSurface);
    }
    if (gameState.moonFencePrepDeliveryCrateVisible) {
      const prepSurface = document.createElement("div");
      prepSurface.className = "collection-goal-surface";
      prepSurface.innerHTML = `
        <strong>월정 문 준비 납품</strong>
        <span>재료 3/3 ready · 달빛 단서 ${gameState.moonFenceCurrentClues}/${gameState.moonFenceRequiredClues}</span>
      `;
      this.hud.actions.appendChild(prepSurface);
    }
    if (gameState.moonFenceClueStampVisible) {
      const clueSurface = document.createElement("div");
      clueSurface.className = "collection-goal-surface";
      clueSurface.innerHTML = `
        <strong>달빛 단서 포장</strong>
        <span>달빛 단서 2/2 ready · 재료 ${gameState.moonFenceCurrentMaterials}/${gameState.moonFenceRequiredMaterials} ready · 월정 문 열기 대기</span>
      `;
      this.hud.actions.appendChild(clueSurface);
    }
    if (gameState.moonFenceUnlockedMarkerVisible) {
      const unlockSurface = document.createElement("div");
      unlockSurface.className = "collection-goal-surface";
      unlockSurface.innerHTML = `
        <strong>월정 문 열림</strong>
        <span>${gameState.moonFenceUnlockedRouteId ?? MOON_FENCE_UNLOCKED_ROUTE_ID} · 오로 explorer · 단서 ${gameState.moonFenceCurrentClues}/${gameState.moonFenceRequiredClues} ready · 재료 ${gameState.moonFenceCurrentMaterials}/${gameState.moonFenceRequiredMaterials} ready</span>
      `;
      this.hud.actions.appendChild(unlockSurface);
    }
    if (gameState.researchClueGoalSurfaceVisible) {
      const goalSurface = document.createElement("div");
      goalSurface.className = "collection-goal-surface";
      goalSurface.innerHTML = `
        <strong>달빛 단서 기록됨</strong>
        <span>다음 씨앗 목표: 달빛 새싹</span>
      `;
      this.hud.actions.appendChild(goalSurface);
    }
    if (actions.length === 0) {
      const selectedFacility = getFacilityBySlot(gameState, selectedSlot.id);
      const empty = document.createElement("span");
      empty.className = "action-note";
      if (selectedSlot.unlockState === "unlocked" && gameState.nightGlassSourceSeedAvailable) {
        empty.textContent = "빈 밭에 밤유리 심기";
      } else if (gameState.nightGlassSourcePreviewVisible) {
        empty.textContent = gameState.nightGlassOroActorJoined
          ? gameState.moonFenceRouteInspected
            ? gameState.moonFenceRequirementsInspected
              ? gameState.moonFencePrepDeliveryCompleted
                ? gameState.moonFenceSecondCluePackaged
                  ? gameState.moonFenceRouteUnlocked
                    ? "월정 문 열림"
                    : "달빛 단서 포장 완료"
                  : "월정 문 준비 납품 완료"
                : "월정 문 개방 조건 확인됨"
              : "월정 문 개방 조건 대기"
            : gameState.nightGlassOroRouteActionAvailable
              ? "월정 문 단서 보기 대기"
              : `${NIGHT_GLASS_RARE_CREATURE_NAME} 합류`
          : gameState.nightGlassRareCreatureRevealed
          ? `${NIGHT_GLASS_RARE_CREATURE_NAME} 발견`
          : gameState.nightGlassSourceSeedHarvested
            ? "밤유리 수확 완료"
            : gameState.nightGlassSourceSeedPlanted
          ? "밤유리 재배 중"
          : gameState.nightGlassAcquisitionState === "claimed"
            ? "밤유리 source 보관됨"
            : gameState.nightGlassAcquisitionState === "traveling"
              ? "밤유리 조사 중"
              : "밤유리 source route 대기";
      } else {
        empty.textContent =
          selectedFacility?.kind === "order_crate"
            ? selectedFacility.progress > 0
              ? `주문 준비 ${selectedFacility.progress}%`
              : "다음 상자 준비"
            : selectedFacility?.kind === "storage" && selectedSlot.unlockState === "unlocked"
              ? `오프라인 보관 ${gameState.storedLeaves}/${gameState.storageCapacity}`
              : selectedFacility?.kind === "research_shelf" && selectedSlot.unlockState === "preview"
                ? gameState.researchClueSeedAvailable
                  ? "빈 밭에 단서 심기"
                  : "다음 씨앗 단서 preview"
                : selectedSlot.unlockState === "unlocked" && gameState.researchClueSeedAvailable
                  ? "빈 밭을 선택해 단서 심기"
                  : selectedSlot.unlockState === "unlocked" && gameState.researchNextGoalSeedAvailable
                    ? "빈 밭에 목표 심기"
                    : selectedSlot.unlockState === "unlocked" && gameState.lunarSourceSeedAvailable
                      ? "빈 밭에 초승달순 심기"
                      : gameState.researchNextGoalRevealReady
                        ? "다음 발견 준비 완료"
                        : gameState.researchLunarFamilyRevealed
                          ? gameState.expeditionGatePreviewVisible
                            ? gameState.expeditionState === "traveling"
                              ? "뒷마당 틈새길 원정 중"
                              : gameState.expeditionState === "returned"
                                ? "귀환 상자 대기"
                                : gameState.expeditionState === "claimed"
                                  ? gameState.expeditionSourcePreviewVisible
                                    ? "초승달순 source 확인됨"
                                    : "초승달순 단서 대기"
                                  : "원정 문 preview 표시됨"
                            : "달빛 family 연구 중"
                          : gameState.nightGlassSourcePreviewAvailable && !gameState.nightGlassSourcePreviewVisible
                            ? "밤유리 source 보기 대기"
                            : selectedSlot.unlockState === "unlocked" && gameState.researchClueRecordReady
                              ? "도감 기록 대기"
                              : selectedSlot.unlockState === "unlocked"
                                ? "다른 slot을 선택"
                                : "해금 preview";
      }
      this.hud.actions.appendChild(empty);
      return;
    }

    actions.forEach((action) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = action.label;
      button.dataset.action = action.id;
      button.addEventListener("click", () => this.performAction(action.id));
      this.hud?.actions.appendChild(button);
    });
  }

  private getAvailableActions(
    state: GardenState,
    selectedSlot: BoardSlot
  ): Array<{
    id:
      | "plant"
      | "care"
      | "harvest"
      | "claim"
      | "deliver"
      | "expand"
      | "unlock_storage"
      | "claim_storage"
      | "inspect_research"
      | "plant_clue"
      | "record_clue"
      | "claim_goal_seed"
      | "plant_goal_seed"
      | "confirm_discovery"
      | "preview_expedition"
      | "start_expedition"
      | "claim_expedition"
      | "preview_source"
      | "plant_lunar_source"
      | "plant_night_glass_source"
      | "preview_night_glass"
      | "start_night_glass"
      | "claim_night_glass"
      | "inspect_moon_fence"
      | "inspect_moon_fence_requirements"
      | "complete_moon_fence_prep_delivery"
      | "package_moon_fence_second_clue"
      | "unlock_moon_fence_route";
    label: string;
  }> {
    const plot = getPlotBySlot(state, selectedSlot.id);
    const facility = getFacilityBySlot(state, selectedSlot.id);
    if (state.researchNextGoalRevealReady && !state.researchLunarFamilyRevealed) {
      return [{ id: "confirm_discovery", label: "발견 확인" }];
    }
    if (state.researchLunarFamilyRevealed && !state.expeditionGatePreviewVisible) {
      return [{ id: "preview_expedition", label: "원정 문 단서 보기" }];
    }
    if (
      facility?.kind === "expedition_gate" &&
      state.nightGlassSourcePreviewVisible &&
      state.nightGlassAcquisitionState === "ready"
    ) {
      return [{ id: "start_night_glass", label: "밤유리 조사 보내기" }];
    }
    if (
      facility?.kind === "expedition_gate" &&
      state.nightGlassSourcePreviewVisible &&
      state.nightGlassAcquisitionState === "returned"
    ) {
      return [{ id: "claim_night_glass", label: "밤유리 귀환 상자 열기" }];
    }
    if (state.nightGlassOroRouteActionAvailable && !state.moonFenceRouteInspected) {
      return [{ id: "inspect_moon_fence", label: "월정 문 단서 보기" }];
    }
    if (state.moonFenceRouteInspected && !state.moonFenceRequirementsInspected) {
      return [{ id: "inspect_moon_fence_requirements", label: "개방 조건 보기" }];
    }
    if (state.moonFencePrepDeliveryAvailable && !state.moonFencePrepDeliveryCompleted) {
      return [{ id: "complete_moon_fence_prep_delivery", label: "월정 문 준비 납품" }];
    }
    if (state.moonFenceSecondClueAvailable && !state.moonFenceSecondCluePackaged) {
      return [{ id: "package_moon_fence_second_clue", label: "달빛 단서 포장" }];
    }
    if (state.moonFenceUnlockAvailable && !state.moonFenceRouteUnlocked) {
      return [{ id: "unlock_moon_fence_route", label: "월정 문 열기" }];
    }
    if (facility?.kind === "expedition_gate" && state.expeditionState === "ready") {
      return [{ id: "start_expedition", label: "틈새길 보내기" }];
    }
    if (facility?.kind === "expedition_gate" && state.expeditionState === "returned") {
      return [{ id: "claim_expedition", label: "귀환 상자 열기" }];
    }
    if (
      facility?.kind === "expedition_gate" &&
      state.expeditionState === "claimed" &&
      state.expeditionSourceClueAvailable &&
      !state.expeditionSourcePreviewVisible
    ) {
      return [{ id: "preview_source", label: "초승달순 단서 보기" }];
    }
    if (
      state.lunarSourceCreatureRevealed &&
      state.nightGlassSourcePreviewAvailable &&
      !state.nightGlassSourcePreviewVisible
    ) {
      return [{ id: "preview_night_glass", label: "밤유리 source 보기" }];
    }
    if (
      state.researchClueGoalSurfaceVisible &&
      !state.researchNextGoalSeedAvailable &&
      !state.researchNextGoalSeedPlanted
    ) {
      return [{ id: "claim_goal_seed", label: "목표 씨앗 받기" }];
    }
    if (
      selectedSlot.id === "plot_03" &&
      selectedSlot.unlockState !== "unlocked" &&
      state.resources.leaves >= THIRD_PLOT_UNLOCK_COST
    ) {
      return [{ id: "expand", label: `확장 ${THIRD_PLOT_UNLOCK_COST}잎` }];
    }
    if (
      facility?.kind === "storage" &&
      selectedSlot.unlockState !== "unlocked" &&
      state.completedDeliveries >= 2 &&
      state.resources.leaves >= STORAGE_BASKET_UNLOCK_COST
    ) {
      return [{ id: "unlock_storage", label: `정리 ${STORAGE_BASKET_UNLOCK_COST}잎` }];
    }
    if (facility?.kind === "storage" && selectedSlot.unlockState === "unlocked" && state.storedLeaves > 0) {
      return [{ id: "claim_storage", label: "회수" }];
    }
    if (
      facility?.kind === "research_shelf" &&
      selectedSlot.unlockState === "preview" &&
      !state.researchShelfPreviewSeen
    ) {
      return [{ id: "inspect_research", label: "살펴보기" }];
    }
    if (plot?.state === "empty" && selectedSlot.unlockState === "unlocked" && state.researchClueSeedAvailable) {
      return [{ id: "plant_clue", label: "단서 심기" }];
    }
    if (plot?.state === "empty" && selectedSlot.unlockState === "unlocked" && state.researchNextGoalSeedAvailable) {
      return [{ id: "plant_goal_seed", label: "목표 심기" }];
    }
    if (plot?.state === "empty" && selectedSlot.unlockState === "unlocked" && state.lunarSourceSeedAvailable) {
      return [{ id: "plant_lunar_source", label: "초승달순 심기" }];
    }
    if (plot?.state === "empty" && selectedSlot.unlockState === "unlocked" && state.nightGlassSourceSeedAvailable) {
      return [{ id: "plant_night_glass_source", label: "밤유리 심기" }];
    }
    if (selectedSlot.unlockState === "unlocked" && state.researchClueRecordReady && !state.researchClueAlbumRecorded) {
      return [{ id: "record_clue", label: "도감 기록" }];
    }
    if (plot?.state === "empty" && selectedSlot.unlockState === "unlocked" && state.resources.starterSeeds > 0) {
      return [{ id: "plant", label: "심기" }];
    }
    if (plot?.state === "planted" || plot?.state === "growing") {
      return [{ id: "care", label: "돌보기" }];
    }
    if (plot?.state === "ready") {
      if (plot.seedId === NIGHT_GLASS_SOURCE_SEED_ID) {
        return [{ id: "harvest", label: "밤유리 수확" }];
      }
      if (plot.seedId === LUNAR_SOURCE_SEED_ID) {
        return [{ id: "harvest", label: "초승달순 수확" }];
      }
      return [{ id: "harvest", label: "수확" }];
    }
    if (selectedSlot.id === "facility_workbench" && state.actors.length > 0) {
      return [{ id: "claim", label: "수령" }];
    }
    if (facility?.kind === "order_crate" && facility.progress >= 100) {
      return [{ id: "deliver", label: "납품" }];
    }
    return [];
  }

  private getPlotTextureKey(plot: PlotEntity | undefined, unlockState: BoardSlot["unlockState"]) {
    if (unlockState !== "unlocked") {
      return TOPOLOGY_ASSETS.plots.locked.key;
    }
    if (!plot || plot.state === "empty") {
      return TOPOLOGY_ASSETS.plots.empty.key;
    }
    return TOPOLOGY_ASSETS.plots[plot.state].key;
  }

  private getFacilityTextureKey(facility?: FacilityEntity) {
    if (!facility) {
      return TOPOLOGY_ASSETS.facilities.orderCrateEmpty.key;
    }
    if (facility.kind === "workbench") {
      return TOPOLOGY_ASSETS.facilities.workbench.key;
    }
    if (facility.kind === "order_crate") {
      return facility.progress >= 100
        ? TOPOLOGY_ASSETS.facilities.orderCrateFilled.key
        : TOPOLOGY_ASSETS.facilities.orderCrateEmpty.key;
    }
    if (facility.kind === "research_shelf") {
      return TOPOLOGY_ASSETS.facilities.workbench.key;
    }
    if (facility.kind === "expedition_gate") {
      return TOPOLOGY_ASSETS.facilities.expeditionGate.key;
    }
    return TOPOLOGY_ASSETS.facilities.orderCrateEmpty.key;
  }
}

new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game-root",
  backgroundColor: "#d9e7c6",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 393,
    height: 852
  },
  scene: GardenBoardScene
});
