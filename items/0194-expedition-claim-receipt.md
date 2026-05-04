# WorkUnit — 원정 보상 수령 모멘트에 ExpeditionClaimReceipt 셀러브레이션 카드 추가

## GitHub authority

- GitHub issue: #382 https://github.com/bborok1234/strange-seed-shop/issues/382
- Branch: `codex/0194-expedition-claim-receipt`
- Status: plan-first

## 문제 / 배경

`claimExpedition`(src/App.tsx:1822)은 보상 수령 시 leaves/materials를 더하고 `triggerRewardPulse()`만 호출한다. 실제 보상 내용(원정 이름, 받은 잎/재료 수, lunar seed 해금)은 화면에 별도 receipt로 surfaced되지 않아, 플레이어가 `원정 보상 받기` 버튼을 누른 직후 "내가 뭘 받았지?"를 알 수 없다.

비교: `claimProductionLeaves`는 `ProductionClaimReceipt`(App.tsx:67) — leaves/orderTitle/orderProgress/orderRequired를 담아 1.7s setTimeout으로 보여준 뒤 사라진다. 같은 패턴이 expedition return moment에는 빠져 있다.

## 목표

원정 보상 수령 시 `ExpeditionClaimReceipt` 셀러브레이션 카드를 노출해 플레이어가 받은 보상의 가치를 즉시 인지하도록 한다 — NORTH_STAR.md `game_feel` rubric 직결 (탭/수확/납품 순간에 즉시 시각/수치 feedback).

## Plan

1. `ExpeditionClaimReceipt` interface 추가 (id, expeditionTitle, leaves, materials, unlockedSeedName?).
2. `useState<ExpeditionClaimReceipt | null>` + 다른 commit 함수의 setProductionClaimReceipt(null) 옆에 setExpeditionClaimReceipt(null) 추가하여 mutually exclusive 표시.
3. `claimExpedition`에서 expedition 정의를 읽어 보상 합계 + lunar seed 해금명 capture, commit 이후 `setExpeditionClaimReceipt({...})` + 5_000ms setTimeout으로 자동 dismiss.
4. expedition tab 카드에서 `!save.activeExpedition && expeditionClaimReceipt`일 때 receipt JSX 렌더 — leaves chip + materials chip + unlockedSeedName chip(있을 때).
5. styles.css에 `.expedition-claim-receipt` keyframe + chip 스타일.
6. `npm run build` 통과.

## 수용 기준

- [ ] `원정 보상 받기` 클릭 직후 5초간 receipt 카드 표시.
- [ ] receipt에 expedition title, leaves(+N), materials(+N) 표시.
- [ ] research expedition 처음 완료 시 lunar seed 해금명 chip 표시.
- [ ] 5초 후 자동 dismiss.
- [ ] 다른 receipt 발화 시 expedition receipt도 cleared (mutually exclusive).

## 검증 명령

- `npm run build`
- mirror gates: `check:ops-live`, `check:dashboard`, `check:control-room`, `check:closed-workunit-mirrors`, `check:github-metadata`

## 리스크

- mobile 393px overflow 가능성 — 다른 receipt 패턴 따라 css max-width 안전 확인.
- React state 큐잉 — commit 외부에서 expedition 정의 미리 lookup해 closure 의존성 회피.

## Game Studio route

- visible gameplay (expedition tab return moment) — Browser Use iab attempt 후 Playwright regression 가능 시 추가, 안 되면 blocker 기록.

## Subagent/Team Routing

- 기본 solo execution.
