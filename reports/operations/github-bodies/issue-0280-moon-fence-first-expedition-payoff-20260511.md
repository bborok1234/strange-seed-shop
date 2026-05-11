# 월정 문 첫 원정 payoff

## 요약

#526/#527 이후 `월정 문 열기`와 `expedition_moon_fence_unlocked` route state는 생겼지만, 아직 실제 첫 월정 문 원정 출발/귀환/보상 loop가 없습니다. 이번 issue는 opened route를 `월정 문 원정 보내기`, 귀환 상자, 보상 claim, 다음 clue/source promise로 연결합니다.

## Small win

플레이어가 월정 문을 연 직후 다음 행동을 바로 눌러 원정 payoff까지 확인할 수 있습니다.

## 사용자/운영자 가치

- 사용자: route unlock이 텍스트 상태가 아니라 실제 원정 행동과 보상으로 이어집니다.
- 운영자: `expedition_moon_fence_unlocked` start/return/claim telemetry와 screenshot evidence로 다음 D7/D30 source loop를 안전하게 확장할 수 있습니다.

## Before / After 또는 Visual evidence

- Before: `월정 문 열림 · expedition_moon_fence_unlocked` 상태에서 다음 원정 action/reward가 없음.
- After target: `월정 문 원정 보내기` -> `월정 문 귀환 상자` -> reward claim -> 다음 clue/source promise.
- Planned evidence: `reports/visual/issue-0528-moon-fence-first-expedition-payoff/visual-report-20260511.md`

## Playable mode

- `npm run dev:phaser`
- Deterministic fallback: `npm run check:phaser`

## 검증

- `npm run check:phaser`
- `npm run check:content`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:ci`
- `git diff --check`

## 안전 범위

- Runtime image generation/API/cache 호출 없음.
- 새 accepted manifest asset 없음.
- Existing expedition return crate/reward FX를 재사용하고, 전용 moon-fence sprite/FX는 후속 WorkUnit으로 분리합니다.
- 실제 결제/광고/외부 채널 없음.

## 남은 위험

- 전용 moon-fence door-open sprite가 없어 visual polish는 제한됩니다.
- Browser Use가 이번 세션에서도 노출되지 않으면 current-session blocker report와 Playwright fallback screenshot evidence를 남깁니다.

## 작업 checklist

- [ ] WorkUnit plan-first artifact 고정
- [ ] Game Studio route 및 department gate 기록
- [ ] GitHub issue 번호를 WorkUnit/ROADMAP/heartbeat에 반영
- [ ] Moon-fence first expedition start/return/claim 구현
- [ ] Deterministic Phaser checker와 visual evidence 추가
- [ ] PR checks와 main CI 관찰

## 연결된 issue

Follows #526 and #527.
