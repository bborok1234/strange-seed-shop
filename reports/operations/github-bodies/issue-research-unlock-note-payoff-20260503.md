# 두 번째 주문 보상이 연구 노트 unlock payoff로 이어지게 만든다

## 문제 / 배경

#298과 #300으로 생산 수령과 첫 생산 속도 업그레이드는 worker/reward motion으로 읽히기 시작했다. 다음 first 5m blocker는 두 번째 주문 `연구 준비 잎 묶음` 납품 이후 연구가 열리는 순간이 아직 UI 상태 전환 중심이라는 점이다. 경쟁작 idle game은 다음 시스템이 열릴 때 노트/단서/연구 unlock payoff를 보여줘 플레이어가 “이제 장기 메타가 열렸다”를 이해하게 만든다.

Studio Harness v3 queue가 비었으므로 local ledger가 아니라 GitHub issue를 새 WorkUnit authority로 만든다. 이 작업은 `P0.5 Idle Core + Creative Rescue` production game quality intake다.

## Campaign source of truth

- Campaign: `P0.5 Idle Core + Creative Rescue`
- North Star: 첫 5분 안에 “다음 연구가 열렸고, 새 생명체 단서로 이어진다”를 만든다.
- Production gap: 두 번째 주문 완료가 연구 unlock이라는 progression beat로 충분히 연출되지 않는다.

## Reference teardown

- Cell to Singularity: 새 node/system unlock이 연구/진화 트리의 다음 목표로 즉시 보인다.
- Egg, Inc.: contract/research 전환은 보상 수령 후 다음 growth system으로 연결된다.
- Idle Miner Tycoon: milestone completion 이후 manager/research류 unlock이 별도 payoff와 다음 CTA로 남는다.

## 선택 근거

선택: 두 번째 주문 납품 → 연구 노트 unlock payoff

- player verb: `연구 준비 잎 묶음 납품하기`
- production/progression role: 반복 주문 완료 → 연구 unlock → 다음 생명체/원정 단서
- screen moment: 생산 속도 강화 후 두 번째 주문을 채우고 납품하는 순간
- asset/FX/game-feel payoff: research note receipt, playfield order crate state, HUD affordance, reward motion
- playtest evidence: 모바일 393px에서 두 번째 주문 납품 후 research unlock receipt, 연구 CTA, overflow/bottom-tab invariants 확인

보류한 후보:

- 새 원정 콘텐츠 추가: 연구 unlock beat가 production-quality로 읽힌 뒤 확장한다.
- 전체 art direction 점프: 이번 blocker는 progression system unlock의 game-feel 부재다.

## Strategic Jump Check

생산 수령과 생산 속도 강화가 연결된 뒤, 다음 큰 감정 보상은 “연구가 열렸다”이다. 이 순간이 카드 상태 변화로만 보이면 장기 메타가 약하고, research note/단서 payoff가 있으면 production loop가 수집/원정으로 확장되는 이유가 생긴다.

## Creative brief

- Player value: “두 번째 납품으로 연구 노트가 열렸고, 다음 생명체 단서가 가까워졌다”를 즉시 이해한다.
- Art direction: 기존 order/research UI 톤을 유지한다. 새 accepted graphics asset이 필요하면 gpt-image-2 또는 Codex native provenance가 필요하지만, 1차 범위는 existing UI/FX surface를 research note payoff로 연결한다.
- Motion tone: 짧은 note-unlock pop, research CTA glow, reduced-motion safety.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route: `game-studio:game-ui-frontend` + `game-studio:game-playtest`
- Optional if asset lane expands: `game-studio:sprite-pipeline`
- 적용 기준: playfield 보호, low-density HUD, first actionable screen, main verb, HUD readability, playfield obstruction, screenshot evidence.

## Game Studio Department Signoff

- 기획팀: player verb는 `연구 준비 잎 묶음 납품하기`; core loop role은 반복 주문 → 연구 unlock → 장기 메타.
- 리서치팀: 경쟁작 production gap은 system unlock payoff/next CTA 부재.
- 아트팀: 기본은 existing accepted UI/FX surface + research note receipt. 새 asset이 필요하면 gpt-image-2/Codex native provenance와 manifest binding을 요구한다.
- 개발팀: `src/App.tsx`, `src/styles.css`, visual regression test를 작은 tranche로 수정한다.
- 검수팀: Browser Use iab 우선; blocker 시 current-session blocker와 Playwright screenshot fallback. 393px overflow/bottom-tab invariant 필수.
- 마케팅팀: mock-only devlog angle은 “납품하면 연구 노트가 열린다”이다. 실채널 action 없음.
- 고객지원팀: 첫 5분 혼란 risk는 “연구가 왜 열렸는지/무엇을 해야 하는지 모름”; FAQ note는 두 번째 주문이 연구를 여는 설명.

## Plan

- 구현 전 작성/검토할 plan artifact: `items/0153-research-unlock-note-payoff.md`
- 예상 단계:
  1. 현재 second order delivery, research unlock, first research purchase flow, playfield/order copy를 매핑한다.
  2. second order delivery 직후 research note receipt/playfield order state/research CTA glow를 설계한다.
  3. 모바일 393px visual regression에 두 번째 주문 납품 후 research unlock, overflow/bottom-tab invariant, screenshot을 추가한다.
  4. Browser Use iab 우선 QA 또는 current-session blocker + Playwright fallback evidence를 남긴다.
  5. roadmap/dashboard/control room/PR evidence를 갱신한다.

## Subagent/Team Routing

- 단일 agent로 시작한다. 변경 범위가 order delivery → research unlock UI/test에 결합되어 있다.
- 새 asset lane이 필요하면 Codex native subagent/skill로 분리한다.

## QA/playtest plan

- `npm run build`
- focused Playwright: `npx playwright test --config playwright.config.ts --grep "연구 unlock"`
- `npm run check:visual`
- `npm run check:ci`

## 수용 기준

- [ ] 두 번째 주문 납품 직후 research note/unlock payoff가 action surface 또는 playfield에서 보인다.
- [ ] 연구 CTA가 다음 actionable verb로 명확하게 이어진다.
- [ ] 모바일 393px에서 body scroll, panel overflow, bottom-tab overlap 회귀가 없다.
- [ ] Browser Use `iab` current-session evidence 또는 current-session blocker + Playwright fallback screenshot을 남긴다.
- [ ] `npm run check:visual`과 `npm run check:ci`가 통과한다.

## Visual evidence 계획

- Before: 두 번째 주문 완료 후 연구 unlock이 카드 상태 변화 중심인 상태.
- After: research note unlock receipt + research CTA + playfield/order state screenshot.
- Browser Use: `iab` 우선, 실패 시 `reports/visual/browser-use-blocker-0302-20260503.md` 등 current-session blocker.

## Playable mode 영향

- main playable worktree/port 5174 계약 변경 없음.

## 안전 범위

- 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음.
- 런타임 이미지 생성 없음.
- SVG/vector/code-native accepted game graphics 추가 없음.
