# Engineer Proposal — Mission UX Visibility

- Axis: `mission-ux-visibility`
- Persona: Engineer (개발자)
- Date: 2026-05-04
- Phase: 2 (parallel proposals — written without seeing other personas)

## Frame

본 axis는 **mission UX placement 결정 axis**이고, Engineer 입장은 **각 placement option의 비용·리스크 매핑 + PR 분할 + 상위 axis(`desktop-ui-redesign` Cycle 1 5 PR)와의 conflict surface 명시**다. 시각 톤·player verb·hierarchy는 Designer/Art Director 결정. 본 문서는 design 결정에 따라 PR cost가 어떻게 갈리는지 conditional로만 적는다.

---

## Files Touched (option별 매핑)

### 공통 (모든 option에 해당)

- `src/App.tsx:2880-2904` — 현재 mission-board JSX. `showDebugPanel && activeTab === "garden"` 조건절 제거 또는 분기 변경. 모든 option이 이 1곳을 손대야 함.
- `src/App.tsx:643` — `visibleMissions` 산정 (변경 없음. 단, claimable filter 추가 시 ±2~5줄).
- `src/App.tsx:1814-1826` — `claimMissionReward` (로직 변경 0. invariant).
- `src/styles.css:902-919, 4980-5013, 6460` — `.mission-row` / `.mission-claimed` 기존 스타일. option별로 selector scope만 바꿈.

### Option별 추가 파일

| Option | 추가 touch |
|---|---|
| **A. 기존 5탭 중 1개에 임베드 (예: garden tab 내부 영구)** | `src/App.tsx:2880-2904` (조건 제거) + `src/styles.css:3970-3987` (.tab-panel 흐름 안에 mission-board 통합) |
| **B. floating dock card (기존 dev-panel/garden-stage 위 absolute mount)** | `src/App.tsx:2853-2904` (showSidePanel 외 별도 floating mount 분기) + `src/styles.css` 신규 ~80~120줄 (`.mission-dock-card` `position: fixed/absolute`, mobile breakpoint 포함) |
| **C. 신규 modal (mission button 트리거)** | `src/App.tsx`: trigger button 1개 (top-bar 또는 nextAction 옆) + modal mount + open state useState + esc/backdrop 핸들러 → +180~250줄. `src/styles.css` 신규 ~140~200줄 (`.mission-modal-overlay`, focus-trap 스타일) |
| **D. 신규 6번째 탭 (mission 전용)** | **거부** — brief Non-negotiable #1 위반. (`MAIN_TABS` 확장 + `MainTab` 타입 변경 + tab-bar layout 5→6 grid 재계산 + `desktop-ui-redesign` rail 4탭 정신 충돌. 기록만 하고 cost는 산정 안 함.) |
| **E. 홈페이지 hero (top-bar / objective-chip 영역에 mission 1순위 노출)** | `src/App.tsx:2172-2183` (top-bar JSX 재구성, objective-chip을 mission progress로 교체 또는 vertical stack) + `src/styles.css` 기존 `.top-bar` `.objective-chip` 스타일 ~40~70줄 수정 + nextAction과 hierarchy 충돌 해결 로직 |

### 무관/안 건드림 invariant

- `src/data/missions.json` — 0줄 (brief constraint).
- `src/types/game.ts` — `MissionDefinition`, `PlayerSave.missionProgress`, `claimedMissionIds` 0줄 (save invariant).
- `src/lib/persistence.ts:41-42, 82-83` — 0줄 (필드 그대로 유지).
- `src/game/playfield/GardenScene.ts` — 0줄 (Phaser 무관).
- `src/game/playfield/GardenPlayfieldHost.tsx` — 0줄.
- `advanceMission`(`App.tsx:4859`) 트리거 7곳(`1005, 1021, 1083, 1238, 1239, 1366, 1804`) — 0줄.

---

## Cost Map per Placement Option

각 option의 추정 줄수·신규 컴포넌트 수·PR 수. 모두 mobile + desktop 모두 동작 전제. `desktop-ui-redesign` spec § Component Composition을 어기지 않는 범위로 한정.

| Option | LOC 추정 | 신규 컴포넌트 | 신규 state/hook | bundle delta (gz) | tween 추가 | PR 수 |
|---|---|---|---|---|---|---|
| **A. per-tab embed (garden tab 내부 영구)** | ~80~140 | 0 | 0 | +0.5~1.5KB CSS, +0.2KB JS | 0 (기존 `.mission-row` motion 재활용) | **1 PR** |
| **A'. per-tab embed (각 tab에 cross-cut)** | ~200~300 | 1 (`MissionStrip` 추출) | 0 | +1.5~2.5KB CSS, +0.5KB JS | 0 | 1 PR |
| **B. floating dock card** | ~280~420 | 1 (`MissionDock`) | 1 (open/expand) | +2~4KB CSS, +1KB JS | 1 (collapse/expand `motion.gesture.reveal` if Art OK) | **2 PR** (extract → mount) |
| **C. 신규 modal** | ~380~580 | 2 (`MissionModal`, focus trap util) | 2 (isOpen, returnFocusRef) | +3~5KB CSS, +1.5KB JS | 1 (modal enter/leave) | **2~3 PR** (button → modal shell → focus-trap polish) |
| **D. 신규 6번째 탭** | n/a — 거부 (brief Non-negotiable #1) | n/a | n/a | n/a | n/a | n/a |
| **E. homepage hero (top-bar 흡수)** | ~250~380 | 1 (`MissionHeroChip`) | 0~1 (rotation index for daily/tutorial) | +1.5~3KB CSS, +0.8KB JS | 1 (rotation if multiple visible) | **2 PR** (top-bar reshape → mission integration) |

### Cost ranking (cheapest first)

**A (~110줄, 1 PR) < A' (~250줄, 1 PR) < E (~315줄, 2 PR) < B (~350줄, 2 PR) < C (~480줄, 2~3 PR) < D (거부)**

A와 E의 차이는 ~3배. C는 A의 ~4배.

### Bundle budget

brief soft constraint = +10KB gz. 모든 option 단독으로는 통과. 단 `desktop-ui-redesign` Cycle 1과 합산하면 (spec acceptance: +6KB CSS + +2KB JS = 8KB) C/E option은 본 axis 단독 +5KB로 합쳐 13KB까지 갈 수 있음 → soft 위반. **합산 viewpoint에서는 A 또는 B가 안전.**

---

## Estimated PR Decomposition

각 option별 PR 분할. Designer/Art Director 결정 후 1 path만 실행. PR 모두 ≤ 500줄, ≤ 5 파일 brief soft 준수.

### Path A — per-tab embed (garden tab 1곳, 영구)

- **PR-mission-A1**: `App.tsx:2880-2904` 조건 제거 + `garden-panel` 흐름 안으로 위치 이동 + mobile snapshot 회귀 0 검증.
  - LOC ~80~140, 파일 2개 (`App.tsx`, `styles.css`).
  - 검증: `npm run check:visual` mobile 414×896 회귀 0 + `npm run check:ci` + 수동 production build로 mission UI 노출 확인.

### Path A' — per-tab embed (4 surface 모두에 mission strip)

- **PR-mission-A'1**: `MissionStrip` 컴포넌트 추출 + 각 tab(`activeTab === "seeds"|"album"|"expedition"|"shop"`)의 panel 상단 또는 하단에 mount.
  - LOC ~200~300, 파일 2~3개.
  - 검증: 위와 동일 + 4 tab 각각 snapshot 추가.

### Path B — floating dock card

- **PR-mission-B1 (extract)**: `MissionStrip`/`MissionDock` 컴포넌트 추출 + 기존 mission-board JSX를 컴포넌트로 이동 (시각 noop, debug에서만 노출 유지). ~120~180줄.
- **PR-mission-B2 (mount)**: production에서 floating dock으로 mount + collapse/expand state + mobile/desktop breakpoint 분기.
  - LOC ~160~240.
  - **`desktop-ui-redesign` Cycle 1 PR2와 region 충돌 — § Disagreements 참조.**
  - 검증: mobile + desktop 1280×800 snapshot 회귀 + tween 동시성 budget (≤ 8 active) spike 1시간.

### Path C — modal

- **PR-mission-C1 (trigger button)**: top-bar 또는 nextAction 옆에 mission button + count badge. ~80~120줄.
- **PR-mission-C2 (modal shell)**: `MissionModal` 컴포넌트 + open/close state + ESC/backdrop close + focus trap. ~200~300줄.
- **PR-mission-C3 (polish)**: motion + a11y `aria-modal` `role="dialog"` + 모바일 fullscreen variant. ~100~160줄.

### Path E — homepage hero

- **PR-mission-E1 (top-bar reshape)**: `top-bar` JSX 재구성 + objective-chip과 mission progress chip의 hierarchy 결정 (Art Director 결정 필수). ~120~200줄.
- **PR-mission-E2 (rotation)**: 다중 mission 동시 visible 시 rotation 또는 stack 처리 + claim 버튼 통합. ~130~180줄.

---

## Save Migration Plan

**모든 option 공통: save migration 0**.

근거:
- `PlayerSave.missionProgress: Record<string, number>` — 이미 영속됨 (`persistence.ts:41, 82`).
- `PlayerSave.claimedMissionIds: string[]` — 이미 영속됨 (`persistence.ts:42, 83`).
- mission `id` 6개(`tutorial_plant_first_seed` ~ `daily_start_expedition`) — 본 axis에서 추가/삭제 0 (brief constraint #2).
- 신규 localStorage key 0개 권장. 단 modal(Path C)에서 "mission badge dismissed" 상태를 영속할 경우 별도 namespace `localStorage["seedshop:mission-modal-seen"]` 1개 — 그러나 PlayerSave 침범 0.

**Edge case**: 기존 player가 debug 모드에서 이미 mission claim한 상태로 production에 진입 → `claimedMissionIds`가 이미 차 있어 모든 mission "완료" 상태로만 보임. 이는 legitimate 상태이므로 마이그레이션 불필요. 단 첫 production 노출 시 "이미 받음" UI 6개만 보이는 player가 발생할 수 있음을 Designer에게 인지시킴 (UX flag, Engineer 결정 영역 외).

---

## Performance Budget Impact

### Bundle size (모든 option)

- A: 가장 작음. CSS selector reuse, 신규 컴포넌트 0. **+0.5~1.5KB CSS, +0.2KB JS gz.**
- A': MissionStrip 추출. **+1.5~2.5KB CSS, +0.5KB JS gz.**
- B: dock 컴포넌트 + collapse motion. **+2~4KB CSS, +1KB JS gz.**
- C: modal + focus trap + a11y. **+3~5KB CSS, +1.5KB JS gz.**
- E: top-bar reshape + hierarchy logic. **+1.5~3KB CSS, +0.8KB JS gz.**

모두 brief soft `+10KB` 단독 통과. C는 `desktop-ui-redesign`와 합산 시 borderline.

### React render frequency

- A/A'/E: 기존 React tree 안에서 conditional render. `visibleMissions`(line 643)는 `save` 변경 시만 재산정 — 변경 없음.
- B: floating dock의 collapse state 1개 useState 추가 → render +1 hook. minor.
- C: modal isOpen state. modal 미오픈 시 children 0 mount이면 무영향. 오픈 시 6 mission item render — 무시할 수준.

### Phaser scene / tween 동시성

- A/A'/C/E: Phaser 무관. tween 추가 0.
- B: collapse/expand motion이 `desktop-ui-redesign` spec § Risks "dock 가변 확장 시 active tween ≤ 8개 budget"과 같은 layer에서 동시 발화 가능 → 합산 ≤ 8 검증 필요. spike 30분.

### 메인 스레드 블록

- 모두 무관. mission progress 계산은 trigger 시 1회 O(1).

---

## Verification Commands

각 option 공통:
- `npm run check:ci` — 전체 회귀.
- `npm run build` — bundle 통과 + size delta 측정 (`vite build --mode production` 후 `dist/assets/*.js,css` size 비교).
- `npm run check:visual` — playwright snapshot. mobile 414×896 baseline 회귀 0이 hard requirement.
- `npm run check:p0-ui-ux` — P0 UI 회귀 (script 내부 검사 항목 mission-board 노출 가정 변경 시 update 필요).

option별 추가:
- **A/A'**: snapshot baseline 갱신 (mission이 production에 처음 노출됨 → 의도된 baseline 변경. PR review 시 명시).
- **B**: dock 동시 motion budget spike 1시간 — `MissionDock` collapse 중 `gesture.reveal` 발화 시 active tween 카운트 측정 (Chrome DevTools Performance 탭 또는 Phaser tween manager log).
- **C**: a11y 검사. `aria-modal="true"`, focus trap 동작, ESC 닫힘, backdrop 클릭 닫힘 수동 QA. axe-core 스크립트 0 violations 확인.
- **E**: mobile top-bar 414px width에서 mission chip + currency cluster + objective-chip 3종 stacking 회귀 0.

**`mission_reward_claimed` event 발화 검증** (모든 option): Path별 첫 PR 머지 후 production build를 직접 클릭, `trackEvent` log에서 발화 확인.

---

## Disagreements I Anticipate

### 1. Designer가 "homepage hero (Path E)" 또는 "modal (Path C)" 선호 시

- **Engineer position**: Path C는 단독으로는 통과지만 `desktop-ui-redesign` Cycle 1 PR2(SideDock)와 같은 main 머지 window를 점유 → conflict surface 증가. C 채택 시 `desktop-ui-redesign` Cycle 1 종료(5 PR 직렬 머지) **이후** 본 axis 진입을 권고.
- 만약 Designer가 mission을 "first session onboarding의 핵심 verb chain"으로 정의하면 Path E가 정합 — 그러나 nextAction chip(`App.tsx:647, 2176`)과 hierarchy 충돌. Art Director 합의 없이는 Path E 진입 불가.

### 2. Art Director가 "floating dock (Path B)"를 desktop-ui-redesign의 SideDock과 통합하자고 제안 시

- **Engineer position**: 통합 자체는 LOC 절감 가능 (Path B 단독 ~350줄 vs SideDock의 4 cluster에 mission cluster 1개 추가 ~150~220줄). 그러나 본 axis는 **모바일 우선** (brief constraint #4)이므로 SideDock(desktop ≥ 1280px만 mount)에 mission을 fold하면 모바일에서 mission UX 0 → brief Success criteria "production player가 켰을 때 mission의 존재를 인지" 위반.
- **합의 가능 surface**: desktop은 SideDock에 cluster로 fold(`desktop-ui-redesign` PR2와 같은 PR에 mission cluster 추가), 모바일은 별도 surface(Path A 또는 Path B mobile variant). 이러면 **2개 path 동시 구현** → LOC 합산 ~280~400줄, 2 PR. 단 dual implementation 부채 발생.

### 3. Senior Critic이 "왜 6번째 탭(Path D)을 명시적으로 거부 안 했냐" 비판 시

- **Engineer position**: brief Non-negotiable #1에 명시되어 있으므로 본 proposal 본문에서도 거부. cost 산정 자체를 생략한 이유: `MainTab` 타입 (`App.tsx:19`) 변경 + `MAIN_TABS` (`App.tsx:378`) 확장 + bottom-tabs 5-up grid → 6-up 재계산 + `desktop-ui-redesign` rail 4탭 정신 충돌 → 본 axis scope 외.

### 4. Designer가 "Path A는 너무 평범하다, design intent 약함" 비판 시

- **Engineer position**: Path A의 design intent 약점은 인정하되 이는 design 결정 영역 — Engineer는 cost가 1/4임을 명시할 뿐, design intent를 cost 이유로 깎지 않음 (persona MUST NOT). Designer가 Path B/C/E 중 하나를 정당화하면 PR decomposition은 그에 따라 재산정.

### 5. `desktop-ui-redesign` Cycle 1 5 PR과의 직렬 vs 병렬 머지

- **Engineer position**: 본 axis는 `desktop-ui-redesign` Cycle 1 종료 후 진입을 강력 권고. 이유:
  - Cycle 1 PR2(SideDock)와 본 axis Path B/C가 같은 React tree 영역(garden-stage 형제 노드 또는 dock region)을 동시 수정 → merge conflict 99%.
  - Cycle 1 spec § Risks "studio-operate autonomous loop은 본 axis 종료까지 stop"을 본 axis도 동일 적용. 즉 두 axis는 직렬.
  - 단 **Path A 단독**은 `garden-panel` 내부만 건드리므로 Cycle 1과 conflict 0 → 병렬 가능.
- 본 결정은 Director(synthesis 단계) 영역. Engineer는 path별 conflict surface만 명시.

---

## Open Questions (priority order, ≤ 5)

1. **(P0, blocks PR sequencing)** 본 axis가 `desktop-ui-redesign` Cycle 1과 직렬인가 병렬인가? Path A 채택 시 병렬 가능, Path B/C/E 채택 시 직렬 필수. Director 결정 필요.
2. **(P0, blocks design)** Designer가 mission을 "tutorial 3종 onboarding hook"으로 보는가, "daily 3종 retention loop"로 보는가, 둘 다인가? 답에 따라 placement가 갈림 (전자 = E, 후자 = B/A, 둘 다 = A 또는 B). Engineer는 본 답을 모름 — Designer 결정.
3. **(P1, PR2 spike)** Path B 채택 시 floating dock의 mobile breakpoint 처리: 모바일에서도 floating(viewport 점유 우려) vs 모바일은 Path A로 fallback (dual implementation). 30분 spike + Art Director 합의 필요.
4. **(P1, telemetry)** 본 axis 머지 후 `mission_reward_claimed` event 발화율 측정 방법. 현재 `trackEvent`(`App.tsx:1826`)는 production sink가 어디인가? 확인 후 success criteria 검증 가능.
5. **(P2, follow-up axis 후보)** mobile + desktop 합산 22 PR/month 속도에서 본 axis 종료 후 mission-adjacent polish PR 22개 backlog의 layout-dependent 비율은? 본 axis가 그 polish 22개의 ROI를 살릴 수 있는지 측정 — 별도 audit axis로 deferral 권고.

---

## Conditional Conclusion (cost-only 결론 금지 — design 결정 대기)

본 Engineer proposal은 **single recommendation을 issue하지 않는다**. 첫 dogfood retrospective에서 "Engineer cost-only 결론은 cross-domain violation"이라 명시됨.

대신 design 결정에 따른 conditional 결과:

- **만약 Designer가 "mission을 첫 세션 onboarding의 hero verb chain으로 본다"고 결정하면** → Path E (homepage hero) 또는 Path A (garden tab embed). PR decomposition 위 § A 또는 § E 따름. cost ~110~315줄.
- **만약 Designer가 "mission을 daily retention의 ambient hook으로 본다"고 결정하면** → Path B (floating dock) 또는 A. cost ~110~420줄. desktop은 `desktop-ui-redesign` SideDock에 fold 권고.
- **만약 Art Director가 "mission이 dock cluster의 5번째 sibling"이라 결정하면** → desktop은 SideDock fold + 모바일은 Path A (dual). cost ~280~400줄. 단 `desktop-ui-redesign` Cycle 1과 PR3(dock 가변 확장) 머지 후에만 진입 가능.
- **만약 셋 다 합의 못하고 Director가 minimal로 갈라면** → Path A (garden tab embed, 1 PR ~110줄, conflict 0, design intent 가장 약함).

Engineer는 cost 1/4인 Path A를 "쉬워서 좋다"고 추천하지 않는다. design intent의 강도는 Designer/Art Director가 정한다. cost는 그 결정의 trade-off로만 제시됨.

---

## Verification: 본 proposal이 brief 위반 없음

- [x] 5탭 골격 보존 — Path D 거부 명시.
- [x] mission 데이터·로직 변경 0 — Files Touched § "무관/안 건드림 invariant" 명시.
- [x] save 호환성 — Save Migration Plan § "0 migration" 명시.
- [x] 모바일 우선 — § Disagreements §2에서 desktop-only fold 거부.
- [x] PR ≤ 500줄, ≤ 5 파일 — 모든 option PR 분할이 soft 준수.
- [x] bundle ≤ +10KB gz — 모든 option 단독 통과. C/E + desktop-ui-redesign 합산 시 borderline 명시.
- [x] 신규 컴포넌트 < 5 — 최대 Path C의 2개.
- [x] `npm run check:ci` 통과 — Verification Commands § 명시.

## References

- Brief: `reports/deliberation/mission-ux-visibility/brief.md`
- Persona: `docs/studio/personas/engineer.md`
- Workflow: `docs/studio/DELIBERATION_WORKFLOW.md`
- 상위 axis spec (PR sequence dependency): `reports/deliberation/desktop-ui-redesign/spec.md`
- Code: `src/App.tsx` (5671줄), `src/styles.css` (7677줄), `src/data/missions.json`, `src/types/game.ts`, `src/lib/persistence.ts`, `package.json` `check:ci`
