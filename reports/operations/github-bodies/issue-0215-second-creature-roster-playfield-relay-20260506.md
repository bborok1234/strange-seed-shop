## 요약

두 번째 생명체 발견 이후 생산 roster가 텍스트 chip에만 머무르지 않도록, `방패새싹 모모`를 playfield support actor로 합류시키는 WorkUnit입니다.

GitHub issue: #411 — https://github.com/bborok1234/strange-seed-shop/issues/411

## Small win

`qaResearchExpeditionReady=1` 정원에서 포리 옆에 모모가 보조 동료로 등장하고, 작은 relay motion으로 생산 team payoff를 보여줍니다.

## 사용자/운영자 가치

사용자가 지적한 “캐릭터가 도감에만 존재한다”는 문제를 줄입니다. 수집한 생명체가 정원 playfield의 생산 장면에 합류하면, 도감 발견이 생산 team 확장으로 이어지는 이유가 첫눈에 보입니다.

## Before / After 또는 Visual evidence

- Before Browser Use `iab`: `reports/visual/issue-0215-second-creature-roster-before-browseruse-20260506.png`
- After Browser Use `iab`: `reports/visual/issue-0215-second-creature-roster-after-browseruse-20260506.png`
- Visual report: `reports/visual/issue-0215-second-creature-roster-playfield-relay-20260506.md`

## Playable mode

- URL: `http://127.0.0.1:4173/?qaResearchExpeditionReady=1`

## 작업 checklist

- [x] WorkUnit plan artifact 작성: `items/0215-second-creature-roster-playfield-relay.md`
- [x] Game Studio route 기록
- [x] GitHub issue #411 생성
- [x] playfield view model에 support worker metadata 추가
- [x] `GardenPlayfieldHost`에서 support actor 렌더링
- [x] CSS relay motion/reduced-motion fallback 추가
- [x] focused mobile regression 보강
- [x] Browser Use before/after evidence 저장

## 검증

- Browser Use after: `supportCount=1`, `supportAsset=creature_herb_common_002`.
- `npx playwright test tests/visual/p0-mobile-game-shell.spec.ts --grep "모바일 생산 roster" --config playwright.config.ts`: 1 passed.
- `npm run check:art-share`: 24 passed.
- `npm run build`: passed.

## 안전 범위

신규 image generation, runtime image generation, save migration, payment, external deployment는 하지 않습니다. 기존 accepted raster creature asset을 runtime binding합니다.

## 남은 위험

진짜 frame-by-frame sprite strip은 다음 별도 WorkUnit 후보로 남습니다. 이번 slice는 accepted raster + scene behavior/motion payoff입니다.
