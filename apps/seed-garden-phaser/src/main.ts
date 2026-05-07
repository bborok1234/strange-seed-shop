import * as Phaser from "phaser";
import {
  careSelectedPlot,
  claimOrderCrateDelivery,
  claimStoredLeaves,
  claimWorkbenchProduction,
  createGardenState,
  getFacilityBySlot,
  getPlotBySlot,
  getSlot,
  harvestSelectedPlot,
  plantStarterSeed,
  selectSlot,
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
    }
  }
} as const;

const TOPOLOGY_ASSET_KEYS = [
  TOPOLOGY_ASSETS.terrain.key,
  ...Object.values(TOPOLOGY_ASSETS.plots).map((asset) => asset.key),
  ...Object.values(TOPOLOGY_ASSETS.facilities).map((asset) => asset.key),
  ...Object.values(TOPOLOGY_ASSETS.actors).map((asset) => asset.key),
  ...Object.values(TOPOLOGY_ASSETS.fx).map((asset) => asset.key)
];

interface HudElements {
  root: HTMLDivElement;
  leaves: HTMLSpanElement;
  seeds: HTMLSpanElement;
  objective: HTMLDivElement;
  selected: HTMLDivElement;
  actions: HTMLDivElement;
  receipts: HTMLDivElement;
}

function createHud(): HudElements {
  const root = document.createElement("div");
  root.className = "garden-hud";
  root.innerHTML = `
    <div class="hud-top" data-testid="phaser-resource-hud">
      <span class="resource-chip">잎 <strong data-hud="leaves">0</strong></span>
      <span class="resource-chip">씨앗 <strong data-hud="seeds">1</strong></span>
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
    objective: root.querySelector(".objective-chip") as HTMLDivElement,
    selected: root.querySelector(".selected-entity") as HTMLDivElement,
    actions: root.querySelector(".action-buttons") as HTMLDivElement,
    receipts: root.querySelector(".receipt-stack") as HTMLDivElement
  };
}

class GardenBoardScene extends Phaser.Scene {
  private hud?: HudElements;
  private renderLayer?: Phaser.GameObjects.Layer;
  private pendingFx?: { kind: "care" | "harvest" | "delivery"; slotId: string };

  constructor() {
    super("GardenBoardScene");
  }

  preload() {
    this.load.image(TOPOLOGY_ASSETS.terrain.key, TOPOLOGY_ASSETS.terrain.path);
    Object.values(TOPOLOGY_ASSETS.plots).forEach((asset) => this.load.image(asset.key, asset.path));
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
    this.renderGarden();
  }

  private renderGarden() {
    this.renderLayer?.destroy();
    this.renderLayer = this.add.layer();
    this.renderTerrain();
    this.renderSlots();
    this.renderActors();
    this.renderPendingFx();
    (window as unknown as { __seedGardenActorIds?: string[] }).__seedGardenActorIds = gameState.actors.map(
      (actor) => actor.id
    );
    (window as unknown as { __seedGardenOrderCrateProgress?: number }).__seedGardenOrderCrateProgress =
      getFacilityBySlot(gameState, "facility_order_crate")?.progress ?? 0;
    (window as unknown as { __seedGardenCompletedDeliveries?: number }).__seedGardenCompletedDeliveries =
      gameState.completedDeliveries;
    (window as unknown as { __seedGardenStorageCapacity?: number }).__seedGardenStorageCapacity =
      gameState.storageCapacity;
    (window as unknown as { __seedGardenStoredLeaves?: number }).__seedGardenStoredLeaves = gameState.storedLeaves;
    (window as unknown as { __seedGardenStorageFillRatio?: number }).__seedGardenStorageFillRatio =
      gameState.storageCapacity > 0 ? gameState.storedLeaves / gameState.storageCapacity : 0;
    (window as unknown as { __seedGardenUnlockedSlotIds?: string[] }).__seedGardenUnlockedSlotIds = gameState.slots
      .filter((slot) => slot.unlockState === "unlocked")
      .map((slot) => slot.id);
    (window as unknown as { __seedGardenFacilityStates?: Array<Pick<FacilityEntity, "slotId" | "kind" | "level" | "visualState">> })
      .__seedGardenFacilityStates = gameState.facilities.map((facility) => ({
        slotId: facility.slotId,
        kind: facility.kind,
        level: facility.level,
        visualState: facility.visualState
      }));
    (window as unknown as { __seedGardenPlotIds?: string[] }).__seedGardenPlotIds = gameState.plots.map(
      (plot) => plot.slotId
    );
    (window as unknown as { __seedGardenPlotStates?: Array<Pick<PlotEntity, "slotId" | "state" | "growth">> })
      .__seedGardenPlotStates = gameState.plots.map((plot) => ({
        slotId: plot.slotId,
        state: plot.state,
        growth: plot.growth
      }));
    (window as unknown as { __seedGardenReceipts?: string[] }).__seedGardenReceipts = gameState.receipts;
    this.updateHud();
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
    const key = this.pendingFx.kind === "care" ? TOPOLOGY_ASSETS.fx.care.key : TOPOLOGY_ASSETS.fx.harvest.key;
    const animation = this.pendingFx.kind === "care" ? "care-spark-once" : "harvest-leaf-flyout-once";
    const sprite = this.add.sprite(slot.x, slot.y - 28, key);
    sprite.setDepth(60);
    sprite.setDisplaySize(this.pendingFx.kind === "care" ? 96 : 144, this.pendingFx.kind === "care" ? 96 : 104);
    sprite.play(animation);
    if (this.pendingFx.kind === "delivery") {
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
    this.renderGarden();
  }

  private performAction(
    action: "plant" | "care" | "harvest" | "claim" | "deliver" | "expand" | "unlock_storage" | "claim_storage"
  ) {
    const selectedSlotId = gameState.selectedSlotId;
    if (action === "plant") {
      plantStarterSeed(gameState);
    } else if (action === "care") {
      careSelectedPlot(gameState);
      this.pendingFx = { kind: "care", slotId: selectedSlotId };
    } else if (action === "harvest") {
      harvestSelectedPlot(gameState);
      this.pendingFx = { kind: "harvest", slotId: selectedSlotId };
    } else if (action === "claim") {
      claimWorkbenchProduction(gameState);
    } else if (action === "deliver") {
      claimOrderCrateDelivery(gameState);
      this.pendingFx = { kind: "delivery", slotId: selectedSlotId };
    } else if (action === "expand") {
      unlockThirdPlot(gameState);
    } else if (action === "unlock_storage") {
      unlockStorageBasket(gameState);
    } else {
      claimStoredLeaves(gameState);
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
    this.hud.objective.textContent = gameState.objective;
    this.hud.selected.textContent = selectedSlot.label;
    this.hud.actions.innerHTML = "";
    this.hud.receipts.innerHTML = gameState.receipts
      .slice(0, 2)
      .map((receipt) => `<div>${receipt}</div>`)
      .join("");

    const actions = this.getAvailableActions(gameState, selectedSlot);
    if (actions.length === 0) {
      const selectedFacility = getFacilityBySlot(gameState, selectedSlot.id);
      const empty = document.createElement("span");
      empty.className = "action-note";
      empty.textContent =
        selectedFacility?.kind === "order_crate"
          ? selectedFacility.progress > 0
            ? `주문 준비 ${selectedFacility.progress}%`
            : "다음 상자 준비"
          : selectedFacility?.kind === "storage" && selectedSlot.unlockState === "unlocked"
            ? `오프라인 보관 ${gameState.storedLeaves}/${gameState.storageCapacity}`
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
    id: "plant" | "care" | "harvest" | "claim" | "deliver" | "expand" | "unlock_storage" | "claim_storage";
    label: string;
  }> {
    const plot = getPlotBySlot(state, selectedSlot.id);
    const facility = getFacilityBySlot(state, selectedSlot.id);
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
    if (plot?.state === "empty" && selectedSlot.unlockState === "unlocked" && state.resources.starterSeeds > 0) {
      return [{ id: "plant", label: "심기" }];
    }
    if (plot?.state === "planted" || plot?.state === "growing") {
      return [{ id: "care", label: "돌보기" }];
    }
    if (plot?.state === "ready") {
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
