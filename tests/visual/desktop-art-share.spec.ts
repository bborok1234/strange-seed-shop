import { expect, test } from "@playwright/test";

const DESKTOP_VIEWPORTS = [
  { width: 1280, height: 800 },
  { width: 1600, height: 900 },
  { width: 1920, height: 1180 }
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
  test(`desktop ${viewport.width}x${viewport.height}도 모바일 game frame 하나만 렌더한다`, async ({ page }, testInfo) => {
    await page.setViewportSize(viewport);
    await page.goto("/?qaResearchExpeditionReady=1");

    const shell = page.locator(".desktop-shell");
    const stage = page.locator(".garden-stage");
    const tabs = page.locator(".bottom-tabs");
    await expect(shell).toBeVisible();
    await expect(stage).toBeVisible();
    await expect(tabs).toBeVisible();
    await expect(page.locator(".side-dock")).toHaveCount(0);
    await expect(page.locator(".bottom-tabs.is-desktop-rail")).toHaveCount(0);
    await expect(tabs.locator("button")).toHaveCount(5);
    await expect(page.getByRole("button", { name: "정원" })).toBeVisible();

    const metrics = await page.evaluate(() => {
      const shell = document.querySelector<HTMLElement>(".desktop-shell")?.getBoundingClientRect();
      const stage = document.querySelector<HTMLElement>(".garden-stage")?.getBoundingClientRect();
      const tabs = document.querySelector<HTMLElement>(".bottom-tabs")?.getBoundingClientRect();
      const topBar = document.querySelector<HTMLElement>(".top-bar")?.getBoundingClientRect();
      const bodyScrollWidth = Math.max(document.body.scrollWidth, document.documentElement.scrollWidth);
      const bodyScrollHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
      return {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        bodyScrollWidth,
        bodyScrollHeight,
        shell: shell ? { x: shell.x, y: shell.y, width: shell.width, height: shell.height, bottom: shell.bottom } : null,
        stage: stage ? { x: stage.x, y: stage.y, width: stage.width, height: stage.height, bottom: stage.bottom } : null,
        tabs: tabs ? { x: tabs.x, y: tabs.y, width: tabs.width, height: tabs.height, bottom: tabs.bottom } : null,
        topBar: topBar ? { x: topBar.x, y: topBar.y, width: topBar.width, height: topBar.height } : null
      };
    });

    expect(metrics.shell).not.toBeNull();
    expect(metrics.stage).not.toBeNull();
    expect(metrics.tabs).not.toBeNull();
    expect(metrics.topBar).not.toBeNull();
    expect(metrics.shell!.width).toBeLessThanOrEqual(430);
    expect(metrics.stage!.width).toBeLessThanOrEqual(metrics.shell!.width);
    expect(metrics.stage!.width).toBeGreaterThanOrEqual(metrics.shell!.width - 4);
    expect(metrics.tabs!.width).toBeLessThanOrEqual(metrics.shell!.width);
    expect(metrics.tabs!.width).toBeGreaterThanOrEqual(metrics.shell!.width - 4);
    expect(metrics.tabs!.bottom).toBeLessThanOrEqual(metrics.shell!.bottom);
    expect(metrics.tabs!.bottom).toBeGreaterThanOrEqual(metrics.shell!.bottom - 4);
    expect(Math.abs(metrics.shell!.x + metrics.shell!.width / 2 - metrics.innerWidth / 2)).toBeLessThanOrEqual(2);
    expect(metrics.bodyScrollWidth).toBeLessThanOrEqual(metrics.innerWidth + 2);
    expect(metrics.bodyScrollHeight).toBeLessThanOrEqual(metrics.innerHeight + 2);

    await page.screenshot({ path: testInfo.outputPath(`desktop-forced-mobile-frame-${viewport.width}.png`), fullPage: false });
  });

  test(`desktop ${viewport.width}x${viewport.height} plot marker가 floor action zone에 남는다`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/?qaResearchExpeditionReady=1");
    await expect(page.locator(".garden-playfield-host")).toBeVisible();
    await expect(page.locator(".playfield-plot-marker").first()).toBeVisible();

    const markerCount = await page.locator(".playfield-plot-marker").count();
    expect(markerCount).toBeGreaterThanOrEqual(2);
    const plotRect = await page.locator(".playfield-plot-card").first().boundingBox();
    const stageRect = await page.locator(".garden-stage").boundingBox();
    const actionRect = await page.locator(".starter-panel").boundingBox();
    expect(plotRect).not.toBeNull();
    expect(stageRect).not.toBeNull();
    expect(actionRect).not.toBeNull();
    if (!plotRect || !stageRect || !actionRect) return;

    const plotCenterY = plotRect.y + plotRect.height / 2;
    const minFloorY = stageRect.y + stageRect.height * 0.32;
    expect(plotCenterY, "plot marker should sit on the garden floor, not the top shelf").toBeGreaterThan(minFloorY);
    expect(plotRect.y + plotRect.height, "plot marker must not collide with the bottom action surface").toBeLessThanOrEqual(
      actionRect.y + 10
    );

    const labelMetrics = await page.locator(".playfield-plot-label-stack").first().evaluate((element) => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return {
        width: rect.width,
        height: rect.height,
        background: style.backgroundColor,
        color: style.color
      };
    });
    expect(labelMetrics.width).toBeGreaterThan(48);
    expect(labelMetrics.height).toBeGreaterThan(24);
    expect(labelMetrics.background).not.toBe("rgba(0, 0, 0, 0)");
  });

  test(`desktop ${viewport.width}x${viewport.height} fresh start가 첫 밭 action에서 시작한다`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/?qaReset=1");
    const starterPlot = page.getByRole("button", { name: "말랑잎 씨앗 무료로 심기" });
    await expect(starterPlot).toBeVisible();
    await starterPlot.click();
    await expect(page.getByRole("button", { name: "말랑잎 씨앗 성장시키기" })).toBeVisible();
  });

  test(`desktop ${viewport.width}x${viewport.height} production actor와 support actor가 card 안에서 읽힌다`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/?qaResearchExpeditionReady=1");
    const actor = page.locator(".playfield-production-actor-sprite");
    await expect(actor).toBeVisible();
    const actorMotion = await actor.evaluate((element) => window.getComputedStyle(element).animationName);
    expect(actorMotion).toContain("playfieldActorIdle");

    const actorCard = page.locator(".playfield-production-actor");
    const supportActors = page.locator(".playfield-support-worker");
    await expect(actorCard).toBeVisible();
    const supportCount = await supportActors.count();
    expect(supportCount).toBeGreaterThan(0);

    const cardRect = await actorCard.boundingBox();
    expect(cardRect).not.toBeNull();
    if (!cardRect) return;
    for (let index = 0; index < supportCount; index += 1) {
      const rect = await supportActors.nth(index).boundingBox();
      expect(rect).not.toBeNull();
      if (!rect) continue;
      expect(rect.x).toBeGreaterThanOrEqual(cardRect.x - 2);
      expect(rect.y).toBeGreaterThanOrEqual(cardRect.y - 2);
      expect(rect.x + rect.width).toBeLessThanOrEqual(cardRect.x + cardRect.width + 2);
      expect(rect.y + rect.height).toBeLessThanOrEqual(cardRect.y + cardRect.height + 2);
    }
  });

  test(`desktop ${viewport.width}x${viewport.height} player tab도 mobile panel로 열린다`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/?qaResearchExpeditionReady=1");
    await page.getByRole("button", { name: "씨앗", exact: true }).click();
    await expect(page.locator(".dev-panel.player-panel.tab-seeds")).toBeVisible();

    const metrics = await page.evaluate(() => {
      const shell = document.querySelector<HTMLElement>(".desktop-shell")?.getBoundingClientRect();
      const panel = document.querySelector<HTMLElement>(".dev-panel.player-panel")?.getBoundingClientRect();
      const tabs = document.querySelector<HTMLElement>(".bottom-tabs")?.getBoundingClientRect();
      return {
        shell: shell ? { x: shell.x, y: shell.y, width: shell.width, height: shell.height } : null,
        panel: panel ? { x: panel.x, y: panel.y, width: panel.width, height: panel.height, bottom: panel.bottom } : null,
        tabs: tabs ? { x: tabs.x, y: tabs.y, width: tabs.width, height: tabs.height, top: tabs.top } : null
      };
    });

    expect(metrics.shell).not.toBeNull();
    expect(metrics.panel).not.toBeNull();
    expect(metrics.tabs).not.toBeNull();
    expect(metrics.panel!.x).toBeGreaterThanOrEqual(metrics.shell!.x);
    expect(metrics.panel!.x).toBeLessThanOrEqual(metrics.shell!.x + 2);
    expect(metrics.panel!.width).toBeLessThanOrEqual(metrics.shell!.width);
    expect(metrics.panel!.width).toBeGreaterThanOrEqual(metrics.shell!.width - 4);
    expect(metrics.panel!.bottom).toBeLessThanOrEqual(metrics.tabs!.top + 1);
  });
}
