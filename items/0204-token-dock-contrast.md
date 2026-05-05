# WorkUnit — Token 수정 + dock contrast 회복 (Cycle A PR1)

## GitHub authority

- Spec: `reports/deliberation/stage-art-first-restructure/spec.md` § Implementation Sequence Cycle A PR1 + § Decisions §1·§2·§5
- Branch: `cycle-a/0204-token-dock-contrast`
- Status: 토큰만 변경 (시각 변화는 dock card visibility 회복 한정)

## Plan

`stage-art-first-restructure` Cycle A PR1 — Cycle 1 §4 위반(dock 배경 stage와 동일색)을 토큰 수정으로 직접 해결 + 후속 PR2~PR4가 사용할 alpha-aware decal 토큰 신규 도입.

1. `--color-surface-dock`: `#fffbe9` → `#f6ebcf` (warm cream darker, stage cream과 luminance contrast ≥ 3:1)
2. 신규 `--color-surface-decal-warm`: `rgba(255, 251, 233, 0.62)` — alpha-aware floating panel (PR2에서 garden-panel cream rectangle 폐기 시 사용)
3. 신규 `--color-surface-decal-veil`: `rgba(31, 59, 43, 0.38)` — text 가독성 위해 art 톤 다운
4. 신규 `--motion-gesture-settle`: swift × emphasized — overlay settle motion (PR2/PR4)

## 수용 기준

- [x] art-share-gate `dock background contrast` 테스트 3 viewport 모두 PASS (PR0 advisory에서 검증됨)
- [x] art-share-gate `stage cream panel ratio` 테스트는 여전히 FAIL (PR2 대기, 정상)
- [x] 기존 `--space-*`, `--radius-panel` 등 mobile 토큰 변경 0
- [x] `npm run build` 통과
- [x] `--color-surface-dock` 사용처 1곳 (.side-dock) — 자동 새 색상 적용
- [x] PR 변경 ≤ 50줄

## 검증 명령

- `npm run build`
- `npm run check:art-share` (로컬, chromium 설치 후) — dock contrast 3 PASS / 나머지 FAIL 정상

## 리스크

- darker dock 배경(`#f6ebcf`)이 art bible warm pastel 톤과 약간 더 vibrant. PR5 사용자 검증에서 art bible align 평가 필요.
- 신규 decal 토큰 사용처는 본 PR에서 0 — PR2가 활용. 이번 PR은 정의만.

## Subagent/Team Routing

- 단독 PR. 다음 PR2 (.garden-panel cream-rectangle 폐기 + alpha-aware overlay 전환).
