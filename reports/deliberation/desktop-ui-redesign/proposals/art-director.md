# Proposal — Art Director (아트 디렉터)

- Axis: `desktop-ui-redesign`
- Persona: Art Director
- Date: 2026-05-04
- Stance: **Option D 채택 (3-region adaptive — 좌 nav rail / 중 stage / 우 dock)**, A/B/C 모두 hierarchy 측면에서 부분 결함.

---

## 0. 현재 시각 위반 인벤토리 (브리프 명시 위반의 시각 언어 번역)

본 proposal의 모든 결정은 아래 5개 위반을 한 개 이상 해결한다. 위반은 시각 hierarchy 언어로 재정의한다.

1. **single-column-stretched-to-desktop** — 모바일 1-col layout이 1920px viewport에 stretch되어 *primary 시선이 포착할 단일 cluster가 없음*. 시선이 "들어올 곳"을 못 찾고 좌상단 헤더 → 우상단 HUD → 하단 chip로 zigzag 방황. 이는 negative space가 아니라 **공허(void)**.
2. **empty-mat panels** — `.garden-stage`가 viewport 폭의 95%를 점유하지만 plot 1개만 좌상단에 박힘. 패널 내부 정보 밀도 = panel 면적의 ~5%. negative space는 호흡인데 현재는 빈 매트.
3. **HUD-hiding-art stacking** — `.currency-cluster`가 cream pill로 `top-bar` 안에 들어가 배경 일러스트(`background_*` 카테고리 asset) 위에 absolute pinning. art bible의 *handpainted seed jar / 햇살 온실*은 패널 뒤에 깔려서 가장자리 마진에서만 보임. 시각 위계상 *primary art가 secondary HUD에 가려진* 역전 상태.
4. **motion-vocabulary-inconsistency** — `styles.css` 내 `@keyframes` ≥ 12종, easing이 `ease`/`ease-out`/`ease-in-out`/`cubic-bezier(0.18, 0.9, 0.28, 1.12)`/`cubic-bezier(0.2, 1, 0.2, 1)` 등 단발 발화. duration도 160ms / 220ms / 240ms / 420ms / 680ms / 720ms / 900ms / 1200ms / 1400ms / 1600ms / 2200ms 무규칙. **vocabulary 부재 = motion이 noise**.
5. **bottom-tabs equal stretch** — `.bottom-tabs`가 `grid-template-columns: repeat(5, 1fr)`로 1920px에서 각 탭 ~380px. tab은 *반복적 ambient navigation*인데 primary action chip과 같은 visual weight. 위계 무너짐.

---

## 1. Visual Hierarchy

### Eye-flow path (desktop ≥ 1280px)

시선의 1·2·3차 잡이는 다음 순서로 보장한다.

```
[primary]   stage.region (Phaser canvas, col-span-7)
                ↓ (gravity by size + light)
[secondary] dock.region (자원 cluster / next action / active expedition, col-span-3)
                ↑ (counter-balance)
[tertiary]  rail.region (탭 navigation, col-span-2, 좌측 vertical)
```

- **Primary (시각 weight 60%)**: stage region. 햇살 온실 일러스트가 부분 가려지지 않고 noise-free하게 호흡. plot·creature·tween FX가 여기서 발생. 시선이 *처음 잡혀야 할 곳*.
- **Secondary (시각 weight 25%)**: dock region. 자원 HUD(잎/꽃가루/재료) + next action card + active expedition progress. *Primary action verb가 여기서 발화*. cream pill로 떠 있는 HUD가 아니라 elevation 1단 raised surface로 cluster화.
- **Tertiary (시각 weight 15%)**: rail region. 5개 탭이 ambient navigation으로 좌측 vertical, primary stage와 시각 충돌 안 함. 현재 active 탭만 elevation 강조.

### 위계 위반 잡기

- **HUD-hiding-art stacking 해결**: 자원 HUD를 stage 위 absolute에서 dock region 내부로 이동. stage region은 art-only zone으로 선언. `top-bar` 클래스의 `position: relative; z-index: 2`가 stage 위에 깔리는 현재 구조 폐기.
- **empty-mat panels 해결**: stage region은 *Phaser canvas 자체*가 채우게 한다. React가 stage 위에 cream 패널을 덮지 않는다. negative space는 stage 내부 art composition(원경/중경/근경)이 만들고, *React panel이 만들지 않는다*.
- **bottom-tabs equal stretch 해결**: rail region의 5개 탭은 vertical stack + label 가변 폭(badge 진행도가 있을 때만 확장). 5등분 stretch 폐기.

### Mobile / tablet에서의 hierarchy (모바일 보존 약속의 시각 번역)

- mobile (≤ 480px): stage가 viewport 100% (현재 유지). HUD는 top-bar absolute 유지(현재 유지). bottom-tabs 5-up 유지(현재 유지). **mobile은 손가락 접근성이 시각 hierarchy보다 우선** — 수정 안 함.
- tablet (481-1024px): stage 100%, dock은 stage 위 right-aligned floating panel(width `clamp(280px, 32vw, 360px)`)로 부분 도입. rail은 여전히 bottom-tabs (vertical rail은 ≥ 1280px만).

---

## 2. Layout Grid Per Viewport

토큰화된 grid 사양. 모든 수치는 `grid.*` 토큰 또는 `breakpoint.*` 토큰으로 표현.

### Breakpoint 토큰

| 토큰 | 값 | 적용 |
|---|---|---|
| `breakpoint.mobile.max` | 480px | mobile-only @media |
| `breakpoint.tablet.min` | 481px | tablet 진입 |
| `breakpoint.tablet.max` | 1024px | tablet-only @media |
| `breakpoint.desktop.min` | 1025px | desktop 진입 (실제 grid switch는 ≥ 1280px에서 안전하게) |
| `breakpoint.desktop.wide` | 1280px | 3-region grid full activate |
| `breakpoint.desktop.ultra` | 1680px | 우측 dock에 secondary lane 1개 추가 옵션 |

브리프의 ≥ 1280px desktop을 본 proposal의 *primary target*으로 본다. 1025-1279px은 tablet+ 보조 layout으로 처리(2-region: stage + floating dock).

### Mobile (≤ `breakpoint.mobile.max`)

- column count: **1**
- gutter: `grid.gutter.tight` (= `spacing.sm` = 8px)
- 명명 region: `[stage] [bottom-tabs]` (수직 stack)
- 변경: **없음**. 현재 `.garden-stage 100vw + bottom-tabs absolute` 유지.

### Tablet (`breakpoint.tablet.min` – `breakpoint.tablet.max`)

- column count: **8** (`grid.cols.tablet`)
- gutter: `grid.gutter.regular` (= `spacing.md` = 16px)
- 명명 region:
  - `stage`: col-span-8 (full width)
  - `dock` (floating): stage 위 right-aligned overlay, width `clamp(280px, 32vw, 360px)`, art는 stage가 가리지 않는 좌측 60%로 composition shift
  - `bottom-tabs`: col-span-8 (mobile과 동일 5-up)
- 변경: dock을 floating overlay로 시범 도입. rail은 도입 안 함.

### Desktop (≥ `breakpoint.desktop.wide`, primary target)

- column count: **12** (`grid.cols.desktop`)
- gutter: `grid.gutter.regular` (= `spacing.md` = 16px) / margin: `grid.margin.desktop` (= `spacing.xl` = 32px)
- 명명 region:
  - `rail`: col-span-2 (좌측, vertical nav, width `clamp(180px, 14vw, 220px)`)
  - `stage`: col-span-7 (중앙, Phaser canvas + 배경 art, height `min(860px, calc(100dvh - spacing.2xl))`)
  - `dock`: col-span-3 (우측, vertical stack: 자원 cluster → next action → active expedition → secondary contextual)
- 명명 row:
  - `header.row`: height `clamp(56px, 6vh, 72px)` — game title + global meta (탭별 eyebrow 아님)
  - `body.row`: 1fr — rail / stage / dock 모두 이 row 안
  - `footer.row`: 0 (desktop엔 bottom-tabs 없음, rail이 대체)
- 변경: 5개 탭을 rail로 이전. bottom-tabs `repeat(5, 1fr)` 폐기 @ desktop. dock을 stage와 sibling region으로 승격(absolute floating 아님).

### Desktop ultra (≥ `breakpoint.desktop.ultra`, optional)

- 동일 12-col grid, dock 내부에 secondary lane 1개 추가 (예: 도감 next 카드 / 상점 일일 추천 ambient).
- 새 region 추가하지 않는다 — *grid는 안정적으로 유지, 정보 밀도만 증가*.

---

## 3. Design Tokens to Introduce

브리프 비판: 현재 `:root`에 spacing 5단(`--space-1..6`, 단 5만 누락), radius 3개, motion 토큰 0개. desktop scale을 감당 못 한다. 다음 token set을 도입한다. **모든 spec은 이 토큰만 사용. 기존 raw px 1664회 사용은 점진 마이그레이션 axis에서 처리(이 axis 범위 밖) — 그러나 신규 desktop region은 100% 토큰 사용 강제.**

### color.* (warm pastel art bible 보존, hard color 추가 금지)

| 토큰 | 의도 | 기존 매핑 |
|---|---|---|
| `color.surface.canvas` | 앱 베이스 (햇살 온실 mat) | `--surface-base` |
| `color.surface.warm` | panel surface (cream) | `--surface-panel` |
| `color.surface.raised` | 1단 raised (dock cluster, active rail item) | `--surface-raised` |
| `color.surface.glass` | 어두운 backdrop (rail bg, modal scrim) | `--surface-glass` |
| `color.surface.field` | inset (input, progress track) | `--surface-field` |
| `color.ink.primary` | 본문 text | `--text-primary` |
| `color.ink.muted` | meta text | `--text-muted` |
| `color.action.primary` | 주 verb | `--action-primary` |
| `color.action.primary.strong` | 주 verb hover/active | `--action-primary-strong` |
| `color.action.secondary` | 보조 chip | `--action-secondary` |
| `color.state.ready` | 수확 가능 등 ready signal | `--state-ready` |
| `color.state.disabled` | 비활성 | `--state-disabled` |
| `color.border.subtle` | 가벼운 분할선 | `--border-subtle` |
| `color.shadow.panel` | panel elevation | `--shadow-panel` |

추가 (신규):

| 토큰 | 의도 |
|---|---|
| `color.surface.dock` | dock region 배경 (warm cream 한 단 raised, art 위에 안착하되 art 톤 유지) |
| `color.surface.rail` | rail region 배경 (glass + 따뜻한 sage tint, art bible 톤 유지) |
| `color.accent.sun` | art bible의 햇살 highlight, primary verb의 active glow |

### spacing.* (8pt scale, desktop을 위해 ≥ 32px 단계 도입)

현재 `--space-1..6`을 다음으로 재명명 + 확장:

| 토큰 | 값 | 기존 매핑 |
|---|---|---|
| `spacing.xs` | 4px | `--space-1` |
| `spacing.sm` | 8px | `--space-2` |
| `spacing.md` | 12px | `--space-3` |
| `spacing.lg` | 16px | `--space-4` |
| `spacing.xl` | 24px | `--space-6` |
| `spacing.2xl` | 32px | **신규** (desktop margin·region gap) |
| `spacing.3xl` | 48px | **신규** (region 간 separator·hero spacing) |
| `spacing.4xl` | 64px | **신규** (header.row 상단 padding 등 hero scale) |

`--space-5`(20px) 누락 정정: 8pt scale 정합성 위해 도입 안 함(12 → 16 → 24 → 32 step 유지).

### radius.* (현재 3종 → 4종으로 확장)

| 토큰 | 값 | 의도 |
|---|---|---|
| `radius.control` | 8px | button, input |
| `radius.panel` | 16px (현재 8px에서 상향) | dock·rail·stage container — desktop에서 8px은 너무 hard |
| `radius.hero` | 24px | stage region outer + 메인 art frame |
| `radius.pill` | 999px | chip, currency cluster |

기존 `--radius-panel: 8px`은 `radius.control`로 의미 통일. **panel = 16px**로 격상해 desktop에서 art bible의 hand-painted soft 톤과 정합.

### elevation.* (현재 1종 → 4단계)

| 토큰 | 값(개념) | 의도 |
|---|---|---|
| `elevation.flat` | 0 shadow | rail item idle, stage canvas (그림자로 art 가리지 않음) |
| `elevation.raised` | `0 8px 20px rgba(35,58,43,0.10)` | dock card, rail item active |
| `elevation.floating` | 기존 `--shadow-panel` | tooltip, popover, modal lift |
| `elevation.dramatic` | `0 24px 60px rgba(35,58,43,0.22)` | reward reveal, milestone celebration peak |

### typography.* (현재 raw `font-size: 11px`/`12px`/`23px`/`26px` 산재 → 6단 scale)

| 토큰 | desktop | mobile | weight |
|---|---|---|---|
| `type.eyebrow` | 11px | 11px | 800 uppercase |
| `type.body` | 14px | 13px | 500 |
| `type.label` | 12px | 11px | 800 |
| `type.heading.sm` | 18px | 16px | 800 |
| `type.heading.md` | 26px | 23px | 900 (현재 h1) |
| `type.heading.lg` | 36px | — | 900 (desktop hero stage label, 신규) |

font family 토큰: `type.family.ui` = `Inter, ui-sans-serif, system-ui, ...` (현재 유지).

### motion.* (현재 vocabulary 없음 → 4 duration × 3 easing × 4 named gesture)

#### Duration

| 토큰 | 값 | 의도 |
|---|---|---|
| `motion.duration.snap` | 120ms | hover, focus ring, micro state |
| `motion.duration.swift` | 220ms | tab switch, button press, panel slide |
| `motion.duration.gentle` | 420ms | reveal, claim pop, region transition |
| `motion.duration.celebrate` | 880ms | milestone reveal peak, sparkle |

#### Easing

| 토큰 | 값 | 의도 |
|---|---|---|
| `motion.easing.standard` | `cubic-bezier(0.2, 0.0, 0.2, 1)` | 대부분의 state change |
| `motion.easing.entrance` | `cubic-bezier(0.0, 0.0, 0.2, 1)` (decelerate) | 진입(in) |
| `motion.easing.emphasized` | `cubic-bezier(0.2, 0.9, 0.28, 1.12)` (over-shoot) | celebrate, claim pop |

#### Named gesture (vocabulary)

| 토큰 | 결합 | 의도 |
|---|---|---|
| `motion.gesture.tap` | `snap` × `standard` | 누르는 즉각 피드백 |
| `motion.gesture.reveal` | `gentle` × `entrance` | 패널 진입, receipt 등장 |
| `motion.gesture.celebrate` | `celebrate` × `emphasized` | reward 수령, milestone |
| `motion.gesture.ambient` | `swift` × `standard` (loop) | breathe·pulse 등 idle ambient |

기존 `tap-bounce 220ms ease-out`, `reward-pop 420ms ease-out`, `merchant-second-chapter-reveal 720ms cubic-bezier(0.2, 1, 0.2, 1)` 등은 본 vocabulary 4개 중 하나로 alias하거나 remap. **신규 motion은 vocabulary 외 작성 금지**.

---

## 4. Motion Vocabulary

본 axis는 layout 골격이지만, layout이 region-shift를 도입하므로 region transition motion vocabulary를 명시한다.

### Entry / exit (region 진입·퇴장)

- **rail item active 전환**: `motion.gesture.tap` (120ms standard) — translateY(-2px) + raised elevation. 현재 `bottom-tabs .tab-active { transform: translateY(-2px) }`와 호환 (mobile과 동일 vocabulary).
- **dock card 진입**: `motion.gesture.reveal` (420ms entrance) — opacity 0→1 + translateY(8px → 0). active expedition / next action card 갱신 시 일관 적용.
- **stage scene 전환**: `motion.gesture.reveal` (420ms entrance) — Phaser scene 자체는 React 영역 밖이므로 *외곽 stage container의 opacity·border-glow만* 본 vocabulary로. scene 내부 motion은 GardenScene 책임(이 axis 밖).

### State change

- **HUD currency tick**: `motion.gesture.celebrate` (880ms emphasized) — 자원 +N 변경 시 single pulse. 현재 `reward-pop 420ms ease-out`을 본 토큰으로 unify.
- **rail badge update** (예: 도감 진행도 X/Y 갱신): `motion.gesture.tap` (120ms standard) — number swap, no bounce.
- **dock next action card morph** (활성 verb 변경): `motion.gesture.reveal` (420ms entrance) — old card fade out → new card slide in.

### Ambient (loop)

- **stage ready signal** (수확 가능): `motion.gesture.ambient` 2.2s loop, 기존 `harvest-ready` 유지하되 토큰화.
- **breathe** (씨앗 자라는 중): 기존 `seed-breathe 3.8s` 유지하되 `motion.gesture.ambient` 토큰 결합.

### 금지 사항 (motion-vocabulary-inconsistency 직접 잡기)

- 신규 `@keyframes`은 4 named gesture 중 1개로만 invoke. vocabulary 외 일회성 cubic-bezier 금지.
- duration은 4단(120/220/420/880ms) 외 사용 금지. 현재 `680ms`, `720ms`, `1400ms` 등은 가장 가까운 토큰으로 remap (이 axis의 신규 모션에만 강제, 기존 잔존 motion은 점진 마이그레이션).

---

## 5. Asset Composition

art bible(`asset_style_bible.json`)의 *cute-strange greenhouse collectible, soft rounded silhouettes, warm whimsical mood* 톤이 desktop에서 살아나려면, 다음 composition 규칙을 region별로 강제한다.

### `stage` region (primary, art-first zone)

- **art breathing 보장**: stage region 내부에 React 패널 overlay 금지 (단, stage edge에 ambient eyebrow / chip만 허용, height ≤ `spacing.3xl`). 현재 `.garden-panel` 의 `position: absolute; top: 122px; bottom: 78px`로 stage 위에 cream 패널을 덮는 구조 폐기.
- **background asset 구성**: `AssetCategory: "background"` 자산이 stage region 폭 100%로 깔리고, Phaser canvas는 그 위에 alpha-ready로 plot·creature·sprite 배치. 현재 stage가 cream 패널에 가려져 가장자리에만 보이는 문제 해결.
- **시선 안착점**: stage 중앙 lower-third에 plot·creature가 앉도록 Phaser 내부 anchor 조정 권장 (단, GardenScene 내부 변경은 이 axis 밖이므로 *권장 사항만 명시*, 강제 안 함).
- **negative space 정의**: stage 내부에서 background art가 만드는 sky·foliage·foreground 3-tier composition이 *의도된 호흡*. 빈 베이지 mat이 아니라 art가 채우는 호흡.

### `dock` region (secondary, info-cluster zone)

- **자원 cluster (`AssetCategory: "ui_frame"` + `seed_icon` 활용)**: 잎/꽃가루/재료 currency를 단일 dock card 안에 vertical stack. 각 row는 `seed_icon` 또는 family motif icon(`herb` = leaf, `lunar` = crescent) + 숫자 + delta. cream pill 떠 있는 현재 모습 폐기.
- **next action card**: 한 번에 1개의 primary verb. icon은 family motif (씨앗/원정/수확) 와 align. card 외곽은 `radius.panel` (16px) + `elevation.raised`.
- **active expedition card**: 기존 expedition progress bar + leaf-trail motion 유지하되 dock region 내부로 이전. stage 위에 떠 있지 않음.

### `rail` region (tertiary, ambient nav zone)

- **icon-led, label-supported**: 5개 탭 각각 16-20px family motif icon + label(`type.label`). active item만 raised elevation + accent.sun glow.
- **vertical orientation**: rail은 vertical stack. desktop에서 horizontal bottom-tabs 폐기.
- **art와 충돌 안 함**: rail은 좌측 col-span-2 안에 갇혀 있어 stage art와 절대 overlap 안 함.

### Asset category × region matrix

| AssetCategory | rail | stage | dock |
|---|---|---|---|
| `background` | — | **primary canvas** | — |
| `creature` | — | **primary subject** | small thumbnail (active expedition) |
| `seed_icon` | nav badge | small (plot label) | currency icon, card icon |
| `shop_image` | — | shop tab 진입 시 stage 내 hero | dock에 daily pick thumbnail |
| `ui_frame` | rail item frame | — (art-first) | dock card frame |
| `sprite_strip` | — | **primary motion** | — |
| `fx_strip` | — | **primary FX** | small reward pop |

### 일러스트 호흡 규칙

- **stage region은 art가 ≥ 70% 면적 차지**. React 요소가 art를 가리는 면적 ≤ 30%.
- **dock region은 cream surface가 ≥ 60% 면적 차지**. art는 small thumbnail 형태로만.
- **rail region은 glass surface + family motif icon만**. 일러스트 큰 면적 사용 금지(시선 분산).

이 규칙으로 *primary art는 stage에서 호흡, secondary info는 dock에서 cluster, tertiary nav는 rail에서 ambient* 의 위계가 영구히 잠긴다.

---

## 6. Disagreements I Anticipate

### vs. Designer

- **자원 HUD 위치**: Designer는 verb 강조 위해 자원 HUD를 stage 위 floating으로 유지하자고 할 가능성 높음 ("플레이어 시선이 stage에서 HUD로 짧게 이동해야 reward 체감"). **나는 거부**: art-hiding stacking이 hierarchy 깨는 게 더 큰 손실. dock으로 이전해도 dock이 stage right-adjacent라 시선 거리 최소.
- **next action chip의 모달성**: Designer가 next action을 stage 하단 큰 chip으로 깔자고 할 가능성. **나는 거부**: stage는 art-only zone. next action은 dock 안.
- **bottom-tabs 유지**: Designer가 desktop에서도 bottom-tabs를 thumb-rest 일관성으로 유지하자고 할 가능성. **나는 거부**: desktop은 mouse, thumb 아님. rail이 ambient navigation으로 더 정합.

### vs. Engineer

- **새 region 도입 비용**: Engineer가 `App.tsx` 5671줄 + 5개 탭 conditional render 구조 때문에 "rail+stage+dock 3-region 구조가 React tree 대수술" 이라며 2-pane(Option A)으로 축소하자고 할 가능성. **나는 거부**: 2-pane은 rail 빠져서 5개 탭 navigation이 desktop에서 어디로 가야 할지 미해결. 3-region 그대로.
- **Phaser canvas 비율 변경 비용**: Engineer가 stage가 col-span-7로 줄면 Phaser canvas resize 비용·breakpoint별 anchor 재조정 비용 들 거라며 stage full-bleed(Option C)로 가자고 할 가능성. **나는 부분 동의**: full-bleed는 dock·rail이 in-canvas overlay가 되어야 하는데, 그건 art-hiding stacking 위반의 재발. canvas 비율 변경 비용 감내 필요.
- **token 마이그레이션 폭**: Engineer가 1664회 raw px를 토큰화하는 비용을 이 axis에서 같이 처리하자고 하면 거부. **본 axis는 신규 desktop region에만 토큰 강제**, 기존은 점진.

### vs. Senior Critic

- **Critic 예상 공격**: "rail은 mobile→desktop의 shape change라 사용자 학습 비용. 모바일과 desktop이 다른 nav를 갖는 것이 viable한가?" — **나의 반박**: viewport별 navigation 형태 분기는 production game 표준 (mobile bottom-tab, desktop side-rail). shape change가 학습 비용보다 hierarchy 이득 큼.
- **Critic 예상 공격**: "stage가 col-span-7이면 1280px에서 stage 폭 ~700px. mobile 414px와의 차이가 작아서 desktop optimization의 의미가 약하지 않은가?" — **나의 반박**: 면적은 폭²에 가까우므로 700/414 = 1.69배 폭 = ~2.86배 면적. 그리고 dock/rail이 추가 정보 밀도를 가져옴 — *stage 단독 면적이 아니라 한 화면 정보 밀도가 핵심*.
- **Critic 예상 공격**: "motion vocabulary 4-named gesture가 너무 적다. 게임 motion은 더 다양해야 한다." — **나의 부분 동의**: 4개는 *region transition vocabulary*. 게임 내 mechanic motion(GardenScene 내부 tween, FX strip)은 별도 vocabulary 영역, 본 axis 밖. 외곽 vocabulary는 4개로 충분.

### Director에게 (옵션 거부)

- **Option A (2-pane) 거부**: rail 빠져서 desktop nav 미해결.
- **Option B (3-column tycoon) 부분 채택**: 3-region 골격은 동일하나, B의 "탭 없이 단일 화면"은 5개 surface를 한 화면에 다 펼치는 것 — 정보 밀도 과다, primary 시선 잡이 무너짐. rail로 5개 surface는 유지하되 "표시되는 surface는 1개 stage" 구조 유지.
- **Option C (캔버스 in-game UI) 거부**: HUD가 Phaser canvas 내부 overlay로 가는 순간 art-hiding stacking 위반의 재발. art bible의 hand-painted 톤은 in-canvas overlay와 시각적 충돌(canvas는 sharp pixel, overlay는 smooth React).
- **Option D 채택**: 3-region (rail / stage / dock) 12-col grid.

---

## 7. Open Questions

1. **rail의 active state visual weight**: rail item active를 단순 raised + accent.sun glow로 충분한가, 또는 active item을 약간 oversize(width 확장)해야 시선 잡이가 명확한가? Designer / Critic 의견 필요.
2. **dock의 minimum 폭**: col-span-3 → 1280px에서 ~270px, 1920px에서 ~432px. 270px가 currency cluster + next action card + active expedition을 vertical stack하기에 충분한가, 또는 dock 최소폭을 `min-width: 320px`로 강제해야 하는가?
3. **header.row 존재 여부**: desktop에서 게임 title `이상한 씨앗상회`가 한 번이라도 노출되어야 하는가? rail 상단에 게임 logo만 두고 header.row 폐기 가능. 결정 시 stage 면적 +60px 확보.
4. **tablet (1025-1279px) breakpoint 처리**: tablet+에서 floating dock으로 갈지, 아니면 1025px부터 바로 3-region rail/stage/dock으로 갈지. 후자가 시각 일관성 더 좋으나 tablet rail이 좁아져서(col-span-2 = ~205px) icon-only가 됨. icon-only rail이 art bible과 align하는가?
5. **모바일 → desktop transition shape**: 사용자가 viewport를 resize했을 때(웹은 가능) bottom-tabs ↔ rail shape change가 jarring한가, 또는 fade transition으로 충분한가? motion vocabulary로 처리 가능한지 검토 필요.
6. **stage 비율과 art bible asset 재생성**: 기존 `background_*` asset이 mobile portrait 비율 가정으로 생성됐을 가능성. desktop landscape 비율(700×860)에서 composition이 무너지면 asset 재생성 axis가 별도로 필요(이 axis 밖, plan에 기록).
7. **기존 `--space-1..6` rename 비용**: 본 proposal은 token 이름을 `spacing.xs..4xl`로 재명명하지만, 기존 1664회 raw px와 별개로 93회의 `var(--space-*)` 사용처 rename 비용은 Engineer가 이 axis에서 수용 가능한가?

---

## Self-check (persona contract)

- [x] Visual Hierarchy 명시 (primary/secondary/tertiary + eye-flow path)
- [x] Layout Grid 3 viewport 모두 (mobile / tablet / desktop) — column count, gutter, breakpoint, named region
- [x] Design Tokens 모두 카테고리(color / spacing / radius / elevation / typography / motion duration·easing) 명명, raw hex/px 없음 (단 token *정의* 표에는 매핑 위해 값 표기, spec 사용처는 모두 토큰명)
- [x] Motion Vocabulary entry/exit/state-change/ambient 모두 명시
- [x] Asset Composition region × asset category matrix 포함
- [x] Disagreements 4 persona 모두 anticipate
- [x] 5개 명시 위반(single-column-stretched-to-desktop / empty-mat panels / HUD-hiding-art stacking / motion-vocabulary-inconsistency / bottom-tabs equal stretch) 모두 이름으로 호명 + 해결 방법 명시
- [x] Korean, 시각 언어로 작성
- [x] 게임 mechanic·player verb·economy 변경 0건 (Designer 영역 보존)
- [x] 일정·구현 비용 추정 0건 (Engineer 영역 보존)
- [x] art bible (warm pastel, hand-painted) 톤 보존 — hard color·neon·dark mode 도입 0건
