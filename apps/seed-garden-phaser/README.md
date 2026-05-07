# Seed Garden Phaser

이 앱은 신규 Phaser-first 정원 vertical slice의 active runtime lane이다. 기존 React playable을 더 고치는 곳이 아니라, `GAME_BIBLE`의 v1 launch slice를 실제 game board runtime으로 옮기는 app boundary다.

## 현재 범위

- #436: app boundary와 빌드 가능한 scaffold만 제공
- #433 / 0235: garden board topology foundation. 최소 3개 build slot, runtime plot/facility entity, starter seed planting/care/harvest, first actor task proof
- #434: 감상 모드와 HUD 접기. #433 foundation 이후 진행
- #432: carry, claim, reward FX. #433 foundation과 asset/FX bundle 이후 진행

## 실행

```bash
npm run dev:phaser
npm run build:phaser
npm run check:phaser
```

## Source Of Truth

- `docs/GAME_BIBLE.md`
- `docs/GAME_PRODUCTION_SPEC.md`
- `docs/phaser/README.md`
- `docs/phaser/REBOOT_FOUNDATION_SPEC.md`
- `items/0235-garden-board-topology-scaffold.md`
