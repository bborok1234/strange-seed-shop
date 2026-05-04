---
name: studio-deliberate
description: Run a parallel game-studio deliberation pass (Designer / Art Director / Engineer / Senior Critic) on an axis brief. Reads canonical persona + workflow files from docs/studio/, spawns proposals + critiques in parallel, returns artifact paths. Director synthesis stays with the calling main thread. Invoke when the user says "/studio-deliberate <axis-slug>" or asks for a structured cross-team deliberation on a non-trivial axis.
---

# Studio Deliberate — 게임 스튜디오 deliberation 파일럿 어댑터

이 skill은 **하네스 어댑터**다. 게임 스튜디오의 source-of-truth(persona·workflow·spec template)는 모두 `docs/studio/` 안에 있고, 본 skill은 그 파일들을 런타임에 읽어 deliberation 워크플로우를 Claude Code 환경에서 실행한다. 같은 source-of-truth를 다른 하네스(Codex, 수동 사람 운영)도 동일하게 쓸 수 있어야 하므로, **이 SKILL.md 파일에 페르소나 prompt나 워크플로우 정의를 절대 inline 복사하지 않는다.**

## 절대 금지

- `docs/studio/` 또는 `reports/deliberation/` 안의 어떤 결정·spec·persona·워크플로우도 `.claude/`, `.omc/`, `.omx/`, plugin cache 안에 복제하지 않는다. 본 skill 파일조차 그 source-of-truth의 thin wrapper일 뿐이다.
- Director 합성(spec.md 작성)을 skill이 자동 수행하지 않는다. spec.md는 caller(main thread)가 직접 쓴다 — Director 인격이 자동화에 위임되면 deliberation 가치가 사라진다.
- 페르소나 파일이 누락된 채로 deliberation을 진행하지 않는다 — 명시 reject + 사용자에게 누락 파일 명시.
- 사용자 review gate(Phase 5)를 자동으로 통과하지 않는다. spec.md 작성 후 사용자 명시 승인 없이 implementation cycle로 진입 금지.

## 입력

- `<axis-slug>`: filesystem-safe slug (kebab-case 권장). 예: `desktop-ui-redesign`, `mission-ux-visibility`.
- `<brief-md-path>` (optional): 이미 작성된 brief.md 경로. 없으면 caller가 본 skill 호출 전에 `reports/deliberation/<axis-slug>/brief.md`를 작성해야 한다.

## Source-of-truth 의존성

본 skill은 다음 파일을 런타임에 Read로 로드한다. 모두 repo-native, 본 skill 외부에서 단독 사용 가능.

- `docs/studio/DELIBERATION_WORKFLOW.md` — phase 순서·산출물 경로·exit criteria
- `docs/studio/personas/director.md` — Director 인격 (Phase 4 main thread 합성 시 참고)
- `docs/studio/personas/designer.md` — Phase 2/3 spawn
- `docs/studio/personas/art-director.md` — Phase 2/3 spawn
- `docs/studio/personas/engineer.md` — Phase 2/3 spawn
- `docs/studio/personas/senior-critic.md` — Phase 3 spawn (Phase 2 skip)
- `docs/studio/templates/spec.md` — Director 합성 시 사용 (caller 책임)
- `reports/deliberation/<axis-slug>/brief.md` — caller 작성

누락된 파일이 하나라도 있으면 skill은 **즉시 reject**하고 누락 파일 경로를 사용자에게 명시. fallback 텍스트 inline 금지.

## 실행 단계

### 0. 사전 검증

- `<axis-slug>`이 kebab-case인지 확인. 아니면 reject + 권고 slug 제안.
- `reports/deliberation/<axis-slug>/brief.md`가 존재하는지 확인. 없으면 caller에게 brief 작성 요청 + 본 skill 종료.
- `docs/studio/DELIBERATION_WORKFLOW.md`와 5개 persona 파일이 모두 존재하는지 확인. 누락 시 reject.

### 1. 디렉토리 준비

```
mkdir -p reports/deliberation/<axis-slug>/proposals
```

### 2. Heartbeat 진입 마커

`reports/operations/operator-heartbeat-<YYYYMMDD>.jsonl`에 한 줄 append:

```
{"schemaVersion":1,"kind":"operator-heartbeat","timestamp":"<ISO>","actor":"studio-deliberate","phase":"deliberation-phase-2-spawn","axis":"<slug>","status":"running","next_action":"Phase 2 proposals 3-way parallel"}
```

### 3. Phase 2 — 3 specialists 병렬 proposal

3개 `Agent` 호출을 **단일 메시지에 동시** 발화 (Designer / Art Director / Engineer). subagent_type은 `general-purpose`. Senior Critic은 Phase 2를 skip — proposal 생산 안 함.

각 agent 프롬프트의 공통 골격 (DELIBERATION_WORKFLOW.md Phase 2 절을 인용):

```
You are the <Persona Display Name> for the 이상한 씨앗상회 game studio deliberation.
This is a Phase 2 deliberation pass — you write a proposal, in isolation, without seeing other specialists' work.

Read these files in full before writing anything:
1. Your persona file: <absolute path to docs/studio/personas/<role>.md>
2. The axis brief: <absolute path to reports/deliberation/<slug>/brief.md>
3. The deliberation workflow: <absolute path to docs/studio/DELIBERATION_WORKFLOW.md>

Then explore relevant code/assets to ground your proposal (do not modify anything).

Write your proposal to <absolute path to reports/deliberation/<slug>/proposals/<role>.md>
following the structure required by your persona's hand-off contract.

Hard rules:
- DO NOT modify any source code, assets, or other persona files.
- DO NOT read other persona proposals — they do not exist yet, by design. Independence is the point.
- Stay in your persona's lane (see persona file for what you must NOT do).
- Open Questions: at most 5, prioritized by what most blocks the next decision.

Write in Korean (consistent with the game's language).

When done, return a single paragraph (≤ 4 sentences) summarizing your proposal:
which option you favor, the single biggest insight that drove it, and the disagreement you most expect.
```

각 페르소나의 `<Persona Display Name>` / `<role>`는 다음 매핑:
- Designer → `designer`
- Art Director → `art-director`
- Engineer → `engineer`

3 agent가 모두 완료될 때까지 대기. 한 명이라도 fail 시 caller에게 명시 보고 + retry/abort 결정 위임.

### 4. Phase 3 — 4 specialists 병렬 critique

4개 `Agent` 호출을 단일 메시지에 동시 발화 (Designer / Art Director / Engineer / Senior Critic). 각 agent는 본인 페르소나 파일 + brief + 모든 Phase 2 proposal(자기 것 포함)을 Read.

각 agent 프롬프트의 공통 골격 (DELIBERATION_WORKFLOW.md Phase 3 절을 인용):

```
You are the <Persona Display Name> for the 이상한 씨앗상회 game studio deliberation.
This is Phase 3: Cross-Critique Round — you read everyone else's work and challenge it.

Read these files in full:
1. Your persona file: <absolute path to docs/studio/personas/<role>.md>
2. The brief: <absolute path to reports/deliberation/<slug>/brief.md>
3. The deliberation workflow: <absolute path to docs/studio/DELIBERATION_WORKFLOW.md>
4. <Optional, only if you wrote one in Phase 2> Your own proposal: <absolute path to reports/deliberation/<slug>/proposals/<role>.md>
5. Other proposals: <list of absolute paths to other persona proposals>

Write your critique to <absolute path to reports/deliberation/<slug>/critique-<role>.md>
following the structure in DELIBERATION_WORKFLOW.md Phase 3 (disagreements per other proposal,
self-critique, cross-cutting risks, concessions).

Hard rules:
- DO NOT modify your own proposal — Phase 2 is frozen evidence.
- DO NOT propose new options — your dissent and concessions are the artifact, not a counter-proposal.
- DO be specific — quote exact lines or phrases from other proposals when disagreeing.
- DO challenge from your persona's domain. Senior Critic, you challenge ALL proposals + the brief.
- Write in Korean.

When done, return a single paragraph (≤ 4 sentences) summarizing:
your sharpest disagreement, your honest self-critique, and the trade-off the Director will face.
```

Senior Critic의 프롬프트는 약간 다름 — Phase 2 proposal이 없으므로 (4) line 생략, 그리고 critique 구조에 "Hidden assumptions per proposal" / "Premature consensus risks" / "Inertia justifications" / "Brief-level challenges" / "Director, do not skip these" 섹션을 명시 (DELIBERATION_WORKFLOW.md Phase 3 + senior-critic.md hand-off contract).

4 agent가 모두 완료될 때까지 대기.

### 5. Phase 3 종료 + 산출물 보고

caller에게 다음을 명시:

- 작성된 artifact 경로 5종 (proposals 3 + critiques 4):
  - `reports/deliberation/<slug>/proposals/{designer,art-director,engineer}.md`
  - `reports/deliberation/<slug>/critique-{designer,art-director,engineer,senior-critic}.md`
- 각 agent가 return한 1-paragraph summary 4종 (Phase 2) + 4종 (Phase 3) — Director가 합성 진입 전 빠르게 충돌 지점 파악용.
- 다음 단계 안내: "Director synthesis는 main thread 책임. `docs/studio/templates/spec.md` 템플릿 + 모든 artifact를 읽고 `reports/deliberation/<slug>/spec.md` 작성. § Decisions Resolved 섹션 비면 deliberation 미완."

### 6. Heartbeat 종료 마커

```
{"schemaVersion":1,"kind":"operator-heartbeat","timestamp":"<ISO>","actor":"studio-deliberate","phase":"deliberation-phase-3-complete","axis":"<slug>","status":"idle","next_action":"Director synthesis (main thread) → user review gate"}
```

skill 종료. Phase 4/5/6은 본 skill 외부 — 절대 자동 진행 금지.

## 주의사항

### 페르소나 prompt 진화

페르소나 파일이 retrospective 경험에 따라 업데이트되면(예: Engineer에 "cost-only 결론 박지 말라" 명시), 본 skill은 **변경 없이** 새 행동을 자동 흡수한다 — 런타임 Read이기 때문. 페르소나 명시 추가/삭제 시 본 skill 코드 수정 불필요.

### 새 페르소나 추가 (예: QA, PM)

`docs/studio/personas/<new-role>.md` 추가 후 본 skill의 Phase 2/3 spawn 리스트만 업데이트. 페르소나 추가 정책은 `docs/studio/DELIBERATION_WORKFLOW.md`에서 결정.

### Codex / 다른 하네스로 이식

본 skill을 Codex CLI 또는 다른 runtime으로 이식할 때, source-of-truth(`docs/studio/*`, `reports/deliberation/*`)는 그대로 두고 spawn 메커니즘만 다시 구현한다. 페르소나·워크플로우·spec template를 절대 복제하지 말 것 — `feedback_harness_neutral_source_of_truth` 메모리 위반.

### 비-trivial axis 판정

본 skill은 비-trivial axis(≥ 1 PR 가치, UX 영향, 결정에 disagreement 가능성)에만 사용. 한 줄 bug fix·typo 정정 같은 axis에는 본 skill 호출 금지 — 4 agent + 4 critique = ~600K token 비용은 그런 작업에 정당화 안 됨.

## 검증 체크리스트 (skill 작성자용)

- [ ] 본 SKILL.md 파일 어디에도 페르소나 prompt body가 inline되어 있지 않다.
- [ ] 본 SKILL.md 파일 어디에도 워크플로우 정의(phase 순서·산출물 구조)가 inline되어 있지 않다 — `docs/studio/DELIBERATION_WORKFLOW.md`를 참조하라고만 한다.
- [ ] spec.md 작성을 skill이 자동 수행하지 않는다.
- [ ] 사용자 review gate를 자동 통과하지 않는다.
- [ ] heartbeat 마커는 `.omc/`나 다른 plugin path가 아니라 repo-native `reports/operations/`에 작성한다.
- [ ] 누락된 source-of-truth 파일 시 명시 reject한다 — fallback inline text로 도망가지 않는다.
- [ ] axis-slug 검증 + 디렉토리 생성 + heartbeat enter/exit 자동 처리한다.

## 향후 진화 (Phase c)

- Director를 별도 agent로 spawn하는 옵션 추가 (현재는 main thread 전담). 그 경우 `docs/studio/personas/director.md`가 실 사용됨.
- KPI / veto domain / seniority가 페르소나 파일에 추가되면 본 skill의 critique round 구조가 veto-handling 단계를 추가할 수 있음 (DELIBERATION_WORKFLOW.md Phase c 업데이트 시 본 skill도 업데이트).
- skill 호출이 3+ axis에서 안정적으로 검증되면 `.claude/agents/<role>.md` thin shim(≤ 20줄, `docs/studio/personas/<role>.md` 참조만)을 추가하여 다른 skill에서 재사용 가능.
