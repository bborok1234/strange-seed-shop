# 작업 간식 강화가 포리 버프와 생산 속도 상승으로 보이게 만든다

## 문제 / 배경

#298로 `생산 잎 수령`은 포리 작업 FX와 주문 progress motion으로 읽히기 시작했다. 하지만 바로 다음 성장 선택인 `작업 간식 강화`는 아직 강화 완료 텍스트와 분당 수치 변화 중심이다. 경쟁작 idle game에서는 첫 업그레이드가 “worker가 더 빨라졌다”는 화면 상태와 짧은 celebratory payoff로 남아 다음 생산/주문 반복을 설득한다.

Studio Harness v3 queue가 비었으므로 local ledger가 아니라 GitHub issue를 새 WorkUnit authority로 만든다. 이 작업은 `P0.5 Idle Core + Creative Rescue`의 production game quality intake다.

## Campaign source of truth

- Campaign: `P0.5 Idle Core + Creative Rescue`
- North Star: 첫 5분 안에 “포리가 더 열심히 일한다. 다음 주문도 빨리 채워보자.”를 만든다.
- Production gap: 첫 납품 보상 이후 성장 선택이 게임 장면의 버프/가속 상태로 남지 않고 카드 완료 상태로만 읽힌다.

## Reference teardown

- Idle Miner Tycoon: manager/worker upgrade 직후 작업 속도 상승이 worker state와 production lane에서 보인다.
- Egg, Inc.: upgrade purchase가 단순 숫자 변화가 아니라 생산 흐름이 빨라지는 느낌으로 이어진다.
- Cell to Singularity: early upgrade가 자원 생성 속도와 다음 unlock progress를 즉시 연결한다.

## 선택 근거

선택: `작업 간식 강화` worker buff payoff

- player verb: `작업 간식 강화하기`
- production/progression role: 첫 주문 보상 → 생산 속도 업그레이드 → 다음 주문 반복 속도 증가
- screen moment: 첫 주문 납품/보상 수거 직후, `작업 간식 강화` 버튼을 누르는 순간
- asset/FX/game-feel payoff: 포리 buff receipt, playfield actor state, production rate HUD affordance, reward/upgrade motion
- playtest evidence: 모바일 393px에서 강화 전/후 rate, worker buff state, action surface overflow/bottom-tab invariants 확인

보류한 후보:

- 새 주문 추가: content quantity보다 첫 성장 선택의 game feel이 먼저다.
- 전체 art direction 재작업: visual payoff는 크지만 이번 blocker는 upgrade verb가 worker/progression으로 읽히지 않는 문제다.

## Strategic Jump Check

#298의 수령 motion 다음으로 가장 가까운 first 5m confusion은 “왜 첫 주문 보상을 업그레이드에 써야 하지?”이다. `작업 간식 강화`가 포리의 작업 버프와 생산 속도 상승으로 보이면 생산 → 주문 → 보상 → 업그레이드 → 더 빠른 생산 루프가 한 화면에서 닫힌다.

## Creative brief

- Player value: “포리에게 간식을 줬더니 더 빠르게 잎을 만든다”를 즉시 이해한다.
- Art direction: 기존 포리/leaf FX raster style을 유지한다. 새 accepted graphics asset이 필요하면 gpt-image-2 또는 Codex native provenance가 필요하지만, 1차 범위는 기존 accepted worker/FX를 runtime buff state와 reward motion에 연결한다.
- Motion tone: 짧은 snack/buff pop, rate badge pulse, reduced-motion safety.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route: `game-studio:game-ui-frontend` + `game-studio:game-playtest`
- Optional if asset lane expands: `game-studio:sprite-pipeline`
- 적용 기준: playfield 보호, low-density HUD, first actionable screen, main verb, HUD readability, playfield obstruction, screenshot evidence.

## Game Studio Department Signoff

- 기획팀: player verb는 `작업 간식 강화하기`; core loop role은 보상 소비 → 생산률 상승 → 다음 주문 가속.
- 리서치팀: 경쟁작 production gap은 upgrade payoff/worker buff state 부재.
- 아트팀: 기본은 기존 accepted raster worker/FX binding 재사용 + runtime buff state. 새 asset이 필요하면 gpt-image-2/Codex native provenance와 manifest binding을 요구한다.
- 개발팀: `src/App.tsx`, `src/styles.css`, visual regression test를 작은 tranche로 수정한다.
- 검수팀: Browser Use iab 우선; blocker 시 current-session blocker와 Playwright screenshot fallback. 393px overflow/bottom-tab invariant 필수.
- 마케팅팀: mock-only devlog angle은 “포리에게 간식을 주면 정원이 빨라진다”이다. 실채널 action 없음.
- 고객지원팀: 첫 5분 혼란 risk는 “강화가 왜 중요한지 모름”; FAQ note는 강화하면 생산 속도가 올라 다음 주문이 빨리 찬다는 설명.

## Plan

- 구현 전 작성/검토할 plan artifact: `items/0152-snack-upgrade-worker-payoff.md`
- 예상 단계:
  1. 현재 `작업 간식 강화` purchase flow, production rate state, playfield actor copy를 매핑한다.
  2. first order reward 이후 upgrade click 직후 buff receipt/playfield actor state/rate badge pulse를 설계한다.
  3. 모바일 393px visual regression에 강화 전/후 worker buff, rate 상승, overflow/bottom-tab invariant, screenshot을 추가한다.
  4. Browser Use iab 우선 QA 또는 current-session blocker + Playwright fallback evidence를 남긴다.
  5. roadmap/dashboard/control room/PR evidence를 갱신한다.

## Subagent/Team Routing

- 구현 전 단일 agent로 시작한다. 변경 범위가 upgrade flow + UI regression에 결합되어 있다.
- 새 asset lane이 필요해지면 Codex native subagent/skill로 분리하고, runtime implementation과 write scope를 나눈다.

## QA/playtest plan

- `npm run build`
- focused Playwright: `npx playwright test --config playwright.config.ts --grep "자동 생산과 첫 주문"`
- `npm run check:visual`
- `npm run check:ci`

## 수용 기준

- [x] `작업 간식 강화` 직후 포리 buff/간식 완료 payoff가 action surface 또는 playfield에서 보인다.
- [x] 생산 속도 상승이 rate badge/playfield actor state/다음 주문 progress 문맥으로 연결된다.
- [x] 모바일 393px에서 body scroll, panel overflow, bottom-tab overlap 회귀가 없다.
- [x] Browser Use `iab` current-session evidence 또는 current-session blocker + Playwright fallback screenshot을 남긴다.
- [x] `npm run check:visual`과 `npm run check:ci`가 통과한다.

## Visual evidence 계획

- Before: 첫 주문 납품/수령 후 `작업 간식 강화`가 수치/완료 텍스트 중심인 상태.
- After: 강화 직후 포리 buff receipt + rate 상승 + playfield worker state screenshot.
- Browser Use: `iab` 우선, 실패 시 `reports/visual/browser-use-blocker-0300-20260503.md` 등 current-session blocker.

## Playable mode 영향

- main playable worktree/port 5174 계약 변경 없음.

## 안전 범위

- 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음.
- 런타임 이미지 생성 없음.
- SVG/vector/code-native accepted game graphics 추가 없음.


## 구현 evidence

- Browser Use blocker: `reports/visual/browser-use-blocker-0300-20260503.md`
- Playwright screenshot: `reports/visual/issue-300-snack-upgrade-worker-payoff-393.png`
- Verification: `npm run build`, focused Playwright 1 passed, `npm run check:visual` 55 passed, `npm run check:ci` pass.
