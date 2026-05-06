import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { ManifestAsset } from "../../types/game";
import type { GardenPlayfieldAction, GardenPlayfieldActionHandler, GardenPlayfieldViewModel, GardenPlotView } from "./types";

interface GardenPlayfieldHostProps {
  viewModel: GardenPlayfieldViewModel;
  playfieldAssets: ManifestAsset[];
  plotMarkerAssets: GardenPlotMarkerAssets;
  onAction: GardenPlayfieldActionHandler;
}

interface GardenPlotMarkerAssets {
  emptySeedbedPath: string;
  growingSeedbedPath: string;
  readySeedbedPath: string;
  readyRibbonPath: string;
  textPlatePath: string;
}

export function GardenPlayfieldHost({ viewModel, playfieldAssets, plotMarkerAssets, onAction }: GardenPlayfieldHostProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const gameRef = useRef<import("phaser").Game | null>(null);
  const sceneRef = useRef<import("./GardenScene").GardenScene | null>(null);
  const actionRef = useRef<GardenPlayfieldActionHandler>(onAction);
  const viewModelRef = useRef<GardenPlayfieldViewModel>(viewModel);
  const playfieldAssetsRef = useRef<ManifestAsset[]>(playfieldAssets);
  const feedbackTimerRef = useRef<number | null>(null);
  const [isRuntimeReady, setRuntimeReady] = useState(false);
  const [runtimeError, setRuntimeError] = useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = useState<{
    id: number;
    kind: "growth" | "harvest";
    label: string;
    detail: string;
  } | null>(null);

  function showPlayfieldFeedback(actionType: "tap_growth" | "harvest_plot", plotIndex: number) {
    if (feedbackTimerRef.current) {
      window.clearTimeout(feedbackTimerRef.current);
    }
    const plot = viewModelRef.current.plots.find((item) => item.index === plotIndex);
    const tapsRemainingAfter =
      plot?.secondsRemaining && plot.tapReductionSeconds
        ? Math.max(0, Math.ceil(Math.max(0, plot.secondsRemaining - plot.tapReductionSeconds) / plot.tapReductionSeconds))
        : null;
    const growthDetail =
      plot?.growthPreviewLabel
        ? `${plot.growthPreviewLabel} · ${plot.tapReductionLabel ?? "성장 시간"} 단축`
        : tapsRemainingAfter !== null
        ? `${plot?.tapReductionLabel ?? "성장 시간"} 단축 · 약 ${tapsRemainingAfter}번 남음`
        : `${plot?.tapReductionLabel ?? "성장 시간"} 단축 · ${plotIndex + 1}번 밭이 반응했어요`;
    setActionFeedback({
      id: Date.now(),
      kind: actionType === "harvest_plot" ? "harvest" : "growth",
      label: actionType === "harvest_plot" ? "수확!" : "쑥! +성장",
      detail: actionType === "harvest_plot" ? "도감 보상으로 이어져요" : growthDetail
    });
    feedbackTimerRef.current = window.setTimeout(() => setActionFeedback(null), 6_000);
  }

  function recordOverlayFxTelemetry(actionType: "tap_growth" | "harvest_plot", plotIndex: number) {
    if (typeof window === "undefined" || !window.location.search.includes("qaFxTelemetry=1")) {
      return;
    }

    const plot = viewModelRef.current.plots.find((item) => item.index === plotIndex);
    const event = {
      action: actionType,
      plotIndex,
      source: "procedural" as const,
      plotSource: plot?.source,
      plotLabel: plot?.label,
      growthPreviewLabel: plot?.growthPreviewLabel,
      timestamp: Date.now()
    };
    const qaWindow = window as unknown as {
      __gardenPlayfieldFxEvents?: Array<typeof event>;
    };
    qaWindow.__gardenPlayfieldFxEvents = [...(qaWindow.__gardenPlayfieldFxEvents ?? []), event];
  }

  actionRef.current = (action: GardenPlayfieldAction) => {
    if (action.type === "tap_growth" || action.type === "harvest_plot") {
      showPlayfieldFeedback(action.type, action.plotIndex);
    }

    onAction(action);
  };
  viewModelRef.current = viewModel;
  playfieldAssetsRef.current = playfieldAssets;

  useEffect(() => {
    let cancelled = false;
    let mountedGame: import("phaser").Game | null = null;

    async function mountPlayfield() {
      const host = hostRef.current;
      if (!host || gameRef.current) {
        return;
      }

      const [Phaser, { GardenScene }] = await Promise.all([import("phaser"), import("./GardenScene")]);

      if (cancelled || !hostRef.current || gameRef.current) {
        return;
      }

      const scene = new GardenScene(actionRef, playfieldAssetsRef.current);
      sceneRef.current = scene;
      scene.setViewModel(viewModelRef.current);

      mountedGame = new Phaser.Game({
        type: Phaser.AUTO,
        parent: hostRef.current,
        width: Math.max(320, hostRef.current.clientWidth || 640),
        height: Math.max(260, hostRef.current.clientHeight || 360),
        // stage-art-first Cycle A PR3 — canvas 배경을 transparent로 만들어 garden-stage의
        // backgroundImage(L0 art-plate, 햇살 온실 일러스트)가 Phaser canvas 영역에서도
        // 비쳐 보이도록. 기존 #fff1c4 cream fill은 art bible align 위반이었음.
        // Phaser scene mechanic은 변경 0 — scene 내부에서 background fill 안 함 (검증됨).
        transparent: true,
        render: {
          antialias: false,
          roundPixels: true
        },
        scene,
        scale: {
          mode: Phaser.Scale.RESIZE,
          autoCenter: Phaser.Scale.CENTER_BOTH
        }
      });
      gameRef.current = mountedGame;
      setRuntimeReady(true);
      setRuntimeError(null);
    }

    void mountPlayfield().catch((error: unknown) => {
      if (cancelled) {
        return;
      }

      console.error("Failed to mount Phaser garden playfield", error);
      setRuntimeReady(false);
      setRuntimeError("정원 렌더러를 불러오지 못했습니다. 새로고침 후 다시 시도해 주세요.");
    });

    return () => {
      cancelled = true;
      if (feedbackTimerRef.current) {
        window.clearTimeout(feedbackTimerRef.current);
      }
      sceneRef.current = null;
      const game = gameRef.current ?? mountedGame;
      game?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  useEffect(() => {
    sceneRef.current?.setViewModel(viewModel);
  }, [viewModel]);

  useEffect(() => {
    sceneRef.current?.setPlayfieldAssets(playfieldAssets);
  }, [playfieldAssets]);

  useEffect(() => {
    function handlePlayfieldFx(event: Event) {
      const detail = (event as CustomEvent<{ action?: string; plotIndex?: number; source?: string }>).detail;
      if (
        detail?.source !== "procedural" ||
        (detail.action !== "tap_growth" && detail.action !== "harvest_plot") ||
        typeof detail.plotIndex !== "number"
      ) {
        return;
      }

      showPlayfieldFeedback(detail.action, detail.plotIndex);
    }

    window.addEventListener("garden-playfield-fx", handlePlayfieldFx);
    return () => window.removeEventListener("garden-playfield-fx", handlePlayfieldFx);
  }, []);

  return (
    <div
      aria-label="Phaser 정원 플레이필드: 밭을 눌러 성장시키고 수확합니다"
      className="garden-playfield-host"
      ref={hostRef}
      role="application"
    >
      <GardenBoardOverlay
        markerAssets={plotMarkerAssets}
        onPlotAction={(plot, target) => {
          if (plot.state === "empty") {
            actionRef.current({ type: "select_plot", plotIndex: plot.index });
            return;
          }

          const actionType = plot.state === "ready" ? "harvest_plot" : "tap_growth";
          const targetRect = target.getBoundingClientRect();
          const hostRect = hostRef.current?.getBoundingClientRect();
          const playedSceneFx =
            hostRect && sceneRef.current
              ? sceneRef.current.playActionFeedback(
                  plot,
                  actionType,
                  targetRect.left - hostRect.left + targetRect.width / 2,
                  targetRect.top - hostRect.top + targetRect.height * 0.55
                )
              : false;
          if (!playedSceneFx) {
            recordOverlayFxTelemetry(actionType, plot.index);
          }
          actionRef.current({ type: actionType, plotIndex: plot.index });
        }}
        viewModel={viewModel}
      />
      {actionFeedback ? (
        <div className={`playfield-action-feedback ${actionFeedback.kind}`} key={actionFeedback.id} aria-live="polite">
          <strong>{actionFeedback.label}</strong>
          <span>{actionFeedback.detail}</span>
        </div>
      ) : null}
      {!isRuntimeReady && !runtimeError ? <p className="playfield-loading">정원 렌더러를 불러오는 중...</p> : null}
      {runtimeError ? <p className="playfield-error">{runtimeError}</p> : null}
    </div>
  );
}

function GardenBoardOverlay({
  markerAssets,
  onPlotAction,
  viewModel
}: {
  markerAssets: GardenPlotMarkerAssets;
  onPlotAction: (plot: GardenPlotView, target: HTMLButtonElement) => void;
  viewModel: GardenPlayfieldViewModel;
}) {
  const visiblePlots = viewModel.plots.filter((plot) => plot.state !== "locked");
  const engineStatus = [viewModel.productionLine, viewModel.orderLine].filter(Boolean).join(" · ");

  return (
    <div
      aria-label={viewModel.productionScene ? "정원 생산 엔진 한 장면" : undefined}
      className={[
        "playfield-board-overlay",
        viewModel.productionScene ? "has-production-scene" : "",
        `plot-count-${visiblePlots.length}`
      ]
        .filter(Boolean)
        .join(" ")}
      role={viewModel.productionScene ? "group" : undefined}
    >
      {engineStatus ? <p className="playfield-engine-status">{engineStatus}</p> : null}
      {viewModel.productionScene ? <ProductionScene scene={viewModel.productionScene} /> : null}
      <div className="playfield-plot-row">
        {visiblePlots.map((plot) => (
          <GardenPlotCard key={plot.index} markerAssets={markerAssets} onPlotAction={onPlotAction} plot={plot} />
        ))}
      </div>
    </div>
  );
}

function ProductionScene({ scene }: { scene: NonNullable<GardenPlayfieldViewModel["productionScene"]> }) {
  const actorSpriteStyle =
    scene.workAnimation
      ? ({
          "--actor-frame-count": scene.workAnimation.frames,
          "--actor-strip-duration": `${Math.round((scene.workAnimation.frames / scene.workAnimation.frameRate) * 1000)}ms`
        } as CSSProperties)
      : undefined;
  const orderRewardStyle =
    scene.orderRewardMotion
      ? ({
          "--order-reward-frame-count": scene.orderRewardMotion.frames,
          "--order-reward-strip-duration": `${Math.round(
            (scene.orderRewardMotion.frames / scene.orderRewardMotion.frameRate) * 1000
          )}ms`
        } as CSSProperties)
      : undefined;

  return (
    <section className="playfield-production-lane" aria-label="정원 자동 생산 장면">
      <div
        className={[
          "playfield-production-actor",
          scene.actorFamily === "lunar" ? "is-lunar-actor" : "",
          scene.supportWorkers?.length ? "has-support-workers" : ""
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div className="playfield-production-actor-media">
          {scene.workAssetPath ? (
            <span
              aria-label={`${scene.actorName} 작업 pose`}
              className="playfield-production-actor-sprite"
              data-animation-asset={scene.workAnimation?.assetId}
              data-frame-count={scene.workAnimation?.frames}
              role="img"
            >
              <img alt="" className="playfield-production-actor-static" src={scene.workAssetPath} />
            </span>
          ) : scene.workAnimation ? (
            <span
              aria-label={`${scene.actorName} 작업 animation`}
              className="playfield-production-actor-sprite"
              data-animation-asset={scene.workAnimation.assetId}
              data-frame-count={scene.workAnimation.frames}
              role="img"
              style={actorSpriteStyle}
            >
              <img alt="" src={scene.workAnimation.path} />
            </span>
          ) : (
            <span className="playfield-scene-fallback">작업</span>
          )}
          {scene.supportWorkers?.map((worker, index) => (
            <span
              aria-label={`${worker.name} support actor`}
              className={["playfield-support-worker", `support-worker-${worker.family}`].join(" ")}
              data-asset-id={worker.assetId}
              data-worker-id={worker.id}
              key={worker.id}
              role="img"
              style={{ "--support-worker-index": index } as CSSProperties}
              title={`${worker.name} · ${worker.roleLabel}`}
            >
              {worker.assetPath ? <img alt="" src={worker.assetPath} /> : <span className="playfield-scene-fallback">동료</span>}
            </span>
          ))}
        </div>
        <div>
          <p>자동 생산</p>
          <strong>{scene.actorName}</strong>
          <span>{scene.actorLine}</span>
        </div>
      </div>
      <div
        className={[
          "playfield-order-crate",
          scene.orderReady || scene.orderCompleted ? "order-ready" : "",
          scene.orderRewardMotion ? "has-order-reward-motion" : "",
          scene.orderVariant ? `order-variant-${scene.orderVariant}` : ""
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {scene.crateAssetPath ? <img alt="" src={scene.crateAssetPath} /> : <span className="playfield-scene-fallback">주문</span>}
        {scene.orderRewardMotion ? (
          <span
            aria-label="주문상자 납품 reward motion"
            className="playfield-order-reward-motion"
            data-animation-asset={scene.orderRewardMotion.assetId}
            data-frame-count={scene.orderRewardMotion.frames}
            role="img"
            style={orderRewardStyle}
          >
            <img alt="" src={scene.orderRewardMotion.path} />
          </span>
        ) : null}
        <div>
          <p>{scene.orderTitle}</p>
          <strong>{scene.orderProgressLabel}</strong>
          <span>{scene.orderStatusLabel ?? (scene.orderCompleted ? "보상 수령 완료" : scene.orderReady ? "납품 가능" : scene.pendingLabel)}</span>
        </div>
      </div>
    </section>
  );
}

function GardenPlotCard({
  markerAssets,
  onPlotAction,
  plot
}: {
  markerAssets: GardenPlotMarkerAssets;
  onPlotAction: (plot: GardenPlotView, target: HTMLButtonElement) => void;
  plot: GardenPlotView;
}) {
  const disabled = plot.state === "locked";
  const seedbedPath =
    plot.state === "empty"
      ? markerAssets.emptySeedbedPath
      : plot.state === "ready"
        ? markerAssets.readySeedbedPath || markerAssets.growingSeedbedPath
        : markerAssets.growingSeedbedPath;
  const classes = [
    "playfield-plot-card",
    `plot-state-${plot.state}`,
    plot.source === "greenhouse_mist" ? "plot-source-greenhouse-mist" : ""
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      aria-label={`${plot.label} ${
        plot.state === "ready" ? "수확" : plot.state === "growing" ? "성장시키기" : plot.emptyActionLabel ?? "빈 자리"
      }`}
      className={classes}
      disabled={disabled}
      onClick={(event) => onPlotAction(plot, event.currentTarget)}
      type="button"
    >
      {seedbedPath ? <img alt="" aria-hidden="true" className="playfield-plot-marker playfield-plot-marker-seedbed" src={seedbedPath} /> : null}
      {plot.state === "ready" && markerAssets.readyRibbonPath ? (
        <img alt="" aria-hidden="true" className="playfield-plot-marker playfield-plot-marker-ribbon" src={markerAssets.readyRibbonPath} />
      ) : null}
      {markerAssets.textPlatePath ? (
        <img alt="" aria-hidden="true" className="playfield-plot-marker playfield-plot-marker-plate" src={markerAssets.textPlatePath} />
      ) : null}
      <span className="playfield-plot-index">{plot.index + 1}</span>
      {plot.sourceAssetPath ? <img alt="" className="playfield-plot-source-icon" src={plot.sourceAssetPath} /> : null}
      <span className="playfield-plot-label-stack">
        <strong>{plot.label}</strong>
        {plot.sourceLabel ? <span className="playfield-plot-source-label">{plot.sourceLabel}</span> : null}
        {plot.state === "empty" ? <span className="playfield-empty-plus">+</span> : null}
        <span className="playfield-plot-state">
          {plot.state === "ready"
            ? "수확"
            : plot.state === "growing"
              ? `${Math.round(plot.progressPercent)}%`
              : plot.emptyActionLabel ?? "빈 자리"}
        </span>
      </span>
    </button>
  );
}
