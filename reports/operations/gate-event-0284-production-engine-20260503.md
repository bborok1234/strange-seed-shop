# GateEvent — #284 production engine layout ready

- WorkUnit: #284 `정원 첫 화면을 생산 엔진 중심으로 재배치해 수확·납품을 한 장면에 묶는다`
- Branch: `codex/0284-first-screen-production-engine-layout`
- Gate: local verification → PR publication
- Source of truth: GitHub issue/PR/GateEvent. local docs/reports are evidence mirrors only.

## Evidence

- Plan artifact: `items/0144-first-screen-production-engine-layout.md`
- Issue body file: `reports/operations/issue-284-body-20260503.md`
- PR body file: `reports/operations/pr-284-body-20260503.md`
- Browser Use blocker: `reports/visual/browser-use-blocker-0284-20260503.md`
- Playtest report: `reports/visual/0284-first-screen-production-engine-playtest-20260503.md`
- Screenshot: `reports/visual/first-screen-production-engine-one-scene-20260503.png`

## Checks

- `npm run check:visual -- --grep "생산 엔진|한 장면|production engine"` → 1 passed
- `npm run check:visual -- --grep "creature stage|기억 도장|생산 엔진|달빛 보호 주문 완료"` → 4 passed
- `npm run check:visual` → 54 passed
- `npm run check:ci` → passed
- `git diff --check` → passed

## Acceptance state

- 393×852 first garden screen shows resident stage + playfield production tray + lunar order crate/progress as one production scene.
- `돌보기`, `생산 잎 수령`, `달빛 보호 주문 납품` stay above bottom tabs.
- action surface has no body scroll / visible child overflow regression.
- order crate/progress is before worker/roster body.
- no new accepted manifest asset and no runtime image generation.

## Next state

Publish issue/PR evidence, watch GitHub checks, merge when green, then observe main CI only. Do not create post-merge closeout backfill.
