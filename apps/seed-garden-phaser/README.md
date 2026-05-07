# Seed Garden Phaser

이 앱은 신규 Phaser-first 정원 vertical slice의 active runtime lane이다. 기존 React playable을 더 고치는 곳이 아니라, #433부터 낮은 관리 카메라, actor care loop, 감상 모드, carry/reward FX를 구현할 신규 게임 app boundary다.

## 현재 범위

- #436: app boundary와 빌드 가능한 scaffold만 제공
- #433: 낮은 관리 카메라, 밭 2개, 작업대, 포리/모모 care actor, crop state 3단계 구현
- #434: 감상 모드와 HUD 접기
- #432: carry, claim, reward FX

## 실행

```bash
npm run dev:phaser
npm run build:phaser
npm run check:phaser
```

## Source Of Truth

- `docs/phaser/README.md`
- `docs/phaser/VERTICAL_SLICE_SPEC.md`
- `items/0229-phaser-care-stage-foundation.md`
