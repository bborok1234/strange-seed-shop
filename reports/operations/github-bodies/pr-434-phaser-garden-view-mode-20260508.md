# Phaser 신규 정원에 감상 모드와 HUD 접기를 만들기

## 요약

Phaser v1 board에 `감상/관리` view mode를 추가했습니다.

- top HUD에 `감상` toggle 추가
- 감상 모드에서 objective chip과 action rail 숨김
- board render layer를 pull-back 배치해 전체 정원/slot 가시성 강화
- 관리 모드 복귀 시 기존 selected entity/action rail 복구
- smoke verifier에 manage -> overview -> manage return screenshots와 telemetry 추가

## Small win

플레이어가 작업 HUD를 접고 자기 정원을 보는 첫 low-chrome 순간이 생겼습니다.

## 사용자/운영자 가치

플레이어는 `꾸미기/감상` 장기 판타지의 첫 화면 구조를 볼 수 있습니다. 운영자 입장에서는 future decoration/screenshot mode를 runtime-safe, testable foundation 위에 올릴 수 있습니다.

## Before / After 또는 Visual evidence

- Before: 항상 objective/action rail이 열린 관리 화면만 있었습니다.
- After: `감상`을 누르면 resource chips와 `관리` 버튼만 남고, board가 pull-back view로 보입니다.
- Overview: `reports/visual/issue-0434-phaser-garden-view-mode/phaser-check-overview-mode-393.png`
- Manage return: `reports/visual/issue-0434-phaser-garden-view-mode/phaser-check-manage-return-393.png`
- Visual report: `reports/visual/issue-0434-phaser-garden-view-mode/visual-report-20260508.md`

## Playable mode

- Phaser app only: `npm run dev:phaser`
- 검증 viewport: 393x852
- 기존 plant/care/harvest/order/storage smoke loop 유지

## 검증

- `npm run check:phaser`: PASS
- `npm run check:ci`: PASS
- `overviewMode.viewMode`: `overview`
- `overviewMode.hudCollapsed`: `true`
- `overviewMode.actionRailDisplay`: `none`
- `overviewMode.objectiveDisplay`: `none`
- `manageReturn.viewMode`: `manage`
- `manageReturn.hudCollapsed`: `false`
- `git diff --check`: PASS

## 안전 범위

- 신규 asset 생성 없음
- runtime image generation/API/cache 호출 없음
- decoration edit/drag placement 없음
- save data 변경 없음
- 실제 결제, 광고, 외부 배포, credential, 고객 데이터 없음

## 작업 checklist

- [x] Game Studio route 기록
- [x] plan-first item 갱신
- [x] #467 done/main CI evidence 반영
- [x] asset generation blocker report 작성
- [x] visual report 작성
- [x] Phaser smoke verifier 갱신
- [x] full CI 통과

## 남은 위험

- Browser Use execution tool이 이번 세션에 노출되지 않아 Playwright fallback evidence를 사용했습니다.
- 감상 모드는 아직 decoration editing이나 screenshot/share export를 제공하지 않습니다.

## 연결된 issue

Closes #434
