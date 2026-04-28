# P0 Phaser Playfield Presentation Polish Evidence — 2026-04-28

Issue: #99

## 문제

#95/#97로 모바일 탭 구조와 정원 HUD는 안정화됐지만, Phaser playfield 내부 plot은 흐릿한 카드/반복 라벨처럼 보여 “수집형 모바일 게임의 밭”으로 읽히는 힘이 부족했다.

## 변경

- ready plot에 `drawHarvestAura`와 `수확!` 상태 강조를 추가해 현재 누를 수 있는 밭을 더 선명하게 만들었다.
- locked plot은 강한 박스/긴 텍스트 대신 희미한 index + 짧은 잠금 상태로 낮은 우선순위를 갖게 했다.
- empty plot은 `＋` cue와 `빈 자리`만 보여 씨앗을 심을 공간으로 읽히게 했다.
- plot 번호 badge, mound, progress label 대비를 조정해 모바일 393/375/360 기준에서도 상태가 읽히게 했다.

## Evidence

- Mobile 393: `reports/visual/p0-playfield-presentation-polish-mobile-393-20260428.png`
- Mobile 375: `reports/visual/p0-playfield-presentation-polish-mobile-375-20260428.png`
- Mobile 360: `reports/visual/p0-playfield-presentation-polish-mobile-360-20260428.png`
- Desktop: `reports/visual/p0-playfield-presentation-polish-desktop-20260428.png`
- Command: `npm run check:visual`
- Result: 8 passed

## Remaining visual risk

- 실제 sprite art/creature animation quality는 아직 placeholder 수준이다. 다음 loop에서는 sprite/plot scale, tap/harvest fx, first creature reveal로 이어져야 한다.
- 이번 변경은 Phaser canvas 내부 presentation이므로 Playwright는 layout/screenshot evidence를 남기고, 세부 pixel baseline은 아직 도입하지 않았다.
