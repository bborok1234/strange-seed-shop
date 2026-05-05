# Proposal — Designer (게임 기획자)

- Axis: `stage-art-first-restructure`
- Persona file: `docs/studio/personas/designer.md`
- Brief: `reports/deliberation/stage-art-first-restructure/brief.md`
- Phase: 2 (parallel proposal, blind to other specialists)
- Date: 2026-05-04

## 자기 점검 — 책임 인정 (preface, persona contract 외)

이전 axis(`desktop-ui-redesign`) Cycle 1에서 "Garden = 무대" 명제를 spec § Decisions §1로 가장 강하게 push한 사람이 본인이다. 그 명제는 spec text 단계에서는 통과했지만 implementation 단계에서 quietly 매장됐다. 사용자 표현으로 "정원 의미 퇴색, UI/패널로 다 뭉갬, 아트팀 역할 없음."

본인 책임의 구체:

1. spec § Decisions §1에 "stage = Garden 전용 zone, art ≥ 70% 면적"이라고 적었지만, **그 art가 player에게 어떤 verb를 trigger하는지** 끝까지 안 적었다. art가 "예쁜 wallpaper"가 되는 데 충분한 침묵.
2. drawer 거부 후 받은 concession ("dock 가변 확장 시 stage 폭 ~415px 보존")에서 stage가 col-span-7로 활동할 때의 **player 시야 anchor**를 명시 안 했다. 그 결과 stage 안에서 plot 1개가 좌상단에 박히고 우측 50%가 cream void가 됐다.
3. starter-panel의 "max-height 230px + overflow-y auto"가 spec § Layout에 안 적혀 있었지만, **이전에 본인이 사용성 우려로 "5탭 균등 stretch 대신 항상 visible info"를 강조**한 결과 dev가 "info를 띠로라도 깔자"는 방향을 잡았다. 즉 본인 voice가 implementation의 cream-strip-everywhere bias를 부추긴 측면이 있다.

본 proposal은 그 책임을 honest하게 들고 시작한다. 패러다임 권고는 그 위에서.

---

## Player Verb (이 axis의 player가 stage에서 무엇을 하는가)

**가장 빈도 높은 verb 1개:** plot tap (idle 진행 가속 + 100% 도달 시 수확). 세션 verb 빈도 분포 가정(데이터 없음, § Open Questions Q1):

| 우선순위 | Verb | 빈도 가정 (per 5분 active session) | 위치 |
|---|---|---|---|
| 1 | plot tap (성장/수확) | 30~80회 | stage 중앙 |
| 2 | next-action 응시 (자동 생산 게이지·주문 진행 확인) | 5~10회 (시야 흘낏) | stage 안쪽 ambient + dock |
| 3 | claim button tap (자동 생산 잎 / 도감 보상) | 1~5회 | stage 또는 dock |
| 4 | rail/dock 탭 → 4 surface 진입 | 0~3회 | rail / dock |
| 5 | reward 셀러브레이션 응시 (album_*/expedition claim) | 0~2회 | stage 위 floating |

**핵심 통찰:** verb 1·2·3은 모두 **stage 안에서 또는 stage를 보면서** 발생. verb 4(다른 surface 이동)만 stage를 떠난다. 즉 stage가 cream rectangle 4개로 뭉개져 있으면 verb 1·2·3·5가 모두 art 없이 진행된다 — 이게 "패널 dashboard에 들어왔다" 감각의 mechanic 원인.

**"정원에 들어왔다" vs "패널 dashboard에 들어왔다"의 1인칭 차이:**

- 정원: 내가 게임을 켜면 햇살 온실 art가 먼저 들어오고, 그 안에 내 plot이 sprite로 자라고 있고, 그 sprite를 누르는 verb가 art 안에서 발생한다. 내가 누른 결과(잎 +N, 100% reach)도 art 위에 떠다닌다. **내 손가락이 art를 만지는 감각.**
- 패널 dashboard: 내가 게임을 켜면 cream rectangle 4개가 먼저 들어오고, 그 안에 숫자/버튼/progress bar가 있고, 내 verb는 패널 안의 button tap이다. art는 패널 사이 빈 틈에서 흘낏 보인다. **내 손가락이 카드 UI를 만지는 감각.**

이 두 감각의 차이는 색·spacing·motion이 아니라 **verb의 무대가 어디인가**의 차이다. Art Director 영역(색·tone)으로 풀 수 없고, Engineer 영역(token·structure)으로도 풀 수 없다. **verb 1·2·3을 art 안으로 옮기는 결정**이 핵심이다.

---

## Session Context

가정 (이전 axis § Decisions §6에서 명시 + 미검증, 본 proposal에서 재인용):

- 데스크톱 active 세션: 5~20분 / 1회 (모바일 데이터 외삽; 데스크톱 telemetry 없음).
- 일일 복귀 cycle: 2~4회 (오프라인 보상 흐름 가정).
- verb 빈도의 80%는 Garden plot tap에서 발생.

**세션 phase별 player intent:**

1. **첫 30초 (복귀 직후):** "어제 idle 동안 뭐가 일어났는지 보고 싶다" → 자동 생산 결과 / 오프라인 보상 → claim → 그 다음 verb로 넘어가기. 이 phase에서 art는 "환영 인사" 역할 (greenhouse_day art가 "여전히 따뜻한 정원")이고, dock의 currency cluster + claim CTA가 결정적.
2. **2~10분 (active loop):** plot tap 반복 + 자동 생산 게이지가 채워지는 것 응시 + 100% reach 시 수확 + 도감/원정 진행 흘낏. 이 phase의 90%는 stage. dock은 ambient.
3. **10분~ (탐색 phase):** 새 씨앗 구입(상점), 도감 진행 확인, 원정 출발. 이 phase에서 stage를 잠시 떠난다 — 단, **stage가 시야에서 사라지면 안 된다** (시간이 idle로 흐르고 있음을 잊으면 idle/tycoon 컨벤션 위반).

**복귀 모먼트의 "정원이 살아 있었다" 감각:** 5시간 후 복귀했을 때 정원이 여전히 거기 있고, 내가 없는 동안 자동 생산이 N잎을 모았고, plot이 100%에 도달했음 — 이걸 **art 위에서** 마주치는 것이 "정원 게임"의 핵심 감각이다. 패널 안 modal에서 숫자만 보면 idle/tycoon "메일함" 감각으로 격하된다.

---

## Screen Flow

본 axis는 navigation 골격을 바꾸지 않음 (rail 4탭 + stage Garden 전용 + dock 유지). 변경 대상은 **stage 안의 콘텐츠 layer**.

### 권고 패러다임 — **Hybrid (안 C 기반)**, 단 brief sketch와 다른 방식

brief의 sketch C("Hybrid: stage 콘텐츠 일부는 in-canvas, nav/HUD는 React floating overlay")를 base로 하되, **player verb 기준으로 layer를 명시 분리**한다:

| Layer | 무엇이 들어가는가 | Why this layer | Tech 위치 (Engineer 영역, 참고용) |
|---|---|---|---|
| **L0 — Stage canvas (art)** | greenhouse 배경 일러스트 + plot sprite + 자동 생산 actor sprite + 주문 crate sprite + 환경 ambient (햇살 motion, 잎 떨림) | art가 무대, verb 1·2·3의 무대 | Phaser GardenScene 안 (mechanic 변경 0) + scene이 차지하는 stage 영역 = stage region 전체 |
| **L1 — In-stage diegetic UI** | plot 위 작은 % badge, 100% reach 시 "수확!" floating chip, 자동 생산 jar의 잎 카운트 (sprite와 함께), tap reduction 피드백 ("쑥! +성장") | verb의 즉각 피드백, art와 같은 hand-painted 톤이어야 함 | GardenBoardOverlay (현존) 안 + stage 안 absolute, art respect |
| **L2 — Edge ambient overlay** | next-action 한 줄 (eyebrow + verb 동사), 도감 다음 목표 mini portrait, "오늘의 온실 친구" creature stage | art를 가리지 않는 edge (top-left eyebrow, bottom-third creature stage) | React, stage region 안 absolute, ≤ stage 면적 15% |
| **L3 — Side dock (ambient HUD)** | currency cluster, 자동 생산 rate breakdown, active expedition card, album mini progress | session ambient 정보, verb 4의 entry, stage 옆에서 영구 노출 | React `.side-dock`, stage와 별도 region (현 grid 유지) |
| **L4 — Reward celebration overlay** | album milestone reveal, expedition claim receipt, currency tick celebration | verb 5, momentary peak, art의 한복판에 떠야 함 | React modal/popover, stage 위 z-index |

**핵심 결정:** brief의 sketch A(Canvas-first 전부 sprite로 흡수), B(Frame-overlay 일러스트 frame), C(Hybrid)의 단순 selection이 아니라 **L0~L4의 5-layer composition**. L0+L1은 art-first(canvas), L2는 edge whisper, L3는 sibling region, L4는 momentary peak.

### 이전 spec과의 구체적 변경

| 현재 (Cycle 1 implementation) | 변경 후 |
|---|---|
| `.garden-panel` (top:122 / bottom:78 / left/right:--space-4)이 stage 면적 ~85% 차지 | `.garden-panel` 폐기. stage region = `GardenPlayfieldHost` (Phaser canvas + minimal overlay)가 직접 차지. |
| `.starter-panel` (max-height 230px + overflow-y auto cream 띠) 하단 점유 | starter-panel **완전 폐기**. starter seed 선택 prompt(L4 onboarding 첫 30초 only)는 stage 한복판 1회성 modal로 대체. 이후 모든 "다음 행동" 정보는 L2 edge ambient + L3 dock으로 분산. |
| stage 안에 production-card / next-creature-card / garden-action-dock 등 React 카드 ~10종이 vertical stack | L1(in-canvas diegetic) 또는 L3(dock) 둘 중 하나로 재배치. **stage 안 React 카드 0개를 목표** (단 reward L4 셀러브레이션 제외). |
| `.creature-stage-focus` (stage 안 creature 무대) 가 stage 면적 절반 점유 가능 | L2 edge ambient 띠로 축소(폭 ≤ 320px, stage 우하단). 또는 Phaser scene 안 sprite 이주 검토 (이전 axis Q4 follow-up). |
| dock = currency / next-action / active expedition / album mini 4 카드 | dock 4 카드 유지하되 **L3 정체성** 명시 — "stage와 sibling이지 stage 안 overlay 아님". 색이 stage cream과 같아 invisible separation 위반은 Art Director 영역. |

### "정원에 들어왔다" 첫 5초 시나리오

내가 데스크톱에서 게임을 켠다 →
1. (0~1s) 화면 좌측 rail이 살짝 entrance, 우측 dock이 살짝 entrance, 가운데 stage가 즉시 fill — stage = 햇살 온실 일러스트 100% 차지.
2. (1~2s) plot sprite 3~5개가 art 안에 grow-in (Phaser tween). 내가 어제 심은 씨앗이 거기 있다.
3. (2~3s) 100% 도달한 plot이 있으면 "수확!" diegetic chip이 art 위에 hover — 내 시선이 그쪽으로.
4. (3~4s) dock의 currency cluster가 "+N 잎 idle" delta tick (잠깐). 내 시선이 dock으로 흘낏.
5. (4~5s) 내 손가락이 plot으로 향한다. 첫 verb는 plot tap. **verb의 무대는 art.**

이 5초 동안 cream rectangle은 dock에서만 봤다 (sibling region이라 invisible 아닌 distinct).

---

## Information Hierarchy

**Stage 안 정보 우선순위 (위에서 아래):**

1. **plot 상태** (성장 %, ready 표시) — verb 1의 trigger, art 안 sprite로 표현, 가장 큰 시각 weight.
2. **자동 생산 진행** (분당 N잎, 주문 진행 X/Y) — verb 2의 ambient, art 안 actor sprite + 주문 crate sprite로 표현. 숫자는 sprite 옆 작은 chip(L1).
3. **next-action 한 줄** (예: "두 번째 밭 열기 100잎") — verb 3의 nudge, stage edge top-left eyebrow(L2). 동사 1개로 압축. card 아님.
4. **stage 환경 ambient** (햇살, 잎 떨림, creature 생활 motion) — art 자체가 정보 (Art Director 영역).

**Dock 안 정보 우선순위 (이전 spec § Decisions §4 결정 유지):**

1. **currency cluster** (자원 top, 잎/꽃가루/재료) — anchor, motion 발화 시선 anchor.
2. **next-action chip** (cluster 아래) — hot-state glow.
3. **active expedition card** — progress bar.
4. **album mini progress** — 도감 다음 목표 mini.

**Stage와 dock 간 정보 중복 금지 원칙 (신규):**

이전 Cycle 1은 next-action을 stage 안 starter-panel + dock 양쪽에 둔 결과 사용자가 "어디를 봐야 하는지" 모호. 본 axis는:

- **next-action은 dock에만**. stage 안에는 verb의 nudge 1줄(L2 eyebrow)만, 같은 텍스트 중복 안 함.
- **currency는 dock에만**. stage 위 floating cream pill 0개. 단 plot tap reward(+N 잎)는 plot 위 sprite-안 burst로만 표현 (currency 숫자 자체는 dock에서 tick).
- **production rate(분당 N잎)는 stage 안 actor sprite 옆 chip + dock 안 breakdown** — 이건 의도적 중복(stage는 immediate ambient, dock은 detail). 단 정확히 같은 단위·표기 사용.

**측정 가능한 hierarchy 약속:**

- stage region 안 React panel 면적 ≤ stage 면적 15% (L2 edge ambient + L4 reward 제외 시 ≤ 5%).
- stage region 안 cream rectangle 픽셀 점유율 ≤ 10% (L0+L1이 art 100%, L2는 edge transparent, L4는 momentary).
- player 시선이 첫 5초에 art → plot → dock 순서로 흘러가는 지 유저 테스팅 (1주 dogfood).

---

## Disagreements I Anticipate

(다른 페르소나 proposal을 안 본 상태에서, 페르소나 voice별 예측)

### Art Director와의 disagreement (high confidence)

Art Director는 **L2 edge ambient를 더 많이 채우자**고 할 가능성. "art가 살아도 next-action·creature stage는 시각 weight 가져야 한다, edge 5%로는 약하다." 본인은 **L2 ≤ 15% 상한 고수**. 이유: L2가 늘면 cream rectangle이 stage 안으로 다시 들어옴. 이전 Cycle 1 실패의 mechanic 원인.

또한 Art Director가 **frame-overlay 패러다임(스케치 B)**을 push할 가능성도 있음 — "art가 일러스트 frame 안에 있으면 art respect도 되고 panel도 살린다." 본인은 거부. 이유: frame이 panel의 변형이라 verb의 무대는 여전히 panel 안. plot tap이 frame 안 button이 되면 art는 다시 wallpaper.

### Engineer와의 disagreement (medium confidence)

Engineer는 **L1 in-canvas diegetic UI(plot 위 % badge, "수확!" chip 등) 구현 비용**을 우려할 가능성. "Phaser sprite와 React DOM overlay의 좌표 동기화 + 폰트 일관성 + 60fps 유지가 +500줄 spike, 별도 axis로 미루자." 본인은 **L1을 본 axis 안에서 ship 필수**라고 push. 이유: L1 없으면 stage = art-only가 되어 verb의 즉각 피드백이 dock으로 옮겨가야 하고, 그 순간 verb의 무대는 art가 아니게 된다. **L1은 본 axis의 player-feel core.** 비용이 많이 들면 stage 면적 일부를 양보해서라도 (예: 1280px viewport에서 stage col-span-6, dock col-span-4로) L1 ship을 우선.

또한 Engineer가 **starter-panel 폐기 비용**(여러 곳의 onboarding flow 의존성)을 우려할 가능성. 본인은 onboarding modal 1회성 대체로 충분. 데이터: starter seed 선택은 첫 세션 1회만 발생, 폐기 후 재진입 안 함.

### Senior Critic이 잡을 만한 hidden assumption (Phase 3 예측)

- "art-first가 player에게 좋다는 가정의 근거?" — 답: 사용자 직접 critique이 직접 evidence. 데이터는 없지만 사용자 voice가 있음. honest하게 "데이터 없음, 사용자 1명 evidence" 인정.
- "L1 diegetic UI가 art bible과 시각 충돌하지 않는다는 가정?" — Art Director critique 영역. 본인은 "충돌 가능성 있음, Art Director가 sprite-friendly font + alpha-aware token 정의해줘야" 의존.
- "Stage가 art-first가 되면 player가 'verb를 어디서 시작할지' 모호해진다는 onboarding risk?" — 답: 첫 30초 onboarding modal이 plot tap을 명시 가르침 (현재도 있음, 폐기 안 함).

---

## Open Questions

(우선순위 정렬, 5개 이내, 다음 결정 가장 막는 것부터)

1. **Q1 (본 axis Director synthesis 결정 필수):** L1 diegetic UI(plot 위 % badge, "수확!" chip, 자동 생산 jar 카운트)가 본 axis Cycle 1 안에 들어가는가, 아니면 별도 follow-up axis로 미루는가? 본인 입장: **본 axis 안 ship 필수**. 미루면 stage = art-only wallpaper로 다시 회귀. Engineer cost 의견 + Art Director 시각 충돌 평가에 따라 Director가 결정.
2. **Q2 (본 axis Cycle 1 PR 결정):** starter-panel 폐기 후 onboarding 첫 30초 prompt를 어디에 두는가? 옵션: (a) stage 한복판 1회성 modal (본인 권고), (b) dock 상단 1회성 카드, (c) stage edge tooltip. (a)가 verb를 art로 향하게 하는 데 가장 유리.
3. **Q3 (별도 axis follow-up, 본 axis 통과 후 trigger):** GardenScene 내부 plot grid anchor가 viewport 폭에 비례 펼쳐져야 함 (이전 axis Q3 + brief 위반 인벤토리). 본 axis가 stage 폭을 넓혀도 plot이 좌상단 50%에 박히면 art-first 약속이 부분 달성. 본 axis 머지 직후 즉시 다음 axis로 commit (이전 spec § Implementation Sequence에 약속, 본 axis가 강제 trigger).
4. **Q4 (telemetry 선결, 본 axis 머지 후):** "데스크톱 player 세션 5~20분, verb 80% Garden" 가정이 data로 검증되는 시점 (이전 axis § Decisions §6과 동일). 본 axis는 그 가정 위에 빌드. 가정 틀리면 L0~L4 비율 재조정 필요.
5. **Q5 (본 axis 안 결정 — Designer + Art Director 공동):** L4 reward celebration이 stage 위 floating modal인가, dock 위 popover인가, full-viewport curtain인가? 이전 spec Q3 (`cross-region-moment-elevation` follow-up axis)에 미뤘지만 본 axis가 stage art-first로 가면 reward의 무대도 art 위가 자연스러움 — 본 axis 안에서 결정 권고.

---

## References

- Brief: `reports/deliberation/stage-art-first-restructure/brief.md`
- 이전 axis spec: `reports/deliberation/desktop-ui-redesign/spec.md` (§ Decisions §1·§4)
- 이전 axis retrospective: `reports/deliberation/desktop-ui-redesign/retrospective.md`
- 페르소나: `docs/studio/personas/designer.md`
- 코드: `src/App.tsx:2270-2851` (garden-panel JSX), `src/styles.css:190` (.garden-panel), `src/styles.css:813` (.starter-panel), `src/styles.css:7728+` (desktop @media), `src/game/playfield/GardenPlayfieldHost.tsx`, `src/game/playfield/GardenScene.ts` (변경 금지)
- 사용자 critique: 2026-05-04/05 스크린샷 + voice ("정원 의미 퇴색, UI/패널로 다 뭉갬, 아트팀 역할 없음")
