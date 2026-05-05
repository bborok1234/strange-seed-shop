# Studio Handoff — 2026-05-05 (Cycle A close → 다음 단계)

이 문서는 **harness-neutral session handoff**. Claude Code session 막바지에 작성됨, 다음 session(Codex 또는 Claude Code 재진입)이 이 한 파일만 읽고 즉시 작업 picking up 가능.

---

## Current state (main 기준)

- Last main commit: `882b69e` (Cycle A PR5 evidence + hotfix merged)
- Cycle A (`stage-art-first-restructure`) **6/6 PR all merged**:
  | PR | commit | what shipped |
  |---|---|---|
  | PR0 | `1358a0a` | art-share-gate enforcement infrastructure (playwright + CI advisory) |
  | PR1 | `997d9b6` | dock contrast token (`--color-surface-dock` `#fffbe9` → `#f6ebcf`) |
  | PR2 | `5665393` | `.garden-panel` cream-rectangle 폐기 + starter-panel desktop hide |
  | PR3 | `b7d898c` | Phaser canvas `transparent: true` (art-plate 비쳐 보임) |
  | PR4 | `f3f8d19` | rail button 40px + brand cluster + top-bar desktop hide |
  | PR5 | `882b69e` | evidence 패키징 + hotfix (plot 가림 버그 + art-share-gate test 추가) |

- art-share-gate 측정: **12/12 PASS** (3 viewport × 4 test) on main.
- **사용자 명시 visual approval 수령** — 2026-05-05 Codex handoff에서 사용자가 "Cycle A OK / 다음 axis는 garden-respecting-hud-assets"라고 결정. heartbeat `userApproved: true` 전환 가능.

## Last user feedback (handoff trigger)

2026-05-05 오후 5:45 사용자 critique:
> "밭 위치가 다름 hud에 다 가려버려. 아직 작업이 다 안된거야? 아니면 스스로 qa를 아예 못하는거야? 뭘 해소했다는건지 알수가 없어. 필요하다면 hud를 위한 에셋을 생성해서라도 뭔가 정원같은 느낌을 주던가 해야할거아냐. 사용자가 봤을때 크게 바뀌엇단 인상이 없어."

→ PR #399 hotfix가 plot-가림 버그 + art-share-gate measurement gap 수정. 단 사용자 deeper critique ("정원 느낌 / cream rectangle 일변도 / HUD asset 필요")은 **여전히 미해결**. 다음 axis가 답해야 함.

## Decision resolved (사용자 응답 완료)

`reports/visual/cycle-A-evidence-20260505/README.md` 검토 후 사용자 결정:

1. **Cycle A 종료 OK + 다음 axis로 진행** → heartbeat `userApproved: true` 전환.
2. **다음 axis** → `garden-respecting-hud-assets`.
3. **Codex 정비 선행 요청** → Claude Code 전용 `/studio-deliberate`를 Codex용 `$studio-deliberate`로 만들고, Ralph/Studio foreground loop가 사용자 개입 없이 deliberation과 후속 작업을 이어가게 정비.

## Recommended next axes (deliberation 후보)

| Axis slug | 우선순위 | 이유 |
|---|---|---|
| `garden-respecting-hud-assets` | **P1 — 선택됨** | "HUD asset 생성해서 정원 느낌" — 잎/나무표지판/덩굴/햇살 ribbon frame illustrations. `scripts/generate-gpt-image-assets.mjs` + `assets/source/asset_prompts.json` pipeline 사용. cream rectangle 패러다임의 진짜 답. |
| `garden-diegetic-ui` (= Cycle B) | P1 | spec § Decisions §7 binding promise. plot card 위 % badge / "수확!" chip / creature stage를 in-canvas Phaser sprite로 전환. Designer's L1 약속 회복. |
| `garden-scene-anchor-adjustment` | P2 | brief 70% empty 완전 해소용. Phaser scene plot grid가 viewport 비례 적응 (현재 mobile portrait hardcoded). |
| `mission-ux-visibility-impl` | P2 | 두 번째 deliberation axis spec(`reports/deliberation/mission-ux-visibility/spec.md`)의 implementation. Cycle 1 PR2 dependency 만족됨. |

## How to pick up in any harness

### Step 1: Load source of truth (모든 harness 공통)

```
1. Read docs/studio/USER_PREFERENCES.md
2. Read docs/studio/DELIBERATION_WORKFLOW.md
3. Read docs/studio/personas/{director,designer,art-director,engineer,senior-critic}.md
4. Read docs/studio/plans/0001-deliberation-workflow-bootstrap.md (전체 plan)
5. Read this file (HANDOFF.md) — current state
6. Read reports/visual/cycle-A-evidence-20260505/README.md — Cycle A 결과
7. Read reports/deliberation/stage-art-first-restructure/spec.md — 마지막 axis spec
```

### Step 2: Apply resolved decision

- Cycle A close OK는 사용자 승인됨. `reports/operations/operator-heartbeat-<YYYYMMDD>.jsonl`에 `userApproved: true`, `axis: "garden-respecting-hud-assets"`로 남긴다.
- 다음 axis는 `garden-respecting-hud-assets`로 고정한다.

### Step 3: 새 axis 시작 (deliberation)

선택된 axis에 대해:

**Claude Code:** `/studio-deliberate <axis-slug>` skill 호출 (skill이 docs/studio/personas 자동 로드).

**Codex / 다른 harness:** `$studio-deliberate <axis-slug>` repo-local skill을 우선 사용. SKILL.md가 없거나 비활성인 harness면 수동 follow `docs/studio/DELIBERATION_WORKFLOW.md`:
1. brief 작성: `reports/deliberation/<axis-slug>/brief.md`
2. Phase 2 — 3 specialist에게 병렬 proposal 작성 위임:
   - `proposals/designer.md`
   - `proposals/art-director.md`
   - `proposals/engineer.md`
3. Phase 3 — 4 critique 병렬:
   - `critique-designer.md`, `critique-art-director.md`, `critique-engineer.md`, `critique-senior-critic.md`
4. Phase 4 — Director(main thread) synthesis: `spec.md`
5. Phase 5 — 사용자 review gate
6. Phase 6 — `retrospective.md`

각 specialist agent 호출 시 persona 파일 + brief를 inline으로 전달. persona prompt는 절대 inline duplicate 금지 — runtime read 강제.

### Step 4: Implementation (spec 승인 후)

- spec § Implementation Sequence의 PR 분할 따름
- 매 visible-gameplay PR 후 **반드시** screenshot 캡처 + 사용자 review 단계
- art-share-gate 측정값 PASS만으로 Cycle close 금지 (P4 preference)

## Cycle 1 vs Cycle A 핵심 학습 (다음 axis가 흡수해야)

| Lesson | 적용 |
|---|---|
| spec promises don't auto-enforce | implementation phase critique gate 필수 (USER_PREFERENCES.md P4) |
| 측정값 PASS ≠ 사용자 가치 PASS | screenshot review final guard |
| measurement gap 발생 가능 | 사용자 critique 발견 시 즉시 art-share-gate 강화 |
| cream rectangle 일변도 | 다음 axis (`garden-respecting-hud-assets`)가 진짜 답 |

## Active TODOs

- [x] 사용자 명시 Cycle A approval 받기
- [x] 다음 axis 선택 (`garden-respecting-hud-assets`)
- [ ] Codex용 `$studio-deliberate` + Ralph/Studio loop 정비
- [ ] 선택된 axis brief 작성 + `/studio-deliberate` 또는 수동 deliberation 진행

## Heartbeat reference

이전 `reports/operations/operator-heartbeat-20260504.jsonl` 마지막 entry:
```json
{"phase":"cycle-a-pr5-evidence-package","status":"awaiting_user_review","userApproved":false}
```

Codex handoff에서 사용자 명시 OK를 받았으므로 다음 heartbeat는 `userApproved: true`로 전환한다.

## Repo path reference (전부 harness-neutral)

| 카테고리 | 경로 |
|---|---|
| User preferences | `docs/studio/USER_PREFERENCES.md` |
| Workflow | `docs/studio/DELIBERATION_WORKFLOW.md` |
| Personas | `docs/studio/personas/*.md` |
| Plans | `docs/studio/plans/*.md` |
| Spec template | `docs/studio/templates/spec.md` |
| Per-axis deliberation | `reports/deliberation/<slug>/{brief,proposals/,critique-*,spec,retrospective}.md` |
| Visual evidence | `reports/visual/<axis-slug>-evidence-<date>/` |
| WorkUnits | `items/<id>-<slug>.md` |
| Heartbeat | `reports/operations/operator-heartbeat-*.jsonl` |
| Memory mirror | `docs/studio/USER_PREFERENCES.md` (this file) |

`.claude/`, `.omc/`, `.omx/`는 모두 tool adapter / runtime cache. game studio decisions가 거기 있으면 위반 — repo로 이동.

---

**다음 session(Codex 또는 Claude Code 재진입)은 이 문서를 첫 번째로 읽으세요.**
