---
name: studio-operate
description: Studio Harness v3 in-session operator pass. Pick the next GitHub-authoritative WorkUnit, plan-first, implement, run focused checks, open/refresh PR, watch checks, merge when green, observe main CI, and continue. Invoke when the user says "continue the operator", "run a studio operate pass", or "/studio-operate". Use /loop or /schedule to make it recurring.
---

# Studio Harness v3 — in-session operator (이상한 씨앗상회 AI 네이티브 게임 운영사)

이 스킬은 한 번 호출되면 **WorkUnit 한 패스**를 끝까지 돌린다 (plan → implement → checks → PR → merge when green → 다음 패스 안내). 24h supervised loop은 사용자 측 `/loop 5m /studio-operate` 또는 `/schedule`로 처리한다.

## 1차 목표

- AI 네이티브 게임 운영사를 만든다.
- 그 운영사가 24시간급 루프로 이상한 씨앗상회를 production game quality까지 밀어 올린다.
- 피상적인 작은 issue 처리로 샛길을 만들지 말고, GitHub-authoritative WorkUnit/GateEvent/PR/CI evidence로 실제 게임 품질과 하네스 품질을 전진시킨다.

## 절대 금지

- `$seed-ops`를 v3 entrypoint로 호출하거나 안내하지 않는다. `$seed-ops`는 v3 하네스의 대체 대상인 과거 프롬프트 표면이다.
- local campaign ledger, `.omx` prompt-side state, assistant summary만으로 work authorization 또는 live runner 상태를 주장하지 않는다.

## 운영 source of truth

- GitHub issue/PR/GateEvent/check/merge state가 operational truth다.
- local docs/items/reports는 mirror/evidence다.
- Routine git/GitHub actions(issue/PR/comment body-file publication, branch push, checks watch, merge when green)는 agent responsibility다. credential/tool/destructive/external-production/payment/customer-data boundary가 아니면 사람에게 일반 git/GitHub 명령을 떠넘기지 않는다.

## 작업 루프 (한 패스)

1. `docs/STUDIO_HARNESS_V3_AUTONOMOUS_DESIGN.md`, `docs/STUDIO_HARNESS_V3_RUNNER_USAGE.md`, `docs/NORTH_STAR.md`, `docs/IDLE_CORE_CREATIVE_GUIDE.md`를 빠르게 확인한다.
2. `npm run studio:v3:runner -- --once --dry-run`으로 GitHub queue/PR/CI snapshot과 next action을 확인한다.
3. GitHub issue queue에서 합법 WorkUnit을 선택한다. 없으면 queue empty를 종료가 아니라 production game quality Intake WorkUnit 생성으로 처리한다.
4. 구현 전 `items/<id>.md` 또는 동등 plan artifact에 `## Plan`, 수용 기준, 검증 명령, 리스크, Game Studio route(visible gameplay일 때), Subagent/Team Routing을 작성한다.
5. branch를 만들고 scope 안에서 구현한다.
6. visible gameplay/HUD/playfield/assets/QA는 Game Studio route를 먼저 고정하고 Browser Use iab를 우선 사용한다. Codex CLI에서 Browser Use가 안 보이면 node_repl MCP js readiness를 확인하고 현재 세션 blocker를 `reports/visual/`에 기록한다. Playwright는 반복 regression gate이지 Browser Use hands-on QA 대체재가 아니다.
7. focused checks → 필요한 full checks → PR body-file 작성 → branch push → PR create/update → GitHub checks watch/repair → merge when green → main CI observation을 수행한다.
8. Release/Retro/daily report/merge/queue empty는 checkpoint일 뿐 종료 사유가 아니다. 한 패스의 자연스러운 끝에서 다음 GitHub WorkUnit을 plan-first로 짚어 commentary checkpoint와 plan artifact를 남기고 사용자에게 다음 행동을 제안한다.

## 패스 종료 조건

이 패스를 닫는 자연스러운 시점은 다음 중 하나에 도달했을 때다 — 무리해서 다음 WorkUnit으로 넘어가지 말고 깔끔히 닫고 사용자에게 다음 패스를 제안한다.

- merge가 main에 들어가고 main CI가 안정적으로 관측됨
- PR이 review-blocked / 외부 신호 대기 상태 (사람 review 필요)
- 명확한 blocker (테스트 결정 못 함, design 결정 필요, 외부 시스템 outage)
- destructive/credential/payment/external-production/customer-data boundary
- `npm run studio:v3:runner -- --once --dry-run`이 다음 actionable WorkUnit이 없다고 보고하고 신규 Intake도 작성 완료
- 사용자 stop/close/interrupt/cancel

각 종료 조건에 대해 `reports/operations/` 또는 commentary로 짧게 마지막 상태와 다음 권장 패스 instruction을 남긴다.

## 반복 운영 패턴

- **수동 한 패스**: `/studio-operate`
- **세션 내 자동 반복**: `/loop 5m /studio-operate` (Claude Code 세션이 열려있는 동안만 동작)
- **cron 기반 unattended**: `/schedule`로 routine 등록 (remote agent로 실행됨)

## Codex 분리

Codex 기반 24h 헤드리스 supervisor는 별도 도구다 — `npm run studio:v3:operate -- --backend codex`(또는 `omx`)는 codex 한도가 남아 있을 때만 사용한다. 이 스킬은 그 script에 의존하지 않으며, 같은 GitHub-authoritative 작업 루프를 in-session으로 실행하는 native 경로다.
