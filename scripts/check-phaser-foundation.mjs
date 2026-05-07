import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const PORT = 4183;
const URL = `http://127.0.0.1:${PORT}/`;
const OUT_DIR = "reports/visual/issue-0457-storage-basket-unlock-affordance";
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
    await page.mouse.click(284, 606);
    await page.screenshot({ path: `${OUT_DIR}/phaser-check-crate-ready-393.png`, fullPage: false });
    await page.getByRole("button", { name: "납품" }).click();
    await page.waitForTimeout(140);
    await page.screenshot({ path: `${OUT_DIR}/phaser-check-delivery-claim-393.png`, fullPage: false });
    await page.mouse.click(160, 545);
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
    await page.mouse.click(284, 606);
    await page.screenshot({ path: `${OUT_DIR}/phaser-check-second-crate-ready-393.png`, fullPage: false });
    await page.getByRole("button", { name: "납품" }).click();
    await page.waitForTimeout(140);
    await page.screenshot({ path: `${OUT_DIR}/phaser-check-second-delivery-393.png`, fullPage: false });
    await page.mouse.click(304, 502);
    await page.screenshot({ path: `${OUT_DIR}/phaser-check-storage-ready-393.png`, fullPage: false });
    await page.getByRole("button", { name: "정리 80잎" }).click();
    await page.waitForTimeout(140);
    await page.screenshot({ path: `${OUT_DIR}/phaser-check-storage-unlocked-393.png`, fullPage: false });

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
      unlockedSlotIds: window.__seedGardenUnlockedSlotIds ?? [],
      facilityStates: window.__seedGardenFacilityStates ?? [],
      plotIds: window.__seedGardenPlotIds ?? [],
      plotStates: window.__seedGardenPlotStates ?? [],
      receipts: window.__seedGardenReceipts ?? []
    }));

    await browser.close();

    const failures = [];
    if (evidence.canvasCount !== 1) failures.push("expected one Phaser canvas");
    if (evidence.leaves !== "8") failures.push(`expected 8 leaves after storage unlock, got ${evidence.leaves}`);
    if (evidence.seeds !== "0") failures.push(`expected rewarded third-plot seed planted and spent, got ${evidence.seeds}`);
    if (!evidence.receipts.some((receipt) => receipt.includes("주문 상자 납품"))) {
      failures.push("missing order crate delivery receipt");
    }
    if (!evidence.actorIds.includes("actor_pori")) failures.push("missing Pori actor after harvest");
    if (!evidence.actorIds.includes("actor_momo")) failures.push("missing Momo carrier after workbench claim");
    if (evidence.orderCrateProgress !== 0) {
      failures.push(`expected order crate progress reset to 0 after delivery, got ${evidence.orderCrateProgress}`);
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
    if (!evidence.objective.includes("보관 바구니 정리 완료")) failures.push("missing storage unlock objective");
    if (!evidence.unlockedSlotIds.includes("plot_03")) failures.push("third plot slot did not unlock");
    if (!evidence.plotIds.includes("plot_03")) failures.push("third plot entity was not created");
    const thirdPlot = evidence.plotStates.find((plot) => plot.slotId === "plot_03");
    if (!thirdPlot || thirdPlot.state !== "empty" || thirdPlot.growth !== 0) {
      failures.push(`expected plot_03 harvested back to empty, got ${JSON.stringify(thirdPlot)}`);
    }
    const storage = evidence.facilityStates.find((facility) => facility.slotId === "facility_storage");
    if (!storage || storage.level !== 1 || storage.visualState !== "active") {
      failures.push(`expected storage facility active at level 1, got ${JSON.stringify(storage)}`);
    }
    if (evidence.storageCapacity !== 24) {
      failures.push(`expected storage capacity 24, got ${evidence.storageCapacity}`);
    }
    if (!evidence.unlockedSlotIds.includes("facility_storage")) failures.push("storage slot did not unlock");
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
      evidence,
      screenshots: [
        `${OUT_DIR}/phaser-check-fresh-start-393.png`,
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
        `${OUT_DIR}/phaser-check-storage-unlocked-393.png`
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
