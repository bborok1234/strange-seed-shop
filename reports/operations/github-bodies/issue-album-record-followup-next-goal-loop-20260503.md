## GitHub authority

- Issue: #322 https://github.com/bborok1234/strange-seed-shop/issues/322
- Branch: `codex/0322-album-record-followup-next-goal-loop`
- Plan artifact: `items/0163-album-record-followup-next-goal-loop.md`

## 문제 / 배경

#320이 새 기록 후속 재배 수확 순간을 `젤리콩 통통` 발견과 도감 저장 CTA로 닫았지만, 도감에 저장한 뒤 다음 씨앗 목표로 다시 재순환하는 화면 payoff는 아직 별도 WorkUnit으로 강화/검증되지 않았다. 수집 idle loop는 “만났다”에서 끝나지 않고 “다음 아이도 키워볼까?”로 이어져야 한다.

## 목표

새 기록 후속 수확 reveal에서 `도감에 기록하기`를 누른 뒤 album/action surface가 다음 생명체/씨앗 목표와 seeds tab CTA를 명확히 보여주고, 다음 target row로 재진입하게 만든다.

## Small win

젤리콩 통통을 도감에 저장하면 바로 다음 씨앗 목표가 보이고, seeds tab으로 이동해 다음 row를 누를 이유가 생긴다.

## Campaign source of truth

- P0.5 Idle Core + Creative Rescue
- Follows #320: 새 기록 후속 수확 reveal → 도감 저장 → 다음 목표 재순환

## Studio Campaign Gate

- Player verb: `새 기록 후속 수확을 도감에 저장하고 다음 씨앗 목표 선택하기`
- Production/progression role: 후속 수확 발견 → 도감 저장 → 다음 생명체 목표 확인 → seeds tab target row 재진입
- Screen moment: #320 reveal의 `도감에 기록하기` 직후 album 화면
- Concrete visual/game-feel payoff: `다음 기록으로 이어가기` HUD affordance, next seed/creature CTA, target row highlight/reward motion, bottom-tab/overflow-safe mobile screenshot
- Competition production gap: collection idle games는 새 도감 기록 저장 직후 다음 collection target을 즉시 보여주고, 다음 acquisition screen으로 이동할 CTA를 제공한다. 기록 저장 후 목표가 흐려지는 대안은 reject한다.
- Playtest evidence: Browser Use iab 우선, blocker 시 issue 전용 blocker + 393px Playwright screenshot/layout invariant.

## Game Studio Department Signoff

- 기획팀: “하나만 더” 루프는 도감 저장 직후 다음 목표 CTA에서 발생한다.
- 리서치팀: 경쟁작은 collection entry 저장 후 next target/next source를 바로 제시한다.
- 아트팀: 신규 accepted manifest asset 없이 existing creature/seed portrait, DOM/CSS CTA, target row motion으로 제한한다. 새 FX가 필요하면 별도 provenance WorkUnit으로 분리한다.
- 개발팀: `src/App.tsx`, `src/styles.css`, `tests/visual/p0-mobile-game-shell.spec.ts` 중심의 좁은 tranche.
- 검수팀: Browser Use iab current-session 시도, 393px screenshot, album/action surface/seeds row/bottom-tab invariant 필수.
- 마케팅팀: mock-only promise. 외부 채널/실결제 없음.
- 고객지원팀: “기록한 다음 뭘 하죠?”를 다음 씨앗 CTA와 target row로 줄인다.

## Subagent/Team Routing

- 단일 React/CSS/visual regression tranche라 Codex native subagents/team mode는 기본 미사용.
- 독립 분리 기준: Browser Use 복구가 필요하면 QA/verifier subtask, 새 CTA FX asset이 필요하면 asset pipeline subtask로 분리.

## 사용자/운영자 가치

- 사용자: 새 생명체를 도감에 저장한 직후 다음 목표를 잃지 않고 다음 씨앗으로 이동한다.
- 운영자: #314→#316→#318→#320의 후속 기록 루프를 다음 target acquisition으로 재순환시키는 production vertical slice를 이어간다.

## 수용 기준

- [x] 새 기록 후속 수확 reveal에서 `도감에 기록하기`를 누르면 album 화면이 저장한 생명체와 다음 씨앗/생명체 목표를 함께 보여준다.
- [x] album CTA 또는 action surface가 seeds tab target row로 이동하는 다음 행동을 명확히 제공한다.
- [x] seeds tab target row가 새 목표의 seed/creature 이름과 `다음 기록` 또는 동등한 재순환 affordance를 보여준다.
- [x] 신규 accepted manifest asset 없이 existing visuals + DOM/CSS HUD/CTA/reward motion으로 구현하고 runtime image generation/API를 호출하지 않는다.
- [x] 393px 모바일에서 album/action surface/seeds row/bottom tab이 겹치지 않고 overflow를 만들지 않는다.
- [x] Browser Use iab current-session blocker, focused Playwright screenshot, `npm run check:visual` evidence가 남았다. `npm run check:ci`까지 통과했다.

## Visual evidence 계획

- Browser Use iab target: 연구 단서 수확 → 도감 기록 CTA → 다음 씨앗 CTA → 구매/심기 → 후속 수확 → 도감 저장 → 다음 목표 CTA → seeds row.
- Fallback screenshot: `reports/visual/issue-322-album-record-followup-next-goal-loop-393.png`.
- Layout invariant: album/action surface/seeds row vs `.bottom-tabs`, no body scroll, no masked overflow.

## Playable mode 영향

- Local dev: `npm run dev -- --host 127.0.0.1 --port 3000`
- Stable main playable mirror는 `npm run play:main` + port 5174 계약 유지.

## 안전 범위

- runtime image generation/API 호출 없음.
- 신규 accepted manifest asset 없음. existing visuals, DOM/CSS HUD/CTA/reward motion만 허용.
- real payment, customer data, external production deployment 없음.

## 검증 명령

- `npm run build`
- focused Playwright: 새 기록 후속 저장/다음 목표 재순환
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

- Plan artifact: `items/0163-album-record-followup-next-goal-loop.md`
- Browser Use blocker: `reports/visual/browser-use-blocker-0322-20260503.md`
- Screenshot: `reports/visual/issue-322-album-record-followup-next-goal-loop-393.png`
- 구현 파일: `src/App.tsx`, `src/styles.css`, `tests/visual/p0-mobile-game-shell.spec.ts`
- `npm run build` — pass
- `npx playwright test --config playwright.config.ts --grep "후속 저장은 다음 기록 목표 재순환|후속 수확은 예고했던"` — 2 passed
- `npm run check:visual` — 64 passed
- `npm run check:ci` — pass
