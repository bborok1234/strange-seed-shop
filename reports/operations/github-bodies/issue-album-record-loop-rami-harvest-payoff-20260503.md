## GitHub authority

- Issue: #324 https://github.com/bborok1234/strange-seed-shop/issues/324
- Branch: `codex/0324-album-record-loop-rami-harvest-payoff`
- Plan artifact: `items/0164-album-record-loop-rami-harvest-payoff.md`

## 문제 / 배경

#322는 `젤리콩 통통` 후속 수확을 도감에 저장한 직후 `방울새싹 씨앗 → 이슬연금 라미`를 다음 기록 목표로 재순환시켰다. 하지만 그 다음 target row에서 실제 구매/심기/성장/수확을 끝까지 해 “다음 기록 재순환이 또 하나의 새 생명체 발견으로 닫힌다”는 playfield payoff는 아직 별도 WorkUnit으로 검증되지 않았다.

## 목표

후속 기록 저장 후 `다음 기록으로 이어가기`로 진입한 `방울새싹 씨앗`을 구매/심기/성장/수확하면 playfield가 `이슬연금 라미` 수확 예고와 새 기록 재순환 수확 reveal을 보여주게 만든다.

## Small win

`젤리콩 통통` 다음에 `이슬연금 라미`까지 실제로 만날 수 있어, “다음 기록 목표”가 단순 CTA가 아니라 다음 발견 payoff로 이어진다.

## Campaign source of truth

- P0.5 Idle Core + Creative Rescue
- Follows #322: 후속 기록 저장 → 다음 기록 목표 CTA → seeds target row → 다음 target harvest payoff

## Studio Campaign Gate

- Player verb: `다음 기록 목표 씨앗을 심고 이슬연금 라미를 수확하기`
- Production/progression role: 후속 기록 저장 → next seed target row → planting → growth preview → named creature reveal
- Screen moment: #322 seeds target row에서 `방울새싹 씨앗`을 심은 뒤 정원 성장/수확 화면
- Concrete visual/game-feel payoff: `album_record_next_seed` plot state, `이슬연금 라미 수확 예고` growth feedback, target creature reveal receipt, reward motion telemetry, bottom-tab/overflow-safe 393px screenshot
- Competition production gap: collection idle games는 next target CTA가 실제 다음 collectible reveal로 이어져야 신뢰가 생긴다. CTA만 있고 다음 harvest payoff가 검증되지 않는 대안은 reject한다.
- Playtest evidence: Browser Use iab 우선, blocker 시 issue 전용 blocker + 393px Playwright screenshot/layout invariant.

## Game Studio Department Signoff

- 기획팀: 다음 목표 CTA는 다음 생명체 수확 payoff까지 이어져야 “하나만 더” 루프가 완성된다.
- 리서치팀: reference collection games는 target source → growth/collection reveal까지 같은 named target을 유지한다.
- 아트팀: 신규 accepted manifest asset 없이 existing `이슬연금 라미` asset과 DOM/CSS/reward motion으로 제한한다. 별도 FX sprite가 필요하면 provenance WorkUnit으로 분리한다.
- 개발팀: `src/App.tsx`, `src/game/playfield/*` 필요 여부, `tests/visual/p0-mobile-game-shell.spec.ts` 중심의 좁은 tranche.
- 검수팀: Browser Use iab current-session 시도, growth preview/reveal screenshot, telemetry/layout invariant 필수.
- 마케팅팀: mock-only promise. 외부 채널/실결제 없음.
- 고객지원팀: “다음 기록 목표를 눌렀는데 정말 새 아이가 나오나요?”를 named reveal로 줄인다.

## Subagent/Team Routing

- 초기 구현은 단일 React/game-state/visual regression tranche라 Codex native subagents/team mode는 기본 미사용.
- 독립 분리 기준: playfield telemetry mapping이 불명확하면 explorer/verifier subtask, 신규 FX asset이 필요하면 asset pipeline subtask로 분리.

## 사용자/운영자 가치

- 사용자: 다음 기록 목표가 실제 새 생명체 수확으로 이어져 다음 클릭의 신뢰가 생긴다.
- 운영자: #314→#316→#318→#320→#322 후속 기록 chain을 두 번째 named creature harvest payoff까지 이어 production vertical slice를 강화한다.

## 수용 기준

- [ ] #322 후속 기록 저장 이후 `방울새싹 씨앗 → 이슬연금 라미` target row에서 구매/심기를 할 수 있다.
- [ ] 심은 plot/action feedback/next creature card가 `이슬연금 라미` 수확 예고와 `후속 성장 중` 또는 동등한 재순환 상태를 보여준다.
- [ ] 수확 reveal이 `이슬연금 라미`와 새 기록 재순환 수확 receipt를 보여주고 도감 저장 CTA로 이어진다.
- [ ] reward motion telemetry 또는 plot state evidence가 `album_record_next_seed` 재순환임을 남긴다.
- [ ] 신규 accepted manifest asset 없이 existing visuals + DOM/CSS HUD/CTA/reward motion으로 구현하고 runtime image generation/API를 호출하지 않는다.
- [ ] 393px 모바일에서 playfield/action surface/reveal/bottom tab이 겹치지 않고 overflow를 만들지 않는다.
- [ ] Browser Use iab current-session 시도 evidence 또는 blocker, focused Playwright screenshot, `npm run check:visual`, `npm run check:ci`가 남는다.

## Visual evidence 계획

- Browser Use iab target: #322 flow → `다음 기록으로 이어가기` → 방울새싹 씨앗 구매/심기 → growth preview → 수확 reveal.
- Fallback screenshot: `reports/visual/issue-324-album-record-loop-rami-harvest-payoff-393.png`.
- Layout invariant: playfield/action surface/reveal vs `.bottom-tabs`, no body scroll, no masked overflow.

## Playable mode 영향

- Local dev: `npm run dev -- --host 127.0.0.1 --port 3000`
- Stable main playable mirror는 `npm run play:main` + port 5174 계약 유지.

## 안전 범위

- runtime image generation/API 호출 없음.
- 신규 accepted manifest asset 없음. existing visuals, DOM/CSS HUD/CTA/reward motion만 허용.
- real payment, customer data, external production deployment 없음.

## 검증 명령

- `npm run build`
- focused Playwright: 다음 기록 목표 / 이슬연금 라미 / 새 기록 재순환 수확
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
