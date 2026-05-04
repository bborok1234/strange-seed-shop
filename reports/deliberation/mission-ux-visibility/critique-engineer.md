# Critique — Engineer (Mission UX Visibility)

- Axis slug: `mission-ux-visibility`
- Persona: Engineer (개발자)
- Phase: 3 (cross-critique)
- Date: 2026-05-04
- Author: Engineer seat
- Inputs: brief.md / persona / Designer proposal / Art Director proposal / 본인 proposal / `desktop-ui-redesign/spec.md`

> 본 critique는 cost-only 결론을 issue하지 않는다 (첫 dogfood retrospective 학습). 모든 비판은 기술 fact + 회귀 surface + save/perf grounds로만 한다. design intent 자체를 cost로 깎지 않으며, 깎고 싶은 영역은 "trade-off 형태"로만 표시한다.

---

## 1. Disagreements with Designer

### D1. (P0, save invariant 침범 위험) "튜토리얼 3종 모두 claimed 후 collapse 또는 unmount" 결정의 영속화 책임 누락

- Designer Open Q1: "데일리만 남기되 cluster 자체는 visible 유지"를 default로 두고, "튜토리얼 row collapse"를 권고함.
- 그러나 collapse 상태 자체는 PlayerSave에 저장될 곳이 없다. `claimedMissionIds`는 mission claim 여부만 기록하고, "튜토리얼 그룹이 collapse된 적 있다" 같은 UI 상태 flag는 없음. 본 axis brief constraint #3 (save 호환성) 보존을 지키려면 collapse 상태는 (a) `claimedMissionIds.length === 3 && tutorial 3종 모두 포함` 같은 derived state로 매번 계산하거나, (b) 신규 localStorage namespace 도입.
- 본인 proposal § Save Migration Plan에서 (a)를 default로 명시했고, derived state는 `visibleMissions` (`App.tsx:643`) 직후 ~5줄 추가로 충분. Designer 안은 이 derivation이 "어디서 어떻게 계산되는가"를 명시 안 함 — Engineer 영역인 건 맞으나 spec.md에 derivation 위치가 lock-in되지 않으면 PR 단계에서 임시로 React useState로 가는 회귀 risk.
- **요청**: Designer가 collapse 상태를 (a) save invariant 보존 derivation 또는 (b) 신규 localStorage 중 하나로 spec.md에 명시 고정해 줄 것. 본인은 (a) 권고, cost ~5~10줄.

### D2. (P0, dual-implementation 부채) Mobile vertical stack ↔ Desktop dock cluster의 "같은 컴포넌트" 가정 불완전

- Designer §Screen Flow: "데스크톱 dock의 col-span-3 vertical 영역에 mission cluster가 4번째 sibling으로 자연 합류"하고 "같은 컴포넌트가 dock에 들어감"이라고 가정.
- 그러나 mobile에서 mission cluster의 위치는 "다음 행동 aside 바로 아래 vertical stack" — 즉 모바일에서는 `garden-stage` 내부 React tree 안에 mount. desktop에서는 Art Director 안의 `SideDock` 안에 mount. **두 mount 지점이 React tree 상 다른 형제 노드**다.
- "같은 컴포넌트"가 두 다른 parent에 conditional mount되려면 `useDesktopLayout()` 분기 + portal 또는 duplicate mount 둘 중 하나. duplicate mount는 React state 분열, portal은 z-index/style cascade 회귀 surface. Designer 안의 "1 surface 결정" 가정이 실제 React 구현에서는 **2 mount point**로 갈라진다.
- **Trade-off**: 진정한 1 surface로 만들려면 mobile-desktop 모두 같은 parent(예: dock) 안에 mount해야 하는데, mobile은 dock 자체가 없음 (`desktop-ui-redesign` spec § Layout Skeleton, mobile = `[stage] [bottom-tabs]`만). 결국 (i) mobile은 stage 내부 / desktop은 dock 내부 dual mount 채택 (cost ~+40~80줄, prop drilling 1단계 추가) 또는 (ii) "1 컴포넌트 1 mount + viewport 분기 CSS"로 dock 안에만 mount하고 mobile에서는 dock을 fixed bottom으로 변환 (cost ~+120~200줄, brief constraint #4 모바일 우선과 충돌 risk). Designer가 둘 중 하나를 명시해야 함.

### D3. (P1, render budget) Tier 1 "claim ready promote" 정책의 reorder 비용

- Designer Information Hierarchy Tier 1: "claim 가능한 mission이 1개라도 있으면 그 행이 cluster 최상단으로 promote".
- 이는 `visibleMissions` 배열을 매 render마다 reorder하는 sort 또는 partition 호출이 추가됨을 의미. 현재 `visibleMissions`는 (`App.tsx:643`) `content.missions` 그대로 — 6개짜리이므로 sort cost 자체는 무시 가능 (O(6 log 6)).
- 그러나 React reconciliation 측면에서 **row의 key 순서가 매 render 변동**하면 row DOM이 unmount/remount될 가능성. 특히 motion이 발화되는 행이 reorder되면 motion 중간에 row가 unmount → motion이 끊김 → Art Director Motion Vocabulary §3 (`gesture.chapter` 720ms claim ready spike)와 충돌.
- **Trade-off**: (i) sort 결과를 row index가 아니라 mission `id`로 key 처리 (이미 구현 가능, cost 0~5줄, motion은 row가 reorder되는 동안 transform animate) 또는 (ii) "promote"를 **reorder가 아니라 visual emphasis로만 처리** (badge·glow만, row 위치는 고정. cost 0줄, design intent 약화). Designer는 (i)을 의도한 것으로 보이나 spec.md에 명시 안 됨 — promote의 의미를 "DOM reorder vs visual emphasis only"로 lock-in 필요.

### D4. (P2, design intent 약화 trade-off) "데일리 mission이 2개 이상 동시 ready" 케이스 (Designer Open Q2)

- Designer가 본인 Open Q2에서 인정한 ambiguity. claim 1탭성을 깨지 않는 한 어느 옵션이든 가능하다고 했으나, "최상단 1개 promote + 나머지는 row 안에서 reward 강조" default는 player가 second/third claim을 위해 추가 saccade를 해야 함 — Designer 본인의 V1 Glance "1세션당 5초 미만" budget과 borderline.
- Engineer 관점 비용: 어느 옵션이든 cost 차이 ~10~20줄. 그러나 "모두 같은 weight stacked" 옵션 채택 시 Tier 1과 Tier 3가 시각적으로 합쳐짐 → Art Director의 secondary cluster 위계와 충돌.
- **Trade-off**: 비용은 작으나 design intent 분기가 큼 — Director 결정 영역.

### D5. (P2, trade-off only) "5탭 골격 보존 + Garden home base + verb mismatch 회피" 3 조건의 결과로서 surface 단일성 정당화는 logic은 맞으나, 그 결과 mission이 "Garden 탭에서만 보임"

- 즉 mobile player가 첫 진입 시 다른 4탭(씨앗·도감·원정·상점)에 있다면 mission UI 0. brief Success criteria "production player가 켰을 때 mission의 존재를 인지"는 충족하지만, 다른 탭 진입 시 mission visibility 0이 design intent로 의도된 것인지 명시 부재.
- **Trade-off**: 다른 4탭에도 mission strip을 cross-cut하면 Path A' (~250줄, 1 PR)로 비용 ~2배. 단 verb mismatch 우려 (Designer가 거부한 이유). 즉 cost ↑ vs verb mismatch trade-off — Director가 결단 필요.

---

## 2. Disagreements with Art Director

### A1. (P0, token cost) `spacing.row.mission` 신규 alias 1종 도입의 정당화 약함

- Art Director Design Tokens § "신규 alias 1종 — 정당화": `spacing.row.mission` (값 `spacing.3xl` ~ `spacing.4xl`).
- 그러나 동일 정당화 ("mobile-desktop continuity")는 **기존 `spacing.3xl/4xl` 직접 사용**으로도 충족. row 높이 = `spacing.3xl`로 고정하거나 `clamp(spacing.3xl, ..., spacing.4xl)`로 처리하면 신규 토큰 0종.
- `desktop-ui-redesign` spec § Decisions Resolved §5 ("신규 토큰만 desktop region 한정, rename 별도 axis")의 정신은 신규 토큰 도입 자체에 보수적. mission UX axis는 그보다 작은 axis이고 brief Out of Scope 신규 asset 0의 정신에 align하면 신규 토큰 0종이 가장 honest.
- **Trade-off**: `spacing.row.mission` alias 도입 시 향후 mission 외 ambient row(예: dock의 album mini progress)도 같은 토큰을 쓰게 되면 vocabulary 확장 정당화 가능. 그러나 본 axis 안에서는 단일 use site → vocabulary 분열 risk가 더 큼. 본인 권고: 신규 토큰 0종, 기존 `spacing.3xl/4xl` 직접 참조. cost delta -1 token line ~ -3줄.

### A2. (P0, PR sequencing) `desktop-ui-redesign` Cycle 1 PR2 (SideDock 4 cluster)에 mission cluster를 5번째 sibling으로 추가하면 PR2 LOC budget 위반

- Art Director Layout Grid § Desktop: "currency cluster ↘ next-action chip ↘ active expedition card ↘ `mission cluster` ↘ album mini progress 순"으로 mission을 SideDock 안 4번째에 두는 안.
- `desktop-ui-redesign` spec § Implementation Sequence PR2 추정: "~280-380줄, SideDock 컴포넌트 + 4 cluster vertical stack". Art Director 안대로 mission cluster를 5번째에 추가하면 PR2가 +120~180줄 추가 (mission row 컴포넌트 + claim button + state). PR2 합산 ~400~560줄 — `desktop-ui-redesign` spec brief soft constraint "PR ≤ 500줄" borderline 또는 위반.
- **Trade-off**: (i) mission cluster를 PR2에 합치면 PR 1개 절약, LOC 위반 risk. (ii) 본 axis가 별도 PR (PR2.5)로 SideDock 안 mount만 추가하면 PR LOC budget 안 — 단 `desktop-ui-redesign` Cycle 1과 본 axis가 직렬 관계 명시 필요 (본인 proposal § Disagreements §5). Art Director가 (i) PR2 통합을 선호한다면 PR2 LOC budget 재산정 필요. 본인 권고: (ii).

### A3. (P0, 모바일 dual-implementation 부채) `mission-strip` (mobile horizontal scroll-snap) + `dock cluster` (desktop) 두 surface

- Art Director Layout Grid § Mobile: "`garden-stage` 내부 `top-bar` ↔ `actionSurfaceClassName` 사이의 `mission-strip` 라인 — 한 줄짜리 horizontal scroll-snap strip (높이 `spacing.4xl` = 64px)".
- Art Director Layout Grid § Desktop: "`SideDock` 내부 cluster ... vertical stack: 튜토리얼 active 1개 + 데일리 3개".
- 즉 본 안은 **mobile horizontal scroll-snap strip + desktop vertical stack**의 두 layout 패턴 dual implementation. 같은 mission row 컴포넌트라도 부모 layout이 다르므로 (i) row 컴포넌트는 layout-agnostic하게 작성 (flex direction prop 또는 CSS-only 분기) + (ii) 모바일은 daily mission이 별도로 "다음 행동 aside 안의 secondary cluster"로 분기 = 즉 **모바일에서만 mission이 2 mount point** (strip + aside cluster).
- 본인 proposal § Files Touched Path A 추정 ~80~140줄은 단일 mount 가정. Art Director 안 채택 시 ~280~400줄 / 2~3 mount point + horizontal scroll-snap CSS + onboarding window 후 collapsed pill 전환 로직 추가 — Path B의 cost와 비슷.
- **Trade-off**: (i) Art Director 안 채택 시 cost ~3~4배, mobile 회귀 surface 증가, scroll-snap의 webview 회귀 spike 1시간 필요 (Art Director 본인이 critique 2에서 인정). (ii) mobile은 단일 vertical stack(Path A)로 단순화하면 Art Director의 art ≥ 60% stage 약속 일부 위반 — Designer Tier 2 (header 1줄)와 합쳐서 stack 높이 budget 재계산 필요. **Director가 art-bible 60% 약속 vs cost 3배의 trade-off를 결단**.

### A4. (P1, motion vocabulary 일관성) `gesture.chapter` 720ms를 mobile collapsed pill에서도 발화 — Art Director 본인 Open Q2가 제기한 cramped risk

- Art Director Open Q2: "mobile pill collapsed 상태에서 720ms motion은 cramped할 수 있어 designer/engineer cross-check 필요".
- Engineer 관점: 720ms motion 자체의 perf cost는 무시 (Phaser tween budget과 무관, CSS transition만). 그러나 collapsed pill (높이 `spacing.lg` ≈ 24px)에서 720ms `chapter` 발화는 motion이 노출될 viewport 면적 자체가 작아 player가 인지 못할 가능성 — 즉 motion 발화 비용을 지불하고 효과 0.
- Art Director critique 3 ("타협 가능 지점: 데일리는 420ms `gesture.reveal`로 다운그레이드")가 부분 답이지만, **본 axis spec.md에 mobile pill collapsed 상태에서 motion 발화 정책을 명시 고정** 안 하면 PR 단계에서 임시 결정됨.
- **Trade-off**: (i) mobile collapsed pill에서는 motion 0 (cost -3줄, design intent: claim ready 시 player 시선 유도 약화), (ii) 데일리도 420ms로 다운그레이드 (Art Director 안), (iii) 720ms 그대로 (Art Director default). Director가 lock-in 필요.

### A5. (P2, lens) 신규 컴포넌트 수 budget 측면 — Art Director 안의 `mission cluster` (desktop) + `mission-strip` (mobile) + `mission row` 공통 + collapsed pill = 컴포넌트 4개

- 본 axis brief soft constraint: "신규 컴포넌트 도입은 OK이나 5개 미만 권장". Art Director 안 채택 시 4개 — borderline 통과지만, Designer 안의 단일 vertical stack(컴포넌트 1~2개)과 비교 시 컴포넌트 수 +2~3.
- 향후 유지보수 측면 (persona "다음 사람이 무엇 때문에 욕하는가"): 컴포넌트 4개는 mission 관련 변경마다 4곳 동시 수정 risk. Art Director의 "row 컴포넌트 1개 + 부모 layout 분기"가 명시 안 된 상태에서는 PR 단계에서 컴포넌트 4개로 갈라질 가능성.
- **Trade-off**: Art Director가 row 컴포넌트 단일화 + parent layout 분기를 spec.md에 명시하면 컴포넌트 수 ~2개로 줄어듦. Director가 Art Director에게 명시 요청 권고.

---

## 3. Self-Critique (본인 proposal § engineer.md)

### S1. (가장 honest한 self-critique) Path B/C/E의 LOC 추정에 motion vocabulary cost 누락

- 본인 proposal § Cost Map per Placement Option 표에서 "tween 추가" 컬럼을 별도로 처리했으나, Art Director가 제시한 5 시점 motion(reveal/ambient/chapter/tap/celebrate) cost를 LOC 추정에 합산 안 함.
- 특히 Path B (floating dock card)와 Art Director의 Mobile horizontal scroll-snap + onboarding window 전환 motion까지 합치면 본인 Path A 추정 ~80~140줄은 +60~120줄 추가 (CSS keyframes·transition·@media motion variant). 즉 **본인 proposal의 cost 산정은 Designer/Art Director 결정 후 ~+50% 재산정 필요**.
- 영향: 본인이 "Path A (~110줄) < Path E (~315줄) < Path B (~350줄)"으로 ranking했으나 motion cost 합산 시 ranking 자체는 보존되되 절대값이 모두 ~30~50% 증가. brief soft "PR ≤ 500줄"에 borderline 가까워짐 — Path C가 brief soft 위반 risk로 격상.

### S2. (Phase 2에서 놓친 것) `desktop-ui-redesign` spec § Decisions Resolved §6 가정("데스크톱 player의 active 세션은 5~20분, verb 빈도의 80%는 Garden plot tap")이 본 axis의 mobile-desktop placement 결정에 직접 영향을 미친다는 점을 본인 § Open Questions에 명시 안 함

- 데스크톱 player가 active 5~20분 세션이라면 dock 안 mission cluster는 player 시선이 8~20분 동안 머무는 surface — 즉 dock cluster 위계가 본 axis의 핵심 결정 요소가 됨. 본인 proposal은 placement만 cost 매핑하고 "데스크톱 vs 모바일 player 비중"이라는 상위 axis 가정을 inherit한다고 명시 안 함.
- 영향: Director synthesis 단계에서 본 axis를 desktop session 가정과 분리해서 결정하면 후속 telemetry axis (`desktop-session-telemetry`) 결과로 본 axis 결정이 뒤집힐 risk 있음. 본인이 § Open Questions Q4에 "production sink 확인" 정도만 적었으나 그 위 layer (player viewport 비중)는 누락.

### S3. (cost-only 우려) 본인 § Conditional Conclusion이 "cost 1/4인 Path A를 쉬워서 좋다고 추천하지 않는다"고 명시했으나, **Path A의 LOC 추정 자체가 비교 anchor로 작용해서 Director가 무의식 anchor lock-in될 risk**

- brief § "사전 옵션 sketch (anchor lock-in 주의 — Critic brief-level 4-4 학습)" 정신에 부합하지 않음. 본인 cost 표가 Director synthesis에 anchor로 작용할 risk를 본인이 인지하고도 표를 그대로 둠.
- 영향: Director가 design intent보다 cost ranking을 먼저 본다면 Path A로 lock-in될 가능성. 본 critique에서 본인 표 자체를 "Director가 design 결정 후 그 path만 cost 참조"로 사용 권고를 명시.

---

## 4. Cross-Cutting Risks (3 proposals 함께 읽었을 때만 보이는 것)

### CCR1. (P0, mobile placement 충돌) Designer "다음 행동 aside 바로 아래" + Art Director "top-bar ↔ actionSurfaceClassName 사이 strip" — mobile placement 위치가 다름

- Designer §Screen Flow: mobile mission cluster 위치 = "다음 행동 aside **바로 아래** vertical stack".
- Art Director §Layout Grid Mobile: mission strip 위치 = "garden-stage 내부 top-bar ↔ actionSurfaceClassName **사이의** mission-strip 라인" + "Daily mission은 mobile에서는 다음 행동 aside 안의 secondary cluster".
- 두 안이 mission UI를 mobile에서 어디에 둘지 **명시적으로 다름**. Designer는 다음 행동 chip "아래", Art Director는 top-bar ↔ next-action "사이" + daily는 next-action 안. 같은 화면 영역(top-bar / next-action / stage / bottom-tabs)에서 미세 위치 차이가 모바일 verb 충돌을 만듦.
- Director synthesis 단계에서 **mobile mission UI 위치 1곳을 명시 lock-in** 필요. 본인 권고: Designer 안(next-action 아래)이 Art Director 안(stage 내부 strip)보다 stage 면적 침범이 적으므로 brief constraint #4 모바일 우선 정신에 더 부합. 단 Art Director의 art ≥ 60% stage 약속과 충돌 — Director 결단 영역.

### CCR2. (P0, surface 단일성 ↔ 도달성 trade-off) Designer는 1 surface(Garden tab 안 dock), Art Director는 사실상 dual surface(mobile strip + desktop dock cluster) — brief Success "production player가 켰을 때 mission의 존재를 인지" 충족 방식이 두 안에서 다름

- Designer 안: Garden 탭에서 mission visible. 다른 4탭에서는 invisible. → Garden 탭이 default landing이라는 가정에 의존.
- Art Director 안: mobile은 stage 내부 strip(Garden 탭 한정), desktop은 SideDock(어느 surface 진입해도 visible). → desktop은 도달성 ↑, mobile은 Designer와 동일.
- 두 안 모두 Garden 탭 landing 가정. 만약 player가 직전 세션에서 다른 탭(예: 도감)에서 종료해서 다음 세션에 도감 탭으로 진입하면 mobile mission 0. 이는 `App.tsx` 어딘가에서 `activeTab` 영속화 여부 확인 필요 — 영속 안 되면 모든 entry가 garden default로 리셋됨 (low risk), 영속되면 brief Success 위반 가능 (high risk).
- 본인 proposal § Save Migration Plan 영역 — 추가 verification spike 30분 필요.

### CCR3. (P1, motion vocabulary lock-in vs invariant) Art Director motion 5 시점이 `desktop-ui-redesign` spec § Design Tokens motion vocabulary 안에 들어가지만, 그 vocabulary 자체가 **현재 ship된 keyframes 12종과 alias 안 된 상태** (`desktop-ui-redesign` spec § Removed/deferred에 명시)

- 즉 본 axis가 ship되면 `gesture.chapter`·`gesture.celebrate` 등 신규 토큰을 사용하는데, 동시에 기존 `tap-bounce`·`reward-pop` 등 12 keyframes도 mission 인근에서 살아 있음. dual motion vocabulary 병존 → 다음 사람이 어느 토큰 쓸지 매번 결정.
- `desktop-ui-redesign` spec § Risks "신규 토큰 5종 + 기존 `--space-*`/`--radius-panel` 병존으로 dual vocabulary 발생" 우려가 motion vocabulary에서도 동일 발생.
- Trade-off: (i) 본 axis에서 mission UX motion만 5 gesture 적용, alias remap은 별도 axis 그대로. cost 0 추가, dual vocabulary 부채 ↑. (ii) 본 axis에서 mission 인근 keyframes (`harvest-ready`·`reward-pop`)를 5 gesture에 alias remap. cost ~+30~80줄, scope creep risk.
- 본인 권고: (i). scope creep은 persona MUST NOT.

### CCR4. (P1, `stageHeroCreature` 영역 충돌) Art Director Mobile mission-strip 위치 = top-bar ↔ next-action 사이 — `stageHeroCreature` (현 `garden-panel` 안 absolute)와 같은 React tree 영역

- `desktop-ui-redesign` spec § Component Composition: `stageHeroCreature`는 stage region 내부 lower-third ambient 띠로 desktop 이전, mobile은 그대로 garden-panel 안 absolute.
- Art Director mission-strip이 stage 내부에 mount되면 mobile에서 `stageHeroCreature`와 stack context·z-index 분쟁 가능. mission-strip 등장 motion(`gesture.reveal`)이 stageHeroCreature와 viewport 면적 경합.
- 본인 proposal § Files Touched에는 `GardenPlayfieldHost.tsx` 0줄 invariant로 명시했으나, Art Director 안 채택 시 garden-panel 인근 CSS는 손대야 함 — invariant 0줄은 보존되되 형제 CSS scope 회귀 surface 증가.

### CCR5. (P2, `desktop-ui-redesign` Cycle 1 직렬 ↔ 병렬 결정 미결) 3 proposal 모두 "본 axis는 `desktop-ui-redesign` 직렬"인지 "병렬 가능"인지 명시 안 함

- Designer는 desktop은 "같은 컴포넌트가 dock의 col-span-3 vertical 영역에 자연 들어감"이라고 dock 존재 가정 → `desktop-ui-redesign` Cycle 1 PR2 머지 후 진입 전제.
- Art Director는 SideDock·rail 등 desktop spec region 명시적 의존 → 동일 전제.
- 본인 proposal § Disagreements §5에서만 "Path A는 conflict 0 → 병렬 가능, Path B/C/E는 직렬 필수"로 conditional 명시.
- Director synthesis에서 **본 axis 진입 시점을 `desktop-ui-redesign` Cycle 1 PR2 (SideDock) 머지 직후로 lock-in** 필요. 그렇지 않으면 PR conflict 99%.

---

## 5. Concessions (delta-cost 추정 포함)

### C1. Designer D2 trade-off — mobile-desktop dual mount 인정

- 본인 proposal § Path A는 단일 mount 가정으로 ~80~140줄로 추정. Designer "1 surface" intent 보존하되 mobile-desktop 다른 React tree mount는 불가피하다는 사실 인정.
- **Delta cost**: Path A 단독 + dual mount viewport 분기 = ~140~220줄 (기존 +60~80줄). PR 1개 유지 가능, brief soft "≤ 500줄" 보존.
- **Trade-off**: design intent "1 surface" 유지 + Engineer "dual mount" 명시 = honest. spec.md에 명시 필요.

### C2. Art Director A3 trade-off — mobile horizontal scroll-snap 비용 인정 (단, Art Director critique 2의 evidence 조건 부 채택)

- 본인 proposal § Disagreements는 horizontal scroll-snap의 webview 회귀를 spike 1시간으로 처리. Art Director critique 2가 본인 cost 우려에 evidence 1건을 요구 — 이는 정당.
- 만약 webview 회귀 evidence 0건이라면 horizontal scroll-snap 채택 (cost +40~60줄, ~`scroll-snap-type: x mandatory` + peek cue). 회귀 evidence ≥ 1건이면 mobile vertical stack + max-height clamp + overflow-y-auto fallback (cost +20~40줄).
- **Delta cost**: +20~60줄, PR 1개 안.

### C3. Art Director A4 trade-off — `gesture.chapter` 720ms motion의 mobile collapsed pill 발화 정책

- 본인 권고 (i): mobile collapsed pill에서 motion 0, 데스크톱 cluster에서만 720ms 발화. cost -3줄, design intent 일부 약화 (Art Director claim ready spike 효과가 mobile에서 0).
- 또는 (ii): Art Director critique 3 타협 (튜토리얼만 720ms, 데일리 420ms). cost +5~10줄, motion variant 1개 추가.
- **Delta cost**: -3 ~ +10줄. design intent vs vocabulary 단순성 trade-off — Director 결단.

### C4. Art Director A1 trade-off — `spacing.row.mission` alias 0 도입 권고

- Art Director가 alias 1종 도입 정당화. 본인은 기존 `spacing.3xl/4xl` 직접 사용으로 충족 가능 → 신규 토큰 0종.
- **Delta cost**: -1 token line ~ -3줄. vocabulary 분열 risk 회피.
- 본인이 잡는 영역 — Art Director persona "MUST push back on raw hex/px"의 친구. token 신설은 신중.

### C5. cross-cutting CCR5 인정 — `desktop-ui-redesign` Cycle 1 PR2 머지 후 본 axis 진입을 spec.md에 lock-in

- 본인 proposal § Disagreements §5에서 conditional만 명시. Director synthesis에서 lock-in 필수임을 본 critique에서 강하게 권고.
- **Delta cost**: 0줄 (sequencing 결정). 단 본 axis ship 일정이 `desktop-ui-redesign` Cycle 1 ship에 의존 → 본 axis ETA = `desktop-ui-redesign` Cycle 1 종료 + ~3~5일.

---

## 6. Verification: 본 critique이 persona/workflow 위반 없음

- [x] cost-only 결론 0개 — 모든 비판이 기술 grounds (save invariant / dual mount / motion vocabulary / PR sequencing) 기반.
- [x] design intent 무단 깎기 0건 — 모든 cut 제안은 trade-off 형태 + delta cost.
- [x] section당 ≤ 5 항목 (D1~D5, A1~A5, S1~S3, CCR1~CCR5, C1~C5).
- [x] 자기 proposal 자체 약점 1개 이상 self-critique (S1~S3, 특히 S3는 cost-only anchor risk 자기 인정).
- [x] 본인 proposal 본문 0줄 수정 (read only).
- [x] 신규 옵션 제안 0건 — 기존 path A~E 안에서만 trade-off 명시.
- [x] 한국어 작성.

## References

- Brief: `reports/deliberation/mission-ux-visibility/brief.md`
- Persona: `docs/studio/personas/engineer.md`
- 본인 proposal: `reports/deliberation/mission-ux-visibility/proposals/engineer.md`
- Designer proposal: `reports/deliberation/mission-ux-visibility/proposals/designer.md`
- Art Director proposal: `reports/deliberation/mission-ux-visibility/proposals/art-director.md`
- Reference spec: `reports/deliberation/desktop-ui-redesign/spec.md`
- Workflow: `docs/studio/DELIBERATION_WORKFLOW.md`
