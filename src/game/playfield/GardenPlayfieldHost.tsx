import { useEffect, useRef } from "react";
import Phaser from "phaser";
import { GardenScene } from "./GardenScene";
import type { GardenPlayfieldActionHandler, GardenPlayfieldViewModel } from "./types";

interface GardenPlayfieldHostProps {
  viewModel: GardenPlayfieldViewModel;
  onAction: GardenPlayfieldActionHandler;
}

export function GardenPlayfieldHost({ viewModel, onAction }: GardenPlayfieldHostProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const sceneRef = useRef<GardenScene | null>(null);
  const actionRef = useRef<GardenPlayfieldActionHandler>(onAction);

  actionRef.current = onAction;

  useEffect(() => {
    const host = hostRef.current;
    if (!host || gameRef.current) {
      return;
    }

    const scene = new GardenScene(actionRef);
    sceneRef.current = scene;
    scene.setViewModel(viewModel);

    gameRef.current = new Phaser.Game({
      type: Phaser.AUTO,
      parent: host,
      width: Math.max(320, host.clientWidth || 640),
      height: Math.max(260, host.clientHeight || 360),
      backgroundColor: "rgba(0, 0, 0, 0)",
      transparent: true,
      scene,
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
      }
    });

    return () => {
      sceneRef.current = null;
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
    // Mount and destroy the Phaser runtime exactly once per host lifecycle.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    sceneRef.current?.setViewModel(viewModel);
  }, [viewModel]);

  return (
    <div
      aria-label="Phaser 정원 플레이필드: 밭을 눌러 성장시키고 수확합니다"
      className="garden-playfield-host"
      ref={hostRef}
      role="application"
    />
  );
}
