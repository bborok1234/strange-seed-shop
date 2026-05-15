# Browser Use blocker - Issue #534

## 상태

- Status: blocked-fallback-used
- Date: 2026-05-15
- Issue: #534 `월정 숲 source runtime binding`
- Route: `game-studio:game-studio -> game-studio:phaser-2d-game -> game-studio:game-ui-frontend -> game-studio:game-playtest`

## 시도

- 현재 Codex 세션에서 `tool_search`로 `browser-use`, `in-app browser`, `iab`, `navigate`, `screenshot`, `DOM snapshot` 계열 도구를 검색했다.
- 노출된 도구는 `Computer Use`, `Build iOS Apps`, 일부 GitHub connector뿐이었다.
- `browser-use:browser` 또는 in-app browser `iab` 실행 도구가 노출되지 않아 Browser Use 직접 클릭/스크린샷 QA를 수행할 수 없었다.

## 대체 검증

- `npm run check:phaser`를 Playwright fallback gate로 실행했다.
- Smoke는 `월정 문 귀환 상자 열기` 이후 `감상` 모드로 전환해 source 화면 스크린샷을 저장한다.
- 저장된 핵심 증거:
  - `reports/visual/issue-0534-moon-grove-source-runtime-binding/phaser-check-moon-fence-expedition-claimed-393.png`
  - `reports/visual/issue-0534-moon-grove-source-runtime-binding/phaser-check-moon-fence-source-overview-393.png`

## 판정

Browser Use current-session blocker가 있어 Playwright fallback evidence를 사용했다. fallback은 telemetry와 screenshot을 함께 검증하며, body scroll 없음, HUD/action rail collapse, `seed_moon_grove_001_icon`, `fx_moon_grove_source_reward_strip_v1` runtime key를 확인한다.
