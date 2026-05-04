# Critique — Art Director (아트 디렉터)

- Axis: `desktop-ui-redesign`
- Persona: Art Director
- Date: 2026-05-04
- Round: Phase 3 — Cross-Critique
- 입력: 본인 proposal + Designer proposal + Engineer proposal + brief

본 critique는 시각 hierarchy / grid / token / motion vocabulary / asset breathing room 5개 lane에서만 친다. 비용·일정·verb 흐름의 정당성에는 손대지 않는다 (Engineer / Designer 영역).

---

## 1. Disagreement with Designer's proposal

### 1-1. **Tab Drawer가 stage 위 38%를 overlay로 덮는 순간 `stage` region의 art-only 약속은 깨진다 — HUD-hiding-art stacking 위반의 재발명**

Designer 안 D는 4개 sub-tab(씨앗·도감·원정·상점)을 우측에서 슬라이드되는 *non-blocking overlay drawer*로 정의했고, drawer 폭을 viewport ~38%로 잡았다. 시각 언어로 번역하면: **drawer가 열린 순간 stage region(col-span-7 = 폭 ~58%)의 우측 절반이 React panel surface에 가려진다.** 내 proposal §5에서 stage region은 *art ≥ 70% 면적, React 가림 ≤ 30%* 로 못 박았는데, drawer 열림 상태는 이 규칙을 정면 위반한다.

더 큰 문제는 *drawer가 닫혀 있어도* 시각 위계가 이미 약해진다는 것. drawer를 열 수 있다는 affordance(우측 모서리의 grab handle / 탭 segmented control)는 stage 우측 모서리에 영구 노출되어야 하는데, 이건 stage edge에 `spacing.3xl` 이하의 ambient 띠로 누른다 해도 *primary art가 호흡할 우측 가장자리(원경 sky / 햇살 highlight 영역)*를 잘라먹는다. 햇살 온실 art bible에서 우상단은 *광원이 들어오는 anchor*다. 거기에 drawer handle이 박히면 광원 composition이 깨진다.

대안 — drawer를 stage 위가 아니라 **dock region을 가변 폭으로 확장하는 형태**로 바꾸면 hierarchy 보존 가능. 즉 dock(col-span-3)이 drawer 활성 시 col-span-5까지 확장하고 stage는 col-span-7 → col-span-5로 비례 축소. 이러면 stage는 art-only로 호흡 유지, dock은 정보 밀도 모드 전환. Designer가 "drawer는 우회 verb의 closure를 강제한다"고 했는데 그 closure는 *region 폭 변화* 로도 충분히 강제된다 (dock 확장 → 축소 = closure motion).

### 1-2. **Side Dock의 next-action chip을 resource HUD 위로 올린 결정이 visual weight 위계와 정면 충돌**

Designer §4: "next-action chip을 Side Dock 최상단에 둔다 (resource HUD 위쪽)." 이유는 verb 우선이라는데, 시각 hierarchy 입장에서 *dock region 내부의 vertical stack은 위→아래 = primary→secondary 시선 흐름*이다. next-action은 단발 verb chip(한 줄 카피), resource HUD는 영구적 ambient 정보(3개 currency cluster). 둘을 같은 column에서 위아래로 stack했을 때 *위에 놓인 것이 시각 weight를 가져간다*.

문제: next-action chip은 자원 0/0/0 첫 30초 이후에는 *변화가 적은 정적 텍스트*다. 반면 resource HUD는 잎/꽃가루/재료가 tap·수확·원정 회수마다 +N pulse(`motion.gesture.celebrate`)가 발화되는 *살아 있는 cluster*다. 정적 chip을 위에, 살아 있는 cluster를 아래에 두면 **시선 anchor가 정적인 곳에 잡히고 motion이 발화되는 곳은 시야 변두리로 밀린다.** reward 체감은 motion이 시선 안에서 발화될 때 강한데, dock 하단으로 밀린 HUD는 시야 가장자리에서 pulse를 흘려보낸다.

Designer가 "첫 세션 player에게 next-action이 우선"이라 했는데, 첫 세션 visual onboarding은 next-action *chip의 hot-state highlight(예: `color.accent.sun` glow + `motion.gesture.reveal`)*로 해결할 수 있다. 위치 자체를 위로 올리는 건 **영구 hierarchy를 일시적 onboarding 위해 희생**하는 거래. 안 받음.

### 1-3. **Top Bar 영구 띠는 hero scale 토큰 낭비 + stage row 면적 침식**

Designer §1-D: Top Bar에 타이틀 + 서브타이틀(`햇살 온실 정원`)을 영구 띠로 둔다. 내 proposal §2에서 `header.row` height를 `clamp(56px, 6vh, 72px)`로 잡고 §7 Open Question 3에서 "header.row 폐기 가능, stage 면적 +60px 확보" 가능성을 열어뒀다. Designer가 영구 Top Bar로 Lock-in 하면 *stage 세로 면적이 영구히 60-72px 깎인다*.

art bible identity 노출이라는 정당화는 시각 언어로 약하다 — 햇살 온실 톤은 **stage region 자체의 background art**가 매 frame 노출하는데, 그 위에 별도 `type.heading.md` 텍스트 띠를 하나 더 영구화하는 건 같은 메시지를 두 번 말하는 것 (art가 보여주는 것 + 텍스트가 말하는 것). 시각 hierarchy의 redundancy 위반.

대안: 타이틀은 rail region 상단의 brand cluster(rail item 위 `type.label` + family motif logo)로 흡수. Top Bar 폐기. 이러면 stage row가 `clamp(56px, 6vh, 72px)` 만큼 회복되고 rail의 ambient nav가 brand identity까지 같이 들고 간다.

---

## 2. Disagreement with Engineer's proposal

### 2-1. **PR 분해에서 design token PR이 통째로 빠져 있다 — token-debt가 layout PR에 그대로 상속됨**

Engineer §2 Option A 분해를 보면 PR0(shell refactor) → PR1(breakpoint scaffolding) → PR2(side-dock 시각 구현) → PR3(nav rail) → PR4(garden-stage 확장) → PR5(polish)다. **여기 어디에도 `motion.* / spacing.2xl·3xl·4xl / radius.panel 16px / elevation.4단 / typography.heading.lg` 토큰을 도입하는 PR이 없다.** Engineer는 §6 Art Director 측 disagreement에서 "motion duration 결정은 Art Director 권한"이라 위임만 하고 PR 슬롯은 안 만들어줬다.

이건 시각 lane에서 치명적이다. PR2(side-dock)는 dock card의 `radius.panel`(16px)·`elevation.raised`·dock card 진입 motion(`motion.gesture.reveal` 420ms)을 *전제로* 시각 구현되어야 하는데, 토큰이 없으면 PR2가 raw px·임시 cubic-bezier를 박아서 merge된다. 그러면 PR5(polish)에서 토큰화하려 할 때 *실제로는 PR2의 시각 결정을 retroactive하게 다시 짜야* 한다 — `radius` 8 → 16으로 바꾸면 dock card 내부 padding·아이콘 위치 다 다시 잡아야 하고, `elevation`이 늘어나면 dock-stage 경계가 다른 무게로 보인다.

내가 받을 수 있는 PR 분해는 **PR0(shell) → PR0.5(token introduction, CSS-only, 시각 noop) → PR1(breakpoint) → PR2+** 순. PR0.5는 `:root` `--token` 정의 추가 + 신규 desktop 영역에서만 사용할 토큰 alias 등록만, 기존 raw px 마이그레이션 0건이라 시각적으로 noop이고 회귀 0. Engineer의 "≤ 500줄 / ≤ 5 파일" 룰 안에 들어간다. 이걸 안 빼면 token-debt가 PR2~PR5 전체에 compound된다.

### 2-2. **`radius.panel` 8 → 16 격상 / `--space-1..6` rename 비용을 "별도 axis"로 미룬 건 신규 desktop region의 art bible align을 깬다**

Engineer §6 Art Director 측: "color/motion 결정은 Art Director에 위임. layout token/grid만 정의." 그리고 §2의 PR4(polish)도 token 도입 슬롯을 안 잡았다. 내 proposal §3에서 `radius.panel`을 8px → 16px로 격상한 이유는 *desktop scale에서 8px corner는 art bible의 hand-painted soft 톤과 충돌*하기 때문 — 이건 layout 결정이 아니라 art bible align 결정이고 본 axis 범위 안이다.

문제: dock region의 card 외곽 radius를 PR2에서 어떻게 잡느냐는 *PR2 시각 구현의 핵심 의사결정*이다. Engineer가 "radius는 별도 axis"라 미루면 PR2는 기존 `--radius-panel: 8px`로 박혀서 merge되고, 이후 별도 axis에서 16px로 올릴 때 dock card 내부 layout(아이콘 sizing, currency cluster pill의 시각 균형)이 다시 깨진다. *desktop region 신규 코드는 16px로 시작해야 회귀 0*.

마찬가지로 `--space-1..6` → `spacing.xs..4xl` rename도 *신규 desktop 영역 한정*이면 ≤ 100줄 안에 처리 가능. Engineer가 §7 Open Question 5에서 "데스크톱에서 cream 매트 자리에 들어갈 시각 요소"를 묻는데, 그 답을 내가 토큰 이름으로 줘도 토큰이 PR에 안 실리면 무의미하다. **token PR을 cost 계산에 포함시키지 않은 건 시각 lane에서 hidden debt**.

### 2-3. **Phaser canvas 60fps spike를 garden-stage ⅔ 폭(Option A) 시나리오로만 잡은 건 dock region의 motion vocabulary 부담을 누락**

Engineer §4 Performance Budget Impact: "1920×1180 viewport에서 garden-stage ⅔ 폭일 때 Phaser scene 60fps 유지 여부 측정." 그리고 §6: "한 번에 active한 tween 수 8개 이하 유지 권고."

내 proposal §4에서 dock region 내부에 *동시* 발화 가능한 motion vocabulary 4종을 정의했다 — currency tick(`celebrate` 880ms), next action morph(`reveal` 420ms), expedition timer ambient(`ambient` 2.2s loop), rail badge update(`tap` 120ms). dock region이 stage 옆에서 *Phaser tween과 동시에* 이 4종을 발화한다. Engineer의 frame budget spike는 stage 내부 Phaser tween만 셌지 *dock 측 React motion이 같은 frame에서 reflow / composite layer를 점유하는 경우*는 안 셌다.

특히 reward 수령 순간 — Phaser stage에서 `fx_strip` 발화 + dock에서 currency tick `celebrate` 880ms + rail badge update 동시 발화. Engineer가 "한 번에 8개 tween" 권고를 했는데, 이 권고가 *어느 lane에서 8개*인지(Phaser 내부만? React 포함?) 명세가 없다. 시각 lane에서는 reward 모멘트가 player의 가장 큰 시선 anchor 순간이라 *그 frame에서 jank가 발생하면 motion vocabulary 자체가 무너진다*. spike에 React side motion budget도 같이 잡아달라는 요구가 본 axis 범위 안에 있어야 한다.

---

## 3. Self-critique

### 3-1. **token system이 신규 desktop region 한정인 척하지만 실제로는 vocabulary collision 유발**

내 proposal §3에서 `:root`의 기존 `--space-1..6`을 `spacing.xs..4xl`로 재명명하면서 "기존 1664회 raw px 마이그레이션은 점진" "신규 desktop region에만 토큰 강제"라 했는데, 이건 honest하지 못하다. 같은 한 컴포넌트 안에서 *기존 mobile path는 `var(--space-3)`을 쓰고 desktop path는 `var(--spacing-md)`을 쓰는 dual vocabulary 상태*가 된다. 같은 12px을 두 이름으로 부르는 코드는 다음 사람이 어느 토큰을 써야 하는지 매번 결정해야 하고, 결국 Engineer가 §6에서 한 "두 갈래 변경 필요" 우려를 *시각 lane에서 자가 생산*한 꼴.

honest한 결론: token rename을 진짜로 하려면 *기존 토큰까지 한 PR에서 alias로 다 묶거나*(즉 `--space-3`을 `--spacing-md`의 alias로 정의), 아니면 *rename 자체를 포기하고 기존 `--space-*` scale을 그대로 쓰면서 신규 token만 spacing.2xl·3xl·4xl로 추가하는 minimal 안*으로 가야 한다. 내 proposal은 둘 사이에서 어정쩡하게 위치했다.

### 3-2. **motion vocabulary 4-named gesture가 실제 moment library에 비해 너무 좁다**

§4에서 motion duration 4단(120/220/420/880ms) × easing 3단 × named gesture 4종(`tap`/`reveal`/`celebrate`/`ambient`)으로 잠갔는데, 현재 코드 base의 실제 motion 모먼트를 보면:

- `tap-bounce` (plot tap 즉각 피드백) — 220ms
- `reward-pop` (claim 수령) — 420ms
- `merchant-second-chapter-reveal` (chapter 전환) — 720ms
- `expedition-leaf-trail` (원정 progress) — loop
- `harvest-ready` (수확 가능 ambient) — 2.2s loop
- `seed-breathe` (성장 중 ambient) — 3.8s loop
- `album-milestone-reveal` (album_2/3) — 1.8s

7~8종 모먼트를 4-named gesture로 다 alias하라는 건 honest하지 못하다. 특히 `reveal`(420ms)과 `celebrate`(880ms) 사이의 **중간대역 (720ms / 1.8s) — chapter 전환·milestone reveal**이 vocabulary 외부로 떨어진다. 내가 §6에서 "Critic 예상 공격: 4개는 너무 적다"에 부분 동의한 후 "GardenScene 내부는 별도 vocabulary"로 도망쳤는데, milestone reveal·chapter 전환은 GardenScene 내부 mechanic이 아니라 *React layer의 receipt·overlay*라 본 vocabulary가 책임져야 하는 영역이다.

honest한 수정: vocabulary는 4 gesture가 아니라 **5 gesture (`tap` / `reveal` / `chapter` (= 720ms decelerate, narrative 전환 전용) / `celebrate` / `ambient`)** 가 맞다. duration도 4단이 아니라 5단(120/220/420/720/880ms). 이걸 본 proposal에 못 박지 못하고 "신규 motion만 4 gesture 강제"로 도망친 건 art bible의 narrative 모먼트(merchant chapter, lunar care reveal 같은 *story beat*)에 vocabulary slot을 안 비워둔 handwave.

### 3-3. **rail의 `col-span-2` width가 art bible의 family motif icon scale에 충분한지 검증 안 함**

§2 desktop grid에서 rail = col-span-2, width `clamp(180px, 14vw, 220px)`로 잡았는데, §7 Open Question 4에서 tablet rail이 ~205px이면 icon-only가 된다고만 적고 desktop 1280-1680px 범위에서도 사실상 `clamp(180px, 14vw, 220px)`은 *180-235px* 사이를 오간다. 이 폭은 *family motif icon(16-20px) + label `type.label`(12px desktop)* 수직 레이아웃은 가능하지만, **active state의 `accent.sun glow + raised elevation`이 발화될 추가 호흡 공간이 빡빡하다**. 특히 album 같은 진행도 badge(X/Y)가 label 옆에 붙으면 220px 안에서 줄바꿈 위험.

honest한 self-critique: rail width를 `clamp(220px, 16vw, 260px)`로 늘리거나, badge를 label 아래 sub-line으로 분리하는 결정 중 하나를 본 proposal에서 했어야 한다. Open Question으로 던지고 끝낸 건 도피.

---

## 4. Cross-cutting risks

### 4-1. **세 사람이 모두 "Option D"를 제안했는데 D의 정의가 다 다르다 — naming collision = consensus의 환상**

- 내 D: 3-region adaptive (rail / stage / dock), 12-col grid, vertical nav rail
- Designer D: A 변형 — Garden Stage + 영구 Side Dock + 모달형 Tab Drawer (rail 없음, drawer 슬라이드)
- Engineer D: A의 부분집합인 Shell-only refactor (PR0 prerequisite)

세 D는 *완전히 다른 layer의 결정*이다 (visual region 정의 / navigation 모델 / 코드 refactor 단위). Director가 deliberation 종합 시 "다들 D 채택"으로 잘못 읽으면 골격이 영구히 어긋난다.

시각 lane에서 본 합의 지점:
- **3 사람 모두 stage 우선 / dock 도입 / bottom-tabs equal stretch 폐기에는 동의** — 합의 있음.
- **rail vs drawer는 합의 없음** — 내 안의 vertical rail vs Designer의 drawer가 정면 충돌. Engineer는 어느 쪽이든 비용 추정 가능하다며 결정 위임.
- **token 도입 시점에 합의 없음** — 내 안은 본 axis 안에서 도입, Engineer는 별도 axis로 미룸, Designer는 무관심.

이 collision을 critic / Director에게 명시적으로 escalate해야 한다.

### 4-2. **"art bible align"을 세 사람 다 lip service로만 다룸 — 실제 align 검증 절차 누락**

- 내 proposal §5에서 art bible align 규칙(`stage` ≥ 70% art / `dock` ≥ 60% cream / `rail`은 family motif icon만)을 정의했지만 *기존 `background_*` asset이 desktop landscape 비율에 align되는지 검증은 §7 Open Question 6으로 던졌다*.
- Designer는 art bible 단어를 안 썼다 (verb 우선).
- Engineer §3 Open Question 3: "desktop에서 cream 매트 자리에 들어갈 시각 요소... 새 일러 추가는 out of scope" — 즉 art bible asset 재생성 axis가 *본 axis 결정 후 follow-up이라는 가정*이 깔려 있다.

risk: 본 axis가 ship되고 나서 *desktop stage에서 기존 배경 일러스트가 비율 안 맞아서 깨진 composition으로 노출*될 가능성이 높다. art bible align은 layout이 결정된 *직후* 검증 axis가 동시에 가야 하는데, 세 proposal 다 "follow-up" 정도로 흘렸다.

### 4-3. **모바일 viewport에서 3-region grid의 graceful degradation 경로가 명세 안 됨**

세 proposal 모두 "모바일은 현재 유지"라 적었지만, *모바일에서 dock region 내용물(currency cluster + next action + active expedition)이 어디로 가는지*는 다르다.

- 내 안: 모바일은 현재 top-bar absolute + bottom-tabs 유지, 즉 dock 자체가 모바일에서는 *region이 아니라 흩어진 absolute*.
- Designer: 모바일은 single-column + bottom-tabs 그대로, drawer 미적용.
- Engineer: 모바일 회귀 0 hard requirement, 수정 안 함.

risk: 같은 *정보 cluster*인데 viewport에 따라 위치·격(elevation·radius)이 완전히 달라지면 cross-viewport에서 *visual identity 일관성*이 깨진다. 특히 사용자가 데스크톱 → 모바일로 viewport resize했을 때 dock region이 *해체되어 top-bar로 흩어지는 transition*이 jarring할 수 있다 (내 §7 Open Question 5에서 던진 문제이지만 답 없음).

이건 본 axis가 시각 lane에서 *desktop만 보고 mobile-desktop continuity는 안 본* 결과. 세 사람 다 brief의 "mobile 보존" 원칙을 *수정 금지*로만 읽고 *시각 일관성*으로는 안 읽었다.

### 4-4. **drawer / floating overlay / dock raise 모두 "stage 위 layer"를 만든다 — z-index 위계 합의 부재**

- 내 안: dock·rail은 stage와 sibling, z-index 충돌 없음. 단 `elevation.dramatic`(reward reveal peak) 발화 시 어느 region에 떠야 하는지 미정.
- Designer: drawer가 stage 위 overlay (z 상위), Side Dock은 sibling (z 같음).
- Engineer: 명세 없음.

risk: reward reveal·milestone celebration 같은 *cross-region 모멘트*가 발화될 때 어느 layer에 떠야 하는가 — stage 안 in-canvas? dock 위 popover? full-viewport modal? 세 proposal 다 이 question을 안 다뤘다. *시각 hierarchy의 z 차원이 미정* = polish PR이 쌓이면서 매번 임시 z-index 결정으로 회귀 누적.

---

## 5. Concessions I'd accept

다음 조건이 충족되면 본 proposal의 핵심 골격(3-region rail/stage/dock + token vocabulary)을 양보 없이 sign off한다.

### 5-1. Designer에게

1. **Tab Drawer를 stage 위 overlay가 아니라 dock region 가변 폭 확장(col-span-3 → col-span-5)으로 재정의**할 것. stage region의 art-only 약속(art ≥ 70% 면적) 침해 0건이 조건.
2. **next-action chip을 resource HUD *아래*로 내리거나, 위에 두려면 chip 자체를 hot-state highlight(`color.accent.sun` glow + `motion.gesture.reveal` on update) 시 일시적으로만 시각 weight를 가져오게** 한정. 영구 위계 위반 금지.
3. **Top Bar 영구 띠를 폐기하고 타이틀을 rail 상단 brand cluster로 흡수**. stage row의 세로 면적 60-72px 회복 양보.

이 셋이 받아들여지면 Designer의 "Garden = 무대" verb 우선 정신은 본 proposal의 stage region 정의와 동일한 시각 결과가 나온다.

### 5-2. Engineer에게

1. **PR 분해에 PR0.5(token introduction, CSS-only, 시각 noop)를 추가**. `:root` 토큰 정의 + 신규 desktop region 한정 alias만, 기존 raw px 마이그레이션 0. ≤ 100줄 / 1 파일.
2. **`radius.panel` 8 → 16 격상과 `spacing.2xl·3xl·4xl` 신규 토큰 도입을 PR0.5 안에서 처리**. 별도 axis로 미루지 말 것 — 신규 desktop region 시각 구현의 전제.
3. **frame budget spike를 Phaser tween + React motion 동시 발화 시나리오로 확장**. reward 모멘트(currency tick + rail badge update + Phaser FX 동시) 한 frame에서 jank 측정 포함. spike 시간 +1시간 양보.
4. **playwright desktop snapshot 추가 (1280/1600/1920)**: Engineer §5에 이미 적힌 "1시간 spike"를 본 axis 범위 안에 명시 commit.

### 5-3. Director / Critic에게

1. **세 D가 다른 결정이라는 점을 종합 단계에서 명시 분리**할 것. consensus 환상 방지.
2. **art bible asset desktop align 검증 axis를 본 axis 다음 follow-up으로 명시 commit**. 무한 미루기 방지. 본 proposal §7 Open Question 6 escalate.
3. **mobile-desktop visual identity 일관성 검증을 별도 axis로 commit**. dock cluster의 cross-viewport identity 어떻게 잠그는지 — 본 proposal에서 못 다룬 영역.

---

## Self-check (persona contract)

- [x] Designer 비판 — 시각 hierarchy / motion vocabulary / asset breathing room 3 lane에서 substantive disagreement 3건 (drawer overlay / next-action 위치 / Top Bar 영구화)
- [x] Engineer 비판 — token-debt compound / radius·spacing 격상 미루기 / motion frame budget 누락 3건. 비용·일정 추정 0건 (Engineer lane 침범 안 함, 단 *PR 분해의 시각 결과*만 비판)
- [x] Self-critique — token rename 어정쩡한 dual vocabulary / motion vocabulary 4-gesture가 실제 moment library에 좁음 / rail width 검증 도피 3건
- [x] Cross-cutting risk — 세 D naming collision / art bible align lip service / mobile-desktop continuity 누락 / z-index 위계 부재 4건
- [x] Concessions — Designer 3 / Engineer 4 / Director 3 명시
- [x] Korean, 시각 언어로 작성
- [x] grid 좌표 / 토큰 이름으로만 spec — raw hex/px 사용 0건 (단 토큰 정의 표 인용 시는 예외)
- [x] 자기 proposal 수정 0건 (수정 금지 룰 준수)
- [x] 새 옵션 제안 0건 (제안 금지 룰 준수)
- [x] art bible (warm pastel, hand-painted) 톤 lens 유지
