# #302 두 번째 주문 보상이 연구 노트 unlock payoff로 이어지게 만든다

## 상태

- 상태: verification-ready
- GitHub issue: #302 `두 번째 주문 보상이 연구 노트 unlock payoff로 이어지게 만든다`
- Branch: `codex/0302-research-unlock-note-payoff`
- Studio Harness v3 route: GitHub-authoritative WorkUnit intake. `$seed-ops` 사용 안 함.
- Campaign source of truth: `P0.5 Idle Core + Creative Rescue`
- Game Studio route: `game-studio:game-studio` → `game-studio:game-ui-frontend` + `game-studio:game-playtest`
- Optional route if asset lane expands: `game-studio:sprite-pipeline`

## Plan

1. ✅ 현재 second order delivery, research unlock, first research purchase flow, playfield/order copy를 매핑한다.
2. ✅ second order delivery 직후 research note receipt/playfield order state/research CTA glow를 설계한다.
3. ✅ 모바일 393px visual regression에 두 번째 주문 납품 후 research unlock, overflow/bottom-tab invariant, screenshot을 추가한다.
4. ✅ Browser Use iab 우선 QA를 현재 세션에서 다시 시도하고, blocker면 `reports/visual/browser-use-blocker-0302-20260503.md`와 Playwright screenshot fallback을 남긴다.
5. ✅ `docs/ROADMAP.md`, `docs/DASHBOARD.md`, `docs/OPERATOR_CONTROL_ROOM.md`, closed WorkUnit mirror, PR/issue body-file evidence를 갱신한다.

## 수용 기준

- [x] 두 번째 주문 납품 직후 research note/unlock payoff가 action surface 또는 playfield에서 보인다.
- [x] 연구 CTA가 다음 actionable verb로 명확하게 이어진다.
- [x] 모바일 393px에서 body scroll, panel overflow, bottom-tab overlap 회귀가 없다.
- [x] Browser Use `iab` current-session evidence 또는 current-session blocker + Playwright fallback screenshot을 남긴다.
- [x] `npm run check:visual`과 `npm run check:ci`가 통과한다.

## 검증 명령

- `npm run build`
- `npx playwright test --config playwright.config.ts --grep "연구 unlock"`
- `npm run check:visual`
- `npm run check:ci`

## 리스크

- 새 graphics asset 없이 기존 UI/FX를 research note payoff로 연결하는 범위라, 시각 payoff가 너무 약하면 asset lane이 필요할 수 있다.
- 새 accepted game graphics가 필요해지면 gpt-image-2 또는 Codex native image generation provenance가 필요하고, SVG/vector/code-native graphics는 금지다.
- research receipt가 action surface를 키우면 393px overflow/bottom-tab overlap 회귀가 날 수 있다.
- Browser Use iab backend는 #300에서도 discovery 실패했다. 이번 issue에서도 현재 세션 기준으로 다시 시도해야 한다.

## Reference teardown

- Cell to Singularity: 새 node/system unlock이 연구/진화 트리의 다음 목표로 즉시 보인다.
- Egg, Inc.: contract/research 전환은 보상 수령 후 다음 growth system으로 연결된다.
- Idle Miner Tycoon: milestone completion 이후 manager/research류 unlock이 별도 payoff와 다음 CTA로 남는다.

## Creative brief

- Player value: “두 번째 납품으로 연구 노트가 열렸고, 다음 생명체 단서가 가까워졌다”를 즉시 이해한다.
- Art direction: 기존 order/research UI 톤을 유지한다. 1차 범위는 existing UI/FX surface를 research note payoff로 연결한다.
- Motion tone: 짧은 note-unlock pop, research CTA glow, reduced-motion safety.

## Game Studio Department Signoff

- 기획팀: player verb는 `연구 준비 잎 묶음 납품하기`; core loop role은 반복 주문 → 연구 unlock → 장기 메타.
- 리서치팀: 경쟁작 production gap은 system unlock payoff/next CTA 부재.
- 아트팀: 기본은 existing accepted UI/FX surface + research note receipt. 새 asset이 필요하면 gpt-image-2/Codex native provenance와 manifest binding을 요구한다.
- 개발팀: `src/App.tsx`, `src/styles.css`, visual regression test를 작은 tranche로 수정한다.
- 검수팀: Browser Use iab 우선; blocker 시 current-session blocker와 Playwright screenshot fallback. 393px overflow/bottom-tab invariant 필수.
- 마케팅팀: mock-only devlog angle은 “납품하면 연구 노트가 열린다”이다. 실채널 action 없음.
- 고객지원팀: 첫 5분 혼란 risk는 “연구가 왜 열렸는지/무엇을 해야 하는지 모름”; FAQ note는 두 번째 주문이 연구를 여는 설명.

## Strategic Jump Check

생산 수령과 생산 속도 강화가 연결된 뒤, 다음 큰 감정 보상은 “연구가 열렸다”이다. 이 순간이 카드 상태 변화로만 보이면 장기 메타가 약하고, research note/단서 payoff가 있으면 production loop가 수집/원정으로 확장되는 이유가 생긴다.

## Subagent/Team Routing

- 사용하지 않음: 초기 scope가 order delivery → research unlock UI/test에 강하게 결합되어 단일 agent가 안전하다.
- 새 asset lane이 필요해지면 Codex native subagent/skill로 분리하고 runtime implementation과 write scope를 나눈다.

## QA/playtest evidence

- Browser Use blocker: `reports/visual/browser-use-blocker-0302-20260503.md`
- Playwright screenshot: `reports/visual/issue-302-research-unlock-note-payoff-393.png`
- Focused regression: `npx playwright test --config playwright.config.ts --grep "연구 unlock"` → 1 passed
- Full visual regression: `npm run check:visual` → 55 passed
- Full CI: `npm run check:ci` → pass
