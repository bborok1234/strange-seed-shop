## GitHub authority

- Issue: #326 https://github.com/bborok1234/strange-seed-shop/issues/326
- Branch: `codex/0326-rami-record-next-merchant-goal`
- Plan artifact: `items/0165-rami-record-next-merchant-goal.md`

## 문제 / 배경

#324는 `방울새싹 씨앗 → 이슬연금 라미` 다음 기록 목표를 실제 수확 reveal로 닫았다. 하지만 `이슬연금 라미`를 도감에 저장한 직후 다음 unlocked seed pool 목표인 `젤리콩 씨앗 → 포장잎 상인`으로 다시 이어지는 저장 후 CTA/target row evidence는 아직 별도 WorkUnit으로 닫히지 않았다.

## 목표

`이슬연금 라미` 재순환 수확 reveal에서 `도감에 기록하기`를 누르면 album card와 seeds target row가 `젤리콩 씨앗 → 포장잎 상인` 다음 기록 목표를 명확히 보여주게 만든다.

## Small win

라미를 도감에 저장하자마자 다음 아이 `포장잎 상인`과 그 source seed가 보여, 수집 루프가 세 번째 named target으로 이어진다.

## Campaign source of truth

- P0.5 Idle Core + Creative Rescue
- Follows #324: 이슬연금 라미 reveal → 도감 저장 → 포장잎 상인 next target acquisition

## Studio Campaign Gate

- Player verb: `이슬연금 라미를 도감에 저장하고 포장잎 상인 목표로 이동하기`
- Production/progression role: 라미 수확 reveal → 도감 저장 → next creature/seed target 확인 → seeds target row 재진입
- Screen moment: #324 reveal의 `도감에 기록하기` 직후 album/seeds 화면
- Concrete visual/game-feel payoff: `다음 기록 목표: 포장잎 상인`, `다음 기록으로 이어가기: 젤리콩 씨앗`, seeds target row highlight, next target preview, bottom-tab/overflow-safe 393px screenshot
- Competition production gap: collection idle games는 collection reveal 저장 후 다음 target identity/source를 반복적으로 유지한다. 두 번째 재순환 이후 목표가 사라지는 대안은 reject한다.
- Playtest evidence: Browser Use iab 우선, blocker 시 issue 전용 blocker + 393px Playwright screenshot/layout invariant.

## Game Studio Department Signoff

- 기획팀: “하나만 더”는 두 번째 재순환 뒤에도 다음 named target이 살아 있을 때 강화된다.
- 리서치팀: reference collection games는 reveal 저장마다 다음 collection target/source를 즉시 보여준다.
- 아트팀: 신규 accepted manifest asset 없이 existing `포장잎 상인`/`젤리콩 씨앗` visuals와 DOM/CSS CTA/row highlight로 제한한다. 새 FX는 별도 provenance WorkUnit.
- 개발팀: `src/App.tsx`, `src/styles.css`, `tests/visual/p0-mobile-game-shell.spec.ts` 중심의 좁은 tranche.
- 검수팀: Browser Use iab current-session 시도, album/seeds screenshot, layout invariant 필수.
- 마케팅팀: mock-only promise. 외부 채널/실결제 없음.
- 고객지원팀: “라미 저장 후 다음은 뭔가요?”를 포장잎 상인 CTA로 줄인다.

## Subagent/Team Routing

- 단일 React/CSS/visual regression tranche라 Codex native subagents/team mode는 기본 미사용.
- 독립 분리 기준: next goal ordering에 설계 이견이 생기면 architect/verifier subtask, 신규 FX asset이 필요하면 asset pipeline subtask로 분리.

## 사용자/운영자 가치

- 사용자: 다음 목표가 계속 이어져 수집 idle loop의 신뢰와 반복 동기가 유지된다.
- 운영자: #322/#324로 만든 unlocked seed pool 재순환이 두 번째 저장 이후에도 지속되는지 GitHub-authoritative evidence로 고정한다.

## 수용 기준

- [ ] `이슬연금 라미` reveal에서 `도감에 기록하기`를 누르면 album 화면이 라미 저장과 다음 목표 `포장잎 상인`을 함께 보여준다.
- [ ] album CTA가 `다음 기록으로 이어가기: 젤리콩 씨앗` 또는 동등한 source seed action을 제공한다.
- [ ] seeds target row가 `젤리콩 씨앗`, `포장잎 상인`, `다음 기록` 재순환 affordance를 보여준다.
- [ ] 신규 accepted manifest asset 없이 existing visuals + DOM/CSS HUD/CTA/reward motion으로 구현하고 runtime image generation/API를 호출하지 않는다.
- [ ] 393px 모바일에서 album/seeds row/bottom tab이 겹치지 않고 overflow를 만들지 않는다.
- [ ] Browser Use iab current-session 시도 evidence 또는 blocker, focused Playwright screenshot, `npm run check:visual`, `npm run check:ci`가 남는다.

## Visual evidence 계획

- Browser Use iab target: #324 flow → 라미 reveal → 도감 저장 → next target album CTA → seeds row.
- Fallback screenshot: `reports/visual/issue-326-rami-record-next-merchant-goal-393.png`.
- Layout invariant: album card/seeds row vs `.bottom-tabs`, no body scroll, no masked overflow.

## Playable mode 영향

- Local dev: `npm run dev -- --host 127.0.0.1 --port 3000`
- Stable main playable mirror는 `npm run play:main` + port 5174 계약 유지.

## 안전 범위

- runtime image generation/API 호출 없음.
- 신규 accepted manifest asset 없음. existing visuals, DOM/CSS HUD/CTA/reward motion만 허용.
- real payment, customer data, external production deployment 없음.

## 검증 명령

- `npm run build`
- focused Playwright: 라미 저장 / 포장잎 상인 / 다음 기록 목표
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
