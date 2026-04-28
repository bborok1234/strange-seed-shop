import { useEffect, useRef, useState } from "react";
import type { ManifestAsset } from "../../types/game";
import type { GardenPlayfieldAction, GardenPlayfieldActionHandler, GardenPlayfieldViewModel } from "./types";

interface GardenPlayfieldHostProps {
  viewModel: GardenPlayfieldViewModel;
  playfieldAssets: ManifestAsset[];
  onAction: GardenPlayfieldActionHandler;
}

export function GardenPlayfieldHost({ viewModel, playfieldAssets, onAction }: GardenPlayfieldHostProps) {
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
    setActionFeedback({
      id: Date.now(),
      kind: actionType === "harvest_plot" ? "harvest" : "growth",
      label: actionType === "harvest_plot" ? "수확!" : "쑥! +성장",
      detail: actionType === "harvest_plot" ? "도감 보상으로 이어져요" : `${plotIndex + 1}번 밭이 반응했어요`
    });
    feedbackTimerRef.current = window.setTimeout(() => setActionFeedback(null), 1_800);
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
        backgroundColor: "#f1edc8",
        transparent: false,
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
