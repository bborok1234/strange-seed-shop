# Critique — Game Designer (Mission UX Visibility, Phase 3)

> Phase 3 cross-critique. 본 문서는 다른 4개 산출물(art-director.md, engineer.md)에 대한 Designer의 disagreement + 자기 proposal self-critique + cross-cutting risk를 담는다. Phase 2 isolation에서 작성된 내 proposal(`proposals/designer.md`)은 frozen, 새 옵션 0개. Senior Critic의 critique은 Phase 3 동시 산출이라 본 시점 미열람.

---

## Disagreement with Art Director

### D1. "mission은 verb가 아니라 verb의 부산물" 위계 정의에 대한 정면 반박

Art Director는 `art-director.md` Visual Hierarchy 섹션에서 다음과 같이 적었다:

> "mission은 본래 **세션 verb의 부산물**(plot tap → 진행, 수확 → 진행, 구매 → 진행)이지 verb 자체가 아님. 따라서 시각 위계에서 mission은 ... Secondary (ambient information)"

이는 player journey 분석 측면에서 명백한 오독이다. 내 proposal Player Verb 섹션에서 정의한 V2 Claim — "준비된 보상을 받는다 (잎 +X 버튼 1탭)" — 은 그 자체로 player의 적극적 verb이지 부산물이 아니다. plot tap·수확은 **mission progress를 누적시키는 행동**이지만, **claim 자체는 다른 verb로는 발화되지 않는 mission 고유 verb**다. 이 verb를 secondary ambient로 묶으면 brief가 명시한 핵심 문제 — "claim UI가 활성화되어도 player가 클릭할 surface가 없어 mission reward가 실질적으로 dead reward" — 가 해결되지 않는다. dead reward를 살리려면 claim 시점에 visual weight가 1순위여야 한다. Art Director 본인이 "claim ready 전환" 시점에 `gesture.chapter` 720ms 발화를 인정한 것 자체가 V2가 ambient가 아님을 자백한다.

### D2. Mobile horizontal scroll-snap strip의 player verb 비용 (3-tap 룰 위반 우려)

Art Director는 Layout Grid 섹션에서:

> "mobile `mission-strip`은 **horizontal scroll-snap**. row max 4개가 한 화면에 펼쳐지지 않고 1개씩 swipe로 보임."

이건 페르소나 contract "한 verb를 위해 3 tap 이상 들면 redesign" 직격이다. 모바일 player의 V1 Glance("오늘 X/6 진행")가 1개 row만 보이는 strip에서는 swipe 3~5회로 환산된다. Art Director는 "우측 1.5번째 row peek + glow"로 cue를 준다고 했지만, peek은 **존재의 cue**일 뿐 **상태의 cue**가 아니다. 데일리 복귀 player는 "오늘 받기 가능한 게 몇 개?"의 답을 0 saccade로 얻어야 하는데, peek은 "남은 개수가 있다"만 알려준다. 내 proposal Information Hierarchy Tier 2가 "header 한 줄 X/6 · Y개 받기 가능"을 1순위 가까이 둔 이유다. swipe 모델은 "정독 화면을 만들지 않는다"는 내 player verb 배제 원칙과 충돌한다.

### D3. 데일리 mission은 "ambient secondary"라는 위계가 데일리 retention의 player journey와 맞지 않는다

Art Director는 데일리 cluster를 dock 4번째 stack item으로 두면서, "데일리 row만 좌측 4px strip에 약한 sun tint"를 타협안으로 제시했다. 그러나 내 Session Context 표 T2(데일리 복귀, 5분 짜투리 retention)에서 정의한 첫 saccade는 "오늘치 남았나?"이고, 이는 currency cluster 다음 두 번째 시선이어야 한다 — dock 4번째가 아니다. dock 순서가 currency → next-action → active expedition → mission이라면, expedition이 active가 아닌 player(데일리 복귀의 modal case)에게는 mission이 dock 3번째로 올라온다는 점을 Art Director가 의식하지 않았다. expedition active 여부에 따라 mission cluster 위치가 oscillation되는 건 player journey의 anchor를 깬다.

### D4. 튜토리얼 mission "첫 30초 일시 spike만, 영구 hide" 안의 onboarding 충돌 위험

Art Director Disagreements §1 타협안:

> "튜토리얼 mission 3종에 한해 첫 30초 동안 `gesture.chapter` 발화로 mission cluster 첫 row를 일시 시각 강화. 영구 위계 변경 없이 일시 spike만."

브리프 success 조건은 "튜토리얼 3종이 첫 세션 onboarding의 '다음 행동' guidance와 충돌 없음"이다. 첫 30초 spike는 **충돌의 원인**이지 해결이 아니다. T0 player에게 "다음 행동 chip"과 "spike된 mission row" 두 개가 동시에 시선을 끌면 verb의 single source of truth가 분열된다 (이건 Art Director가 D1에서 거부한 안과 동일한 violation). 내 proposal Onboarding 충돌 처리 섹션이 "튜토리얼 mission row = 다음 행동에 수반되는 reward preview로 읽혀야 하고 별도 spike 없음"을 정한 이유다. spike는 claim ready 시점에서만 정당하지 onboarding window에서 정당화되지 않는다.

### D5. "claim 모멘트 spike만 tertiary" 정의는 Tier 1 Claim Promotion 의도를 약화시킨다

내 Information Hierarchy Tier 1은 "claim 가능한 mission이 1개라도 있으면 그 행이 cluster 최상단으로 promote + cluster 안에서 가장 강한 시각 affordance"다. Art Director는 "tertiary spike 1.8s spike만"으로 한정했는데, **promotion은 spike가 아니라 영구 ordering**이다. claim ready row가 1.8s만 spike하고 secondary tone으로 복귀하면, 5초 후 화면을 본 player는 어느 row가 ready인지 다시 scan해야 한다. Tier 1의 정체성이 깨진다.

---

## Disagreement with Engineer

### E1. "Designer cost 1/4인 Path A를 추천하지 않는다"는 conditional 결론 자체는 동의하나, Path A를 default로 제시한 frame이 design intent를 단정한다

Engineer Conditional Conclusion 마지막 줄:

> "**만약 셋 다 합의 못하고 Director가 minimal로 갈라면** → Path A (garden tab embed, 1 PR ~110줄, conflict 0, design intent 가장 약함)."

이 frame은 default fallback을 Path A로 못박는다. 그러나 내 proposal은 **Garden 탭 내부 dock 영역의 Mission Cluster (영구 노출, claim 1탭)** 으로, 이건 Engineer 분류상 Path A(per-tab embed) **+** Path B(floating dock card 정신) 의 중간이다. "garden-panel 흐름 안에 통합"하는 Path A 그대로면 stage 면적과 verb 충돌이 나고, dock region을 별도 만들면 Path B 비용이 든다. Engineer가 내 안을 Path A에 흡수한 건 design intent의 폭을 좁힌다 — 페르소나 contract "구현 비용을 이유로 player intent를 깎을 때 default disagreement"에 해당하지 않더라도, **option taxonomy 자체가 design 안을 미리 분류해버리는 frame violation**이다.

### E2. Path C(modal)를 Designer 옵션 후보로 명시한 것 자체가 verb 분석 0인 옵션 추천

Engineer Cost Map은 Path C(modal)를 cost ~480줄로 산정만 하고 reject은 안 했다. 그러나 modal은 V1 Glance(0 tap) verb를 **trigger button 1탭 + modal open + scan + close**로 환산한다 — 최소 3 tap. 내 페르소나 contract 직격(3 tap 이상 redesign). Engineer가 "design 결정 영역이라 cost만 제시"라고 frame했지만, brief의 player verb 분석에서 명백히 reject되어야 할 옵션을 cost 칼럼에 올리는 행위 자체가 Director가 "modal 비용도 합리적이네" 고려할 surface를 만든다. Engineer Disagreements §4 "Path A는 design intent 약함 비판 시 cost가 1/4임을 명시할 뿐"이라고 했지만, 같은 잣대로 Path C는 verb 비용이 3배라는 정보가 Cost Map에 빠져있다. **tap 비용은 cost 영역이 아니라 design 영역** — 단 "Path X는 V1을 N tap으로 환산함"이라는 단순 fact는 Engineer가 cost 옆에 놓을 수 있어야 한다.

### E3. `desktop-ui-redesign` Cycle 1 종료 후 진입 권고가 brief의 "polish 22 PR ROI 회수" 동기와 충돌

Engineer Disagreements §5:

> "본 axis는 `desktop-ui-redesign` Cycle 1 종료 후 진입을 강력 권고."

Cycle 1이 5 PR 직렬이면 머지에 시간이 걸리는 동안 mission-adjacent polish PR은 **22개에서 더 늘어난다** (brief Why This Axis Now: "이 axis는 polish 회수의 ROI 자체를 결정"). Engineer가 conflict surface를 명시한 건 합리적이나, "병렬 가능한 Path A 단독 외 모두 직렬"이라는 결론은 design 결정을 사실상 Path A로 강제한다 (D1에서 지적한 frame violation의 실질적 효과). 페르소나 contract: Engineer가 "구현 비용·일정"을 이유로 design을 깎는 건 disagree by default. 동일 React tree 영역의 conflict는 **PR 간 순차 머지**로 해결할 문제이지 본 axis 결정을 미루는 문제가 아니다.

### E4. "production에 처음 노출되어 baseline 변경" 에 대한 design intent 검증 누락

Engineer Verification Commands § Path A:

> "snapshot baseline 갱신 (mission이 production에 처음 노출됨 → 의도된 baseline 변경. PR review 시 명시)."

이건 mechanical pass이지 design 검증이 아니다. brief Success after this axis:

> "production player가 켰을 때 mission의 존재를 인지한다 (UI surface 1곳 이상). ... `mission_reward_claimed` event가 production에서 발화 (현재 0 → 측정 가능 수준)."

Engineer Open Q4가 "telemetry 측정 방법"을 후속으로 미뤘는데, 본 axis 종료 시점에 player가 mission을 **인지**했는지 검증할 수 없으면 brief success 조건을 만족했다는 주장이 데이터로 뒷받침 안 된다. snapshot baseline 변경은 "DOM에 mount되었다"의 증명이지 "player가 봤다"의 증명이 아니다. Engineer가 telemetry sink 확인을 P1로 둔 건 Designer의 verb-claim 검증 도구를 0으로 만든다.

### E5. Edge case "이미 debug 모드에서 claim한 player가 production 진입 시 모두 완료 상태로만 보임"의 처리 책임 떠넘기기

Engineer Save Migration Plan Edge case:

> "단 첫 production 노출 시 '이미 받음' UI 6개만 보이는 player가 발생할 수 있음을 Designer에게 인지시킴 (UX flag, Engineer 결정 영역 외)."

이건 **legitimate state**가 아니라 **legitimate disaster**다. player가 mission UI를 처음 보는 순간 6개 모두 "받음"이면 "이게 뭐야?" 인지 → 다음 데일리 reset까지 mission 가시성 0 → brief success 조건 실패. Engineer가 "UX flag"라고 떠넘긴 건 페르소나 분업이 정확하지만, **save migration 0이라는 결정 자체가 이 edge case를 만든 원인**이므로 design 결정 전 Engineer가 "이 옵션이 있다 — debug-claimed 상태 1회 reset 또는 production 첫 진입 시 mission cluster onboarding overlay" 같은 surface를 cost map에 올렸어야 한다. Designer의 onboarding 시퀀스 설계 책임이지만 Engineer가 surface를 안 보여준 채 책임만 넘긴 것.

---

## Self-Critique of My Own Proposal

### S1. Garden 탭 vertical stack의 시각 면적 비용을 산정하지 않음 — 페르소나 contract 위반

내 proposal Screen Flow §"Garden 탭 내부에서의 위치 결정"은 "다음 행동 aside 바로 아래에 Mission Cluster를 vertical stack"으로 추가한다고 적었다. 그러나 **Garden stage(plot Phaser canvas + stageHeroCreature + 다음 행동 aside)가 이미 모바일 414×896 viewport에서 시각 면적의 ~70%를 점유**하는 사실을 명시하지 않았다. mission cluster 4 row × 48~64px = 192~256px 추가는 viewport 세로 21~29% 추가 점유이고, 이는 stage 면적을 침범한다. Art Director D1·D2가 이 점을 정조준한 게 우연이 아니다.

내 페르소나 책임 #3 — "screen flow와 화면 간 navigation 비용을 책임진다 — 한 verb를 위해 3 tap 이상 들면 redesign" — 의 정신은 tap 뿐 아니라 **stage scroll 비용**도 포함한다. mission cluster 추가로 plot tap을 위해 stage가 화면 밖으로 밀려 scroll이 필요해지면 V0(plot tap, 게임 main verb)이 망가진다. 내 안은 이 trade-off를 계산하지 않았다. **이건 Art Director나 Engineer가 critique 라운드에서 잡지 않으면 spec 단계에서 silently 약화될 약점**이다 — 본 self-critique가 Director에게 명시적으로 surfaced해야 한다.

대안 stub (proposal 수정 아님, self-aware만): Garden 탭 안 vertical stack이 stage scroll을 강제하면 "claim ready 시 일시 promotion + 평상시 collapsed pill 1줄" 같은 dynamic height 모델이 trade-off 후보다. 그러나 이 결정은 spec 단계 Director의 영역.

---

## Cross-cutting Risks

(여러 proposal을 함께 읽을 때만 보이는 risk. ≤ 5)

### R1. 세 proposal이 모두 "Garden tab home base 중심"으로 수렴했지만 mobile 시각 면적 budget을 아무도 quantitative로 잡지 않음

Designer(나) = Garden vertical stack, Art Director = Garden mobile strip(stage 내부) + dock(desktop), Engineer = Path A(garden tab embed)을 cost 1순위로 frame. 셋 다 garden을 home base로 합의하나, 모바일 viewport에서 **stage 면적 ≥ 60%(Art bible 정신)** 와 **mission cluster 영구 노출** 이 동시에 성립 가능한지 누구도 픽셀로 검증 안 함. spec 단계에서 stage scroll 발생 시 **모두가 silently 양보**하거나 **모두가 silently 자기 안 고집** 둘 중 하나로 갈 위험.

### R2. 튜토리얼 ↔ 데일리 transition (T1 → T2) 의 시각 안정성을 셋 다 명시 안 함

Designer Open Q1, Art Director Open Q3가 모두 "튜토리얼 claimed 후 collapse vs unmount vs persistent"을 미해결로 남김. Engineer는 cost 분기 자체를 안 둠. 튜토리얼 3종이 한 시점에 all-claimed로 전환되는 순간 **mission cluster 면적이 갑자기 줄거나 사라지면 Garden layout이 jump**한다. 이건 단일 PR 안에서 결정되어야 하는데 세 proposal 다 후속으로 미뤘다.

### R3. claim 보상 잎이 currency cluster까지 이동하는 reward feedback motion의 책임 boundary가 모호

Designer Open Q3, Art Director Motion §5(`gesture.celebrate` + `+X 잎` floating chip leaf-trail 재사용), Engineer는 motion 비용을 Path B에만 +1 tween으로 산정. 셋이 같은 motion을 가정하지만 **누구의 결정인지가 분산**. spec 단계에서 motion duration·trigger·동시성이 silently 떨어지면 reward loop의 closing tap이 약해진다. brief의 핵심 문제(dead reward)가 **claim까지는 살았는데 feedback이 죽는** 새 dead state로 displaced될 위험.

### R4. "이미 debug에서 claim한 player" edge case가 design+engineer 사이 공백에 떨어짐

Engineer Save Migration Edge case가 이 player의 첫 production 진입 시 "받음 6개"만 보이는 disaster를 명시했으나 책임을 Designer에게 떠넘김 (E5에서 비판한 동일). Designer proposal은 이 edge case를 인지 못 함. Art Director는 motion vocabulary만 다룸. **세 proposal 사이 공백**에 brief Success 조건 위반 케이스가 떨어진 상태.

### R5. `desktop-ui-redesign` spec과의 dependency가 Designer/Art Director는 "자연 흡수" 가정, Engineer는 "직렬 머지 권고"로 충돌

Designer는 "dock의 4번째 vertical card로 자연 합류" 가정. Art Director는 "desktop-ui-redesign §Decisions §1·§4·§5와 align" 명시 + dock 4번째 cluster. Engineer는 Cycle 1 5 PR 종료 후 진입 권고 (Path A 외 직렬). 이 셋이 spec.md 단계에서 수렴 안 되면 **mission UX가 desktop spec PR2(SideDock)와 같은 머지 window에서 충돌하거나, Cycle 1 종료 대기로 본 axis 머지가 1~2주 미뤄짐**. 후자가 발생하면 brief Why This Axis Now ("polish 22 PR ROI 0") 자체가 1~2주 동안 더 누적된다.

---

## Concessions

내가 Phase 4 Director synthesis에서 **양보 가능**한 영역과 **양보 불가**한 영역을 명시한다 (페르소나 contract: 가정과 절대선을 분리).

### 양보 가능

- **C1.** Garden 탭 vertical stack의 row 개수: max 4 row → 평상시 collapsed 2 row + ready 시 expand 4 row. self-critique S1의 stage 면적 압박을 줄이는 방향이라면 dynamic height 수용. 단 V1 Glance "오늘 X/6 한 줄 header"는 collapsed에서도 영구 노출.
- **C2.** Mobile placement: vertical stack 대신 Art Director의 "top-bar와 다음 행동 aside 사이 narrow strip" 수용 가능 — 단 horizontal swipe 모델은 거부(D2). vertical strip 또는 collapsed pill row 형태여야 함.
- **C3.** 데스크톱 처리: dock의 4번째 stack item으로 합류 (Art Director·Engineer 합의안). desktop-ui-redesign Cycle 1 PR2와 같은 머지 window면 같은 PR에 합쳐도 무방.
- **C4.** 튜토리얼 transition (R2): claimed 후 cluster에서 unmount + 데일리 cluster만 남김 (Open Q1의 양 옵션 중 unmount 쪽으로 양보 가능). Garden layout jump는 spec 단계에서 Art Director motion으로 흡수되어야 함을 조건으로.
- **C5.** Engineer Path A 단독 머지(병렬 진입) 채택 — 단, 본 axis spec.md가 desktop dock 합류 시점·trigger를 명시하고 후속 PR 1개로 fold (즉 본 axis는 "Path A + 후속 dock fold PR" 두 step).

### 양보 불가

- **N1.** V2 Claim 1-tap 비용: modal·full-screen 어떤 형태로도 trigger button + open + claim의 다단 verb로 환산되면 거부. brief 핵심 문제(dead reward) 미해결.
- **N2.** Tier 1 claim ready row의 cluster 최상단 promotion: 영구 ordering rule이지 1.8s spike만이 아님 (D5).
- **N3.** 튜토리얼 mission row의 첫 세션 spike: 다음 행동 chip과 verb 충돌하므로 거부 (D4).
- **N4.** mission cluster의 영구 노출: claim ready 때만 visible 같은 안은 V1 Glance를 0 tap → conditional N tap으로 깨므로 거부.
- **N5.** "이미 debug-claimed player" edge case 미해결인 채 머지: 최소 onboarding overlay 1줄 또는 production 진입 1회 reset 정책 중 하나는 spec.md에 명시되어야 함 (R4 / E5).

---

## Director Tie-Breaker 후보 (Designer 의견)

(spec.md Decisions Resolved에 들어갈 수 있도록 disagreement를 포지티브하게 정리)

1. **Mobile placement: stage 내부 narrow strip(Art Director) vs Garden vertical stack(Designer)** — stage 면적 budget 측정 후 결정. Designer는 vertical strip(swipe 아님)으로 양보 가능 (C2).
2. **claim ready 위계: Tier 1 영구 promotion(Designer) vs tertiary 1.8s spike만(Art Director)** — 양보 불가 N2. spec Decisions Resolved에 첫 entry 후보.
3. **`desktop-ui-redesign` Cycle 1과의 머지 순서: 직렬(Engineer) vs Path A 단독 병렬 + 후속 dock fold(Designer)** — Director 결정 필요. Designer는 후자 선호 (brief polish ROI 동기 보존).

---

*— Game Designer, Phase 3 cross-critique pass*
