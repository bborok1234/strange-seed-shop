## 요약

신규 Phaser vertical slice Stage 2로 `감상 모드`를 추가한다. 기본 플레이는 밭/작업대 중심의 낮은 관리 카메라로 유지하고, 사용자가 원할 때 HUD를 접고 전체 정원을 보는 pull-back view로 전환한다.

## Small win

성장/관리를 위한 낮은 카메라와 정원 꾸미기/감상을 위한 전체 카메라를 분리한다.

## 사용자/운영자 가치

- 사용자: 씨앗들의 정원을 꾸미고 감상하는 포인트가 화면 구조로 살아난다.
- 운영자: Studio가 camera mode, HUD collapse, overview asset, Browser Use visual QA를 분리된 WorkUnit으로 수행한다.

## Before / After 또는 Visual evidence

- Before: 하나의 카메라에서 배경 전체와 성장/관리 장면을 동시에 만족시키려다 둘 다 약함.
- After 목표: `관리`와 `감상` 전환이 명확하고, 감상 모드에서는 전체 정원이 UI에 가려지지 않음.

## Playable mode

- Depends on Stage 1 issue
- 대상 viewport: 393x852 mobile frame
- Browser Use `iab`: manage -> overview -> manage return

## 검증

- 신규 app build script
- Browser Use `iab` 3-state screenshot
- focused visual regression: mode toggle, HUD collapse, camera bounds

## 안전 범위

- 실제 꾸미기 편집/드래그 배치 시스템은 제외
- 기존 앱 desktop layout 수정 제외
- 실결제, 로그인, 외부 배포 금지

## 남은 위험

감상 모드가 단순 배경 보기로만 끝나면 core loop와 분리될 수 있다. 장식 prop은 future decoration foundation으로 명시한다.

## 연결된 문서

- GitHub issue: https://github.com/bborok1234/strange-seed-shop/issues/434
- `docs/PHASER_GREENFIELD_VERTICAL_SLICE_SPEC.md`
- `items/0230-phaser-garden-view-mode.md`
