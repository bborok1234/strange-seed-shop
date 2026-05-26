# Browser Use blocker

- Issue: #550 `새벽이끼 미루 research handoff`
- WorkUnit: `items/0291-moon-grove-miru-research-handoff.md`
- Date: 2026-05-26
- Required route: Browser Use `iab` first for visible gameplay/HUD/playfield QA.

## Blocker

`tool_search` query `browser-use iab navigate screenshot DOM snapshot localhost` did not expose a Browser Use/browser namespace in this Codex session. The available tool surface returned Computer Use, Figma, and GitHub related tools only.

## Fallback evidence

Playwright regression gate `npm run check:phaser` was used as the repeatable fallback and passed. It saved 393px screenshots under this directory, including:

- `phaser-check-moon-grove-miru-research-ready-393.png`
- `phaser-check-moon-grove-miru-research-handoff-393.png`

Manual image inspection confirmed the research shelf action rail surfaces show `미루 연구 맡기기` before handoff and `research_moon_grove_path` / `route_moon_grove_greenhouse_path` after handoff without bottom-tab overlap in the captured viewport.
