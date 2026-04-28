import { useEffect, useRef, useState } from "react";
import type { ManifestAsset } from "../../types/game";
import type { GardenPlayfieldActionHandler, GardenPlayfieldViewModel } from "./types";

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
  const [isRuntimeReady, setRuntimeReady] = useState(false);
  const [runtimeError, setRuntimeError] = useState<string | null>(null);

  actionRef.current = onAction;
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
        backgroundColor: "#dcebbd",
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

  return (
    <div
      aria-label="Phaser 정원 플레이필드: 밭을 눌러 성장시키고 수확합니다"
      className="garden-playfield-host"
      ref={hostRef}
      role="application"
    >
      {!isRuntimeReady && !runtimeError ? <p className="playfield-loading">정원 렌더러를 불러오는 중...</p> : null}
      {runtimeError ? <p className="playfield-error">{runtimeError}</p> : null}
    </div>
  );
}
