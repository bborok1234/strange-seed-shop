# Autonomous Project Operating Model

## 1. Intent

This project is both a game and an agent-management experiment. The long-term goal is a repository that can move toward a defined destination with minimal human intervention, while keeping evidence, safety, and reversible decisions visible. The shared destination is defined in `docs/NORTH_STAR.md`.

The model is inspired by ClawSweeper's structure: a conservative automation system that reviews items, writes durable reports, applies only high-confidence actions, maintains dashboards, and audits drift.

Reference observed from `openclaw/clawsweeper`:

- It keeps one markdown report per open issue or PR.
- Review is proposal-only.
- Apply mutates GitHub only when stored review evidence remains valid.
- Maintainer-authored/protected items are guarded.
- Dashboard and audit health make the system inspectable.
- Scheduled lanes run at different cadences for hot, daily, and weekly work.

## 1.1 Two-Project Boundary

현재 한 레포에는 두 프로젝트가 함께 있다.

1. `이상한 씨앗상회`: 귀엽고 중독성 있는 생명체 수집 idle game
2. 에이전트 네이티브 게임 스튜디오/운영사: 게임을 스스로 개발, 검증, 운영, GTM 보조까지 수행하는 agent operating layer

운영사 프로젝트는 게임 프로젝트의 도구이자 장기적으로 별도 제품/레포가 될 수 있다. 따라서 자동화 작업은 단순히 현재 게임 코드를 고치는 것을 넘어, issue intake, queue, watchdog, CI repair, evidence ledger, feedback/GTM intake 같은 운영 능력을 축적해야 한다.

분리 전까지 `docs/NORTH_STAR.md`가 두 프로젝트의 공통 헌장이고, 이 문서는 운영사 쪽 실행 모델을 구체화한다.

## 2. Core Principle

Agents should not be trusted because they are autonomous. They should be trusted because their work is:

- scoped
- reviewable
- evidence-backed
- reversible
- cadence-controlled
- audited

## 3. Repository Operating Surfaces

The project should eventually maintain these directories:

```text
docs/
  PRD_PHASE0.md
  ECONOMY_PHASE0.md
  AUTONOMOUS_PROJECT_OPERATING_MODEL.md

items/
  <id>.md                  # open work records

closed/
  <id>.md                  # completed/rejected/stale records

reports/
  reviews/
  audits/
  playtests/
  economy-sims/

config/
  seeds.json
  creatures.json
  growth_curves.json
  rewards.json
  missions.json
  shop_surfaces.json

public/assets/
  game/
  manifest/assetManifest.json
```

## 4. Work Item Format

Every autonomous task should become a markdown work item before implementation.

Required fields:

```markdown
# <short title>

Status: open | proposed | in_progress | blocked | verified | closed
Owner: agent | human | mixed
Created: YYYY-MM-DD
Updated: YYYY-MM-DD
Scope-risk: narrow | moderate | broad

## Intent
Why this work exists.

## Acceptance Criteria
- Concrete testable criterion

## Evidence
- Links to docs, logs, screenshots, tests, reports

## Proposed Plan
- Steps

## Apply Conditions
Conditions that must remain true before mutation.

## Verification
What proves completion.
```


## 4.1 Operator Work Item Taxonomy

Ralph-session 운영사 v0부터 work item은 제품 작업과 운영사 작업을 분리해 기록한다. `Work type:` 필드는 다음 값 중 하나를 사용한다.

| Work type | 의미 | 예시 |
| --- | --- | --- |
| `game_feature` | 플레이어가 직접 경험하는 게임 기능 | 씨앗/수확/도감/원정 개선 |
| `game_content` | 데이터/에셋/밸런스/문구 | seed config, sprite batch, creature flavor |
| `agent_ops` | 에이전트 운영사 능력 | heartbeat ledger, stuck report, CI repair loop |
| `feedback` | 플레이테스트/고객 신호 intake | playtest report, confusion score |
| `gtm_mock` | 승인 전 GTM 초안 | devlog draft, release note draft |
| `safety_gate` | 금지/승인/권한 경계 | payment gate, credential policy |

운영사 작업은 게임을 직접 더 재미있게 만들지 않더라도, 에이전트가 안전하게 더 오래 일하게 만들면 북극성에 기여한다. 단, 실제 고객 데이터, credential, 실채널 GTM, 결제/로그인/광고 SDK는 work type과 무관하게 명시 승인 전 적용 lane에 들어갈 수 없다.

## 4.2 Ralph-session 운영사 v0 evidence loop

Milestone 6의 최소 루프는 아래 순서를 따른다.

```text
issue -> branch -> work item -> heartbeat ledger -> implementation -> local verification -> PR -> GitHub checks -> follow-up evidence
```

### heartbeat ledger

Ralph 세션은 iteration마다 `.omx/state/operator-heartbeat.json`를 최신 상태로 쓰고, 공유 가능한 증거는 `reports/operations/operator-heartbeat-YYYYMMDD.jsonl`에 누적한다. heartbeat에는 timestamp, phase, branch, issue, PR, current command, next action이 포함되어야 한다.

### stuck report

`collab: Wait`, stale tmux, orphan process, timeout, red CI가 감지되면 완료 선언 대신 stuck report를 남긴다. stuck report는 `reports/operations/stuck-*.md`에 reason, phase, current command, last heartbeat, recovery next action을 적는다.

### CI repair loop

PR이 red check 상태면 verify lane은 실패 job을 읽고, 로컬 재현을 시도하고, fix commit을 만들고, checks를 다시 확인한다. 3회 이상 반복되거나 credential/권한/외부 서비스가 필요하면 blocker report로 전환한다.

### watchdog runner

Milestone 7부터 watchdog runner는 heartbeat ledger를 읽어 `fresh`, `stale`, `missing`, `invalid` 상태를 판정한다. v0 runner는 deterministic `--now` 입력을 지원해 CI에서 장시간 대기 없이 freshness 판정을 검증한다. 실제 재시작은 별도 승인된 supervised trial에서만 수행하고, 기본 동작은 report 생성과 안전한 중단이다.

### supervised trial report

다시간 trial은 시작 전에 report template을 만들고, heartbeat coverage, completed work, failures, recovery attempts, CI status, stop rules, next queue를 기록한다. 2h/4h/24h trial은 credential, 외부 배포, 고객 데이터, 실채널 GTM 없이 dry-run 범위에서만 시작한다.

## 5. Lanes

### Intake Lane

Turns ideas, bugs, playtest notes, and user requests into normalized work items.

It may:

- create `items/<id>.md`
- classify priority
- detect duplicates
- link source docs

It may not:

- modify product code
- close tasks
- change economy values without review

### Review Lane

Proposal-only. Similar to ClawSweeper's review lane.

It may:

- inspect code/docs/config
- propose implementation steps
- propose close/reject/merge decisions
- write reports under `reports/reviews/`

It may not:

- mutate product code
- apply decisions directly
- bypass acceptance criteria

### Apply Lane

Mutation lane. It can edit code/config/docs only when a stored proposal is still valid.

Before applying, it must check:

- work item still open
- relevant files changed since review?
- acceptance criteria still valid?
- proposal scope still narrow enough?
- human-protected areas touched?

### Verify Lane

Runs tests, visual checks, economy sims, and acceptance reviews.

It must:

- produce evidence
- mark pass/fail
- open follow-up items for failures

### Audit Lane

Compares repo state with work records.

It checks:

- open work without reports
- reports without work items
- stale in-progress items
- implemented code without docs
- config missing schema validation
- assets missing manifest entries
- acceptance criteria without tests

## 6. Cadence

Suggested local cadence once automation exists:

| Lane | Cadence | Purpose |
| --- | --- | --- |
| Intake | on demand | normalize new requests |
| Review | daily or per milestone | propose next work |
| Apply | after review approval | mutate repo |
| Verify | after every apply | prove completion |
| Audit | daily during active build, weekly later | detect drift |
| Dashboard | after verify/audit | summarize state |

## 7. Dashboard Contract

Future `README.md` or `docs/DASHBOARD.md` should include:

- Current milestone
- Open work count
- Blocked work count
- Last verification status
- Last economy simulation status
- Asset pipeline status
- Phase 0 acceptance progress
- Next recommended task

## 8. Human Intervention Boundaries

Agents can proceed without asking for:

- creating work items
- updating docs
- adding tests
- implementing accepted narrow tasks
- generating non-final preview assets
- running local verification

Agents must stop or request explicit approval for:

- real payment integration
- external deployment
- public release
- credential use
- destructive data migration
- policy-sensitive monetization changes
- irreversible deletion
- production user data handling

## 9. Game-Specific Autonomous Gates

### Product Gate

No implementation starts unless a PRD section and acceptance criteria exist.

### Economy Gate

No economy value change is accepted unless:

- source/sink impact is described
- 1h/D1/D3/D7 impact is estimated
- tuning lever is identified

### Asset Gate

No asset ships unless:

- it exists in `assetManifest.json`
- it passes visual QA
- it has stable filename and id
- it has no runtime generation dependency

### Monetization Gate

No monetization surface ships unless:

- it is mock-only or payment-reviewed
- it has clear user-facing value
- it avoids hidden odds or misleading urgency
- analytics event exists

## 10. Near-Term Implementation Path

1. Create Phase 0 PRD and economy contract.
2. Create game asset generation skills.
3. Generate first 20 static sample assets.
4. Create config schemas.
5. Build local-only MVP.
6. Add economy simulator.
7. Add verification dashboard.
8. Add work item intake/review/apply scaffolding.
9. Move toward ClawSweeper-style scheduled agent maintenance.
10. Build Ralph-session reliability before claiming overnight or 24-hour autonomy.
11. Add feedback/GTM intake only behind explicit privacy, credential, and brand-safety gates.

## 11. Definition of Autonomous Enough

This project reaches the first autonomous-management milestone when an agent can:

- read the dashboard
- select the next open item
- inspect linked docs
- propose a plan
- apply a narrow change
- run verification
- update the work item
- create follow-up items for failures

without needing the human to restate project context.
