# #292 복귀 첫 30초에 보상 수령과 다음 생산 목표를 한 화면에서 실행하게 만든다

- 상태: `ready-for-pr`
- GitHub issue: #292 `복귀 첫 30초에 보상 수령과 다음 생산 목표를 한 화면에서 실행하게 만든다`
- Branch: `codex/0292-return-30s-production-briefing`
- WorkUnit authority: GitHub issue/PR/GateEvent. local docs/reports는 evidence mirror다.
- Runner evidence: `reports/operations/studio-v3-live-runner-after-0290-20260503.md`에서 queue empty를 `production-game-intake-required`로 분류한 뒤 생성된 production game WorkUnit이다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route: `game-studio:game-ui-frontend` + `game-studio:game-playtest`
- Browser QA route: `browser-use:browser` 우선. Node REPL `js`가 없으면 current-session blocker를 새로 기록하고 Playwright fallback screenshot/report를 남긴다.

## Campaign source of truth

- Active campaign: `P0.5 Idle Core + Creative Rescue`
- Production gap: 복귀 후 첫 30초가 idle 경쟁작처럼 `보상 수령 → 생산 엔진 확인 → 다음 목표 실행`으로 압축되어 있지 않다.
- North Star: 첫 5분/복귀 직후 “얘 귀엽다. 하나만 더 키워볼까?”를 production scene으로 만든다.

## Reference teardown

- Egg, Inc./Idle Miner 계열: 복귀 시 숫자 보상만이 아니라, 생산 설비/일꾼/다음 업그레이드가 한 화면에서 이어진다.
- 현재 게임 gap: 정원 첫 화면 production engine은 개선됐지만, 복귀 reward가 다음 주문/강화 CTA와 한 장면에서 즉시 이어지는 comeback briefing은 약하다.

## Creative brief

- Screen moment: 플레이어가 앱을 다시 열고 정원에 들어온 첫 30초.
- Player verb: `복귀 보상 수령` 후 `다음 생산 목표 실행`.
- Production/progression role: 오프라인/보관 보상 → 주문/강화/생산 목표.
- Visual/game-feel payoff: reward motion 또는 HUD affordance가 playfield/order crate/production card에 남는다.
- Asset/FX decision: 신규 accepted manifest asset은 기본 범위가 아니다. 기존 accepted raster asset과 CSS/DOM reward motion을 사용하되, 새 sprite/FX가 필요해지면 별도 asset provenance gate를 세운다.

## Candidate issue list / Strategic Jump Check

1. 선택: 복귀 첫 30초 production briefing — player verb, production role, screen moment, reward motion/HUD affordance, playtest evidence를 모두 만족한다.
2. 거절: 단순 새 주문 추가 — `단순 주문 추가`라 production gap 해결 없이 content만 늘릴 위험이 크다.
3. 거절: 전체 art direction 재생성 — 큰 방향 점프이지만 gpt-image asset pipeline과 style review가 큰 scope라 이번 runner 직후 game loop 복구보다 늦다.

## Game Studio Department Signoff

- 기획팀: comeback verb와 다음 목표를 첫 화면에 묶는다.
- 리서치팀: idle competitor gap은 복귀 reward compression이다.
- 아트팀: 기존 accepted raster + DOM/CSS motion을 우선하고 신규 asset은 scope gate로 분리한다.
- 개발팀: `src/App.tsx`, `src/styles.css`, visual regression test 중심으로 작게 구현한다.
- 검수팀: Browser Use current-session attempt + mobile Playwright fallback screenshot/report.
- 마케팅팀: mock-only. 실채널 action 없음.
- 고객지원팀: “돌아와서 뭘 눌러야 하지?” confusion을 줄인다.

## Plan

1. 현재 오프라인/복귀 reward state와 production/order/upgrade UI 연결점을 코드에서 확인한다.
2. 모바일 정원 첫 화면에 comeback briefing CTA/affordance를 production engine 일부로 추가한다.
3. 수령 후 reward motion/HUD affordance 또는 persistent payoff state를 남긴다.
4. visual regression test를 추가한다.
5. Browser Use current-session 시도와 screenshot evidence를 남긴다.
6. `npm run check:visual`, `npm run check:ci`를 통과한다.
7. PR/GateEvent/merge/main CI 후 runner로 다음 queue를 다시 읽는다.

## 수용 기준

- [x] 복귀/오프라인 보상 상태가 정원 첫 화면에서 production engine 장면으로 읽힌다.
- [x] 보상 수령 CTA가 다음 주문/강화/생산 목표와 연결된다.
- [x] 수령 후 reward motion 또는 HUD affordance가 보인다.
- [x] 모바일 visual regression이 body scroll, bottom-tab overlap, visible overflow를 막는다.
- [x] Browser Use current-session QA evidence 또는 blocker + Playwright fallback screenshot/report가 남는다.
- [x] `npm run check:visual`과 `npm run check:ci`가 통과한다.

## 검증 명령

- `npm run check:visual -- --grep "복귀|보상|production"`
- `npm run check:visual`
- `npm run check:ci`

## 리스크와 롤백

- 리스크: 복귀 briefing이 다시 dashboard overlay가 되면 playfield를 가린다. Game UI route의 playfield 보호가 blocking 기준이다.
- 리스크: offline reward state 재현이 flaky할 수 있다. deterministic local save setup/test helper를 우선한다.
- 롤백: #292 branch commit을 revert하면 previous production engine layout으로 돌아간다.

## Subagent/Team Routing

- 아직 사용하지 않음. 첫 단계는 local code mapping이 blocker라 leader가 직접 확인한다. 구현 중 QA/test 작성이 독립 가능해지면 Codex native subagent를 검수 보조로 쓴다.


## 구현/검증 메모 — 2026-05-03

- `src/App.tsx`: 복귀 보상 modal에 `복귀 다음 생산 목표` briefing을 추가하고, `보상 받고 생산 잎 수령` CTA가 `claimProductionLeaves()`로 바로 이어지게 했다. 주문 준비/납품 가능/완료 상태는 `getComebackProductionTarget()`에서 한곳에 모은다.
- `src/styles.css`: 복귀 production target 카드와 모바일 first-order return briefing 압축 레이아웃을 추가했다. 첫 주문 복귀 상태에서는 roster/upgrade/next-creature 보조면을 접어 하단 탭 겹침과 내부 clipping을 막는다.
- `tests/visual/p0-mobile-game-shell.spec.ts`: `모바일 복귀 첫 30초는 보상 수령을 생산 주문 목표로 바로 잇는다` 회귀를 추가했다. modal card `scrollHeight <= clientHeight`, body scroll, bottom-tab overlap, production card overflow, production FX telemetry를 함께 검증한다.
- Browser Use CLI 결함: 현재 Codex CLI config에 `node_repl` MCP가 없어 Browser Use 실행 tool이 노출되지 않는 root cause를 확인했고, `/Applications/Codex.app/Contents/Resources/node_repl`를 `codex mcp add node_repl -- ...`로 등록했다. 현재 세션은 tool palette hot reload가 되지 않아 `reports/visual/browser-use-blocker-0292-20260503.md`에 blocker+fix evidence를 남겼다.
- Playwright fallback screenshot: `reports/visual/0292-mobile-comeback-production-briefing-393-20260503.png`
- Focused verification: `npm run build` pass, `npx playwright test --config playwright.config.ts --grep "모바일 복귀 첫 30초|모바일 복귀 보상은 달빛|모바일 복귀 보상은 온실 선반|모바일 복귀 후 온실 선반"` 4 passed.

- Full visual verification: `npm run check:visual` 55 passed.
- Full CI verification: `npm run check:ci` passed.
