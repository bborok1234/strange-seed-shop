# Senior Critic — Mission UX Visibility 비평

- Phase 3 critique-only. Proposal 없음(설계상).
- 칭찬은 침묵으로 한다. 발언은 전부 challenge.

---

## 1. Hidden Assumptions per Proposal

### Designer (`proposals/designer.md`)

**A1 — "modal 세션은 5~10분 × 하루 1~3회"**
- L31에서 본인이 "데이터 0이므로 명시"라 자백. 그런데 그 자백한 가정 위에 "1세션 5초 미만 mission UI 머무름" → "single home dock 단일 surface" → "별도 mission 탭 거부"의 결론 chain 전체가 얹혀 있음.
- **Question**: 만약 modal 세션이 실제로는 30초짜리 short-burst(잎 회수만 하고 끄기) 또는 20분짜리 long-tail(원정 대기)이면 본 안의 verb hierarchy가 그대로 유지되나? 두 극단 모두에서 surface 결정이 같다면 그건 가정이 무력하다는 뜻이고, 다르다면 데이터 없이 결정 못 하는 axis다.

**A2 — "다음 행동 chip과 mission이 의미적으로 서로 보강한다"**
- L46. 그러나 보강의 근거가 "verb / reward feedback의 closing the loop"라는 본인 명명뿐. player가 두 개를 같은 시각 belt에서 같이 봤을 때 실제로 보강으로 읽는지 vs 중복으로 읽는지의 검증 0.
- **Question**: "다음 행동 = '첫 씨앗을 고르세요'"와 mission row "첫 씨앗 심기 0/1 +10잎"이 같은 stack에 같이 있을 때, player에게 두 정보 단위가 어떻게 다른가? 같은 verb의 두 표현이면 그건 보강이 아니라 중복이다.

**A3 — "튜토리얼 3개 모두 claimed 후 collapse는 verb-noise 회피"**
- L80, OQ1. 튜토리얼이 player의 첫 5분 안에 모두 끝난다는 가정 — 실제 완료율·완료 시간 데이터 0.
- **Question**: 만약 튜토리얼 3종이 실제로 첫 세션에 다 안 끝나고 평균 3-5세션에 걸쳐 진행되면, "튜토리얼 → 데일리" 전환을 surface가 자동 감지해도 player의 mental model은 여전히 onboarding window인가?

### Art Director (`proposals/art-director.md`)

**B1 — "mobile horizontal scroll-snap mission-strip이 narrow strip(64px)에서 player에게 인지된다"**
- §Disagreements §4에서 본인이 자가 self-defense하면서 "telemetry 없이 검증 못 함"이라 인정함. 그런데 그 인정 위에 mobile primary surface 결정이 그대로 lock-in됨.
- **Question**: top-bar(자원 cluster)와 다음 행동 chip 사이 64px narrow strip은, brief가 명시한 "production player가 켰을 때 mission의 존재를 인지" 성공 기준을 충족할 수 있다는 근거가 무엇인가? 가설이라면 검증 없이 lock-in 하지 말 것.

**B2 — "mission은 verb의 부산물이지 verb 자체가 아니다 → secondary 위계"**
- L16, L31. 그러나 brief는 "데일리 cycle 보상 +155잎/일을 받고 있다는 사실 자체를 모른다"를 핵심 문제로 진단함. 부산물 위계는 "이미 player가 verb를 알고 있다"는 가정 위에서만 부산물이 될 수 있다.
- **Question**: dead reward 회복이 본 axis의 axis-defining 문제인데, 그 회복을 secondary 위계로 demote하는 결정의 근거가 "AdVenture Capitalist precedent" 외에 무엇인가? 그 precedent가 우리 게임의 "감성 도감 + idle" 하이브리드 장르에 transfer 된다는 검증은?

**B3 — "신규 토큰 0종 default" + 하나만 alias 신설**
- L86, L103. desktop spec의 vocabulary lock-in을 mission axis까지 강제 — 그러나 mission UX 결정이 desktop spec의 vocabulary에 fit해야 한다는 inversion이 검증되지 않았다.
- **Question**: vocabulary에 fit하려고 motion·spacing이 결정된 것인지, vs mission UX의 진짜 needs 위에 vocabulary가 자연 fit한 것인지? 5 gesture mapping이 mission UX 5 시점에 정확히 1:1로 떨어진다는 게 너무 매끄럽지 않은가?

### Engineer (`proposals/engineer.md`)

**C1 — "Path A는 1 PR, conflict 0, cost 1/4"**
- L59, L216. 본인이 "Engineer cost-only 결론 금지"를 의식해 conditional로 깔았지만, 결론 §의 "minimal로 갈라면 Path A"가 사실상 default cheap path를 깔아둔 anchor.
- **Question**: cost map 자체가 design 결정의 anchor가 되는 걸 의식했음에도, "모두 합의 못하면 Path A"라는 default escape를 명시한 이유는 무엇인가? 그 default가 Director가 "어차피 합의 어려우니 A"로 흘러가는 path of least resistance를 만든다.

**C2 — "save migration 0이 모든 option 공통"**
- L107-116. 그런데 L114-116에서 "기존 player가 debug 모드에서 이미 mission claim한 상태로 production 진입 → 모든 mission 완료 상태로만 보임"의 edge case를 "legitimate"라며 마이그레이션 불필요로 분류함.
- **Question**: production 첫 노출 시 6개 모두 "이미 받음"으로만 보이는 player가 발생하는 게 brief의 success criteria("production player가 mission의 존재를 인지")를 충족하는가? 이건 마이그레이션 문제가 아니라 UX failure mode인데 Engineer가 "UX flag, 결정 영역 외"로 punt.

**C3 — "desktop-ui-redesign Cycle 1과 직렬 vs 병렬"**
- §Disagreements §5 + OQ1. 본 axis의 PR sequencing이 다른 axis 종료 일정에 종속됨을 명시. 그런데 그 종속 자체가 본 axis 결정 자체를 왜곡할 가능성에 대한 self-reflection 0.
- **Question**: "Cycle 1 종료 후 진입"이 강력 권고면, 본 axis의 path 결정이 Cycle 1과의 conflict 회피를 위해 Path A 쪽으로 자기검열되고 있지 않은가? Designer가 지적한 polish-bias의 구조적 사례.

---

## 2. Premature Consensus Risks

세 proposal이 **이미 너무 매끄럽게 align되어 있다**. 이건 위험 신호다.

- **세 사람 모두 mission이 별도 탭을 갖지 않는다는 데 동의** — Designer는 "5탭 골격 + verb noise"로, Art Director는 "non-negotiable + AdVenture Capitalist precedent"로, Engineer는 "Path D 거부"로. 셋 다 brief Non-negotiable §1을 그대로 흡수했고, 그 §1 자체에 challenge가 0건. brief가 anchor lock-in 했고 specialist 셋이 그걸 그대로 내재화했다.
- **세 사람 모두 "Garden 탭 / dock cluster"가 mission home이라는 데 수렴** — Designer는 "다음 행동 aside 아래 vertical stack", Art Director는 "dock cluster의 4번째 sibling", Engineer는 "Path A garden tab embed가 minimal default". 세 명이 다른 reasoning이라고 주장하지만 결과 surface가 같다 — 같은 결과면 reasoning 중 하나는 사후 정당화일 가능성.
- **셋 다 mobile-first에 동의** — brief Non-negotiable §4를 challenge 0. 그러나 "감성 도감 + idle 하이브리드"의 세션 분포가 정말 mobile-skewed인지 검증 없음. Art Director가 self-flag한 "telemetry 없음"이 세 proposal 공통 약점.
- **셋 다 Path C(modal) / Path E(homepage hero)를 묵시적으로 demote** — Designer는 "verb 정독 화면 거부", Art Director는 "mission이 primary surface 격상 거부", Engineer는 "C는 LOC ~480, E는 nextAction과 충돌"로. 셋 다 다른 각도로 같은 path를 깐다 — 어느 한 사람도 "modal이 player에게 더 honest할 가능성"을 진지하게 옹호하지 않음.

**즉**: 본 deliberation은 30분 안에 합의가 형성될 risk가 매우 높다. Director는 이 합의가 진짜 합의인지 vs brief framing이 specialist 사고를 narrow한 결과인지 구분해야 한다.

---

## 3. Inertia / Precedent Justifications Spotted

명시적 precedent 의존:

- Art Director L34: "AdVenture Capitalist의 unlock/objective는 화면 우측 좁은 vertical lane의 secondary 위계. Cookie Clicker의 achievement도 modal 안 secondary."
  - **반박**: idle 컨벤션 = 우리 컨벤션? 우리 게임은 brief에 "idle/tycoon + 감성 도감" 하이브리드라 명시. 감성 도감 쪽 컨벤션은 Tales of Maj'Eyal·Cult of the Lamb처럼 quest log가 primary 표면인 경우도 많음. 한 쪽 장르 컨벤션만 차용한 정당화는 절반.

- Designer L33: "AdVenture Capitalist / Cookie Clicker는 'objective HUD가 항상 시야 안, claim은 1탭'. 컨벤션을 따른다."
  - **반박**: "컨벤션을 따른다"가 reasoning을 대체. 컨벤션이 우리 player에게 정합한 이유가 1줄도 없다 — persona의 MUST push back §"precedent가 reasoning을 대체할 때" 직격.

- Designer L46-47: "desktop-ui-redesign spec § Decisions §6에서 dock region에 currency·next-action·active expedition을 vertical stack으로 묶기로 이미 결정됨. mission cluster가 이 stack의 4번째 요소로 자연 합류".
  - **반박**: 이전 spec 결정이 본 axis 결정을 자동 연장 — 이전 spec이 mission의 dock 합류를 염두에 두고 결정된 것이 아닌데도 "자연 합류"라 표현. 이건 path-of-least-resistance.

- Art Director L66-69, L86-87: "desktop spec § Design Tokens vocabulary 그대로 상속", "신규 토큰 0종 default", "vocabulary 확장 자격이 없음".
  - **반박**: 이전 spec의 vocabulary가 본 axis의 needs를 다 cover한다는 검증 없이, "이전 spec이 lock-in했으니 본 axis는 침범 안 함"이 reasoning. 이건 정확히 persona가 거부하라고 한 inertia 정당화.

- Engineer L189-193: "Cycle 1 spec § Risks 'studio-operate autonomous loop은 본 axis 종료까지 stop'을 본 axis도 동일 적용. 즉 두 axis는 직렬."
  - **반박**: 이전 axis의 risk 처리 정책을 본 axis에 자동 transfer. 본 axis의 risk profile이 다를 수 있다.

---

## 4. Brief-Level Challenges

본 axis brief 자체에 push back.

**B-1. "mission이 5탭 어디에도 자연 흡수 안 된다"는 brief의 자체 진단(L37)이 specialist 결정을 narrow했다.**
- brief가 "어디에도 안 들어간다"고 단정 → specialist 셋이 모두 "그러면 dock 또는 floating"으로 점프. brief가 만약 "씨앗 탭이 mission home 후보다(구매 verb와 데일리 mission이 합쳐짐)"를 옵션으로 던졌으면 다른 결론 가능. brief가 사전 진단으로 옵션 공간을 잘랐다.
- **Director에게**: brief의 "어디에도 흡수 안 됨"은 specialist의 분석 결과여야지 brief의 사전 결론이 아니어야 한다. 이 진단이 specialist 사고를 sketch lock-in 했음을 spec.md에서 명시 인정해야 한다.

**B-2. Non-negotiable §1 "5탭 골격 보존, 6번째 탭 거부"에 challenge 0건.**
- brief가 desktop-ui-redesign spec와의 일관성으로 정당화. 그러나 desktop spec 결정 시점에는 "mission UX axis"의 needs가 분석되지 않았음. 먼저 결정된 spec이 나중 axis의 옵션 공간을 잘라먹는 것이 정당한가?
- 6번째 탭이 본 axis에서 정당하지 않다는 reasoning이 "이전에 그렇게 결정했으니"가 아니라 "본 axis의 player verb 분석에서 mission이 별도 verb cluster를 형성하지 않으므로"여야 한다. 후자의 분석이 brief에도 specialist proposal에도 없음.
- **Director에게**: §1이 inertia가 아니라 본 axis의 분석에서도 동일 결론에 도달함을 spec.md에서 명시 입증할 것. 그게 안 되면 §1은 inertia.

**B-3. "사전 옵션 sketch 의도적 미제공"(L94-96) 자체가 anti-anchor의 형태로 또 하나의 anchor.**
- brief는 "옵션을 안 줬으니 specialist가 자유롭게 사고했다"고 가정. 그러나 옵션을 안 줬어도 brief의 "Current State" §의 "bottom dock / 별도 mission tab / quest log modal" 3종 명명(L33-36)이 이미 framing.
- Engineer는 그 framing을 그대로 흡수해 Path A~E를 만들었고, Designer/Art Director도 그 framing 안에서 결정.
- **Director에게**: anchor lock-in의 실제 회피는 옵션을 안 주는 것이 아니라 "이 axis가 진짜 묻는 것이 무엇인가"의 player-side question을 brief에 더 강하게 넣는 것. 본 brief는 "어디에 mission UI를 둘 것인가"를 물었지 "mission이 player에게 무슨 약속을 하는가"를 묻지 않았다.

**B-4. Success criteria L100 "production player가 켰을 때 mission의 존재를 인지" — 측정 불가 success.**
- "인지"의 정의 0. mission_reward_claimed event 발화율(L103)이 가장 가까운 proxy인데, 이건 인지가 아니라 conversion. 인지 ≠ conversion.
- **Director에게**: success criteria가 측정 불가이면 본 axis는 ship 후 평가 불가. spec.md에서 인지의 측정 가능 정의(예: "mission claim 가능 player 중 X% 이상이 24h 내 claim")를 lock-in 할 것.

**B-5. brief의 "관측" L24-29가 데이터를 제시하지만 그 데이터의 source 0.**
- "데일리 cycle 보상(총 +155잎/일)을 받고 있다는 사실 자체를 모른다" — player에게 물어봤는가? 그냥 logical inference인가? 후자라면 entire axis가 logical inference 위에 서 있다.
- **Director에게**: 이 관측이 추정인지 측정인지 spec.md에 명시. 추정이면 axis 결정의 confidence interval이 좁아진다.

---

## 5. Self-Critique (내가 challenge 못 한 / 흘려보낸 가정)

내가 본 round에서 흘려보낸 가정 1개를 명시:

**self-1. "claimedMissionIds 영속 + advanceMission 7곳 trigger가 production에서 정확히 작동한다"는 셋 다 무비판 수용했고 나도 challenge 못 했다.**
- Designer/Art Director/Engineer 모두 "데이터·로직이 정상 작동, UI만 부재"를 brief에서 그대로 받아들임. 그러나 brief L29 "production trigger 0 (UI 부재)"가 의미하는 것: production 코드 path에서 advanceMission이 정말 호출되는지의 검증이 0건이다(UI가 없으니 progress 측정 불가).
- 만약 advanceMission이 production code path에서 일부 trigger 누락(예: 원정 시작이 production build에서만 broken) 상태라면, 본 axis가 mission UI를 ship해도 mission이 영원히 ready 안 됨 → dead UI가 된다. UX axis 이전에 production data sanity check가 선결되어야 할 가능성.
- **인정**: 내가 본 round에서 "axis가 UX 결정이지 data 결정이 아니다"라는 brief의 framing을 그대로 받아 이 가능성을 표면화 못 했다. Director는 본 axis ship 전 production trace 1회로 6 mission의 advanceMission trigger가 다 발화됨을 확인할 것.

---

## 6. Director, do not skip these (spec.md "Decisions Resolved" 필수 질문)

Director가 spec.md에서 다음 3개를 명시 결단해야 한다 — 회피하면 deliberation이 거짓 합의로 종료된다.

### Q-D1. **mobile primary surface가 "stage 내부 64px narrow strip"인지 vs "별도 mount 위치(예: bottom-tabs 위 또는 다음 행동 chip 안에 fold)"인지를 lock-in.**
- Designer는 "다음 행동 aside 아래 vertical stack", Art Director는 "stage 내부 mission-strip horizontal scroll-snap"으로 **이미 mobile에서 disagree**. 두 안이 다른 mount 위치를 명시. 이게 정확히 spec.md "Decisions Resolved"에 가야 할 disagreement인데, 둘 다 본인 안만 default로 깔고 상대 안에 대한 명시 cross-reject가 약함.
- Director가 "stage 내부 strip" / "다음 행동 fold" / "bottom-tabs 위 band" 중 하나를 명시 lock-in 하지 않고 PR 단계로 넘기면, 그 단계의 ad-hoc 결정이 본 deliberation을 우회한다.

### Q-D2. **mission은 "verb의 부산물(secondary 위계, ambient)"인가 vs "dead reward 회복을 위한 spike-able 위계(claim ready 시 primary로 일시 격상)"인가의 위계 본질을 lock-in.**
- Art Director는 "secondary가 본질, claim 시 tertiary spike"로, Designer는 "claim ready 1개가 cluster 최상단으로 promote, 가장 강한 시각 affordance"로 정의. **두 정의가 충돌** — Art Director의 secondary는 "stage·next-action·자원 cluster를 절대 침범 안 함"이고, Designer의 promote는 "cluster 안에서 가장 강한 affordance"이지만 cluster 자체가 stage 옆에 있을 때 "가장 강한 affordance"는 기능적으로 primary spike에 근접.
- Director가 이 차이를 spec.md에 명시 안 하면 PR 단계에서 motion intensity·glow 강도가 작가별로 갈라진다. "claim ready 모멘트의 시각 weight가 currency cluster 또는 next-action chip을 일시적으로라도 침범하는가? Yes/No"로 lock-in 할 것.

### Q-D3. **"production player가 mission의 존재를 인지한다"의 측정 가능 정의 + 본 axis ship 전 production data sanity check 여부.**
- brief success criteria L100·L103이 측정 불가. spec.md에서 측정 가능 정의("ship 후 N일 내 claim 가능 player 중 X% 이상이 한 번 이상 claim", "mission_reward_claimed event 발화율 baseline N → 목표 M")를 lock-in.
- 추가로 self-1에서 표면화한 production advanceMission trigger sanity check를 ship 전 검증 항목으로 spec.md에 명시. 이게 없으면 mission UI ship 후 dead 상태로 남을 risk.

---

## Summary (≤ 4 sentences)

가장 큰 hidden assumption은 Designer L31의 "modal 세션 5~10분 × 하루 1~3회"이고, 이 가정 위에 세 proposal의 surface 결정 chain 전체가 얹혀 있다. 가장 강한 premature consensus risk는 **세 proposal이 모두 mission home을 "Garden 탭 / dock cluster"로 다른 reasoning이라 주장하며 동일 결론에 수렴**한 점 — 같은 결과면 reasoning 중 하나는 사후 정당화이고, brief framing이 specialist 사고를 narrow했을 가능성이 매우 높다. Director가 절대 skip 못 할 질문은 **Q-D2: mission이 "verb의 부산물(secondary, 영구 약함)"인가 vs "dead reward 회복을 위해 claim ready 시 primary로 일시 격상되는 spike 위계"인가** — Designer와 Art Director가 이 본질에서 충돌하지만 본인들은 surface placement에서 합의한 것처럼 보여 충돌이 가려져 있다. Q-D2가 spec.md에 명시 lock-in 안 되면 PR 단계 motion·glow 강도가 작가별로 갈라지고 본 deliberation의 합의는 거짓이 된다.

---

*— Senior Critic, Phase 3 cross-critique pass*
