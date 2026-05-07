# Phaser 신규 정원에 감상 모드와 HUD 접기를 만들기

## 요약

신규 Phaser v1 board에 `감상/관리` mode toggle을 추가한다. 감상 모드에서는 objective/action rail을 접고 정원 board를 pull-back view로 보여준다.

## Small win

관리 HUD가 열린 작업 화면과 정원을 소유하고 감상하는 low-chrome 화면을 분리한다.

## 사용자/운영자 가치

- 사용자: 정원 전체와 locked slot/facility를 UI에 가리지 않고 볼 수 있다.
- 운영자: screenshot-safe overview, future decoration mode, HUD collapse를 작은 검증 가능한 WorkUnit으로 분리한다.

## Before / After 또는 Visual evidence

- Before: 항상 objective/action rail이 열린 관리 화면만 있었다.
- After: `감상`을 누르면 top resource chips와 `관리` 버튼만 남고, board가 pull-back view로 보인다.
- Overview screenshot: `reports/visual/issue-0434-phaser-garden-view-mode/phaser-check-overview-mode-393.png`
- Manage return screenshot: `reports/visual/issue-0434-phaser-garden-view-mode/phaser-check-manage-return-393.png`
- Visual report: `reports/visual/issue-0434-phaser-garden-view-mode/visual-report-20260508.md`

## Playable mode

- 대상 app: `apps/seed-garden-phaser`
- 대상 viewport: 393x852
- 확인 흐름: fresh start -> `감상` -> overview screenshot -> `관리` -> 기존 plant/order/storage smoke loop

## 검증

- `npm run check:phaser`: PASS
- `npm run check:ci`: PASS
- telemetry: overview mode, HUD collapsed, action rail/objective hidden, manage return restored

## 안전 범위

- 신규 asset 생성 없음
- runtime image generation/API/cache 호출 없음
- decoration edit/drag placement 없음
- save data 변경 없음
- 실제 결제, 광고, 외부 배포, credential, 고객 데이터 없음

## 남은 위험

감상 모드는 아직 decoration editing이나 screenshot/share export를 제공하지 않는다. 이번 WorkUnit은 low-chrome view mode foundation만 추가한다.

## 연결된 문서

- `docs/GAME_BIBLE.md`
- `docs/phaser/REBOOT_FOUNDATION_SPEC.md`
- `items/0230-phaser-garden-view-mode.md`
- `reports/operations/asset-generation-blocker-0467-20260508.md`
