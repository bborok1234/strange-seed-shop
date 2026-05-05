# Brief — Stage Art-First 재구조화 (정원 = 무대 약속 회복)

- Axis slug: `stage-art-first-restructure`
- Owner: studio main session 2026-05-05 (Director: main thread)
- Workflow: `docs/studio/DELIBERATION_WORKFLOW.md`
- Pilot status: Phase (a) 세 번째 dogfood. 첫 두 axis(`desktop-ui-redesign`, `mission-ux-visibility`)에서 spec → implementation 갭 학습 적용.

## Axis

**`desktop-ui-redesign` Cycle 1이 spec § Decisions §1의 약속(stage = art-only zone, art ≥ 70% 면적)을 implementation 단계에서 위반했다.** 본 axis는 그 약속을 회복하고, "정원 게임"이라는 정체성을 시각으로 표현한다 — UI/패널을 art 위에 쌓는 패러다임에서 art가 무대고 React 패널이 art를 호흡하는 floating overlay 패러다임으로 전환.

## Current State (실패 evidence)

### 사용자 직접 critique (2026-05-05)

> "정원이라는 의미가 퇴색. 정원이라면 정원 배경에 이미 밭 이미지 같은게 오버라이드 되면서 그 위로 꾸미는 요소같은게 있어야함. 지금은 너무 ui나 패널, 인터페이스로 모든걸 뭉개려고 함. 아트팀의 역할이 너무 없음."

### 측정 가능한 위반 (1920×1180 viewport)

| Spec § Decisions §1 약속 | 측정값 | 결과 |
|---|---|---|
| stage region art ≥ 70% 면적 | art 노출 ~25% (top-bar 영역만), 나머지 ~75%는 React 패널 cream 또는 빈 cream void | ❌ 50% 미달 |
| stage region React panel overlay 금지 (eyebrow/chip만 ≤ spacing.3xl 허용) | `.garden-panel` (절대 좌표 top:122 bottom:78 left/right:--space-4)이 stage 면적의 ~85% 차지 | ❌ 위반 |
| `.starter-panel` 콘텐츠 art와 호흡 | `max-height: 230px + overflow-y: auto` cream 띠로 stage 하단 점유, 내부 스크롤 강제 | ❌ 위반 |
| dock cluster 시각 hierarchy | dock 배경 `#fffbe9` ≈ card 배경 `rgba(255,252,232,0.92)` ≈ stage cream — **셋 다 거의 같은 색**으로 invisible separation | ❌ visual 위반 |
| plot grid가 stage 폭 채움 | 1 plot 카드가 stage 좌상단에 ~50% 폭으로 박힘, 잔여 50%+ empty | ❌ Phaser scene anchor mobile portrait 가정 |

### 코드 사실

- `.garden-panel` (`styles.css:190`): `position: absolute; top: 122px; bottom: 78px; left/right: var(--space-4); display: grid; grid-template-rows: minmax(360px, 1fr) auto;` — stage 안에서 거의 전체 차지하는 cream 패널
- `.starter-panel` (`styles.css:813`): `max-height: 230px; padding: --space-3; overflow-y: auto; backdrop-filter: blur(8px);` — 하단 cream 띠
- `.side-dock` 배경 `--color-surface-dock: #fffbe9` — `--surface-panel: rgba(255, 252, 232, 0.92)` 카드와 거의 동일
- GardenScene 내부 plot grid는 mobile portrait 비율 가정 — viewport 폭 따라 적응 안 함 (spec § Risks #1, follow-up axis 명시했지만 Cycle 1에서 진입 안 함)
- Stage background asset(`background_greenhouse_day_001`)은 inline `style={{ backgroundImage }}` + `background-position: center; background-size: cover` — 패널이 가리지 않는 영역에서만 노출

### Cycle 1 (5 PR) 의도와 결과 갭

| Spec § Decisions | Cycle 1 PR 산출 | 사용자 가치 |
|---|---|---|
| §1 stage = Garden 전용 zone | 3-region grid 도입 ✓ | 골격은 맞지만 art는 패널 뒤에 매장됨 |
| §2 rail 4탭 (Garden 제외) | RailNav 시각 도입 ✓ | "한쪽으로 옮긴 의미가 없음" (사용자 직접 인용) |
| §3 dock 가변 확장 | data-dock-expanded transition ✓ | 가변 작동하지만 dock 자체가 사용자 시야에 안 들어옴 |
| §4 dock 4 cluster spike hierarchy | 카드 4종 마운트 ✓ | 색이 stage와 동일해 visual invisible |
| §5 신규 토큰만, rename은 별도 axis | 토큰 23종 도입 ✓ | 토큰 사용처 contrast 약해 hierarchy 미작동 |

→ **체크리스트 100% 충족, 사용자 가치 ~10% 도달.** spec promises가 implementation에서 quietly 위반.

## Why This Axis Now

- Cycle 1 5 PR이 main에 들어갔지만 사용자가 직접 "이전과 똑같이 빈 cream void / panels everywhere" 평가. **Cycle 1은 사실상 실패**.
- 다음 axis(`mission-ux-visibility` implementation) 진입 전에 stage art 정체성을 회복하지 않으면 또 다른 cream 패널 layer만 추가됨.
- 사용자 신뢰 회복 — Cycle 1 셀러브레이션이 hollow였음을 인정하고 진짜 가치를 ship.

## Constraints

### Non-negotiable

1. **Cycle 1의 grid 골격은 유지** (rail/stage/dock 3-region). 그 안의 콘텐츠 패러다임만 재설계.
2. **모바일 viewport(≤480px) snapshot 회귀 0**. 모바일은 이번 axis 영향 받지 않음.
3. **PlayerSave / persistence.ts / 게임 mechanic 변경 0**. 시각 표현만 재설계.
4. **GardenScene 내부 mechanic invariant**. 단 host React layer / plot grid layout / canvas resize 정책은 본 axis 범위 안.
5. **art bible align 강화** (warm pastel, hand-painted 톤 유지 + 원경/중경/근경 호흡).
6. **`npm run check:ci` 통과** + **사용자가 시각 검증한 후에만 PR 머지**.

### Hard verification gates (이전 axis와 다른 점)

- 각 PR 완료 시 **playwright screenshot 측정** + Art Director critique pass spawn 필수.
- spec § Acceptance Criteria에 **수치 measurement** 포함: "stage 영역에서 React panel cream 픽셀 점유율 ≤ 30%", "dock cluster 카드 배경과 stage 배경 contrast ratio ≥ 3:1" 등.
- 단순 "build green / snapshot 동일"로는 acceptance 불가.

### Soft

- 한 PR 변경 ≤ 500줄, ≤ 5 파일 (이전과 동일).
- bundle size +10KB gzipped 이내.
- 새 일러스트 자산 추가는 본 axis에서 가능 (이전 axis는 금지였음 — 본 axis는 art가 핵심이므로 sprite/frame 신규 OK).

## Out of Scope

- 5탭 골격 변경 (Cycle 1 spec § Decisions §7 결정 유지).
- 게임 mechanic·verb·economy 변경 (Designer 영역).
- Token rename (`--space-*` → `spacing.*`) — 별도 axis로 미룬 약속 유지.
- 다국어·접근성 깊이.
- Phaser scene 내부 mechanic 재설계 (host/canvas-resize 정책만 본 axis 범위).

## Reference Artifacts

### Memory (특히 신규 추가된 implementation gate 메모리 참조)

- `feedback_implementation_critique_gate.md` — **이 axis는 이 메모리의 첫 enforcement 케이스**
- `feedback_layout_over_polish.md`
- `feedback_studio_team_critique.md`
- `feedback_harness_neutral_source_of_truth.md`
- `project_studio_loop_polish_bias.md`

### 이전 axis 산출물

- `reports/deliberation/desktop-ui-redesign/spec.md` — § Decisions §1·§4가 본 axis의 회복 대상
- `reports/deliberation/desktop-ui-redesign/retrospective.md` — implementation 갭 인정 회고
- `docs/studio/plans/0001-deliberation-workflow-bootstrap.md` — overall plan

### 사용자 critique

- 2026-05-04 첫 스크린샷 (오후 11:05): "데스크톱 ui/ux가 너무 구려"
- 2026-05-05 추가 스크린샷 (오후 2:35, 2:42): "정원 의미 퇴색, UI/패널로 다 뭉갬, 아트팀 역할 없음"
- 두 critique 합치면: layout 변경했지만 art 살아나지 않음, 모든 게 cream rectangle

### 코드

- `src/App.tsx:2270-2851` — garden-panel JSX
- `src/styles.css:190` — `.garden-panel` 절대 좌표 (재배치 대상)
- `src/styles.css:805-823` — `.starter-panel`, `.garden-action-surface` (하단 cream 띠 대상)
- `src/styles.css:7728+` — desktop @media block (Cycle 1 산출물, 본 axis는 이 블록 안에서 패러다임 변경)
- `src/game/playfield/GardenScene.ts` (변경 금지 영역, 단 host integration은 가능)
- `src/game/playfield/GardenPlayfieldHost.tsx` — Phaser canvas 호스팅 (조정 가능)

### 기존 asset 일러스트

- `assets/source/asset_style_bible.json` (cute-strange greenhouse, soft rounded silhouettes, warm whimsical mood)
- `background_greenhouse_day_001` 등 background 카테고리
- `creature_*`, `seed_icon_*`, `sprite_strip_*` — Phaser scene이 이미 사용
- `ui_frame_*`, `fx_strip_*` — overlay 적용 가능

## Sketch (sketch lock-in 위험 인지하고 의도적으로 약하게 — specialist 자유 분석 우선)

- 패러다임 후보들 (specialist 자유 거부/변형):
  - **Canvas-first**: garden-panel·starter-panel을 Phaser scene 안 sprite로 흡수. React UI는 dock + harvest reveal modal만.
  - **Frame-overlay**: 기존 React 패널 유지하되 art-respecting 형태로 (semi-transparent + 일러스트 frame border, art가 비치는 mask)
  - **Hybrid**: stage 콘텐츠 일부는 in-canvas (plot/creature/grass), nav/HUD는 React floating overlay (alpha-aware)

specialist는 자유 신규 안 D/E 제안 가능.

## Success after this axis

사용자가 데스크톱 1920×1180 viewport에서 게임을 다시 켰을 때:
- 정원 art가 stage 면적의 70%+ 차지 (React 패널은 floating overlay, art가 비침)
- 1 plot이 art 무대의 자연스러운 sprite로 보임 (cream rectangle 안에 박힌 미니어처가 아님)
- 우측 dock cluster가 stage와 명확히 분리된 별도 region으로 인지 (contrast ratio ≥ 3:1)
- 하단 starter-panel 또는 next-action 정보가 art를 가리지 않는 형태로 노출
- 사용자 인상: "정원에 들어왔다" — 패널 dashboard에 들어왔다 ❌
- Art Director critique pass: 모든 spec promise 측정 통과 (수치 evidence 포함)
