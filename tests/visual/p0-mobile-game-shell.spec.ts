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

test("모바일 자동 생산과 첫 주문은 반복 주문과 생산 속도 업그레이드까지 검증한다", async ({ page }, testInfo) => {
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
  await expect(page.getByText("연구", { exact: true })).toBeVisible();
  await expect(page.getByText("첫 납품 후 열림", { exact: true })).toBeVisible();
  await expect(page.getByText("두 번째 주문 후", { exact: true })).toBeVisible();
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
  await expect(page.getByRole("button", { name: /주문 납품/ })).toBeEnabled();
  await page.getByRole("button", { name: /주문 납품/ }).click();
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
  await expect(page.getByLabel("정원 자동 생산 장면").getByText("연구 준비 잎 묶음", { exact: true })).toBeVisible();
  await expect(page.getByLabel("자동 생산과 첫 주문").getByText("연구 준비 잎 묶음", { exact: true })).toBeVisible();
  await expect(page.getByLabel("자동 생산과 첫 주문").getByText("0/24 잎 납품 준비")).toBeVisible();
  await expect(page.locator(".production-asset-crate img")).toBeVisible();
  await expect(page.getByText("다음에 만날 아이")).toBeVisible();
  await expect(page.getByRole("button", { name: /작업 간식 강화/ })).toBeEnabled();
  await page.getByRole("button", { name: /작업 간식 강화/ }).click();
  await expect(page.getByText("강화 완료", { exact: true })).toBeVisible();
  await expect(page.getByLabel("자동 생산과 첫 주문").getByText("분당 9.0 잎", { exact: true })).toBeVisible();
  await expect
    .poll(async () =>
      page.evaluate(() => {
        const raw = window.localStorage.getItem("strange-seed-shop:phase0-save");
        return raw ? (JSON.parse(raw) as { productionBoostLevel?: number }).productionBoostLevel : 0;
      })
    )
    .toBe(1);
  await expect(page.getByRole("button", { name: "생산 잎 수령" })).toBeEnabled({ timeout: 12_000 });
  await page.getByRole("button", { name: "생산 잎 수령" }).click();
  await page.waitForFunction(() => {
    const events = (window as unknown as { __productionFxEvents?: Array<{ kind: string }> }).__productionFxEvents ?? [];
    return events.filter((event) => event.kind === "production").length >= 2;
  });
  await expect(page.getByLabel("자동 생산과 첫 주문").getByText("1/24 잎 납품 준비")).toBeVisible();

  const metrics = await page.evaluate(() => {
    const playfield = document.querySelector<HTMLElement>(".garden-playfield-host")?.getBoundingClientRect();
    const tabs = document.querySelector<HTMLElement>(".bottom-tabs")?.getBoundingClientRect();
    const card = document.querySelector<HTMLElement>(".production-card")?.getBoundingClientRect();
    const upgradeChoice = document.querySelector<HTMLElement>(".upgrade-choice-card")?.getBoundingClientRect();
    const nextGoal = document.querySelector<HTMLElement>(".next-creature-card")?.getBoundingClientRect();
    const asset = document.querySelector<HTMLElement>(".production-asset-crate")?.getBoundingClientRect();
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
  expect(metrics.asset!.height).toBeGreaterThanOrEqual(30);

  await page.waitForTimeout(1680);
  await expect(page.locator(".production-fx")).toHaveCount(0);
  await page.screenshot({
    path: testInfo.outputPath("mobile-production-order-v0-393.png"),
    fullPage: false,
    animations: "disabled"
  });
});

test("모바일 연구 unlock은 두 번째 주문 보상에서 연구 완료로 이어진다", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto("/?qaResearchReady=1");

  await expect(page.getByLabel("자동 생산과 첫 주문").getByText("연구 준비 잎 묶음", { exact: true })).toBeVisible();
  await expect(page.getByText("두 번째 주문 후", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: /주문 납품/ })).toBeEnabled();
  await page.getByRole("button", { name: /주문 납품/ }).click();
  await page.waitForFunction(() => {
    const events = (window as unknown as { __productionFxEvents?: Array<{ kind: string }> }).__productionFxEvents ?? [];
    return events.some((event) => event.kind === "order");
  });

  await expect(page.getByText("새싹 기록법 연구", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: /새싹 기록법 연구/ })).toBeEnabled();
  await page.getByRole("button", { name: /새싹 기록법 연구/ }).click();
  await expect(page.getByText("연구 완료", { exact: true })).toBeVisible();
  await expect
    .poll(async () =>
      page.evaluate(() => {
        const raw = window.localStorage.getItem("strange-seed-shop:phase0-save");
        return raw ? (JSON.parse(raw) as { researchLevel?: number }).researchLevel : 0;
      })
    )
    .toBe(1);

  const metrics = await page.evaluate(() => {
    const panel = document.querySelector<HTMLElement>(".starter-panel")?.getBoundingClientRect();
    const tabs = document.querySelector<HTMLElement>(".bottom-tabs")?.getBoundingClientRect();
    const upgradeChoice = document.querySelector<HTMLElement>(".upgrade-choice-card")?.getBoundingClientRect();
    return {
      panel: panel ? { bottom: panel.bottom } : null,
      tabs: tabs ? { top: tabs.top } : null,
      upgradeChoice: upgradeChoice ? { bottom: upgradeChoice.bottom } : null,
      panelClientHeight: document.querySelector<HTMLElement>(".starter-panel")?.clientHeight ?? 0,
      panelScrollHeight: document.querySelector<HTMLElement>(".starter-panel")?.scrollHeight ?? 0
    };
  });

  expect(metrics.panel).not.toBeNull();
  expect(metrics.tabs).not.toBeNull();
  expect(metrics.upgradeChoice).not.toBeNull();
  expect(metrics.panel!.bottom).toBeLessThanOrEqual(metrics.tabs!.top - 4);
  expect(metrics.upgradeChoice!.bottom).toBeLessThanOrEqual(metrics.tabs!.top - 4);
  expect(metrics.panelScrollHeight).toBeLessThanOrEqual(metrics.panelClientHeight + 1);

  await page.screenshot({ path: testInfo.outputPath("mobile-research-unlock-v0-393.png"), fullPage: false });
});

test("모바일 연구 단서는 정원과 씨앗 탭에서 다음 수집 목표를 설명한다", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto("/?qaResearchComplete=1");

  await expect(page.getByText("연구 완료", { exact: true })).toBeVisible();
  await expect(page.locator(".next-creature-card .research-clue-line")).toContainText("연구 단서:");
  await expect(page.locator(".next-creature-card .research-clue-line")).toContainText("넓은 잎으로 잠든 씨앗을 지켜준다");
  await page.screenshot({ path: testInfo.outputPath("mobile-research-clue-reward-v0-393.png"), fullPage: false });

  await page.getByRole("button", { name: "씨앗", exact: true }).click();
  await expect(page.locator(".dev-panel.player-panel.tab-seeds")).toBeVisible();
  await expect(page.getByText("도감 목표 씨앗", { exact: true })).toBeVisible();
  await expect(page.locator(".seed-goal-banner .research-clue-line")).toContainText("연구 단서:");
  await page.screenshot({ path: testInfo.outputPath("mobile-research-clue-reward-v0-seeds-tab-393.png"), fullPage: false });
});

test("모바일 연구 완료 후 원정 탭은 장기 메타 단서를 보여준다", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto("/?qaResearchComplete=1");

  await expect(page.getByRole("button", { name: /원정/ })).toContainText("단서");
  await page.getByRole("button", { name: /원정/ }).click();
  await expect(page.locator(".dev-panel.player-panel.tab-expedition")).toBeVisible();
  await expect(page.getByLabel("연구 완료 후 원정 단서")).toBeVisible();
  await expect(page.getByLabel("연구 완료 후 원정 단서").getByText("달빛 흔적 찾기", { exact: true })).toBeVisible();
  await expect(page.getByLabel("연구 완료 후 원정 단서")).toContainText("생명체 2마리 필요");
  await expect(page.getByLabel("연구 완료 후 원정 단서")).toContainText("+420 잎 · +2 재료");
  await expect(page.getByLabel("연구 완료 후 원정 단서")).toContainText("1마리 더 발견하면");

  const metrics = await page.evaluate(() => {
    const panel = document.querySelector<HTMLElement>(".dev-panel.player-panel.tab-expedition")?.getBoundingClientRect();
    const tabs = document.querySelector<HTMLElement>(".bottom-tabs")?.getBoundingClientRect();
    const clue = document.querySelector<HTMLElement>(".research-expedition-preview")?.getBoundingClientRect();
    return {
      bodyScrollHeight: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
      innerHeight: window.innerHeight,
      panel: panel ? { top: panel.top, bottom: panel.bottom, height: panel.height } : null,
      tabs: tabs ? { top: tabs.top, bottom: tabs.bottom } : null,
      clue: clue ? { top: clue.top, bottom: clue.bottom, height: clue.height } : null
    };
  });

  expect(metrics.bodyScrollHeight).toBeLessThanOrEqual(metrics.innerHeight + 2);
  expect(metrics.panel).not.toBeNull();
  expect(metrics.tabs).not.toBeNull();
  expect(metrics.clue).not.toBeNull();
  expect(metrics.panel!.bottom).toBeLessThanOrEqual(metrics.tabs!.top + 1);
  expect(metrics.clue!.bottom).toBeLessThanOrEqual(metrics.tabs!.top - 4);

  await page.screenshot({ path: testInfo.outputPath("mobile-research-expedition-bridge-v0-393.png"), fullPage: false });
});

test("모바일 생산 roster는 두 번째 생명체를 정원 동료로 보여준다", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto("/?qaResearchExpeditionReady=1");

  await expect(page.getByLabel("정원 자동 생산 장면")).toContainText("정원 동료 2명 작업 중");
  await expect(page.getByLabel("정원 자동 생산 장면")).toContainText("말랑잎 포리 · 방패새싹 모모");
  await expect(page.getByLabel("자동 생산과 첫 주문")).toContainText("정원 동료 2명 작업 중");
  await expect(page.getByLabel("자동 생산과 첫 주문")).toContainText("분당 12.8 잎");
  await expect(page.getByLabel("생산 동료 roster")).toContainText("말랑잎 포리");
  await expect(page.getByLabel("생산 동료 roster")).toContainText("방패새싹 모모");
  await expect(page.getByLabel("생산 동료 roster")).toContainText("수집가 +7.2/분");
  await expect(page.getByLabel("생산 동료 roster")).toContainText("수호자 +3.0/분");

  const metrics = await page.evaluate(() => {
    const playfield = document.querySelector<HTMLElement>(".garden-playfield-host")?.getBoundingClientRect();
    const panel = document.querySelector<HTMLElement>(".starter-panel")?.getBoundingClientRect();
    const tabs = document.querySelector<HTMLElement>(".bottom-tabs")?.getBoundingClientRect();
    const roster = document.querySelector<HTMLElement>(".production-roster")?.getBoundingClientRect();
    const overflowingChildren = Array.from(
      document.querySelectorAll<HTMLElement>(".starter-panel > article, .starter-panel > .active-growth-copy")
    )
      .filter((element) => element.offsetParent !== null && element.scrollHeight > element.clientHeight + 1)
      .map((element) => ({
        className: element.className,
        clientHeight: element.clientHeight,
        scrollHeight: element.scrollHeight
      }));

    return {
      bodyScrollHeight: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
      innerHeight: window.innerHeight,
      playfield: playfield ? { height: playfield.height } : null,
      panel: panel ? { bottom: panel.bottom, clientHeight: document.querySelector<HTMLElement>(".starter-panel")?.clientHeight ?? 0, scrollHeight: document.querySelector<HTMLElement>(".starter-panel")?.scrollHeight ?? 0 } : null,
      tabs: tabs ? { top: tabs.top } : null,
      roster: roster ? { bottom: roster.bottom, height: roster.height } : null,
      overflowingChildren
    };
  });

  expect(metrics.bodyScrollHeight).toBeLessThanOrEqual(metrics.innerHeight + 2);
  expect(metrics.playfield).not.toBeNull();
  expect(metrics.panel).not.toBeNull();
  expect(metrics.tabs).not.toBeNull();
  expect(metrics.roster).not.toBeNull();
  expect(metrics.playfield!.height).toBeGreaterThan(220);
  expect(metrics.panel!.bottom).toBeLessThanOrEqual(metrics.tabs!.top - 4);
  expect(metrics.panel!.scrollHeight).toBeLessThanOrEqual(metrics.panel!.clientHeight + 1);
  expect(metrics.roster!.bottom).toBeLessThanOrEqual(metrics.tabs!.top - 4);
  expect(metrics.overflowingChildren).toEqual([]);

  await page.screenshot({ path: testInfo.outputPath("mobile-creature-production-roster-v0-393.png"), fullPage: false });
});

test("모바일 연구 원정 시작은 moon hint 원정을 진행 상태로 만든다", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto("/?qaResearchExpeditionReady=1&qaTab=expedition");

  await expect(page.locator(".dev-panel.player-panel.tab-expedition")).toBeVisible();
  await expect(page.getByRole("button", { name: /원정/ })).toContainText("준비");
  await expect(page.getByLabel("연구 완료 후 원정 단서").getByText("달빛 흔적 찾기", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "달빛 흔적 찾기 시작" })).toBeEnabled();
  await page.getByRole("button", { name: "달빛 흔적 찾기 시작" }).click();

  await expect(page.getByText("원정 진행 중", { exact: true })).toBeVisible();
  await expect(page.getByText("60분 남음 · 돌아오면 보상 수령", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "원정 원정 상태 진행" })).toContainText("진행");
  await expect
    .poll(async () =>
      page.evaluate(() => {
        const raw = window.localStorage.getItem("strange-seed-shop:phase0-save");
        const parsed = raw ? (JSON.parse(raw) as { activeExpedition?: { expeditionId?: string; creatureIds?: string[] } }) : {};
        return {
          expeditionId: parsed.activeExpedition?.expeditionId,
          creatureCount: parsed.activeExpedition?.creatureIds?.length ?? 0
        };
      })
    )
    .toEqual({ expeditionId: "moon_hint", creatureCount: 2 });

  await page.screenshot({ path: testInfo.outputPath("mobile-research-expedition-start-v0-393.png"), fullPage: false });
});

test("모바일 달빛 원정 보상은 다음 달빛 수집 목표로 이어진다", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto("/?qaResearchExpeditionClaimReady=1&qaTab=expedition");

  await expect(page.locator(".dev-panel.player-panel.tab-expedition")).toBeVisible();
  await expect(page.getByText("원정 완료", { exact: true })).toBeVisible();
  await expect(page.getByText("+420 잎 · +2 재료 수령 가능", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "원정 보상 받기" })).toBeEnabled();
  await page.getByRole("button", { name: "원정 보상 받기" }).click();

  await expect(page.getByLabel("달빛 원정 보상 다음 목표")).toBeVisible();
  await expect(page.getByLabel("달빛 원정 보상 다음 목표")).toContainText("달방울 씨앗");
  await expect(page.getByLabel("달빛 원정 보상 다음 목표")).toContainText("달방울 누누");
  await expect(page.getByRole("button", { name: "달방울 씨앗 보러가기" })).toBeEnabled();

  await expect
    .poll(async () =>
      page.evaluate(() => {
        const raw = window.localStorage.getItem("strange-seed-shop:phase0-save");
        const parsed = raw
          ? (JSON.parse(raw) as {
              activeExpedition?: unknown;
              leaves?: number;
              materials?: number;
              unlockedSeedIds?: string[];
            })
          : {};
        return {
          activeExpeditionCleared: parsed.activeExpedition === undefined,
          leaves: parsed.leaves,
          materials: parsed.materials,
          lunarUnlocked: parsed.unlockedSeedIds?.includes("seed_lunar_001") ?? false
        };
      })
    )
    .toEqual({ activeExpeditionCleared: true, leaves: 492, materials: 3, lunarUnlocked: true });

  await page.getByRole("button", { name: "달방울 씨앗 보러가기" }).click();
  await expect(page.locator(".dev-panel.player-panel.tab-seeds")).toBeVisible();
  await expect(page.getByLabel("다음 도감 목표 씨앗")).toContainText("달방울 씨앗");
  await expect(page.getByLabel("다음 도감 목표 씨앗")).toContainText("달방울 누누");

  await page.getByRole("button", { name: "도감" }).click();
  await expect(page.locator(".dev-panel.player-panel.tab-album")).toBeVisible();
  await expect(page.getByLabel("도감 다음 수집 목표")).toContainText("달방울 누누");
  await expect(page.getByLabel("도감 다음 수집 목표")).toContainText("달방울 씨앗");

  await page.screenshot({ path: testInfo.outputPath("mobile-moon-expedition-reward-bridge-v0-393.png"), fullPage: false });
});

test("모바일 원정 재료는 정원 작업대 강화로 이어진다", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto("/?qaResearchExpeditionClaimReady=1&qaTab=expedition");

  await expect(page.getByText("+420 잎 · +2 재료 수령 가능", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "원정 보상 받기" }).click();

  await page.getByRole("button", { name: "정원", exact: true }).click();
  await expect(page.getByText("재료 3", { exact: true })).toBeVisible();
  await expect(page.getByLabel("자동 생산과 첫 주문")).toContainText("분당 12.8 잎");
  const workbenchChoice = page.locator(".upgrade-choice", { hasText: "작업대 강화" });
  await expect(workbenchChoice).toContainText("재료 사용");
  await expect(workbenchChoice).toContainText("2 재료로 자동 생산 +15%");
  await expect(workbenchChoice.locator("small")).toBeVisible();
  await expect(workbenchChoice.locator("small")).toHaveText("2 재료로 자동 생산 +15%");
  await workbenchChoice.click();

  await expect(page.getByText("재료 1", { exact: true })).toBeVisible();
  await expect(workbenchChoice).toContainText("강화 완료");
  await expect(workbenchChoice).toContainText("재료 작업대 +15% 가동");
  await expect(workbenchChoice.locator("small")).toBeVisible();
  await expect(workbenchChoice.locator("small")).toHaveText("재료 작업대 +15% 가동");
  await expect(page.getByLabel("자동 생산과 첫 주문")).toContainText("분당 14.3 잎");
  await expect(page.getByLabel("정원 자동 생산 장면")).toContainText("정원 동료 2명 작업 중");

  const metrics = await page.evaluate(() => {
    const panelElement = document.querySelector<HTMLElement>(".starter-panel");
    const panel = panelElement?.getBoundingClientRect();
    const tabs = document.querySelector<HTMLElement>(".bottom-tabs")?.getBoundingClientRect();
    const upgradeCard = document.querySelector<HTMLElement>(".upgrade-choice-card")?.getBoundingClientRect();
    const overflowingChildren = Array.from(
      document.querySelectorAll<HTMLElement>(".starter-panel > article, .starter-panel > .active-growth-copy")
    )
      .filter((element) => element.offsetParent !== null && element.scrollHeight > element.clientHeight + 1)
      .map((element) => ({
        className: element.className,
        clientHeight: element.clientHeight,
        scrollHeight: element.scrollHeight
      }));

    return {
      bodyScrollHeight: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
      innerHeight: window.innerHeight,
      panel: panel
        ? {
            top: panel.top,
            bottom: panel.bottom,
            clientHeight: panelElement?.clientHeight ?? 0,
            scrollHeight: panelElement?.scrollHeight ?? 0
          }
        : null,
      tabs: tabs ? { top: tabs.top } : null,
      upgradeCard: upgradeCard ? { bottom: upgradeCard.bottom } : null,
      overflowingChildren
    };
  });

  expect(metrics.bodyScrollHeight).toBeLessThanOrEqual(metrics.innerHeight + 2);
  expect(metrics.panel).not.toBeNull();
  expect(metrics.tabs).not.toBeNull();
  expect(metrics.upgradeCard).not.toBeNull();
  expect(metrics.panel!.bottom).toBeLessThanOrEqual(metrics.tabs!.top - 4);
  expect(metrics.panel!.scrollHeight).toBeLessThanOrEqual(metrics.panel!.clientHeight + 1);
  expect(metrics.upgradeCard!.bottom).toBeLessThanOrEqual(metrics.tabs!.top - 4);
  expect(metrics.overflowingChildren).toEqual([]);

  await expect
    .poll(async () =>
      page.evaluate(() => {
        const raw = window.localStorage.getItem("strange-seed-shop:phase0-save");
        const parsed = raw
          ? (JSON.parse(raw) as {
              materials?: number;
              materialWorkbenchLevel?: number;
            })
          : {};
        return {
          materials: parsed.materials,
          materialWorkbenchLevel: parsed.materialWorkbenchLevel
        };
      })
    )
    .toEqual({ materials: 1, materialWorkbenchLevel: 1 });

  await page.screenshot({ path: testInfo.outputPath("mobile-expedition-material-workbench-v0-393.png"), fullPage: false });
});

test("모바일 작업대 강화는 첫 온실 설비 목표로 이어진다", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto("/?qaResearchExpeditionClaimReady=1&qaTab=expedition");

  await page.getByRole("button", { name: "원정 보상 받기" }).click();
  await page.getByRole("button", { name: "정원", exact: true }).click();

  const workbenchChoice = page.locator(".upgrade-choice", { hasText: "작업대 강화" });
  await workbenchChoice.click();

  const facilityChoice = page.locator(".upgrade-choice", { hasText: "온실 설비" });
  await expect(facilityChoice).toContainText("설비 준비");
  await expect(facilityChoice).toContainText("80 잎 · 1 재료로 선반 설치");
  await expect(facilityChoice.locator("small")).toBeVisible();
  await facilityChoice.click();

  await expect(page.getByText("재료 0", { exact: true })).toBeVisible();
  await expect(facilityChoice).toContainText("설비 완료");
  await expect(facilityChoice).toContainText("온실 선반 +10% 가동");
  await expect(page.getByLabel("자동 생산과 첫 주문")).toContainText("분당 15.3 잎");

  const metrics = await page.evaluate(() => {
    const panelElement = document.querySelector<HTMLElement>(".starter-panel");
    const panel = panelElement?.getBoundingClientRect();
    const tabs = document.querySelector<HTMLElement>(".bottom-tabs")?.getBoundingClientRect();
    const upgradeCard = document.querySelector<HTMLElement>(".upgrade-choice-card")?.getBoundingClientRect();
    const overflowingChildren = Array.from(
      document.querySelectorAll<HTMLElement>(".starter-panel > article, .starter-panel > .active-growth-copy")
    )
      .filter((element) => element.offsetParent !== null && element.scrollHeight > element.clientHeight + 1)
      .map((element) => ({
        className: element.className,
        clientHeight: element.clientHeight,
        scrollHeight: element.scrollHeight
      }));

    return {
      bodyScrollHeight: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
      innerHeight: window.innerHeight,
      panel: panel
        ? {
            top: panel.top,
            bottom: panel.bottom,
            clientHeight: panelElement?.clientHeight ?? 0,
            scrollHeight: panelElement?.scrollHeight ?? 0
          }
        : null,
      tabs: tabs ? { top: tabs.top } : null,
      upgradeCard: upgradeCard ? { bottom: upgradeCard.bottom } : null,
      overflowingChildren
    };
  });

  expect(metrics.bodyScrollHeight).toBeLessThanOrEqual(metrics.innerHeight + 2);
  expect(metrics.panel).not.toBeNull();
  expect(metrics.tabs).not.toBeNull();
  expect(metrics.upgradeCard).not.toBeNull();
  expect(metrics.panel!.bottom).toBeLessThanOrEqual(metrics.tabs!.top - 4);
  expect(metrics.panel!.scrollHeight).toBeLessThanOrEqual(metrics.panel!.clientHeight + 1);
  expect(metrics.upgradeCard!.bottom).toBeLessThanOrEqual(metrics.tabs!.top - 4);
  expect(metrics.overflowingChildren).toEqual([]);

  await expect
    .poll(async () =>
      page.evaluate(() => {
        const raw = window.localStorage.getItem("strange-seed-shop:phase0-save");
        const parsed = raw
          ? (JSON.parse(raw) as {
              materials?: number;
              materialWorkbenchLevel?: number;
              greenhouseFacilityLevel?: number;
            })
          : {};
        return {
          materials: parsed.materials,
          materialWorkbenchLevel: parsed.materialWorkbenchLevel,
          greenhouseFacilityLevel: parsed.greenhouseFacilityLevel
        };
      })
    )
    .toEqual({ materials: 0, materialWorkbenchLevel: 1, greenhouseFacilityLevel: 1 });

  await page.screenshot({ path: testInfo.outputPath("mobile-greenhouse-facility-unlock-v0-393.png"), fullPage: false });
});

test("모바일 온실 설비는 새 납품 주문으로 이어진다", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto("/?qaResearchExpeditionClaimReady=1&qaTab=expedition");

  await page.getByRole("button", { name: "원정 보상 받기" }).click();
  await page.getByRole("button", { name: "정원", exact: true }).click();
  await page.locator(".upgrade-choice", { hasText: "작업대 강화" }).click();
  await page.locator(".upgrade-choice", { hasText: "온실 설비" }).click();

  await expect(page.getByLabel("자동 생산과 첫 주문")).toContainText("온실 선반 납품");
  await expect(page.getByLabel("자동 생산과 첫 주문")).toContainText("0/36 잎 납품 준비");
  await expect(page.getByRole("button", { name: "주문 납품 +42 잎 · +2 꽃가루 · +1 재료" })).toBeDisabled();

  await page.getByRole("button", { name: "생산 잎 수령" }).click();
  await expect(page.getByLabel("자동 생산과 첫 주문")).toContainText("36/36 잎 납품 준비");
  await expect(page.getByRole("button", { name: "주문 납품 +42 잎 · +2 꽃가루 · +1 재료" })).toBeEnabled();
  await page.getByRole("button", { name: "주문 납품 +42 잎 · +2 꽃가루 · +1 재료" }).click();

  await expect(page.getByText("재료 1", { exact: true })).toBeVisible();
  await expect(page.getByLabel("온실 선반 납품 납품 완료")).toContainText("+42 잎 · +2 꽃가루 · +1 재료");
  await expect(page.getByLabel("자동 생산과 첫 주문")).toContainText("온실 선반 납품 완료");

  const metrics = await page.evaluate(() => {
    const panelElement = document.querySelector<HTMLElement>(".starter-panel");
    const panel = panelElement?.getBoundingClientRect();
    const tabs = document.querySelector<HTMLElement>(".bottom-tabs")?.getBoundingClientRect();
    const productionCard = document.querySelector<HTMLElement>(".production-action-card");
    const productionCardRect = productionCard?.getBoundingClientRect();
    const overflowingChildren = Array.from(
      document.querySelectorAll<HTMLElement>(".starter-panel > article, .starter-panel > .active-growth-copy")
    )
      .filter((element) => element.offsetParent !== null && element.scrollHeight > element.clientHeight + 1)
      .map((element) => ({
        className: element.className,
        clientHeight: element.clientHeight,
        scrollHeight: element.scrollHeight
      }));

    return {
      bodyScrollHeight: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
      innerHeight: window.innerHeight,
      panel: panel ? { bottom: panel.bottom, clientHeight: panelElement?.clientHeight ?? 0, scrollHeight: panelElement?.scrollHeight ?? 0 } : null,
      tabs: tabs ? { top: tabs.top } : null,
      productionCard: productionCardRect
        ? {
            bottom: productionCardRect.bottom,
            clientHeight: productionCard?.clientHeight ?? 0,
            scrollHeight: productionCard?.scrollHeight ?? 0
          }
        : null,
      overflowingChildren
    };
  });

  expect(metrics.bodyScrollHeight).toBeLessThanOrEqual(metrics.innerHeight + 2);
  expect(metrics.panel).not.toBeNull();
  expect(metrics.tabs).not.toBeNull();
  expect(metrics.productionCard).not.toBeNull();
  expect(metrics.panel!.bottom).toBeLessThanOrEqual(metrics.tabs!.top - 4);
  expect(metrics.panel!.scrollHeight).toBeLessThanOrEqual(metrics.panel!.clientHeight + 1);
  expect(metrics.productionCard!.bottom).toBeLessThanOrEqual(metrics.tabs!.top - 4);
  expect(metrics.productionCard!.scrollHeight).toBeLessThanOrEqual(metrics.productionCard!.clientHeight + 1);
  expect(metrics.overflowingChildren).toEqual([]);

  await expect
    .poll(async () =>
      page.evaluate(() => {
        const raw = window.localStorage.getItem("strange-seed-shop:phase0-save");
        const parsed = raw
          ? (JSON.parse(raw) as {
              materials?: number;
              greenhouseFacilityLevel?: number;
              idleProduction?: { completedOrderIds?: string[] };
            })
          : {};
        return {
          materials: parsed.materials,
          greenhouseFacilityLevel: parsed.greenhouseFacilityLevel,
          completedThirdOrder: parsed.idleProduction?.completedOrderIds?.includes("order_greenhouse_shelf_001") ?? false
        };
      })
    )
    .toEqual({ materials: 1, greenhouseFacilityLevel: 1, completedThirdOrder: true });

  await page.screenshot({ path: testInfo.outputPath("mobile-greenhouse-facility-order-v0-393.png"), fullPage: false });
});

test("모바일 달빛 씨앗은 구매와 심기로 다음 수집 행동을 닫는다", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto("/?qaLunarSeedReady=1&qaTab=seeds");

  await expect(page.locator(".dev-panel.player-panel.tab-seeds")).toBeVisible();
  await expect(page.getByLabel("다음 도감 목표 씨앗")).toContainText("달방울 씨앗");
  await expect(page.getByLabel("다음 도감 목표 씨앗")).toContainText("달방울 누누");

  const lunarRow = page.locator(".seed-inventory-row", { hasText: "달방울 씨앗" }).first();
  await expect(lunarRow).toContainText("다음 발견");
  await expect(lunarRow).toContainText("구매 가능");
  await lunarRow.getByRole("button", { name: "구매 300" }).click();
  await expect(lunarRow).toContainText("보유 1개");
  await expect(lunarRow).toContainText("열린 밭에 바로 심을 수 있어요");

  await expect
    .poll(async () =>
      page.evaluate(() => {
        const raw = window.localStorage.getItem("strange-seed-shop:phase0-save");
        const parsed = raw ? (JSON.parse(raw) as { leaves?: number; seedInventory?: Record<string, number> }) : {};
        return {
          leaves: parsed.leaves,
          lunarSeeds: parsed.seedInventory?.seed_lunar_001 ?? 0
        };
      })
    )
    .toEqual({ leaves: 192, lunarSeeds: 1 });

  await lunarRow.getByRole("button", { name: "심기" }).click();
  await expect
    .poll(async () =>
      page.evaluate(() => {
        const raw = window.localStorage.getItem("strange-seed-shop:phase0-save");
        const parsed = raw
          ? (JSON.parse(raw) as { seedInventory?: Record<string, number>; plots?: Array<{ seedId?: string }> })
          : {};
        return {
          lunarSeeds: parsed.seedInventory?.seed_lunar_001 ?? 0,
          planted: parsed.plots?.some((plot) => plot.seedId === "seed_lunar_001") ?? false
        };
      })
    )
    .toEqual({ lunarSeeds: 0, planted: true });

  await page.getByRole("button", { name: "정원 보기" }).click();
  await expect(page.getByRole("button", { name: /달방울 씨앗 성장시키기/ })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("mobile-lunar-seed-purchase-plant-v0-393.png"), fullPage: false });
});

test("모바일 달빛 씨앗 수확은 달방울 누누 발견과 다음 목표 전환을 보여준다", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto("/?qaLunarSeedReadyToHarvest=1&qaFxTelemetry=1");

  await expect(page.getByRole("button", { name: /달방울 씨앗 수확/ })).toBeVisible();
  await page.getByRole("button", { name: /달방울 씨앗 수확/ }).click();
  await page.waitForFunction(() => {
    const events = (window as unknown as { __gardenPlayfieldFxEvents?: Array<{ action: string; source: string }> }).__gardenPlayfieldFxEvents ?? [];
    return events.some((event) => event.action === "harvest_plot" && event.source === "spritesheet");
  });

  await expect(page.getByLabel("첫 생명체 획득")).toContainText("달방울 누누");
  await expect(page.getByLabel("달빛 수집 완료")).toContainText("원정 보상이 실제 새 생명체 수집으로 이어졌어요");
  await expect(page.getByLabel("수확 후 다음 목표")).not.toContainText("달방울 누누");
  await expect(page.getByLabel("수확 후 다음 목표")).toContainText("젤리콩 통통");

  await expect
    .poll(async () =>
      page.evaluate(() => {
        const raw = window.localStorage.getItem("strange-seed-shop:phase0-save");
        const parsed = raw ? (JSON.parse(raw) as { leaves?: number; discoveredCreatureIds?: string[] }) : {};
        return {
          leaves: parsed.leaves,
          lunarDiscovered: parsed.discoveredCreatureIds?.includes("creature_lunar_common_001") ?? false
        };
      })
    )
    .toEqual({ leaves: 452, lunarDiscovered: true });

  await page.getByRole("button", { name: "도감에 기록하기" }).click();
  await expect(page.locator(".production-asset-lunar-work img")).toBeVisible();
  await expect(page.locator(".playfield-production-actor.is-lunar-actor img")).toBeVisible();
  await expect(page.locator(".production-roster")).toContainText("달방울 누누");
  await page.getByRole("button", { name: "도감" }).click();
  await expect(page.getByLabel("도감 다음 수집 목표")).not.toContainText("달방울 누누");
  await expect(page.getByLabel("도감 다음 수집 목표")).toContainText("젤리콩 통통");

  await page.screenshot({ path: testInfo.outputPath("mobile-lunar-seed-harvest-bridge-v0-393.png"), fullPage: false });
});

test("모바일 정원 첫 화면은 달방울 누누 creature stage로 읽힌다", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto("/?qaLunarOrderReady=1");

  await expect(page.getByLabel("대표 생명체 무대")).toContainText("달방울 누누");
  await expect(page.getByRole("button", { name: "돌보기" })).toBeVisible();
  await expect(page.locator(".creature-stage-clue-trail")).toHaveCSS("opacity", "0");

  const metrics = await page.evaluate(() => {
    const stage = document.querySelector<HTMLElement>(".garden-stage")?.getBoundingClientRect();
    const focus = document.querySelector<HTMLElement>(".creature-stage-focus")?.getBoundingClientRect();
    const portrait = document.querySelector<HTMLElement>(".creature-stage-portrait")?.getBoundingClientRect();
    const clue = document.querySelector<HTMLElement>(".creature-stage-clue-trail")?.getBoundingClientRect();
    const panel = document.querySelector<HTMLElement>(".starter-panel")?.getBoundingClientRect();
    const tabs = document.querySelector<HTMLElement>(".bottom-tabs")?.getBoundingClientRect();
    const topBar = document.querySelector<HTMLElement>(".top-bar")?.getBoundingClientRect();
    return {
      innerHeight: window.innerHeight,
      bodyScrollHeight: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
      stage: stage ? { height: stage.height } : null,
      focus: focus ? { top: focus.top, bottom: focus.bottom, height: focus.height } : null,
      portrait: portrait ? { top: portrait.top, bottom: portrait.bottom, width: portrait.width, height: portrait.height } : null,
      clue: clue ? { top: clue.top, bottom: clue.bottom } : null,
      panel: panel ? { top: panel.top, bottom: panel.bottom } : null,
      tabs: tabs ? { top: tabs.top } : null,
      topBar: topBar ? { bottom: topBar.bottom } : null
    };
  });

  expect(metrics.bodyScrollHeight).toBeLessThanOrEqual(metrics.innerHeight + 2);
  expect(metrics.stage).not.toBeNull();
  expect(metrics.focus).not.toBeNull();
  expect(metrics.portrait).not.toBeNull();
  expect(metrics.clue).not.toBeNull();
  expect(metrics.panel).not.toBeNull();
  expect(metrics.tabs).not.toBeNull();
  expect(metrics.topBar).not.toBeNull();
  expect(metrics.portrait!.height).toBeGreaterThanOrEqual(metrics.innerHeight * 0.22);
  expect(metrics.focus!.bottom).toBeLessThanOrEqual(metrics.panel!.top + 2);
  expect(metrics.panel!.bottom).toBeLessThanOrEqual(metrics.tabs!.top - 4);
  expect(metrics.portrait!.top).toBeGreaterThanOrEqual(metrics.topBar!.bottom - 24);
  expect(metrics.clue!.bottom).toBeLessThanOrEqual(metrics.focus!.bottom + 4);

  await page.getByRole("button", { name: "돌보기" }).click();
  await expect(page.getByLabel("대표 생명체 무대")).toContainText("반짝이는 흔적");
  await expect(page.locator(".creature-stage-clue-trail")).toHaveCSS("opacity", "1");
  await expect(page.getByRole("button", { name: "젤리콩 통통 발자국 단서 따라가기" })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("mobile-creature-stage-first-screen-393.png"), fullPage: false });
});

test("모바일 달방울 누누 돌보기는 기억 도장 care reward로 저장된다", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto("/?qaLunarOrderReady=1&qaReset=1");

  await expect(page.getByLabel("대표 생명체 무대")).toContainText("달방울 누누");
  await page.getByRole("button", { name: "돌보기" }).click();

  await expect(page.getByLabel("대표 생명체 무대")).toContainText("반짝이는 흔적");
  await expect(page.getByLabel("달빛 돌보기 기억 보상")).toBeVisible();
  await expect(page.getByLabel("달빛 돌보기 기억 보상")).toContainText("누누 돌봄 도장");
  await expect(page.getByLabel("달빛 돌보기 기억 보상")).toContainText("+18 잎 기억 보상");
  await expect(page.getByRole("button", { name: "도감 기록 보기" })).toBeVisible();

  await expect
    .poll(async () =>
      page.evaluate(() => {
        const raw = window.localStorage.getItem("strange-seed-shop:phase0-save");
        const parsed = raw
          ? (JSON.parse(raw) as { leaves?: number; claimedCareMemoryIds?: string[] })
          : { leaves: 0, claimedCareMemoryIds: [] };
        return {
          leaves: parsed.leaves ?? 0,
          claimed: parsed.claimedCareMemoryIds?.includes("care_lunar_nunu_001") ?? false
        };
      })
    )
    .toEqual({ leaves: 262, claimed: true });

  const metrics = await page.evaluate(() => {
    const focus = document.querySelector<HTMLElement>(".creature-stage-focus")?.getBoundingClientRect();
    const reward = document.querySelector<HTMLElement>(".creature-care-reward")?.getBoundingClientRect();
    const panel = document.querySelector<HTMLElement>(".starter-panel")?.getBoundingClientRect();
    const tabs = document.querySelector<HTMLElement>(".bottom-tabs")?.getBoundingClientRect();
    const bodyScrollHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    return {
      innerHeight: window.innerHeight,
      bodyScrollHeight,
      focus: focus ? { bottom: focus.bottom } : null,
      reward: reward ? { top: reward.top, bottom: reward.bottom } : null,
      panel: panel ? { top: panel.top, bottom: panel.bottom } : null,
      tabs: tabs ? { top: tabs.top } : null
    };
  });

  expect(metrics.bodyScrollHeight).toBeLessThanOrEqual(metrics.innerHeight + 2);
  expect(metrics.focus).not.toBeNull();
  expect(metrics.reward).not.toBeNull();
  expect(metrics.panel).not.toBeNull();
  expect(metrics.tabs).not.toBeNull();
  expect(metrics.reward!.bottom).toBeLessThanOrEqual(metrics.focus!.bottom + 4);
  expect(metrics.panel!.bottom).toBeLessThanOrEqual(metrics.tabs!.top - 4);

  await page.screenshot({ path: testInfo.outputPath("mobile-lunar-care-memory-reward-393.png"), fullPage: false });

  await page.getByRole("button", { name: "도감 기록 보기" }).click();
  await expect(page.locator(".dev-panel.player-panel.tab-album")).toBeVisible();
  await expect(page.locator(".album-care-stamp")).toContainText("누누 돌봄 도장");
  await expect(page.locator('[aria-label="도감 돌봄 기억 도장"]')).toContainText("누누 돌봄 도장 · +18 잎 기억");

  const leavesAfterAlbumOpen = await page.evaluate(() => {
    const raw = window.localStorage.getItem("strange-seed-shop:phase0-save");
    return raw ? (JSON.parse(raw) as { leaves?: number }).leaves : 0;
  });
  await page.getByRole("button", { name: "정원 보기" }).click();
  await page.getByRole("button", { name: "도감 기록 보기" }).click();
  const leavesAfterSecondClick = await page.evaluate(() => {
    const raw = window.localStorage.getItem("strange-seed-shop:phase0-save");
    return raw ? (JSON.parse(raw) as { leaves?: number }).leaves : 0;
  });
  expect(leavesAfterSecondClick).toBe(leavesAfterAlbumOpen);

  await page.screenshot({ path: testInfo.outputPath("mobile-lunar-care-album-stamp-393.png"), fullPage: false });
});

test("모바일 달빛 보호 주문 완료는 다음 행동 카드 안에서 잘리지 않는다", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto("/?qaLunarOrderReady=1&qaFxTelemetry=1");

  await expect(page.getByLabel("정원 자동 생산 장면")).toContainText("달빛 보호 주문");
  await expect(page.getByLabel("자동 생산과 첫 주문")).toContainText("달빛 보호 주문");
  await page.getByRole("button", { name: /달빛 보호 주문 납품 \+88 잎 · \+3 꽃가루 · \+1 재료/ }).click();

  await expect(page.getByLabel("자동 생산과 첫 주문")).toContainText("달빛 보호 주문 완료");
  await expect(page.getByLabel("자동 생산과 첫 주문")).toContainText("누누 야간 근무");
  await expect(page.getByLabel("자동 생산과 첫 주문")).toContainText("달빛 보상 재료 +1");
  await expect(page.locator(".lunar-guardian-payoff")).toBeVisible();
  await expect(page.locator(".playfield-order-crate.order-variant-lunar-guardian")).toBeVisible();

  const metrics = await page.evaluate(() => {
    const panelElement = document.querySelector<HTMLElement>(".starter-panel");
    const panel = panelElement?.getBoundingClientRect();
    const tabs = document.querySelector<HTMLElement>(".bottom-tabs")?.getBoundingClientRect();
    const productionCard = document.querySelector<HTMLElement>(".production-action-card");
    const productionCardRect = productionCard?.getBoundingClientRect();
    const completeRowElement = document.querySelector<HTMLElement>(".lunar-guardian-complete-row");
    const completeRow = completeRowElement?.getBoundingClientRect();
    const title = document
      .querySelector<HTMLElement>(".lunar-guardian-complete-row .production-complete-copy > span")
      ?.getBoundingClientRect();
    const hiddenRewardLine = document.querySelector<HTMLElement>(
      ".lunar-guardian-complete-row .production-complete-copy > strong"
    );
    const payoffElement = document.querySelector<HTMLElement>(".lunar-guardian-payoff");
    const payoff = payoffElement?.getBoundingClientRect();
    const overflowingChildren = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".starter-panel > article, .starter-panel > .active-growth-copy, .lunar-guardian-complete-row, .lunar-guardian-payoff"
      )
    )
      .filter((element) => element.offsetParent !== null && element.scrollHeight > element.clientHeight + 1)
      .map((element) => ({
        className: element.className,
        clientHeight: element.clientHeight,
        scrollHeight: element.scrollHeight
      }));

    return {
      bodyScrollHeight: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
      innerHeight: window.innerHeight,
      panel: panel
        ? {
            bottom: panel.bottom,
            clientHeight: panelElement?.clientHeight ?? 0,
            scrollHeight: panelElement?.scrollHeight ?? 0
          }
        : null,
      tabs: tabs ? { top: tabs.top } : null,
      productionCard: productionCardRect
        ? {
            bottom: productionCardRect.bottom,
            clientHeight: productionCard?.clientHeight ?? 0,
            scrollHeight: productionCard?.scrollHeight ?? 0
          }
        : null,
      completeRow: completeRow
        ? {
            bottom: completeRow.bottom,
            height: completeRow.height,
            overflow: completeRowElement ? getComputedStyle(completeRowElement).overflow : ""
          }
        : null,
      title: title ? { top: title.top, bottom: title.bottom, height: title.height } : null,
      hiddenRewardLineDisplay: hiddenRewardLine ? getComputedStyle(hiddenRewardLine).display : "",
      payoff: payoff
        ? {
            top: payoff.top,
            bottom: payoff.bottom,
            height: payoff.height,
            overflow: payoffElement ? getComputedStyle(payoffElement).overflow : ""
          }
        : null,
      overflowingChildren
    };
  });

  expect(metrics.bodyScrollHeight).toBeLessThanOrEqual(metrics.innerHeight + 2);
  expect(metrics.panel).not.toBeNull();
  expect(metrics.tabs).not.toBeNull();
  expect(metrics.productionCard).not.toBeNull();
  expect(metrics.completeRow).not.toBeNull();
  expect(metrics.title).not.toBeNull();
  expect(metrics.payoff).not.toBeNull();
  expect(metrics.panel!.bottom).toBeLessThanOrEqual(metrics.tabs!.top - 4);
  expect(metrics.panel!.scrollHeight).toBeLessThanOrEqual(metrics.panel!.clientHeight + 1);
  expect(metrics.productionCard!.scrollHeight).toBeLessThanOrEqual(metrics.productionCard!.clientHeight + 1);
  expect(metrics.completeRow!.bottom).toBeLessThanOrEqual(metrics.productionCard!.bottom - 2);
  expect(metrics.completeRow!.overflow).toBe("visible");
  expect(metrics.hiddenRewardLineDisplay).toBe("none");
  expect(metrics.title!.bottom).toBeLessThanOrEqual(metrics.payoff!.top - 2);
  expect(metrics.payoff!.bottom).toBeLessThanOrEqual(metrics.productionCard!.bottom - 2);
  expect(metrics.overflowingChildren).toEqual([]);

  await page.screenshot({ path: testInfo.outputPath("mobile-lunar-guardian-order-complete-no-clipping-393.png"), fullPage: false });
});

test("모바일 복귀 보상은 달빛 오프라인 수호 보너스를 breakdown으로 보여준다", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto("/?qaOfflineMinutes=60&qaReset=1");

  await expect(page.getByText("자리를 비운 동안 잎 50개를 모았습니다.", { exact: true })).toBeVisible();
  await expect(page.getByLabel("오프라인 복귀 보상")).toContainText("1시간");
  await expect(page.getByLabel("오프라인 복귀 보상")).toContainText("50 잎");
  await expect
    .poll(async () =>
      page.evaluate(() => {
        const raw = window.localStorage.getItem("strange-seed-shop:phase0-save");
        const parsed = raw ? (JSON.parse(raw) as { leaves?: number }) : {};
        return parsed.leaves;
      })
    )
    .toBe(60);

  await page.goto("/?qaOfflineMinutes=60&qaLunarGuardian=1&qaReset=1");
  await expect(page.getByText(/달방울 누누가 달빛 보상 \+20%를 지켜줬어요/)).toBeVisible();
  await expect(page.getByText("자리를 비운 동안 잎 90개를 모았습니다.", { exact: false })).toBeVisible();
  await expect(page.getByLabel("오프라인 복귀 보상")).toContainText("1시간");
  await expect(page.getByLabel("오프라인 복귀 보상")).toContainText("90 잎");
  await expect(page.getByLabel("달빛 수호자 보너스")).toContainText("달방울 누누");
  await expect(page.getByLabel("달빛 수호자 보너스")).toContainText("+20%");
  await expect(page.getByRole("button", { name: "방울새싹 씨앗 보러가기" })).toBeVisible();
  await expect
    .poll(async () =>
      page.evaluate(() => {
        const raw = window.localStorage.getItem("strange-seed-shop:phase0-save");
        const parsed = raw
          ? (JSON.parse(raw) as { leaves?: number; discoveredCreatureIds?: string[] })
          : {};
        return {
          leaves: parsed.leaves,
          lunarGuardian: parsed.discoveredCreatureIds?.includes("creature_lunar_common_001") ?? false
        };
      })
    )
    .toEqual({ leaves: 100, lunarGuardian: true });

  await page.screenshot({ path: testInfo.outputPath("mobile-comeback-reward-breakdown-v0-393.png"), fullPage: false });
  await page.getByRole("button", { name: "보상 확인" }).click();
  await expect(page.getByLabel("오프라인 복귀 보상")).toHaveCount(0);
  await expect(page.locator(".garden-playfield-host")).toBeVisible();
});

test("모바일 복귀 보상은 온실 선반 보관 보너스를 함께 보여준다", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto("/?qaOfflineMinutes=60&qaLunarGuardian=1&qaGreenhouseShelf=1&qaReset=1");

  await expect(page.getByText(/달방울 누누가 달빛 보상 \+20%를 지켜줬어요/)).toBeVisible();
  await expect(page.getByText(/온실 선반 보관이 보관 보상 \+10%를 더했어요/)).toBeVisible();
  await expect(page.getByText("자리를 비운 동안 잎 98개를 모았습니다.", { exact: false })).toBeVisible();
  await expect(page.getByLabel("오프라인 복귀 보상")).toContainText("1시간");
  await expect(page.getByLabel("오프라인 복귀 보상")).toContainText("98 잎");
  await expect(page.getByLabel("달빛 수호자 보너스")).toContainText("+20%");
  await expect(page.getByLabel("온실 선반 보관 보너스")).toContainText("온실 선반 보관");
  await expect(page.getByLabel("온실 선반 보관 보너스")).toContainText("+10%");
  await expect(page.getByRole("button", { name: "방울새싹 씨앗 보러가기" })).toBeVisible();

  const metrics = await page.evaluate(() => {
    const cardElement = document.querySelector<HTMLElement>(".comeback-reward-card");
    const card = cardElement?.getBoundingClientRect();
    return {
      bodyScrollHeight: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
      innerHeight: window.innerHeight,
      card: card
        ? {
            bottom: card.bottom,
            clientHeight: cardElement?.clientHeight ?? 0,
            scrollHeight: cardElement?.scrollHeight ?? 0
          }
        : null
    };
  });

  expect(metrics.bodyScrollHeight).toBeLessThanOrEqual(metrics.innerHeight + 2);
  expect(metrics.card).not.toBeNull();
  expect(metrics.card!.bottom).toBeLessThanOrEqual(metrics.innerHeight - 14);
  expect(metrics.card!.scrollHeight).toBeLessThanOrEqual(metrics.card!.clientHeight + 1);
  await expect
    .poll(async () =>
      page.evaluate(() => {
        const raw = window.localStorage.getItem("strange-seed-shop:phase0-save");
        const parsed = raw
          ? (JSON.parse(raw) as { leaves?: number; idleProduction?: { completedOrderIds?: string[] } })
          : {};
        return {
          leaves: parsed.leaves,
          greenhouseShelfDone: parsed.idleProduction?.completedOrderIds?.includes("order_greenhouse_shelf_001") ?? false
        };
      })
    )
    .toEqual({ leaves: 108, greenhouseShelfDone: true });

  await page.screenshot({ path: testInfo.outputPath("mobile-comeback-greenhouse-shelf-offline-v0-393.png"), fullPage: false });
});

test("모바일 복귀 후 온실 선반 보관 상태는 정원 playfield에 남는다", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto("/?qaOfflineMinutes=60&qaLunarGuardian=1&qaGreenhouseShelf=1&qaReset=1");

  await expect(page.getByLabel("오프라인 복귀 보상")).toContainText("온실 선반 보관");
  await page.getByRole("button", { name: "보상 확인" }).click();
  await expect(page.getByLabel("오프라인 복귀 보상")).toHaveCount(0);
  await expect(page.getByLabel("정원 자동 생산 장면")).toContainText("온실 선반 납품 완료");
  await expect(page.getByLabel("정원 자동 생산 장면")).toContainText("선반 보관 +10%");

  const metrics = await page.evaluate(() => {
    const panelElement = document.querySelector<HTMLElement>(".starter-panel");
    const panel = panelElement?.getBoundingClientRect();
    const playfield = document.querySelector<HTMLElement>(".garden-playfield-host")?.getBoundingClientRect();
    const tabs = document.querySelector<HTMLElement>(".bottom-tabs")?.getBoundingClientRect();
    const productionLane = document.querySelector<HTMLElement>(".playfield-production-lane");
    const productionLaneRect = productionLane?.getBoundingClientRect();
    return {
      bodyScrollHeight: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
      innerHeight: window.innerHeight,
      panel: panel ? { bottom: panel.bottom, clientHeight: panelElement?.clientHeight ?? 0, scrollHeight: panelElement?.scrollHeight ?? 0 } : null,
      playfield: playfield ? { bottom: playfield.bottom } : null,
      tabs: tabs ? { top: tabs.top } : null,
      productionLane: productionLaneRect
        ? {
            bottom: productionLaneRect.bottom,
            clientHeight: productionLane?.clientHeight ?? 0,
            scrollHeight: productionLane?.scrollHeight ?? 0
          }
        : null
    };
  });

  expect(metrics.bodyScrollHeight).toBeLessThanOrEqual(metrics.innerHeight + 2);
  expect(metrics.panel).not.toBeNull();
  expect(metrics.playfield).not.toBeNull();
  expect(metrics.tabs).not.toBeNull();
  expect(metrics.productionLane).not.toBeNull();
  expect(metrics.playfield!.bottom).toBeLessThanOrEqual(metrics.panel!.bottom);
  expect(metrics.panel!.bottom).toBeLessThanOrEqual(metrics.tabs!.top - 4);
  expect(metrics.panel!.scrollHeight).toBeLessThanOrEqual(metrics.panel!.clientHeight + 1);
  expect(metrics.productionLane!.scrollHeight).toBeLessThanOrEqual(metrics.productionLane!.clientHeight + 1);

  await page.screenshot({ path: testInfo.outputPath("mobile-greenhouse-shelf-playfield-state-v0-393.png"), fullPage: false });
});

test("모바일 온실 선반 정리 강화는 보관 보너스를 키운다", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto("/?qaOfflineMinutes=60&qaLunarGuardian=1&qaGreenhouseShelf=1&qaReset=1");

  await page.getByRole("button", { name: "보상 확인" }).click();
  const storageChoice = page.locator(".upgrade-choice", { hasText: "선반 정리" });
  await expect(storageChoice).toContainText("정리 가능");
  await expect(storageChoice).toContainText("1 재료로 보관 보너스 +20%");
  await storageChoice.click();

  await expect(page.getByText("재료 0", { exact: true })).toBeVisible();
  await expect(page.getByLabel("정원 자동 생산 장면")).toContainText("선반 보관 +20%");
  await expect(storageChoice).toContainText("정리 완료");
  await expect(storageChoice).toContainText("보관 보너스 +20% 가동");

  const metrics = await page.evaluate(() => {
    const panelElement = document.querySelector<HTMLElement>(".starter-panel");
    const panel = panelElement?.getBoundingClientRect();
    const tabs = document.querySelector<HTMLElement>(".bottom-tabs")?.getBoundingClientRect();
    const storageCard = document.querySelector<HTMLElement>(".upgrade-choice-greenhouse_storage")?.getBoundingClientRect();
    return {
      bodyScrollHeight: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
      innerHeight: window.innerHeight,
      panel: panel ? { bottom: panel.bottom, clientHeight: panelElement?.clientHeight ?? 0, scrollHeight: panelElement?.scrollHeight ?? 0 } : null,
      tabs: tabs ? { top: tabs.top } : null,
      storageCard: storageCard ? { bottom: storageCard.bottom } : null
    };
  });

  expect(metrics.bodyScrollHeight).toBeLessThanOrEqual(metrics.innerHeight + 2);
  expect(metrics.panel).not.toBeNull();
  expect(metrics.tabs).not.toBeNull();
  expect(metrics.storageCard).not.toBeNull();
  expect(metrics.panel!.bottom).toBeLessThanOrEqual(metrics.tabs!.top - 4);
  expect(metrics.panel!.scrollHeight).toBeLessThanOrEqual(metrics.panel!.clientHeight + 1);
  expect(metrics.storageCard!.bottom).toBeLessThanOrEqual(metrics.tabs!.top - 4);
  await expect
    .poll(async () =>
      page.evaluate(() => {
        const raw = window.localStorage.getItem("strange-seed-shop:phase0-save");
        const parsed = raw ? (JSON.parse(raw) as { materials?: number; greenhouseStorageLevel?: number }) : {};
        return {
          materials: parsed.materials,
          greenhouseStorageLevel: parsed.greenhouseStorageLevel
        };
      })
    )
    .toEqual({ materials: 0, greenhouseStorageLevel: 1 });

  await page.goto("/?qaOfflineMinutes=60&qaLunarGuardian=1&qaGreenhouseShelf=1&qaGreenhouseStorage=1&qaReset=1");
  await expect(page.getByText(/온실 선반 보관이 보관 보상 \+20%를 더했어요/)).toBeVisible();
  await expect(page.getByText("자리를 비운 동안 잎 105개를 모았습니다.", { exact: false })).toBeVisible();
  await expect(page.getByLabel("오프라인 복귀 보상")).toContainText("105 잎");
  await expect(page.getByLabel("온실 선반 보관 보너스")).toContainText("+20%");
  await expect
    .poll(async () =>
      page.evaluate(() => {
        const raw = window.localStorage.getItem("strange-seed-shop:phase0-save");
        const parsed = raw ? (JSON.parse(raw) as { leaves?: number; greenhouseStorageLevel?: number }) : {};
        return {
          leaves: parsed.leaves,
          greenhouseStorageLevel: parsed.greenhouseStorageLevel
        };
      })
    )
    .toEqual({ leaves: 115, greenhouseStorageLevel: 1 });

  await page.screenshot({ path: testInfo.outputPath("mobile-greenhouse-storage-upgrade-v0-393.png"), fullPage: false });
});

test("모바일 온실 확장 준비 주문은 선반 정리 이후 루프를 연다", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto("/?qaOfflineMinutes=60&qaLunarGuardian=1&qaGreenhouseShelf=1&qaGreenhouseStorage=1&qaReset=1");

  await page.getByRole("button", { name: "보상 확인" }).click();
  await expect(page.getByLabel("자동 생산과 첫 주문")).toContainText("온실 확장 준비");
  await expect(page.getByLabel("자동 생산과 첫 주문")).toContainText("0/60 잎 납품 준비");
  await expect(page.getByRole("button", { name: "주문 납품 +70 잎 · +3 꽃가루 · +2 재료" })).toBeDisabled();
  await expect(page.getByLabel("정원 자동 생산 장면")).toContainText("온실 확장 준비");

  await page.getByRole("button", { name: "생산 잎 수령" }).click();
  await expect(page.getByLabel("자동 생산과 첫 주문")).toContainText("60/60 잎 납품 준비");
  await expect(page.getByRole("button", { name: "주문 납품 +70 잎 · +3 꽃가루 · +2 재료" })).toBeEnabled();
  await page.getByRole("button", { name: "주문 납품 +70 잎 · +3 꽃가루 · +2 재료" }).click();

  await expect(page.getByText("재료 2", { exact: true })).toBeVisible();
  await expect(page.getByLabel("온실 확장 준비 납품 완료")).toContainText("+70 잎 · +3 꽃가루 · +2 재료");
  await expect(page.getByLabel("자동 생산과 첫 주문")).toContainText("온실 확장 준비 완료");
  await expect(page.getByLabel("정원 자동 생산 장면")).toContainText("온실 확장 준비 완료");

  const metrics = await page.evaluate(() => {
    const panelElement = document.querySelector<HTMLElement>(".starter-panel");
    const panel = panelElement?.getBoundingClientRect();
    const tabs = document.querySelector<HTMLElement>(".bottom-tabs")?.getBoundingClientRect();
    const productionCard = document.querySelector<HTMLElement>(".production-action-card");
    const productionCardRect = productionCard?.getBoundingClientRect();
    const productionLane = document.querySelector<HTMLElement>(".playfield-production-lane");
    const productionLaneRect = productionLane?.getBoundingClientRect();
    const overflowingChildren = Array.from(
      document.querySelectorAll<HTMLElement>(".starter-panel > article, .starter-panel > .active-growth-copy")
    )
      .filter((element) => element.offsetParent !== null && element.scrollHeight > element.clientHeight + 1)
      .map((element) => ({
        className: element.className,
        clientHeight: element.clientHeight,
        scrollHeight: element.scrollHeight
      }));

    return {
      bodyScrollHeight: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
      innerHeight: window.innerHeight,
      panel: panel ? { bottom: panel.bottom, clientHeight: panelElement?.clientHeight ?? 0, scrollHeight: panelElement?.scrollHeight ?? 0 } : null,
      tabs: tabs ? { top: tabs.top } : null,
      productionCard: productionCardRect
        ? {
            bottom: productionCardRect.bottom,
            clientHeight: productionCard?.clientHeight ?? 0,
            scrollHeight: productionCard?.scrollHeight ?? 0
          }
        : null,
      productionLane: productionLaneRect
        ? {
            bottom: productionLaneRect.bottom,
            clientHeight: productionLane?.clientHeight ?? 0,
            scrollHeight: productionLane?.scrollHeight ?? 0
          }
        : null,
      overflowingChildren
    };
  });

  expect(metrics.bodyScrollHeight).toBeLessThanOrEqual(metrics.innerHeight + 2);
  expect(metrics.panel).not.toBeNull();
  expect(metrics.tabs).not.toBeNull();
  expect(metrics.productionCard).not.toBeNull();
  expect(metrics.productionLane).not.toBeNull();
  expect(metrics.panel!.bottom).toBeLessThanOrEqual(metrics.tabs!.top - 4);
  expect(metrics.panel!.scrollHeight).toBeLessThanOrEqual(metrics.panel!.clientHeight + 1);
  expect(metrics.productionCard!.bottom).toBeLessThanOrEqual(metrics.tabs!.top - 4);
  expect(metrics.productionCard!.scrollHeight).toBeLessThanOrEqual(metrics.productionCard!.clientHeight + 1);
  expect(metrics.productionLane!.scrollHeight).toBeLessThanOrEqual(metrics.productionLane!.clientHeight + 1);
  expect(metrics.overflowingChildren).toEqual([]);
  await expect
    .poll(async () =>
      page.evaluate(() => {
        const raw = window.localStorage.getItem("strange-seed-shop:phase0-save");
        const parsed = raw
          ? (JSON.parse(raw) as {
              materials?: number;
              pollen?: number;
              idleProduction?: { completedOrderIds?: string[] };
            })
          : {};
        return {
          materials: parsed.materials,
          pollen: parsed.pollen,
          completedExpansionOrder:
            parsed.idleProduction?.completedOrderIds?.includes("order_greenhouse_expansion_001") ?? false
        };
      })
    )
    .toEqual({ materials: 2, pollen: 3, completedExpansionOrder: true });

  await page.screenshot({ path: testInfo.outputPath("mobile-greenhouse-expansion-order-v0-393.png"), fullPage: false });
});

test("모바일 온실 동선 확장은 3번 밭을 연다", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto("/?qaOfflineMinutes=60&qaLunarGuardian=1&qaGreenhouseShelf=1&qaGreenhouseStorage=1&qaReset=1");

  await page.getByRole("button", { name: "보상 확인" }).click();
  await page.getByRole("button", { name: "생산 잎 수령" }).click();
  await page.getByRole("button", { name: "주문 납품 +70 잎 · +3 꽃가루 · +2 재료" }).click();

  const routeChoice = page.locator(".upgrade-choice", { hasText: "온실 동선" });
  await expect(routeChoice).toContainText("확장 가능");
  await expect(routeChoice).toContainText("2 재료로 3번 밭 개방");
  await routeChoice.click();

  await expect(page.getByText("재료 0", { exact: true })).toBeVisible();
  await expect(routeChoice).toContainText("동선 완료");
  await expect(routeChoice).toContainText("3번 밭 개방 중");
  await expect(page.getByRole("button", { name: "3번 밭 빈 자리" })).toBeVisible();

  const metrics = await page.evaluate(() => {
    const panelElement = document.querySelector<HTMLElement>(".starter-panel");
    const panel = panelElement?.getBoundingClientRect();
    const tabs = document.querySelector<HTMLElement>(".bottom-tabs")?.getBoundingClientRect();
    const routeCard = document.querySelector<HTMLElement>(".upgrade-choice-greenhouse_route")?.getBoundingClientRect();
    const thirdPlot = Array.from(document.querySelectorAll<HTMLElement>(".playfield-plot-card")).find((element) =>
      element.textContent?.includes("3번 밭")
    );
    const thirdPlotRect = thirdPlot?.getBoundingClientRect();
    const overflowingChildren = Array.from(
      document.querySelectorAll<HTMLElement>(".starter-panel > article, .starter-panel > .active-growth-copy")
    )
      .filter((element) => element.offsetParent !== null && element.scrollHeight > element.clientHeight + 1)
      .map((element) => ({
        className: element.className,
        clientHeight: element.clientHeight,
        scrollHeight: element.scrollHeight
      }));

    return {
      bodyScrollHeight: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
      innerHeight: window.innerHeight,
      panel: panel
        ? {
            top: panel.top,
            bottom: panel.bottom,
            clientHeight: panelElement?.clientHeight ?? 0,
            scrollHeight: panelElement?.scrollHeight ?? 0
          }
        : null,
      tabs: tabs ? { top: tabs.top } : null,
      routeCard: routeCard ? { bottom: routeCard.bottom } : null,
      thirdPlot: thirdPlotRect ? { bottom: thirdPlotRect.bottom, height: thirdPlotRect.height } : null,
      overflowingChildren
    };
  });

  expect(metrics.bodyScrollHeight).toBeLessThanOrEqual(metrics.innerHeight + 2);
  expect(metrics.panel).not.toBeNull();
  expect(metrics.tabs).not.toBeNull();
  expect(metrics.routeCard).not.toBeNull();
  expect(metrics.thirdPlot).not.toBeNull();
  expect(metrics.panel!.bottom).toBeLessThanOrEqual(metrics.tabs!.top - 4);
  expect(metrics.panel!.scrollHeight).toBeLessThanOrEqual(metrics.panel!.clientHeight + 1);
  expect(metrics.routeCard!.bottom).toBeLessThanOrEqual(metrics.tabs!.top - 4);
  expect(metrics.thirdPlot!.bottom).toBeLessThanOrEqual(metrics.panel!.top - 4);
  expect(metrics.thirdPlot!.height).toBeGreaterThan(44);
  expect(metrics.overflowingChildren).toEqual([]);
  await expect
    .poll(async () =>
      page.evaluate(() => {
        const raw = window.localStorage.getItem("strange-seed-shop:phase0-save");
        const parsed = raw
          ? (JSON.parse(raw) as {
              materials?: number;
              greenhouseRouteLevel?: number;
              plotCount?: number;
            })
          : {};
        return {
          materials: parsed.materials,
          greenhouseRouteLevel: parsed.greenhouseRouteLevel,
          plotCount: parsed.plotCount
        };
      })
    )
    .toEqual({ materials: 0, greenhouseRouteLevel: 1, plotCount: 3 });

  await page.screenshot({ path: testInfo.outputPath("mobile-greenhouse-route-expansion-v0-393.png"), fullPage: false });
});

test("모바일 온실 동선 순환 주문은 3번 밭 생산을 쓴다", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto(
    "/?qaOfflineMinutes=60&qaLunarGuardian=1&qaGreenhouseShelf=1&qaGreenhouseStorage=1&qaGreenhouseRoute=1&qaReset=1"
  );

  await page.getByRole("button", { name: "보상 확인" }).click();
  await expect(page.getByRole("button", { name: "3번 밭 빈 자리" })).toBeVisible();
  await expect(page.getByLabel("자동 생산과 첫 주문")).toContainText("3번 밭 순환 납품");
  await expect(page.getByLabel("자동 생산과 첫 주문")).toContainText("0/90 잎 납품 준비");
  await expect(page.getByLabel("정원 자동 생산 장면")).toContainText("3번 밭 순환 납품");
  await expect(page.getByRole("button", { name: "주문 납품 +110 잎 · +4 꽃가루 · +1 재료" })).toBeDisabled();

  await page.getByRole("button", { name: "생산 잎 수령" }).click();
  await expect(page.getByLabel("자동 생산과 첫 주문")).toContainText("90/90 잎 납품 준비");
  await expect(page.getByRole("button", { name: "주문 납품 +110 잎 · +4 꽃가루 · +1 재료" })).toBeEnabled();
  await page.getByRole("button", { name: "주문 납품 +110 잎 · +4 꽃가루 · +1 재료" }).click();

  await expect(page.getByText("재료 1", { exact: true })).toBeVisible();
  await expect(page.getByLabel("3번 밭 순환 납품 납품 완료")).toContainText("+110 잎 · +4 꽃가루 · +1 재료");
  await expect(page.getByLabel("자동 생산과 첫 주문")).toContainText("3번 밭 순환 납품 완료");
  await expect(page.getByLabel("정원 자동 생산 장면")).toContainText("3번 밭 순환 납품 완료");

  const metrics = await page.evaluate(() => {
    const panelElement = document.querySelector<HTMLElement>(".starter-panel");
    const panel = panelElement?.getBoundingClientRect();
    const tabs = document.querySelector<HTMLElement>(".bottom-tabs")?.getBoundingClientRect();
    const productionCard = document.querySelector<HTMLElement>(".production-action-card");
    const productionCardRect = productionCard?.getBoundingClientRect();
    const routeCard = document.querySelector<HTMLElement>(".upgrade-choice-greenhouse_route")?.getBoundingClientRect();
    const thirdPlot = Array.from(document.querySelectorAll<HTMLElement>(".playfield-plot-card")).find((element) =>
      element.textContent?.includes("3번 밭")
    );
    const thirdPlotRect = thirdPlot?.getBoundingClientRect();
    const overflowingChildren = Array.from(
      document.querySelectorAll<HTMLElement>(".starter-panel > article, .starter-panel > .active-growth-copy")
    )
      .filter((element) => element.offsetParent !== null && element.scrollHeight > element.clientHeight + 1)
      .map((element) => ({
        className: element.className,
        clientHeight: element.clientHeight,
        scrollHeight: element.scrollHeight
      }));

    return {
      bodyScrollHeight: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
      innerHeight: window.innerHeight,
      panel: panel
        ? {
            top: panel.top,
            bottom: panel.bottom,
            clientHeight: panelElement?.clientHeight ?? 0,
            scrollHeight: panelElement?.scrollHeight ?? 0
          }
        : null,
      tabs: tabs ? { top: tabs.top } : null,
      productionCard: productionCardRect
        ? {
            bottom: productionCardRect.bottom,
            clientHeight: productionCard?.clientHeight ?? 0,
            scrollHeight: productionCard?.scrollHeight ?? 0
          }
        : null,
      routeCard: routeCard ? { bottom: routeCard.bottom } : null,
      thirdPlot: thirdPlotRect ? { bottom: thirdPlotRect.bottom, height: thirdPlotRect.height } : null,
      overflowingChildren
    };
  });

  expect(metrics.bodyScrollHeight).toBeLessThanOrEqual(metrics.innerHeight + 2);
  expect(metrics.panel).not.toBeNull();
  expect(metrics.tabs).not.toBeNull();
  expect(metrics.productionCard).not.toBeNull();
  expect(metrics.routeCard).not.toBeNull();
  expect(metrics.thirdPlot).not.toBeNull();
  expect(metrics.panel!.bottom).toBeLessThanOrEqual(metrics.tabs!.top - 4);
  expect(metrics.panel!.scrollHeight).toBeLessThanOrEqual(metrics.panel!.clientHeight + 1);
  expect(metrics.productionCard!.bottom).toBeLessThanOrEqual(metrics.tabs!.top - 4);
  expect(metrics.productionCard!.scrollHeight).toBeLessThanOrEqual(metrics.productionCard!.clientHeight + 1);
  expect(metrics.routeCard!.bottom).toBeLessThanOrEqual(metrics.tabs!.top - 4);
  expect(metrics.thirdPlot!.bottom).toBeLessThanOrEqual(metrics.panel!.top - 4);
  expect(metrics.thirdPlot!.height).toBeGreaterThan(44);
  expect(metrics.overflowingChildren).toEqual([]);
  await expect
    .poll(async () =>
      page.evaluate(() => {
        const raw = window.localStorage.getItem("strange-seed-shop:phase0-save");
        const parsed = raw
          ? (JSON.parse(raw) as {
              materials?: number;
              pollen?: number;
              plotCount?: number;
              idleProduction?: { completedOrderIds?: string[] };
            })
          : {};
        return {
          materials: parsed.materials,
          pollen: parsed.pollen,
          plotCount: parsed.plotCount,
          routeSupplyDone:
            parsed.idleProduction?.completedOrderIds?.includes("order_greenhouse_route_supply_001") ?? false
        };
      })
    )
    .toEqual({ materials: 1, pollen: 4, plotCount: 3, routeSupplyDone: true });

  await page.screenshot({ path: testInfo.outputPath("mobile-greenhouse-route-supply-order-v0-393.png"), fullPage: false });
});

test("모바일 온실 물길 강화는 순환 주문 보상을 생산률로 바꾼다", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto(
    "/?qaOfflineMinutes=60&qaLunarGuardian=1&qaGreenhouseShelf=1&qaGreenhouseStorage=1&qaGreenhouseRoute=1&qaGreenhouseRouteSupply=1&qaReset=1"
  );

  await page.getByRole("button", { name: "보상 확인" }).click();
  await expect(page.getByLabel("자동 생산과 첫 주문")).toContainText("분당 11.2 잎");
  await expect(page.getByLabel("자동 생산과 첫 주문")).toContainText("3번 밭 순환 납품 완료");
  await expect(page.getByText("재료 1", { exact: true })).toBeVisible();
  await expect(page.getByText("꽃가루 4", { exact: true })).toBeVisible();

  const irrigationChoice = page.locator(".upgrade-choice", { hasText: "온실 물길" });
  await expect(irrigationChoice).toContainText("연결 가능");
  await expect(irrigationChoice).toContainText("1 재료 · 4 꽃가루로 자동 생산 +15%");
  await irrigationChoice.click();

  await expect(page.getByText("재료 0", { exact: true })).toBeVisible();
  await expect(page.getByText("꽃가루 0", { exact: true })).toBeVisible();
  await expect(page.getByLabel("자동 생산과 첫 주문")).toContainText("분당 12.8 잎");
  await expect(irrigationChoice).toContainText("물길 완료");
  await expect(irrigationChoice).toContainText("자동 생산 +15% 가동");
  await expect(page.getByRole("button", { name: "3번 밭 빈 자리" })).toBeVisible();

  const metrics = await page.evaluate(() => {
    const panelElement = document.querySelector<HTMLElement>(".starter-panel");
    const panel = panelElement?.getBoundingClientRect();
    const tabs = document.querySelector<HTMLElement>(".bottom-tabs")?.getBoundingClientRect();
    const productionCard = document.querySelector<HTMLElement>(".production-action-card");
    const productionCardRect = productionCard?.getBoundingClientRect();
    const irrigationCard = document.querySelector<HTMLElement>(".upgrade-choice-greenhouse_irrigation")?.getBoundingClientRect();
    const thirdPlot = Array.from(document.querySelectorAll<HTMLElement>(".playfield-plot-card")).find((element) =>
      element.textContent?.includes("3번 밭")
    );
    const thirdPlotRect = thirdPlot?.getBoundingClientRect();
    const overflowingChildren = Array.from(
      document.querySelectorAll<HTMLElement>(".starter-panel > article, .starter-panel > .active-growth-copy")
    )
      .filter((element) => element.offsetParent !== null && element.scrollHeight > element.clientHeight + 1)
      .map((element) => ({
        className: element.className,
        clientHeight: element.clientHeight,
        scrollHeight: element.scrollHeight
      }));

    return {
      bodyScrollHeight: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
      innerHeight: window.innerHeight,
      panel: panel
        ? {
            top: panel.top,
            bottom: panel.bottom,
            clientHeight: panelElement?.clientHeight ?? 0,
            scrollHeight: panelElement?.scrollHeight ?? 0
          }
        : null,
      tabs: tabs ? { top: tabs.top } : null,
      productionCard: productionCardRect
        ? {
            bottom: productionCardRect.bottom,
            clientHeight: productionCard?.clientHeight ?? 0,
            scrollHeight: productionCard?.scrollHeight ?? 0
          }
        : null,
      irrigationCard: irrigationCard ? { bottom: irrigationCard.bottom } : null,
      thirdPlot: thirdPlotRect ? { bottom: thirdPlotRect.bottom, height: thirdPlotRect.height } : null,
      overflowingChildren
    };
  });

  expect(metrics.bodyScrollHeight).toBeLessThanOrEqual(metrics.innerHeight + 2);
  expect(metrics.panel).not.toBeNull();
  expect(metrics.tabs).not.toBeNull();
  expect(metrics.productionCard).not.toBeNull();
  expect(metrics.irrigationCard).not.toBeNull();
  expect(metrics.thirdPlot).not.toBeNull();
  expect(metrics.panel!.bottom).toBeLessThanOrEqual(metrics.tabs!.top - 4);
  expect(metrics.panel!.scrollHeight).toBeLessThanOrEqual(metrics.panel!.clientHeight + 1);
  expect(metrics.productionCard!.bottom).toBeLessThanOrEqual(metrics.tabs!.top - 4);
  expect(metrics.productionCard!.scrollHeight).toBeLessThanOrEqual(metrics.productionCard!.clientHeight + 1);
  expect(metrics.irrigationCard!.bottom).toBeLessThanOrEqual(metrics.tabs!.top - 4);
  expect(metrics.thirdPlot!.bottom).toBeLessThanOrEqual(metrics.panel!.top - 4);
  expect(metrics.thirdPlot!.height).toBeGreaterThan(44);
  expect(metrics.overflowingChildren).toEqual([]);
  await expect
    .poll(async () =>
      page.evaluate(() => {
        const raw = window.localStorage.getItem("strange-seed-shop:phase0-save");
        const parsed = raw
          ? (JSON.parse(raw) as {
              materials?: number;
              pollen?: number;
              greenhouseIrrigationLevel?: number;
            })
          : {};
        return {
          materials: parsed.materials,
          pollen: parsed.pollen,
          greenhouseIrrigationLevel: parsed.greenhouseIrrigationLevel
        };
      })
    )
    .toEqual({ materials: 0, pollen: 0, greenhouseIrrigationLevel: 1 });

  await page.screenshot({ path: testInfo.outputPath("mobile-greenhouse-irrigation-upgrade-v0-393.png"), fullPage: false });
});

test("모바일 온실 물길 점검 주문은 강화된 생산을 다음 납품으로 이어준다", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto(
    "/?qaOfflineMinutes=60&qaLunarGuardian=1&qaGreenhouseShelf=1&qaGreenhouseStorage=1&qaGreenhouseRoute=1&qaGreenhouseRouteSupply=1&qaGreenhouseIrrigation=1&qaReset=1"
  );

  await page.getByRole("button", { name: "보상 확인" }).click();
  await expect(page.getByLabel("자동 생산과 첫 주문")).toContainText("분당 12.8 잎");
  await expect(page.getByLabel("자동 생산과 첫 주문")).toContainText("온실 물길 점검");
  await expect(page.getByLabel("자동 생산과 첫 주문")).toContainText("0/120 잎 납품 준비");

  await page.getByRole("button", { name: "생산 잎 수령" }).click();
  await expect(page.getByLabel("자동 생산과 첫 주문")).toContainText("120/120 잎 납품 준비");
  await page.getByRole("button", { name: /주문 납품 \+135 잎 · \+3 꽃가루 · \+1 재료/ }).click();

  await expect(page.getByLabel("자동 생산과 첫 주문")).toContainText("온실 물길 점검 완료");
  await expect(page.getByText("재료 1", { exact: true })).toBeVisible();
  await expect(page.getByText("꽃가루 3", { exact: true })).toBeVisible();

  const metrics = await page.evaluate(() => {
    const panelElement = document.querySelector<HTMLElement>(".starter-panel");
    const panel = panelElement?.getBoundingClientRect();
    const tabs = document.querySelector<HTMLElement>(".bottom-tabs")?.getBoundingClientRect();
    const productionCard = document.querySelector<HTMLElement>(".production-action-card");
    const productionCardRect = productionCard?.getBoundingClientRect();
    const completeRow = document.querySelector<HTMLElement>(".production-complete-row")?.getBoundingClientRect();
    const irrigationCard = document.querySelector<HTMLElement>(".upgrade-choice-greenhouse_irrigation")?.getBoundingClientRect();
    const overflowingChildren = Array.from(
      document.querySelectorAll<HTMLElement>(".starter-panel > article, .starter-panel > .active-growth-copy")
    )
      .filter((element) => element.offsetParent !== null && element.scrollHeight > element.clientHeight + 1)
      .map((element) => ({
        className: element.className,
        clientHeight: element.clientHeight,
        scrollHeight: element.scrollHeight
      }));

    return {
      bodyScrollHeight: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
      innerHeight: window.innerHeight,
      panel: panel
        ? {
            bottom: panel.bottom,
            clientHeight: panelElement?.clientHeight ?? 0,
            scrollHeight: panelElement?.scrollHeight ?? 0
          }
        : null,
      tabs: tabs ? { top: tabs.top } : null,
      productionCard: productionCardRect
        ? {
            bottom: productionCardRect.bottom,
            clientHeight: productionCard?.clientHeight ?? 0,
            scrollHeight: productionCard?.scrollHeight ?? 0
          }
        : null,
      completeRow: completeRow ? { bottom: completeRow.bottom } : null,
      irrigationCard: irrigationCard ? { bottom: irrigationCard.bottom } : null,
      overflowingChildren
    };
  });

  expect(metrics.bodyScrollHeight).toBeLessThanOrEqual(metrics.innerHeight + 2);
  expect(metrics.panel).not.toBeNull();
  expect(metrics.tabs).not.toBeNull();
  expect(metrics.productionCard).not.toBeNull();
  expect(metrics.completeRow).not.toBeNull();
  expect(metrics.irrigationCard).not.toBeNull();
  expect(metrics.panel!.bottom).toBeLessThanOrEqual(metrics.tabs!.top - 4);
  expect(metrics.panel!.scrollHeight).toBeLessThanOrEqual(metrics.panel!.clientHeight + 1);
  expect(metrics.productionCard!.bottom).toBeLessThanOrEqual(metrics.tabs!.top - 4);
  expect(metrics.productionCard!.scrollHeight).toBeLessThanOrEqual(metrics.productionCard!.clientHeight + 1);
  expect(metrics.completeRow!.bottom).toBeLessThanOrEqual(metrics.tabs!.top - 4);
  expect(metrics.irrigationCard!.bottom).toBeLessThanOrEqual(metrics.tabs!.top - 4);
  expect(metrics.overflowingChildren).toEqual([]);
  await expect
    .poll(async () =>
      page.evaluate(() => {
        const raw = window.localStorage.getItem("strange-seed-shop:phase0-save");
        const parsed = raw
          ? (JSON.parse(raw) as {
              materials?: number;
              pollen?: number;
              greenhouseIrrigationLevel?: number;
              idleProduction?: { completedOrderIds?: string[] };
            })
          : {};
        return {
          materials: parsed.materials,
          pollen: parsed.pollen,
          greenhouseIrrigationLevel: parsed.greenhouseIrrigationLevel,
          irrigationOrderDone:
            parsed.idleProduction?.completedOrderIds?.includes("order_greenhouse_irrigation_check_001") ?? false
        };
      })
    )
    .toEqual({ materials: 1, pollen: 3, greenhouseIrrigationLevel: 1, irrigationOrderDone: true });

  await page.screenshot({ path: testInfo.outputPath("mobile-greenhouse-irrigation-order-v0-393.png"), fullPage: false });
});

test("모바일 온실 물안개 강화는 물길 점검 보상을 복귀 보너스로 바꾼다", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto(
    "/?qaOfflineMinutes=60&qaLunarGuardian=1&qaGreenhouseShelf=1&qaGreenhouseStorage=1&qaGreenhouseRoute=1&qaGreenhouseRouteSupply=1&qaGreenhouseIrrigation=1&qaReset=1"
  );

  await page.getByRole("button", { name: "보상 확인" }).click();
  await page.getByRole("button", { name: "생산 잎 수령" }).click();
  await page.getByRole("button", { name: /주문 납품 \+135 잎 · \+3 꽃가루 · \+1 재료/ }).click();

  const mistChoice = page.locator(".upgrade-choice", { hasText: "온실 물안개" });
  await expect(mistChoice).toContainText("분사 가능");
  await expect(mistChoice).toContainText("1 재료 · 3 꽃가루로 복귀 보관 +10%");
  await mistChoice.click();

  await expect(page.getByText("재료 0", { exact: true })).toBeVisible();
  await expect(page.getByText("꽃가루 0", { exact: true })).toBeVisible();
  await expect(mistChoice).toContainText("물안개 완료");
  await expect(mistChoice).toContainText("복귀 보관 +10% 가동");
  await expect(page.getByLabel("정원 자동 생산 장면")).toContainText("선반 보관 +30%");

  const metrics = await page.evaluate(() => {
    const panelElement = document.querySelector<HTMLElement>(".starter-panel");
    const panel = panelElement?.getBoundingClientRect();
    const tabs = document.querySelector<HTMLElement>(".bottom-tabs")?.getBoundingClientRect();
    const productionCard = document.querySelector<HTMLElement>(".production-action-card");
    const productionCardRect = productionCard?.getBoundingClientRect();
    const mistCard = document.querySelector<HTMLElement>(".upgrade-choice-greenhouse_mist")?.getBoundingClientRect();
    const overflowingChildren = Array.from(
      document.querySelectorAll<HTMLElement>(".starter-panel > article, .starter-panel > .active-growth-copy")
    )
      .filter((element) => element.offsetParent !== null && element.scrollHeight > element.clientHeight + 1)
      .map((element) => ({
        className: element.className,
        clientHeight: element.clientHeight,
        scrollHeight: element.scrollHeight
      }));

    return {
      bodyScrollHeight: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
      innerHeight: window.innerHeight,
      panel: panel
        ? {
            bottom: panel.bottom,
            clientHeight: panelElement?.clientHeight ?? 0,
            scrollHeight: panelElement?.scrollHeight ?? 0
          }
        : null,
      tabs: tabs ? { top: tabs.top } : null,
      productionCard: productionCardRect
        ? {
            bottom: productionCardRect.bottom,
            clientHeight: productionCard?.clientHeight ?? 0,
            scrollHeight: productionCard?.scrollHeight ?? 0
          }
        : null,
      mistCard: mistCard ? { bottom: mistCard.bottom } : null,
      overflowingChildren
    };
  });

  expect(metrics.bodyScrollHeight).toBeLessThanOrEqual(metrics.innerHeight + 2);
  expect(metrics.panel).not.toBeNull();
  expect(metrics.tabs).not.toBeNull();
  expect(metrics.productionCard).not.toBeNull();
  expect(metrics.mistCard).not.toBeNull();
  expect(metrics.panel!.bottom).toBeLessThanOrEqual(metrics.tabs!.top - 4);
  expect(metrics.panel!.scrollHeight).toBeLessThanOrEqual(metrics.panel!.clientHeight + 1);
  expect(metrics.productionCard!.bottom).toBeLessThanOrEqual(metrics.tabs!.top - 4);
  expect(metrics.productionCard!.scrollHeight).toBeLessThanOrEqual(metrics.productionCard!.clientHeight + 1);
  expect(metrics.mistCard!.bottom).toBeLessThanOrEqual(metrics.tabs!.top - 4);
  expect(metrics.overflowingChildren).toEqual([]);
  await expect
    .poll(async () =>
      page.evaluate(() => {
        const raw = window.localStorage.getItem("strange-seed-shop:phase0-save");
        const parsed = raw
          ? (JSON.parse(raw) as {
              materials?: number;
              pollen?: number;
              greenhouseMistLevel?: number;
              idleProduction?: { completedOrderIds?: string[] };
            })
          : {};
        return {
          materials: parsed.materials,
          pollen: parsed.pollen,
          greenhouseMistLevel: parsed.greenhouseMistLevel,
          irrigationOrderDone:
            parsed.idleProduction?.completedOrderIds?.includes("order_greenhouse_irrigation_check_001") ?? false
        };
      })
    )
    .toEqual({ materials: 0, pollen: 0, greenhouseMistLevel: 1, irrigationOrderDone: true });

  await page.evaluate(() => {
    const raw = window.localStorage.getItem("strange-seed-shop:phase0-save");
    const parsed = raw ? JSON.parse(raw) : {};
    const lastSeenAt = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    window.localStorage.setItem(
      "strange-seed-shop:phase0-save",
      JSON.stringify({
        ...parsed,
        lastSeenAt,
        updatedAt: lastSeenAt,
        idleProduction: {
          ...parsed.idleProduction,
          lastTickAt: lastSeenAt
        }
      })
    );
  });
  await page.goto("/");
  await expect(page.getByLabel("오프라인 복귀 보상")).toContainText("보관 보상 +30%");

  await page.screenshot({ path: testInfo.outputPath("mobile-greenhouse-mist-upgrade-v0-393.png"), fullPage: false });
});

test("모바일 물안개 응축 납품은 복귀 보상을 새 주문으로 잇는다", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto("/?qaOfflineMinutes=60&qaGreenhouseMist=1&qaReset=1");

  await expect(page.getByLabel("오프라인 복귀 보상")).toContainText("보관 보상 +30%");
  await page.getByRole("button", { name: "보상 확인" }).click();
  await expect(page.getByLabel("정원 자동 생산 장면")).toContainText("물안개 응축 납품");
  await expect(page.getByLabel("자동 생산과 첫 주문")).toContainText("안개 맺힌 온실 선반");
  await page.getByRole("button", { name: "생산 잎 수령" }).click();
  await expect(page.getByLabel("자동 생산과 첫 주문")).toContainText("150/150 잎 납품 준비");
  await page.getByRole("button", { name: /주문 납품 \+165 잎 · \+2 꽃가루 · \+1 재료/ }).click();

  await expect(page.getByLabel("자동 생산과 첫 주문")).toContainText("물안개 응축 납품 완료");
  await expect(page.getByLabel("자동 생산과 첫 주문")).toContainText("+165 잎 · +2 꽃가루 · +1 재료");
  await expect(page.getByLabel("자동 생산과 첫 주문")).toContainText("응축기 가동");
  await expect(page.getByLabel("자동 생산과 첫 주문")).toContainText("달빛 온실 단서 +1");
  await expect(page.getByLabel("정원 자동 생산 장면")).toContainText("응축기 가동");
  await expect(page.getByLabel("정원 자동 생산 장면")).toContainText("달빛 온실 단서 +1");
  await expect(page.locator(".playfield-order-crate.order-variant-mist-condenser-complete")).toBeVisible();

  const metrics = await page.evaluate(() => {
    const panelElement = document.querySelector<HTMLElement>(".starter-panel");
    const panel = panelElement?.getBoundingClientRect();
    const tabs = document.querySelector<HTMLElement>(".bottom-tabs")?.getBoundingClientRect();
    const productionCard = document.querySelector<HTMLElement>(".production-action-card");
    const productionCardRect = productionCard?.getBoundingClientRect();
    const mistPayoff = document.querySelector<HTMLElement>(".mist-condenser-payoff")?.getBoundingClientRect();
    const mistCrate = document
      .querySelector<HTMLElement>(".playfield-order-crate.order-variant-mist-condenser-complete")
      ?.getBoundingClientRect();
    const overflowingChildren = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".starter-panel > article, .starter-panel > .active-growth-copy, .mist-condenser-payoff"
      )
    )
      .filter((element) => element.offsetParent !== null && element.scrollHeight > element.clientHeight + 1)
      .map((element) => ({
        className: element.className,
        clientHeight: element.clientHeight,
        scrollHeight: element.scrollHeight
      }));

    return {
      bodyScrollHeight: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
      innerHeight: window.innerHeight,
      panel: panel
        ? {
            bottom: panel.bottom,
            clientHeight: panelElement?.clientHeight ?? 0,
            scrollHeight: panelElement?.scrollHeight ?? 0
          }
        : null,
      tabs: tabs ? { top: tabs.top } : null,
      productionCard: productionCardRect
        ? {
            bottom: productionCardRect.bottom,
            clientHeight: productionCard?.clientHeight ?? 0,
            scrollHeight: productionCard?.scrollHeight ?? 0
          }
        : null,
      mistPayoff: mistPayoff ? { bottom: mistPayoff.bottom, clientHeight: mistPayoff.height } : null,
      mistCrate: mistCrate ? { bottom: mistCrate.bottom, height: mistCrate.height } : null,
      overflowingChildren
    };
  });

  expect(metrics.bodyScrollHeight).toBeLessThanOrEqual(metrics.innerHeight + 2);
  expect(metrics.panel).not.toBeNull();
  expect(metrics.tabs).not.toBeNull();
  expect(metrics.productionCard).not.toBeNull();
  expect(metrics.mistPayoff).not.toBeNull();
  expect(metrics.mistCrate).not.toBeNull();
  expect(metrics.panel!.bottom).toBeLessThanOrEqual(metrics.tabs!.top - 4);
  expect(metrics.panel!.scrollHeight).toBeLessThanOrEqual(metrics.panel!.clientHeight + 1);
  expect(metrics.productionCard!.bottom).toBeLessThanOrEqual(metrics.tabs!.top - 4);
  expect(metrics.productionCard!.scrollHeight).toBeLessThanOrEqual(metrics.productionCard!.clientHeight + 1);
  expect(metrics.overflowingChildren).toEqual([]);
  await expect
    .poll(async () =>
      page.evaluate(() => {
        const raw = window.localStorage.getItem("strange-seed-shop:phase0-save");
        const parsed = raw
          ? (JSON.parse(raw) as {
              materials?: number;
              pollen?: number;
              idleProduction?: { completedOrderIds?: string[] };
            })
          : {};
        return {
          materials: parsed.materials,
          pollen: parsed.pollen,
          mistReturnOrderDone:
            parsed.idleProduction?.completedOrderIds?.includes("order_greenhouse_mist_return_001") ?? false
        };
      })
    )
    .toEqual({ materials: 1, pollen: 2, mistReturnOrderDone: true });

  await page.screenshot({ path: testInfo.outputPath("mobile-greenhouse-mist-return-order-v0-393.png"), fullPage: false });
});

test("모바일 달빛 온실 조사는 응축 단서를 원정 시작으로 소비한다", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto("/?qaOfflineMinutes=60&qaGreenhouseMist=1&qaReset=1");

  await page.getByRole("button", { name: "보상 확인" }).click();
  await page.getByRole("button", { name: "생산 잎 수령" }).click();
  await page.getByRole("button", { name: /주문 납품 \+165 잎 · \+2 꽃가루 · \+1 재료/ }).click();
  await expect(page.getByLabel("자동 생산과 첫 주문")).toContainText("달빛 온실 단서 +1");
  await expect(page.getByRole("button", { name: /원정/ })).toContainText("온실");

  await page.getByRole("button", { name: /원정/ }).click();
  await expect(page.locator(".dev-panel.player-panel.tab-expedition")).toBeVisible();
  await expect(page.getByLabel("달빛 온실 조사 단서")).toContainText("달빛 온실 조사");
  await expect(page.getByLabel("달빛 온실 조사 단서")).toContainText("온실 단서");
  await expect(page.getByLabel("달빛 온실 조사 단서")).toContainText("응축기에서 모은 달빛 단서");
  await expect(page.getByRole("button", { name: "달빛 온실 조사 시작" })).toBeEnabled();
  await page.getByRole("button", { name: "달빛 온실 조사 시작" }).click();

  await expect(page.getByText("원정 진행 중", { exact: true })).toBeVisible();
  await expect(page.getByText("60분 남음 · 돌아오면 보상 수령", { exact: true })).toBeVisible();
  await expect
    .poll(async () =>
      page.evaluate(() => {
        const raw = window.localStorage.getItem("strange-seed-shop:phase0-save");
        const parsed = raw ? (JSON.parse(raw) as { activeExpedition?: { expeditionId?: string; creatureIds?: string[] } }) : {};
        return {
          expeditionId: parsed.activeExpedition?.expeditionId,
          creatureCount: parsed.activeExpedition?.creatureIds?.length ?? 0
        };
      })
    )
    .toEqual({ expeditionId: "moon_hint", creatureCount: 2 });

  const metrics = await page.evaluate(() => {
    const panel = document.querySelector<HTMLElement>(".dev-panel.player-panel.tab-expedition")?.getBoundingClientRect();
    const tabs = document.querySelector<HTMLElement>(".bottom-tabs")?.getBoundingClientRect();
    const progress = document.querySelector<HTMLElement>(".expedition-progress-status")?.getBoundingClientRect();

    return {
      bodyScrollHeight: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
      innerHeight: window.innerHeight,
      panel: panel ? { bottom: panel.bottom, clientHeight: document.querySelector<HTMLElement>(".dev-panel")?.clientHeight ?? 0 } : null,
      tabs: tabs ? { top: tabs.top } : null,
      progress: progress ? { bottom: progress.bottom } : null
    };
  });

  expect(metrics.bodyScrollHeight).toBeLessThanOrEqual(metrics.innerHeight + 2);
  expect(metrics.panel).not.toBeNull();
  expect(metrics.tabs).not.toBeNull();
  expect(metrics.progress).not.toBeNull();
  expect(metrics.panel!.bottom).toBeLessThanOrEqual(metrics.tabs!.top + 1);
  expect(metrics.progress!.bottom).toBeLessThanOrEqual(metrics.tabs!.top - 4);

  await page.screenshot({ path: testInfo.outputPath("mobile-greenhouse-lunar-clue-expedition-v0-393.png"), fullPage: false });
});

test("모바일 달빛 온실 조사 보상은 온실 단서 source를 달방울 씨앗으로 잇는다", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto("/?qaGreenhouseLunarClaimReady=1&qaTab=expedition&qaReset=1");

  await expect(page.locator(".dev-panel.player-panel.tab-expedition")).toBeVisible();
  await expect(page.getByText("원정 완료", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "원정 보상 받기" }).click();

  await expect(page.getByLabel("달빛 원정 보상 다음 목표")).toContainText("달빛 온실 조사 보상");
  await expect(page.getByLabel("달빛 원정 보상 다음 목표")).toContainText("응축기에서 회수한 온실 단서");
  await expect(page.getByLabel("달빛 원정 보상 다음 목표")).toContainText("달방울 씨앗");
  await expect(page.getByLabel("달빛 원정 보상 다음 목표")).toContainText("달방울 누누");

  await expect
    .poll(async () =>
      page.evaluate(() => {
        const raw = window.localStorage.getItem("strange-seed-shop:phase0-save");
        const parsed = raw
          ? (JSON.parse(raw) as {
              activeExpedition?: { expeditionId?: string; source?: string };
              lunarRewardSource?: string;
              unlockedSeedIds?: string[];
              leaves?: number;
              materials?: number;
            })
          : {};
        return {
          activeExpeditionCleared: !parsed.activeExpedition,
          lunarRewardSource: parsed.lunarRewardSource,
          lunarUnlocked: parsed.unlockedSeedIds?.includes("seed_lunar_001") ?? false,
          leaves: parsed.leaves,
          materials: parsed.materials
        };
      })
    )
    .toEqual({
      activeExpeditionCleared: true,
      lunarRewardSource: "greenhouse_mist",
      lunarUnlocked: true,
      leaves: 595,
      materials: 3
    });

  const metrics = await page.evaluate(() => {
    const panel = document.querySelector<HTMLElement>(".dev-panel.player-panel.tab-expedition")?.getBoundingClientRect();
    const tabs = document.querySelector<HTMLElement>(".bottom-tabs")?.getBoundingClientRect();
    const reward = document.querySelector<HTMLElement>(".greenhouse-lunar-reward")?.getBoundingClientRect();

    return {
      bodyScrollHeight: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
      innerHeight: window.innerHeight,
      panel: panel ? { bottom: panel.bottom } : null,
      tabs: tabs ? { top: tabs.top } : null,
      reward: reward ? { bottom: reward.bottom } : null
    };
  });

  expect(metrics.bodyScrollHeight).toBeLessThanOrEqual(metrics.innerHeight + 2);
  expect(metrics.panel).not.toBeNull();
  expect(metrics.tabs).not.toBeNull();
  expect(metrics.reward).not.toBeNull();
  expect(metrics.panel!.bottom).toBeLessThanOrEqual(metrics.tabs!.top + 1);
  expect(metrics.reward!.bottom).toBeLessThanOrEqual(metrics.tabs!.top - 4);

  await page.getByRole("button", { name: "달방울 씨앗 보러가기" }).click();
  await expect(page.getByLabel("다음 도감 목표 씨앗")).toContainText("응축기에서 회수한 온실 단서");
  await expect(page.getByLabel("다음 도감 목표 씨앗")).toContainText("달방울 씨앗");

  await page.getByRole("button", { name: /도감/ }).click();
  await expect(page.getByLabel("도감 다음 수집 목표")).toContainText("응축기에서 회수한 온실 단서");
  await expect(page.getByLabel("도감 다음 수집 목표")).toContainText("달방울 누누");

  await page.screenshot({ path: testInfo.outputPath("mobile-greenhouse-lunar-reward-source-bridge-v0-393.png"), fullPage: false });
});

test("모바일 씨앗과 도감 발견 asset은 fallback 없이 실제 이미지로 렌더링된다", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto("/?qaGreenhouseLunarClaimReady=1&qaTab=album&qaReset=1");

  await expect(page.locator(".dev-panel.player-panel.tab-album")).toBeVisible();
  await expect(page.locator(".album-slot:not(.album-slot-locked) .asset-fallback")).toHaveCount(0);
  await expect(page.locator(".album-slot:not(.album-slot-locked) img")).toHaveCount(2);

  await page.getByRole("button", { name: "씨앗", exact: true }).click();
  await expect(page.locator(".dev-panel.player-panel.tab-seeds")).toBeVisible();
  await expect(page.locator(".seed-inventory-panel .asset-fallback")).toHaveCount(0);
  await expect(page.locator(".seed-inventory-panel .seed-inventory-row img").first()).toBeVisible();

  await page.screenshot({ path: testInfo.outputPath("mobile-seed-album-assets-no-fallback-v0-393.png"), fullPage: false });
});

test("모바일 도감은 보상표보다 생명체 기억 앨범과 단서 사진을 먼저 보여준다", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto("/?qaGreenhouseLunarClaimReady=1&qaTab=album&qaReset=1");

  await expect(page.locator(".dev-panel.player-panel.tab-album")).toBeVisible();
  await expect(page.getByLabel("도감 대표 생명체 기록")).toBeVisible();
  await expect(page.locator(".album-memory-photo img")).toBeVisible();
  await expect(page.getByText("오늘의 표정 photo", { exact: true })).toBeVisible();
  await expect(page.getByLabel("도감 단서 사진")).toBeVisible();
  await expect(page.getByLabel("도감 단서 사진")).not.toContainText("???");

  const initialMetrics = await page.evaluate(() => {
    const memory = document.querySelector<HTMLElement>(".album-memory-feature")?.getBoundingClientRect();
    const reward = document.querySelector<HTMLElement>(".album-reward-preview")?.getBoundingClientRect();
    const clue = document.querySelector<HTMLElement>(".album-clue-focus")?.getBoundingClientRect();
    const photo = document.querySelector<HTMLElement>(".album-memory-photo")?.getBoundingClientRect();
    const tabs = document.querySelector<HTMLElement>(".bottom-tabs")?.getBoundingClientRect();

    return {
      memory: memory ? { top: memory.top, bottom: memory.bottom } : null,
      reward: reward ? { top: reward.top } : null,
      clue: clue ? { top: clue.top, bottom: clue.bottom } : null,
      photo: photo ? { width: photo.width, height: photo.height } : null,
      tabs: tabs ? { top: tabs.top } : null
    };
  });

  expect(initialMetrics.memory).not.toBeNull();
  expect(initialMetrics.reward).not.toBeNull();
  expect(initialMetrics.clue).not.toBeNull();
  expect(initialMetrics.photo).not.toBeNull();
  expect(initialMetrics.tabs).not.toBeNull();
  expect(initialMetrics.memory!.top).toBeLessThan(initialMetrics.reward!.top);
  expect(initialMetrics.photo!.width).toBeGreaterThanOrEqual(118);
  expect(initialMetrics.photo!.height).toBeGreaterThanOrEqual(140);
  expect(initialMetrics.clue!.bottom).toBeLessThanOrEqual(initialMetrics.tabs!.top + 4);

  await page.getByRole("button", { name: "기록 넘기기" }).click();
  await expect(page.locator(".album-memory-feature")).toHaveClass(/is-memory-variant/);
  await expect(page.locator(".album-page-ribbon")).toBeVisible();
  await expect(page.locator(".album-memory-stamp")).toBeVisible();

  await page.getByRole("button", { name: "단서 보기" }).click();
  await expect(page.getByLabel("도감 단서 사진")).toBeInViewport();
  await expect(page.locator(".album-clue-polaroid")).toHaveCount(3);

  await page.screenshot({ path: testInfo.outputPath("mobile-album-memory-clue-focus-393.png"), fullPage: false });
});

test("모바일 온실 단서 달방울 씨앗은 신규 asset과 FX로 밭에 심어진다", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto("/?qaGreenhouseLunarSeedPlantReady=1&qaTab=seeds&qaReset=1&qaFxTelemetry=1");

  await expect(page.locator(".dev-panel.player-panel.tab-seeds")).toBeVisible();
  await expect(page.getByLabel("다음 도감 목표 씨앗")).toContainText("응축기에서 회수한 온실 단서");
  await expect(page.locator(".seed-goal-banner img")).toBeVisible();
  await expect(page.locator(".seed-goal-banner .asset-fallback")).toHaveCount(0);

  const lunarRow = page.locator(".seed-inventory-row", { hasText: "달방울 씨앗" }).first();
  await expect(lunarRow).toContainText("다음 발견");
  await expect(lunarRow).toContainText("구매 가능");
  await expect(lunarRow.locator("img")).toBeVisible();
  await expect(lunarRow.locator(".asset-fallback")).toHaveCount(0);
  await lunarRow.getByRole("button", { name: "구매 300" }).click();
  await expect(lunarRow).toContainText("보유 1개");
  await lunarRow.getByRole("button", { name: "심기" }).click();

  await expect(page.locator(".garden-playfield-host")).toBeVisible();
  await expect(page.getByRole("button", { name: /달방울 씨앗 성장시키기/ })).toBeVisible();
  await expect(page.locator(".plot-source-greenhouse-mist")).toContainText("온실 단서");
  await expect(page.locator(".playfield-plot-source-icon")).toBeVisible();
  await expect(page.locator(".playfield-plot-source-fx")).toHaveCount(0);
  await expect(page.locator(".starter-panel")).toContainText("온실 단서 달빛 성장");

  await page.getByRole("button", { name: /달방울 씨앗 성장시키기/ }).click();
  await page.waitForFunction(() => {
    const events = (window as unknown as { __gardenPlayfieldFxEvents?: Array<{ action: string; source: string }> }).__gardenPlayfieldFxEvents ?? [];
    return events.some((event) => event.action === "tap_growth" && event.source === "spritesheet");
  });

  await expect
    .poll(async () =>
      page.evaluate(() => {
        const raw = window.localStorage.getItem("strange-seed-shop:phase0-save");
        const parsed = raw
          ? (JSON.parse(raw) as { leaves?: number; seedInventory?: Record<string, number>; plots?: Array<{ seedId?: string; source?: string }> })
          : {};
        return {
          leaves: parsed.leaves,
          lunarSeeds: parsed.seedInventory?.seed_lunar_001 ?? 0,
          plantedWithSource: parsed.plots?.some((plot) => plot.seedId === "seed_lunar_001" && plot.source === "greenhouse_mist") ?? false
        };
      })
    )
    .toEqual({ leaves: 295, lunarSeeds: 0, plantedWithSource: true });

  const metrics = await page.evaluate(() => {
    const panelElement = document.querySelector<HTMLElement>(".starter-panel");
    const panel = panelElement?.getBoundingClientRect();
    const tabs = document.querySelector<HTMLElement>(".bottom-tabs")?.getBoundingClientRect();
    const sourcePlot = document.querySelector<HTMLElement>(".plot-source-greenhouse-mist")?.getBoundingClientRect();

    return {
      bodyScrollHeight: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
      innerHeight: window.innerHeight,
      panel: panel ? { bottom: panel.bottom, clientHeight: panelElement?.clientHeight ?? 0, scrollHeight: panelElement?.scrollHeight ?? 0 } : null,
      tabs: tabs ? { top: tabs.top } : null,
      sourcePlot: sourcePlot ? { bottom: sourcePlot.bottom } : null
    };
  });

  expect(metrics.bodyScrollHeight).toBeLessThanOrEqual(metrics.innerHeight + 2);
  expect(metrics.panel).not.toBeNull();
  expect(metrics.tabs).not.toBeNull();
  expect(metrics.sourcePlot).not.toBeNull();
  expect(metrics.panel!.bottom).toBeLessThanOrEqual(metrics.tabs!.top - 4);
  expect(metrics.panel!.scrollHeight).toBeLessThanOrEqual(metrics.panel!.clientHeight + 1);
  expect(metrics.sourcePlot!.bottom).toBeLessThanOrEqual(metrics.tabs!.top - 4);

  await page.screenshot({ path: testInfo.outputPath("mobile-greenhouse-lunar-seed-source-planting-v0-393.png"), fullPage: false });
});

test("모바일 복귀 다음 행동은 보상 modal에서 씨앗 목표로 이어진다", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto("/?qaOfflineMinutes=60&qaLunarGuardian=1&qaReset=1");

  await expect(page.getByLabel("오프라인 복귀 보상")).toContainText("방울새싹 씨앗 보러가기");
  await page.getByRole("button", { name: "방울새싹 씨앗 보러가기" }).click();
  await expect(page.getByLabel("오프라인 복귀 보상")).toHaveCount(0);
  await expect(page.locator(".dev-panel.player-panel.tab-seeds")).toBeVisible();
  await expect(page.getByLabel("다음 도감 목표 씨앗")).toContainText("방울새싹 씨앗");
  await expect(page.getByLabel("다음 도감 목표 씨앗")).toContainText("방패새싹 모모");

  await page.screenshot({ path: testInfo.outputPath("mobile-comeback-next-action-bridge-v0-393.png"), fullPage: false });
});

test("모바일 복귀 보상 씨앗 바로 구매는 다음 목표 row를 심기 준비 상태로 만든다", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto("/?qaOfflineMinutes=60&qaLunarGuardian=1&qaReset=1");

  await expect(page.getByLabel("오프라인 복귀 보상")).toContainText("방울새싹 씨앗 바로 구매");
  await page.getByRole("button", { name: "방울새싹 씨앗 바로 구매" }).click();
  await expect(page.getByLabel("오프라인 복귀 보상")).toHaveCount(0);
  await expect(page.locator(".dev-panel.player-panel.tab-seeds")).toBeVisible();

  const targetRow = page.locator(".seed-inventory-row", { hasText: "방울새싹 씨앗" }).first();
  await expect(targetRow).toContainText("보유 1개");
  await expect(targetRow).toContainText("열린 밭에 바로 심을 수 있어요");
  await expect(targetRow.getByRole("button", { name: "심기" })).toBeEnabled();
  await expect
    .poll(async () =>
      page.evaluate(() => {
        const raw = window.localStorage.getItem("strange-seed-shop:phase0-save");
        const parsed = raw ? (JSON.parse(raw) as { leaves?: number; seedInventory?: Record<string, number> }) : {};
        return {
          leaves: parsed.leaves,
          targetSeeds: parsed.seedInventory?.seed_herb_002 ?? 0
        };
      })
    )
    .toEqual({ leaves: 75, targetSeeds: 1 });

  await page.screenshot({ path: testInfo.outputPath("mobile-comeback-one-tap-seed-spend-v0-393.png"), fullPage: false });
});

test("모바일 복귀 보상 씨앗 구매하고 심기는 정원 재성장으로 바로 이어진다", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto("/?qaOfflineMinutes=60&qaLunarGuardian=1&qaReset=1");

  await expect(page.getByLabel("오프라인 복귀 보상")).toContainText("방울새싹 씨앗 구매하고 심기");
  await page.getByRole("button", { name: "방울새싹 씨앗 구매하고 심기" }).click();
  await expect(page.getByLabel("오프라인 복귀 보상")).toHaveCount(0);
  await expect(page.locator(".garden-playfield-host")).toBeVisible();
  await expect(page.getByLabel("현재 재화")).toContainText("잎 75");
  await expect
    .poll(async () =>
      page.evaluate(() => {
        const raw = window.localStorage.getItem("strange-seed-shop:phase0-save");
        const parsed = raw
          ? (JSON.parse(raw) as { leaves?: number; seedInventory?: Record<string, number>; plots?: Array<{ seedId?: string }> })
          : {};
        return {
          leaves: parsed.leaves,
          targetSeeds: parsed.seedInventory?.seed_herb_002 ?? 0,
          plantedTargetSeeds: parsed.plots?.filter((plot) => plot.seedId === "seed_herb_002").length ?? 0
        };
      })
    )
    .toEqual({ leaves: 75, targetSeeds: 0, plantedTargetSeeds: 1 });

  await page.screenshot({ path: testInfo.outputPath("mobile-comeback-one-tap-plant-v0-393.png"), fullPage: false });
});

test("모바일 복귀 심기 성공 안내는 다음 성장 탭 행동을 알려준다", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto("/?qaOfflineMinutes=60&qaLunarGuardian=1&qaReset=1");

  await page.getByRole("button", { name: "방울새싹 씨앗 구매하고 심기" }).click();
  await expect(page.getByText("방울새싹 씨앗을 바로 심었어요. 밭을 톡톡 두드려 성장시켜요.", { exact: true })).toBeVisible();
  await expect(page.locator(".garden-playfield-host")).toBeVisible();

  await page.screenshot({ path: testInfo.outputPath("mobile-comeback-plant-success-nudge-v0-393.png"), fullPage: false });
});

test("모바일 복귀 심기 후 성장 진행 안내는 다음 행동 패널에 보인다", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto("/?qaOfflineMinutes=60&qaLunarGuardian=1&qaReset=1");

  await page.getByRole("button", { name: "방울새싹 씨앗 구매하고 심기" }).click();
  await expect(page.locator(".objective-chip")).toHaveText("방울새싹 씨앗 성장 중");
  await expect(page.locator(".active-growth-copy")).toContainText(
    /현재 \d+% · 약 \d+초 남음. 약 \d+번 더 톡톡하면 수확 준비 · 1회 4초 단축./
  );

  await page.screenshot({ path: testInfo.outputPath("mobile-comeback-growth-progress-nudge-v0-393.png"), fullPage: false });
});

test("모바일 복귀 심기 후 성장 탭 feedback은 단축 효과를 보여준다", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto("/?qaOfflineMinutes=60&qaLunarGuardian=1&qaReset=1");

  await page.getByRole("button", { name: "방울새싹 씨앗 구매하고 심기" }).click();
  await page.getByRole("button", { name: "방울새싹 씨앗 성장시키기" }).click();

  await expect(page.locator(".playfield-action-feedback")).toContainText(/4초 단축 · 약 \d+번 남음/);

  await page.screenshot({ path: testInfo.outputPath("mobile-comeback-tap-feedback-payoff-v0-393.png"), fullPage: false });
});

test("모바일 복귀 성장 100% 화면은 생산 카드가 내부에서 잘리지 않는다", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto("/?qaOfflineMinutes=60&qaLunarGuardian=1&qaReset=1");

  await page.getByRole("button", { name: "방울새싹 씨앗 구매하고 심기" }).click();

  for (let tapCount = 0; tapCount < 20; tapCount += 1) {
    if ((await page.getByRole("button", { name: "방울새싹 씨앗 수확" }).count()) > 0) {
      break;
    }
    await page.getByRole("button", { name: "방울새싹 씨앗 성장시키기" }).click();
  }

  await expect(page.getByRole("button", { name: "방울새싹 씨앗 수확" })).toBeVisible();
  await expect(page.locator(".active-growth-copy")).toContainText(
    "현재 100% · 수확할 준비가 됐어요. 반짝이는 밭을 눌러 도감 보상으로 이어가세요."
  );

  const metrics = await page.evaluate(() => {
    const panel = document.querySelector<HTMLElement>(".starter-panel")?.getBoundingClientRect();
    const tabs = document.querySelector<HTMLElement>(".bottom-tabs")?.getBoundingClientRect();
    const productionCard = document.querySelector<HTMLElement>(".production-action-card");
    const productionCardRect = productionCard?.getBoundingClientRect();
    const actionSurfaceChildren = Array.from(
      document.querySelectorAll<HTMLElement>(".starter-panel > article, .starter-panel > .active-growth-copy")
    );
    const overflowingChildren = actionSurfaceChildren
      .filter((element) => element.offsetParent !== null && element.scrollHeight > element.clientHeight + 1)
      .map((element) => ({
        className: element.className,
        clientHeight: element.clientHeight,
        scrollHeight: element.scrollHeight,
        text: element.textContent?.replace(/\s+/g, " ").trim().slice(0, 80) ?? ""
      }));

    return {
      bodyScrollHeight: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
      innerHeight: window.innerHeight,
      panel: panel ? { bottom: panel.bottom, clientHeight: document.querySelector<HTMLElement>(".starter-panel")?.clientHeight ?? 0 } : null,
      tabs: tabs ? { top: tabs.top } : null,
      productionCard: productionCardRect
        ? {
            bottom: productionCardRect.bottom,
            clientHeight: productionCard?.clientHeight ?? 0,
            scrollHeight: productionCard?.scrollHeight ?? 0
          }
        : null,
      overflowingChildren
    };
  });

  expect(metrics.bodyScrollHeight).toBeLessThanOrEqual(metrics.innerHeight + 2);
  expect(metrics.panel).not.toBeNull();
  expect(metrics.tabs).not.toBeNull();
  expect(metrics.productionCard).not.toBeNull();
  expect(metrics.panel!.bottom).toBeLessThanOrEqual(metrics.tabs!.top - 4);
  expect(metrics.productionCard!.bottom).toBeLessThanOrEqual(metrics.tabs!.top - 4);
  expect(metrics.productionCard!.scrollHeight).toBeLessThanOrEqual(metrics.productionCard!.clientHeight + 1);
  expect(metrics.overflowingChildren).toEqual([]);

  await page.screenshot({ path: testInfo.outputPath("mobile-comeback-ready-action-surface-v0-393.png"), fullPage: false });
});

test("짧은 모바일 브라우저에서도 연구 단서는 action surface를 깨지 않는다", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 399, height: 666 });
  await page.goto("/?qaResearchComplete=1");

  await expect(page.getByText("연구 완료", { exact: true })).toBeVisible();
  await expect(page.getByLabel("다음 생명체 수집 목표")).toBeVisible();

  const metrics = await page.evaluate(() => {
    const playfield = document.querySelector<HTMLElement>(".garden-playfield-host")?.getBoundingClientRect();
    const panel = document.querySelector<HTMLElement>(".starter-panel")?.getBoundingClientRect();
    const tabs = document.querySelector<HTMLElement>(".bottom-tabs")?.getBoundingClientRect();
    const nextGoal = document.querySelector<HTMLElement>(".next-creature-card")?.getBoundingClientRect();
    return {
      bodyScrollHeight: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
      innerHeight: window.innerHeight,
      playfield: playfield ? { height: playfield.height } : null,
      panel: panel ? { bottom: panel.bottom } : null,
      tabs: tabs ? { top: tabs.top } : null,
      nextGoal: nextGoal ? { bottom: nextGoal.bottom } : null,
      panelClientHeight: document.querySelector<HTMLElement>(".starter-panel")?.clientHeight ?? 0,
      panelScrollHeight: document.querySelector<HTMLElement>(".starter-panel")?.scrollHeight ?? 0
    };
  });

  expect(metrics.bodyScrollHeight).toBeLessThanOrEqual(metrics.innerHeight + 2);
  expect(metrics.playfield).not.toBeNull();
  expect(metrics.panel).not.toBeNull();
  expect(metrics.tabs).not.toBeNull();
  expect(metrics.nextGoal).not.toBeNull();
  expect(metrics.playfield!.height).toBeGreaterThan(220);
  expect(metrics.panel!.bottom).toBeLessThanOrEqual(metrics.tabs!.top - 4);
  expect(metrics.nextGoal!.bottom).toBeLessThanOrEqual(metrics.tabs!.top - 4);
  expect(metrics.panelScrollHeight).toBeLessThanOrEqual(metrics.panelClientHeight + 1);

  await page.screenshot({ path: testInfo.outputPath("mobile-research-clue-reward-v0-short-399x666.png"), fullPage: false });
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
