# P0 Phaser Playfield Visual Noise Cleanup Evidence — 2026-04-28

Issue: #101

## 문제

#99에서 ready/locked/empty plot 상태는 분리됐지만, 모바일 screenshot에서 locked plot의 반복 텍스트/번호/강한 선이 grid noise처럼 보였다. 플레이어는 현재 조작할 ready plot을 먼저 봐야 하고, 아직 잠긴 slot은 조용히 뒤로 물러나야 한다.

## 변경

- locked plot의 fill/stroke/mound alpha를 낮추고, 반복 번호/텍스트를 제거했다.
- lock 표시는 낮은 alpha의 작은 graphic glyph로만 남겨 상태는 알 수 있지만 시선은 빼앗지 않게 했다.
- `setWordWrapWidth`를 제거해 작은 Phaser text가 board 위에 불필요한 선/노이즈처럼 보일 가능성을 줄였다.
- ready plot의 harvest aura와 `수확!` emphasis는 유지했다.

## Evidence

- Mobile 393: `reports/visual/p0-playfield-noise-cleanup-mobile-393-20260428.png`
- Mobile 375: `reports/visual/p0-playfield-noise-cleanup-mobile-375-20260428.png`
- Mobile 360: `reports/visual/p0-playfield-noise-cleanup-mobile-360-20260428.png`
- Desktop: `reports/visual/p0-playfield-noise-cleanup-desktop-20260428.png`
- Command: `npm run check:visual`
- Result: 8 passed

## Remaining visual risk

- Ready plot 상태는 선명하지만, 실제 sprite/fx 자체의 감정 표현은 아직 약하다. 다음 loop는 tap/harvest fx와 creature reveal 감정선 polish가 필요하다.
