# Browser Use blocker — #296 첫 주문 납품 상자 출하 / 보상 흐름

- WorkUnit: GitHub issue #296 `첫 주문 납품을 상자 출하 상태와 보상 흐름으로 production화한다`
- Timestamp: 2026-05-03T03:00Z
- Route: `game-studio:game-studio` → `game-studio:game-ui-frontend` + `game-studio:game-playtest`
- 우선순위: Browser Use `iab` current-session QA를 먼저 시도했고, 실패 후 Playwright regression/screenshot fallback을 사용한다.

## 현재 세션 시도

1. `browser-use:browser` skill을 현재 턴에서 전체 확인했다.
2. `tool_search`로 `node_repl js JavaScript execution`을 검색했고 `mcp__node_repl__.js`가 노출됨을 확인했다.
3. Browser Use plugin root의 `scripts/browser-client.mjs` 존재를 확인했다.
4. Vite dev server를 `http://127.0.0.1:3000/`로 시작했다.
5. Node REPL에서 아래 iab bootstrap을 시도했다.

```js
const { setupAtlasRuntime } = await import("/Users/mirlim/.codex/plugins/cache/openai-bundled/browser-use/0.1.0-alpha1/scripts/browser-client.mjs");
const backend = "iab";
await setupAtlasRuntime({ globals: globalThis, backend });
```

## blocker

- 결과: `iab` backend discovery 실패. 현재 Codex App 세션에서 연결 가능한 Codex IAB backend가 발견되지 않았다.
- 실패 지점: `setupAtlasRuntime({ backend: "iab" })` 호출 단계.
- 이 blocker는 과거 blocker 재사용이 아니라 #296 current-session 재시도 결과다.

## fallback evidence

- Focused Playwright regression: `npx playwright test --config playwright.config.ts --grep "자동 생산과 첫 주문|복귀 첫 30초"` → 2 passed.
- Screenshot: `reports/visual/issue-296-order-crate-dispatch-reward-motion-393.png`
- 검증한 invariant:
  - 첫 주문 ready copy: `12/12 잎 · 출하 준비`
  - readiness hint: `상자 봉인 완료 · 납품하면 보상 수거`
  - 납품 후 receipt: `상자 출하 완료`, reward 수거 문구, 다음 주문 title
  - playfield crate variant: `.order-variant-first-dispatched`
  - 모바일 393px body horizontal scroll 없음
  - starter panel `scrollHeight <= clientHeight`
  - receipt/order card bottom-tab overlap 없음
