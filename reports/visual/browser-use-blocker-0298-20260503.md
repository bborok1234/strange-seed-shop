# Browser Use blocker — #298 생산 잎 수령 작업 FX

- WorkUnit: GitHub Issue #298 `정원에서 생산 잎을 수령할 때 포리 작업 FX를 보이게 만든다`
- 일시: 2026-05-03 KST
- 라우트: `game-studio:game-studio` → `game-studio:game-ui-frontend` + `game-studio:sprite-pipeline` + `game-studio:game-playtest`
- 대상 URL: `http://127.0.0.1:3000/?qaProductionReady=1`
- 우선 경로: Browser Use plugin, `iab` backend

## 현재 세션 시도

Node REPL `js` 도구를 노출한 뒤 Browser Use skill의 bootstrap을 실행했다.

```js
if (!globalThis.agent) {
  const { setupAtlasRuntime } = await import("/Users/mirlim/.codex/plugins/cache/openai-bundled/browser-use/0.1.0-alpha1/scripts/browser-client.mjs");
  const backend = "iab";
  await setupAtlasRuntime({ globals: globalThis, backend });
}
await agent.browser.nameSession("🌱 #298 생산 FX QA");
if (typeof tab === "undefined") {
  globalThis.tab = await agent.browser.tabs.new();
}
await tab.goto("http://127.0.0.1:3000/?qaProductionReady=1");
```

## 결과

실패:

```text
Failed to connect to browser-use backend "iab". No Codex IAB backends were discovered. Discovery diagnostics: listedPipes=0, candidates=2, browsers=0, iabBrowsers=0, failures=["legacy-iab/connect/Error","legacy-chrome/connect/Error"], pipeListingError=none.
```

## 대체 검증

Browser Use hands-on QA를 대체 완료로 주장하지 않는다. 대신 Playwright는 반복 regression gate로만 사용한다.
후속 evidence는 `npx playwright test --config playwright.config.ts --grep "자동 생산과 첫 주문"`, `npm run check:visual`, 스크린샷 artifact로 남긴다.
