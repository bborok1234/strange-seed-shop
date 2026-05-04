# Critique — Engineer (개발자)

- Axis: `desktop-ui-redesign`
- Persona: Engineer
- Date: 2026-05-04
- 입력: brief.md + engineer/designer/art-director proposals
- 본 문서는 Phase 3 cross-critique. 본인 proposal(`proposals/engineer.md`)은 무수정.

---

## 1. Designer proposal 반박 (옵션 D — Garden 무대 + 영구 Side Dock + 모달형 Tab Drawer)

### 1-1. "drawer 열린 상태에서 plot tap이 살아있어야 한다"는 React + Phaser input 모델을 모른 채 내린 결정이다

Designer §1-C: *"Drawer는 modal이 아니라 non-blocking overlay — Garden Stage는 우측 38%만 가려지고 좌측 62%는 계속 visible & interactive. plot tap은 drawer 열린 상태에서도 가능해야 한다."* 그리고 §6 Open Question 4에서 본인이 "engineer 결정 영역" 으로 떠넘기고 있다. 떠넘긴 비용을 명시한다.

- 현재 `App.tsx:2906~3421`의 4개 탭 panel(`seeds/album/expedition/shop`)은 `activeTab === ...` conditional render. 즉 한 번에 1개만 mount. drawer로 만들면 `activeTab`이 더 이상 "정원과 배타적인 surface" 가 아니라 "drawer slot에 어떤 surface가 들어 있는가" 로 의미 재정의 필요.
- 이게 단순 className 분기가 아니다 — `App.tsx:2790` 의 `garden-panel` 자체가 `position: absolute` 로 viewport 거의 전체를 잡고 있고 그 안에 4탭이 conditional. drawer는 이 절대좌표 위에 또 absolute로 올라가는 게 아니라, garden-panel과 sibling으로 격상되어야 하고, 그 sibling 격상 자체가 본인 제안 PR0(D — Shell-only refactor)의 100줄짜리 noop이 아니라 **panel render 트리 재배치 ~250줄** 가 추가됨.
- Phaser input은 `GardenPlayfieldHost.tsx`의 canvas DOM이 받는다. drawer가 stage 위에 absolute로 올라가면 brower의 default hit-test에서 drawer 영역은 plot tap을 먹는다. "좌측 62%만 plot tap 살아있게" 하려면 drawer 컨테이너에 `pointer-events: none` 또는 `clip-path` 혹은 drawer 폭만큼만 hit-test 활성화하는 layout. 이는 React 제어가 아니라 CSS/Phaser canvas hit-region의 재계산이고, `GardenPlayfieldHost`의 resize listener와 `scale.on("resize")` 콜백이 drawer 폭을 알아야 정원 sprite가 drawer 안에 가리는 영역에서도 정확한 픽셀 좌표를 받는다. **Phaser scene boundary는 안 깨지지만, scene을 감싸는 host의 input bounding box 계산이 추가로 필요**. 본인 proposal의 "scale.mode = RESIZE 가 자동으로 처리해준다" 는 **drawer 도입 시 부분 무효** — resize는 캔버스 폭을 따라가지만 drawer가 캔버스를 덮는 사실은 모른다.
- 비용 추정: drawer non-blocking 모델 = 본인 안 옵션 A(~350~490줄, 5~6 PR) 위에 **추가 ~280~420줄, +2 PR**. 즉 Designer의 D는 본인 안의 **A가 아니라 A와 B 사이** (~700~900줄, 7~8 PR).
- **결론**: drawer 자체는 구현 가능하나, "plot tap이 drawer 열린 상태에서도 살아있어야 한다" 라는 hard requirement를 Designer가 양보하지 않으면 본인 안 옵션 A의 비용 6PR/+3KB 가정은 무너진다.

### 1-2. Side Dock의 "active expedition timer가 next-action chip을 일시적으로 가린다" 는 React render 모델에서 무시 못 할 회귀 surface

Designer §4: *"expedition이 완료되면 chip이 hot-state로 변하고 next-action chip을 일시적으로 가린다."* 이는 dock 안 컴포넌트 stack이 시점에 따라 reorder되거나 z-index swap 되어야 한다는 뜻이고, 이는 `nextAction` 계산 로직(현재 `App.tsx` 안에서 mission/seed/expedition 상태 하나의 함수로 통합)을 **dock 표시 우선순위 함수와 분리** 해야 한다. dock 우선순위 함수 신규 작성 ~80줄, 그리고 expedition 완료 → hot-state 전이의 motion이 Art Director의 `motion.gesture.celebrate (880ms)` 와 충돌하지 않게 동시 active tween 수 budget 재산정 필요. 이건 PR3 분량 +60줄 추가.

---

## 2. Art Director proposal 반박 (옵션 D — 3-region rail / stage / dock + 풀 token system)

### 2-1. Token rename은 "신규 region에만 강제, 기존은 점진" 이라 했지만 elevation·radius·motion 토큰의 의미 격상은 기존 사용처를 강제로 끌고 들어온다

Art §3: `radius.panel = 16px (현재 8px에서 상향)`, `elevation.*` 4단계 신설(현재 `--shadow-panel` 1종), `motion.duration.*` 4단(120/220/420/880ms 외 사용 금지).

- 현재 `--radius-panel: 8px` 가 styles.css 안에서 **93회 var() 참조**(Art Director 본인이 §7 Open Question 7에서 인정). `radius.panel` 의 값을 16px로 바꾸면서 "기존 사용처는 점진" 이라고 하려면 **두 토큰을 동시 운용** 해야 한다 — `--radius-control: 8px` 신설 + `--radius-panel: 16px` 으로 격상 + 기존 93회를 어느 쪽으로 갈지 case-by-case. 이건 본 axis(layout 골격)에 끼워 넣으면 ~93곳 + 시각 회귀 검증, 빼면 desktop region이 16px이고 mobile region이 8px인 분열 상태로 ship.
- `motion.duration` 4단으로의 강제는 기존 keyframes 12종(Art Director 본인이 §0에서 인정) 중 `680ms`, `720ms`, `1400ms`, `1600ms`, `2200ms` 등을 가장 가까운 토큰으로 remap하는 게 "이 axis 신규 모션에만 강제" 라고 했으나, 이미 ship된 `tap-bounce`, `reward-pop`, `merchant-second-chapter-reveal`, expedition `leaf-trail` 등은 모두 본인 안 PR2~PR4의 dock card·rail item·stage transition과 시각적으로 동일 화면에 동시 등장한다. 시각 vocabulary가 두 문법으로 섞이는 화면이 ship된다. Art Director가 "motion vocabulary 일관성" 을 본인 §4의 hard rule로 들고 있으면서 동시에 "기존은 점진" 이라고 하는 건 **모순**.
- 비용 추정: Art Director 의 token system을 본 axis에서 끝까지 강제하면 styles.css **+800~1200줄 변경**(rename + 신규 + 기존 사용처 마이그레이션), CSS gzipped +6~9KB. 본인 안 옵션 A의 +3KB budget을 **약 3배 초과**. 본 axis(50KB budget) 안엔 들어가지만, "신규 region만 강제" 의 일관성 violation 비용은 token system이 절반만 적용된 상태에서 다음 axis polish PR이 **두 token system 중 하나를 골라가며** 코드 작성해야 한다는 영구 마찰을 만든다.

### 2-2. 3-region (rail col-span-2 / stage col-span-7 / dock col-span-3) 은 본인 안 옵션 B(3-column tycoon, 1000~1480줄)에 가깝지 옵션 A(350~490줄)에 가깝지 않다

Art Director §6: *"Engineer가 2-pane(Option A)으로 축소하자고 할 가능성. 나는 거부."* 이 거부의 비용을 명시한다.

- rail이 신설된다는 건 현재 `bottom-tabs` (`styles.css:3825`) 의 `position: absolute; grid-template-columns: repeat(5, 1fr)` 단일 정의에서, desktop ≥1280px일 때 *동일한 5탭이 vertical rail로 재배치* 되어야 한다는 것. mobile breakpoint와 충돌하지 않는 형태로 분리하려면 `.bottom-tabs` 자체를 `.app-nav` 같은 추상으로 격상하고, `data-orientation="horizontal|vertical"` 또는 별도 컴포넌트 분기 둘 중 하나. 본인 안 옵션 A의 "bottom-tabs → side rail at ≥1280px" PR3(~140줄)에 **rail item visual weight (active raised + accent.sun glow), badge slot, vertical orientation 의 token-driven rebuild 추가 ~180줄**. 즉 옵션 A PR3 ≈ ~320줄, 단일 PR 500줄 권장은 만족하지만 회귀 surface는 모바일 bottom-tabs 까지 동시.
- stage region이 "art가 ≥70% 면적, React 패널 overlay 금지" 이라는 §5 Asset Composition 규칙은 현재 `garden-panel` 안의 `playfield-board-overlay`, `next-action surface`, `tab-screen-return` 버튼, `objective-chip` 등 stage 내부 React 노드를 **모두 dock 또는 rail로 이주** 해야 한다는 뜻. 이주 자체는 Designer §1-A·1-B와도 부분 align하지만, 이주 대상 컴포넌트 수는 본인 안 옵션 A의 "side-dock 신설 + bottom-tabs 위치 변경" 만으로 안 끝난다. 대략 **+200~300줄 추가**, PR 1개 추가.
- 합산: Art D ≈ 본인 안 옵션 A(~350~490) + rail 강화(+180) + stage clean-up(+200~300) + token system(+800~1200) = **~1530~2170줄, 8~10 PR**. 본인이 옵션 B 에 매긴 ~1000~1480줄을 **30~50% 초과**. Art Director 본인은 비용 무관 영역(persona §"일정·구현 비용 추정 0건") 이라 적극 인정 안 했으나, brief soft constraint "한 PR 변경 ≤ 500줄, ≤ 5 파일 권장" 에 정면 충돌.

### 2-3. "stage region에 React overlay 금지" 는 expedition progress bar(최근 #384 ship)의 위치 회귀를 일으킨다

Art §5 dock region: *"active expedition card: 기존 expedition progress bar + leaf-trail motion 유지하되 dock region 내부로 이전. stage 위에 떠 있지 않음."* 최근 PR #384(원정 진행 중 expedition tab progress bar + leaf-trail motion) 이 ship된 상태인데 본 axis 가 그걸 dock으로 강제 이전하면 **#384 motion 위치/크기가 dock 폭 ~270~432px에 다시 맞춰져야** 한다. 이는 layout axis 가 micro-polish 회귀를 만드는 사례 — Designer/Director가 받아들일지 명시 합의 필요.

---

## 3. Self-critique — 본인 proposal 약점

### 3-1. 본인 옵션 A 의 "PR0=D Shell-only refactor (~100줄, 시각 noop)" 가정은 Designer/Art Director 어느 쪽이라도 채택되는 순간 무효화된다

본인 §0~§2 의 옵션 A 비용(350~490줄, 5~6 PR, +3KB)은 **dev-panel을 garden-stage 형제로 빼고 모바일 시각 noop을 보장하는 PR0** 가 100줄에 끝난다는 가정에 기반. 그러나:

- Designer의 D(drawer + 영구 dock)를 받으면 PR0가 **panel render 트리 재배치 + drawer wrapper 도입**으로 ~250~350줄로 부풀고, 모바일 시각 noop 보장이 "drawer가 mobile breakpoint에서 자동 비활성" 으로 **추가 분기 코드 ~40줄** 필요.
- Art Director의 D(rail/stage/dock 3-region)를 받으면 PR0가 단순 dev-panel sibling 격상이 아니라 **3-region grid wrapper + rail/dock 컨테이너 placeholder** 까지 도입해야 시각 noop이 가능. ~180~250줄.
- 즉 본인이 "PR0는 cheap noop 이라 항상 빠진다" 고 단언한 게 두 design persona 어느 쪽 D 를 받든 **2~3배로 부풀어** PR0이 사실상 design 결정에 의존하는 PR1이 된다. 본인의 "5~6 PR" 분할 estimate은 design 결정 후 재산정 필요.

### 3-2. 본인이 옵션 B 의 perf 함정으로 "5개 panel 동시 mount 비용 미측정 (spike 1시간 필요)" 만 적었지, 옵션 A 에서도 desktop = `garden-panel + dock + rail` 동시 mount + matchMedia 분기 추가로 **현재 mount cost 베이스라인 자체를 측정 안 한 채** budget 단언했다

본인 §4 React render frequency 섹션은 옵션 A를 "render 1회 추가" 로 단언했지만, dock에 next-action·active expedition·album-mini 4 cluster를 영구 mount 하는 것이 mobile에서 next-action만 mount되는 현재 베이스라인과 비교해 어느 정도 비용인지 측정 안 했다. 특히 `content.expeditions`/`content.creatures` map 호출이 dock 내부에서 영구 발생하면 mobile은 비활성이고 desktop만 활성인 상태가 되어 **재측정 spike 1시간 추가 필요**. 본인이 옵션 B 에만 spike를 요구하고 옵션 A 는 무측정 통과시킨 건 비대칭.

### 3-3. 본인의 "save migration ZERO" 단언은 Designer의 "drawer 마지막 열림 위치 기억", Art Director의 "rail active tab 상태 기억" 같은 user preference가 들어오는 즉시 별도 localStorage key 운용이 필요한데, 본인 proposal이 그 key 의 schema·만료·QA hook(`getLocalQaTab`) 호환성을 명시 안 했다

본인 §3에서 "별도 localStorage key 사용, PlayerSave 침범 X" 만 적고 끝. 그러나 신규 key가 1~3개 생기는 순간 (drawer open state, rail active, dock collapsed) `localStorage` 의 namespace 충돌 가능성, QA reset path, e2e snapshot 안정성, version upgrade 시 schema 호환성 모두 spec 필요. 본 axis 안에서 명시 안 하면 PR4~PR5 단계에서 Designer/Art Director 가 추가하는 stateful UI 가 들어갈 때 그때그때 ad-hoc key 가 늘어나서 **QA hook 회귀** 가 발생한다. PR4 분량 +60줄 추가 보정.

---

## 4. Cross-cutting risks (proposals 합쳐 읽을 때만 보임)

### 4-1. Designer D + Art Director D 합산 = 본인 옵션 B 비용을 ~50% 초과, 본 axis 1개 cycle로 ship 불가

- Designer D: drawer + 영구 dock 모델. 본인 안 A 위에 **+~280~420줄 / +2 PR**.
- Art Director D: 3-region rail/stage/dock + 풀 token system + stage clean-up. 본인 안 A 위에 **+~1180~1700줄 / +5~7 PR**.
- 두 D 가 모두 채택되면 **본인 안 A 베이스(~400) + Designer D 추가(+~350) + Art Director D 추가(+~1400) = ~2150줄, 11~13 PR**.
- 본인이 옵션 B 에 매긴 ~1000~1480줄, 7~8 PR을 **45~80% 초과**. brief soft constraint(한 PR ≤500줄, ≤5 파일) 안에서 분할은 가능하나 axis 1 cycle = 11~13 PR 은 22개 micro-polish PR 규모에 가까움. 즉 **이 axis는 본인이 추정한 옵션 B 보다 더 큰 axis** 로 격상되어 ship.
- 두 D가 결합될 때의 시너지(rail이 이미 도입되니 drawer는 rail에서 열림) 도 있으나, 그 시너지를 활용하려면 PR 순서가 Art Director D 먼저 → Designer D 가 그 위에 얹혀야. PR 순서 강제는 직렬 작업이 되어 axis 전체 lead time 증가.

### 4-2. Designer §6 Open Q5 (album mini 클릭 → drawer album → 카드 클릭 → modal) 의 nested overlay 와 Art Director §7 Open Q5 (mobile→desktop resize 시 bottom-tabs ↔ rail shape change) 가 모두 motion vocabulary 외 처리

두 persona 모두 "engineer 결정 영역" 또는 "motion vocabulary로 처리 가능한지 검토 필요" 로 떠넘겼다. Engineer 입장: **두 케이스 모두 motion + state 동시 변경**. Art Director motion vocabulary 4-named gesture 안에 들어가게 강제하면 reveal(420ms) × 중첩 = 누적 840ms 의 시각 떨림. 즉 motion vocabulary 자체가 nested overlay/resize 케이스를 **명시적으로 cover하지 못함** — Art Director 가 "외곽 vocabulary 4개로 충분" 이라 단언한 §6은 cross-cutting case에서 부서진다.

### 4-3. Designer 의 "stage 내부 React overlay 금지" 와 Art Director 의 "stage region은 art ≥70%, React panel overlay 금지" 가 같은 결론처럼 보이나, **creature stage(`stageHeroCreature`)** 의 위치 결정에서 충돌

Designer §1-A: *"오늘의 온실 친구 creature stage(`stageHeroCreature`)도 이 region 안에 머문다."* Art §5 stage region: *"stage 중앙 lower-third에 plot·creature가 앉도록 Phaser 내부 anchor 조정 권장 (단, GardenScene 내부 변경은 이 axis 밖이므로 권장 사항만)."* — 현재 `stageHeroCreature` 는 React 컴포넌트로 garden-panel 안에 absolute로 떠 있다(GardenScene 내부가 아닌 React overlay). 두 persona 모두 stage에 두자고 했으나, Art는 "React overlay 금지" 라 했다. **이는 React 노드인 stageHeroCreature를 Phaser scene 안으로 이주** 시켜야 한다는 뜻이고, 그 순간 brief Non-negotiable #3 (Phaser scene 내부 변경 금지) 정면 위반. Director 합의 없이는 stageHeroCreature 위치가 미해결.

### 4-4. bundle size budget(50KB gzipped) 합산

- 본인 옵션 A: +3KB
- Designer D 추가(drawer 컴포넌트 + dock cluster 4개): +1.5~2.5KB
- Art Director D 추가(token system rename + 3-region grid + rail vertical + token-driven motion remap): +6~9KB CSS, +1.5~2.5KB JS
- **합산: +12~17KB gzipped**. 50KB budget 안 (~25~34% 소비) 이지만, 본 axis 후 후속 axis(3rd merchant arc, lunar care reveal 등) 가 이미 좁아진 budget 위에서 작업.

---

## 5. Concessions — 옵션별 sign-off 조건

### Option A (본인 권장) sign-off 조건

- Designer 가 §1-C drawer 모델 포기, dock 4 cluster 영구 노출만 채택. → 본인 안 옵션 A 그대로(~400줄, 5~6 PR, +3KB).
- Art Director 가 §3 token system rename을 **본 axis 신규 region에만** 신규 토큰 도입(`color.surface.dock`, `color.surface.rail`, `color.accent.sun`, `spacing.2xl/3xl/4xl`, `radius.hero`)로 한정, 기존 `--radius-panel` `--space-*` rename은 별도 axis. → +~80줄 styles.css, +1KB CSS.
- Art Director 가 motion vocabulary 4-named gesture 강제를 **신규 region 전환 motion에만 적용**, 기존 `tap-bounce`/`reward-pop`/`leaf-trail` remap은 별도 axis. → 추가 비용 0.
- 합산 sign-off: ~480줄, 6 PR, +4KB. **OK**.

### Option B (본인 추정 ~1000~1480줄) sign-off 조건

- Designer 가 5개 surface "동시 노출" 정당화 데이터 제공(데스크톱 세션 5~20분 가정 검증, 또는 Director 가 데이터 없이도 결정).
- Designer 가 drawer 포기 (B의 3-column이면 drawer 불필요).
- Art Director 의 token system은 위 Option A 와 동일 한정.
- 추가로 **2시간 spike** (5 panel 동시 mount React render 비용 측정).
- 합산 sign-off: ~1100~1300줄, 7~8 PR, +9KB. **조건부 OK**.

### Designer D + Art Director D 결합안 sign-off 조건 (가장 비싸지만 가장 ambitious)

- 본 axis 를 **2 cycle 로 분할**: Cycle 1 = Art Director rail/stage/dock 3-region grid + Designer dock 영구 노출 (drawer 미포함, ~700줄, 5 PR, +6KB). Cycle 2 = Designer drawer + nested overlay + 모든 token rename (~1100줄, 5 PR, +8KB).
- Director 가 "1 axis = 1 cycle" 원칙을 깨고 axis 를 2 cycle 로 ship 하는 의사결정 필요.
- 합산 sign-off: 2 cycle, 11~13 PR, +14KB. **Director 결정 필요**.

### Option C (캔버스 in-game UI)

- 본인 §1-C, Designer §0 마지막, Art §6 모두 거부. **sign-off 불가**, 별도 axis로 분리 권장.

---

## 6. 정리

본인 cheapest option (A)는 design persona 둘이 모두 양보할 때만 ~480줄/6PR/+4KB로 ship 가능. 둘 중 하나라도 D 를 가져가면 옵션 A 의 PR0 가정(100줄 noop refactor)이 부서지면서 PR0 비용이 250~350줄로 부풀고, 둘 다 D 면 본 axis 가 2 cycle ship 결정 없이는 brief soft constraint 위반. **Director 가 결정해야 할 것**: (1) Designer drawer 모델을 axis 1 cycle 안에 넣을 가치가 있는가, (2) Art Director token system을 신규 region 한정으로 양보할 수 있는가, (3) 양보 안 하면 axis 를 2 cycle 로 분할할 의지가 있는가. 셋 다 No 면 본인 안 옵션 A 로 회귀해서 Designer/Art Director 의 D 를 다음 axis 로 미루는 게 cost-vs-design 균형의 유일 해.
