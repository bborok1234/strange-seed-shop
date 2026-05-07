import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const PORT = 4183;
const URL = `http://127.0.0.1:${PORT}/`;
const OUT_DIR = "reports/visual/issue-0484-lunar-sprout-growth-reveal";
const REQUIRED_TOPOLOGY_ASSETS = [
  "bg_garden_terrain_open_v1",
  "tile_plot_empty_v1",
  "tile_plot_sprout_v1",
  "tile_plot_growing_v1",
  "tile_plot_ready_v1",
  "tile_plot_locked_preview_v1",
  "facility_workbench_v1",
  "facility_order_crate_empty_v1",
  "facility_order_crate_filled_v1",
  "ui_shadow_soft_v1",
  "actor_pori_caretaker_strip_v1",
  "actor_momo_carrier_strip_v1",
  "fx_care_spark_strip_v1",
  "fx_harvest_leaf_flyout_strip_v1"
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
    if (evidence.leaves !== "60") failures.push(`expected 60 leaves after lunar sprout harvest, got ${evidence.leaves}`);
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
    if (!evidence.researchNextGoalSeedClaimed) failures.push("next goal seed claim telemetry missing");
    if (!evidence.researchNextGoalSeedPlanted) failures.push("next goal seed planting telemetry missing");
    if (!evidence.researchNextGoalSeedHarvested) failures.push("lunar sprout harvest telemetry missing from final evidence");
    if (!evidence.researchNextGoalRevealReady) failures.push("lunar sprout reveal-ready telemetry missing from final evidence");
    if (!evidence.objective.includes("다음 씨앗 family reveal")) failures.push("missing next goal reveal-ready objective");
    if (!evidence.unlockedSlotIds.includes("plot_03")) failures.push("third plot slot did not unlock");
    if (!evidence.plotIds.includes("plot_03")) failures.push("third plot entity was not created");
    const thirdPlot = evidence.plotStates.find((plot) => plot.slotId === "plot_03");
    if (!thirdPlot || thirdPlot.state !== "empty" || thirdPlot.growth !== 0 || thirdPlot.seedId) {
      failures.push(`expected plot_03 empty after lunar sprout harvest, got ${JSON.stringify(thirdPlot)}`);
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
        `${OUT_DIR}/phaser-check-lunar-sprout-harvested-393.png`
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
