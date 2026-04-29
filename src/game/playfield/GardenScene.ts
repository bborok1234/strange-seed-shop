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
  locked: { fill: 0xa2aa97, stroke: 0x6c765f, label: "잠금" },
  empty: { fill: 0xf1df9f, stroke: 0xa2803f, label: "빈 자리" },
  growing: { fill: 0xaedc82, stroke: 0x4f803f, label: "성장 중" },
  ready: { fill: 0xffd95b, stroke: 0xb37724, label: "수확!" }
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

  constructor(onActionRef: { current: GardenPlayfieldActionHandler }, playfieldAssets: ManifestAsset[] = []) {
    super("GardenScene");
    this.onActionRef = onActionRef;
    this.playfieldAssets = playfieldAssets;
  }

  create() {
    this.fxRoot = this.add.container(0, 0).setDepth(40);
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
    this.root = this.add.container(0, 0).setDepth(0);
    if (this.fxRoot) {
      this.fxRoot.setDepth(40);
      this.children.bringToTop(this.fxRoot);
    }

    const width = Math.max(320, Number(this.scale.width) || 640);
    const height = Math.max(220, Number(this.scale.height) || 360);
    if (this.viewModel?.productionLine) {
      this.drawEngineStatus(width, this.viewModel.productionLine, this.viewModel.orderLine);
    }

    const plots = (this.viewModel?.plots ?? []).filter((plot) => plot.state !== "locked");
    const gap = width < 420 ? 12 : 14;
    const top = height < 300 ? 32 : 42;
    const usableWidth = width - 36;
    const usableHeight = height - top - 24;
    const columns = Math.max(1, Math.min(plots.length, width < 420 ? 2 : 3));
    const rows = Math.max(1, Math.ceil(plots.length / columns));
    const cellWidth = (usableWidth - gap * (columns - 1)) / columns;
    const cellHeight = Math.max(68, Math.min(112, (usableHeight - gap * (rows - 1)) / rows));

    plots.forEach((plot, visibleIndex) => {
      const col = visibleIndex % columns;
      const row = Math.floor(visibleIndex / columns);
      const x = 18 + col * (cellWidth + gap);
      const y = top + row * (cellHeight + gap);
      this.drawPlot(plot, x, y, cellWidth, cellHeight);
    });
  }

  private drawPlot(plot: GardenPlotView, x: number, y: number, width: number, height: number) {
    const stateColor = STATE_COLORS[plot.state];
    const familyColor = plot.family ? FAMILY_COLORS[plot.family] : undefined;
    const fill = familyColor?.fill ?? stateColor.fill;
    const alpha = plot.state === "ready" ? 0.92 : plot.state === "empty" ? 0.96 : 0.86;
    const group = this.add.container(x, y);
    this.root?.add(group);

    if (plot.state === "ready") {
      this.drawHarvestAura(group, width, height);
    }

    const tilePad = this.add.graphics();
    const padInset = 8;
    tilePad.fillStyle(fill, alpha);
    tilePad.fillRoundedRect(padInset, padInset, width - padInset * 2, height - padInset * 2, 18);
    tilePad.lineStyle(1, plot.state === "empty" ? 0x9c864b : stateColor.stroke, plot.state === "empty" ? 0.28 : 0.36);
    tilePad.strokeRoundedRect(padInset, padInset, width - padInset * 2, height - padInset * 2, 18);
    group.add(tilePad);

    const mound = this.add.graphics();
    mound.fillStyle(0x795435, plot.state === "empty" ? 0.2 : 0.36);
    mound.fillEllipse(width / 2, height * 0.7, width * 0.48, Math.max(10, height * 0.12));
    group.add(mound);

    if (plot.state === "growing" || plot.state === "ready") {
      this.drawPlant(group, plot, width, height);
    } else if (plot.state === "empty") {
      this.drawEmptyCue(group, width, height);
    }

    if (plot.state === "ready") {
      const glow = this.add.graphics();
      glow.lineStyle(3, 0xfff0a3, 0.66 + Math.sin(this.time.now / 260) * 0.18);
      glow.strokeRoundedRect(6, 6, width - 12, height - 12, 18);
      group.add(glow);
    }

    this.drawPlotBadge(group, plot, width);

    const label = this.addText(width / 2, 13, plot.label, {
      color: plot.family ? FAMILY_COLORS[plot.family].text : "#243b28",
      fontSize: width < 120 ? "12px" : "13px",
      fontStyle: "900"
    }).setOrigin(0.5, 0);
    label.setShadow(0, 1, "#fff7d0", 2, true, true);
    group.add(label);

    if (plot.state === "growing" || plot.state === "ready") {
      if (plot.state === "ready") {
        this.drawStatusPill(group, STATE_COLORS.ready.label, width / 2, height * 0.28, width);
      }
      this.drawProgress(group, plot.progressPercent, width, height);
    } else {
      const stateLabel = this.addText(width / 2, height * 0.5, stateColor.label, {
        color: "#2f4d31",
        fontSize: "13px",
        fontStyle: "900"
      }).setOrigin(0.5, 0.5);
      stateLabel.setShadow(0, 1, "#fff7d0", 2, true, true);
      group.add(stateLabel);
    }

    const hitZone = this.add.zone(width / 2, height / 2, width, height).setInteractive({ useHandCursor: plot.state !== "locked" });
    hitZone.on("pointerdown", () => this.emitPlotAction(plot, x + width / 2, y + height * 0.55));
    group.add(hitZone);
  }

  private drawPlotBadge(group: Phaser.GameObjects.Container, plot: GardenPlotView, width: number) {
    const indexText = this.addText(16, 9, `${plot.index + 1}`, {
      color: plot.state === "ready" ? "#6b4a13" : plot.state === "locked" ? "#63705b" : "#fff8d5",
      fontSize: "10px",
      fontStyle: "900"
    }).setOrigin(0.5, 0);
    group.add(indexText);

    if (plot.state === "ready") {
      const sparkle = this.addText(width - 16, 7, "✦", {
        color: "#fff4a7",
        fontSize: "15px",
        fontStyle: "900"
      }).setOrigin(0.5, 0);
      group.add(sparkle);
    }
  }

  private drawEngineStatus(width: number, productionLine: string, orderLine?: string) {
    const group = this.add.container(width / 2, 18);
    this.root?.add(group);

    const label = orderLine ? `${productionLine} · ${orderLine}` : productionLine;
    const panelWidth = Math.min(width - 34, Math.max(228, label.length * 7.8));
    const panel = this.add.graphics();
    panel.fillStyle(0xfff8d0, 0.98);
    panel.fillRoundedRect(-panelWidth / 2, -2, panelWidth, 24, 999);
    panel.lineStyle(1, 0x31563e, 0.36);
    panel.strokeRoundedRect(-panelWidth / 2, -2, panelWidth, 24, 999);
    group.add(panel);

    const text = this.addText(0, 3, label, {
      color: "#24412f",
      fontSize: width < 420 ? "11px" : "12px",
      fontStyle: "900"
    }).setOrigin(0.5, 0);
    text.setShadow(0, 1, "#ffffff", 2, true, true);
    group.add(text);
  }

  private drawHarvestAura(group: Phaser.GameObjects.Container, width: number, height: number) {
    const aura = this.add.graphics();
    aura.fillStyle(0xfff4a7, 0.24);
    aura.fillRoundedRect(-5, -5, width + 10, height + 10, 20);
    aura.lineStyle(5, 0xfff0a3, 0.18);
    aura.strokeRoundedRect(-4, -4, width + 8, height + 8, 20);
    group.add(aura);
  }

  private drawEmptyCue(group: Phaser.GameObjects.Container, width: number, height: number) {
    const cue = this.addText(width / 2, height * 0.34, "＋", {
      color: "#6f8a58",
      fontSize: "24px",
      fontStyle: "800"
    }).setOrigin(0.5, 0.5);
    cue.setAlpha(0.32);
    group.add(cue);
  }

  private drawStatusPill(group: Phaser.GameObjects.Container, label: string, x: number, y: number, width: number) {
    const text = this.addText(x, y + 4, label, {
      color: "#1f5a3c",
      fontSize: width < 100 ? "10px" : "11px",
      fontStyle: "900"
    }).setOrigin(0.5, 0);
    text.setShadow(0, 1, "#fff6bd", 3, true, true);
    group.add(text);
  }

  private drawPlant(group: Phaser.GameObjects.Container, plot: GardenPlotView, width: number, height: number) {
    const animationAsset = this.findBoundAnimationAsset("plot", this.getPlotAnimationSlot(plot), plot);
    const spriteKey = animationAsset?.animation?.key;
    if (spriteKey) {
      const sprite = this.addAnimatedSprite(spriteKey, width / 2, height * 0.54, Math.min(width * 0.54, height * 0.58));

      if (sprite) {
        group.add(sprite);
        return;
      }
    }

    const plantGlyph = this.addText(width / 2, height * 0.46, plot.state === "ready" ? "🌿" : "🌱", {
      color: "#2f6f45",
      fontSize: plot.state === "ready" ? "30px" : "26px",
      fontStyle: "900"
    }).setOrigin(0.5, 0.5);
    plantGlyph.setShadow(0, 2, "#fff4a7", 4, true, true);
    group.add(plantGlyph);
  }

  private drawProgress(group: Phaser.GameObjects.Container, progressPercent: number, width: number, height: number) {
    const barWidth = width * 0.68;
    const barX = (width - barWidth) / 2;
    const barY = height - 20;
    const progress = Phaser.Math.Clamp(progressPercent / 100, 0, 1);
    const graphics = this.add.graphics();

    graphics.fillStyle(0x24412f, 0.28);
    graphics.fillRoundedRect(barX, barY, barWidth, 8, 999);
    graphics.fillStyle(progress >= 1 ? 0xfff0a3 : 0x2f6f45, 0.92);
    graphics.fillRoundedRect(barX, barY, Math.max(8, barWidth * progress), 8, 999);
    group.add(graphics);

    const label = this.addText(width / 2, barY - 15, progress >= 1 ? "준비 완료" : `${Math.round(progressPercent)}%`, {
      color: "#2b442f",
      fontSize: "10px",
      fontStyle: "900"
    }).setOrigin(0.5, 0);
    group.add(label);
  }

  private emitPlotAction(plot: GardenPlotView, x: number, y: number) {
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
      this.playProceduralFeedback(plot, animationAction, x, y);
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
      return false;
    }

    this.fxRoot?.add(sprite);
    sprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => sprite.destroy());
    return true;
  }

  private getPlotAnimationSlot(plot: GardenPlotView): PlayfieldAnimationSlot {
    if (plot.state === "ready") {
      return "ready";
    }

    return plot.progressPercent < 18 ? "seed_idle" : "growth";
  }

  private playBoundEffects(plot: GardenPlotView, action: PlayfieldAnimationAction, x: number, y: number) {
    if (action === "tap_growth") {
      return 0;
    }

    const effects = this.findBoundAnimationAssets("effect", null, plot, action);
    let playedCount = 0;

    for (const asset of effects) {
      const animation = asset.animation;
      if (!animation?.key) {
        continue;
      }

      const layout = EFFECT_LAYOUT[animation.binding?.slot ?? "tap_feedback"] ?? { displaySize: 78, offsetX: 0, offsetY: 0 };
      const played = this.playOneShot(animation.key, x + layout.offsetX, y + layout.offsetY, layout.displaySize);
      if (played) {
        playedCount += 1;
        this.emitFxTelemetry(plot, action, "spritesheet");
      }
    }

    return playedCount;
  }

  private playProceduralFeedback(plot: GardenPlotView, action: PlayfieldAnimationAction, x: number, y: number) {
    if (action === "tap_growth") {
      this.playTapPulse(x, y);
      this.emitFloatingText("+성장", x, y - 34, "#fff4a7");
    } else {
      this.playHarvestBurst(x, y - 8);
      this.emitFloatingText("수확!", x, y - 42, "#fff4a7");
      this.emitFloatingText("+잎", x + 28, y - 18, "#dff5b8");
    }

    this.emitFxTelemetry(plot, action, "procedural");
  }

  private playTapPulse(x: number, y: number) {
    const pulse = this.add.container(x, y);
    pulse.setDepth(10);

    for (const [leafX, leafY] of [
      [-38, -20],
      [40, -18],
      [-28, 28],
      [34, 26]
    ]) {
      const leaf = this.addText(leafX, leafY, "✦", {
        color: "#fff4a7",
        fontSize: "16px",
        fontStyle: "900"
      }).setOrigin(0.5, 0.5);
      pulse.add(leaf);
    }

    const badgeText = this.addText(0, -60, "+성장", {
      color: "#fff8bd",
      fontSize: "22px",
      fontStyle: "900"
    }).setOrigin(0.5, 0);
    badgeText.setShadow(0, 3, "#1f5a3c", 6, true, true);
    pulse.add(badgeText);

    this.fxRoot?.add(pulse);

    this.tweens.add({
      targets: pulse,
      y: y - 5,
      scale: 1.06,
      duration: 180,
      yoyo: true,
      ease: "Sine.easeOut"
    });
    this.time.delayedCall(1_000, () => pulse.destroy(true));
  }

  private playHarvestBurst(x: number, y: number) {
    const burst = this.add.container(x, y);
    const ring = this.add.graphics();
    ring.lineStyle(4, 0xfff0a3, 0.88);
    ring.strokeCircle(0, 0, 24);
    ring.fillStyle(0xfff4a7, 0.2);
    ring.fillCircle(0, 0, 34);
    burst.add(ring);
    this.fxRoot?.add(burst);

    for (let index = 0; index < 8; index += 1) {
      const angle = (Math.PI * 2 * index) / 8;
      const sparkle = this.addText(0, 0, index % 2 === 0 ? "✦" : "✧", {
        color: index % 2 === 0 ? "#fff4a7" : "#dff5b8",
        fontSize: "17px",
        fontStyle: "900"
      }).setOrigin(0.5, 0.5);
      burst.add(sparkle);
      this.tweens.add({
        targets: sparkle,
        x: Math.cos(angle) * 52,
        y: Math.sin(angle) * 38,
        alpha: 0,
        scale: 1.25,
        duration: 520,
        ease: "Sine.easeOut"
      });
    }

    this.tweens.add({
      targets: burst,
      alpha: 0,
      scale: 1.35,
      duration: 720,
      ease: "Sine.easeOut",
      onComplete: () => burst.destroy(true)
    });
  }

  private emitFloatingText(label: string, x: number, y: number, color: string) {
    const text = this.addText(x, y, label, {
      color,
      fontSize: "17px",
      fontStyle: "900"
    }).setOrigin(0.5, 0.5);
    text.setShadow(0, 2, "#24412f", 4, true, true);
    this.fxRoot?.add(text);

    this.tweens.add({
      targets: text,
      y: y - 28,
      alpha: 0,
      duration: 720,
      ease: "Sine.easeOut",
      onComplete: () => text.destroy()
    });
  }

  private emitFxTelemetry(plot: GardenPlotView, action: PlayfieldAnimationAction, source: "spritesheet" | "procedural") {
    if (typeof window === "undefined") {
      return;
    }

    const event = { action, plotIndex: plot.index, source, timestamp: Date.now() };
    window.dispatchEvent(new CustomEvent("garden-playfield-fx", { detail: event }));

    if (!window.location.search.includes("qaFxTelemetry=1")) {
      return;
    }

    const qaWindow = window as unknown as {
      __gardenPlayfieldFxEvents?: Array<typeof event>;
    };
    qaWindow.__gardenPlayfieldFxEvents = [...(qaWindow.__gardenPlayfieldFxEvents ?? []), event];
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
