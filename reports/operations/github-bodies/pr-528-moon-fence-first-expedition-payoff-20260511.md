# 월정 문 첫 원정 payoff

## 요약

- `expedition_moon_fence_unlocked` route open 이후 action rail에 `월정 문 원정 보내기`를 추가했습니다.
- 월정 문 전용 expedition telemetry로 start/travel/return/claim 상태, return crate, reward motion, 다음 clue promise를 연결했습니다.
- `scripts/check-phaser-foundation.mjs`에 route unlock 이후 `월정 문 원정 보내기 -> 월정 문 귀환 상자 열기 -> clue_moon_grove_001` claim path를 추가했습니다.

## Small win

월정 문이 열린 뒤 플레이어가 실제 원정을 보내고 귀환 상자 보상까지 받을 수 있습니다.

## 사용자/운영자 가치

플레이어는 opened route가 텍스트 상태에서 끝나지 않고 귀환 상자와 보상 receipt로 이어지는 것을 확인합니다. 운영자는 `moonFenceExpeditionState`, `moonFenceReturnCrateVisible`, `moonFenceRewardClaimed`, `moonFenceNextClueId` telemetry로 다음 source/asset slice를 안전하게 이어갈 수 있습니다.

## Before / After 또는 Visual evidence

- Before: `reports/visual/issue-0528-moon-fence-first-expedition-payoff/phaser-check-moon-fence-route-unlocked-393.png`
- Traveling: `reports/visual/issue-0528-moon-fence-first-expedition-payoff/phaser-check-moon-fence-expedition-traveling-393.png`
- Returned: `reports/visual/issue-0528-moon-fence-first-expedition-payoff/phaser-check-moon-fence-expedition-returned-393.png`
- After: `reports/visual/issue-0528-moon-fence-first-expedition-payoff/phaser-check-moon-fence-expedition-claimed-393.png`
- Visual report: `reports/visual/issue-0528-moon-fence-first-expedition-payoff/visual-report-20260511.md`
- Browser Use blocker: `reports/visual/issue-0528-moon-fence-first-expedition-payoff/browser-use-blocker-20260511.md`

Browser Use `iab`는 현재 tool surface에 노출되지 않았습니다. `tool_search`가 `Computer Use`, `xcodebuildmcp`, `node_repl`만 반환해 current-session blocker report를 남기고 Playwright scripted Phaser QA로 fallback했습니다.

## Playable mode

- Phaser playable path: `npm run dev:phaser`
- Checked deterministic path: `npm run check:phaser`
- Route moment: `월정 문 열림` -> `월정 문 원정 보내기` -> `월정 문 귀환 상자 열기` -> `월정 문 보상 수령 · clue_moon_grove_001`

## 검증

- [x] `npm run check:phaser`
- [x] `npm run check:content`
- [x] `npm run check:asset-provenance`
- [x] `npm run check:asset-style`
- [x] `npm run check:ci`
- [x] `npm run check:ops-live`
- [x] `npm run check:dashboard`
- [x] `git diff --check`

## 안전 범위

- Runtime image generation/API/cache 호출 없음.
- 새 accepted manifest asset 없음.
- Existing expedition return crate/reward FX를 재사용했습니다.
- `clue_moon_grove_001`은 다음 source promise telemetry이며, concrete source/asset path는 후속 WorkUnit으로 분리했습니다.

## 남은 위험

- 전용 moon-fence door-open sprite/FX는 아직 없습니다.
- `clue_moon_grove_001`은 아직 accepted seed/source asset이 아니므로 다음 slice에서 concrete source/asset path 또는 dedicated FX bundle로 이어져야 합니다.
- Browser Use hands-on QA는 tool-surface blocker로 수행하지 못했고, Playwright fallback evidence로 대체했습니다.

## 작업 checklist

- [x] Plan-first WorkUnit 작성
- [x] Game Studio route 기록
- [x] 월정 문 first expedition start/return/claim 연결
- [x] Deterministic Phaser checker와 screenshot evidence 추가
- [x] 로컬 CI 및 운영 gate 통과
- [ ] PR checks 확인
- [ ] Merge 후 main CI 관찰

## 연결된 issue

Closes #528
