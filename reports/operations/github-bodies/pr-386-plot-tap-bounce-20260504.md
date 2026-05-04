## 요약

#386은 Garden playfield의 plot tap에 plot container scale-pulse micro-animation을 추가합니다. growing/ready plot pointerdown 시 group이 1.04로 yoyo scale tween (160ms, Sine.easeOut)하여 player tap이 plot에 직접 닿았다는 햅틱적 인상을 강화합니다.

## Small win

기존 FX(sparkles + 떠오르는 텍스트)는 plot 위에 떠 있었지만, plot sprite 자체는 정적이었다. 이제 plot 본체가 짧게 호흡하듯 반응한다. idle/tycoon production game 스타일의 tappable feedback이 갖춰진다.

## Before / After

- Before: tap → FX overlay만 발화. plot 본체 정적.
- After: tap → plot group scale 1.04 yoyo (160ms) + 기존 FX. empty/locked plot에는 motion 없음.

## 변경

- `GardenScene.drawPlot` hitZone pointerdown handler: plot.state === "growing" | "ready" + `group.active` 가드 후 tween 발화.

## 검증

- [x] `npm run build`
- [x] mirror gates 통과
- [x] Browser Use iab attempt or blocker

## 안전 범위

- 신규 manifest asset 없음.
- save 호환: 변경 없음 (Phaser scene-only motion).
- group destroy 안전: `group.active` 가드로 destroyed target 회피, Phaser tween도 자동 정리.

## 연결된 issue

Closes #386
