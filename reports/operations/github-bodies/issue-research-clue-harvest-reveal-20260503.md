## 문제 / 배경

#308이 연구 단서 씨앗 성장 중 `수확 예고`를 만들었지만, 실제 수확 순간은 아직 일반 수확 receipt와 크게 다르지 않았다. #310은 연구 단서 chain의 심기/성장/수확을 하나의 discovery arc로 닫기 위해 목표 씨앗 수확 시 다음 생명체 발견과 도감 단서가 정원 첫 화면에서 즉시 터지게 만든다.

## 목표

연구 단서 source plot을 수확하면 `단서 생명체 발견` receipt, next creature reveal copy, playfield reward motion이 한 화면에서 보이게 만든다.

## Small win

플레이어가 연구 단서 씨앗을 수확하는 순간 “다음 생명체를 찾아냈다”는 보상 장면을 즉시 본다.

## Campaign source of truth

- P0.5 Idle Core + Creative Rescue
- Follows #308: 연구 단서 씨앗 성장/수확 예고

## Game Studio Department Signoff

- 기획팀: player verb는 `연구 단서 씨앗 수확하기`; progression role은 연구 단서 성장 추적 → 다음 생명체 발견/도감 기억 저장이다.
- 리서치팀: Egg/Idle Miner류는 기다린 보상을 수령할 때 reward burst가 즉시 보이고, Cell to Singularity는 unlock node가 다음 branch로 이어진다. 일반 수확 receipt만 유지하는 대안은 reject한다.
- 아트팀: 신규 accepted manifest asset 없이 DOM/CSS reward motion과 기존 creature/seed image를 유지한다. 새 sprite/FX는 별도 provenance WorkUnit으로 분리한다.
- 개발팀: `src/App.tsx`, `src/styles.css`, `tests/visual/p0-mobile-game-shell.spec.ts` 중심의 좁은 tranche.
- 검수팀: Browser Use iab current-session 우선, blocker 시 `reports/visual/`에 새 blocker와 393px Playwright screenshot/layout invariant 남김.
- 마케팅팀: mock-only promise. 외부 채널/실결제 없음.
- 고객지원팀: “단서 씨앗을 수확했는데 뭘 발견했는지 모르겠다”를 reveal receipt로 줄인다.

## Subagent/Team Routing

- 단일 React/CSS/visual regression tranche이므로 Codex native subagents/team mode는 미사용.
- 독립 분리 기준: Browser Use 복구가 필요하면 QA/verifier subtask, 새 sprite/FX가 필요하면 asset pipeline subtask로 분리.

## 플레이어 가치 또는 운영사 가치

- 사용자: 연구 단서 목표를 따라 기다린 수확 순간이 다음 생명체 발견 감정으로 닫힌다.
- 운영자: queue-empty 이후에도 player verb + production role + screen moment + reward motion + playtest evidence를 갖춘 GitHub-authoritative WorkUnit으로 production game quality를 전진시킨다.

## 수용 기준

- [x] 연구 단서 source plot 수확 시 일반 수확과 구분되는 `단서 생명체 발견`/`도감 단서 기록` receipt가 보인다.
- [x] next creature card 또는 action surface가 수확한 생명체 이름과 다음 목표 전환을 한 화면에서 설명한다.
- [x] 신규 accepted manifest asset 없이 DOM/CSS reward motion/HUD affordance로 구현하고 runtime image generation/API를 호출하지 않는다.
- [x] 393px 모바일에서 receipt/action surface/next creature card가 bottom tab과 겹치지 않고 overflow를 만들지 않는다.
- [x] Browser Use iab current-session 시도 evidence 또는 blocker, focused Playwright screenshot, `npm run check:visual`, `npm run check:ci`가 남는다.

## Visual evidence 계획

- Browser Use blocker: `reports/visual/browser-use-blocker-0310-20260503.md` — 현재 세션 iab backend 미발견.
- Screenshot: `reports/visual/issue-310-research-clue-harvest-reveal-393.png`.
- Layout invariant: receipt/action surface/next creature card vs `.bottom-tabs`, no masked overflow.

## Playable mode 영향

- Local dev: `npm run dev -- --host 127.0.0.1 --port 3000`
- Stable main playable mirror는 `npm run play:main` + port 5174 계약 유지.

## 안전 범위

- runtime image generation/API 호출 없음.
- 신규 accepted manifest asset 없음. DOM/CSS reward motion과 HUD affordance만 사용.
- real payment, customer data, external production deployment 없음.

## 검증 명령

- [x] `npm run build` — pass
- [x] `npx playwright test --config playwright.config.ts --grep "연구 단서 수확|단서 생명체"` — 1 passed
- [x] `npx playwright test --config playwright.config.ts --grep "연구 단서 씨앗|연구 단서 성장|연구 단서 수확|단서 생명체"` — 3 passed
- [x] `npm run check:visual` — 58 passed
- [x] `npm run check:ci` — pass
- [x] `npm run update:dashboard` / `npm run operator:control-room -- --output docs/OPERATOR_CONTROL_ROOM.md` — pass
- [x] `npm run check:dashboard` / `npm run check:control-room` / `npm run check:ops-live` / `npm run check:github-metadata` / `npm run check:seed-ops-queue` / `npm run check:closed-workunit-mirrors` — pass
