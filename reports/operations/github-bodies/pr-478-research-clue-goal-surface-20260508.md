# 요약

#478 연구 단서 목표 surface를 구현한다. #476에서 도감 기록까지 이어진 `달빛 family clue` 흐름이 기록 receipt에서 끊기지 않도록, 기록 완료 직후 Phaser HUD/action rail에 `달빛 단서 기록됨`과 `다음 씨앗 목표: 달빛 새싹` compact surface를 남긴다.

## 작업 checklist

- [x] Game Studio route 기록: `game-studio:game-studio`, `game-ui-frontend`, `phaser-2d-game`, `game-playtest`
- [x] plan-first WorkUnit 작성: `items/0255-research-clue-goal-surface.md`
- [x] `researchClueGoalSurfaceVisible` state/telemetry 추가
- [x] record 후 action rail next-goal surface 추가
- [x] Playwright fallback visual evidence 저장
- [x] roadmap/dashboard/control room/heartbeat 갱신

## Small win

도감 기록 직후 플레이어가 “저장됨”과 “다음 목표”를 같은 하단 rail에서 확인할 수 있다. 새 화면을 열지 않고 collection meta loop를 다음 seed goal로 이어준다.

## 사용자/운영자 가치

- 사용자: 발견한 단서가 사라지지 않고 다음 수집 목표로 연결된다.
- 운영자: `researchClueGoalSurfaceVisible` telemetry로 record 이후 HUD surface 노출을 검증할 수 있다.

## Before / After 또는 Visual evidence

- Before: #476 이후 `researchClueAlbumRecorded`는 true가 되지만 action rail은 다음 seed goal을 별도 surface로 보여주지 않았다.
- After: `reports/visual/issue-0478-research-clue-goal-surface/phaser-check-research-clue-goal-surface-393.png`
- Visual report: `reports/visual/issue-0478-research-clue-goal-surface/visual-report-20260508.md`
- Browser Use: 이번 Codex CLI 세션에서 Browser Use execution tool이 노출되지 않아 Playwright fallback screenshot으로 검증했다.

## Playable mode

- 대상: `apps/seed-garden-phaser`
- 경로: plant -> order -> storage -> research shelf -> clue seed -> album record -> next-goal surface

## 검증

- `npm run check:phaser` pass
- `npm run check:ci` pass

## 안전 범위

- Phaser v1 runtime state/HUD/verifier와 운영 evidence 문서만 변경한다.
- 새 runtime image generation/API/cache 호출은 없다.
- 새 accepted manifest game asset은 추가하지 않는다.

## 남은 위험

- full album card, dedicated record FX, 다음 씨앗 실제 unlock은 후속 WorkUnit이다.

## 연결된 issue

Closes #478
