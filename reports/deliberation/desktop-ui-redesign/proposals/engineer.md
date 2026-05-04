# 제안 — Engineer (개발자)

- Axis: `desktop-ui-redesign`
- Persona: Engineer
- Date: 2026-05-04
- 입력: `brief.md`, `docs/studio/personas/engineer.md`, `src/App.tsx` (5671줄), `src/styles.css` (7677줄), `src/types/game.ts`, `src/lib/persistence.ts`, `src/game/playfield/{GardenScene.ts,GardenPlayfieldHost.tsx}`, `vite.config.ts`, `package.json`.

## 결론 한 줄

- A (2-pane dock) = **구현 가능 / 가장 싸다**.
- B (3-column tycoon) = **구현 가능 / 비쌈, save 영향 없음 단 panel 5개 동시 mount → React render 비용 +X**.
- C (in-canvas overlay) = **이 axis에서는 권장 불가**. GardenScene boundary invariant 위반 위험·art bible align 깨짐·HUD 회귀 surface 폭발.
- 새 안 D (Shell-only refactor) = **A의 부분집합으로 분리 가능한 PR0 prerequisite**. A/B 어느 쪽으로 가도 PR1으로 들어가야 함.

---

## 0. 현재 코드 사실 (proposal 근거)

- `src/App.tsx:2163` 기준, 최상위 mount는 `<main className="app-shell playable-focus">` 하나. 그 안에 단 하나의 `<section className="garden-stage">`가 viewport 거의 전체를 차지하고, 5개 탭은 모두 같은 `garden-stage` 내부 `dev-panel`(우측 floating absolute panel)에 conditional render.
  - `activeTab === "seeds"` → `App.tsx:2906`
  - `activeTab === "album"` → `App.tsx:3007`
  - `activeTab === "expedition"` → `App.tsx:3234`
  - `activeTab === "shop"` → `App.tsx:3421`
  - garden은 `garden-panel` (`App.tsx:2790`+).
- 모바일 layout은 `@media (max-width: 900px)` 한 블록에 다 들어 있음 (`styles.css:5433` ~). 즉 “데스크톱 = default style, 모바일 = override”의 mobile-second 구조다. 이 점이 desktop 재설계에 유리하다 — 모바일 블록만 보존하면 invariant 자동 충족.
- bottom-tabs(`styles.css:3825`)는 `position: absolute; grid-template-columns: repeat(5, 1fr)` — desktop에서도 5분할 stretch. 이게 “각 탭 폭 ~380px” 관측의 원인.
- `dev-panel` (`styles.css:3897`)이 `width: min(42%, 500px)`로 우상단 absolute. desktop에서 “화면 70%가 비어 보인다” = garden-panel(좌측 영역)이 `top:122px / bottom:78px / left:var(--space-4) / right:var(--space-4)` 전 폭을 잡지만 그 안의 `playfield-board-overlay`가 plot 1개일 때 좌상단에만 작게 배치되기 때문. **이 axis는 dev-panel/garden-panel/bottom-tabs 3개 region의 desktop breakpoint를 새로 그리는 일이다.**
- Phaser scene은 `scale.mode = Phaser.Scale.RESIZE` (`GardenPlayfieldHost.tsx:115-118`)이고 `GardenScene.create()`에서 `this.scale.on("resize", () => this.renderPlayfield())` (`GardenScene.ts:61`). **컨테이너 크기 변경 → 자동 재렌더 보장됨.** layout이 Phaser canvas 폭/높이를 바꿔도 scene 내부는 무수정.
- `PlayerSave` (`types/game.ts:107`) 와 `localSaveStore` (`lib/persistence.ts`)는 layout/viewport 정보를 갖지 않음. **이 axis는 save migration ZERO여야 한다.** layout 선호도(예: “3-pane mode on/off”) 같은 user preference를 저장하고 싶다면 별도 key(`localStorage["sss:desktop-layout"]`)로 빼고 `PlayerSave`는 절대 건드리지 않음 — Designer/Art Director가 “toggle 주자”고 해도 이 boundary는 지켜야 한다.
- React hook 사용 53줄 (`grep`). top-level `App` 함수가 거대하지만 layout 조건 분기는 `showDebugPanel`/`isPlayerTabScreen`/`stageHeroCreature` 정도만 본다. desktop breakpoint가 들어가도 **media query만으로 처리 가능**한 영역이 80% 이상. JS 분기 추가는 최소화 가능.
- 베이스라인 bundle (현 main 기준 dist):
  - `index-*.css` 145.3KB raw / **24.1KB gzipped**.
  - `index-*.js` 320.8KB raw / **92.8KB gzipped**.
  - `phaser-runtime` 별도 chunk. desktop layout 변경은 Phaser chunk 무영향.

## 1. 옵션별 Files Touched

### Option A — 2-pane dashboard (좌 ⅔ Garden / 우 ⅓ side dock)

| File | 변경 성격 | 추정 줄 |
|------|-----------|---------|
| `src/styles.css` | 신규 `@media (min-width: 1280px)` 블록 1개 + `@media (min-width: 1600px)` 미세 조정 1개. `app-shell`/`garden-stage`/`dev-panel`/`bottom-tabs` desktop variant 정의. 기존 모바일 `@media (max-width: 900px)` 블록은 무수정. | +260 ~ +340 |
| `src/App.tsx` | `MAIN_TABS` 옆에 `desktop-side-dock` 컴포넌트 신설 (자원 HUD + next action + active expedition + 진행 카드를 fragment로 묶음). bottom-tabs render 위치 desktop에서는 nav rail 형태로 옮기는 className flag 1줄. 단, 기존 panel render 트리는 유지 — desktop에서는 `dev-panel`이 우측 dock 자리로 reposition만 함. | +60 ~ +120 |
| (선택) `src/App.tsx` 내 새로운 `useDesktopLayout()` hook | matchMedia(`min-width: 1280px`) 구독, debounce 없이 listener 1회 등록. | +30 |
| `vite.config.ts` | 무수정 |
| `src/types/game.ts` | **무수정 (invariant)** |
| `src/lib/persistence.ts` | **무수정 (invariant)** |
| `src/game/playfield/*` | **무수정 (invariant)** |
| **합계** | | **~350 ~ 490줄** |

### Option B — 3-column tycoon dashboard (좌 도감/원정 / 중 Garden / 우 production)

| File | 변경 성격 | 추정 줄 |
|------|-----------|---------|
| `src/styles.css` | 새 `@media (min-width: 1280px)` 블록에서 `app-shell`을 `display: grid; grid-template-columns: minmax(280px, 360px) minmax(0, 1fr) minmax(320px, 420px)` 같은 3-column 정의. `garden-stage`를 가운데 column으로 한정. 좌측 column에 album/expedition 요약 카드 신규 region(`.desktop-left-rail`), 우측에 production/order 요약 region(`.desktop-right-rail`) 신설. 모바일 무수정. | +520 ~ +680 |
| `src/App.tsx` | desktop 모드일 때 5개 탭 conditional render를 “모두 동시 mount, 각 region에 라우팅” 모드로 변경. 즉 album/expedition을 좌측 rail에, shop/seeds를 우측 rail tab으로 묶고, garden은 중앙. 이 분기는 단순 wrapper로 처리해도 `activeTab` state 자체의 의미가 달라져서 (“데스크톱에서는 panel focus”) hook chain이 늘어남. tab-screen-return 버튼/objective-chip 위치도 재배치. | +280 ~ +450 |
| 신규 `src/components/desktop/DesktopShell.tsx` (선택) | 세 region 컴포넌트 분리. 분리 안 하면 App.tsx 5671줄이 6300줄로 부풀어서 다음 사람이 욕한다. | +200 ~ +320 |
| `src/types/game.ts` | **무수정 (invariant)** |
| `src/lib/persistence.ts` | **무수정** (단, “마지막에 본 left/right rail tab”을 기억하려면 별도 localStorage key 필요. PlayerSave 절대 침범 X) | 0 ~ +30 |
| `src/game/playfield/*` | **무수정 (invariant)** |
| **합계** | | **~1000 ~ 1480줄** |

### Option C — 풀 캔버스 in-game UI

| File | 변경 성격 | 추정 줄 |
|------|-----------|---------|
| `src/game/playfield/GardenScene.ts` | 자원 HUD/next action을 in-canvas DOM/overlay로 그리려면 scene 내부 텍스트·아이콘 객체 추가 필요. **brief의 invariant “GardenScene 내부 mechanic 변경 금지” 위반 가능성 매우 큼.** | +400+ |
| `src/styles.css` | React panel 거의 제거, overlay 위치만 정의. | -1500 ~ -2200 (기존 panel CSS dead code화) |
| `src/App.tsx` | 모든 `tab-panel` 제거 또는 modal로 격리. | -800 ~ -1500 |
| **save** | **무수정 가능** 하지만 album/expedition surface가 사라지면 미발견 생명체 surface 회귀 → 사용자 불만. |
| **합계** | | 사실상 게임 전반 재설계. **이 axis 범위 초과.** |

C는 “layout 큰 골격”이 아니라 “렌더 패러다임 교체”다. 추천 안 함.

### 새 안 D — Shell-only refactor (PR0 prerequisite)

A/B 어느 쪽으로 가도 먼저 들어가야 하는 사전 작업.

| File | 변경 | 추정 줄 |
|------|------|---------|
| `src/App.tsx` | `<main className="app-shell ...">` 안에 `<section className="garden-stage">` 단 1개로 모든 게 들어가는 현재 구조에서, garden-stage 내부의 `dev-panel`을 garden-stage 형제 노드로 빼고 wrapper `.desktop-shell`을 도입한다. **이 step은 시각적으로 noop**(media query 없으니 데스크톱에서도 모바일과 동일하게 보임). | +40 / -25 |
| `src/styles.css` | `.dev-panel`의 `position: absolute` 좌표 의존성을 새 wrapper 기준으로 재계산. 모바일 블록 무수정. | +60 / -30 |
| **합계** | | **~100줄, 1 PR** |

D를 먼저 mergng하면 A·B의 PR1+가 안전해진다 (절대 좌표 reposition 회귀 위험 분리).

---

## 2. Estimated PR Decomposition

### Option A 채택 시 (권장 분할)

| PR | 제목 | 파일 수 | 추정 줄 | risk |
|----|------|---------|---------|------|
| PR0 | desktop-shell prerequisite refactor (옵션 D) | 2 | ~100 | low — 시각 noop, snapshot diff만 회귀 잡음 |
| PR1 | desktop breakpoint scaffolding (`@media (min-width: 1280px)` 비어 있는 블록 + matchMedia hook) | 2 (App.tsx, styles.css) | ~80 | low |
| PR2 | desktop side-dock region 시각 구현 (자원 HUD + next action card 우측 stack) | 2 | ~180 | medium — 모바일 회귀, snapshot 필요 |
| PR3 | desktop nav rail (bottom-tabs → side rail at ≥1280px), tab-screen-return 위치 조정 | 2 | ~140 | medium |
| PR4 | garden-stage 폭 확장 + Phaser canvas resize verify, 1600px 미세 조정 | 2 | ~100 | medium — Phaser scene resize는 자동이지만 plot card grid가 시각적으로 어떻게 펼쳐지는지 확인 필요 |
| PR5 | (선택) desktop polish — empty cream 영역에 art bible align overlay, 추가 motion | 1~2 | ~80 | low |
| **합계** | | | **~680줄, 5~6 PR** | |

각 PR 모두 ≤ 5 파일 / ≤ 500줄 권장 충족.

### Option B 채택 시

PR0~PR1은 A와 동일. 이후:

| PR | 제목 | 파일 수 | 추정 줄 |
|----|------|---------|---------|
| PR2 | `DesktopShell.tsx` 추출 — 좌/중/우 region wrapper만, 시각 noop | 2~3 | ~250 |
| PR3 | left rail (album/expedition 요약 카드 desktop only) | 2~3 | ~280 |
| PR4 | right rail (production/order chain desktop only) | 2~3 | ~260 |
| PR5 | center column garden-stage 재사이즈, bottom-tabs → minimal nav | 2 | ~180 |
| PR6 | activeTab state semantic 재정의 + 모바일 fallback 검증 | 2 | ~200 |
| PR7 | polish | 2 | ~120 |
| **합계** | | | **~1390줄, 7~8 PR** |

PR3·PR4 동시 작업 가능하지만 main 기준 conflict 위험 — 직렬 권장.

### Option C 채택 시

이 axis에서 **불가능**. 별도 axis(“렌더 패러다임 교체”)로 분리 후 game design 합의 선결 필요. proposal 거부.

---

## 3. Save Migration Plan

**A·B·D 모두: ZERO migration.** 이 axis가 `PlayerSave` 어떤 필드도 건드리지 않는다.

다음 두 가지가 침범 시도로 들어올 수 있다 — 모두 거부:

1. “데스크톱/모바일 모드 사용자 선호 기억” → `PlayerSave` 안에 넣지 말 것. `localStorage["sss:desktop-layout-pref"]` 별도 key.
2. “데스크톱에서는 plot 9칸 모두 보여줘” → `plotCount` 변경은 게임 메카닉. 이 axis 범위 밖 (Designer 결정 필요). layout 코드는 `plots` 배열을 그대로 받아 grid template만 다르게 배치.

`persistence.ts:72`의 `version: 2` 강제 정규화는 그대로 유지.

## 4. Performance Budget Impact

### Bundle size

베이스라인: CSS 24.1KB gzipped / JS 92.8KB gzipped (`dist/assets/` 측정).

- **Option A**: CSS +1.5 ~ +2.5KB gzipped (media query 한두 블록), JS +0.4 ~ +0.8KB gzipped (matchMedia hook + flag 분기). **총 ~+3KB. 50KB budget 99% 여유.**
- **Option B**: CSS +4 ~ +6KB gzipped (3-column variant + region 카드 신규), JS +2 ~ +3.5KB gzipped (DesktopShell 컴포넌트 + activeTab 의미 변경 분기). **총 ~+8 ~ +10KB. budget 80% 여유.**
- **Option C**: 기존 React panel CSS가 dead code인데 안 지우면 −0KB / 지우면 −20KB. 불확실성 큼.
- **신규 lib**(예: react-grid-layout, panel libs) **도입 권장 안 함**. 50KB budget 거의 다 먹음.

### React render frequency

- `App` 컴포넌트가 53곳 hook 사용 — 이미 큰 단일 컴포넌트. desktop 모드 진입은 `useSyncExternalStore` 또는 단일 `useEffect+matchMedia` listener 1개로 viewport flag 1개만 유지하면 render 1회 추가.
- **Option B의 함정**: brief가 “desktop은 탭 없이 단일 화면”이라고 적어둔 의미를 곧이 해석하면 5개 panel 동시 mount + 데이터 동시 구독. 현재 album/expedition panel은 `content.creatures`/`content.expeditions` 거대 리스트를 매번 map. desktop에서 5개가 항상 mount면 초기 render 시간 측정 spike 1시간 필요 (현재 mount cost 미측정). **이 risk는 Designer가 “정말 동시 표시가 필요한가” 답을 줘야 cost 추정 가능**.

### Phaser scene

- `scale.mode = RESIZE` + `GardenScene.ts:61`의 resize listener로 컨테이너 width/height 변화 시 자동 재렌더. **Option A·B 모두 추가 작업 불필요.**
- 단, A에서 garden-stage가 viewport ⅔를 점유하면 canvas 해상도가 현재 desktop 대비 ~2배 폭. plot sprite는 vector 같은 PNG라 시각 품질 OK이나, **frame budget 확인 1시간 spike 필요** (1920×1180 viewport에서 60fps 유지 여부).
- B에서는 garden-stage가 좁아지므로 (가운데 column ~600~720px) 오히려 현재보다 가벼움.

### Layout thrashing

- `garden-panel`이 `position: absolute`로 좌표 hardcoded. desktop wrapper 도입 시 좌표 재계산 모드 잘못 잡으면 reflow loop 발생 가능. **PR0 (D) 분리의 핵심 이유.**

## 5. Verification Commands

| 단계 | 명령 | 검증 항목 |
|------|------|-----------|
| 빠른 회귀 | `npm run build` | TypeScript 컴파일 + Vite 번들. **bundle size delta 직접 비교 가능** (`ls -la dist/assets/index-*.{css,js}`). |
| 비주얼 회귀 | `npm run check:visual` (playwright) | 모바일 스크린샷 변화 없음 검증. **A·B·D 모두 모바일 회귀 0이 hard requirement.** |
| 콘텐츠 회귀 | `npm run check:content`, `npm run check:loop`, `npm run simulate:economy` | layout 변경이 콘텐츠 의도 깨지는지 (불가능에 가깝지만 cheap). |
| P0 UX | `npm run check:p0-ui-ux` | 기존 P0 UI 검증. desktop 새 region에 P0 항목 추가 필요 여부 — 별도 spike. |
| Browser QA | `npm run check:browser-qa` | manifest 검사. 무관하지만 항상 통과해야. |
| 종합 | `npm run check:ci` | 전체 게이트. **PR 전 필수.** |

신규 검증 추가 권장:

- `playwright.config.ts`에 desktop viewport snapshot 추가 (1280×800, 1600×900, 1920×1180). **추가 안 하면 desktop 회귀를 사람이 매번 잡아야 함.** 1시간 spike.

## 6. Disagreements I Anticipate

### Designer 측

- “3-column tycoon이 production game quality에 더 가깝다” → Option B 선호. **반박 자료**: A 대비 PR 수 +2~3, JS render budget 미측정 risk, 모바일/데스크톱 코드 경로 분기로 향후 polish PR이 매번 두 갈래 변경 필요. Designer가 “정원·도감·원정·생산 4개 surface가 desktop에서 항상 동시에 보여야 한다”의 정당화를 내놓지 못하면 A로 시작해서 점진 확장 권장.
- “모바일과 데스크톱이 다르게 보이면 안 된다” → **거부**. brief 자체가 desktop 재설계 axis. mobile invariant는 “모바일 시각 변화 0”이지 “desktop도 똑같아야”가 아님.

### Art Director 측

- “cream 매트 영역에 추가 일러스트를 깔자” → out of scope (신규 일러스트 axis 분리). 단 기존 `--surface-base` 그라디언트 활용 + soft fade overlay는 OK.
- “motion duration X ms로 region transition” → motion duration 결정은 Art Director 권한이지만 desktop region 전환 motion이 Phaser scene과 동시에 돌면 frame drop 위험. 한 번에 active한 tween 수 8개 이하 유지 권고.

### Senior Critic 측

- “왜 D(shell refactor)를 먼저 빼나, 한 번에 가자” → 분리 이유: 시각 noop refactor를 PR0로 빼면 PR1+의 시각 변화가 noise 없이 추적됨. revert 비용 감소. 한 PR 500줄 권장 위반 회피.
- “Option A는 너무 보수적이다, 사용자 임팩트 낮다” → Option A의 “좌 ⅔ Garden / 우 ⅓ dock”도 현재 “전부 한 column”과 비교하면 viewport 70% 빈 cream 문제를 직접 해소. 임팩트 측정은 Designer가 KPI 정의해야.

### Director 측

- 일정 압박으로 “PR 1개로 다 하자” → 절대 거부. 7000줄 CSS + 5700줄 App.tsx에 대규모 patch 한 번 들어가면 rollback 불가.
- “save migration이 정말 0인가” 의문 → 본 proposal 범위에서는 0 보장. 단 Designer/Art Director가 “데스크톱 layout 선호도 저장” 같은 요구를 추가하면 별도 localStorage key 사용 / `PlayerSave` 침범 절대 금지.

## 7. Open Questions

1. **(Designer)** 데스크톱에서 5개 탭이 모두 “동시 표시”되어야 하는가, 아니면 garden 중심 + side dock에 active surface 1개면 충분한가? → A vs B 선택의 핵심.
2. **(Designer)** plot 9칸을 desktop에서 한 번에 보여주는 것이 바람직한가? plotCount는 PlayerSave 필드라 layout 레벨 결정이 아니지만, “데스크톱에서 garden 카드 grid를 어떻게 펼치느냐”의 시각 결정이 따라옴.
3. **(Art Director)** desktop에서 cream 매트 자리에 들어갈 시각 요소(배경 일러스트 더 보이기 / soft pattern overlay / blank 유지) 중 무엇? — 새 일러 추가는 out of scope이므로 기존 자산만으로.
4. **(Art Director)** bottom-tabs → side nav rail 전환 시 5개 탭 verb의 시각 weight를 desktop에서 어떻게 잡을지 — engineer는 grid만 깔고 나머지는 token 적용.
5. **(Designer + Art Director 공동)** dev-panel 위치 (현 우상단 absolute) — A에서는 우측 dock으로, B에서는 우측 column으로 이동. 데스크톱에서 “dev-panel” 자체가 사용자 panel 노출용인지 debug 전용인지 정리 필요. 현재 className으로 동시 사용 중이라 분리 시 회귀 위험.
6. **(Self / spike 1시간씩)**:
   - 1920×1180 viewport에서 garden-stage ⅔ 폭일 때 Phaser scene 60fps 유지 여부 측정.
   - desktop에서 5개 panel 동시 mount 시 초기 render 시간 측정 (Option B 가는 경우만).
   - playwright desktop viewport snapshot 추가 비용 측정.

## 8. Sacred Constraints — 본 proposal 준수 확인

- ✅ **모바일 layout 유지** — 모든 변경이 새 `@media (min-width: 1280px)` 블록 안. 기존 `@media (max-width: 900px)` 무수정.
- ✅ **save 호환성** — `PlayerSave` / `persistence.ts` 무수정.
- ✅ **Phaser scene boundary** — `GardenScene.ts` 무수정. resize는 기존 listener로 자동.
- ✅ **5개 탭 컨셉 유지** — A는 탭 그대로 (위치만 side rail), B는 탭이 region에 흩어지지만 5 surface 모두 보존.
- ✅ **art bible** — color/motion 결정은 Art Director에 위임. layout token/grid만 정의.
- ✅ **`npm run check:ci` 통과** — 위 verification commands 모두 적용.

---

## 최종 권고

**Option A (PR0=D 먼저, 이후 PR1~PR5)** 권장.

- 이유: 비용 ⅓ 수준, 모바일 회귀 risk 최소, save 영향 0, Phaser 영향 0, bundle size 영향 ~3KB (budget 6%), 5~6 PR로 분할 가능.
- B로 가야 하는 정당화는 Designer의 “4개 surface 동시 표시 필수” 답이 있을 때만. 그 경우 spike 2시간 (B의 React render budget 측정) 선결.
- C는 이 axis 범위 외 — 거부.
