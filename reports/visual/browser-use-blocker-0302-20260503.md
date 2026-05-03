# Browser Use blocker — #302 연구 노트 unlock payoff

- WorkUnit: GitHub Issue #302 `두 번째 주문 보상이 연구 노트 unlock payoff로 이어지게 만든다`
- 일시: 2026-05-03 KST
- 라우트: `game-studio:game-studio` → `game-studio:game-ui-frontend` + `game-studio:game-playtest`
- 대상 URL: `http://127.0.0.1:3000/?qaResearchReady=1`
- 우선 경로: Browser Use plugin, `iab` backend

## 현재 세션 시도

Node REPL `js` 도구에서 Browser Use skill의 bootstrap을 실행했다.

```js
if (!globalThis.agent) {
  const { setupAtlasRuntime } = await import("/Users/mirlim/.codex/plugins/cache/openai-bundled/browser-use/0.1.0-alpha1/scripts/browser-client.mjs");
  const backend = "iab";
  await setupAtlasRuntime({ globals: globalThis, backend });
}
await agent.browser.nameSession("🌱 #302 연구 노트 QA");
if (typeof tab === "undefined") {
  globalThis.tab = await agent.browser.tabs.new();
}
await tab.goto("http://127.0.0.1:3000/?qaResearchReady=1");
```

## 결과

실패:

```text
Failed to connect to browser-use backend "iab". No Codex IAB backends were discovered. Discovery diagnostics: listedPipes=0, candidates=2, browsers=0, iabBrowsers=0, failures=["legacy-iab/connect/Error","legacy-chrome/connect/Error"], pipeListingError=none.
```

## 대체 검증

Browser Use hands-on QA를 대체 완료로 주장하지 않는다. Playwright는 반복 regression gate로만 사용한다.
후속 evidence는 `npx playwright test --config playwright.config.ts --grep "연구 unlock"`, `npm run check:visual`, screenshot artifact로 남긴다.
