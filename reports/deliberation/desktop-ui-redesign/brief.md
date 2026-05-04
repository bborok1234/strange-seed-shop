# Brief — Desktop UI Layout 큰 골격 재설계

- Axis slug: `desktop-ui-redesign`
- Owner: studio main session (Director: main thread)
- Date: 2026-05-04
- Workflow: `docs/studio/DELIBERATION_WORKFLOW.md`

## Axis

**이상한 씨앗상회 데스크톱 viewport(≥ 1280px)의 layout 큰 골격을 재설계한다.** 현재 모바일 single-column layout이 데스크톱에서 그대로 stretch되어 화면 70%가 빈 cream 매트로 낭비되고 있다. 이 axis는 새 grid·region 분할·responsive breakpoint를 정의한다. 모바일 layout은 기본적으로 유지(touchpoint·verb 흐름은 모바일 first 가치 보존).

## Current State

### 관측 (2026-05-04 사용자 스크린샷, 1920×1180 viewport)

- 정원 패널이 viewport 폭의 ~95%를 점유하지만 plot은 좌상단에 1개 작게 배치, 나머지 ~80% 영역은 빈 베이지 cream 매트.
- 자원 HUD 3개(잎/꽃가루/재료)가 우상단 빈 흰색 알약(pill)으로 떠 있고 모두 `0` 상태에서 visual weight 부족.
- 좌상단 헤더 `이상한 씨앗상회` + `햇살 온실 정원` + `첫 씨앗을 고르세요` 칩이 유일한 visible content cluster.
- 하단 25% 영역에 "다음 행동 / 첫 씨앗을 고르세요 / 말랑잎 씨앗 30s" 카드가 잘린 상태로 placement.
- bottom-tabs 5개(`정원·씨앗·도감·원정·상점`)가 viewport 폭에 균등 stretch되어 각 탭 폭 ~380px, 시각적 hierarchy 없음.
- 배경 일러스트(햇살 온실, hand-painted seed jar)가 cream 패널 뒤에 깔려서 양쪽 가장자리에만 보이고 main panel이 완전히 가림.
- viewport breakpoint별 layout 분기가 사실상 없음.

### 코드 사실

- `src/styles.css` 7677줄 / `@media` 쿼리 8개. desktop breakpoint 거의 없음.
- `display: grid` 사용 위치 ~30곳, 대부분 `minmax(0, 1fr) auto` 단일/2 col. 진정한 desktop multi-pane composition 0개.
- `src/App.tsx` 5671줄에 5개 탭 panel(`activeTab === "garden"|"seeds"|"album"|"expedition"|"shop"`) 모두 같은 단일 column container 안에서 conditional render.
- 탭 전환 시 Garden은 Phaser scene(`src/game/playfield/GardenScene.ts`), 나머지는 React panel.
- `getLocalQaTab()` QA hook 외에는 viewport 분기 로직 없음.

### Operator 관점

- 22개 studio-operate 패스 동안 layout/composition은 한 번도 axis로 잡히지 않음. 모든 PR이 receipt·indicator·motion 등 micro-polish.
- 사용자가 명시적으로 "기획팀과 아트팀의 수준이 너무 낮다"라며 process 자체를 challenge.

## Why This Axis Now

- 게임의 첫 시각 인상이 데스크톱에서 production game quality에 한참 못 미침. 후속 모든 polish PR(receipt·motion 등)이 이 layout 위에 쌓이고 있어서 layout 결정을 미룰수록 polish PR 회귀 비용이 누적됨.
- 사용자가 process critique을 동시에 한 시점이라 deliberation workflow의 첫 dogfooding 케이스로 가장 적합 — micro-polish loop와 가장 멀리 떨어진 axis.
- production game quality bar로 전진하려면 visual hierarchy가 잡힌 상태에서만 추가 contents (3rd merchant arc, lunar care reveal 등)이 의미가 생김.

## Constraints

### Non-negotiable

1. **모바일 layout 유지** (≤ 480px). 현재 player가 가장 많이 쓸 viewport. touchpoint·verb·tab navigation 모두 보존.
2. **save 호환성**. `PlayerSave` 타입 / `persistence.ts` migration 필요한 변경 금지. 기존 사용자 데이터 깨면 안 됨.
3. **Phaser scene boundary 보존**. `GardenScene` 내부 mechanic(plot tap, tween, FX, sprites) 변경 금지. layout은 scene을 감싸는 container 변경만 가능.
4. **5개 탭 컨셉 유지**. 정원·씨앗·도감·원정·상점 5개 surface 자체는 그대로. desktop에서는 navigation 형태가 달라질 수 있음(tab → side nav 등).
5. **art bible align**. 따뜻한 햇살 온실 / soft pastel / hand-painted seed jar 톤 유지. hard color·neon·dark mode 도입 금지.
6. **`npm run check:ci` 통과**. CI 항목 어느 것도 깨지면 안 됨.

### Soft (negotiable, but justify if violated)

- React + TypeScript + Vite 스택 유지. 새 layout library(예: react-grid-layout) 도입은 비용 trade-off 명시 필요.
- bundle size +50KB gzipped 이내.
- 한 PR 변경 ≤ 500줄, ≤ 5 파일 권장.

## Out of Scope

이 axis는 **layout 큰 골격만** 결정한다. 다음은 명시적으로 다음 axis로 분리:

- 신규 콘텐츠(3rd merchant arc, expedition cinematic, mission UX 재설계).
- 신규 mechanic·verb·economy 변경.
- 신규 일러스트·sprite·sound asset.
- copy/text 재작성 (layout이 정해진 후 별도 axis).
- A/B test infra·analytics tagging.
- 다국어 지원.
- accessibility 깊이(스크린리더·키보드 nav 풀 audit) — layout이 정해진 후 별도 axis. 단 layout 결정 자체에서 명백한 a11y 위반(예: focus trap 깨짐)은 회피해야 함.

## Reference Artifacts

### Memory

- `~/.claude/projects/-Users-mirlim-Documents-strange-seed-shop/memory/feedback_layout_over_polish.md`
- `~/.claude/projects/-Users-mirlim-Documents-strange-seed-shop/memory/feedback_studio_team_critique.md`
- `~/.claude/projects/-Users-mirlim-Documents-strange-seed-shop/memory/feedback_harness_neutral_source_of_truth.md`
- `~/.claude/projects/-Users-mirlim-Documents-strange-seed-shop/memory/project_studio_loop_polish_bias.md`

### Workflow / Persona

- `docs/studio/DELIBERATION_WORKFLOW.md`
- `docs/studio/personas/{director,designer,art-director,engineer,senior-critic}.md`
- `docs/studio/templates/spec.md`

### Code (specialists 참조)

- `src/App.tsx` (5671줄, 5탭 라우팅 + 모든 panel)
- `src/styles.css` (7677줄, @media 8개)
- `src/game/playfield/GardenScene.ts` (Phaser scene, 변경 금지 영역)
- `src/types/game.ts` (PlayerSave 타입, 변경 금지 영역)
- `src/data/{seeds,creatures,expeditions,missions,rewards,shop_surfaces,growth_curves}.json` (게임 콘텐츠)
- `package.json` scripts (`check:ci` 항목)

### 관련 plan / issue

- `docs/studio/plans/0001-deliberation-workflow-bootstrap.md` (이 deliberation의 상위 plan)
- 최근 22개 PR(#365 ~ #387) — 모두 micro-polish, layout 미터치

### 사전 옵션 sketch (Director가 던진 시작점, specialist는 자유롭게 거부 가능)

- **A. 2-pane dashboard** — 좌 ⅔ Garden(Phaser canvas 확대) / 우 ⅓ side dock(자원·next action·active expedition·진행 카드).
- **B. 3-column tycoon dashboard** — 좌(도감/원정 요약) / 중(Garden) / 우(Production/Order chain). desktop은 탭 없이 단일 화면.
- **C. 캔버스 in-game UI** — Phaser scene이 거의 풀 화면, 자원·next action도 in-canvas overlay. React panel 최소화.

이 3안은 **starting point일 뿐** specialist proposal에서 채택·변형·전부 거부 가능. 새 안 D를 제안해도 됨.

## Success after this axis

이 axis가 ship되고 사용자가 데스크톱에서 게임을 처음 켰을 때:
- viewport 70%가 빈 cream 매트인 상태가 사라짐.
- 자원 HUD가 visual weight 있는 cluster로 자리잡고 art를 안 가림.
- 정원 영역이 desktop 폭의 ≥ 60% 이상 점유하면서 mechanic 중심 시각 인상.
- 후속 polish PR이 쌓일 수 있는 정돈된 region grid 존재.
- 모바일에서 게임을 켰을 때는 변화 없음 (또는 알아채지 못할 만큼 작음).
