# Critique — Art Director (아트 디렉터)

- Axis slug: `mission-ux-visibility`
- Persona: art-director
- Date: 2026-05-04
- Phase: 3 (cross-critique)

> 본 critique는 brief.md, art-director.md persona, designer.md proposal, engineer.md proposal, desktop-ui-redesign spec.md(§ Tokens / § Decisions §4 dock cluster hierarchy lock-in)을 모두 읽은 상태에서 작성. 본인의 proposal은 수정하지 않음. 신규 옵션 제안 0. 모든 시각 결정은 token / grid 좌표로만 호명.

---

## Disagreement with Designer (시각 위계 / token / motion / asset breathing)

### 1. "claim 버튼 = cluster 안에서 가장 강한 시각 affordance" → next-action chip의 hot-state weight를 흔든다

Designer Tier 1는 claim row를 cluster 최상단으로 promote하면서 claim 버튼을 "cluster 안에서 가장 강한 시각 affordance"로 정의함. 그러나 desktop spec § Decisions Resolved §4에서 **next-action chip의 hot-state(`color.accent.sun` glow + `motion.gesture.reveal`)가 dock 안 영구 시선 anchor로 lock-in**되어 있음. mission claim 버튼이 next-action chip과 같은 `color.accent.sun` family를 사용하면 같은 dock vertical stack 안에서 두 anchor가 동시 발화 → player가 어느 verb를 먼저 할지 시각 fork. 본 proposal §Motion 5번(`gesture.celebrate`)이 next-action hot-state(`gesture.reveal`)와 vocabulary 충돌하지 않도록 mission claim의 시각 weight는 chip hot-state를 **초과하지 않는 범위**여야 함을 Designer Tier 1가 인정해야 함.

### 2. cluster 최상단 promote 정책이 dock cluster 우선순위 lock-in과 충돌한다

Designer Tier 1는 claim ready row를 "cluster 최상단으로 promote"한다고 했으나, desktop spec §4가 잠근 dock cluster 우선순위는 `currency cluster top → next-action chip → active expedition → (이하)`임. mission cluster가 4번째 sibling으로 들어오는 본 proposal 위치 결정은 spec §4와 align하지만, Designer가 말하는 "최상단 promote"는 mission cluster **내부의 row 순서**인지 dock 전체에서 mission cluster의 **stack 위치**인지 모호. 후자라면 currency cluster를 밀어내는 안이고 spec §4 직접 위반. 이 모호성을 critique-round에서 명시 분리하지 않으면 PR2 단계에서 ad-hoc 결정됨.

### 3. "mission 별 아이콘 일러스트 의도적 hierarchy 제외"는 동의, 그러나 row 시각 구분의 burden을 chip 1개에 몰아넣는다

Designer Tier 4는 type chip 1개로 튜토리얼/데일리 구분. 본 proposal §Asset Composition은 row 좌측 4px 컬러 strip(`--state-ready` / `--text-muted`)으로 구분. **chip + strip 둘 다 도입하면 한 row 안에 type 시각 변수가 2개로 중복**되어 negative space ≥ 35% 약속 위협. 본 proposal의 4px strip이 더 ambient(영구 노출되어도 호흡 안 깨뜨림)이므로 chip은 onboarding window에만 노출하거나 양자택일 — Designer가 chip 자체를 "flat hierarchy" 시각 변수로 강조하면 proposal의 strip 안과 충돌. 본 proposal의 strip이 우선이라는 입장 유지.

### 4. mobile 처리 가정이 "Garden 탭 안 vertical stack"으로 stage 면적 ≥ 60% 약속을 깬다

Designer Screen Flow는 "다음 행동 aside 바로 아래 vertical stack"으로 mission cluster를 mobile에 둠. mobile viewport 414×896에서 다음 행동 aside 아래에 row 4개를 vertical stack하면, top-bar(`spacing.4xl`) + 다음 행동 + mission cluster(`spacing.row.mission` × 4 = 192~256px) + bottom-tabs(`spacing.4xl`)가 합쳐 stage 면적을 **60% 미만으로 누름**. 본 proposal §Layout의 mobile horizontal scroll-snap `mission-strip`(높이 `spacing.4xl` 1줄)이 stage breathing을 보존하는 유일한 안. Designer가 mobile vertical stack을 고집하면 art bible "stage가 호흡할 면적" 약속 위반 — 모바일 우선(brief Non-negotiable #4)이 layout 결정 자격이 가장 큰 viewport이므로 양보 불가.

### 5. "튜토리얼 row 사라지거나 collapse"의 motion 사양이 5 gesture vocabulary 안에 들어와야 함

Designer Screen Flow는 "튜토리얼 3개 모두 claimed 후 사라지거나 collapse 처리"라고만 적음. 사라짐(unmount)과 collapse는 **motion vocabulary가 다른 gesture**임. unmount는 `motion.gesture.celebrate` (claim 후 row 소멸 = reward family) 또는 `motion.gesture.reveal` 역재생, collapse는 `motion.gesture.ambient` (loop 톤). 본 proposal §Motion 5번에서 claim 직후는 `gesture.celebrate`로 lock-in했으나, **튜토리얼 3종 전체가 claimed 후 cluster 자체의 소멸/collapse 모멘트**는 별도 motion 시점이고 본 proposal Open Q3에 명시함. Designer가 이 모멘트를 "사라지거나 collapse"로 vague하게 두면 vocabulary 외 motion이 ad-hoc 발화될 risk. spec.md에서 둘 중 하나로 lock-in 필요.

---

## Disagreement with Engineer (cost calculus 시각 결과 lens)

### 1. Path A (per-tab embed 1 PR ~110줄) cost 우위가 시각 위계 결정 자격이 아니다

Engineer cost ranking은 A < A' < E < B < C 순. 그러나 Path A "garden tab 내부 영구"는 **stage 안에 mission row를 vertical로 누적**하는 안이고, 본 proposal §Visual Hierarchy의 mission = secondary ambient + stage = primary art-only 약속을 직접 침범함. Engineer가 LOC 80~140줄로 cost 1/4임을 이유로 Path A를 default로 제시하면, brief 시각 위계 결정이 cost 라인업으로 환원되는 것 — Art Director persona MUST push back 항목. cost는 **시각 위계 결정 후의 trade-off**이지 결정 그 자체가 아님. Engineer 본인 § Conditional Conclusion에서 "cost 1/4인 Path A를 쉬워서 좋다고 추천하지 않는다"고 적은 것이 정합 — 그러나 cost ranking 자체를 노출함으로써 Director synthesis 단계에서 anchor lock-in risk를 만듦.

### 2. Path A의 "garden tab 흐름 안에 mission-board 통합"이 stage 60% 면적 약속을 깬다

Engineer Path A의 시각 결과는 `garden-panel` 흐름 안에서 mission-board가 stage 위/아래에 vertical 추가됨. 모바일 viewport 414×896에서 `garden-panel` 흐름은 이미 top-bar + stage + 다음 행동 aside + bottom-tabs로 stage 면적이 빠듯함 — mission-board가 그 안에 들어오면 stage가 ≤ 50% 점유로 떨어짐. desktop spec §1 "stage = art-only zone"의 mobile 등가물 약속을 침범. Engineer cost 산정이 시각 결과를 보지 않으므로(persona 영역 외 정합) 이 시각 침범을 본 critique에서 명시.

### 3. Path B (floating dock card) cost 추정에서 mobile horizontal scroll-snap 비용 누락

Engineer Path B 추정 ~280~420줄, +2~4KB CSS. 그러나 본 proposal §Layout에서 mobile은 floating dock이 **dock 자체가 mount 안 되므로** stage 내부 `mission-strip`(horizontal scroll-snap) 한 줄이 dock의 역할 대신함. Engineer가 "Path B의 mobile breakpoint 처리: 모바일에서도 floating vs Path A로 fallback"을 Open Q3에 적었으나, 본 proposal default(`scroll-snap-type: x mandatory` 한 줄 native CSS)는 dual implementation 부채 없는 안. Engineer cost ranking이 mobile 변형을 dual implementation으로 추정하면 본 proposal의 단일 surface 결정이 cost 비싸게 보이는 가짜 frame 생성. 시각 결과(mobile strip = 한 줄, desktop dock = vertical stack)는 같은 컴포넌트의 viewport 분기이지 dual implementation이 아님.

### 4. Path C (modal) 거부 근거에 시각 침범 layer 누락

Engineer Path C cost ~380~580줄로 가장 비싸고 conflict surface 크다고만 적음. 그러나 시각 결과 lens에서 **modal은 stage 위 full-overlay**이고, brief Non-negotiable #4 "모바일 우선"과 desktop spec §1 "stage = art-only zone"을 동시 침범. Engineer cost-only 거부는 design 결정 불충분 — 시각 위계 lens에서도 Path C는 reject. Engineer의 "C 채택 시 desktop-ui-redesign Cycle 1 종료 이후 본 axis 진입을 권고" deferral은 시각 결과를 외면한 timing 답변. Path C는 timing이 아니라 **시각 layer 약속 위반**으로 reject되어야 함.

### 5. PR0.5 토큰 도입(desktop spec)과 본 axis의 `spacing.row.mission` alias 1종 도입 timing 충돌 risk

Engineer는 `desktop-ui-redesign` Cycle 1 5 PR과 직렬 vs 병렬 question을 Open Q1로 둠. 본 proposal §Tokens는 `spacing.row.mission` 1종 alias를 desktop spec PR0.5(token introduction PR)에 의존. **desktop spec PR0.5 머지 전에 본 axis가 ship되면 신규 alias 토큰의 base인 `spacing.3xl/4xl` 자체가 정의 안 된 상태**. Engineer cost map이 token 의존성 그래프를 표시 안 했으므로, Director synthesis가 Path A 병렬 머지를 채택하면 시각 spec 깨짐. Engineer가 cost map에 desktop spec PR0.5와의 token graph 의존성 1줄 추가 필요.

---

## Self-critique (시각 결과 lens)

### 1. mobile `mission-strip` horizontal scroll-snap의 visibility 가정이 telemetry 0

본 proposal §Asset Composition에서 mobile strip은 "horizontal scroll-snap, 우측 1.5번째 row peek"로 player가 mission이 1개뿐이라고 오해하지 않게 한다고 적음. 그러나 414px viewport에서 strip 높이 `spacing.4xl`(64px)이 자원 cluster와 다음 행동 chip 사이의 narrow band에 들어가면 **player 시선이 그 띠를 dead zone으로 인지할 risk**가 telemetry 없이는 검증 불가. 본 proposal Open Q1에서 stage 안 vs bottom-tabs 위 결정을 spec.md에 lock-in하라고 했으나, 두 위치 모두 dead zone risk를 안고 있음. 본 critique에서 이 risk를 honest 인정 — strip이 player에게 인지되지 않으면 mission cluster의 secondary ambient 위계 자체가 brief Success "production player가 mission의 존재를 인지" 조건을 만족 못 함. 이는 본 proposal의 가장 큰 시각 risk이고 Senior Critic이 §4에서 정확히 짚을 항목.

---

## Cross-cutting risks (proposal 3개를 같이 읽을 때만 보이는 risk, max 5)

### 1. Designer "다음 행동 aside 아래 vertical stack" + Engineer "Path A garden tab 흐름" + 본 proposal "mission = secondary ambient" 셋이 mobile에서 동시 발생하면 stage 면적 ≤ 40%로 붕괴

세 안의 mobile 처리가 각자는 자기 lane에서 합리적이지만, Director가 세 안을 union으로 합성하면 mobile stage가 art breathing 자체를 잃음. 본 proposal §Layout의 horizontal `mission-strip`이 셋 중 유일한 stage 면적 보존 안임을 spec.md에서 명시 lock-in 필요.

### 2. claim ready spike의 motion gesture 선택이 3 proposal에서 모두 다름 (Designer = 가장 강한 affordance, Engineer = collapse/expand `gesture.reveal`만, 본 proposal = `gesture.chapter` 720ms)

Director synthesis가 셋 중 하나를 lock-in하지 않으면 PR2 단계에서 ad-hoc 발화. desktop spec § Decisions §4 next-action chip hot-state(`gesture.reveal`)와 mission claim ready spike가 **같은 dock 안에서 vocabulary 충돌하지 않도록** spec.md에 motion 시점 5개 lock-in 강제 필요. 본 proposal §Motion 5 시점 mapping이 그 lock-in 후보.

### 3. desktop spec PR0.5 token introduction 의존성이 3 proposal 모두에 암묵적 — 명시 안 되면 token 미정의 상태로 본 axis ship

Designer는 "구체적 색·glow·motion duration은 Art Director" 위임, Engineer는 token graph 의존성 미산정, 본 proposal은 desktop spec § Tokens vocabulary 상속 default. 셋이 다 desktop spec PR0.5 머지를 전제하나 그 PR이 머지되기 전에 본 axis가 단독 ship 가능한지를 spec.md에서 결정 안 하면, Path A 병렬 머지 시 `color.accent.sun` / `motion.gesture.*` / `spacing.3xl/4xl` 모두 미정의 상태로 ship되어 시각 fallback이 발생.

### 4. 튜토리얼 mission 3종 모두 claimed 후 cluster 처리 — 3 proposal 모두 default가 다름

Designer "사라지거나 collapse", Engineer "(미언급)", 본 proposal "collapsed pill 1개로 축소(데일리 cluster 유지)" + Open Q3로 unmount 후보. 이 시점은 onboarding window 종료의 narrative beat이고 motion vocabulary가 결정되어야 vocabulary 분열 막음. spec.md에서 lock-in 필요.

### 5. mission claim 후 `+X 잎` chip이 currency cluster 방향으로 fly하는 leaf-trail motion이 active expedition card의 leaf-trail motion(#384 ship)과 dock 안에서 동시 발화 가능

Designer Open Q3가 정확히 짚음 — `triggerRewardPulse()` 공유 vs 별도 motion. 본 proposal §Motion 5번은 `gesture.celebrate` family + leaf-trail vocabulary 재사용으로 default 잡음. 그러나 dock vertical stack 안에서 mission claim의 leaf-trail과 active expedition의 leaf-trail이 동시 active되면 desktop spec § Risks "active tween ≤ 8개 budget"의 시각 동시성 budget을 침범. Engineer Path B verification에 명시된 spike가 본 axis에서도 필요.

---

## Concessions (다른 persona의 안에 양보 가능한 영역)

### 1. Designer "다음 행동과 mission이 같은 dock에 묶이면 closing the loop" 정합성 — 시각 위계 lens에서도 정합

Designer Screen Flow의 mission cluster가 다음 행동 aside와 같은 dock vertical stack에 들어가는 것은 본 proposal §Layout(desktop dock cluster의 4번째 stack item)과 align. 양보가 아니라 합의 — spec.md에서 mission cluster = dock 내 4번째 vertical stack item(currency → next-action → active expedition → mission)으로 lock-in.

### 2. Designer Tier 1 "claim 가능한 mission이 1개라도 있으면 그 행이 cluster 최상단으로 promote" — mission cluster **내부**의 row 순서로 한정하면 양보

본 proposal §Visual Hierarchy의 "tertiary spike 1.8s" 후 secondary 톤 복귀와 충돌하지 않으려면, promote는 cluster 내부 row 순서 변경(claim ready row가 cluster 최상단)에 한정. dock 전체 stack에서 mission cluster 위치가 변하지 않는 조건. 이 한정 하에 Designer 안 채택.

### 3. Engineer Path A 병렬 머지 가능성 — desktop spec PR0.5 token introduction 머지 후라면 양보

본 proposal §Disagreements I Anticipate 2번에서 horizontal scroll-snap의 native CSS 비용 강조. Engineer가 Path A를 desktop spec PR0.5 머지 후 ship하면 token graph 의존성 해소 + cost 1 PR ~110줄 + mobile은 본 proposal §Layout `mission-strip` 채택으로 stage 면적 보존. 이 조합이라면 양보 가능 — 단 mobile vertical stack 거부, horizontal strip 강제.

### 4. Engineer "mission_reward_claimed event 발화 검증" Verification — 시각 결과 검증과 묶기

Engineer Verification에서 production build 직접 클릭으로 trackEvent 발화 확인 명시. 본 proposal Open Q5(튜토리얼 mission 3종 첫 세션 평균 완료 시간 telemetry)와 같은 telemetry pipeline에 묶을 수 있음. 시각 검증이 아니지만 본 proposal의 onboarding window 정의가 telemetry로 검증되어야 시각 spec이 honest해짐 — Engineer Verification 안 채택 + 본 proposal Open Q5와 통합.

### 5. Engineer "Path D 6번째 탭 거부" 명시 — 본 proposal §Visual Hierarchy Anti-pattern 거부와 정합

bottom-tabs 6번째 슬롯은 본 proposal Anti-pattern §3에서 거부. Engineer가 brief Non-negotiable #1로 cost 산정 자체 생략한 것은 정합. 양보가 아니라 합의 — spec.md에서 명시 reject.

---

## References

- Brief: `reports/deliberation/mission-ux-visibility/brief.md`
- Persona: `docs/studio/personas/art-director.md`
- Workflow: `docs/studio/DELIBERATION_WORKFLOW.md`
- Own proposal (수정 안 함): `reports/deliberation/mission-ux-visibility/proposals/art-director.md`
- Designer proposal: `reports/deliberation/mission-ux-visibility/proposals/designer.md`
- Engineer proposal: `reports/deliberation/mission-ux-visibility/proposals/engineer.md`
- Reference (token / dock cluster lock-in): `reports/deliberation/desktop-ui-redesign/spec.md` § Design Tokens / § Decisions Resolved §1·§4·§5
