import { useEffect, useMemo, useState } from "react";
import { getAssetPath, loadAssetManifest } from "./lib/assetManifest";
import { createNewSave, localSaveStore } from "./lib/persistence";
import { content, getStarterSeeds } from "./lib/content";
import type { AssetManifest, PlayerSave } from "./types/game";

export default function App() {
  const [manifest, setManifest] = useState<AssetManifest | null>(null);
  const [save, setSave] = useState<PlayerSave | null>(null);
  const [manifestError, setManifestError] = useState<string | null>(null);

  useEffect(() => {
    loadAssetManifest()
      .then(setManifest)
      .catch((error: unknown) => setManifestError(error instanceof Error ? error.message : "manifest load failed"));

    const existingSave = localSaveStore.load();
    const nextSave = existingSave ?? createNewSave();
    localSaveStore.save(nextSave);
    setSave(nextSave);
  }, []);

  const starterSeeds = useMemo(() => getStarterSeeds(), []);
  const backgroundPath = getAssetPath(manifest, "background_greenhouse_day_001");
  const firstCreaturePath = getAssetPath(manifest, "creature_herb_common_001");

  return (
    <main className="app-shell">
      <section
        className="garden-stage"
        style={backgroundPath ? { backgroundImage: `url(${backgroundPath})` } : undefined}
      >
        <div className="top-bar">
          <div>
            <p className="eyebrow">Phase 0 Scaffold</p>
            <h1>이상한 씨앗상회</h1>
          </div>
          <div className="currency-cluster" aria-label="현재 재화">
            <span>잎 {save?.leaves ?? 0}</span>
            <span>꽃가루 {save?.pollen ?? 0}</span>
          </div>
        </div>

        <section className="garden-panel" aria-label="정원">
          <div className="plot-grid" aria-label="밭 9칸">
            {Array.from({ length: 9 }, (_, index) => (
              <button className={index === 0 ? "plot plot-active" : "plot"} key={index} type="button">
                {index === 0 && firstCreaturePath ? (
                  <img alt="첫 허브 생명체" src={firstCreaturePath} />
                ) : (
                  <span>{index + 1}</span>
                )}
              </button>
            ))}
          </div>

          <aside className="starter-panel">
            <p className="panel-label">스타터 씨앗</p>
            {starterSeeds.map((seed) => (
              <button className="seed-row" key={seed.id} type="button">
                <img alt="" src={getAssetPath(manifest, seed.iconAssetId)} />
                <span>{seed.name}</span>
                <strong>{seed.baseGrowthSeconds}s</strong>
              </button>
            ))}
          </aside>
        </section>

        <nav className="bottom-tabs" aria-label="주요 화면">
          <button type="button">정원</button>
          <button type="button">씨앗</button>
          <button type="button">도감</button>
          <button type="button">원정</button>
          <button type="button">상점</button>
        </nav>
      </section>

      <section className="dev-panel" aria-label="스캐폴드 검증 정보">
        <h2>스캐폴드 상태</h2>
        <ul>
          <li>manifest asset 수: {manifest ? Object.keys(manifest.assets).length : "loading"}</li>
          <li>seed config 수: {content.seeds.length}</li>
          <li>creature config 수: {content.creatures.length}</li>
          <li>local save: {save ? "ready" : "loading"}</li>
          <li>runtime image generation: disabled</li>
        </ul>
        {manifestError && <p className="error-text">{manifestError}</p>}
      </section>
    </main>
  );
}
