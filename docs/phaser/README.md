# Phaser Active Lane

이 디렉터리는 신규 Phaser-first 정원의 active source-of-truth다. 기존 React playable을 계속 고치는 문서가 아니다.

## Code

- `apps/seed-garden-phaser/`: 신규 Phaser app
- `npm run dev:phaser`: Phaser app 개발 서버
- `npm run build:phaser`: Phaser app build
- `npm run check:phaser`: Phaser app verification

## Active Specs

- `docs/phaser/VERTICAL_SLICE_SPEC.md`: Stage 1/2/3 vertical slice spec
- `items/0229-phaser-care-stage-foundation.md`: Stage 1 낮은 관리 카메라와 actor care loop
- `items/0230-phaser-garden-view-mode.md`: Stage 2 감상 모드
- `items/0231-phaser-carry-claim-reward-fx.md`: Stage 3 carry/claim/reward FX

## Boundary Rules

- 기존 React app code는 `apps/legacy-react-playable/` reference baseline이다.
- Phaser WorkUnit은 `apps/seed-garden-phaser/` 안에서 시작한다.
- Browser Use evidence는 신규 Phaser 작업부터 `reports/phaser/` 또는 `reports/visual/phaser-*`로 남긴다.
- 기존 P0/P0.5 문서는 참고 자료일 뿐이며, 이 디렉터리에서 명시적으로 가져온 기준만 active spec이다.
