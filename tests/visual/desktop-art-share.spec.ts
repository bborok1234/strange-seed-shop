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

  test(`desktop ${viewport.width}x${viewport.height} production actor와 support actor가 workstage 안에서 읽힌다`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/?qaResearchExpeditionReady=1");
    const actor = page.locator(".playfield-workstage-primary-sprite");
    await expect(actor).toBeVisible();
    const actorMotion = await page
      .locator(".playfield-workstage-primary")
      .evaluate((element) => window.getComputedStyle(element).animationName);
    expect(actorMotion).toContain("workstage-primary-bob");

    const workstage = page.locator(".playfield-companion-workstage");
    const supportActors = page.locator(".playfield-workstage-support");
    const momoSupport = page.locator('.playfield-workstage-support[data-worker-id="creature_herb_common_002"]');
    await expect(workstage).toBeVisible();
    const supportCount = await supportActors.count();
    expect(supportCount).toBeGreaterThan(0);
    await expect(momoSupport).toHaveAttribute("data-animation-asset", "sprite_creature_herb_common_002_work_strip");
    await expect(momoSupport).toHaveAttribute("data-frame-count", "6");
    await expect(momoSupport.locator(".playfield-workstage-support-sprite")).toBeVisible();
    await expect(page.locator(".playfield-workstage-trail")).toHaveCount(2);

    const stageRect = await workstage.boundingBox();
    expect(stageRect).not.toBeNull();
    if (!stageRect) return;
    for (let index = 0; index < supportCount; index += 1) {
      const rect = await supportActors.nth(index).boundingBox();
      expect(rect).not.toBeNull();
      if (!rect) continue;
      expect(rect.x).toBeGreaterThanOrEqual(stageRect.x - 2);
      expect(rect.y).toBeGreaterThanOrEqual(stageRect.y - 2);
      expect(rect.x + rect.width).toBeLessThanOrEqual(stageRect.x + stageRect.width + 2);
      expect(rect.y + rect.height).toBeLessThanOrEqual(stageRect.y + stageRect.height + 2);
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

test("desktop 1280x900 production garden visual composition도 모바일 frame 안에서 유지된다", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/?qaBottleneckGraphReady=1");

  await expect(page.locator(".desktop-shell")).toBeVisible();
  await expect(page.locator(".starter-panel.has-production-graph")).toBeVisible();
  await expect(page.locator(".playfield-workstage-primary-sprite")).toBeVisible();
  await expect(page.locator(".playfield-workstage-target.target-order")).toBeVisible();
  await expect(page.locator(".playfield-plot-card").first()).toBeVisible();
  await expect(page.locator(".side-dock")).toHaveCount(0);
  await expect(page.locator(".bottom-tabs.is-desktop-rail")).toHaveCount(0);

  const metrics = await page.evaluate(() => {
    const shell = document.querySelector<HTMLElement>(".desktop-shell")?.getBoundingClientRect();
    const playfield = document.querySelector<HTMLElement>(".garden-playfield-host")?.getBoundingClientRect();
    const plot = document.querySelector<HTMLElement>(".playfield-plot-card:not(:disabled)")?.getBoundingClientRect();
    const actor = document.querySelector<HTMLElement>(".playfield-workstage-primary-sprite")?.getBoundingClientRect();
    const label = document.querySelector<HTMLElement>(".playfield-plot-label-stack");
    const labelStyle = label ? window.getComputedStyle(label) : null;
    const actionPanel = document.querySelector<HTMLElement>(".starter-panel")?.getBoundingClientRect();
    const tabs = document.querySelector<HTMLElement>(".bottom-tabs")?.getBoundingClientRect();
    return {
      innerWidth: window.innerWidth,
      shell: shell ? { x: shell.x, width: shell.width } : null,
      playfield: playfield ? { top: playfield.top, height: playfield.height } : null,
      plot: plot ? { top: plot.top, bottom: plot.bottom, centerY: plot.top + plot.height / 2 } : null,
      actor: actor ? { width: actor.width, height: actor.height } : null,
      label: label
        ? {
            backgroundColor: labelStyle?.backgroundColor ?? "",
            borderTopWidth: labelStyle?.borderTopWidth ?? ""
          }
        : null,
      actionPanel: actionPanel ? { top: actionPanel.top, bottom: actionPanel.bottom, height: actionPanel.height } : null,
      tabs: tabs ? { top: tabs.top, bottom: tabs.bottom, width: tabs.width } : null
    };
  });

  expect(metrics.shell).not.toBeNull();
  expect(metrics.playfield).not.toBeNull();
  expect(metrics.plot).not.toBeNull();
  expect(metrics.actor).not.toBeNull();
  expect(metrics.label).not.toBeNull();
  expect(metrics.actionPanel).not.toBeNull();
  expect(metrics.tabs).not.toBeNull();
  expect(metrics.shell!.width).toBeLessThanOrEqual(430);
  expect(Math.abs(metrics.shell!.x + metrics.shell!.width / 2 - metrics.innerWidth / 2)).toBeLessThanOrEqual(2);
  expect(metrics.tabs!.width).toBeLessThanOrEqual(metrics.shell!.width);
  expect(metrics.playfield!.height).toBeGreaterThanOrEqual(315);
  expect(metrics.plot!.centerY).toBeGreaterThan(metrics.playfield!.top + metrics.playfield!.height * 0.52);
  expect(metrics.plot!.bottom).toBeLessThanOrEqual(metrics.actionPanel!.top - 8);
  expect(metrics.actor!.width).toBeGreaterThanOrEqual(48);
  expect(metrics.actor!.height).toBeGreaterThanOrEqual(48);
  expect(metrics.label!.backgroundColor).not.toBe("rgba(0, 0, 0, 0)");
  expect(metrics.label!.borderTopWidth).not.toBe("0px");

  await page.screenshot({
    path: testInfo.outputPath("desktop-production-garden-visual-composition-1280.png"),
    fullPage: false,
    animations: "disabled"
  });
});

test("desktop 1280x900 복귀 정원 state도 중앙 모바일 frame 안에 남는다", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/?qaOfflineMinutes=60&qaLunarGuardian=1&qaReset=1");

  await page.getByRole("button", { name: "보상 확인" }).click();

  await expect(page.locator(".desktop-shell")).toBeVisible();
  await expect(page.getByLabel("복귀 정원 상태")).toContainText("+90 잎");
  await expect(page.locator(".playfield-workstage-target.target-order")).toBeVisible();
  await expect(page.locator(".side-dock")).toHaveCount(0);
  await expect(page.locator(".bottom-tabs.is-desktop-rail")).toHaveCount(0);

  const metrics = await page.evaluate(() => {
    const shell = document.querySelector<HTMLElement>(".desktop-shell")?.getBoundingClientRect();
    const panelElement = document.querySelector<HTMLElement>(".starter-panel");
    const panel = panelElement?.getBoundingClientRect();
    const receiptElement = document.querySelector<HTMLElement>(".comeback-garden-receipt");
    const receipt = receiptElement?.getBoundingClientRect();
    const tabs = document.querySelector<HTMLElement>(".bottom-tabs")?.getBoundingClientRect();
    const crate = document.querySelector<HTMLElement>(".playfield-workstage-target.target-order")?.getBoundingClientRect();
    return {
      innerWidth: window.innerWidth,
      bodyScrollHeight: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
      innerHeight: window.innerHeight,
      shell: shell ? { x: shell.x, width: shell.width, bottom: shell.bottom } : null,
      panel: panel
        ? {
            bottom: panel.bottom,
            clientHeight: panelElement?.clientHeight ?? 0,
            scrollHeight: panelElement?.scrollHeight ?? 0
          }
        : null,
      receipt: receipt
        ? {
            bottom: receipt.bottom,
            clientHeight: receiptElement?.clientHeight ?? 0,
            scrollHeight: receiptElement?.scrollHeight ?? 0
          }
        : null,
      tabs: tabs ? { top: tabs.top, bottom: tabs.bottom, width: tabs.width } : null,
      crate: crate ? { width: crate.width, height: crate.height } : null
    };
  });

  expect(metrics.shell).not.toBeNull();
  expect(metrics.panel).not.toBeNull();
  expect(metrics.receipt).not.toBeNull();
  expect(metrics.tabs).not.toBeNull();
  expect(metrics.crate).not.toBeNull();
  expect(metrics.shell!.width).toBeLessThanOrEqual(430);
  expect(Math.abs(metrics.shell!.x + metrics.shell!.width / 2 - metrics.innerWidth / 2)).toBeLessThanOrEqual(2);
  expect(metrics.bodyScrollHeight).toBeLessThanOrEqual(metrics.innerHeight + 2);
  expect(metrics.panel!.bottom).toBeLessThanOrEqual(metrics.tabs!.top - 4);
  expect(metrics.panel!.scrollHeight).toBeLessThanOrEqual(metrics.panel!.clientHeight + 1);
  expect(metrics.receipt!.scrollHeight).toBeLessThanOrEqual(metrics.receipt!.clientHeight + 1);
  expect(metrics.crate!.width).toBeGreaterThanOrEqual(28);

  await page.screenshot({
    path: testInfo.outputPath("desktop-offline-return-garden-state-1280.png"),
    fullPage: false,
    animations: "disabled"
  });
});
