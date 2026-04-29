# P0 Research Expedition Start v0 Evidence

Date: 2026-04-29
Issue: #162
Branch: `codex/0091-research-expedition-start-v0`
Mode: Browser Use + Playwright visual gate

## Summary

연구 완료와 두 번째 생명체 발견이 `달빛 흔적 찾기` 원정 시작으로 이어진다. 기존 `activeExpedition` save 구조를 재사용하며, 새 save migration이나 reward tuning 없이 연구 원정의 첫 player verb를 추가했다.

## Game Studio route

- `game-studio:game-studio`
- `game-studio:web-game-foundations`: 기존 expedition state를 재사용해 `moon_hint`를 시작한다.
- `game-studio:game-ui-frontend`: 원정 탭 안에서만 start action을 추가해 정원 playfield와 action surface를 보호했다.
- `game-studio:game-playtest`: Browser Use와 visual gate로 시작 전/후 상태를 검증했다.

## Evidence

- Browser Use screenshot: `reports/visual/p0-research-expedition-start-v0-browser-use-20260429.png`
- Playwright screenshot: `reports/visual/p0-research-expedition-start-v0-20260429.png`

## Verified behavior

- `?qaResearchExpeditionReady=1&qaTab=expedition`에서 하단 원정 탭이 `준비` badge를 보인다.
- 원정 탭의 `달빛 흔적 찾기 시작` 버튼이 enabled 상태다.
- 클릭 후 `activeExpedition.expeditionId`가 `moon_hint`로 저장되고 creature 2마리가 배치된다.
- 클릭 후 원정 탭은 `진행` badge와 `60분 남음 · 돌아오면 보상 수령`을 보인다.

## Verification

- `npm run check:visual -- --grep "연구 원정 시작"` PASS
- `npm run check:visual` PASS (20 tests)
- `npm run check:ci` PASS
- Browser Use DOM/screenshot QA PASS
