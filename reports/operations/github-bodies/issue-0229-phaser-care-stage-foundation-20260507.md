## 요약

신규 Phaser-first vertical slice Stage 1을 만든다. 기존 React/CSS 정원 화면의 큰 visual rewrite를 멈추고, 낮은 관리 카메라에서 밭/작업대/포리/모모가 실제 정원 관리 actor로 보이는 독립 scene을 구축한다.

## Small win

기존 화면의 `가상 사각형 안 왕복 캐릭터` 문제를 구조적으로 끊고, 생명체가 밭을 살피고 돌보는 장면을 Browser Use로 검수한다.

## 사용자/운영자 가치

- 사용자: 정원이 배경 이미지가 아니라 생명체가 관리하는 게임 장면으로 보인다.
- 운영자: Studio가 greenfield Phaser game spec -> asset -> runtime -> Browser Use QA를 한 issue에서 닫을 수 있는지 검증한다.

## Before / After 또는 Visual evidence

- Before: 기존 정원 support worker가 DOM anchor 안에서 sprite-strip/bob motion으로 왕복해 sticker처럼 보임.
- After 목표: 신규 Phaser scene 393x852에서 밭/작업대/포리/모모가 낮은 카메라 안에 접지되어 보임.

## Playable mode

- 신규 app 후보: `apps/seed-garden-phaser/`
- 대상 viewport: 393x852 mobile frame
- Browser Use `iab` 필수

## 검증

- 신규 app build script
- `npm run build`
- Browser Use `iab` screenshot: `reports/visual/issue-0229-phaser-care-stage-foundation/`
- asset provenance/style/normalization checks when assets are registered

## 안전 범위

- 기존 React 정원 화면 대규모 rewrite 금지
- 실결제, 로그인, 광고, 외부 배포 금지
- runtime image generation 금지

## 남은 위험

Stage 1이 기존 앱보다 시각적으로 낫지 않으면 Stage 2/3 진행 전에 greenfield 방향을 재평가한다.

## 연결된 문서

- GitHub issue: https://github.com/bborok1234/strange-seed-shop/issues/433
- `docs/PHASER_GREENFIELD_VERTICAL_SLICE_SPEC.md`
- `items/0229-phaser-care-stage-foundation.md`
