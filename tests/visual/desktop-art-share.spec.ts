import { expect, test } from "@playwright/test";

/**
 * stage-art-first-restructure spec § Acceptance Criteria Layer 1·2 enforcement.
 *
 * Cycle 1 implementation 갭의 자동 차단 mechanism. PR이 spec § Decisions §1 약속
 * (stage region cream React panel ≤ 25%)을 위반하면 CI가 자동 reject.
 *
 * Spec: reports/deliberation/stage-art-first-restructure/spec.md
 */

const STAGE_CREAM_PANEL_RATIO_MAX = 0.25;
const RAIL_BUTTON_HEIGHT_MAX = 44;

const DESKTOP_VIEWPORTS = [
  { width: 1280, height: 800 },
  { width: 1600, height: 900 },
  { width: 1920, height: 1180 }
];

const STAGE_OVERLAY_SELECTORS = [
  ".garden-panel",
  ".starter-panel",
  ".action-surface",
  ".garden-action-surface"
];

interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

function intersectionArea(a: BoundingBox, b: BoundingBox): number {
  const ix = Math.max(a.x, b.x);
  const iy = Math.max(a.y, b.y);
  const iw = Math.min(a.x + a.width, b.x + b.width) - ix;
  const ih = Math.min(a.y + a.height, b.y + b.height) - iy;
  return iw > 0 && ih > 0 ? iw * ih : 0;
}

for (const viewport of DESKTOP_VIEWPORTS) {
  test(`stage cream panel ratio ≤ ${STAGE_CREAM_PANEL_RATIO_MAX} at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    const stage = page.locator(".garden-stage");
    await expect(stage).toBeVisible();

    const stageRect = await stage.boundingBox();
    expect(stageRect).not.toBeNull();
    if (!stageRect) return;

    let overlayArea = 0;
    for (const selector of STAGE_OVERLAY_SELECTORS) {
      const elements = await page.locator(selector).all();
      for (const element of elements) {
        const rect = await element.boundingBox();
        if (!rect) continue;
        overlayArea += intersectionArea(rect, stageRect);
      }
    }

    const stageArea = stageRect.width * stageRect.height;
    const ratio = stageArea > 0 ? overlayArea / stageArea : 0;
    expect.soft(ratio).toBeLessThanOrEqual(STAGE_CREAM_PANEL_RATIO_MAX);
    if (ratio > STAGE_CREAM_PANEL_RATIO_MAX) {
      throw new Error(
        `Stage cream panel ratio ${(ratio * 100).toFixed(1)}% exceeds ${(STAGE_CREAM_PANEL_RATIO_MAX * 100).toFixed(0)}% at ${viewport.width}x${viewport.height}. ` +
          `Spec § Decisions §1·§2 violation. Reduce React panel coverage of garden-stage region.`
      );
    }
  });

  test(`rail button height ≤ ${RAIL_BUTTON_HEIGHT_MAX}px at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    const railButtons = page.locator(".bottom-tabs.is-desktop-rail button");
    const count = await railButtons.count();
    expect(count).toBeGreaterThan(0);
    for (let index = 0; index < count; index += 1) {
      const rect = await railButtons.nth(index).boundingBox();
      if (!rect) continue;
      if (rect.height > RAIL_BUTTON_HEIGHT_MAX) {
        throw new Error(
          `Rail button #${index} height ${rect.height.toFixed(0)}px exceeds ${RAIL_BUTTON_HEIGHT_MAX}px at ${viewport.width}x${viewport.height}. ` +
            `Spec § Implementation Sequence PR4 violation. Reduce padding/min-height for ambient nav.`
        );
      }
    }
  });

  test(`dock background contrast vs stage at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    const sideDock = page.locator(".side-dock");
    if ((await sideDock.count()) === 0) return;

    const dockBg = await sideDock.evaluate((element) => window.getComputedStyle(element).backgroundColor);
    const stageBg = await page.locator(".garden-stage").evaluate((element) => window.getComputedStyle(element).backgroundColor);
    expect(dockBg).not.toBe(stageBg);
  });

  test(`plot card NOT covered by dev-panel/dock when seeds tab active at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/?qaHarvestReveal=1");
    const recordBtn = page.getByRole("button", { name: "도감에 기록하기" });
    if ((await recordBtn.count()) > 0) {
      await recordBtn.click();
    }
    await page.waitForTimeout(800);
    const seedsTab = page.locator(".bottom-tabs.is-desktop-rail button", { hasText: "씨앗" }).first();
    if ((await seedsTab.count()) === 0) return;
    await seedsTab.click();
    await page.waitForTimeout(800);

    const gardenPanel = page.locator(".garden-panel").first();
    const devPanel = page.locator(".dev-panel").first();
    if ((await gardenPanel.count()) === 0 || (await devPanel.count()) === 0) return;

    const gardenRect = await gardenPanel.boundingBox();
    const devRect = await devPanel.boundingBox();
    if (!gardenRect || !devRect) return;

    const overlapArea = intersectionArea(gardenRect, devRect);
    const gardenArea = gardenRect.width * gardenRect.height;
    const overlapRatio = gardenArea > 0 ? overlapArea / gardenArea : 0;
    if (overlapRatio > 0.1) {
      throw new Error(
        `When seeds tab is active, dev-panel covers ${(overlapRatio * 100).toFixed(1)}% of garden-panel(plot) at ${viewport.width}x${viewport.height}. ` +
          `User cannot see plot. Reposition garden-panel or make dev-panel narrower/transparent.`
      );
    }
  });
}
