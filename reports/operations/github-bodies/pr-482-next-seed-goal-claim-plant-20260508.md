# 요약

#482 다음 씨앗 목표 수령/심기 bridge를 구현한다. #478 이후 도감 기록 다음 목표가 visible surface에서 멈추지 않도록 `목표 씨앗 받기`와 빈 밭 `목표 심기` action을 추가해 collection meta를 다음 planting loop로 연결한다.

## 작업 checklist

- [x] Game Studio route 기록: `game-studio:game-studio`, `game-ui-frontend`, `phaser-2d-game`, `game-playtest`
- [x] plan-first WorkUnit 작성: `items/0257-next-seed-goal-claim-plant.md`
- [x] `researchNextGoalSeedAvailable/Claimed/Planted` state/telemetry 추가
- [x] goal surface + `목표 씨앗 받기` CTA 렌더링
- [x] 빈 밭 `목표 심기` action과 `seed_lunar_sprout_001` planting bridge 추가
- [x] Playwright fallback visual evidence 저장
- [x] roadmap/dashboard/control room/heartbeat 갱신

## Small win

도감 기록 후 다음 목표가 “보기”에서 끝나지 않고 바로 씨앗 수령과 심기로 이어진다.

## 사용자/운영자 가치

- 사용자: 다음 수집 목표를 확인한 직후 같은 하단 rail에서 다음 행동을 실행할 수 있다.
- 운영자: `researchNextGoalSeedClaimed`, `researchNextGoalSeedPlanted`, plot `seedId` telemetry로 loop 재진입을 검증할 수 있다.

## Before / After 또는 Visual evidence

- Before: `달빛 단서 기록됨 · 다음 씨앗 목표` surface는 있었지만 실제 claim/plant verb가 없었다.
- After: `목표 씨앗 받기 -> 목표 심기`로 `seed_lunar_sprout_001`이 3번 밭에 심어진다.
- Visual report: `reports/visual/issue-0482-next-seed-goal-claim-plant/visual-report-20260508.md`
- Final screenshot: `reports/visual/issue-0482-next-seed-goal-claim-plant/phaser-check-next-goal-seed-planted-393.png`
- Browser Use: 이번 Codex CLI 세션에서 Browser Use execution tool이 노출되지 않아 Playwright fallback screenshot으로 검증했다.

## Playable mode

- 대상: `apps/seed-garden-phaser`
- 경로: plant -> order -> storage -> research shelf -> clue seed -> album record -> goal seed claim -> goal seed plant

## 검증

- `npm run check:phaser` pass
- `npm run check:ci` pass

## 안전 범위

- Phaser v1 runtime state/HUD/verifier와 운영 evidence 문서만 변경한다.
- 새 runtime image generation/API/cache 호출은 없다.
- 새 accepted manifest game asset은 추가하지 않는다.

## 남은 위험

- 달빛 새싹 성장/수확/reveal, dedicated record stamp FX runtime 연결은 후속 WorkUnit이다.

## 연결된 issue

Closes #482
