import type { AssetManifest, ManifestAsset } from "../types/game";

const MANIFEST_PATH = "/assets/manifest/assetManifest.json";

export async function loadAssetManifest(): Promise<AssetManifest> {
  const response = await fetch(MANIFEST_PATH);

  if (!response.ok) {
    throw new Error(`asset manifest load failed: ${response.status}`);
  }

  const manifest = (await response.json()) as AssetManifest;

  if (manifest.runtime_generation_allowed) {
    throw new Error("runtime image generation must remain disabled");
  }

  return manifest;
}

export function getAsset(manifest: AssetManifest | null, assetId: string): ManifestAsset | null {
  if (!manifest) {
    return null;
  }

  return manifest.assets[assetId] ?? null;
}

export function getAssetPath(manifest: AssetManifest | null, assetId: string): string {
  return getAsset(manifest, assetId)?.path ?? "";
}
