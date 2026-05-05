# Engineer Proposal — Stage Art-First 재구조화

- Axis: `stage-art-first-restructure`
- Author persona: Engineer (개발자)
- Phase: 2 (parallel proposal, isolated)
- Date: 2026-05-04

> **결론 첫 줄(persona contract):** 본 axis는 **구현 가능**. 단 **Art Director critique gate를 자동화로 강제하지 않으면 Cycle 1 실패가 그대로 재발한다** — 그 게이트가 본 proposal의 가장 load-bearing 변경점이다. 패러다임 선택(Canvas-first / Frame-overlay / Hybrid / 신규 D)은 **Designer + Art Director의 영역**이며, 본 proposal은 각 옵션의 cost/risk만 평행 제시한다. "권장 = X" 명시 거부.

---

## Files Touched (패러다임 무관 + 패러다임별 추가)

### 패러다임과 무관하게 모두 건드리는 파일 (공통 부채)

| 파일 | 변경 사유 | 추정 줄 |
|---|---|---|
| `src/styles.css` | `.garden-panel` 절대 좌표 제거 또는 floating overlay化, `.starter-panel max-height: 230px` 해소, `.side-dock` 배경 contrast 강화, desktop @media block(line 7729+, 7814+) 패러다임 분기 재설계 | 280–520 |
| `src/App.tsx` | garden-stage JSX(line 2185–2873) 안 panel composition 재설계, dev-panel/side-dock 위치 정책 재적용. **mobile 코드경로 회귀 0 보장이 risk source** | 120–280 |
| `src/game/playfield/GardenPlayfieldHost.tsx` | canvas resize 정책 — `Phaser.Scale.RESIZE` 모드는 유지(line 116), 단 host wrapper의 width/height policy를 stage 면적과 동기화 | 30–80 |
| `tests/visual/p0-mobile-game-shell.spec.ts` | desktop viewport 3종(1280/1600/1920) 회귀 베이스라인 spec 추가 + art-share 측정 helper. 현 파일 4293줄 — 신규 spec 별 파일로 분리 권고 | (별 파일 추가) |
| `tests/visual/desktop-art-share.spec.ts` (**신규**) | art-share %, dock contrast ratio, panel pixel dominance 측정. **CI fail 트리거** | 220–360 |
| `scripts/measure-art-share.mjs` (**신규**) | screenshot → 픽셀 sampling → JSON report. playwright spec에서 호출 | 140–220 |
| `package.json` scripts | `check:art-share` 추가 + `check:ci`에 wire | 4–6 |
| `playwright.config.ts` | desktop viewport project 추가, art-share spec project 분리 | 20–40 |

**total 공통 추정:** ~810–1500줄. 단순 cosmetic axis가 아니라 inspection 인프라까지 포함하는 axis로 프레이밍해야 honest.

### 패러다임별 추가 변경 파일

| 패러다임 | 추가 파일 | 추정 추가 줄 |
|---|---|---|
| **Canvas-first (A)** | `src/game/playfield/GardenScene.ts` (변경 금지 영역 — brief Non-negotiable §4 boundary 재협상 필요), 새 `src/game/playfield/GardenChromeLayer.ts` (HUD/panel을 in-canvas sprite로 흡수), Phaser DOM container 이용 시 `phaser`의 dom layer config + Vite 번들 영향 검증 | +600–1100 |
| **Frame-overlay (B)** | `src/components/StageFrameOverlay.tsx` (신규, semi-transparent + art frame border + 일러스트 mask), `assets/source/asset_style_bible.json` 신규 frame asset (PNG 9-slice border) — sprite 추가 0–4종 | +320–540 |
| **Hybrid (C)** | 위 (A)의 in-canvas plot/creature/grass 부분 + (B)의 React floating overlay 부분 = **두 개 인프라 모두 도입**. cost = A + B의 합산 약 80% | +780–1480 |
| **신규 D** | 명세 미정 — Designer/Art Director가 D를 제시하면 본 proposal critique 라운드에서 cost 추정 추가 |

> Cost-only 결론 박지 않음(persona MUST NOT). 위 표는 **선택지의 비용 평행 제시**일 뿐이고, design intent (어느 안이 사용자의 "정원 = 무대" 약속을 가장 잘 지키는가)는 Designer + Art Director 영역.

---

## Estimated PR Decomposition

각 PR ≤ 500줄, ≤ 5 파일 (brief soft constraint). PR 순서는 **infra-first**: 측정 인프라가 먼저 들어가야 후속 PR의 art-share 위반을 자동 캐치할 수 있음. 이게 Cycle 1 회고의 핵심 학습.

### 패러다임 무관 — 공통 PR (먼저 직렬 머지)

#### PR-INFRA-1 — Art-share 측정 인프라 (★ Cycle 1 실패 재발 방지의 핵심 PR)

- 신규 `scripts/measure-art-share.mjs`: screenshot 한 장 + 측정 영역 좌표 → 색 sampling → "stage 안 cream-band 픽셀 비율 / dock-band 픽셀 비율 / Phaser canvas 픽셀 비율 / art background 노출 픽셀 비율" 4종 메트릭 출력
- 신규 `tests/visual/desktop-art-share.spec.ts`: 1280×800, 1600×900, 1920×1180 3 viewport에서 capture → measure-art-share 호출 → spec 임계값 비교 → fail 시 메트릭 + diff 이미지 저장
- 신규 `package.json` script `check:art-share` + `check:ci`에 wire
- `playwright.config.ts`: desktop viewport project 분기
- **임계값은 PR 본문에 hardcoded — spec.md에서 옮겨오는 게 contract**. 예: `stageArtPixelRatio >= 0.55`, `stageReactPanelCreamRatio <= 0.30`, `dockBgVsStageBgContrastRatio >= 3.0`
- 추정: ~440–620줄 (script + spec + config), 4–5 파일
- 검증: `npm run check:art-share` — **현재 main에서 실행 시 fail해야 정상**. 현재가 fail하지 않으면 측정 스크립트가 spec promise를 캐치하지 못한다는 뜻 → spec 임계값 또는 측정 ROI를 강화하고 PR 다시.
- **PR-INFRA-1은 후속 art PR이 머지되기 전에 main에 들어가야 함**. 그래야 art PR이 측정 게이트를 통과해야 한다는 강제력이 작동.

#### PR-INFRA-2 — Cleanup: `.starter-panel max-height: 230px + overflow-y: auto` 강제 cream 띠 제거 (시각 noop이 아닌 호흡 회복 단계)

- `src/styles.css` `.starter-panel` (line 813) max-height 무효화 + 콘텐츠 길이에 따라 자연스럽게 흐르도록. 단 mobile에서는 기존 동작 보존(`@media (max-width: 900px)`).
- `.garden-panel` 절대좌표(line 190 `top: 122px; bottom: 78px`) → desktop에서는 grid-area: stage 안의 자연 flex/grid로 재정의. mobile 좌표는 보존.
- 추정: ~140–220줄, 1–2 파일
- 검증: `check:art-share` 통과 — 단, 본 PR만으로는 Canvas-first(A)나 Frame-overlay(B)의 art-share 약속을 못 채울 가능성이 높음. PR-INFRA-2는 패러다임 적용을 위한 청소 단계.

### 패러다임별 — Designer/Art Director가 패러다임을 잠근 후 진행

#### Canvas-first (A) — 5 PR 예상

- A-PR1: GardenScene boundary 재협상 — brief Non-negotiable §4 ("GardenScene 내부 mechanic invariant")가 chrome layer 추가까지 막는지 spec.md에서 명시 결정. spike 1시간.
- A-PR2: `GardenChromeLayer.ts` (currency/next-action을 in-canvas sprite + bitmap font)
- A-PR3: HUD-bound text 한글 처리 — Phaser BitmapText는 한글 글리프 부담. CanvasText fallback이면 GPU 비용. spike 2시간.
- A-PR4: stage host React layer 축소 (`GardenPlayfieldHost.tsx` 안 `.playfield-action-feedback` 등 React overlay → in-canvas)
- A-PR5: art-share 측정 통과 + Art Director critique pass
- 합산 추정: ~900–1500줄, 평균 4–5 파일/PR. 각 PR이 500줄 한계에 부딪힐 위험 high.

#### Frame-overlay (B) — 4 PR 예상

- B-PR1: `StageFrameOverlay.tsx` 신규 (semi-transparent + 9-slice 일러스트 frame border)
- B-PR2: `.garden-panel`/`.starter-panel` background을 surface-panel cream → `transparent + frame-border` 패러다임으로 전환. 새 frame asset 1–4종 추가.
- B-PR3: dock contrast 회복(brief evidence) — `.side-dock` 배경 → `--color-surface-rail` 톤 또는 art-on-paper 일러스트 텍스처. card 배경 대비 ≥ 3:1 강제.
- B-PR4: art-share 측정 통과 + Art Director critique pass
- 합산 추정: ~700–1100줄. 패러다임 중 cost가 가장 작음. 단 Art Director가 frame asset 새로 그리는 시간이 cost 외 schedule risk.

#### Hybrid (C) — 6–7 PR 예상

- A 안의 in-canvas plot/creature 흡수 부분 + B 안의 React floating overlay 부분을 분리 진행. cost ≈ A + B의 75–80%.
- 합산 추정: ~1300–2200줄. **brief soft constraint(PR 5개 안) 정면 위반 위험 high** — Cycle 분할 필수.

#### 신규 D — Designer/Art Director가 제안 시 cost 평가 critique 라운드에서 추가

---

## Save Migration Plan

- `PlayerSave` 변경 0 (brief Non-negotiable §3).
- `persistence.ts` 변경 0.
- 신규 `localStorage` key 0 — desktop layout 선호도 같은 client-only 상태도 본 axis에서 도입 안 함.
- migration 코드 0줄. 마이그레이션 risk 0.
- **단 단서:** Canvas-first(A) 패러다임에서 currency/next-action을 in-canvas로 옮기면, 기존 React useEffect chain이 Phaser scene 안 sprite update로 이주됨. 이는 save 호환성과는 무관하나, **렌더 frequency 회귀**(useEffect 주기와 Phaser update tick 불일치)를 만들 수 있음. 본 axis 측정 대상 아님이지만 명시.

---

## Performance Budget Impact (정량 추정 + 측정 책임)

### Bundle size

| 항목 | 추정 delta (gzipped) |
|---|---|
| 공통 PR-INFRA (script + test) | 0KB (런타임 번들 외) |
| 공통 PR-INFRA-2 cleanup | -1 ~ +0KB (CSS 단순 net) |
| Canvas-first (A) — Phaser DOM/Bitmap layer + chrome sprite | +12 ~ +24KB (Phaser DOM 모듈 동적 import + 신규 sprite asset 0.5–4KB/장) |
| Frame-overlay (B) — frame component + asset 1–4장 | +4 ~ +9KB (PNG 9-slice 1–4장 + 신규 React 컴포넌트 ~80줄) |
| Hybrid (C) | +14 ~ +28KB |
| 신규 D | TBD |

> brief soft constraint "+10KB gzipped" 위반 위험: **A와 C는 정면 위반**, B는 안전. **Designer/Art Director가 A를 선택하면 Engineer는 budget 재협상 요청** — 무단으로 A를 깎지 않음(persona MUST NOT). 재협상 옵션: (a) brief constraint를 +20KB로 완화, (b) A 안에서 sprite asset을 PR 분할 + lazy-load.

### Runtime (frame, tween, React render)

- **Phaser RESIZE 모드 + grid resize transition motion** — 현 `GardenPlayfieldHost`(line 116 `Phaser.Scale.RESIZE` + line 117 `CENTER_BOTH`)는 viewport 크기 변경 시 `scale.on("resize")`(GardenScene.ts:61) 발화 → `renderPlayfield()` 전체 재구성. desktop dock 가변 확장 transition (`var(--motion-gesture-reveal)` = 420ms gentle entrance — styles.css 7818) 동안 resize 이벤트가 ~25 fire 가능 → `renderPlayfield()`가 25번 호출되어 frame drop. **본 axis는 이 회귀를 측정해야 함** — playwright `tracing` + Phaser scene scene.events 측정 spike 1–2시간.
- **Canvas-first(A)에서 in-canvas HUD가 추가되면** GardenScene.create() 안 sprite 수가 증가. 현재 `playfieldAssets` + `pendingOneShotEffects.length < 8` 한계가 있는데 chrome layer가 그 한계 안에 들어가야 함. spike 2시간.
- **Frame-overlay(B)는 React 측 추가** — `StageFrameOverlay`가 transition 중 매 frame 리렌더되지 않도록 `React.memo` 강제 + frame asset preload. side-effect 있는 useEffect chain 0개 추가가 contract.

### 메인 스레드 블록 risk

- A의 in-canvas BitmapText 한글 글리프 generation 시 1회 ~80–200ms freeze 가능 (CJK 글리프 수 많음). 한글 dynamic text는 BitmapText 비호환이 사실상 결론 — Phaser CanvasText 사용 시 GPU upload 매 frame. **A 진입 시 spike 필수**.

---

## Verification Commands (★ Art Director critique gate 자동화 — 본 axis MUST 추가)

### 측정 스크립트 + 자동 fail gate

```bash
# 1. art-share 측정 (PR-INFRA-1 산출물)
npm run check:art-share
# → playwright headless로 1280/1600/1920 viewport 3종 capture
# → measure-art-share.mjs로 색 샘플링: stage region 안에서 cream(#fffbe9, #fff7d2, rgba(255,252,232,*)) 픽셀 % 측정
# → 실패 조건(spec.md에서 옮겨옴):
#   - stageArtBackgroundPixelRatio < 0.55  → fail (목표 ≥ 0.70 — Art Director 영역)
#   - stageReactPanelCreamRatio > 0.30     → fail
#   - dockBgVsStageBgContrastRatio < 3.0   → fail
#   - dockCardVsDockBgContrastRatio < 1.5  → fail (cluster invisible 방지)
# → JSON 리포트: reports/art-share/<sha>-<viewport>.json + diff PNG

# 2. mobile 회귀 (기존)
npm run check:visual

# 3. 전체 CI
npm run check:ci  # check:art-share 포함되도록 wire 필수
```

### 자동 fail policy (PR mergeable 조건)

- `check:art-share`는 **CI required check**로 등록. failing → PR merge 불가.
- 본 axis 머지 후 모든 후속 PR도 `check:art-share` 통과해야 함 (회귀 방지).
- **Cycle 1 실패의 직접 원인 차단:** spec checklist 100% 통과 + `check:art-share` fail이면 PR 본문 결과는 "checklist 통과지만 art-share 위반"으로 명시되어 reviewer가 보고 reject할 수 있음. 자동 enforce + 인간 review 병행.

### Art Director critique gate (process change, 자동화로 보강)

- 본 axis 시점부터 **art-share spec promise를 가진 PR은 PR template에 "Art Director critique pass: [yes/no/n/a]" 체크박스 추가**.
- `check:art-share` 통과 + Art Director critique pass = mergeable.
- `check:art-share` 통과지만 critique fail = follow-up issue 자동 발행 후에만 merge (또는 reject).
- `check:art-share` fail = merge block (자동).
- **Director(main thread)가 자기 spec을 자기 critique 못 하는 Cycle 1 회고 학습** → critique는 별도 spawn agent 또는 사용자 review로 강제. 본 axis가 그 enforcement의 첫 케이스.

### spike 검증 (PR 진입 전)

- spike-1 (1h): `Phaser.Scale.RESIZE` + dock transition 420ms 동안 fire 빈도 측정. Throttle 필요 여부 결정.
- spike-2 (1–2h, A 진입 시만): Phaser BitmapText 한글 비용. CanvasText fallback profile.
- spike-3 (1h): art-share 측정 ROI 좌표 결정. desktop-shell width = `min(1180px, calc(100vw - 48px))`이라 viewport 1920에서도 실제 shell 폭은 1180px로 capped(styles.css:91) — measurement는 viewport 픽셀이 아니라 shell 픽셀로 계산해야 함.

---

## Disagreements I Anticipate

### Designer와의 예상 충돌

- **D-1 (mid):** Designer가 "patches, plot 사이 텃밭 길, 화분 배치" 같은 정원 verb-rich content를 brief에 추가하자고 주장 가능. Engineer 입장: 본 axis는 시각 표현 재설계이지 신규 콘텐츠 axis 아님 — scope creep. 단 **무단 깎지 않음**, Designer가 비-패러다임 콘텐츠를 추가하면 trade-off 형태로 비용 제시.
- **D-2 (high):** Designer가 stage 안 정보(currency/next-action)를 모두 dock으로 옮겨야 한다고 주장하면 Cycle 1과 같은 결과(dock cream 카드만 늘어남) 반복. Engineer는 "dock 카드 contrast 자동 측정" 강제로 회피, 단 hierarchy 결정은 Art Director 영역.

### Art Director와의 예상 충돌

- **A-1 (high, 본 axis 가장 큰 disagreement 후보):** Art Director가 Canvas-first(A)를 권하면 Engineer는 +12–24KB bundle delta + Phaser 한글 글리프 비용 + GardenScene 경계 재협상 + spike 2시간 cost를 명시. **무단 reject 안 함** — Art가 "art bible align이 가장 강한 안"이라고 주장하면 cost 재협상 필요.
- **A-2 (mid):** 신규 frame asset 1–4장 PNG 9-slice — Engineer는 sprite 압축/해상도 budget 제시, Art는 일러스트 표현력 우선. asset alpha quality(`check:asset-alpha`) + asset style consistency(`check:asset-style`) 게이트 통과 필수.
- **A-3 (mid):** dock contrast ratio 임계값 — Art는 "warm pastel 톤 보존"이라 contrast 3:1 어려울 수 있다고 양보 요구 가능. Engineer는 brief evidence(현재 ≈ 같은 색 → invisible)를 들어 ≥ 3:1 강제.

### Senior Critic과의 예상 충돌

- **C-1:** Critic이 "패러다임 비교를 prototype 없이 cost로만 평가하지 말라"고 push 가능. Engineer 동의 — 본 proposal은 cost 평행 제시일 뿐, prototype은 패러다임 lock 후 spike PR로.
- **C-2 (likely):** Critic이 "art-share 측정의 임계값(0.55/0.30/3.0) 자체가 spec.md에서 결정되어야지 Engineer가 정하면 안 된다"고 호명. Engineer 동의 — 임계값은 spec.md "Acceptance Criteria"가 옮겨와야 하고, 본 proposal은 측정 인프라만 책임.
- **C-3:** Critic이 "Cycle 1 retrospective의 학습이 implementation gate 메모리 1개로 충분한지" 질문 가능. Engineer는 자동 CI gate + 인간 review 병행이 minimal sufficient라 주장.

---

## Open Questions (≤ 5, priority order)

1. **(highest, axis lock-in 결정 전)** brief Non-negotiable §4 "GardenScene 내부 mechanic invariant" 경계가 in-canvas chrome layer(currency/HUD를 sprite로) 추가까지 막는가? 본 질문에 "막는다"이면 Canvas-first(A)는 패러다임 후보에서 사실상 제외. spec.md § Decisions에서 명시 결정 필요.
2. **(high, 패러다임 lock 후)** 현재 `desktop-shell` width = `min(1180px, calc(100vw - 48px))` cap (styles.css:91)이 art-share 측정의 baseline인가? viewport 1920에서도 실제 shell은 1180px로 capped → "viewport 면적 기준 art ≥ 70%"가 viewport 기준인지 shell 기준인지 spec.md 명시. 측정 ROI 정의에 직접 영향.
3. **(mid)** dock contrast 임계값 정확치(≥ 3:1 또는 ≥ 4.5:1, WCAG AA)는 spec.md acceptance criteria에서 옮겨오는지, 본 PR 본문에서 결정하는지? 측정 자동화 임계값을 어디서 source-of-truth하는가.
4. **(mid)** Art Director critique gate 자동화에서 "critique pass" 신호를 어디서 받는가? PR template 체크박스 + reviewer 인간? 별도 spawn agent? GitHub label? 본 axis에서 결정 안 하면 enforcement가 honor system으로 떨어지고 Cycle 1 패턴 반복.
5. **(low, schedule)** PR-INFRA-1을 머지하는 순간 main의 현 desktop 화면이 `check:art-share` fail로 빨간불이 됨. 이를 fixing PR이 들어올 때까지 임시 skip하는가, 아니면 PR-INFRA-1 + 패러다임 첫 PR을 묶어 한 번에 머지하는가? 후자면 PR 분할 contract 위반 위험.

---

## Persona contract self-check (간결 — Cycle 1 회고에서 filler라 지적)

본 proposal은 (1) Files Touched, (2) PR 분해, (3) Save migration, (4) Perf budget, (5) Verification, (6) Disagreements, (7) Open Q ≤ 5 — 7섹션 모두 충족. cost-only 결론 박지 않음. 패러다임 권장 명시 거부. design intent 무단 깎음 0건. ★ Art Director critique gate 자동화 verification에 명시.
