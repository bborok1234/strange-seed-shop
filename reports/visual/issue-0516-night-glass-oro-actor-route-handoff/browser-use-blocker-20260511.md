# Browser Use blocker - issue 0516

## 상태

- 날짜: 2026-05-11
- WorkUnit: `items/0274-night-glass-oro-actor-route-handoff.md`
- Issue: #516
- Route: `game-studio:game-studio -> game-studio:phaser-2d-game -> game-studio:game-ui-frontend -> game-studio:game-playtest`

## 차단 내용

현재 Codex tool surface에서 `browser-use:browser`/`iab` callable이 노출되지 않았다. `tool_search`로 `browser-use browser iab navigate screenshot localhost DOM click`을 조회했지만, follow-up callable은 `Computer Use`와 `xcodebuildmcp` 계열만 제공됐다.

## 대체 검증

Browser Use hands-on QA 대신 `scripts/check-phaser-foundation.mjs`의 Playwright fallback을 사용했다. 이번 fallback은 다음 evidence를 저장한다.

- `reports/visual/issue-0516-night-glass-oro-actor-route-handoff/phaser-check-night-glass-revealed-393.png`
- `reports/visual/issue-0516-night-glass-oro-actor-route-handoff/phaser-check-night-glass-oro-handoff-393.png`

## 남은 위험

Playwright는 deterministic regression gate로 충분하지만, 실제 Codex in-app Browser Use 상호작용 감각 검증은 이번 세션에서 수행하지 못했다. Browser Use callable이 복구되면 같은 URL/viewport에서 `밤유리 수확 -> 오로 actor 합류 -> 월정 문 preview` hands-on 재확인이 필요하다.
