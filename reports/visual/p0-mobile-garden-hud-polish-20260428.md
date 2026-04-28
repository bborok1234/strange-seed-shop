# P0 Mobile Garden HUD Polish Evidence — 2026-04-28

Issue: #97

## 문제

#95에서 모바일 tab screen architecture는 고정했지만, 정원 기본 화면에는 아직 개발적 라벨(`MOBILE GARDEN HUD`), 잘리는 힌트 문구, 과한 보조 설명이 남아 모바일 게임 첫 화면의 몰입을 낮췄다.

## 변경

- 상단 eyebrow를 개발적 라벨에서 세계관 라벨 `햇살 온실 정원`으로 변경했다.
- 모바일 정원 action card에서 보조 힌트/중복 설명을 줄이고, card 자체가 내부 스크롤 없이 하단 nav 위에 완전히 들어오게 했다.
- Playwright 모바일 정원 테스트에 개발 라벨 미노출, action card 내부 scrollHeight/clientHeight 검증을 추가했다.

## Evidence

- Mobile 393: `reports/visual/p0-mobile-garden-hud-polish-mobile-20260428.png`
- Mobile 360: `reports/visual/p0-mobile-garden-hud-polish-mobile-360-20260428.png`
- Desktop: `reports/visual/p0-mobile-garden-hud-polish-desktop-20260428.png`
- Command: `npm run check:visual`
- Result: 8 passed

## Remaining visual risk

- Phaser playfield 자체의 plot art direction과 harvest interaction polish는 아직 다음 P0 loop로 남아 있다.
- 탭별 카드 UI skinning은 #97 이후에도 별도 small win으로 계속 개선해야 한다.
