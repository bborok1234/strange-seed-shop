# Browser Use blocker - Issue #548

## 상태

- Date: 2026-05-26
- WorkUnit: `items/0290-moon-grove-creature-runtime-binding.md`
- Issue: #548
- Route: `game-studio:game-studio -> game-studio:phaser-2d-game -> game-studio:game-ui-frontend -> game-studio:game-playtest`

## Blocker

Codex in-app Browser Use `browser`/`browser-use` namespace가 현재 세션 tool surface에 노출되지 않았다.

시도:

- `tool_search`: `browser in-app navigate screenshot local URL`
- `tool_search`: `browser-use iab navigate screenshot DOM snapshot localhost`

결과:

- 노출된 fallback tool: Node REPL, Computer Use, Figma, GitHub 일부
- 미노출 tool: Browser Use `iab` navigation/screenshot/DOM snapshot

## Fallback evidence

- `npm run check:phaser` 통과
- Playwright screenshot evidence:
  - `reports/visual/issue-0548-moon-grove-creature-runtime-binding/phaser-check-moon-grove-harvested-393.png`
  - `reports/visual/issue-0548-moon-grove-creature-runtime-binding/phaser-check-moon-fence-source-overview-393.png`
  - `reports/visual/issue-0548-moon-grove-creature-runtime-binding/phaser-check-moon-grove-ready-393.png`

## Visual observation

- `월정 숲 수확` 후 `월정 숲 발견` HUD surface가 보인다.
- overview mode에서 `creature_moon_grove_001`, `actor_moon_grove_miru_idle_strip_v1`, `actor_moon_grove_miru_work_strip_v1`, `fx_moon_grove_discovery_bloom_strip_v1`가 playfield에 남는다.
- viewport invariant: `bodyScrollHeight === innerHeight`로 body scroll 없음.
