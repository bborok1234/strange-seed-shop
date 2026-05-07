# #478 연구 단서 목표 surface visual report

## Route

- Game Studio: `game-studio:game-studio`
- Specialist: `game-studio:game-ui-frontend`, `game-studio:phaser-2d-game`, `game-studio:game-playtest`

## Browser Use

Browser Use execution tool이 이번 Codex CLI 세션에 노출되지 않아 Playwright fallback으로 검증했다.

## Evidence

- Command: `npm run check:phaser`
- Result: pass
- Viewport: 393 x 852
- Screenshot: `reports/visual/issue-0478-research-clue-goal-surface/phaser-check-research-clue-goal-surface-393.png`

## Findings

- 도감 기록 직후 action rail에 `달빛 단서 기록됨`과 `다음 씨앗 목표: 달빛 새싹` compact surface가 보인다.
- objective chip도 `달빛 단서 기록됨 · 다음 씨앗 목표: 달빛 새싹`으로 전환된다.
- telemetry에서 `researchClueGoalSurfaceVisible: true`, `researchClueAlbumRecorded: true`, `researchClueRecordReady: false`를 확인했다.
- 모바일 393px에서 body/document scroll은 viewport 높이 852와 동일해 하단 rail overflow가 없다.
- surface는 하단 rail 안에 머물며 playfield 중앙을 추가로 가리지 않는다.

## Remaining Risk

- full album card, dedicated record FX, 다음 씨앗 실제 unlock은 후속 WorkUnit이다.
