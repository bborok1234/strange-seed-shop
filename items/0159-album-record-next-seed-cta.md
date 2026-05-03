# WorkUnit #314 — 도감 새 기록 다음 씨앗 목표 CTA가 구매/심기 준비로 이어지게 만든다

- GitHub issue: #314 https://github.com/bborok1234/strange-seed-shop/issues/314
- Campaign source of truth: P0.5 Idle Core + Creative Rescue
- Status: planned
- Branch: `codex/0314-album-record-next-seed-cta`
- Created: 2026-05-03

## Plan

1. #312 새 단서 기록 card의 다음 씨앗 목표 CTA가 seeds tab target row로 이동하는 현재 상태를 매핑한다.
2. CTA 경유 상태를 남겨 씨앗 탭 목표 row에 `새 기록 다음 목표`/`도감 기록 다음 씨앗` HUD affordance와 row highlight를 추가한다.
3. 다음 생명체/씨앗 이름, 구매/심기 가능 상태가 393px 한 화면에서 읽히게 하되 신규 accepted manifest asset/runtime image generation은 쓰지 않는다.
4. Browser Use iab를 현재 세션에서 먼저 시도하고, 실패 시 #314 전용 blocker를 `reports/visual/`에 남긴다.
5. focused Playwright screenshot과 layout invariant를 추가한 뒤 `check:visual`, `check:ci`, 운영 mirror checks를 통과시킨다.

## 수용 기준

- [ ] `새 단서 기록`의 다음 씨앗 목표 CTA를 누르면 씨앗 탭 target row가 `새 기록 다음 목표`/`도감 기록 다음 씨앗` 상태를 보여준다.
- [ ] target row가 다음 생명체/씨앗 이름과 구매/심기 가능성을 한 화면에서 설명한다.
- [ ] 신규 accepted manifest asset 없이 DOM/CSS row highlight/HUD affordance로 구현하고 runtime image generation/API를 호출하지 않는다.
- [ ] 393px 모바일에서 target row/action buttons가 bottom tab과 겹치지 않고 overflow를 만들지 않는다.
- [ ] Browser Use iab current-session 시도 evidence 또는 blocker, focused Playwright screenshot, `npm run check:visual`, `npm run check:ci`가 남는다.

## 검증 명령

- `npm run build`
- `npx playwright test --config playwright.config.ts --grep "새 단서 기록 다음 씨앗|도감 기록 다음 씨앗"`
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

## 리스크

- CTA 경유 상태가 seeds tab을 벗어난 뒤에도 과도하게 남으면 target row가 stale하게 보일 수 있다.
- target row는 이미 연구 단서/구매/심기 copy가 많아 393px overflow를 우선 검증해야 한다.
- Browser Use iab backend는 이번 세션에서 반복 실패했다. 그래도 #314에서 새로 시도하고 blocker/evidence를 남긴다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist: `game-studio:game-ui-frontend` + `game-studio:game-playtest`
- Sprite/asset route: 신규 accepted manifest asset 없음. DOM/CSS row highlight, HUD affordance, reward motion으로 제한한다. 새 sprite/FX가 필요하면 별도 asset provenance WorkUnit으로 분리한다.

## Studio Campaign Gate

- Player verb: `새 기록 다음 씨앗 고르기`
- Production/progression role: 도감 기억 저장 → 다음 씨앗 목표 구매/심기 준비
- Screen moment: #312 새 단서 기록 card의 다음 씨앗 목표 CTA를 누른 직후 seeds tab
- Concrete visual/game-feel payoff: `새 기록 다음 목표` row highlight, `도감 기록 다음 씨앗` HUD affordance, 구매/심기 affordance
- Competition production gap: collection idle games는 새 발견 뒤 다음 target CTA가 shop/inventory row에 연결된다. 단순 탭 이동만 하는 대안은 reject한다.
- Playtest evidence: Browser Use iab 우선, blocker 시 Playwright screenshot + layout invariant.

## Game Studio Department Signoff

- 기획팀: 도감 저장 이후 다음 수집 행동을 씨앗 구매/심기로 닫아야 한다.
- 리서치팀: 경쟁작은 collection unlock 뒤 다음 target row를 강조한다. 단순 탭 이동은 reject한다.
- 아트팀: 신규 manifest asset 없이 existing seed/creature image와 DOM/CSS highlight로 제한한다.
- 개발팀: `src/App.tsx`, `src/styles.css`, `tests/visual/p0-mobile-game-shell.spec.ts` 중심의 좁은 tranche.
- 검수팀: Browser Use iab current-session 시도, 393px screenshot, overflow/bottom-tab invariant 필수.
- 마케팅팀: mock-only promise. 외부 채널/실결제 없음.
- 고객지원팀: “다음엔 뭘 심어야 하나요?”를 target row로 줄인다.

## Reference teardown / rejected alternative

- Reference: collection idle games는 새 발견 뒤 다음 target/shop row를 시각적으로 강조한다.
- Reference: Cell to Singularity는 unlocked node 다음 branch를 바로 보여준다.
- Rejected: 씨앗 탭 이동만 유지 — 다음 행동 affordance가 약하다.
- Rejected: 신규 row asset 즉시 생성 — gameplay payoff 검증을 먼저 끝낸 뒤 별도 provenance gate로 분리한다.

## Subagent/Team Routing

- 현재는 단일 React/CSS/visual regression tranche이므로 Codex native subagents/team mode는 사용하지 않는다.
- 필요 시 분리 기준: asset generation이 필요해지면 asset pipeline subtask, Browser Use 복구가 필요하면 QA/verifier subtask로 분리한다.
