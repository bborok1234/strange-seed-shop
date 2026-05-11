# 월정 문 route unlock

## 요약

- `달빛 단서 2/2 ready`, `재료 3/3 ready`, `오로 explorer` 이후 action rail에 `월정 문 열기`를 추가했습니다.
- `월정 문 열기` 실행 후 `expedition_moon_fence_unlocked` route id, unlocked marker, objective/receipt/HUD surface, deterministic telemetry를 연결했습니다.
- `scripts/check-phaser-foundation.mjs`에 second clue 이후 unlock action click과 final route unlocked assertion, screenshot evidence를 추가했습니다.

## Small win

월정 문 요구 조건이 모두 준비된 뒤 텍스트 대기 상태에서 멈추지 않고, 플레이어가 직접 문을 열어 unlocked route preview를 확인할 수 있습니다.

## 사용자/운영자 가치

플레이어는 `달빛 단서 포장` 다음 행동을 바로 이해하고 `월정 문 열림` 상태를 볼 수 있습니다. 운영자는 `moonFenceRouteUnlocked`, `moonFenceUnlockedRouteId`, `moonFenceUnlockedMarkerVisible` telemetry와 Playwright screenshot evidence로 이후 첫 월정 문 원정 slice를 안전하게 이어갈 수 있습니다.

## Before / After 또는 Visual evidence

- Before: `reports/visual/issue-0526-moon-fence-route-unlock/phaser-check-moon-fence-second-clue-393.png`
- After: `reports/visual/issue-0526-moon-fence-route-unlock/phaser-check-moon-fence-route-unlocked-393.png`
- Visual report: `reports/visual/issue-0526-moon-fence-route-unlock/visual-report-20260511.md`
- Browser Use blocker: `reports/visual/issue-0526-moon-fence-route-unlock/browser-use-blocker-20260511.md`

Browser Use `iab`는 현재 tool surface에 노출되지 않았습니다. `tool_search`가 `Computer Use`, `xcodebuildmcp`, `node_repl`만 반환해 current-session blocker report를 남기고 Playwright scripted Phaser QA로 fallback했습니다.

## Playable mode

- Phaser playable path: `npm run dev:phaser`
- Checked deterministic path: `npm run check:phaser`
- Route moment: `달빛 단서 포장` 이후 `월정 문 열기` 클릭 -> `월정 문 열림 · expedition_moon_fence_unlocked · 오로 explorer`

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
- Route unlock state/action/HUD/checker만 변경하고 첫 월정 문 원정 출발/보상은 후속 WorkUnit으로 분리했습니다.

## 남은 위험

- `월정 문 열림` marker는 기존 expedition gate art 위 compact text chip입니다. 전용 door-open sprite/FX는 첫 unlocked route expedition payoff 전에 별도 asset/FX WorkUnit으로 다루는 것이 좋습니다.
- Browser Use hands-on QA는 tool-surface blocker로 수행하지 못했고, Playwright fallback evidence로 대체했습니다.

## 작업 checklist

- [x] Plan-first WorkUnit 작성
- [x] Game Studio route 기록
- [x] 월정 문 unlock state/action/HUD/playfield 연결
- [x] Deterministic Phaser checker와 screenshot evidence 추가
- [x] 로컬 CI 및 운영 gate 통과
- [ ] PR checks 확인
- [ ] Merge 후 main CI 관찰

## 연결된 issue

Closes #526
