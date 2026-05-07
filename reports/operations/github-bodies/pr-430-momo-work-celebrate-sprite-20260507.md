## 요약

방패새싹 모모를 정원 playfield의 독립 support worker actor로 올렸다. gpt-image-2로 모모 work/celebrate sprite strip 2종을 생성하고, manifest animation binding과 runtime support worker animation 계약, Browser Use `iab` evidence까지 연결했다.

## Small win

두 번째 생명체가 도감/roster 카드에만 머무르지 않고 정원 장면에서 실제로 일하고, `qaMomoCelebrate=1`에서 생산 수령 반응 frame으로 보인다.

## 사용자/운영자 가치

사용자가 반복해서 지적한 “캐릭터를 만들었는데 정원에서 움직이지 않는다” 문제를 asset과 runtime 양쪽에서 닫았다. Studio 팀 간 proposal/critique도 산출물로 남겨, safe 작은 변경으로 축소되는지 Senior Critic이 검증하도록 했다.

## Before / After 또는 Visual evidence

- Before/current: `reports/deliberation/momo-work-celebrate-sprite/browser-use-current-garden-20260507.png`
- After work: `reports/visual/issue-0228-momo-work-celebrate-sprite/browser-use-after-momo-work-loaded-20260507.png`
- After celebrate: `reports/visual/issue-0228-momo-work-celebrate-sprite/browser-use-after-momo-celebrate-loaded-20260507.png`
- Findings: `reports/visual/issue-0228-momo-work-celebrate-sprite/browser-use-findings-20260507.md`

## Playable mode

- `http://127.0.0.1:4173/?qaResearchExpeditionReady=1`
- Celebrate QA: `http://127.0.0.1:4173/?qaResearchExpeditionReady=1&qaMomoCelebrate=1`

## Game Studio route

- `game-studio:game-studio`
- `game-studio:sprite-pipeline`
- `game-studio:game-ui-frontend`
- `game-studio:game-playtest`

## 작업 checklist

- [x] Studio deliberation proposal/critique/spec/user-review/retrospective 생성
- [x] gpt-image-2 모모 work/celebrate strip 생성
- [x] alpha-cut + strict 576x96 strip normalization
- [x] manifest/provenance/status 등록
- [x] support worker animation runtime binding
- [x] Browser Use `iab` work/celebrate screenshot
- [x] focused mobile/desktop regression
- [x] `npm run check:ci`

## 검증

- `npm run check:asset-normalization` pass
- `npm run check:asset-provenance` pass
- `npm run check:asset-style` pass
- `npm run check:asset-alpha` pass
- `npm run build` pass
- `npx playwright test tests/visual/p0-mobile-game-shell.spec.ts --config playwright.config.ts -g "모바일 생산 roster는 두 번째 생명체를 정원 동료로 보여준다|모바일 모모 support actor"` pass
- `npx playwright test tests/visual/desktop-art-share.spec.ts --config playwright.config.ts -g "production actor와 support actor"` pass
- `npm run check:ci` pass

## 안전 범위

- 런타임 이미지 생성 없음
- 실결제/외부 배포/고객 데이터/파괴적 migration 없음
- save migration 없음

## 남은 위험

- 모모 actor가 오른쪽 shelf 쪽으로 분명하게 보이도록 anchor를 조정했지만, 후속 workstage composition에서는 plot/order crate와 더 자연스러운 동선으로 다듬을 여지가 있다.

## 연결된 issue

Closes #430
