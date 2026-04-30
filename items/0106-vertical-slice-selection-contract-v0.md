# Vertical slice selection contract v0

Status: completed
Branch: `codex/vertical-slice-selection-contract`
Issue: #192

## Context

#159는 #142 North Star production bar 완료 상태를 동기화하면서 `$seed-ops`가 이미 닫힌 문서 정렬을 다시 고르지 않고 다음 production vertical slice로 넘어가야 한다는 목적을 남겼다. 하지만 `AGENTS.md`, `$seed-ops`, `docs/PROJECT_COMMANDS.md`, `docs/ROADMAP.md`에는 여전히 "safe next issue", "작은 기능", "작은 vertical slice" 표현이 남아 있어 에이전트가 경쟁작 기준 production loop보다 안전한 micro-improvement를 고르기 쉽다.

## Game Studio route

- `game-studio:game-studio`: 다음 issue 선택 기준을 player verb, production/progression role, screen moment, asset/FX, playtest evidence로 재정렬한다.
- Specialist route: N/A. 런타임 UI/에셋 변경이 아니라 운영 source-of-truth 보정이다.

## Plan

1. `AGENTS.md`의 continuation/next action 언어를 "safe local issue"에서 "North Star vertical slice candidate"로 바꾼다.
2. `$seed-ops`와 `docs/PROJECT_COMMANDS.md`에 다음 issue 선택 scoring gate를 추가한다.
3. `docs/ROADMAP.md`의 Current Next Action을 복귀 micro-improvement queue가 아니라 production idle loop gap scan으로 갱신한다.
4. 운영 runbook/dashboard 안내가 다음 issue를 "안전한 작은 작업"으로 부르지 않도록 보정한다.
5. 문서 checker와 CI를 실행한다.

## Acceptance

- [x] 다음 issue 선택 전 `docs/NORTH_STAR.md` production bar와 `docs/IDLE_CORE_CREATIVE_GUIDE.md` vertical slice workflow를 반드시 참조한다.
- [x] "safe next issue"는 stop/safety gate 의미로만 남고, 우선순위 기준으로는 쓰이지 않는다.
- [x] 새 issue 후보는 `player verb + production/progression role + screen moment + asset/FX + playtest evidence` 중 최소 3개를 명시해야 한다.
- [x] 작은 기능 개선은 vertical slice blocker를 제거하거나 명확한 slice 일부일 때만 선택한다는 규칙이 운영 문서에 반복된다.
- [x] `npm run check:docs`, `npm run check:project-commands`, `npm run check:operator`, `npm run check:ci`가 통과한다.

## Verification

- [x] `rg -n "safe next|next safe|안전한 다음|safe queue|safe small|작은 기능 개선|새 small win" AGENTS.md docs .codex/skills items/0106-vertical-slice-selection-contract-v0.md`
- [x] `npm run update:dashboard`
- [x] `npm run check:docs`
- [x] `npm run check:project-commands`
- [x] `npm run check:operator`
- [x] `npm run check:ci`

## Risks

- 문서만 강해지고 실제 자동 선택 로직은 여전히 느슨할 수 있다. 후속으로 issue template/checker가 vertical slice fields를 강제하게 만들 수 있다.
