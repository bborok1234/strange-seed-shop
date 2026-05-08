# Browser Use blocker - issue 0512

## 상태

- 날짜: 2026-05-08
- WorkUnit: `items/0272-night-glass-source-planting-loop.md`
- Issue: #512
- Route: `game-studio:game-studio -> game-studio:phaser-2d-game -> game-studio:game-ui-frontend -> game-studio:game-playtest`

## 차단 내용

현재 Codex tool surface에서 `browser-use:browser`/`iab` callable이 노출되지 않았다. `tool_search`로 `browser-use browser iab navigate screenshot localhost DOM`을 조회했지만, follow-up callable은 `Computer Use`와 `xcodebuildmcp` 계열만 제공됐다.

## 대체 검증

Browser Use hands-on QA 대신 `scripts/check-phaser-foundation.mjs`의 Playwright fallback을 사용했다. 이번 fallback은 다음 evidence를 저장한다.

- `reports/visual/issue-0512-night-glass-source-planting-loop/phaser-check-night-glass-plant-action-393.png`
- `reports/visual/issue-0512-night-glass-source-planting-loop/phaser-check-night-glass-planted-393.png`

## 남은 위험

Playwright는 deterministic regression gate로 충분하지만, 실제 Codex in-app Browser Use 상호작용 감각 검증은 이번 세션에서 수행하지 못했다. Browser Use callable이 복구되면 같은 URL/viewport에서 source 획득 후 빈 밭 `밤유리 심기` 클릭까지 hands-on 재확인이 필요하다.
