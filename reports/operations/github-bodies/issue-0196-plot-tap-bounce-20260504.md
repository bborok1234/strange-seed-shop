## 문제

Garden playfield에서 player가 growing/ready plot을 tap하면 FX(sparkles + 떠오르는 텍스트)는 plot 위에 보이지만, plot sprite 자체는 정적으로 머문다. tap이 plot에 "닿았다"는 직접적 시각 feedback이 부족하다.

## 비교

idle/tycoon production game(Egg Inc, Cell to Singularity 등)에서는 player tap 시 tappable 자체가 살짝 scale-pulse하는 micro-animation으로 "내가 이걸 만졌다"는 햅틱적 인상을 준다. 본 게임 plot은 그 layer가 빠져 있다.

## 목표

growing 또는 ready plot의 hitZone pointerdown 시 plot group container를 짧게 yoyo scale-pulse:

- 1.04→1.0, 약 160ms duration, ease "Sine.easeOut"
- empty/locked plot에는 적용하지 않음 (의미 없는 motion 회피)
- 기존 FX(playTapPulse, playHarvestBurst)와 함께 동작

## 수용 기준

- [ ] growing plot tap 시 plot sprite scale-pulse 발생.
- [ ] ready plot tap(harvest) 시 plot sprite scale-pulse 발생.
- [ ] empty plot tap에는 scale-pulse 없음.
- [ ] 기존 FX/floating text와 충돌 없음.

## 게임 북극성 정렬

`game_feel` rubric: 탭 순간에 즉시 시각 feedback. plot sprite 자체가 반응함으로써 "내 탭이 이 plot에 닿았다"는 햅틱적 인상이 강화된다.
