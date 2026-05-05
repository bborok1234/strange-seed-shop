# Cycle A Evidence Package — `stage-art-first-restructure`

- Cycle: A (paradigm transition + enforcement infra)
- PR shipped: #394 (PR0 infra) / #395 (PR1 token) / #396 (PR2 garden-panel) / #397 (PR3 phaser transparent) / #398 (PR4 rail brand)
- Capture date: 2026-05-05
- Spec: `reports/deliberation/stage-art-first-restructure/spec.md`
- 사용자 명시 approval 대기 — Director 자체 Cycle close 금지 (spec § Decisions §4)

## art-share-gate 자동 측정 결과

| Test | Cycle 1 종료 시 | Cycle A PR4 후 |
|---|---|---|
| stage cream panel ratio ≤ 0.25 (3 viewport) | FAIL (~71%) | **PASS** (~22%) |
| dock background contrast (3 viewport) | FAIL (cream=cream) | **PASS** (#f6ebcf vs stage) |
| rail button height ≤ 44px (3 viewport) | FAIL (56px+) | **PASS** (40px) |

**9/9 PASS** — spec § Acceptance Criteria Layer 1·2 모든 자동 측정 통과 (PR #398 art-share-gate green).

## 사용자 critique 5종 항목별 해결 여부 표

| # | 사용자 critique (2026-05-05) | Cycle A 해결 여부 | 비고 |
|---|---|---|---|
| 1 | "네비게이션 메뉴를 하단에서 좌측으로 옮긴게 딱히 의미가 없음 — 중요한건 메인 정원 구성의 문제" | ⚠️ **부분 해결** | rail에 brand cluster 흡수 + 버튼 축소로 ambient nav 정신 회복. 단 rail의 가치는 stage 회복(#3·#4) 의존. |
| 2 | "상단 밭 부분이 크기가 viewport와 맞지 않음 우측을 보면 잘린게 보임" | ⚠️ **부분 해결** | garden-panel 폭 clamp(320, 32vw, 480) constraint 적용으로 viewport 안에 fit. 단 plot grid 자체가 mobile portrait 비율 hardcoded — plot 9칸 잠금 해제 시 다시 제약. **`garden-scene-anchor-adjustment` follow-up axis 필요**. |
| 3 | "하단 다음 행동 부분이 영역이 너무 작고 내부 컨텐츠는 너무 커서 패널로서의 의미를 상실" | ✅ **해결** | starter-panel desktop hide. 다음 행동 정보는 dock의 next-action card에 흡수. 내부 스크롤 제거. |
| 4 | "기껏 이쁘게 만든 배경같은것은 hud에 잘려서 보이지도 않음. 정원이라는 의미가 퇴색" | ✅ **주요 해결** | `.garden-panel` 절대 좌표 폐기 → stage 80% → 22%. top-bar desktop hide → art top portion no longer covered. Phaser canvas transparent → art가 plot grid 영역까지 비쳐 보임. |
| 5 | "지금은 너무 ui나 패널, 인터페이스로 모든걸 뭉개려고 함. 아트팀의 역할이 너무 없음" | ⚠️ **부분 해결** | art가 stage 78% 차지 (≥75% spec promise 달성). dock cluster·plot card·rail은 여전히 cream rectangle (Cycle B의 L1 in-canvas diegetic UI에서 plot/badge/chip을 art-integrated sprite로 전환 예정 — binding promise spec § Decisions §7). |

## Honest known issues (해결 안 된 것)

본 evidence는 자체 검증 단계에서 발견한 **남은 문제 3종**을 명시한다 (Cycle B 또는 별도 polish PR 대상):

1. **Plot card 자체가 cream rectangle** — Phaser canvas는 transparent지만 plot card 컴포넌트는 React DOM의 cream 둥근 사각형. art와 시각 융합 안 됨. → Cycle B L1 in-canvas diegetic UI binding promise.

2. **Dock 카드가 cream-on-cream으로 hierarchy 약함** — `--color-surface-dock #f6ebcf` (PR1) + 카드 `--surface-panel rgba(255,252,232,0.92)` 둘 다 warm cream tone. art-share-gate computed style 검사는 통과(둘이 다른 색이긴 함)하지만 사용자 시각 인지로는 분리감 약함. → 후속 polish axis에서 카드 elevation·border 강화 또는 alpha-aware decal 적용 검토.

3. **첫 세션 onboarding 진입점 약화** — starter-panel desktop hide → 첫 player가 "다음 행동: 첫 씨앗을 고르세요"의 시각 무게가 dock의 작은 chip으로만 노출. → Cycle B의 L1 in-canvas diegetic UI에서 spike state로 회복.

## Screenshots

### Garden mode (default)

| Viewport | Fresh state (no save) | Loaded state (save loaded) |
|---|---|---|
| 1280×800 | `garden-1280x800.png` | `garden-loaded-1280x800.png` |
| 1600×900 | `garden-1600x900.png` | `garden-loaded-1600x900.png` |
| 1920×1180 | `garden-1920x1180.png` | `garden-loaded-1920x1180.png` |

### Seeds tab (dock 가변 확장)

| Viewport | Fresh state | Loaded state |
|---|---|---|
| 1280×800 | `seeds-1280x800.png` | `seeds-loaded-1280x800.png` |
| 1600×900 | `seeds-1600x900.png` | `seeds-loaded-1600x900.png` |
| 1920×1180 | `seeds-1920x1180.png` | `seeds-loaded-1920x1180.png` |

### Mobile invariant verification

- `mobile-393x852.png` — Cycle A 변경이 모바일에 영향 없음을 시각 확인용 (모든 변경이 @media min-width: 1280px 안)

## Cycle 1 vs Cycle A before/after

| Surface | Cycle 1 종료 | Cycle A 종료 |
|---|---|---|
| Stage 안 cream React panel 점유율 | ~71% | ~22% |
| Stage art bible 노출 | top ~25%만 | ~78% (모든 영역에서 art가 비치거나 노출) |
| Top-bar cream gradient | stage 상단 25% 가림 | desktop 폐기 (rail brand cluster로 흡수) |
| Dock cluster visibility | invisible (color identical to stage) | visible (cream darker, cards differentiated) |
| Rail button visual weight | 거대 button (~150px height) | ambient nav (40px height) |
| Brand cluster 위치 | 외로운 top-bar 좌상단 | rail 상단 통합 |
| starter-panel "다음 행동" cream 띠 | stage 하단 강제 스크롤 cream | desktop hide, dock 흡수 |

## Director self-restriction (spec § Decisions §4 enforcement)

본 PR이 머지되어도 Director(main thread)는 "Cycle A 완료" 자체 선언 금지. heartbeat에 `userApproved: false` 명시 유지. 사용자가 본 evidence package를 검토하고 명시 OK 한 후에만 Cycle close.

## 사용자에게 묻는 것

1. art-share-gate 9/9 PASS는 충분한 자동 약속 검증인가? 또는 추가 측정 필요한가?
2. honest known issues 3종(plot card cream / dock card contrast / onboarding 진입점)은 Cycle B에서 해소 예정인데 Cycle A로 ship해도 되는가? 또는 polish PR 먼저?
3. mobile invariant snapshot은 사용자 실제 모바일 체크 필요한가, playwright capture로 충분한가?

본 PR은 `userApproved: true` 상태 전환 명시 OK 시 Cycle A close 보고 수행.
