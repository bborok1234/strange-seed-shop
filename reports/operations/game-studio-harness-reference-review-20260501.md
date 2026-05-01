# Game Studio Harness Reference Review

Status: active
Owner: agent
Date: 2026-05-01
Scope: `$seed-ops` 운영 하네스, P0.5 Idle Core + Creative Rescue

## 문제

최근 `$seed-ops`는 issue -> PR -> merge loop 자체는 수행했지만, 게임사 운영처럼 기획, 리서치, 아트, 개발, 검수, 마케팅, 고객지원 관점이 서로 검토하는 구조로 동작하지 않았다. 그 결과 `P0.5 Idle Core + Creative Rescue`가 상위 campaign source of truth인데도 직전 issue 옆의 작은 기능을 다음 후보로 고르는 단편 loop가 반복됐다.

## 참고한 레퍼런스

- ClawSweeper: `openclaw/clawsweeper`는 review lane과 apply lane을 분리하고, durable report를 source of truth로 삼고, apply 전에 snapshot drift와 권한/상태를 다시 확인한다.
- Anthropic Skills: skill은 self-contained `SKILL.md`와 resources/scripts를 묶어 specialized task를 반복 가능하게 만든다.
- Superpowers: brainstorming -> plan -> subagent-driven-development -> review -> finish workflow를 mandatory workflow로 다룬다.
- GSD: context rot를 줄이기 위해 phase discussion, research, plan, wave execution, verification을 산출물 단위로 분리한다.
- gstack: CEO, designer, engineering manager, QA, release 같은 역할을 명시하고, 병렬 sprint는 process가 있을 때만 안전하다고 본다.
- Matt Pocock skills: alignment, shared language, feedback loop, architecture care가 agent failure mode를 줄인다.
- gastory: project 단위 art-concept state, gpt-image-2 concept art, reference image consistency, prompt/model sidecar, animation camera/composition lock, frame/GIF/spritesheet extraction을 asset bundle 단위로 관리한다.

## 추출한 운영 원칙

1. Campaign이 먼저고 issue는 campaign의 하위 산출물이다.
2. Review lane과 apply lane은 분리한다. 부서별 검토 없이 구현 lane으로 넘어가지 않는다.
3. Durable report와 plan artifact가 source of truth다. 상황판에 다음 후보만 적는 것은 continuation이 아니다.
4. Subagent/team은 아무 때나 쓰는 병렬화가 아니라 역할별 독립 산출물이 있을 때 사용한다.
5. Asset/FX 작업은 이미지 한 장 생성이 아니라 style state, prompt/model provenance, manifest, animation plan, small-size QA, Browser Use evidence까지 하나의 bundle로 검수한다.
6. P0.5는 기능 completion이 아니라 첫 5분 production vertical slice의 게임성/시각/연출 완성도 기준으로 닫는다.

## Seed Ops에 반영할 새 gate

### Studio Campaign Gate

새 게임 issue를 고르기 전에 현재 active campaign을 고정한다. 지금 active campaign은 `P0.5 Idle Core + Creative Rescue`다. 다음 issue가 이 campaign의 완수 기준과 연결되지 않으면 고르지 않는다.

필수 산출물:

- campaign source of truth
- reference teardown
- creative brief
- Game Studio Department Signoff
- candidate issue list
- subagent/team routing decision
- QA/playtest plan

### Game Studio Department Signoff

각 implementation issue plan은 아래 부서 중 관련 부서의 signoff를 남긴다.

| 부서 | 책임 | 필수 산출물 |
| --- | --- | --- |
| 기획팀 | player verb, core loop, reward timing | player value, production/progression role |
| 리서치팀 | 경쟁작 production gap, 레퍼런스 근거 | reference teardown, 비교 기준 |
| 아트팀 | visual target, style consistency, asset/FX plan | art direction, gpt-image-2 default/fallback, manifest plan |
| 개발팀 | runtime architecture, save/economy boundaries | implementation tranche, touched files, rollback boundary |
| 검수팀 | Browser Use, visual QA, regression | playtest evidence, screenshot/report/checks |
| 마케팅팀 | pitch/devlog/release note mock value | player-facing promise, no real channel action |
| 고객지원팀 | confusion/support risk | known player confusion, FAQ/support note |

### Role-Debate Note

서로 충돌하는 관점이 있으면 issue plan에 `role-debate note`를 남긴다. 예: 아트팀은 신규 raster asset을 요구하지만 개발팀은 scope를 줄이고 싶을 때, 최종 선택과 거절한 대안을 기록한다.

### Subagent/Team Routing

`$seed-ops`는 다음 경우 Codex native subagents 또는 team mode를 사용해야 한다.

- 리서치/로컬 감사/QA가 구현과 독립적으로 병렬 진행 가능할 때
- 아트 계획과 runtime 구현의 write scope가 분리될 때
- 검수팀이 구현 후가 아니라 구현 중 병렬로 회귀 기준을 준비할 수 있을 때

사용하지 않는 경우도 plan에 이유를 적는다. 예: 단일 문서 gate 수정처럼 병렬화 비용이 더 큰 작업.

## P0.5 완수 기준

`P0.5 Idle Core + Creative Rescue`는 아래가 모두 충족되어야 닫는다.

- 첫 5분 loop가 심기, 성장 가속, 수확/발견, 자동 생산, 보상 사용, 다음 목표로 이어진다.
- 정원 화면에서 생산 주체, 생산량, 주문/납품, 다음 보상, 오프라인 복귀 hook이 즉시 읽힌다.
- 핵심 seed/creature/FX/order/facility asset은 accepted manifest raster asset이고, SVG/vector/code-native accepted game graphics가 없다.
- asset work는 gpt-image-2 default, Codex native fallback, style/provenance/animation evidence를 남긴다.
- Browser Use `iab` 또는 현재 세션 blocker와 visual regression evidence가 각 visible gameplay PR에 남는다.
- QA/CS 관점에서 첫 5분 혼란, 잘림, 하단 탭 overlap, static FX artifact 같은 known support risk가 닫혔거나 follow-up으로 남는다.

## 다음 운영 결정

다음 `$seed-ops`의 첫 작업은 좁은 gameplay issue가 아니라 `items/0129-game-studio-ops-harness.md`의 studio campaign pass다. 이 pass가 P0.5 campaign source of truth와 부서별 signoff 형식을 만든 뒤에만 하위 구현 issue를 선택한다.
