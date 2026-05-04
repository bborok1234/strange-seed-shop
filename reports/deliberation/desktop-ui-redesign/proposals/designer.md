# Designer Proposal — Desktop UI Layout 큰 골격

- Axis: `desktop-ui-redesign`
- Persona: Game Designer (게임 기획자)
- Date: 2026-05-04
- Stance: 옵션 A(2-pane)를 기본 골격으로 채택하되, A 그대로는 데스크톱 player-verb 분포를 못 살리므로 **A를 변형한 안 D — "Garden 무대 + 영구 Side Dock + 모달형 Tab Drawer"** 를 제안한다.

---

## 0. 결론 먼저 (TL;DR)

- 데스크톱은 모바일의 "탭으로 화면을 통째로 갈아끼우기" 모델을 그대로 옮기면 안 된다. 데스크톱 player의 세션 길이는 더 길고(추정 8~20분), 그동안 verb의 80%는 **정원에서** 일어난다. 정원을 떠나서 봐야 하는 verb(씨앗 구매·도감 확인·원정 출발/회수·상점 보기)는 모두 "정원에 돌아오기 위한 우회"다.
- 그러므로 데스크톱 골격은 **Garden = 항상 보이는 무대**, 나머지 4탭 = **Garden 위에 슬라이드되는 우측 Tab Drawer + 영구 Side Dock** 으로 분리한다.
- 옵션 B(3-column tycoon)는 우리 게임의 verb 분포에 맞지 않는다. 우리는 production chain이 아니라 **plot tap → harvest → 도감/원정 reveal** 의 감성 도감 게임이다. 좌측에 도감 요약 칼럼을 영구 노출하면 player의 시선 80%가 가야 할 정원에서 시선이 분산된다.
- 옵션 C(in-canvas overlay)는 현재 Phaser scene boundary를 깨거나 React HUD를 다 옮겨야 해서 brief Non-negotiable #3과 충돌한다.

---

## 1. Player Verb (per region in 새 desktop layout)

데스크톱 viewport(≥ 1280px) 기준 4 region으로 나눈다.

### 1-A. **Garden Stage** (좌, 화면 폭 ~62%)
- **Player verb (1문장):** "내가 자라고 있는 plot을 톡톡 두드려 시간을 단축하고, 다 자라면 수확해서 새 생명체가 도감에 들어오는 순간을 본다."
- 이 verb는 게임 전체 세션에서 가장 빈도가 높은 것 (씨앗 1개당 30~1320초의 성장 동안 plot tap이 핵심 interaction).
- Phaser scene이 이 region에 풀로 들어간다. **scene 내부 변경 금지** — region은 scene을 감싸는 React container 폭/높이만 정의.
- "오늘의 온실 친구" creature stage(`stageHeroCreature`)도 이 region 안에 머문다 — 정원과 같은 시각 무대이므로.

### 1-B. **Side Dock** (우, 영구 노출, 화면 폭 ~22%)
- **Player verb (1문장):** "지금 내가 가진 자원과 진행 중인 비동기 타이머(원정·생산·다음 행동)를 정원을 떠나지 않고 흘끗 본다."
- 이 region이 영구 노출되는 게 옵션 D의 핵심. 다음 4개 cluster를 위에서 아래로 stack:
  1. **Resource HUD cluster** (잎/꽃가루/재료) — 모바일의 `currency-cluster`를 그대로 가져오되 데스크톱에서는 visual weight 있는 카드 격으로.
  2. **Next-Action chip** (`nextAction.title` + `body`) — 모바일의 `aside.action-surface`를 압축한 chip + secondary line. *세션의 흐름을 여기서 잡는다.*
  3. **Active Expedition / Production timer** — `save.activeExpedition` 있을 때 잔여시간 + "회수" CTA. expedition 5/15/60분 타이머가 정원 verb와 병렬로 돈다는 사실을 세션 내내 환기.
  4. **Album Progress mini** (`albumDiscoveredCount/total`) — 도감이 게임 전체의 long-term retention 메타이므로 항상 시야 안. 클릭 시 Album drawer 열림.
- Side Dock은 절대 닫히지 않는다(옵션). 닫으면 모바일이랑 똑같아진다.

### 1-C. **Tab Drawer** (우측에서 슬라이드, Garden 위에 overlay, 폭 ~38%)
- **Player verb (1문장):** "정원이 자라는 동안, 잠깐 옆 화면을 열어서 씨앗을 사거나 / 도감을 들춰보거나 / 원정을 출발시키고 / 상점을 본다."
- 4개 sub-tab(씨앗·도감·원정·상점)이 **drawer 안의 segmented control**로 압축. 정원 탭은 이제 탭이 아니라 **무대 자체**이므로 탭 목록에서 제거.
- Drawer는 modal이 아니라 **non-blocking overlay** — Garden Stage는 우측 38%만 가려지고 좌측 62%는 계속 visible & interactive. plot tap은 drawer 열린 상태에서도 가능해야 한다 (성장은 멈추지 않으니까).
- 기본 상태는 닫힘. 유저가 의도해서 열고 닫는다.

### 1-D. **Top Bar** (상단 띠, 화면 폭 100%, 높이 작게)
- **Player verb (1문장):** "지금 내가 어느 정원에 있는지(타이틀·서브타이틀)와 게임 전체 톤을 1초 안에 인지한다."
- 현재 `top-bar`의 `eyebrow + h1 + objective-chip + currency-cluster` 중 currency-cluster와 objective-chip은 Side Dock으로 이동. Top Bar에는 타이틀 / 서브타이틀(`햇살 온실 정원`)만 남긴다.
- 이걸 Top Bar로 분리하는 이유: 게임의 "햇살 온실" 톤과 art bible identity를 화면을 가로지르는 가벼운 띠로 항상 노출. 모바일에서는 이게 가능했지만 데스크톱에서 sidebar로 옮기면 톤이 약해진다.

---

## 2. Session Context (region별)

| Region | 봉사하는 세션 패턴 | 근거 |
|---|---|---|
| Garden Stage | **5~20분 active 세션** (씨앗 심고 tap-down으로 수확 가속) | seeds.json: 30s ~ 1320s 성장; tap이 3~16초 단축. 2 plot 이상 풀리면 동시 운영. |
| Side Dock | **1~5분 quick check-in** (자원/원정 상태만 보고 닫는 세션) + **모든 active 세션 내내** | expeditions.json: 300s/900s/3600s 타이머. Quick scout 5분 = "한 번 와서 출발만 시키고 가는" verb. Side Dock에서 회수 CTA가 보여야 한다. |
| Tab Drawer | **active 세션 중 30~60초 우회** (씨앗 사고 / 도감 확인 / 원정 출발) | missions.json: daily가 "씨앗 3개 구매" "원정 1회 시작"이라 player가 매일 한 번은 drawer를 연다. |
| Top Bar | **첫 30초 / 첫 켰을 때 1회** (게임 인지) | art bible 노출 + 첫인상. 그 후엔 시야 변두리. |

**핵심 가정 (검증 필요):** 데스크톱 player는 모바일 player보다 idle 비중이 낮고 active tap 비중이 높다. 정원 = 무대로 두면 active 세션이 자연스럽다. 만약 데이터가 "데스크톱도 idle 위주"라고 나오면 Side Dock의 timer cluster 비중을 더 키워야 하고, 이 안의 ratio도 바뀐다.

---

## 3. Screen Flow (verb별 tap-cost)

데스크톱 기준. 비교를 위해 현재 모바일 cost도 표기.

| Player verb | 새 데스크톱 안 D | 현재 모바일 | 변화 |
|---|---|---|---|
| 자라는 plot tap | 1 tap (Garden Stage 항상 visible) | 1 tap | 동일 |
| 잎 잔량 확인 | 0 tap (Side Dock 영구) | 0 tap (top-bar) | 동일 |
| Next action 확인 | 0 tap (Side Dock 영구) | 1~2 tap (정원 탭에 있으면 0, 다른 탭이면 1) | **개선** |
| 씨앗 구매 → 심기 | 1 tap drawer 열기 + 1 tap 씨앗 + 1 tap 심기 = **3 tap** (drawer 닫지 않아도 plot 보임) | 동일 3 tap | 동일하지만 **drawer 닫을 필요 없음** |
| 도감 진행 확인 | 1 tap drawer | 1 tap 탭 전환 | 동일하지만 정원 보면서 가능 |
| 원정 출발 | 1 tap drawer + 1 tap 원정 카드 + 1 tap 출발 = 3 tap | 동일 3 tap | 동일 |
| **원정 회수** | **1 tap (Side Dock의 회수 CTA)** | 2 tap (탭 전환 + 회수) | **개선 (단축)** |
| 상점 promo 보기 | 1 tap drawer | 1 tap 탭 전환 | 동일 |

**Persona 룰 충족:** 모든 region 단일 verb가 ≤ 3 tap. 가장 빈도 높은 plot tap이 0 tap navigation cost (=무대가 항상 켜짐).

**모바일 호환 (brief Non-negotiable #1):** 모바일에서는 Side Dock을 분리하지 않고 현재 single-column + bottom-tabs 그대로. Drawer 개념 미적용. "정원이 무대" 컨셉은 모바일에서도 정원 탭 = 기본 진입 탭으로 이미 구현되어 있어서 isomorphic하다.

---

## 4. Information Hierarchy

### 항상 visible (모든 데스크톱 세션 중)

1. **자라고 있는 plot의 progress** (Garden Stage 안, Phaser가 그려줌).
2. **자원 3종 잔량** (Side Dock).
3. **Next action 카피 1줄** (Side Dock의 chip).
4. **Active expedition 잔여시간** (있을 때만, Side Dock).
5. **Album 진행도 X/Y** (Side Dock의 mini).

### On-demand (drawer 열어야 보임)

- 씨앗 카탈로그 / 가격 / 잠금 조건.
- 도감의 개별 생명체 카드 / 미션 진행도 / 보상 수령 CTA.
- Expedition 카탈로그 / 출발 가능 조건.
- Shop surface (실결제 포함).
- Tutorial mission 진행 (`missionProgress`) — 이건 Side Dock의 next-action chip에 압축되어 노출되므로 drawer 안에서는 상세만.

### Visible 금지 (혼란 야기)

- creature personality / favoriteThing / greeting 같은 도감 디테일 (creature stage hover로만, 또는 album drawer로만).
- shop_surfaces.json의 실결제 promo가 Side Dock에 들어가면 안 된다 (감성 도감 톤 깨짐 + dark pattern). drawer 안에만.

### 의도적인 hierarchy 결정

- **next-action chip을 Side Dock 최상단에 둔다 (resource HUD 위쪽).** 자원이 0/0/0인 첫 30초 player에게 "지금 뭘 해야 하는가"가 자원 잔량보다 우선. art director가 "자원 클러스터가 더 visual weight 있어야"라고 할 수 있는데, 첫 세션 player에게는 next-action이 더 중요하다.
- **expedition timer는 next-action보다 아래.** active expedition은 진행 중에는 player가 능동으로 할 게 없는 비동기 타이머라 우선순위가 next-action보다 낮다. 단 expedition이 **완료**되면 chip이 hot-state로 변하고 next-action chip을 일시적으로 가린다 (회수 CTA가 가장 hot).

---

## 5. Disagreements I Anticipate

### Art Director가 push back할 것

- **"Side Dock 영구 노출은 시각 휴식을 깨고 cream 매트의 따뜻함을 잘라낸다."** Art가 옵션 A의 좌 ⅔ Garden을 더 키우고 우 dock을 collapsible로 하자고 할 가능성 높음. 나는 이를 거부 — collapsible로 만들면 데스크톱 player가 closure하는 순간 모바일이랑 똑같아져서 데스크톱 axis 자체의 의미가 없어진다. 휴식은 Garden Stage 안의 여백으로 만들어야지 dock을 숨겨서 만드는 게 아니다.
- **"Tab Drawer가 Garden을 가리는 overlay라면 visual cohesion이 깨진다."** Art는 split-pane을 선호할 수 있음. 나는 drawer를 선호 — split-pane이 되면 player가 drawer 안 verb를 끝낸 후에도 화면을 닫지 않고 거기 머무를 수 있어서 정원 verb로 돌아가는 closure가 약해진다. Drawer는 명시적인 닫기 verb를 강제한다.
- **"creature stage가 Garden region 안이면 Phaser scene과 충돌한다."** 이건 art가 아니라 engineer 영역일 수 있는데, 어쨌든 둘이 같은 region 안 layering을 어떻게 하느냐는 art-eng 협의 필요.

### Engineer가 push back할 것

- **"App.tsx 5671줄에서 5탭 conditional render를 drawer 모델로 바꾸는 건 layout 변경 ≤ 500줄로 안 끝난다."** 나는 verb 단순성을 우선 — engineer가 PR을 쪼개야지 drawer 컨셉 자체를 거부하면 안 된다. 만약 engineer가 "drawer 도입 비용이 layout 골격 axis 범위를 넘는다"고 판단하면 phase 1에서는 옵션 A(고정 split)로 두고 drawer는 phase 2로 넘기는 타협 가능.
- **"Phaser scene을 좌 62%에 풀로 넣으면 canvas resize 비용 + DPR 처리 추가."** 이건 정당한 우려. Side Dock 폭이 viewport에 따라 가변이면 매번 scene resize. 해법은 brief의 breakpoint를 1280/1440/1920 3 step으로 고정하는 것 — engineer가 이 정도는 받아줄 것으로 가정.

### Senior Critic이 push back할 것

- **"옵션 D는 옵션 A의 변형일 뿐이고 새 안이라고 부를 가치가 없다."** 옳은 지적. 골격 분류는 A지만 drawer 도입이라는 결정이 옵션 A 원안의 "side dock에 진행 카드 stacking" 과 다른 verb-level 결정이라 D로 명명. critic이 "그냥 A로 부르고 dock 안 콘텐츠만 명세하라"고 하면 받아줄 수 있음.
- **"세션 길이 가정(데스크톱 = 더 길다)을 데이터 없이 정한다."** 옳은 지적이고 "Open Questions"에 명시했다. 이 가정이 틀리면 Side Dock의 timer cluster 비중을 키워야 한다는 식으로 안이 적응 가능하므로 가정 자체가 옵션 D를 무너뜨리지는 않는다.
- **"5탭 → 4 drawer + 1 stage로 바꾸는 건 brief Non-negotiable #4 (5탭 컨셉 유지)와 충돌한다."** 명시적으로 brief는 "desktop에서는 navigation 형태가 달라질 수 있음(tab → side nav 등)"을 허용하므로 충돌 아님. 단 critic이 "5탭 surface 자체는 그대로"의 정신은 도감/원정/상점/씨앗/정원이 동등한 surface여야 한다는 것이므로 drawer 안에서 4탭이 동등하면 OK라고 답할 수 있다.

---

## 6. Open Questions

1. **데스크톱 vs 모바일 세션 길이 분포 데이터가 없다.** 위 가정(데스크톱 5~20분 active)이 맞는지 검증 필요. 만약 데스크톱도 모바일처럼 1~3분 burst라면 drawer 모델은 과잉이고 옵션 A 원안이 더 적절.
2. **현재 player 중 데스크톱 점유율이 얼마인가.** 1%면 이 axis 자체가 priority 낮음. 10%+면 drawer 도입 정당. (Director에게 질문)
3. **lunar care reveal / 3rd merchant arc 같은 future content가 어느 region에 들어가는지 미정.** 현재 art bible과 reference에 lunar care가 언급되는데 next axis 범위라 본 안에서는 region만 확보(Garden Stage의 creature stage 영역).
4. **Drawer를 열었을 때 Phaser scene의 input이 살아있어야 하는지 차단되어야 하는지.** Engineer 결정 영역이지만 designer 입장 = "살아있어야 한다 (성장은 멈추지 않으니까)". Engineer가 input event 충돌로 거부하면 receipt-style modal로 닫아야 할 수도.
5. **Side Dock의 album mini cluster를 클릭했을 때 drawer가 album 탭으로 열리는가, 아니면 별도 modal인가.** Designer 안 = drawer로 통일 (verb 일관성). 하지만 album drawer 안에서 다시 카드를 클릭하면 또 modal이 뜨는 nested 문제가 생길 수 있음 — art-director와 협의.
6. **`getLocalQaTab()` QA hook이 desktop drawer 모델에서 어떻게 동작해야 하는지.** drawer 안의 segmented control로 fallback인지, 별도 query param 추가인지. Engineer 영역.
7. **Top Bar의 art bible 노출이 정말 player verb에 봉사하는지** — 이것 한 줄을 위해 height 60~80px을 영구 점유해도 되는가. Art director가 "더 줄이거나 없애도 된다"고 하면 받아들여서 Top Bar 폐기하고 타이틀을 Side Dock 최상단 brand cluster로 흡수 가능.

---

## Appendix — 옵션 A/B/C 평가표 (요약)

| 옵션 | Player verb 적합도 | 모바일 호환 | 기존 코드 충격 | 채택 여부 |
|---|---|---|---|---|
| A. 2-pane | 좋음 (Garden 무대화 가능) | 좋음 | 낮음 | **변형 채택 → D** |
| B. 3-column tycoon | **나쁨** (우리 게임은 production chain이 아니라 도감 reveal 게임. 좌측 영구 도감 칼럼은 시선 분산) | 나쁨 (모바일과 완전히 다른 모델) | 높음 | **거부** |
| C. in-canvas overlay | 중간 (verb는 단순해지지만 React 진입점 다 in-canvas로 옮겨야 함) | 나쁨 | **매우 높음** (Phaser scene boundary brief Non-negotiable #3 위반 위험) | **거부** |
| **D. A + drawer + 영구 dock** | **가장 좋음** | 좋음 | 중간 (drawer 도입 비용) | **채택** |
