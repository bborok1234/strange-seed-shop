# WorkUnit — Desktop scaffolding + RailNav placeholder (Cycle 1 PR1)

## GitHub authority

- Spec: `reports/deliberation/desktop-ui-redesign/spec.md` § Implementation Sequence Phase 1 PR1
- Branch: `cycle1/0200-desktop-railnav-placeholder`
- Status: 첫 visible desktop layout 변화 (rail 도입, garden은 stage 자체로 격상)

## Plan

`desktop-ui-redesign` Cycle 1 PR1 — 데스크톱 viewport (≥1280px)에서 bottom-tabs를 vertical rail로 전환. Garden 탭을 nav 항목에서 제거 (Garden = stage 자체).

1. JSX: `useDesktopLayout()` matchMedia hook 추가, 1280px breakpoint 구독.
2. JSX: 데스크톱일 때 `MAIN_TABS` 필터로 garden 제외 (4탭만 노출), nav className에 `is-desktop-rail` 추가.
3. CSS: `@media (min-width: 1280px)` 블록 추가 — desktop-shell이 12-col 대신 단순 2-col 그리드 (rail / stage)로 시작 (PR2에서 dock 추가).
4. CSS: `.bottom-tabs.is-desktop-rail` desktop variant — vertical, grid-area: rail, padding `--spacing-2xl`, button 가로 배치 (icon + label row).
5. CSS: rail 활성 탭에 `--color-accent-sun` glow.

모바일 ≤ 480px / tablet 481-1024px 변경 0 (`is-desktop-rail` className 미부여).

## 수용 기준

- [x] `useDesktopLayout()` hook이 matchMedia 1280px 정상 구독·해제
- [x] 데스크톱 ≥1280px viewport에서 garden 탭이 rail에 안 보임
- [x] 모바일 ≤ 480px snapshot 회귀 0 (bottom-tabs horizontal 5-up 그대로)
- [x] PR0.5 신규 토큰 (`--spacing-2xl`, `--color-surface-rail`, `--color-accent-sun`) 사용처 ≥ 1
- [x] `npm run build` 통과
- [x] PR 변경 ≤ 500줄

## 검증 명령

- `npm run build`
- `npm run check:ci`

## 리스크

- desktop에서 garden 탭이 rail에서 빠지면서 모바일↔desktop viewport resize 시 활성 탭 mental model 충돌 가능 (이 케이스는 spec § Open Q9 mobile-desktop continuity에 follow-up axis로 명시).
- `dev-panel`은 PR1에서 absolute 그대로 유지 — desktop grid 안에서 stage cell 우상단 floating으로 노출. PR2에서 dock 도입 후 정리.

## Subagent/Team Routing

- 단독 PR. 다음 PR2 (SideDock 4 cluster).
