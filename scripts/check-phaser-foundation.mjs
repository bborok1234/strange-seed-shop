import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const PORT = 4183;
const URL = `http://127.0.0.1:${PORT}/`;
const OUT_DIR = "reports/visual/issue-0433-garden-board-foundation";

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
    for (let index = 0; index < 3; index += 1) {
      const careButton = page.getByRole("button", { name: "돌보기" });
      if ((await careButton.count()) > 0) {
        await careButton.click();
      }
    }
    await page.getByRole("button", { name: "수확" }).click();
    await page.mouse.click(112, 612);
    await page.getByRole("button", { name: "수령" }).click();
    await page.screenshot({ path: `${OUT_DIR}/phaser-check-workbench-claim-393.png`, fullPage: false });

    const evidence = await page.evaluate(() => ({
      objective: document.querySelector('[data-testid="phaser-objective"]')?.textContent ?? "",
      railText: document.querySelector('[data-testid="phaser-action-rail"]')?.textContent ?? "",
      leaves: document.querySelector('[data-hud="leaves"]')?.textContent ?? "",
      seeds: document.querySelector('[data-hud="seeds"]')?.textContent ?? "",
      bodyScrollHeight: document.body.scrollHeight,
      documentScrollHeight: document.documentElement.scrollHeight,
      innerHeight: window.innerHeight,
      canvasCount: document.querySelectorAll("canvas").length
    }));

    await browser.close();

    const failures = [];
    if (evidence.canvasCount !== 1) failures.push("expected one Phaser canvas");
    if (evidence.leaves !== "20") failures.push(`expected 20 leaves after harvest + claim, got ${evidence.leaves}`);
    if (evidence.seeds !== "0") failures.push(`expected starter seed spent, got ${evidence.seeds}`);
    if (!evidence.railText.includes("포리 작업 수령")) failures.push("missing workbench claim receipt");
    if (!evidence.objective.includes("3번 밭 확장")) failures.push("missing third-slot continuation objective");
    if (evidence.bodyScrollHeight > evidence.innerHeight || evidence.documentScrollHeight > evidence.innerHeight) {
      failures.push("mobile viewport has body/document scroll");
    }

    const result = {
      ok: failures.length === 0,
      url: URL,
      evidence,
      screenshots: [
        `${OUT_DIR}/phaser-check-fresh-start-393.png`,
        `${OUT_DIR}/phaser-check-workbench-claim-393.png`
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
