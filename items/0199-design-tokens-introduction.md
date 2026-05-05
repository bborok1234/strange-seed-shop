# WorkUnit — Design tokens introduction (Cycle 1 PR0.5)

## GitHub authority

- Spec: `reports/deliberation/desktop-ui-redesign/spec.md` § Design Tokens
- Branch: `cycle1/0199-design-tokens-introduction`
- Status: 시각 noop, 토큰 정의만

## Plan

`desktop-ui-redesign` Cycle 1 PR0.5. spec § Design Tokens 결정에 따라 desktop region 전용 신규 토큰을 `:root`에 정의. **사용처 0** — 후속 PR(PR1 RailNav placeholder, PR2 SideDock, PR3 dock 가변 확장)이 사용. 이번 PR은 정의만.

## 도입 토큰 (총 23종)

- spacing 3종: `--spacing-2xl/3xl/4xl` (32/48/64px)
- radius 2종: `--radius-hero` (24px), `--radius-panel-desktop` (16px)
- color 3종: `--color-surface-dock`, `--color-surface-rail`, `--color-accent-sun`
- elevation 2종: `--elevation-dock-raised`, `--elevation-dramatic`
- motion duration 5종: `--motion-duration-snap/swift/gentle/chapter/celebrate` (120/220/420/720/880ms)
- motion easing 3종: `--motion-easing-standard/entrance/emphasized`
- motion gesture 5종: `--motion-gesture-tap/reveal/chapter/celebrate/ambient` (duration × easing 결합 vocabulary)

## 수용 기준

- [x] 신규 토큰 23종 모두 `:root` 정의
- [x] 기존 `--space-*`, `--radius-panel`(8px) 등 mobile 토큰 변경 0
- [x] 사용처 추가 0 (시각 noop)
- [x] `npm run build` 통과
- [x] PR 변경 ≤ 50줄

## 검증 명령

- `npm run build`
- `npm run check:ci`

## 리스크

- 신규 토큰 이름이 `--motion-gesture-*` 같은 결합 vocabulary는 CSS custom property로 transition shortcut을 expand하는 패턴 — 후속 PR에서 `transition: opacity var(--motion-gesture-reveal);` 같은 형태로 사용. linter가 unrecognized syntax 경고하지 않는지 PR1 작업 시 검증.

## Subagent/Team Routing

- 단독 PR. 다음 PR1 (desktop scaffolding + RailNav placeholder).
