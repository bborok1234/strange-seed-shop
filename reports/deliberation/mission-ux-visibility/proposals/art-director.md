# Proposal — Art Director (아트 디렉터)

- Axis slug: `mission-ux-visibility`
- Persona: art-director
- Date: 2026-05-04
- Author seat: Art Director (시각 위계 / layout grid / design tokens / motion vocabulary / asset composition)

> 본 proposal은 brief.md만 보고 작성됨. 다른 specialist의 draft를 보지 않은 isolation pass. desktop-ui-redesign spec의 토큰 vocabulary(`motion.gesture.*`, `color.surface.dock`, `spacing.*`, `radius.*`)와 align함을 default로 가정하고, 그 spec이 mobile 영역은 손대지 않는다는 §5 결정을 본 axis가 침범하지 않도록 함.

---

## Visual Hierarchy

### 시각 위계 분배 — primary / secondary / tertiary

본 axis가 만들 수 있는 가장 큰 violation은 **mission이 plot tap·자원 cluster·next-action chip의 시선 anchor를 빼앗는 것**임. brief는 mission이 dead reward 상태라고 말하지만, 이건 mission을 primary surface로 격상해도 된다는 뜻이 아님. mission은 본래 **세션 verb의 부산물**(plot tap → 진행, 수확 → 진행, 구매 → 진행)이지 verb 자체가 아님. 따라서 시각 위계에서 mission은:

| 위계 | 역할 | mission의 위치 |
|---|---|---|
| Primary (시선 anchor) | Garden plot · 다음 행동 chip · 자원 cluster | mission은 여기 들어가지 않음 |
| Secondary (ambient information) | active expedition card · album mini progress · seed-goal-banner | **mission progress = 여기 흡수** |
| Tertiary (claim 모멘트만 spike) | reward reveal motion · receipt 카드 | **mission claim 발화 시 1.8s spike만** |

### Mission progress = "있는 줄은 알지만 손은 plot에" 위계

- mission row 자체는 **secondary ambient**. 영구 noticeable하되 시선 hijack 금지.
- claim ready (`progress >= target`) 상태에서만 **tertiary spike** 허용 — pulse + `color.accent.sun` glow로 1회 시선 끌고, claim 후 즉시 secondary 톤으로 복귀.
- 튜토리얼 3종은 첫 세션에서만 시각 weight 일시 강화 (onboarding window). 이후 영구 hide 또는 collapsed.

### "왜 mission이 secondary인가" — hierarchy 정당화

1. brief Non-negotiable #4: **모바일 우선**. 모바일 viewport 414×896에서 stage(Garden)가 시각 면적의 ≥ 60%를 점유해야 player verb(plot tap)가 호흡함. mission이 primary surface(별도 큰 패널 또는 modal)가 되면 stage 면적 침범.
2. mission은 데이터·로직이 verb의 부산물이지 verb 자체가 아님 — visual weight도 verb의 부산물 위계여야 정합.
3. precedent: AdVenture Capitalist의 unlock/objective는 화면 우측 좁은 vertical lane의 secondary 위계. Cookie Clicker의 achievement도 modal 안 secondary. **production idle 컨벤션에서 mission이 primary로 올라가는 경우는 별도 mission tab을 가진 RPG 계열뿐**이고, 우리는 brief Non-negotiable #1로 6번째 탭을 거부함.

### Anti-pattern으로 거부할 것

- mission-board를 dedicated full-width 섹션으로 stage 위에 겹쳐 띄우는 안 (현재 debug 패널의 실수 그대로 production에 올리는 형태).
- mission claim 버튼이 next-action chip과 같은 시각 weight를 가지는 안 (player가 어느 verb를 할지 혼란).
- bottom-tabs에 mission 전용 badge를 6번째 슬롯처럼 추가하는 안 (Non-negotiable #1 위반).

---

## Layout Grid Per Viewport

본 axis는 desktop-ui-redesign spec의 grid를 **그대로 상속**하고, mission surface 1곳을 그 grid 안에 자연 흡수시키는 것이 최우선. 새 region을 추가하지 않음.

### Mobile (≤ `breakpoint.mobile.max` = 480px) — primary target

- Grid: 1 col, gutter `spacing.sm` (기존 그대로).
- Region: `[stage] [bottom-tabs]` (기존 그대로, 5탭 보존).
- **Mission surface 위치 = `garden-stage` 내부 `top-bar` ↔ `actionSurfaceClassName`(다음 행동 aside) 사이의 `mission-strip` 라인** — 한 줄짜리 horizontal scroll-snap strip (높이 `spacing.4xl` = 64px). 다음 행동 chip 바로 위, top-bar 자원 cluster 바로 아래.
  - 이 라인은 **튜토리얼 미완 시에만 mount**. 튜토리얼 완료 후에는 collapsed pill 1개로 축소(높이 `spacing.lg` ≈ 24px) 또는 unmount.
- Daily mission은 mobile에서는 **다음 행동 aside 안의 secondary cluster** (다음 행동 본문 아래 vertical stack 3개, 각 `spacing.md` 높이의 micro-row). 정원 verb가 다음 행동에 collocate되는 mental model 보존.
- bottom-tabs 5탭 균등 stretch: 보존(brief 제약). 6번째 탭 추가 0.

### Tablet (481-1024px)

- Grid: desktop spec 8 col + floating dock overlay (그대로 상속).
- Mission surface는 floating dock 안에 **secondary cluster 1개로 흡수** — currency cluster · next-action chip · active expedition card에 이어 4번째 stack item.
- 모바일의 `mission-strip`은 481px 이상에서는 mount 안 됨 (dock으로 이전 완료).

### Desktop (≥ `breakpoint.desktop.wide` = 1280px)

- Grid: 12 col `[rail (col-span-2)] [stage (col-span-7)] [dock (col-span-3)]` (desktop spec 그대로).
- **Mission surface 위치 = `SideDock` 내부 cluster, currency cluster ↘ next-action chip ↘ active expedition card ↘ `mission cluster` ↘ album mini progress 순.**
  - mission cluster는 vertical stack: 튜토리얼 active 1개 + 데일리 3개 (max 4 row, 평균 2-3 row). 한 row = `mission-row` 컴포넌트 1개, 높이 `spacing.3xl` (48px) ~ `spacing.4xl` (64px).
  - rail 4탭에 mission 전용 항목 추가 0 — Non-negotiable #1 보존.
- claim ready row: `color.accent.sun` glow + `motion.gesture.reveal` 발화. cluster가 사용자 시선 grab하지만 stage(plot tap) 위로 absolute로 떠오르지 않음 — sibling region 안에서만 강조.

### Desktop ultra (≥ 1680px)

- mission cluster는 동일 위치, 단 row 높이 `spacing.4xl`(64px) 보존하면서 description text를 두 줄로 표시 가능 (subtitle line 추가).

### 5 surface 어디에도 흡수 안 되는 이유 → dock으로 결정

- 정원: stage = Garden 전용 (desktop spec §1) — mission row가 stage 위로 floating overlay되면 art-only zone 약속 위반.
- 씨앗·도감·원정·상점: 4탭의 dock 가변 확장 surface 안에 mission을 넣으면 player가 그 탭을 열어야만 mission을 봄 — brief success 조건 "production player가 켰을 때 mission의 존재를 인지" 실패.
- mission은 **5 surface 어디에도 자연 흡수되지 않음** (brief 본인의 관찰). 따라서 dock의 secondary cluster에 영구 노출이 가장 정합. dock는 desktop spec §3에서 이미 "ambient information vertical stack"으로 정의됨 — mission도 ambient information.
- 모바일에서는 dock 자체가 없으므로 stage 내부 `mission-strip`이 dock의 역할 대신함.

---

## Design Tokens to Introduce

본 axis는 **신규 토큰 0종 도입을 default**로 하고, 부득이한 경우만 desktop spec § Design Tokens의 vocabulary 안에서 alias 신설. 이유: desktop spec §5에서 "신규 토큰만 도입, rename 별도 axis" 결정이 있었고, mission UX는 그보다 더 작은 axis이므로 토큰 vocabulary 확장 자격이 없음.

### 재사용 (신규 0)

| 용도 | 재사용 토큰 |
|---|---|
| mission cluster 배경 | `color.surface.dock` (desktop spec) — dock 안 sibling이므로 일치 |
| mission row 배경 | `--surface-raised` (기존 mobile 토큰) — mobile `mission-strip`과 dock cluster 동일 톤 |
| claim ready glow | `color.accent.sun` (desktop spec) — next-action chip hot-state와 동일 vocabulary |
| row entry motion | `motion.gesture.reveal` (gentle × entrance) |
| claim 모멘트 spike | `motion.gesture.celebrate` (celebrate × emphasized) — reward-pop과 같은 family |
| progress bar 진행 motion | `motion.gesture.ambient` (swift × standard, loop) — breathe 톤 |
| row tap feedback | `motion.gesture.tap` (snap × standard) |
| 튜토리얼 onboarding 첫 발화 | `motion.gesture.chapter` (chapter × entrance, 720ms) — 세션 시작의 narrative beat |

### 신규 alias 1종 — 정당화 (자제하지만 1개만)

| 토큰 | 값 | 사용처 | 정당화 |
|---|---|---|---|
| `spacing.row.mission` | `spacing.3xl` (48px) ~ `spacing.4xl` (64px) | mission row 높이 — mobile strip 1줄, desktop dock cluster 1줄 모두 동일 높이 보장 | mission row 높이가 viewport마다 달라지면 mobile-desktop continuity 깨지므로 명명된 토큰 필요. 단순 alias이므로 desktop spec의 spacing 체계 침범 0. |

위 1종 외 추가 토큰 신설 거부. 예: `color.mission.tutorial`, `motion.gesture.mission-claim` 같은 mission-specific 토큰은 vocabulary 분열만 만들고 desktop spec의 cross-region motion vocabulary 5종 lock-in을 깨뜨림.

### 사용 금지 (회수 대상)

- mission cluster 안에서 raw hex 또는 raw px 사용 0건. 위반 시 critique에서 본인이 self-call.
- `motion.duration.swift/gentle/chapter/celebrate/snap` 외 keyframes·duration 직접 박기 금지.

---

## Motion Vocabulary

mission UX의 motion은 **5 gesture 안에서 5 시점에만 발화**. 그 외 motion 자체 추가 0. 단발 발화 또는 vocabulary 외 keyframes 도입은 Art Director MUST push back 항목 직격.

### 5 시점 mapping

| 시점 | gesture | duration | trigger | 시각 결과 |
|---|---|---|---|---|
| 1. mission cluster 진입 (dock mount, mobile strip mount) | `motion.gesture.reveal` | 420ms | viewport 진입 또는 첫 mount | row가 아래에서 위로 fade-in + slide |
| 2. progress 증가 (예: 수확 시 5/3 → 5/5) | `motion.gesture.ambient` | 220ms loop | `advanceMission` event | progress bar fill width transition + 잠깐 glow |
| 3. claim ready 전환 (`progress >= target` 첫 도달) | `motion.gesture.chapter` | 720ms | progress 마지막 tick | row 전체가 `color.accent.sun` glow + 미세 lift, claim button이 dim → emphasized 상태로 reveal |
| 4. claim 버튼 tap | `motion.gesture.tap` | 120ms | onClick | button press feedback (instant) |
| 5. claim reward 수령 후 row 사라짐 | `motion.gesture.celebrate` | 880ms | claim 성공 후 | row가 cream pulse + `+X 잎` floating chip이 currency cluster 방향으로 이동(leaf-trail vocabulary 재사용) → row collapsed |

### 발화 거부

- daily mission이 매일 자정 reset 시 별도 motion 발화 ❌ (별도 timezone axis 범위, brief 명시).
- 튜토리얼 3종 동시 mount 시 stagger 발화는 **gesture.reveal 내 stagger 80ms** 한정 — 새 vocabulary 신설 0.
- claim 시 confetti·particle·sound asset 신규 도입 ❌ (brief Out of Scope).
- mission row tap 시 modal expand ❌ — modal motion은 desktop spec § Open Q3 cross-region elevation의 결정 영역. 본 axis가 선결 안 함.

### 일관성 보장

- 위 5 시점은 모두 desktop-ui-redesign spec의 5 gesture 안에 들어감. 기존 ship된 motion(`tap-bounce`, `reward-pop`, `harvest-ready`, `leaf-trail`)와 충돌 없음 — `gesture.celebrate`는 `reward-pop`과 같은 family, `gesture.ambient`는 `harvest-ready`와 같은 family로 향후 alias remap axis에서 묶일 수 있음.
- mobile `mission-strip`과 desktop `dock cluster`는 같은 5 gesture를 사용 — viewport별 motion 다양화 0.

---

## Asset Composition

### 신규 일러스트 / sprite 0개 (brief Out of Scope 강제)

- mission icon: 기존 family motif(`herb` / `candy` / `lunar`) icon 재사용. mission-specific custom icon 신설 ❌.
- mission category 시각 구분(튜토리얼 vs 데일리)은 **icon 변경이 아니라 row 좌측 4px 컬러 strip**으로 처리. 컬러는 기존 `--state-ready`(데일리 active) / `--text-muted`(튜토리얼 진행중) 재사용.
- claim reward 시 floating `+X 잎` chip: 기존 `leaf-trail` motion + `fx_production_tick_leaf_001` asset 재사용.

### Composition 규칙

- **mission row 안 negative space ≥ 35%** (icon + label + progress + button). 정보 밀도가 낮은 row가 dock vertical stack을 시각적으로 호흡시킴 — 자원 cluster · next-action chip 같은 dense row 사이의 ambient breathing 역할.
- **stage(Garden) 침범 0** — mission cluster는 dock region 안에만 머무름. mobile `mission-strip`도 stage 내부이지만 art 영역(plot 위)이 아니라 top-bar와 next-action 사이의 narrow strip만 점유.
- 따뜻한 햇살 온실 art bible 보존 — `color.accent.sun`이 claim ready glow에 사용되어 햇살 = 보상 비유와 일관. `color.surface.dock`(cream raised)이 mission cluster에 사용되어 art와 충돌하지 않는 warm pastel 유지.

### Mobile에서의 Asset Composition 추가 주의

- mobile `mission-strip`은 **horizontal scroll-snap**. row max 4개가 한 화면에 펼쳐지지 않고 1개씩 swipe로 보임. 이유: viewport 414px에서 row 4개 vertical stack이 stage 면적을 60% 미만으로 누름 → primary art zone 약속 위반.
- horizontal scroll의 시각 cue: 우측 1.5번째 row를 부분 visible로 노출 (peek). cue 없으면 player가 mission이 1개뿐이라고 오해 가능.
- 튜토리얼 완료 후 strip이 collapsed pill 1개로 축소되면 stage 면적이 다시 회복됨 — onboarding window 종료 시 art breathing 회복이 명시 의도.

---

## Disagreements I Anticipate

### 1. Designer가 "mission을 verb의 spotlight로 격상해야 player retention이 올라간다"고 주장할 가능성

- 예상 Designer 안: mission을 다음 행동 chip과 동등한 위계로 올리거나, 첫 세션에서 mission이 다음 행동을 잠시 대체하는 onboarding 장치.
- 내 push back: mission은 verb의 부산물이지 verb 자체가 아님. mission이 다음 행동을 대체하면 player의 "내가 무엇을 할 것인가"의 single source of truth가 chip ↔ mission 사이에서 분열됨. brief의 success 조건 "튜토리얼 3종이 첫 세션 onboarding의 다음 행동 guidance와 충돌 없음"의 충돌 없음 = mission이 다음 행동을 대체하지 말 것을 의미한다고 해석.
- 타협 가능 지점: 튜토리얼 mission 3종에 한해 첫 30초 동안 `gesture.chapter` 발화로 mission cluster 첫 row를 일시 시각 강화. 영구 위계 변경 없이 일시 spike만.

### 2. Engineer가 "mobile horizontal scroll-snap은 React 컴포넌트로 구현 비용·QA 비용이 크다"고 비용 깎기 시도

- 예상 Engineer 안: mobile에서도 vertical stack 그대로, scroll은 native overflow.
- 내 push back: vertical stack은 stage 면적을 누르고 art bible의 ≥ 60% stage 약속을 깨뜨림. `scroll-snap-type: x mandatory` 한 줄로 구현 가능한 native 패턴이고, 별도 라이브러리·컴포넌트 신설 없음. cost ≠ visual hierarchy 결정의 정당화.
- 타협 가능 지점: 만약 Engineer가 horizontal scroll-snap의 모바일 webview 회귀 case를 1건 이상 evidence로 제시하면, 모바일은 vertical stack + max-height `spacing.4xl × 2`(128px)로 clamp + overflow-y-auto로 한 row만 보이고 scroll로 노출. stage 면적은 약간 누르지만 화면 박살은 면함.

### 3. Engineer 또는 Designer가 "claim ready spike의 `gesture.chapter` 720ms는 너무 길다"고 깎기 시도

- 예상 안: 220ms `gesture.swift`로 발화하거나 motion 자체 생략.
- 내 push back: claim ready는 mission UX 사이클의 **narrative beat** — secondary cluster에 묻혀 있던 row가 player의 시선을 한 번은 받아야 dead reward 문제(brief)가 해소됨. 720ms는 desktop spec §motion에서 narrative beat 중간대역으로 lock-in된 수치. 220ms 발화는 player가 인지 전에 끝나서 spike 효과 0.
- 타협 가능 지점: 튜토리얼 mission claim ready만 720ms 사용, 데일리 mission claim ready는 420ms `gesture.reveal`로 다운그레이드. 데일리는 player가 매일 5번 보므로 chapter beat 매번 발화는 over-fire.

### 4. Senior Critic이 "mobile-first 가정이 데이터 0이고, 모바일 player가 mission strip을 발견 못 하면 brief success 조건 실패"라고 지적할 가능성

- 예상 Critic 지적: mobile `mission-strip`이 narrow strip(높이 64px)에 들어가서 player가 인지 못 함. 자원 cluster와 다음 행동 chip 사이의 dead zone으로 흡수.
- 내 self-defense: strip은 첫 mount 시 `gesture.reveal` 발화로 한 번은 player 시선을 끔. 튜토리얼 3종이 active인 onboarding window에서 strip 우측 peek + glow가 시각 cue. 그 후에는 collapsed pill로 축소되어 dead zone 회피.
- 인정: telemetry 없이 "mobile player가 strip을 인지한다"는 가정 자체는 데이터로 검증 못 함. desktop spec §6 패턴대로 가정 명시 + telemetry 후속 axis 명시로 honest 처리.

### 5. Designer가 "데일리 mission이 데일리 복귀 cycle hook 역할을 하려면 더 강한 시각 강조가 필요"라고 주장

- 예상 Designer 안: 데일리 mission cluster를 dock 최상단으로 promote하거나, 자정 reset 시 별도 toast/modal 발화.
- 내 push back: dock 최상단은 currency cluster의 자리 — desktop spec §4 Decisions Resolved에서 "자원 cluster top, next-action chip below"로 lock-in됨. mission이 currency를 밀어내면 데스크톱 spec 결정 위반. 자정 reset toast는 brief Constraint "Daily reset 무관 — UTC 자정 리셋 메커니즘은 본 axis 범위 외" 직접 위반.
- 타협 가능 지점: 데일리 cluster 안에서 데일리 row만 좌측 4px strip에 `color.accent.sun` 약한 tint를 영구 부여(claim ready 전이라도). 자원 anchor를 깨지 않으면서 데일리 = "오늘의 보너스" 시각 cue 영구 노출.

---

## Open Questions

본 5 질문은 우선순위 순. 1번이 가장 결정적.

### Q1 (필수, 본 axis spec.md 안에서 결론) — Mobile에서 mission-strip을 stage 안에 둘지 vs bottom-tabs 위에 둘지

- 본 proposal은 stage 내부(top-bar와 다음 행동 사이) 채택. 그러나 stage = art-only zone 약속(desktop spec §1 정신)을 mobile에서도 지키려면, strip을 stage 밖(bottom-tabs 위 narrow band)에 두는 안도 후보.
- 결정 기준: mobile에서 player의 시선 첫 anchor가 어디인가. 자원 cluster(top-bar) 직후라면 stage 내부 위가 정합. plot tap 직후라면 bottom-tabs 위가 정합.
- 본 axis spec.md에서 lock-in 권고. follow-up axis로 미루면 PR 단계에서 ad-hoc 결정됨.

### Q2 (필수, 본 axis spec.md 안에서 결론) — claim ready spike(`gesture.chapter` 720ms)가 데스크톱 dock에서만 발화할 것인가, mobile strip에서도 발화할 것인가

- 모바일 strip은 collapsed pill일 가능성이 높아 chapter spike가 시각적으로 호흡할 공간이 부족할 수 있음.
- 본 proposal default: 양쪽 모두 발화. 그러나 mobile pill collapsed 상태에서 720ms motion은 cramped할 수 있어 designer/engineer cross-check 필요.

### Q3 (Cycle 1 PR 안에서 결정) — 튜토리얼 mission 완료 후 strip/cluster의 collapsed 상태 사양

- 튜토리얼 3종이 모두 claimed가 되면 strip(mobile) 또는 cluster 상단 3 row(desktop)는 collapsed pill / unmount / persistent thin row 중 무엇?
- 본 proposal default: collapsed pill 1개로 축소(데일리 cluster는 그대로 유지). 그러나 unmount가 art breathing에 더 honest할 수 있음.

### Q4 (별도 axis로 위임 가능) — mission tap 시 detail modal 또는 expand 인터랙션 도입할지

- 현재 mission row는 단순 progress + claim button. tap 시 reward 미리보기·관련 verb shortcut 등 detail surface가 필요할 수 있음.
- 본 axis 범위 외로 분리 권고 — `mission-detail-interaction` follow-up axis. modal motion은 desktop spec Open Q3 cross-region elevation 결정에 의존.

### Q5 (telemetry axis 선결) — 튜토리얼 mission 3종이 첫 세션 player의 평균 몇 분 안에 완료되는가

- 본 proposal은 onboarding window를 "튜토리얼 active 동안 + claim 후 short-term"으로 정의했으나, 평균 완료 시간 데이터 0. `desktop-session-telemetry` follow-up axis와 합치거나, 별도 `mission-onboarding-telemetry` axis로 분리.
- 결과에 따라 collapsed pill 전환 시점·strip mount 조건의 default가 달라짐.

---

## References

- Brief: `reports/deliberation/mission-ux-visibility/brief.md`
- Persona: `docs/studio/personas/art-director.md`
- Workflow: `docs/studio/DELIBERATION_WORKFLOW.md`
- Desktop spec (token vocabulary 상속 source): `reports/deliberation/desktop-ui-redesign/spec.md` — §Design Tokens, §Decisions Resolved §1·§4·§5
- Code observed (no modification): `src/App.tsx:643, 2160-2183, 2348-2351, 2880-2904`, `src/styles.css:115-126, 128-144, 880-922, 3825-3937, 3970-3987, 4353-4398, 4906-5013`
- Art bible: `assets/source/asset_style_bible.json` — warm whimsical mood + family motif (herb/candy/lunar) 보존
