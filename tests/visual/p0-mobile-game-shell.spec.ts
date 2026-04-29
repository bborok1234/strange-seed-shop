import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

type PlayerTab = "seeds" | "album" | "expedition" | "shop";

const PLAYER_TABS: PlayerTab[] = ["seeds", "album", "expedition", "shop"];

async function openPlayerTabState(page: Page, tab: PlayerTab) {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto(`/?qaHarvestReveal=1&qaTab=${tab}`);
  await page.getByRole("button", { name: "도감에 기록하기" }).click();
  await expect(page.locator(`.dev-panel.player-panel.tab-${tab}`)).toBeVisible();
}

async function clickFirstPlot(page: Page) {
  const visiblePlot = page.locator(".playfield-plot-card:not(:disabled)").first();
  await expect(visiblePlot).toBeVisible();
  await visiblePlot.click();
}

for (const viewport of [
  { name: "393", width: 393, height: 852 },
  { name: "375", width: 375, height: 812 },
  { name: "360", width: 360, height: 800 },
  { name: "399x666", width: 399, height: 666 }
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

for (const viewport of [
  { name: "393", width: 393, height: 852 },
  { name: "360", width: 360, height: 800 }
]) {
  test(`모바일 ${viewport.name}px 첫 수확 reveal은 CTA와 portrait가 viewport 안에 들어온다`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/?qaHarvestReveal=1");
    await expect(page.locator(".harvest-reveal-card")).toBeVisible();
    await expect(page.getByText("도감 첫 발견")).toBeVisible();
    await expect(page.getByText("새 생명체가 찾아왔어요")).toBeVisible();
    await expect(page.getByRole("button", { name: "도감에 기록하기" })).toBeVisible();

    const metrics = await page.evaluate(() => {
      const card = document.querySelector<HTMLElement>(".harvest-reveal-card")?.getBoundingClientRect();
      const portrait = document.querySelector<HTMLElement>(".harvest-portrait-frame")?.getBoundingClientRect();
      const cta = document.querySelector<HTMLElement>(".reveal-cta")?.getBoundingClientRect();
      const bodyScrollHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
      return {
        innerHeight: window.innerHeight,
        bodyScrollHeight,
        card: card ? { top: card.top, bottom: card.bottom, height: card.height } : null,
        portrait: portrait ? { width: portrait.width, height: portrait.height } : null,
        cta: cta ? { top: cta.top, bottom: cta.bottom, height: cta.height } : null
      };
    });

    expect(metrics.bodyScrollHeight).toBeLessThanOrEqual(metrics.innerHeight + 2);
    expect(metrics.card).not.toBeNull();
    expect(metrics.portrait).not.toBeNull();
    expect(metrics.cta).not.toBeNull();
    expect(metrics.card!.top).toBeGreaterThanOrEqual(8);
    expect(metrics.card!.bottom).toBeLessThanOrEqual(metrics.innerHeight - 8);
    expect(metrics.cta!.bottom).toBeLessThanOrEqual(metrics.innerHeight - 16);
    expect(metrics.cta!.height).toBeGreaterThanOrEqual(44);
    expect(metrics.portrait!.width).toBeGreaterThanOrEqual(viewport.width === 360 ? 128 : 144);
    expect(metrics.portrait!.height).toBeGreaterThanOrEqual(viewport.width === 360 ? 128 : 144);

    await page.screenshot({ path: testInfo.outputPath(`mobile-harvest-reveal-${viewport.name}.png`), fullPage: false });
  });
}

test("모바일 성장 밭 탭은 procedural feedback telemetry와 visual artifact를 남긴다", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto("/?qaSpriteState=growing&qaFxTelemetry=1");
  await clickFirstPlot(page);

  await page.waitForFunction(() => {
    const events = (window as unknown as { __gardenPlayfieldFxEvents?: Array<{ action: string; source: string }> }).__gardenPlayfieldFxEvents ?? [];
    return events.some((event) => event.action === "tap_growth" && event.source === "procedural");
  });

  await page.waitForTimeout(320);
  await page.screenshot({ path: testInfo.outputPath("mobile-playfield-tap-feedback-393.png"), fullPage: false });
});

test("모바일 ready 밭 수확은 procedural feedback telemetry 후 reveal로 이어진다", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto("/?qaSpriteState=ready&qaFxTelemetry=1");
  await clickFirstPlot(page);

  await page.waitForFunction(() => {
    const events = (window as unknown as { __gardenPlayfieldFxEvents?: Array<{ action: string; source: string }> }).__gardenPlayfieldFxEvents ?? [];
    return events.some((event) => event.action === "harvest_plot" && event.source === "procedural");
  });
  await expect(page.getByRole("button", { name: "도감에 기록하기" })).toBeVisible();

  await page.screenshot({ path: testInfo.outputPath("mobile-playfield-harvest-feedback-393.png"), fullPage: false });
});

test("모바일 자동 생산과 첫 주문은 업그레이드 선택까지 한 화면에서 검증한다", async ({ page }, testInfo) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto("/?qaProductionReady=1");

  await expect(page.getByLabel("정원 자동 생산 장면").getByText("자동 생산", { exact: true })).toBeVisible();
  await expect(page.locator(".playfield-production-actor img")).toBeVisible();
  await expect(page.locator(".playfield-order-crate img")).toBeVisible();
  await expect(page.getByLabel("자동 생산과 첫 주문").getByText("자동 생산", { exact: true })).toBeVisible();
  await expect(page.locator(".production-asset-work img")).toBeVisible();
  await expect(page.locator(".production-asset-crate img")).toBeVisible();
  await expect(page.getByLabel("다음 성장 선택")).toBeVisible();
  await expect(page.getByText("밭 확장", { exact: true })).toBeVisible();
  await expect(page.getByText("생산 속도", { exact: true })).toBeVisible();
  await expect(page.getByText("주문 준비", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "생산 잎 수령" })).toBeEnabled();
  const initialSurfaceMetrics = await page.evaluate(() => {
    const panel = document.querySelector<HTMLElement>(".starter-panel")?.getBoundingClientRect();
    const enabledButton = document.querySelector<HTMLButtonElement>(
      ".production-card button:not(:disabled), .garden-action-surface .primary-action:not(:disabled)"
    )?.getBoundingClientRect();
    const upgradeChoice = document.querySelector<HTMLElement>(".upgrade-choice-card")?.getBoundingClientRect();
    return {
      panel: panel ? { top: panel.top, bottom: panel.bottom, height: panel.height } : null,
      upgradeChoice: upgradeChoice ? { top: upgradeChoice.top, bottom: upgradeChoice.bottom, height: upgradeChoice.height } : null,
      clientHeight: document.querySelector<HTMLElement>(".starter-panel")?.clientHeight ?? 0,
      scrollHeight: document.querySelector<HTMLElement>(".starter-panel")?.scrollHeight ?? 0,
      enabledButton: enabledButton ? { height: enabledButton.height } : null
    };
  });

  expect(initialSurfaceMetrics.panel).not.toBeNull();
  expect(initialSurfaceMetrics.upgradeChoice).not.toBeNull();
  expect(initialSurfaceMetrics.enabledButton).not.toBeNull();
  expect(initialSurfaceMetrics.scrollHeight).toBeLessThanOrEqual(initialSurfaceMetrics.clientHeight + 1);
  expect(initialSurfaceMetrics.enabledButton!.height).toBeGreaterThanOrEqual(44);
  await page.getByRole("button", { name: "생산 잎 수령" }).click();
  await page.waitForFunction(() => {
    const events = (window as unknown as { __productionFxEvents?: Array<{ kind: string }> }).__productionFxEvents ?? [];
    return events.some((event) => event.kind === "production");
  });
  await expect(page.getByText("12/12 잎 납품 준비")).toBeVisible();
  await expect(page.getByRole("button", { name: /첫 잎 주문 납품/ })).toBeEnabled();
  await page.getByRole("button", { name: /첫 잎 주문 납품/ }).click();
  await page.waitForFunction(() => {
    const events = (window as unknown as { __productionFxEvents?: Array<{ kind: string }> }).__productionFxEvents ?? [];
    return events.some((event) => event.kind === "order");
  });
  await page.waitForTimeout(120);
  await page.screenshot({
    path: testInfo.outputPath("mobile-production-order-fx-v0-393.png"),
    fullPage: false,
    animations: "disabled"
  });
  await expect(page.getByLabel("첫 주문 납품 완료")).toBeVisible();
  await expect(page.locator(".production-asset-celebrate img")).toBeVisible();
  await expect(page.getByText("다음에 만날 아이")).toBeVisible();

  const metrics = await page.evaluate(() => {
    const playfield = document.querySelector<HTMLElement>(".garden-playfield-host")?.getBoundingClientRect();
    const tabs = document.querySelector<HTMLElement>(".bottom-tabs")?.getBoundingClientRect();
    const card = document.querySelector<HTMLElement>(".production-card")?.getBoundingClientRect();
    const upgradeChoice = document.querySelector<HTMLElement>(".upgrade-choice-card")?.getBoundingClientRect();
    const nextGoal = document.querySelector<HTMLElement>(".next-creature-card")?.getBoundingClientRect();
    const asset = document.querySelector<HTMLElement>(".production-asset-celebrate")?.getBoundingClientRect();
    return {
      playfield: playfield ? { top: playfield.top, bottom: playfield.bottom, height: playfield.height } : null,
      tabs: tabs ? { top: tabs.top, bottom: tabs.bottom } : null,
      card: card ? { top: card.top, bottom: card.bottom } : null,
      upgradeChoice: upgradeChoice ? { top: upgradeChoice.top, bottom: upgradeChoice.bottom } : null,
      nextGoal: nextGoal ? { top: nextGoal.top, bottom: nextGoal.bottom } : null,
      asset: asset ? { width: asset.width, height: asset.height } : null
    };
  });

  expect(metrics.playfield).not.toBeNull();
  expect(metrics.tabs).not.toBeNull();
  expect(metrics.card).not.toBeNull();
  expect(metrics.upgradeChoice).not.toBeNull();
  expect(metrics.nextGoal).not.toBeNull();
  expect(metrics.asset).not.toBeNull();
  expect(metrics.playfield!.height).toBeGreaterThan(220);
  expect(metrics.card!.bottom).toBeLessThanOrEqual(metrics.tabs!.top - 4);
  expect(metrics.upgradeChoice!.bottom).toBeLessThanOrEqual(metrics.tabs!.top - 4);
  expect(metrics.nextGoal!.bottom).toBeLessThanOrEqual(metrics.tabs!.top - 4);
  expect(metrics.asset!.width).toBeGreaterThanOrEqual(32);
  expect(metrics.asset!.height).toBeGreaterThanOrEqual(32);

  await page.waitForTimeout(1680);
  await expect(page.locator(".production-fx")).toHaveCount(0);
  await page.screenshot({
    path: testInfo.outputPath("mobile-production-order-v0-393.png"),
    fullPage: false,
    animations: "disabled"
  });
});

test("짧은 모바일 브라우저에서도 생산 actor와 action surface는 잘리지 않는다", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 399, height: 666 });
  await page.goto("/?qaProductionReady=1");
  await expect(page.getByLabel("정원 자동 생산 장면").getByText("자동 생산", { exact: true })).toBeVisible();
  await expect(page.locator(".playfield-production-actor img")).toBeVisible();
  await expect(page.locator(".playfield-order-crate img")).toBeVisible();
  await expect(page.getByRole("button", { name: "생산 잎 수령" })).toBeVisible();
  await expect(page.getByLabel("다음 성장 선택")).toBeVisible();

  const metrics = await page.evaluate(() => {
    const playfield = document.querySelector<HTMLElement>(".garden-playfield-host")?.getBoundingClientRect();
    const panel = document.querySelector<HTMLElement>(".starter-panel")?.getBoundingClientRect();
    const tabs = document.querySelector<HTMLElement>(".bottom-tabs")?.getBoundingClientRect();
    const primaryButton = document.querySelector<HTMLButtonElement>(".production-card button:not(:disabled)")?.getBoundingClientRect();
    const actorLane = document.querySelector<HTMLElement>(".playfield-production-lane")?.getBoundingClientRect();
    const upgradeChoice = document.querySelector<HTMLElement>(".upgrade-choice-card")?.getBoundingClientRect();
    return {
      bodyScrollHeight: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
      innerHeight: window.innerHeight,
      playfield: playfield ? { height: playfield.height, bottom: playfield.bottom } : null,
      panel: panel ? { top: panel.top, bottom: panel.bottom, height: panel.height } : null,
      tabs: tabs ? { top: tabs.top } : null,
      actorLane: actorLane ? { top: actorLane.top, bottom: actorLane.bottom, height: actorLane.height } : null,
      upgradeChoice: upgradeChoice ? { top: upgradeChoice.top, bottom: upgradeChoice.bottom, height: upgradeChoice.height } : null,
      primaryButton: primaryButton ? { height: primaryButton.height, bottom: primaryButton.bottom } : null,
      panelClientHeight: document.querySelector<HTMLElement>(".starter-panel")?.clientHeight ?? 0,
      panelScrollHeight: document.querySelector<HTMLElement>(".starter-panel")?.scrollHeight ?? 0
    };
  });

  expect(metrics.bodyScrollHeight).toBeLessThanOrEqual(metrics.innerHeight + 2);
  expect(metrics.playfield).not.toBeNull();
  expect(metrics.panel).not.toBeNull();
  expect(metrics.tabs).not.toBeNull();
  expect(metrics.actorLane).not.toBeNull();
  expect(metrics.upgradeChoice).not.toBeNull();
  expect(metrics.primaryButton).not.toBeNull();
  expect(metrics.playfield!.height).toBeGreaterThan(220);
  expect(metrics.actorLane!.bottom).toBeLessThanOrEqual(metrics.playfield!.bottom - 80);
  expect(metrics.upgradeChoice!.bottom).toBeLessThanOrEqual(metrics.tabs!.top - 4);
  expect(metrics.panel!.bottom).toBeLessThanOrEqual(metrics.tabs!.top - 4);
  expect(metrics.panelScrollHeight).toBeLessThanOrEqual(metrics.panelClientHeight + 1);
  expect(metrics.primaryButton!.height).toBeGreaterThanOrEqual(44);

  await page.screenshot({ path: testInfo.outputPath("mobile-production-action-surface-short-399x666.png"), fullPage: false });
});

for (const tab of PLAYER_TABS) {
  test(`모바일 ${tab} 탭은 밭 위 half-overlay가 아니라 한 화면 tab screen이다`, async ({ page }, testInfo) => {
    await openPlayerTabState(page, tab);

    const metrics = await page.evaluate((activeTab) => {
      const panelElement = document.querySelector<HTMLElement>(`.dev-panel.player-panel.tab-${activeTab}`);
      const panel = panelElement?.getBoundingClientRect();
      const tabs = document.querySelector<HTMLElement>(".bottom-tabs")?.getBoundingClientRect();
      const garden = document.querySelector<HTMLElement>(".garden-panel");
      const topBar = document.querySelector<HTMLElement>(".top-bar");
      const stage = document.querySelector<HTMLElement>(".garden-stage")?.getBoundingClientRect();
      const bodyScrollHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
      const elementAtTop = document.elementFromPoint(window.innerWidth / 2, 16);
      const topIsPlayerPanel = Boolean(elementAtTop?.closest(".player-panel"));
      return {
        innerHeight: window.innerHeight,
        bodyScrollHeight,
        panel: panel ? { top: panel.top, bottom: panel.bottom, height: panel.height, left: panel.left, right: panel.right } : null,
        tabs: tabs ? { top: tabs.top, bottom: tabs.bottom, height: tabs.height } : null,
        stage: stage ? { top: stage.top, bottom: stage.bottom, height: stage.height, left: stage.left, right: stage.right } : null,
        gardenOpacity: garden ? Number.parseFloat(window.getComputedStyle(garden).opacity) : null,
        gardenPointerEvents: garden ? window.getComputedStyle(garden).pointerEvents : null,
        topBarVisibility: topBar ? window.getComputedStyle(topBar).visibility : null,
        topIsPlayerPanel
      };
    }, tab);

    expect(metrics.panel).not.toBeNull();
    expect(metrics.tabs).not.toBeNull();
    expect(metrics.stage).not.toBeNull();
    expect(metrics.bodyScrollHeight).toBeLessThanOrEqual(metrics.innerHeight + 2);
    expect(metrics.panel!.top).toBeLessThanOrEqual(metrics.stage!.top + 1);
    expect(metrics.panel!.left).toBeLessThanOrEqual(metrics.stage!.left + 1);
    expect(metrics.panel!.right).toBeGreaterThanOrEqual(metrics.stage!.right - 1);
    expect(metrics.panel!.bottom).toBeLessThanOrEqual(metrics.tabs!.top + 1);
    expect(metrics.panel!.height).toBeGreaterThanOrEqual(metrics.innerHeight - metrics.tabs!.height - 2);
    expect(metrics.gardenOpacity).toBeLessThan(0.05);
    expect(metrics.gardenPointerEvents).toBe("none");
    expect(metrics.topBarVisibility).toBe("hidden");
    expect(metrics.topIsPlayerPanel).toBe(true);

    await page.screenshot({ path: testInfo.outputPath(`mobile-${tab}-full-screen-tab.png`), fullPage: false });
  });
}

test("데스크톱 탭 화면은 외부 대시보드가 아니라 게임 stage 내부에 고정된다", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/?qaHarvestReveal=1&qaTab=album");
  await page.getByRole("button", { name: "도감에 기록하기" }).click();
  await expect(page.locator(".garden-stage > .dev-panel.player-panel.tab-album")).toBeVisible();

  const metrics = await page.evaluate(() => {
    const stage = document.querySelector<HTMLElement>(".garden-stage")?.getBoundingClientRect();
    const panel = document.querySelector<HTMLElement>(".dev-panel.player-panel.tab-album")?.getBoundingClientRect();
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
