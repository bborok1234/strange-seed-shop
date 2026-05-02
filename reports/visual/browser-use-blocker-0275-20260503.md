# Browser Use blocker — #275 대표 생명체 stage / 돌보기 반응 / 도감 감상면

Date: 2026-05-03
Issue: #275
Branch: codex/0275-creature-stage-care-album-production
Route: `browser-use:browser` → fallback `playwright test`
Status: blocked_current_session

## 목표

#275 visible gameplay/UI 변경은 Browser Use `iab`로 첫 화면, 돌보기 반응, 도감 감상면을 직접 확인해야 한다. 이번 세션에서는 Browser Use bootstrap 경로가 막혀 같은 세션의 blocker를 남기고 Playwright visual regression/screenshot으로 대체 증거를 수집한다.

## 현재 세션에서 확인한 것

- `browser-use:browser` skill을 읽고, 로컬 target은 Node REPL `js`에서 `scripts/browser-client.mjs`를 import해 `setupAtlasRuntime({ backend: "iab" })`로 bootstrap해야 함을 확인했다.
- Browser Use client 파일 존재 확인:
  - `/Users/mirlim/.codex/plugins/cache/openai-bundled/browser-use/0.1.0-alpha1/scripts/browser-client.mjs`
- Node REPL `js` execution tool discovery를 current session에서 시도했다.
  - `node_repl js JavaScript execution Browser Use iab`
  - `mcp__node_repl__js js node_repl JavaScript`
  - 이전 검색에서도 `node_repl js`, `mcp__node_repl__js`, `js`, `node_repl js JavaScript execution` 순서의 노출 재확인을 시도했다.
- 결과: 현재 Codex tool surface에 Node REPL `js` 실행 도구가 노출되지 않았다. 따라서 `setupAtlasRuntime({ backend: "iab" })` 호출까지 도달할 실행 surface가 없다.

## 대체 검증

- Browser Use blocker는 현재 세션 기준으로만 인정한다. 과거 blocker를 재사용하지 않는다.
- 이 PR의 visual/playtest evidence는 아래 Playwright screenshot과 regression으로 대체한다.
  - `reports/visual/creature-stage-production-20260503.png`
  - `reports/visual/care-clue-production-20260503.png`
  - `reports/visual/album-appreciation-production-20260503.png`
- 반복 gate:
  - `npm run check:visual`
  - `npm run check:ci`

## 남은 위험

- Playwright screenshot은 repeatable gate지만 Browser Use hands-on QA의 완전한 대체가 아니다.
- Node REPL `js` 도구가 다시 노출되는 세션에서는 Browser Use `iab`로 같은 URL/viewport/action sequence를 재확인해야 한다.
