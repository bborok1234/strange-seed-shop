# Proposal — Game Designer (Mission UX Visibility)

> Phase 2, isolation. Brief: `reports/deliberation/mission-ux-visibility/brief.md`. Persona: `docs/studio/personas/designer.md`.

---

## Player Verb

이 axis 전체의 **단일 player verb**: **"오늘 받을 수 있는 잎 보따리를 확인하고, 한 번 더 두드릴 동기를 챙긴다."**

부속 verb (proposal 내 모든 화면이 둘 중 하나로 환원되어야 함):

- **V1 — Glance:** "지금 진행도가 얼마인지 한 눈에 본다." (Garden 화면을 떠나지 않고)
- **V2 — Claim:** "준비된 보상을 받는다." (잎 +X 버튼 1탭)

V1은 영구 노출, V2는 ready 상태에서만 시각 weight 폭발. 이 두 verb 외 다른 verb(예: "mission 목록을 정독한다", "튜토리얼을 처음부터 다시 본다")는 본 axis 범위에서 **의도적으로 배제**한다 — 데이터 6개짜리 컨텐츠에 정독 화면을 만들면 verb-noise 비율이 망가진다.

---

## Session Context

본 axis가 player journey의 어느 지점을 건드리는지:

| 시점 | 어떤 player가 / 어떤 mission이 작동하는가 | 본 axis가 담당하는 것 |
|---|---|---|
| **첫 30초 (T0)** | 신규 player, 튜토리얼 3종이 onboarding 행동 sequence | 튜토리얼 mission이 "다음 행동" 안내와 **충돌하지 않고**, 진행도가 잎으로 환원된다는 신호를 준다 |
| **첫 5분 (T1)** | 첫 씨앗→첫 수확→첫 도감 보상 1 cycle 완주 | 튜토리얼 3개 모두 ready/claimed 상태로 빠르게 전환되며, "잎 보따리 받기" 첫 학습 |
| **데일리 복귀 (T2 / 매일 1~3회)** | 5분 짜투리 retention player | 데일리 3종이 "오늘 할 일" 명시적 hook — +155잎/일 가시화 |
| **장기 retention (T3, 7일+)** | 데일리 mission이 main loop의 일부로 내재화 | mission이 daily ritual로 anchored — 켜자마자 "오늘 잎 보따리 진행도?" 가 첫 시선 |

**핵심 가정 (데이터 0이므로 명시):** 우리 게임의 modal 세션은 "켜고 5~10분, 하루 1~3회" 짜리다. 그렇다면 player가 mission UI에 머무는 시간은 1세션당 **합쳐서 5초 미만**이어야 한다. 5초 안에 "진행도+다음 보상+claim 가능 여부"를 다 받게 만드는 게 hierarchy 목표다. 만약 modal 세션이 30분급이라면 하단 별도 panel도 정당화되지만, idle/tycoon 컨벤션상 그렇게 가정하지 않는다.

**컨벤션 align:** AdVenture Capitalist / Cookie Clicker는 "objective HUD가 항상 시야 안, claim은 1탭". 모바일 RPG 스타일의 별도 mission 탭은 우리 게임의 5탭 골격에 들어갈 자리가 없을 뿐 아니라, "5분 세션 × 하루 1~3회" cycle에는 과한 frame이다. **컨벤션을 따른다.**

---

## Screen Flow

### 권장 surface placement: **Garden 탭 내부 dock 영역의 Mission Cluster (영구 노출, claim 1탭)**

5탭 골격 안에서 "mission 전용 surface 신설"은 brief의 non-negotiable §1로 막혀있고, 4개 비-Garden 탭(씨앗/도감/원정/상점) 어디에 흡수해도 verb mismatch가 발생한다 (씨앗 탭은 구매 verb, 도감 탭은 컬렉션 감상 verb 등). **Garden 탭이 유일한 home base**이고, mission의 V1(Glance)은 home에서 일어나야 한다.

**Garden 탭 내부에서의 위치 결정:** 현재 Garden 화면은 (top-bar) → (stage / 다음행동 aside) → (bottom-tabs) 구조. 본 안은 **"다음 행동" aside 바로 아래에 Mission Cluster를 vertical stack**으로 추가한다. 이유:

1. "다음 행동" chip이 이미 player의 시선이 두 번째로 떨어지는 지점 (`App.tsx:2349`). 같은 시각 belt에 mission을 두면 V1(Glance)에 새 saccade가 0.
2. "다음 행동"과 mission은 **의미적으로 서로 보강** — "다음 행동"은 *지금 무엇을 할지* (verb), mission은 *그것을 했을 때 누적되는 보상* (reward feedback). 같은 dock에 묶을 때 closing the loop이 명확.
3. desktop-ui-redesign spec § Decisions §6에서 dock region에 currency·next-action·active expedition을 vertical stack으로 묶기로 이미 결정됨. mission cluster가 이 stack의 4번째 요소로 자연 합류하면 desktop에서도 grid 변경 0.

### Mission Cluster 내부 화면 flow

```
[Mission Cluster — 항상 visible]
 ├── header line: "오늘의 의뢰" + 진행 요약 ("X/6 진행 중 · Y개 받기 가능")
 ├── primary row (claim ready 1개 우선):
 │     [type chip] [label] [progress] [+N 잎 ← 1탭 V2]
 ├── secondary rows (나머지 mission):
 │     [type chip] [label] [progress bar + X/Y 텍스트]
 └── (튜토리얼 3개 모두 claimed 후 → 데일리 3개만 표시. 사라지지 않음.)
```

Tap 비용 budget:

| Verb | 현재 | 본 안 | 변화 |
|---|---|---|---|
| V1 Glance "데일리 진행도 한 눈에" | 불가능 (debug 필요) | 0 tap (Garden 진입과 동시에 시야 안) | **−∞ → 0** |
| V2 Claim "준비된 잎 받기" | 불가능 | 1 tap | **−∞ → 1** |
| 튜토리얼 첫 보상 수령 | 불가능 | 1 tap (Garden 안) | **−∞ → 1** |

페르소나 contract: "한 verb를 위해 3 tap 이상 들면 redesign". V1 0 tap, V2 1 tap — **통과**.

### Onboarding 충돌 처리 (튜토리얼 mission ↔ "다음 행동" chip)

T0~T1에 두 가이드가 같은 화면에 동시 노출되는 건 redundancy가 아니라 **verb 보강**이다. 단 둘이 **모순**되어선 안 됨:

- "다음 행동" = 현재 player가 행해야 할 *single 다음 액션* (예: "첫 씨앗을 고르세요").
- 튜토리얼 mission = 그 액션을 했을 때 *받는 보상의 누적 진행도*.

따라서 onboarding 동안 튜토리얼 mission row는 "다음 행동"에 **수반되는 reward preview**로 읽혀야 하고, label 자체는 변경하지 않는다 (브리프 §non-negotiable §2: 데이터 invariant). 시각적 보강은 Art Director 영역.

**튜토리얼 3개가 모두 claimed 후의 처리:** Mission Cluster에서 튜토리얼 row는 **사라지거나 collapse 처리**. 데일리 3개만 남음. 이유: T2~T3 retention player에게 "이미 끝낸 튜토리얼" 영구 노출은 verb-noise. (단 데이터 row는 visible 상태 유지 — UI 표시 토글만.)

### 데스크톱 처리

`desktop-ui-redesign` spec의 dock region(col-span-3)에 4번째 vertical card로 합류. 폭은 dock에 맞춰 progress bar resize, motion 변경 0. **본 axis는 mobile 기준으로 결정하고 desktop은 부수** (brief §non-negotiable §4).

---

## Information Hierarchy

Mission Cluster 안에서 어떤 정보가 어느 weight를 받는가 (시각 변수 자체는 Art Director 영역, 본 안은 **무엇이 무엇보다 중요한가**의 ordering만 결정):

### Tier 1 — V2 Claim 가능 신호 (가장 강한 weight)

- claim 가능한 mission이 1개라도 있으면, 그 행이 cluster 최상단으로 promote.
- claim 버튼은 *cluster 안에서 가장 강한 시각 affordance*. (구체적 색·glow·motion duration은 Art Director.)
- **이유:** V2가 reward loop의 closing tap이고, missed claim은 dead reward (brief의 핵심 문제). 한 player session에서 가장 비싼 비용은 "받을 수 있었는데 못 받음"이다.

### Tier 2 — 데일리 진행 요약 1줄

- "오늘 X/6 · Y개 받기 가능" — header 한 줄.
- **이유:** T2 데일리 복귀 player의 첫 saccade는 "오늘치 남았나?"다. 6개 row를 다 읽기 전에 1줄로 답이 와야 한다.

### Tier 3 — 개별 mission row (label + progress + reward)

- label = "무엇을 하는 의뢰인가" (verb 환기).
- progress = 양적 위치 (예: 3/5).
- reward = "받으면 얼마인가" (잎 N).
- 세 정보가 한 row 안에 다 들어가야 함. 한 정보 빠지면 V1 Glance 가 깨짐.

### Tier 4 — type 구분 (튜토리얼 / 데일리)

- chip 1개로 표현. 본 axis 기준 type은 **flat hierarchy** (튜토리얼 ≠ 부모 그룹, 데일리 ≠ 부모 그룹). 두 type이 같은 cluster에 섞여 보이는 게 onboarding↔retention 연속성에 정당. 별도 섹션 헤더로 갈라놓지 말 것.

### 의도적으로 hierarchy에서 뺀 것

- **mission 설명문 / lore copy:** 6개짜리 데이터에 본문 텍스트 추가는 verb 동기 없음. label만으로 충분.
- **"다음 mission 미리보기" / 잠긴 mission:** 데이터 6개 모두 visible이므로 "잠금" 상태 자체가 없음. UI에 "잠긴 mission 자리 placeholder"를 만들 이유 없음.
- **mission 별 아이콘 일러스트:** brief Out of Scope (신규 asset 0). text + chip만으로 hierarchy 성립.
- **timer ("자정까지 N시간"):** brief §non-negotiable §5 (timezone axis 분리). 본 axis에서 data row 자체에 시간 표시 안 함.

---

## Disagreements I Anticipate

### vs Art Director

- **"Garden stage가 이미 일러스트 + plot Phaser canvas + stageHeroCreature + 다음 행동 aside로 시각 부담 큰데, 4번째 cluster 추가는 visual rest를 깬다"** 라고 할 가능성 높음.
- 내 입장: mission이 "예쁘지만 동기 없는 추가"가 아니라, **현재 dead reward (claim 0건/일)를 회복**하는 player journey 핵심. visual rest를 위해 V2 Claim verb를 모호하게 만드는 건 페르소나 default disagreement (designer.md L37).
- 타협 가능 영역: cluster의 시각 weight를 *상시 약하게 + claim ready 시 강하게*로 dynamic하게 다루는 것. 단 "claim ready 시조차 약한 weight"는 거부.

### vs Engineer

- **"mission cluster 1곳 + dock 노출 1곳 = 2 surface로 분리하면 PR 수가 늘어 비용 ↑, 모바일만 먼저 ship하자"** 라고 할 가능성 있음.
- 내 입장: 모바일 우선은 brief에 적혀 있으므로 동의. 단 "Garden 탭 안 vertical stack 한 곳"은 처음부터 1 surface 결정이지 2 surface가 아니다. 데스크톱은 같은 컴포넌트가 dock의 col-span-3 vertical 영역에 자연 들어감. PR 분할은 Engineer 영역이지만, "verb 1개 → surface 1개" 원칙은 본 안의 정체성.
- 타협 불가 영역: cost를 이유로 V2 Claim의 1-tap 비용을 2-tap 이상으로 키우는 결정 (예: "mission tab을 따로 열고 거기서 claim").

### vs Senior Critic

- **"Garden 탭에 또 카드를 쌓는 건 polish-bias 누적의 또 다른 사례 아니냐, 별도 surface로 분리하지 않은 진짜 이유가 verb냐 아니면 PR 비용을 의식한 자기검열이냐"** 라고 추궁할 가능성 있음.
- 내 입장: idle/tycoon 컨벤션 + "5탭 골격 보존" non-negotiable + "5분 세션 × 하루 1~3회" 가정의 교집합이 **single home dock**으로 수렴함을 명시 (Session Context 표). polish-bias는 별도 mission 탭을 신설했을 때 더 크게 발생 — surface 신설은 polish PR 22개를 다시 그 surface에 끌어들임.

---

## Open Questions

(브리프 retrospective: ≤ 5, 우선순위 정렬. 답이 자명하거나 후속 axis 영역인 것은 의도적으로 뺀다.)

1. **튜토리얼 3개 모두 claimed 후, mission cluster를 collapse할 것인가 vs 데일리만 남기되 cluster 자체는 visible 유지할 것인가?** — T2 retention player에게 "오늘의 의뢰 0/3" 빈 상태가 보이는 게 daily ritual 형성에 도움이 되는지, 아니면 verb-noise인지가 갈린다. 본 안은 후자(데일리만 남기되 cluster 유지)를 default로 두지만, T0~T1 → T2 전환 시점의 시각 안정성과 충돌하므로 Director가 결단해야 함.
2. **claim 가능한 mission이 2개 이상 동시 ready일 때 promote 정책은 어떻게 정해지나?** — 본 안은 "최상단 1개 promote + 나머지는 row 안에서 reward 강조"를 가정. 다른 옵션: 모두 같은 weight로 stacked / 보상이 큰 순. claim 행동의 1탭성을 깨지 않는 한 어느 쪽이든 가능하지만, V2 verb의 시각 fork 발생.
3. **mission cluster에 대한 claim 1탭 직후 reward feedback (잎 +X 어딘가에 fly-out)을 본 axis에서 같이 결정할 것인가?** — 현재 `triggerRewardPulse()`가 currency cluster의 reward-pop class를 잡고 있음. mission 보상도 같은 pulse를 사용할지, 또는 별도 motion이 필요한지. 본 axis 범위 내라면 답이 단순(공유 pulse 재사용); Art Director 영역으로 미루면 다음 axis 후보.
4. **"오늘의 의뢰" cluster header 텍스트가 데일리 reset 전후로 변하지 않는데, daily reset 시점에 player가 cluster를 다시 발견하게 만드는 hook이 필요한가?** — brief §non-negotiable §5로 timezone axis 분리. 단 본 axis가 daily mission을 가시화하는 순간 "왜 어제 받았는데 또 0이지" UX 의문이 발생. 본 axis에서 reset 자체는 안 건드리되, header copy에 "오늘"이 들어가는 것만 유지하면 충분한지 확인 필요.
5. **mission cluster가 비어 보이는 경우(예: 데일리 3개 claim 모두 끝난 후)의 empty state copy를 본 axis에서 결정할 것인가?** — 본 안은 "오늘 다 받았어요 · 내일 또 만나요" 류 1줄을 default로 가정. 그러나 이 한 줄이 daily retention의 마지막 모멘트가 되므로 사실상 게임 lore 영역이고, copywriting이 본 axis 결정 사항인지가 모호.

---

*— Game Designer, Phase 2 isolation pass*
