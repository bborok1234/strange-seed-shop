# #284 Browser Use iab blocker — 2026-05-03

## WorkUnit

- GitHub issue: #284 `정원 첫 화면을 생산 엔진 중심으로 재배치해 수확·납품을 한 장면에 묶는다`
- Gate: UI/visual 작업은 Browser Use `iab` 우선 QA를 시도해야 한다.

## 현재 세션 시도

1. `browser-use:browser` skill 전체를 한 번에 읽어 Browser Use 경로를 확인했다.
2. Browser Use plugin root의 client 존재를 확인했다.
   - `/Users/mirlim/.codex/plugins/cache/openai-bundled/browser-use/0.1.0-alpha1/scripts/browser-client.mjs`
3. Node REPL `js` 실행 tool discovery를 순서대로 시도했다.
   - `node_repl js`: 0 tools
   - `mcp__node_repl__js`: 0 tools
   - `js`: 0 tools
   - `node_repl js JavaScript execution`: 0 tools

## Blocker

현재 Codex App 세션에서 Browser Use bootstrap을 실행할 Node REPL `js` tool이 노출되지 않았다. 따라서 `setupAtlasRuntime({ backend: "iab" })`를 실행할 수 없어 Browser Use `iab` 직접 screenshot/playtest를 진행하지 못했다.

## Fallback evidence

Browser Use blocker가 현재 세션에서 재현되어 Playwright visual regression으로 대체 증거를 남겼다.

- `npm run check:visual -- --grep "생산 엔진|한 장면|production engine"` → 1 passed
- `npm run check:visual -- --grep "creature stage|기억 도장|생산 엔진|달빛 보호 주문 완료"` → 4 passed
- Screenshot: `reports/visual/first-screen-production-engine-one-scene-20260503.png`

## 판정

Browser Use unavailable due to missing Node REPL `js` surface in this session. Fallback is valid for #284 only because the required current-session blocker evidence is recorded above.
