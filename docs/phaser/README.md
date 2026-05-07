# Phaser Active Lane

이 디렉터리는 신규 Phaser-first 정원의 active source-of-truth다. 기존 React playable을 계속 고치는 문서가 아니다.

## Reset Notice

2026-05-07 기준으로 기존 `VERTICAL_SLICE_SPEC.md`의 Stage 1/2/3 계획은 active 구현 기준에서 보류한다. 그 계획은 `plot_left`/`plot_right` 2개 밭과 낮은 고정 구도에서 출발해, 배경에 밭이 baked-in 되는 설계 실패로 이어질 수 있다.

게임 전체의 active source-of-truth는 `docs/GAME_BIBLE.md`다. 이 디렉터리의 active Phaser source-of-truth는 `docs/phaser/REBOOT_FOUNDATION_SPEC.md`이며, 신규 Phaser 작업은 `GAME_BIBLE.md`의 살아있는 정원 상회, v1+30일 progression, 온실 세계 확장 기준을 구현해야 한다.

## Code

- `apps/seed-garden-phaser/`: 신규 Phaser app
- `npm run dev:phaser`: Phaser app 개발 서버
- `npm run build:phaser`: Phaser app build
- `npm run check:phaser`: Phaser app verification

## Active Specs

- `docs/GAME_BIBLE.md`: 상위 게임 바이블. Phaser 구현보다 우선한다.
- `docs/phaser/REBOOT_FOUNDATION_SPEC.md`: Phaser 리부트 foundation active reset source-of-truth
- `items/0233-phaser-reboot-foundation-design.md`: 기존 Stage 1/2/3 보류와 리부트 설계 고정
- `docs/phaser/VERTICAL_SLICE_SPEC.md`: 보류된 historical Stage 1/2/3 spec. 새 구현 기준으로 사용하지 않는다.
- `items/0229-phaser-care-stage-foundation.md`: 보류. 새 `garden board foundation` issue로 재작성 전 구현하지 않는다.
- `items/0230-phaser-garden-view-mode.md`: 보류. overview mode는 새 topology 이후 재작성한다.
- `items/0231-phaser-carry-claim-reward-fx.md`: 보류. carry/reward FX는 actor task/path spec 이후 재작성한다.

## Boundary Rules

- 기존 React app code는 `apps/legacy-react-playable/` reference baseline이다.
- Phaser WorkUnit은 `apps/seed-garden-phaser/` 안에서 시작한다.
- Browser Use evidence는 신규 Phaser 작업부터 `reports/phaser/` 또는 `reports/visual/phaser-*`로 남긴다.
- 기존 P0/P0.5 문서는 참고 자료일 뿐이며, 이 디렉터리에서 명시적으로 가져온 기준만 active spec이다.
- 배경 asset에는 밭, 작업대, 주문상자, storage, research desk 같은 gameplay object를 baked-in 하지 않는다. 이들은 runtime entity여야 한다.
