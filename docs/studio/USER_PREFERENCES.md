# User Preferences — Game Studio Workflow

이 문서는 사용자(`limmir88@gmail.com`, product owner of `이상한 씨앗상회`)의 협업 선호도와 deliberation/implementation에 대한 **harness-neutral** 가이드. Claude Code 메모리(`~/.claude/projects/.../memory/`)와 동일 내용을 repo-native로 mirror — Codex / 다른 runtime도 같은 preferences로 작업.

**원칙: 이 파일이 source of truth. 새 preferences가 도출되면 여기 먼저 추가, 그 다음 Claude Code 메모리에 동기화.**

---

## P1 — Layout/composition > micro-polish

큰 골격(layout, composition, art-share, hierarchy) 결정이 작은 polish(receipt, indicator, motion, milestone count)보다 항상 우선. polish-only sessions에 push back.

**Why:** 22 studio-operate 패스에서 모든 PR이 polish였고 layout은 한 번도 axis로 안 잡힘. 사용자: "기획팀과 아트팀의 수준이 너무 낮다."

**How to apply:**
- 작업 axis 선택 시: layout/composition 옵션이 있으면 먼저.
- studio-operate / autonomous 루프가 polish slice만 픽업하면 명시 challenge.
- 화면 layout가 안 잡힌 상태에서는 그 화면의 polish PR 시작 금지.

---

## P2 — Specialist 4명 critique > linear path

작업을 single-agent linear pipeline(intake→implement→PR→merge)로 돌리지 말고 **deliberation(parallel proposal + cross-critique)**로 진행. specialist 4명(Designer / Art Director / Engineer / Senior Critic)이 spec을 합의한 후에만 implementation.

**Why:** 단일 operator가 모든 역할을 wear하면 quality calibration 0건. 22 polish PR 누적 후 사용자: "현재는 그저 path 구조로 되어있는게 문제."

**How to apply:**
- 사소한 수정 외 모든 axis는 `docs/studio/DELIBERATION_WORKFLOW.md` 따름.
- Designer/Art Director/Engineer는 Phase 2에서 병렬 proposal 작성, Senior Critic은 Phase 3에서 challenge-only critique.
- Director(main thread)는 합의 종결 + spec.md 작성. **자동 합의 회피 — disagreement 명시 필수.**

---

## P3 — Harness-neutral source of truth (CRITICAL)

게임 스튜디오의 모든 source-of-truth (specs, personas, workflow, plans, decisions, user preferences)는 **repo-native paths** (`docs/`, `reports/`, `items/`)에만 저장. **`.claude/`, `.omc/`, `.omx/` 등 tool-state directories에 절대 game studio 자산 저장 금지.**

**Why:** 사용자: "공용의 source of truth와 게임사 구조를 만들고 있는데 .omc, .omx 등에 특화된 방식으로는 설계하지 말라." Tool churn(OMC version bumps, Codex CLI changes 등) 빈번 — 게임 스튜디오는 long-lived, tools는 short-lived.

**How to apply:**
- 새 spec/plan/persona/preference 작성 시: 경로가 `.claude/.omc/.omx`로 시작? → 즉시 repo-native 경로로 이동.
- Skill / tool / script은 **adapter** — repo-native 자산 읽어서 실행만. 자산 자체를 tool-state에 복제 금지.
- `.claude/agents/*.md` 는 thin shim ≤ 20줄, canonical은 `docs/studio/personas/<role>.md`.
- Codex / 다른 runtime도 동일 source-of-truth 사용 가능해야 함.

---

## P4 — Implementation needs critique gate (NEW from 2026-05-05)

sharp spec.md만으로 implementation 자동 enforcement 안 됨. 매 visible-gameplay PR 후 **Art Director critique pass 필수** + 사용자 명시 visual approval 없이 "Cycle complete" 자체 선언 금지. CI snapshot test는 회귀만 잡지 spec promise 검증 안 함.

**Why:** Cycle 1 (`desktop-ui-redesign`) 5 PR이 모두 CI green + checklist 100% 통과했으나 사용자 시각 검증 fail. Cycle A에서도 PR4까지 art-share-gate 9/9 PASS였으나 새 사용자 critique으로 measurement gap(plot card가 dev-panel에 가려짐) 발견.

**How to apply:**
- 모든 visible-gameplay PR 머지 후 즉시 playwright snapshot 캡처 + Art Director critique agent spawn.
- 자동 gate 측정값 PASS여도 **screenshot review가 final guard**. 측정값 single-trust 금지.
- Director(main thread)는 PR 머지 책임만, Cycle complete 선언은 사용자 명시 OK 후에만.
- 사용자 critique이 새 measurement gap을 노출하면 art-share-gate 즉시 강화 (테스트 추가).

---

## P5 — Don't generate marketing fluff (style preference)

emoji 사용 금지 (사용자 명시 요청 외). 보고는 짧고 직설적. checkmark heavy/bullet heavy markdown은 OK이지만 promotional language ("amazing", "wonderful")는 금지. 코드는 comment 최소.

---

## P6 — User as decision authority (single-stakeholder phase)

현재는 production launch 전 single-stakeholder 단계. 사용자 = product owner = decision authority. evidence base 1명 voice OK. telemetry/A/B 도입은 future axis (`desktop-session-telemetry`).

---

## P7 — Always speak Korean unless code/identifier

게임 UI 한국어, deliberation/spec/commit 한국어. 코드 identifier·CSS class만 영어.

---

## How harness should consume this

- **Claude Code:** auto-loaded via `~/.claude/projects/.../memory/MEMORY.md` index. Mirror here for Codex.
- **Codex CLI:** read `docs/studio/USER_PREFERENCES.md` at session start before any axis work.
- **다른 runtime:** 동일 — repo-native, harness-agnostic.

새 preference 도출 시 본 파일에 먼저 추가 후 Claude Code 메모리에 sync.
