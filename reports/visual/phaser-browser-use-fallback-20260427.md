# Phaser Playfield Browser QA Fallback - 2026-04-27

Status: accepted fallback
Scope-risk: narrow

## 결론

Phaser playfield 전환 검증에서 `browser-use:browser` 스킬을 먼저 읽고 사용하려고 했지만, 현재 Codex App 도구 표면에 Browser Use 런타임을 실행하는 Node REPL `js` 도구가 노출되지 않았다. 따라서 이번 검증은 Browser Use 우선 원칙을 위반한 것이 아니라, `docs/BROWSER_QA.md`의 폴백 기준 중 “Node REPL `js` 실행 도구가 노출되지 않는다”에 해당한다.

## 확인한 차단 조건

- `browser-use:browser` 스킬을 먼저 읽었다.
- `tool_search`로 `node_repl js JavaScript execution MCP` 계열 도구를 조회했지만 callable tool이 노출되지 않았다.
- 별도 Playwright 스크립트를 새로 만들지 않고, 이미 프로젝트에 있는 Chrome DevTools Protocol 캡처 경로인 `npm run capture:local`/팀 CDP 증거를 사용했다.

## 대체 증거

- 모바일 playfield: `reports/visual/phaser-playfield-mobile-360-20260427.png`
- 데스크톱 playfield: `reports/visual/phaser-playfield-desktop-1280-20260427.png`
- 첫 loop 이후 playfield: `reports/visual/phaser-playfield-after-loop-20260427.png`
- 기존 Browser Use 기준선: `reports/visual/browser_use_qa_20260427.md`

## 후속 조건

다음 시각 QA에서 Node REPL `js` 도구가 다시 노출되면 Browser Use `iab` backend를 1순위로 재시도한다. 노출되지 않으면 이 문서와 같은 폴백 사유를 먼저 남기고 CDP를 보조 증거로 사용한다.
