# 온실 주문 완료 증거를 source of truth에 반영한다

## 요약

PR #204 merge와 main CI 성공을 `items`, `docs/ROADMAP.md`, `docs/DASHBOARD.md`, GitHub issue evidence에 반영했습니다.

## Small win

다음 운영 세션이 #203을 다시 review 상태로 오해하지 않도록 source of truth를 닫았습니다.

## 사용자/운영자 가치

운영자는 merged feature와 검증 run을 문서에서 바로 확인할 수 있고, 다음 issue 선택이 stale 상태에 끌려가지 않습니다.

## Before / After 또는 Visual evidence

- Before: `Greenhouse facility order v0`가 roadmap/dashboard에서 review 상태였습니다.
- After: `done`, PR #204, main CI `25151660976`이 기록됐습니다.
- Visual evidence는 기능 PR #204의 `reports/visual/p0-greenhouse-facility-order-v0-20260430.md`를 유지합니다.

## Playable mode

- 기능 변경 없음.
- 플레이 흐름은 PR #204에서 검증한 `/?qaResearchExpeditionClaimReady=1&qaTab=expedition&qaReset=1` 경로와 동일합니다.

## 검증

- `npm run check:dashboard`: PASS
- `npm run check:docs`: PASS
- Main CI `25151660976`: PASS

## 안전 범위

- 문서/evidence 상태 갱신만 포함합니다.
- runtime, economy, UI 동작 변경 없음.

## 작업 checklist

- [x] item status를 `done`으로 갱신
- [x] roadmap에 PR #204와 main CI 기록
- [x] dashboard 재생성
- [x] GitHub issue #203 본문 갱신

## 남은 위험

- closeout PR checks에서 문서 상태를 다시 확인합니다.

## 연결된 issue

Follow-up evidence for #203.
