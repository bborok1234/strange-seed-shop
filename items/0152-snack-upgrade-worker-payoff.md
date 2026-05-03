# #300 작업 간식 강화가 포리 버프와 생산 속도 상승으로 보이게 만든다

## 상태

- 상태: verification-ready
- GitHub issue: #300 `작업 간식 강화가 포리 버프와 생산 속도 상승으로 보이게 만든다`
- Branch: `codex/0300-snack-upgrade-worker-payoff`
- Studio Harness v3 route: GitHub-authoritative WorkUnit intake. `$seed-ops` 사용 안 함.
- Campaign source of truth: `P0.5 Idle Core + Creative Rescue`
- Game Studio route: `game-studio:game-studio` → `game-studio:game-ui-frontend` + `game-studio:game-playtest`
- Optional route if asset lane expands: `game-studio:sprite-pipeline`

## Plan

1. 현재 `작업 간식 강화` purchase flow, first order reward state, production rate calculation, playfield actor copy를 매핑한다. ✅
2. first order reward 이후 upgrade click 직후 `포리 간식 충전` receipt, playfield actor buff state, rate badge pulse를 action surface와 playfield에 연결한다. ✅
3. 수령/납품/강화 sequence에서 다음 주문 progress 문맥이 깨지지 않도록 `자동 생산과 첫 주문` regression을 확장한다. ✅
4. 모바일 393px visual regression에 강화 전/후 worker buff, rate 상승, panel overflow, bottom-tab invariant, screenshot을 추가한다. ✅
5. Browser Use iab 우선 QA를 현재 세션에서 다시 시도하고, blocker면 `reports/visual/browser-use-blocker-0300-20260503.md`와 Playwright screenshot fallback을 남긴다. ✅
6. `docs/ROADMAP.md`, `docs/DASHBOARD.md`, `docs/OPERATOR_CONTROL_ROOM.md`, closed WorkUnit mirror, PR/issue body-file evidence를 갱신한다. 진행 중

## 수용 기준

- [x] `작업 간식 강화` 직후 포리 buff/간식 완료 payoff가 action surface 또는 playfield에서 보인다.
- [x] 생산 속도 상승이 rate badge/playfield actor state/다음 주문 progress 문맥으로 연결된다.
- [x] 모바일 393px에서 body scroll, panel overflow, bottom-tab overlap 회귀가 없다.
- [x] Browser Use `iab` current-session evidence 또는 current-session blocker + Playwright fallback screenshot을 남긴다.
- [x] `npm run check:visual`과 `npm run check:ci`가 통과한다.

## 검증 명령

- `npm run build`
- `npx playwright test --config playwright.config.ts --grep "자동 생산과 첫 주문"`
- `npm run check:visual`
- `npm run check:ci`

## 리스크

- 새 graphics asset 없이 기존 worker/FX를 runtime buff state로 연결하는 범위라, 시각 payoff가 너무 약하면 asset lane이 필요할 수 있다.
- 새 accepted game graphics가 필요해지면 gpt-image-2 또는 Codex native image generation provenance가 필요하고, SVG/vector/code-native graphics는 금지다.
- upgrade receipt가 action surface를 키우면 393px overflow/bottom-tab overlap 회귀가 날 수 있다.
- Browser Use iab backend는 #298에서도 discovery 실패했다. 이번 issue에서도 현재 세션 기준으로 다시 시도해야 한다.

## Reference teardown

- Idle Miner Tycoon: manager/worker upgrade 직후 작업 속도 상승이 worker state와 production lane에서 보인다.
- Egg, Inc.: upgrade purchase가 단순 숫자 변화가 아니라 생산 흐름이 빨라지는 느낌으로 이어진다.
- Cell to Singularity: early upgrade가 자원 생성 속도와 다음 unlock progress를 즉시 연결한다.

## Creative brief

- Player value: “포리에게 간식을 줬더니 더 빠르게 잎을 만든다”를 즉시 이해한다.
- Art direction: 기존 포리/leaf FX raster style을 유지한다. 1차 범위는 existing accepted worker/FX를 runtime buff state와 reward motion에 연결한다.
- Motion tone: 짧은 snack/buff pop, rate badge pulse, reduced-motion safety.

## Game Studio Department Signoff

- 기획팀: player verb는 `작업 간식 강화하기`; core loop role은 보상 소비 → 생산률 상승 → 다음 주문 가속.
- 리서치팀: 경쟁작 production gap은 upgrade payoff/worker buff state 부재.
- 아트팀: 기본은 기존 accepted raster worker/FX binding 재사용 + runtime buff state. 새 asset이 필요하면 gpt-image-2/Codex native provenance와 manifest binding을 요구한다.
- 개발팀: `src/App.tsx`, `src/styles.css`, visual regression test를 작은 tranche로 수정한다.
- 검수팀: Browser Use iab 우선; blocker 시 current-session blocker와 Playwright screenshot fallback. 393px overflow/bottom-tab invariant 필수.
- 마케팅팀: mock-only devlog angle은 “포리에게 간식을 주면 정원이 빨라진다”이다. 실채널 action 없음.
- 고객지원팀: 첫 5분 혼란 risk는 “강화가 왜 중요한지 모름”; FAQ note는 강화하면 생산 속도가 올라 다음 주문이 빨리 찬다는 설명.

## Strategic Jump Check

#298의 수령 motion 다음으로 가장 가까운 first 5m confusion은 “왜 첫 주문 보상을 업그레이드에 써야 하지?”이다. `작업 간식 강화`가 포리의 작업 버프와 생산 속도 상승으로 보이면 생산 → 주문 → 보상 → 업그레이드 → 더 빠른 생산 루프가 한 화면에서 닫힌다.

## Subagent/Team Routing

- 사용하지 않음: 초기 scope가 upgrade flow + UI regression에 강하게 결합되어 단일 agent가 안전하다.
- 새 asset lane이 필요해지면 Codex native subagent/skill로 분리하고 runtime implementation과 write scope를 나눈다.

## QA/playtest evidence

- Browser Use blocker: `reports/visual/browser-use-blocker-0300-20260503.md`
- Playwright screenshot: `reports/visual/issue-300-snack-upgrade-worker-payoff-393.png`
- Focused regression: `npx playwright test --config playwright.config.ts --grep "자동 생산과 첫 주문"` → 1 passed
- Full visual regression: `npm run check:visual` → 55 passed
- Full CI: `npm run check:ci` → pass
