# P0 Research Expedition Bridge v0 Evidence

Date: 2026-04-29
Issue: #160
Branch: `codex/0090-research-expedition-bridge-v0`
Mode: Browser Use + Playwright visual gate

## Summary

연구 완료 상태가 씨앗 단서에서 멈추지 않고 원정 탭의 장기 메타 단서로 이어진다. `?qaResearchComplete=1`에서 하단 원정 탭은 `단서` badge를 표시하고, 원정 탭은 `달빛 흔적 찾기` 연구 원정 preview를 보여준다.

## Game Studio route

- `game-studio:game-studio`
- `game-studio:web-game-foundations`: save migration 없이 research complete derived state를 원정 content hint와 연결했다.
- `game-studio:game-ui-frontend`: 정원 playfield/action surface 높이를 늘리지 않고 bottom tab badge와 expedition tab card를 사용했다.
- `game-studio:game-playtest`: Browser Use와 focused visual gate로 `research complete -> expedition clue`를 검증했다.

## Evidence

- Browser Use screenshot: `reports/visual/p0-research-expedition-bridge-v0-browser-use-20260429.png`
- Playwright screenshot: `reports/visual/p0-research-expedition-bridge-v0-20260429.png`

## Verified behavior

- 하단 원정 탭에 `단서` badge가 보인다.
- 원정 탭에 `연구 원정 단서` card가 보인다.
- `달빛 흔적 찾기`, `생명체 2마리 필요`, `+420 잎 · +2 재료`, `1마리 더 발견하면` copy가 보인다.
- 기존 research complete short viewport visual gate가 계속 통과한다.

## Verification

- `npm run check:visual -- --grep "연구 완료 후 원정"` PASS
- `npm run check:visual -- --grep "연구 단서|짧은 모바일"` PASS
- `npm run check:visual` PASS (19 tests)
- `npm run check:ci` PASS
- Browser Use DOM/screenshot QA PASS
