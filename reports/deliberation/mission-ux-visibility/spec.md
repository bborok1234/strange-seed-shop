# Spec — Mission UX 가시성 결정

- Axis slug: `mission-ux-visibility`
- Brief: `reports/deliberation/mission-ux-visibility/brief.md`
- Director: studio main session 2026-05-04 → 2026-05-05 (main thread)
- Date: 2026-05-05
- Status: draft (사용자 review gate 대기)
- Pilot: Phase (a) `/studio-deliberate` skill 두 번째 dogfood

## Vision

Production player가 게임을 켰을 때 정원 stage 시야 안에 mission이 ambient로 존재하고, mission이 claim-ready 상태가 되는 순간 시각·motion이 일시적으로 spike되어 player의 시선이 자연스럽게 그 보상 chip으로 끌린다. 평상시 mission은 시각 weight 약함(secondary), claim-ready에서만 weight 강함(primary spike). 데일리 mission +155잎/일 cycle이 player의 데일리 복귀 hook으로 의미를 가지기 시작하고, 22개 누적된 mission-adjacent polish PR(progress hint·milestone count 등)이 마침내 player에게 도달한다.

## Layout Skeleton

본 axis는 desktop layout 골격을 신설하지 않는다. `desktop-ui-redesign` spec § Layout Skeleton의 12-col grid + dock region(col-span-3)을 그대로 사용한다. 본 spec은 그 안에서 mission cluster의 위치만 결정.

| Viewport | Mission UI 위치 | 비고 |
|---|---|---|
| Mobile (≤ 480px) | **Garden tab 안, next-action chip 바로 아래** vertical stack. height `clamp(120px, 18vh, 180px)`. scroll 발생 시 mission 영역만 inner-scroll, stage breathing은 보존. | Designer + Art self-critique honest 반영 — horizontal scroll-snap strip은 dead zone risk로 reject. |
| Tablet (481-1024px) | mobile과 동일 (Garden tab vertical stack) | floating dock은 도입하지 않음 (Cycle 2 결정) |
| Desktop (≥ 1280px) | **Side Dock 내부 secondary cluster** (`currency` → `next-action` → `active expedition` → **`mission cluster`** → `album mini` 순). | `desktop-ui-redesign` Cycle 1 PR2 머지 후 진입. |

## Design Tokens

본 axis는 **신규 디자인 토큰 0개**. `desktop-ui-redesign` spec § Design Tokens의 5 motion gesture / spacing.* / radius.* / color.surface.* / color.accent.sun을 모두 재사용. (Art Director Phase 2 proposal의 핵심 인사이트 채택.)

신규 alias 1종만 추가:

| 토큰 | 의도 | 값 |
|---|---|---|
| `spacing.row.mission` | mission row 한 줄 높이 | `spacing.3xl` (48px) alias |

## Component Composition

### Mission Cluster 컴포넌트 사양

- **컨테이너**: `MissionCluster` 컴포넌트 신설. `radius.panel.desktop` (16px desktop) / `radius.panel` (8px mobile). `elevation.dock.raised`.
- **헤더**: 1줄, `type.label`, "오늘의 의뢰" 또는 "데일리 진행". 클릭 시 cluster 접기/펴기 (player 본인 의지로 noise 줄이기).
- **List**: `visibleMissions.map`, 6개 mission row. `spacing.row.mission` 높이.
- **Row 구조**: family motif icon (튜토리얼/데일리 구분) + label 1줄 (`type.body`) + progress bar (`<progress>` element 그대로 유지) + claim 버튼 또는 status badge.
- **Empty / claimed state**: claimed mission은 row opacity `0.4` + checkmark icon. 펴짐 상태에서 list 하단으로 정렬.

### 시각 위계 — spike hierarchy (본 spec의 결정적 결론)

평상시 mission cluster의 visual weight는 **secondary ambient** (currency cluster와 next-action chip보다 낮음). 그러나 mission이 **claim-ready 상태가 되는 순간** 해당 row만 일시적 weight spike:

1. row background: `color.accent.sun` glow (1.5s `motion.gesture.celebrate` peak → 8s `motion.gesture.ambient` 약한 pulse loop).
2. claim 버튼: `color.action.primary.strong` + size 1.1배 (`motion.gesture.tap` snap).
3. cluster 헤더 자동 펴짐 (접혀 있던 경우, `motion.gesture.reveal` 420ms).
4. claim 완료 후: `motion.gesture.celebrate` (currency tick과 동시 발화) + row가 claimed state(opacity 0.4)로 transition (`motion.gesture.reveal`).

**Spike 종료**: claim되거나, 24h 경과 (데일리 mission), 또는 player가 cluster를 다시 접으면.

### Existing → New

| Component | 현 위치 | 새 위치 | 비고 |
|---|---|---|---|
| `mission-board` (`App.tsx:2880-2904`) | `showDebugPanel === true` 조건부 (production 부재) | **`MissionCluster`로 리팩토링 + 항상 mount** (Garden tab mobile / Side Dock desktop) | `showDebugPanel` 분기 제거 — debug 모드에서는 별도 stale dev 카드로 분리 |
| `claimMissionReward` | `App.tsx:1814-1826` | **변경 0** | invariant |
| `advanceMission` triggers (7곳) | `App.tsx` 각 위치 | **변경 0** | invariant |
| `visibleMissions` (`App.tsx:643`) | 변경 0 | 변경 0 | invariant |
| `mission_reward_claimed` analytics event | `App.tsx:1826`, production trigger 0 | 동일 코드, **production trigger 활성화** (UI 노출로 자동) | invariant |

### Removed / deferred (별도 axis)

- Mobile horizontal scroll-snap mission-strip (Art Director Phase 2 안) — Art self-critique의 dead zone risk + Engineer의 mobile 회귀 surface 비용으로 거부. 본 spec은 vertical stack 채택. 단 cluster 접기/펴기로 mobile stage breathing 보존.
- 6번째 탭 신설 — brief Non-negotiable #1 위반 (5탭 골격 보존).
- Mission detail modal, mission filter UI, mission sorting — Cycle 2 polish.
- Onboarding 첫 세션 mission "tutorial 3종"의 next-action chip과의 통합 정렬 — § Decisions §3.

## Acceptance Criteria

- [ ] Production 빌드 (showDebugPanel=false)에서 Mission UI가 DOM에 mount되어 player가 인지 가능.
- [ ] Mobile ≤ 480px에서 Garden tab 진입 시 next-action chip 아래 mission cluster visible. stage breathing(stage 면적 ≥ 60% mobile viewport)는 보존.
- [ ] Desktop ≥ 1280px에서 Side Dock 내부 4번째 cluster로 mission이 노출 (`desktop-ui-redesign` Cycle 1 PR2 머지 후 진입 가능).
- [ ] Mission이 claim-ready 상태가 되면 해당 row에 `color.accent.sun` glow + `motion.gesture.celebrate` peak(1.5s) → ambient pulse(8s loop) 발화.
- [ ] Cluster 헤더 클릭으로 접기/펴기 가능. 접힌 상태에서도 claim-ready row가 발생하면 자동 펴짐.
- [ ] Claim 버튼 클릭 → leaves 지급 + currency cluster tick celebrate motion + row가 claimed state로 transition.
- [ ] `mission_reward_claimed` analytics event가 production에서 발화 (현재 0 → ≥ 1).
- [ ] `claimedMissionIds` / `missionProgress` 영속 정상 작동.
- [ ] `npm run build` 통과.
- [ ] `npm run check:ci` 통과.
- [ ] `PlayerSave` / `persistence.ts` / `src/data/missions.json` / `claimMissionReward` / `advanceMission` 변경 0줄.
- [ ] 신규 디자인 토큰 0개 (alias `spacing.row.mission` 1종만).
- [ ] Bundle size delta ≤ +3KB CSS gzipped + +2KB JS gzipped.
- [ ] Mobile 시각 회귀 0 — playwright snapshot 414×896 baseline 비교.
- [ ] Open Questions 본 spec ≤ 5개 (deliberation retrospective 학습 적용).

## Risks

| Risk | Severity | Mitigation |
|---|---|---|
| `desktop-ui-redesign` Cycle 1 PR2 머지 전에 본 axis Path A(mobile garden tab embed)만 ship되면 desktop에서 mission이 안 보임 | high | spec § Implementation Sequence에 명시: Phase 1 = Path A mobile + desktop 임시 garden tab embed (PR2 미머지 가정) → Phase 2 = Cycle 1 PR2 머지 후 desktop dock으로 promote. 두 단계 분리. |
| Spike hierarchy의 motion(`accent.sun` glow + ambient pulse 8s loop)이 active expedition leaf-trail(#384)과 동시 발화 시 active tween 8개 budget 초과 | medium | 동시 발화 가능한 motion은 cluster 안에서 1개 row만 ready로 가정 (대부분 케이스). 만약 동시 2+ ready일 경우 가장 빨리 ready된 row만 ambient pulse 발화, 나머지는 정적 glow만. |
| Cluster 접기/펴기 state가 PlayerSave에 저장되지 않으면 새로고침마다 펴진 default 상태 (player irritation) | low | `localStorage["sss:mission-cluster-collapsed"]` 별도 key. `PlayerSave` 침범 0. |
| Mobile vertical stack이 stage 면적을 18vh 차지 → 작은 viewport(예: iPhone SE 568px height)에서 stage breathing < 60% 약속 위반 가능 | medium | `clamp(120px, 18vh, 180px)` 상한·하한 명시. 568px viewport에서는 ~100px로 압축되어 stage 면적 ≥ 60% 보장. 그래도 breaking 시 cluster 접힘 default 옵션. |
| Spike hierarchy의 motion이 epileptic 위험 (ambient pulse가 너무 빠르면) | low | `motion.gesture.ambient` 토큰의 duration이 swift × standard (220ms) loop인데 이를 mission ready용으로 8s loop으로 alias. 너무 빠르거나 깜빡거리지 않음. 추가로 `prefers-reduced-motion` 사용자 감지 시 ambient pulse 비활성화. |
| 22 PR/month main 속도에서 본 axis가 `desktop-ui-redesign` Cycle 1 5 PR과 동시 진행 시 styles.css 충돌 | medium | 본 axis는 mobile mission cluster 먼저(Cycle 1과 무충돌), desktop dock cluster는 Cycle 1 PR2 머지 후. studio-operate autonomous loop은 본 axis 종료까지 stop 유지. |

## Implementation Sequence

본 axis는 **2 Phase, ~3 PR**. `desktop-ui-redesign` Cycle 1과 직렬 의존성 명시.

### Phase 1 — Mobile + temporary desktop garden tab embed

1. **PR1 — `MissionCluster` 컴포넌트 신설 + Garden tab embed**
   - `src/App.tsx`: `MissionCluster` 컴포넌트 작성 (cluster 헤더, list, row, claim 버튼). `showDebugPanel` 분기 제거. mobile + desktop 모두 Garden tab 안 next-action chip 아래 mount.
   - `src/styles.css`: `.mission-cluster`, `.mission-row` (active / claimed / spike state) 정의. `spacing.row.mission` alias 등록.
   - 추정 ~180-260줄, 2 파일.
   - 검증: production에서 mission visible + claim 작동 + mobile snapshot 회귀 0.

2. **PR2 — Spike hierarchy motion**
   - `src/App.tsx`: claim-ready 감지 → `accent.sun` glow class toggle, `motion.gesture.celebrate` 발화, ambient pulse loop 시작/종료.
   - `src/styles.css`: spike state CSS (`.mission-row.claim-ready` + keyframes alias to `motion.gesture.*`). `prefers-reduced-motion` 분기.
   - 추정 ~120-180줄, 2 파일.
   - 검증: 1개 mission이 ready 상태가 되면 spike 발화 + claim 후 currency tick 동시 발화 + claimed state transition.

### Phase 2 — Desktop dock promotion (Cycle 1 PR2 머지 의존)

3. **PR3 — Desktop Side Dock 내부 mission cluster promote**
   - `desktop-ui-redesign` Cycle 1 PR2 (SideDock 4 cluster) 머지 후 진입.
   - `src/App.tsx`: desktop viewport 시 `MissionCluster`를 Garden tab embed에서 SideDock 4번째 cluster로 이전 (mobile은 변경 0).
   - `src/styles.css`: dock 내부 mission cluster styling (spacing, radius, elevation 토큰 적용).
   - 추정 ~80-120줄, 2 파일.
   - 검증: desktop snapshot 1280/1600/1920 + mobile 회귀 0 + active tween budget verify.

### 후속 axis (본 axis 종료 후 별도 spec.md)

- `mission-onboarding-integration` — tutorial 3 mission이 next-action chip의 onboarding guidance와 어떻게 정렬되는지 (§ Decisions §3 양보 사항 follow-up).
- `mission-cluster-polish` — mission row 안 progress bar 스타일링, mission detail tooltip, mission filter UI 등.
- `mission-daily-reset-timezone` — UTC 자정 기준 mission 리셋 메커니즘 명시 (현재 implicit).

## Decisions Resolved

본 섹션은 deliberation의 substantive disagreement를 명시 결론·이유와 함께 기록. 비어 있으면 deliberation 미완.

### §1. Mission visual weight — **Spike Hierarchy** (평상시 secondary ambient, claim-ready에서 primary spike)

- **Disagreement:** Designer는 "claim 1탭 affordance를 cluster 안에서 가장 강한 weight로" (V2 Claim이 mission 고유 verb) — Art Director는 "secondary ambient" (mission은 verb의 부산물이므로 자원 cluster·next-action보다 낮은 위계). 정면 hierarchy 충돌.
- **Resolution:** **Spike hierarchy 채택** — 평상시 secondary ambient로 Art Director hierarchy 보존, claim-ready 발화 순간 일시적 primary spike(glow + motion + auto-expand)로 Designer "dead reward" 우려 해결.
- **Reasoning:** Senior Critic Q-D2가 정확히 이 본질 충돌을 호명: "verb의 부산물(secondary 영구)" vs "spike 위계". 어느 한 쪽이 단독으로는 brief의 success 조건(mission visible + dead reward 회복) 둘 다 충족 못 함. spike hierarchy는 Art의 영구 위계 보존 + Designer의 player 인지 회복 둘 다 달성하는 synthesis.
- **Loser's concession (Designer):** mission cluster 평상시 weight가 dock의 currency·next-action보다 낮은 점은 양보. 단 claim-ready spike의 강도(`accent.sun` glow + 1.5s celebrate peak + 8s ambient pulse)는 양보 불가 — Cycle 1 PR2 작업 시 motion 강도 조정 권한은 Designer + Art 공동.
- **Loser's concession (Art):** spike state에서 row가 일시적 primary weight를 가져오는 것을 인정. 단 cluster 자체의 영구 위치(dock 4번째 cluster, currency 위가 아님)는 보존.

### §2. Mobile placement — **Vertical stack in Garden tab** (Art's horizontal scroll-snap strip 거부)

- **Disagreement:** Designer는 mobile vertical stack (Garden tab 안 next-action chip 아래) — Art Director는 horizontal scroll-snap mission-strip (stage 안 top-bar와 next-action 사이의 narrow band).
- **Resolution:** **Vertical stack 채택**, height `clamp(120px, 18vh, 180px)`로 stage breathing 보존.
- **Reasoning:** Art Director self-critique가 honest하게 인정: horizontal strip은 narrow band에서 player 시선 dead zone risk가 telemetry 없이 검증 불가. Engineer critique도 mobile dual-implementation(strip + dock) 비용 3-4배 + scroll-snap webview spike 1시간 필요로 추가 우려. Vertical stack은 stage breathing 60% 약속을 `clamp` 상한으로 보장하면서 visual hierarchy 명확.
- **Loser's concession (Art):** mobile에서 cluster 접기/펴기 default behavior로 stage breathing을 player 본인 의지로 더 확보 가능. `prefers-reduced-motion` 사용자 감지 시 ambient pulse 비활성화로 시각 노이즈 최소.

### §3. Tutorial mission vs next-action chip 정렬 — **별도 follow-up axis**

- **Disagreement:** tutorial 3종이 next-action chip의 onboarding guidance와 중복되거나 충돌할 수 있다는 Designer의 § Open Questions에서 명시. Art Director critique은 next-action chip이 cluster 위에 있어야 함을 강조 (currency-top hierarchy 보존).
- **Resolution:** 본 spec에서는 mission cluster를 next-action chip **아래**에 배치(정렬 충돌 회피). tutorial 3종이 next-action chip과 어떻게 시간 순서로 정렬되는지(예: tutorial 진행 중일 때만 highlight, 완료 후 데일리만 노출)는 **`mission-onboarding-integration` follow-up axis**로 분리.
- **Reasoning:** 본 axis는 "mission 가시성"이 핵심 — 정렬은 가시성이 확보된 후 다음 axis에서 결정해도 늦지 않음. cluster 위치 결정만으로도 가치가 명확.

### §4. Desktop dock 진입 시점 — **`desktop-ui-redesign` Cycle 1 PR2 머지 후** (Engineer concession 채택)

- **Disagreement:** 세 proposal 모두 desktop에서 mission cluster를 dock 안 secondary로 두자고 합의. 그러나 진입 시점은 Engineer만 명시 — Cycle 1 PR2 (SideDock 4 cluster) 머지 후.
- **Resolution:** **Phase 2 PR3로 분리, Cycle 1 PR2 머지 의존성 명시**.
- **Reasoning:** Engineer의 conditional framing이 정확 — Path A 단독(garden tab embed) PR1·PR2가 SideDock과 무관하게 ship 가능하지만, desktop 최종 위치는 dock이므로 PR2 머지 전까지 desktop도 일시적으로 garden tab 안에 mission cluster를 mount한다. PR2 머지 후 PR3로 mobile은 그대로, desktop만 dock으로 promote.

### §5. Open Question 개수 제약 검증 — **모든 proposal과 critique가 ≤ 5 준수** (retrospective 개선사항 작동)

- **Disagreement:** 없음 — process compliance check.
- **Resolution:** Phase 2 3 proposal 모두 Open Q ≤ 5 ✓, Phase 3 4 critique 모두 ≤ 5 per section ✓.
- **Reasoning:** 첫 dogfood retrospective의 개선사항(Open Q ≤ 5 강제)이 페르소나 prompt에 명시되어 있고, 본 dogfood에서 자동 작동 확인. skill의 prompt skeleton은 변경 없이 페르소나 파일 기반으로 동작 — `feedback_harness_neutral_source_of_truth`의 adapter 패턴 검증.

### §6. Engineer cost-only 금지 검증 — **Phase 2/3 모두 conditional framing 사용** (retrospective 개선사항 작동)

- **Disagreement:** 없음 — process compliance check.
- **Resolution:** Phase 2 Engineer proposal "if Designer prefers X then PR Y; if Art prefers Z then Y'" 형태로 cost ranking 제공만, "권장 = A" 박지 않음 ✓. Phase 3 critique 핵심 메시지가 "Designer/Art 둘 다 결정 필요"로 갔음 ✓.
- **Reasoning:** 첫 dogfood retrospective의 두 번째 개선사항도 작동. 페르소나 파일에 명시 추가 없이 Phase 2 prompt에서 inline 강조만으로 충분 — 다음 retrospective에서 페르소나 파일에 영구 명시할지 결정.

### §7. Senior Critic 신호 강도 유지 — **premature consensus risk 캐치 + Director do-not-skip Q-D2 핵심** (retrospective 신호 ranking 1위 검증)

- **Disagreement:** 없음 — process compliance check.
- **Resolution:** Critic이 핵심 충돌(spike hierarchy vs secondary 영구) 본질을 Q-D2로 호명 + premature consensus risk(세 proposal 모두 "Garden 탭 / dock cluster" 동일 결론에 다른 reasoning으로 수렴) 캐치. 본 spec의 §1 결정이 Critic Q-D2 답변.
- **Reasoning:** 첫 dogfood retrospective ranking 1위였던 Senior Critic 페르소나의 force-function이 본 dogfood에서도 유지됨. challenge 강도 약화 없음 — 페르소나 파일의 "MUST push back" 항목 5종이 자동으로 작동.

## Open Questions

본 spec은 5개 Open Question으로 제한 (retrospective 학습 적용).

- **Q1 (Phase 1 PR2):** spike state ambient pulse loop의 정확한 duration·opacity·blur 강도. PR2 작업 시 Designer + Art 공동 결정.
- **Q2 (Phase 1 PR2):** `prefers-reduced-motion` 사용자 spike 발화 정책 — pulse 비활성화 + glow만 정적 표시?
- **Q3 (`mission-onboarding-integration` follow-up):** tutorial 3종이 완료된 후 next-action chip의 guidance가 어떻게 daily mission으로 transition하는지.
- **Q4 (telemetry follow-up):** mission_reward_claimed event 발화 후 retention 7일 비교 (mission UI 노출 ROI 측정).
- **Q5 (`mission-daily-reset-timezone` follow-up):** 데일리 mission UTC 자정 리셋이 player local time과 어긋나는 케이스 처리.

## References

- Brief: `reports/deliberation/mission-ux-visibility/brief.md`
- Proposals: `reports/deliberation/mission-ux-visibility/proposals/{designer,art-director,engineer}.md`
- Critiques: `reports/deliberation/mission-ux-visibility/critique-{designer,art-director,engineer,senior-critic}.md`
- Workflow: `docs/studio/DELIBERATION_WORKFLOW.md`
- Personas: `docs/studio/personas/{director,designer,art-director,engineer,senior-critic}.md`
- Prior axis spec: `reports/deliberation/desktop-ui-redesign/spec.md` (§ Layout / § Tokens 재사용)
- Memory: `feedback_layout_over_polish.md`, `feedback_studio_team_critique.md`, `feedback_harness_neutral_source_of_truth.md`
- Code: `src/App.tsx:643/2880-2904/1814-1826`, `src/data/missions.json`, `src/types/game.ts`

## Changelog

- 2026-05-05 — initial draft from Cycle 1 deliberation. Director synthesis from 3 proposals + 4 critiques. 4 substantive disagreements + 3 process compliance checks resolved (§ Decisions Resolved §1-§7). 2 Phase / ~3 PR / Cycle 1 PR2 의존성 명시. Pilot dogfood report: retrospective 개선사항(Open Q ≤ 5, Engineer no cost-only, Senior Critic 강도) 모두 자동 작동 확인.
