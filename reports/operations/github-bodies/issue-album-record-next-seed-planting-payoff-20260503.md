## GitHub authority

- Issue: #316 https://github.com/bborok1234/strange-seed-shop/issues/316
- Branch: `codex/0316-album-record-next-seed-planting-payoff`
- Plan artifact: `items/0160-album-record-next-seed-planting-payoff.md`

## 문제 / 배경

#314가 새 단서 기록 card의 다음 씨앗 목표 CTA를 seeds tab target row 강조로 연결했지만, 그 row에서 실제 구매/심기까지 누른 뒤 정원 playfield가 “새 기록 이후 후속 재배가 시작됐다”는 payoff를 충분히 보여주는지는 아직 약하다. 도감 기록 저장 이후 다음 seed row를 보는 것에서 멈추지 않고, 다음 재배 상태가 정원 장면으로 이어져야 한다.

## 목표

`새 기록 다음 목표` target row에서 구매/심기한 직후 정원 playfield와 다음 행동 패널이 `새 기록 후속 재배` 상태, 다음 생명체/씨앗 이름, 성장 시작 affordance를 보여주게 만든다.

## Small win

새 단서 기록을 저장한 직후 다음 씨앗을 사서 심으면 “방금 기록 다음 아이를 키우기 시작했다”가 정원 첫 화면에서 바로 보인다.

## Campaign source of truth

- P0.5 Idle Core + Creative Rescue
- Follows #314: 도감 새 기록 다음 씨앗 목표 CTA → seeds target row 구매/심기 준비

## Game Studio Department Signoff

- 기획팀: player verb는 `새 기록 다음 씨앗 심기`; progression role은 도감 기억 저장 → 다음 씨앗 구매/심기 → 정원 재성장 시작이다.
- 리서치팀: collection idle games는 새 발견 뒤 다음 target을 심으면 playfield가 후속 성장 상태로 즉시 전환된다. 씨앗 row 강조에서 끝나는 대안은 reject한다.
- 아트팀: 신규 accepted manifest asset 없이 existing seed/plot visuals + DOM/CSS/playfield state highlight/reward motion으로 제한한다.
- 개발팀: `src/App.tsx`, `src/styles.css`, `src/game/GardenScene.ts` 또는 view model binding, `tests/visual/p0-mobile-game-shell.spec.ts` 중심의 좁은 tranche.
- 검수팀: Browser Use iab current-session 우선, blocker 시 `reports/visual/`에 새 blocker와 393px Playwright screenshot/layout invariant 남김.
- 마케팅팀: mock-only promise. 외부 채널/실결제 없음.
- 고객지원팀: “도감에서 다음 씨앗을 심었는데 어디서 자라나요?”를 정원 playfield state로 줄인다.

## Subagent/Team Routing

- 단일 React/Phaser view-state/CSS/visual regression tranche라 Codex native subagents/team mode는 기본 미사용.
- 독립 분리 기준: GardenScene binding이 예상보다 크면 Phaser/runtime worker, Browser Use 복구가 필요하면 QA/verifier subtask, 새 FX asset이 필요하면 asset pipeline subtask로 분리.

## 플레이어 가치 또는 운영사 가치

- 사용자: 새 기록 저장 이후 다음 씨앗 구매/심기가 정원 성장 상태로 닫혀 “하나만 더 키우기”가 자연스러워진다.
- 운영자: queue-empty를 종료로 취급하지 않고, player verb + progression role + screen moment + playfield state/reward motion + playtest evidence가 있는 GitHub-authoritative WorkUnit으로 production vertical slice를 이어간다.

## 수용 기준

- [x] `새 기록 다음 목표` target row에서 구매 후 심기를 누르면 정원 탭으로 이동하거나 정원 상태가 명확히 열리고, 후속 재배 상태가 보인다.
- [x] 정원 playfield/다음 행동 패널이 `새 기록 후속 재배` 또는 동등한 copy, 다음 씨앗/생명체 이름, 성장 시작 행동을 보여준다.
- [x] 신규 accepted manifest asset 없이 existing visuals + DOM/CSS/playfield state/reward motion으로 구현하고 runtime image generation/API를 호출하지 않는다.
- [x] 393px 모바일에서 playfield/action surface/bottom tab이 겹치지 않고 overflow를 만들지 않는다.
- [x] Browser Use iab current-session 시도 evidence 또는 blocker, focused Playwright screenshot, `npm run check:visual`, `npm run check:ci`가 남는다.

## Visual evidence 계획

- Browser Use iab target: 연구 단서 수확 → 도감 기록 CTA → 새 기록 다음 씨앗 목표 CTA → seeds target row 구매/심기 → 정원 재성장 state.
- Fallback screenshot: `reports/visual/issue-316-album-record-next-seed-planting-payoff-393.png`.
- Layout invariant: playfield/action surface vs `.bottom-tabs`, no body scroll, no masked overflow.

## Playable mode 영향

- Local dev: `npm run dev -- --host 127.0.0.1 --port 3000`
- Stable main playable mirror는 `npm run play:main` + port 5174 계약 유지.

## 안전 범위

- runtime image generation/API 호출 없음.
- 신규 accepted manifest asset 없음. existing visuals, DOM/CSS/playfield state, reward motion만 허용.
- real payment, customer data, external production deployment 없음.

## 검증 명령

- `npm run build`
- focused Playwright: 새 기록 다음 씨앗 심기/정원 재성장 payoff
- `npm run check:visual`
- `npm run check:ci`
- `npm run update:dashboard`
- `npm run operator:control-room -- --output docs/OPERATOR_CONTROL_ROOM.md`
- `npm run check:dashboard`
- `npm run check:control-room`
- `npm run check:ops-live`
- `npm run check:github-metadata`
- `npm run check:seed-ops-queue`
- `npm run check:closed-workunit-mirrors`


## 구현 / 검증 evidence

- 구현: `src/App.tsx`, `src/styles.css`, `tests/visual/p0-mobile-game-shell.spec.ts`
- Browser Use blocker: `reports/visual/browser-use-blocker-0316-20260503.md`
- Screenshot: `reports/visual/issue-316-album-record-next-seed-planting-payoff-393.png`
- Focused: `npx playwright test --config playwright.config.ts --grep "새 기록 다음 씨앗 심기|후속 재배|정원 재성장"` — 2 passed
- Full visual: `npm run check:visual` — 61 passed
- Full CI: `npm run check:ci` — pass
