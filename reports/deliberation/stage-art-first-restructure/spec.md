# Spec — Stage Art-First 재구조화 (정원 = 무대 약속 회복)

- Axis slug: `stage-art-first-restructure`
- Brief: `reports/deliberation/stage-art-first-restructure/brief.md`
- Director: studio main session 2026-05-05 (main thread)
- Status: draft (사용자 review gate 대기)
- Cycle: **2 of N (분할)** — Cycle A = paradigm transition + 자동 enforcement 인프라, Cycle B = L1 in-canvas diegetic UI 별도 axis
- Process change: **본 axis는 단순 spec 산출이 아님. 동시에 implementation 단계 critique gate 도입의 enforcement axis.**

## Vision

데스크톱(≥ 1280px)에서 게임을 켜면 화면 70%가 햇살 온실 art로 살아 숨쉬고, plot은 art 위에 자연스럽게 앉은 sprite로 보인다. React 패널은 더 이상 cream rectangle dashboard가 아니라 art가 비치는 alpha-aware floating frame으로 art와 호흡한다. 우측 dock cluster는 stage와 명확히 분리된 별도 region으로 인지된다 (contrast ratio ≥ 3:1, art 중첩 없음). 사용자 인상: "정원에 들어왔다" — "패널 dashboard에 들어왔다" 아님. **그리고 이 약속은 자동화된 `check:art-share` CI gate + 스폰된 Art Director critique agent + 사용자 review gate 셋이 enforcement.**

## Layout Skeleton

본 axis는 Cycle 1의 grid 골격(rail / stage / dock)을 **유지**한다. 변경은 stage region 내부 콘텐츠 패러다임만.

| Viewport | Stage 내부 패러다임 | 비고 |
|---|---|---|
| Mobile (≤ 480px) | **변경 없음** (Cycle 1 mobile invariant 유지) | 모든 변경은 desktop @media 안 |
| Tablet (481-1024px) | 변경 없음 | 동일 |
| Desktop (≥ 1280px) | **3-layer composition**: L0 art-plate (full-bleed greenhouse 배경) + L1 transparent Phaser canvas (plot/creature/sprite) + L2 alpha-aware floating overlay (eyebrow/chip/decal, ≤ 30% stage 면적) | `.garden-panel` cream-rectangle 패러다임 폐기, art가 아래 layer로 항상 visible |

## Design Tokens

본 axis는 **Cycle 1 토큰 23종을 보존하면서** 다음 신규/수정 토큰 도입.

### 신규 색 토큰 (alpha-aware decal palette)

| 토큰 | 의도 | 비고 |
|---|---|---|
| `--color-surface-decal-warm` | alpha-aware 패널 (rgba 0.62 warm cream) | art가 비치는 floating overlay 전용. 기존 `--surface-panel`은 dock 안에서만 사용 |
| `--color-surface-decal-veil` | art 톤 다운용 (rgba 0.38 sage) | 텍스트 가독성 위해 art 살짝 가릴 때만 |

### 수정 토큰 (Cycle 1 §4 dock contrast 위반 직접 해결)

| 토큰 | Cycle 1 값 | 본 axis 값 | 이유 |
|---|---|---|---|
| `--color-surface-dock` | `#fffbe9` (warm cream, stage와 거의 동일) | `#f6ebcf` (warm cream **darker**, stage와 luminance contrast ≥ 3:1) | dock region이 stage와 시각 분리되어야 한다는 § Decisions §1 약속 회복 |
| `--surface-panel` (dock card 배경) | `rgba(255, 252, 232, 0.92)` | `rgba(252, 244, 217, 0.96)` darker + opacity 강화 | dock card가 dock 배경과 명확히 elevation으로 구분 |

### 신규 motion gesture (6번째)

| 토큰 | 결합 | 의도 |
|---|---|---|
| `--motion-gesture-settle` | swift × emphasized (220ms over-shoot) | overlay 자리 앉기, decal sleep 등 art 위에서 호흡하는 motion |

### 토큰 사용 규칙 (CSS lint enforcement 대상)

- **stage region 안에서 opaque cream `background-color` 금지** — `--color-surface-decal-*` (alpha-aware) 또는 dock region 외부에서만.
- **raw hex/px 신규 사용 금지** (특히 measurement scripts에서도 토큰 참조).

## Component Composition

### Existing → New

| Component | Cycle 1 상태 | 본 axis 변경 |
|---|---|---|
| `.garden-panel` (절대 좌표 cream 패널) | stage 면적 ~85% 차지하는 cream 직사각형 | **재구조화** — 절대 좌표 폐기, 콘텐츠는 alpha-aware overlay (`--color-surface-decal-warm`) + 본 axis 안에서 in-canvas 마이그레이션 가능한 부분은 Phaser host로 이전 |
| `.starter-panel` (max-height 230px 하단 cream 띠) | art 하단 가림, 콘텐츠 강제 스크롤 | **폐기** — 콘텐츠는 (a) dock의 next-action card로 흡수 (b) art 위 single-line floating decal hint로 단순화 |
| `.side-dock` (Cycle 1 PR2 4 cluster) | 색상 위반으로 invisible | **유지하되 토큰 수정 적용** — dock background `#f6ebcf`, 카드 contrast 강화. 카드 내용은 Cycle 1 그대로 |
| `.bottom-tabs.is-desktop-rail` (Cycle 1 PR1) | 거대 button 4종 | **버튼 padding 축소 + min-height ≤ 44px** — ambient nav 정신 회복 |
| Top-bar (eyebrow + h1) | desktop에서 외로움 | **rail 상단 brand cluster로 흡수** — Cycle 1 § Decisions §2 loser's concession 마침내 implement |
| Phaser canvas (`GardenPlayfieldHost`) | opaque 배경 | **transparent 배경** — L0 art-plate가 통과해서 보이도록. Phaser scene 내부 mechanic 변경 0 (host CSS만 변경) |

### Removed / deferred

- **L1 in-canvas diegetic UI** (plot 위 % badge, "수확!" chip 등 Designer Phase 2 제안의 핵심) — **Cycle B 별도 axis 분리**. 이유: Engineer cost evidence (5h spike + Phaser scene 경계 재협상) + brief soft constraint (한 cycle ≤ 5 PR). **Designer's loser's concession는 § Decisions §7에 binding으로 명시.**
- 신규 일러스트 sprite 자산 추가 — 본 axis 범위 외 (별도 asset axis).
- Token rename (`--space-*` → `spacing.*`) — 별도 axis 약속 유지.

## Acceptance Criteria

본 axis acceptance는 **수치 measurement + 자동 enforcement gate + 사용자 review gate** 3 layer.

### Layer 1 — 수치 measurement (자동화 가능)

- [ ] Desktop ≥ 1280px viewport 캡처에서 stage region React panel cream 픽셀 ≤ **25%** (Art ≤ 20% / Engineer ≤ 30% 사이 Director 결정값).
- [ ] Desktop dock region 카드 배경 ↔ stage 배경 **luminance contrast ratio ≥ 3.0**.
- [ ] Desktop rail 버튼 height ≤ **44px** (Cycle 1 거대 button 회귀).
- [ ] Mobile ≤ 480px snapshot 회귀 0.
- [ ] `npm run check:ci` 통과 + 신규 `npm run check:art-share` 통과.
- [ ] Token usage: stage region 안 opaque cream `background-color` 0건 (CSS lint).
- [ ] Bundle delta ≤ +6KB CSS gzipped + +2KB JS gzipped.

### Layer 2 — 자동 enforcement gate (Cycle 1과의 핵심 차이)

- [ ] **`check:art-share` 신규 CI required check** — playwright capture (1280×800 / 1600×900 / 1920×1180) + 픽셀 sampling + dock contrast ratio 측정. PR reject 자동.
- [ ] **CSS stylelint custom rule** — stage region 안 opaque cream `background-color` 사용 시 lint fail.
- [ ] **신규 토큰 정의 lint** — measurement script가 raw hex literal 사용 시 lint fail (Art critique 2-2 enforcement).
- [ ] **PR0(infra) 머지가 모든 visual PR의 hard 의존성** — infra 없이는 visual PR 머지 불가 (gate 작동 보장).

### Layer 3 — 사용자 review gate (Director 자기 검증 금지)

- [ ] **Cycle 종료 전 사용자 명시 visual approval 필수**. main thread Director self-validate 금지 (Cycle 1 self-validation 실패 mechanism 명시 차단).
- [ ] 사용자 approval은 다음 evidence 필수:
  - playwright snapshot 3 viewport (1280/1600/1920) 첨부
  - Cycle 1 vs Cycle A before/after 비교
  - 이전 사용자 critique 5종 항목별 해결 여부 표 (밭 viewport 잘림 / 다음 행동 패널 비율 / 배경 art HUD에 잘림 / 정원 의미 / 패널 뭉개기)
- [ ] User approval 없이 "Cycle A 완료" 보고 금지. heartbeat에 "awaiting user approval" 상태 명시.

## Risks

| Risk | Severity | Mitigation |
|---|---|---|
| **이 spec도 또 implementation에서 quietly 위반될 수 있음** (Critic 핵심 지적) | **highest** | Layer 2 enforcement gate가 자동 차단. + Layer 3 user gate가 final guard. + 본 spec § Decisions §4가 Director self-validate 금지 명시. |
| Phaser canvas transparent + L0 art-plate composite 60fps risk | high | PR0 spike 1시간 + frame budget 측정 자동화 (`check:perf-budget` 신규). Engineer Phase 2 §4의 25-fire RESIZE 우려 직접 대응. |
| Pointer event hit-testing between transparent canvas + alpha decals | medium | spec § Decisions §6 명시. 모든 floating decal은 `pointer-events: none` 기본값. interactive element만 `pointer-events: auto`. |
| Designer L1 deferred = player-feel core 약속 깎임 | medium | § Decisions §7 binding promise — Cycle B는 다음 axis로 즉시 spec 시작 (본 axis 머지 직후), Designer 양보가 hollow하지 않게. |
| Cycle 1과 같은 "다 ship했지만 사용자 가치 0" 재발 | high | Layer 3 user gate가 hard requirement. Director 본인이 "완료"라고 판단해도 사용자 명시 OK 없이는 Cycle close 금지. heartbeat schema 자체에 `userApproved: true/false` 필드 추가. |
| 본 axis 자체가 또 다른 spec 산출만 하고 implementation 안 따라가는 패턴 재발 | high | spec § Implementation Sequence가 PR0 enforcement infra를 첫 PR로 못박음. infra 없이 visual PR 머지 불가. |

## Implementation Sequence

본 axis는 **Cycle A**, ~6 PR (brief soft constraint 5 → 6으로 확장 명시 — § Decisions §9). PR 순서 강제.

### Cycle A — paradigm transition + enforcement infra

1. **PR0 — Enforcement infrastructure (선결 의존성)**
   - `npm run check:art-share` 스크립트 신설 (playwright capture + 픽셀 sampling + contrast ratio).
   - GitHub Actions에 `check:art-share` 추가 + required check 등록.
   - CSS stylelint custom rule 신설 (stage region 안 opaque cream 금지 + raw hex literal 금지).
   - 추정 ~250-380줄, 3-4 파일.
   - **이 PR이 머지되어야 후속 visual PR 머지 가능.**

2. **PR1 — 토큰 수정 + dock contrast 회복**
   - `--color-surface-dock` `#fffbe9` → `#f6ebcf` (luminance contrast 회복).
   - `--surface-panel` 카드 배경 darker + opacity 강화.
   - 신규 `--color-surface-decal-warm` / `--color-surface-decal-veil` / `--motion-gesture-settle` 정의.
   - 추정 ~80-120줄, 1 파일.
   - 검증: `check:art-share`에서 dock contrast ≥ 3.0 통과.

3. **PR2 — `.garden-panel` cream-rectangle 폐기 + alpha-aware overlay 전환**
   - `.garden-panel` 절대 좌표 패러다임 폐기, `--color-surface-decal-warm` 적용.
   - stage 안 cream 픽셀 점유율 측정값 ≤ 25%로 감소.
   - `.starter-panel` 폐기, 콘텐츠 dock의 next-action card로 흡수 (또는 art 위 single-line floating decal hint로 단순화 — Designer + Art Director PR 단계 결정).
   - 추정 ~250-380줄, 2-3 파일.
   - 검증: `check:art-share` Layer 1 자동 측정 통과.

4. **PR3 — Phaser canvas transparent + art-plate composite**
   - `GardenPlayfieldHost` CSS: canvas 배경 transparent로 변경.
   - L0 art-plate (CSS background, full-bleed greenhouse art).
   - Phaser scene 내부 mechanic 변경 0 (host integration만).
   - 추정 ~80-150줄, 2-3 파일.
   - 검증: 60fps spike 통과 + visual snapshot 3 viewport 통과.

5. **PR4 — rail button 축소 + brand cluster 흡수 (Cycle 1 §2 loser's concession 회복)**
   - rail button min-height 56 → 44px, padding 축소.
   - rail 상단 brand cluster (logo + eyebrow "햇살 온실 정원" + h1 "이상한 씨앗상회") 흡수.
   - top-bar 폐기 또는 minimal로 축소.
   - 추정 ~150-220줄, 2 파일.
   - 검증: rail height ≤ 44 자동 측정 통과.

6. **PR5 — Cycle A close + 사용자 review evidence 패키징**
   - playwright capture 3 viewport (1280/1600/1920) 자동 생성 + `reports/visual/cycle-A-evidence-<date>/` 저장.
   - Cycle 1 vs Cycle A before/after 비교 markdown 생성.
   - 사용자 critique 5종 항목별 해결 여부 표 작성.
   - heartbeat에 `userApproved: false` 명시, 사용자 approval 대기.
   - **Director는 이 PR 머지 후 Cycle 종료 보고 금지.** 사용자 명시 OK 후에만 Cycle close.

### Cycle B (별도 axis, 본 axis 머지 직후 즉시 spec 시작)

- L1 in-canvas diegetic UI (plot 위 % badge / "수확!" chip / creature stage 통합).
- Designer's loser concession이 hollow하지 않게 § Decisions §7에 binding promise 명시.

### 후속 axis (별도 spec.md, 본 axis 종료 후)

- 기존 7개 follow-up axis 목록 유지 (`garden-scene-anchor-adjustment` 등).
- 신규: `mission-ux-visibility` Cycle 1 implementation도 본 axis 종료 후 진입.

## Decisions Resolved

본 섹션은 deliberation의 substantive disagreement를 명시 결론·이유와 함께 기록. **Critic must-resolve question 모두 답함.**

### §1. Paradigm — **Hybrid (Art Director's Art-Plate D + Designer's verb-on-art 정신, L1 diegetic은 Cycle B 분할)**

- **Disagreement:** Designer는 5-layer composition (L0 stage canvas / L1 in-canvas diegetic UI / L2 edge ambient / L3 sibling dock / L4 momentary reward), L1 diegetic ship 필수; Art Director는 Art-Plate Hybrid D (3-layer: greenhouse 배경판 / transparent Phaser canvas / alpha-aware floating decals); Engineer는 Designer L1 + Art D 결합 시 ~6-7 PR + 1500줄 + 5h spike, brief soft constraint 정면 위반 ship 불가.
- **Resolution:** **Cycle A = Art Director Hybrid D 채택** (3-layer: art-plate + transparent Phaser canvas + alpha-aware overlays). **Designer L1 in-canvas diegetic UI = Cycle B 별도 axis 분할 (binding § Decisions §7).**
- **Reasoning:** Engineer cost evidence가 결정적 — 1 cycle에 둘 다 못 들어감. Cycle A는 "art-share 회복 + cream rectangle 폐기" 약속 우선 (사용자 #4-5 critique 직접 답). L1 diegetic은 player-feel 핵심이지만 Cycle B로 분리해도 player-feel 약속 유지 (Cycle B는 본 axis 머지 직후 즉시 spec 시작 binding).
- **Loser's concession (Designer):** L1 deferred는 인정. 단 § Decisions §7 binding promise — Cycle B 시작이 본 axis 머지 후 ≤ 1주 안에 spec 작성 + 즉시 진입. binding 안 지키면 deliberation 신뢰 위반.
- **Loser's concession (Engineer):** brief soft constraint "한 PR ≤ 5개" 6개로 확장 승인. PR0 enforcement infra가 추가되어서.

### §2. Threshold (stage cream 픽셀 한도) — **≤ 25%** (Art ≤ 20% / Engineer ≤ 30% 중간 Director 결정)

- **Disagreement:** Art Director는 ≤ 20% (art ≥ 80%) 약속, Engineer는 ≤ 30% 자동화 임계값 제안 — Art critique 1번이 "Engineer threshold가 quietly 후퇴 = Cycle 1 패턴 재현"이라 강하게 challenge.
- **Resolution:** **≤ 25%** (Art 약속 + Engineer 측정 가능성 절충).
- **Reasoning:** ≤ 20%는 alpha-aware overlay text 가독성 risk (decal-veil 사용 시 art 톤 다운 영역 포함하면 25% 초과 가능). ≤ 30%는 Cycle 1 갭 회귀. 25%는 art bible align 측정 통과 가능 + 사용자 인상 "art가 무대" 확보 가능 임계.
- **Loser's concession (Art):** ≤ 25% 받아들임. 단 measurement script가 token 사용 (raw hex 금지) 강제 — § Decisions §3에 enforce.
- **Loser's concession (Engineer):** measurement script 작성 시 token 참조 강제. spike 시간 +0.5h 양보.

### §3. Measurement script token vocabulary — **token 참조 강제, raw hex 금지** (Art critique 2-2 채택)

- **Disagreement:** Engineer Phase 2 verification은 measurement script가 hex literal hardcode 가능; Art critique 2-2가 "token vocabulary 정신 위반"이라 challenge.
- **Resolution:** **measurement script가 `var(--color-surface-decal-warm)` 등 token 참조 강제. CSS lint custom rule이 raw hex literal 사용 시 lint fail.**
- **Reasoning:** 측정 자체도 token vocabulary의 일부. 측정 도구가 vocabulary 위반하면 enforcement 신뢰 무너짐.

### §4. PR Reviewer (Critic Director-must-resolve question) — **자동 gate + 사용자 명시 review, main thread Director self-validate 금지**

- **Disagreement:** Critic 4번 challenge: "main thread Director가 reviewer일 경우 Cycle 1 self-validation 실패 mechanism이 어떻게 다르게 작동하는가."
- **Resolution:** **3 layer reviewer:**
  1. **자동 gate (Layer 2 acceptance criteria)** — `check:art-share` + stylelint가 hard CI required check. Director 무시 불가.
  2. **Director technical synthesis** — Director가 spec 합의 + PR 머지 책임 유지. 단 Layer 1·2 자동 gate 통과해야만 머지 가능.
  3. **사용자 (외부 reviewer)** — Cycle close 전 명시 visual approval 필수. heartbeat에 `userApproved: false` → `true` 전환 없이 "Cycle complete" 선언 금지.
- **Reasoning:** Critic challenge 정확 — Cycle 1 self-validation 패턴 차단의 유일한 mechanism은 (a) 자동화된 hard gate (b) Director 외 reviewer. 본 axis는 둘 다 도입.
- **Director self-restriction:** 본 axis 진행 중 Director(main thread)는 Cycle complete 자체적 선언 금지. PR 머지 후 사용자 review evidence 패키징(PR5)까지만 수행.

### §5. 본 axis가 또 spec.md만 산출하는 패턴 재발 risk (Critic Brief-level challenge) — **PR0 enforcement infra가 첫 PR로 강제, infra 없이 visual PR 머지 불가**

- **Disagreement:** Critic Brief-level: "본 axis가 spec.md를 또 생산하는 axis인지 implementation-only audit axis로 reframe되어야 하는지 brief 단계에서 결정 안 됨."
- **Resolution:** **본 axis는 spec + enforcement infra 동시 산출.** PR0이 infra(자동 gate + lint)를 first-class로 ship. infra 없이는 후속 visual PR이 자동 reject되어 spec 약속 quietly 위반 mechanism 차단.
- **Reasoning:** Critic 지적이 정확하지만 "implementation-only audit axis로 reframe"하면 paradigm 결정이 미뤄짐. Hybrid: spec과 infra를 같이 ship해서 spec promises가 자동 enforce되도록.

### §6. Pointer event hit-testing 정합성 (Engineer cross-cutting risk) — **모든 floating decal `pointer-events: none` 기본값, interactive만 명시 `pointer-events: auto`**

- **Disagreement:** Engineer critique cross-cutting: transparent Phaser canvas + L1 React DOM overlay + L3 alpha decal의 hit-testing 충돌, mobile 회귀 0 약속까지 위협.
- **Resolution:** **`.garden-decal` 기본 `pointer-events: none`. `.garden-decal.is-interactive` 또는 button만 `pointer-events: auto`.**
- **Reasoning:** CSS pattern으로 명시. Phaser canvas는 hit-test 받음 (default). React overlay는 보일 뿐 클릭 안 받음 (decal). 명시 interactive element만 auto.

### §7. Designer L1 in-canvas diegetic UI 약속 회복 (Designer concession) — **Cycle B binding promise**

- **Disagreement:** Designer Phase 2의 핵심 명제 (L1 in-canvas diegetic UI = "정원 = 무대" 정체성 회복의 player-feel core)가 Cycle A scope 외로 분리됨 → Designer의 loser concession이 hollow할 risk.
- **Resolution:** **Cycle B = `garden-diegetic-ui` 별도 axis. 본 axis(Cycle A) 머지 후 ≤ 1주 안에 Cycle B spec 작성 + 즉시 진입.**
- **Reasoning:** Cycle 1 retrospective 학습 — "후속 axis로 미룸"이 사실상 영구 미룸 패턴. 본 axis는 Cycle B를 binding promise로 명시. binding 위반 시 본 axis의 신뢰 자체 무너짐.
- **binding evidence:** § Implementation Sequence "Cycle B (별도 axis, 본 axis 머지 직후 즉시 spec 시작)" 명시 + items/0203... WorkUnit에도 binding 표기.

### §8. 사용자 critique 1명 voice를 mechanism으로 단정 (Critic hidden assumption) — **인정. 본 axis는 1명 voice를 evidence로 사용한다고 명시**

- **Disagreement:** Critic challenge: "alpha-aware decal / 측정 수치 추가가 사용자가 말한 '정원 의미'를 회복시킨다"는 evidence 부족, 사용자 1명 2회 voice를 mechanism으로 단정.
- **Resolution:** **인정.** 본 axis의 player-impact evidence는 명시 1명(현재 사용자) 직접 critique. 추가 player evidence 없음.
- **Reasoning:** 현재 게임은 production launch 전 single-stakeholder 단계. 사용자 = product owner = decision authority. 1명 voice가 mechanism은 아니지만 decision authority로는 충분. § Layer 3 user gate가 본 axis의 evidence loop.
- **Future:** production launch 후 telemetry 도입되면 1명 voice가 mechanism으로 단정되지 않게 evidence base 확장 (`desktop-session-telemetry` follow-up axis와 align).

### §9. Brief soft constraint (PR ≤ 5개) 본 axis에서 6개로 확장 — **승인** (Engineer cost evidence)

- **Disagreement:** Engineer cost: PR0 enforcement infra 추가로 본 axis는 6 PR 필요. brief soft constraint "한 axis 1 cycle ≤ 5 PR" 위반.
- **Resolution:** **승인** — 본 axis 한정 6 PR.
- **Reasoning:** PR0 infra가 spec promises 자동 enforce의 hard 의존성. infra 분리 안 하면 visual PR이 spec 위반해도 자동 차단 안 됨. 6 PR 확장이 brief soft constraint보다 본 axis core (enforcement) 우선.

## Open Questions

본 spec은 5개 Open Question으로 제한 (deliberation retrospective 학습).

- **Q1 (PR2 작업 시):** `.starter-panel` 콘텐츠를 dock으로 흡수할지, art 위 single-line floating decal로 단순화할지. PR2 단계 Designer + Art Director 공동 결정.
- **Q2 (PR3 작업 시 spike):** Phaser canvas transparent + L0 art-plate composite 시 mobile WebView 호환성 (Safari iOS Phaser canvas alpha rendering 정합성).
- **Q3 (Cycle B spec 단계):** L1 in-canvas diegetic UI가 GardenScene 내부 mechanic invariant와 어디서 충돌하는지 — Phaser scene 안 React 같은 chrome layer 추가 가능 여부.
- **Q4 (long-term):** 사용자 1명 voice가 evidence base인 단계에서 1명이 부재 시 reviewer chain (다른 stakeholder · spawned QA agent · 자동 visual diff)이 어떻게 작동하는지.
- **Q5 (workflow 진화):** 본 axis가 도입한 enforcement gate 패턴이 다음 모든 visible-gameplay axis에 default로 적용되는지, opt-in인지. 다음 retrospective에서 결정.

## References

- Brief: `reports/deliberation/stage-art-first-restructure/brief.md`
- Proposals: `reports/deliberation/stage-art-first-restructure/proposals/{designer,art-director,engineer}.md`
- Critiques: `reports/deliberation/stage-art-first-restructure/critique-{designer,art-director,engineer,senior-critic}.md`
- Workflow: `docs/studio/DELIBERATION_WORKFLOW.md`
- Personas: `docs/studio/personas/{director,designer,art-director,engineer,senior-critic}.md`
- Prior axis spec + retrospective: `reports/deliberation/desktop-ui-redesign/`
- Memory consulted: `feedback_implementation_critique_gate.md` (본 axis 첫 enforcement 케이스), `feedback_layout_over_polish.md`, `feedback_studio_team_critique.md`, `feedback_harness_neutral_source_of_truth.md`
- 사용자 critique evidence: 2026-05-04 첫 스크린샷, 2026-05-05 추가 스크린샷 2장
- Code: `src/App.tsx`, `src/styles.css`, `src/game/playfield/{GardenScene.ts,GardenPlayfieldHost.tsx}`

## Changelog

- 2026-05-05 — initial draft from third-axis deliberation. 4 proposals + 4 critiques (Senior Critic 포함). 9 substantive disagreements resolved (§ Decisions Resolved §1-§9). 6 PR Cycle A (PR0 enforcement infra가 first PR + hard 의존성). Cycle B (`garden-diegetic-ui`) binding promise. **본 axis는 spec + enforcement infra + user gate 3종을 동시 산출하여 Cycle 1 implementation-gap 패턴 회피.**
