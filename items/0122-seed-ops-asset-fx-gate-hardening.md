# Seed ops asset/FX gate hardening

Status: completed
Work type: agent_ops
Owner: agent
Created: 2026-05-01
Updated: 2026-05-01
Scope-risk: moderate
Issue: #238
PR: TBD
Branch: `codex/0122-seed-ops-asset-fx-gate-hardening`

## Intent

`$seed-ops`가 다음 게임 issue를 고를 때 asset/FX/playfield/HUD/경쟁작 production gap을 실제 queue에 반영하지 않고 “기능 하나 더”로 흐르는 문제를 하네스 수준에서 막는다.

## Context

- 이전 gate는 `asset/FX 또는 sprite-animation decision` 같은 문구 존재만 확인했다.
- `기존 asset 활용 계획`도 asset 축으로 통과할 수 있어, 새 시각 표면이나 game-feel payoff가 없어도 plan이 완성된 것처럼 보일 수 있었다.
- 사용자가 지적한 실패 모드는 “운영 gate는 강화했다고 했는데 실제 선택은 계속 기능 구현만 한다”이다.
- 참고한 외부 레퍼런스는 Gastory, Anthropic Skills, Karpathy-style guidelines, Superpowers, gstack, GSD, Matt Pocock skills다. 공통점은 workflow를 조언으로 두지 않고 command/skill/check/evidence로 나눈다는 점이다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route: N/A — 게임 런타임 UI/asset을 직접 바꾸지 않는 agent_ops 하네스 보강이다.
- 북극성/플레이어 동사: 후속 게임 issue가 player verb, production/progression role, screen moment, concrete asset/FX payoff, playtest evidence 중 최소 3개를 실제 plan에 남기게 한다.
- Playfield 보호 또는 UI surface 원칙: 새 게임 issue의 asset/FX 축은 `playfield state`, `HUD affordance`, `sprite/FX`, `order crate visual state`, `reward motion` 중 하나 이상을 명시해야 한다.
- Playtest evidence 계획: 이 작업 자체는 docs/scripts-only라 Browser Use N/A. 후속 UI/visual/game issue에서는 Browser Use 우선 QA가 기존 규칙대로 필수다.

## Plan

1. 외부 skill/ops 레퍼런스를 읽고 우리 하네스에 반영할 원칙을 report로 남긴다.
2. `$seed-ops`, `docs/PROJECT_COMMANDS.md`, `AGENTS.md`, control room/roadmap의 다음 queue gate를 “기존 asset 재사용만으로는 통과하지 않음”으로 강화한다.
3. `scripts/check-seed-ops-queue-gate.mjs`를 추가해 문서/상황판/운영 스크립트가 같은 gate 문구를 유지하는지 검증한다.
4. 기존 `check:ops-live`, `check:project-commands`, `check:ci`에 새 gate를 연결한다.
5. roadmap/dashboard/control room/heartbeat를 갱신하고 로컬 검증, PR, CI까지 확인한다.

## Acceptance

- [x] 다음 게임 issue 후보의 `asset/FX` 축은 기존 asset 재사용만으로 통과하지 않는다.
- [x] asset/FX 축은 `playfield state`, `HUD affordance`, `sprite/FX`, `order crate visual state`, `reward motion` 중 최소 하나의 concrete visual/game-feel payoff를 요구한다.
- [x] 단순 주문 추가, copy tweak, spacing tweak, test-only 작업은 해당 visual payoff와 경쟁작 production gap이 없으면 queue gate에서 실패한다고 문서화된다.
- [x] `npm run check:seed-ops-queue`가 새 gate drift를 검증한다.
- [x] `npm run check:ci`가 새 gate를 포함해 통과한다.

## Verification

- `npm run check:seed-ops-queue`: PASS
- `npm run check:project-commands`: PASS
- `npm run check:ops-live`: PASS
- `npm run check:dashboard`: PASS
- `npm run check:ci`: PASS

## Safety

- 게임 런타임 변경 없음.
- 신규 asset 생성 없음.
- runtime image generation 없음.
- 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음.
- Branch protection 우회 없음.

## Risks

- 이 작업은 “다음 선택 gate”를 강화한다. 실제 다음 게임 issue에서 Browser Use 실기 QA와 visual evidence를 다시 수행해야 한다.
