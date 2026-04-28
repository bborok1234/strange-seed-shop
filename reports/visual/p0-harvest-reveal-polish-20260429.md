# P0 Harvest Reveal Polish Evidence

Issue: #103
Item: `items/0062-harvest-reveal-polish.md`
Branch: `p0-harvest-reveal-polish-103`
Date: 2026-04-29

## Plan-first evidence

Plan artifact: `items/0062-harvest-reveal-polish.md`

## Small win

첫 생명체 reveal이 일반 모달이 아니라 도감 첫 발견/수집 보상 화면처럼 읽히도록 portrait frame, sparkle, trait chip, 다음 발견 예고, CTA layout을 개선했다.

## 변경 요약

- `도감 첫 발견` kicker와 `새 생명체가 찾아왔어요` 보상 문구를 추가했다.
- 생명체 이미지를 `harvest-portrait-frame` 안에 넣고 glow/ring/drop-shadow로 focal point를 키웠다.
- role/rarity/family trait chip을 추가해 수집 카드처럼 읽히게 했다.
- CTA를 `reveal-cta`로 고정하고 393/360 viewport bounds를 Playwright에서 검증한다.

## Evidence screenshots

- Mobile 393 reveal: `reports/visual/p0-harvest-reveal-polish-mobile-393-20260429.png`
- Mobile 360 reveal: `reports/visual/p0-harvest-reveal-polish-mobile-360-20260429.png`

## Verification

- `npm run check:visual` — 10 passed.

## Remaining visual risk

- 보상감은 개선됐지만, 더 강한 뽑기/수집 연출을 위해서는 별도 FX sprite/soundless motion pass가 필요하다.
- 실제 물리 기기 safe-area는 아직 Playwright viewport로만 대체 검증했다.
