# Proposal — Art Director

- Axis: `stage-art-first-restructure`
- Persona: Art Director
- Phase 2 (proposal, isolated)
- Date: 2026-05-04
- 작성 원칙: Cycle 1 § Decisions §1 (stage art ≥ 70%) · §4 (dock cluster contrast)의 implementation 위반을 회복. 신규 token 도입 자유 (brief Soft constraint 기준).

---

## 0. 회복 약속 — 본 proposal이 자기 자신에게 묶는 enforcement 계약

이 axis가 두 번째로 같은 약속을 위반하면 페르소나 신뢰가 파산한다. 그래서 proposal 안에 두 가지를 못 박는다.

1. **모든 visual 약속은 측정 가능한 수치로 명시**한다 ("art-first" 같은 형용사로 닫지 않는다).
2. **paradigm 선택 근거를 시각 언어로 명시**한다 — "구현 비용", "복잡도", "프레임워크 한계" 같은 cross-domain 변명에 따라 paradigm을 약화하지 않는다 (그 결정은 Engineer/Director가 하라).

---

## 1. Visual Hierarchy

### 데스크톱 ≥ `breakpoint.desktop.wide` (1280px), primary target 1920×1180

시선 anchor 순서 — 한 화면에서 player 시선이 어디로 가야 하는가.

| Tier | 영역 | 시각 weight 정당화 |
|---|---|---|
| **Primary (시선 anchor 0)** | `stage` 안 plot row + creature sprite + 햇살 vignette | 게임의 verb 핵심 (plot tap)이고, brief의 정체성 약속 ("정원에 들어왔다") 자체. art-first 라는 말은 여기서 시작. |
| **Secondary (ambient breath)** | `stage` 안 background plate (greenhouse_day 일러스트 + soft sun gradient + 원경/중경 호흡) | primary가 평면이지 않게 만드는 깊이. 이게 안 보이면 plot이 cream 위 sprite icon처럼 박힘 (현재 상태). |
| **Tertiary (information lane)** | `dock` 안 currency / next-action / active expedition cluster | 영구 ambient 정보. **art와 별도 region으로 인지** 되어야 하나, art tone과 align (warm dock surface). |
| **Quaternary (navigation)** | `rail` 4탭 + brand cluster | 가장 적은 시선 점유. 영구 mount이지만 sage glass tone으로 stage에서 retreat. |
| **Ephemeral (모멘트)** | reveal / celebrate motion (`gesture.reveal`, `gesture.celebrate`) | spike 발화 시 1.8s 동안 weight tier 1까지 올라온다. tier 1을 빼앗는 것이 아니라 tier 1과 같은 layer에서 발화. |

### 위반 진단 (Cycle 1 결과 vs 위 Tier)

- 현재 `.garden-panel` (cream rectangle, stage 면적의 ~85%)이 Tier 2 (ambient breath)를 가리고 있음 → background 일러스트가 시야에 안 들어옴.
- 현재 `.starter-panel` (max-height 230px overflow:auto cream 띠)이 Tier 1 (plot row)을 시각적으로 둘러싸서 plot이 무대가 아니라 액자 안 콘텐츠로 보임.
- 현재 `.side-dock` 배경 `--color-surface-dock: #fffbe9` ≈ `.surface-panel: rgba(255,252,232,0.92)` → Tier 3과 Tier 1 사이 visual separation 부재. dock이 stage에서 retreat도, 분리되지도 않음.

### Tier 별 contrast 약속 (수치)

| 약속 | 측정 |
|---|---|
| Tier 1 (plot/creature sprite) ↔ Tier 2 (background plate) | luminance contrast ≥ 1.6:1 (sprite가 배경에서 떠올라야 함, 단 hand-painted 톤 유지) |
| Tier 3 (dock surface) ↔ Tier 2 (stage background, plot row 외 영역의 평균 luminance) | luminance contrast ≥ **3:1** — Cycle 1 §4 약속의 회복 |
| Tier 4 (rail surface) ↔ Tier 2 | luminance contrast ≥ **3:1** (반대 방향 — rail은 어두운 sage glass) |
| Tier 5 (ephemeral motion) glow color ↔ Tier 1 | `color.accent.sun` glow가 sprite outline에 ≥ 4px halo로 발화 |

### Stage 안 영역 점유 약속 (수치, 1920×1180)

| 영역 | 약속 |
|---|---|
| stage 안 art-only pixels (background + sprite + canvas 자체 픽셀) | **≥ 75%** (Cycle 1 §1 약속 70%에서 강화 — 같은 약속 두 번 위반 안 한다는 의미) |
| stage 안 React-overlay cream pixels (panel·card·label 배경 cream) | **≤ 20%** |
| stage 안 React-overlay frame/border pixels (alpha-aware 일러스트 frame) | ≤ 5% (상한, 의도적으로 작음 — 액자가 art를 이기면 안 됨) |
| stage 영역에서 `backdrop-filter: blur(*)` cream rectangle | **0개** (현재 `.starter-panel`의 `backdrop-filter: blur(8px)` 폐기 명시) |

---

## 2. Layout Grid Per Viewport

### Mobile (≤ `breakpoint.mobile.max` = 480px)
- **변경 없음.** brief Non-negotiable #2. 본 axis 영향 0.

### Tablet (481 — 1024px)
- 현재 spec 골격 유지. dock floating overlay + bottom-tabs 5-up. 본 axis는 desktop 회복 axis이므로 tablet은 minimal touch.

### Desktop (≥ 1280px) — primary target

3-region grid 골격 (rail · stage · dock) **유지**, 단 안의 콘텐츠 paradigm을 재설계.

| 영역 | grid-area | width | art-respecting 형태 |
|---|---|---|---|
| `rail` | `rail` | `clamp(180px, 14vw, 220px)` (Cycle 1 유지) | sage glass surface — `--color-surface-rail`, art가 비치지 않음 (의도, 시선이 rail에서 빠르게 빠져나오게) |
| `stage` | `stage` | `minmax(0, 1fr)` (Cycle 1 유지) | **art canvas zone**, 모든 React overlay는 alpha-aware floating fragment |
| `dock` | `dock` | `clamp(280px, 22vw, 360px)` (Cycle 1 유지) | **warm cream surface**, single solid region — dock 내부 카드들은 카드 외곽선 없이 spacing으로만 구분 (cream-on-cream 카드 stacking이 §4 위반의 원인이었음) |

### Stage 내부 sub-layout — 본 proposal의 핵심 재설계

stage 영역을 **3 layer composition** 으로 정의 (모두 같은 stage region 안, z-axis 분리):

| Layer | z-index 토큰 | 콘텐츠 |
|---|---|---|
| **L1 — Background plate** | `z.stage.background` (= 0) | greenhouse 일러스트 (`background_greenhouse_day_001` / `_night_001`), warm sun gradient overlay, 원경 silhouette (선택) |
| **L2 — Canvas stage** | `z.stage.canvas` (= 10) | Phaser canvas — plot row, creature sprite, FX. canvas는 transparent background, L1의 일러스트가 비침 |
| **L3 — Floating overlay** | `z.stage.overlay` (= 20) | React fragment — eyebrow, objective-chip, next-creature-compact label. **카드 cream rectangle 금지**, alpha-aware (semi-transparent + soft shadow), stage 면적의 ≤ 20% |

**현재와의 차이:** `.garden-panel` (절대 좌표 cream rectangle)을 폐기하고, L3는 stage region 안에 **flow된 floating fragment**로 재정의. L3 fragment는 `position: absolute`이지만 cream 박스가 아니라 sticker/decal 형태 — 배경 일러스트가 그대로 비치는 alpha layer.

### Stage 내부 grid (L3 fragment placement, 1920×1180 기준)

stage region을 **8-col × 6-row sub-grid**로 분할 (rail/dock 외부 grid와 별개, stage 내부 지오메트리만):

| 영역 | 좌표 | 콘텐츠 |
|---|---|---|
| stage-eyebrow | row 1, col 1-3 | "햇살 온실 정원" eyebrow + objective-chip (Tier 5 ephemeral 발화 zone) |
| stage-canvas-region | row 2-5, col 1-8 | Phaser canvas (full width × 4row), plot row가 폭에 비례하여 펼쳐짐 (`garden-scene-anchor-adjustment`는 별도 axis지만 본 axis에서 host props로 viewport 폭 전달은 가능) |
| stage-action-decal | row 6, col 5-8 | 다음 행동 alpha decal (`.starter-panel` 폐기 후 대체) — 잎사귀 leaf-shape 일러스트 frame 안에 다음 verb 1줄, art가 frame 너머에서 비침 |
| stage-creature-decal | row 6, col 1-4 | active creature mini portrait (선택 발화) |

`.starter-panel`의 콘텐츠 (다음 verb · cost 라벨)는 stage-action-decal로 흡수, `max-height: 230px overflow:auto`은 폐기. 콘텐츠가 1줄에 안 들어가면 dock으로 이주 (next-action cluster 흡수) — overflow scroll cream 띠는 art 약속 위반.

---

## 3. Paradigm 선택 — **D. Art-Plate Hybrid (배경판 + 위 floating decal + canvas overlay)**

### 후보 검토 (시각 언어로만 평가, 비용은 Engineer 영역)

#### A. Canvas-first (모든 stage 콘텐츠가 Phaser sprite로 흡수)
- **시각 강점:** art share 100% 가능. 패널 자체가 없어짐.
- **시각 약점:** Phaser sprite 텍스트 렌더링 품질이 React `Inter` font 대비 약함 — currency 숫자, eyebrow label 같은 typographic 정보의 hierarchy 표현이 약화. "currency 1234" 가 sprite font로 깎이면 ambient information의 quality가 떨어짐.
- **거부 사유:** typographic information hierarchy를 손상. 본 proposal의 Tier 3 dock cluster는 typographic 콘텐츠 — Phaser font로 렌더할 수 없음.

#### B. Frame-overlay (기존 React 패널을 일러스트 frame border로 감싸기)
- **시각 강점:** 구현이 단순, 기존 패널 재사용.
- **시각 약점:** **alpha-aware ≠ frame 두름.** frame을 두르면 frame 안 콘텐츠가 여전히 cream rectangle. art는 frame border 자체가 아니라 frame 안에서 비쳐야 함. 현재 `ui_album_card_frame_001` 같은 frame asset이 있지만 그 frame을 cream 패널에 두르는 것은 cream 패널을 "정당화"할 뿐 art share를 늘리지 않음.
- **거부 사유:** Cycle 1 위반의 표면적 보강 — cream rectangle은 그대로고 가장자리에 일러스트만 추가. 측정값(art ≥ 75%)을 충족 못함.

#### C. Hybrid (stage 콘텐츠 일부 in-canvas, nav/HUD는 React floating overlay)
- **시각 강점:** Cycle 1 spec § Decisions §8에서 reject한 in-canvas overlay 패러다임의 약한 버전. plot/creature는 canvas, currency/nav는 React.
- **시각 약점:** Cycle 1이 이미 Hybrid의 변형 — 결과는 cream React 패널. C라는 이름만으로 약속이 강화되지 않음.
- **거부 사유:** 패러다임 이름이 아니라 art-share 측정값과 alpha-aware 강제가 약속의 본체. C는 너무 모호.

#### D. **Art-Plate Hybrid (선택)**
- **정의 (3 layer 명시 — 위 § 2에서 이미 정의):**
  - **L1 (배경판):** stage region full bleed, greenhouse 일러스트가 stage 면적 100% 점유. `background-size: cover; background-position: center bottom` → 화분/지면이 stage 하단에 anchor.
  - **L2 (canvas 무대):** Phaser canvas는 transparent background, plot/creature/FX sprite만 그림. L1 일러스트가 plot 사이로 비침.
  - **L3 (alpha decal):** React 콘텐츠는 cream rectangle이 아니라 leaf/sticker shape의 alpha-aware fragment. backdrop-filter blur 사용 가능 (cream fill 대신 stage가 살짝 흐려지면서 비침).
- **시각 강점:**
  - art는 L1+L2가 영구 점유 (≥ 75%) — Cycle 1 약속 회복.
  - typographic 콘텐츠는 L3 (React DOM, Inter font 그대로) — A의 약점 회피.
  - L3 fragment는 cream rectangle이 아니라 alpha decal — B의 약점 회피.
  - 패러다임이 layer 정의로 명시 → 구현이 위반하면 측정 가능 (cream pixel ≤ 20%).
- **enforcement 메커니즘:**
  - L3 카드/패널 CSS는 **`background-color: <cream solid>` 금지**. `background: linear-gradient(...alpha...)` 또는 `background: rgba(255,251,221, ≤ 0.78)` + `backdrop-filter: blur(N)` 강제.
  - playwright screenshot 측정 — stage 영역 픽셀 sample, cream tone luminance 점유율 추출. ≤ 20% pass.

### 결정: **Paradigm D — Art-Plate Hybrid**

L1/L2/L3 layer 정의 + alpha-aware enforcement + 측정 수치를 묶어서 spec § Acceptance Criteria로 통과시킬 것.

---

## 4. Design Tokens to Introduce or Modify

본 axis는 brief Soft constraint에 따라 신규 일러스트/spritesheet/frame 자산 추가 OK. 그래서 token도 art-respecting layer를 표현할 신규 토큰을 도입한다. 기존 token (Cycle 1 PR0.5 23종) 은 **유지** — 본 axis의 token은 그 위에 layer-paradigm 어휘 추가.

### 신규 색 토큰 (alpha-aware surface)

| 토큰 | 정의 | 사용처 |
|---|---|---|
| `color.surface.decal.warm` | `rgba(255, 251, 221, 0.62)` | L3 alpha decal — stage 위 floating fragment 배경. 기존 `--surface-panel` (alpha 0.92)의 대체 — alpha를 0.92 → 0.62로 떨어뜨려 art가 비치게 함. |
| `color.surface.decal.glass` | `rgba(252, 245, 215, 0.42)` | L3 ambient label 배경 (eyebrow, currency-pill on stage). 더 투명. |
| `color.surface.dock.warm` | `#f6ebcf` (현 `--color-surface-dock: #fffbe9`보다 한 단 짙은 cream) | dock region 배경 — stage cream과 luminance contrast ≥ 3:1 보장. 기존 `--color-surface-dock`는 stage cream과 거의 동일해서 §4 위반의 원인 → **대체** |
| `color.outline.sprite.glow` | `rgba(244, 199, 90, 0.55)` | L2 sprite hover/celebrate 시 outline halo. `--color-accent-sun` 의 alpha 변형 |
| `color.shadow.decal` | `0 6px 18px rgba(35, 58, 43, 0.14)` (preset) | L3 decal soft shadow — cream rectangle box-shadow 대체, art 위에 떠 있는 sticker 느낌 |

### 신규 spacing 토큰 (stage 내부 sub-grid)

| 토큰 | 값 | 사용처 |
|---|---|---|
| `spacing.stage.inset` | `clamp(20px, 2.5vw, 48px)` | stage region 내부 L3 decal과 stage 가장자리 간 padding |
| `spacing.stage.gap` | `clamp(16px, 2vw, 32px)` | L3 decal 간 gap (eyebrow ↔ action-decal 간격) |

### 신규 radius 토큰 (decal shape)

| 토큰 | 값 | 사용처 |
|---|---|---|
| `radius.decal.leaf` | `60% 40% 64% 36% / 50% 60% 40% 50%` (organic asymmetric) | leaf-shape decal (action decal, creature mini portrait). cream rectangle 폐기 후 organic shape로 art bible align |
| `radius.decal.pill` | `999px` (기존 `--radius-pill` alias) | currency mini-pill, eyebrow chip |

### 신규 layer / z-index 토큰

| 토큰 | 값 | 사용처 |
|---|---|---|
| `z.stage.background` | `0` | L1 |
| `z.stage.canvas` | `10` | L2 (Phaser canvas) |
| `z.stage.overlay` | `20` | L3 React fragment |
| `z.stage.moment` | `40` | ephemeral celebrate motion (reward reveal, milestone) — L3 위에서 발화 |
| `z.dock.surface` | `5` | dock region (stage L3 보다 낮음 — dock은 영구이고 stage moment가 dock 위로 올라옴) |
| `z.rail.surface` | `5` | rail region 동일 |

### 신규 elevation 토큰

| 토큰 | 값 | 사용처 |
|---|---|---|
| `elevation.decal.float` | `var(--color-shadow-decal)` | L3 floating decal |
| `elevation.dock.solid` | `inset 1px 0 0 rgba(35,58,43,0.06), -8px 0 24px rgba(35,58,43,0.06)` | dock region 좌측 vertical separator + 가벼운 dock interior shadow. 기존 `--elevation-dock-raised` 는 dock card 용 → 유지 |

### Modify (기존 토큰 변경)

| 토큰 | 현재 | 제안 변경 | 사유 |
|---|---|---|---|
| `--color-surface-dock` | `#fffbe9` | `#f6ebcf` (= `color.surface.dock.warm`) | stage cream과 contrast 3:1 충족 — Cycle 1 §4 위반의 직접 원인 |
| `--surface-panel` (alpha 0.92) | `rgba(255,252,232,0.92)` | **유지** (mobile에서는 그대로) + desktop stage L3 에서는 `color.surface.decal.warm` (alpha 0.62) 사용 | mobile 회귀 0 보장 + desktop L3 alpha 약속 |
| `--color-surface-rail` | `rgba(31, 59, 43, 0.78)` | **유지** | sage glass tone, art와 충분히 분리 |

### 신규 motion 토큰 (alpha decal 진입 vocabulary 확장)

기존 5 gesture (`tap/reveal/chapter/celebrate/ambient`) 유지. 단 alpha decal 진입은 `gesture.reveal`로는 충분하지 않음 — decal이 cream rectangle처럼 fade-in하면 cream rectangle처럼 보임. 신규 1 gesture 추가:

| 토큰 | 결합 | 의도 |
|---|---|---|
| `motion.gesture.settle` | `gentle × emphasized` (420ms × emphasized easing) | L3 decal 진입 — alpha 0 → 0.62, scale 0.92 → 1.0, 약간의 overshoot 후 settle. cream fade가 아니라 sticker가 무대에 sticky-down하는 느낌 |

5 → 6 gesture로 확장. spec § Decisions §5 "신규 토큰만"의 정신과 align (rename 아님, 추가).

---

## 5. Motion Vocabulary

### 6 gesture — 사용 매핑

| Gesture | 사용처 |
|---|---|
| `gesture.tap` | plot tap, dock card tap (Cycle 1 vocabulary 유지) |
| `gesture.reveal` | dock card 진입, currency cluster 등장 |
| `gesture.settle` (신규) | **stage L3 decal 진입** — eyebrow, action decal, creature mini portrait |
| `gesture.chapter` | merchant chapter 전환, stage L1 day↔night transition |
| `gesture.celebrate` | reward reveal, milestone reveal (Tier 5 ephemeral) |
| `gesture.ambient` | breathe·pulse, L2 creature idle loop, L1 햇살 vignette breathing |

### Stage 안 motion 일관성 약속

- L1 background plate: 영구 ambient breathing (햇살 vignette opacity 0.18 ↔ 0.24, `gesture.ambient` 4s loop)
- L2 canvas: plot tap → `gesture.tap` (snap 120ms), creature ready → `gesture.celebrate` (880ms)
- L3 decal: 첫 mount → `gesture.settle` (420ms emphasized), state change → `gesture.reveal` (420ms entrance)
- Tier 5 ephemeral moment (reward, milestone): `gesture.celebrate` + `color.accent.sun` glow halo + `z.stage.moment` 위로 올라옴, **dock·rail 위로 떠올라도 OK** (의도된 cross-region moment, brief § Decisions §1 unanimity 정신 — 잠깐의 비대칭은 정체성 강화)

### "어떤 gesture를 쓸지" 결정 규칙

다음 3 질문을 순서대로 통과해야 함:

1. **이 motion이 stage L1/L2/L3 어느 layer에서 발화하는가?** → L1=ambient, L2=tap/celebrate, L3=settle/reveal.
2. **이 motion이 영구 ambient인가, 발화성 spike인가?** → ambient=loop gesture, spike=non-loop gesture.
3. **이 motion이 cross-region(stage→dock 또는 dock→rail)인가?** → cross-region이면 `z.stage.moment` + `gesture.celebrate` 강제, 단발 region 내부면 layer 매핑 그대로.

위 3 질문 답이 매핑 표와 일치 안 하면 motion 추가 거부.

---

## 6. Asset Composition

### 활용 가능한 기존 일러스트 (asset_plan.json 기준 — 본 proposal 작성 시 확인)

- `background_greenhouse_day_001`, `background_greenhouse_night_001` — L1 배경판
- `creature_*` (herb/candy/lunar) — L2 canvas sprite 그대로 활용
- `sprite_strip_*`, `fx_strip_*` — L2 canvas animation
- `seed_icon_*` — L3 decal 안 mini icon
- `ui_album_card_frame_001` — L3 album mini decal frame로 활용 가능 (frame을 cream rectangle 위 두름이 아니라 alpha decal의 organic border로 사용)
- `ui_order_crate_leaf_001` — L3 order/expedition decal motif

### 신규 자산 제안 (본 axis 범위 OK — brief Soft constraint)

본 axis가 art 회복 axis이므로 신규 자산 1~3종 도입 가능. 단 spec phase에서 Engineer/Director가 cost 평가 후 결정.

| 자산 ID 제안 | 카테고리 | 용도 | 우선순위 |
|---|---|---|---|
| `decal_action_leaf_frame_001` | ui_frame | L3 stage-action-decal의 organic leaf-shape frame (alpha-aware, 가운데 비어 있음) | high — `.starter-panel` cream 대체 핵심 |
| `decal_creature_portrait_pad_001` | ui_frame | L3 stage-creature-decal의 organic pad frame | medium |
| `bg_greenhouse_day_002_warmsun` | background | 1920×1180 desktop 전용 widescreen 배경판 (현 정사각형 비율은 desktop에서 cropping 발생) | high — L1 광폭 점유 약속 |
| `fx_sun_breathe_loop_001` | fx_strip | L1 햇살 vignette ambient breathing strip (현재는 CSS gradient — sprite로 격상 시 art tone 강화) | low (CSS gradient로도 충분 가능) |

신규 자산 0건이어도 paradigm D는 작동 가능 (CSS gradient + organic radius 조합). 신규 자산은 art quality 강화 목적, paradigm 약속 자체는 CSS만으로 측정 통과 가능.

### Stage 컴포지션 — 1920×1180 sketch (텍스트 spatial)

```
[ rail   ] [             stage (≥ 75% art)              ] [ dock ]
[ 4탭    ] [ L1 greenhouse 배경판 (full bleed)            ] [ cream]
[ brand  ] [   eyebrow chip ↘ (L3 decal, alpha 0.62)     ] [ warm ]
[ logo   ] [                                              ] [      ]
[        ] [   ┌─ L2 Phaser canvas ─────────────────┐    ] [ ¥ 잎  ]
[        ] [   │  plot row (viewport 폭 펼침)        │    ] [ ¥ 꽃  ]
[ 씨앗    ] [   │  creature sprite                   │    ] [ ¥ 재  ]
[ 도감    ] [   │  L1 일러스트가 plot 사이로 비침    │    ] [───── ]
[ 원정    ] [   └────────────────────────────────────┘    ] [ next ]
[ 상점    ] [                                              ] [ chip ]
[        ] [  [creature decal]    [action leaf decal]     ] [───── ]
[        ] [  (organic alpha)     (organic alpha)         ] [ exp  ]
[        ] [                                              ] [ card ]
[━━━━━━━━] [━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━] [━━━━━]
```

cream rectangle 0개. art가 stage 면적의 ≥ 75%. dock은 별도 region으로 분리 인지 (contrast ≥ 3:1).

---

## 7. Disagreements I Anticipate

다른 specialist의 proposal을 못 봤지만, 이전 axis의 voice 패턴 + 본 axis brief의 cross-domain risk에 근거하여 예측:

### Designer
- "L3 decal alpha-aware는 정보 가독성을 깎는다. cream rectangle이 contrast가 가장 높다." → 반박: WCAG text contrast 4.5:1은 alpha 0.62 + emphasized type weight + soft shadow로 충족 가능. cream rectangle ≠ 가독성. 측정으로 풀자.
- "stage-action-decal에 next verb 1줄만 들어가는 건 onboarding에 부족하다." → 반박: dock의 next-action cluster가 영구 mount이고, action-decal은 verb의 stage hint. 두 곳에 정보 분배는 hierarchy의 정상 작동.

### Engineer
- "Phaser canvas transparent + L1 CSS background composite가 60fps에 충격을 줄 수 있다." → 반박: 시각 결정이 먼저, 성능은 측정 후 mitigation. 충격이 측정되면 spike axis로. (Cycle 1 §3 risk와 동일 패턴 — Engineer concession으로 풀려야 함)
- "신규 token 6종 + 신규 1 gesture 추가는 dual vocabulary를 더 부풀린다." → 반박: 본 axis는 art 회복이 명시 목적, token은 paradigm을 표현하는 도구. Cycle 1의 23 token도 사용처가 약했던 것이 문제 — 본 axis는 token 사용처를 정확히 명시(`color.surface.decal.warm`은 L3 fragment 전용).

### Senior Critic
- "art share 75%는 brief의 70%보다 강한데, 같은 약속을 두 번 위반 안 한다는 자기 motivation이지 measurable 정당화가 약하다." → 인정. 75% 근거는 'Cycle 1 위반 직후 같은 수치로 돌아가면 신뢰가 회복 안 된다는 honest admission'. 70% → 75% 차이가 visual에 결정적이지는 않음. Director가 70%로 깎아도 본 proposal의 핵심은 흔들리지 않음.
- "Paradigm D의 'alpha-aware' enforcement가 CSS lint 또는 CI 측정 없이 implementation을 신뢰하는 구조." → 인정. § 0에서 enforcement 계약 적었지만, CI level의 자동 측정(playwright pixel sampling) 없으면 또 위반 가능. 이 risk는 spec phase에서 Engineer/Director가 implementation gate로 약속해야 함.

---

## 8. Open Questions (≤ 5, 우선순위)

- **Q1 (high, spec resolve):** L1 배경판 단독으로는 1920×1180 desktop의 widescreen 비율을 `cover`로 cropping함. 신규 widescreen 배경판 (`bg_greenhouse_day_002_warmsun`) 자산 추가는 본 axis에서 함, 별도 axis로 미룸? 자산 추가 없으면 L1 양옆이 단색 cream으로 채워질 가능성 — paradigm D의 art share 측정이 위협받음.
- **Q2 (high, PR phase resolve):** L2 Phaser canvas의 transparent background 처리가 GardenScene 변경을 요구하는가? 본 axis brief Non-negotiable #4는 GardenScene mechanic 변경 0이지만 host integration은 OK — canvas background 색은 host props로 전달 가능한지 확인 필요.
- **Q3 (medium, spec resolve):** Tier 5 ephemeral moment(reward reveal)이 `z.stage.moment`로 dock 위까지 올라올 때, dock의 영구 cluster를 시각적으로 가리는 frame이 있어야 하는가, 그냥 dock 위로 throughpass 하는가? `cross-region-moment-elevation` 후속 axis 약속 (spec §Q3) 과 충돌 가능.
- **Q4 (medium, spec resolve):** 신규 motion gesture `settle` 추가는 6 gesture vocabulary로 확장. Cycle 1 spec §Decisions §5의 "신규 토큰만, rename 별도 axis" 정신과 align하지만, Engineer가 vocabulary 1개 추가도 cost로 보면 충돌 가능. 추가 유지 or 5 gesture 안에서 어떻게든 표현? (제안: 추가 유지, `settle`은 시각적으로 명확히 다른 gesture)
- **Q5 (low, future axis):** L3 decal의 organic radius (`60% 40% 64% 36% / 50% 60% 40% 50%`)이 viewport·browser별 렌더 차이를 일으킬 가능성. SVG mask로 격상하면 일관성 ↑이지만 자산화 비용 발생 — 본 axis는 CSS radius로 시작, 차후 SVG 격상 axis 분리.

---

## 9. Self-applied enforcement contract — implementation gate 약속

본 axis가 spec → implementation 단계에서 또 위반되지 않게, 본 proposal은 implementation 단계에 구체적 gate를 요구한다 (Engineer/Director에게 위임):

1. **각 PR 머지 전 playwright screenshot pixel sampling.** stage region (rail/dock 외 영역)에서 cream tone luminance 픽셀 비율 측정. ≤ 20% pass.
2. **dock surface ↔ stage cream luminance contrast 자동 측정.** ≥ 3:1 pass.
3. **CSS lint rule:** stage region 내부 React 컴포넌트에서 `background-color: <opaque cream>` 사용 시 build error. `background: rgba(...alpha ≤ 0.78...)` 또는 `linear-gradient(...)` 만 허용.
4. **Art Director critique pass agent spawn.** 각 PR 후 본 proposal vs 실제 screenshot 비교, 측정 수치 evidence inline. critique fail 시 PR 머지 금지.
5. **사용자 시각 검증 gate.** 모든 측정 통과해도 사용자가 "정원에 들어왔다" 인상 못 받으면 spec re-open.

위 5 gate가 spec § Acceptance Criteria 또는 § Risks Mitigation에 명시되어야 본 proposal의 약속이 implementation까지 건너옴.

---

## 10. References

- Brief: `reports/deliberation/stage-art-first-restructure/brief.md`
- Persona: `docs/studio/personas/art-director.md`
- Failed implementation reference: `reports/deliberation/desktop-ui-redesign/spec.md` (§ Decisions §1·§4), `reports/deliberation/desktop-ui-redesign/retrospective.md`
- Memory: `feedback_implementation_critique_gate.md` (본 axis 첫 enforcement 케이스), `feedback_layout_over_polish.md`
- Code:
  - `src/styles.css:1-56` (`:root` 토큰)
  - `src/styles.css:101-119` (`.garden-stage`)
  - `src/styles.css:190-205` (`.garden-panel` — 폐기 대상)
  - `src/styles.css:805-823` (`.starter-panel`, `.dev-panel` — alpha 격하 대상)
  - `src/styles.css:7728-7849` (desktop @media block — paradigm D 적용 대상)
- Asset bible: `assets/source/asset_style_bible.json` (cute-strange greenhouse, soft rounded silhouettes, warm whimsical mood)
- Asset plan: `assets/source/asset_plan.json` (background/creature/sprite_strip/fx_strip/ui_frame 등 활용 가능)
