import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

type PlayerTab = "seeds" | "album" | "expedition" | "shop";

const PLAYER_TABS: PlayerTab[] = ["seeds", "album", "expedition", "shop"];

async function openPlayerTabState(page: Page, tab: PlayerTab) {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto(`/?qaHarvestReveal=1&qaTab=${tab}`);
  await page.getByRole("button", { name: "도감에 기록하기" }).click();
  await expect(page.locator(`.dev-panel.tab-${tab}`)).toBeVisible();
}

for (const viewport of [
  { name: "393", width: 393, height: 852 },
  { name: "375", width: 375, height: 812 },
  { name: "360", width: 360, height: 800 }
]) {
  test(`모바일 정원 ${viewport.name}px 화면은 body scroll 없이 playfield와 하단 탭을 보존한다`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/?qaSpriteState=ready");
    await expect(page.locator(".garden-playfield-host")).toBeVisible();
    await expect(page.locator(".garden-playfield-host canvas")).toBeVisible();
    await expect(page.locator(".dev-panel")).toHaveCount(0);
    await expect(page.getByText("MOBILE GARDEN HUD")).toHaveCount(0);

    const metrics = await page.evaluate(() => {
      const playfield = document.querySelector<HTMLElement>(".garden-playfield-host")?.getBoundingClientRect();
      const tabs = document.querySelector<HTMLElement>(".bottom-tabs")?.getBoundingClientRect();
      const actionPanel = document.querySelector<HTMLElement>(".starter-panel")?.getBoundingClientRect();
      const bodyScrollHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
      return {
        innerHeight: window.innerHeight,
        bodyScrollHeight,
        playfield: playfield ? { top: playfield.top, bottom: playfield.bottom, height: playfield.height } : null,
        tabs: tabs ? { top: tabs.top, bottom: tabs.bottom } : null,
        actionPanel: actionPanel
          ? {
              top: actionPanel.top,
              bottom: actionPanel.bottom,
              clientHeight: document.querySelector<HTMLElement>(".starter-panel")?.clientHeight ?? 0,
              scrollHeight: document.querySelector<HTMLElement>(".starter-panel")?.scrollHeight ?? 0
            }
          : null
      };
    });

    expect(metrics.bodyScrollHeight).toBeLessThanOrEqual(metrics.innerHeight + 2);
    expect(metrics.playfield).not.toBeNull();
    expect(metrics.tabs).not.toBeNull();
    expect(metrics.actionPanel).not.toBeNull();
    expect(metrics.playfield!.height).toBeGreaterThan(220);
    expect(metrics.actionPanel!.bottom).toBeLessThanOrEqual(metrics.tabs!.top - 4);
    expect(metrics.actionPanel!.scrollHeight).toBeLessThanOrEqual(metrics.actionPanel!.clientHeight + 1);

    await page.screenshot({ path: testInfo.outputPath(`mobile-garden-${viewport.name}-no-scroll.png`), fullPage: false });
  });
}

for (const tab of PLAYER_TABS) {
  test(`모바일 ${tab} 탭은 밭 위 half-overlay가 아니라 한 화면 tab screen이다`, async ({ page }, testInfo) => {
    await openPlayerTabState(page, tab);

    const metrics = await page.evaluate((activeTab) => {
      const panel = document.querySelector<HTMLElement>(`.dev-panel.tab-${activeTab}`)?.getBoundingClientRect();
      const tabs = document.querySelector<HTMLElement>(".bottom-tabs")?.getBoundingClientRect();
      const garden = document.querySelector<HTMLElement>(".garden-panel");
      const stage = document.querySelector<HTMLElement>(".garden-stage")?.getBoundingClientRect();
      const bodyScrollHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
      return {
        innerHeight: window.innerHeight,
        bodyScrollHeight,
        panel: panel ? { top: panel.top, bottom: panel.bottom, height: panel.height, left: panel.left, right: panel.right } : null,
        tabs: tabs ? { top: tabs.top, bottom: tabs.bottom } : null,
        stage: stage ? { top: stage.top, bottom: stage.bottom, height: stage.height } : null,
        gardenOpacity: garden ? Number.parseFloat(window.getComputedStyle(garden).opacity) : null,
        gardenPointerEvents: garden ? window.getComputedStyle(garden).pointerEvents : null
      };
    }, tab);

    expect(metrics.panel).not.toBeNull();
    expect(metrics.tabs).not.toBeNull();
    expect(metrics.stage).not.toBeNull();
    expect(metrics.bodyScrollHeight).toBeLessThanOrEqual(metrics.innerHeight + 2);
    expect(metrics.panel!.top).toBeGreaterThanOrEqual(metrics.stage!.top);
    expect(metrics.panel!.bottom).toBeLessThanOrEqual(metrics.tabs!.top + 1);
    expect(metrics.panel!.height).toBeGreaterThan(760);
    expect(metrics.gardenOpacity).toBeLessThan(0.05);
    expect(metrics.gardenPointerEvents).toBe("none");

    await page.screenshot({ path: testInfo.outputPath(`mobile-${tab}-tab-screen.png`), fullPage: false });
  });
}

test("데스크톱 탭 화면은 외부 대시보드가 아니라 게임 stage 내부에 고정된다", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/?qaHarvestReveal=1&qaTab=album");
  await page.getByRole("button", { name: "도감에 기록하기" }).click();
  await expect(page.locator(".garden-stage > .dev-panel.tab-album")).toBeVisible();

  const metrics = await page.evaluate(() => {
    const stage = document.querySelector<HTMLElement>(".garden-stage")?.getBoundingClientRect();
    const panel = document.querySelector<HTMLElement>(".dev-panel.tab-album")?.getBoundingClientRect();
    const garden = document.querySelector<HTMLElement>(".garden-panel")?.getBoundingClientRect();
    return {
      stage: stage ? { left: stage.left, right: stage.right, top: stage.top, bottom: stage.bottom } : null,
      panel: panel ? { left: panel.left, right: panel.right, top: panel.top, bottom: panel.bottom } : null,
      garden: garden ? { left: garden.left, right: garden.right, top: garden.top, bottom: garden.bottom } : null
    };
  });

  expect(metrics.stage).not.toBeNull();
  expect(metrics.panel).not.toBeNull();
  expect(metrics.garden).not.toBeNull();
  expect(metrics.panel!.left).toBeGreaterThanOrEqual(metrics.stage!.left + 1);
  expect(metrics.panel!.right).toBeLessThanOrEqual(metrics.stage!.right - 1);
  expect(metrics.panel!.top).toBeGreaterThanOrEqual(metrics.stage!.top + 1);
  expect(metrics.panel!.bottom).toBeLessThanOrEqual(metrics.stage!.bottom - 70);
  expect(metrics.garden!.right).toBeLessThanOrEqual(metrics.panel!.left - 12);

  await page.screenshot({ path: testInfo.outputPath("desktop-in-stage-album.png"), fullPage: false });
});
