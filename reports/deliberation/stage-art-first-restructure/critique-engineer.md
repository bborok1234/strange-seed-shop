# Critique — Engineer (개발자)

- Axis: `stage-art-first-restructure`
- Phase: 3 (cross-critique)
- Author persona: Engineer
- Date: 2026-05-04
- Inputs: brief.md + proposals/{designer,art-director,engineer}.md + persona file

> **결론 첫 줄(persona contract):** Designer L1 diegetic UI + Art Director Paradigm D 둘 다 **본 axis 1 cycle 안에 동시 ship은 구현 불가** (≥1500줄·5+ PR·spike 5h 소요, brief soft constraint 정면 위반). 측정 게이트(art-share + dock contrast)와 alpha-aware enforcement는 무조건 필요 — 이 부분은 양보 못 함. 두 proposal에 공통된 가장 큰 hidden cost는 **Phaser canvas transparent + L1 CSS 배경 composite의 60fps 회귀 risk** — 두 proposal 모두 이 risk를 "측정 후 mitigation"으로 미루는데, 이게 Cycle 2 implementation 갭의 다음 후보다.

---

## Disagreement with Designer (technical / cost / save / perf)

### D-1 (high) — L1 diegetic UI "본 axis 안 ship 필수" 주장의 cost 누락

Designer Q1 + L1 매핑이 본 axis Cycle 1 안 ship을 "player-feel core"로 묶는데, 이건 Phaser sprite + React DOM overlay 좌표 동기화·폰트 일관성·60fps 유지의 **+500–800줄 + spike 2–4h**다. 본 proposal § Files Touched의 패러다임별 추가에 들어가지 않은 **L1 전용 인프라**(plot 위 % badge의 좌표 broadcast, "수확!" chip의 z-axis 정책, sprite reward burst → currency tick의 React-Phaser 이벤트 bridge). brief soft constraint(PR ≤ 5개·≤500줄/PR·bundle +10KB)에서 **PR 1개 추가·bundle +3–6KB·dual-rendering frame budget 사용** 발생. 무단 cut 안 함 — Designer가 L1 양보 안 하면 **본 axis Cycle를 2개로 분할**(Cycle A: paradigm + 측정 게이트 / Cycle B: L1 diegetic) 제안.

### D-2 (high) — `.starter-panel` 폐기 + onboarding 1회성 modal로 대체의 회귀 risk 누락

Designer "starter-panel **완전 폐기** + 첫 30초 1회성 modal 대체"는 `App.tsx:2270-2851` 안 starter-prompt 조건부 렌더링 + `PlayerSave.onboardingState` 의존성을 건드린다 (정확한 의존 chain은 spike 30분 필요). brief Non-negotiable §3 "PlayerSave/persistence 변경 0"과 충돌 가능 — onboarding 완료 flag 분기를 modal로 이주할 때 기존 save의 `onboardingComplete: true` 사용자가 modal을 다시 보거나 못 보거나 둘 중 하나. **save migration 코드 0줄 약속이 깨질 risk**. Designer가 "onboarding flow 재설계는 본 axis 범위 안"으로 명시 안 했는데 implementation은 그걸 강제한다.

### D-3 (mid) — Layer L0~L4 5-layer 분리의 React render frequency 영향

Designer L1(in-canvas diegetic) + L2(edge ambient overlay) + L3(side dock) + L4(reward celebration)이 stage 안에서 동시 mount 시, **React render frequency가 layer마다 분리** (production tick → L1 sprite update + L2 next-action label + L3 currency cluster + L4 reveal). 현재 React render는 stage 1곳에 집약되어 60fps 유지 측정 가능했지만, 4 layer 분리 시 useEffect chain·context propagation 경로가 늘어나서 **frame drop spike risk**. Designer는 "side-effect 있는 useEffect chain 0개 추가" 약속 안 함 — Engineer는 layer마다 `React.memo` + context selector 강제 필요.

### D-4 (mid) — "stage 안 React 카드 0개를 목표"의 측정 정의 부재

Designer "stage 안 React 카드 0개 목표 (단 reward L4 제외)"는 약속 좋지만 **측정 정의가 Art Director § 1 art-share 측정과 충돌 가능** — Art Director는 cream rectangle pixel ratio로 측정, Designer는 React 카드 count로 측정. 둘이 다른 메트릭이라 **두 측정 모두 통과해도 사용자 인상이 cream void일 수 있음** (예: React 카드는 0개지만 stage canvas 자체가 cream tone이라 art-share 미달). spec § Acceptance Criteria에서 메트릭 1개로 합치든지 두 메트릭의 **and 게이트** 명시 필요.

### D-5 (low) — Q5 "L4 reward는 stage 위 floating modal" 결정을 본 axis에 흡수 시 scope creep

Designer Q5에서 L4 reward 무대를 본 axis 안에서 결정 권고하는데, 이건 follow-up axis(`cross-region-moment-elevation`)가 명시 약속한 영역. 본 axis로 흡수하면 z-index 토큰 + reward modal 컴포넌트 + stage-dock overlap motion 정책까지 들어옴 (+200–400줄). **brief Out of Scope 정면 위반은 아니지만 Director가 명시 결정해야** — 본 proposal § Open Questions Q4 "critique pass 신호 어디서 받는가"와 동일한 process risk.

---

## Disagreement with Art Director (token cost / PR sequencing 결과)

### A-1 (high) — Paradigm D "L1 배경판 + L2 transparent canvas + L3 alpha decal"의 Phaser canvas transparent cost

Art Director Q2에서 "GardenScene mechanic 변경 0이지만 host props로 canvas background 색 전달"을 가정하는데, **Phaser.Game config의 `transparent: true` 옵션은 game instance 생성 시 한 번만 적용** — runtime host props로 toggle 불가. `GardenPlayfieldHost.tsx`(line 116 `Phaser.Scale.RESIZE`)에서 game instance 생성 시 `transparent: true` 강제 시 **전체 sprite의 alpha composite**가 GPU 부담을 추가 (현재 opaque background로 GPU가 painter 알고리즘 단순화). spike 1–2h로 60fps 유지 측정 필수. 측정 안 하고 Paradigm D 진입 시 **mobile 회귀 0(brief Non-negotiable §2)도 깨질 risk** — mobile에서도 같은 game instance 사용.

### A-2 (high) — 신규 token 6종 (color 5 + spacing 2 + radius 2 + z-index 6 + elevation 2 + motion 1) = 18종 추가의 dual vocabulary 부풀림

Art Director § 4에서 신규 token ~18종 도입 (`color.surface.decal.warm`·`spacing.stage.inset`·`radius.decal.leaf`·`z.stage.background`·`z.stage.canvas`·`z.stage.overlay`·`z.stage.moment`·`z.dock.surface`·`z.rail.surface`·`elevation.decal.float`·`elevation.dock.solid`·`motion.gesture.settle` 외). Cycle 1 PR0.5에서 23 token 도입했고 그 사용처가 약했던 것이 §4 위반의 한 원인이었다. 본 axis가 18 token을 추가하면 **token 총 41종 + 사용처 enforcement는 implementation gate에 의존** — implementation gate가 없으면 또 사용처 미작동. 본 proposal § Verification에서 `check:art-share` + alpha-aware enforce는 자동화 가능하지만 **token 사용처 자체를 lint하는 인프라는 본 axis에 없음**. Art Director가 신규 token 18종 도입 시 "어느 token이 어느 selector에서 사용되어야 하는지" CSS lint rule (예: `stage-action-decal` selector는 `color.surface.decal.warm` 만 허용) 약속 추가 요청.

### A-3 (mid) — Paradigm D PR sequencing의 "L1 배경판 widescreen 자산 (`bg_greenhouse_day_002_warmsun`)" Q1 미해결 시 art-share 측정 fail

Art Director Q1 — 현재 `background_greenhouse_day_001`은 정사각형 비율, 1920×1180에서 `cover` 시 양옆 cropping. 신규 widescreen 자산 없으면 L1이 cream 단색으로 양옆 채워지고, **art-share 측정값이 paradigm D 약속(≥75%) 미달** 가능. 본 proposal PR-INFRA-1(art-share 측정) → PR-INFRA-2(cleanup) → 패러다임 PR 순서대로 가면 **패러다임 PR이 측정 fail로 머지 불가** → asset PR을 먼저 해야 함 → asset PR이 illustration generation pipeline 영향 받음(asset_plan.json 수정 + check:asset-style 통과 필요). PR sequencing이 **6 PR로 확장** (asset → infra → cleanup → paradigm × 3). brief soft constraint(PR ≤ 5개) 정면 위반.

### A-4 (mid) — `--color-surface-dock` token modify (`#fffbe9` → `#f6ebcf`)의 mobile 회귀 risk

Art Director § 4 Modify 표에서 `--color-surface-dock`을 `#fffbe9` → `#f6ebcf` 직접 변경 제안. 이 token은 mobile `.dock` 등 다른 컴포넌트에서도 사용 가능 (정확한 사용처는 `grep -r "color-surface-dock\|surface-dock" src/styles.css` spike 10분 필요). **mobile snapshot 회귀 0(brief Non-negotiable §2) 깨질 risk**. 본 proposal § Files Touched는 모바일 회귀 risk를 인지했지만 token modify까지는 안 봤다 — Art Director는 modify 대신 **신규 token (`color.surface.dock.warm`) 도입 후 desktop @media block에서만 override** 권고.

### A-5 (low) — `motion.gesture.settle` 신규 추가 (5 → 6 gesture vocabulary)의 cost

Art Director § 4 motion 토큰 신규 1개 (`gesture.settle` = 420ms × emphasized + alpha 0→0.62 + scale 0.92→1.0 overshoot). Cycle 1 § Decisions §5는 "신규 토큰만, rename 별도 axis"였고 신규 추가는 정신과 align — 본 proposal은 동의. 단 vocabulary 1 추가 + alpha + scale + overshoot 결합은 **CSS keyframe animation 60줄 이상 + reduced-motion fallback 30줄 + JS-side trigger 정책 (decal mount 시 1회만, state change는 reveal로 분리)** 필요. ~100–140줄 추가, 본 proposal cost 표에 안 잡힘 — 본 critique에서 추가 인정.

---

## Self-critique

본 proposal § Verification에서 `check:art-share` + dock contrast 자동 측정 + alpha-aware CSS lint를 강제 명시했지만, **CSS lint rule의 구현 방법을 spike하지 않았다**. PostCSS plugin 작성이냐 stylelint custom rule이냐 ESLint CSS-in-JS plugin이냐에 따라 +200–500줄 + plugin maintenance 부채. 본 proposal § PR-INFRA-1이 measure-art-share + playwright spec 만 책임지고 CSS lint는 "후속 어딘가" 라는 honest 부재가 있음. Art Director § 9 enforcement contract #3 ("CSS lint rule")이 본 proposal § Verification에는 자동화 게이트로 안 적혀 있음 — Art Director critique에서 이걸 잡으면 본 proposal의 CI gate 약속이 부분적으로 manual review에 의존하는 구조가 노출된다. 추가 spike 1h + lint 인프라 +250–400줄 budget을 본 axis 안에 잡든지, follow-up axis로 명시 분리하든지 Director가 결정해야 함.

또한 본 proposal § Open Questions Q1 ("GardenScene 경계 in-canvas chrome layer")이 Designer L1 + Art Director Paradigm D 양쪽에 영향을 주지만, 각 proposal과 같이 본 critique에서 read한 후에야 **두 proposal 모두 GardenScene 경계를 건드리지 않고도 약속을 지킬 수 있음**(Designer L1은 React DOM overlay로, Art Director L2는 transparent canvas로)을 깨달음. 본 proposal Q1의 "Canvas-first(A) 사실상 제외" 결론을 **본 axis에서는 모든 패러다임에 적용**으로 더 강하게 closing하지 못한 것이 self-criticism.

---

## Cross-cutting risks (multiple proposal 합쳐 보면 보이는 risk)

### CR-1 (high) — Designer L1 + Art Director L2 transparent canvas + L3 alpha decal 동시 도입 시 Phaser-React 이벤트 bridge 정합성

Designer L1(plot 위 sprite-바깥 React DOM overlay로 % badge / "수확!" chip)이 Art Director L3(stage 위 floating decal)와 **같은 z-axis layer**에서 mount된다. Phaser pointer event(L2 canvas) ↔ React DOM event(L1+L3) 의 hit-testing이 alpha-aware할 때 (L2 transparent, L3 alpha 0.62), **plot tap이 L3 decal 위에서 발생하면 어디로 가는가?** Phaser canvas가 아래에 있으니 React DOM event가 stop_propagation 안 하면 둘 다 발화. Designer + Art Director 누구도 이 event 정책을 명시 안 함. spike 2h + event policy 결정 (L3 decal에 `pointer-events: none` 강제? L2에 hit-area 우선권?) 필요.

### CR-2 (high) — Designer "stage 안 cream rectangle ≤ 10%" + Art Director "stage 안 React-overlay cream pixels ≤ 20%" 약속 충돌

Designer § Information Hierarchy "stage region 안 cream rectangle 픽셀 점유율 ≤ 10%". Art Director § 1 "stage 안 React-overlay cream pixels ≤ 20%". **두 임계값이 다름** — Director가 spec § Acceptance Criteria에서 둘 중 하나 선택 또는 두 측정 모두 통과 강제(더 엄격한 ≤10% 적용) 결정해야. 본 proposal § Verification은 임계값을 spec.md에서 옮겨오는 contract로 적었지만, **두 proposal에 임계값이 둘 다 있으면 옮겨올 source가 모호** — 본 critique에서 Director에게 결정 위임 명시.

### CR-3 (mid) — 모든 proposal이 "사용자 시각 검증 gate"를 implementation 마지막 단계로 미룸

Designer "사용자 시선 첫 5초 흐름 측정 (1주 dogfood)", Art Director "§ 9 #5 사용자가 '정원에 들어왔다' 인상 못 받으면 spec re-open", Engineer "Verification spike + critique pass + 사용자 review 병행". **세 proposal 모두 사용자 검증 = 마지막 게이트** 인데, Cycle 1이 사용자 검증을 마지막에 받아서 ~10% 가치 도달이 발견된 회고. 본 axis는 **mid-cycle 사용자 미리보기 (예: paradigm PR 1개 머지 후 즉시 사용자 screenshot review)** 를 spec에 명시해야 cycle 끝에 또 같은 갭 발견되지 않음. 본 critique가 Director에게 **mid-cycle review gate 1회 추가**를 권고.

### CR-4 (mid) — Designer + Art Director 둘 다 "stage 폭 viewport 비례 펼침"을 GardenScene 안 plot grid anchor 변경 없이 가정

Designer Q3 (별도 axis follow-up `garden-scene-anchor-adjustment`), Art Director § 2 ("plot row가 폭에 비례하여 펼쳐짐") — **둘 다 본 axis 안에서 plot grid 폭 적응을 약속하지만 GardenScene 변경 0 (brief Non-negotiable §4) 안에서 어떻게 가능한지 불명**. host props로 viewport 폭만 전달하고 GardenScene이 그걸 받아서 grid를 펼치는 mechanic이 이미 있는지, 아니면 GardenScene 안 grid layout 변경이 필요한지 spike 30분 필요. 본 critique가 brief Non-negotiable §4 + Art Director Q2를 묶어 **Director에게 GardenScene host integration 경계 명시 결정**을 요청.

### CR-5 (low) — 세 proposal 모두 mobile 회귀 측정의 구체적 viewport list 부재

Designer + Art Director는 "mobile 영향 0" 명시, Engineer는 desktop 3 viewport (1280/1600/1920) 측정 인프라만 명시. **mobile 측정 viewport (예: 375×667 / 414×896 / 480×800) 약속이 어디에도 없음** — 기존 `tests/visual/p0-mobile-game-shell.spec.ts` 4293줄에 있을 가능성 높지만 본 axis의 desktop change가 mobile snapshot diff를 일으키지 않는다는 보장은 본 axis spec에 명시되어야 함. 본 critique가 spec § Acceptance Criteria에 mobile snapshot diff 0 명시 강제.

---

## Concessions (with rough delta-cost numbers)

본 proposal이 양보 가능한 영역과 그 cost:

### Concession-1: Art Director Paradigm D를 "권장 패러다임" 으로 받아들임 (cost 평행 제시 거부 일부 양보)

본 proposal § Files Touched는 paradigm 권장 명시 거부였지만, Paradigm D는 본 proposal의 cost 표에서 Frame-overlay(B)와 비슷한 수준 (~700–1100줄, +4–9KB gzipped, B의 변형)에 들어맞음. **델타 cost 0KB / 0줄 — 본 proposal의 (B) 추정 그대로 적용 가능**, 단 widescreen asset 추가 시 +50–120KB raw / +6–14KB gzipped (PNG 압축 후) 자산 비용 추가. **본 critique에서 Paradigm D 채택 양보 — 단 단서**: GardenScene transparent: true 가능 여부 spike (1–2h) + L3 alpha decal CSS lint rule 도입 (+250–400줄) 본 axis에 포함 조건.

### Concession-2: Designer L1 diegetic UI를 본 axis Cycle B (분할)로 미루지 않고 본 axis 안 ship 양보 (단 PR 5개 한계 양보 협상)

본 critique D-1에서 L1을 별도 Cycle B 분할 제안했지만, Designer가 "L1 = player-feel core, 미루면 art-only wallpaper로 회귀"라고 push할 가능성 high. 양보 시 cost: **+500–800줄 + spike 2–4h + bundle +3–6KB gzipped + PR 1–2개 추가**. brief soft constraint "PR ≤ 5개"가 본 axis에서 **PR 6–7개로 확장**됨을 spec § Decisions에서 Director가 명시 승인 조건. 양보의 trade-off 형태로 명시 (무단 cut 안 함, persona MUST NOT).

### Concession-3: 본 proposal § Verification의 `check:art-share` 임계값을 spec.md "Acceptance Criteria"에서 옮겨오는 contract 양보

본 proposal은 임계값을 PR 본문에 hardcoded라고 적었지만, Senior Critic이 잡을 가능성 높은 "임계값은 spec source-of-truth"가 맞음. 양보 시 cost: **델타 cost 0줄 — 임계값 위치만 옮김**, 단 spec.md § Acceptance Criteria 작성 분량이 ~30–50줄 늘어남 (Director 영역). 본 critique에서 양보 명시.

### Concession-4: CSS lint rule 인프라를 본 axis 범위로 흡수 (Art Director § 9 #3 enforcement contract 수용)

본 self-critique에서 인정한 CSS lint rule 부재를 양보로 흡수. cost: **+250–400줄 (PostCSS plugin 또는 stylelint custom rule) + spike 1h + plugin maintenance 부채**. PR 1개 추가 (PR-INFRA-3 — CSS lint rule + alpha-aware enforce). brief soft constraint "PR ≤ 5개"가 PR 7개로 확장됨 (Concession-2와 합산). 양보 조건: Director가 PR 한계 명시 승인.

### Concession-5: dock contrast 임계값 ≥ 3:1을 ≥ 1.6:1 (Art Director Tier 1↔2 luminance 수치) 사이에서 spec resolve 위임

본 proposal § Verification에서 `dockBgVsStageBgContrastRatio >= 3.0` hardcoded였지만, Art Director § 1 Tier 별 contrast 약속에서 dock↔stage는 ≥ 3:1 (동일), Tier 1 sprite↔Tier 2 background는 ≥ 1.6:1. WCAG AA 기준이면 ≥ 4.5:1 (text), ≥ 3:1 (UI 컴포넌트). **임계값 source-of-truth는 spec.md** 양보 (Concession-3 연장). 델타 cost 0줄.

---

## Persona contract self-check

본 critique는 (a) Designer 5 critique items, (b) Art Director 5 critique items, (c) Self-critique 1, (d) Cross-cutting risks 5, (e) Concessions 5 (델타 cost 추정 포함) — 5 섹션 모두 충족. **신규 옵션 제안 0건**, **design intent 무단 cut 0건**, **cost-only 결론 0건**, persona 영역 (visual hierarchy / player verb 결정)은 안 건드림. critique items 각 section ≤ 5 준수.
