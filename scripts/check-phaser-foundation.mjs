import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const PORT = 4183;
const URL = `http://127.0.0.1:${PORT}/`;
const OUT_DIR = "reports/visual/issue-0524-moon-fence-second-clue-payoff";
const REQUIRED_TOPOLOGY_ASSETS = [
  "bg_garden_terrain_open_v1",
  "tile_plot_empty_v1",
  "tile_plot_sprout_v1",
  "tile_plot_growing_v1",
  "tile_plot_ready_v1",
  "tile_plot_locked_preview_v1",
  "seed_lunar_002_icon",
  "seed_rare_001_icon",
  "creature_lunar_uncommon_001",
  "creature_lunar_rare_001",
  "facility_workbench_v1",
  "facility_order_crate_empty_v1",
  "facility_order_crate_filled_v1",
  "facility_expedition_gate_v1",
  "facility_expedition_return_crate_v1",
  "ui_shadow_soft_v1",
  "actor_pori_caretaker_strip_v1",
  "actor_momo_carrier_strip_v1",
  "fx_care_spark_strip_v1",
  "fx_harvest_leaf_flyout_strip_v1",
  "fx_lunar_harvest_moonburst_001",
  "fx_expedition_return_reward_strip_v1",
  "fx_night_glass_source_unlock_strip_v1"
];

function waitForServer(url, timeoutMs = 30_000) {
  const startedAt = Date.now();
  return new Promise((resolve, reject) => {
    const attempt = async () => {
      try {
        const response = await fetch(url);
        if (response.ok) {
          resolve();
          return;
        }
      } catch {
        // Retry until timeout.
      }
      if (Date.now() - startedAt > timeoutMs) {
        reject(new Error(`Timed out waiting for ${url}`));
        return;
      }
      setTimeout(attempt, 250);
    };
    void attempt();
  });
}

async function clickUntilAction(page, points, actionName) {
  for (const [x, y] of points) {
    await page.mouse.click(x, y);
    await page.waitForTimeout(100);
    if ((await page.getByRole("button", { name: actionName }).count()) > 0) {
      return;
    }
  }
}

async function runSmoke() {
  await mkdir(OUT_DIR, { recursive: true });

  const server = spawn(
    "npm",
    ["run", "dev:phaser", "--", "--host", "127.0.0.1", "--port", String(PORT)],
    {
      cwd: process.cwd(),
      env: {
        ...process.env,
        BROWSER: "none"
      },
      stdio: ["ignore", "pipe", "pipe"]
    }
  );

  let serverOutput = "";
  server.stdout.on("data", (chunk) => {
    serverOutput += chunk.toString();
  });
  server.stderr.on("data", (chunk) => {
    serverOutput += chunk.toString();
  });

  try {
    await waitForServer(URL);
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 1 });
    await page.goto(URL, { waitUntil: "networkidle" });

    await page.screenshot({ path: `${OUT_DIR}/phaser-check-fresh-start-393.png`, fullPage: false });
    await page.getByRole("button", { name: "감상 모드 열기" }).click();
    await page.waitForTimeout(160);
    await page.screenshot({ path: `${OUT_DIR}/phaser-check-overview-mode-393.png`, fullPage: false });
    const overviewMode = await page.evaluate(() => {
      const actionRail = document.querySelector('[data-testid="phaser-action-rail"]');
      const objective = document.querySelector('[data-testid="phaser-objective"]');
      return {
        viewMode: window.__seedGardenViewMode ?? "",
        hudCollapsed: window.__seedGardenHudCollapsed ?? false,
        actionRailDisplay: actionRail ? getComputedStyle(actionRail).display : "missing",
        objectiveDisplay: objective ? getComputedStyle(objective).display : "missing",
        buttonText: document.querySelector('[data-testid="phaser-view-mode-toggle"]')?.textContent ?? "",
        bodyScrollHeight: document.body.scrollHeight,
        documentScrollHeight: document.documentElement.scrollHeight,
        innerHeight: window.innerHeight
      };
    });
    await page.getByRole("button", { name: "관리 모드로 돌아가기" }).click();
    await page.waitForTimeout(160);
    await page.screenshot({ path: `${OUT_DIR}/phaser-check-manage-return-393.png`, fullPage: false });
    const manageReturn = await page.evaluate(() => {
      const actionRail = document.querySelector('[data-testid="phaser-action-rail"]');
      return {
        viewMode: window.__seedGardenViewMode ?? "",
        hudCollapsed: window.__seedGardenHudCollapsed ?? true,
        actionRailDisplay: actionRail ? getComputedStyle(actionRail).display : "missing",
        buttonText: document.querySelector('[data-testid="phaser-view-mode-toggle"]')?.textContent ?? ""
      };
    });
    await page.getByRole("button", { name: "심기" }).click();
    await page.screenshot({ path: `${OUT_DIR}/phaser-check-after-plant-393.png`, fullPage: false });
    for (let index = 0; index < 3; index += 1) {
      const careButton = page.getByRole("button", { name: "돌보기" });
      if ((await careButton.count()) > 0) {
        await careButton.click();
      }
    }
    await page.waitForTimeout(140);
    await page.screenshot({ path: `${OUT_DIR}/phaser-check-ready-393.png`, fullPage: false });
    await page.getByRole("button", { name: "수확" }).click();
    await page.waitForTimeout(140);
    await page.screenshot({ path: `${OUT_DIR}/phaser-check-after-harvest-393.png`, fullPage: false });
    await page.mouse.click(112, 612);
    await page.getByRole("button", { name: "수령" }).click();
    await page.screenshot({ path: `${OUT_DIR}/phaser-check-workbench-claim-393.png`, fullPage: false });
    for (let index = 0; index < 3; index += 1) {
      await page.getByRole("button", { name: "수령" }).click();
    }
    await clickUntilAction(page, [[230, 606], [284, 606], [284, 646]], "납품");
    await page.screenshot({ path: `${OUT_DIR}/phaser-check-crate-ready-393.png`, fullPage: false });
    await page.getByRole("button", { name: "납품" }).click();
    await page.waitForTimeout(140);
    await page.screenshot({ path: `${OUT_DIR}/phaser-check-delivery-claim-393.png`, fullPage: false });
    await clickUntilAction(page, [[160, 545], [204, 576]], "확장 60잎");
    await page.screenshot({ path: `${OUT_DIR}/phaser-check-expand-ready-393.png`, fullPage: false });
    await page.getByRole("button", { name: "확장 60잎" }).click();
    await page.screenshot({ path: `${OUT_DIR}/phaser-check-third-plot-expanded-393.png`, fullPage: false });
    await page.getByRole("button", { name: "심기" }).click();
    await page.waitForTimeout(140);
    await page.screenshot({ path: `${OUT_DIR}/phaser-check-third-plot-planted-393.png`, fullPage: false });
    for (let index = 0; index < 3; index += 1) {
      const careButton = page.getByRole("button", { name: "돌보기" });
      if ((await careButton.count()) > 0) {
        await careButton.click();
      }
    }
    await page.waitForTimeout(140);
    await page.screenshot({ path: `${OUT_DIR}/phaser-check-third-plot-ready-393.png`, fullPage: false });
    await page.getByRole("button", { name: "수확" }).click();
    await page.waitForTimeout(140);
    await page.screenshot({ path: `${OUT_DIR}/phaser-check-third-plot-harvested-393.png`, fullPage: false });
    await page.mouse.click(112, 612);
    for (let index = 0; index < 4; index += 1) {
      await page.getByRole("button", { name: "수령" }).click();
    }
    await clickUntilAction(page, [[230, 606], [284, 606], [284, 646]], "납품");
    await page.screenshot({ path: `${OUT_DIR}/phaser-check-second-crate-ready-393.png`, fullPage: false });
    await page.getByRole("button", { name: "납품" }).click();
    await page.waitForTimeout(140);
    await page.screenshot({ path: `${OUT_DIR}/phaser-check-second-delivery-393.png`, fullPage: false });
    await clickUntilAction(page, [[304, 502], [304, 548]], "정리 80잎");
    await page.screenshot({ path: `${OUT_DIR}/phaser-check-storage-ready-393.png`, fullPage: false });
    await page.getByRole("button", { name: "정리 80잎" }).click();
    await page.waitForTimeout(140);
    await page.screenshot({ path: `${OUT_DIR}/phaser-check-storage-unlocked-393.png`, fullPage: false });
    await page.mouse.click(112, 612);
    await page.getByRole("button", { name: "수령" }).click();
    await page.waitForTimeout(140);
    await page.screenshot({ path: `${OUT_DIR}/phaser-check-storage-fill-claim-393.png`, fullPage: false });
    await clickUntilAction(page, [[304, 502], [304, 548]], "회수");
    await page.screenshot({ path: `${OUT_DIR}/phaser-check-storage-buffer-393.png`, fullPage: false });
    const storageBeforeClaim = await page.evaluate(() => ({
      objective: document.querySelector('[data-testid="phaser-objective"]')?.textContent ?? "",
      railText: document.querySelector('[data-testid="phaser-action-rail"]')?.textContent ?? "",
      storedLeaves: window.__seedGardenStoredLeaves ?? 0,
      storageFillRatio: window.__seedGardenStorageFillRatio ?? 0
    }));
    await page.getByRole("button", { name: "회수" }).click();
    await page.waitForTimeout(140);
    await page.screenshot({ path: `${OUT_DIR}/phaser-check-storage-claimed-393.png`, fullPage: false });
    await clickUntilAction(page, [[80, 500], [80, 540], [120, 500]], "살펴보기");
    await page.screenshot({ path: `${OUT_DIR}/phaser-check-research-shelf-ready-393.png`, fullPage: false });
    await page.getByRole("button", { name: "살펴보기" }).click();
    await page.waitForTimeout(140);
    await page.screenshot({ path: `${OUT_DIR}/phaser-check-research-shelf-inspected-393.png`, fullPage: false });
    const clueBeforePlant = await page.evaluate(() => ({
      objective: document.querySelector('[data-testid="phaser-objective"]')?.textContent ?? "",
      railText: document.querySelector('[data-testid="phaser-action-rail"]')?.textContent ?? "",
      researchClueSeedAvailable: window.__seedGardenResearchClueSeedAvailable ?? false
    }));
    await clickUntilAction(page, [[204, 546], [204, 590], [164, 546]], "단서 심기");
    await page.screenshot({ path: `${OUT_DIR}/phaser-check-research-clue-action-393.png`, fullPage: false });
    await page.getByRole("button", { name: "단서 심기" }).click();
    await page.waitForTimeout(140);
    await page.screenshot({ path: `${OUT_DIR}/phaser-check-research-clue-planted-393.png`, fullPage: false });
    for (let index = 0; index < 2; index += 1) {
      const careButton = page.getByRole("button", { name: "돌보기" });
      if ((await careButton.count()) > 0) {
        await careButton.click();
      }
    }
    await page.waitForTimeout(140);
    await page.screenshot({ path: `${OUT_DIR}/phaser-check-research-clue-ready-393.png`, fullPage: false });
    await page.getByRole("button", { name: "수확" }).click();
    await page.waitForTimeout(140);
    await page.screenshot({ path: `${OUT_DIR}/phaser-check-research-clue-harvested-393.png`, fullPage: false });
    const clueBeforeRecord = await page.evaluate(() => ({
      objective: document.querySelector('[data-testid="phaser-objective"]')?.textContent ?? "",
      railText: document.querySelector('[data-testid="phaser-action-rail"]')?.textContent ?? "",
      researchClueRecordReady: window.__seedGardenResearchClueRecordReady ?? false
    }));
    await page.screenshot({ path: `${OUT_DIR}/phaser-check-research-clue-record-ready-393.png`, fullPage: false });
    await page.getByRole("button", { name: "도감 기록" }).click();
    await page.waitForTimeout(140);
    await page.screenshot({ path: `${OUT_DIR}/phaser-check-research-clue-recorded-393.png`, fullPage: false });
    const clueGoalSurface = await page.evaluate(() => ({
      objective: document.querySelector('[data-testid="phaser-objective"]')?.textContent ?? "",
      railText: document.querySelector('[data-testid="phaser-action-rail"]')?.textContent ?? "",
      researchClueGoalSurfaceVisible: window.__seedGardenResearchClueGoalSurfaceVisible ?? false
    }));
    await page.screenshot({ path: `${OUT_DIR}/phaser-check-research-clue-goal-surface-393.png`, fullPage: false });
    await page.getByRole("button", { name: "목표 씨앗 받기" }).click();
    await page.waitForTimeout(140);
    await page.screenshot({ path: `${OUT_DIR}/phaser-check-next-goal-seed-claimed-393.png`, fullPage: false });
    const nextGoalSeedClaimed = await page.evaluate(() => ({
      objective: document.querySelector('[data-testid="phaser-objective"]')?.textContent ?? "",
      railText: document.querySelector('[data-testid="phaser-action-rail"]')?.textContent ?? "",
      seeds: document.querySelector('[data-hud="seeds"]')?.textContent ?? "",
      researchNextGoalSeedAvailable: window.__seedGardenResearchNextGoalSeedAvailable ?? false,
      researchNextGoalSeedClaimed: window.__seedGardenResearchNextGoalSeedClaimed ?? false
    }));
    await page.getByRole("button", { name: "목표 심기" }).click();
    await page.waitForTimeout(140);
    await page.screenshot({ path: `${OUT_DIR}/phaser-check-next-goal-seed-planted-393.png`, fullPage: false });
    const nextGoalSeedPlanted = await page.evaluate(() => ({
      objective: document.querySelector('[data-testid="phaser-objective"]')?.textContent ?? "",
      railText: document.querySelector('[data-testid="phaser-action-rail"]')?.textContent ?? "",
      seeds: document.querySelector('[data-hud="seeds"]')?.textContent ?? "",
      researchClueGoalSurfaceVisible: window.__seedGardenResearchClueGoalSurfaceVisible ?? false,
      researchNextGoalSeedAvailable: window.__seedGardenResearchNextGoalSeedAvailable ?? false,
      researchNextGoalSeedClaimed: window.__seedGardenResearchNextGoalSeedClaimed ?? false,
      researchNextGoalSeedPlanted: window.__seedGardenResearchNextGoalSeedPlanted ?? false,
      plotStates: window.__seedGardenPlotStates ?? []
    }));
    for (let index = 0; index < 2; index += 1) {
      const careButton = page.getByRole("button", { name: "돌보기" });
      if ((await careButton.count()) > 0) {
        await careButton.click();
      }
    }
    await page.waitForTimeout(140);
    await page.screenshot({ path: `${OUT_DIR}/phaser-check-lunar-sprout-ready-393.png`, fullPage: false });
    const lunarSproutReady = await page.evaluate(() => ({
      objective: document.querySelector('[data-testid="phaser-objective"]')?.textContent ?? "",
      railText: document.querySelector('[data-testid="phaser-action-rail"]')?.textContent ?? "",
      plotStates: window.__seedGardenPlotStates ?? []
    }));
    await page.getByRole("button", { name: "수확" }).click();
    await page.waitForTimeout(140);
    await page.screenshot({ path: `${OUT_DIR}/phaser-check-lunar-sprout-harvested-393.png`, fullPage: false });
    const lunarSproutHarvested = await page.evaluate(() => ({
      objective: document.querySelector('[data-testid="phaser-objective"]')?.textContent ?? "",
      railText: document.querySelector('[data-testid="phaser-action-rail"]')?.textContent ?? "",
      researchNextGoalSeedHarvested: window.__seedGardenResearchNextGoalSeedHarvested ?? false,
      researchNextGoalRevealReady: window.__seedGardenResearchNextGoalRevealReady ?? false,
      plotStates: window.__seedGardenPlotStates ?? []
    }));
    await page.getByRole("button", { name: "발견 확인" }).click();
    await page.waitForTimeout(140);
    await page.screenshot({ path: `${OUT_DIR}/phaser-check-lunar-family-revealed-393.png`, fullPage: false });
    const lunarFamilyRevealed = await page.evaluate(() => ({
      objective: document.querySelector('[data-testid="phaser-objective"]')?.textContent ?? "",
      railText: document.querySelector('[data-testid="phaser-action-rail"]')?.textContent ?? "",
      researchNextGoalRevealReady: window.__seedGardenResearchNextGoalRevealReady ?? true,
      researchLunarFamilyRevealed: window.__seedGardenResearchLunarFamilyRevealed ?? false,
      expeditionGatePreviewVisible: window.__seedGardenExpeditionGatePreviewVisible ?? false,
      selectedText: document.querySelector(".selected-entity")?.textContent ?? "",
      facilityStates: window.__seedGardenFacilityStates ?? []
    }));
    await page.getByRole("button", { name: "원정 문 단서 보기" }).click();
    await page.waitForTimeout(140);
    await page.screenshot({ path: `${OUT_DIR}/phaser-check-expedition-gate-preview-393.png`, fullPage: false });
    const expeditionGatePreview = await page.evaluate(() => ({
      objective: document.querySelector('[data-testid="phaser-objective"]')?.textContent ?? "",
      railText: document.querySelector('[data-testid="phaser-action-rail"]')?.textContent ?? "",
      expeditionGatePreviewVisible: window.__seedGardenExpeditionGatePreviewVisible ?? false,
      expeditionState: window.__seedGardenExpeditionState ?? "",
      selectedText: document.querySelector(".selected-entity")?.textContent ?? "",
      previewSlotIds: window.__seedGardenPreviewSlotIds ?? [],
      facilityStates: window.__seedGardenFacilityStates ?? []
    }));
    await page.getByRole("button", { name: "틈새길 보내기" }).click();
    await page.waitForTimeout(80);
    await page.screenshot({ path: `${OUT_DIR}/phaser-check-expedition-traveling-393.png`, fullPage: false });
    const expeditionTraveling = await page.evaluate(() => ({
      objective: document.querySelector('[data-testid="phaser-objective"]')?.textContent ?? "",
      railText: document.querySelector('[data-testid="phaser-action-rail"]')?.textContent ?? "",
      expeditionState: window.__seedGardenExpeditionState ?? "",
      activeExpeditionRouteId: window.__seedGardenActiveExpeditionRouteId ?? "",
      expeditionRewardLeaves: window.__seedGardenExpeditionRewardLeaves ?? 0,
      unlockedSlotIds: window.__seedGardenUnlockedSlotIds ?? [],
      facilityStates: window.__seedGardenFacilityStates ?? [],
      actorIds: window.__seedGardenActorIds ?? [],
      receipts: window.__seedGardenReceipts ?? []
    }));
    await page.waitForTimeout(520);
    await page.screenshot({ path: `${OUT_DIR}/phaser-check-expedition-returned-393.png`, fullPage: false });
    const expeditionReturned = await page.evaluate(() => ({
      objective: document.querySelector('[data-testid="phaser-objective"]')?.textContent ?? "",
      railText: document.querySelector('[data-testid="phaser-action-rail"]')?.textContent ?? "",
      expeditionState: window.__seedGardenExpeditionState ?? "",
      activeExpeditionRouteId: window.__seedGardenActiveExpeditionRouteId ?? "",
      expeditionRewardLeaves: window.__seedGardenExpeditionRewardLeaves ?? 0,
      facilityStates: window.__seedGardenFacilityStates ?? [],
      receipts: window.__seedGardenReceipts ?? []
    }));
    await page.getByRole("button", { name: "귀환 상자 열기" }).click();
    await page.waitForTimeout(140);
    await page.screenshot({ path: `${OUT_DIR}/phaser-check-expedition-claimed-393.png`, fullPage: false });
    const expeditionClaimed = await page.evaluate(() => ({
      objective: document.querySelector('[data-testid="phaser-objective"]')?.textContent ?? "",
      railText: document.querySelector('[data-testid="phaser-action-rail"]')?.textContent ?? "",
      leaves: document.querySelector('[data-hud="leaves"]')?.textContent ?? "",
      expeditionState: window.__seedGardenExpeditionState ?? "",
      activeExpeditionRouteId: window.__seedGardenActiveExpeditionRouteId ?? "",
      expeditionRewardLeaves: window.__seedGardenExpeditionRewardLeaves ?? 0,
      expeditionSourceClueAvailable: window.__seedGardenExpeditionSourceClueAvailable ?? false,
      expeditionSourcePreviewVisible: window.__seedGardenExpeditionSourcePreviewVisible ?? false,
      nextExpeditionRoutePreviewId: window.__seedGardenNextExpeditionRoutePreviewId ?? "",
      lunarSourceSeedId: window.__seedGardenLunarSourceSeedId ?? "",
      facilityStates: window.__seedGardenFacilityStates ?? [],
      receipts: window.__seedGardenReceipts ?? []
    }));
    await page.getByRole("button", { name: "초승달순 단서 보기" }).click();
    await page.waitForTimeout(160);
    await page.screenshot({ path: `${OUT_DIR}/phaser-check-expedition-source-preview-393.png`, fullPage: false });
    const expeditionSourcePreview = await page.evaluate(() => ({
      objective: document.querySelector('[data-testid="phaser-objective"]')?.textContent ?? "",
      railText: document.querySelector('[data-testid="phaser-action-rail"]')?.textContent ?? "",
      expeditionState: window.__seedGardenExpeditionState ?? "",
      expeditionSourceClueAvailable: window.__seedGardenExpeditionSourceClueAvailable ?? false,
      expeditionSourcePreviewVisible: window.__seedGardenExpeditionSourcePreviewVisible ?? false,
      nextExpeditionRoutePreviewId: window.__seedGardenNextExpeditionRoutePreviewId ?? "",
      lunarSourceSeedId: window.__seedGardenLunarSourceSeedId ?? "",
      lunarSourceSeedAvailable: window.__seedGardenLunarSourceSeedAvailable ?? false,
      lunarSourceSeedPlanted: window.__seedGardenLunarSourceSeedPlanted ?? false,
      receipts: window.__seedGardenReceipts ?? []
    }));
    await clickUntilAction(page, [[204, 546], [204, 590], [132, 344]], "초승달순 심기");
    await page.waitForTimeout(140);
    await page.screenshot({ path: `${OUT_DIR}/phaser-check-lunar-source-action-393.png`, fullPage: false });
    const lunarSourceAction = await page.evaluate(() => ({
      objective: document.querySelector('[data-testid="phaser-objective"]')?.textContent ?? "",
      railText: document.querySelector('[data-testid="phaser-action-rail"]')?.textContent ?? "",
      lunarSourceSeedAvailable: window.__seedGardenLunarSourceSeedAvailable ?? false,
      lunarSourceSeedPlanted: window.__seedGardenLunarSourceSeedPlanted ?? false,
      selectedText: document.querySelector(".selected-entity")?.textContent ?? "",
      plotStates: window.__seedGardenPlotStates ?? []
    }));
    await page.getByRole("button", { name: "초승달순 심기" }).click();
    await page.waitForTimeout(160);
    await page.screenshot({ path: `${OUT_DIR}/phaser-check-lunar-source-planted-393.png`, fullPage: false });
    const lunarSourcePlanted = await page.evaluate(() => ({
      objective: document.querySelector('[data-testid="phaser-objective"]')?.textContent ?? "",
      railText: document.querySelector('[data-testid="phaser-action-rail"]')?.textContent ?? "",
      lunarSourceSeedAvailable: window.__seedGardenLunarSourceSeedAvailable ?? false,
      lunarSourceSeedPlanted: window.__seedGardenLunarSourceSeedPlanted ?? false,
      lunarSourceSeedHarvested: window.__seedGardenLunarSourceSeedHarvested ?? false,
      lunarSourceCreatureRevealed: window.__seedGardenLunarSourceCreatureRevealed ?? false,
      lunarSourceCreatureId: window.__seedGardenLunarSourceCreatureId ?? "",
      plotStates: window.__seedGardenPlotStates ?? [],
      receipts: window.__seedGardenReceipts ?? []
    }));
    await page.getByRole("button", { name: "돌보기" }).click();
    await page.waitForTimeout(120);
    await page.getByRole("button", { name: "돌보기" }).click();
    await page.waitForTimeout(160);
    await page.screenshot({ path: `${OUT_DIR}/phaser-check-lunar-source-ready-393.png`, fullPage: false });
    const lunarSourceReady = await page.evaluate(() => ({
      objective: document.querySelector('[data-testid="phaser-objective"]')?.textContent ?? "",
      railText: document.querySelector('[data-testid="phaser-action-rail"]')?.textContent ?? "",
      lunarSourceSeedHarvested: window.__seedGardenLunarSourceSeedHarvested ?? false,
      lunarSourceCreatureRevealed: window.__seedGardenLunarSourceCreatureRevealed ?? false,
      lunarSourceCreatureId: window.__seedGardenLunarSourceCreatureId ?? "",
      plotStates: window.__seedGardenPlotStates ?? [],
      receipts: window.__seedGardenReceipts ?? []
    }));
    await page.getByRole("button", { name: "초승달순 수확" }).click();
    await page.waitForTimeout(180);
    await page.screenshot({ path: `${OUT_DIR}/phaser-check-lunar-source-harvested-393.png`, fullPage: false });
    const lunarSourceHarvested = await page.evaluate(() => ({
      objective: document.querySelector('[data-testid="phaser-objective"]')?.textContent ?? "",
      railText: document.querySelector('[data-testid="phaser-action-rail"]')?.textContent ?? "",
      leaves: document.querySelector('[data-hud="leaves"]')?.textContent ?? "",
      lunarSourceSeedAvailable: window.__seedGardenLunarSourceSeedAvailable ?? false,
      lunarSourceSeedPlanted: window.__seedGardenLunarSourceSeedPlanted ?? false,
      lunarSourceSeedHarvested: window.__seedGardenLunarSourceSeedHarvested ?? false,
      lunarSourceCreatureRevealed: window.__seedGardenLunarSourceCreatureRevealed ?? false,
      lunarSourceCreatureId: window.__seedGardenLunarSourceCreatureId ?? "",
      nightGlassSourceSeedId: window.__seedGardenNightGlassSourceSeedId ?? "",
      nightGlassSourcePreviewAvailable: window.__seedGardenNightGlassSourcePreviewAvailable ?? false,
      nightGlassSourcePreviewVisible: window.__seedGardenNightGlassSourcePreviewVisible ?? false,
      nightGlassRoutePreviewId: window.__seedGardenNightGlassRoutePreviewId ?? "",
      plotStates: window.__seedGardenPlotStates ?? [],
      receipts: window.__seedGardenReceipts ?? []
    }));
    await page.getByRole("button", { name: "밤유리 source 보기" }).click();
    await page.waitForTimeout(180);
    await page.screenshot({ path: `${OUT_DIR}/phaser-check-night-glass-source-preview-393.png`, fullPage: false });
    const nightGlassSourcePreview = await page.evaluate(() => ({
      objective: document.querySelector('[data-testid="phaser-objective"]')?.textContent ?? "",
      railText: document.querySelector('[data-testid="phaser-action-rail"]')?.textContent ?? "",
      selectedText: document.querySelector(".selected-entity")?.textContent ?? "",
      nightGlassSourceSeedId: window.__seedGardenNightGlassSourceSeedId ?? "",
      nightGlassSourcePreviewAvailable: window.__seedGardenNightGlassSourcePreviewAvailable ?? false,
      nightGlassSourcePreviewVisible: window.__seedGardenNightGlassSourcePreviewVisible ?? false,
      nightGlassRoutePreviewId: window.__seedGardenNightGlassRoutePreviewId ?? "",
      nightGlassAcquisitionState: window.__seedGardenNightGlassAcquisitionState ?? "",
      nightGlassSourceSeedAvailable: window.__seedGardenNightGlassSourceSeedAvailable ?? false,
      nightGlassSourceAcquired: window.__seedGardenNightGlassSourceAcquired ?? false,
      nightGlassRewardLeaves: window.__seedGardenNightGlassRewardLeaves ?? 0,
      nightGlassSourceRenderedAssetKey: window.__seedGardenNightGlassSourceRenderedAssetKey ?? "",
      nightGlassSourceFxKey: window.__seedGardenNightGlassSourceFxKey ?? "",
      topologyAssets: window.__seedGardenTopologyAssets ?? [],
      receipts: window.__seedGardenReceipts ?? []
    }));
    await page.getByRole("button", { name: "밤유리 조사 보내기" }).click();
    await page.waitForTimeout(100);
    await page.screenshot({ path: `${OUT_DIR}/phaser-check-night-glass-traveling-393.png`, fullPage: false });
    const nightGlassTraveling = await page.evaluate(() => ({
      objective: document.querySelector('[data-testid="phaser-objective"]')?.textContent ?? "",
      railText: document.querySelector('[data-testid="phaser-action-rail"]')?.textContent ?? "",
      activeExpeditionRouteId: window.__seedGardenActiveExpeditionRouteId ?? "",
      expeditionState: window.__seedGardenExpeditionState ?? "",
      nightGlassAcquisitionState: window.__seedGardenNightGlassAcquisitionState ?? "",
      nightGlassRewardLeaves: window.__seedGardenNightGlassRewardLeaves ?? 0,
      facilityStates: window.__seedGardenFacilityStates ?? [],
      receipts: window.__seedGardenReceipts ?? []
    }));
    await page.waitForTimeout(520);
    await page.screenshot({ path: `${OUT_DIR}/phaser-check-night-glass-returned-393.png`, fullPage: false });
    const nightGlassReturned = await page.evaluate(() => ({
      objective: document.querySelector('[data-testid="phaser-objective"]')?.textContent ?? "",
      railText: document.querySelector('[data-testid="phaser-action-rail"]')?.textContent ?? "",
      activeExpeditionRouteId: window.__seedGardenActiveExpeditionRouteId ?? "",
      expeditionState: window.__seedGardenExpeditionState ?? "",
      nightGlassAcquisitionState: window.__seedGardenNightGlassAcquisitionState ?? "",
      nightGlassRewardLeaves: window.__seedGardenNightGlassRewardLeaves ?? 0,
      facilityStates: window.__seedGardenFacilityStates ?? [],
      receipts: window.__seedGardenReceipts ?? []
    }));
    await page.getByRole("button", { name: "밤유리 귀환 상자 열기" }).click();
    await page.waitForTimeout(180);
    await page.screenshot({ path: `${OUT_DIR}/phaser-check-night-glass-source-acquired-393.png`, fullPage: false });
    const nightGlassAcquired = await page.evaluate(() => ({
      objective: document.querySelector('[data-testid="phaser-objective"]')?.textContent ?? "",
      railText: document.querySelector('[data-testid="phaser-action-rail"]')?.textContent ?? "",
      leaves: document.querySelector('[data-hud="leaves"]')?.textContent ?? "",
      activeExpeditionRouteId: window.__seedGardenActiveExpeditionRouteId ?? "",
      expeditionState: window.__seedGardenExpeditionState ?? "",
      nightGlassAcquisitionState: window.__seedGardenNightGlassAcquisitionState ?? "",
      nightGlassSourceSeedAvailable: window.__seedGardenNightGlassSourceSeedAvailable ?? false,
      nightGlassSourceSeedPlanted: window.__seedGardenNightGlassSourceSeedPlanted ?? false,
      nightGlassSourceAcquired: window.__seedGardenNightGlassSourceAcquired ?? false,
      nightGlassRewardLeaves: window.__seedGardenNightGlassRewardLeaves ?? 0,
      nightGlassSourceRenderedAssetKey: window.__seedGardenNightGlassSourceRenderedAssetKey ?? "",
      nightGlassSourceFxKey: window.__seedGardenNightGlassSourceFxKey ?? "",
      facilityStates: window.__seedGardenFacilityStates ?? [],
      plotStates: window.__seedGardenPlotStates ?? [],
      receipts: window.__seedGardenReceipts ?? []
    }));
    await clickUntilAction(page, [[204, 546], [132, 344], [262, 396]], "밤유리 심기");
    await page.screenshot({ path: `${OUT_DIR}/phaser-check-night-glass-plant-action-393.png`, fullPage: false });
    const nightGlassPlantAction = await page.evaluate(() => ({
      objective: document.querySelector('[data-testid="phaser-objective"]')?.textContent ?? "",
      railText: document.querySelector('[data-testid="phaser-action-rail"]')?.textContent ?? "",
      selectedText: document.querySelector(".selected-entity")?.textContent ?? "",
      nightGlassSourceSeedAvailable: window.__seedGardenNightGlassSourceSeedAvailable ?? false,
      nightGlassSourceSeedPlanted: window.__seedGardenNightGlassSourceSeedPlanted ?? false,
      nightGlassSourceAcquired: window.__seedGardenNightGlassSourceAcquired ?? false,
      plotStates: window.__seedGardenPlotStates ?? [],
      receipts: window.__seedGardenReceipts ?? []
    }));
    await page.getByRole("button", { name: "밤유리 심기" }).click();
    await page.waitForTimeout(180);
    await page.screenshot({ path: `${OUT_DIR}/phaser-check-night-glass-planted-393.png`, fullPage: false });
    const nightGlassPlanted = await page.evaluate(() => ({
      objective: document.querySelector('[data-testid="phaser-objective"]')?.textContent ?? "",
      railText: document.querySelector('[data-testid="phaser-action-rail"]')?.textContent ?? "",
      selectedText: document.querySelector(".selected-entity")?.textContent ?? "",
      nightGlassAcquisitionState: window.__seedGardenNightGlassAcquisitionState ?? "",
      nightGlassSourceSeedAvailable: window.__seedGardenNightGlassSourceSeedAvailable ?? false,
      nightGlassSourceSeedPlanted: window.__seedGardenNightGlassSourceSeedPlanted ?? false,
      nightGlassSourceAcquired: window.__seedGardenNightGlassSourceAcquired ?? false,
      nightGlassSourceRenderedAssetKey: window.__seedGardenNightGlassSourceRenderedAssetKey ?? "",
      plotStates: window.__seedGardenPlotStates ?? [],
      receipts: window.__seedGardenReceipts ?? []
    }));
    await page.getByRole("button", { name: "돌보기" }).click();
    await page.waitForTimeout(120);
    await page.getByRole("button", { name: "돌보기" }).click();
    await page.waitForTimeout(120);
    await page.getByRole("button", { name: "돌보기" }).click();
    await page.waitForTimeout(180);
    await page.screenshot({ path: `${OUT_DIR}/phaser-check-night-glass-ready-393.png`, fullPage: false });
    const nightGlassReady = await page.evaluate(() => ({
      objective: document.querySelector('[data-testid="phaser-objective"]')?.textContent ?? "",
      railText: document.querySelector('[data-testid="phaser-action-rail"]')?.textContent ?? "",
      selectedText: document.querySelector(".selected-entity")?.textContent ?? "",
      nightGlassSourceSeedAvailable: window.__seedGardenNightGlassSourceSeedAvailable ?? false,
      nightGlassSourceSeedPlanted: window.__seedGardenNightGlassSourceSeedPlanted ?? false,
      nightGlassSourceSeedHarvested: window.__seedGardenNightGlassSourceSeedHarvested ?? false,
      nightGlassRareCreatureRevealed: window.__seedGardenNightGlassRareCreatureRevealed ?? false,
      nightGlassRareCreatureId: window.__seedGardenNightGlassRareCreatureId ?? "",
      plotStates: window.__seedGardenPlotStates ?? [],
      receipts: window.__seedGardenReceipts ?? []
    }));
    await page.getByRole("button", { name: "밤유리 수확" }).click();
    await page.waitForTimeout(220);
    await page.screenshot({ path: `${OUT_DIR}/phaser-check-night-glass-revealed-393.png`, fullPage: false });
    const nightGlassRevealed = await page.evaluate(() => ({
      objective: document.querySelector('[data-testid="phaser-objective"]')?.textContent ?? "",
      railText: document.querySelector('[data-testid="phaser-action-rail"]')?.textContent ?? "",
      leaves: document.querySelector('[data-hud="leaves"]')?.textContent ?? "",
      selectedText: document.querySelector(".selected-entity")?.textContent ?? "",
      nightGlassSourceSeedAvailable: window.__seedGardenNightGlassSourceSeedAvailable ?? false,
      nightGlassSourceSeedPlanted: window.__seedGardenNightGlassSourceSeedPlanted ?? false,
      nightGlassSourceSeedHarvested: window.__seedGardenNightGlassSourceSeedHarvested ?? false,
      nightGlassRareCreatureRevealed: window.__seedGardenNightGlassRareCreatureRevealed ?? false,
      nightGlassRareCreatureId: window.__seedGardenNightGlassRareCreatureId ?? "",
      nightGlassRareCreatureName: window.__seedGardenNightGlassRareCreatureName ?? "",
      nightGlassOroActorJoined: window.__seedGardenNightGlassOroActorJoined ?? false,
      nightGlassOroRouteHandoffVisible: window.__seedGardenNightGlassOroRouteHandoffVisible ?? false,
      nightGlassOroRouteActionAvailable: window.__seedGardenNightGlassOroRouteActionAvailable ?? false,
      moonFenceRoutePreviewVisible: window.__seedGardenMoonFenceRoutePreviewVisible ?? false,
      moonFenceRouteInspected: window.__seedGardenMoonFenceRouteInspected ?? false,
      moonFenceRequirementSurfaceVisible: window.__seedGardenMoonFenceRequirementSurfaceVisible ?? false,
      moonFenceRequirementsInspected: window.__seedGardenMoonFenceRequirementsInspected ?? false,
      moonFenceRequiredClues: window.__seedGardenMoonFenceRequiredClues ?? 0,
      moonFenceCurrentClues: window.__seedGardenMoonFenceCurrentClues ?? 0,
      moonFenceRequiredMaterials: window.__seedGardenMoonFenceRequiredMaterials ?? 0,
      moonFenceCurrentMaterials: window.__seedGardenMoonFenceCurrentMaterials ?? 0,
      moonFenceRequiredExplorerId: window.__seedGardenMoonFenceRequiredExplorerId ?? "",
      nextRareRoutePreviewId: window.__seedGardenNextRareRoutePreviewId ?? "",
      nightGlassSourceRenderedAssetKey: window.__seedGardenNightGlassSourceRenderedAssetKey ?? "",
      nightGlassSourceFxKey: window.__seedGardenNightGlassSourceFxKey ?? "",
      actorIds: window.__seedGardenActorIds ?? [],
      plotStates: window.__seedGardenPlotStates ?? [],
      receipts: window.__seedGardenReceipts ?? []
    }));
    await page.waitForTimeout(160);
    await page.screenshot({ path: `${OUT_DIR}/phaser-check-night-glass-oro-handoff-393.png`, fullPage: false });
    await clickUntilAction(page, [[204, 546], [262, 396], [304, 502], [120, 500]], "월정 문 단서 보기");
    await page.getByRole("button", { name: "월정 문 단서 보기" }).click();
    await page.waitForTimeout(180);
    const moonFenceRoute = await page.evaluate(() => ({
      objective: document.querySelector('[data-testid="phaser-objective"]')?.textContent ?? "",
      railText: document.querySelector('[data-testid="phaser-action-rail"]')?.textContent ?? "",
      selectedText: document.querySelector(".selected-entity")?.textContent ?? "",
      nightGlassOroActorJoined: window.__seedGardenNightGlassOroActorJoined ?? false,
      nightGlassOroRouteActionAvailable: window.__seedGardenNightGlassOroRouteActionAvailable ?? false,
      moonFenceRoutePreviewVisible: window.__seedGardenMoonFenceRoutePreviewVisible ?? false,
      moonFenceRouteInspected: window.__seedGardenMoonFenceRouteInspected ?? false,
      nextRareRoutePreviewId: window.__seedGardenNextRareRoutePreviewId ?? "",
      actorIds: window.__seedGardenActorIds ?? [],
      receipts: window.__seedGardenReceipts ?? []
    }));
    await page.waitForTimeout(160);
    await page.screenshot({ path: `${OUT_DIR}/phaser-check-moon-fence-route-action-393.png`, fullPage: false });
    await page.getByRole("button", { name: "개방 조건 보기" }).click();
    await page.waitForTimeout(180);
    const moonFenceRequirements = await page.evaluate(() => ({
      objective: document.querySelector('[data-testid="phaser-objective"]')?.textContent ?? "",
      railText: document.querySelector('[data-testid="phaser-action-rail"]')?.textContent ?? "",
      selectedText: document.querySelector(".selected-entity")?.textContent ?? "",
      moonFenceRoutePreviewVisible: window.__seedGardenMoonFenceRoutePreviewVisible ?? false,
      moonFenceRouteInspected: window.__seedGardenMoonFenceRouteInspected ?? false,
      moonFenceRequirementSurfaceVisible: window.__seedGardenMoonFenceRequirementSurfaceVisible ?? false,
      moonFenceRequirementsInspected: window.__seedGardenMoonFenceRequirementsInspected ?? false,
      moonFenceRequiredClues: window.__seedGardenMoonFenceRequiredClues ?? 0,
      moonFenceCurrentClues: window.__seedGardenMoonFenceCurrentClues ?? 0,
      moonFenceRequiredMaterials: window.__seedGardenMoonFenceRequiredMaterials ?? 0,
      moonFenceCurrentMaterials: window.__seedGardenMoonFenceCurrentMaterials ?? 0,
      moonFencePrepDeliveryAvailable: window.__seedGardenMoonFencePrepDeliveryAvailable ?? false,
      moonFencePrepDeliveryCompleted: window.__seedGardenMoonFencePrepDeliveryCompleted ?? false,
      moonFencePrepDeliveryCrateVisible: window.__seedGardenMoonFencePrepDeliveryCrateVisible ?? false,
      moonFenceMaterialsReady: window.__seedGardenMoonFenceMaterialsReady ?? false,
      moonFenceSecondClueAvailable: window.__seedGardenMoonFenceSecondClueAvailable ?? false,
      moonFenceSecondCluePackaged: window.__seedGardenMoonFenceSecondCluePackaged ?? false,
      moonFenceClueStampVisible: window.__seedGardenMoonFenceClueStampVisible ?? false,
      moonFenceCluesReady: window.__seedGardenMoonFenceCluesReady ?? false,
      moonFenceRequiredExplorerId: window.__seedGardenMoonFenceRequiredExplorerId ?? "",
      receipts: window.__seedGardenReceipts ?? []
    }));
    await page.screenshot({ path: `${OUT_DIR}/phaser-check-moon-fence-requirements-393.png`, fullPage: false });
    await page.getByRole("button", { name: "월정 문 준비 납품" }).click();
    await page.waitForTimeout(180);
    const moonFencePrepDelivery = await page.evaluate(() => ({
      objective: document.querySelector('[data-testid="phaser-objective"]')?.textContent ?? "",
      railText: document.querySelector('[data-testid="phaser-action-rail"]')?.textContent ?? "",
      selectedText: document.querySelector(".selected-entity")?.textContent ?? "",
      moonFenceRoutePreviewVisible: window.__seedGardenMoonFenceRoutePreviewVisible ?? false,
      moonFenceRouteInspected: window.__seedGardenMoonFenceRouteInspected ?? false,
      moonFenceRequirementSurfaceVisible: window.__seedGardenMoonFenceRequirementSurfaceVisible ?? false,
      moonFenceRequirementsInspected: window.__seedGardenMoonFenceRequirementsInspected ?? false,
      moonFenceRequiredClues: window.__seedGardenMoonFenceRequiredClues ?? 0,
      moonFenceCurrentClues: window.__seedGardenMoonFenceCurrentClues ?? 0,
      moonFenceRequiredMaterials: window.__seedGardenMoonFenceRequiredMaterials ?? 0,
      moonFenceCurrentMaterials: window.__seedGardenMoonFenceCurrentMaterials ?? 0,
      moonFencePrepDeliveryAvailable: window.__seedGardenMoonFencePrepDeliveryAvailable ?? false,
      moonFencePrepDeliveryCompleted: window.__seedGardenMoonFencePrepDeliveryCompleted ?? false,
      moonFencePrepDeliveryCrateVisible: window.__seedGardenMoonFencePrepDeliveryCrateVisible ?? false,
      moonFenceMaterialsReady: window.__seedGardenMoonFenceMaterialsReady ?? false,
      moonFenceSecondClueAvailable: window.__seedGardenMoonFenceSecondClueAvailable ?? false,
      moonFenceSecondCluePackaged: window.__seedGardenMoonFenceSecondCluePackaged ?? false,
      moonFenceClueStampVisible: window.__seedGardenMoonFenceClueStampVisible ?? false,
      moonFenceCluesReady: window.__seedGardenMoonFenceCluesReady ?? false,
      moonFenceRequiredExplorerId: window.__seedGardenMoonFenceRequiredExplorerId ?? "",
      receipts: window.__seedGardenReceipts ?? []
    }));
    await page.screenshot({ path: `${OUT_DIR}/phaser-check-moon-fence-prep-delivery-393.png`, fullPage: false });
    await page.getByRole("button", { name: "달빛 단서 포장" }).click();
    await page.waitForTimeout(180);
    const moonFenceSecondClue = await page.evaluate(() => ({
      objective: document.querySelector('[data-testid="phaser-objective"]')?.textContent ?? "",
      railText: document.querySelector('[data-testid="phaser-action-rail"]')?.textContent ?? "",
      selectedText: document.querySelector(".selected-entity")?.textContent ?? "",
      moonFenceRoutePreviewVisible: window.__seedGardenMoonFenceRoutePreviewVisible ?? false,
      moonFenceRouteInspected: window.__seedGardenMoonFenceRouteInspected ?? false,
      moonFenceRequirementSurfaceVisible: window.__seedGardenMoonFenceRequirementSurfaceVisible ?? false,
      moonFenceRequirementsInspected: window.__seedGardenMoonFenceRequirementsInspected ?? false,
      moonFenceRequiredClues: window.__seedGardenMoonFenceRequiredClues ?? 0,
      moonFenceCurrentClues: window.__seedGardenMoonFenceCurrentClues ?? 0,
      moonFenceRequiredMaterials: window.__seedGardenMoonFenceRequiredMaterials ?? 0,
      moonFenceCurrentMaterials: window.__seedGardenMoonFenceCurrentMaterials ?? 0,
      moonFencePrepDeliveryCompleted: window.__seedGardenMoonFencePrepDeliveryCompleted ?? false,
      moonFencePrepDeliveryCrateVisible: window.__seedGardenMoonFencePrepDeliveryCrateVisible ?? false,
      moonFenceMaterialsReady: window.__seedGardenMoonFenceMaterialsReady ?? false,
      moonFenceSecondClueAvailable: window.__seedGardenMoonFenceSecondClueAvailable ?? false,
      moonFenceSecondCluePackaged: window.__seedGardenMoonFenceSecondCluePackaged ?? false,
      moonFenceClueStampVisible: window.__seedGardenMoonFenceClueStampVisible ?? false,
      moonFenceCluesReady: window.__seedGardenMoonFenceCluesReady ?? false,
      moonFenceRequiredExplorerId: window.__seedGardenMoonFenceRequiredExplorerId ?? "",
      receipts: window.__seedGardenReceipts ?? []
    }));
    await page.screenshot({ path: `${OUT_DIR}/phaser-check-moon-fence-second-clue-393.png`, fullPage: false });

    const evidence = await page.evaluate(() => ({
      objective: document.querySelector('[data-testid="phaser-objective"]')?.textContent ?? "",
      railText: document.querySelector('[data-testid="phaser-action-rail"]')?.textContent ?? "",
      leaves: document.querySelector('[data-hud="leaves"]')?.textContent ?? "",
      seeds: document.querySelector('[data-hud="seeds"]')?.textContent ?? "",
      bodyScrollHeight: document.body.scrollHeight,
      documentScrollHeight: document.documentElement.scrollHeight,
      innerHeight: window.innerHeight,
      canvasCount: document.querySelectorAll("canvas").length,
      topologyAssets: window.__seedGardenTopologyAssets ?? [],
      actorIds: window.__seedGardenActorIds ?? [],
      orderCrateProgress: window.__seedGardenOrderCrateProgress ?? 0,
      completedDeliveries: window.__seedGardenCompletedDeliveries ?? 0,
      storageCapacity: window.__seedGardenStorageCapacity ?? 0,
      storedLeaves: window.__seedGardenStoredLeaves ?? 0,
      storageFillRatio: window.__seedGardenStorageFillRatio ?? 0,
      researchShelfPreviewSeen: window.__seedGardenResearchShelfPreviewSeen ?? false,
      researchClueSeedAvailable: window.__seedGardenResearchClueSeedAvailable ?? false,
      researchClueSeedPlanted: window.__seedGardenResearchClueSeedPlanted ?? false,
      researchClueHarvested: window.__seedGardenResearchClueHarvested ?? false,
      researchClueRecordReady: window.__seedGardenResearchClueRecordReady ?? false,
      researchClueAlbumRecorded: window.__seedGardenResearchClueAlbumRecorded ?? false,
      researchClueGoalSurfaceVisible: window.__seedGardenResearchClueGoalSurfaceVisible ?? false,
      researchNextGoalSeedAvailable: window.__seedGardenResearchNextGoalSeedAvailable ?? false,
      researchNextGoalSeedClaimed: window.__seedGardenResearchNextGoalSeedClaimed ?? false,
      researchNextGoalSeedPlanted: window.__seedGardenResearchNextGoalSeedPlanted ?? false,
      researchNextGoalSeedHarvested: window.__seedGardenResearchNextGoalSeedHarvested ?? false,
      researchNextGoalRevealReady: window.__seedGardenResearchNextGoalRevealReady ?? false,
      researchLunarFamilyRevealed: window.__seedGardenResearchLunarFamilyRevealed ?? false,
      expeditionGatePreviewVisible: window.__seedGardenExpeditionGatePreviewVisible ?? false,
      expeditionState: window.__seedGardenExpeditionState ?? "",
      activeExpeditionRouteId: window.__seedGardenActiveExpeditionRouteId ?? "",
      expeditionRewardLeaves: window.__seedGardenExpeditionRewardLeaves ?? 0,
      expeditionSourceClueAvailable: window.__seedGardenExpeditionSourceClueAvailable ?? false,
      expeditionSourcePreviewVisible: window.__seedGardenExpeditionSourcePreviewVisible ?? false,
      nextExpeditionRoutePreviewId: window.__seedGardenNextExpeditionRoutePreviewId ?? "",
      lunarSourceSeedId: window.__seedGardenLunarSourceSeedId ?? "",
      lunarSourceSeedAvailable: window.__seedGardenLunarSourceSeedAvailable ?? false,
      lunarSourceSeedPlanted: window.__seedGardenLunarSourceSeedPlanted ?? false,
      lunarSourceSeedHarvested: window.__seedGardenLunarSourceSeedHarvested ?? false,
      lunarSourceCreatureRevealed: window.__seedGardenLunarSourceCreatureRevealed ?? false,
      lunarSourceCreatureId: window.__seedGardenLunarSourceCreatureId ?? "",
      nightGlassSourceSeedId: window.__seedGardenNightGlassSourceSeedId ?? "",
      nightGlassSourcePreviewAvailable: window.__seedGardenNightGlassSourcePreviewAvailable ?? false,
      nightGlassSourcePreviewVisible: window.__seedGardenNightGlassSourcePreviewVisible ?? false,
      nightGlassRoutePreviewId: window.__seedGardenNightGlassRoutePreviewId ?? "",
      nightGlassAcquisitionState: window.__seedGardenNightGlassAcquisitionState ?? "",
      nightGlassSourceSeedAvailable: window.__seedGardenNightGlassSourceSeedAvailable ?? false,
      nightGlassSourceSeedPlanted: window.__seedGardenNightGlassSourceSeedPlanted ?? false,
      nightGlassSourceSeedHarvested: window.__seedGardenNightGlassSourceSeedHarvested ?? false,
      nightGlassSourceAcquired: window.__seedGardenNightGlassSourceAcquired ?? false,
      nightGlassRareCreatureRevealed: window.__seedGardenNightGlassRareCreatureRevealed ?? false,
      nightGlassRareCreatureId: window.__seedGardenNightGlassRareCreatureId ?? "",
      nightGlassRareCreatureName: window.__seedGardenNightGlassRareCreatureName ?? "",
      nightGlassOroActorJoined: window.__seedGardenNightGlassOroActorJoined ?? false,
      nightGlassOroRouteHandoffVisible: window.__seedGardenNightGlassOroRouteHandoffVisible ?? false,
      nightGlassOroRouteActionAvailable: window.__seedGardenNightGlassOroRouteActionAvailable ?? false,
      moonFenceRoutePreviewVisible: window.__seedGardenMoonFenceRoutePreviewVisible ?? false,
      moonFenceRouteInspected: window.__seedGardenMoonFenceRouteInspected ?? false,
      moonFenceRequirementSurfaceVisible: window.__seedGardenMoonFenceRequirementSurfaceVisible ?? false,
      moonFenceRequirementsInspected: window.__seedGardenMoonFenceRequirementsInspected ?? false,
      moonFenceRequiredClues: window.__seedGardenMoonFenceRequiredClues ?? 0,
      moonFenceCurrentClues: window.__seedGardenMoonFenceCurrentClues ?? 0,
      moonFenceRequiredMaterials: window.__seedGardenMoonFenceRequiredMaterials ?? 0,
      moonFenceCurrentMaterials: window.__seedGardenMoonFenceCurrentMaterials ?? 0,
      moonFencePrepDeliveryAvailable: window.__seedGardenMoonFencePrepDeliveryAvailable ?? false,
      moonFencePrepDeliveryCompleted: window.__seedGardenMoonFencePrepDeliveryCompleted ?? false,
      moonFencePrepDeliveryCrateVisible: window.__seedGardenMoonFencePrepDeliveryCrateVisible ?? false,
      moonFenceMaterialsReady: window.__seedGardenMoonFenceMaterialsReady ?? false,
      moonFenceSecondClueAvailable: window.__seedGardenMoonFenceSecondClueAvailable ?? false,
      moonFenceSecondCluePackaged: window.__seedGardenMoonFenceSecondCluePackaged ?? false,
      moonFenceClueStampVisible: window.__seedGardenMoonFenceClueStampVisible ?? false,
      moonFenceCluesReady: window.__seedGardenMoonFenceCluesReady ?? false,
      moonFenceRequiredExplorerId: window.__seedGardenMoonFenceRequiredExplorerId ?? "",
      nextRareRoutePreviewId: window.__seedGardenNextRareRoutePreviewId ?? "",
      nightGlassRewardLeaves: window.__seedGardenNightGlassRewardLeaves ?? 0,
      nightGlassSourceRenderedAssetKey: window.__seedGardenNightGlassSourceRenderedAssetKey ?? "",
      nightGlassSourceFxKey: window.__seedGardenNightGlassSourceFxKey ?? "",
      unlockedSlotIds: window.__seedGardenUnlockedSlotIds ?? [],
      previewSlotIds: window.__seedGardenPreviewSlotIds ?? [],
      facilityStates: window.__seedGardenFacilityStates ?? [],
      plotIds: window.__seedGardenPlotIds ?? [],
      plotStates: window.__seedGardenPlotStates ?? [],
      receipts: window.__seedGardenReceipts ?? []
    }));

    await browser.close();

    const failures = [];
    if (evidence.canvasCount !== 1) failures.push("expected one Phaser canvas");
    if (overviewMode.viewMode !== "overview") failures.push(`expected overview view mode, got ${overviewMode.viewMode}`);
    if (overviewMode.hudCollapsed !== true) failures.push("overview mode did not collapse HUD");
    if (overviewMode.actionRailDisplay !== "none") {
      failures.push(`expected overview action rail hidden, got ${overviewMode.actionRailDisplay}`);
    }
    if (overviewMode.objectiveDisplay !== "none") {
      failures.push(`expected overview objective hidden, got ${overviewMode.objectiveDisplay}`);
    }
    if (overviewMode.buttonText !== "관리") failures.push(`expected overview toggle to show 관리, got ${overviewMode.buttonText}`);
    if (manageReturn.viewMode !== "manage") failures.push(`expected manage return mode, got ${manageReturn.viewMode}`);
    if (manageReturn.hudCollapsed !== false) failures.push("manage return still reports HUD collapsed");
    if (manageReturn.actionRailDisplay === "none") failures.push("manage return action rail stayed hidden");
    if (manageReturn.buttonText !== "감상") failures.push(`expected manage toggle to show 감상, got ${manageReturn.buttonText}`);
    if (
      overviewMode.bodyScrollHeight > overviewMode.innerHeight ||
      overviewMode.documentScrollHeight > overviewMode.innerHeight
    ) {
      failures.push("overview mode has body/document scroll");
    }
    if (evidence.leaves !== "299") failures.push(`expected 299 leaves after night glass rare reveal, got ${evidence.leaves}`);
    if (evidence.seeds !== "0") failures.push(`expected rewarded third-plot seed planted and spent, got ${evidence.seeds}`);
    if (!evidence.receipts.some((receipt) => receipt.includes("주문 상자 납품"))) {
      failures.push("missing order crate delivery receipt");
    }
    if (!evidence.actorIds.includes("actor_pori")) failures.push("missing Pori actor after harvest");
    if (!evidence.actorIds.includes("actor_momo")) failures.push("missing Momo carrier after workbench claim");
    if (evidence.orderCrateProgress !== 25) {
      failures.push(`expected order crate progress 25 after storage fill claim, got ${evidence.orderCrateProgress}`);
    }
    if (evidence.completedDeliveries !== 2) {
      failures.push(`expected two completed deliveries, got ${evidence.completedDeliveries}`);
    }
    if (!evidence.receipts.some((receipt) => receipt.includes("3번 밭 확장"))) {
      failures.push("missing third plot expansion receipt");
    }
    if (!evidence.receipts.some((receipt) => receipt.includes("말랑잎 씨앗을 심었다"))) {
      failures.push("missing third plot planting receipt");
    }
    if (!evidence.receipts.some((receipt) => receipt.includes("3번 햇살 밭 수확"))) {
      failures.push("missing third plot repeat harvest receipt");
    }
    if (!evidence.receipts.some((receipt) => receipt.includes("반복 주문 납품 #2"))) {
      failures.push("missing repeat order delivery receipt");
    }
    if (!evidence.receipts.some((receipt) => receipt.includes("보관 바구니 정리"))) {
      failures.push("missing storage unlock receipt");
    }
    if (!evidence.receipts.some((receipt) => receipt.includes("보관 +4/24"))) {
      failures.push("missing storage fill receipt");
    }
    if (storageBeforeClaim.storedLeaves !== 4) {
      failures.push(`expected stored leaves 4 before claim, got ${storageBeforeClaim.storedLeaves}`);
    }
    if (Math.abs(storageBeforeClaim.storageFillRatio - 4 / 24) > 0.001) {
      failures.push(`expected storage fill ratio 4/24 before claim, got ${storageBeforeClaim.storageFillRatio}`);
    }
    if (!storageBeforeClaim.railText.includes("회수")) failures.push("missing storage claim action before claim");
    if (!evidence.receipts.some((receipt) => receipt.includes("오프라인 보관 회수 · 잎 +4"))) {
      failures.push("missing storage claim receipt");
    }
    if (!evidence.receipts.some((receipt) => receipt.includes("연구 선반 살펴보기"))) {
      failures.push("missing research shelf preview receipt");
    }
    if (!clueBeforePlant.researchClueSeedAvailable) failures.push("research clue seed was not available before planting");
    if (!evidence.researchShelfPreviewSeen) failures.push("research shelf preview was not marked seen");
    if (!evidence.researchClueSeedPlanted) failures.push("research clue seed was not marked planted");
    if (!evidence.researchClueHarvested) failures.push("research clue seed was not harvested");
    if (evidence.researchClueSeedAvailable) failures.push("research clue seed remained available after planting");
    if (!clueBeforeRecord.researchClueRecordReady) failures.push("research clue record was not ready after harvest");
    if (!clueBeforeRecord.railText.includes("도감 기록")) failures.push("missing album record action after clue harvest");
    if (!evidence.researchClueAlbumRecorded) failures.push("research clue was not recorded in album");
    if (evidence.researchClueRecordReady) failures.push("research clue record stayed ready after album record");
    if (!clueGoalSurface.researchClueGoalSurfaceVisible) failures.push("research clue goal surface telemetry was not visible");
    if (!clueGoalSurface.researchClueGoalSurfaceVisible) failures.push("research clue goal surface snapshot missed telemetry");
    if (!clueGoalSurface.railText.includes("달빛 단서 기록됨")) failures.push("missing recorded clue goal surface text");
    if (!clueGoalSurface.railText.includes("다음 씨앗 목표")) failures.push("missing next seed goal text in action rail");
    if (!clueGoalSurface.railText.includes("목표 씨앗 받기")) failures.push("missing next goal seed claim action");
    if (!clueGoalSurface.objective.includes("다음 씨앗 목표")) failures.push("missing next seed goal objective");
    if (!nextGoalSeedClaimed.researchNextGoalSeedClaimed) failures.push("next goal seed was not marked claimed");
    if (!nextGoalSeedClaimed.researchNextGoalSeedAvailable) failures.push("next goal seed was not available after claim");
    if (!nextGoalSeedClaimed.railText.includes("목표 심기")) failures.push("missing next goal seed planting action");
    if (nextGoalSeedClaimed.seeds !== "1") failures.push(`expected one next-goal seed after claim, got ${nextGoalSeedClaimed.seeds}`);
    if (!nextGoalSeedPlanted.researchNextGoalSeedPlanted) failures.push("next goal seed was not marked planted");
    if (nextGoalSeedPlanted.researchNextGoalSeedAvailable) failures.push("next goal seed stayed available after planting");
    if (nextGoalSeedPlanted.researchClueGoalSurfaceVisible) failures.push("goal surface stayed visible after next goal planting");
    if (!nextGoalSeedPlanted.objective.includes("달빛 새싹 목표 재배 중")) {
      failures.push("missing next goal planting objective");
    }
    const lunarReadyPlot = lunarSproutReady.plotStates.find((plot) => plot.slotId === "plot_03");
    if (!lunarReadyPlot || lunarReadyPlot.state !== "ready" || lunarReadyPlot.seedId !== "seed_lunar_sprout_001") {
      failures.push(`expected lunar sprout ready on plot_03, got ${JSON.stringify(lunarReadyPlot)}`);
    }
    if (!lunarSproutReady.objective.includes("달빛 새싹 수확")) {
      failures.push("missing lunar sprout ready objective");
    }
    if (!lunarSproutHarvested.researchNextGoalSeedHarvested) {
      failures.push("lunar sprout harvest telemetry missing");
    }
    if (!lunarSproutHarvested.researchNextGoalRevealReady) {
      failures.push("lunar sprout reveal-ready telemetry missing");
    }
    if (!lunarSproutHarvested.objective.includes("다음 씨앗 family reveal")) {
      failures.push("missing lunar sprout reveal-ready objective");
    }
    if (!lunarSproutHarvested.railText.includes("달빛 새싹 수확됨")) {
      failures.push("missing lunar sprout reveal surface");
    }
    if (!lunarSproutHarvested.railText.includes("다음 발견 준비 완료")) {
      failures.push("missing next discovery ready text");
    }
    if (!lunarSproutHarvested.railText.includes("발견 확인")) {
      failures.push("missing discovery confirm action");
    }
    if (lunarFamilyRevealed.researchNextGoalRevealReady) {
      failures.push("reveal-ready stayed true after discovery confirm");
    }
    if (!lunarFamilyRevealed.researchLunarFamilyRevealed) {
      failures.push("lunar family reveal telemetry missing");
    }
    if (!lunarFamilyRevealed.objective.includes("달빛 family reveal 완료")) {
      failures.push("missing lunar family reveal objective");
    }
    if (!lunarFamilyRevealed.railText.includes("달빛 family reveal")) {
      failures.push("missing lunar family reveal surface");
    }
    if (!lunarFamilyRevealed.railText.includes("다음 연구 목표")) {
      failures.push("missing next research goal text");
    }
    if (!lunarFamilyRevealed.railText.includes("원정 문 단서 보기")) {
      failures.push("missing expedition preview action after lunar family reveal");
    }
    if (lunarFamilyRevealed.selectedText !== "연구 선반") {
      failures.push(`expected research shelf selected after discovery confirm, got ${lunarFamilyRevealed.selectedText}`);
    }
    if (lunarFamilyRevealed.expeditionGatePreviewVisible) {
      failures.push("expedition gate preview was visible before preview action");
    }
    if (!expeditionGatePreview.expeditionGatePreviewVisible) {
      failures.push("expedition gate preview telemetry missing");
    }
    if (expeditionGatePreview.expeditionState !== "ready") {
      failures.push(`expected expedition ready after preview, got ${expeditionGatePreview.expeditionState}`);
    }
    if (expeditionGatePreview.selectedText !== "원정 문") {
      failures.push(`expected expedition gate selected after preview action, got ${expeditionGatePreview.selectedText}`);
    }
    if (!expeditionGatePreview.previewSlotIds.includes("facility_expedition_gate")) {
      failures.push("expedition gate preview slot missing");
    }
    const expeditionGate = expeditionGatePreview.facilityStates.find(
      (facility) => facility.slotId === "facility_expedition_gate"
    );
    if (!expeditionGate || expeditionGate.kind !== "expedition_gate" || expeditionGate.visualState !== "preview") {
      failures.push(`expected expedition gate preview facility, got ${JSON.stringify(expeditionGate)}`);
    }
    if (!expeditionGatePreview.objective.includes("원정 문 preview")) {
      failures.push("missing expedition gate preview objective");
    }
    if (!expeditionGatePreview.railText.includes("원정 문 preview")) {
      failures.push("missing expedition gate preview surface");
    }
    if (!expeditionGatePreview.railText.includes("틈새길 보내기")) {
      failures.push("missing backyard gap depart action");
    }
    if (expeditionTraveling.expeditionState !== "traveling") {
      failures.push(`expected expedition traveling state, got ${expeditionTraveling.expeditionState}`);
    }
    if (expeditionTraveling.activeExpeditionRouteId !== "expedition_backyard_gap") {
      failures.push(`expected backyard gap route id, got ${expeditionTraveling.activeExpeditionRouteId}`);
    }
    if (expeditionTraveling.expeditionRewardLeaves !== 35) {
      failures.push(`expected expedition reward leaves 35 while traveling, got ${expeditionTraveling.expeditionRewardLeaves}`);
    }
    if (!expeditionTraveling.unlockedSlotIds.includes("facility_expedition_gate")) {
      failures.push("expedition gate did not unlock on depart");
    }
    if (!expeditionTraveling.objective.includes("뒷마당 틈새길 원정 중")) {
      failures.push("missing expedition traveling objective");
    }
    if (!expeditionTraveling.railText.includes("원정 중")) {
      failures.push("missing expedition traveling HUD text");
    }
    if (!expeditionTraveling.receipts.some((receipt) => receipt.includes("뒷마당 틈새길 출발"))) {
      failures.push("missing expedition depart receipt");
    }
    const travelingGate = expeditionTraveling.facilityStates.find(
      (facility) => facility.slotId === "facility_expedition_gate"
    );
    if (!travelingGate || travelingGate.visualState !== "active" || travelingGate.level !== 1) {
      failures.push(`expected active expedition gate while traveling, got ${JSON.stringify(travelingGate)}`);
    }
    if (expeditionReturned.expeditionState !== "returned") {
      failures.push(`expected expedition returned state, got ${expeditionReturned.expeditionState}`);
    }
    if (!expeditionReturned.railText.includes("귀환 상자 열기")) {
      failures.push("missing return crate claim action");
    }
    if (!expeditionReturned.objective.includes("귀환 상자 도착")) {
      failures.push("missing expedition returned objective");
    }
    if (!expeditionReturned.receipts.some((receipt) => receipt.includes("뒷마당 틈새길 귀환"))) {
      failures.push("missing expedition returned receipt");
    }
    const returnedGate = expeditionReturned.facilityStates.find(
      (facility) => facility.slotId === "facility_expedition_gate"
    );
    if (!returnedGate || returnedGate.progress !== 100) {
      failures.push(`expected expedition gate progress 100 when returned, got ${JSON.stringify(returnedGate)}`);
    }
    if (expeditionClaimed.expeditionState !== "claimed") {
      failures.push(`expected expedition claimed state, got ${expeditionClaimed.expeditionState}`);
    }
    if (expeditionClaimed.expeditionRewardLeaves !== 0) {
      failures.push(`expected expedition reward leaves reset, got ${expeditionClaimed.expeditionRewardLeaves}`);
    }
    if (expeditionClaimed.leaves !== "95") {
      failures.push(`expected 95 leaves after return crate claim, got ${expeditionClaimed.leaves}`);
    }
    if (!expeditionClaimed.objective.includes("첫 원정 완료")) {
      failures.push("missing expedition claimed objective");
    }
    if (!expeditionClaimed.railText.includes("첫 원정 완료")) {
      failures.push("missing expedition claimed HUD surface");
    }
    if (!expeditionClaimed.expeditionSourceClueAvailable) {
      failures.push("expedition source clue was not available after return crate claim");
    }
    if (expeditionClaimed.expeditionSourcePreviewVisible) {
      failures.push("source preview was visible before source action");
    }
    if (expeditionClaimed.nextExpeditionRoutePreviewId) {
      failures.push(`next route preview id was set before source action: ${expeditionClaimed.nextExpeditionRoutePreviewId}`);
    }
    if (expeditionClaimed.lunarSourceSeedId !== "seed_lunar_002") {
      failures.push(`expected lunar source seed id after claim, got ${expeditionClaimed.lunarSourceSeedId}`);
    }
    if (!expeditionClaimed.railText.includes("초승달순 단서 보기")) {
      failures.push("missing lunar source preview action after expedition claim");
    }
    if (!expeditionClaimed.railText.includes("초승달순 씨앗 source")) {
      failures.push("missing lunar source surface after expedition claim");
    }
    if (!expeditionClaimed.receipts.some((receipt) => receipt.includes("귀환 상자 열기 · 잎 +35"))) {
      failures.push("missing expedition reward receipt");
    }
    if (!expeditionSourcePreview.expeditionSourcePreviewVisible) {
      failures.push("expedition source preview telemetry missing after source action");
    }
    if (!expeditionSourcePreview.expeditionSourceClueAvailable) {
      failures.push("expedition source clue disappeared after source action");
    }
    if (expeditionSourcePreview.nextExpeditionRoutePreviewId !== "expedition_moon_fence_locked") {
      failures.push(
        `expected moon fence route preview id, got ${expeditionSourcePreview.nextExpeditionRoutePreviewId}`
      );
    }
    if (expeditionSourcePreview.lunarSourceSeedId !== "seed_lunar_002") {
      failures.push(`expected seed_lunar_002 source id, got ${expeditionSourcePreview.lunarSourceSeedId}`);
    }
    if (!expeditionSourcePreview.lunarSourceSeedAvailable) {
      failures.push("lunar source seed was not available after source preview");
    }
    if (expeditionSourcePreview.lunarSourceSeedPlanted) {
      failures.push("lunar source seed was planted before planting action");
    }
    if (!expeditionSourcePreview.objective.includes("초승달순 씨앗 source")) {
      failures.push("missing source preview objective");
    }
    if (!expeditionSourcePreview.railText.includes("초승달순 씨앗 source")) {
      failures.push("missing source preview HUD surface");
    }
    if (!expeditionSourcePreview.railText.includes("달빛 울타리 잠김")) {
      failures.push("missing moon fence route lock HUD text");
    }
    if (!expeditionSourcePreview.receipts.some((receipt) => receipt.includes("초승달순 단서 확인"))) {
      failures.push("missing source preview receipt");
    }
    if (!lunarSourceAction.lunarSourceSeedAvailable) {
      failures.push("lunar source seed unavailable before planting action");
    }
    if (lunarSourceAction.lunarSourceSeedPlanted) {
      failures.push("lunar source seed planted before planting click");
    }
    if (!lunarSourceAction.railText.includes("초승달순 심기")) {
      failures.push("missing lunar source planting action");
    }
    if (!lunarSourceAction.selectedText.includes("밭")) {
      failures.push(`expected an empty plot selected for lunar source planting, got ${lunarSourceAction.selectedText}`);
    }
    if (lunarSourcePlanted.lunarSourceSeedAvailable) {
      failures.push("lunar source seed stayed available after planting");
    }
    if (!lunarSourcePlanted.lunarSourceSeedPlanted) {
      failures.push("lunar source seed planted telemetry missing");
    }
    if (lunarSourcePlanted.lunarSourceSeedHarvested) {
      failures.push("lunar source seed harvested during planting slice");
    }
    if (lunarSourcePlanted.lunarSourceCreatureRevealed) {
      failures.push("lunar source creature revealed during planting slice");
    }
    const lunarSourcePlot = lunarSourcePlanted.plotStates.find((plot) => plot.seedId === "seed_lunar_002");
    if (
      !lunarSourcePlot ||
      lunarSourcePlot.state !== "planted" ||
      lunarSourcePlot.growth !== 28
    ) {
      failures.push(`expected seed_lunar_002 planted on an empty plot, got ${JSON.stringify(lunarSourcePlot)}`);
    }
    if (!lunarSourcePlanted.objective.includes("초승달순 source 재배 중")) {
      failures.push("missing lunar source planted objective");
    }
    if (!lunarSourcePlanted.railText.includes("초승달순 씨앗 source")) {
      failures.push("missing lunar source HUD after planting");
    }
    if (!lunarSourcePlanted.receipts.some((receipt) => receipt.includes("초승달순 씨앗을 심었다"))) {
      failures.push("missing lunar source planting receipt");
    }
    const lunarSourceReadyPlot = lunarSourceReady.plotStates.find((plot) => plot.seedId === "seed_lunar_002");
    if (!lunarSourceReadyPlot || lunarSourceReadyPlot.state !== "ready" || lunarSourceReadyPlot.growth !== 100) {
      failures.push(`expected seed_lunar_002 ready after care actions, got ${JSON.stringify(lunarSourceReadyPlot)}`);
    }
    if (!lunarSourceReady.railText.includes("초승달순 수확")) {
      failures.push("missing lunar source harvest action");
    }
    if (!lunarSourceReady.objective.includes("초승달순 수확")) {
      failures.push("missing lunar source ready objective");
    }
    if (lunarSourceReady.lunarSourceSeedHarvested) {
      failures.push("lunar source seed harvested before harvest click");
    }
    if (lunarSourceReady.lunarSourceCreatureRevealed) {
      failures.push("lunar source creature revealed before harvest click");
    }
    if (!lunarSourceReady.receipts.some((receipt) => receipt.includes("초승달순 수확 준비 완료"))) {
      failures.push("missing lunar source ready receipt");
    }
    if (!lunarSourceHarvested.lunarSourceSeedHarvested) {
      failures.push("lunar source seed harvest telemetry missing");
    }
    if (!lunarSourceHarvested.lunarSourceCreatureRevealed) {
      failures.push("lunar source creature reveal telemetry missing");
    }
    if (lunarSourceHarvested.lunarSourceCreatureId !== "creature_lunar_uncommon_001") {
      failures.push(`expected lunar source creature id creature_lunar_uncommon_001, got ${lunarSourceHarvested.lunarSourceCreatureId}`);
    }
    if (!lunarSourceHarvested.objective.includes("은빛이끼 루미")) {
      failures.push("missing lunar source harvest objective");
    }
    if (!lunarSourceHarvested.railText.includes("은빛이끼 루미 발견")) {
      failures.push("missing lunar source reveal HUD");
    }
    if (!lunarSourceHarvested.railText.includes("밤유리 source")) {
      failures.push("missing lunar source rare route hint");
    }
    if (!lunarSourceHarvested.nightGlassSourcePreviewAvailable) {
      failures.push("night glass source preview was not available after lunar source harvest");
    }
    if (lunarSourceHarvested.nightGlassSourcePreviewVisible) {
      failures.push("night glass source preview was visible before night glass action");
    }
    if (lunarSourceHarvested.nightGlassRoutePreviewId) {
      failures.push(`night glass route id was set before action: ${lunarSourceHarvested.nightGlassRoutePreviewId}`);
    }
    if (lunarSourceHarvested.nightGlassSourceSeedId !== "seed_rare_001") {
      failures.push(`expected night glass seed id seed_rare_001, got ${lunarSourceHarvested.nightGlassSourceSeedId}`);
    }
    if (!lunarSourceHarvested.railText.includes("밤유리 source 보기")) {
      failures.push("missing night glass source preview action after Lumi reveal");
    }
    if (!lunarSourceHarvested.receipts.some((receipt) => receipt.includes("초승달순 수확 · 은빛이끼 루미 발견"))) {
      failures.push("missing lunar source harvest receipt");
    }
    if (!nightGlassSourcePreview.nightGlassSourcePreviewAvailable) {
      failures.push("night glass source preview availability disappeared after action");
    }
    if (!nightGlassSourcePreview.nightGlassSourcePreviewVisible) {
      failures.push("night glass source preview telemetry missing after action");
    }
    if (nightGlassSourcePreview.nightGlassRoutePreviewId !== "expedition_night_glass") {
      failures.push(`expected expedition_night_glass route preview id, got ${nightGlassSourcePreview.nightGlassRoutePreviewId}`);
    }
    if (nightGlassSourcePreview.nightGlassSourceSeedId !== "seed_rare_001") {
      failures.push(`expected seed_rare_001 preview source id, got ${nightGlassSourcePreview.nightGlassSourceSeedId}`);
    }
    if (nightGlassSourcePreview.selectedText !== "원정 문") {
      failures.push(`expected expedition gate selected after night glass preview, got ${nightGlassSourcePreview.selectedText}`);
    }
    if (!nightGlassSourcePreview.railText.includes("밤유리 source")) {
      failures.push("missing night glass source HUD surface");
    }
    if (!nightGlassSourcePreview.railText.includes("seed_rare_001")) {
      failures.push("missing seed_rare_001 HUD surface");
    }
    if (!nightGlassSourcePreview.railText.includes("expedition_night_glass")) {
      failures.push("missing expedition_night_glass HUD surface");
    }
    if (!nightGlassSourcePreview.railText.includes("research_rare_glass")) {
      failures.push("missing research_rare_glass HUD surface");
    }
    if (!nightGlassSourcePreview.topologyAssets.includes("creature_lunar_rare_001")) {
      failures.push("missing night glass rare creature topology asset key");
    }
    if (!nightGlassSourcePreview.topologyAssets.includes("seed_rare_001_icon")) {
      failures.push("missing night glass dedicated seed icon topology asset key");
    }
    if (!nightGlassSourcePreview.topologyAssets.includes("fx_night_glass_source_unlock_strip_v1")) {
      failures.push("missing night glass source unlock FX topology asset key");
    }
    if (nightGlassSourcePreview.nightGlassSourceRenderedAssetKey !== "seed_rare_001_icon") {
      failures.push(
        `expected night glass source rendered asset seed_rare_001_icon, got ${nightGlassSourcePreview.nightGlassSourceRenderedAssetKey}`
      );
    }
    if (nightGlassSourcePreview.nightGlassSourceFxKey !== "fx_night_glass_source_unlock_strip_v1") {
      failures.push(`expected night glass source FX key, got ${nightGlassSourcePreview.nightGlassSourceFxKey}`);
    }
    if (nightGlassSourcePreview.nightGlassAcquisitionState !== "ready") {
      failures.push(`expected night glass acquisition ready after preview, got ${nightGlassSourcePreview.nightGlassAcquisitionState}`);
    }
    if (nightGlassSourcePreview.nightGlassSourceSeedAvailable) {
      failures.push("night glass source seed was available before route acquisition");
    }
    if (nightGlassSourcePreview.nightGlassSourceAcquired) {
      failures.push("night glass source was acquired before route acquisition");
    }
    if (!nightGlassSourcePreview.railText.includes("밤유리 조사 보내기")) {
      failures.push("missing night glass route start action after source preview");
    }
    if (!nightGlassSourcePreview.receipts.some((receipt) => receipt.includes("밤유리 source 보기"))) {
      failures.push("missing night glass source preview receipt");
    }
    if (nightGlassTraveling.nightGlassAcquisitionState !== "traveling") {
      failures.push(`expected night glass traveling state, got ${nightGlassTraveling.nightGlassAcquisitionState}`);
    }
    if (nightGlassTraveling.expeditionState !== "traveling") {
      failures.push(`expected expedition traveling during night glass route, got ${nightGlassTraveling.expeditionState}`);
    }
    if (nightGlassTraveling.activeExpeditionRouteId !== "expedition_night_glass") {
      failures.push(`expected active night glass route, got ${nightGlassTraveling.activeExpeditionRouteId}`);
    }
    if (nightGlassTraveling.nightGlassRewardLeaves !== 64) {
      failures.push(`expected night glass reward leaves 64 while traveling, got ${nightGlassTraveling.nightGlassRewardLeaves}`);
    }
    if (!nightGlassTraveling.objective.includes("밤유리 온실 조사 중")) {
      failures.push("missing night glass traveling objective");
    }
    if (!nightGlassTraveling.railText.includes("조사 중")) {
      failures.push("missing night glass traveling HUD state");
    }
    if (!nightGlassTraveling.receipts.some((receipt) => receipt.includes("밤유리 온실 조사 출발"))) {
      failures.push("missing night glass route start receipt");
    }
    if (nightGlassReturned.nightGlassAcquisitionState !== "returned") {
      failures.push(`expected night glass returned state, got ${nightGlassReturned.nightGlassAcquisitionState}`);
    }
    if (nightGlassReturned.expeditionState !== "returned") {
      failures.push(`expected expedition returned during night glass route, got ${nightGlassReturned.expeditionState}`);
    }
    if (!nightGlassReturned.railText.includes("밤유리 귀환 상자 열기")) {
      failures.push("missing night glass return claim action");
    }
    if (!nightGlassReturned.objective.includes("밤유리 귀환 상자 도착")) {
      failures.push("missing night glass returned objective");
    }
    if (!nightGlassReturned.receipts.some((receipt) => receipt.includes("밤유리 온실 조사 귀환"))) {
      failures.push("missing night glass returned receipt");
    }
    if (nightGlassAcquired.nightGlassAcquisitionState !== "claimed") {
      failures.push(`expected night glass claimed state, got ${nightGlassAcquired.nightGlassAcquisitionState}`);
    }
    if (nightGlassAcquired.expeditionState !== "claimed") {
      failures.push(`expected expedition claimed after night glass source acquisition, got ${nightGlassAcquired.expeditionState}`);
    }
    if (!nightGlassAcquired.nightGlassSourceSeedAvailable) {
      failures.push("night glass source seed availability telemetry missing after acquisition");
    }
    if (nightGlassAcquired.nightGlassSourceSeedPlanted) {
      failures.push("night glass source seed was planted before planting action");
    }
    if (!nightGlassAcquired.nightGlassSourceAcquired) {
      failures.push("night glass source acquired telemetry missing");
    }
    if (nightGlassAcquired.nightGlassRewardLeaves !== 0) {
      failures.push(`expected night glass reward leaves reset, got ${nightGlassAcquired.nightGlassRewardLeaves}`);
    }
    if (Number(nightGlassAcquired.leaves) < 203) {
      failures.push(`expected at least 203 leaves after night glass acquisition, got ${nightGlassAcquired.leaves}`);
    }
    if (!nightGlassAcquired.objective.includes("밤유리 source 획득")) {
      failures.push("missing night glass acquired objective");
    }
    if (!nightGlassAcquired.railText.includes("seed_rare_001 source 획득")) {
      failures.push("missing night glass acquired HUD surface");
    }
    if (!nightGlassAcquired.receipts.some((receipt) => receipt.includes("밤유리 귀환 상자 열기"))) {
      failures.push("missing night glass source acquisition receipt");
    }
    if (!nightGlassPlantAction.nightGlassSourceSeedAvailable) {
      failures.push("night glass source was not available at planting action");
    }
    if (nightGlassPlantAction.nightGlassSourceSeedPlanted) {
      failures.push("night glass source was planted before action click");
    }
    if (!nightGlassPlantAction.nightGlassSourceAcquired) {
      failures.push("night glass source acquired telemetry missing at planting action");
    }
    if (!nightGlassPlantAction.railText.includes("밤유리 심기")) {
      failures.push("missing night glass planting action in rail");
    }
    if (!nightGlassPlantAction.objective.includes("밤유리 source 심기")) {
      failures.push("missing night glass planting objective");
    }
    if (!nightGlassPlantAction.selectedText.includes("밭")) {
      failures.push(`expected an empty plot selected for night glass planting, got ${nightGlassPlantAction.selectedText}`);
    }
    if (nightGlassPlantAction.plotStates.some((plot) => plot.seedId === "seed_rare_001")) {
      failures.push("night glass seed appeared in plot before planting click");
    }
    if (nightGlassPlanted.nightGlassSourceSeedAvailable) {
      failures.push("night glass source availability stayed true after planting");
    }
    if (!nightGlassPlanted.nightGlassSourceSeedPlanted) {
      failures.push("night glass source planted telemetry missing after planting");
    }
    if (!nightGlassPlanted.nightGlassSourceAcquired) {
      failures.push("night glass source acquired telemetry missing after planting");
    }
    const nightGlassPlot = nightGlassPlanted.plotStates.find((plot) => plot.seedId === "seed_rare_001");
    if (!nightGlassPlot) {
      failures.push("missing seed_rare_001 plot after night glass planting");
    } else {
      if (nightGlassPlot.state !== "planted") {
        failures.push(`expected seed_rare_001 planted state, got ${nightGlassPlot.state}`);
      }
      if (nightGlassPlot.growth !== 24) {
        failures.push(`expected seed_rare_001 growth 24, got ${nightGlassPlot.growth}`);
      }
    }
    if (!nightGlassPlanted.objective.includes("밤유리 재배 중")) {
      failures.push("missing night glass planted objective");
    }
    if (!nightGlassPlanted.railText.includes("seed_rare_001 재배 중")) {
      failures.push("missing night glass planted HUD surface");
    }
    if (!nightGlassPlanted.receipts.some((receipt) => receipt.includes("밤유리 source를 심었다"))) {
      failures.push("missing night glass planting receipt");
    }
    const nightGlassReadyPlot = nightGlassReady.plotStates.find((plot) => plot.seedId === "seed_rare_001");
    if (!nightGlassReadyPlot) {
      failures.push("missing seed_rare_001 ready plot after night glass care");
    } else {
      if (nightGlassReadyPlot.state !== "ready") {
        failures.push(`expected seed_rare_001 ready state, got ${nightGlassReadyPlot.state}`);
      }
      if (nightGlassReadyPlot.growth !== 100) {
        failures.push(`expected seed_rare_001 ready growth 100, got ${nightGlassReadyPlot.growth}`);
      }
    }
    if (!nightGlassReady.objective.includes("밤유리 수확 준비")) {
      failures.push("missing night glass ready objective");
    }
    if (!nightGlassReady.railText.includes("밤유리 수확")) {
      failures.push("missing night glass harvest action in rail");
    }
    if (nightGlassReady.nightGlassSourceSeedHarvested) {
      failures.push("night glass source harvested before harvest click");
    }
    if (nightGlassReady.nightGlassRareCreatureRevealed) {
      failures.push("night glass rare creature revealed before harvest click");
    }
    if (!nightGlassReady.receipts.some((receipt) => receipt.includes("밤유리 수확 준비 완료"))) {
      failures.push("missing night glass ready receipt");
    }
    if (!nightGlassRevealed.nightGlassSourceSeedHarvested) {
      failures.push("night glass source harvested telemetry missing after harvest");
    }
    if (!nightGlassRevealed.nightGlassRareCreatureRevealed) {
      failures.push("night glass rare creature reveal telemetry missing after harvest");
    }
    if (nightGlassRevealed.nightGlassRareCreatureId !== "creature_lunar_rare_001") {
      failures.push(`expected night glass rare creature id creature_lunar_rare_001, got ${nightGlassRevealed.nightGlassRareCreatureId}`);
    }
    if (nightGlassRevealed.nightGlassRareCreatureName !== "밤유리 오로") {
      failures.push(`expected night glass rare creature name 밤유리 오로, got ${nightGlassRevealed.nightGlassRareCreatureName}`);
    }
    if (nightGlassRevealed.leaves !== "299") {
      failures.push(`expected 299 leaves after night glass rare reveal, got ${nightGlassRevealed.leaves}`);
    }
    if (!nightGlassRevealed.objective.includes("밤유리 오로 발견")) {
      failures.push("missing night glass rare reveal objective");
    }
    if (!nightGlassRevealed.railText.includes("밤유리 오로 발견")) {
      failures.push("missing night glass rare reveal HUD surface");
    }
    if (!nightGlassRevealed.railText.includes("creature_lunar_rare_001")) {
      failures.push("missing night glass rare creature id in HUD surface");
    }
    if (!nightGlassRevealed.nightGlassOroActorJoined) {
      failures.push("night glass Oro actor join telemetry missing after reveal");
    }
    if (!nightGlassRevealed.nightGlassOroRouteHandoffVisible) {
      failures.push("night glass Oro route handoff telemetry missing after reveal");
    }
    if (!nightGlassRevealed.nightGlassOroRouteActionAvailable) {
      failures.push("night glass Oro route action was not available after reveal");
    }
    if (nightGlassRevealed.nextRareRoutePreviewId !== "expedition_moon_fence_locked") {
      failures.push(`expected next rare route preview expedition_moon_fence_locked, got ${nightGlassRevealed.nextRareRoutePreviewId}`);
    }
    if (!nightGlassRevealed.actorIds.includes("actor_oro")) {
      failures.push("missing actor_oro after night glass reveal");
    }
    if (!nightGlassRevealed.railText.includes("밤유리 오로 합류")) {
      failures.push("missing night glass Oro actor join HUD surface");
    }
    if (!nightGlassRevealed.railText.includes("월정 문 단서 보기")) {
      failures.push("missing moon fence route action after night glass Oro handoff");
    }
    if (!moonFenceRoute.nightGlassOroActorJoined) {
      failures.push("moon fence route lost night glass Oro actor join telemetry");
    }
    if (moonFenceRoute.nightGlassOroRouteActionAvailable) {
      failures.push("moon fence route action stayed available after inspection");
    }
    if (!moonFenceRoute.moonFenceRoutePreviewVisible) {
      failures.push("moon fence route preview did not become visible");
    }
    if (!moonFenceRoute.moonFenceRouteInspected) {
      failures.push("moon fence route inspection telemetry missing");
    }
    if (moonFenceRoute.nextRareRoutePreviewId !== "expedition_moon_fence_locked") {
      failures.push(`expected moon fence next route id expedition_moon_fence_locked, got ${moonFenceRoute.nextRareRoutePreviewId}`);
    }
    if (!moonFenceRoute.actorIds.includes("actor_oro")) {
      failures.push("actor_oro missing after moon fence route inspection");
    }
    if (!moonFenceRoute.objective.includes("월정 문 단서 확인")) {
      failures.push("missing moon fence route objective");
    }
    if (!moonFenceRoute.railText.includes("월정 문 단서 확인")) {
      failures.push("missing moon fence route HUD surface");
    }
    if (!moonFenceRoute.railText.includes("expedition_moon_fence_locked")) {
      failures.push("missing moon fence route id in HUD surface");
    }
    if (!moonFenceRoute.railText.includes("개방 조건 보기")) {
      failures.push("missing moon fence requirements action after route inspection");
    }
    if (!moonFenceRequirements.moonFenceRoutePreviewVisible) {
      failures.push("moon fence route preview disappeared after requirements inspection");
    }
    if (!moonFenceRequirements.moonFenceRequirementSurfaceVisible) {
      failures.push("moon fence requirements surface did not become visible");
    }
    if (!moonFenceRequirements.moonFenceRequirementsInspected) {
      failures.push("moon fence requirements inspected telemetry missing");
    }
    if (moonFenceRequirements.moonFenceRequiredClues !== 2 || moonFenceRequirements.moonFenceCurrentClues !== 1) {
      failures.push(`expected moon fence clues 1/2, got ${moonFenceRequirements.moonFenceCurrentClues}/${moonFenceRequirements.moonFenceRequiredClues}`);
    }
    if (moonFenceRequirements.moonFenceRequiredMaterials !== 3 || moonFenceRequirements.moonFenceCurrentMaterials !== 2) {
      failures.push(`expected moon fence materials 2/3, got ${moonFenceRequirements.moonFenceCurrentMaterials}/${moonFenceRequirements.moonFenceRequiredMaterials}`);
    }
    if (!moonFenceRequirements.moonFencePrepDeliveryAvailable) {
      failures.push("missing moon fence prep delivery action availability after requirements inspection");
    }
    if (moonFenceRequirements.moonFencePrepDeliveryCompleted) {
      failures.push("moon fence prep delivery completed before clicking action");
    }
    if (moonFenceRequirements.moonFenceMaterialsReady) {
      failures.push("moon fence materials were ready before prep delivery");
    }
    if (moonFenceRequirements.moonFenceRequiredExplorerId !== "actor_oro") {
      failures.push(`expected moon fence required explorer actor_oro, got ${moonFenceRequirements.moonFenceRequiredExplorerId}`);
    }
    if (!moonFenceRequirements.objective.includes("월정 문 개방 조건 확인")) {
      failures.push("missing moon fence requirements objective");
    }
    if (!moonFenceRequirements.railText.includes("오로 explorer")) {
      failures.push("missing moon fence explorer requirement HUD text");
    }
    if (!moonFenceRequirements.railText.includes("달빛 단서 1/2")) {
      failures.push("missing moon fence clue requirement HUD text");
    }
    if (!moonFenceRequirements.railText.includes("재료 2/3")) {
      failures.push("missing moon fence material requirement HUD text");
    }
    if (!moonFenceRequirements.railText.includes("월정 문 준비 납품")) {
      failures.push("missing moon fence prep delivery action after requirements inspection");
    }
    if (!moonFencePrepDelivery.moonFenceRoutePreviewVisible) {
      failures.push("moon fence route preview disappeared after prep delivery");
    }
    if (!moonFencePrepDelivery.moonFencePrepDeliveryCompleted) {
      failures.push("moon fence prep delivery completed telemetry missing");
    }
    if (!moonFencePrepDelivery.moonFencePrepDeliveryCrateVisible) {
      failures.push("moon fence prep delivery crate telemetry missing");
    }
    if (!moonFencePrepDelivery.moonFenceMaterialsReady) {
      failures.push("moon fence materials ready telemetry missing after prep delivery");
    }
    if (moonFencePrepDelivery.moonFenceRequiredMaterials !== 3 || moonFencePrepDelivery.moonFenceCurrentMaterials !== 3) {
      failures.push(`expected moon fence prep delivery materials 3/3, got ${moonFencePrepDelivery.moonFenceCurrentMaterials}/${moonFencePrepDelivery.moonFenceRequiredMaterials}`);
    }
    if (moonFencePrepDelivery.moonFenceRequiredClues !== 2 || moonFencePrepDelivery.moonFenceCurrentClues !== 1) {
      failures.push(`expected moon fence prep delivery clues to remain 1/2, got ${moonFencePrepDelivery.moonFenceCurrentClues}/${moonFencePrepDelivery.moonFenceRequiredClues}`);
    }
    if (!moonFencePrepDelivery.objective.includes("월정 문 준비 납품 완료")) {
      failures.push("missing moon fence prep delivery objective");
    }
    if (!moonFencePrepDelivery.railText.includes("재료 3/3")) {
      failures.push("missing moon fence prep delivery material ready HUD text");
    }
    if (!moonFencePrepDelivery.railText.includes("달빛 단서 1/2")) {
      failures.push("missing moon fence remaining clue blocker HUD text after prep delivery");
    }
    if (!moonFencePrepDelivery.moonFenceSecondClueAvailable) {
      failures.push("missing moon fence second clue action availability after prep delivery");
    }
    if (moonFencePrepDelivery.moonFenceSecondCluePackaged) {
      failures.push("moon fence second clue packaged before clicking action");
    }
    if (moonFencePrepDelivery.moonFenceCluesReady) {
      failures.push("moon fence clues were ready before second clue packaging");
    }
    if (!moonFencePrepDelivery.railText.includes("달빛 단서 포장")) {
      failures.push("missing moon fence second clue action after prep delivery");
    }
    if (!moonFenceSecondClue.moonFenceRoutePreviewVisible) {
      failures.push("moon fence route preview disappeared after second clue packaging");
    }
    if (!moonFenceSecondClue.moonFenceSecondCluePackaged) {
      failures.push("moon fence second clue packaged telemetry missing");
    }
    if (!moonFenceSecondClue.moonFenceClueStampVisible) {
      failures.push("moon fence clue stamp telemetry missing");
    }
    if (!moonFenceSecondClue.moonFenceCluesReady) {
      failures.push("moon fence clues ready telemetry missing after second clue packaging");
    }
    if (moonFenceSecondClue.moonFenceRequiredClues !== 2 || moonFenceSecondClue.moonFenceCurrentClues !== 2) {
      failures.push(`expected moon fence second clue 2/2, got ${moonFenceSecondClue.moonFenceCurrentClues}/${moonFenceSecondClue.moonFenceRequiredClues}`);
    }
    if (moonFenceSecondClue.moonFenceRequiredMaterials !== 3 || moonFenceSecondClue.moonFenceCurrentMaterials !== 3) {
      failures.push(`expected moon fence second clue materials to stay 3/3, got ${moonFenceSecondClue.moonFenceCurrentMaterials}/${moonFenceSecondClue.moonFenceRequiredMaterials}`);
    }
    if (!moonFenceSecondClue.objective.includes("달빛 단서 포장 완료")) {
      failures.push("missing moon fence second clue objective");
    }
    if (!moonFenceSecondClue.railText.includes("달빛 단서 2/2")) {
      failures.push("missing moon fence clue ready HUD text");
    }
    if (!moonFenceSecondClue.railText.includes("재료 3/3")) {
      failures.push("missing moon fence material ready HUD text after second clue packaging");
    }
    if (nightGlassRevealed.plotStates.some((plot) => plot.seedId === "seed_rare_001")) {
      failures.push("seed_rare_001 plot stayed occupied after harvest");
    }
    if (!nightGlassRevealed.receipts.some((receipt) => receipt.includes("밤유리 수확 · 밤유리 오로 발견"))) {
      failures.push("missing night glass rare reveal receipt");
    }
    if (!evidence.receipts.some((receipt) => receipt.includes("달빛 단서 씨앗을 심었다"))) {
      failures.push("missing research clue seed planting receipt");
    }
    if (!evidence.receipts.some((receipt) => receipt.includes("달빛 단서 수확 · 달빛 family clue +1"))) {
      failures.push("missing research clue seed harvest receipt");
    }
    if (!evidence.receipts.some((receipt) => receipt.includes("달빛 단서 도감 기록 · 다음 씨앗 목표 저장"))) {
      failures.push("missing research clue album record receipt");
    }
    if (!evidence.receipts.some((receipt) => receipt.includes("다음 목표 씨앗 수령"))) {
      failures.push("missing next goal seed claim receipt");
    }
    if (!evidence.receipts.some((receipt) => receipt.includes("달빛 새싹 목표 씨앗을 심었다"))) {
      failures.push("missing next goal seed planting receipt");
    }
    if (!evidence.receipts.some((receipt) => receipt.includes("달빛 새싹 수확 · 다음 발견 준비"))) {
      failures.push("missing lunar sprout harvest receipt");
    }
    if (!evidence.receipts.some((receipt) => receipt.includes("달빛 새싹 발견 확인 · 달빛 family reveal"))) {
      failures.push("missing lunar family reveal receipt");
    }
    if (!evidence.receipts.some((receipt) => receipt.includes("원정 문 단서 확인 · preview route 표시"))) {
      failures.push("missing expedition gate preview receipt");
    }
    if (!evidence.researchNextGoalSeedClaimed) failures.push("next goal seed claim telemetry missing");
    if (!evidence.researchNextGoalSeedPlanted) failures.push("next goal seed planting telemetry missing");
    if (!evidence.researchNextGoalSeedHarvested) failures.push("lunar sprout harvest telemetry missing from final evidence");
    if (evidence.researchNextGoalRevealReady) failures.push("lunar sprout reveal-ready stayed true in final evidence");
    if (!evidence.researchLunarFamilyRevealed) failures.push("lunar family reveal telemetry missing from final evidence");
    if (!evidence.expeditionGatePreviewVisible) failures.push("expedition gate preview telemetry missing from final evidence");
    if (evidence.expeditionState !== "claimed") failures.push(`expected final expedition claimed state, got ${evidence.expeditionState}`);
    if (evidence.activeExpeditionRouteId !== "expedition_night_glass") {
      failures.push(`expected final expedition route id, got ${evidence.activeExpeditionRouteId}`);
    }
    if (evidence.expeditionRewardLeaves !== 0) {
      failures.push(`expected final expedition reward leaves 0, got ${evidence.expeditionRewardLeaves}`);
    }
    if (!evidence.expeditionSourceClueAvailable) {
      failures.push("expedition source clue missing from final evidence");
    }
    if (!evidence.expeditionSourcePreviewVisible) {
      failures.push("source preview missing from final evidence");
    }
    if (evidence.nextExpeditionRoutePreviewId !== "expedition_moon_fence_locked") {
      failures.push(`expected final moon fence route preview id, got ${evidence.nextExpeditionRoutePreviewId}`);
    }
    if (evidence.lunarSourceSeedId !== "seed_lunar_002") {
      failures.push(`expected final lunar source seed id, got ${evidence.lunarSourceSeedId}`);
    }
    if (evidence.lunarSourceSeedAvailable) {
      failures.push("lunar source seed stayed available in final evidence");
    }
    if (!evidence.lunarSourceSeedPlanted) {
      failures.push("lunar source seed planted telemetry missing from final evidence");
    }
    if (!evidence.lunarSourceSeedHarvested) {
      failures.push("lunar source seed harvest telemetry missing from final evidence");
    }
    if (!evidence.lunarSourceCreatureRevealed) {
      failures.push("lunar source creature reveal telemetry missing from final evidence");
    }
    if (evidence.lunarSourceCreatureId !== "creature_lunar_uncommon_001") {
      failures.push(`expected final lunar source creature id, got ${evidence.lunarSourceCreatureId}`);
    }
    if (!evidence.nightGlassSourcePreviewAvailable) {
      failures.push("night glass preview availability missing from final evidence");
    }
    if (!evidence.nightGlassSourcePreviewVisible) {
      failures.push("night glass preview visibility missing from final evidence");
    }
    if (evidence.nightGlassRoutePreviewId !== "expedition_night_glass") {
      failures.push(`expected final night glass route id expedition_night_glass, got ${evidence.nightGlassRoutePreviewId}`);
    }
    if (evidence.nightGlassSourceSeedId !== "seed_rare_001") {
      failures.push(`expected final night glass seed id seed_rare_001, got ${evidence.nightGlassSourceSeedId}`);
    }
    if (evidence.nightGlassSourceRenderedAssetKey !== "seed_rare_001_icon") {
      failures.push(`expected final night glass source icon asset, got ${evidence.nightGlassSourceRenderedAssetKey}`);
    }
    if (evidence.nightGlassSourceFxKey !== "fx_night_glass_source_unlock_strip_v1") {
      failures.push(`expected final night glass source FX asset, got ${evidence.nightGlassSourceFxKey}`);
    }
    if (evidence.nightGlassAcquisitionState !== "claimed") {
      failures.push(`expected final night glass acquisition claimed, got ${evidence.nightGlassAcquisitionState}`);
    }
    if (evidence.nightGlassSourceSeedAvailable) {
      failures.push("final night glass source seed availability stayed true after planting");
    }
    if (evidence.nightGlassSourceSeedPlanted) {
      failures.push("final night glass source planted telemetry stayed true after harvest");
    }
    if (!evidence.nightGlassSourceSeedHarvested) {
      failures.push("final night glass source harvested telemetry missing");
    }
    if (!evidence.nightGlassSourceAcquired) {
      failures.push("final night glass source acquired telemetry missing");
    }
    if (!evidence.nightGlassRareCreatureRevealed) {
      failures.push("final night glass rare creature reveal telemetry missing");
    }
    if (evidence.nightGlassRareCreatureId !== "creature_lunar_rare_001") {
      failures.push(`expected final night glass rare creature id creature_lunar_rare_001, got ${evidence.nightGlassRareCreatureId}`);
    }
    if (evidence.nightGlassRareCreatureName !== "밤유리 오로") {
      failures.push(`expected final night glass rare creature name 밤유리 오로, got ${evidence.nightGlassRareCreatureName}`);
    }
    if (!evidence.nightGlassOroActorJoined) {
      failures.push("final night glass Oro actor join telemetry missing");
    }
    if (!evidence.nightGlassOroRouteHandoffVisible) {
      failures.push("final night glass Oro route handoff telemetry missing");
    }
    if (evidence.nightGlassOroRouteActionAvailable) {
      failures.push("final night glass Oro route action still available");
    }
    if (!evidence.moonFenceRoutePreviewVisible) {
      failures.push("final moon fence route preview missing");
    }
    if (!evidence.moonFenceRouteInspected) {
      failures.push("final moon fence route inspected telemetry missing");
    }
    if (!evidence.moonFenceRequirementSurfaceVisible) {
      failures.push("final moon fence requirements surface missing");
    }
    if (!evidence.moonFenceRequirementsInspected) {
      failures.push("final moon fence requirements inspected telemetry missing");
    }
    if (evidence.moonFenceRequiredClues !== 2 || evidence.moonFenceCurrentClues !== 2) {
      failures.push(`expected final moon fence clues 2/2, got ${evidence.moonFenceCurrentClues}/${evidence.moonFenceRequiredClues}`);
    }
    if (evidence.moonFenceRequiredMaterials !== 3 || evidence.moonFenceCurrentMaterials !== 3) {
      failures.push(`expected final moon fence materials 3/3, got ${evidence.moonFenceCurrentMaterials}/${evidence.moonFenceRequiredMaterials}`);
    }
    if (!evidence.moonFencePrepDeliveryCompleted) {
      failures.push("final moon fence prep delivery completed telemetry missing");
    }
    if (!evidence.moonFencePrepDeliveryCrateVisible) {
      failures.push("final moon fence prep delivery crate telemetry missing");
    }
    if (!evidence.moonFenceMaterialsReady) {
      failures.push("final moon fence materials ready telemetry missing");
    }
    if (!evidence.moonFenceSecondCluePackaged) {
      failures.push("final moon fence second clue packaged telemetry missing");
    }
    if (!evidence.moonFenceClueStampVisible) {
      failures.push("final moon fence clue stamp telemetry missing");
    }
    if (!evidence.moonFenceCluesReady) {
      failures.push("final moon fence clues ready telemetry missing");
    }
    if (evidence.moonFenceRequiredExplorerId !== "actor_oro") {
      failures.push(`expected final moon fence explorer actor_oro, got ${evidence.moonFenceRequiredExplorerId}`);
    }
    if (evidence.nextRareRoutePreviewId !== "expedition_moon_fence_locked") {
      failures.push(`expected final next rare route preview id expedition_moon_fence_locked, got ${evidence.nextRareRoutePreviewId}`);
    }
    if (!evidence.actorIds.includes("actor_oro")) {
      failures.push("final actor_oro missing");
    }
    if (evidence.leaves !== "299") {
      failures.push(`expected final leaves 299 after night glass rare reveal, got ${evidence.leaves}`);
    }
    if (evidence.nightGlassRewardLeaves !== 0) {
      failures.push(`expected final night glass reward leaves 0, got ${evidence.nightGlassRewardLeaves}`);
    }
    if (!evidence.objective.includes("달빛 단서 포장 완료") || !evidence.objective.includes("단서 2/2")) {
      failures.push("missing moon fence second clue final objective");
    }
    if (!evidence.unlockedSlotIds.includes("plot_03")) failures.push("third plot slot did not unlock");
    if (!evidence.plotIds.includes("plot_03")) failures.push("third plot entity was not created");
    const sourcePlot = evidence.plotStates.find((plot) => plot.seedId === "seed_lunar_002");
    if (sourcePlot) {
      failures.push(`expected seed_lunar_002 plot to be cleared after harvest, got ${JSON.stringify(sourcePlot)}`);
    }
    const storage = evidence.facilityStates.find((facility) => facility.slotId === "facility_storage");
    if (!storage || storage.level !== 1 || storage.visualState !== "active") {
      failures.push(`expected storage facility active at level 1, got ${JSON.stringify(storage)}`);
    }
    if (evidence.storageCapacity !== 24) {
      failures.push(`expected storage capacity 24, got ${evidence.storageCapacity}`);
    }
    if (evidence.storedLeaves !== 0) {
      failures.push(`expected stored leaves 0 after claim, got ${evidence.storedLeaves}`);
    }
    if (evidence.storageFillRatio !== 0) {
      failures.push(`expected storage fill ratio 0 after claim, got ${evidence.storageFillRatio}`);
    }
    if (!evidence.unlockedSlotIds.includes("facility_storage")) failures.push("storage slot did not unlock");
    if (!evidence.previewSlotIds.includes("facility_research_shelf")) {
      failures.push("research shelf did not enter preview state");
    }
    if (!evidence.unlockedSlotIds.includes("facility_expedition_gate")) {
      failures.push("expedition gate did not enter unlocked state after depart");
    }
    const researchShelf = evidence.facilityStates.find((facility) => facility.slotId === "facility_research_shelf");
    if (!researchShelf || researchShelf.kind !== "research_shelf" || researchShelf.visualState !== "preview") {
      failures.push(`expected research shelf preview facility, got ${JSON.stringify(researchShelf)}`);
    }
    for (const assetId of REQUIRED_TOPOLOGY_ASSETS) {
      if (!evidence.topologyAssets.includes(assetId)) {
        failures.push(`missing loaded topology asset key: ${assetId}`);
      }
    }
    if (evidence.bodyScrollHeight > evidence.innerHeight || evidence.documentScrollHeight > evidence.innerHeight) {
      failures.push("mobile viewport has body/document scroll");
    }

    const result = {
      ok: failures.length === 0,
      url: URL,
      storageBeforeClaim,
      clueBeforePlant,
      clueBeforeRecord,
      clueGoalSurface,
      nextGoalSeedClaimed,
      nextGoalSeedPlanted,
      lunarSproutReady,
      lunarSproutHarvested,
      lunarFamilyRevealed,
      expeditionGatePreview,
      expeditionTraveling,
      expeditionReturned,
      expeditionClaimed,
      expeditionSourcePreview,
      lunarSourceAction,
      lunarSourcePlanted,
      lunarSourceReady,
      lunarSourceHarvested,
      nightGlassSourcePreview,
      nightGlassTraveling,
      nightGlassReturned,
      nightGlassAcquired,
      nightGlassPlantAction,
      nightGlassPlanted,
      nightGlassReady,
      nightGlassRevealed,
      overviewMode,
      manageReturn,
      evidence,
      screenshots: [
        `${OUT_DIR}/phaser-check-fresh-start-393.png`,
        `${OUT_DIR}/phaser-check-overview-mode-393.png`,
        `${OUT_DIR}/phaser-check-manage-return-393.png`,
        `${OUT_DIR}/phaser-check-after-plant-393.png`,
        `${OUT_DIR}/phaser-check-ready-393.png`,
        `${OUT_DIR}/phaser-check-after-harvest-393.png`,
        `${OUT_DIR}/phaser-check-workbench-claim-393.png`,
        `${OUT_DIR}/phaser-check-crate-ready-393.png`,
        `${OUT_DIR}/phaser-check-delivery-claim-393.png`,
        `${OUT_DIR}/phaser-check-expand-ready-393.png`,
        `${OUT_DIR}/phaser-check-third-plot-expanded-393.png`,
        `${OUT_DIR}/phaser-check-third-plot-planted-393.png`,
        `${OUT_DIR}/phaser-check-third-plot-ready-393.png`,
        `${OUT_DIR}/phaser-check-third-plot-harvested-393.png`,
        `${OUT_DIR}/phaser-check-second-crate-ready-393.png`,
        `${OUT_DIR}/phaser-check-second-delivery-393.png`,
        `${OUT_DIR}/phaser-check-storage-ready-393.png`,
        `${OUT_DIR}/phaser-check-storage-unlocked-393.png`,
        `${OUT_DIR}/phaser-check-storage-fill-claim-393.png`,
        `${OUT_DIR}/phaser-check-storage-buffer-393.png`,
        `${OUT_DIR}/phaser-check-storage-claimed-393.png`,
        `${OUT_DIR}/phaser-check-research-shelf-ready-393.png`,
        `${OUT_DIR}/phaser-check-research-shelf-inspected-393.png`,
        `${OUT_DIR}/phaser-check-research-clue-action-393.png`,
        `${OUT_DIR}/phaser-check-research-clue-planted-393.png`,
        `${OUT_DIR}/phaser-check-research-clue-ready-393.png`,
        `${OUT_DIR}/phaser-check-research-clue-harvested-393.png`,
        `${OUT_DIR}/phaser-check-research-clue-record-ready-393.png`,
        `${OUT_DIR}/phaser-check-research-clue-recorded-393.png`,
        `${OUT_DIR}/phaser-check-research-clue-goal-surface-393.png`,
        `${OUT_DIR}/phaser-check-next-goal-seed-claimed-393.png`,
        `${OUT_DIR}/phaser-check-next-goal-seed-planted-393.png`,
        `${OUT_DIR}/phaser-check-lunar-sprout-ready-393.png`,
        `${OUT_DIR}/phaser-check-lunar-sprout-harvested-393.png`,
        `${OUT_DIR}/phaser-check-lunar-family-revealed-393.png`,
        `${OUT_DIR}/phaser-check-expedition-gate-preview-393.png`,
        `${OUT_DIR}/phaser-check-expedition-traveling-393.png`,
        `${OUT_DIR}/phaser-check-expedition-returned-393.png`,
        `${OUT_DIR}/phaser-check-expedition-claimed-393.png`,
        `${OUT_DIR}/phaser-check-expedition-source-preview-393.png`,
        `${OUT_DIR}/phaser-check-lunar-source-action-393.png`,
        `${OUT_DIR}/phaser-check-lunar-source-planted-393.png`,
        `${OUT_DIR}/phaser-check-lunar-source-ready-393.png`,
        `${OUT_DIR}/phaser-check-lunar-source-harvested-393.png`,
        `${OUT_DIR}/phaser-check-night-glass-source-preview-393.png`,
        `${OUT_DIR}/phaser-check-night-glass-traveling-393.png`,
        `${OUT_DIR}/phaser-check-night-glass-returned-393.png`,
        `${OUT_DIR}/phaser-check-night-glass-source-acquired-393.png`,
        `${OUT_DIR}/phaser-check-night-glass-plant-action-393.png`,
        `${OUT_DIR}/phaser-check-night-glass-planted-393.png`,
        `${OUT_DIR}/phaser-check-night-glass-ready-393.png`,
        `${OUT_DIR}/phaser-check-night-glass-revealed-393.png`,
        `${OUT_DIR}/phaser-check-night-glass-oro-handoff-393.png`,
        `${OUT_DIR}/phaser-check-moon-fence-route-action-393.png`,
        `${OUT_DIR}/phaser-check-moon-fence-requirements-393.png`,
        `${OUT_DIR}/phaser-check-moon-fence-prep-delivery-393.png`,
        `${OUT_DIR}/phaser-check-moon-fence-second-clue-393.png`
      ],
      failures
    };
    console.log(JSON.stringify(result, null, 2));
    if (failures.length > 0) {
      process.exitCode = 1;
    }
  } finally {
    server.kill("SIGTERM");
    if (process.exitCode) {
      console.error(serverOutput);
    }
  }
}

runSmoke().catch((error) => {
  console.error(error);
  process.exit(1);
});
