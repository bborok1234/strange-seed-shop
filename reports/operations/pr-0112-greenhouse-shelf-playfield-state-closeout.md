# 온실 선반 playfield 상태 증거를 source of truth에 반영한다

## 요약

PR #210 merge와 main CI 성공을 `items`, `docs/ROADMAP.md`, `docs/DASHBOARD.md`, GitHub issue evidence에 반영했습니다.

## Small win

다음 운영 세션이 #209를 active 상태로 오해하지 않도록 source of truth를 닫았습니다.

## 사용자/운영자 가치

운영자는 온실 선반 playfield 상태 vertical slice의 PR, Browser Use evidence, main CI를 문서에서 바로 확인할 수 있습니다.

## Before / After 또는 Visual evidence

- Before: `Greenhouse shelf playfield state v0`가 roadmap에서 active 상태였습니다.
- After: `done`, PR #210, main CI `25153332087`이 기록됐습니다.
- Visual evidence는 기능 PR #210의 `reports/visual/p0-greenhouse-shelf-playfield-state-v0-20260430.md`를 유지합니다.

## Playable mode

- 기능 변경 없음.
- QA 경로는 PR #210에서 검증한 `/?qaOfflineMinutes=60&qaLunarGuardian=1&qaGreenhouseShelf=1&qaReset=1`와 동일합니다.

## 검증

- Main CI `25153332087`: PASS
- `npm run update:dashboard`: PASS

## 안전 범위

- 문서/evidence 상태 갱신만 포함합니다.
- runtime, economy, UI 동작 변경 없음.

## 작업 checklist

- [x] item status를 `done`으로 갱신
- [x] roadmap에 PR #210과 main CI 기록
- [x] dashboard 재생성
- [x] GitHub issue #209 본문 갱신

## 남은 위험

- closeout PR checks에서 문서 상태를 다시 확인합니다.

## 연결된 issue

Follow-up evidence for #209.
