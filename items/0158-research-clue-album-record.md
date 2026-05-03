# WorkUnit #312 — 연구 단서 발견 후 도감에 새 기록 저장 payoff를 보이게 만든다

- GitHub issue: #312 https://github.com/bborok1234/strange-seed-shop/issues/312
- Campaign source of truth: P0.5 Idle Core + Creative Rescue
- Status: planned
- Branch: `codex/0312-research-clue-album-record`
- Created: 2026-05-03

## Plan

1. #310 연구 단서 수확 reveal 이후 `도감에 기록하기` CTA가 닫힌 뒤 album/action surface/next creature card가 어떻게 보이는지 매핑한다.
2. 방금 발견한 연구 단서 생명체를 `새 단서 기록`/`도감 기록 저장` 상태로 남기는 DOM/CSS album highlight와 HUD affordance를 추가한다.
3. 다음 수집 목표 전환을 도감 또는 action surface에서 한 화면에 설명하되 신규 accepted manifest asset/runtime image generation은 쓰지 않는다.
4. Browser Use iab를 현재 세션에서 먼저 시도하고, 실패 시 #312 전용 blocker를 `reports/visual/`에 남긴다.
5. 393px 모바일 focused Playwright screenshot과 layout invariant를 추가한 뒤 `check:visual`, `check:ci`, 운영 mirror checks를 통과시킨다.

## 수용 기준

- [ ] 연구 단서 발견 reveal의 `도감에 기록하기` 이후 방금 발견한 생명체의 `새 단서 기록`/`도감 기록 저장` 상태가 보인다.
- [ ] 도감 탭 또는 action surface가 다음 수집 목표 전환을 한 화면에서 설명한다.
- [ ] 신규 accepted manifest asset 없이 DOM/CSS album highlight/HUD affordance로 구현하고 runtime image generation/API를 호출하지 않는다.
- [ ] 393px 모바일에서 album/action surface/next creature card가 bottom tab과 겹치지 않고 overflow를 만들지 않는다.
- [ ] Browser Use iab current-session 시도 evidence 또는 blocker, focused Playwright screenshot, `npm run check:visual`, `npm run check:ci`가 남는다.

## 검증 명령

- `npm run build`
- `npx playwright test --config playwright.config.ts --grep "연구 단서 도감|새 단서 기록"`
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

- reveal overlay 종료 후 state가 너무 오래 남으면 일반 도감/수확 루프를 방해할 수 있다.
- 도감 탭은 이미 밀도가 높아 393px에서 album highlight가 bottom tab과 겹칠 수 있다.
- Browser Use iab backend는 이번 세션에서 반복 실패했다. 그래도 #312에서 새로 시도하고 blocker/evidence를 남긴다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist: `game-studio:game-ui-frontend` + `game-studio:game-playtest`
- Sprite/asset route: 신규 accepted manifest asset 없음. DOM/CSS album highlight, HUD affordance, reward motion으로 제한한다. 새 sprite/FX가 필요하면 별도 asset provenance WorkUnit으로 분리한다.

## Studio Campaign Gate

- Player verb: `도감에 연구 단서 기록하기`
- Production/progression role: 생명체 발견 → 도감 기억 저장 → 다음 씨앗 목표 전환
- Screen moment: #310 reveal CTA `도감에 기록하기`를 누른 직후 도감/정원 화면
- Concrete visual/game-feel payoff: `새 단서 기록` album highlight, `도감 기록 저장` HUD affordance, next goal transition
- Competition production gap: Cell to Singularity는 unlock 이후 node가 tree에 남고 다음 branch가 보인다. 현재는 발견 overlay만 닫히면 저장 감정이 약해질 위험이 있다.
- Playtest evidence: Browser Use iab 우선, blocker 시 Playwright screenshot + layout invariant.

## Game Studio Department Signoff

- 기획팀: 발견 payoff를 도감 저장과 다음 목표 전환으로 닫아야 한다.
- 리서치팀: 경쟁작은 unlock 결과를 collection/tree에 남긴다. overlay만 닫는 대안은 reject한다.
- 아트팀: 신규 manifest asset 없이 existing creature image와 DOM/CSS highlight로 제한한다.
- 개발팀: `src/App.tsx`, `src/styles.css`, `tests/visual/p0-mobile-game-shell.spec.ts` 중심의 좁은 tranche.
- 검수팀: Browser Use iab current-session 시도, 393px screenshot, overflow/bottom-tab invariant 필수.
- 마케팅팀: mock-only promise. 외부 채널/실결제 없음.
- 고객지원팀: “발견했는데 도감에 기록됐는지 모르겠다”를 새 기록 highlight로 줄인다.

## Reference teardown / rejected alternative

- Reference: Cell to Singularity는 unlock node가 tree에 남아 다음 branch 선택을 돕는다.
- Reference: collection idle games는 새 발견 후 도감/앨범 slot이 반짝이며 수집 완료를 확인시킨다.
- Rejected: reveal overlay만 유지 — 저장/기록 감정과 다음 목표 전환이 약하다.
- Rejected: 신규 album asset 즉시 생성 — gameplay payoff 검증을 먼저 끝낸 뒤 별도 provenance gate로 분리한다.

## Subagent/Team Routing

- 현재는 단일 React/CSS/visual regression tranche이므로 Codex native subagents/team mode는 사용하지 않는다.
- 필요 시 분리 기준: asset generation이 필요해지면 asset pipeline subtask, Browser Use 복구가 필요하면 QA/verifier subtask로 분리한다.
