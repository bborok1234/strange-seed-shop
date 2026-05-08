# 밤유리 source preview bridge visual report

## 범위

- WorkUnit: `items/0267-night-glass-source-preview.md`
- GitHub issue: #502
- Game Studio route: `game-studio:game-studio -> game-studio:web-game-foundations -> game-studio:game-ui-frontend -> game-studio:phaser-2d-game -> game-studio:game-playtest`
- 목표: `은빛이끼 루미` reveal 후 `밤유리 source 보기` player verb, rare route locked node, accepted rare silhouette marker를 확인한다.

## Browser Use

- Browser Use iab 도구는 현재 Codex tool surface에 노출되지 않았다.
- `tool_search`로 `browser-use iab open navigate screenshot DOM local browser`를 검색했으나 Computer Use, Node REPL, GitHub 계열 도구만 반환되었다.
- 따라서 이번 visual QA는 Playwright fallback과 저장된 screenshot inspection으로 수행했다.

## Evidence

- Command: `npm run check:phaser`
- Result: pass
- Screenshot: `reports/visual/issue-0502-night-glass-source-preview/phaser-check-night-glass-source-preview-393.png`
- Viewport: mobile 393 x 852

## 관찰

- 최종 HUD objective는 `밤유리 source preview · expedition_night_glass 잠김`으로 표시된다.
- action rail에는 `밤유리 source`, `seed_rare_001`, `research_rare_glass`, `expedition_night_glass`가 남는다.
- playfield에는 accepted `creature_lunar_rare_001` 기반의 어두운 rare silhouette와 `밤유리 source 잠김` marker가 보인다.
- `은빛이끼 루미` reveal actor와 night-glass locked marker는 동시에 보이며, marker가 수확 보상 흐름 다음 장기 route로 읽힌다.
- 모바일 393px 화면에서 body/document scroll은 발생하지 않는다.

## 남은 위험

- `seed_rare_001` 전용 seed icon과 dedicated FX는 아직 없다.
- 이번 slice는 rare acquisition이 아니라 D30 rare source preview bridge다. 실제 `expedition_night_glass` 실행과 `research_rare_glass` unlock은 후속 WorkUnit으로 분리해야 한다.
