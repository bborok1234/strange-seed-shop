# Critique — Game Designer (게임 기획자)

- Axis: `desktop-ui-redesign`
- Persona: Game Designer
- Phase: 3 (Cross-Critique Round)
- Date: 2026-05-04

---

## 1. Disagreement with Art Director's proposal

Art Director의 Option D(좌 rail / 중 stage / 우 dock)에서 **좌측 rail에 5개 탭을 vertical stack으로 영구 노출하는 결정**에 동의할 수 없습니다. 플레이어 verb 분포 관점에서 두 가지 문제가 있습니다.

**(a) Rail은 player verb에 대해 상시 가시성을 받을 자격이 없습니다.**
Art Director는 §1에서 rail을 "tertiary (시각 weight 15%)"로 두고 §5에서 "ambient navigation"이라 명명했습니다. 그러나 플레이어 입장에서 5개 surface 사이의 이동은 *세션당 0~3회* 발생하는 저빈도 verb입니다 (mission daily 기준 "씨앗 구매 1회 + 원정 출발 1회"가 전형). 반면 plot tap은 세션당 수십~수백 회입니다. *저빈도 verb를 시야의 좌측 영구 점유로 보상하는 hierarchy는 player verb 분포와 거꾸로 갑니다.* "ambient"라는 단어로 좌측 col-span-2(viewport 폭의 ~14~17%)를 영구 차지하는 결정을 정당화할 수 없습니다 — ambient라는 건 시선 변두리를 의미하는데 좌측 rail은 시각의 진입점이지 변두리가 아닙니다(LTR 독해 문화권에서 좌상단은 첫 시선).

**(b) Rail로 옮기면 "drawer 회귀 closure" verb가 사라집니다.**
저는 §1-C에서 drawer는 "명시적인 닫기 verb를 강제한다"고 적었습니다. 영구 rail은 그 반대 — 플레이어가 album 탭을 클릭하면 stage 자체가 통째로 album으로 *전환*됩니다 (Art Director §1: "표시되는 surface는 1개 stage"라고 §6에서 명시). 즉 stage가 album panel로 바뀌는 순간 *Garden이 사라집니다*. 이것은 저의 핵심 명제 "Garden = 항상 보이는 무대"를 정면으로 깹니다. Art Director는 §1에서 stage가 "art-only zone"이라 했지만 §6의 "Option B 부분 채택" 답변에서 "표시되는 surface는 1개 stage"라고 인정했습니다 — 즉 stage가 5개 탭에 따라 갈아끼워지는 것이고, 이는 모바일의 "탭으로 화면을 통째로 갈아끼우기" 모델을 그대로 데스크톱에 옮긴 것입니다. 데스크톱 player의 plot tap verb가 album 탭 머무는 동안은 0이 되고, plot 성장 progress의 시각 인지가 끊깁니다. 비동기 타이머(원정·plot 성장)와 active verb(plot tap)가 병렬로 도는 idle/tycoon 컨벤션 위반입니다.

**(c) 플레이어 1인칭 시나리오로 검증해보겠습니다.**
"내가 5분 만에 돌아와서 데스크톱을 켰을 때": 자란 plot이 있다는 것을 알고 싶음 → Art Director 안에서는 stage가 garden 탭일 때만 보이므로 OK. 하지만 album 탭 머물던 상태로 닫혔다면 stage가 album이라 plot이 안 보임. → 데스크톱 quick check-in 세션의 verb 비용이 +1 tap. *모바일과 똑같은 cost인데 데스크톱 axis에서 무엇을 개선했는지 불분명합니다.*

### Art Director가 놓친 영역 — next-action chip의 시선 가중치

Art Director는 next-action card를 dock의 "secondary (시각 weight 25%)" 안에 자원 cluster와 동급으로 배치했습니다(§1, §5). 저는 §4에서 "next-action chip을 Side Dock 최상단에 둔다 (resource HUD 위쪽)"라고 명시했습니다 — 첫 30초 player에게는 자원 0/0/0보다 next-action이 더 핵심이기 때문입니다. Art Director의 dock에서 자원 cluster가 dock 최상단에 오면 *첫 세션 onboarding의 시각적 hand-off가 깨집니다*. 이건 visual taste가 아니라 player journey 결정이라 designer 영역입니다.

---

## 2. Disagreement with Engineer's proposal

Engineer의 "Option A (PR0=D 먼저, 이후 PR1~PR5) 권장" (§최종 권고)에서 **`activeTab` state를 그대로 유지한 채 dock만 추가하는 접근**이 player verb 비용을 줄이지 못한다는 점을 지적합니다.

**(a) Engineer는 옵션을 cost로 정렬했지만 player impact 차원이 빠졌습니다.**
Engineer §1에서 Option A를 ~350-490줄, Option B를 ~1000-1480줄로 줄 수 차이로 정량화했고 §최종 권고에서 "비용 ⅓ 수준"을 결정 근거로 제시했습니다. 그러나 두 옵션의 player verb cost 비교는 누락되어 있습니다. §6에서 "임팩트 측정은 Designer가 KPI 정의해야"라고 designer에게 던진 것은 정당합니다 — 하지만 그 답이 오기 전에 "권장 = A"를 결론으로 박는 것은 cost-only 결정입니다. 저의 §3 tap-cost 표 기준 Option A 단독은 "원정 회수" verb를 1 tap으로 단축하지 못합니다 (현재 dev-panel의 conditional render 구조를 그대로 dock으로 옮기면 원정 회수는 여전히 expedition tab 활성화 후 회수). Engineer §1 Option A 행에서 "기존 panel render 트리는 유지 — desktop에서는 `dev-panel`이 우측 dock 자리로 reposition만 함"이라고 명시했는데, 이건 시각적 position만 바꾸고 verb cost는 유지하는 안입니다. *Layout axis의 의미는 픽셀 reposition이 아니라 verb cost 재분배여야 합니다.*

**(b) "5개 panel 동시 mount 비용 미측정" 우려로 Option B 전체를 위축시킨 것은 designer 도메인 침범입니다.**
Engineer §4에서 "Option B의 함정: ... 5개가 항상 mount면 초기 render 시간 측정 spike 1시간 필요"라고 적고 §6에서 "Designer가 '4개 surface 동시 표시 필수' 답이 있을 때만"이라며 designer에게 정당화 책임을 떠넘겼습니다. 그러나 저는 Option B를 거부했습니다(저의 §0, §Appendix) — 우리 게임은 production chain이 아니라 도감 reveal 게임이라 4 surface 동시 표시는 verb-level로 불필요합니다. 즉 Engineer의 cost 우려는 정당하나, designer가 이미 옵션 B를 verb 근거로 거부한 상태에서 cost 우려를 designer 책임으로 되돌리는 것은 cross-persona 흐름이 어색합니다.

**(c) Engineer는 "drawer가 plot tap을 동시에 받을 수 있어야 한다"는 verb 요건을 cost 평가에서 제외했습니다.**
저의 §1-C와 §6의 Open Question 4에서 "drawer 열린 상태에서도 plot tap 가능"을 verb 필수 조건으로 명시했습니다. Engineer §1 Option A는 dev-panel을 우측 dock 위치로 옮기는 안인데, 현재 `dev-panel`이 `width: min(42%, 500px)`로 floating absolute (Engineer §0에서 본인이 인용)라 drawer가 열려도 좌측 garden에 click이 통과하는지 여부가 결정 안 됨. Engineer는 이 verb 요건을 cost 추정에 반영하지 않았습니다 — drawer overlay 상태에서 좌측 stage의 pointer-event를 보존하려면 z-index/stacking-context 재정비가 필요하고 이게 350~490줄에 포함되어 있는지 불명확합니다.

---

## 3. Self-critique

### (a) "데스크톱 player session = 5~20분 active"라는 가정은 데이터 0으로 던졌습니다

저의 §2 표에서 "Garden Stage = 5~20분 active 세션"이라고 적었고 §6 Open Question 1에서 "데이터 없다"고 자백은 했습니다. 그러나 안 D의 골격(Side Dock 영구 노출 + Drawer)은 이 가정에 *전적으로* 의존합니다. 만약 데스크톱 세션이 모바일과 동일하게 1~3분 burst라면 Side Dock 영구는 과잉이고 Art Director의 비판("dock이 cream 매트의 따뜻함을 자른다")이 맞습니다. 즉 저는 안의 정당화를 검증 불가능한 가정 위에 쌓아두고 "데이터 들어오면 ratio 조정 가능"이라고 도망갔습니다. 페르소나 룰 "데이터 없으면 자기 가정 명시"는 지켰지만, *가정이 틀릴 때 안 D 자체가 무너진다는 사실은 §6 한 줄로 처리하고 §0 결론에서는 가정이 맞는 것처럼 단언했습니다.* 이건 핸드웨이브입니다.

### (b) "drawer 모델이 모바일 mental model과 isomorphic"이라는 주장의 비약

§3 마지막 줄에서 "정원이 무대' 컨셉은 모바일에서도 정원 탭 = 기본 진입 탭으로 이미 구현되어 있어서 isomorphic하다"고 적었지만, 모바일에서는 탭이 *전체 화면 교체*이고 데스크톱 drawer는 *부분 overlay*라 player가 학습할 mental model이 다릅니다. Senior Critic이 §6에서 지적할 "shape change 학습 비용"을 Art Director가 받아치기 전에 제가 먼저 인정해야 합니다 — drawer/탭 두 모델 학습은 viewport resize로 viewport를 오가는 사용자(웹 player)에게 jarring할 수 있습니다.

### (c) Top Bar의 정당화 부실

§1-D에서 Top Bar의 verb를 "지금 어느 정원에 있는지를 1초 안에 인지"라고 적었는데, 이건 verb가 아니라 *passive recognition*입니다. 진짜 verb면 "탭/클릭/입력" 같은 동작이 있어야 합니다. §6 Open Question 7에서 "Top Bar 폐기하고 Side Dock 흡수 가능"이라고 후퇴를 미리 깔아둔 것 자체가 제가 Top Bar의 verb 정당성을 자신 못한다는 증거입니다. *플레이어 verb를 명시 못 하는 region은 빠진다*가 페르소나 룰인데 저 스스로 어겼습니다.

---

## 4. Cross-cutting risks

### (a) Designer + Art Director 모두 "Garden Stage가 큰 면적"을 원하지만 Engineer cost 분석은 stage 내부의 *시각 채움* 문제를 다루지 않음

저는 §1-A에서 stage = 폭 ~62%, Art Director는 §2에서 col-span-7(폭 ~58%)로 거의 합의했습니다. 그러나 **stage가 커져도 plot이 1개일 때 좌상단에만 작게 박히는 현재 문제(brief 관측)는 layout axis로 풀리지 않습니다.** Art Director §5에서 "stage 중앙 lower-third에 plot·creature가 앉도록 Phaser 내부 anchor 조정 권장" + "GardenScene 내부 변경은 이 axis 밖이므로 권장 사항만 명시, 강제 안 함"으로 후퇴했고, Engineer §0에서 "playfield-board-overlay가 plot 1개일 때 좌상단에만 작게 배치"를 인용만 하고 해법 미제시. **즉 셋이 모두 stage 비율을 키우자고 동의하지만, 키운 stage 안의 시각 공허(plot 1개)는 누구도 책임지지 않습니다.** brief의 success 조건 "viewport 70%가 빈 cream 매트인 상태가 사라짐"이 layout만으로는 달성 안 될 가능성이 큽니다. 이건 Director가 "이 axis 안에서 GardenScene anchor 조정도 포함시킬지" 결정해야 합니다 — 안 하면 layout PR 머지 후에도 사용자 인상이 동일할 수 있습니다.

### (b) Side Dock 안 4 cluster의 우선순위가 Designer ↔ Art Director 사이에 충돌, Engineer는 이를 인지 못함

저는 §4에서 "next-action chip을 dock 최상단(자원 위쪽)"으로 명시. Art Director §1에서 dock 순서를 "자원 cluster → next action → active expedition → secondary"로 명시. 둘이 정반대입니다. Engineer §1 Option A의 "신규 desktop-side-dock 컴포넌트"는 이 충돌을 인지하지 못한 채 둘 다 만족시킬 수 있는 양 cost 추정. 이 충돌은 "첫 세션 onboarding에서 0/0/0 자원이 시야 최상단을 차지하면 player가 무엇을 할지 모른다"는 player journey 문제와 직결되므로 Director가 designer 손을 들어야 합니다.

### (c) 셋 다 누락: Phaser scene과 React drawer/dock의 input 충돌

저의 §6 Open Question 4("drawer 열린 상태에서 Phaser input이 살아있어야 하는가")는 verb 필수 조건이지만, Art Director 안의 dock(영구 노출 sibling region)에서는 발생 안 함 — 즉 Art Director 안에서는 이 risk가 사라집니다. 하지만 그 대신 stage 자체가 album으로 갈아끼워질 때 Phaser canvas는 unmount되는지 hidden되는지가 미정. Engineer §0에서 "Phaser scene boundary 보존" 약속을 했지만 "stage가 다른 panel로 교체될 때 scene 생명주기" 결정은 어디에도 없습니다. **셋 다 stage region의 raison d'être가 무엇이냐(Phaser 전용 zone vs. 5개 panel 교체 zone)에 대한 답을 회피했고, 이게 정해지지 않으면 PR 단계에서 결정 비용이 폭발합니다.**

### (d) 3안 모두 데스크톱 viewport 점유율(현재 player 중 desktop 비중)을 모름

저의 §6 Open Question 2가 직접 제기했고, Engineer §6 "임팩트 측정은 Designer가 KPI 정의해야", Art Director는 §6에서 viewport 분기 정당성을 "production game 표준"으로만 답함. **셋 모두 점유율이 1%인지 30%인지 모르는 채로 axis 우선순위와 PR 5~6개의 가치를 추정하고 있습니다.** Director가 "데스크톱 비중 측정"을 axis 선결 조건으로 잡아야 했고, 이걸 안 잡은 채로 Phase 2를 돌린 게 cross-cutting risk입니다.

---

## 5. Concessions I'd accept

### vs. Art Director

- **Concession 1 (rail vs drawer)**: Art Director가 *(a)* rail에 노출되는 5개 탭 중 정원 탭을 빼고 (정원 = stage 자체이므로 nav 의미 없음), *(b)* 나머지 4개 탭이 클릭됐을 때 stage가 *교체되지 않고* dock 옆 floating drawer로 열리는 모델을 받아주면 sign off 가능. Art는 "art-only stage zone" 원칙을 지키고, 저는 "Garden 항상 보임" 원칙을 지킴. 즉 rail은 남기되 stage 교체 verb는 없앤 hybrid.
- **Concession 2 (next-action 위치)**: Art Director가 dock 최상단 자원 cluster 위에 next-action chip을 height ≤ `spacing.2xl`로 작게 두는 것에 동의하면 sign off. 자원 cluster가 시각 weight를 가지되 next-action이 위치 hierarchy 우선을 가지는 절충.

### vs. Engineer

- **Concession 1 (Option A 권장)**: Engineer가 Option A의 PR1~PR5 안에 *"drawer overlay 상태에서 좌측 Phaser canvas의 pointer-event가 보존된다"* 를 verification 항목으로 추가하고 PR 추정 줄 수에 그 비용을 명시적으로 포함하면 sign off. 즉 verb 요건이 cost 추정에 들어가야 함.
- **Concession 2 (B vs A 결정)**: Engineer가 §6 Open Question 1을 designer가 "B 거부"로 답한 것을 받아들이고, "A로 가되 PR1에서 dev-panel reposition이 아니라 dock의 cluster 우선순위(next-action 최상단)를 함께 결정한다"는 step을 추가하면 sign off. 즉 cost-only 권고가 아니라 verb 결정과 묶인 권고로 재구성.

### vs. Cross-cutting risk (c)에 대해

- Director가 "이 axis 안에서 stage region이 Phaser 전용인지 5-panel 교체 zone인지" 명확히 결정하고 그 결정을 모든 페르소나에게 회람하면, 위 cross-cutting risk (c)는 해소됩니다. 이건 어느 한 페르소나의 양보가 아니라 Director의 boundary 재선언입니다.

---

## Self-check (persona contract)

- [x] Art Director에게 disagreement 1개 이상 (player verb / hierarchy 근거)
- [x] Engineer에게 disagreement 1개 이상 (cost-only 평가에 player impact 누락)
- [x] Self-critique 1개 이상 (가정 검증 부재 + isomorphic 비약 + Top Bar verb 부실)
- [x] Cross-cutting risk 4개 (셋 다 놓친 stage 내부 공허 / dock 순서 충돌 / Phaser 생명주기 미정 / 데스크톱 비중 미측정)
- [x] Concession 명시 (각 disagreement에 대해)
- [x] Korean, 플레이어 1인칭
- [x] 색·폰트·spacing 결정 0건 (Art Director 영역 보존)
- [x] 코드 구현 디테일·일정 추정 0건 (Engineer 영역 보존)
- [x] 자기 proposal 수정 0건 (Phase 2 frozen)
- [x] 새 옵션 제안 0건 (dissent + concession만)
