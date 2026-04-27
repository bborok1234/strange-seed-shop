import fs from "node:fs";
import { spawn } from "node:child_process";

const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const targetUrl = process.argv[2] ?? "http://127.0.0.1:3000/";
const outputPath = process.argv[3] ?? "reports/visual/local-screenshot.png";
const width = Number.parseInt(process.argv[4] ?? "393", 10);
const height = Number.parseInt(process.argv[5] ?? "900", 10);
const port = 9223 + Math.floor(Math.random() * 1000);
const userDataDir = `/tmp/strange-seed-shop-cdp-${Date.now()}`;

if (typeof WebSocket === "undefined") {
  console.error("Node WebSocket global is required for CDP capture.");
  process.exit(1);
}

const chrome = spawn(chromePath, [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  "--disable-background-networking",
  "--disable-component-update",
  "--disable-sync",
  "--no-first-run",
  `--user-data-dir=${userDataDir}`,
  `--remote-debugging-port=${port}`,
  "about:blank"
], {
  stdio: ["ignore", "pipe", "pipe"]
});

const cleanup = () => {
  if (!chrome.killed) {
    chrome.kill("SIGTERM");
  }
};

process.on("exit", cleanup);
process.on("SIGINT", () => {
  cleanup();
  process.exit(130);
});

try {
  const tab = await waitForTab(port);
  const socket = await openSocket(tab.webSocketDebuggerUrl);
  let id = 0;
  const pending = new Map();
  const events = [];

  socket.onmessage = (message) => {
    const payload = JSON.parse(message.data);
    if (payload.id && pending.has(payload.id)) {
      pending.get(payload.id)(payload);
      pending.delete(payload.id);
      return;
    }
    if (payload.method) {
      events.push(payload.method);
    }
  };

  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const messageId = ++id;
      pending.set(messageId, (payload) => {
        if (payload.error) {
          reject(new Error(`${method}: ${payload.error.message}`));
        } else {
          resolve(payload.result ?? {});
        }
      });
      socket.send(JSON.stringify({ id: messageId, method, params }));
    });

  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width <= 480
  });
  await send("Page.navigate", { url: targetUrl });
  await waitForEvent(events, "Page.loadEventFired", 10000);
  await new Promise((resolve) => setTimeout(resolve, 700));

  const screenshot = await send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: false,
    fromSurface: true
  });

  fs.mkdirSync(outputPath.split("/").slice(0, -1).join("/"), { recursive: true });
  fs.writeFileSync(outputPath, Buffer.from(screenshot.data, "base64"));

  await send("Browser.close").catch(() => {});
  socket.close();
  cleanup();

  console.log(JSON.stringify({ ok: true, outputPath, width, height }, null, 2));
} catch (error) {
  cleanup();
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}

async function waitForTab(debugPort) {
  const deadline = Date.now() + 10000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`http://127.0.0.1:${debugPort}/json/list`);
      const tabs = await response.json();
      const tab = tabs.find((item) => item.type === "page" && item.webSocketDebuggerUrl);
      if (tab) {
        return tab;
      }
    } catch {
      // Chrome is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("Timed out waiting for Chrome DevTools tab.");
}

function openSocket(url) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(url);
    socket.onopen = () => resolve(socket);
    socket.onerror = () => reject(new Error("Failed to connect to Chrome DevTools WebSocket."));
  });
}

function waitForEvent(events, eventName, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  return new Promise((resolve, reject) => {
    const tick = () => {
      if (events.includes(eventName)) {
        resolve();
        return;
      }
      if (Date.now() >= deadline) {
        reject(new Error(`Timed out waiting for ${eventName}.`));
        return;
      }
      setTimeout(tick, 50);
    };
    tick();
  });
}
