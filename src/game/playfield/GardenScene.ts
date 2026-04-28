import * as Phaser from "phaser";
import type {
  ManifestAsset,
  PlayfieldAnimationAction,
  PlayfieldAnimationPlotState,
  PlayfieldAnimationSlot,
  PlayfieldAnimationTarget
} from "../../types/game";
import type { GardenPlayfieldActionHandler, GardenPlayfieldViewModel, GardenPlotView } from "./types";

const FAMILY_COLORS: Record<NonNullable<GardenPlotView["family"]>, { fill: number; accent: number; text: string }> = {
  herb: { fill: 0x8ccf72, accent: 0x2f6f45, text: "#213f2e" },
  candy: { fill: 0xf2a7c9, accent: 0xaa4f7a, text: "#4e2438" },
  lunar: { fill: 0x9fb5f5, accent: 0x4b5eaa, text: "#242b58" }
};

const STATE_COLORS: Record<GardenPlotView["state"], { fill: number; stroke: number; label: string }> = {
  locked: { fill: 0x87907f, stroke: 0x66705e, label: "잠김" },
  empty: { fill: 0xe9d99a, stroke: 0x9c7d43, label: "빈 밭" },
  growing: { fill: 0xaedc82, stroke: 0x4f803f, label: "성장" },
  ready: { fill: 0xf7d65f, stroke: 0xb37724, label: "수확" }
};

const EFFECT_LAYOUT: Partial<Record<PlayfieldAnimationSlot, { displaySize: number; offsetX: number; offsetY: number }>> = {
  tap_feedback: { displaySize: 78, offsetX: 0, offsetY: 0 },
  harvest_fx: { displaySize: 96, offsetX: 0, offsetY: -4 },
  reward_fx: { displaySize: 78, offsetX: 16, offsetY: -18 }
};

export class GardenScene extends Phaser.Scene {
  private readonly onActionRef: { current: GardenPlayfieldActionHandler };
  private viewModel: GardenPlayfieldViewModel | null = null;
  private playfieldAssets: ManifestAsset[] = [];
  private root?: Phaser.GameObjects.Container;
  private fxRoot?: Phaser.GameObjects.Container;
  private lastTapAt = 0;

  constructor(onActionRef: { current: GardenPlayfieldActionHandler }, playfieldAssets: ManifestAsset[] = []) {
    super("GardenScene");
    this.onActionRef = onActionRef;
    this.playfieldAssets = playfieldAssets;
  }

  create() {
    this.fxRoot = this.add.container(0, 0).setDepth(20);
    this.scale.on("resize", () => this.renderPlayfield());
    this.loadPlayfieldAssets(this.playfieldAssets);
    this.renderPlayfield();
  }

  setViewModel(viewModel: GardenPlayfieldViewModel) {
    this.viewModel = viewModel;
    if (this.sys.isActive()) {
      this.renderPlayfield();
    }
  }

  setPlayfieldAssets(playfieldAssets: ManifestAsset[]) {
    this.playfieldAssets = playfieldAssets;
    if (!this.sys.isActive()) {
      return;
    }

    this.loadPlayfieldAssets(playfieldAssets);
    this.renderPlayfield();
  }

  loadPlayfieldAssets(playfieldAssets: ManifestAsset[]) {
    if (!this.sys.isActive() || playfieldAssets.length === 0) {
      return;
    }

    this.registerLoadedAnimations(playfieldAssets);

    const pendingAssets = playfieldAssets.filter((asset) => {
      const animation = asset.animation;
      return (
        asset.status === "accepted" &&
        animation?.kind === "spritesheet" &&
        !this.textures.exists(animation.key)
      );
    });

    if (pendingAssets.length === 0) {
      return;
    }

    const handleLoadError = (file: { key?: string }) => {
      console.warn("playfield spritesheet load failed", file.key);
    };

    const registerAndRender = () => {
      this.load.off(Phaser.Loader.Events.FILE_LOAD_ERROR, handleLoadError);
      this.registerLoadedAnimations(playfieldAssets);
      this.renderPlayfield();
    };

    this.load.once(Phaser.Loader.Events.COMPLETE, registerAndRender);
    this.load.on(Phaser.Loader.Events.FILE_LOAD_ERROR, handleLoadError);

    for (const asset of pendingAssets) {
      const animation = asset.animation;
      if (!animation) {
        continue;
      }

      this.load.spritesheet(animation.key, asset.path, {
        frameWidth: animation.frameWidth,
        frameHeight: animation.frameHeight,
        margin: animation.margin ?? 0,
        spacing: animation.spacing ?? 0,
        endFrame: animation.frames - 1
      });
    }

    if (!this.load.isLoading()) {
      this.load.start();
    }
  }

  private registerLoadedAnimations(playfieldAssets: ManifestAsset[]) {
    for (const asset of playfieldAssets) {
      const animation = asset.animation;
      if (!animation || !this.textures.exists(animation.key) || this.anims.exists(this.getAnimationKey(animation.key))) {
        continue;
      }

      this.anims.create({
        key: this.getAnimationKey(animation.key),
        frames: this.anims.generateFrameNumbers(animation.key, { start: 0, end: animation.frames - 1 }),
        frameRate: animation.frameRate,
        repeat: animation.repeat,
        yoyo: animation.yoyo ?? false
      });
    }
  }

  private renderPlayfield() {
    this.root?.destroy(true);
    this.root = this.add.container(0, 0);

    const width = Math.max(320, Number(this.scale.width) || 640);
    const height = Math.max(220, Number(this.scale.height) || 360);
    const graphics = this.add.graphics();
    this.root.add(graphics);

    graphics.fillStyle(0xf8efc9, 0.78);
    graphics.fillRoundedRect(8, 8, width - 16, height - 16, 28);
    graphics.lineStyle(2, 0x31563e, 0.18);
    graphics.strokeRoundedRect(10, 10, width - 20, height - 20, 26);

    graphics.fillStyle(0xd8efb5, 0.38);
    graphics.fillEllipse(width * 0.5, height * 0.62, width * 0.92, height * 0.54);

    const plots = this.viewModel?.plots ?? [];
    const gap = width < 420 ? 8 : 12;
    const top = height < 300 ? 32 : 42;
    const usableWidth = width - 36;
    const usableHeight = height - top - 24;
    const cellWidth = (usableWidth - gap * 2) / 3;
    const cellHeight = Math.max(48, (usableHeight - gap * 2) / 3);

    plots.slice(0, 9).forEach((plot) => {
      const col = plot.index % 3;
      const row = Math.floor(plot.index / 3);
      const x = 18 + col * (cellWidth + gap);
      const y = top + row * (cellHeight + gap);
      this.drawPlot(plot, x, y, cellWidth, cellHeight);
    });
  }

  private drawPlot(plot: GardenPlotView, x: number, y: number, width: number, height: number) {
    const stateColor = STATE_COLORS[plot.state];
    const familyColor = plot.family ? FAMILY_COLORS[plot.family] : undefined;
    const fill = familyColor?.fill ?? stateColor.fill;
    const stroke = plot.state === "ready" ? STATE_COLORS.ready.stroke : familyColor?.accent ?? stateColor.stroke;
    const alpha = plot.state === "locked" ? 0.2 : plot.state === "ready" ? 0.92 : 0.78;
    const group = this.add.container(x, y);
    this.root?.add(group);

    const tile = this.add.graphics();
    tile.fillStyle(fill, alpha);
    tile.fillRoundedRect(0, 0, width, height, 16);
    tile.lineStyle(plot.state === "ready" ? 4 : 2, stroke, plot.state === "locked" ? 0.24 : 0.82);
    tile.strokeRoundedRect(1, 1, width - 2, height - 2, 16);
    group.add(tile);

    const mound = this.add.graphics();
    mound.fillStyle(0x795435, plot.state === "locked" ? 0.16 : 0.42);
    mound.fillEllipse(width / 2, height * 0.67, width * 0.62, Math.max(13, height * 0.18));
    group.add(mound);

    if (plot.state === "growing" || plot.state === "ready") {
      this.drawPlant(group, plot, width, height, familyColor?.accent ?? 0x3c7041);
    }

    if (plot.state === "ready") {
      const glow = this.add.graphics();
      glow.lineStyle(3, 0xfff0a3, 0.66 + Math.sin(this.time.now / 260) * 0.18);
      glow.strokeRoundedRect(6, 6, width - 12, height - 12, 18);
      group.add(glow);
    }

    const label = this.addText(width / 2, 8, plot.label, {
      color: plot.family ? FAMILY_COLORS[plot.family].text : "#33452f",
      fontSize: width < 100 ? "11px" : "12px",
      fontStyle: "800"
    }).setOrigin(0.5, 0);
    group.add(label);

    if (plot.state === "growing" || plot.state === "ready") {
      this.drawProgress(group, plot.progressPercent, width, height);
    } else {
      const stateLabel = this.addText(width / 2, height * 0.48, stateColor.label, {
        color: plot.state === "locked" ? "#4f594b" : "#4a613d",
        fontSize: "12px",
        fontStyle: "800"
      }).setOrigin(0.5, 0.5);
      group.add(stateLabel);
    }

    const hitZone = this.add.zone(width / 2, height / 2, width, height).setInteractive({ useHandCursor: plot.state !== "locked" });
    hitZone.on("pointerdown", () => this.emitPlotAction(plot, x + width / 2, y + height * 0.55));
    group.add(hitZone);
  }

  private drawPlant(
    group: Phaser.GameObjects.Container,
    plot: GardenPlotView,
    width: number,
    height: number,
    accent: number
  ) {
    const animationAsset = this.findBoundAnimationAsset("plot", this.getPlotAnimationSlot(plot), plot);
    const spriteKey = animationAsset?.animation?.key;
    if (spriteKey) {
      const sprite = this.addAnimatedSprite(spriteKey, width / 2, height * 0.54, Math.min(width * 0.54, height * 0.58));

      if (sprite) {
        group.add(sprite);
        return;
      }
    }

    const progress = Math.max(0.16, plot.progressPercent / 100);
    const stemHeight = Math.max(22, height * 0.34 * progress);
    const centerX = width / 2;
    const baseY = height * 0.68;
    const plant = this.add.graphics();

    plant.lineStyle(5, accent, 0.9);
    plant.lineBetween(centerX, baseY, centerX, baseY - stemHeight);
    plant.fillStyle(accent, 0.86);
    plant.fillEllipse(centerX - 13, baseY - stemHeight * 0.55, 24, 13);
    plant.fillEllipse(centerX + 13, baseY - stemHeight * 0.72, 24, 13);

    if (plot.state === "ready") {
      plant.fillStyle(0xfff0a3, 0.95);
      plant.fillCircle(centerX, baseY - stemHeight - 10, 15);
      plant.lineStyle(2, 0xffffff, 0.75);
      plant.strokeCircle(centerX, baseY - stemHeight - 10, 18);
    } else {
      plant.fillStyle(0xf5e49b, 0.95);
      plant.fillCircle(centerX, baseY - stemHeight - 6, 10);
    }

    group.add(plant);
  }

  private drawProgress(group: Phaser.GameObjects.Container, progressPercent: number, width: number, height: number) {
    const barWidth = width * 0.68;
    const barX = (width - barWidth) / 2;
    const barY = height - 22;
    const progress = Phaser.Math.Clamp(progressPercent / 100, 0, 1);
    const graphics = this.add.graphics();

    graphics.fillStyle(0x24412f, 0.28);
    graphics.fillRoundedRect(barX, barY, barWidth, 8, 999);
    graphics.fillStyle(progress >= 1 ? 0xfff0a3 : 0x2f6f45, 0.92);
    graphics.fillRoundedRect(barX, barY, Math.max(8, barWidth * progress), 8, 999);
    group.add(graphics);

    const label = this.addText(width / 2, barY - 16, progress >= 1 ? "수확 가능" : `${Math.round(progressPercent)}%`, {
      color: "#2b442f",
      fontSize: "11px",
      fontStyle: "900"
    }).setOrigin(0.5, 0);
    group.add(label);
  }

  private emitPlotAction(plot: GardenPlotView, x: number, y: number) {
    const now = this.time.now;
    const action =
      plot.state === "ready"
        ? ({ type: "harvest_plot", plotIndex: plot.index } as const)
        : plot.state === "growing"
          ? ({ type: "tap_growth", plotIndex: plot.index } as const)
          : ({ type: "select_plot", plotIndex: plot.index } as const);

    this.onActionRef.current(action);

    const animationAction: PlayfieldAnimationAction | null =
      plot.state === "ready" ? "harvest_plot" : plot.state === "growing" ? "tap_growth" : null;
    if (animationAction) {
      this.playBoundEffects(plot, animationAction, x, y);
    }

    if (plot.state !== "locked" && now - this.lastTapAt > 80) {
      this.lastTapAt = now;
      this.cameras.main.shake(90, plot.state === "ready" ? 0.004 : 0.0025);
    }
  }

  private addAnimatedSprite(textureKey: string, x: number, y: number, displaySize: number) {
    const animationKey = this.getAnimationKey(textureKey);
    if (!this.textures.exists(textureKey) || !this.anims.exists(animationKey)) {
      return null;
    }

    const sprite = this.add.sprite(x, y, textureKey, 0);
    sprite.setDisplaySize(displaySize, displaySize);
    sprite.play(animationKey);
    return sprite;
  }

  private playOneShot(textureKey: string, x: number, y: number, displaySize: number) {
    const sprite = this.addAnimatedSprite(textureKey, x, y, displaySize);
    if (!sprite) {
      return;
    }

    this.fxRoot?.add(sprite);
    sprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => sprite.destroy());
  }

  private getPlotAnimationSlot(plot: GardenPlotView): PlayfieldAnimationSlot {
    if (plot.state === "ready") {
      return "ready";
    }

    return plot.progressPercent < 18 ? "seed_idle" : "growth";
  }

  private playBoundEffects(plot: GardenPlotView, action: PlayfieldAnimationAction, x: number, y: number) {
    const effects = this.findBoundAnimationAssets("effect", null, plot, action);
    for (const asset of effects) {
      const animation = asset.animation;
      if (!animation?.key) {
        continue;
      }

      const layout = EFFECT_LAYOUT[animation.binding?.slot ?? "tap_feedback"] ?? { displaySize: 78, offsetX: 0, offsetY: 0 };
      this.playOneShot(animation.key, x + layout.offsetX, y + layout.offsetY, layout.displaySize);
    }
  }

  private findBoundAnimationAsset(
    target: PlayfieldAnimationTarget,
    slot: PlayfieldAnimationSlot,
    plot: GardenPlotView,
    action?: PlayfieldAnimationAction
  ): ManifestAsset | undefined {
    return this.findBoundAnimationAssets(target, slot, plot, action)[0];
  }

  private findBoundAnimationAssets(
    target: PlayfieldAnimationTarget,
    slot: PlayfieldAnimationSlot | null,
    plot: GardenPlotView,
    action?: PlayfieldAnimationAction
  ): ManifestAsset[] {
    return this.playfieldAssets.filter((asset) => {
      const animation = asset.animation;
      const binding = animation?.binding;
      if (asset.status !== "accepted" || animation?.kind !== "spritesheet" || !binding || binding.target !== target) {
        return false;
      }

      if (slot && binding.slot !== slot) {
        return false;
      }

      const plotState = this.getBindablePlotState(plot);
      return (
        this.bindingIncludes(binding.seedIds, plot.seedId) &&
        this.bindingIncludes(binding.plotStates, plotState) &&
        this.bindingIncludes(binding.actions, action)
      );
    });
  }

  private getBindablePlotState(plot: GardenPlotView): PlayfieldAnimationPlotState | null {
    return plot.state === "growing" || plot.state === "ready" ? plot.state : null;
  }

  private bindingIncludes<T extends string>(acceptedValues: T[] | undefined, currentValue: T | null | undefined) {
    return !acceptedValues || acceptedValues.length === 0 || Boolean(currentValue && acceptedValues.includes(currentValue));
  }

  private getAnimationKey(textureKey: string) {
    return `${textureKey}_anim`;
  }

  private addText(x: number, y: number, text: string, style: Phaser.Types.GameObjects.Text.TextStyle) {
    return this.add.text(x, y, text, {
      fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
      align: "center",
      ...style
    });
  }
}
