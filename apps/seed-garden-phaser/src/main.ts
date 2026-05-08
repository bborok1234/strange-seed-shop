import * as Phaser from "phaser";
import {
  careSelectedPlot,
  claimBackyardGapExpeditionReward,
  claimResearchNextGoalSeed,
  claimOrderCrateDelivery,
  claimStoredLeaves,
  claimWorkbenchProduction,
  confirmLunarSproutDiscovery,
  createGardenState,
  getFacilityBySlot,
  getPlotBySlot,
  getSlot,
  harvestSelectedPlot,
  inspectResearchShelfPreview,
  LUNAR_SOURCE_SEED_ID,
  markBackyardGapExpeditionReturned,
  NIGHT_GLASS_ROUTE_PREVIEW_ID,
  NIGHT_GLASS_SOURCE_SEED_ID,
  plantLunarSourceSeed,
  plantResearchNextGoalSeed,
  plantResearchClueSeed,
  plantStarterSeed,
  previewExpeditionGateRoute,
  previewExpeditionSourceClue,
  previewNightGlassSource,
  recordResearchClueInAlbum,
  selectSlot,
  startBackyardGapExpedition,
  STORAGE_BASKET_UNLOCK_COST,
  THIRD_PLOT_UNLOCK_COST,
  unlockStorageBasket,
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
  private pendingFx?: { kind: "care" | "harvest" | "delivery" | "expeditionReturn" | "lunarHarvest"; slotId: string };
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
    this.renderLunarSourceReveal();
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

  private renderNightGlassSourcePreview() {
    if (!gameState.nightGlassSourcePreviewVisible) {
      return;
    }

    const container = this.add.container(104, 258);
    container.setDepth(47);

    const lockAura = this.add.graphics();
    lockAura.fillStyle(0x27395d, 0.28);
    lockAura.fillEllipse(0, 8, 112, 86);
    lockAura.lineStyle(3, 0xf4d77d, 0.62);
    lockAura.strokeEllipse(0, 4, 96, 70);
    lockAura.lineStyle(2, 0x27395d, 0.52);
    lockAura.strokeRoundedRect(-46, -38, 92, 76, 24);
    container.add(lockAura);

    const creature = this.add.image(0, -4, TOPOLOGY_ASSETS.creatures.lunarRare.key);
    creature.setDisplaySize(76, 76);
    creature.setAlpha(0.66);
    creature.setTint(0x46516f);
    container.add(creature);

    const lockLabel = this.add
      .text(0, 49, "밤유리 source\n잠김", {
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
      .text(72, 0, NIGHT_GLASS_ROUTE_PREVIEW_ID, {
        align: "center",
        backgroundColor: "rgba(32, 59, 47, 0.84)",
        color: "#f4f0c9",
        fontFamily: "system-ui, sans-serif",
        fontSize: "8px",
        fontStyle: "800",
        padding: { x: 5, y: 2 }
      })
      .setOrigin(0.5);
    routeLabel.setRotation(-0.08);
    container.add(routeLabel);

    this.renderLayer?.add(container);
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

    const textureKey = actor.role === "carrier" ? TOPOLOGY_ASSETS.actors.momo.key : TOPOLOGY_ASSETS.actors.pori.key;
    const sprite = this.add.sprite(0, 4, textureKey);
    sprite.setDisplaySize(actor.role === "carrier" ? 72 : 64, actor.role === "carrier" ? 72 : 64);
    sprite.play(actor.role === "carrier" ? "momo-carry-loop" : "pori-care-loop");
    container.add(sprite);

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
        : this.pendingFx.kind === "lunarHarvest"
          ? TOPOLOGY_ASSETS.fx.lunarHarvest.key
        : this.pendingFx.kind === "expeditionReturn"
          ? TOPOLOGY_ASSETS.fx.expeditionReturn.key
          : TOPOLOGY_ASSETS.fx.harvest.key;
    const animation =
      this.pendingFx.kind === "care"
        ? "care-spark-once"
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
        : this.pendingFx.kind === "expeditionReturn"
          ? 132
          : this.pendingFx.kind === "lunarHarvest"
            ? 156
            : 144;
    const fxHeight =
      this.pendingFx.kind === "care"
        ? 96
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
      this.pendingFx.kind === "lunarHarvest"
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
      | "preview_night_glass"
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
    } else if (action === "preview_night_glass") {
      previewNightGlassSource(gameState);
      this.pendingFx = { kind: "lunarHarvest", slotId: "facility_expedition_gate" };
    } else if (action === "care") {
      careSelectedPlot(gameState);
      this.pendingFx = { kind: "care", slotId: selectedSlotId };
    } else if (action === "harvest") {
      const harvestedSeedId = getPlotBySlot(gameState, selectedSlotId)?.seedId;
      harvestSelectedPlot(gameState);
      this.pendingFx = {
        kind: harvestedSeedId === LUNAR_SOURCE_SEED_ID ? "lunarHarvest" : "harvest",
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
      const nightGlassSurface = document.createElement("div");
      nightGlassSurface.className = "collection-goal-surface";
      nightGlassSurface.innerHTML = `
        <strong>밤유리 source</strong>
        <span>${NIGHT_GLASS_SOURCE_SEED_ID} · research_rare_glass · ${NIGHT_GLASS_ROUTE_PREVIEW_ID} 잠김</span>
      `;
      this.hud.actions.appendChild(nightGlassSurface);
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
      empty.textContent =
        gameState.nightGlassSourcePreviewVisible
          ? "밤유리 source route 잠김"
        : selectedFacility?.kind === "order_crate"
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
      | "preview_night_glass";
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
