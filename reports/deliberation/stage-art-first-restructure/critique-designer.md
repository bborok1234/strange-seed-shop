# Critique — Designer (Phase 3 Cross-Critique)

- Axis: `stage-art-first-restructure`
- Persona: Designer (게임 기획자)
- Phase: 3 (cross-critique, 모든 specialist proposal 본 후)
- Date: 2026-05-04
- Frozen Phase 2 proposal: `proposals/designer.md` (수정 금지, 본 file에서만 self-critique 추가)

---

## Disagreement with Art Director

(Art Director proposal: `proposals/art-director.md` — Paradigm D "Art-Plate Hybrid" 권고)

### D1. L3 decal alpha 0.62는 verb 1·2·3에 묶인 정보가 아닌 "시각 ambient"에만 적용되어야 한다 (high)

Art Director § 1 Stage 안 영역 점유 약속에서 `stage 안 React-overlay cream pixels ≤ 20%`라고 못 박고, § 2에서 `stage-action-decal (row 6, col 5-8)`이 "다음 verb 1줄"을 담는다고 적었다. 그런데 본인 Phase 2 § Information Hierarchy의 명시 결정은 **"next-action은 dock에만, stage 안 L2 eyebrow 1줄"**이다 — Art Director의 stage-action-decal은 본인 Designer 결정의 정면 위반이다. action-decal이 organic leaf shape이든 cream rectangle이든, **stage 안에 "다음 verb"를 담는 또 다른 정보 표면을 두면** 사용자가 "어디를 봐야 하는가"가 다시 모호해진다 (Cycle 1 starter-panel + dock 양쪽 중복의 mechanic 원인). leaf shape으로 organic하게 만든다고 그 hierarchy 문제는 풀리지 않는다.

→ 요청: stage-action-decal을 폐기하거나, stage-eyebrow 1줄과 합쳐서 "stage 안 next-action 표면 1개" 약속으로 줄여라. dock 중복 금지.

### D2. 신규 motion gesture `settle` 추가는 verb 무대 결정 전에 token부터 키우는 순서 오류 (medium)

Art Director § 4 신규 motion 토큰 표에서 `motion.gesture.settle`을 6번째 gesture로 추가한다. 본인 입장: 이 axis의 핵심 결정은 **"verb 1·2·3을 art 안으로 옮기는가"**이지 decal entrance motion vocabulary가 아니다. settle gesture가 reveal/celebrate와 시각적으로 어떻게 "명확히 다른 gesture"인지 (Art Director § 8 Q4 자기 인정)는 player verb context와 묶여야 결정될 수 있다 — 본 axis가 L1 in-canvas diegetic UI를 ship 결정하면 settle은 L1 ↔ L3 발화 차이의 일부로 의미를 갖고, ship 안 하면 그냥 reveal의 변형이다. **token 결정이 paradigm 결정을 앞서면 안 된다.**

→ 요청: settle 추가는 본 axis Cycle 1 안에서 보류. paradigm 적용 후 실제 decal 진입 motion이 reveal로 충분한지 측정 후 별도 PR로.

### D3. "art share ≥ 75%" 측정이 player verb의 art-anchored 비율을 측정하지 않는다 (high — 본 axis의 hidden failure mode)

Art Director § 1 측정 약속의 핵심 수치는 `stage 안 art-only pixels ≥ 75%` + `cream pixels ≤ 20%`다. 이건 **픽셀 점유율**만 측정한다. 본인 Phase 2 § Information Hierarchy 마지막 측정 약속(`player 시선이 첫 5초에 art → plot → dock 순서로 흘러가는지 유저 테스팅`)은 다르다 — **verb의 무대가 art인가**를 본다. Art Director의 측정으로는 다음 시나리오가 모두 통과한다: stage 75%가 art 배경판이고, 25%가 dock으로 옮긴 cream 카드이고, **player verb 1·2·3이 모두 dock 카드 안에서 발생**. 픽셀 통과 + verb 무대 실패 = Cycle 1과 동일한 "기술적 통과, 사용자 가치 미달".

→ 요청: spec § Acceptance Criteria에 픽셀 측정과 함께 "verb-anchored measurement" 명시 — plot tap 발화 좌표가 Phaser canvas 안인지, claim button 좌표가 art layer 위인지. 픽셀 + verb 무대 둘 다 통과해야 axis 회복.

### D4. Tier 5 ephemeral moment의 dock 위 throughpass 결정 (medium, 본인 Q5와 직접 충돌)

Art Director § 5 motion 일관성 약속 마지막 줄: "Tier 5 ephemeral moment(reward, milestone): ... `z.stage.moment` 위로 올라옴, **dock·rail 위로 떠올라도 OK**". 본인 Phase 2 Open Q5는 reward celebration 무대를 **본 axis 안에서 결정 권고**라고 적었고, art-first 패러다임에서는 **stage 위 floating이 자연스럽다**고 입장 표명. 두 입장이 directionally 같지만 Art Director는 `dock·rail 위로 떠올라도 OK`로 cross-region을 default 허용했다 — 본인 입장은 stage 안 floating이 default, dock/rail 위 떠오름은 예외. 정원 art가 무대인데 reward가 dock cream 위에서 발화하면 "정원에 들어왔다" 감각이 다시 분산된다.

→ 요청: Tier 5 default = stage 안 floating. cross-region throughpass는 case-by-case (album_3 같은 milestone만), reward tick 같은 빈도 높은 moment는 stage 위 stay.

---

## Disagreement with Engineer

(Engineer proposal: `proposals/engineer.md` — paradigm-neutral, infra-first PR 분해)

### E1. PR-INFRA-2의 "시각 noop이 아닌 호흡 회복" 단독 머지는 사용자 가치 음수 (high)

Engineer PR-INFRA-2 (`.starter-panel max-height 무효화` + `.garden-panel 절대좌표 → grid flow`) 단독 머지가 "패러다임 적용을 위한 청소 단계"라고 적혔다. 본인 Phase 2 § Screen Flow 변경 표에서는 **"`.starter-panel` 완전 폐기 + onboarding modal 1회성 대체"**가 한 묶음이다 — max-height만 풀고 콘텐츠를 그대로 남기면 콘텐츠가 자연스럽게 흐르면서 stage 면적의 더 큰 부분을 점유하는 cream 띠가 만들어진다 (overflow scroll 대신 verbose stack). 사용자 시각 인상은 "Cycle 1보다 cream이 더 늘어남". `check:art-share` fail이 되고 (Engineer가 자기 Open Q5에서 인정), 그 fail을 임시 skip하는 옵션이 들어오면 enforcement 약속 자체가 hollow.

→ 요청: PR-INFRA-2를 "starter-panel 폐기 + onboarding modal 신규 + max-height 해소"의 한 PR로 묶거나, 패러다임 첫 PR과 동일 cycle에 묶어라. 청소 단독 머지 거부.

### E2. paradigm "권장 = X 명시 거부"는 persona contract 보호이지만 본 axis에서는 hand-off 책임 회피 (medium)

Engineer 결론 첫 줄 "패러다임 선택은 Designer + Art Director 영역, 본 proposal은 cost/risk만 평행 제시"는 persona MUST NOT 정신과 align이다. 단 본 axis는 brief에 **3-region grid 골격 유지 + GardenScene mechanic 변경 0** 같은 강한 Engineer-domain 제약이 있고, 그 제약이 paradigm A(Canvas-first)를 사실상 무력화한다 (Engineer 자기 Open Q1: "GardenScene 경계가 chrome layer 추가까지 막는가? 막으면 A는 후보에서 사실상 제외"). **이 boundary 결정은 Engineer가 spec phase에서 이미 답을 내야 Designer/Art Director가 paradigm을 잠근다** — "Director가 결정"으로 미루면 paradigm lock이 늦어지고 PR-INFRA-1 측정 임계값도 못 정한다.

→ 요청: spec phase 진입 전 Engineer가 Q1에 명시 답("GardenScene 경계는 mechanic 변경 0이면 chrome layer 추가 OK / NO")을 적어라. Designer는 그 답에 따라 L1 in-canvas diegetic UI ship 여부 결정.

### E3. Bundle "+10KB gzipped" 재협상이 paradigm 선택에 정면 영향 (high)

Engineer Performance Budget § Bundle size에서 paradigm A는 +12~24KB, C는 +14~28KB로 brief soft constraint를 정면 위반한다고 명시. **재협상 옵션 (a) brief constraint를 +20KB로 완화** 가능성을 제시했다. 본인 Phase 2 § Disagreements I Anticipate에서 "L1 in-canvas diegetic UI는 본 axis 안에서 ship 필수"라고 push 했는데, 그 L1이 A의 in-canvas 요소라면 +12~24KB가 본 axis에 들어온다. **bundle constraint 재협상이 시각 paradigm 결정과 묶이는데 둘이 다른 phase에서 결정되면** 사용자 가치 약속이 또 quietly 깎인다 (Cycle 1 패턴 재발).

→ 요청: Director synthesis 단계에서 "L1 ship 결정 = bundle constraint 재협상 결정"이 한 줄에서 이뤄져야 함. 별도 결정으로 분리 금지. Designer는 +20KB까지 양보 가능 (player-feel core 우선), 그 이상은 다음 axis로 deferral 협상.

### E4. `check:art-share` 임계값을 "spec.md acceptance criteria가 source-of-truth"로 미룬 것이 Designer 영역 침해 위험 (medium)

Engineer Open Q3에서 임계값(3:1 vs 4.5:1)을 spec.md에서 옮겨온다고 적었다. 본인 Phase 2 § Information Hierarchy의 측정 약속은 픽셀 비율 + verb 무대인데, Engineer 측정 인프라는 `stageArtBackgroundPixelRatio`, `stageReactPanelCreamRatio`, `dockBgVsStageBgContrastRatio`, `dockCardVsDockBgContrastRatio` 4종이고 verb-anchored measurement는 없다 (D3와 동일 우려). spec.md에서 이 4종만 acceptance로 옮기면 Designer의 "verb의 무대" 약속이 측정 인프라에 잡히지 않고 또 quietly 빠진다.

→ 요청: spec § Acceptance에 verb-anchored measurement 추가 명시. Engineer는 "이 측정은 인프라 자동화 대상 외, 사용자 review gate 책임"이라고 명시하든가, 자동화 가능한 proxy(예: plot tap 좌표가 Phaser canvas region 안에서 발화하는지의 spec) 제시.

---

## Self-critique (only I can see)

### S1. "L1 in-canvas diegetic UI ship 필수"는 본인이 verb 무대 lock-in을 하면서 Engineer cost를 사전에 양보 못한 약점

본인 Phase 2 § Disagreements I Anticipate Engineer 절에서 "L1 없으면 verb의 무대는 art가 아니게 된다 ... L1은 본 axis의 player-feel core"라고 못 박았다. 그런데 본인 자신이 그 절 안에서 "비용이 많이 들면 stage 면적 일부를 양보해서라도 L1 ship을 우선"이라고 적었다 — 즉 **L1 ship이 안 되는 시나리오에서 본인이 무엇을 양보할지 우선순위를 미리 적지 않았다.** Engineer가 +12~24KB cost를 명시한 지금, 본인이 양보 가능한 것의 후보 (예: stage-creature-decal 폐기, dock 4 cluster → 3 cluster 축소, L4 reward celebration 단순화)를 사전에 ranked로 적었어야 Director synthesis가 cost-bound paradigm 선택을 빠르게 할 수 있다. 본인 proposal은 "L1 우선" 한 마디로 닫고 trade-off 후보를 비워뒀다 — 이건 **Designer가 trade-off의 무게를 Director에게 떠넘긴** 패턴이고, Cycle 1 회고에서 학습한 "implementation 갭"의 design-side 원인 중 하나다.

→ 본인이 spec phase에서 답해야 할 질문: L1 ship cost가 budget을 정면 위반한다면 (a) L1 범위 축소(plot 위 % badge만, "수확!" chip 별도 axis), (b) stage-creature-decal 폐기, (c) dock cluster 축소, (d) L4 celebration 별도 axis 중 어느 순서로 양보하는가. Director synthesis 전에 본인이 ranked 적어야.

---

## Cross-cutting risks

(여러 proposal을 함께 읽어야 보이는 risk, 우선순위 정렬, 5개 이내)

### CR1. Art Director "픽셀 ≥ 75%" + Engineer "측정 자동화 ≥ 0.55" + Designer "verb 무대" — **세 측정이 다른 단위, 한 spec에 동시 명시되면 또 위반** (highest)

Art Director § 1 약속은 `≥ 75%` (Cycle 1 70%의 회복+강화). Engineer PR-INFRA-1 임계값은 `stageArtBackgroundPixelRatio >= 0.55` (목표 0.70은 명시했지만 fail line은 0.55). 본인 Phase 2는 `art ≥ 70%` (brief 인용). **spec.md에 세 수치가 동시에 들어가면** implementation은 가장 약한 0.55만 통과하고 75%/70%는 quietly 미달한다 (Cycle 1 spec § Decisions §1의 70% 약속 vs implementation 25% 도달 = 동일 패턴). Director synthesis가 한 수치로 통일하지 않으면 enforcement 자체가 ambiguous.

→ 요청: spec § Acceptance에 단 하나의 art-share 수치 + 그 수치의 측정 ROI(viewport 픽셀 vs shell 픽셀, Engineer Q2)를 한 줄에 명시. fail line과 target line을 분리해 적되 fail line이 사용자 가치 약속의 baseline.

### CR2. Art Director paradigm D + Engineer paradigm-neutral cost 표 + Designer 5-layer composition — **세 안의 layer 정의가 1:1 mapping 안 됨** (high)

Art Director § 2 sub-layout: L1 background plate / L2 canvas stage / L3 floating overlay (3 layer). 본인 Phase 2 § Screen Flow: L0 stage canvas / L1 in-stage diegetic UI / L2 edge ambient overlay / L3 side dock / L4 reward celebration (5 layer, dock 포함). Engineer 표는 layer 정의 없이 paradigm A/B/C/D만. **세 vocabulary가 다르면 spec.md 작성 시 어느 layer 명명을 source-of-truth로 할지 결정 비용이 발생**하고, implementation은 그 중 가장 친숙한 React 카드 vocabulary로 회귀할 위험. Cycle 1의 "spec promise를 코드가 다른 단어로 옮김" 패턴.

→ 요청: spec § Vocabulary section을 명시 추가. Art Director의 L1/L2/L3 (z-axis 명명)와 Designer의 L0~L4 (verb-region 명명)를 한 표에서 mapping. Engineer measurement도 그 vocabulary 사용.

### CR3. Art Director § 9 enforcement 5 gate + Engineer Verification 4 항목 + Designer measurement 약속 — **사용자 review gate가 자동 측정 통과 후 또 reject할 수 있는 escape valve가 명시되지 않음** (high)

Art Director § 9 (5) "사용자가 '정원에 들어왔다' 인상 못 받으면 spec re-open". Engineer Verification gate "check:art-share 통과 + Art Director critique pass = mergeable". 본인 Phase 2 § Information Hierarchy "유저 테스팅 1주 dogfood". 셋 다 사용자 review를 명시하지만 **자동 측정 통과 + critique pass 후 사용자 reject가 들어왔을 때의 rollback 또는 re-spec 절차가 없다** — 이게 Cycle 1의 mechanic 결함이었다 (체크리스트 100% 통과 → 머지 → 사용자 critique → 새 axis). Cycle 1 학습이 새 enforcement gate에 묶여 있지 않다.

→ 요청: spec § Acceptance에 "사용자 reject 시 즉시 revert 또는 follow-up axis trigger" 명시. 자동 측정 통과 단독으로 axis closing 금지.

### CR4. Mobile 회귀 0 약속이 desktop에서 도입한 신규 token (`color.surface.dock.warm` 변경, alpha 0.62 decal 등)과 충돌 가능 (medium)

Art Director § 4 modify 표에서 `--color-surface-dock: #fffbe9 → #f6ebcf`로 **변수 자체를 변경**한다고 적었다 (mobile에서는 그대로 변경 적용). brief Non-negotiable #2 "모바일 viewport(≤480px) snapshot 회귀 0"은 시각적으로 dock 색이 mobile에서도 바뀌면 위반이다. Engineer는 Files Touched에서 mobile 회귀 0 보장이 risk source라고만 적고 토큰 변경의 mobile 영향을 추적 안 했다. **공유 토큰 변경이 desktop intent로 들어와 mobile snapshot을 깬다**는 것은 Designer 영역(player journey의 mobile 무사함)이지만 cross-cutting risk이므로 본인이 raise.

→ 요청: token 변경은 mobile alias 분리(`--color-surface-dock-mobile` 유지 + `--color-surface-dock` desktop 한정) 또는 mobile snapshot baseline 사전 갱신 + 시각 차이 사용자 사전 승인.

### CR5. Art Director Q1 (widescreen 배경판 자산 추가 여부) + Engineer A 패러다임 sprite asset 추가 + Designer L1 diegetic UI 자산 — **신규 asset 의사결정이 세 proposal에 분산되어 있고 priority 충돌** (medium)

Art Director § 6 신규 자산 표 priority: `decal_action_leaf_frame_001` high, `bg_greenhouse_day_002_warmsun` high. Engineer paradigm A는 chrome sprite 0~4종, B는 frame asset 0~4종. 본인은 L1 in-canvas diegetic UI에 sprite/font 의존성 있다고 Engineer 우려 인용. **세 안의 자산 priority가 통합 안 되면** Art 팀이 어느 것부터 그릴지 결정이 안 된다. brief Soft constraint는 자산 추가 OK이지만 **Cycle 1과 동일한 schedule 부담**으로 또 quietly 자산 없이 ship되면 paradigm 약속이 약화된다.

→ 요청: spec § Asset Plan에 신규 자산 ranked 우선순위(예: 1. widescreen bg, 2. action decal frame, 3. L1 diegetic font/badge, 4. creature decal frame) 명시 + 각 자산이 paradigm 약속의 어느 측정에 묶이는지 mapping. Art 팀 schedule 가시화.

---

## Concessions

(다른 proposal 입장 중 본인이 양보 가능한 것)

### C1. Art Director paradigm D "Art-Plate Hybrid" 채택 — paradigm 명명은 양보, 본인 Phase 2의 5-layer composition을 D의 L1/L2/L3 안에 mapping 가능

본인 Phase 2 § Screen Flow에서 5-layer를 제안했지만 z-axis 명명은 Art Director 영역. Art Director의 L1 background / L2 canvas / L3 floating overlay vocabulary를 채택하고, Designer의 L0(art) = AD's L1+L2, L1(in-stage diegetic) = AD's L2 안 sprite, L2(edge ambient) = AD's L3, L3(dock) = stage 외 region, L4(reward) = AD's z.stage.moment로 mapping. 두 vocabulary 통합 (CR2 요청과 align).

### C2. Engineer "권장 paradigm 명시 거부 + cost 평행 제시"의 persona contract 정합성 인정

본인 Phase 2 § Disagreements I Anticipate에서 Engineer가 "구현 비용 이유로 player intent 깎을 때 push back"이라고 적었지만, Engineer는 정면 깎지 않고 cost를 명시 후 재협상 옵션을 제시했다 (Bundle +20KB 재협상). 이는 persona contract와 align이며 Designer가 "L1 ship 우선" trade-off를 자기 영역에서 답할 책임이 있다는 정당한 hand-off (S1과 align).

### C3. Art Director § 4 신규 token 6종 + 신규 motion gesture 1개 중 — color/spacing/radius 토큰 5종은 양보 (Designer 영역 외), settle gesture만 D2에서 보류 push

Color/spacing/radius/elevation 토큰 결정은 본인 persona MUST NOT (시각 변수 영역). Art Director 권한 인정. settle gesture만 paradigm lock 후 측정 단계로 미루는 의견 유지 (D2).

### C4. Engineer infra-first PR 순서 (PR-INFRA-1 먼저 머지 → 패러다임 PR) 채택

본인 Phase 2는 PR 순서를 적지 않았다. Engineer 학습("측정 인프라가 먼저 들어가야 후속 PR의 art-share 위반을 자동 캐치")은 Cycle 1 회고와 정확히 align. PR-INFRA-1 우선 머지 채택. 단 PR-INFRA-2 단독 머지는 E1에서 거부 (단독 머지 시 사용자 가치 음수).

### C5. Art Director § 9 enforcement 5 gate 중 (1)~(4) 자동 측정 채택, (5) 사용자 review gate를 spec § Acceptance의 binding clause로 격상 push

Art Director 5 gate가 본 axis Cycle 1 회복의 enforcement 척추. Designer는 (1)~(4)에 verb-anchored measurement 추가 (D3, E4) 요청, (5) 사용자 review를 자동 통과 후 escape valve로 binding (CR3) 요청. 5 gate 자체는 채택.

---

## References

- Phase 2 본인 proposal: `reports/deliberation/stage-art-first-restructure/proposals/designer.md` (frozen)
- Art Director Phase 2: `reports/deliberation/stage-art-first-restructure/proposals/art-director.md`
- Engineer Phase 2: `reports/deliberation/stage-art-first-restructure/proposals/engineer.md`
- Brief: `reports/deliberation/stage-art-first-restructure/brief.md`
- 페르소나: `docs/studio/personas/designer.md`
- Workflow: `docs/studio/DELIBERATION_WORKFLOW.md` § Phase 3
- 사용자 critique: 2026-05-04/05 ("정원 의미 퇴색, UI/패널로 다 뭉갬, 아트팀 역할 없음")
