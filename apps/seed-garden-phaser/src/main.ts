import * as Phaser from "phaser";
import {
  careSelectedPlot,
  claimWorkbenchProduction,
  createGardenState,
  getFacilityBySlot,
  getPlotBySlot,
  getSlot,
  harvestSelectedPlot,
  plantStarterSeed,
  selectSlot,
  type ActorEntity,
  type BoardSlot,
  type FacilityEntity,
  type GardenState,
  type PlotEntity
} from "./gameState";
import "./styles.css";

const gameState = createGardenState();

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

  constructor() {
    super("GardenBoardScene");
  }

  create() {
    this.cameras.main.setBackgroundColor("#d9e7c6");
    this.hud = createHud();
    this.renderGarden();
  }

  private renderGarden() {
    this.renderLayer?.destroy();
    this.renderLayer = this.add.layer();
    this.renderTerrain();
    this.renderSlots();
    this.renderActors();
    this.updateHud();
  }

  private renderTerrain() {
    const graphics = this.add.graphics();
    graphics.fillStyle(0xd9e7c6, 1);
    graphics.fillRect(0, 0, 393, 852);
    graphics.fillStyle(0xb8d2a0, 1);
    graphics.fillRoundedRect(28, 132, 337, 602, 36);
    graphics.fillStyle(0xe8f0ce, 1);
    graphics.fillEllipse(196, 424, 302, 462);
    graphics.fillStyle(0x9cb77e, 0.55);
    graphics.fillRoundedRect(44, 680, 305, 22, 12);
    graphics.lineStyle(2, 0x6d8c65, 0.35);
    graphics.strokeRoundedRect(28, 132, 337, 602, 36);
    this.renderLayer?.add(graphics);

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
    const fill = this.getPlotFill(plot, slot.unlockState);
    const outline = isSelected ? 0xffcf5a : locked ? 0x8a927f : 0x557a51;

    const bed = this.add.graphics();
    bed.fillStyle(fill, locked ? 0.72 : 1);
    bed.fillRoundedRect(-58, -36, 116, 72, 24);
    bed.lineStyle(isSelected ? 5 : 3, outline, 0.92);
    bed.strokeRoundedRect(-58, -36, 116, 72, 24);
    bed.fillStyle(0x6f8f5f, locked ? 0.22 : 0.34);
    bed.fillEllipse(0, 22, 92, 18);
    container.add(bed);

    const stateLabel = this.add
      .text(0, -6, this.getPlotGlyph(plot, slot.unlockState), {
        align: "center",
        color: locked ? "#586257" : "#203b2f",
        fontFamily: "system-ui, sans-serif",
        fontSize: "22px",
        fontStyle: "700"
      })
      .setOrigin(0.5);
    container.add(stateLabel);

    const label = this.add
      .text(0, 46, slot.label, {
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

    const prop = this.add.graphics();
    prop.fillStyle(locked ? 0x8b9184 : preview ? 0xd7cba2 : 0xb9855f, locked ? 0.42 : 1);
    prop.fillRoundedRect(-52, -34, 104, 68, 14);
    prop.lineStyle(isSelected ? 5 : 3, isSelected ? 0xffcf5a : 0x5d6d58, 0.9);
    prop.strokeRoundedRect(-52, -34, 104, 68, 14);
    prop.fillStyle(0x5b4636, locked ? 0.2 : 0.34);
    prop.fillRoundedRect(-34, -18, 68, 16, 8);
    container.add(prop);

    const glyph = this.getFacilityGlyph(facility);
    const text = this.add
      .text(0, -3, glyph, {
        align: "center",
        color: locked ? "#596058" : "#203b2f",
        fontFamily: "system-ui, sans-serif",
        fontSize: "18px",
        fontStyle: "700"
      })
      .setOrigin(0.5);
    container.add(text);

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

    const body = this.add.graphics();
    body.fillStyle(0x8fc46a, 1);
    body.fillRoundedRect(-22, -22, 44, 54, 20);
    body.fillStyle(0xf5ffd5, 1);
    body.fillCircle(-8, -5, 4);
    body.fillCircle(9, -5, 4);
    body.fillStyle(0x477a45, 1);
    body.fillRoundedRect(-16, -38, 32, 22, 16);
    container.add(body);

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

  private selectAndRender(slotId: string) {
    selectSlot(gameState, slotId);
    this.renderGarden();
  }

  private performAction(action: "plant" | "care" | "harvest" | "claim") {
    if (action === "plant") {
      plantStarterSeed(gameState);
    } else if (action === "care") {
      careSelectedPlot(gameState);
    } else if (action === "harvest") {
      harvestSelectedPlot(gameState);
    } else {
      claimWorkbenchProduction(gameState);
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
      const empty = document.createElement("span");
      empty.className = "action-note";
      empty.textContent = selectedSlot.unlockState === "unlocked" ? "다른 slot을 선택" : "해금 preview";
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
  ): Array<{ id: "plant" | "care" | "harvest" | "claim"; label: string }> {
    const plot = getPlotBySlot(state, selectedSlot.id);
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
    return [];
  }

  private getPlotFill(plot: PlotEntity | undefined, unlockState: BoardSlot["unlockState"]) {
    if (unlockState === "locked") {
      return 0x9ca48f;
    }
    if (unlockState === "preview") {
      return 0xcad7aa;
    }
    if (!plot || plot.state === "empty") {
      return 0xc4875f;
    }
    if (plot.state === "ready") {
      return 0xf1c75e;
    }
    return plot.state === "growing" ? 0x78b96a : 0x97c472;
  }

  private getPlotGlyph(plot: PlotEntity | undefined, unlockState: BoardSlot["unlockState"]) {
    if (unlockState === "locked") {
      return "잠김";
    }
    if (unlockState === "preview") {
      return "다음 밭";
    }
    if (!plot || plot.state === "empty") {
      return "빈 밭";
    }
    if (plot.state === "ready") {
      return "수확";
    }
    return `${plot.growth}%`;
  }

  private getFacilityGlyph(facility?: FacilityEntity) {
    if (!facility) {
      return "시설";
    }
    if (facility.kind === "workbench") {
      return facility.progress > 0 ? `작업 ${facility.progress}%` : "작업대";
    }
    if (facility.kind === "order_crate") {
      return facility.progress >= 100 ? "포장 완료" : `주문 ${facility.progress}%`;
    }
    return "보관";
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
