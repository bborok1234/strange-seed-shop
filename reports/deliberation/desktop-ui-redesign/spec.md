# Spec — Desktop UI Layout 큰 골격 재설계

- Axis slug: `desktop-ui-redesign`
- Brief: `reports/deliberation/desktop-ui-redesign/brief.md`
- Director: studio main session 2026-05-04 (main thread Director)
- Date: 2026-05-04
- Status: draft (사용자 review gate 대기)
- Cycle: **1 of 1 (minimal)** — Cycle 2/3 후속 axis 분리 명시 (§ Implementation Sequence, § Open Questions)

## Vision

데스크톱(≥ 1280px)에서 이상한 씨앗상회를 켠 player는 화면 좌측의 narrow vertical rail로 4개 surface(씨앗·도감·원정·상점)를 인지하고, 화면 중앙·좌측 폭의 절반 이상을 점유하는 stage region에서 햇살 온실 일러스트와 plot Phaser canvas가 호흡하는 모습을 본다. stage 옆 우측 dock region에는 자원 cluster·다음 행동 chip·진행 중 원정 카드가 vertical stack으로 영구 노출되어, player는 정원 verb를 멈추지 않고도 게임의 모든 ambient 정보를 시야 안에서 받는다. 모바일(≤ 480px)에서 게임을 켠 player는 변화를 알아채지 못한다.

## Layout Skeleton

| Viewport | Grid | 명명 region |
|---|---|---|
| Mobile (≤ `breakpoint.mobile.max` = 480px) | 1 col, fluid, gutter `spacing.sm` | `[stage] [bottom-tabs]` (수직, 현재 유지) |
| Tablet (481-1024px) | 8 col, gutter `spacing.md` | `stage` (col-span-8) + `dock` (floating overlay, width `clamp(280px, 32vw, 360px)`, stage 위 right-aligned) + `bottom-tabs` (col-span-8 5-up, mobile 동일). Rail 미도입. |
| Desktop (≥ `breakpoint.desktop.wide` = 1280px) | **12 col, gutter `spacing.md`, margin `spacing.xl`** | **`rail` (col-span-2) + `stage` (col-span-7) + `dock` (col-span-3)** — sibling regions, 모두 같은 body row 안. `header.row` 폐기 (게임 title은 rail 상단 brand cluster로 흡수). |
| Desktop ultra (≥ 1680px) | 동일 12 col | dock 내부 secondary lane 1개 추가 (도감 next 카드 또는 상점 daily ambient — Cycle 2). Region 추가 없음. |

**Breakpoint 토큰 신설:** `breakpoint.mobile.max` (480), `breakpoint.tablet.min` (481), `breakpoint.tablet.max` (1024), `breakpoint.desktop.min` (1025), `breakpoint.desktop.wide` (1280, **primary target**), `breakpoint.desktop.ultra` (1680).

**Stage 정의 — 본 spec의 가장 결정적 boundary:** `stage` region은 **Garden (Phaser canvas) 전용 zone**. 다른 4 surface(씨앗/도감/원정/상점)가 stage를 교체하지 않는다. 4 surface는 모두 dock region을 가변 확장(col-span-3 → col-span-5)하여 노출된다. → § Decisions Resolved §1.

## Design Tokens

본 axis는 **신규 desktop region에서 사용할 신규 토큰만** 도입한다. 기존 `--space-1..6`, `--radius-panel(8px)` 등의 rename / 마이그레이션은 별도 follow-up axis. (Art Director self-critique 3-1 + concession 5-2.1·2 채택; Engineer critique 2-1·2-2 비용 우려 수용.)

### 신규 색 토큰 (warm pastel art bible 보존)

| 토큰 | 의도 | 비고 |
|---|---|---|
| `color.surface.dock` | dock region 배경 (cream 한 단 raised) | 기존 `--surface-raised` 톤 참조, art와 같은 warm 계열 |
| `color.surface.rail` | rail region 배경 (glass + sage tint) | 기존 `--surface-glass` 톤 참조 |
| `color.accent.sun` | 햇살 highlight, primary verb active glow, next-action chip hot-state | 신규 |

### 신규 spacing 토큰 (desktop hero scale)

기존 `--space-1..6`은 그대로 유지(rename 별도 axis). 신규만 추가:

| 토큰 | 값 | 사용처 |
|---|---|---|
| `spacing.2xl` | 32px | desktop margin·region gap |
| `spacing.3xl` | 48px | region 간 separator·hero spacing |
| `spacing.4xl` | 64px | rail 상단 brand cluster padding 등 |

### 신규 radius 토큰

| 토큰 | 값 | 사용처 |
|---|---|---|
| `radius.hero` | 24px | stage region outer container, brand cluster |
| `radius.panel.desktop` | 16px | dock card·rail item — desktop 전용. 기존 `--radius-panel: 8px`은 mobile에서 그대로. |

### 신규 elevation 토큰

| 토큰 | 의도 |
|---|---|
| `elevation.dock.raised` | dock card (`0 8px 20px rgba(35,58,43,0.10)`) |
| `elevation.dramatic` | reward reveal peak (cross-region 모멘트, § Open Questions Q3) |

### 신규 motion 토큰 — vocabulary는 **5 gesture** (Art Director self-critique 3-2 채택)

Critic challenge B3 + Art self-critique 3-2 honest: 4 gesture는 narrative beat 중간대역(720ms)을 못 담는다. 5 gesture로 잠근다.

#### Duration

| 토큰 | 값 |
|---|---|
| `motion.duration.snap` | 120ms |
| `motion.duration.swift` | 220ms |
| `motion.duration.gentle` | 420ms |
| `motion.duration.chapter` | 720ms |
| `motion.duration.celebrate` | 880ms |

#### Easing

| 토큰 | 값 |
|---|---|
| `motion.easing.standard` | `cubic-bezier(0.2, 0.0, 0.2, 1)` |
| `motion.easing.entrance` | `cubic-bezier(0.0, 0.0, 0.2, 1)` |
| `motion.easing.emphasized` | `cubic-bezier(0.2, 0.9, 0.28, 1.12)` |

#### Named gesture (vocabulary)

| 토큰 | 결합 | 의도 |
|---|---|---|
| `motion.gesture.tap` | snap × standard | 즉각 피드백 |
| `motion.gesture.reveal` | gentle × entrance | dock card 진입, receipt 등장 |
| `motion.gesture.chapter` | chapter × entrance | merchant chapter 전환, milestone reveal 같은 narrative beat |
| `motion.gesture.celebrate` | celebrate × emphasized | reward 수령, currency tick |
| `motion.gesture.ambient` | swift × standard (loop) | breathe·pulse |

신규 region transition motion은 5 gesture 외 사용 금지. 기존 `tap-bounce`/`reward-pop`/`harvest-ready`/`leaf-trail` 등 ship된 motion은 본 axis 범위 외 — 별도 vocabulary alias axis에서 점진 remap.

## Component Composition

### Existing → New

| Component | 현 위치 | 새 위치 (desktop) | 모바일 |
|---|---|---|---|
| `BottomTabs` (`styles.css:3825`) | bottom-tabs absolute, 5-up stretch | **rail에 vertical 4탭** (정원 제외, 씨앗/도감/원정/상점) — `data-orientation` 분기 또는 별도 컴포넌트 분기 | 변경 없음 (5탭 유지) |
| Top Bar (`top-bar` 헤더) | 상단 띠, 게임 title + currency cluster + objective chip | **폐기**. 게임 title은 rail 상단 brand cluster로 흡수. currency/objective는 dock으로 이전 | 변경 없음 |
| `garden-stage` (`App.tsx:2790`+) | viewport 거의 전체 | stage region (col-span-7), Phaser canvas + 배경 art | 변경 없음 |
| `dev-panel` (현 우상단 floating) | `width: min(42%, 500px)` absolute | **dock region (col-span-3)으로 sibling 격상**. 4 sub-tab(씨앗/도감/원정/상점) 콘텐츠는 dock 가변 확장(→ col-span-5)으로 노출 | 변경 없음 (dev-panel 위치 유지) |
| Currency cluster (잎/꽃가루/재료) | top-bar absolute pill | **dock 상단 vertical card** (`elevation.dock.raised`, family motif icon + 숫자 + delta). cream pill 폐기 | 변경 없음 |
| Next-action chip | top-bar 옆 chip | **dock의 currency cluster 아래** vertical stack 위치. 단 hot-state(첫 30초 onboarding, expedition 완료 등) 발화 시 `color.accent.sun` glow + `motion.gesture.reveal`로 일시적 시각 weight 강화 | 변경 없음 |
| Active expedition card (#384 progress bar + leaf-trail) | expedition tab 내부 | **dock 안 next-action 아래 vertical card**. 폭은 dock col-span-3 (~270~432px)에 맞춰 progress bar 재사이즈 (motion 자체는 유지, 위치만 이전) | 변경 없음 |
| Album mini progress (`albumDiscoveredCount/total`) | tab badge | dock 하단 secondary card (Cycle 1에서는 단순 텍스트 + 클릭 시 dock 가변 확장 → 도감 surface 노출) | tab badge 유지 |
| `stageHeroCreature` (현 React overlay) | garden-panel 안 absolute | **stage region 내부 lower-third** edge ambient 띠 (≤ `spacing.3xl` 높이). Phaser scene 안 이주는 본 axis 범위 외 (§ Open Questions Q4) | 변경 없음 |

### New components

| Component | 역할 |
|---|---|
| `RailNav` | desktop 좌측 vertical 4탭 + 상단 brand cluster. mobile에서는 mount 안 됨 (matchMedia 분기). |
| `SideDock` | desktop 우측 vertical container. 가변 폭(col-span-3 ↔ col-span-5). children: currency cluster / next-action / active expedition / album mini / 가변 확장 시 4 surface 콘텐츠 slot. mobile에서는 mount 안 됨. |
| `useDesktopLayout()` hook | matchMedia(`min-width: 1280px`) 구독. layout 분기 flag 1개. PlayerSave 침범 0. |

### Removed / deferred

- Designer 안의 **drawer (stage 위 overlay)** — 거부. → § Decisions Resolved §3.
- Art Director 안의 **stage = 5 surface 교체 zone** 해석 — 거부. stage는 Garden 전용. → § Decisions Resolved §1.
- 4 surface 콘텐츠 자체의 desktop optimized layout (도감 grid 재배치, 원정 카드 폭 확장 등) — Cycle 2 후속 axis.
- Token rename (기존 `--space-*`, `--radius-panel` → `spacing.*`/`radius.*`) — 별도 axis.
- 기존 12종 keyframes의 5-gesture vocabulary remap — 별도 axis.
- GardenScene 내부 plot grid anchor 조정 (Critic C2 + Designer cross-cutting risk a) — 별도 axis (`garden-scene-anchor-adjustment`).
- stageHeroCreature React → Phaser 이주 — 별도 axis.

## Acceptance Criteria

- [ ] Desktop ≥ 1280px에서 `stage` region이 viewport 폭의 ≥ 55% 점유 (col-span-7 / 12 = 58.3%, gutter 제외 실제 ~57%).
- [ ] Desktop ≥ 1280px에서 빈 cream 매트(React 패널이 art를 가리는 영역) ≤ viewport 면적 25% (현재 ~70% → 목표 ≤ 25%).
- [ ] Desktop에서 `BottomTabs`의 horizontal 5-up stretch가 렌더되지 않음 (rail이 대체).
- [ ] Desktop에서 currency cluster가 cream pill로 stage 위 absolute로 떠 있지 않음 (dock 내부 vertical card로 이전 완료).
- [ ] 모바일 ≤ 480px 시각 회귀 0 — playwright snapshot 비교 (1280×800은 새, 414×896은 baseline 유지).
- [ ] 모바일 ≤ 480px에서 `RailNav` / `SideDock` 컴포넌트가 mount되지 않음 (DOM에 부재 확인).
- [ ] Tablet 481-1024px에서 dock이 floating overlay로 부분 도입, rail은 도입 안 됨 (bottom-tabs 5-up 유지).
- [ ] 새 토큰 5종(`spacing.2xl/3xl/4xl`, `radius.hero`, `radius.panel.desktop`) 모두 `:root` 정의 + 신규 desktop region CSS에서 ≥ 1회 사용.
- [ ] 새 motion 토큰(`motion.duration.*` 5종, `motion.gesture.*` 5종)이 `:root` 정의 + dock card 진입 motion 1곳, rail item active 1곳에서 사용.
- [ ] `npm run build` 통과.
- [ ] `npm run check:ci` 통과 — 모든 항목.
- [ ] `PlayerSave` / `persistence.ts` / `GardenScene.ts` / `GardenPlayfieldHost.tsx` 변경 0줄.
- [ ] 신규 `localStorage` key 0개 (Cycle 1 범위에서는 layout 선호도 저장 불필요. Cycle 2에서 필요 시 별도 namespace).
- [ ] Bundle size delta ≤ +6KB CSS gzipped + +2KB JS gzipped (Engineer baseline +Art 신규 토큰만 + Designer dock 4 cluster 측정).
- [ ] PR 분할: Cycle 1 = **5 PR** (PR0 shell-only refactor / PR0.5 token introduction / PR1 desktop scaffolding + RailNav placeholder / PR2 SideDock 4 cluster / PR3 dock 가변 확장 + 4 surface slot 통합). 각 PR ≤ 500줄, ≤ 5 파일.
- [ ] Playwright desktop viewport snapshot 추가 (1280×800, 1600×900, 1920×1180) — 신규 desktop 회귀 검증 자동화.

## Risks

| Risk | Severity | Mitigation |
|---|---|---|
| GardenScene 내부 plot grid anchor가 mobile portrait 비율로 hardcoded되어 있어, stage가 col-span-7로 커져도 plot 1개가 좌상단에 박힘 (brief 비판 미해소) | high | `garden-scene-anchor-adjustment` follow-up axis를 본 axis 머지 직후 즉시 다음 axis로 commit. 본 spec이 ship되어도 brief success 조건 "viewport 70% 빈 cream 사라짐"이 부분 달성에 머물 수 있음을 사용자에게 명시 (§ Decisions Resolved §10). |
| 데스크톱 player session 가정(8~20분 active, verb 80% Garden) 데이터 0 | high | § Decisions Resolved §6에 가정 명시 + 가정이 틀릴 경우의 대응 plan 명시 + telemetry axis 후속 commit. |
| dock 가변 확장(col-span-3 → 5) 시 stage 폭 축소(col-span-7 → 5)가 Phaser scene resize를 유발해 60fps 흔들림 가능 | medium | `scale.mode = RESIZE` listener + 가변 transition motion(`motion.gesture.reveal` 420ms)으로 충격 완화. dock 확장 중 active tween 수 ≤ 8개 budget 검증 spike 1시간 (Engineer concession 5-2.3 채택). |
| 신규 토큰 5종 + 기존 `--space-*`/`--radius-panel` 병존으로 dual vocabulary 발생, 다음 사람이 어느 토큰을 쓸지 매번 결정 | medium | 신규 토큰은 **desktop region 한정**으로 이름이 명시 (`radius.panel.desktop`, `spacing.2xl/3xl/4xl`). mobile region은 기존 토큰 그대로. 본 axis 종료 직후 별도 axis로 mobile token rename. |
| 22 PR/month 속도로 main이 움직이는 환경에서 본 axis 5 PR 직렬 머지 시 conflict 누적 | medium | studio-operate autonomous loop은 본 axis 종료까지 stop (메모리 `project_studio_loop_polish_bias` + heartbeat marker). polish PR이 dock/rail 영역에 들어가는 것을 사람이 차단. |
| Tablet 481-1279px 처리 누락 시 jarring transition | low | spec에 floating dock 도입 명시. PR2에서 tablet 분기 동시 작성. |
| Option C(in-canvas overlay)를 prototype 없이 거부한 결정이 미래에 잘못된 것으로 판명 | low | § Decisions Resolved §8에서 명시적 reject 근거 + future spike axis 진입 조건 명시. |
| stage가 art-only zone이 되면서 mobile에서 stage에 떠 있던 stageHeroCreature·objective-chip 등이 desktop dock으로 이주 시 정보 hierarchy 분열 | low | Art Director critique 4-3 인지. stageHeroCreature는 stage 내부 lower-third edge ambient 띠로 잔존 (≤ `spacing.3xl` 높이) — art ≥ 70% 약속 위반 0. objective-chip은 dock의 next-action chip으로 흡수. |
| Designer drawer 모델 거부로 "정원 보면서 다른 surface 보기" verb가 약화 | low | dock 가변 확장 중에도 stage(col-span-5 = 폭 ~415px)가 visible & interactive — drawer 모델의 verb 의도(plot tap 보존)는 보존됨. closure는 dock 폭 transition motion으로 강제. Cycle 2에서 사용성 검증 후 drawer 도입 재검토 가능. |

## Implementation Sequence

본 axis는 **1 Cycle (5 PR), 모두 본 spec 머지 후 직렬**. Cycle 2/3는 별도 axis로 spec.md 따로 작성.

### Cycle 1 — PR list

1. **PR0 — shell-only refactor (Engineer 안 D)**
   - `src/App.tsx`: `dev-panel`을 `garden-stage` 형제 노드로 격상, wrapper `<div className="desktop-shell">` 도입. **시각 noop** — 모바일·desktop 동일 화면.
   - `src/styles.css`: `.dev-panel` 절대좌표 의존성을 wrapper 기준으로 재계산.
   - 추정 ~120-180줄 (Engineer self-critique 3-1 인정한 범위 — 100줄 noop 가정 무효, 180줄로 합의).
   - 검증: `npm run check:visual` snapshot 모바일·desktop 동일.
2. **PR0.5 — token introduction (Art Director concession 5-2.1·2 채택)**
   - `src/styles.css`: `:root`에 신규 토큰 5종(spacing 3, radius 2) + 색 3 + elevation 2 + motion 5 duration + 3 easing + 5 gesture 정의. **사용처 0** — 토큰 정의만, 시각 noop.
   - 추정 ~80-120줄, 1 파일.
   - 검증: `npm run build` 통과 + snapshot diff 0.
3. **PR1 — desktop breakpoint scaffolding + RailNav placeholder**
   - `src/styles.css`: `@media (min-width: 1280px)` 블록에 12-col grid 정의 + region 명명 (`grid-template-areas`).
   - `src/App.tsx`: `useDesktopLayout()` hook + `RailNav` 컴포넌트 (4탭 + brand cluster, 시각만, 콘텐츠 비어 있어도 OK).
   - 추정 ~200-280줄.
   - 검증: 모바일 회귀 snapshot 0 + desktop 1280×800 새 snapshot baseline 등록.
4. **PR2 — SideDock 4 cluster (currency / next-action / active expedition / album mini)**
   - `src/App.tsx`: `SideDock` 컴포넌트 + 4 cluster vertical stack. dev-panel을 dock으로 reposition (콘텐츠 그대로, 위치만).
   - `src/styles.css`: dock 내부 card layout (`elevation.dock.raised`, `radius.panel.desktop`).
   - 추정 ~280-380줄.
   - 검증: desktop snapshot 1280/1600/1920 + 모바일 snapshot 회귀 0 + dock active tween budget spike 1시간 (`gesture.reveal` 동시 발화 시 60fps 유지).
5. **PR3 — dock 가변 확장 + 4 surface slot 통합**
   - rail의 4탭 클릭 → dock col-span-3 → col-span-5 transition + 해당 surface(씨앗/도감/원정/상점) 콘텐츠가 dock 안에 mount.
   - stage는 col-span-7 → col-span-5로 비례 축소 (Phaser canvas resize listener 자동).
   - 닫기: 같은 탭 재클릭 또는 별도 닫기 버튼.
   - 추정 ~320-450줄.
   - 검증: Phaser scene 60fps 유지 + dock 확장/축소 motion 부드러움 + surface 콘텐츠 mobile 회귀 0.

### 후속 axis (별도 spec.md, 본 axis 종료 후 순서대로)

1. `garden-scene-anchor-adjustment` — Phaser scene 내부 plot grid anchor를 viewport 폭에 비례하여 펼치도록 수정. brief success 조건 완전 달성.
2. `desktop-token-migration` — 기존 `--space-*` / `--radius-panel` rename + alias. 1664회 raw px의 점진 토큰화.
3. `desktop-motion-vocabulary-remap` — 기존 12종 keyframes를 5 gesture vocabulary로 alias.
4. `desktop-session-telemetry` — 데스크톱 player session 길이·verb 분포 측정. 본 spec의 가정 검증.
5. `desktop-drawer-revisit` — Cycle 1 사용 1주 후 Designer drawer 모델을 도입할 가치가 있는지 재평가.
6. `garden-stagehero-phaser-migration` — `stageHeroCreature` React → Phaser 이주 (필요 시 brief Non-negotiable #3 재협상).
7. `option-c-in-canvas-spike` — Phaser DOM container 패턴으로 in-canvas HUD prototype 1~2일 spike. 결과로 채택 또는 영구 reject.

## Decisions Resolved

본 섹션은 deliberation의 substantive disagreement를 명시 결론·이유와 함께 기록한다. 비어 있으면 deliberation 미완.

### §1. Stage = Garden 전용 vs 5 surface 교체 zone — **Garden 전용으로 결정**

- **Disagreement:** Designer는 Garden이 항상 stage에 visible해야 한다("Garden = 무대"); Art Director는 §6에서 "표시되는 surface는 1개 stage"라며 stage가 다른 surface로 갈아끼워질 수 있음을 인정.
- **Resolution:** stage는 **Garden(Phaser canvas) 전용 zone**. 다른 4 surface는 dock 가변 확장으로 노출.
- **Reasoning:** Designer의 player-verb 분석(plot tap이 세션 verb 빈도 top, 비동기 타이머 인지가 끊기면 idle/tycoon 컨벤션 위반)이 결정적. Art Director 본인도 §1에서 stage를 "art-only zone"으로 명시했고, §6의 surface-교체 인정은 그 자체와 모순. Critic 가정 B1("art-only zone에서 player verb는 무엇인가") 답: plot tap. plot tap을 살리려면 stage는 항상 Garden.
- **Loser's concession (Art):** stage가 art-only로 호흡하는 자기 §5 약속(art ≥ 70% 면적)은 그대로 보존됨 — 결과적으로 Art의 art-bible 약속과 충돌 없음.

### §2. Layout = 3-region (rail / stage / dock) — **채택**

- **Disagreement:** Designer는 rail 거부(저빈도 verb는 영구 좌측 점유 자격 없음); Art Director는 rail 채택(5탭의 ambient navigation은 vertical rail에 정합).
- **Resolution:** rail 채택. 단 rail은 **4탭만**(씨앗/도감/원정/상점). Garden은 stage 자체이므로 nav 항목에서 제외.
- **Reasoning:** Art Director의 hierarchy 분석은 정합 — 5 surface 동등 노출은 production game 컨벤션 정당화로 weak하지만, vertical rail이 horizontal bottom-tab 균등 stretch보다 visual weight 분배가 명확하다는 점은 brief 위반 인벤토리(bottom-tabs equal stretch)에 직접 답함. Designer 우려는 rail에서 Garden을 빼는 것으로 해소 — Garden이 nav 항목이 아니라 stage 자체라는 mental model을 desktop에서 명시. 이는 Critic Q2(5탭 정신)와도 align: 5 surface 모두 도달 가능하되 UI 형태는 viewport 적응.
- **Loser's concession (Designer):** Garden이 nav에서 빠지는 만큼 brand cluster(rail 상단)에 stage = Garden임을 시각적으로 명시 (예: 게임 logo / "햇살 온실 정원" eyebrow).

### §3. Drawer (stage 위 overlay) vs Dock 가변 확장 — **Dock 가변 확장 채택**

- **Disagreement:** Designer §1-C는 drawer가 stage 위 38% overlay; Art Director critique 1-1는 art ≥ 70% 약속 위반, dock col-span-3 → col-span-5 가변 확장으로 재정의 제안.
- **Resolution:** **Dock 가변 확장** 채택 (Art's concession 5-1.1).
- **Reasoning:** Designer의 verb 의도(plot tap 보존, closure 강제, drawer tab nav)는 dock 가변 확장으로 모두 보존됨 — stage가 col-span-5(폭 ~415px @ 1280px)로 축소되어도 Garden은 visible & interactive, dock 폭 transition motion이 Designer가 원한 closure를 강제. 추가로 Engineer critique 1-1의 비용 우려(drawer 도입 +280~420줄, plot tap pointer-event 보존 stacking-context 비용)도 회피.
- **Loser's concession (Designer):** dock 가변 확장이 closure 강제력 측면에서 drawer만큼 강하지 않다는 우려는 1주 사용 후 재평가 (`desktop-drawer-revisit` follow-up axis).

### §4. Dock 내부 cluster 우선순위 — **자원 cluster top, next-action chip below + hot-state weight 동적 강화**

- **Disagreement:** Designer §4는 next-action chip을 자원 위에 (verb 우선); Art Director §1·critique 1-2는 자원 위에 (motion 발화 시선 anchor 보존).
- **Resolution:** **자원 cluster top, next-action chip below** (Art's hierarchy). 단 next-action chip이 hot-state(첫 30초 onboarding, expedition 완료 등)에서는 `color.accent.sun` glow + `motion.gesture.reveal` 발화로 일시적 시각 weight 강화 (Art's concession 5-1.2 부분 채택).
- **Reasoning:** Art Director의 시각 hierarchy 분석(살아 있는 cluster가 시야 anchor에 와야 reward 체감 강함)이 영구 위계로는 옳음. Designer의 first-session player onboarding 우려는 chip의 hot-state 발화로 풀 수 있음 — 영구 위치를 첫 30초 위해 희생할 필요 없음. Designer가 chip 위치를 dock 최상단으로 올린 것은 critique 1-2에서 인정한 "정적 chip이 살아 있는 HUD를 변두리로 미는" 부작용을 감수해야 했음.
- **Loser's concession (Designer):** chip의 hot-state 발화 사양은 PR2에서 Designer + Art Director 공동 결정 — 어떤 trigger로 hot-state 발화하는지 (data 신호 5종 이상은 over-fire risk).

### §5. Token 도입 시점 — **신규 토큰만 본 axis, rename은 별도 axis**

- **Disagreement:** Art Director §3는 풀 token system rename 제안; Engineer critique 2-1·2-2는 dual vocabulary 비용 + 93곳 var() 영향 우려.
- **Resolution:** **신규 desktop region 한정 신규 토큰만** (Art's concession 5-2.1·2 + Engineer's PR0.5 분할 권고).
- **Reasoning:** Art Director self-critique 3-1에서 본인이 "신규 region에만 강제는 honest하지 못함, dual vocabulary 만든다"고 인정. 받아들이는 안은 (a) rename + alias 풀 처리 또는 (b) 신규만 도입 + 기존 rename 별도 axis. 본 axis는 (b) 채택 — 골격 결정에 token system 전체를 끼워 넣으면 (Engineer critique 2-2 합산 추정 ~1530-2170줄로) brief soft constraint 정면 위반.
- **Loser's concession (Art Director):** mobile region은 기존 토큰(`--space-*`, `--radius-panel: 8px`) 그대로. desktop region은 신규 토큰 사용. 두 vocabulary 병존은 임시 — `desktop-token-migration` follow-up axis로 mobile rename 처리.

### §6. 데스크톱 player session 가정 (Critic Q1) — **명시 + 위임 (a) 채택**

- **Disagreement:** Designer 가정 "데스크톱 active 5~20분, verb 80% Garden" 데이터 0; Critic Q1은 spec.md가 (a) 명시+위임, (b) dogfooding, (c) 가정 거부 중 명시 요구.
- **Resolution:** **(a) 가정 명시 + telemetry axis 후속 commit + 가정 틀린 경우 region 비율 조정 plan 명시.**
- **Reasoning:** (b) 1주 dogfooding은 본 axis 머지를 1주 지연시키고 dogfooding 자체가 데이터 수집 인프라를 요구하지 않음. (c) 가정 거부는 region 비율을 보수적(stage col-span-5, dock col-span-4, rail col-span-3)으로 조정해야 하는데 그러면 stage = Garden 전용 정신이 약해짐. (a)가 가장 honest — 가정을 spec에 적고, telemetry로 검증하고, 틀린 경우 다음 axis에서 dock/stage 비율 변경.
- **가정 명시:** "데스크톱 player의 active 세션은 5~20분, verb 빈도의 80%는 Garden plot tap에서 발생한다."
- **가정 틀린 경우 plan:** telemetry 결과 active 세션 ≤ 3분 burst거나 Garden verb 비중 ≤ 50%면, 후속 axis(`desktop-session-redesign`)에서 dock 비중을 col-span-3 → col-span-4로 확장하고 rail의 hot timer cluster를 dock 상단으로 promote.

### §7. Brief Non-negotiable #4 "5탭 컨셉 유지"의 정신 (Critic Q2) — **5 surface 도달성 보존, UI 형태는 viewport 적응**

- **Disagreement:** Designer는 Garden을 nav에서 제외하는 4-drawer + 1-stage; Art Director는 5탭을 vertical rail로 유지; Critic Q2는 spec.md에 정신 명시 요구.
- **Resolution:** **5 surface(정원/씨앗/도감/원정/상점)가 모두 도달 가능하고 player가 그 surface의 정보를 동등하게 받을 수 있어야 함**. UI 형태(탭/rail/drawer/stage)는 viewport에 따라 다를 수 있음.
- **Reasoning:** brief 원문 "5개 surface 자체는 그대로. desktop에서는 navigation 형태가 달라질 수 있음(tab → side nav 등)"의 정신은 surface 보존이지 UI 형태 보존이 아님. desktop에서 Garden = stage이므로 nav 항목에서 제외하는 것이 player가 "Garden도 5개 중 하나"를 학습한 mental model과 충돌하지 않음 — 모바일에서는 5탭 그대로 유지되어 학습이 보존되고, desktop에서는 Garden이 stage 자체로 격상되었음을 brand cluster로 명시.
- **shop의 dark pattern 우려:** Designer §4 정보 hierarchy에서 shop_surfaces.json의 실결제 promo가 dock에 영구 노출되면 안 된다는 우려는 본 spec에서 그대로 보존 — shop은 rail 4탭의 1개로 명시 클릭 후에만 dock 가변 확장으로 노출. shop을 4 surface와 분리해서 더 약화시킬지는 future axis 결정 (본 spec 범위 외).

### §8. Option C (in-canvas overlay) 거부 (Critic Q3) — **명시 reject + future spike axis 조건 명시**

- **Disagreement:** 셋 다 prototype 0건으로 거부; Critic Q3는 명시 reject 근거 요구.
- **Resolution:** **본 axis에서 reject. Future spike axis(`option-c-in-canvas-spike`) 진입 조건 명시.**
- **Reject 근거 (1~2 문장):** Phaser canvas의 sharp pixel과 React DOM overlay의 smooth raster가 art bible의 hand-painted 톤에서 시각적으로 충돌할 가능성이 높음 (Art Director critique). 또한 in-canvas HUD가 GardenScene 내부 mechanic 변경 boundary를 넘는지 본 axis 안에서 prototype할 시간 부족 (brief 1 cycle 제약).
- **Future spike axis 진입 조건:** Cycle 1 ship 후 사용성 평가에서 dock vertical stack이 정보 밀도를 충분히 못 받쳐서 in-canvas HUD가 필요해진다고 판단되면 1~2일 spike. Phaser DOM container 패턴(scene 위 별도 layer)으로 prototype, mechanic 변경 0 검증.

### §9. Cycle 분할 — **1 Cycle minimal, drawer/token rename/asset/anchor 모두 후속 axis**

- **Disagreement:** Engineer concession 5-3은 결합안을 2 cycle 분할 제안; Designer + Art Director D를 결합하면 ~2150줄 / 11~13 PR로 brief soft constraint 위반.
- **Resolution:** **1 Cycle minimal**. Cycle 1 = ~5 PR (PR0~PR3), 모두 § Implementation Sequence에 명시.
- **Reasoning:** 본 axis는 layout 골격만 결정하는 것이 분명함 (brief). drawer / token rename / asset 재생성 / anchor 조정 / motion vocabulary remap 모두 layout 골격 결정 이후 따라오는 작업. 1 Cycle로 ship해서 사용 결과를 본 후 후속 axis 우선순위 결정이 더 honest. 22 PR/month main 속도에서 직렬 5 PR이 conflict 누적될 수 있어 studio-operate autonomous loop은 본 axis 종료까지 stop.

### §10. Brief 자체 약점 인정 (Critic brief-level 4-1·4-2·4-3·4-4·4-5)

- **Disagreement:** Critic은 brief 자체에 5개 push back — 단일 스크린샷 evidence, "production game quality" 미정의, 5탭 non-negotiable 정당화 부재, A/B/C sketch가 framing lock-in, 회귀 비용 unquantified.
- **Resolution:** **모두 인정. spec.md acceptance criteria는 측정 가능한 형태로 재정의 (viewport 폭 % / cream 매트 면적 %)이고, "production game quality" 같은 vague 단어는 vision 외에는 사용 안 함. 5탭 non-negotiable의 정신은 §7에서 명시. A/B/C sketch가 framing을 lock-in했을 가능성은 인정 — Cycle 1 ship 후 사용성 평가에서 다른 패러다임 후보(in-canvas C, B의 3-column)가 필요해진다고 판단되면 future axis로 재검토. 회귀 비용 quantification은 본 spec 통과 후 따로 audit 안 — 별도 axis로 polish PR 22개 중 layout-dependent 비율 측정.**

---

## Open Questions

다음 질문은 Cycle 1 안에서는 답하지 않는다 — trigger가 도달했을 때 별도 axis 또는 PR 단계 결정으로 처리.

- **Q1 (Cycle 1 PR2):** dock 4 cluster의 hot-state 발화 trigger 정확한 사양 (어떤 신호로 next-action chip을 hot-state로 transition할 것인가). PR2 작업 시 Designer + Art Director 공동 결정.
- **Q2 (Cycle 1 PR3):** dock 가변 확장 시 stage 폭 축소 motion(`gesture.reveal` 420ms)의 Phaser scene resize 호환성. PR3 작업 spike 1시간.
- **Q3 (별도 axis):** reward reveal·milestone celebration 같은 cross-region 모멘트가 발화될 때의 z-index / `elevation.dramatic` layer 위치 (stage in-canvas? dock 위 popover? full-viewport modal?). Art Director cross-cutting risk 4-4. → `cross-region-moment-elevation` follow-up axis.
- **Q4 (별도 axis):** `stageHeroCreature` React → Phaser 이주 결정. 본 spec에서는 stage edge ambient 띠(≤ `spacing.3xl`)로 잠정 처리. → `garden-stagehero-phaser-migration` follow-up axis.
- **Q5 (telemetry axis 선결):** 데스크톱 player viewport 점유율(현재 player 중 데스크톱 비중 1%인지 30%인지). § Decisions Resolved §6 참조.
- **Q6 (telemetry axis 선결):** 데스크톱 player 세션 길이 분포 (Designer 가정 "5~20분 active" 검증). § Decisions Resolved §6 참조.
- **Q7 (Cycle 2):** Designer drawer 모델 재도입 (1주 사용 후 closure 강도 측면 평가). § Decisions Resolved §3 loser's concession.
- **Q8 (Cycle 2):** dock 가변 확장 시 nested overlay (album drawer 안에서 카드 클릭 시 modal). Designer Open Q5 + Art critique 4-2.
- **Q9 (별도 axis):** mobile-desktop continuity / viewport resize transition shape change. Art Director critique 4-3.

## References

- Brief: `reports/deliberation/desktop-ui-redesign/brief.md`
- Proposals: `reports/deliberation/desktop-ui-redesign/proposals/{designer,art-director,engineer}.md`
- Critiques: `reports/deliberation/desktop-ui-redesign/critique-{designer,art-director,engineer,senior-critic}.md`
- Workflow: `docs/studio/DELIBERATION_WORKFLOW.md`
- Personas: `docs/studio/personas/{director,designer,art-director,engineer,senior-critic}.md`
- Memory consulted: `feedback_layout_over_polish.md`, `feedback_studio_team_critique.md`, `feedback_harness_neutral_source_of_truth.md`, `project_studio_loop_polish_bias.md`
- Code: `src/App.tsx` (5671줄), `src/styles.css` (7677줄), `src/game/playfield/{GardenScene.ts,GardenPlayfieldHost.tsx}`, `src/types/game.ts` (PlayerSave invariant), `src/lib/persistence.ts` (save invariant), `package.json` (`check:ci`)
- Plan: `docs/studio/plans/0001-deliberation-workflow-bootstrap.md`

## Changelog

- 2026-05-04 — initial draft from Cycle 1 deliberation. Director synthesis based on 3 proposals + 4 critiques. 10 substantive disagreements resolved (§ Decisions Resolved). 1 Cycle minimal scope decided; 7 follow-up axes named.
